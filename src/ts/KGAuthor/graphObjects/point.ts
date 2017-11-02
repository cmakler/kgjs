/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface PointDefinition extends GraphObjectDefinition {
        label?: LabelDefinition;
        x?: any;
        y?: any;
        coordinates?: any[];
        droplines?: { horizontal?: string; vertical?: string };
        r?: any;
    }

    export class Point extends GraphObject {

        public x;
        public y;

        constructor(def: PointDefinition, graph) {

            def = setFillColor(def);

            super(def, graph);

            const p = this;
            p.type = 'Point';
            p.layer = 3;
            p.extractCoordinates();

            if (def.hasOwnProperty('label')) {
                let labelDef = copyJSON(def);
                delete labelDef.label;
                labelDef = KG.setDefaults(labelDef, def.label);
                labelDef = KG.setDefaults(labelDef, {
                    fontSize: 10,
                    position: 'bl',
                    color: def.color,
                    bgcolor: null
                });
                p.subObjects.push(new Label(labelDef, graph));
            }

            if (def.hasOwnProperty('droplines')) {
                if (def.droplines.hasOwnProperty('vertical')) {
                    let verticalDroplineDef = copyJSON(def);
                    p.subObjects.push(new VerticalDropline(verticalDroplineDef, graph));
                    let xAxisLabelDef = copyJSON(def);
                    xAxisLabelDef.y = 'AXIS';
                    KG.setDefaults(xAxisLabelDef, {
                        text: def.droplines.vertical,
                        fontSize: 12
                    });
                    p.subObjects.push(new Label(xAxisLabelDef, graph));
                }
                if (def.droplines.hasOwnProperty('horizontal')) {
                    let horizontalDroplineDef = copyJSON(def);
                    p.subObjects.push(new HorizontalDropline(horizontalDroplineDef, graph));

                    let yAxisLabelDef = copyJSON(def);
                    yAxisLabelDef.x = 'AXIS';
                    KG.setDefaults(yAxisLabelDef, {
                        text: def.droplines.horizontal,
                        fontSize: 12
                    });
                    p.subObjects.push(new Label(yAxisLabelDef, graph));
                }
            }

        }

    }

}