/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class Layout extends AuthoringObject {

        parseSelf(parsedData) {
            parsedData.aspectRatio = 2;
            return parsedData;
        }

    }

    export class SquareLayout extends Layout {

        // creates a square layout (aspect ratio of 1) within the main body of the text
        // to make a square graph, the ratio of width to height should be 0.82

        parseSelf(parsedData) {
            parsedData.aspectRatio = 1.22;
            return parsedData;
        }
    }


    export class WideRectanglePlusSidebarLayout extends Layout {

        // creates a rectangle, twice as wide as it is high, within the main body of the text
        // to make a square graph, the ratio of width to height should be 0.41

        parseSelf(parsedData) {
            parsedData.aspectRatio = 2.44;
            return parsedData;
        }

    }

}