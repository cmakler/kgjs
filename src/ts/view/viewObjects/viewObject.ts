/// <reference path="../../kg.ts" />

module KG {

    export interface ViewObjectDefinition extends UpdateListenerDefinition {
        layer?: any;
        name?: string;
        show?: any;
        xScale?: Scale;
        yScale?: Scale;
        clipPath?: string;
        clipPath2?: string;
        startArrow?: string;
        endArrow?: string;
        drag?: DragListenerDefinition[];
        click?: ClickListenerDefinition[];
        interactive?: boolean;
        alwaysUpdate?: boolean;
        inDef?: boolean;

        color?: string;
        fill?: string;
        opacity?: string;
        stroke?: string;
        strokeWidth?: string;
        strokeOpacity?: string;
        lineStyle?: string;
        clearColor?: string;

        colorAttributes?: string[];

        useTopScale?: boolean;
        useRightScale?: boolean;

        // the following are used in the JSON definition but replaced by objects before creation
        xScaleName?: string;
        yScaleName?: string;
        clipPathName?: string;
        clipPathName2?: string;

        // this is used to create variables to trigger updates if the axes change dimensions
        xScaleMin?: string;
        yScaleMin?: string;
        xScaleMax?: string;
        yScaleMax?: string;

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
        clearColor: string;

    }

    export class ViewObject extends UpdateListener implements IViewObject {

        public xScale;
        public yScale;
        public clipPath;
        public clipPath2;
        public startArrow;
        public endArrow;
        public inDef;
        public interactionHandler;

        public rootElement;
        public rootElement2;
        public markedElement;
        public alwaysUpdate: boolean;
        public checkOnGraph: boolean;

        public show;
        public fill;
        public opacity;
        public stroke;
        public strokeWidth;
        public strokeOpacity;
        public lineStyle;
        public clearColor;

        constructor(def: ViewObjectDefinition) {
            setDefaults(def, {
                alwaysUpdate: false,
                interactive: true,
                fill: 'colors.blue',
                fillOpacity: 0.2,
                stroke: 'colors.blue',
                strokeWidth: 1,
                stokeOpacity: 1,
                show: true,
                inDef: false,
                lineStyle: 'solid',
                checkOnGraph: true
            });

            setProperties(def, 'updatables', ['xScaleMin', 'xScaleMax', 'yScaleMin', 'yScaleMax','fill', 'stroke', 'strokeWidth', 'opacity', 'strokeOpacity', 'show', 'lineStyle']);
            setProperties(def, 'constants', ['xScale', 'yScale', 'clipPath', 'clipPath2', 'interactive', 'alwaysUpdate', 'inDef', 'checkOnGraph']);
            setProperties(def, 'colorAttributes', ['stroke', 'fill', 'color']);

            if (def.inDef) {
                def.show = true
            }

            super(def);

            let vo = this;

            if(vo.hasOwnProperty('xScale') && vo.xScale){
                def.xScaleMin = vo.xScale.def.domainMin;
                def.xScaleMax = vo.xScale.def.domainMax;
                def.yScaleMin = vo.yScale.def.domainMin;
                def.yScaleMax = vo.yScale.def.domainMax;
            }


            def.colorAttributes.forEach(function (attr) {
                let c = def[attr];
                if (vo.model.colors.hasOwnProperty(c)) {
                    def[attr] = vo.model.colors[c];
                }
            });

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
            if (vo.hasOwnProperty('clipPath2') && vo.clipPath2 != undefined) {
                vo.rootElement2.attr('clip-path', `url(#${vo.clipPath2})`);
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

        drawStroke(el) {
            const vo = this;
            el.attr('stroke', vo.stroke);
            el.attr('stroke-width', vo.strokeWidth);
            el.style('stroke-opacity', vo.strokeOpacity);
            if (vo.lineStyle == 'dashed') {
                el.style('stroke-dashArray', '10,10');
            }
            else if (vo.lineStyle == 'dotted') {
                el.style('stroke-dashArray', '1,2');
            }
            else {
                el.style('stroke-dashArray', '10,0');
            }
        }

        drawFill(el) {
            const vo = this;
            el.style('fill', vo.fill);
            el.style('fill-opacity', vo.opacity);
        }

        displayElement(show: boolean) {
            let vo = this;
            if (vo.hasOwnProperty('rootElement')) {
                vo.rootElement.style('display', show ? null : 'none');
            }
        }

        onGraph() {
            const vo = this;
            if (vo.checkOnGraph) {
                let notBetween = function(x,a,b) {
                    const min = Math.min(a,b);
                    const max = Math.max(a,b);
                    return ((x < min) || (x > max))
                }
                if (vo.hasOwnProperty('x')) {
                    if (notBetween(vo.x, vo.xScale.domainMin, vo.xScale.domainMax)) { return false }
                }
                if (vo.hasOwnProperty('y')) {
                    if (notBetween(vo.y, vo.yScale.domainMin, vo.yScale.domainMax)) { return false }
                }
            }
            return true;

        }

        update(force) {
            let vo = super.update(force);
            if ((vo.show && vo.onGraph()) || vo.inDef) {
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