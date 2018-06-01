/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class GameMatrixLayout extends Layout {

        constructor(def) {
            super(def);

            const l = this;

            l.nosvg = true;

            l.subObjects.push(new GameMatrix(def.gameMatrix));

        }

    }

}