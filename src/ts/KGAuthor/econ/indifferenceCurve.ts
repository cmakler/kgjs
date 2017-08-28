/// <reference path="../../kg.ts" />

module KGAuthor {

    class EconIndifferenceCurve extends GraphObjectGenerator {

        constructor(def, graph) {
            super(def, graph);
            def.map = !!def.map;
            if (def.map) {
                def.strokeWidth = 1;
                def.stroke = 'lightgrey';
            } else {
                def.strokeWidth = 2;
                def.stroke = 'purple';
            }
            this.subObjects = new KGAuthor[def.utilityFunction.type]()
        }
    }
}