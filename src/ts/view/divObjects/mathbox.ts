/// <reference path="../../kg.ts" />
module KG {

    export interface MathboxDefinition extends DivObjectDefinition {
        axes: { min: number; max: number; step: number; label: string; }[];
        objects: GeoGebraObjectDefinition[];
        params: string[];
    }

    declare function mathBox({})

    declare class MathBox {
    }

    export class Mathbox extends PositionedDiv {

        public mathbox;
        public camera;
        public mathboxView;

        constructor(def: MathboxDefinition) {
            setDefaults(def, {
                params: [],
                objects: [],
                axisLabels: []
            });
            setProperties(def, 'updatables', def.params);
            setProperties(def, 'constants', ['axes', 'params']);
            super(def);
        }

        // create div for mathbox
        draw(layer) {
            console.log('creating mathbox container');
            let div = this;
            div.rootElement = layer.append('div').style('position', 'absolute');
            return div;
        }

        render3d() {
            console.log('render3d called');
            let div = this;

            if (div.mathbox == undefined && div.rootElement.node().clientWidth > 10) {
                div.mathbox = mathBox({
                    plugins: ['core', 'controls', 'cursor', 'mathbox'],
                    controls: {klass: THREE.OrbitControls},
                    element: div.rootElement.node()
                });
                if (div.mathbox.fallback) throw "WebGL not supported";

                div.three = div.mathbox.three;
                div.three.renderer.setClearColor(new THREE.Color(0xFFFFFF), 1.0);
                div.mathbox.camera({proxy: true, position: [-4, 4, 2], eulerOrder: "xzy"});
            } else {
                return div;
            }

            let mathbox = div.mathbox;
            let three = div.three;

            var graphData, view;

            var functionText = "(x)^(0.5) * (y)^(0.5)";

            var pointText = "(1,1)";
            var priceText = "(1,1)";
            var traceX = 1, traceY = 1, traceZ = 1;
            var priceX = 1, priceY = 1;
            var budget = (priceX * traceX) + (priceY * traceY);

            div.a = 0.5;
            var xMin = 0, xMax = 5, yMin = 0, yMax = 5, zMin = 0, zMax = 5;

            div.updateGraphFunc = function () {
                var zFunc = function (x, y) {
                    return Math.pow(x * y, 0.5)
                };
                graphData.set("expr",
                    function (emit, x, y, i, j, t) {
                        emit(x, zFunc(x, y), y);
                    }
                );

                var tempString = pointText.replace(/\(|\)/g, " ");
                var tempArray = tempString.split(",");
                var tempPriceString = priceText.replace(/\(|\)/g, " ");
                var tempPriceArray = tempPriceString.split(",");

                traceX = Number(tempArray[0]);
                traceY = Number(tempArray[1]);
                traceZ = zFunc(traceX, traceY);
                priceX = Number(tempPriceArray[0]);
                priceY = Number(tempPriceArray[1]);
                budget = (priceX * traceX) + (priceY * traceY);
                tracePointData.set("data", [[traceX, traceZ, traceY]]);

                xCurveData.set("expr",
                    function (emit, x, i, t) {
                        emit(x, zFunc(x, traceY), traceY);
                    }
                );

                yCurveData.set("expr",
                    function (emit, y, j, t) {
                        emit(traceX, zFunc(traceX, y), y);
                    }
                );

                budgetCurveData.set("expr",
                    function (emit, x, y, t) {
                        emit((budget - priceX * x) / priceY, zFunc(x, (budget - priceX * x) / priceY), x);
                    }
                );
                utilityCurveData.set("expr",
                    function (emit, x, y, i, j, t) {
                        emit(zFunc(traceX, traceY) / x, zFunc(traceX, traceY), x);
                    }
                );

                view.set("range", [[xMin, xMax], [yMin, yMax], [zMin, zMax]]);
            };

            // end of updateGraph function ==============================================================


            var updateGraph = function () {
                div.updateGraphFunc();
            };


            view = mathbox.cartesian(
                {
                    range: [[xMin, xMax], [yMin, yMax], [zMin, zMax]],
                    scale: [2, 2, 2],
                }
            );

            var xAxis = view.axis({axis: 3, width: 8, detail: 40, color: "black"});
            var xScale = view.scale({axis: 3, divide: 10, nice: true, zero: true});
            var xTicks = view.ticks({width: 5, size: 15, color: "black", zBias: 2});
            var xFormat = view.format({digits: 2, font: "Arial", weight: "bold", style: "normal", source: xScale});
            var xTicksLabel = view.label({color: "black", zIndex: 1, offset: [0, 0], points: xScale, text: xFormat});

            var yAxis = view.axis({axis: 1, width: 8, detail: 40, color: "black"});
            var yScale = view.scale({axis: 1, divide: 5, nice: true, zero: false});
            var yTicks = view.ticks({width: 5, size: 15, color: "black", zBias: 2});
            var yFormat = view.format({digits: 2, font: "Arial", weight: "bold", style: "normal", source: yScale});
            var yTicksLabel = view.label({color: "black", zIndex: 1, offset: [0, 0], points: yScale, text: yFormat});

            var zAxis = view.axis({axis: 2, width: 8, detail: 40, color: "black"});
            var zScale = view.scale({axis: 2, divide: 5, nice: true, zero: false});
            var zTicks = view.ticks({width: 5, size: 15, color: "black", zBias: 2});
            var zFormat = view.format({digits: 2, style: "normal", source: zScale});
            var zTicksLabel = view.label({color: "black", zIndex: 1, offset: [0, 0], points: zScale, text: zFormat});

            view.grid({axes: [1, 3], width: 2, divideX: 20, divideY: 20, opacity: 0.3});

            var graphData = view.area({
                axes: [1, 3], channels: 3, width: 64, height: 64,
                expr: function (emit, x, y, i, j, t) {
                    var z = x * y;
                    emit(x, z, y);
                },
            });

            var graphVisible = true;
            var graphViewSolid = view.surface({
                points: graphData,
                color: "#D3D3D3",
                shaded: false,
                fill: true,
                lineX: false,
                lineY: false,
                opacity: 0.9,
                visible: graphVisible,
                width: 0
            });
            var graphViewWire = view.surface({
                points: graphData,
                color: "#A9A9A9", shaded: false, fill: false, lineX: true, lineY: true, visible: graphVisible, width: 2
            });

            var tracePointData = view.array({
                width: 1, channels: 3,
                data: [[1, 2, 3]],
            });

            var tracePointView = view.point({size: 20, color: "black", points: tracePointData, visible: true});

            var xCurveData = view.interval({
                axis: 1, channels: 3, width: 64,
            });
            var yCurveData = view.interval({
                axis: 3, channels: 3, width: 64,
            });
            var budgetCurveData = view.interval({
                axis: 1, channels: 3, width: 64,
            });
            var utilityCurveData = view.interval({
                axis: 1, channels: 3, width: 64,
            });

            var xCurveVisible = false;
            var xCurveView = view.line({
                points: xCurveData,
                color: "red", width: 20, visible: xCurveVisible,
            });
            var yCurveVisible = false;
            var yCurveView = view.line({
                points: yCurveData,
                color: "blue", width: 20, visible: yCurveVisible,
            });
            var budgetCurveVisible = true;
            var budgetCurveView = view.line({
                points: budgetCurveData,
                color: "green", width: 20, visible: budgetCurveVisible,
            });
            var utilityCurveVisible = false;
            var utilityCurveView = view.line({
                points: utilityCurveData,
                color: "purple", width: 20, visible: utilityCurveVisible,
            });

            var xPlaneData = view.area({
                axes: [1, 3], channels: 3, width: 2, height: 2,
                expr: function (emit, x, z, i, j, t) {
                    emit(x, z, traceY);
                },
            });

            var xPlaneVisible = false;
            var xPlaneView = view.surface({
                points: xPlaneData,
                color: "#ff0000", visible: xPlaneVisible, opacity: 0.5, zWrite: false
            });

            var yPlaneData = view.area({
                axes: [3, 2], channels: 3, width: 2, height: 2,
                expr: function (emit, y, z, i, j, t) {
                    emit(traceX, z, y);
                },
            });
            var yPlaneVisible = false;
            var yPlaneView = view.surface({
                points: yPlaneData,
                color: "#0000FF", visible: yPlaneVisible, opacity: 0.5, zWrite: false
            });

            div.updateGraphFunc();

            var toggle = function () {
                budgetCurveVisible = !budgetCurveVisible;
                budgetCurveView.set({visible: budgetCurveVisible});
                console.log('toggled!')
                updateGraph();
            }

            div.mathbox = mathbox;
        }

        redraw() {
            let div = super.redraw();
            console.log('called redraw')
            div.render3d();
            return div;
        }
    }
}