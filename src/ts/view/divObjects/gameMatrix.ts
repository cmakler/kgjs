/// <reference path="../../kg.ts" />


module KG {

    export interface PlayerDefinition {
        name: string;
        strategies: any[];
        showBestResponses?: any[]; // Note, this is player 1's responses to player 2's strategies; so the length should be the number of player 2's strategies.
    }

    export interface GameMatrixDefinition extends DivObjectDefinition {
        player1: Player;
        player2: Player;
        payoffs: any[][][];
        showBestResponses1?: any[];
        showBestResponses2?: any[];
        showAllBestResponses?: any;
    }

    export class Player {

        public name: string;
        public strategies: any[];
        public showBestResponses: any[];

        constructor(def: PlayerDefinition) {
            this.name = def.name;
            this.strategies = def.strategies;
            if(def.hasOwnProperty("showBestResponses")) {
                this.showBestResponses = def.showBestResponses;
            }

        }
    }

    export class GameMatrix extends DivObject {

        private player1;
        private player2;
        private bestResponses1: any[];
        private bestResponses2: any[];
        private payoffs;
        private payoffNodes: any[][][];
        private table;

        constructor(def: GameMatrixDefinition) {
            if(def.hasOwnProperty("showAllBestResponses")) {
                def.showBestResponses1 = Array(def.player1.strategies.length).fill(true);
                def.showBestResponses2 = Array(def.player2.strategies.length).fill(true);
            }
            if(def.player1.hasOwnProperty("showBestResponses")) {
                def.showBestResponses1 = def.player1.showBestResponses;
            }
            if(def.player2.hasOwnProperty("showBestResponses")) {
                def.showBestResponses2 = def.player2.showBestResponses;
            }
            setProperties(def,'constants',['player1','player2']);
            setProperties(def,'updatables',['payoffs','showBestResponses1','showBestResponses2']);
            super(def);
        }

        // create div for text
        draw(layer) {
            let gameMatrix = this;

            const player1 = gameMatrix.player1,
                  player2 = gameMatrix.player2,
                  numStrategies1 = player1.strategies.length,
                  numStrategies2 = player2.strategies.length;

            gameMatrix.rootElement = layer.append('div')

            gameMatrix.table = gameMatrix.rootElement.append('table').attr('class','gameMatrix');

            // The top row is player 2's name

            let topRow = gameMatrix.table.append('tr');
            topRow.append('td').attr('colspan','2').attr('class', 'empty'); // empty cell above player 1's name and strategies
            topRow.append('td') // Create a cell spanning the rest of the matrix.
                .attr('colspan',numStrategies2*2) // Each cell of the matrix is actually 2 cells for the payoffs
                .attr('class', 'player2 strategy empty')
                .text(player2.name);

            // The second row is player 2's strategies
            let secondRow = gameMatrix.table.append('tr');
            secondRow.append('td').attr('colspan','2').attr('class', 'empty'); // empty row above player 1's name and strategies
            player2.strategies.forEach(function (s2) {
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
                let row = gameMatrix.table.append('tr');
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

            console.log(gameMatrix);

            const strategies1 = gameMatrix.player1.strategies,
                  strategies2 = gameMatrix.player2.strategies,
                  numStrategies1 = strategies1.length,
                  numStrategies2 = strategies2.length;

            function isBestResponse(s1:number,s2:number,player:number) {
                let BR = true;
                if(player == 1) {
                    // see if player 1 has any other strategies which yield a higher payoff
                    for(let s1other = 0; s1other<numStrategies1; s1other++) {
                        if (gameMatrix.payoffs[s1other][s2][0] > gameMatrix.payoffs[s1][s2][0]) {
                            BR = false;
                        }
                    }
                }
                if(player == 2) {
                    // see if player 2 has any other strategies which yield a higher payoff
                    for(let s2other = 0; s2other<numStrategies2; s2other++) {
                        if (gameMatrix.payoffs[s1][s2other][1] > gameMatrix.payoffs[s1][s2][1]) {
                            BR = false;
                        }
                    }
                }
                return BR;
            }

            for(let i = 0; i < numStrategies1; i++) {
                for(let j = 0; j < numStrategies2; j++) {
                    let cell = gameMatrix.payoffNodes[i][j],
                        payoff1 = gameMatrix.payoffs[i][j][0].toString(),
                        payoff2 = gameMatrix.payoffs[i][j][1].toString();
                    if(gameMatrix.hasOwnProperty("showBestResponses1")) {
                        if(gameMatrix.showBestResponses1[j]) {
                            if(isBestResponse(i,j,1)){
                                payoff1 = "\\boxed{" + payoff1 + "}";
                            }
                        }
                    }
                    if(gameMatrix.hasOwnProperty("showBestResponses2")) {
                        if (gameMatrix.showBestResponses2[i]) {
                            if (isBestResponse(i, j, 2)) {
                                payoff2 = "\\boxed{" + payoff2 + "}";
                            }
                        }
                    }
                    katex.render(payoff1,cell[0].node());
                    katex.render(payoff2,cell[1].node());
                }
            }

            // Calculate relative width of game matrix
             const gameMatrixWidth = gameMatrix.table.node().clientWidth,
                 divWidth = gameMatrix.rootElement.node().clientWidth,
                 widthPercent = Math.min(100,Math.round(10*gameMatrixWidth/divWidth)*10);

            gameMatrix.rootElement.style('width',widthPercent+'%');
            return gameMatrix;
        }
    }

}