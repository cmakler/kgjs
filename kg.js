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
    var Generator = (function () {
        function Generator(def, params) {
            this.def = def;
            this.params = params;
        }
        Generator.prototype.addToContainer = function (currentJSON) {
            return currentJSON;
        };
        return Generator;
    }());
    KG.Generator = Generator;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var ViewGenerator = (function () {
        function ViewGenerator(def, params) {
            this.def = def;
            this.params = params;
        }
        ViewGenerator.prototype.addToContainer = function (currentJSON) {
            return currentJSON;
        };
        return ViewGenerator;
    }());
    KG.ViewGenerator = ViewGenerator;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var Sliders = (function (_super) {
        __extends(Sliders, _super);
        function Sliders() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Sliders.prototype.addToContainer = function (currentJSON) {
            var sliders = this, paramNames = sliders.def.paramNames;
            var scales = [{
                    name: "y",
                    axis: "y",
                    domainMin: 0,
                    domainMax: 1,
                    rangeMin: 0,
                    rangeMax: 1
                }], segments = [], axes = [], points = [], labels = [];
            paramNames.forEach(function (paramName, index) {
                var param = sliders.params[paramName], y = (index + 0.5) / paramNames.length;
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
                    yScaleName: "y"
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
                                dragUpdateExpression: "params." + paramName + " + drag.dx"
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
                });
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
        };
        return Sliders;
    }(KG.ViewGenerator));
    KG.Sliders = Sliders;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var Graph = (function (_super) {
        __extends(Graph, _super);
        function Graph() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Graph.prototype.addToContainer = function (currentJSON) {
            var Graph = this, paramNames = Graph.def.paramNames;
            var scales = [{
                    name: "x",
                    axis: "x",
                    domainMin: 0,
                    domainMax: 1,
                    rangeMin: 0,
                    rangeMax: 1
                }], segments = [], axes = [], points = [], labels = [];
            paramNames.forEach(function (paramName, index) {
                var param = Graph.params[paramName], y = (index + 0.5) / paramNames.length;
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
                    yScaleName: "y"
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
                                dragUpdateExpression: "params." + paramName + " + drag.dx"
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
                });
            });
            currentJSON.views.push({
                dim: Graph.def.dim,
                scales: scales,
                objects: {
                    segments: segments,
                    axes: axes,
                    points: points,
                    labels: labels
                }
            });
            return currentJSON;
        };
        return Graph;
    }(KG.Generator));
    KG.Graph = Graph;
})(KG || (KG = {}));
/// <reference path="./kg.ts" />
var KG;
(function (KG) {
    var Container = (function () {
        function Container(div) {
            var container = this;
            div.style.position = 'relative';
            container.div = div;
            container.views = [];
            d3.json(div.getAttribute('src'), function (data) {
                // override params from JSON if there are attributes on the div with the same name
                for (var param in data.params) {
                    if (data.params.hasOwnProperty(param) && div.hasAttribute(param)) {
                        data.params[param].value = div.getAttribute(param);
                    }
                }
                var params = {};
                for (var paramName in data.params) {
                    if (data.params.hasOwnProperty(paramName)) {
                        params[paramName] = new KG.Param(data.params[paramName]);
                    }
                }
                if (data.hasOwnProperty('generators')) {
                    data.generators.forEach(function (generatorDef) {
                        var g = new KG[generatorDef.type](generatorDef.def, params);
                        data = g.addToContainer(data);
                    });
                }
                container.model = new KG.Model(params);
                container.aspectRatio = data.aspectRatio || 1;
                // create new view objects from data
                if (data.hasOwnProperty('views')) {
                    container.views = data.views.map(function (viewDef) {
                        viewDef.model = container.model;
                        viewDef.containerDiv = container.div;
                        return new KG.View(viewDef);
                    });
                }
                // establish dimensions of container and views
                container.updateDimensions();
            });
        }
        Container.prototype.updateDimensions = function () {
            var container = this;
            container.width = container.div.clientWidth;
            container.height = container.width / container.aspectRatio;
            container.div.style.height = container.height + 'px';
            container.views.forEach(function (v) {
                v.updateDimensions(container.width, container.height);
            });
            container.model.update(true);
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
            var params = this.params;
            var p = {};
            for (var paramName in params) {
                if (params.hasOwnProperty(paramName)) {
                    p[paramName] = isNaN(+params[paramName].value) ? params[paramName].value : +params[paramName].value;
                }
            }
            return p;
        };
        // the model serves as a model, and can evaluate expressions within the context of that model
        Model.prototype.eval = function (name) {
            var p = this.params;
            // don't just evaluate numbers
            if (!isNaN(+name)) {
                //console.log('interpreted ', name, 'as a number.');
                return +name;
            }
            else if (p.hasOwnProperty(name)) {
                //console.log('parsed', name, 'as a parameter');
                return p[name].value;
            }
            // collect current parameter values in a p object
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
        // method exposed to viewObjects to allow them to try to change a parameter
        Model.prototype.updateParam = function (name, newValue) {
            var model = this;
            if (model.params.hasOwnProperty(name)) {
                var oldValue = model.params[name].value;
                model.params[name].update(newValue);
                // if param has changed, propagate change to fields and children
                if (oldValue != model.params[name].value) {
                    model.update(false);
                }
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
            this.label = def.label || '';
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
            def = _.defaults(def, { updatables: [], constants: [] });
            def.constants.push('model', 'updatables');
            var ul = this;
            ul.def = def;
            def.constants.forEach(function (c) {
                ul[c] = def[c];
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
            def.constants = ['dragParam', 'dragUpdateExpression'];
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
            var _this = _super.call(this, def) || this;
            _this.dragUpdateListeners = def.dragUpdates.map(function (d) {
                d.model = def.model;
                return new KG.DragUpdateListener(d);
            });
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
            //console.log('finished dragging');
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
    var View = (function () {
        function View(def) {
            var v = this;
            v.dimensions = _.defaults(def.dim, { x: 0, y: 0, width: 1, height: 1 });
            // add div element as a child of the enclosing container
            v.div = d3.select(def.containerDiv).append("div")
                .style('position', 'absolute')
                .style('background-color', 'white');
            // add svg element as a child of the div
            v.svg = v.div.append("svg");
            // establish scales
            if (def.hasOwnProperty('scales')) {
                v.scales = {};
                for (var i = 0; i < def.scales.length; i++) {
                    var scaleDef = def.scales[i];
                    scaleDef.model = def.model;
                    v.scales[scaleDef.name] = new KG.Scale(scaleDef);
                }
            }
            // add child objects
            if (def.hasOwnProperty('objects')) {
                var prepareDef_1 = function (objectDef, layer) {
                    objectDef.view = v;
                    objectDef.model = def.model;
                    objectDef.layer = layer;
                    return objectDef;
                };
                var defLayer = v.svg.append('defs');
                if (def.objects.hasOwnProperty('segments')) {
                    var segmentLayer_1 = v.svg.append('g').attr('class', 'segments');
                    def.objects.segments.forEach(function (segmentDef) {
                        new KG.Segment(prepareDef_1(segmentDef, segmentLayer_1));
                    });
                }
                if (def.objects.hasOwnProperty('axes')) {
                    var axisLayer_1 = v.svg.append('g').attr('class', 'axes');
                    def.objects.axes.forEach(function (axisDef) {
                        new KG.Axis(prepareDef_1(axisDef, axisLayer_1));
                    });
                }
                if (def.objects.hasOwnProperty('points')) {
                    var pointLayer_1 = v.svg.append('g').attr('class', 'points');
                    def.objects.points.forEach(function (pointDef) {
                        new KG.Point(prepareDef_1(pointDef, pointLayer_1));
                    });
                }
                if (def.objects.hasOwnProperty('labels')) {
                    var labelLayer_1 = v.div.append('div').attr('class', 'labels');
                    def.objects.labels.forEach(function (labelDef) {
                        new KG.Label(prepareDef_1(labelDef, labelLayer_1));
                    });
                }
            }
        }
        View.prototype.updateDimensions = function (width, height) {
            var v = this, dim = v.dimensions, vx = (dim.x <= 1) ? dim.x * width : dim.x, vy = (dim.y <= 1) ? dim.y * height : dim.y, vw = (dim.width <= 1) ? dim.width * width : dim.width, vh = (dim.height <= 1) ? dim.height * height : dim.height;
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
            return v;
        };
        return View;
    }());
    KG.View = View;
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
            def.name = def.name || def.axis;
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
            def = _.defaults(def, { show: true });
            _this = _super.call(this, def) || this;
            var vo = _this;
            // the scales determine the coordinate system for this viewObject
            vo.xScale = def.view.scales[def.xScaleName];
            vo.yScale = def.view.scales[def.yScaleName];
            // the clip path clips the viewObject
            if (vo.hasOwnProperty('clipPath')) {
                vo.clipPath = def.view.clipPaths[def.clipPath];
            }
            // the interaction handler manages drag and hover events
            def.interaction = _.defaults(def.interaction || {}, {
                viewObject: vo,
                model: vo.model,
                dragUpdates: []
            });
            vo.interactionHandler = new KG.InteractionHandler(def.interaction);
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
            def.updatables = ['x1', 'y1', 'x2', 'y2', 'color'];
            _this = _super.call(this, def) || this;
            return _this;
        }
        Segment.prototype.draw = function (layer) {
            var segment = this;
            //initialize line
            segment.g = layer.append('g').attr('class', 'draggable');
            segment.dragLine = segment.g.append('line').attr('stroke-width', '20px').attr("class", "invisible");
            segment.line = segment.g.append('line').attr('stroke-width', '1px');
            segment.interactionHandler.addTrigger(segment.g);
            return segment;
        };
        Segment.prototype.update = function (force) {
            var segment = _super.prototype.update.call(this, force);
            if (segment.hasChanged) {
                segment.dragLine.attr("x1", segment.xScale.scale(segment.x1));
                segment.dragLine.attr("y1", segment.yScale.scale(segment.y1));
                segment.dragLine.attr("x2", segment.xScale.scale(segment.x2));
                segment.dragLine.attr("y2", segment.yScale.scale(segment.y2));
                segment.line.attr("x1", segment.xScale.scale(segment.x1));
                segment.line.attr("y1", segment.yScale.scale(segment.y1));
                segment.line.attr("x2", segment.xScale.scale(segment.x2));
                segment.line.attr("y2", segment.yScale.scale(segment.y2));
                segment.line.attr("stroke", segment.color);
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
                intercept: 0
            });
            def.updatables = ['ticks', 'intercept'];
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
            def.updatables = ['x', 'y'];
            _this = _super.call(this, def) || this;
            return _this;
        }
        Point.prototype.draw = function (layer) {
            var p = this;
            //initialize circle
            p.circle = layer.append('g')
                .attr('class', "draggable");
            p.circle.append('circle')
                .attr('class', "invisible")
                .attr('r', 20);
            p.circle.append('circle')
                .attr('class', "visible")
                .attr('r', 6.5);
            p.interactionHandler.addTrigger(p.circle);
            return p;
        };
        Point.prototype.update = function (force) {
            var p = _super.prototype.update.call(this, force);
            if (p.hasChanged) {
                p.circle.attr('transform', "translate(" + p.xScale.scale(p.x) + " " + p.yScale.scale(p.y) + ")");
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
            def.updatables = ['x', 'y', 'text'];
            def = _.defaults(def, {
                xPixelOffset: 0,
                yPixelOffset: 0,
                fontSize: 12
            });
            _this = _super.call(this, def) || this;
            return _this;
        }
        Label.prototype.draw = function (layer) {
            var label = this, def = label.def;
            label.xPixelOffset = def.xPixelOffset;
            label.yPixelOffset = def.yPixelOffset;
            label.element = layer.append('div')
                .attr('class', 'draggable')
                .style('position', 'absolute')
                .style('font-size', def.fontSize + 'pt');
            label.interactionHandler.addTrigger(label.element);
            return label;
        };
        Label.prototype.update = function (force) {
            var label = _super.prototype.update.call(this, force);
            if (label.hasChanged) {
                var labelX = label.element.style('left', label.xScale.scale(label.x) + (+label.xPixelOffset) + 'px');
                label.element.style('top', label.yScale.scale(label.y) + (+label.yPixelOffset) + 'px');
                console.log('redrawing katex');
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
/// <reference path="generators/generator.ts"/>
/// <reference path="generators/viewGenerator.ts"/>
/// <reference path="generators/sliders.ts"/>
/// <reference path="generators/graph.ts"/>
/// <reference path="container.ts"/>
/// <reference path="model/model.ts"/>
/// <reference path="model/param.ts" />
/// <reference path="model/updateListener.ts" />
/// <reference path="model/dragUpdateListener.ts" />
/// <reference path="model/interactionHandler.ts" />
/// <reference path="views/view.ts" />
/// <reference path="views/scale.ts" />
/// <reference path="views/viewObjects/viewObject.ts" />
/// <reference path="views/viewObjects/clipPath.ts" />
/// <reference path="views/viewObjects/segment.ts" />
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