var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="./kg.ts" />
var KG;
(function (KG) {
    var Container = (function () {
        function Container(div) {
            var container = this;
            container.div = div;
            container.views = [];
            d3.json(div.getAttribute('src'), function (data) {
                // override params from JSON if there are attributes on the div with the same name
                for (var param in data.params) {
                    if (data.params.hasOwnProperty(param) && div.hasAttribute(param)) {
                        data.params[param].value = div.getAttribute(param);
                    }
                }
                container.model = new KG.Model(data);
                container.aspectRatio = data.aspectRatio || 1;
                // establish container dimensions
                container.updateDimensions();
                // create new view objects from data
                if (data.hasOwnProperty('views')) {
                    container.views = data.views.map(function (viewDef) {
                        return new KG.View(container, viewDef);
                    });
                }
            });
        }
        Container.prototype.updateDimensions = function () {
            var container = this;
            container.width = container.div.clientWidth;
            container.height = container.width / container.aspectRatio;
            container.div.style.height = container.height + 'px';
            container.views.forEach(function (v) {
                v.updateDimensions();
            });
            return container;
        };
        return Container;
    }());
    KG.Container = Container;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var Model = (function () {
        function Model(modelDef) {
            var model = this;
            model.updateListeners = [];
            // initialize parameters
            model.params = {};
            for (var paramName in modelDef.params) {
                if (modelDef.params.hasOwnProperty(paramName)) {
                    model.params[paramName] = new KG.Param(modelDef.params[paramName]);
                }
            }
            model.update();
        }
        Model.prototype.addUpdateListener = function (viewObject) {
            this.updateListeners.push(viewObject);
            return this;
        };
        // the model serves as a model, and can evaluate expressions within the context of that model
        Model.prototype.eval = function (name) {
            console.log('getting current value of param ', name);
            var params = this.params;
            if (params.hasOwnProperty(name)) {
                return params[name].value;
            }
            try {
                var currentParamValues = {};
                for (var paramName in params) {
                    if (params.hasOwnProperty(paramName)) {
                        currentParamValues[paramName] = params[paramName].value;
                    }
                }
                return math.eval(name, currentParamValues);
            }
            catch (err) {
                return 'fail';
            }
        };
        // method exposed to viewObjects to allow them to try to change a parameter
        Model.prototype.updateParam = function (name, newValue) {
            var model = this;
            if (model.params.hasOwnProperty(name)) {
                var oldValue = model.params[name].value;
                model.params[name].update(newValue);
                // if param has changed, propagate change to fields and children
                if (oldValue != model.params[name].value) {
                    model.update();
                }
            }
        };
        Model.prototype.update = function () {
            this.updateListeners.forEach(function (listener) { listener.update(); });
        };
        return Model;
    }());
    KG.Model = Model;
    /*

    //initialize all fields that display this param
                    model.updateParamFields(paramName);

                    // set scrubbing behavior on any element that identifies itself as a control for this param
                    model.root.selectAll(`[data-name='${paramName}']`).call(d3.drag()
                        .on('drag', function () {
                            model.updateParam(paramName, param.positionToValue()(d3.event.x));
                        }));

    // update cycle stage 2: all fields displaying the updated parameter show new value
        updateParamFields(paramName) {
            let model = this;
            model.root.selectAll(`[data-name='${paramName}']`).text(() => {
                return model.params[paramName].formatted();
            });
        }

        // update cycle stage 3: coordinates of all objects are updated
        updateChildren() {
            this.children.forEach(function (child) {
                child.update()
            });
        }

        // update cycle stage 4: update text fields based on calculations
        updateCalculations() {
            let model = this,
                elements = model.root.selectAll(`[calculation]`);
            console.log(elements);
            if(elements.size() > 0) {
                let precision = elements.attr('precision') || 0;
            elements.text(() => d3.format(`.${precision}f`)(model.evaluate(elements.attr('calculation'))));}
        }*/
})(KG || (KG = {}));
/// <reference path="model.ts" />
var KG;
(function (KG) {
    var Param = (function () {
        function Param(def) {
            function decimalPlaces(numAsString) {
                var match = ('' + numAsString).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
                if (!match) {
                    return 0;
                }
                return Math.max(0, 
                // Number of digits right of decimal point.
                (match[1] ? match[1].length : 0)
                    - (match[2] ? +match[2] : 0));
            }
            this.value = def.value;
            this.min = def.min || 0;
            this.max = def.max || 10;
            this.round = def.round || 1;
            this.precision = def.precision || decimalPlaces(this.round.toString());
            console.log('initialized param object: ', this);
        }
        // Receives an instruction to update the parameter to a new value
        // Updates to the closest rounded value to the desired newValue within accepted range
        Param.prototype.update = function (newValue) {
            var param = this;
            if (newValue < param.min) {
                param.value = param.min;
            }
            else if (newValue > param.max) {
                param.value = param.max;
            }
            else {
                param.value = Math.round(newValue / param.round) * param.round;
            }
        };
        // Displays current value of the parameter to desired precision
        // If no precision is given, uses the implied precision given by the rounding parameter
        Param.prototype.formatted = function (precision) {
            precision = precision || this.precision;
            return d3.format("." + precision + "f")(this.value);
        };
        // Creates a D3 scale for use by a scrubbable number. Uses a domain of (-100,100) by default.
        Param.prototype.positionToValue = function (domain) {
            domain = domain || 100;
            var param = this;
            return d3.scaleLinear()
                .clamp(true)
                .domain([domain * -1, domain])
                .range([param.min, param.max]);
        };
        return Param;
    }());
    KG.Param = Param;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var View = (function () {
        function View(container, def) {
            var v = this;
            v.container = container;
            v.dimensions = _.defaults(def.dim, { x: 0, y: 0, width: 1, height: 1 });
            // add div element as a child of the enclosing container
            v.div = d3.select(container.div).append("div").style('position', 'relative').style('background-color', 'white');
            // add svg element as a child of the div
            v.svg = v.div.append("svg");
            // establish scales
            if (def.hasOwnProperty('scales')) {
                v.scales = {};
                for (var i = 0; i < def.scales.length; i++) {
                    v.scales[def.scales[i].name] = new KG.Scale(def.scales[i]);
                }
            }
            // set initial dimensions of the div and svg
            v.updateDimensions();
            // add child objects
            if (def.hasOwnProperty('objects')) {
                v.viewObjects = [];
                if (def.objects.hasOwnProperty('axes')) {
                    var pointLayer = v.svg.append('g').attr('class', 'axes');
                    for (var i = 0; i < def.objects.axes.length; i++) {
                        v.viewObjects.push(new KG.Axis(v, pointLayer, def.objects.axes[i]));
                    }
                }
                if (def.objects.hasOwnProperty('points')) {
                    var pointLayer = v.svg.append('g').attr('class', 'points');
                    for (var i = 0; i < def.objects.points.length; i++) {
                        v.viewObjects.push(new KG.Point(v, pointLayer, def.objects.points[i]));
                    }
                }
                if (def.objects.hasOwnProperty('labels')) {
                    var labelLayer = v.svg.append('g').attr('class', 'points');
                    for (var i = 0; i < def.objects.labels.length; i++) {
                        v.viewObjects.push(new KG.Label(v, labelLayer, def.objects.labels[i]));
                    }
                }
            }
        }
        View.prototype.updateDimensions = function () {
            var v = this, w = v.container.width, h = v.container.height, dim = v.dimensions, vx = dim.x * w, vy = dim.y * h, vw = dim.width * w, vh = dim.height * h;
            v.div.style('left', vx + 'px');
            v.div.style('top', vy + 'px');
            v.div.style('width', vw + 'px');
            v.div.style('height', vh + 'px');
            v.svg.style('width', vw);
            v.svg.style('height', vh);
            for (var scaleName in v.scales) {
                if (v.scales.hasOwnProperty(scaleName)) {
                    var s = v.scales[scaleName];
                    s.extent = (s.axis == 'x') ? vw : vh;
                }
            }
            ;
            v.container.model.update();
            return v;
        };
        return View;
    }());
    KG.View = View;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var Scale = (function () {
        function Scale(def) {
            var s = this;
            s.name = def.name;
            s.axis = def.axis;
            s.domain = def.domain;
            s.range = def.range;
        }
        Scale.prototype.scale = function (value) {
            var s = this;
            var percent = (value - s.domain.min) / (s.domain.max - s.domain.min);
            return (s.range.min + percent * (s.range.max - s.range.min)) * s.extent;
        };
        Scale.prototype.invert = function (pixels) {
            var s = this;
            var pixelMin = s.range.min * s.extent, pixelMax = s.range.max * s.extent;
            var percent = (pixels - pixelMin) / (pixelMax - pixelMin);
            return s.domain.min + percent * (s.domain.max - s.domain.min);
        };
        return Scale;
    }());
    KG.Scale = Scale;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var ViewObject = (function () {
        function ViewObject(view, layer, def) {
            var vo = this;
            vo.view = view;
            vo.model = view.container.model;
            vo.xScale = view.scales[def.xScaleName];
            vo.yScale = view.scales[def.yScaleName];
            view.container.model.addUpdateListener(vo);
        }
        ViewObject.prototype.update = function () {
            return this;
        };
        return ViewObject;
    }());
    KG.ViewObject = ViewObject;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Axis = (function (_super) {
        __extends(Axis, _super);
        function Axis(view, layer, def) {
            var _this = _super.call(this, view, layer, def) || this;
            var axis = _this;
            axis.line = layer.append('line')
                .attr('class', "axis");
            if (def.orientation == 'top' || def.orientation == 'bottom') {
                var intercept = def.intercept || axis.yScale.domain.min;
                axis.origin = { x: axis.xScale.domain.min, y: intercept };
                axis.end = { x: axis.xScale.domain.max, y: intercept };
            }
            else {
                var intercept = def.intercept || axis.xScale.domain.min;
                axis.origin = { x: intercept, y: axis.yScale.domain.min };
                axis.end = { x: intercept, y: axis.yScale.domain.max };
            }
            axis.update();
            console.log('initialized axis object: ', axis);
            return _this;
        }
        Axis.prototype.update = function () {
            var axis = this;
            axis.line.attr('x1', axis.xScale.scale(axis.model.eval(axis.origin.x)));
            axis.line.attr('y1', axis.yScale.scale(axis.model.eval(axis.origin.y)));
            axis.line.attr('x2', axis.xScale.scale(axis.model.eval(axis.end.x)));
            axis.line.attr('y2', axis.yScale.scale(axis.model.eval(axis.end.y)));
            return axis;
        };
        return Axis;
    }(KG.ViewObject));
    KG.Axis = Axis;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Point = (function (_super) {
        __extends(Point, _super);
        function Point(view, layer, def) {
            var _this = _super.call(this, view, layer, def) || this;
            var point = _this;
            point.x = def.x;
            point.y = def.y;
            //initialize circle
            point.circle = layer.append('g')
                .attr('class', "draggable")
                .call(d3.drag().on('drag', function () {
                point.model.updateParam(point.x, point.xScale.invert(d3.event.x));
                point.model.updateParam(point.y, point.yScale.invert(d3.event.y));
            }));
            point.circle.append('circle')
                .attr('class', "invisible")
                .attr('r', 20);
            point.circle.append('circle')
                .attr('class', "visible")
                .attr('r', 6.5);
            point.update();
            console.log('initialized point object: ', point);
            return _this;
        }
        Point.prototype.update = function () {
            var point = this;
            var x = point.xScale.scale(point.model.eval(point.x)), y = point.yScale.scale(point.model.eval(point.y));
            point.circle.attr('transform', "translate(" + x + " " + y + ")");
            return point;
        };
        return Point;
    }(KG.ViewObject));
    KG.Point = Point;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label(view, layer, def) {
            var _this = _super.call(this, view, layer, def) || this;
            var label = _this;
            label.x = def.x;
            label.y = def.y;
            label.text = def.text;
            //initialize text element (svg for now, will become KaTex)
            label.element = layer.append('text');
            console.log('initialized label object: ', label);
            label.update();
            return _this;
        }
        Label.prototype.update = function () {
            var label = this;
            label.element.attr('x', label.xScale.scale(label.model.eval(label.x)));
            label.element.attr('y', label.yScale.scale(label.model.eval(label.y)));
            label.element.text(label.model.eval(label.text));
            return label;
        };
        return Label;
    }(KG.ViewObject));
    KG.Label = Label;
})(KG || (KG = {}));
/// <reference path="../../node_modules/@types/d3/index.d.ts"/>
/// <reference path="../../node_modules/@types/mathjs/index.d.ts"/>
/// <reference path="../../node_modules/@types/underscore/index.d.ts"/>
/// <reference path="container.ts"/>
/// <reference path="model/model.ts"/>
/// <reference path="model/param.ts" />
/// <reference path="views/view.ts" />
/// <reference path="views/scale.ts" />
/// <reference path="views/viewObjects/viewObject.ts" />
/// <reference path="views/viewObjects/axis.ts" />
/// <reference path="views/viewObjects/point.ts" />
/// <reference path="views/viewObjects/label.ts" />
// this file provides the interface with the overall web page
// initialize the diagram from divs with class kg-container
var containerDivs = document.getElementsByClassName('kg-container'), containers = [];
for (var i = 0; i < containerDivs.length; i++) {
    containers.push(new KG.Container(containerDivs[i]));
}
// if the window changes size, update the dimensions of the containers
window.onresize = function () {
    containers.forEach(function (c) { c.updateDimensions(); });
};
//# sourceMappingURL=kg.js.map