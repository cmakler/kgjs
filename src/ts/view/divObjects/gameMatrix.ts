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
            setProperties(def,'constants',['player1','player2']);
            super(def);
        }

        // create div for text
        draw(layer) {
            let gameMatrix = this;

            const player1 = gameMatrix.player1,
                player2 = gameMatrix.player2;

            let numStrategies1 = player1.strategies.length,
                numStrategies2 = player2.strategies.length;

            gameMatrix.rootElement = layer.append('div');

            let table = gameMatrix.rootElement.append('table').attr('class','gameMatrix');

            let topRow = table.append('tr');

            topRow.append('td').attr('colspan','2').attr('class', 'empty');
            topRow.append('td')
                .attr('colspan',numStrategies2*2)
                .attr('class', 'player2 strategy empty')
                .text(player2.name);

            let secondRow = table.append('tr');

            secondRow.append('td').attr('colspan','2').attr('class', 'empty');
            player2.strategies.forEach(function (s) {
                secondRow.append('td').attr('colspan','2').attr('class', 'player2 strategy').text(s);
            });

            for(let i = 0; i < numStrategies1; i++) {
                let row = table.append('tr');
                if(i == 0) {
                    row.append('td')
                        .attr('rowSpan', numStrategies1)
                        .attr('class','player1 strategy empty')
                        .text(player1.name)
                }
                row.append('td').text(player1.strategies[i]).attr('class','player1 strategy');
                for(let j = 0; j < numStrategies2; j++) {
                    let payoff1 = row.append('td').attr('class', 'player1 payoff');
                    katex.render(player1.payoffs[i][j].toString(),payoff1.node());
                    let payoff2 = row.append('td').attr('class', 'player2 payoff');
                    katex.render(player2.payoffs[i][j].toString(),payoff2.node());
                }
            }

            return gameMatrix;

        }

         redraw() {
            let gameMatrix = this;
            return gameMatrix;
        }
    }

}