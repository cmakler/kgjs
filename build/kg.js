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
// I adapted these functions from the amazing underscorejs library.
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
    function defaults(obj, def) {
        if (def == null || obj == null)
            return obj;
        var keys = allKeys(def), l = keys.length;
        for (var i = 0; i < l; i++) {
            var key = keys[i];
            if (obj[key] === void 0)
                obj[key] = def[key];
        }
        return obj;
    }
    _.defaults = defaults;
})(_ || (_ = {}));
// End of underscorejs functions 
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var View = (function () {
        function View(div, data) {
            data.params = (data.params || []).map(function (paramData) {
                // allow author to override initial parameter values by specifying them as div attributes
                if (div.hasAttribute(paramData.name)) {
                    paramData.value = div.getAttribute(paramData.name);
                }
                // convert numerical params from strings to numbers
                paramData.value = isNaN(+paramData.value) ? paramData.value : +paramData.value;
                return paramData;
            });
            var view = this;
            view.div = d3.select(div).style('position', 'relative');
            view.svg = view.div.append("svg").style("overflow", "visible").style("pointer-events", "none");
            var defLayer = view.svg.append("defs");
            view.aspectRatio = data.aspectRatio || 1;
            view.model = new KG.Model(data.params, data.restrictions);
            view.legends = [];
            var REF_CATEGORIES = [
                {
                    category: 'xScales',
                    className: 'Scale',
                    propName: 'xScale',
                    refName: 'xScaleName'
                },
                {
                    category: 'yScales',
                    className: 'Scale',
                    propName: 'yScale',
                    refName: 'yScaleName'
                },
                {
                    category: 'univariateFunctions',
                    className: 'UnivariateFunction',
                    propName: 'univariateFunctions',
                    refName: 'univariateFunctionNames'
                }
            ];
            var STORED_CATEGORIES = ['xScales', 'yScales'];
            var VIEW_OBJECT_CATEGORIES = [
                {
                    name: 'clipPaths',
                    parent: 'defs',
                    element: '',
                    className: 'ClipPath'
                },
                {
                    name: 'curves',
                    parent: 'svg',
                    element: 'g',
                    className: 'Curve'
                },
                {
                    name: 'segments',
                    parent: 'svg',
                    element: 'g',
                    className: 'Segment'
                },
                {
                    name: 'axes',
                    parent: 'svg',
                    element: 'g',
                    className: 'Axis'
                },
                {
                    name: 'points',
                    parent: 'svg',
                    element: 'g',
                    className: 'Point'
                },
                {
                    name: 'labels',
                    parent: 'div',
                    element: 'div',
                    className: 'Label'
                },
                {
                    name: 'legends',
                    parent: 'div',
                    element: 'div',
                    className: 'Legend'
                }
            ];
            /*
             Each REF_CATEGORY is a category of REF -- e.g., a scale or a function.
             Each REF is a JS object that is used by viewable objects, but has no DOM representation.
             This next part of the code reads each category of REF and generates the appropriate REF objects.
             Each REF has a name that is unique within its category; the global key for each REF is category_name.
             For example, an xAxis REF named 'good1' would now be referred to as 'refs.xAxis_good1.'
             */
            var refs = {};
            REF_CATEGORIES.forEach(function (refDef) {
                if (data.hasOwnProperty(refDef.category)) {
                    data[refDef.category].forEach(function (def) {
                        // each object has a reference to the model so it can update itself
                        def.model = view.model;
                        // create the object
                        var newRef = new KG[refDef.className](def);
                        // add the object, with a unique name, to the refs object
                        refs[refDef.category + '_' + def.name] = newRef;
                        // store some categories (e.g., scales) as properties of the view
                        STORED_CATEGORIES.forEach(function (category) {
                            view[category] = view[category] || [];
                            if (refDef.category == category) {
                                view[category].push(newRef);
                            }
                        });
                    });
                }
            });
            /*
             Each VIEW_OBJECT_CATEGORY is a category of a viewObject -- e.g., a point or a segment.
             Each category is allocated a "layer" in the SVG (or div).
             As each is created, it adds elements to the DOM within that layer.
             Once the diagram is completed, only the attributes of the DOM change; no new elements are added.
             */
            VIEW_OBJECT_CATEGORIES.forEach(function (voCategoryDef) {
                if (data.hasOwnProperty(voCategoryDef.name)) {
                    // Create the DOM parent for the category
                    var layer_1 = (voCategoryDef.parent == 'defs') ? defLayer : view[voCategoryDef.parent].append(voCategoryDef.element).attr('class', voCategoryDef.name);
                    // Create a JS object for each element of the category by creating its definition object
                    data[voCategoryDef.name].forEach(function (def) {
                        // each object has a reference to the model so it can update itself
                        def.model = view.model;
                        // each object is assigned its category's "layer" in the SVG (or div).
                        def.layer = layer_1;
                        // a clip path is both a layer and a ref; needs to be handled separately from other REFs.
                        if (def.hasOwnProperty('clipPathName')) {
                            def.clipPath = refs["clipPaths_" + def.clipPathName];
                        }
                        // point to previously created REFs in each category of REF
                        REF_CATEGORIES.forEach(function (ref) {
                            if (!def.hasOwnProperty(ref.refName))
                                return;
                            if (def[ref.refName] instanceof Array) {
                                def[ref.propName] = def[ref.refName].map(function (name) {
                                    return refs[ref.category + '_' + name];
                                });
                            }
                            else {
                                def[ref.propName] = refs[ref.category + '_' + def[ref.refName]];
                            }
                        });
                        // use the definition object to create the ViewObject
                        var newViewObject = new KG[voCategoryDef.className](def);
                        // if the object is a legend, append to view.legends
                        if (voCategoryDef.className == 'Legend') {
                            view.legends.push(newViewObject);
                        }
                        // a clip path is both a layer and a ref; need to store them to refs
                        if (voCategoryDef.className == 'ClipPath') {
                            refs['clipPaths_' + def.name] = newViewObject;
                        }
                    });
                }
            });
            view.updateDimensions();
        }
        // update dimensions, either when first rendering or when the window is resized
        View.prototype.updateDimensions = function () {
            var view = this;
            // read the client width of the enclosing div and calculate the height using the aspectRatio
            var width = view.div.node().clientWidth;
            console.log(width);
            if (width > 563 && view.legends.length > 0) {
                view.legends.forEach(function (legend) { legend.positionRight(width); });
                width = width * 77 / 126; // make width of graph the same width as main Tufte column
            }
            else {
                view.legends.forEach(function (legend) { legend.positionBelow(); });
            }
            var height = width / view.aspectRatio;
            // set the height of the div
            view.div.style.height = height + 'px';
            // set the dimensions of the svg
            view.svg.style('width', width);
            view.svg.style('height', height);
            // adjust all of the scales to be proportional to the new dimensions
            view.xScales.forEach(function (scale) {
                scale.extent = width;
            });
            view.yScales.forEach(function (scale) {
                scale.extent = height;
            });
            // once the scales are updated, update the coordinates of all view objects
            view.model.update(true);
        };
        return View;
    }());
    KG.View = View;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var Model = (function () {
        function Model(params, restrictions) {
            var model = this;
            model.params = params.map(function (def) { return new KG.Param(def); });
            model.restrictions = (restrictions || []).map(function (def) { return new KG.Restriction(def); });
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
            // don't just evaluate numbers
            if (!isNaN(parseFloat(name))) {
                //console.log('interpreted ', name, 'as a number.');
                return parseFloat(name);
            }
            // collect current parameter values in a params object
            var params = this.currentParamValues();
            // try to evaluate using mathjs
            try {
                var compiledMath = math.compile(name);
                var result = compiledMath.eval({ params: params });
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
            // if param has changed, check to make sure the change is val
            if (oldValue != param.value) {
                var valid_1 = true;
                model.restrictions.forEach(function (r) {
                    if (!r.valid(model)) {
                        valid_1 = false;
                    }
                    ;
                });
                if (valid_1) {
                    model.update(false);
                }
                else {
                    param.update(oldValue);
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
            def = _.defaults(def, { min: 0, max: 10, round: 1 });
            this.name = def.name;
            this.label = def.label || '';
            this.value = parseFloat(def.value);
            this.min = parseFloat(def.min);
            this.max = parseFloat(def.max);
            this.round = parseFloat(def.round);
            this.precision = parseInt(def.precision) || decimalPlaces(this.round.toString());
            //console.log('initialized param object: ', this);
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
/// <reference path="model.ts" />
var KG;
(function (KG) {
    var Restriction = (function () {
        function Restriction(def) {
            this.expression = def.expression;
            this.type = def.type;
            this.min = def.min;
            this.max = def.max;
        }
        Restriction.prototype.valid = function (model) {
            var r = this, value = model.eval(r.expression), min = model.eval(r.min), max = model.eval(r.max);
            return (value >= min && value <= max);
        };
        return Restriction;
    }());
    KG.Restriction = Restriction;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var UpdateListener = (function () {
        function UpdateListener(def) {
            function randomString(length) {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i = 0; i < length; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }
            def.constants = (def.constants || []).concat(['model', 'updatables', 'name']);
            var ul = this;
            ul.def = def;
            def.constants.forEach(function (c) {
                ul[c] = isNaN(parseFloat(def[c])) ? def[c] : +def[c];
            });
            ul.id = randomString(5);
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
                    //console.log(u.constructor['name'],name,'changed from',initialValue,'to',newValue);
                }
            }
            return u;
        };
        UpdateListener.prototype.update = function (force) {
            var u = this;
            u.hasChanged = !!force;
            if (u.hasOwnProperty('updatables') && u.updatables != undefined) {
                u.updatables.forEach(function (name) { u.updateDef(name); });
            }
            return u;
        };
        return UpdateListener;
    }());
    KG.UpdateListener = UpdateListener;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var UnivariateFunction = (function (_super) {
        __extends(UnivariateFunction, _super);
        function UnivariateFunction(def) {
            var _this = this;
            // establish property defaults
            def = _.defaults(def, {
                ind: 'x',
                samplePoints: 50,
                constants: [],
                updatables: []
            });
            // define updatable properties
            def.constants = def.constants.concat(['samplePoints', 'ind', 'fn']);
            def.updatables = def.updatables.concat(['min', 'max']);
            _this = _super.call(this, def) || this;
            _this.compiledFunction = math.compile(def.fn);
            return _this;
        }
        UnivariateFunction.prototype.eval = function (input) {
            var fn = this;
            fn.scope = fn.scope || { params: fn.model.currentParamValues() };
            fn.scope[fn.ind] = input;
            return fn.compiledFunction.eval(fn.scope);
        };
        UnivariateFunction.prototype.dataPoints = function (min, max) {
            var fn = this, data = [];
            min = fn.min || min;
            max = fn.max || max;
            for (var i = 0; i < fn.samplePoints + 1; i++) {
                var a = i / fn.samplePoints, input = a * min + (1 - a) * max, output = fn.eval(input);
                data.push((fn.ind == 'x') ? { x: input, y: output } : { x: output, y: input });
            }
            return data;
        };
        UnivariateFunction.prototype.update = function (force) {
            var fn = _super.prototype.update.call(this, force);
            fn.scope = { params: fn.model.currentParamValues() };
            return fn;
        };
        return UnivariateFunction;
    }(KG.UpdateListener));
    KG.UnivariateFunction = UnivariateFunction;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    /*

        A listener is defined by a param and an expression.
        When the interactionHandler senses a change, it generates a scope of the current state of the model.
        The listener then determines the current value of its expression within the context of that scope,
        and sends a signal to the model to update its param.

     */
    var Listener = (function (_super) {
        __extends(Listener, _super);
        function Listener(def) {
            var _this = this;
            def = _.defaults(def, { constants: [], updatables: [] });
            def.updatables = def.updatables.concat(['expression']);
            def.constants = def.constants.concat(['param']);
            _this = _super.call(this, def) || this;
            return _this;
        }
        Listener.prototype.onChange = function (scope) {
            var l = this, compiledMath = math.compile(l.expression);
            var parsedMath = compiledMath.eval(scope);
            l.model.updateParam(l.param, parsedMath);
        };
        return Listener;
    }(KG.UpdateListener));
    KG.Listener = Listener;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    /*

        A DragListener is a special kind of Listener that listens for drag events.
        In addition to a param and an expression, it has properties for whether it is draggable
        and, if so, in which directions it is draggable.

     */
    var DragListener = (function (_super) {
        __extends(DragListener, _super);
        function DragListener(def) {
            var _this = this;
            def = _.defaults(def, {
                directions: "xy",
                updatables: []
            });
            def.updatables = def.updatables.concat(['draggable', 'directions']);
            _this = _super.call(this, def) || this;
            return _this;
        }
        DragListener.prototype.update = function (force) {
            var dl = _super.prototype.update.call(this, force);
            if (!dl.def.hasOwnProperty('draggable')) {
                dl.draggable = (dl.directions.length > 0);
            }
            return dl;
        };
        return DragListener;
    }(KG.Listener));
    KG.DragListener = DragListener;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var ClickListener = (function (_super) {
        __extends(ClickListener, _super);
        function ClickListener(def) {
            return _super.call(this, def) || this;
        }
        return ClickListener;
    }(KG.Listener));
    KG.ClickListener = ClickListener;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var InteractionHandler = (function (_super) {
        __extends(InteractionHandler, _super);
        function InteractionHandler(def) {
            var _this = this;
            def = _.defaults(def, { constants: [], dragListeners: [], clickListeners: [] });
            def.constants = def.constants.concat(["viewObject", "dragListeners", "clickListeners"]);
            _this = _super.call(this, def) || this;
            _this.update(true);
            _this.scope = { params: {}, drag: {} };
            return _this;
        }
        InteractionHandler.prototype.update = function (force) {
            var ih = _super.prototype.update.call(this, force);
            // first update dragListeners
            if (ih.hasChanged && ih.hasOwnProperty('dragListeners') && (ih.element != undefined)) {
                var xDrag_1 = false, yDrag_1 = false;
                ih.dragListeners.forEach(function (dul) {
                    dul.update(force);
                    if (dul.directions == "x") {
                        xDrag_1 = true;
                    }
                    else if (dul.directions == "y") {
                        yDrag_1 = true;
                    }
                    else if (dul.directions == "xy") {
                        xDrag_1 = true;
                        yDrag_1 = true;
                    }
                });
                ih.element.style("pointer-events", (xDrag_1 || yDrag_1) ? "all" : "none");
                ih.element.style("cursor", (xDrag_1 && yDrag_1) ? "move" : xDrag_1 ? "ew-resize" : "ns-resize");
            }
            return ih;
        };
        InteractionHandler.prototype.addTrigger = function (element) {
            var handler = this;
            handler.element = element;
            // add click listeners
            if (handler.clickListeners.length > 0) {
                element.on("click", function () {
                    if (d3.event.defaultPrevented)
                        return; //dragged)
                    handler.scope.params = handler.model.currentParamValues();
                    handler.clickListeners.forEach(function (d) {
                        d.onChange(handler.scope);
                    });
                });
            }
            // add drag listeners
            if (handler.dragListeners.length > 0) {
                element.call(d3.drag()
                    .on('start', function () {
                    handler.scope.params = handler.model.currentParamValues();
                    handler.scope.drag.x0 = handler.viewObject.xScale.scale.invert(d3.event.x);
                    handler.scope.drag.y0 = handler.viewObject.yScale.scale.invert(d3.event.y);
                })
                    .on('drag', function () {
                    var drag = handler.scope.drag;
                    drag.x = handler.viewObject.xScale.scale.invert(d3.event.x);
                    drag.y = handler.viewObject.yScale.scale.invert(d3.event.y);
                    drag.dx = drag.x - drag.x0;
                    drag.dy = drag.y - drag.y0;
                    handler.dragListeners.forEach(function (d) {
                        d.onChange(handler.scope);
                    });
                })
                    .on('end', function () {
                    //handler.element.style("cursor","default");
                }));
            }
            handler.update(true);
        };
        return InteractionHandler;
    }(KG.UpdateListener));
    KG.InteractionHandler = InteractionHandler;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var DivObject = (function (_super) {
        __extends(DivObject, _super);
        function DivObject(def) {
            var _this = this;
            def = _.defaults(def, {
                updatables: [],
                constants: [],
                show: true
            });
            _this = _super.call(this, def) || this;
            var divObj = _this;
            // the draw method creates the DOM elements for the view object
            // the update method updates their attributes
            if (def.hasOwnProperty('layer')) {
                divObj.draw(def.layer).update(true);
            }
            return _this;
        }
        DivObject.prototype.draw = function (layer) {
            return this;
        };
        return DivObject;
    }(KG.UpdateListener));
    KG.DivObject = DivObject;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Slider = (function (_super) {
        __extends(Slider, _super);
        function Slider(def) {
            var _this = this;
            // establish property defaults
            def = _.defaults(def, {
                value: 'params.' + def.param,
                noAxis: false,
                constants: [],
                updatables: []
            });
            // define constant and updatable properties
            def.constants = def.constants.concat(['param', 'noAxis']);
            def.updatables = def.updatables.concat(['label', 'value']);
            _this = _super.call(this, def) || this;
            return _this;
        }
        Slider.prototype.draw = function (layer) {
            var slider = this;
            slider.element = layer.append('tr');
            var param = slider.model.getParam(slider.param);
            slider.labelElement = slider.element.append('td')
                .style('font-size', '14pt');
            slider.numberInput = slider.element.append('td').append('input')
                .attr('type', 'number')
                .attr('min', param.min)
                .attr('max', param.max)
                .attr('step', param.round)
                .style('font-size', '14pt')
                .style('border', 'none')
                .style('background', 'none')
                .style('padding-left', '5px')
                .style('font-family', 'KaTeX_Main');
            slider.numberInput.on("input", function () {
                slider.model.updateParam(slider.param, +this.value);
            });
            slider.rangeInput = slider.element.append('td').append('input')
                .attr('type', 'range')
                .attr('min', param.min)
                .attr('max', param.max)
                .attr('step', param.round);
            slider.rangeInput.on("input", function () {
                slider.model.updateParam(slider.param, +this.value);
            });
            return slider;
        };
        // update properties
        Slider.prototype.update = function (force) {
            var slider = _super.prototype.update.call(this, force);
            if (slider.hasChanged) {
                katex.render(slider.label + " = ", slider.labelElement.node());
                slider.numberInput.property('value', slider.value.toFixed(slider.model.getParam(slider.param).precision));
                slider.rangeInput.property('value', slider.value);
            }
            return slider;
        };
        return Slider;
    }(KG.DivObject));
    KG.Slider = Slider;
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
            def = _.defaults(def, {
                updatables: [],
                constants: [],
                interactive: true,
                stroke: 'black',
                strokeWidth: 1,
                show: true
            });
            def.updatables = def.updatables.concat('fill', 'stroke', 'strokeWidth', 'opacity', 'strokeOpacity');
            def.constants = def.constants.concat(['xScale', 'yScale', 'clipPath']);
            _this = _super.call(this, def) || this;
            var vo = _this;
            // the interaction handler manages drag and hover events
            if (def.interactive) {
                def.drag = def.drag || [];
                var dragListeners = def.drag.map(function (dragDef) {
                    dragDef.model = vo.model;
                    return new KG.DragListener(dragDef);
                });
                def.click = def.click || [];
                var clickListeners = def.click.map(function (clickDef) {
                    clickDef.model = vo.model;
                    return new KG.ClickListener(clickDef);
                });
                vo.interactionHandler = new KG.InteractionHandler({
                    viewObject: vo,
                    model: vo.model,
                    dragListeners: dragListeners,
                    clickListeners: clickListeners
                });
            }
            // the draw method creates the DOM elements for the view object
            // the update method updates their attributes
            if (def.hasOwnProperty('layer')) {
                vo.draw(def.layer).update(true);
            }
            return _this;
        }
        ViewObject.prototype.addClipPath = function (g) {
            var vo = this;
            if (vo.hasOwnProperty('clipPath') && vo.clipPath != undefined) {
                g.attr('clip-path', "url(#" + vo.clipPath.id + ")");
            }
        };
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
    var Legend = (function (_super) {
        __extends(Legend, _super);
        function Legend(def) {
            var _this = this;
            // establish property defaults
            def = _.defaults(def, {
                constants: [],
                updatables: []
            });
            // define updatable properties
            def.constants = def.constants.concat(['sliders']);
            def.updatables = def.updatables.concat(['title', 'description']);
            _this = _super.call(this, def) || this;
            return _this;
        }
        Legend.prototype.positionRight = function (width) {
            var legend = this;
            legend.element
                .style('position', 'absolute')
                .style('left', width * 847 / 1260 + 'px')
                .style('top', '0px')
                .style('width', width * 385 / 1260 + 'px');
        };
        Legend.prototype.positionBelow = function () {
            var legend = this;
            legend.element
                .style('position', null)
                .style('left', null)
                .style('width', null);
        };
        Legend.prototype.addSlider = function (sliderDef) {
        };
        // create div for text
        Legend.prototype.draw = function (layer) {
            var legend = this;
            legend.element = layer.append('div').style('position', 'absolute');
            legend.titleElement = legend.element.append('p').style('width', '100%').append('span').attr('class', 'newthought');
            legend.descriptionElement = legend.element.append('div');
            var sliderTable = legend.element.append('table').style('padding', '10px');
            legend.sliders.forEach(function (slider) {
                new KG.Slider({ layer: sliderTable, param: slider.param, label: slider.label, model: legend.model });
            });
            return legend;
        };
        // update properties
        Legend.prototype.update = function (force) {
            var legend = _super.prototype.update.call(this, force);
            if (legend.hasChanged) {
                legend.titleElement.text(legend.title.toLowerCase());
                legend.descriptionElement.text(legend.description);
            }
            return legend;
        };
        return Legend;
    }(KG.ViewObject));
    KG.Legend = Legend;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var ClipPath = (function (_super) {
        __extends(ClipPath, _super);
        function ClipPath(def) {
            return _super.call(this, def) || this;
        }
        // create SVG elements
        ClipPath.prototype.draw = function (layer) {
            var cp = this;
            //console.log('drawing clipPath with id', cp.id);
            cp.clipPath = layer.append('clipPath').attr('id', cp.id);
            cp.rect = cp.clipPath.append('rect');
            return cp;
        };
        // update properties
        ClipPath.prototype.update = function (force) {
            var cp = _super.prototype.update.call(this, force);
            if (cp.hasChanged) {
                var x1 = cp.xScale.scale(cp.xScale.domainMin), y1 = cp.yScale.scale(cp.yScale.domainMin), x2 = cp.xScale.scale(cp.xScale.domainMax), y2 = cp.yScale.scale(cp.yScale.domainMax);
                cp.rect.attr('x', Math.min(x1, x2));
                cp.rect.attr('y', Math.min(y1, y2));
                cp.rect.attr('width', Math.abs(x2 - x1));
                cp.rect.attr('height', Math.abs(y2 - y1));
            }
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
                updatables: []
            });
            // define updatable properties
            def.updatables = def.updatables.concat(['x1', 'y1', 'x2', 'y2']);
            _this = _super.call(this, def) || this;
            return _this;
        }
        // create SVG elements
        Segment.prototype.draw = function (layer) {
            var segment = this;
            segment.g = layer.append('g');
            segment.dragLine = segment.g.append('line').attr('stroke-width', '20px').style('stroke-opacity', 0);
            segment.line = segment.g.append('line');
            segment.addClipPath(segment.g);
            segment.interactionHandler.addTrigger(segment.g);
            return segment;
        };
        // update properties
        Segment.prototype.update = function (force) {
            var segment = _super.prototype.update.call(this, force);
            if (segment.hasChanged) {
                var x1 = segment.xScale.scale(segment.x1), x2 = segment.xScale.scale(segment.x2), y1 = segment.yScale.scale(segment.y1), y2 = segment.yScale.scale(segment.y2), stroke = segment.stroke, strokeWidth = segment.strokeWidth;
                segment.dragLine.attr("x1", x1);
                segment.dragLine.attr("y1", y1);
                segment.dragLine.attr("x2", x2);
                segment.dragLine.attr("y2", y2);
                segment.line.attr("x1", x1);
                segment.line.attr("y1", y1);
                segment.line.attr("x2", x2);
                segment.line.attr("y2", y2);
                segment.line.attr("stroke", stroke);
                segment.line.attr('stroke-width', strokeWidth);
            }
            return segment;
        };
        return Segment;
    }(KG.ViewObject));
    KG.Segment = Segment;
})(KG || (KG = {}));
/// <reference path='../../kg.ts' />
var KG;
(function (KG) {
    var Curve = (function (_super) {
        __extends(Curve, _super);
        function Curve(def) {
            var _this = this;
            // establish property defaults
            def = _.defaults(def, {
                interpolation: 'curveBasis',
                constants: []
            });
            // define updatable properties
            def.constants = def.constants.concat(['interpolation']);
            _this = _super.call(this, def) || this;
            def.univariateFunction.model = def.model;
            _this.univariateFunction = new KG.UnivariateFunction(def.univariateFunction);
            return _this;
        }
        // create SVG elements
        Curve.prototype.draw = function (layer) {
            var curve = this;
            curve.g = layer.append('g');
            curve.dragPath = curve.g.append('path').attr('stroke-width', '20px').style('stroke-opacity', 0).style('fill', 'none');
            curve.path = curve.g.append('path').style('fill', 'none');
            if (curve.hasOwnProperty('clipPath') && curve.clipPath != undefined) {
                curve.g.attr('clip-path', "url(#" + curve.clipPath.id + ")");
            }
            curve.interactionHandler.addTrigger(curve.g);
            return curve;
        };
        // update properties
        Curve.prototype.update = function (force) {
            var curve = _super.prototype.update.call(this, force);
            var data = [];
            if (curve.hasOwnProperty('univariateFunction')) {
                var fn = curve.univariateFunction.update(force);
                var scale = fn.ind == 'y' ? curve.yScale : curve.xScale;
                data = fn.dataPoints(scale.domainMin, scale.domainMax);
                var dataLine = d3.line()
                    .curve(d3[curve.interpolation])
                    .x(function (d) {
                    return curve.xScale.scale(d.x);
                })
                    .y(function (d) {
                    return curve.yScale.scale(d.y);
                });
                curve.dragPath.data([data]).attr('d', dataLine);
                curve.path.data([data]).attr('d', dataLine);
                curve.path.attr('stroke', curve.stroke);
                curve.path.attr('stroke-width', curve.strokeWidth);
            }
            return curve;
        };
        return Curve;
    }(KG.ViewObject));
    KG.Curve = Curve;
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
                updatables: [],
                constants: []
            });
            def.constants = def.constants.concat(['orient']);
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
            switch (a.orient) {
                case 'bottom':
                    a.g.attr('transform', "translate(0, " + a.yScale.scale(a.intercept) + ")");
                    a.g.call(d3.axisBottom(a.xScale.scale).ticks(a.ticks));
                    return a;
                case 'left':
                    a.g.attr('transform', "translate(" + a.xScale.scale(a.intercept) + ",0)");
                    a.g.call(d3.axisLeft(a.yScale.scale).ticks(a.ticks));
                    return a;
                case 'top':
                    a.g.attr('transform', "translate(0, " + a.yScale.scale(a.intercept) + ")");
                    a.g.call(d3.axisTop(a.xScale.scale).ticks(a.ticks));
                    return a;
                case 'right':
                    a.g.attr('transform', "translate(" + a.xScale.scale(a.intercept) + ",0)");
                    a.g.call(d3.axisRight(a.yScale.scale).ticks(a.ticks));
                    return a;
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
            p.g = layer.append('g'); // SVG group
            p.dragCircle = p.g.append('circle').style('fill-opacity', 0).attr('r', 20);
            p.circle = p.g.append('circle');
            //p.addClipPath(p.g)
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
/// <reference path="model/restriction.ts" />
/// <reference path="model/updateListener.ts" />
/// <reference path="math/univariateFunction.ts" />
/// <reference path="controller/listeners/listener.ts" />
/// <reference path="controller/listeners/dragListener.ts" />
/// <reference path="controller/listeners/clickListener.ts" />
/// <reference path="controller/interactionHandler.ts" />
/// <reference path="view/divObjects/divObject.ts" />
/// <reference path="view/divObjects/slider.ts"/>
/// <reference path="view/scale.ts" />
/// <reference path="view/viewObjects/viewObject.ts" />
/// <reference path="view/viewObjects/legend.ts"/>
/// <reference path="view/viewObjects/clipPath.ts" />
/// <reference path="view/viewObjects/segment.ts" />
/// <reference path="view/viewObjects/curve.ts" />
/// <reference path="view/viewObjects/axis.ts" />
/// <reference path="view/viewObjects/point.ts" />
/// <reference path="view/viewObjects/label.ts" />
// this file provides the interface with the overall web page
var views = [];
// initialize the diagram from divs with class kg-container
window.addEventListener("load", function () {
    var viewDivs = document.getElementsByClassName('kg-container');
    var _loop_1 = function (i) {
        var url = viewDivs[i].getAttribute('src');
        viewDivs[i].innerHTML = "<p>loading...</p>";
        d3.json(url, function (data) {
            if (!data) {
                viewDivs[i].innerHTML = "<p>oops, " + url + " doesn't seem to exist.</p>";
            }
            else {
                viewDivs[i].innerHTML = "";
                views.push(new KG.View(viewDivs[i], data));
            }
        });
    };
    // for each div, fetch the JSON definition and create a View object with that div and data
    for (var i = 0; i < viewDivs.length; i++) {
        _loop_1(i);
    }
});
// if the window changes size, update the dimensions of the containers
window.onresize = function () {
    views.forEach(function (c) {
        c.updateDimensions();
    });
};
//# sourceMappingURL=kg.js.map