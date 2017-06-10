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
        Model.prototype.addUpdateListener = function (updateListener) {
            this.updateListeners.push(updateListener);
            return this;
        };
        // the model serves as a model, and can evaluate expressions within the context of that model
        Model.prototype.eval = function (name) {
            var params = this.params;
            // don't just evaluate numbers
            if (typeof name == 'number') {
                //console.log('parsed', name, 'as a number');
                return name;
            }
            else if (params.hasOwnProperty(name)) {
                //console.log('parsed', name, 'as a parameter');
                return params[name].value;
            }
            // collect current parameter values in a p object
            var p = {};
            for (var paramName in params) {
                if (params.hasOwnProperty(paramName)) {
                    p[paramName] = params[paramName].value;
                }
            }
            // establish a function, usable by eval, that uses mathjs to parse a string in the context of p
            // TODO this isn't working; math.eval is "not available"
            var v = function (s) {
                return math.eval(s, p);
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
                    return eval(name);
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
                    model.update();
                }
            }
        };
        Model.prototype.update = function () {
            this.updateListeners.forEach(function (listener) {
                listener.update();
            });
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
    var UpdateListener = (function () {
        function UpdateListener(def) {
            this.def = def;
            this.model = def.model;
            this.model.addUpdateListener(this);
            this.updatables = def.updatables || [];
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
        UpdateListener.prototype.update = function () {
            var u = this;
            u.hasChanged = false;
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
    var View = (function () {
        function View(container, def) {
            var v = this;
            v.container = container;
            v.dimensions = _.defaults(def.dim, { x: 0, y: 0, width: 1, height: 1 });
            // add div element as a child of the enclosing container
            v.div = d3.select(container.div).append("div")
                .style('position', 'relative')
                .style('background-color', 'white');
            // add svg element as a child of the div
            v.svg = v.div.append("svg");
            // establish scales
            if (def.hasOwnProperty('scales')) {
                v.scales = {};
                for (var i = 0; i < def.scales.length; i++) {
                    var scaleDef = def.scales[i];
                    scaleDef.model = container.model;
                    v.scales[scaleDef.name] = new KG.Scale(scaleDef);
                }
            }
            // set initial dimensions of the div and svg
            v.updateDimensions();
            // add child objects
            if (def.hasOwnProperty('objects')) {
                //v.viewObjects = [];
                var prepareDef_1 = function (def, layer) {
                    def.view = v;
                    def.model = v.container.model;
                    def.layer = layer;
                    return def;
                };
                if (def.objects.hasOwnProperty('segments')) {
                    var segmentLayer_1 = v.svg.append('g').attr('class', 'segments').node();
                    def.objects.segments.forEach(function (segmentDef) {
                        new KG.Segment(prepareDef_1(segmentDef, segmentLayer_1));
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
    var Scale = (function (_super) {
        __extends(Scale, _super);
        function Scale(def) {
            var _this = this;
            def.updatables = ['domainMin', 'domainMax', 'rangeMin', 'rangeMax'];
            _this = _super.call(this, def) || this;
            _this.update();
            return _this;
        }
        Scale.prototype.scale = function (value) {
            var s = this;
            var percent = (value - s.domainMin) / (s.domainMax - s.domainMin);
            return (s.rangeMin + percent * (s.rangeMax - s.rangeMin)) * s.extent;
        };
        Scale.prototype.invert = function (pixels) {
            var s = this;
            var pixelMin = s.rangeMin * s.extent, pixelMax = s.rangeMax * s.extent;
            var percent = (pixels - pixelMin) / (pixelMax - pixelMin);
            return s.domainMin + percent * (s.domainMax - s.domainMin);
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
            var _this = _super.call(this, def) || this;
            var vo = _this;
            vo.xScale = def.view.scales[def.xScaleName];
            vo.yScale = def.view.scales[def.yScaleName];
            def.interaction = _.defaults(def.interaction || {}, {
                viewObject: vo,
                model: vo.model
            });
            vo.interactionHandler = new KG.InteractionHandler(def.interaction);
            vo.draw(def.layer).update();
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
    var InteractionHandler = (function (_super) {
        __extends(InteractionHandler, _super);
        function InteractionHandler(def) {
            var _this = this;
            def.updatables = ['xDrag', 'yDrag'];
            _this = _super.call(this, def) || this;
            _this.update();
            return _this;
        }
        InteractionHandler.prototype.onDrag = function (handler) {
            // get scaled x and y coordiantes of the drag event
            var coords = {
                x: handler.def.viewObject.xScale.invert(d3.event.x),
                y: handler.def.viewObject.yScale.invert(d3.event.y)
            };
            // if horizontal dragging enabled, update the xDragUpdateParam with the evaluated value of xDragUpdateValue
            if (handler.xDrag) {
                handler.model.updateParam(handler.def.xDragUpdateParam, math.eval(handler.def.xDragUpdateValue, coords));
            }
            // if vertical dragging enabled, update the yDragUpdateParam with the evaluated value of yDragUpdateValue
            if (handler.yDrag) {
                handler.model.updateParam(handler.def.yDragUpdateParam, math.eval(handler.def.yDragUpdateValue, coords));
            }
        };
        InteractionHandler.prototype.addTrigger = function (element) {
            var handler = this;
            element.call(d3.drag().on('drag', function () { handler.onDrag(handler); }));
        };
        return InteractionHandler;
    }(KG.UpdateListener));
    KG.InteractionHandler = InteractionHandler;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Axis = (function (_super) {
        __extends(Axis, _super);
        function Axis(def) {
            return _super.call(this, def) || this;
        }
        Axis.prototype.draw = function (layer) {
            var axis = this, def = axis.def;
            axis.line = def.layer.append('line')
                .attr('class', "axis");
            if (def.orientation == 'top' || def.orientation == 'bottom') {
                var intercept = def.intercept || axis.yScale.domainMin;
                axis.origin = { x: axis.xScale.domainMin, y: intercept };
                axis.end = { x: axis.xScale.domainMax, y: intercept };
            }
            else {
                var intercept = def.intercept || axis.xScale.domainMin;
                axis.origin = { x: intercept, y: axis.yScale.domainMin };
                axis.end = { x: intercept, y: axis.yScale.domainMax };
            }
            return axis;
        };
        Axis.prototype.update = function () {
            var axis = _super.prototype.update.call(this);
            if (axis.hasChanged) {
                console.log('redrawing axis');
                axis.line.attr('x1', axis.xScale.scale(axis.origin.x));
                axis.line.attr('y1', axis.yScale.scale(axis.origin.y));
                axis.line.attr('x2', axis.xScale.scale(axis.end.x));
                axis.line.attr('y2', axis.yScale.scale(axis.end.y));
            }
            return axis;
        };
        return Axis;
    }(KG.ViewObject));
    KG.Axis = Axis;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Segment = (function (_super) {
        __extends(Segment, _super);
        function Segment(def) {
            var _this = this;
            def.updatables = ['x1', 'y1', 'x2', 'y2'];
            _this = _super.call(this, def) || this;
            return _this;
        }
        Segment.prototype.draw = function (layer) {
            var segment = this;
            //initialize circle
            segment.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            segment.line.setAttributeNS(null, "stroke", "green");
            layer.append(segment.line);
            //segment.interactionHandler.addTrigger(segment.line);
            return segment;
        };
        Segment.prototype.update = function () {
            var segment = _super.prototype.update.call(this);
            if (segment.hasChanged) {
                segment.line.setAttributeNS(null, "x1", segment.xScale.scale(segment.x1));
                segment.line.setAttributeNS(null, "y1", segment.yScale.scale(segment.y1));
                segment.line.setAttributeNS(null, "x2", segment.xScale.scale(segment.x2));
                segment.line.setAttributeNS(null, "y2", segment.yScale.scale(segment.y2));
            }
            return segment;
        };
        return Segment;
    }(KG.ViewObject));
    KG.Segment = Segment;
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
            var point = this;
            //initialize circle
            point.circle = layer.append('g')
                .attr('class', "draggable");
            point.circle.append('circle')
                .attr('class', "invisible")
                .attr('r', 20);
            point.circle.append('circle')
                .attr('class', "visible")
                .attr('r', 6.5);
            point.interactionHandler.addTrigger(point.circle);
            return point;
        };
        Point.prototype.update = function () {
            var point = _super.prototype.update.call(this);
            if (point.hasChanged) {
                point.circle.attr('transform', "translate(" + point.xScale.scale(point.x) + " " + point.yScale.scale(point.y) + ")");
            }
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
                .style('position', 'absolute')
                .style('font-size', def.fontSize + 'pt');
            return label;
        };
        Label.prototype.update = function () {
            var label = _super.prototype.update.call(this);
            if (label.hasChanged) {
                label.element.style('left', label.xScale.scale(label.x) + label.xPixelOffset + 'px');
                label.element.style('top', label.yScale.scale(label.y) + label.yPixelOffset + 'px');
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
// / <reference path="../../node_modules/@types/d3/index.d.ts"/>
/// <reference path="../../node_modules/@types/mathjs/index.d.ts"/>
/// <reference path="lib/underscore.ts"/>
/// <reference path="container.ts"/>
/// <reference path="model/model.ts"/>
/// <reference path="model/param.ts" />
/// <reference path="model/updateListener.ts" />
/// <reference path="views/view.ts" />
/// <reference path="views/scale.ts" />
/// <reference path="views/viewObjects/viewObject.ts" />
/// <reference path="views/viewObjects/interactionHandler.ts" />
/// <reference path="views/compositeObjects/axis.ts" />
/// <reference path="views/viewObjects/segment.ts" />
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