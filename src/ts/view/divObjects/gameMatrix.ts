/// <reference path="../../kg.ts" />


module KG {

    export interface GamePlayer {
        name: string;
        strategies: string[];
        payoffs: string[][];
    }

    export interface GameMatrixDefinition extends DivObjectDefinition {
        player1: GamePlayer;
        player2: GamePlayer;
    }

    export class GameMatrix extends DivObject {

        private player1;
        private player2;

        constructor(def: GameMatrixDefinition) {
            def.player1.name = def.player1.name || 'Player 1';
            def.player2.name = def.player2.name || 'Player 2';
            super(def);
            this.player1 = def.player1;
            this.player2 = def.player2;
        }

        // create div for text
        draw(layer) {
            let gameMatrix = this;

            const player1 = gameMatrix.player1, player2 = gameMatrix.player2,
                numStrategies1 = player1.strategies.length,
                numStrategies2 = player2.strategies.length;

            gameMatrix.rootElement = layer.append('div');

            let table = gameMatrix.rootElement.append('table');

            let topRow = table.append('tr');

            topRow.append('td').class('noborder');
            topRow.append('td')
                .attr('colspan',numStrategies2)
                .class('player2 strategy noborder')
                .text(player2.name);

            let secondRow = table.append('tr');

            secondRow.append('td').class('noborder');
            player2.strategies.forEach(function (s) {
                secondRow.append('td')
                    .class('player 2 strategy')
                    .text(s);
            });

            for(let i = 0; i < numStrategies1; i++) {
                let row = table.append('tr');
                if(i == 0) {
                    row.append('td')
                        .attr('rowSpan', numStrategies1)
                        .class('player1 strategy noborder')
                        .text('player1.name')
                }
                row.append('td').class('player1 strategy').text(player1.strategies[i]);
                for(let j = 0; j < numStrategies2; j++) {
                    row.append('td').class('player1 payoff').text(player1.payoffs[i][j]);
                    row.append('td').class('player2 payoff').text(player2.payoffs[i][j]);
                }
            }

            return gameMatrix;

        }
    }

}