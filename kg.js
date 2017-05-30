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
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var Scope = (function () {
        function Scope(scopeDef) {
            var scope = this;
            scope.root = d3.select("#" + scopeDef.containerId);
            scope.parent = scope.root.select("svg");
            scope.params = {};
            scope.children = [];
            scope.scale = 22;
            var _loop_1 = function (paramName) {
                if (scopeDef.params.hasOwnProperty(paramName)) {
                    //initialize parameter
                    var param_1 = new KG.Param(scopeDef.params[paramName]);
                    scope.params[paramName] = param_1;
                    //initialize all fields that display this param
                    scope.updateParamFields(paramName);
                    // set scrubbing behavior on any element that identifies itself as a control for this param
                    scope.root.selectAll("[data-name='" + paramName + "']").call(d3.drag()
                        .on('drag', function () {
                        scope.updateParam(paramName, param_1.positionToValue()(d3.event.x));
                    }));
                }
            };
            // initialize parameters
            for (var paramName in scopeDef.params) {
                _loop_1(paramName);
            }
            // draw backgraound grid (will replace with more general axis objects)
            var g = scope.parent.append('g').attr('class', "grid");
            for (var x = 0; x < 25; x++) {
                for (var y = 0; y < 10; y++) {
                    g.append('rect')
                        .attr('transform', "translate(" + x * scope.scale + ", " + y * scope.scale + ")")
                        .attr('width', scope.scale)
                        .attr('height', scope.scale);
                }
            }
            // initialize points by adding them to a point layer and to the scope's array of children
            var pointLayer = scope.parent.append('g').attr('class', 'points');
            scopeDef.objects.points.forEach(function (def) {
                scope.children.push(new KG.Point(scope, pointLayer, def));
            });
            // initialize labels by adding them to a label layer and to the scope's array of children
            var labelLayer = scope.parent.append('g').attr('class', 'labels');
            scopeDef.objects.labels.forEach(function (def) {
                scope.children.push(new KG.Label(scope, labelLayer, def));
            });
            scope.updateChildren();
            scope.updateCalculations();
            console.log('initialized scope object: ', scope);
        }
        // the scope serves as a scope, and can evaluate expressions within the context of that scope
        Scope.prototype.evaluate = function (name) {
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
        /* UPDATE CYCLE */
        // update cycle stage 1: user interaction sends an updateParam event to the scope
        Scope.prototype.updateParam = function (name, newValue) {
            var scope = this;
            if (scope.params.hasOwnProperty(name)) {
                var oldValue = scope.params[name].value;
                scope.params[name].update(newValue);
                // if param has changed, propagate change to fields and children
                if (oldValue != scope.params[name].value) {
                    scope.updateParamFields(name);
                    scope.updateChildren();
                    scope.updateCalculations();
                }
            }
        };
        // update cycle stage 2: all fields displaying the updated parameter show new value
        Scope.prototype.updateParamFields = function (paramName) {
            var scope = this;
            scope.root.selectAll("[data-name='" + paramName + "']").text(function () {
                return scope.params[paramName].formatted();
            });
        };
        // update cycle stage 3: coordinates of all objects are updated
        Scope.prototype.updateChildren = function () {
            this.children.forEach(function (child) {
                child.update();
            });
        };
        // update cycle stage 4: update text fields based on calculations
        Scope.prototype.updateCalculations = function () {
            var scope = this, elements = scope.root.selectAll("[calculation]"), precision = elements.attr('precision') || 0;
            elements.text(function () { return d3.format("." + precision + "f")(scope.evaluate(elements.attr('calculation'))); });
        };
        return Scope;
    }());
    KG.Scope = Scope;
})(KG || (KG = {}));
/// <reference path="scope.ts" />
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
/// <reference path="scope.ts" />
var KG;
(function (KG) {
    var View = (function () {
        function View(def) {
            this.def = def;
        }
        View.prototype.update = function () {
            return this;
        };
        return View;
    }());
    KG.View = View;
})(KG || (KG = {}));
/// <reference path="scope.ts" />
var KG;
(function (KG) {
    var ViewObject = (function () {
        function ViewObject(scope, layer, def) {
            this.scope = scope;
            this.layer = layer;
        }
        ViewObject.prototype.update = function () {
            return this;
        };
        return ViewObject;
    }());
    KG.ViewObject = ViewObject;
})(KG || (KG = {}));
/// <reference path="../scope.ts" />
var KG;
(function (KG) {
    var Point = (function (_super) {
        __extends(Point, _super);
        function Point(scope, layer, def) {
            var _this = _super.call(this, scope, layer, def) || this;
            var point = _this;
            point.x = def.x;
            point.y = def.y;
            //initialize circle
            point.circle = layer.append('g')
                .attr('class', "draggable")
                .call(d3.drag().on('drag', function () {
                point.scope.updateParam(point.x, d3.event.x / scope.scale);
                point.scope.updateParam(point.y, 10 - d3.event.y / scope.scale);
            }));
            point.circle.append('circle')
                .attr('class', "invisible")
                .attr('r', 20);
            point.circle.append('circle')
                .attr('class', "visible")
                .attr('r', 6.5);
            console.log('initialized point object: ', point);
            return _this;
        }
        Point.prototype.update = function () {
            var point = this;
            var x = point.scope.evaluate(point.x), y = point.scope.evaluate(point.y);
            point.circle.attr('transform', "translate(" + (x - 0.5) * point.scope.scale + " " + (10.5 - y) * point.scope.scale + ")");
            return point;
        };
        return Point;
    }(KG.ViewObject));
    KG.Point = Point;
})(KG || (KG = {}));
/// <reference path="../scope.ts" />
var KG;
(function (KG) {
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label(scope, layer, def) {
            var _this = _super.call(this, scope, layer, def) || this;
            var label = _this;
            label.x = def.x;
            label.y = def.y;
            label.text = def.text;
            //initialize text element (svg for now, will become KaTex)
            label.element = layer.append('text');
            console.log('initialized label object: ', label);
            return _this;
        }
        Label.prototype.update = function () {
            var label = this;
            label.element.attr('x', (label.scope.evaluate(label.x) - 0.5) * label.scope.scale);
            label.element.attr('y', (10.5 - label.scope.evaluate(label.y)) * label.scope.scale);
            label.element.text(label.scope.evaluate(label.text));
            return label;
        };
        return Label;
    }(KG.ViewObject));
    KG.Label = Label;
})(KG || (KG = {}));
/// <reference path="node_modules/@types/d3/index.d.ts"/>
/// <reference path="src/scope.ts"/>
/// <reference path="src/param.ts" />
/// <reference path="src/view.ts" />
/// <reference path="src/viewObject.ts" />
/// <reference path="src/viewObjects/point.ts" />
/// <reference path="src/viewObjects/label.ts" />
// initialize the diagram
var scopeDefs = [];
var kgDivs = d3.selectAll("[kg-src]");
kgDivs.attr('loaded', function () {
    d3.json(kgDivs.attr('kg-src'), function (data) {
        data.containerId = kgDivs.attr('id');
        var d = new KG.Scope(data);
    });
    return 'true';
});
//# sourceMappingURL=kg.js.map