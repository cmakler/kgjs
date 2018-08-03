/// <reference path="../../kg.ts" />

module KG {

    export interface ViewObjectDefinition extends UpdateListenerDefinition {
        layer?: any;
        name?: string;
        show?: any;
        xScale?: Scale;
        yScale?: Scale;
        clipPath?: string;
        startArrow?: string;
        endArrow?: string;
        drag?: DragListenerDefinition[];
        click?: ClickListenerDefinition[];
        interactive?: boolean;
        alwaysUpdate?: boolean;

        color?: string;
        fill?: string;
        opacity?: string;
        stroke?: string;
        strokeWidth?: string;
        strokeOpacity?: string;
        lineStyle?: string;

        useTopScale?: boolean;
        useRightScale?: boolean;

        // the following are used in the JSON definition but replaced by objects before creation
        xScaleName?: string;
        yScaleName?: string;
        clipPathName?: string;

    }

    export interface IViewObject extends IUpdateListener {
        xScale: Scale;
        yScale: Scale;
        clipPath: string;
        inDef: boolean;
        interactionHandler: InteractionHandler;

        addClipPathAndArrows: () => ViewObject;
        addInteraction: () => ViewObject;
        draw: (layer: any) => ViewObject;
        redraw: () => ViewObject;

        fill: string;
        opacity: string;
        stroke: string;
        strokeWidth: string;
        strokeOpacity: string;
        lineStyle: string;
        startArrow: string;
        endArrow: string;
    }

    export class ViewObject extends UpdateListener implements IViewObject {

        public xScale;
        public yScale;
        public clipPath;
        public startArrow;
        public endArrow;
        public inDef;
        public interactionHandler;

        public rootElement;
        public markedElement;
        public alwaysUpdate: boolean;

        public fill;
        public opacity;
        public stroke;
        public strokeWidth;
        public strokeOpacity;
        public lineStyle;

        constructor(def: ViewObjectDefinition) {
            setDefaults(def, {
                alwaysUpdate: false,
                interactive: true,
                stroke: 'black',
                strokeWidth: 1,
                show: true,
                inDef: false,
                lineStyle: 'solid'
            });
            setProperties(def, 'updatables', ['fill', 'stroke', 'strokeWidth', 'opacity', 'strokeOpacity', 'show', 'lineStyle']);
            setProperties(def, 'constants', ['xScale', 'yScale', 'clipPath', 'interactive', 'alwaysUpdate', 'inDef']);

            super(def);

            let vo = this;

            // the interaction handler manages drag and hover events
            if (def.interactive) {
                def.drag = def.drag || [];
                const dragListeners = def.drag.map(function (dragDef) {
                    dragDef.model = vo.model;
                    return new DragListener(dragDef)
                });
                def.click = def.click || [];
                const clickListeners = def.click.map(function (clickDef) {
                    clickDef.model = vo.model;
                    return new ClickListener(clickDef)
                });
                vo.interactionHandler = new InteractionHandler({
                    viewObject: vo,
                    model: vo.model,
                    dragListeners: dragListeners,
                    clickListeners: clickListeners
                });
            }

            // the draw method creates the DOM elements for the view object
            // the update method updates their attributes
            if (def.hasOwnProperty('layer')) {
                vo.draw(def.layer).update(true).init();
            }
        }

        init() {
            return this; //defined at subclass level
        }

        addClipPathAndArrows() {
            const vo = this;
            if (vo.hasOwnProperty('clipPath') && vo.clipPath != undefined) {
                vo.rootElement.attr('clip-path', `url(#${vo.clipPath})`);
            }
            if (vo.hasOwnProperty('endArrow') && vo.endArrow != undefined) {
                vo.markedElement.attr("marker-end", `url(#${vo.endArrow})`)
            }
            if (vo.hasOwnProperty('startArrow') && vo.endArrow != undefined) {
                vo.markedElement.attr("marker-start", `url(#${vo.startArrow})`)
            }
            return vo;
        }

        addInteraction() {
            const vo = this;
            vo.interactionHandler.addTrigger(vo.rootElement);
            return vo;
        }

        draw(layer?: any, inDef ?: boolean) {
            return this;
        }

        redraw() {
            return this;
        }

        displayElement(show: boolean) {
            let vo = this;
            if (vo.hasOwnProperty('rootElement')) {
                vo.rootElement.style('display', show ? null : 'none');
            }
        }

        onGraph() {
            const vo = this;
            if (vo.hasOwnProperty('x')) {
                if (vo.x < vo.xScale.domainMin || vo.x > vo.xScale.domainMax) {
                    return false;
                }
            }
            if (vo.hasOwnProperty('y')) {
                if (vo.y < vo.yScale.domainMin || vo.y > vo.yScale.domainMax) {
                    return false;
                }
            }
            return true;

        }

        update(force) {
            let vo = super.update(force);
            if (vo.show && vo.onGraph()) {
                vo.displayElement(true);
                if (vo.hasChanged) {
                    vo.redraw();
                }
            }
            else {
                vo.displayElement(false);
            }
            return vo;
        }

    }

}