/// <reference path='../kg.ts' />

module KG {

    export interface ViewObjectWithType {
        type: string;
        def: any;
    }

    export interface DivObjectWithType {
        type: string;
        def: any;
    }

    export interface ViewDefinition {
        aspectRatio?: number;
        params?: ParamDefinition[];
        restrictions?: RestrictionDefinition[];
        scales?: ScaleDefinition[];
        clipPaths?: ClipPathDefinition[];
        layers?: ViewObjectWithType[][];
        divs?: DivObjectWithType[];
    }

    export interface IView {
        updateDimensions: () => void;  // called on a window resize event; updates the size of the Container
    }


    export class View implements IView {

        private div: any;
        private svg: any;
        private model: Model;
        private scales: Scale[];
        private aspectRatio: number;
        private sidebar?: any;

        constructor(div: Element, data: ViewDefinition) {


            data.params = (data.params || []).map(function (paramData) {
                // allow author to override initial parameter values by specifying them as div attributes
                if (div.hasAttribute(paramData.name)) {
                    paramData.value = div.getAttribute(paramData.name)
                }
                // convert numerical params from strings to numbers
                paramData.value = isNaN(+paramData.value) ? paramData.value : +paramData.value;
                return paramData;
            });

            let parsedData:ViewDefinition = {
                aspectRatio: data.aspectRatio || 1,
                params: data.params,
                restrictions: data.restrictions,
                clipPaths: data.clipPaths || [],
                scales: data.scales || [],
                layers: data.layers || [[], [], [], []],
                divs: data.divs || []
            };

            parsedData = KGAuthor.parse(data, parsedData);

            let view = this;

            view.aspectRatio = parsedData.aspectRatio || 1;
            view.model = new KG.Model(parsedData.params, parsedData.restrictions);

            // create scales
            view.scales = parsedData.scales.map(function (def: ScaleDefinition) {
                def.model = view.model;
                return new Scale(def);
            });

            // create the div for the view
            view.div = d3.select(div)
                .style('position', 'relative');

            // create the SVG element for the view
            view.svg = view.div.append('svg')
                .style('overflow', 'visible')
                .style('pointer-events', 'none');

            view.addViewObjects(parsedData);

        }

        // add view information (model, layer, scales) to an object
        addViewToDef(def, layer) {
            const view = this;

            function getScale(name) {
                let result = null;
                view.scales.forEach(function (scale) {
                    if (scale.name == name) {
                        result = scale;
                    }
                });
                return result;
            }

            def.model = view.model;
            def.layer = layer;
            def.xScale = getScale(def['xScaleName']);
            def.yScale = getScale(def['yScaleName']);
            if (def.hasOwnProperty('xScale2Name')) {
                def.xScale2 = getScale(def['xScale2Name']);
                def.yScale2 = getScale(def['yScale2Name']);
            }
            return def;
        }

        // create view objects
        addViewObjects(data: ViewDefinition) {

            const view = this;

            let clipPathRefs = {};

            if (data.clipPaths.length > 0) {
                // create ClipPaths, store them to refs, and add them to the SVG.
                const defLayer = view.svg.append('defs');
                data.clipPaths.forEach(function (def: ClipPathDefinition) {
                    def = view.addViewToDef(def, defLayer);
                    clipPathRefs[def.name] = new ClipPath(def);
                });
            }


            // add layers of objects
            data.layers.forEach(function (layerViewObjectDefs: ViewObjectWithType[]) {
                if (layerViewObjectDefs.length > 0) {
                    const layer = view.svg.append('g');
                    layerViewObjectDefs.forEach(function (defWithType) {
                        let def: ViewObjectDefinition = defWithType.def;
                        if (def.hasOwnProperty('clipPathName')) {
                            def.clipPath = clipPathRefs[def['clipPathName']]
                        }
                        def = view.addViewToDef(def, layer);
                        new KG[defWithType.type](def);
                    })
                }
            });

            // add divs
            if (data.divs.length > 0) {
                data.divs.forEach(function (defWithType: DivObjectWithType) {
                    const def = view.addViewToDef(defWithType.def, view.div),
                        newDiv = new KG[defWithType.type](def);
                    if (defWithType.type == 'Sidebar') {
                        view.sidebar = newDiv;
                    }
                });
            }


            view.updateDimensions();
        }

        // update dimensions, either when first rendering or when the window is resized
        updateDimensions() {
            let view = this;

            // read the client width of the enclosing div and calculate the height using the aspectRatio
            let width = view.div.node().clientWidth;
            console.log(width);

            if (width > 563 && view.sidebar) {
                view.sidebar.positionRight(width);
                width = width * 77 / 126; // make width of graph the same width as main Tufte column
            } else if (view.sidebar) {
                view.sidebar.positionBelow();
            }

            const height = width / view.aspectRatio;
            // set the height of the div
            view.div.style.height = height + 'px';

            // set the dimensions of the svg
            view.svg.style('width', width);
            view.svg.style('height', height);

            // adjust all of the scales to be proportional to the new dimensions
            view.scales.forEach(function (scale) {
                scale.updateDimensions(width, height);
            });

            // once the scales are updated, update the coordinates of all view objects
            view.model.update(true);
        }
    }

}