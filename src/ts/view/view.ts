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

    export interface ViewDefinition {
        // These are usually specified by the user
        aspectRatio?: number;
        nosvg?: boolean;
        clearColor?: string;
        schema?: string;
        params?: ParamDefinition[];
        greenscreen?: string;
        calcs?: {};
        templateDefaults?: {};
        colors?: {};
        idioms?: {};
        custom?: string;
        restrictions?: RestrictionDefinition[];
        objects?: TypeAndDef[];
        layout?: TypeAndDef;
        explanation?: TypeAndDef;

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

        public parsedData;
        private div: any;
        private svg: any;
        private model: Model;
        private scales: Scale[];
        private aspectRatio: number;
        private sidebar?: any;
        private explanation?: any;
        private svgContainerDiv: any;
        private clearColor: string;

        constructor(div: Element, data: ViewDefinition) {
            this.render(data, div);
        }

        parse(data: ViewDefinition, div?) {

            if(data.hasOwnProperty('templateDefaults')) {
                // Any terms not defined in the user's overrides should revert to the template defaults
                const defaults = data.templateDefaults;
                let dataString = JSON.stringify(data);
                for(const key in defaults) {
                    let searchTerm = new RegExp("template.\\b"+key+"\\b", "g");
                    let replaceTerm = defaults[key];
                    dataString = dataString.replace(searchTerm, replaceTerm);
                }
                data = JSON.parse(dataString);
            }

            data.schema = data.schema || "Schema";

            // allow user to specify param overrides or select idioms in methods
            const urlParams = new URLSearchParams(window.location.search);

            // override params
            data.params = (data.params || []).map(function (paramData) {
                // allow author to override initial parameter values by specifying them as div attributes
                if (div.hasAttribute(paramData.name)) {
                    paramData.value = div.getAttribute(paramData.name)
                }

                // allow user to override parameter values by specifying them in the URL
                const urlParamValue = urlParams.get(paramData.name);

                /* console.log("Searching for ", paramData.name)
                if (urlParamValue) {
                    console.log(urlParamValue)
                } else {
                    console.log('not found')
                }*/

                if (urlParamValue) {
                    paramData.value = urlParamValue
                }

                // convert boolean params from strings to numbers
                if(paramData.value == 'true') {
                    paramData.value = 1;
                }
                if(paramData.value == 'false') {
                    paramData.value = 0;
                }

                // convert numerical params from strings to numbers
                paramData.value = isNaN(+paramData.value) ? paramData.value : +paramData.value;

                return paramData;
            });

            // allow author to set clear color as div attribute
            if (div.hasAttribute("clearColor")) {
                data.clearColor = div.getAttribute("clearColor")
            }


            let parsedData: ViewDefinition = {
                templateDefaults: data.templateDefaults || {},
                aspectRatio: data.aspectRatio || 1,
                clearColor: data.clearColor || "#FFFFFF",
                params: data.params || [],
                calcs: data.calcs || {},
                colors: data.colors || {},
                custom: data.custom || "",
                idioms: {},
                restrictions: data.restrictions,
                clipPaths: data.clipPaths || [],
                markers: data.markers || [],
                scales: data.scales || [{
                    name: 'x',
                    axis: 'x',
                    rangeMin: 0,
                    rangeMax: 1,
                    domainMin: 0,
                    domainMax: 1
                },
                    {
                        name: 'y',
                        axis: 'y',
                        rangeMin: 0,
                        rangeMax: 1,
                        domainMin: 0,
                        domainMax: 1
                    }],
                layers: data.layers || [[], [], [], []],
                divs: data.divs || []
            };

            data.objects = data.objects || [];

            if (data.hasOwnProperty('layout')) {
                if (data.layout.hasOwnProperty('type')) {
                    data.objects.push(data.layout)
                } else {
                    const layoutType = Object.keys(data.layout)[0],
                        layoutDef = data.layout[layoutType];
                    data.objects.push({type: layoutType, def: layoutDef});
                }
            }

            if (data.hasOwnProperty('explanation')) {
                data.objects.push({type: "Explanation", def: data.explanation});
            }

            if (data.hasOwnProperty('schema')) {
                if (urlParams.get('custom')) {
                    parsedData.custom = urlParams.get('custom');
                }
                data.objects.push({type: data.schema, def: { custom: parsedData.custom }})
            }

            console.log('parsed data: ', parsedData)

            return KGAuthor.parse(data.objects, parsedData);
        }

        render(data, div) {
            let view = this;
            const parsedData = view.parse(data, div);
            div.innerHTML = "";

            view.aspectRatio = data.aspectRatio || parsedData.aspectRatio || 1;
            view.model = new KG.Model(parsedData);

            // create scales
            view.scales = parsedData.scales.map(function (def: ScaleDefinition) {
                def.model = view.model;
                return new Scale(def);
            });

            // create the div for the view
            view.div = d3.select(div)
                .style('position', 'relative');


            // create a spacer div to make sure text flows properly around the graph
            view.svgContainerDiv = view.div.append('div')
                .style('position', 'absolute')
                .style('left', '0px')
                .style('top', '0px');

            // create the SVG element for the view
            if (!parsedData.nosvg) {
                view.svg = view.svgContainerDiv.append('svg')
                    .style('overflow', 'visible')
                    .style('pointer-events', 'none');
            }

            view.addViewObjects(parsedData);
            view.parsedData = parsedData;
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

            if (view.svg) {
                const defLayer = view.svg.append('defs');

                // create ClipPaths, generate their URLs, and add their paths to the SVG defs element.
                if (data.clipPaths.length > 0) {
                    data.clipPaths.forEach(function (def: ClipPathDefinition) {
                        const clipPathURL = randomString(10);
                        const clipPathLayer = defLayer.append('clipPath').attr('id', clipPathURL);
                        def.paths.forEach(function (td) {
                            td.def.inDef = true;
                            new KG[td.type](view.addViewToDef(td.def, clipPathLayer));
                        });
                        defURLS[def.name] = clipPathURL;
                    });
                }

                // create Markers, generate their URLs, and add their paths to the SVG defs element.
                if (data.markers.length > 0) {
                    data.markers.forEach(function (def: MarkerDefinition) {
                        const markerURL = randomString(10);
                        def.url = markerURL;
                        defURLS[def.name] = markerURL;

                        const markerLayer = defLayer.append('marker')
                            .attr('id', markerURL)
                            .attr("refX", def.refX)
                            .attr("refY", 6)
                            .attr("markerWidth", 13)
                            .attr("markerHeight", 13)
                            .attr("orient", "auto")
                            .attr("markerUnits", "userSpaceOnUse");

                        view.addViewToDef(def, markerLayer);
                        new Marker(def);
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
                            if (def.hasOwnProperty('clipPathName2')) {
                                def.clipPath2 = defURLS[def['clipPathName2']]
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

            }

            // add divs
            if (data.divs.length > 0) {
                data.divs.forEach(function (td: TypeAndDef) {
                    const def = view.addViewToDef(td.def, view.div),
                        newDiv = new KG[td.type](def);
                    if (td.type == 'Sidebar') {
                        view.sidebar = newDiv;
                    }
                    if (td.type == 'Explanation') {
                        view.explanation = newDiv;
                    }
                });
            }

            view.updateDimensions();
        }

        // update dimensions, either when first rendering or when the window is resized
        updateDimensions(printing?: boolean) {
            let view = this;

            printing = !!printing;

            //console.log('printing is ', printing);

            let width = 0, height = 0, displayHeight = 0;

            if (printing) {

                width = 600;
                height = width / view.aspectRatio;
                displayHeight = height + 20
            } else {
                // read the client width of the enclosing div and calculate the height using the aspectRatio
                let clientWidth = view.div.node().clientWidth;

                width = clientWidth - 10
                height = width / view.aspectRatio;

                let sidebarHeight = 0, explanationHeight = 0;

                // position the sidebar to the right if the screen is wide enough, or below if it isn't
                if (view.sidebar) {
                    if (width > view.sidebar.triggerWidth) {
                        height = height * 77 / 126;
                        let s_height;
                        if (view.explanation) {
                            s_height = height + view.explanation.rootElement.node().clientHeight + 10;
                        } else {
                            s_height = height;
                        }
                        view.sidebar.positionRight(width, s_height);
                        width = width * 77 / 126; // make width of graph the same width as main Tufte column
                    } else {
                        view.sidebar.positionBelow(width, height);
                        sidebarHeight = view.sidebar.rootElement.node().clientHeight + 30;
                    }
                }

                // position the explanation below
                if (view.explanation) {
                    view.explanation.position(width, height + sidebarHeight + 10);
                    explanationHeight = view.explanation.rootElement.node().clientHeight + 20;
                }

                displayHeight = height + sidebarHeight + explanationHeight + 10

            }

            view.div.style('height', displayHeight + 'px');


            // set the height of the div

            view.svgContainerDiv.style('width', width);
            view.svgContainerDiv.style('height', height);

            if (view.svg) {
                // set the dimensions of the svg
                view.svg.style('width', width);
                view.svg.style('height', height);
                view.svg.attr('width', width);
                view.svg.attr('height', height);
            }

            // adjust all of the scales to be proportional to the new dimensions
            view.scales.forEach(function (scale) {
                scale.updateDimensions(width, height);
            });

            // once the scales are updated, update the coordinates of all view objects
            view.model.update(true);
        }
    }

}