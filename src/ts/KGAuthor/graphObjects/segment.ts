/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface SegmentDefinition extends GraphObjectDefinition {
        a?: any[];
        b?: any[];
        startArrow?: boolean;
        endArrow?: boolean;
        label?: LabelDefinition;
    }


    export class Segment extends GraphObject {

        public x1;
        public x2;
        public y1;
        public y2;
        public startArrow;
        public endArrow;

        constructor(def, graph) {
            def = setStrokeColor(def);

            if (def.hasOwnProperty('startArrow')) {
                def.startArrowName = graph.getStartArrowName(def.color)
            }
            if (def.hasOwnProperty('endArrow')) {
                def.endArrowName = graph.getEndArrowName(def.color)
            }

            super(def, graph);
            const s = this;
            s.type = 'Segment';
            s.layer = 1;
            s.extractCoordinates('a', 'x1', 'y1');
            s.extractCoordinates('b', 'x2', 'y2');

            if (def.hasOwnProperty('label')) {
                let labelDef = copyJSON(def);
                delete labelDef.label;
                if (typeof def.label === "string") {
                    def.label = {text: def.label}
                }
                labelDef = KG.setDefaults(def.label || {}, labelDef);
                labelDef = KG.setDefaults(labelDef, {
                    fontSize: 12,
                    color: def.color,
                    location: 0.5
                });
                labelDef.coordinates = [
                    averageDefs(s.x1, s.x2, labelDef.location),
                    averageDefs(s.y1, s.y2, labelDef.location)
                ];
                s.subObjects.push(new Label(labelDef, graph));
            }
        }

    }

    export class CrossGraphSegment extends Segment {

        constructor(def, graph) {
            def.xScale2Name = '';
            super(def, graph);
        }
    }

    export interface EdgeDefinition extends SegmentDefinition {
        node1: string;
        node2: string;
    }

    export class Edge extends Segment {
        constructor(def: EdgeDefinition, tree: Tree) {
            def.a = tree.nodeCoordinates[def.node1];
            def.b = tree.nodeCoordinates[def.node2];
            super(def, tree);
        }
    }

}