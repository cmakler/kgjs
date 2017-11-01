/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class Rectangle extends GraphObject {

        constructor(def, graph) {
            super(def, graph);
            this.type = 'Rectangle';
            this.layer = def.layer || 0;
            this.extractCoordinates('a', 'x1', 'y1');
            this.extractCoordinates('b', 'x2', 'y2');
        }

    }

}