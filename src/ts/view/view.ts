/// <reference path='../kg.ts' />

module KG {

    export interface TypeAndDef {
        type: string;
        def: any;
    }

    export interface ClipPathDefinition {
        name: string;
        paths: TypeAndDef[];
    }

    export interface MarkerDefinition {
        name: string;
        refX: number;
        maskPath: string;
        arrowPath: string;
        color: string;
    }

    export interface ViewDefinition {
        // These are usually specified by the user
        aspectRatio?: number;
        schema?: string;
        params?: ParamDefinition[];
        calcs: {};
        colors: {};
        restrictions?: RestrictionDefinition[];
        objects?: TypeAndDef[];
        layout?: TypeAndDef;

        // The rest of these are usually generated
        scales?: ScaleDefinition[];
        clipPaths?: ClipPathDefinition[];
        markers?: MarkerDefinition[];
        layers?: TypeAndDef[][];
        divs?: TypeAndDef[];
    }

    export interface IView {
        updateDimensions: () => void;  // called on a window resize event; updates the size of the Container
    }

    export let viewData = {}

    export function addView(name, def) {
        viewData[name] = def;
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

            let parsedData: ViewDefinition = {
                aspectRatio: data.aspectRatio || 1,
                params: data.params || [],
                calcs: data.calcs || {},
                colors: data.colors || {},
                restrictions: data.restrictions,
                clipPaths: data.clipPaths || [],
                markers: data.markers || [],
                scales: data.scales || [],
                layers: data.layers || [[], [], [], []],
                divs: data.divs || []
            };

            data.objects = data.objects || [];

            if (data.hasOwnProperty('layout')) {
                data.objects.push(data.layout)
            }

            if (data.hasOwnProperty('schema')) {
                data.objects.push({type: data.schema, def: {}})
            }

            parsedData = KGAuthor.parse(data.objects, parsedData);

            console.log(parsedData);
            let view = this;

            view.aspectRatio = parsedData.aspectRatio || 1;
            view.model = new KG.Model(parsedData);

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

            console.log('parsedData: ',parsedData);

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

            let defURLS = {};

            const defLayer = view.svg.append('defs');

            // create ClipPaths, generate their URLs, and add their paths to the SVG defs element.
            if (data.clipPaths.length > 0) {
                data.clipPaths.forEach(function (def: ClipPathDefinition) {
                    const clipPathURL = randomString(10);
                    const clipPathLayer = defLayer.append('clipPath').attr('id', clipPathURL);
                    def.paths.forEach(function (td) {
                        new KG[td.type](view.addViewToDef(td.def, clipPathLayer));
                    });
                    defURLS[def.name] = clipPathURL;
                });
            }

            // create Markers, generate their URLs, and add their paths to the SVG defs element.
            if (data.markers.length > 0) {
                data.markers.forEach(function (def: MarkerDefinition) {
                    const markerURL = randomString(10);
                    const markerLayer = defLayer.append('marker')
                        .attr('id', markerURL)
                        .attr("refX", def.refX)
                        .attr("refY", 6)
                        .attr("markerWidth", 13)
                        .attr("markerHeight", 13)
                        .attr("orient", "auto")
                        .attr("markerUnits", "userSpaceOnUse");

                    markerLayer.append("svg:path")
                        .attr("d", def.maskPath)
                        .attr("fill", "white");

                    markerLayer.append("svg:path")
                        .attr("d", def.arrowPath)
                        .attr("fill", view.model.eval(def.color));
                    defURLS[def.name] = markerURL;
                });
            }


            // add layers of objects
            data.layers.forEach(function (layerTds: TypeAndDef[]) {
                if (layerTds.length > 0) {
                    const layer = view.svg.append('g');
                    layerTds.forEach(function (td) {
                        let def: ViewObjectDefinition = td.def;
                        if (def.hasOwnProperty('clipPathName')) {
                            def.clipPath = defURLS[def['clipPathName']]
                        }
                        if (def.hasOwnProperty('startArrowName')) {
                            def.startArrow = defURLS[def['startArrowName']]
                        }
                        if (def.hasOwnProperty('endArrowName')) {
                            def.endArrow = defURLS[def['endArrowName']]
                        }
                        def = view.addViewToDef(def, layer);
                        new KG[td.type](def);
                    })
                }
            });

            // add divs
            if (data.divs.length > 0) {
                data.divs.forEach(function (td: TypeAndDef) {
                    const def = view.addViewToDef(td.def, view.div),
                        newDiv = new KG[td.type](def);
                    if (td.type == 'Sidebar') {
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