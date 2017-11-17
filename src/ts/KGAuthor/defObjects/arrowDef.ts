/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class ArrowDef extends Marker {
        public color;
        public arrowPath;

        constructor(def,graph) {
            def.name = KG.randomString(10);
            super(def,graph);
            this.color = def.color;
            this.arrowPath = def.arrowPath;
        }
    }

    export class StartArrow extends ArrowDef {

        constructor(def, graph) {
            def.refX = 2;
            def.maskPath = "M10,1 L10,12 L0,7 L0,5 L10,1";
            def.arrowPath = "M11,2 L11,11 L2,6 L11,2";
            super(def, graph);
            this.markerType = 'StartArrow';
        }
    }

    export class EndArrow extends ArrowDef {

        constructor(def, graph) {
            def.refX = 11;
            def.maskPath = "M3,1 L3,12 L12,7 L12,5 L3,1";
            def.arrowPath = "M2,2 L2,11 L10,6 L2,2";
            super(def, graph);
            this.markerType = 'EndArrow';
        }
    }

}