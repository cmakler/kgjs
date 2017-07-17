/// <reference path="../kg.ts" />

module KG {

    export interface RefDef {
        category: string;
        className: string;
        refName: string;
        propName: string;
    }

    export interface ViewDefinition {
        aspectRatio: number;
        params?: ParamDefinition[];
        restrictions?: RestrictionDefinition[];
        scales?: ScaleDefinition[];
        dragListeners?: DragListenerDefinition[];
        clickListeners?: ClickListenerDefinition[];
        univariateFunctions?: UnivariateFunctionDefinition[];
        curves?: CurveDefinition[];
        segments?: SegmentDefinition[];
        points?: PointDefinition[];
        labels?: LabelDefinition[];
        axes?: AxisDefinition[];
        clipPaths?: ClipPathDefinition[];
    }

    export interface IView {
        updateDimensions: () => View;  // called on a window resize event; updates the size of the Container
    }

    export const REFS: RefDef[] = [
        {
            category: 'xScales',
            className: 'Scale',
            propName: 'xScale',
            refName: 'xScaleName'
        },
        {
            category: 'yScales',
            className: 'Scale',
            propName: 'yScale',
            refName: 'yScaleName'
        },
        {
            category: 'clickListeners',
            className: 'ClickListener',
            propName: 'clickListeners',
            refName: 'clickListenerNames'
        },
        {
            category: 'dragListeners',
            className: 'DragListener',
            propName: 'dragListeners',
            refName: 'dragListenerNames'
        },
        {
            category: 'univariateFunctions',
            className: 'UnivariateFunction',
            propName: 'univariateFunctions',
            refName: 'univariateFunctionNames'
        }
    ];

    export const LAYERS = [
        {
            name: 'clipPaths',
            parent: 'defs',
            element: '',
            className: 'ClipPath'
        },
        {
            name: 'segments',
            parent: 'svg',
            element: 'g',
            className: 'Segment'
        },
        {
            name: 'curves',
            parent: 'svg',
            element: 'g',
            className: 'Curve'
        },
        {
            name: 'axes',
            parent: 'svg',
            element: 'g',
            className: 'Axis'
        },
        {
            name: 'points',
            parent: 'svg',
            element: 'g',
            className: 'Point'
        },
        {
            name: 'labels',
            parent: 'div',
            element: 'div',
            className: 'Label'
        },

    ];

    export class View implements IView {

        private div;
        private svg;
        private svgDefs;
        private model;
        private xScales;
        private yScales;
        private aspectRatio: number;
        private refs: any;

        constructor(div: Element, data: ViewDefinition) {

            let view = this;

            view.div = d3.select(div).style('position', 'relative');
            view.aspectRatio = data.aspectRatio || 1;

            data.params = data.params || [];
            data.restrictions = data.restrictions || [];

            data.params = data.params.map(function (paramData) {
                // allow author to override initial parameter values by specifying them as div attributes
                if (div.hasAttribute(paramData.name)) {
                    paramData.value = div.getAttribute(paramData.name)
                }
                // convert numerical params from strings to numbers
                paramData.value = isNaN(+paramData.value) ? paramData.value : +paramData.value;
                return paramData;
            });

            const params = data.params.map(function (def) {
                return new Param(def)
            });

            const restrictions = data.restrictions.map(function (def) {
                return new Restriction(def)
            });

            view.model = new KG.Model(params, restrictions);

            view.refs = {};
            view.xScales = [];
            view.yScales = [];

            let createRef = function (refDef: { category: string, className: string }) {
                if (data.hasOwnProperty(refDef.category)) {
                    data[refDef.category].forEach(function (def) {
                        def.model = view.model;
                        const newRef = new KG[refDef.className](def);
                        view.refs[refDef.category + '_' + def.name] = newRef;
                        if (refDef.category == 'xScales') {
                            view.xScales.push(newRef);
                        }
                        if (refDef.category == 'yScales') {
                            view.yScales.push(newRef);
                        }
                    })
                }
            };

            REFS.forEach(createRef);

            // add svg element as a child of the div
            view.svg = view.div.append("svg").style("overflow","visible").style("pointer-events","none");
            view.svgDefs = view.svg.append("defs");

            let addLayer = function (layerDef: { name: string, parent: string, element: string, className: string }) {
                    if (data.hasOwnProperty(layerDef.name)) {
                        const layer = (layerDef.parent == 'defs') ? view.svgDefs : view[layerDef.parent].append(layerDef.element).attr('class', layerDef.name);
                        data[layerDef.name].forEach(function (def) {
                            def = _.defaults(def, {
                                model: view.model,
                                layer: layer
                            });

                            // a clip path is both a layer and a ref
                            if (def.hasOwnProperty('clipPathName')) {
                                def.clipPath = view.refs["clipPaths_" + def.clipPathName]
                            }

                            REFS.forEach(function (ref) {
                                if (!def.hasOwnProperty(ref.refName)) return;
                                if (def[ref.refName] instanceof Array) {
                                    def[ref.propName] = def[ref.refName].map(function (name) {
                                        return view.refs[ref.category + '_' + name]
                                    })
                                } else {
                                    def[ref.propName] = view.refs[ref.category + '_' + def[ref.refName]];
                                }

                            });
                            const newLayer = new KG[layerDef.className](def);

                            // a clip path is both a layer and a ref
                            if (layerDef.className == 'ClipPath') {
                                view.refs['clipPaths_' + def.name] = newLayer;
                            }

                        });
                    }
                }

            LAYERS.forEach(addLayer);

            // establish dimensions of view and views
            view.updateDimensions();

        }

        updateDimensions() {
            let view = this;
            const width = view.div.node().clientWidth,
                height = width / view.aspectRatio;
            view.div.style.height = height + 'px';
            view.svg.style('width', width);
            view.svg.style('height', height);
            view.xScales.forEach(function (scale) {
                scale.extent = width;
            });
            view.yScales.forEach(function (scale) {
                scale.extent = height;
            });
            view.model.update(true);
            return view;
        }
    }

}