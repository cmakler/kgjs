/// <reference path="../eg.ts" />

module KGAuthor {

    // A node in an extensive-form game tree.
    // Player nodes sharing a childSelectParam form a single information set.
    export interface GameTreeNodeDefinition {
        name?: string;
        player?: 1 | 2 | 'chance';      // required on non-terminal nodes
        childSelectParam?: string;      // required on player 1/2 nodes; defines the info set
        action?: string;                // label of the move into this node
        prob?: any;                     // on children of a chance node
        payoffs?: any[];                // [u1, u2] on terminal nodes
        children?: GameTreeNodeDefinition[];
        [key: string]: any;
    }

    export interface ExtensiveFormDefinition {
        player1: { name: string };
        player2: { name: string };
        root: GameTreeNodeDefinition;
        strategySeparator?: string;
    }

    export interface InfoSet {
        param: string;                  // the shared childSelectParam
        player: 1 | 2;
        actions: string[];
        nodes: string[];                // names of the nodes in this info set
    }

    export interface InfoSetsByPlayer {
        1: InfoSet[];
        2: InfoSet[];
    }

    // Traverse the tree depth-first (preorder, children in listed order) and
    // return each player's information sets in the order they are first reached.
    // Assigns a name to any unnamed node, and throws if the tree is malformed.
    export function collectInfoSets(def: ExtensiveFormDefinition): InfoSetsByPlayer {

        const infoSets: InfoSetsByPlayer = {1: [], 2: []};
        const infoSetsByParam: { [param: string]: InfoSet } = {};

        function visit(node: GameTreeNodeDefinition) {
            KG.setDefaults(node, {
                name: KG.randomString(10)
            });

            // terminal node
            if (!node.hasOwnProperty('children') || node.children.length == 0) {
                if (!Array.isArray(node.payoffs) || node.payoffs.length != 2) {
                    throw new Error(`Game tree: terminal node ${node.name} must have payoffs [u1, u2]`);
                }
                return;
            }

            if (!node.hasOwnProperty('player')) {
                throw new Error(`Game tree: node ${node.name} has children but no player`);
            }

            // chance node
            if (node.player == 'chance') {
                node.children.forEach(function (child) {
                    if (!child.hasOwnProperty('prob')) {
                        throw new Error(`Game tree: child ${child.action || child.name} of chance node ${node.name} has no prob`);
                    }
                });
                node.children.forEach(visit);
                return;
            }

            // decision node
            const player = node.player;
            if (player != 1 && player != 2) {
                throw new Error(`Game tree: node ${node.name} has invalid player ${player}; use 1, 2, or chance`);
            }
            if (!node.hasOwnProperty('childSelectParam')) {
                throw new Error(`Game tree: decision node ${node.name} has no childSelectParam`);
            }

            const actions = node.children.map(function (child) {
                if (!child.hasOwnProperty('action')) {
                    throw new Error(`Game tree: child ${child.name} of node ${node.name} has no action`);
                }
                return child.action;
            });
            actions.forEach(function (action, i) {
                if (actions.indexOf(action) != i) {
                    throw new Error(`Game tree: node ${node.name} has duplicate action ${action}`);
                }
            });

            const param = node.childSelectParam;
            if (!infoSetsByParam.hasOwnProperty(param)) {
                const infoSet: InfoSet = {param: param, player: player, actions: actions, nodes: [node.name]};
                infoSetsByParam[param] = infoSet;
                infoSets[player].push(infoSet);
            } else {
                const infoSet = infoSetsByParam[param];
                if (infoSet.player != player) {
                    throw new Error(`Game tree: info set ${param} is shared by player ${infoSet.player} and player ${player}`);
                }
                // the param's value is the index of the selected child, so the action lists must match exactly
                if (infoSet.actions.join('\u0000') != actions.join('\u0000')) {
                    throw new Error(`Game tree: node ${node.name} in info set ${param} has actions [${actions}] but expected [${infoSet.actions}]`);
                }
                infoSet.nodes.push(node.name);
            }

            node.children.forEach(visit);
        }

        visit(def.root);

        return infoSets;
    }

    // A pure strategy: a complete contingent plan choosing one action at each of the player's info sets.
    export interface PureStrategy {
        name: string;
        actions: { [param: string]: string };   // childSelectParam -> chosen action
    }

    export interface StrategiesByPlayer {
        1: PureStrategy[];
        2: PureStrategy[];
    }

    // Enumerate each player's pure strategies as the Cartesian product of the actions at their info sets.
    // The first info set reached varies slowest, so the centipede game gives TT, TP, PT, PP.
    // Strategy names join the chosen actions with def.strategySeparator (default "").
    export function enumerateStrategies(def: ExtensiveFormDefinition, infoSets?: InfoSetsByPlayer): StrategiesByPlayer {

        infoSets = infoSets || collectInfoSets(def);
        const separator = def.hasOwnProperty('strategySeparator') ? def.strategySeparator : '';

        function strategiesFor(playerInfoSets: InfoSet[]): PureStrategy[] {
            let plans: string[][] = [[]];
            playerInfoSets.forEach(function (infoSet) {
                let extended: string[][] = [];
                plans.forEach(function (plan) {
                    infoSet.actions.forEach(function (action) {
                        extended.push(plan.concat([action]));
                    });
                });
                plans = extended;
            });
            return plans.map(function (plan) {
                let actions = {};
                playerInfoSets.forEach(function (infoSet, i) {
                    actions[infoSet.param] = plan[i];
                });
                return {name: plan.join(separator), actions: actions};
            });
        }

        return {1: strategiesFor(infoSets[1]), 2: strategiesFor(infoSets[2])};
    }

}
