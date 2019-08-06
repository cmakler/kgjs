/// <reference path="../../kg.ts" />


module KG {

    export interface GameMatrixDefinition extends DivObjectDefinition {
        players?: string[];
        strategies: string[][];
        payoffs: any[][][];
    }

    export class GameMatrix extends DivObject {

        private players;
        private strategies;
        private payoffs;
        private payoffNodes: any[][][];

        constructor(def: GameMatrixDefinition) {
            KG.setDefaults(def, {
                players: ["Player 1","Player 2"]
            });
            setProperties(def,'constants',['players','strategies']);
            setProperties(def,'updatables',['payoffs']);
            super(def);
        }

        // create div for text
        draw(layer) {
            let gameMatrix = this;

            const numStrategies1 = gameMatrix.strategies[0].length,
                numStrategies2 = gameMatrix.strategies[1].length;

            gameMatrix.rootElement = layer.append('div');

            let table = gameMatrix.rootElement.append('table').attr('class','gameMatrix');

            let topRow = table.append('tr');

            topRow.append('td').attr('colspan','2').attr('class', 'empty');
            topRow.append('td')
                .attr('colspan',numStrategies2*2)
                .attr('class', 'player2 strategy empty')
                .text(gameMatrix.players[1]);

            let secondRow = table.append('tr');

            secondRow.append('td').attr('colspan','2').attr('class', 'empty');
            gameMatrix.strategies[1].forEach(function (s) {
                secondRow.append('td').attr('colspan','2').attr('class', 'player2 strategy').text(s);
            });

            gameMatrix.payoffNodes = [];

            for(let i = 0; i < numStrategies1; i++) {
                let row = table.append('tr');
                let payoffRow = [];
                if(i == 0) {
                    row.append('td')
                        .attr('rowSpan', numStrategies1)
                        .attr('class','player1 strategy empty')
                        .text(gameMatrix.players[0])
                }
                row.append('td').text(gameMatrix.strategies[0][i]).attr('class','player1 strategy');
                for(let j = 0; j < numStrategies2; j++) {
                    let payoff1 = row.append('td').attr('class', 'player1 payoff');
                    let payoff2 = row.append('td').attr('class', 'player2 payoff');
                    payoffRow.push([payoff1,payoff2]);
                }
                gameMatrix.payoffNodes.push(payoffRow);
            }

            return gameMatrix;

        }

         redraw() {
            let gameMatrix = this;

            const strategies1 = gameMatrix.strategies[0],
                strategies2 = gameMatrix.strategies[1];

            let numStrategies1 = strategies1.length,
                numStrategies2 = strategies2.length;
            for(let i = 0; i < numStrategies1; i++) {
                for(let j = 0; j < numStrategies2; j++) {
                    let cell = gameMatrix.payoffNodes[i][j]
                    katex.render(gameMatrix.payoffs[i][j][0].toString(),cell[0].node());
                    katex.render(gameMatrix.payoffs[i][j][1].toString(),cell[1].node());
                }
            }
            return gameMatrix;
        }
    }

}