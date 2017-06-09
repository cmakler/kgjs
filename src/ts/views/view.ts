/// <reference path="../kg.ts" />

module KG {

    export interface DimensionsDefinition {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    }

    export interface ViewDefinition {
        dim?: DimensionsDefinition;
        scales: ScaleDefinition[];
        objects: {
            axes?: AxisDefinition[]
            points?: PointDefinition[];
            labels?: LabelDefinition[];
        };
    }

    export interface IView {
        //container: Container;
        dimensions: {
            x: number; // coordinate of left edge, as fraction of container width
            y: number; // coordinate of top edge, as fraction of container height
            width: number; // width of view, as fraction of container width
            height: number; // height of view, as fraction of container height
        }
        scales: any;
    }

    export class View implements IView {

        private div;         // root div of this view
        private svg;         // root svg of this view

        private container;   // container object that contains this view, and also the model
        public dimensions;  // position, height, and width of this view (in pixels)
        public scales;      // scales associated with this view (if there are multiple graphs, could be multiple scales)


        constructor(container: Container, def: ViewDefinition) {

            let v = this;
            v.container = container;
            v.dimensions = _.defaults(def.dim, {x: 0, y: 0, width: 1, height: 1});

            // add div element as a child of the enclosing container
            v.div = d3.select(container.div).append("div")
                .style('position', 'relative')
                .style('background-color', 'white');

            // add svg element as a child of the div
            v.svg = v.div.append("svg");

            // establish scales
            if (def.hasOwnProperty('scales')) {
                v.scales = {};
                for (let i = 0; i < def.scales.length; i++) {
                    let scaleDef = def.scales[i];
                    scaleDef.model = container.model;
                    v.scales[scaleDef.name] = new Scale(scaleDef);
                }
            }

            // set initial dimensions of the div and svg
            v.updateDimensions();

            // add child objects
            if (def.hasOwnProperty('objects')) {
                //v.viewObjects = [];

                let prepareDef = function (def, layer) {
                    def.view = v;
                    def.model = v.container.model;
                    def.layer = layer;
                    return def;
                };

                if (def.objects.hasOwnProperty('axes')) {
                    let axisLayer = v.svg.append('g').attr('class', 'axes');
                    def.objects.axes.forEach(function (axisDef) {
                        new Axis(prepareDef(axisDef, axisLayer));
                    });
                }
                if (def.objects.hasOwnProperty('points')) {
                    let pointLayer = v.svg.append('g').attr('class', 'points');
                    def.objects.points.forEach(function (pointDef) {
                        new Point(prepareDef(pointDef, pointLayer));
                    });
                }
                if (def.objects.hasOwnProperty('labels')) {
                    let labelLayer = v.div.append('div').attr('class', 'labels');
                    def.objects.labels.forEach(function (labelDef) {
                        new Label(prepareDef(labelDef, labelLayer));
                    });
                }
            }

        }

        updateDimensions() {
            let v = this,
                w = v.container.width,
                h = v.container.height,
                dim = v.dimensions,
                vx = dim.x * w,
                vy = dim.y * h,
                vw = dim.width * w,
                vh = dim.height * h;
            v.div.style('left', vx + 'px');
            v.div.style('top', vy + 'px');
            v.div.style('width', vw + 'px');
            v.div.style('height', vh + 'px');
            v.svg.style('width', vw);
            v.svg.style('height', vh);
            for (let scaleName in v.scales) {
                if (v.scales.hasOwnProperty(scaleName)) {
                    let s = v.scales[scaleName];
                    s.extent = (s.axis == 'x') ? vw : vh;
                }
            }
            v.container.model.update();
            return v;
        }

    }

}