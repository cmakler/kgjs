/// <reference path="../eg.ts" />

module KGAuthor {

    export interface EntryDeterrenceDefinition extends TreeDefinition {

    }

    export class EntryDeterrence extends Tree {

        constructor(def) {

            super(def);
        }

    }

    // Note: you also need params chance, strategy1A, strategy1B, and strategy2 in order to select the edges of the tree diagram

    export interface BayesNashNormalFormDefinition {
        gameA: KG.GameMatrixDefinition
        gameB: KG.GameMatrixDefinition
        probA: string;
        probAlabel: string;
        probBlabel: string;
        game: KG.GameMatrixDefinition
        tree: TreeDefinition
    }

    export class BayesNashNormalForm extends GameTreePlusMatrix {

        constructor(def: BayesNashNormalFormDefinition) {

            let player1 = {
                name: def.gameA.player1.name,
                strategies: [
                    `${def.gameA.player1.strategies[0]}^A${def.gameB.player1.strategies[0]}^B`,
                    `${def.gameA.player1.strategies[1]}^A${def.gameB.player1.strategies[0]}^B`,
                    `${def.gameA.player1.strategies[0]}^A${def.gameB.player1.strategies[1]}^B`,
                    `${def.gameA.player1.strategies[1]}^A${def.gameB.player1.strategies[1]}^B`
                ]
            };
            let player2 = {
                name: def.gameA.player2.name,
                strategies: def.gameA.player2.strategies
            }

            // Maxes it easier to find the weighted average of strategies
            const topLeftA = def.gameA.payoffs[0][0];
            const topLeftB = def.gameB.payoffs[0][0];
            const topRightA = def.gameA.payoffs[0][1];
            const topRightB = def.gameB.payoffs[0][1];
            const bottomLeftA = def.gameA.payoffs[1][0];
            const bottomLeftB = def.gameB.payoffs[1][0];
            const bottomRightA = def.gameA.payoffs[1][1];
            const bottomRightB = def.gameB.payoffs[1][1];

            // For simplicity, assume player 1 is the informed player and their strategies are [U,D]
            // If player 1 plays U in both games
            const UUpayoffs = [
                        [ averageDefs(topLeftA[0],topLeftB[0],def.probA), averageDefs(topLeftA[1],topLeftB[1],def.probA) ],
                        [ averageDefs(topRightA[0],topRightB[0],def.probA), averageDefs(topRightA[1],topRightB[1],def.probA) ]
            ]

            // If player 1 plays U in game A and D in game B
            const UDpayoffs = [
                        [ averageDefs(topLeftA[0],bottomLeftB[0],def.probA), averageDefs(topLeftA[1],bottomLeftB[1],def.probA) ],
                        [ averageDefs(topRightA[0],bottomRightB[0],def.probA), averageDefs(topRightA[0],bottomRightB[1],def.probA) ]
            ]
            // If player 1 plays D in game A and U in game B
            const DUpayoffs = [
                        [ averageDefs(bottomLeftA[0],topLeftB[0],def.probA), averageDefs(bottomLeftA[1],topLeftB[1],def.probA) ],
                        [ averageDefs(bottomRightA[0],topRightB[0],def.probA), averageDefs(bottomRightA[1],topRightB[1],def.probA) ]
            ]

            // If player 1 plays D in both games
            const DDpayoffs = [
                        [ averageDefs(bottomLeftA[0],bottomLeftB[0],def.probA), averageDefs(bottomLeftA[1],bottomLeftB[1],def.probA) ],
                        [ averageDefs(bottomRightA[0],bottomRightB[0],def.probA), averageDefs(bottomRightA[0],bottomRightB[1],def.probA) ]
            ]


            def.game = {
                player1: player1,
                player2: player2,
                payoffs: [UUpayoffs, UDpayoffs, DUpayoffs, DDpayoffs]
            };

            def.tree = {
                edges: [
                    {
                        node1: "AU",
                        node2: "BD",
                        color: "red",
                        lineStyle: "dotted"
                    }
                ],
                nodes: [
                    {
                        coordinates: [0,12],
                        stroke: "green",
                        fill: "white",
                        childSelectParam: "chance",
                        children: [
                            {
                                coordinates: [6,18],
                                edgeLabel: `A\\text{ (prob. }${def.probAlabel})`,
                                childSelectParam: "strategy1A",
                                children: [

                                ]
                            }
                        ]
                    }
                ]
            }


            super(def);
        }
    }
}