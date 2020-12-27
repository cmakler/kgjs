/// <reference path="../../kg.ts" />
module KG {

    export interface MathboxDefinition extends DivObjectDefinition {
        xAxis: MathboxAxisDefinition;
        yAxis: MathboxAxisDefinition;
        zAxis: MathboxAxisDefinition;
        objects: TypeAndDef[];
    }

    // these declarations make it so TypeScript doesn't have a cow
    declare function mathBox({})

    declare class THREE {
        static OrbitControls: any;
        static Color: any;
    }

    export class Mathbox extends PositionedDiv {

        public mathbox;
        public mathboxView;
        public xAxis;
        public yAxis;
        public zAxis;
        private objectDefs;
        public objects;
        public clearColor;

        constructor(def: MathboxDefinition) {
            setDefaults(def, {
                objects: []
            });
            super(def);
            let mb = this;
            mb.objectDefs = def.objects;
            mb.objects = [];
            mb.objectDefs.forEach(function (td) {
                td.def.mathbox = mb;
                td.def.model = mb.model;
                if(td.type.indexOf('Mathbox') < 0) {
                    td.type = 'Mathbox' + td.type;
                }
                try {
                    mb.objects.push(new KG[td.type](td.def));
                }
                catch(e) {
                    console.log("There's no object called ",td.type);
                }

            });
            mb.clearColor = mb.model.clearColor;
            //console.log('created mathbox', mb);
        }

        initMathbox() {
            let mb: Mathbox = this;

            mb.mathbox = mathBox({
                plugins: ['core', 'controls', 'cursor', 'mathbox'],
                controls: {klass: THREE.OrbitControls},
                element: mb.rootElement.node()
            });
            if (mb.mathbox.fallback) throw "WebGL not supported";

            mb.three = mb.mathbox.three;
            mb.three.renderer.setClearColor(new THREE.Color(mb.clearColor), 1.0);
            mb.mathbox.camera({proxy: true, position: [-5,0.5,0.8], eulerOrder: "yzx"});
            mb.mathboxView = mb.mathbox.cartesian({scale: [1.6,1.6,1.6]});
            mb.mathboxView.grid({axes: [1, 3], width: 2, divideX: 10, divideY: 10, opacity: 0.3});
            mb.xAxis.redraw();
            mb.yAxis.redraw();
            mb.zAxis.redraw();
            mb.objects.forEach(function(o) {o.draw().update()});
            return mb;
        }

        // create mb for mathbox
        draw(layer) {
            //console.log('creating mathbox container');
            let mb = this;
            mb.rootElement = layer.append('div').style('position', 'absolute');
            return mb;
        }

        redraw() {
            let mb = super.redraw();
            //console.log('called redraw');
            if (mb.mathbox == undefined && mb.rootElement.node().clientWidth > 10 && mb.zAxis != undefined) {
                mb.initMathbox();
            } else {
                return mb;
            }
            return mb;
        }
    }
}