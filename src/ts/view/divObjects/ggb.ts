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
            const id = KG.randomString(10);
            div.rootElement = layer.append('div');
            div.rootElement.style('position', 'absolute');
            div.rootElement.attr('id', id);
            return div;
        }

        // update properties
        redraw() {
            let div = this;
            console.log('redrawing');
            div.rootElement.style('left', div.xScale.scale(0) + 'px');
            div.rootElement.style('top', div.yScale.scale(1) + 'px');
            div.rootElement.style('width', div.xScale.extent);
            div.rootElement.style('height', div.yScale.extent);
            if (undefined == div.applet && div.xScale.extent > 0) {
                div.applet = new GGBApplet({
                    filename: "/GeoGebra/graphs/" + div.path,
                    width: div.xScale.extent,
                    height: div.yScale.extent
                }, true);
                div.applet.inject(div.rootElement.attr('id'));
            } else if (undefined != div.applet) {
                const applet = document['ggbApplet'];
                applet.setValue('a', div.a);
                applet.setWidth(div.xScale.extent);
                applet.setHeight(div.yScale.extent);
            }
            return div;
        }
    }

}