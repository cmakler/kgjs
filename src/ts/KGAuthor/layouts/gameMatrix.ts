/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class GameMatrixLayout extends SquareLayout {

        constructor(def) {
            super(def);

            const l = this;
            l.subObjects.push(new GameMatrix(def.gameMatrix))

        }

    }

}