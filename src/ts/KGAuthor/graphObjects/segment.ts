/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface SegmentDefinition extends GraphObjectDefinition {
        a?: any[];
        b?: any[];
        trim?: any;
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

            // new way of trimming
            if (def.hasOwnProperty('trim')) {
                console.log('implementing trimming');
                const x1 = s.x1;
                const y1 = s.y1;
                const x2 = s.x2;
                const y2 = s.y2;
                s.def.x1 = averageDefs(x2, x1, def.trim);
                s.def.x2 = averageDefs(x1, x2, def.trim);
                s.def.y1 = averageDefs(y2, y1, def.trim);
                s.def.y2 = averageDefs(y1, y2, def.trim);
            }

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

            if (def.hasOwnProperty('handles')) {

                let aPointDef = {
                    x: s.x1,
                    y: s.y1,
                    color: def.color,
                    r: 4,
                    draggable: def.draggable,
                    show: def.show
                };

                let bPointDef = {
                    x: s.x2,
                    y: s.y2,
                    color: def.color,
                    r: 4,
                    draggable: def.draggable,
                    show: def.show
                };

                s.subObjects.push(new Point(aPointDef, graph));
                s.subObjects.push(new Point(bPointDef, graph));
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