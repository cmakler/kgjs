/// <reference path="../kg.ts" />

module KG {

    export interface RefDef {
        category: string; // name of key in JSON object
        className: string; // class to generate object of
        refListName: string; // name of reference property
    }

    export interface PointerDef {
        singular?: boolean // single reference or list

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
                    category: 'clickListeners',
                    className: 'ClickListener',
                    refListName: 'clickListenerNames'
                },
                {
                    category: 'dragListeners',
                    className: 'DragListener',
                    refListName: 'dragListenerNames'
                },
                {
                    category: 'univariateFunctions',
                    className: 'UnivariateFunction',
                    refListName: 'univariateFunctionNames'
                }
            ];

    export const LAYERS = [
                {
                    name: 'clipPaths',
                    parent: 'svg',
                    element: 'defs',
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
        private model;
        private scales;
        private aspectRatio: number;
        private refs: any;

        constructor(div: Element, data: ViewDefinition) {

            let view = this;

            view.div = d3.select(div).style('position', 'relative');
            view.aspectRatio = data.aspectRatio || 1;

            data.params = data.params || [];
            data.restrictions = data.restrictions || [];
            data.scales = data.scales || [];

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

            view.scales = data.scales.map(function (def) {
                def.model = view.model;
                return new Scale(def);
            });

            view.refs = {};

            let createRef = function (refDef: { category: string, className: string }) {
                if (data.hasOwnProperty(refDef.category)) {
                    data[refDef.category].forEach(function (def) {
                        def.model = view.model;
                        view.refs[refDef.category + '_' + def.name] = new KG[refDef.className](def);
                    })
                }
            };

            REFS.forEach(createRef);

            // add svg element as a child of the div
            view.svg = view.div.append("svg");

            let addLayer = function (layerDef: { name: string, parent: string, element: string, className: string }) {
                if (data.hasOwnProperty(layerDef.name)) {
                    view[layerDef.name] = [];
                    let layer = view[layerDef.parent].append(layerDef.element).attr('class', layerDef.name);
                    data[layerDef.name].forEach(function (def) {
                        def = _.defaults(def, {
                            model: view.model,
                            layer: layer,
                            xScale: view.getByName("scales", def.xScaleName),
                            yScale: view.getByName("scales", def.yScaleName)
                        });
                        if (def.hasOwnProperty('clipPathName')) {
                            def.clipPath = view.getByName("clipPaths", def.clipPathName)
                        }
                        REFS.forEach(function (ref) {
                            if(!def.hasOwnProperty(ref.refListName)) return;
                            if(def[ref.refListName] instanceof Array) {
                                def[ref.category] = def[ref.refListName].map(function(name){
                                    return view.refs[ref.category + '_' + name]
                                })
                            } else {
                                def[ref.category] = view.refs[ref.category + '_' + def.refListName]
                            }
                        });
                        view[layerDef.name].push(new KG[layerDef.className](def));
                    });
                }
            };



            LAYERS.forEach(addLayer);

            // establish dimensions of view and views
            view.updateDimensions();

        }

        getByName(category, name) {
            const objs = this[category];
            if (objs != undefined) {
                for (let i = 0; i < objs.length; i++) {
                    if (objs[i].name == name) {
                        return objs[i];
                    }
                    console.log('tried to find ', name, ' in category ', category, ' but no entry with that name exists.')
                }
            } else {
                console.log('tried to find ', name, ' in category ', category, ' but that category does not exist');
            }
        }

        updateDimensions() {
            let view = this;
            const width = view.div.node().clientWidth,
                height = width / view.aspectRatio;
            view.div.style.height = height + 'px';
            view.svg.style('width', width);
            view.svg.style('height', height);
            view.scales.forEach(function (scale) {
                scale.extent = (scale.axis == 'x') ? width : height;
            });
            view.model.update(true);
            return view;
        }
    }

}