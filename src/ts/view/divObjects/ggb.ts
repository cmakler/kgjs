/// <reference path="../../kg.ts" />
module KG {

    export interface GeoGebraAppletDefinition extends DivObjectDefinition {
        path: string;
        params: string[];
    }

    declare class GGBApplet {
        constructor(params: any, webSimple: any);

        setHTML5Codebase: (path: string) => void;
        inject: (id: string) => void;
    }

    export class GeoGebraApplet extends ViewObject {

        private applet;

        constructor(def: GeoGebraAppletDefinition) {
            console.log('creating ggb');
            def.params = def.params || [];
            def.params.forEach(function (param) {
                def[param] = 'params.' + param;
            });
            setProperties(def, 'updatables', def.params);
            setProperties(def, 'constants', ['path']);
            super(def);
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

        establishGGB(width, height) {
            let div = this;
            console.log('called establishGGB');
            if (undefined != document['ggbApplet']) {
                const commands = ['a = 0.5', 'u(x,y) = x^a*y^(1-a)', 'indifferenceCurves = Sequence(Curve(t,(n/t^a)^(1/(1-a)),n,t,0,60),n,5,50,5)'];
                console.log('establishingGGB object');
                div.applet = document['ggbApplet'];
                commands.forEach(function (c) {
                    div.applet.evalCommand(c);
                });
                div.applet.setColor('u', 197, 176, 213);
                div.applet.setFilling('u', 0.2);
                div.applet.setColor('indifferenceCurves', 148, 103, 189);
                div.applet.setAxisLabels(3, "Units of Good 1", "Units of Good 2", "Utility");
            }
        }

        updateGGB(applet, width, height) {
            const div = this;
            console.log('called updateGGB');
            if (undefined != applet) {
                applet.setCoordSystem(0, 50, 0, 50, 0, 50);
                applet.setAxisSteps(3, 60, 60, 60);
                applet.setWidth(width);
                applet.setHeight(height);
                applet.setValue('a', div.a)
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
            var checkExist = setInterval(function () {
                if (undefined != div.applet) {
                    div.updateGGB(div.applet, width, height);
                    clearInterval(checkExist);
                } else {
                    div.establishGGB(width, height);
                }
            }, 100); // check every 100ms
            return div;
        }
    }
}