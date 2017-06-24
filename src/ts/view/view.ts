/// <reference path="../kg.ts" />

module KG {

    export interface ViewDefinition {
        aspectRatio: number;
        params?: ParamDefinition[];
        scales?: ScaleDefinition[];
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
        private aspectRatio: number;
        private scales: Scale[];

        constructor(div: Element, data: ViewDefinition) {

            let view = this;

            view.div = d3.select(div).style('position', 'relative');

            data.params = data.params || [];

            data.params = data.params.map(function (paramData) {
                if (div.hasAttribute(paramData.name)) {
                    paramData.value = div.getAttribute(paramData.name)
                }
                paramData.value = isNaN(+paramData.value) ? paramData.value : +paramData.value;
                return paramData;
            });

            view.model = new KG.Model(data.params.map(function (paramData) {
                return new Param(paramData)
            }));
            view.aspectRatio = data.aspectRatio || 1;

            // add svg element as a child of the div
            view.svg = view.div.append("svg");

            // establish scales
            if (data.hasOwnProperty('scales')) {
                view.scales = data.scales.map(function (scaleDef) {
                    scaleDef.model = view.model;
                    return new Scale(scaleDef);
                })
            }

            let prepareObject = function (objectdata, layer) {
                objectdata.model = view.model;
                objectdata.layer = layer;
                objectdata.xScale = view.getScale(objectdata.xScaleName);
                objectdata.yScale = view.getScale(objectdata.yScaleName);
                return objectdata;
            };

            const defLayer = view.svg.append('defs');

            if (data.hasOwnProperty('segments')) {
                let segmentLayer = view.svg.append('g').attr('class', 'segments');
                data.segments.forEach(function (segmentdata: SegmentDefinition) {
                    new Segment(prepareObject(segmentdata, segmentLayer));
                });
            }
            if (data.hasOwnProperty('axes')) {
                let axisLayer = view.svg.append('g').attr('class', 'axes');
                data.axes.forEach(function (axisdata: AxisDefinition) {
                    new Axis(prepareObject(axisdata, axisLayer));
                });
            }
            if (data.hasOwnProperty('points')) {
                let pointLayer = view.svg.append('g').attr('class', 'points');
                data.points.forEach(function (pointdata: PointDefinition) {
                    new Point(prepareObject(pointdata, pointLayer));
                });
            }
            if (data.hasOwnProperty('labels')) {
                let labelLayer = view.div.append('div').attr('class', 'labels');
                data.labels.forEach(function (labeldata: LabelDefinition) {
                    new Label(prepareObject(labeldata, labelLayer));
                });
            }

            // establish dimensions of view and views
            view.updateDimensions();

        }

        getScale(scaleName) {
            const scales = this.scales;
            for (let i = 0; i < scales.length; i++) {
                if (scales[i].name == scaleName) {
                    return scales[i];
                }
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