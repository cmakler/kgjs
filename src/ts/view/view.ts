/// <reference path="../kg.ts" />

module KG {

    export interface ViewDefinition {
        aspectRatio: number;
        params?: ParamDefinition[];
        restrictions?: RestrictionDefinition[];
        scales?: ScaleDefinition[];
        dragUpdates?: DragUpdateListenerDefinition[];
        functions?: UnivariateFunctionDefinition[];
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

    export class View implements IView {

        private div;
        private svg;
        private model;
        private univariateFunctions: UnivariateFunction[];
        private aspectRatio: number;
        private scales: Scale[];
        private dragUpdates: DragUpdateListener[];
        private clipPaths: ClipPath[];

        constructor(div: Element, data: ViewDefinition) {

            let view = this;

            view.div = d3.select(div).style('position', 'relative');

            data.params = data.params || [];
            data.restrictions = data.restrictions || [];

            data.params = data.params.map(function (paramData) {
                if (div.hasAttribute(paramData.name)) {
                    paramData.value = div.getAttribute(paramData.name)
                }
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
            view.aspectRatio = data.aspectRatio || 1;

            // add svg element as a child of the div
            view.svg = view.div.append("svg");

            // establish scales
            if (data.hasOwnProperty('scales')) {
                view.scales = data.scales.map(function (def) {
                    def.model = view.model;
                    return new Scale(def);
                })
            } else {
                view.scales = [];
            }

            // establish drag update listeners
            if (data.hasOwnProperty('dragUpdates')) {
                view.dragUpdates = data.dragUpdates.map(function (def: DragUpdateListenerDefinition) {
                    def.model = view.model;
                    return new DragUpdateListener(def);
                })
            } else {
                view.dragUpdates = [];
            }

            // establish functions
            if (data.hasOwnProperty('functions')) {
                view.univariateFunctions = data.functions.map(function (def: UnivariateFunctionDefinition) {
                    def.model = view.model;
                    return new UnivariateFunction(def);
                })
            }

            let prepareDef = function (def, layer) {
                def.model = view.model;
                def.layer = layer;
                def.xScale = view.getByName("scales", def.xScaleName);
                def.yScale = view.getByName("scales", def.yScaleName);
                if (def.hasOwnProperty('clipPathName')) {
                    def.clipPath = view.getByName("clipPaths", def.clipPathName);
                }
                def.dragUpdateNames = def.dragUpdateNames || [];
                def.dragUpdates = def.dragUpdateNames.map(function (name) {
                    return view.getByName("dragUpdates", name)
                });
                def.functionNames = def.functionNames || [];
                def.univariateFunctions = def.functionNames.map(function (name) {
                    return view.getByName("univariateFunctions", name)
                });
                return def;
            };

            const defLayer = view.svg.append('defs');

            if (data.hasOwnProperty('clipPaths')) {
                view.clipPaths = data.clipPaths.map(function (def: ClipPathDefinition) {
                    return new ClipPath(prepareDef(def, defLayer));
                });
            }
            if (data.hasOwnProperty('segments')) {
                let segmentLayer = view.svg.append('g').attr('class', 'segments');
                data.segments.forEach(function (def: SegmentDefinition) {
                    new Segment(prepareDef(def, segmentLayer));
                });
            }
            if (data.hasOwnProperty('curves')) {
                let curveLayer = view.svg.append('g').attr('class', 'curves');
                data.curves.forEach(function (def: CurveDefinition) {
                    new Curve(prepareDef(def, curveLayer));
                });
            }
            if (data.hasOwnProperty('axes')) {
                let axisLayer = view.svg.append('g').attr('class', 'axes');
                data.axes.forEach(function (def: AxisDefinition) {
                    new Axis(prepareDef(def, axisLayer));
                });
            }
            if (data.hasOwnProperty('points')) {
                let pointLayer = view.svg.append('g').attr('class', 'points');
                data.points.forEach(function (def: PointDefinition) {
                    new Point(prepareDef(def, pointLayer));
                });
            }
            if (data.hasOwnProperty('labels')) {
                let labelLayer = view.div.append('div').attr('class', 'labels');
                data.labels.forEach(function (def: LabelDefinition) {
                    new Label(prepareDef(def, labelLayer));
                });
            }

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
                    console.log('tried to find ',name,' in category ', category,' but no entry with that name exists.')
                }
            } else {
                console.log ('tried to find ',name,' in category ', category,' but that category does not exist');
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