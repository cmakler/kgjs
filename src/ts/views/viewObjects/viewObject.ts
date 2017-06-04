/// <reference path="../../kg.ts" />

module KG {

    export interface ViewObjectDefinition {
        xScaleName?: string;
        yScaleName?: string;
    }

    export interface IViewObject {
        view: View;
        model: Model;
        update: () => ViewObject;
        xScale: Scale;
        yScale: Scale;
    }

    export class ViewObject implements IViewObject {

        public view;
        public model;
        public xScale;
        public yScale;

        constructor(view:View, layer: any, def:ViewObjectDefinition) {
            let vo = this;
            vo.view = view;
            vo.model = view.container.model;
            vo.xScale = view.scales[def.xScaleName];
            vo.yScale = view.scales[def.yScaleName];
            view.container.model.addUpdateListener(vo);
        }

        update() {
            return this;
        }

    }

}