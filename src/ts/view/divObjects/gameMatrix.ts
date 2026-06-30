/// <reference path="../../kg.ts" />


module KG {

    export interface PlayerDefinition {
        name: string;
        strategies: any[];
    }

    export interface GameMatrixDefinition extends DivObjectDefinition {
        player1: Player;
        player2: Player;
        payoffs: any[][][];
    }

    export class Player {

        public name: string;
        public strategies: any[];

        constructor(def: PlayerDefinition) {
            this.name = def.name;
            this.strategies = def.strategies;
        }
    }

    export class GameMatrix extends DivObject {

        private player1;
        private player2;
        private payoffs;
        private payoffNodes: any[][][];

        constructor(def: GameMatrixDefinition) {
            setProperties(def,'constants',['player1','player2']);
            setProperties(def,'updatables',['payoffs']);
            super(def);
        }

        // create div for text
        draw(layer) {
            let gameMatrix = this;

            const player1 = gameMatrix.player1,
                  player2 = gameMatrix.player2,
                  numStrategies1 = player1.strategies.length,
                  numStrategies2 = player2.strategies.length;

            console.log("Player 1 strategies: ", player1.strategies);
            console.log("Player 2 strategies: ", player2.strategies);

            gameMatrix.rootElement = layer.append('div');

            let table = gameMatrix.rootElement.append('table').attr('class','gameMatrix');

            // The top row is player 2's name

            let topRow = table.append('tr');
            topRow.append('td').attr('colspan','2').attr('class', 'empty'); // empty cell above player 1's name and strategies
            topRow.append('td') // Create a cell spanning the rest of the matrix.
                .attr('colspan',numStrategies2*2) // Each cell of the matrix is actually 2 cells for the payoffs
                .attr('class', 'player2 strategy empty')
                .text(player2.name);

            // The second row is player 2's strategies
            let secondRow = table.append('tr');
            secondRow.append('td').attr('colspan','2').attr('class', 'empty'); // empty row above player 1's name and strategies
            player2.strategies.forEach(function (s2) {
                console.log('Player 2 strategy: ', s2);
                let player2Strategy = secondRow.append('td').attr('colspan','2').attr('class', 'player2 strategy');
                try {
                        katex.render(s2.toString(), player2Strategy.node());
                    }
                    catch(e) {
                        console.log("Error rendering KaTeX: ",s2.toString());
                    }
            });

            gameMatrix.payoffNodes = [];

            player1.strategies.forEach(function (s1, i) {
                console.log("Player 1 strategy: ", s1);
                let row = table.append('tr');
                let payoffRow = [];
                if(i == 0) {
                    row.append('td')
                        .attr('rowSpan', numStrategies1)
                        .attr('class','player1 strategy empty')
                        .text(gameMatrix.player1.name)
                }
                let player1Strategy = row.append('td').attr('class','player1 strategy')
                try {
                        katex.render(s1.toString(), player1Strategy.node());
                    }
                    catch(e) {
                        console.log("Error rendering KaTeX: ",s1.toString());
                    }
                for(let j = 0; j < numStrategies2; j++) {
                    let payoff1 = row.append('td').attr('class', 'player1 payoff');
                    let payoff2 = row.append('td').attr('class', 'player2 payoff');
                    payoffRow.push([payoff1,payoff2]);
                }
                gameMatrix.payoffNodes.push(payoffRow);
            })

            for(let i = 0; i < numStrategies1; i++) {

            }

            return gameMatrix;

        }

         redraw() {
            let gameMatrix = this;

            const strategies1 = gameMatrix.player1.strategies,
                  strategies2 = gameMatrix.player2.strategies,
                  numStrategies1 = strategies1.length,
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