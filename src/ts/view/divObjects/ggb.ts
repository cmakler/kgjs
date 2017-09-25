/// <reference path="../../kg.ts" />
module KG {

    export interface GeoGebraAppletDefinition extends DivObjectDefinition {
        path: string;
        params: string[];
    }

    declare class GGBApplet {
        constructor(params: any, webSimple: boolean)
    }

    export class GeoGebraApplet extends ViewObject {

        private applet: any;

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
            div.id = KG.randomString(10);
            div.rootElement = layer.append('div');
            div.rootElement.style('position', 'absolute');
            div.rootElement.append('div').attr('id', div.id);
            return div;
        }

        // update properties
        redraw() {
            let div = this;
            console.log('redrawing');
            const width = Math.abs(div.xScale.scale(1) - div.xScale.scale(0)),
                height = Math.abs(div.yScale.scale(1) - div.yScale.scale(0));
            div.rootElement.style('left', div.xScale.scale(0) + 'px');
            div.rootElement.style('top', div.yScale.scale(1) + 'px');
            div.rootElement.style('width', width + 'px');
            div.rootElement.style('height', height + 'px');
            if (undefined == div.applet && div.xScale.extent > 0) {
                div.applet = new GGBApplet({
                    filename: "/GeoGebra/graphs/" + div.path,
                    width: width,
                    height: height
                }, true);
                div.applet.inject(div.id);
            } else if (undefined != div.applet) {
                const applet = document['ggbApplet'];
                console.log('setting width to ',width);
                applet.setValue('a', div.a);
                applet.setWidth(width);
                applet.setHeight(height);
            }
            return div;
        }
    }

}