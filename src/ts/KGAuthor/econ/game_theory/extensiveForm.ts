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
        player1: { name: string, showBestResponses?: any[] };
        player2: { name: string, showBestResponses?: any[] };
        root: GameTreeNodeDefinition;
        strategySeparator?: string;
        showBestResponses1?: any[];     // passed through to the generated GameMatrix
        showBestResponses2?: any[];
        showAllBestResponses?: any;
        playerLabel?: 'number' | 'initial' | 'name';    // how the tree labels players; default 'number'
        showGrid?: boolean;             // passed through to the generated Tree
        objects?: any[];                // additional graph objects drawn on the tree
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

    // Payoffs [u1, u2] when player 1 plays s1 and player 2 plays s2.
    // Chance nodes give expected payoffs; values stay numbers where possible, otherwise expressions.
    export function strategyProfilePayoffs(root: GameTreeNodeDefinition, s1: PureStrategy, s2: PureStrategy): any[] {

        function evaluate(node: GameTreeNodeDefinition): any[] {
            if (!node.hasOwnProperty('children') || node.children.length == 0) {
                return node.payoffs;
            }
            if (node.player == 'chance') {
                let expected: any[] = [0, 0];
                node.children.forEach(function (child) {
                    const childPayoffs = evaluate(child);
                    expected = expected.map(function (u, i) {
                        return addDefs(u, multiplyDefs(child.prob, childPayoffs[i]));
                    });
                });
                return expected;
            }
            const strategy = (node.player == 1) ? s1 : s2;
            const action = strategy.actions[node.childSelectParam];
            return evaluate(node.children.filter(function (child) {
                return child.action == action;
            })[0]);
        }

        return evaluate(root);
    }

    // Convert an extensive-form game into the normal-form definition used by KG.GameMatrix.
    export function normalFormFromTree(def: ExtensiveFormDefinition): KG.GameMatrixDefinition {

        const strategies = enumerateStrategies(def);

        const payoffs = strategies[1].map(function (s1) {
            return strategies[2].map(function (s2) {
                return strategyProfilePayoffs(def.root, s1, s2);
            });
        });

        function playerDef(player, playerStrategies: PureStrategy[]) {
            let pd = JSON.parse(JSON.stringify(player));
            pd.strategies = playerStrategies.map(function (s) {
                return s.name;
            });
            return pd;
        }

        let game: KG.GameMatrixDefinition = {
            player1: playerDef(def.player1, strategies[1]),
            player2: playerDef(def.player2, strategies[2]),
            payoffs: payoffs
        };
        ['showBestResponses1', 'showBestResponses2', 'showAllBestResponses'].forEach(function (key) {
            if (def.hasOwnProperty(key)) {
                game[key] = def[key];
            }
        });

        return game;
    }

    // Renders the normal form of def.gameTree as a game matrix.
    export class GameMatrixFromTree extends Layout {

        constructor(def) {
            super(def);

            const l = this;

            l.nosvg = true;

            l.subObjects.push(new GameMatrix(normalFormFromTree(def.gameTree)));

        }

    }

    // Wrap a payoff or probability as a label expression, rounded so values like 0.7000000000000001 display cleanly
    function labelValue(value) {
        return (typeof value == 'number') ? value : "${+(" + value + ").toPrecision(10)}";
    }

    // Convert an extensive-form game into a Tree definition drawn left to right:
    // the root is at the left, each move goes one column to the right, and terminal nodes are spaced evenly top to bottom.
    // Any node may override its position with coordinates, or its styling with any Node/Point attribute.
    export function treeFromExtensiveForm(def: ExtensiveFormDefinition): TreeDefinition {

        const infoSets = collectInfoSets(def);

        const xMin = 1.5, xMax = 18, yMin = 1.5, yMax = 22.5;

        function depth(node: GameTreeNodeDefinition): number {
            if (!node.hasOwnProperty('children') || node.children.length == 0) {
                return 0;
            }
            return 1 + Math.max.apply(null, node.children.map(depth));
        }

        function countLeaves(node: GameTreeNodeDefinition): number {
            if (!node.hasOwnProperty('children') || node.children.length == 0) {
                return 1;
            }
            return node.children.reduce(function (total, child) {
                return total + countLeaves(child);
            }, 0);
        }

        const maxDepth = Math.max(depth(def.root), 1),
            numLeaves = countLeaves(def.root),
            xStep = (xMax - xMin) / maxDepth,
            yStep = (numLeaves > 1) ? (yMax - yMin) / (numLeaves - 1) : 0;

        let leafIndex = 0;

        const gameKeys = ['player', 'action', 'prob', 'payoffs', 'children', 'coordinates'];

        function playerColor(player) {
            return (player == 'chance') ? 'nature' : `player${player}`;
        }

        // Shorten labels to their first letters, unless that would make two of them the same
        function abbreviate(labels: string[]): string[] {
            const initials = labels.map(function (label) {
                return String(label).charAt(0);
            });
            const distinct = initials.every(function (initial, i) {
                return initials.indexOf(initial) == i;
            });
            return distinct ? initials : labels;
        }

        // label players by number (1, 2), initial, or full name (as plain text rather than LaTeX)
        const playerLabelStyle = String(def.playerLabel || 'number').toLowerCase(),
            playerNames = [def.player1.name, def.player2.name],
            playerLabels = (playerLabelStyle == 'name') ? playerNames
                : (playerLabelStyle == 'initial') ? abbreviate(playerNames)
                    : ['1', '2'];

        function playerLabel(player, position: string) {
            let label: any = {text: playerLabels[player - 1], position: position};
            if (playerLabelStyle == 'name') {
                label.plainText = true;
            }
            return label;
        }

        // nodes in an information set with more than one node are labeled on the info set, not individually
        let sharedInfoSetNodes = {};
        [1, 2].forEach(function (player) {
            infoSets[player].forEach(function (infoSet: InfoSet) {
                if (infoSet.nodes.length > 1) {
                    infoSet.nodes.forEach(function (name) {
                        sharedInfoSetNodes[name] = true;
                    });
                }
            });
        });

        function nodeDef(node: GameTreeNodeDefinition, level: number, isRoot: boolean): NodeDefinition {

            let nd: any = {};
            Object.keys(node).forEach(function (key) {
                if (gameKeys.indexOf(key) < 0) {
                    nd[key] = node[key];
                }
            });

            let y: number;

            if (!node.hasOwnProperty('children') || node.children.length == 0) {
                y = (numLeaves > 1) ? yMax - yStep * leafIndex : 12;
                leafIndex++;
                KG.setDefaults(nd, {
                    color: 'terminal'
                });
                nd.payoffs = {
                    player1: labelValue(node.payoffs[0]),
                    player2: labelValue(node.payoffs[1]),
                    position: 'l'   // label to the right of the node
                };
            } else {
                const actionLabels = abbreviate(node.children.map(function (child) {
                    return child.action;
                }));
                nd.children = node.children.map(function (child, i) {
                    let cd = nodeDef(child, level + 1, false);
                    if (!cd.hasOwnProperty('edgeLabel')) {
                        cd.edgeLabel = (node.player == 'chance') ? "`" + actionLabels[i] + "\\\\ (" + labelValue(child.prob) + ")`" : actionLabels[i];
                    }
                    return cd;
                });
                y = nd.children.reduce(function (total, cd) {
                    return total + cd.coordinates[1];
                }, 0) / nd.children.length;
                KG.setDefaults(nd, {
                    color: playerColor(node.player)
                });
                if (node.player != 'chance' && !sharedInfoSetNodes[node.name]) {
                    KG.setDefaults(nd, {
                        // player name to the left of the root, above other nodes
                        label: playerLabel(node.player, isRoot ? 'r' : 'b')
                    });
                }
            }

            nd.coordinates = node.coordinates || [xMin + xStep * level, y];

            return nd;
        }

        // connect the nodes of each information set with dashed lines, labeling the first with the player
        let edges: EdgeDefinition[] = [];
        [1, 2].forEach(function (player) {
            infoSets[player].forEach(function (infoSet: InfoSet) {
                for (let i = 1; i < infoSet.nodes.length; i++) {
                    let edgeDef: EdgeDefinition = {
                        node1: infoSet.nodes[i - 1],
                        node2: infoSet.nodes[i],
                        color: playerColor(player),
                        lineStyle: 'dashed'
                    };
                    if (i == 1) {
                        edgeDef.label = playerLabel(player, 'r');   // label to the left of the line
                    }
                    edges.push(edgeDef);
                }
            });
        });

        return {
            nodes: [nodeDef(def.root, 0, true)],
            edges: edges,
            showGrid: def.showGrid,
            objects: def.objects
        };
    }

    // Declare a param for each childSelectParam the author hasn't declared, starting with no child selected.
    function declareSelectParams(def: ExtensiveFormDefinition, parsedData) {

        let declared = {};
        parsedData.params.forEach(function (p) {
            declared[p.name] = true;
        });

        function visit(node: GameTreeNodeDefinition) {
            if (!node.hasOwnProperty('children') || node.children.length == 0) {
                return;
            }
            if (node.hasOwnProperty('childSelectParam')) {
                const name = paramName(node.childSelectParam);
                if (!declared[name]) {
                    parsedData.params.push({name: name, value: 0, min: 0, max: node.children.length, round: 1});
                    declared[name] = true;
                }
            }
            node.children.forEach(visit);
        }

        visit(def.root);
        return parsedData;
    }

    // An extensive-form game drawn as a tree in a wide rectangle.
    export class ExtensiveFormGame extends WideRectangleLayout {

        constructor(def) {
            super(def);

            const l = this;
            let treeDef = treeFromExtensiveForm(def.gameTree);

            treeDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.74,
                "height": 0.9
            };

            l.subObjects.push(new Tree(treeDef));
        }

        parseSelf(parsedData) {
            parsedData = super.parseSelf(parsedData);
            return declareSelectParams(this.def.gameTree, parsedData);
        }
    }

    export class ExtensiveFormGamePlusSidebar extends WideRectangleLayout {

        constructor(def) {
            super(def);

            const l = this;
            let treeDef = treeFromExtensiveForm(def.gameTree),
                sidebarDef = def['sidebar'];

            treeDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.738,
                "height": 0.9
            };

            l.subObjects.push(new Tree(treeDef));
            l.subObjects.push(new Sidebar(sidebarDef));
        }

        parseSelf(parsedData) {
            parsedData = super.parseSelf(parsedData);
            return declareSelectParams(this.def.gameTree, parsedData);
        }
    }

    // The game tree on top and its normal form below, positioned like TwoVerticalGraphs.
    export class ExtensiveAndNormalForms extends SquareLayout {

        constructor(def) {
            super(def);

            const l = this;
            let treeDef = treeFromExtensiveForm(def.gameTree);

            treeDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.8,
                "height": 0.4
            };

            let gameDivDef = {
                position: {
                    "x": 0.15,
                    "y": 0.525,
                    "width": 0.8,
                    "height": 0.4
                },
                children: [
                    {
                        type: "GameMatrix",
                        def: normalFormFromTree(def.gameTree)
                    }
                ]
            };

            l.subObjects.push(new Tree(treeDef));
            l.subObjects.push(new DivContainer(gameDivDef));
        }

        parseSelf(parsedData) {
            parsedData = super.parseSelf(parsedData);
            return declareSelectParams(this.def.gameTree, parsedData);
        }
    }

    export class ExtensiveAndNormalFormsPlusSidebar extends SquareLayout {

        constructor(def) {
            super(def);

            const l = this;
            let treeDef = treeFromExtensiveForm(def.gameTree),
                sidebarDef = def['sidebar'];

            treeDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.738,
                "height": 0.4
            };

            let gameDivDef = {
                position: {
                    "x": 0.15,
                    "y": 0.525,
                    "width": 0.738,
                    "height": 0.4
                },
                children: [
                    {
                        type: "GameMatrix",
                        def: normalFormFromTree(def.gameTree)
                    }
                ]
            };

            l.subObjects.push(new Tree(treeDef));
            l.subObjects.push(new DivContainer(gameDivDef));
            l.subObjects.push(new Sidebar(sidebarDef));
        }

        parseSelf(parsedData) {
            parsedData = super.parseSelf(parsedData);
            return declareSelectParams(this.def.gameTree, parsedData);
        }
    }

}
