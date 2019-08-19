/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface CircleDefinition extends GraphObjectDefinition {
        label?: LabelDefinition;
        draggable?: boolean;
        x?: any;
        y?: any;
        coordinates?: any[];
        r?: any;
    }

    export class Circle extends GraphObject {

        public x;
        public y;
        public r;

        constructor(def: PointDefinition, graph) {

            KG.setDefaults(def,{
                color: 'colors.blue',
                opacity: 0.2
            });

            def = setFillColor(def);
            def = setStrokeColor(def);

            super(def, graph);

            const c = this;
            c.type = 'Circle';
            c.layer = def.layer || 0;
            c.extractCoordinates();

            if (def.hasOwnProperty('draggable') && def.draggable == true && !def.hasOwnProperty('drag')) {
                def.drag = [];
                if(def.x == `params.${paramName(def.x)}`) {
                    def.drag.push({horizontal: paramName(def.x)})
                }
                if(def.y == `params.${paramName(def.y)}`) {
                    def.drag.push({vertical: paramName(def.y)})
                }
            }

            if (def.hasOwnProperty('label')) {
                let labelDef = copyJSON(def);
                delete labelDef.label;
                labelDef = KG.setDefaults(labelDef, def.label);
                labelDef = KG.setDefaults(labelDef, {
                    fontSize: 10,
                    color: def.color,
                    bgcolor: null
                });
                c.subObjects.push(new Label(labelDef, graph));
            }

        }

    }

}