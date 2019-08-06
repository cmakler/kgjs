/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface PointDefinition extends GraphObjectDefinition {
        label?: LabelDefinition;
        draggable?: boolean;
        x?: any;
        y?: any;
        coordinates?: any[];
        droplines?: { horizontal?: string; vertical?: string; top?: string; right?: string; };
        r?: any;
    }

    export class Point extends GraphObject {

        public x;
        public y;

        constructor(def: PointDefinition, graph) {

            KG.setDefaults(def,{
                color: 'colors.blue'
            });

            def = setFillColor(def);

            super(def, graph);

            const p = this;
            p.type = 'Point';
            p.layer = 3;
            p.extractCoordinates();

            if (def.hasOwnProperty('draggable') && def.draggable == true && !def.hasOwnProperty('drag')) {
                def.drag = [
                    {
                        'directions': 'x',
                        'param': paramName(def.x),
                        'expression': addDefs(def.x, 'drag.dx')
                    },
                    {
                        'directions': 'y',
                        'param': paramName(def.y),
                        'expression': addDefs(def.y, 'drag.dy')
                    }
                ]
            }

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

                    // only drag vertical droplines horizontally
                    if(verticalDroplineDef.hasOwnProperty('drag')) {
                        verticalDroplineDef.drag = verticalDroplineDef.drag.filter(function(value, index, arr) {return (value.directions == 'x')});
                    }

                    if (def.droplines.hasOwnProperty('top')) {
                        verticalDroplineDef.y = graph.yScale.max;
                        let xTopAxisLabelDef = copyJSON(verticalDroplineDef);
                        xTopAxisLabelDef.y = 'OPPAXIS';
                        KG.setDefaults(xTopAxisLabelDef, {
                            text: def.droplines.top,
                            fontSize: 10
                        });
                        p.subObjects.push(new Label(xTopAxisLabelDef, graph));
                    }
                    p.subObjects.push(new VerticalDropline(verticalDroplineDef, graph));
                    let xAxisLabelDef = copyJSON(verticalDroplineDef);
                    xAxisLabelDef.y = 'AXIS';
                    KG.setDefaults(xAxisLabelDef, {
                        text: def.droplines.vertical,
                        fontSize: 10
                    });
                    p.subObjects.push(new Label(xAxisLabelDef, graph));
                }
                if (def.droplines.hasOwnProperty('horizontal')) {
                    let horizontalDroplineDef = copyJSON(def);

                    // only drag horizontal droplines vertically
                    if(horizontalDroplineDef.hasOwnProperty('drag')) {
                        horizontalDroplineDef.drag = horizontalDroplineDef.drag.filter(function(value, index, arr) {return (value.directions == 'y')});
                    }

                    p.subObjects.push(new HorizontalDropline(horizontalDroplineDef, graph));

                    let yAxisLabelDef = copyJSON(horizontalDroplineDef);
                    yAxisLabelDef.x = 'AXIS';
                    KG.setDefaults(yAxisLabelDef, {
                        text: def.droplines.horizontal,
                        fontSize: 10
                    });
                    p.subObjects.push(new Label(yAxisLabelDef, graph));
                }
            }

        }

    }

}