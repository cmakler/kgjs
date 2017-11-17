/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class Rectangle extends GraphObject {

        constructor(def, graph) {
            setFillColor(def);
            super(def, graph);

            let rect = this;
            rect.type = 'Rectangle';
            rect.layer = def.layer || 0;
            rect.extractCoordinates('a', 'x1', 'y1');
            rect.extractCoordinates('b', 'x2', 'y2');

            if (def.hasOwnProperty('label')) {
                let labelDef = copyJSON(def);
                delete labelDef.label;
                labelDef = KG.setDefaults(labelDef, def.label);
                labelDef = KG.setDefaults(labelDef, {
                    fontSize: 10,
                    color: def.color,
                    bgcolor: null,
                    x: averageDefs(rect['x1'],rect['x2']),
                    y: averageDefs(rect['y1'],rect['y2'])
                });
                rect.subObjects.push(new Label(labelDef, graph));
            }
        }

    }

}