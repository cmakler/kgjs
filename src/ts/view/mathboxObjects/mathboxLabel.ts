/// <reference path="../../kg.ts" />

'use strict';

module KG {
    export interface MathboxLabelDefinition extends MathboxPointDefinition {
        text: string;
    }

    export class MathboxLabel extends MathboxPoint {

        public text: string;
        public labelData: any;

        constructor(def: MathboxLabelDefinition) {
            setDefaults(def, {
                text: "foo"
            });
            setProperties(def, 'updatables', ['text']);
            super(def);
        }

        draw() {
            let l = this;
            l.pointData = l.mathbox.mathboxView.array({
                width: 1,
                channels: 3
            });

            l.labelData = l.mathbox.mathboxView.format({
                font: "KaTeX_Main",
                style: "normal"
            });
            l.mo = l.mathbox.mathboxView.label({
                points: l.pointData,
                zIndex: 4,
                text: l.labelData
            });
            return l;
        }

        redraw() {
            let l = super.redraw();
            l.labelData.set("data", [l.text]);
            return l;
        }

    }

}

