/// <reference path="../../kg.ts" />
module KG {

    export interface GeoGebraAppletDefinition extends DivObjectDefinition {
        axes: { min: number; max: number; step: number; label: string; }[];
        objects: GeoGebraObjectDefinition[];
        params: string[];
    }

    declare class GGBApplet {
        constructor(params: any, webSimple: any);

        setHTML5Codebase: (path: string) => void;
        inject: (id: string) => void;
    }

    export class GeoGebraApplet extends ViewObject {

        private applet;
        private objects: GeoGebraObject[];
        private axes: Axis[];

        constructor(def: GeoGebraAppletDefinition) {
            setDefaults(def, {
                params: [],
                objects: [],
                axisLabels: []
            });
            def.params.forEach(function (param) {
                def[param] = 'params.' + param;
            });
            setProperties(def, 'updatables', def.params);
            setProperties(def, 'constants', ['axes', 'params']);
            super(def);
            const div = this;
            div.objects = def.objects.map(function (objDef) {
                objDef.model = def.model;
                return new GeoGebraObject(objDef)
            });
            console.log('created GGB javascript object ', this)
        }

        // create div for text
        draw(layer) {
            let div = this;
            const id = KG.randomString(10);
            div.rootElement = layer.append('div');
            div.rootElement.style('position', 'absolute');
            div.rootElement.append('div').attr('id', id);
            let applet = new GGBApplet({
                perspective: "T",
                borderColor: "#FFFFFF",
                dataParamId: id
            }, true);
            applet.setHTML5Codebase('../../../GeoGebra/HTML5/5.0/web3d/');
            applet.inject(id);
            return div;
        }

        establishGGB() {
            let div = this;
            console.log('called establishGGB');
            if (undefined != document['ggbApplet']) {
                console.log('applet exists');
                div.applet = document['ggbApplet'];
                div.params.forEach(function (p) {
                    const establishParamCommand = p + " = " + div.model.currentParamValues()[p];
                    console.log('setting param using command ', establishParamCommand);
                    div.applet.evalCommand(establishParamCommand)
                });
                div.objects.forEach(function (obj) {
                    obj.establishGGB(div.applet);
                });


            }
            else {
                console.log('applet does not exist')
            }
        }

        updateGGB(applet, width, height) {
            const div = this;
            console.log('called updateGGB');
            if (undefined != applet) {
                console.log('applet exists');
                console.log('setting width to ', width);
                applet.setWidth(width);
                console.log('setting height to ', height);
                applet.setHeight(height);
                if (div.axes.length == 3) {
                    console.log('setting coordinate system ', div.axes[0].min, div.axes[0].max, div.axes[1].min, div.axes[1].max, div.axes[2].min, div.axes[2].max)
                    applet.setCoordSystem(div.axes[0].min, div.axes[0].max, div.axes[1].min, div.axes[1].max, div.axes[2].min, div.axes[2].max);
                    console.log('setting axis steps ', div.axes[0].step, div.axes[1].step, div.axes[2].step);
                    applet.setAxisSteps(3, div.axes[0].step, div.axes[1].step, div.axes[2].step);
                    console.log('setting axis labels ', div.axes[0].label, div.axes[1].label, div.axes[2].label);
                    applet.setAxisLabels(3, div.axes[0].label, div.axes[1].label, div.axes[2].label);
                } else {
                    applet.setCoordSystem(div.axes[0].scale.domainMin, div.axes[0].scale.domainMax, div.axes[1].scale.domainMin, div.axes[1].scale.domainMax);
                    applet.setAxisSteps(2, div.axes[0].step, div.axes[1].step);
                    applet.setAxisLabels(2, div.axes[0].label, div.axes[1].label);
                }

                if (div.hasOwnProperty('params')) {
                    div.params.forEach(function (param) {
                        applet.setValue(param, div[param])
                    })
                }
            }
            else {
                console.log('applet does not exist')
            }
        }

        // update properties
        redraw() {
            let div = this;
            const width = Math.abs(div.xScale.scale(1) - div.xScale.scale(0)),
                height = Math.abs(div.yScale.scale(1) - div.yScale.scale(0));
            div.rootElement.style('left', div.xScale.scale(0) + 'px');
            div.rootElement.style('top', div.yScale.scale(1) + 'px');
            div.rootElement.style('width', width + 'px');
            div.rootElement.style('height', height + 'px');
            console.log('redrawing');
            let checkExist = setInterval(function () {
                if (undefined != div.applet) {
                    div.updateGGB(div.applet, width, height);
                    clearInterval(checkExist);
                } else {
                    div.establishGGB();
                }
            }, 100); // check every 100ms
            return div;
        }
    }
}