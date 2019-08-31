/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class Layout extends AuthoringObject {

        public aspectRatio: number;
        public nosvg: boolean;

        constructor(def) {
            super(def);
            this.aspectRatio = 2;
            this.nosvg = false;

            let l = this;

            if(def.hasOwnProperty('explanation')) {
                l.subObjects.push(new Explanation(def.explanation));
            }
        }

        parseSelf(parsedData) {
            parsedData.aspectRatio = this.aspectRatio;
            parsedData.nosvg = this.nosvg;
            return parsedData;
        }

    }

    export class SquareLayout extends Layout {

        // creates a square layout (aspect ratio of 1) within the main body of the text
        // to make a square graph, the ratio of width to height should be 0.82

        constructor(def) {
            super(def);
            this.aspectRatio = 1.22;
        }
    }


    export class WideRectangleLayout extends Layout {

        // creates a rectangle, twice as wide as it is high, within the main body of the text
        // to make a square graph, the ratio of width to height should be 0.41

        constructor(def) {
            super(def);
            this.aspectRatio = 2.44;
        }

    }

}