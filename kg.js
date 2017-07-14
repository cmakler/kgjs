/// <reference path="../../kg.ts" />
'use strict';
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
/*

 from underscorejs

 Copyright (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative
 Reporters & Editors

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.*/
// These are the (very few) functions I use from the amazing underscorejs library.
var _;
(function (_) {
    function isObject(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    }
    function allKeys(obj) {
        if (!isObject(obj))
            return [];
        var keys = [];
        for (var key in obj)
            keys.push(key);
        return keys;
    }
    _.allKeys = allKeys;
    // An internal function for creating assigner functions.
    function createAssigner(keysFunc, undefinedOnly) {
        return function (obj) {
            var length = arguments.length;
            if (length < 2 || obj == null)
                return obj;
            for (var index = 1; index < length; index++) {
                var source = arguments[index], keys = keysFunc(source), l = keys.length;
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    if (!undefinedOnly || obj[key] === void 0)
                        obj[key] = source[key];
                }
            }
            return obj;
        };
    }
    _.defaults = createAssigner(allKeys, true);
})(_ || (_ = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var View = (function () {
        function View(div, data) {
            var view = this;
            view.div = d3.select(div).style('position', 'relative');
            data.params = data.params || [];
            data.params = data.params.map(function (paramData) {
                if (div.hasAttribute(paramData.name)) {
                    paramData.value = div.getAttribute(paramData.name);
                }
                paramData.value = isNaN(+paramData.value) ? paramData.value : +paramData.value;
                return paramData;
            });
            view.model = new KG.Model(data.params.map(function (paramData) {
                return new KG.Param(paramData);
            }));
            view.aspectRatio = data.aspectRatio || 1;
            // add svg element as a child of the div
            view.svg = view.div.append("svg");
            // establish scales
            if (data.hasOwnProperty('scales')) {
                view.scales = data.scales.map(function (def) {
                    def.model = view.model;
                    return new KG.Scale(def);
                });
            }
            else {
                view.scales = [];
            }
            // establish drag update listeners
            if (data.hasOwnProperty('dragUpdates')) {
                view.dragUpdates = data.dragUpdates.map(function (def) {
                    def.model = view.model;
                    return new KG.DragUpdateListener(def);
                });
            }
            else {
                view.dragUpdates = [];
            }
            var prepareDef = function (def, layer) {
                def.model = view.model;
                def.layer = layer;
                def.dragUpdateNames = def.dragUpdateNames || [];
                def.xScale = view.getByName("scales", def.xScaleName);
                def.yScale = view.getByName("scales", def.yScaleName);
                def.dragUpdates = def.dragUpdateNames.map(function (name) { return view.getByName("dragUpdates", name); });
                return def;
            };
            var defLayer = view.svg.append('defs');
            if (data.hasOwnProperty('segments')) {
                var segmentLayer_1 = view.svg.append('g').attr('class', 'segments');
                data.segments.forEach(function (def) {
                    new KG.Segment(prepareDef(def, segmentLayer_1));
                });
            }
            if (data.hasOwnProperty('axes')) {
                var axisLayer_1 = view.svg.append('g').attr('class', 'axes');
                data.axes.forEach(function (def) {
                    new KG.Axis(prepareDef(def, axisLayer_1));
                });
            }
            if (data.hasOwnProperty('points')) {
                var pointLayer_1 = view.svg.append('g').attr('class', 'points');
                data.points.forEach(function (def) {
                    new KG.Point(prepareDef(def, pointLayer_1));
                });
            }
            if (data.hasOwnProperty('labels')) {
                var labelLayer_1 = view.div.append('div').attr('class', 'labels');
                data.labels.forEach(function (def) {
                    new KG.Label(prepareDef(def, labelLayer_1));
                });
            }
            // establish dimensions of view and views
            view.updateDimensions();
        }
        View.prototype.getByName = function (category, name) {
            var objs = this[category];
            for (var i = 0; i < objs.length; i++) {
                if (objs[i].name == name) {
                    return objs[i];
                }
            }
        };
        View.prototype.updateDimensions = function () {
            var view = this;
            var width = view.div.node().clientWidth, height = width / view.aspectRatio;
            view.div.style.height = height + 'px';
            view.svg.style('width', width);
            view.svg.style('height', height);
            view.scales.forEach(function (scale) {
                scale.extent = (scale.axis == 'x') ? width : height;
            });
            view.model.update(true);
            return view;
        };
        return View;
    }());
    KG.View = View;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var Model = (function () {
        function Model(params) {
            var model = this;
            model.params = params;
            model.updateListeners = [];
        }
        Model.prototype.addUpdateListener = function (updateListener) {
            this.updateListeners.push(updateListener);
            return this;
        };
        Model.prototype.currentParamValues = function () {
            var p = {};
            this.params.forEach(function (param) {
                p[param.name] = param.value;
            });
            return p;
        };
        // the model serves as a model, and can evaluate expressions within the context of that model
        Model.prototype.eval = function (name) {
            var p = this.params;
            // don't just evaluate numbers
            if (!isNaN(parseFloat(name))) {
                //console.log('interpreted ', name, 'as a number.');
                return parseFloat(name);
            }
            // collect current parameter values in a params object
            var params = this.currentParamValues();
            // establish a function, usable by eval, that uses mathjs to parse a string in the context of p
            var v = function (s) {
                var compiledMath = math.compile(s);
                var parsedMath = compiledMath.eval();
                return parsedMath;
            };
            // try to evaluate using mathjs
            try {
                var result = v(name);
                //console.log('parsed', name, 'as a pure math expression with value', result);
                return result;
            }
            catch (err) {
                // if that doesn't work, try to evaluate using native js eval
                //console.log('unable to parse', name, 'as a pure math function, trying general eval');
                try {
                    var result = eval(name);
                    //console.log('parsed', name, 'as an expression with value', result);
                    return result;
                }
                catch (err) {
                    // if that doesn't work, try to evaluate using native js eval
                    //console.log('unable to parse', name,'as a valid expression; generates error:', err.message);
                    return name;
                }
            }
        };
        Model.prototype.getParam = function (paramName) {
            var params = this.params;
            for (var i = 0; i < params.length; i++) {
                if (params[i].name == paramName) {
                    return params[i];
                }
            }
        };
        // method exposed to viewObjects to allow them to try to change a parameter
        Model.prototype.updateParam = function (name, newValue) {
            var model = this, param = model.getParam(name);
            var oldValue = param.value;
            param.update(newValue);
            // if param has changed, propagate change to fields and children
            if (oldValue != param.value) {
                model.update(false);
            }
        };
        Model.prototype.update = function (force) {
            this.updateListeners.forEach(function (listener) {
                listener.update(force);
            });
        };
        return Model;
    }());
    KG.Model = Model;
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
            def = _.defaults(def, { min: 0, max: 10, round: 1 });
            this.name = def.name;
            this.label = def.label || '';
            this.value = parseFloat(def.value);
            this.min = parseFloat(def.min);
            this.max = parseFloat(def.max);
            this.round = parseFloat(def.round);
            this.precision = parseInt(def.precision) || decimalPlaces(this.round.toString());
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
            return param.value;
        };
        // Displays current value of the parameter to desired precision
        // If no precision is given, uses the implied precision given by the rounding parameter
        Param.prototype.formatted = function (precision) {
            precision = precision || this.precision;
            return d3.format("." + precision + "f")(this.value);
        };
        // Creates a D3 scale for use by a scrubbable number. Uses a domain of (-100,100) by default.
        Param.prototype.paramScale = function (domain) {
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
    var UpdateListener = (function () {
        function UpdateListener(def) {
            def.updatables = def.updatables || [];
            def.constants = (def.constants || []).concat(['model', 'updatables']);
            var ul = this;
            ul.def = def;
            def.constants.forEach(function (c) {
                ul[c] = isNaN(parseFloat(def[c])) ? def[c] : +def[c];
            });
            ul.model.addUpdateListener(this);
        }
        UpdateListener.prototype.updateDef = function (name) {
            var u = this;
            if (u.def.hasOwnProperty(name)) {
                var d = u.def[name], initialValue = u[name];
                var newValue = u.model.eval(d);
                if (initialValue != newValue) {
                    u.hasChanged = true;
                    u[name] = newValue;
                    console.log(u.constructor['name'], name, 'changed from', initialValue, 'to', newValue);
                }
            }
            return u;
        };
        UpdateListener.prototype.update = function (force) {
            var u = this;
            u.hasChanged = !!force;
            u.updatables.forEach(function (name) { u.updateDef(name); });
            return u;
        };
        return UpdateListener;
    }());
    KG.UpdateListener = UpdateListener;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var DragUpdateListener = (function (_super) {
        __extends(DragUpdateListener, _super);
        function DragUpdateListener(def) {
            var _this = this;
            def.updatables = ['draggable', 'dragDirections'];
            def.constants = ['dragParam', 'dragUpdateExpression', 'name'];
            def = _.defaults(def, { dragDirections: "xy" });
            _this = _super.call(this, def) || this;
            return _this;
        }
        DragUpdateListener.prototype.updateDrag = function (scope) {
            var d = this;
            if (d.dragDirections.length > 0) {
                var compiledMath = math.compile(d.dragUpdateExpression);
                var parsedMath = compiledMath.eval(scope);
                d.model.updateParam(d.dragParam, parsedMath);
            }
        };
        return DragUpdateListener;
    }(KG.UpdateListener));
    KG.DragUpdateListener = DragUpdateListener;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var InteractionHandler = (function (_super) {
        __extends(InteractionHandler, _super);
        function InteractionHandler(def) {
            var _this = this;
            def.constants = ["dragUpdateListeners"];
            _this = _super.call(this, def) || this;
            _this.update(true);
            _this.scope = { params: {}, drag: {} };
            return _this;
        }
        InteractionHandler.prototype.update = function (force) {
            var ih = _super.prototype.update.call(this, force);
            // first update dragUpdateListeners
            if (ih.hasChanged && ih.hasOwnProperty('dragUpdateListeners') && (ih.element != undefined)) {
                var xDrag_1 = false, yDrag_1 = false;
                ih.dragUpdateListeners.forEach(function (dul) {
                    dul.update(force);
                    if (dul.dragDirections == "x") {
                        xDrag_1 = true;
                    }
                    else if (dul.dragDirections == "y") {
                        yDrag_1 = true;
                    }
                    else if (dul.dragDirections == "xy") {
                        xDrag_1 = true;
                        yDrag_1 = true;
                    }
                });
                ih.element.style("pointer-events", (xDrag_1 || yDrag_1) ? "all" : "none");
                ih.element.style("cursor", (xDrag_1 && yDrag_1) ? "move" : xDrag_1 ? "ew-resize" : "ns-resize");
            }
            return ih;
        };
        InteractionHandler.prototype.startDrag = function (handler) {
            handler.scope.params = handler.model.currentParamValues();
            handler.scope.drag.x0 = handler.def.viewObject.xScale.scale.invert(d3.event.x);
            handler.scope.drag.y0 = handler.def.viewObject.yScale.scale.invert(d3.event.y);
        };
        InteractionHandler.prototype.onDrag = function (handler) {
            var drag = handler.scope.drag;
            drag.x = handler.def.viewObject.xScale.scale.invert(d3.event.x);
            drag.y = handler.def.viewObject.yScale.scale.invert(d3.event.y);
            drag.dx = drag.x - drag.x0;
            drag.dy = drag.y - drag.y0;
            handler.dragUpdateListeners.forEach(function (d) {
                d.updateDrag(handler.scope);
            });
        };
        InteractionHandler.prototype.endDrag = function (handler) {
            //handler.element.style("cursor","default");
        };
        InteractionHandler.prototype.addTrigger = function (element) {
            var handler = this;
            handler.element = element;
            element.call(d3.drag()
                .on('start', function () {
                handler.startDrag(handler);
            })
                .on('drag', function () {
                handler.onDrag(handler);
            })
                .on('end', function () {
                handler.endDrag(handler);
            }));
            handler.update(true);
        };
        return InteractionHandler;
    }(KG.UpdateListener));
    KG.InteractionHandler = InteractionHandler;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var Scale = (function (_super) {
        __extends(Scale, _super);
        function Scale(def) {
            var _this = this;
            def.constants = ['rangeMin', 'rangeMax', 'axis', 'name'];
            def.updatables = ['domainMin', 'domainMax'];
            _this = _super.call(this, def) || this;
            _this.scale = d3.scaleLinear();
            _this.update(true);
            return _this;
        }
        Scale.prototype.update = function (force) {
            var s = _super.prototype.update.call(this, force);
            if (s.extent != undefined) {
                var rangeMin = s.rangeMin * s.extent, rangeMax = s.rangeMax * s.extent;
                s.scale.domain([s.domainMin, s.domainMax]);
                s.scale.range([rangeMin, rangeMax]);
            }
            return s;
        };
        return Scale;
    }(KG.UpdateListener));
    KG.Scale = Scale;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var ViewObject = (function (_super) {
        __extends(ViewObject, _super);
        function ViewObject(def) {
            var _this = this;
            def.updatables = (def.updatables || []).concat('fill', 'stroke', 'strokeWidth', 'opacity', 'strokeOpacity');
            def.constants = (def.constants || []).concat(['xScale', 'yScale', 'clipPath', 'name']);
            def = _.defaults(def, { show: true });
            _this = _super.call(this, def) || this;
            var vo = _this;
            // the interaction handler manages drag and hover events
            vo.interactionHandler = new KG.InteractionHandler({
                viewObject: vo,
                model: vo.model,
                dragUpdateListeners: def.dragUpdates || []
            });
            // the draw method creates the DOM elements for the view object
            // the update method updates their attributes
            vo.draw(def.layer).update(true);
            return _this;
        }
        ViewObject.prototype.draw = function (layer) {
            return this;
        };
        return ViewObject;
    }(KG.UpdateListener));
    KG.ViewObject = ViewObject;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var ClipPath = (function (_super) {
        __extends(ClipPath, _super);
        function ClipPath() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ClipPath.prototype.draw = function (layer) {
            var cp = this;
            layer.append("clipPath").attr("id", cp.name);
            return cp;
        };
        ClipPath.prototype.update = function (force) {
            var cp = _super.prototype.update.call(this, force);
            return cp;
        };
        return ClipPath;
    }(KG.ViewObject));
    KG.ClipPath = ClipPath;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Segment = (function (_super) {
        __extends(Segment, _super);
        function Segment(def) {
            var _this = this;
            // establish property defaults
            def = _.defaults(def, {
                color: 'black',
                width: '1pt',
                updatables: []
            });
            // define updatable properties
            def.updatables = def.updatables.concat(['x1', 'y1', 'x2', 'y2', 'color', 'width']);
            _this = _super.call(this, def) || this;
            return _this;
        }
        // create SVG elements
        Segment.prototype.draw = function (layer) {
            var segment = this;
            segment.g = layer.append('g').attr('class', 'draggable');
            segment.dragLine = segment.g.append('line').attr('stroke-width', '20px').attr("class", "invisible");
            segment.line = segment.g.append('line');
            segment.interactionHandler.addTrigger(segment.g);
            return segment;
        };
        // update properties
        Segment.prototype.update = function (force) {
            var segment = _super.prototype.update.call(this, force);
            if (segment.hasChanged) {
                var x1 = segment.xScale.scale(segment.x1), x2 = segment.xScale.scale(segment.x2), y1 = segment.yScale.scale(segment.y1), y2 = segment.yScale.scale(segment.y2), color = segment.color, width = segment.width;
                segment.dragLine.attr("x1", x1);
                segment.dragLine.attr("y1", y1);
                segment.dragLine.attr("x2", x2);
                segment.dragLine.attr("y2", y2);
                segment.line.attr("x1", x1);
                segment.line.attr("y1", y1);
                segment.line.attr("x2", x2);
                segment.line.attr("y2", y2);
                segment.line.attr("stroke", color);
                segment.line.attr('stroke-width', width);
            }
            return segment;
        };
        return Segment;
    }(KG.ViewObject));
    KG.Segment = Segment;
})(KG || (KG = {}));
var KG;
(function (KG) {
    var Axis = (function (_super) {
        __extends(Axis, _super);
        function Axis(def) {
            var _this = this;
            def = _.defaults(def, {
                ticks: 5,
                intercept: 0,
                updatables: []
            });
            def.updatables = def.updatables.concat(['ticks', 'intercept']);
            _this = _super.call(this, def) || this;
            return _this;
        }
        Axis.prototype.draw = function (layer) {
            var a = this;
            a.g = layer.append('g').attr('class', 'axis');
            return a;
        };
        Axis.prototype.update = function (force) {
            var a = _super.prototype.update.call(this, force);
            switch (a.def.orient) {
                case 'bottom':
                    a.g.attr('transform', "translate(0, " + a.yScale.scale(a.intercept) + ")");
                    a.g.call(d3.axisBottom(a.xScale.scale).ticks(a.ticks));
                    return a;
                case 'left':
                    a.g.attr('transform', "translate(" + a.xScale.scale(a.intercept) + ",0)");
                    a.g.call(d3.axisLeft(a.yScale.scale).ticks(a.ticks));
            }
            return a;
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
        function Point(def) {
            var _this = this;
            // establish property defaults
            def = _.defaults(def, {
                fill: 'blue',
                opacity: 1,
                stroke: 'white',
                strokeWidth: 1,
                strokeOpacity: 1,
                r: 6.5,
                updatables: []
            });
            // define updatable properties
            def.updatables = def.updatables.concat(['x', 'y', 'r']);
            _this = _super.call(this, def) || this;
            return _this;
        }
        // create SVG elements
        Point.prototype.draw = function (layer) {
            var p = this;
            p.g = layer.append('g').attr('class', "draggable"); // SVG group
            p.dragCircle = p.g.append('circle').style('fill-opacity', 0).attr('r', 20);
            p.circle = p.g.append('circle');
            p.interactionHandler.addTrigger(p.g);
            return p;
        };
        // update properties
        Point.prototype.update = function (force) {
            var p = _super.prototype.update.call(this, force);
            if (p.hasChanged) {
                //updated property values
                var x = p.xScale.scale(p.x), y = p.yScale.scale(p.y), r = p.r;
                //assign property values to SVG attributes
                p.g.attr('transform', "translate(" + x + " " + y + ")");
                p.circle.attr('r', p.r);
                p.circle.style('fill', p.fill);
                p.circle.style('opacity', p.opacity);
                p.circle.style('stroke', p.stroke);
                p.circle.style('stroke-width', p.strokeWidth + "px");
                p.circle.style('stroke-opacity', p.strokeOpacity);
            }
            return p;
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
        function Label(def) {
            var _this = this;
            //establish property defaults
            def = _.defaults(def, {
                xPixelOffset: 0,
                yPixelOffset: 0,
                fontSize: 12,
                updatables: [],
                constants: []
            });
            // define constant and updatable properties
            def.constants = def.constants.concat(['xPixelOffset', 'yPixelOffset', 'fontSize']);
            def.updatables = def.updatables.concat(['x', 'y', 'text']);
            _this = _super.call(this, def) || this;
            return _this;
        }
        // create div for text
        Label.prototype.draw = function (layer) {
            var label = this;
            label.element = layer.append('div')
                .attr('class', 'draggable')
                .style('position', 'absolute')
                .style('font-size', label.fontSize + 'pt');
            label.interactionHandler.addTrigger(label.element);
            return label;
        };
        // update properties
        Label.prototype.update = function (force) {
            var label = _super.prototype.update.call(this, force);
            if (label.hasChanged) {
                var x = label.xScale.scale(label.x) + (+label.xPixelOffset), y = label.yScale.scale(label.y) + (+label.yPixelOffset);
                label.element.style('left', x + 'px');
                label.element.style('top', y + 'px');
                katex.render(label.text, label.element.node());
            }
            return label;
        };
        return Label;
    }(KG.ViewObject));
    KG.Label = Label;
})(KG || (KG = {}));
/// <reference path="../../node_modules/@types/katex/index.d.ts"/>
/// <reference path="../../node_modules/@types/d3/index.d.ts"/>
/// <reference path="../../node_modules/@types/mathjs/index.d.ts"/>
/// <reference path="lib/underscore.ts"/>
/// <reference path="view/view.ts"/>
/// <reference path="model/model.ts"/>
/// <reference path="model/param.ts" />
/// <reference path="model/updateListener.ts" />
/// <reference path="controller/dragUpdateListener.ts" />
/// <reference path="controller/interactionHandler.ts" />
/// <reference path="view/scale.ts" />
/// <reference path="view/viewObjects/viewObject.ts" />
/// <reference path="view/viewObjects/clipPath.ts" />
/// <reference path="view/viewObjects/segment.ts" />
/// <reference path="view/viewObjects/axis.ts" />
/// <reference path="view/viewObjects/point.ts" />
/// <reference path="view/viewObjects/label.ts" />
// this file provides the interface with the overall web page
// initialize the diagram from divs with class kg-container
var viewDivs = document.getElementsByClassName('kg-container'), views = [];
var _loop_1 = function (i) {
    d3.json(viewDivs[i].getAttribute('src'), function (data) {
        views.push(new KG.View(viewDivs[i], data));
    });
};
for (var i = 0; i < viewDivs.length; i++) {
    _loop_1(i);
}
// if the window changes size, update the dimensions of the containers
window.onresize = function () {
    views.forEach(function (c) { c.updateDimensions(); });
};
//# sourceMappingURL=kg.js.map