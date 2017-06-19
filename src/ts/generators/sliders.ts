/// <reference path="../kg.ts" />

module KG {

    export interface SlidersDefinition {
        paramNames: string[];
        dim?: DimensionsDefinition;
    }

    export class Sliders extends Generator {

        addToContainer(currentJSON) {
            const sliders = this,
                paramNames: string[] = sliders.def.paramNames;
            let scales = [{
                    name: "y",
                    axis: "y",
                    domainMin: 0,
                    domainMax: 1,
                    rangeMin: 0,
                    rangeMax: 1
                }],
                segments = [],
                axes = [],
                points = [],
                labels = [];

            paramNames.forEach(function (paramName, index) {
                const param = sliders.params[paramName],
                    y = (index + 0.5) / paramNames.length
                scales.push({
                    name: paramName,
                    axis: "x",
                    domainMin: param.min,
                    domainMax: param.max,
                    rangeMin: 0.1,
                    rangeMax: 0.9
                });
                segments.push({
                    x1: param.min,
                    y1: 0,
                    x2: param.max,
                    y2: 0,
                    xScaleName: paramName,
                    yScaleName: "y",
                });
                axes.push({
                    xScaleName: paramName,
                    yScaleName: "y",
                    orient: "bottom",
                    intercept: y
                });
                points.push({
                    x: paramName,
                    y: y,
                    xScaleName: paramName,
                    yScaleName: "y",
                    interaction: {
                        dragUpdates: [
                            {
                                dragDirections: "x",
                                dragParam: paramName,
                                dragUpdateExpression: "params."+ paramName + " + drag.dx"
                            }
                        ]
                    }
                });
                labels.push({
                    x: paramName,
                    y: y,
                    text: "`${params." + paramName + "}`",
                    xScaleName: paramName,
                    yScaleName: "y",
                    xPixelOffset: 0,
                    yPixelOffset: 20,
                    fontSize: 8,
                    interaction: {
                        dragUpdates: [
                            {
                                dragDirections: "x",
                                dragParam: paramName,
                                dragUpdateExpression: "params." + paramName + " + drag.dx"
                            }
                        ]
                    }
                })

            });

            currentJSON.views.push({
                dim: sliders.def.dim,
                scales: scales,
                objects: {
                    segments: segments,
                    axes: axes,
                    points: points,
                    labels: labels
                }
            });

            return currentJSON;
        }

    }

}