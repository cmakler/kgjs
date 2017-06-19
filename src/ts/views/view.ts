/// <reference path="../kg.ts" />

module KG {

    export interface DimensionsDefinition {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    }

    export interface ViewDefinition {
        containerDiv: HTMLDivElement;
        dim?: DimensionsDefinition;
        model: Model;
        scales: ScaleDefinition[];
        objects: {
            segments?: SegmentDefinition[];
            axes?: AxisDefinition[];
            points?: PointDefinition[];
            labels?: LabelDefinition[];
        };
    }

    export interface IView {
        dimensions: {
            x: number; // coordinate of left edge, as fraction of container width
            y: number; // coordinate of top edge, as fraction of container height
            width: number; // width of view, as fraction of container width
            height: number; // height of view, as fraction of container height
        }
        scales: any;
    }

    export class View implements IView {

        private div;        // root div of this view
        private svg;        // root svg of this view

        public dimensions;  // position, height, and width of this view (in pixels)
        public scales;      // scales associated with this view (if there are multiple graphs, could be multiple scales)


        constructor(def: ViewDefinition) {

            let v = this;
            v.dimensions = _.defaults(def.dim, {x: 0, y: 0, width: 1, height: 1});

            // add div element as a child of the enclosing container
            v.div = d3.select(def.containerDiv).append("div")
                .style('position', 'absolute')
                .style('background-color', 'white');

            // add svg element as a child of the div
            v.svg = v.div.append("svg");

            // establish scales
            if (def.hasOwnProperty('scales')) {
                v.scales = {};
                for (let i = 0; i < def.scales.length; i++) {
                    let scaleDef = def.scales[i];
                    scaleDef.model = def.model;
                    v.scales[scaleDef.name] = new Scale(scaleDef);
                }
            }

            // add child objects
            if (def.hasOwnProperty('objects')) {
                let prepareDef = function (objectDef, layer) {
                    objectDef.view = v;
                    objectDef.model = def.model;
                    objectDef.layer = layer;
                    return objectDef;
                };

                if (def.objects.hasOwnProperty('segments')) {
                    let segmentLayer = v.svg.append('g').attr('class', 'segments');
                    def.objects.segments.forEach(function (segmentDef:SegmentDefinition) {
                        new Segment(prepareDef(segmentDef, segmentLayer));
                    });
                }
                if (def.objects.hasOwnProperty('axes')) {
                    let axisLayer = v.svg.append('g').attr('class', 'axes');
                    def.objects.axes.forEach(function (axisDef: AxisDefinition) {
                        new Axis(prepareDef(axisDef, axisLayer));
                    });
                }
                if (def.objects.hasOwnProperty('points')) {
                    let pointLayer = v.svg.append('g').attr('class', 'points');
                    def.objects.points.forEach(function (pointDef: PointDefinition) {
                        new Point(prepareDef(pointDef, pointLayer));
                    });
                }
                if (def.objects.hasOwnProperty('labels')) {
                    let labelLayer = v.div.append('div').attr('class', 'labels');
                    def.objects.labels.forEach(function (labelDef: LabelDefinition) {
                        new Label(prepareDef(labelDef, labelLayer));
                    });
                }
            }

        }

        updateDimensions(left, top, width, height) {
            let v = this,
                dim = v.dimensions,
                vx = dim.x * width,
                vy = dim.y * height,
                vw = dim.width * width,
                vh = dim.height * height;
            v.div.style('left', left + vx + 'px');
            v.div.style('top', top + vy + 'px');
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
            return v;
        }

    }

}