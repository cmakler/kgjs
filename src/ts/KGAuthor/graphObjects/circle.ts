/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface EllipseDefinition extends GraphObjectDefinition {
        label?: LabelDefinition;
        draggable?: boolean;
        x?: any;
        y?: any;
        coordinates?: any[];
        center?: any[];
        c?: any[];
        rx?: any;
        ry?: any;
    }

    export class Ellipse extends GraphObject {

        public x;
        public y;
        public rx;
        public ry;

        constructor(def: EllipseDefinition, graph) {

            KG.setDefaults(def,{
                color: 'colors.blue',
                opacity: 0.2,
                rx: 1,
                ry: def.rx
            });

            def = setFillColor(def);
            def = setStrokeColor(def);

            super(def, graph);

            const c = this;
            c.type = 'Circle';
            c.layer = def.layer || 0;

            // may define the center using 'coordinates' or 'center' or 'c':
            if(def.hasOwnProperty('c')) {
                c.extractCoordinates('c');
            } else if(def.hasOwnProperty('center')) {
                c.extractCoordinates('center');
            } else {
                c.extractCoordinates();
            }

            def = makeDraggable(def);

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

    export interface CircleDefinition extends EllipseDefinition {
        radius?: any;
        r?: any;
    }

    export class Circle extends Ellipse {

        public x;
        public y;
        public r;

        constructor(def: CircleDefinition, graph) {

            if(def.hasOwnProperty('radius')) {
                def.r = def.radius;
                delete def.radius;
            }

            if(def.hasOwnProperty('r')) {
                def.rx = def.r;
                def.ry = def.r;
            }

            super(def, graph);

        }

    }

}