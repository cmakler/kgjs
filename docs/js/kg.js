/// <reference path="../../kg.ts" />
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var KG;
(function (KG) {
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
    KG.allKeys = allKeys;
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
    // End of underscorejs functions
    function setDefaults(def, defaultValues) {
        def = defaults(def, defaultValues);
        return def;
    }
    KG.setDefaults = setDefaults;
    function setProperties(def, name, props) {
        def[name] = (def[name] || []).concat(props);
        return def;
    }
    KG.setProperties = setProperties;
})(KG || (KG = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    function extractTypeAndDef(def) {
        if (def.hasOwnProperty('type')) {
            return def;
        }
        else {
            def.type = Object.keys(def)[0];
            def.def = def[def.type];
            return def;
        }
    }
    KGAuthor.extractTypeAndDef = extractTypeAndDef;
    function parse(data, parsedData) {
        data.forEach(function (obj) {
            if (KGAuthor.hasOwnProperty(obj.type)) {
                parsedData = new KGAuthor[obj.type](obj.def).parse(parsedData);
            }
            else {
                console.log("Sorry, there's no ", obj.type, " object type in KGAuthor. Maybe you have a typo?");
            }
        });
        return parsedData;
    }
    KGAuthor.parse = parse;
    function getDefinitionProperty(def) {
        if (typeof def == 'string') {
            if (def.match(/[\*/+-]/)) {
                return '(' + def + ')';
            }
            else {
                return def;
            }
        }
        else {
            return def;
        }
    }
    KGAuthor.getDefinitionProperty = getDefinitionProperty;
    function getPropertyAsString(def) {
        var d = def;
        if (typeof d == 'number') {
            return d.toString();
        }
        else {
            return "(" + d.toString() + ")";
        }
    }
    KGAuthor.getPropertyAsString = getPropertyAsString;
    function getParameterName(str) {
        if (typeof str == 'string') {
            return str.replace('params.', '');
        }
        else {
            return str;
        }
    }
    KGAuthor.getParameterName = getParameterName;
    function namedCalc(str) {
        console.log('name is ', this.name);
        return "calcs." + this.name + "." + str;
    }
    KGAuthor.namedCalc = namedCalc;
    function negativeDef(def) {
        return multiplyDefs(-1, def);
    }
    KGAuthor.negativeDef = negativeDef;
    function binaryFunction(def1, def2, fn) {
        if (typeof def1 == 'number' && typeof def2 == 'number') {
            switch (fn) {
                case "+":
                    return def1 + def2;
                case "-":
                    return def1 - def2;
                case "/":
                    return def1 / def2;
                case "*":
                    return def1 * def2;
                case "^":
                    return Math.pow(def1, def2);
            }
        }
        else {
            return "(" + getDefinitionProperty(def1) + fn + getDefinitionProperty(def2) + ")";
        }
    }
    KGAuthor.binaryFunction = binaryFunction;
    function addDefs(def1, def2) {
        if (def1 == 0) {
            return def2;
        }
        if (def2 == 0) {
            return def1;
        }
        return binaryFunction(def1, def2, '+');
    }
    KGAuthor.addDefs = addDefs;
    function subtractDefs(def1, def2) {
        if (def2 == 0) {
            return def1;
        }
        return binaryFunction(def1, def2, '-');
    }
    KGAuthor.subtractDefs = subtractDefs;
    function divideDefs(def1, def2) {
        if (def1 == 0) {
            return 0;
        }
        if (def2 == 1) {
            return def1;
        }
        return binaryFunction(def1, def2, '/');
    }
    KGAuthor.divideDefs = divideDefs;
    function absDef(def) {
        return "";
    }
    KGAuthor.absDef = absDef;
    function invertDef(def) {
        return binaryFunction(1, def, '/');
    }
    KGAuthor.invertDef = invertDef;
    function multiplyDefs(def1, def2) {
        if (def1 == 0 || def2 == 0) {
            return 0;
        }
        if (def1 == 1) {
            return def2;
        }
        if (def2 == 1) {
            return def1;
        }
        return binaryFunction(def1, def2, '*');
    }
    KGAuthor.multiplyDefs = multiplyDefs;
    function averageDefs(def1, def2, weight) {
        weight = weight || 0.5;
        return addDefs(multiplyDefs(weight, def1), multiplyDefs(subtractDefs(1, weight), def2));
    }
    KGAuthor.averageDefs = averageDefs;
    function squareDef(def) {
        return binaryFunction(def, def, '*');
    }
    KGAuthor.squareDef = squareDef;
    function sqrtDef(def) {
        return raiseDefToDef(def, 0.5);
    }
    KGAuthor.sqrtDef = sqrtDef;
    function raiseDefToDef(def1, def2) {
        return binaryFunction(def1, def2, '^');
    }
    KGAuthor.raiseDefToDef = raiseDefToDef;
    function quadraticRootDef(def1, def2, def3, positive) {
        var negagtiveB = negativeDef(def2);
        var bSquaredMinus4ac = subtractDefs(squareDef(def2), multiplyDefs(4, multiplyDefs(def1, def3)));
        var numerator = positive ? addDefs(negagtiveB, sqrtDef(bSquaredMinus4ac)) : subtractDefs(negagtiveB, sqrtDef(bSquaredMinus4ac));
        var denominator = multiplyDefs(2, def1);
        return divideDefs(numerator, denominator);
    }
    KGAuthor.quadraticRootDef = quadraticRootDef;
    function paramName(def) {
        if (typeof (def) == 'string') {
            return def.replace('params.', '');
        }
        else {
            return def;
        }
    }
    KGAuthor.paramName = paramName;
    function makeDraggable(def) {
        if (def.hasOwnProperty('draggable') && !def.hasOwnProperty('drag')) {
            if ((def.draggable == true) || (def.draggable == 'true')) {
                def.drag = [];
                if (def.x == "params.".concat(paramName(def.x))) {
                    def.drag.push({ horizontal: paramName(def.x) });
                }
                if (def.y == "params.".concat(paramName(def.y))) {
                    def.drag.push({ vertical: paramName(def.y) });
                }
            }
        }
        return def;
    }
    KGAuthor.makeDraggable = makeDraggable;
    function curvesFromFunctions(fns, def, graph) {
        return fns.map(function (fn) {
            var curveDef = copyJSON(def);
            if (curveDef.hasOwnProperty('min')) {
                fn.min = curveDef.min;
            }
            if (curveDef.hasOwnProperty('max')) {
                fn.max = curveDef.max;
            }
            if (fn.hasOwnProperty('show')) {
                curveDef.show = fn.show;
            }
            if (fn.hasOwnProperty('parametric')) {
                curveDef.parametricFunction = fn;
            }
            else {
                curveDef.univariateFunction = fn;
            }
            //console.log('creating curve from def', curveDef);
            return new KGAuthor.Curve(curveDef, graph);
        });
    }
    KGAuthor.curvesFromFunctions = curvesFromFunctions;
    // allow author to set fill color either by "color" attribute or "fill" attribute
    function setFillColor(def) {
        if (def.open) {
            def.fill = 'white';
            return KG.setDefaults(def, {
                color: def.stroke,
                stroke: def.color
            });
        }
        return KG.setDefaults(def, {
            color: def.fill,
            fill: def.color
        });
    }
    KGAuthor.setFillColor = setFillColor;
    // allow author to set stroke color either by "color" attribute or "stroke" attribute
    function setStrokeColor(def) {
        return KG.setDefaults(def, {
            color: def.stroke,
            stroke: def.color
        });
    }
    KGAuthor.setStrokeColor = setStrokeColor;
    // create a fresh copy of a JSON object
    function copyJSON(def) {
        return JSON.parse(JSON.stringify(def));
    }
    KGAuthor.copyJSON = copyJSON;
    function replaceVariable(target, search, replacement) {
        return "(".concat(target.split(search).join(replacement), ")");
    }
    KGAuthor.replaceVariable = replaceVariable;
    // allow author to specify a function using a single string rather than a function object
    function parseFn(def, authorName, codeName) {
        if (!def.hasOwnProperty(codeName) && def.hasOwnProperty(authorName)) {
            if (codeName == 'parametricFunction') {
                def.parametricFunction = {
                    xFunction: def.xFn,
                    yFunction: def.yFn,
                    min: def.min,
                    max: def.max,
                    samplePoints: def.samplePoints
                };
            }
            else {
                def[codeName] = {
                    fn: def[authorName],
                    ind: (def[authorName].indexOf('(y)') > -1) ? 'y' : 'x',
                    min: def.min,
                    max: def.max,
                    samplePoints: def.samplePoints
                };
            }
        }
    }
    KGAuthor.parseFn = parseFn;
    // allow author to set a fill color rather than a fill object
    function parseFill(def, attr) {
        var v = def[attr];
        if (typeof v == 'string') {
            def[attr] = { fill: v };
        }
        if (typeof v == 'boolean' && v) {
            var fillColor = def.hasOwnProperty('fill') ? def.fill : def.color;
            def[attr] = { fill: fillColor };
        }
    }
    KGAuthor.parseFill = parseFill;
    // inherit properties from a parent
    function inheritFromParent(props, parent, child) {
        props.forEach(function (prop) {
            if (parent.hasOwnProperty(prop) && !child.hasOwnProperty(prop)) {
                child[prop] = parent[prop];
            }
        });
    }
    KGAuthor.inheritFromParent = inheritFromParent;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var AuthoringObject = /** @class */ (function () {
        function AuthoringObject(def) {
            this.def = def;
            this.name = def.name;
            this.subObjects = [];
        }
        AuthoringObject.prototype.parseSelf = function (parsedData) {
            return parsedData;
        };
        AuthoringObject.prototype.parse = function (parsedData) {
            this.subObjects.forEach(function (obj) {
                parsedData = obj.parse(parsedData);
            });
            delete this.subObjects;
            parsedData = this.parseSelf(parsedData);
            return parsedData;
        };
        AuthoringObject.prototype.addSecondGraph = function (graph2) {
            var def = this.def;
            if (def.hasOwnProperty('yScale2Name')) {
                def.xScale2Name = graph2.xScale.name;
                def.yScale2Name = graph2.yScale.name;
            }
            this.subObjects.forEach(function (obj) {
                obj.addSecondGraph(graph2);
            });
        };
        return AuthoringObject;
    }());
    KGAuthor.AuthoringObject = AuthoringObject;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Schema = /** @class */ (function (_super) {
        __extends(Schema, _super);
        function Schema(def) {
            var _this = this;
            var palette = {
                blue: 'd3.schemeCategory10[0]', //#3182bd
                orange: 'd3.schemeCategory10[1]', //#e6550d
                green: 'd3.schemeCategory10[2]', //#31a354
                red: 'd3.schemeCategory10[3]', //#d62728
                purple: 'd3.schemeCategory10[4]', //#756bb1
                brown: 'd3.schemeCategory10[5]', //#8c6d31
                magenta: 'd3.schemeCategory10[6]', //#7b4173
                grey: 'd3.schemeCategory10[7]', //#636363
                gray: 'd3.schemeCategory10[7]', //#636363
                olive: 'd3.schemeCategory10[8]' //#637939
            };
            for (var color in def.colors) {
                var colorName = def.colors[color];
                if (palette.hasOwnProperty(colorName)) {
                    def.colors[color] = palette[colorName];
                }
            }
            def.colors = KG.setDefaults(def.colors || {}, palette);
            _this = _super.call(this, def) || this;
            _this.colors = def.colors;
            _this.idioms = def.idioms;
            return _this;
        }
        Schema.prototype.parseSelf = function (parsedData) {
            var colors = this.colors;
            parsedData.colors = KG.setDefaults(parsedData.colors || {}, colors);
            parsedData.idioms = this.idioms;
            return parsedData;
        };
        return Schema;
    }(KGAuthor.AuthoringObject));
    KGAuthor.Schema = Schema;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Layout = /** @class */ (function (_super) {
        __extends(Layout, _super);
        function Layout(def) {
            var _this = _super.call(this, def) || this;
            _this.aspectRatio = 2;
            _this.nosvg = false;
            var l = _this;
            if (def.hasOwnProperty('explanation')) {
                l.subObjects.push(new KGAuthor.Explanation(def.explanation));
            }
            return _this;
        }
        Layout.prototype.parseSelf = function (parsedData) {
            parsedData.aspectRatio = this.aspectRatio;
            parsedData.nosvg = this.nosvg;
            return parsedData;
        };
        return Layout;
    }(KGAuthor.AuthoringObject));
    KGAuthor.Layout = Layout;
    var SquareLayout = /** @class */ (function (_super) {
        __extends(SquareLayout, _super);
        // creates a square layout (aspect ratio of 1) within the main body of the text
        // to make a square graph, the ratio of width to height should be 0.82
        function SquareLayout(def) {
            var _this = _super.call(this, def) || this;
            _this.aspectRatio = 1.22;
            return _this;
        }
        return SquareLayout;
    }(Layout));
    KGAuthor.SquareLayout = SquareLayout;
    var WideRectangleLayout = /** @class */ (function (_super) {
        __extends(WideRectangleLayout, _super);
        // creates a rectangle, twice as wide as it is high, within the main body of the text
        // to make a square graph, the ratio of width to height should be 0.41
        function WideRectangleLayout(def) {
            var _this = _super.call(this, def) || this;
            _this.aspectRatio = 2.44;
            return _this;
        }
        return WideRectangleLayout;
    }(Layout));
    KGAuthor.WideRectangleLayout = WideRectangleLayout;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var HTMLLayout = /** @class */ (function (_super) {
        __extends(HTMLLayout, _super);
        function HTMLLayout(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            l.nosvg = true;
            var divDef = { "html": def['html'] };
            l.subObjects.push(new KGAuthor.Div(divDef));
            return _this;
        }
        return HTMLLayout;
    }(KGAuthor.Layout));
    KGAuthor.HTMLLayout = HTMLLayout;
    var HTMLPlusSidebarLayout = /** @class */ (function (_super) {
        __extends(HTMLPlusSidebarLayout, _super);
        function HTMLPlusSidebarLayout(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            l.nosvg = true;
            var sidebarDef = def['sidebar'];
            l.subObjects.push(new KGAuthor.Sidebar(sidebarDef));
            return _this;
        }
        return HTMLPlusSidebarLayout;
    }(HTMLLayout));
    KGAuthor.HTMLPlusSidebarLayout = HTMLPlusSidebarLayout;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var OneGraph = /** @class */ (function (_super) {
        __extends(OneGraph, _super);
        function OneGraph(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var graphDef = def['graph'];
            graphDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.74,
                "height": 0.9
            };
            l.subObjects.push(new KGAuthor.Graph(graphDef));
            return _this;
        }
        return OneGraph;
    }(KGAuthor.SquareLayout));
    KGAuthor.OneGraph = OneGraph;
    var OneTree = /** @class */ (function (_super) {
        __extends(OneTree, _super);
        function OneTree(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var treeDef = def['tree'];
            treeDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.74,
                "height": 0.9
            };
            l.subObjects.push(new KGAuthor.Tree(treeDef));
            return _this;
        }
        return OneTree;
    }(KGAuthor.SquareLayout));
    KGAuthor.OneTree = OneTree;
    var OneWideGraph = /** @class */ (function (_super) {
        __extends(OneWideGraph, _super);
        function OneWideGraph(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var graphDef = def['graph'];
            graphDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.74,
                "height": 0.9
            };
            l.subObjects.push(new KGAuthor.Graph(graphDef));
            return _this;
        }
        return OneWideGraph;
    }(KGAuthor.WideRectangleLayout));
    KGAuthor.OneWideGraph = OneWideGraph;
    var OneGraphPlusSidebar = /** @class */ (function (_super) {
        __extends(OneGraphPlusSidebar, _super);
        function OneGraphPlusSidebar(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var graphDef = def['graph'], sidebarDef = def['sidebar'];
            graphDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.738,
                "height": 0.9
            };
            l.subObjects.push(new KGAuthor.Graph(graphDef));
            l.subObjects.push(new KGAuthor.Sidebar(sidebarDef));
            return _this;
        }
        return OneGraphPlusSidebar;
    }(KGAuthor.SquareLayout));
    KGAuthor.OneGraphPlusSidebar = OneGraphPlusSidebar;
    var OneTreePlusSidebar = /** @class */ (function (_super) {
        __extends(OneTreePlusSidebar, _super);
        function OneTreePlusSidebar(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var treeDef = def['tree'], sidebarDef = def['sidebar'];
            treeDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.738,
                "height": 0.9
            };
            l.subObjects.push(new KGAuthor.Tree(treeDef));
            l.subObjects.push(new KGAuthor.Sidebar(sidebarDef));
            return _this;
        }
        return OneTreePlusSidebar;
    }(KGAuthor.SquareLayout));
    KGAuthor.OneTreePlusSidebar = OneTreePlusSidebar;
    var OneWideGraphPlusSidebar = /** @class */ (function (_super) {
        __extends(OneWideGraphPlusSidebar, _super);
        function OneWideGraphPlusSidebar(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var graphDef = def['graph'], sidebarDef = def['sidebar'];
            graphDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.738,
                "height": 0.9
            };
            l.subObjects.push(new KGAuthor.Graph(graphDef));
            l.subObjects.push(new KGAuthor.Sidebar(sidebarDef));
            return _this;
        }
        return OneWideGraphPlusSidebar;
    }(KGAuthor.WideRectangleLayout));
    KGAuthor.OneWideGraphPlusSidebar = OneWideGraphPlusSidebar;
    var OneGraphPlusSidebarRoom200 = /** @class */ (function (_super) {
        __extends(OneGraphPlusSidebarRoom200, _super);
        function OneGraphPlusSidebarRoom200(def) {
            var _this = _super.call(this, def) || this;
            _this.aspectRatio = 2;
            return _this;
        }
        return OneGraphPlusSidebarRoom200;
    }(OneGraphPlusSidebar));
    KGAuthor.OneGraphPlusSidebarRoom200 = OneGraphPlusSidebarRoom200;
    var GeoGebraPlusSidebar = /** @class */ (function (_super) {
        __extends(GeoGebraPlusSidebar, _super);
        function GeoGebraPlusSidebar(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var ggbAppletDef = def['ggbApplet'], sidebarDef = def['sidebar'];
            ggbAppletDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.738,
                "height": 0.9
            };
            l.subObjects.push(new KGAuthor.GeoGebraContainer(ggbAppletDef));
            l.subObjects.push(new KGAuthor.Sidebar(sidebarDef));
            return _this;
        }
        return GeoGebraPlusSidebar;
    }(KGAuthor.SquareLayout));
    KGAuthor.GeoGebraPlusSidebar = GeoGebraPlusSidebar;
    var MathboxPlusSidebar = /** @class */ (function (_super) {
        __extends(MathboxPlusSidebar, _super);
        function MathboxPlusSidebar(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var mathboxDef = def['mathbox'], sidebarDef = def['sidebar'];
            mathboxDef.position = {
                "x": 0.025,
                "y": 0.025,
                "width": 0.95,
                "height": 0.95
            };
            l.subObjects.push(new KGAuthor.MathboxContainer(mathboxDef));
            l.subObjects.push(new KGAuthor.Sidebar(sidebarDef));
            return _this;
        }
        return MathboxPlusSidebar;
    }(KGAuthor.SquareLayout));
    KGAuthor.MathboxPlusSidebar = MathboxPlusSidebar;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var TwoHorizontalGraphs = /** @class */ (function (_super) {
        __extends(TwoHorizontalGraphs, _super);
        function TwoHorizontalGraphs(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var leftGraphDef = def['leftGraph'], rightGraphDef = def['rightGraph'];
            var leftX = 0.15, rightX = 0.65, topY = 0.1, bottomY = 0.9, width = 0.3, controlHeight = 0.25;
            var includeControls = false;
            console.log('layout: ', l);
            if (def.hasOwnProperty('leftControls')) {
                l.subObjects.push(new KGAuthor.DivContainer({
                    position: {
                        x: leftX,
                        y: bottomY,
                        width: width,
                        height: controlHeight
                    },
                    children: [
                        {
                            type: "Controls",
                            def: def['leftControls']
                        }
                    ]
                }));
                includeControls = true;
            }
            if (def.hasOwnProperty('rightControls')) {
                l.subObjects.push(new KGAuthor.DivContainer({
                    position: {
                        x: rightX,
                        y: bottomY,
                        width: width,
                        height: controlHeight
                    },
                    children: [
                        {
                            type: "Controls",
                            def: def['rightControls']
                        }
                    ]
                }));
                includeControls = true;
            }
            var graphHeight = includeControls ? 0.5 : 0.9;
            _this.aspectRatio = includeControls ? 2 : 4;
            leftGraphDef.position = {
                x: leftX,
                y: topY,
                width: width,
                height: graphHeight
            };
            l.subObjects.push(new KGAuthor.Graph(leftGraphDef));
            rightGraphDef.position = {
                "x": rightX,
                "y": topY,
                "width": width,
                "height": graphHeight
            };
            l.subObjects.push(new KGAuthor.Graph(rightGraphDef));
            return _this;
        }
        return TwoHorizontalGraphs;
    }(KGAuthor.Layout));
    KGAuthor.TwoHorizontalGraphs = TwoHorizontalGraphs;
    var TwoHorizontalGraphsPlusSidebar = /** @class */ (function (_super) {
        __extends(TwoHorizontalGraphsPlusSidebar, _super);
        function TwoHorizontalGraphsPlusSidebar(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var leftGraphDef = def['leftGraph'], rightGraphDef = def['rightGraph'], sidebarDef = def['sidebar'];
            var includeControls = false;
            var leftX = 0.1, rightX = 0.6, topY = 0.025, bottomY = 1.2, width = 0.369, controlHeight = 0.3, controlBottom = 0.65;
            if (def.hasOwnProperty('leftControls')) {
                var leftControlsContainer = {
                    position: {
                        x: leftX,
                        y: controlBottom,
                        width: width,
                        height: controlHeight
                    },
                    children: [
                        {
                            type: "Controls",
                            def: def['leftControls']
                        }
                    ]
                };
                includeControls = true;
                l.subObjects.push(new KGAuthor.DivContainer(leftControlsContainer));
            }
            if (def.hasOwnProperty('rightControls')) {
                var rightControlsContainer = {
                    position: {
                        x: rightX,
                        y: controlBottom,
                        width: width,
                        height: controlHeight
                    },
                    children: [
                        {
                            type: "Controls",
                            def: def['rightControls']
                        }
                    ]
                };
                includeControls = true;
                l.subObjects.push(new KGAuthor.DivContainer(rightControlsContainer));
            }
            var graphHeight = includeControls ? 0.5 : 0.9;
            _this.aspectRatio = includeControls ? 1.2 : 2.4;
            leftGraphDef.position = {
                "x": leftX,
                "y": topY,
                "width": width,
                "height": graphHeight
            };
            rightGraphDef.position = {
                "x": rightX,
                "y": topY,
                "width": width,
                "height": graphHeight
            };
            var leftGraph = new KGAuthor.Graph(leftGraphDef), rightGraph = new KGAuthor.Graph(rightGraphDef), sidebar = new KGAuthor.Sidebar(sidebarDef);
            l.subObjects.push(leftGraph);
            l.subObjects.push(rightGraph);
            l.subObjects.push(sidebar);
            return _this;
        }
        return TwoHorizontalGraphsPlusSidebar;
    }(KGAuthor.Layout));
    KGAuthor.TwoHorizontalGraphsPlusSidebar = TwoHorizontalGraphsPlusSidebar;
    var MathboxPlusGraph = /** @class */ (function (_super) {
        __extends(MathboxPlusGraph, _super);
        function MathboxPlusGraph(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var mathboxDef = def['mathbox'], graphDef = def['graph'];
            mathboxDef.position = {
                "x": 0.05,
                "y": 0.025,
                "width": 0.45,
                "height": 0.9
            };
            graphDef.position = {
                "x": 0.6,
                "y": 0.2,
                "width": 0.3,
                "height": 0.6
            };
            l.subObjects.push(new KGAuthor.Mathbox(mathboxDef));
            l.subObjects.push(new KGAuthor.Graph(graphDef));
            return _this;
        }
        return MathboxPlusGraph;
    }(KGAuthor.Layout));
    KGAuthor.MathboxPlusGraph = MathboxPlusGraph;
    var GameMatrixPlusGraph = /** @class */ (function (_super) {
        __extends(GameMatrixPlusGraph, _super);
        function GameMatrixPlusGraph(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var graphDef = def['graph'];
            var gameDivDef = {
                position: {
                    x: 0.05,
                    y: 0.1,
                    width: 0.35,
                    height: 0.7
                },
                children: [
                    {
                        type: "GameMatrix",
                        def: def.game
                    }
                ]
            };
            graphDef.position = {
                x: 0.6,
                y: 0.1,
                width: 0.35,
                height: 0.7
            };
            l.subObjects.push(new KGAuthor.DivContainer(gameDivDef));
            l.subObjects.push(new KGAuthor.Graph(graphDef));
            return _this;
        }
        return GameMatrixPlusGraph;
    }(KGAuthor.Layout));
    KGAuthor.GameMatrixPlusGraph = GameMatrixPlusGraph;
    var GameMatrixPlusGraphPlusSidebar = /** @class */ (function (_super) {
        __extends(GameMatrixPlusGraphPlusSidebar, _super);
        function GameMatrixPlusGraphPlusSidebar(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var graphDef = def['graph'];
            var sidebarDef = def['sidebar'];
            var gameDivDef = {
                position: {
                    x: 0.05,
                    y: 0.1,
                    width: 0.35,
                    height: 0.7
                },
                children: [
                    {
                        type: "GameMatrix",
                        def: def.game
                    }
                ]
            };
            graphDef.position = {
                x: 0.6,
                y: 0.1,
                width: 0.35,
                height: 0.7
            };
            l.subObjects.push(new KGAuthor.DivContainer(gameDivDef));
            l.subObjects.push(new KGAuthor.Graph(graphDef));
            l.subObjects.push(new KGAuthor.Sidebar(sidebarDef));
            return _this;
        }
        return GameMatrixPlusGraphPlusSidebar;
    }(KGAuthor.Layout));
    KGAuthor.GameMatrixPlusGraphPlusSidebar = GameMatrixPlusGraphPlusSidebar;
    var GeoGebraPlusGraph = /** @class */ (function (_super) {
        __extends(GeoGebraPlusGraph, _super);
        function GeoGebraPlusGraph(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var ggbAppletDef = def['ggbApplet'], graphDef = def['graph'];
            ggbAppletDef.position = {
                "x": 0.05,
                "y": 0.025,
                "width": 0.45,
                "height": 0.9
            };
            graphDef.position = {
                "x": 0.6,
                "y": 0.2,
                "width": 0.3,
                "height": 0.6
            };
            l.subObjects.push(new KGAuthor.GeoGebraContainer(ggbAppletDef));
            l.subObjects.push(new KGAuthor.Graph(graphDef));
            return _this;
        }
        return GeoGebraPlusGraph;
    }(KGAuthor.Layout));
    KGAuthor.GeoGebraPlusGraph = GeoGebraPlusGraph;
    var GeoGebraPlusGraphPlusSidebar = /** @class */ (function (_super) {
        __extends(GeoGebraPlusGraphPlusSidebar, _super);
        function GeoGebraPlusGraphPlusSidebar(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var ggbAppletDef = def['ggbApplet'], graphDef = def['graph'], sidebarDef = def['sidebar'];
            ggbAppletDef.position = {
                "x": 0.1,
                "y": 0.025,
                "width": 0.369,
                "height": 0.9
            };
            graphDef.position = {
                "x": 0.6,
                "y": 0.025,
                "width": 0.369,
                "height": 0.9
            };
            l.subObjects.push(new KGAuthor.GeoGebraContainer(ggbAppletDef));
            l.subObjects.push(new KGAuthor.Graph(graphDef));
            l.subObjects.push(new KGAuthor.Sidebar(sidebarDef));
            return _this;
        }
        return GeoGebraPlusGraphPlusSidebar;
    }(KGAuthor.WideRectangleLayout));
    KGAuthor.GeoGebraPlusGraphPlusSidebar = GeoGebraPlusGraphPlusSidebar;
    var MathboxPlusGraphPlusSidebar = /** @class */ (function (_super) {
        __extends(MathboxPlusGraphPlusSidebar, _super);
        function MathboxPlusGraphPlusSidebar(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var mathboxDef = def['mathbox'], graphDef = def['graph'], sidebarDef = def['sidebar'];
            mathboxDef.position = {
                "x": 0.025,
                "y": 0.025,
                "width": 0.444,
                "height": 0.95
            };
            graphDef.position = {
                "x": 0.6,
                "y": 0.025,
                "width": 0.369,
                "height": 0.9
            };
            l.subObjects.push(new KGAuthor.MathboxContainer(mathboxDef));
            l.subObjects.push(new KGAuthor.Graph(graphDef));
            l.subObjects.push(new KGAuthor.Sidebar(sidebarDef));
            return _this;
        }
        return MathboxPlusGraphPlusSidebar;
    }(KGAuthor.WideRectangleLayout));
    KGAuthor.MathboxPlusGraphPlusSidebar = MathboxPlusGraphPlusSidebar;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var ThreeHorizontalGraphs = /** @class */ (function (_super) {
        __extends(ThreeHorizontalGraphs, _super);
        function ThreeHorizontalGraphs(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var leftGraphDef = def['leftGraph'], middleGraphDef = def['middleGraph'], rightGraphDef = def['rightGraph'];
            var leftX = 0.05, middleX = 0.35, rightX = 0.65, topY = 0.025, bottomY = 0.65, width = 0.25, controlHeight = 0.3;
            var includeControls = false;
            console.log('layout: ', l);
            if (def.hasOwnProperty('leftControls')) {
                l.subObjects.push(new KGAuthor.DivContainer({
                    position: {
                        x: leftX,
                        y: bottomY,
                        width: width,
                        height: controlHeight
                    },
                    children: [
                        {
                            type: "Controls",
                            def: def['leftControls']
                        }
                    ]
                }));
                includeControls = true;
            }
            if (def.hasOwnProperty('middleControls')) {
                l.subObjects.push(new KGAuthor.DivContainer({
                    position: {
                        x: middleX,
                        y: bottomY,
                        width: width,
                        height: controlHeight
                    },
                    children: [
                        {
                            type: "Controls",
                            def: def['middleControls']
                        }
                    ]
                }));
                includeControls = true;
            }
            if (def.hasOwnProperty('rightControls')) {
                l.subObjects.push(new KGAuthor.DivContainer({
                    position: {
                        x: rightX,
                        y: bottomY,
                        width: width,
                        height: controlHeight
                    },
                    children: [
                        {
                            type: "Controls",
                            def: def['rightControls']
                        }
                    ]
                }));
                includeControls = true;
            }
            var graphHeight = includeControls ? 0.5 : 0.9;
            _this.aspectRatio = includeControls ? 2 : 4;
            leftGraphDef.position = {
                x: leftX,
                y: topY,
                width: width,
                height: graphHeight
            };
            l.subObjects.push(new KGAuthor.Graph(leftGraphDef));
            middleGraphDef.position = {
                "x": middleX,
                "y": topY,
                "width": width,
                "height": graphHeight
            };
            l.subObjects.push(new KGAuthor.Graph(middleGraphDef));
            rightGraphDef.position = {
                "x": rightX,
                "y": topY,
                "width": width,
                "height": graphHeight
            };
            l.subObjects.push(new KGAuthor.Graph(rightGraphDef));
            return _this;
        }
        return ThreeHorizontalGraphs;
    }(KGAuthor.Layout));
    KGAuthor.ThreeHorizontalGraphs = ThreeHorizontalGraphs;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var RectanglePlusTwoSquaresPlusSidebar = /** @class */ (function (_super) {
        __extends(RectanglePlusTwoSquaresPlusSidebar, _super);
        function RectanglePlusTwoSquaresPlusSidebar(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var topGraph = def['topGraph'], bottomLeftGraph = def['bottomLeftGraph'], bottomRightGraph = def['bottomRightGraph'], sidebarDef = def['sidebar'];
            topGraph.position = {
                "x": 0.15,
                "y": 0.05,
                "width": 0.8,
                "height": 0.4
            };
            bottomLeftGraph.position = {
                "x": 0.15,
                "y": 0.6,
                "width": 0.35,
                "height": 0.35
            };
            bottomRightGraph.position = {
                "x": 0.6,
                "y": 0.6,
                "width": 0.35,
                "height": 0.35
            };
            l.subObjects.push(new KGAuthor.Graph(topGraph));
            l.subObjects.push(new KGAuthor.Graph(bottomLeftGraph));
            l.subObjects.push(new KGAuthor.Graph(bottomRightGraph));
            l.subObjects.push(new KGAuthor.Sidebar(sidebarDef));
            return _this;
        }
        return RectanglePlusTwoSquaresPlusSidebar;
    }(KGAuthor.SquareLayout));
    KGAuthor.RectanglePlusTwoSquaresPlusSidebar = RectanglePlusTwoSquaresPlusSidebar;
    var RectangleBelowTwoSquaresPlusSidebar = /** @class */ (function (_super) {
        __extends(RectangleBelowTwoSquaresPlusSidebar, _super);
        function RectangleBelowTwoSquaresPlusSidebar(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var bottomGraph = def['bottomGraph'], topLeftGraph = def['topLeftGraph'], topRightGraph = def['topRightGraph'], sidebarDef = def['sidebar'];
            bottomGraph.position = {
                "x": 0.15,
                "y": 0.55,
                "width": 0.8,
                "height": 0.4
            };
            topLeftGraph.position = {
                "x": 0.15,
                "y": 0.05,
                "width": 0.35,
                "height": 0.35
            };
            topRightGraph.position = {
                "x": 0.6,
                "y": 0.05,
                "width": 0.35,
                "height": 0.35
            };
            l.subObjects.push(new KGAuthor.Graph(bottomGraph));
            l.subObjects.push(new KGAuthor.Graph(topLeftGraph));
            l.subObjects.push(new KGAuthor.Graph(topRightGraph));
            l.subObjects.push(new KGAuthor.Sidebar(sidebarDef));
            return _this;
        }
        return RectangleBelowTwoSquaresPlusSidebar;
    }(KGAuthor.SquareLayout));
    KGAuthor.RectangleBelowTwoSquaresPlusSidebar = RectangleBelowTwoSquaresPlusSidebar;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var TwoVerticalGraphs = /** @class */ (function (_super) {
        __extends(TwoVerticalGraphs, _super);
        function TwoVerticalGraphs(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var topGraphDef = def['topGraph'], bottomGraphDef = def['bottomGraph'];
            topGraphDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.8,
                "height": 0.4
            };
            bottomGraphDef.position = {
                "x": 0.15,
                "y": 0.525,
                "width": 0.8,
                "height": 0.4
            };
            var topGraph = new KGAuthor.Graph(topGraphDef), bottomGraph = new KGAuthor.Graph(bottomGraphDef);
            topGraph.subObjects.forEach(function (obj) { obj.addSecondGraph(bottomGraph); });
            bottomGraph.subObjects.forEach(function (obj) { obj.addSecondGraph(topGraph); });
            l.subObjects.push(topGraph);
            l.subObjects.push(bottomGraph);
            return _this;
        }
        return TwoVerticalGraphs;
    }(KGAuthor.SquareLayout));
    KGAuthor.TwoVerticalGraphs = TwoVerticalGraphs;
    var TwoVerticalGraphsPlusSidebar = /** @class */ (function (_super) {
        __extends(TwoVerticalGraphsPlusSidebar, _super);
        function TwoVerticalGraphsPlusSidebar(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var topGraphDef = def['topGraph'], bottomGraphDef = def['bottomGraph'], sidebarDef = def['sidebar'];
            topGraphDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.738,
                "height": 0.4
            };
            bottomGraphDef.position = {
                "x": 0.15,
                "y": 0.525,
                "width": 0.738,
                "height": 0.4
            };
            var topGraph = new KGAuthor.Graph(topGraphDef), bottomGraph = new KGAuthor.Graph(bottomGraphDef), sidebar = new KGAuthor.Sidebar(sidebarDef);
            topGraph.subObjects.forEach(function (obj) { obj.addSecondGraph(bottomGraph); });
            bottomGraph.subObjects.forEach(function (obj) { obj.addSecondGraph(topGraph); });
            l.subObjects.push(topGraph);
            l.subObjects.push(bottomGraph);
            l.subObjects.push(sidebar);
            return _this;
        }
        return TwoVerticalGraphsPlusSidebar;
    }(KGAuthor.SquareLayout));
    KGAuthor.TwoVerticalGraphsPlusSidebar = TwoVerticalGraphsPlusSidebar;
    var TwoVerticalGraphsRoom200 = /** @class */ (function (_super) {
        __extends(TwoVerticalGraphsRoom200, _super);
        function TwoVerticalGraphsRoom200(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var topGraphDef = def['topGraph'], bottomGraphDef = def['bottomGraph'];
            topGraphDef.position = {
                "x": 0.1,
                "y": 0,
                "width": 0.85,
                "height": 0.4
            };
            bottomGraphDef.position = {
                "x": 0.1,
                "y": 0.62,
                "width": 0.85,
                "height": 0.38
            };
            var topGraph = new KGAuthor.Graph(topGraphDef), bottomGraph = new KGAuthor.Graph(bottomGraphDef);
            topGraph.subObjects.forEach(function (obj) { obj.addSecondGraph(bottomGraph); });
            bottomGraph.subObjects.forEach(function (obj) { obj.addSecondGraph(topGraph); });
            l.subObjects.push(topGraph);
            l.subObjects.push(bottomGraph);
            l.aspectRatio = 1.3;
            return _this;
        }
        return TwoVerticalGraphsRoom200;
    }(KGAuthor.Layout));
    KGAuthor.TwoVerticalGraphsRoom200 = TwoVerticalGraphsRoom200;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var SquarePlusTwoVerticalGraphs = /** @class */ (function (_super) {
        __extends(SquarePlusTwoVerticalGraphs, _super);
        function SquarePlusTwoVerticalGraphs(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var bigGraphDef = def['bigGraph'], topGraphDef = def['topGraph'], bottomGraphDef = def['bottomGraph'];
            bigGraphDef.position = {
                "x": 0.05,
                "y": 0.025,
                "width": 0.5,
                "height": 0.9
            };
            topGraphDef.position = {
                "x": 0.6,
                "y": 0.025,
                "width": 0.35,
                "height": 0.4
            };
            bottomGraphDef.position = {
                "x": 0.6,
                "y": 0.525,
                "width": 0.35,
                "height": 0.4
            };
            l.subObjects.push(new KGAuthor.Graph(bigGraphDef));
            l.subObjects.push(new KGAuthor.Graph(topGraphDef));
            l.subObjects.push(new KGAuthor.Graph(bottomGraphDef));
            return _this;
        }
        return SquarePlusTwoVerticalGraphs;
    }(KGAuthor.Layout));
    KGAuthor.SquarePlusTwoVerticalGraphs = SquarePlusTwoVerticalGraphs;
    var TwoVerticalSquaresOneBigSquare = /** @class */ (function (_super) {
        __extends(TwoVerticalSquaresOneBigSquare, _super);
        function TwoVerticalSquaresOneBigSquare(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            l.aspectRatio = 1.6;
            var bigGraphDef = def['bigGraph'], topGraphDef = def['topGraph'], bottomGraphDef = def['bottomGraph'];
            topGraphDef.position = {
                "x": 0.1,
                "y": 0.05,
                "width": 0.25,
                "height": 0.40
            };
            bottomGraphDef.position = {
                "x": 0.1,
                "y": 0.538,
                "width": 0.25,
                "height": 0.40
            };
            bigGraphDef.position = {
                "x": 0.43,
                "y": 0.05,
                "width": 0.555,
                "height": 0.888
            };
            l.subObjects.push(new KGAuthor.Graph(bigGraphDef));
            l.subObjects.push(new KGAuthor.Graph(topGraphDef));
            l.subObjects.push(new KGAuthor.Graph(bottomGraphDef));
            return _this;
        }
        return TwoVerticalSquaresOneBigSquare;
    }(KGAuthor.Layout));
    KGAuthor.TwoVerticalSquaresOneBigSquare = TwoVerticalSquaresOneBigSquare;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var FourGraphs = /** @class */ (function (_super) {
        __extends(FourGraphs, _super);
        function FourGraphs(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var topLeftGraphDef = def['topLeftGraph'], bottomLeftGraphDef = def['bottomLeftGraph'], topRightGraphDef = def['topRightGraph'], bottomRightGraphDef = def['bottomRightGraph'];
            var leftX = 0.05, rightX = 0.55, topY = 0.025, bottomY = 0.525;
            topLeftGraphDef.position = {
                "x": leftX,
                "y": topY,
                "width": 0.4,
                "height": 0.4
            };
            bottomLeftGraphDef.position = {
                "x": leftX,
                "y": bottomY,
                "width": 0.4,
                "height": 0.4
            };
            topRightGraphDef.position = {
                "x": rightX,
                "y": topY,
                "width": 0.4,
                "height": 0.4
            };
            bottomRightGraphDef.position = {
                "x": rightX,
                "y": bottomY,
                "width": 0.4,
                "height": 0.4
            };
            l.subObjects.push(new KGAuthor.Graph(topLeftGraphDef));
            l.subObjects.push(new KGAuthor.Graph(bottomLeftGraphDef));
            l.subObjects.push(new KGAuthor.Graph(topRightGraphDef));
            l.subObjects.push(new KGAuthor.Graph(bottomRightGraphDef));
            return _this;
        }
        return FourGraphs;
    }(KGAuthor.SquareLayout));
    KGAuthor.FourGraphs = FourGraphs;
    var FourGraphsPlusSidebar = /** @class */ (function (_super) {
        __extends(FourGraphsPlusSidebar, _super);
        function FourGraphsPlusSidebar(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var sidebarDef = def['sidebar'];
            l.subObjects.push(new KGAuthor.Sidebar(sidebarDef));
            return _this;
        }
        return FourGraphsPlusSidebar;
    }(FourGraphs));
    KGAuthor.FourGraphsPlusSidebar = FourGraphsPlusSidebar;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var GameMatrixLayout = /** @class */ (function (_super) {
        __extends(GameMatrixLayout, _super);
        function GameMatrixLayout(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            l.nosvg = true;
            l.subObjects.push(new KGAuthor.GameMatrix(def.gameMatrix));
            return _this;
        }
        return GameMatrixLayout;
    }(KGAuthor.Layout));
    KGAuthor.GameMatrixLayout = GameMatrixLayout;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Scale = /** @class */ (function (_super) {
        __extends(Scale, _super);
        function Scale(def) {
            var _this = this;
            KG.setDefaults(def, {
                intercept: 0
            });
            _this = _super.call(this, def) || this;
            _this.min = def.domainMin;
            _this.max = def.domainMax;
            _this.intercept = def.intercept;
            return _this;
        }
        Scale.prototype.parseSelf = function (parsedData) {
            parsedData.scales.push(this.def);
            return parsedData;
        };
        return Scale;
    }(KGAuthor.AuthoringObject));
    KGAuthor.Scale = Scale;
    var PositionedObject = /** @class */ (function (_super) {
        __extends(PositionedObject, _super);
        function PositionedObject(def) {
            var _this = this;
            KG.setDefaults(def, { xAxis: {}, yAxis: {} });
            KG.setDefaults(def.xAxis, { min: 0, max: 10, intercept: 0, title: '', orient: 'bottom' });
            KG.setDefaults(def.yAxis, { min: 0, max: 10, intercept: 0, title: '', orient: 'left' });
            _this = _super.call(this, def) || this;
            var po = _this, xMin = def.xAxis.min, xMax = def.xAxis.max, xIntercept = def.xAxis.intercept, xLog = def.xAxis.log, yMin = def.yAxis.min, yMax = def.yAxis.max, yIntercept = def.yAxis.intercept, yLog = def.yAxis.log, leftEdge = def.position.x, rightEdge = KGAuthor.addDefs(def.position.x, def.position.width), bottomEdge = KGAuthor.addDefs(def.position.y, def.position.height), topEdge = def.position.y;
            po.xScale = new Scale({
                "name": KG.randomString(10),
                "axis": "x",
                "domainMin": xMin,
                "domainMax": xMax,
                "rangeMin": leftEdge,
                "rangeMax": rightEdge,
                "log": xLog,
                "intercept": xIntercept
            });
            po.yScale = new Scale({
                "name": KG.randomString(10),
                "axis": "y",
                "domainMin": yMin,
                "domainMax": yMax,
                "rangeMin": bottomEdge,
                "rangeMax": topEdge,
                "log": yLog,
                "intercept": yIntercept
            });
            po.subObjects = [po.xScale, po.yScale];
            if (po.def.hasOwnProperty('objects')) {
                po.def.objects.map(KGAuthor.extractTypeAndDef);
            }
            return _this;
        }
        return PositionedObject;
    }(KGAuthor.AuthoringObject));
    KGAuthor.PositionedObject = PositionedObject;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Graph = /** @class */ (function (_super) {
        __extends(Graph, _super);
        function Graph(def) {
            var _this = this;
            def = KG.setDefaults(def, { objects: [] });
            _this = _super.call(this, def) || this;
            var g = _this;
            //axes need to update when the other one's domain changes
            def.xAxis.otherMin = def.yAxis.min;
            def.xAxis.otherMax = def.yAxis.max;
            def.yAxis.otherMin = def.xAxis.min;
            def.yAxis.otherMax = def.xAxis.max;
            g.clipPath = new KGAuthor.ClipPath({
                "name": KG.randomString(10),
                "paths": [new KGAuthor.Rectangle({
                        x1: def.xAxis.min,
                        x2: def.xAxis.max,
                        y1: def.yAxis.min,
                        y2: def.yAxis.max,
                        inDef: true
                    }, g)]
            }, g);
            g.subObjects.push(g.clipPath);
            g.def.objects.unshift({
                type: 'Axis',
                def: g.def.xAxis
            });
            g.def.objects.unshift({
                type: 'Axis',
                def: g.def.yAxis
            });
            g.def.objects.forEach(function (obj) {
                g.subObjects.push(new KGAuthor[obj.type](obj.def, g));
            });
            console.log(g);
            return _this;
        }
        Graph.prototype.getMarkerName = function (lookup) {
            var g = this;
            var name = '', found = false;
            // look to see if there is already a marker of that name and type
            g.subObjects.forEach(function (obj) {
                if (obj.hasOwnProperty('color') && obj['color'] == lookup.color && obj.hasOwnProperty('markerType') && obj['markerType'] == lookup.markerType) {
                    name = obj.name;
                    found = true;
                }
            });
            // if there is, return its name
            if (found) {
                return name;
            }
            // otherwise create a new marker, add to the graph's subobjects, and return the new marker's name
            else {
                var newMarker = new KGAuthor[lookup.markerType]({ color: lookup.color });
                g.subObjects.push(newMarker);
                return newMarker.name;
            }
        };
        Graph.prototype.getEndArrowName = function (color) {
            return this.getMarkerName({
                markerType: 'EndArrow',
                color: color
            });
        };
        Graph.prototype.getStartArrowName = function (color) {
            return this.getMarkerName({
                markerType: 'StartArrow',
                color: color
            });
        };
        return Graph;
    }(KGAuthor.PositionedObject));
    KGAuthor.Graph = Graph;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Tree = /** @class */ (function (_super) {
        __extends(Tree, _super);
        function Tree(def) {
            var _this = this;
            var showGrid = def.showGrid || false;
            var graphDef = {
                position: def.position,
                objects: def.objects,
                xAxis: { max: 24, ticks: 24, show: showGrid },
                yAxis: { max: 24, ticks: 24, show: showGrid }
            };
            _this = _super.call(this, graphDef) || this;
            var t = _this;
            t.nodeCoordinates = {};
            t.subObjects.push(new KGAuthor.Grid({
                xStep: 3,
                yStep: 3,
                show: showGrid
            }, t));
            def.nodes.forEach(function (nodeDef) {
                t.subObjects.push(new KGAuthor.Node(nodeDef, t));
            });
            if (def.hasOwnProperty('edges')) {
                def.edges.forEach(function (edgeDef) {
                    t.subObjects.push(new KGAuthor.Edge(edgeDef, t));
                });
            }
            return _this;
        }
        return Tree;
    }(KGAuthor.Graph));
    KGAuthor.Tree = Tree;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var GeoGebraContainer = /** @class */ (function (_super) {
        __extends(GeoGebraContainer, _super);
        function GeoGebraContainer(def) {
            var _this = this;
            def.xAxis = { min: 0, max: 1 };
            def.yAxis = { min: 0, max: 1 };
            _this = _super.call(this, def) || this;
            var ggb = _this;
            def.xScaleName = ggb.xScale.name;
            def.yScaleName = ggb.yScale.name;
            ggb.subObjects.push(new KGAuthor.GeoGebraApplet(def));
            return _this;
        }
        return GeoGebraContainer;
    }(KGAuthor.PositionedObject));
    KGAuthor.GeoGebraContainer = GeoGebraContainer;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var MathboxContainer = /** @class */ (function (_super) {
        __extends(MathboxContainer, _super);
        function MathboxContainer(def) {
            var _this = this;
            // the container, as a div, must have an x and y axis of its own.
            // so we must first push down the author's specified x, y, and z axes down to be objects
            def.objects.push({
                "type": "MathboxXAxis",
                "def": def.xAxis
            });
            if (def.xAxis.hasOwnProperty('title')) {
                def.objects.push({
                    "type": "MathboxLabel",
                    "def": {
                        "x": KGAuthor.multiplyDefs(def.xAxis.max, 0.95),
                        "y": KGAuthor.multiplyDefs(def.yAxis.max, -0.02),
                        "z": KGAuthor.multiplyDefs(def.zAxis.max, 0.02),
                        "text": def.xAxis.title,
                        "color": "black"
                    }
                });
            }
            def.objects.push({
                "type": "MathboxYAxis",
                "def": def.yAxis
            });
            if (def.yAxis.hasOwnProperty('title')) {
                def.objects.push({
                    "type": "MathboxLabel",
                    "def": {
                        "x": KGAuthor.multiplyDefs(def.xAxis.max, -0.02),
                        "y": KGAuthor.multiplyDefs(def.yAxis.max, 0.95),
                        "z": KGAuthor.multiplyDefs(def.zAxis.max, 0.02),
                        "text": def.yAxis.title,
                        "color": "black"
                    }
                });
            }
            def.objects.push({
                "type": "MathboxZAxis",
                "def": def.zAxis
            });
            if (def.zAxis.hasOwnProperty('title')) {
                def.objects.push({
                    "type": "MathboxLabel",
                    "def": {
                        "x": KGAuthor.multiplyDefs(def.xAxis.max, -0.02),
                        "y": KGAuthor.multiplyDefs(def.yAxis.max, -0.02),
                        "z": KGAuthor.multiplyDefs(def.zAxis.max, 0.98),
                        "text": def.zAxis.title,
                        "color": "black"
                    }
                });
            }
            delete def.zAxis;
            def.xAxis = { min: 0, max: 1 };
            def.yAxis = { min: 0, max: 1 };
            _this = _super.call(this, def) || this;
            var mb = _this;
            def.xScaleName = mb.xScale.name;
            def.yScaleName = mb.yScale.name;
            def.objects.forEach(function (obj) {
                if (obj.type.indexOf('Mathbox') < 0) {
                    obj.type = 'Mathbox' + obj.type;
                }
                try {
                    var newObj = new KGAuthor[obj.type](obj.def);
                    newObj.subObjects.forEach(function (subOb) {
                        def.objects.push(subOb);
                    });
                }
                catch (e) {
                    console.log("There's no object called ", obj.type);
                }
            });
            console.log('creating mathbox');
            mb.subObjects.push(new KGAuthor.Mathbox(def));
            return _this;
        }
        return MathboxContainer;
    }(KGAuthor.PositionedObject));
    KGAuthor.MathboxContainer = MathboxContainer;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var DivContainer = /** @class */ (function (_super) {
        __extends(DivContainer, _super);
        function DivContainer(def) {
            var _this = this;
            def.xAxis = { min: 0, max: 1 };
            def.yAxis = { min: 0, max: 1 };
            _this = _super.call(this, def) || this;
            var dc = _this;
            dc.subObjects.push(new KGAuthor.PositionedDiv(def, dc));
            return _this;
        }
        return DivContainer;
    }(KGAuthor.PositionedObject));
    KGAuthor.DivContainer = DivContainer;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var GraphObjectGenerator = /** @class */ (function (_super) {
        __extends(GraphObjectGenerator, _super);
        function GraphObjectGenerator(def, graph) {
            var _this = _super.call(this, def) || this;
            if (graph) {
                _this.def.xScaleName = graph.xScale.name;
                _this.def.yScaleName = graph.yScale.name;
                if (!def.inDef) {
                    _this.def.clipPathName = def.clipPathName || graph.clipPath.name;
                }
            }
            _this.subObjects = [];
            return _this;
        }
        GraphObjectGenerator.prototype.extractCoordinates = function (coordinatesKey, xKey, yKey) {
            coordinatesKey = coordinatesKey || 'coordinates';
            xKey = xKey || 'x';
            yKey = yKey || 'y';
            var obj = this, def = this.def;
            if (def.hasOwnProperty(coordinatesKey) && def[coordinatesKey] != undefined) {
                def[xKey] = def[coordinatesKey][0].toString();
                def[yKey] = def[coordinatesKey][1].toString();
                delete def[coordinatesKey];
            }
            obj[xKey] = def[xKey].toString();
            obj[yKey] = def[yKey].toString();
        };
        return GraphObjectGenerator;
    }(KGAuthor.AuthoringObject));
    KGAuthor.GraphObjectGenerator = GraphObjectGenerator;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var DefObject = /** @class */ (function (_super) {
        __extends(DefObject, _super);
        function DefObject(def, graph) {
            def.inDef = true;
            return _super.call(this, def, graph) || this;
        }
        DefObject.prototype.parseSelf = function (parsedData) {
            delete this.def.clipPathName;
            parsedData.clipPaths.push(this.def);
            return parsedData;
        };
        return DefObject;
    }(KGAuthor.GraphObjectGenerator));
    KGAuthor.DefObject = DefObject;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var ClipPath = /** @class */ (function (_super) {
        __extends(ClipPath, _super);
        function ClipPath() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ClipPath.prototype.parseSelf = function (parsedData) {
            delete this.def.clipPathName;
            parsedData.clipPaths.push(this.def);
            return parsedData;
        };
        return ClipPath;
    }(KGAuthor.DefObject));
    KGAuthor.ClipPath = ClipPath;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Marker = /** @class */ (function (_super) {
        __extends(Marker, _super);
        function Marker(def, graph) {
            var _this = _super.call(this, def, graph) || this;
            _this.maskPath = def.maskPath;
            return _this;
        }
        Marker.prototype.parseSelf = function (parsedData) {
            parsedData.markers.push(this.def);
            return parsedData;
        };
        return Marker;
    }(KGAuthor.DefObject));
    KGAuthor.Marker = Marker;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var ArrowDef = /** @class */ (function (_super) {
        __extends(ArrowDef, _super);
        function ArrowDef(def, graph) {
            var _this = this;
            def.name = KG.randomString(10);
            _this = _super.call(this, def, graph) || this;
            _this.color = def.color;
            _this.arrowPath = def.arrowPath;
            return _this;
        }
        return ArrowDef;
    }(KGAuthor.Marker));
    KGAuthor.ArrowDef = ArrowDef;
    var StartArrow = /** @class */ (function (_super) {
        __extends(StartArrow, _super);
        function StartArrow(def, graph) {
            var _this = this;
            def.refX = 2;
            def.maskPath = "M10,1 L10,12 L0,7 L0,5 L10,1";
            def.arrowPath = "M11,2 L11,11 L2,6 L11,2";
            _this = _super.call(this, def, graph) || this;
            _this.markerType = 'StartArrow';
            return _this;
        }
        return StartArrow;
    }(ArrowDef));
    KGAuthor.StartArrow = StartArrow;
    var EndArrow = /** @class */ (function (_super) {
        __extends(EndArrow, _super);
        function EndArrow(def, graph) {
            var _this = this;
            def.refX = 11;
            def.maskPath = "M3,1 L3,12 L12,7 L12,5 L3,1";
            def.arrowPath = "M2,2 L2,11 L10,6 L2,2";
            _this = _super.call(this, def, graph) || this;
            _this.markerType = 'EndArrow';
            return _this;
        }
        return EndArrow;
    }(ArrowDef));
    KGAuthor.EndArrow = EndArrow;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var GraphObject = /** @class */ (function (_super) {
        __extends(GraphObject, _super);
        function GraphObject(def, graph) {
            var _this = this;
            if (def.hasOwnProperty('clipPaths')) {
                def.clipPathName = KG.randomString(10);
            }
            KG.setDefaults(def, {
                name: KG.randomString(10)
            });
            _this = _super.call(this, def, graph) || this;
            var g = _this;
            if (def.hasOwnProperty('color')) {
                g.color = def.color;
            }
            if (def.hasOwnProperty("clipPaths")) {
                var clipPathObjects = def.clipPaths.map(function (shape) {
                    var shapeType = Object.keys(shape)[0];
                    var shapeDef = shape[shapeType];
                    shapeDef.inDef = true;
                    return new KGAuthor[shapeType](shapeDef, graph);
                });
                g.subObjects.push(new KGAuthor.ClipPath({ name: def.clipPathName, paths: clipPathObjects }, graph));
            }
            return _this;
        }
        GraphObject.prototype.parseSelf = function (parsedData) {
            parsedData.layers[this.layer].push(this);
            return parsedData;
        };
        return GraphObject;
    }(KGAuthor.GraphObjectGenerator));
    KGAuthor.GraphObject = GraphObject;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Axis = /** @class */ (function (_super) {
        __extends(Axis, _super);
        function Axis(def, graph) {
            var _this = this;
            KG.setDefaults(def, {
                yPixelOffset: 40,
                xPixelOffset: 40
            });
            _this = _super.call(this, def, graph) || this;
            var a = _this;
            a.type = 'Axis';
            a.layer = 2;
            if (def.hasOwnProperty('title') && ("" != def.title)) {
                if (def.orient == 'bottom') {
                    a.subObjects.push(new KGAuthor.Label({
                        text: "\\text{".concat(def.title, "}"),
                        //text: def.title,
                        //plainText: true,
                        x: KGAuthor.averageDefs(graph.xScale.min, graph.xScale.max),
                        y: graph.yScale.min,
                        yPixelOffset: -1 * def.yPixelOffset
                    }, graph));
                }
                else if (def.orient == 'left') {
                    a.subObjects.push(new KGAuthor.Label({
                        text: "\\text{".concat(def.title, "}"),
                        //text: def.title,
                        //plainText: true,
                        x: graph.xScale.min,
                        y: KGAuthor.averageDefs(graph.yScale.min, graph.yScale.max),
                        xPixelOffset: -1 * def.xPixelOffset,
                        rotate: 90
                    }, graph));
                }
                else if (def.orient == 'top') {
                    a.subObjects.push(new KGAuthor.Label({
                        text: "\\text{".concat(def.title, "}"),
                        x: KGAuthor.averageDefs(graph.xScale.min, graph.xScale.max),
                        y: graph.yScale.min,
                        yPixelOffset: def.yPixelOffset
                    }, graph));
                }
                else {
                    a.subObjects.push(new KGAuthor.Label({
                        text: "\\text{".concat(def.title, "}"),
                        x: graph.xScale.min,
                        y: KGAuthor.averageDefs(graph.yScale.min, graph.yScale.max),
                        xPixelOffset: def.xPixelOffset,
                        rotate: 270
                    }, graph));
                }
            }
            return _this;
        }
        return Axis;
    }(KGAuthor.GraphObject));
    KGAuthor.Axis = Axis;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Grid = /** @class */ (function (_super) {
        __extends(Grid, _super);
        function Grid(def, graph) {
            var _this = this;
            def = def || {};
            _this = _super.call(this, def, graph) || this;
            KG.setDefaults(def, {
                strokeWidth: 1,
                stroke: 'lightgrey',
                lineStyle: 'dotted',
                layer: 0,
                xStep: 1,
                yStep: 1
            });
            var g = _this;
            g.subObjects = [];
            for (var i = 0; i < 10; i++) {
                var x = KGAuthor.multiplyDefs(i, def.xStep), y = KGAuthor.multiplyDefs(i, def.yStep);
                var gxDef = KGAuthor.copyJSON(def), gyDef = KGAuthor.copyJSON(def);
                gxDef.a = [x, graph.yScale.min];
                gxDef.b = [x, graph.yScale.max];
                gyDef.a = [graph.xScale.min, y];
                gyDef.b = [graph.xScale.max, y];
                g.subObjects.push(new KGAuthor.Segment(gxDef, graph));
                g.subObjects.push(new KGAuthor.Segment(gyDef, graph));
            }
            return _this;
        }
        return Grid;
    }(KGAuthor.GraphObjectGenerator));
    KGAuthor.Grid = Grid;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Curve = /** @class */ (function (_super) {
        __extends(Curve, _super);
        function Curve(def, graph) {
            var _this = this;
            def = KGAuthor.setStrokeColor(def);
            KGAuthor.parseFn(def, 'fn', 'univariateFunction');
            KGAuthor.parseFn(def, 'xFn', 'parametricFunction');
            _this = _super.call(this, def, graph) || this;
            var c = _this;
            c.type = 'Curve';
            c.layer = def.layer || 1;
            c.pts = def.pts || [];
            if (def.hasOwnProperty('areaBelow')) {
                KG.setDefaults(def.areaBelow, {
                    color: def.color
                });
                KGAuthor.parseFill(def, 'areaBelow');
                KG.setDefaults(def.areaBelow, def.univariateFunction);
                KGAuthor.parseFn(def.areaBelow, 'fn', 'univariateFunction1');
                c.subObjects.push(new KGAuthor.Area(def.areaBelow, graph));
            }
            if (def.hasOwnProperty('areaAbove')) {
                KG.setDefaults(def.areaBelow, {
                    color: def.color
                });
                KGAuthor.parseFill(def, 'areaAbove');
                KG.setDefaults(def.areaAbove, def.univariateFunction);
                KGAuthor.parseFn(def.areaAbove, 'fn', 'univariateFunction1');
                def.areaAbove.above = true;
                c.subObjects.push(new KGAuthor.Area(def.areaAbove, graph));
            }
            if (def.hasOwnProperty('label')) {
                var labelDef = KGAuthor.copyJSON(def);
                delete labelDef.label;
                labelDef = KG.setDefaults(labelDef, def.label);
                labelDef = KG.setDefaults(labelDef, {
                    fontSize: 12,
                    color: def.color
                });
                if (def.hasOwnProperty('univariateFunction')) {
                    if (labelDef.hasOwnProperty('x') && def.univariateFunction.ind != 'y') {
                        labelDef.coordinates = [labelDef.x, c.yOfX(labelDef.x)];
                        c.subObjects.push(new KGAuthor.Label(labelDef, graph));
                    }
                    else if (labelDef.hasOwnProperty('y') && def.univariateFunction.ind != 'x') {
                        labelDef.coordinates = [c.xOfY(labelDef.y), labelDef.y];
                        c.subObjects.push(new KGAuthor.Label(labelDef, graph));
                    }
                }
                if (def.hasOwnProperty('parametricFunction')) {
                    if (labelDef.hasOwnProperty('t')) {
                        labelDef.coordinates = c.xyOfT(labelDef.t);
                        c.subObjects.push(new KGAuthor.Label(labelDef, graph));
                    }
                }
            }
            return _this;
        }
        Curve.prototype.yOfX = function (x) {
            return "(".concat(KGAuthor.replaceVariable(this.def.univariateFunction.fn, '(x)', "(".concat(x, ")")), ")");
        };
        Curve.prototype.xOfY = function (y) {
            var c = this;
            if (c.def.univariateFunction.hasOwnProperty('yFn')) {
                return "(".concat(KGAuthor.replaceVariable(c.def.univariateFunction.yFn, '(y)', "(".concat(y, ")")), ")");
            }
            else {
                return "(".concat(KGAuthor.replaceVariable(c.def.univariateFunction.fn, '(y)', "(".concat(y, ")")), ")");
            }
        };
        Curve.prototype.xyOfT = function (t) {
            return [
                KGAuthor.replaceVariable(this.def.parametricFunction.xFunction, '(t)', "(".concat(t, ")")),
                KGAuthor.replaceVariable(this.def.parametricFunction.yFunction, '(t)', "(".concat(t, ")"))
            ];
        };
        Curve.prototype.parseSelf = function (parsedData) {
            var c = this;
            parsedData = _super.prototype.parseSelf.call(this, parsedData);
            parsedData.calcs[c.name] = parsedData.calcs[c.name] || {};
            c.pts.forEach(function (p) {
                if (p.hasOwnProperty('x')) {
                    parsedData.calcs[c.name][p['name']] = {
                        x: p['x'],
                        y: c.yOfX(p['x'])
                    };
                }
                if (p.hasOwnProperty('y')) {
                    parsedData.calcs[c.name][p['name']] = {
                        x: c.xOfY(p['y']),
                        y: p['y']
                    };
                }
            });
            return parsedData;
        };
        return Curve;
    }(KGAuthor.GraphObject));
    KGAuthor.Curve = Curve;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Line = /** @class */ (function (_super) {
        __extends(Line, _super);
        function Line(def, graph) {
            var _this = this;
            KG.setDefaults(def, {
                color: 'colors.orange'
            });
            // may define line with two points
            var xIntercept = def.xIntercept, yIntercept = def.yIntercept, slope = def.slope, invSlope = def.invSlope;
            if (def.hasOwnProperty('point') && def.hasOwnProperty('point2')) {
                // still need to handle infinite case
                slope = KGAuthor.divideDefs(KGAuthor.subtractDefs(def.point[1], def.point2[1]), KGAuthor.subtractDefs(def.point[0], def.point2[0]));
                yIntercept = KGAuthor.subtractDefs(def.point[1], KGAuthor.multiplyDefs(slope, def.point[0]));
                invSlope = KGAuthor.divideDefs(KGAuthor.subtractDefs(def.point[0], def.point2[0]), KGAuthor.subtractDefs(def.point[1], def.point2[1]));
                xIntercept = KGAuthor.subtractDefs(def.point[0], KGAuthor.multiplyDefs(invSlope, def.point[1]));
            }
            else if (def.hasOwnProperty('xIntercept') && def.hasOwnProperty('yIntercept')) {
                slope = KGAuthor.negativeDef(KGAuthor.divideDefs(def.yIntercept, def.xIntercept));
                invSlope = KGAuthor.negativeDef(KGAuthor.divideDefs(def.xIntercept, def.yIntercept));
            }
            else if (def.hasOwnProperty('point') && def.hasOwnProperty('yIntercept')) {
                slope = KGAuthor.divideDefs(KGAuthor.subtractDefs(def.point[1], def.yIntercept), def.point[0]);
                invSlope = KGAuthor.divideDefs(def.point[0], KGAuthor.subtractDefs(def.point[1], def.yIntercept));
                xIntercept = KGAuthor.negativeDef(KGAuthor.multiplyDefs(yIntercept, invSlope));
            }
            else if (def.hasOwnProperty('slope') && def.hasOwnProperty('yIntercept')) {
                invSlope = KGAuthor.invertDef(def.slope);
                xIntercept = KGAuthor.negativeDef(KGAuthor.divideDefs(yIntercept, slope));
            }
            else if (def.hasOwnProperty('invSlope') && def.hasOwnProperty('xIntercept')) {
                slope = KGAuthor.invertDef(def.invSlope);
                yIntercept = KGAuthor.negativeDef(KGAuthor.divideDefs(xIntercept, invSlope));
            }
            else if (def.hasOwnProperty('invSlope') && def.hasOwnProperty('yIntercept')) {
                slope = KGAuthor.invertDef(def.invSlope);
            }
            else if (def.hasOwnProperty('slope') && def.hasOwnProperty('point')) {
                invSlope = KGAuthor.invertDef(def.slope);
                xIntercept = KGAuthor.subtractDefs(def.point[0], KGAuthor.divideDefs(def.point[1], def.slope));
                yIntercept = KGAuthor.subtractDefs(def.point[1], KGAuthor.multiplyDefs(def.point[0], def.slope));
            }
            else if (def.hasOwnProperty('invSlope') && def.hasOwnProperty('point')) {
                slope = KGAuthor.invertDef(def.invSlope);
                xIntercept = KGAuthor.subtractDefs(def.point[0], KGAuthor.divideDefs(def.point[1], slope));
                yIntercept = KGAuthor.subtractDefs(def.point[1], KGAuthor.multiplyDefs(def.point[0], slope));
            }
            else if (def.hasOwnProperty('slope')) {
                invSlope = KGAuthor.invertDef(def.slope);
                xIntercept = 0;
                yIntercept = 0;
            }
            else if (def.hasOwnProperty('yIntercept')) {
                invSlope = Infinity;
                xIntercept = null;
                yIntercept = def.yIntercept;
                slope = 0;
            }
            else if (def.hasOwnProperty('xIntercept')) {
                invSlope = 0;
                xIntercept = def.xIntercept;
                yIntercept = null;
                slope = Infinity;
            }
            else {
                xIntercept = 0;
                yIntercept = 0;
                slope = KGAuthor.divideDefs(def.point[1], def.point[0]);
                invSlope = KGAuthor.divideDefs(def.point[0], def.point[1]);
            }
            def.univariateFunction = {
                fn: "".concat(yIntercept, " + (").concat(slope, ")*(x)"),
                yFn: "".concat(xIntercept, " + (").concat(invSlope, ")*(y)"),
                ind: "((".concat(invSlope, " == 0) ? 'y' : 'x')"),
                samplePoints: 2
            };
            if (def.hasOwnProperty('min')) {
                def.univariateFunction.min = def.min;
                delete def.min;
            }
            if (def.hasOwnProperty('max')) {
                def.univariateFunction.max = def.max;
                delete def.max;
            }
            _this = _super.call(this, def, graph) || this;
            var l = _this;
            l.xIntercept = xIntercept;
            l.yIntercept = yIntercept;
            l.slope = slope;
            l.invSlope = invSlope;
            if (def.hasOwnProperty('label') && def.label.hasOwnProperty('r')) {
                var labelDef = KGAuthor.copyJSON(def);
                delete labelDef.label;
                labelDef = KG.setDefaults(labelDef, def.label);
                labelDef = KG.setDefaults(labelDef, {
                    fontSize: 12,
                    color: def.color,
                    coordinates: lineRadius(l, labelDef.r, labelDef.center)
                });
                console.log(labelDef);
                l.subObjects.push(new KGAuthor.Label(labelDef, graph));
            }
            return _this;
        }
        Line.prototype.parseSelf = function (parsedData) {
            var l = this;
            parsedData = _super.prototype.parseSelf.call(this, parsedData);
            var d = {
                slope: l.slope.toString(),
                invSlope: l.invSlope.toString()
            };
            if (l.xIntercept) {
                d.xIntercept = l.xIntercept.toString();
            }
            if (l.yIntercept) {
                d.yIntercept = l.yIntercept.toString();
            }
            if (!l.xIntercept) {
                d.fixedPoint = "((".concat(d.yIntercept, ")/(1 - ").concat(l.slope.toString(), "))");
            }
            else if (!l.yIntercept) {
                d.fixedPoint = "((".concat(d.xIntercept, ")/(1 - ").concat(l.invSlope.toString(), "))");
            }
            else {
                d.fixedPoint = "(".concat(d.invSlope, " == 0 ? (").concat(d.xIntercept, ")/(1 - ").concat(l.invSlope.toString(), ") : (").concat(d.yIntercept, ")/(1 - ").concat(l.slope.toString(), "))");
            }
            l.pts.forEach(function (p) {
                if (p.hasOwnProperty('r')) {
                    var coordinates = lineRadius(l, p['r'], p['center']);
                    parsedData.calcs[l.name][p['name']] = {
                        x: coordinates[0],
                        y: coordinates[1]
                    };
                }
            });
            parsedData.calcs[l.name] = KG.setDefaults(parsedData.calcs[l.name] || {}, d);
            return parsedData;
        };
        return Line;
    }(KGAuthor.Curve));
    KGAuthor.Line = Line;
    function lineIntersection(l1, l2) {
        var x = KGAuthor.divideDefs(KGAuthor.addDefs(l1.xIntercept, KGAuthor.multiplyDefs(l1.invSlope, l2.yIntercept)), KGAuthor.subtractDefs("1", KGAuthor.multiplyDefs(l1.invSlope, l2.slope)));
        var y = l2.yOfX(x);
        return [x, y];
    }
    KGAuthor.lineIntersection = lineIntersection;
    // Find the intersection of a line with a circle of radius r
    function lineRadius(line, r, center) {
        var a = KGAuthor.addDefs(1, KGAuthor.squareDef(line.slope));
        var b = KGAuthor.multiplyDefs(2, KGAuthor.multiplyDefs(line.slope, line.yIntercept));
        var c = KGAuthor.subtractDefs(KGAuthor.squareDef(line.yIntercept), KGAuthor.squareDef(r));
        if (center) {
            var cx = center[0];
            var cy = center[1] || 0;
            b = KGAuthor.subtractDefs(b, KGAuthor.multiplyDefs(2, KGAuthor.addDefs(center[0], KGAuthor.multiplyDefs(line.slope, cy))));
            c = KGAuthor.addDefs(c, KGAuthor.subtractDefs(KGAuthor.addDefs(KGAuthor.squareDef(cx), KGAuthor.squareDef(cy)), KGAuthor.multiplyDefs(2, KGAuthor.multiplyDefs(line.yIntercept, cy))));
        }
        var x = KGAuthor.quadraticRootDef(a, b, c, true);
        var y = line.yOfX(x);
        return [x, y];
    }
    KGAuthor.lineRadius = lineRadius;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Ellipse = /** @class */ (function (_super) {
        __extends(Ellipse, _super);
        function Ellipse(def, graph) {
            var _this = this;
            KG.setDefaults(def, {
                color: 'colors.blue',
                opacity: 0.2,
                rx: 1,
                ry: def.rx
            });
            def = KGAuthor.setFillColor(def);
            def = KGAuthor.setStrokeColor(def);
            _this = _super.call(this, def, graph) || this;
            var c = _this;
            c.type = 'Circle';
            c.layer = def.layer || 0;
            // may define the center using 'coordinates' or 'center' or 'c':
            if (def.hasOwnProperty('c')) {
                c.extractCoordinates('c');
            }
            else if (def.hasOwnProperty('center')) {
                c.extractCoordinates('center');
            }
            else {
                c.extractCoordinates();
            }
            def = KGAuthor.makeDraggable(def);
            if (def.hasOwnProperty('label')) {
                var labelDef = KGAuthor.copyJSON(def);
                delete labelDef.label;
                labelDef = KG.setDefaults(labelDef, def.label);
                labelDef = KG.setDefaults(labelDef, {
                    fontSize: 10,
                    color: def.color,
                    bgcolor: null
                });
                c.subObjects.push(new KGAuthor.Label(labelDef, graph));
            }
            return _this;
        }
        return Ellipse;
    }(KGAuthor.GraphObject));
    KGAuthor.Ellipse = Ellipse;
    var Circle = /** @class */ (function (_super) {
        __extends(Circle, _super);
        function Circle(def, graph) {
            if (def.hasOwnProperty('radius')) {
                def.r = def.radius;
                delete def.radius;
            }
            if (def.hasOwnProperty('r')) {
                def.rx = def.r;
                def.ry = def.r;
            }
            return _super.call(this, def, graph) || this;
        }
        return Circle;
    }(Ellipse));
    KGAuthor.Circle = Circle;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Point = /** @class */ (function (_super) {
        __extends(Point, _super);
        function Point(def, graph) {
            var _this = this;
            KG.setDefaults(def, {
                color: 'colors.blue'
            });
            def = KGAuthor.setFillColor(def);
            _this = _super.call(this, def, graph) || this;
            var p = _this;
            p.type = 'Point';
            p.layer = 3;
            p.extractCoordinates();
            def = KGAuthor.makeDraggable(def);
            if (def.hasOwnProperty('label')) {
                var labelDef = KGAuthor.copyJSON(def);
                delete labelDef.label;
                labelDef = KG.setDefaults(labelDef, def.label);
                labelDef = KG.setDefaults(labelDef, {
                    fontSize: 10,
                    position: 'bl',
                    color: def.color,
                    bgcolor: null
                });
                p.subObjects.push(new KGAuthor.Label(labelDef, graph));
            }
            if (def.hasOwnProperty('droplines')) {
                if (def.droplines.hasOwnProperty('vertical')) {
                    var verticalDroplineDef = KGAuthor.copyJSON(def);
                    // only drag vertical droplines horizontally
                    if (verticalDroplineDef.hasOwnProperty('drag')) {
                        verticalDroplineDef.drag = verticalDroplineDef.drag.filter(function (value, index, arr) { return ((value.directions == 'x') || value.hasOwnProperty('horizontal')); });
                    }
                    if (def.droplines.hasOwnProperty('top')) {
                        verticalDroplineDef.y = graph.yScale.max;
                        var xTopAxisLabelDef = KGAuthor.copyJSON(verticalDroplineDef);
                        xTopAxisLabelDef.y = 'OPPAXIS';
                        KG.setDefaults(xTopAxisLabelDef, {
                            text: def.droplines.top,
                            fontSize: 10
                        });
                        p.subObjects.push(new KGAuthor.Label(xTopAxisLabelDef, graph));
                    }
                    p.subObjects.push(new KGAuthor.VerticalDropline(verticalDroplineDef, graph));
                    var xAxisLabelDef = KGAuthor.copyJSON(verticalDroplineDef);
                    xAxisLabelDef.y = 'AXIS';
                    KG.setDefaults(xAxisLabelDef, {
                        text: def.droplines.vertical,
                        fontSize: 10
                    });
                    p.subObjects.push(new KGAuthor.Label(xAxisLabelDef, graph));
                }
                if (def.droplines.hasOwnProperty('horizontal')) {
                    var horizontalDroplineDef = KGAuthor.copyJSON(def);
                    // only drag horizontal droplines vertically
                    if (horizontalDroplineDef.hasOwnProperty('drag')) {
                        horizontalDroplineDef.drag = horizontalDroplineDef.drag.filter(function (value, index, arr) { return ((value.directions == 'y') || value.hasOwnProperty('vertical')); });
                    }
                    p.subObjects.push(new KGAuthor.HorizontalDropline(horizontalDroplineDef, graph));
                    var yAxisLabelDef = KGAuthor.copyJSON(horizontalDroplineDef);
                    yAxisLabelDef.x = 'AXIS';
                    KG.setDefaults(yAxisLabelDef, {
                        text: def.droplines.horizontal,
                        fontSize: 10
                    });
                    p.subObjects.push(new KGAuthor.Label(yAxisLabelDef, graph));
                }
            }
            return _this;
        }
        Point.prototype.parseSelf = function (parsedData) {
            var p = this;
            parsedData = _super.prototype.parseSelf.call(this, parsedData);
            parsedData.calcs[p.name] = {
                x: p.x.toString(),
                y: p.y.toString()
            };
            return parsedData;
        };
        return Point;
    }(KGAuthor.GraphObject));
    KGAuthor.Point = Point;
    var LineCircleIntersection = /** @class */ (function (_super) {
        __extends(LineCircleIntersection, _super);
        function LineCircleIntersection(def, graph) {
            var _this = this;
            var l = new KGAuthor.Line(def.lineDef, graph);
            var coordinates = KGAuthor.lineRadius(l, def.radius);
            KG.setDefaults(def, {
                coordinates: coordinates,
                positive: true
            });
            _this = _super.call(this, def, graph) || this;
            var lci = _this;
            lci.subObjects.push(l);
            return _this;
        }
        return LineCircleIntersection;
    }(Point));
    KGAuthor.LineCircleIntersection = LineCircleIntersection;
    var Points = /** @class */ (function (_super) {
        __extends(Points, _super);
        function Points(def, graph) {
            var _this = _super.call(this, def, graph) || this;
            var ps = _this;
            var coordinateArray = def.coordinates;
            coordinateArray.forEach(function (c) {
                var pointDef = JSON.parse(JSON.stringify(def));
                pointDef.coordinates = c;
                ps.subObjects.push(new Point(pointDef, graph));
            });
            return _this;
        }
        return Points;
    }(KGAuthor.GraphObjectGenerator));
    KGAuthor.Points = Points;
    var Node = /** @class */ (function (_super) {
        __extends(Node, _super);
        function Node(def, tree) {
            var _this = this;
            KG.setDefaults(def, {
                name: KG.randomString(10)
            });
            if (def.hasOwnProperty('payoffs')) {
                var payoff1 = "\\\\color{${colors.player1}}{" + def.payoffs.player1 + "}";
                var comma = "\\\\color{black}{,\\\\ }";
                var payoff2 = "\\\\color{${colors.player2}}{" + def.payoffs.player2 + "}";
                def.label = {
                    text: "`" + payoff1 + comma + payoff2 + "`",
                    position: def.payoffs.position || 'l',
                    fontSize: 14
                };
            }
            _this = _super.call(this, def, tree) || this;
            var node = _this;
            tree.nodeCoordinates[def.name] = [node.x, node.y];
            node.name = def.name;
            if (def.hasOwnProperty('children')) {
                var n = def.children.length;
                for (var i = 0; i < n; i++) {
                    var childNum = i + 1; // number of child, with first being 1 rather than 0;
                    var nodeDef = def.children[i];
                    KG.setDefaults(nodeDef, {
                        name: KG.randomString(10)
                    });
                    var edgeDef = {
                        node1: def.name,
                        node2: nodeDef.name,
                        color: def.color,
                        label: { text: nodeDef.edgeLabel }
                    };
                    // if selectChildren is true, create a parameter called "select[nodeName]"
                    // which is used to select which child is active
                    // when true, clicking on an edge selects that edge
                    // unless the edge is already selected, in which case no edge is selected
                    if (def.hasOwnProperty('childSelectParam')) {
                        var param = def.childSelectParam;
                        var transitions = new Array(n + 1);
                        transitions[0] = childNum;
                        for (var j = 1; j < n + 1; j++) {
                            transitions[j] = (j == childNum) ? 0 : childNum;
                        }
                        edgeDef['click'] = [{
                                param: param,
                                transitions: transitions
                            }];
                        edgeDef['strokeWidth'] = "((params.".concat(def.childSelectParam, " == ").concat(childNum, ") ? 6 : 2)");
                    }
                    tree.subObjects.push(new Node(nodeDef, tree));
                    tree.subObjects.push(new KGAuthor.Edge(edgeDef, tree));
                }
            }
            return _this;
        }
        return Node;
    }(Point));
    KGAuthor.Node = Node;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Segment = /** @class */ (function (_super) {
        __extends(Segment, _super);
        function Segment(def, graph) {
            var _this = this;
            def = KGAuthor.setStrokeColor(def);
            if (def.hasOwnProperty('startArrow')) {
                def.startArrowName = graph.getStartArrowName(def.color);
            }
            if (def.hasOwnProperty('endArrow')) {
                def.endArrowName = graph.getEndArrowName(def.color);
            }
            _this = _super.call(this, def, graph) || this;
            var s = _this;
            s.type = 'Segment';
            s.layer = 1;
            s.extractCoordinates('a', 'x1', 'y1');
            s.extractCoordinates('b', 'x2', 'y2');
            // new way of trimming
            if (def.hasOwnProperty('trim')) {
                console.log('implementing trimming');
                var x1 = s.x1;
                var y1 = s.y1;
                var x2 = s.x2;
                var y2 = s.y2;
                s.def.x1 = KGAuthor.averageDefs(x2, x1, def.trim);
                s.def.x2 = KGAuthor.averageDefs(x1, x2, def.trim);
                s.def.y1 = KGAuthor.averageDefs(y2, y1, def.trim);
                s.def.y2 = KGAuthor.averageDefs(y1, y2, def.trim);
            }
            if (def.hasOwnProperty('label')) {
                var labelDef = KGAuthor.copyJSON(def);
                delete labelDef.label;
                if (typeof def.label === "string") {
                    def.label = { text: def.label };
                }
                labelDef = KG.setDefaults(def.label || {}, labelDef);
                labelDef = KG.setDefaults(labelDef, {
                    fontSize: 12,
                    color: def.color,
                    location: 0.5
                });
                labelDef.coordinates = [
                    KGAuthor.averageDefs(s.x1, s.x2, labelDef.location),
                    KGAuthor.averageDefs(s.y1, s.y2, labelDef.location)
                ];
                s.subObjects.push(new KGAuthor.Label(labelDef, graph));
            }
            if (def.hasOwnProperty('handles')) {
                var aPointDef = {
                    x: s.x1,
                    y: s.y1,
                    color: def.color,
                    r: 4,
                    draggable: def.draggable,
                    show: def.show
                };
                var bPointDef = {
                    x: s.x2,
                    y: s.y2,
                    color: def.color,
                    r: 4,
                    draggable: def.draggable,
                    show: def.show
                };
                s.subObjects.push(new KGAuthor.Point(aPointDef, graph));
                s.subObjects.push(new KGAuthor.Point(bPointDef, graph));
            }
            return _this;
        }
        return Segment;
    }(KGAuthor.GraphObject));
    KGAuthor.Segment = Segment;
    var CrossGraphSegment = /** @class */ (function (_super) {
        __extends(CrossGraphSegment, _super);
        function CrossGraphSegment(def, graph) {
            def.xScale2Name = '';
            return _super.call(this, def, graph) || this;
        }
        return CrossGraphSegment;
    }(Segment));
    KGAuthor.CrossGraphSegment = CrossGraphSegment;
    var Edge = /** @class */ (function (_super) {
        __extends(Edge, _super);
        function Edge(def, tree) {
            def.a = tree.nodeCoordinates[def.node1];
            def.b = tree.nodeCoordinates[def.node2];
            return _super.call(this, def, tree) || this;
        }
        return Edge;
    }(Segment));
    KGAuthor.Edge = Edge;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Arrow = /** @class */ (function (_super) {
        __extends(Arrow, _super);
        function Arrow(def, graph) {
            def.endArrow = true;
            if (def.hasOwnProperty('double')) {
                def.startArrow = def.double;
            }
            def.a = def.begin;
            def.b = def.end;
            return _super.call(this, def, graph) || this;
        }
        return Arrow;
    }(KGAuthor.Segment));
    KGAuthor.Arrow = Arrow;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Dropline = /** @class */ (function (_super) {
        __extends(Dropline, _super);
        function Dropline(def, graph) {
            def.lineStyle = 'dotted';
            delete def.label;
            return _super.call(this, def, graph) || this;
        }
        return Dropline;
    }(KGAuthor.Segment));
    KGAuthor.Dropline = Dropline;
    var VerticalDropline = /** @class */ (function (_super) {
        __extends(VerticalDropline, _super);
        function VerticalDropline(def, graph) {
            def.a = [def.x, graph.xScale.intercept];
            def.b = [def.x, def.y];
            return _super.call(this, def, graph) || this;
        }
        return VerticalDropline;
    }(Dropline));
    KGAuthor.VerticalDropline = VerticalDropline;
    var CrossGraphVerticalDropline = /** @class */ (function (_super) {
        __extends(CrossGraphVerticalDropline, _super);
        function CrossGraphVerticalDropline(def, graph) {
            def.xScale2Name = '';
            return _super.call(this, def, graph) || this;
        }
        return CrossGraphVerticalDropline;
    }(VerticalDropline));
    KGAuthor.CrossGraphVerticalDropline = CrossGraphVerticalDropline;
    var HorizontalDropline = /** @class */ (function (_super) {
        __extends(HorizontalDropline, _super);
        function HorizontalDropline(def, graph) {
            def.a = [graph.yScale.intercept, def.y];
            def.b = [def.x, def.y];
            return _super.call(this, def, graph) || this;
        }
        return HorizontalDropline;
    }(Dropline));
    KGAuthor.HorizontalDropline = HorizontalDropline;
    var CrossGraphHorizontalDropline = /** @class */ (function (_super) {
        __extends(CrossGraphHorizontalDropline, _super);
        function CrossGraphHorizontalDropline(def, graph) {
            def.xScale2Name = '';
            return _super.call(this, def, graph) || this;
        }
        return CrossGraphHorizontalDropline;
    }(HorizontalDropline));
    KGAuthor.CrossGraphHorizontalDropline = CrossGraphHorizontalDropline;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Area = /** @class */ (function (_super) {
        __extends(Area, _super);
        function Area(def, graph) {
            var _this = this;
            KG.setDefaults(def, {
                color: 'colors.blue',
                opacity: 0.2
            });
            def = KGAuthor.setFillColor(def);
            KGAuthor.parseFn(def, 'fn', 'univariateFunction1');
            KGAuthor.parseFn(def, 'fn1', 'univariateFunction1');
            KGAuthor.parseFn(def, 'fn2', 'univariateFunction2');
            _this = _super.call(this, def, graph) || this;
            _this.type = 'Area';
            _this.layer = def.layer || 0;
            return _this;
        }
        return Area;
    }(KGAuthor.GraphObject));
    KGAuthor.Area = Area;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Rectangle = /** @class */ (function (_super) {
        __extends(Rectangle, _super);
        function Rectangle(def, graph) {
            var _this = this;
            KGAuthor.setFillColor(def);
            _this = _super.call(this, def, graph) || this;
            var rect = _this;
            rect.type = 'Rectangle';
            rect.layer = def.layer || 0;
            rect.extractCoordinates('a', 'x1', 'y1');
            rect.extractCoordinates('b', 'x2', 'y2');
            if (def.hasOwnProperty('label')) {
                var labelDef = KGAuthor.copyJSON(def);
                delete labelDef.label;
                labelDef = KG.setDefaults(labelDef, def.label);
                labelDef = KG.setDefaults(labelDef, {
                    fontSize: 10,
                    color: def.color,
                    bgcolor: null,
                    x: KGAuthor.averageDefs(rect['x1'], rect['x2']),
                    y: KGAuthor.averageDefs(rect['y1'], rect['y2'])
                });
                rect.subObjects.push(new KGAuthor.Label(labelDef, graph));
            }
            return _this;
        }
        return Rectangle;
    }(KGAuthor.GraphObject));
    KGAuthor.Rectangle = Rectangle;
    var Overlap = /** @class */ (function (_super) {
        __extends(Overlap, _super);
        function Overlap(def, graph) {
            var _this = this;
            var shape1name = KG.randomString(10), shape2name = KG.randomString(10);
            def = KGAuthor.setFillColor(def);
            KG.setDefaults(def, {
                x1: graph.def.xAxis.min,
                x2: graph.def.xAxis.max,
                y1: graph.def.yAxis.min,
                y2: graph.def.yAxis.max,
                clipPathName: shape1name,
                clipPathName2: shape2name
            });
            _this = _super.call(this, def, graph) || this;
            var r = _this;
            var clipPathObjects = def.shapes.map(function (shape) {
                var shapeType = Object.keys(shape)[0];
                var shapeDef = shape[shapeType];
                shapeDef.inDef = true;
                return new KGAuthor[shapeType](shapeDef, graph);
            });
            // As of now this does at most two; can make more recursive in the future but this handles 80% of the use cases
            r.subObjects.push(new KGAuthor.ClipPath({ name: shape1name, paths: [clipPathObjects[0]] }, graph));
            r.subObjects.push(new KGAuthor.ClipPath({ name: shape2name, paths: [clipPathObjects[1]] }, graph));
            return _this;
        }
        return Overlap;
    }(Rectangle));
    KGAuthor.Overlap = Overlap;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Contour = /** @class */ (function (_super) {
        __extends(Contour, _super);
        function Contour(def, graph) {
            var _this = this;
            def = KGAuthor.setStrokeColor(def);
            _this = _super.call(this, def, graph) || this;
            var c = _this;
            c.type = 'Contour';
            c.layer = def.layer || 1;
            if (def.hasOwnProperty('coordinates')) {
                c.extractCoordinates();
            }
            if (!def.hasOwnProperty('level')) {
                def.level = def.fn.replace(/\(x\)/g, "(".concat(def.x, ")")).replace(/\(y\)/g, "(".concat(def.y, ")"));
            }
            c.level = def.level;
            return _this;
        }
        Contour.prototype.parseSelf = function (parsedData) {
            var le = this;
            parsedData = _super.prototype.parseSelf.call(this, parsedData);
            parsedData.calcs.contourLevel = le.level;
            return parsedData;
        };
        return Contour;
    }(KGAuthor.GraphObject));
    KGAuthor.Contour = Contour;
    var ContourMap = /** @class */ (function (_super) {
        __extends(ContourMap, _super);
        function ContourMap(def, graph) {
            var _this = this;
            KG.setDefaults(def, {
                color: "grey",
                strokeWidth: 0.5
            });
            _this = _super.call(this, def, graph) || this;
            var m = _this;
            m.type = 'ContourMap';
            m.layer = def.layer || 1;
            m.subObjects = def.levels.map(function (level) {
                var contourDef = KGAuthor.copyJSON(def);
                delete contourDef.levels;
                contourDef.level = level;
                return new Contour(contourDef, graph);
            });
            console.log('contours: ', m.subObjects);
            return _this;
        }
        return ContourMap;
    }(KGAuthor.GraphObject));
    KGAuthor.ContourMap = ContourMap;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var AngleMarker = /** @class */ (function (_super) {
        __extends(AngleMarker, _super);
        function AngleMarker(def, graph) {
            var _this = this;
            KG.setDefaults(def, {
                name: 'angle',
                color: 'colors.grey',
                coordinates: [0, 0],
                radians: false,
                start: 0,
                r: KGAuthor.multiplyDefs(0.05, KGAuthor.subtractDefs(graph.def.xAxis.max, graph.def.xAxis.min)),
                strokeWidth: 0.75
            });
            def = KGAuthor.setStrokeColor(def);
            if (def.hasOwnProperty("measure")) {
                def.end = KGAuthor.addDefs(def.start, def.measure);
            }
            else {
                def.measure = KGAuthor.subtractDefs(def.end, def.start);
            }
            // convert to radians unless already radians
            var start = def.radians ? def.start : KGAuthor.multiplyDefs(def.start, 0.01745329252), measure = def.radians ? def.measure : KGAuthor.multiplyDefs(def.measure, 0.01745329252), end = def.radians ? def.end : KGAuthor.multiplyDefs(def.end, 0.01745329252), mid = KGAuthor.addDefs(start, KGAuthor.multiplyDefs(0.5, measure));
            def.parametricFunction = {
                xFunction: KGAuthor.addDefs(def.coordinates[0], KGAuthor.multiplyDefs(def.r, "cos(t)")),
                yFunction: KGAuthor.addDefs(def.coordinates[1], KGAuthor.multiplyDefs(def.r, "sin(t)")),
                min: start,
                max: end
            };
            _this = _super.call(this, def, graph) || this;
            var dm = _this;
            dm.measureDegrees = def.radians ? KGAuthor.multiplyDefs(def.measure, 57.2957795131) : def.measure;
            dm.measureRadians = KGAuthor.divideDefs(measure, Math.PI);
            var labelDef = KG.setDefaults(def.label || {}, {
                x: KGAuthor.addDefs(def.coordinates[0], KGAuthor.multiplyDefs(KGAuthor.multiplyDefs(1.7, def.r), "cos(".concat(mid, ")"))),
                y: KGAuthor.addDefs(def.coordinates[1], KGAuthor.multiplyDefs(KGAuthor.multiplyDefs(1.7, def.r), "sin(".concat(mid, ")"))),
                fontSize: 8,
                color: def.stroke,
                bgcolor: "none",
                radians: false,
                show: def.show
            });
            var labelTextRadians = "`${calcs." + dm.name + ".measureRadians.toFixed(2)}\\\\pi`", labelTextDegrees = "`${calcs." + dm.name + ".measureDegrees.toFixed(0)}^{\\\\circ}`";
            labelDef.text = labelDef.hasOwnProperty('text') ? def.label.text : labelDef.radians ? labelTextRadians : labelTextDegrees;
            dm.subObjects.push(new KGAuthor.Label(labelDef, graph));
            return _this;
        }
        AngleMarker.prototype.parseSelf = function (parsedData) {
            var dm = this;
            parsedData = _super.prototype.parseSelf.call(this, parsedData);
            parsedData.calcs[dm.name] = {
                measureDegrees: dm.measureDegrees.toString(),
                measureRadians: dm.measureRadians.toString()
            };
            return parsedData;
        };
        return AngleMarker;
    }(KGAuthor.Curve));
    KGAuthor.AngleMarker = AngleMarker;
    var Angle = /** @class */ (function (_super) {
        __extends(Angle, _super);
        function Angle(def, graph) {
            var _this = this;
            var A = new KGAuthor.Point(def.pointA, graph), B = new KGAuthor.Point(def.pointB, graph), C = new KGAuthor.Point(def.pointC, graph);
            def.start = "atan2(".concat(A.y, " - ").concat(B.y, ",").concat(A.x, " - ").concat(B.x, ")");
            def.end = "atan2(".concat(C.y, " - ").concat(B.y, ",").concat(C.x, " - ").concat(B.x, ")");
            def.coordinates = [B.x, B.y];
            def.radians = true;
            KG.setDefaults(def, {
                label: {
                    radians: false
                }
            });
            _this = _super.call(this, def, graph) || this;
            var a = _this;
            a.subObjects.push(A);
            a.subObjects.push(B);
            a.subObjects.push(C);
            if (def.showSegments) {
                var ABdef = KGAuthor.copyJSON(def), CBdef = KGAuthor.copyJSON(def);
                ABdef.a = [B.x, B.y];
                ABdef.b = [A.x, A.y];
                delete ABdef.label;
                a.subObjects.push(new KGAuthor.Segment(ABdef, graph));
                CBdef.a = [B.x, B.y];
                CBdef.b = [C.x, C.y];
                delete CBdef.label;
                a.subObjects.push(new KGAuthor.Segment(CBdef, graph));
            }
            return _this;
        }
        return Angle;
    }(AngleMarker));
    KGAuthor.Angle = Angle;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var MathboxObject = /** @class */ (function (_super) {
        __extends(MathboxObject, _super);
        function MathboxObject(def) {
            var _this = _super.call(this, def) || this;
            _this.mb = def.mb;
            return _this;
        }
        return MathboxObject;
    }(KGAuthor.AuthoringObject));
    KGAuthor.MathboxObject = MathboxObject;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var MathboxAxis = /** @class */ (function (_super) {
        __extends(MathboxAxis, _super);
        function MathboxAxis(def) {
            var _this = _super.call(this, def) || this;
            var a = _this;
            a.type = 'MathboxAxis';
            return _this;
        }
        return MathboxAxis;
    }(KGAuthor.MathboxObject));
    KGAuthor.MathboxAxis = MathboxAxis;
    var MathboxXAxis = /** @class */ (function (_super) {
        __extends(MathboxXAxis, _super);
        function MathboxXAxis(def) {
            var _this = _super.call(this, def) || this;
            var a = _this;
            a.type = 'MathboxXAxis';
            return _this;
        }
        return MathboxXAxis;
    }(KGAuthor.MathboxObject));
    KGAuthor.MathboxXAxis = MathboxXAxis;
    var MathboxYAxis = /** @class */ (function (_super) {
        __extends(MathboxYAxis, _super);
        function MathboxYAxis(def) {
            var _this = _super.call(this, def) || this;
            var a = _this;
            a.type = 'MathboxYAxis';
            return _this;
        }
        return MathboxYAxis;
    }(KGAuthor.MathboxObject));
    KGAuthor.MathboxYAxis = MathboxYAxis;
    var MathboxZAxis = /** @class */ (function (_super) {
        __extends(MathboxZAxis, _super);
        function MathboxZAxis(def) {
            var _this = _super.call(this, def) || this;
            var a = _this;
            a.type = 'MathboxZAxis';
            return _this;
        }
        return MathboxZAxis;
    }(KGAuthor.MathboxObject));
    KGAuthor.MathboxZAxis = MathboxZAxis;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var MathboxPoint = /** @class */ (function (_super) {
        __extends(MathboxPoint, _super);
        function MathboxPoint(def) {
            var _this = _super.call(this, def) || this;
            var p = _this;
            p.type = 'MathboxPoint';
            if (def.hasOwnProperty('droplines')) {
                // vertical dropline to bottom plane
                p.subObjects.push(new KGAuthor.MathboxLine({
                    mb: def.mb,
                    x1: def.x,
                    x2: def.x,
                    y1: def.y,
                    y2: def.y,
                    z1: 0,
                    z2: def.z,
                    stroke: def.stroke,
                    linestyle: 'dotted'
                }));
                // dropline to x axis; assume min is 0 for now
                p.subObjects.push(new KGAuthor.MathboxLine({
                    mb: def.mb,
                    x1: def.x,
                    x2: 0,
                    y1: def.y,
                    y2: def.y,
                    z1: 0,
                    z2: 0,
                    stroke: def.stroke,
                    linestyle: 'dotted'
                }));
                // dropline to y axis; assume min is 0 for now
                p.subObjects.push(new KGAuthor.MathboxLine({
                    mb: def.mb,
                    x1: def.x,
                    x2: def.x,
                    y1: def.y,
                    y2: 0,
                    z1: 0,
                    z2: 0,
                    stroke: def.stroke,
                    linestyle: 'dotted'
                }));
            }
            return _this;
        }
        return MathboxPoint;
    }(KGAuthor.MathboxObject));
    KGAuthor.MathboxPoint = MathboxPoint;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var MathboxLine = /** @class */ (function (_super) {
        __extends(MathboxLine, _super);
        function MathboxLine(def) {
            var _this = _super.call(this, def) || this;
            var a = _this;
            a.type = 'MathboxLine';
            return _this;
        }
        return MathboxLine;
    }(KGAuthor.MathboxObject));
    KGAuthor.MathboxLine = MathboxLine;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var MathboxLabel = /** @class */ (function (_super) {
        __extends(MathboxLabel, _super);
        function MathboxLabel(def) {
            var _this = _super.call(this, def) || this;
            var a = _this;
            a.type = 'MathboxLabel';
            return _this;
        }
        return MathboxLabel;
    }(KGAuthor.MathboxObject));
    KGAuthor.MathboxLabel = MathboxLabel;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var MathboxArea = /** @class */ (function (_super) {
        __extends(MathboxArea, _super);
        function MathboxArea(def) {
            var _this = _super.call(this, def) || this;
            var a = _this;
            a.type = 'MathboxAxis';
            return _this;
        }
        return MathboxArea;
    }(KGAuthor.MathboxObject));
    KGAuthor.MathboxArea = MathboxArea;
    var Area3D = /** @class */ (function (_super) {
        __extends(Area3D, _super);
        function Area3D() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Area3D;
    }(MathboxArea));
    KGAuthor.Area3D = Area3D;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var MathboxPlane = /** @class */ (function (_super) {
        __extends(MathboxPlane, _super);
        function MathboxPlane(def) {
            var _this = _super.call(this, def) || this;
            var a = _this;
            a.type = 'MathboxPlane';
            return _this;
        }
        return MathboxPlane;
    }(KGAuthor.MathboxObject));
    KGAuthor.MathboxPlane = MathboxPlane;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var MathboxFunctionSurface = /** @class */ (function (_super) {
        __extends(MathboxFunctionSurface, _super);
        function MathboxFunctionSurface(def) {
            var _this = _super.call(this, def) || this;
            var a = _this;
            a.type = 'MathboxFunctionSurface';
            return _this;
        }
        return MathboxFunctionSurface;
    }(KGAuthor.MathboxObject));
    KGAuthor.MathboxFunctionSurface = MathboxFunctionSurface;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
var KGAuthor;
(function (KGAuthor) {
    var MathboxCurve = /** @class */ (function (_super) {
        __extends(MathboxCurve, _super);
        function MathboxCurve(def) {
            var _this = _super.call(this, def) || this;
            var a = _this;
            a.type = 'MathboxCurve';
            return _this;
        }
        return MathboxCurve;
    }(KGAuthor.MathboxObject));
    KGAuthor.MathboxCurve = MathboxCurve;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../kg.ts" />
var KGAuthor;
(function (KGAuthor) {
    var DivObject = /** @class */ (function (_super) {
        __extends(DivObject, _super);
        function DivObject() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DivObject.prototype.parseSelf = function (parsedData) {
            parsedData.divs.push(this);
            return parsedData;
        };
        return DivObject;
    }(KGAuthor.GraphObject));
    KGAuthor.DivObject = DivObject;
    var Div = /** @class */ (function (_super) {
        __extends(Div, _super);
        function Div(def) {
            var _this = _super.call(this, def) || this;
            _this.type = "Div";
            return _this;
        }
        return Div;
    }(DivObject));
    KGAuthor.Div = Div;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../kg.ts" />
var KGAuthor;
(function (KGAuthor) {
    var PositionedDiv = /** @class */ (function (_super) {
        __extends(PositionedDiv, _super);
        function PositionedDiv(def, divContainer) {
            var _this = this;
            delete def.xAxis;
            delete def.yAxis;
            def.xScaleName = divContainer.xScale.name;
            def.yScaleName = divContainer.yScale.name;
            _this = _super.call(this, def) || this;
            _this.type = 'PositionedDiv';
            return _this;
        }
        return PositionedDiv;
    }(KGAuthor.DivObject));
    KGAuthor.PositionedDiv = PositionedDiv;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../kg.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Table = /** @class */ (function (_super) {
        __extends(Table, _super);
        function Table(def) {
            var _this = _super.call(this, def) || this;
            _this.type = 'Table';
            return _this;
        }
        return Table;
    }(KGAuthor.Div));
    KGAuthor.Table = Table;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../kg.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Label = /** @class */ (function (_super) {
        __extends(Label, _super);
        function Label(def, graph) {
            var _this = this;
            var xAxisIntercept = 0, yAxisIntercept = 0;
            if (graph.def.hasOwnProperty('xAxis')) {
                if (graph.def.xAxis.hasOwnProperty('intercept')) {
                    xAxisIntercept = graph.def.xAxis.intercept;
                }
            }
            if (graph.def.hasOwnProperty('yAxis')) {
                if (graph.def.yAxis.hasOwnProperty('intercept')) {
                    yAxisIntercept = graph.def.yAxis.intercept;
                }
            }
            if (def.x == 'AXIS') {
                def.x = yAxisIntercept;
                def.position = "r";
            }
            if (def.y == 'AXIS') {
                def.y = xAxisIntercept;
                def.position = "t";
            }
            if (def.hasOwnProperty('position')) {
                if (def.position.toLowerCase() == 'bl') {
                    def.xPixelOffset = 5;
                    def.yPixelOffset = def.fontSize;
                    def.align = 'left';
                }
                if (def.position.toLowerCase() == 'tl') {
                    def.xPixelOffset = 5;
                    def.yPixelOffset = -(def.fontSize + 2);
                    def.align = 'left';
                }
                if (def.position.toLowerCase() == 'tr') {
                    def.xPixelOffset = -5;
                    def.yPixelOffset = -(def.fontSize + 2);
                    def.align = 'right';
                }
                if (def.position.toLowerCase() == 'br') {
                    def.xPixelOffset = -5;
                    def.yPixelOffset = def.fontSize;
                    def.align = 'right';
                }
                if (def.position.toLowerCase() == 'tr') {
                    def.xPixelOffset = -5;
                    def.yPixelOffset = -(def.fontSize + 2);
                    def.align = 'right';
                }
                if (def.position.toLowerCase() == 't') {
                    def.yPixelOffset = -(def.fontSize + 5);
                }
                if (def.position.toLowerCase() == 'b') {
                    def.yPixelOffset = def.fontSize + 2;
                }
                if (def.position.toLowerCase() == 'r') {
                    def.xPixelOffset = -8;
                    def.align = 'right';
                }
                if (def.position.toLowerCase() == 'l') {
                    def.xPixelOffset = 8;
                    def.align = 'left';
                }
            }
            _this = _super.call(this, def, graph) || this;
            _this.type = 'Label';
            _this.extractCoordinates();
            return _this;
        }
        return Label;
    }(KGAuthor.DivObject));
    KGAuthor.Label = Label;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../kg.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Sidebar = /** @class */ (function (_super) {
        __extends(Sidebar, _super);
        function Sidebar(def) {
            var _this = this;
            def.controls.forEach(function (controlDef) {
                KGAuthor.parseControlsDef(controlDef);
            });
            _this = _super.call(this, def) || this;
            _this.type = 'Sidebar';
            return _this;
        }
        return Sidebar;
    }(KGAuthor.DivObject));
    KGAuthor.Sidebar = Sidebar;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../kg.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Explanation = /** @class */ (function (_super) {
        __extends(Explanation, _super);
        function Explanation(def) {
            var _this = _super.call(this, def) || this;
            _this.type = 'Explanation';
            return _this;
        }
        return Explanation;
    }(KGAuthor.DivObject));
    KGAuthor.Explanation = Explanation;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../kg.ts" />
var KGAuthor;
(function (KGAuthor) {
    function parseControlsDef(controlDef) {
        if (controlDef.hasOwnProperty('radioGroup')) {
            controlDef.radios = controlDef.radioGroup.options.map(function (option, index) {
                return {
                    param: controlDef.radioGroup.param,
                    optionValue: index,
                    label: "\\text{".concat(option, "}")
                };
            });
        }
    }
    KGAuthor.parseControlsDef = parseControlsDef;
    var Controls = /** @class */ (function (_super) {
        __extends(Controls, _super);
        function Controls(def) {
            var _this = this;
            parseControlsDef(def);
            _this = _super.call(this, def) || this;
            _this.type = 'Controls';
            return _this;
        }
        return Controls;
    }(KGAuthor.DivObject));
    KGAuthor.Controls = Controls;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../kg.ts" />
var KGAuthor;
(function (KGAuthor) {
    var GameMatrix = /** @class */ (function (_super) {
        __extends(GameMatrix, _super);
        function GameMatrix(def) {
            var _this = _super.call(this, def) || this;
            _this.type = 'GameMatrix';
            return _this;
        }
        return GameMatrix;
    }(KGAuthor.DivObject));
    KGAuthor.GameMatrix = GameMatrix;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../kg.ts" />
var KGAuthor;
(function (KGAuthor) {
    var GeoGebraApplet = /** @class */ (function (_super) {
        __extends(GeoGebraApplet, _super);
        function GeoGebraApplet(def) {
            var _this = _super.call(this, def) || this;
            _this.type = 'GeoGebraApplet';
            return _this;
        }
        return GeoGebraApplet;
    }(KGAuthor.DivObject));
    KGAuthor.GeoGebraApplet = GeoGebraApplet;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../kg.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Mathbox = /** @class */ (function (_super) {
        __extends(Mathbox, _super);
        function Mathbox(def) {
            var _this = _super.call(this, def) || this;
            var mb = _this;
            mb.type = 'Mathbox';
            def.objects.forEach(function (mbo) { mbo.def.mb = mb; });
            return _this;
        }
        Mathbox.prototype.addObject = function (mbo) {
            this.def.objects.push(mbo);
            return this;
        };
        return Mathbox;
    }(KGAuthor.DivObject));
    KGAuthor.Mathbox = Mathbox;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../eg.ts" />
var KGAuthor;
(function (KGAuthor) {
    var EconSchema = /** @class */ (function (_super) {
        __extends(EconSchema, _super);
        function EconSchema(def) {
            var _this = this;
            def.idioms = {};
            def.custom = def.custom || "0";
            var idiomMenu = [
                {
                    PPFlabel: ["PPF", "PPC"],
                    PPFword: ["frontier", "curve"],
                    PPFWord: ["Frontier", "Curve"]
                },
                {
                    good1label: ["x_1", "x", "X"],
                    labor1label: ["L_1", "L_x", "L_X"],
                    good1word: ["good 1", "good X", "good X"],
                    good1Word: ["Good 1", "Good X", "Good X"],
                    good2label: ["x_2", "y", "Y"],
                    labor2label: ["L_2", "L_y", "L_Y"],
                    good2word: ["good 2", "good Y", "good Y"],
                    good2Word: ["Good 2", "Good Y", "Good Y"]
                },
                {
                    oldValueLabel: ["\\ ", "_1", "0"],
                    newValueLabel: ["^\\prime", "_2", "1"]
                }
            ];
            //console.log("custom: ", def.custom)
            idiomMenu.forEach(function (idiomGroup, index) {
                // if the user has specified a choice, use it.
                if (index < def.custom.length) {
                    for (var idiomName in idiomGroup) {
                        def.idioms[idiomName] = idiomGroup[idiomName][def.custom[index]];
                    }
                }
                // otherwise default to first
                else {
                    for (var idiomName in idiomGroup) {
                        def.idioms[idiomName] = idiomGroup[idiomName][0];
                    }
                }
            });
            console.log("idioms: ", def.idioms);
            def.colors = KG.setDefaults(def.colors || {}, {
                // consumer theory
                utility: 'purple',
                mrs: 'blue',
                dispreferred: 'red',
                preferred: 'green',
                offer: 'blue',
                incomeOffer: 'orange',
                demand: 'blue',
                budget: 'green',
                costlier: 'red',
                endowment: 'grey',
                incEffect: 'orange',
                subEffect: 'red',
                // producer theory
                production: 'blue',
                mpl: 'olive',
                marginalCost: 'orange',
                marginalRevenue: 'olive',
                supply: 'orange',
                shortRun: 'red',
                longRun: 'orange',
                profit: 'green',
                loss: 'red',
                ppf: 'red',
                mrt: 'orange',
                // equilibrium
                price: 'grey',
                paretoLens: "'#ffff99'",
                equilibriumPrice: 'green',
                // macro
                consumption: 'blue',
                depreciation: "red",
                savings: "green",
                tax: 'red',
                // game theory
                player1: 'blue',
                player2: 'red',
                player3: 'orange',
                nature: 'green',
                terminal: 'gray'
            });
            _this = _super.call(this, def) || this;
            _this.idiomMenu = idiomMenu;
            return _this;
        }
        return EconSchema;
    }(KGAuthor.Schema));
    KGAuthor.EconSchema = EconSchema;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../eg.ts" />
var KGAuthor;
(function (KGAuthor) {
    var BowlesHallidaySchema = /** @class */ (function (_super) {
        __extends(BowlesHallidaySchema, _super);
        function BowlesHallidaySchema(def) {
            // create color scheme here; I took these from the spreadsheet
            var purple = "'#3f007d'", blue = "'#084081'", green = "'#005824'";
            // define any overrides to the defined Econ schema here
            def.colors = {
                // consumer theory
                demand: purple,
                supply: blue,
                equilibriumPrice: green,
                indifferenceCurve: green,
                bestResponse: purple
            };
            return _super.call(this, def) || this;
        }
        return BowlesHallidaySchema;
    }(KGAuthor.EconSchema));
    KGAuthor.BowlesHallidaySchema = BowlesHallidaySchema;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../eg.ts" />
var KGAuthor;
(function (KGAuthor) {
    var LowdownSchema = /** @class */ (function (_super) {
        __extends(LowdownSchema, _super);
        function LowdownSchema(def) {
            // create color scheme here; I took these from the spreadsheet
            var blue = "'#0000AA'", red = "'#AA0000'";
            // define any overrides to the defined Econ schema here
            def.colors = {
                // consumer theory
                demand: blue,
                supply: blue,
                equilibriumPrice: red
            };
            return _super.call(this, def) || this;
        }
        return LowdownSchema;
    }(KGAuthor.EconSchema));
    KGAuthor.LowdownSchema = LowdownSchema;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../eg.ts" />
var KGAuthor;
(function (KGAuthor) {
    var EdgeworthBox = /** @class */ (function (_super) {
        __extends(EdgeworthBox, _super);
        function EdgeworthBox(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var agentA = def['agentA'], agentB = def['agentB'];
            var width = 0.738, height = 0.8;
            /* if(def.totalGood1 > def.totalGood2) {
                height = def.totalGood2*height/def.totalGood1;
            }

            if(def.totalGood2 > def.totalGood1) {
                height = def.totalGood1*width/def.totalGood2;
            } */
            _this.aspectRatio = 2;
            agentA.position = {
                "x": 0.15,
                "y": 0.1,
                "width": width,
                "height": height
            };
            agentB.position = {
                "x": 0.15 + width,
                "y": 0.1 + height,
                "width": -1 * width,
                "height": -1 * height
            };
            agentA.xAxis.max = agentB.xAxis.max = def.totalGood1;
            agentA.yAxis.max = agentB.yAxis.max = def.totalGood2;
            agentB.xAxis.orient = 'top';
            agentB.yAxis.orient = 'right';
            l.subObjects.push(new KGAuthor.Graph(agentA));
            l.subObjects.push(new KGAuthor.Graph(agentB));
            return _this;
        }
        return EdgeworthBox;
    }(KGAuthor.Layout));
    KGAuthor.EdgeworthBox = EdgeworthBox;
    var EdgeworthBoxSquare = /** @class */ (function (_super) {
        __extends(EdgeworthBoxSquare, _super);
        function EdgeworthBoxSquare(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var agentA = def['agentA'], agentB = def['agentB'];
            var width = 0.74, height = 0.9;
            _this.aspectRatio = 1.22;
            agentA.position = {
                "x": 0.15,
                "y": 0.025,
                "width": width,
                "height": height
            };
            agentB.position = {
                "x": 0.15 + width,
                "y": 0.025 + height,
                "width": -1 * width,
                "height": -1 * height
            };
            agentA.xAxis.max = agentB.xAxis.max = def.totalGood1;
            agentA.yAxis.max = agentB.yAxis.max = def.totalGood2;
            agentB.xAxis.orient = 'top';
            agentB.yAxis.orient = 'right';
            l.subObjects.push(new KGAuthor.Graph(agentA));
            l.subObjects.push(new KGAuthor.Graph(agentB));
            return _this;
        }
        return EdgeworthBoxSquare;
    }(KGAuthor.SquareLayout));
    KGAuthor.EdgeworthBoxSquare = EdgeworthBoxSquare;
    var EdgeworthBoxPlusSidebar = /** @class */ (function (_super) {
        __extends(EdgeworthBoxPlusSidebar, _super);
        function EdgeworthBoxPlusSidebar(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var agentA = def['agentA'], agentB = def['agentB'], sidebarDef = def['sidebar'];
            var width = 0.738, height = 0.8;
            /* if(def.totalGood1 > def.totalGood2) {
                height = def.totalGood2*height/def.totalGood1;
            }

            if(def.totalGood2 > def.totalGood1) {
                height = def.totalGood1*width/def.totalGood2;
            } */
            _this.aspectRatio = 2;
            agentA.position = {
                "x": 0.15,
                "y": 0.1,
                "width": width,
                "height": height
            };
            agentB.position = {
                "x": 0.15 + width,
                "y": 0.1 + height,
                "width": -1 * width,
                "height": -1 * height
            };
            agentA.xAxis.max = agentB.xAxis.max = def.totalGood1;
            agentA.yAxis.max = agentB.yAxis.max = def.totalGood2;
            agentB.xAxis.orient = 'top';
            agentB.yAxis.orient = 'right';
            l.subObjects.push(new KGAuthor.Graph(agentA));
            l.subObjects.push(new KGAuthor.Graph(agentB));
            l.subObjects.push(new KGAuthor.Sidebar(sidebarDef));
            return _this;
        }
        return EdgeworthBoxPlusSidebar;
    }(KGAuthor.Layout));
    KGAuthor.EdgeworthBoxPlusSidebar = EdgeworthBoxPlusSidebar;
    var EdgeworthBoxPlusTwoGraphsPlusSidebar = /** @class */ (function (_super) {
        __extends(EdgeworthBoxPlusTwoGraphsPlusSidebar, _super);
        function EdgeworthBoxPlusTwoGraphsPlusSidebar(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var agentA = def['agentA'], agentB = def['agentB'], graph1 = def['graph1'], graph2 = def['graph2'], sidebarDef = def['sidebar'];
            var width = 0.738, height = 0.9;
            if (def.totalGood1 > def.totalGood2) {
                height = def.totalGood2 * height / def.totalGood1;
            }
            if (def.totalGood2 > def.totalGood1) {
                height = def.totalGood1 * width / def.totalGood2;
            }
            agentA.position = {
                "x": 0.15,
                "y": 0.05,
                "width": width,
                "height": height
            };
            agentB.position = {
                "x": 0.15 + width,
                "y": 0.05 + height,
                "width": -1 * width,
                "height": -1 * height
            };
            graph1.position = {
                "x": 0.1,
                "y": height + 0.15,
                "width": 0.35,
                "height": 0.85 - height
            };
            graph2.position = {
                "x": 0.6,
                "y": height + 0.15,
                "width": 0.35,
                "height": 0.85 - height
            };
            agentA.xAxis.max = agentB.xAxis.max = def.totalGood1;
            agentA.yAxis.max = agentB.yAxis.max = def.totalGood2;
            agentB.xAxis.orient = 'top';
            agentB.yAxis.orient = 'right';
            l.subObjects.push(new KGAuthor.Graph(agentB));
            l.subObjects.push(new KGAuthor.Graph(agentA));
            l.subObjects.push(new KGAuthor.Graph(graph1));
            l.subObjects.push(new KGAuthor.Graph(graph2));
            l.subObjects.push(new KGAuthor.Sidebar(sidebarDef));
            return _this;
        }
        return EdgeworthBoxPlusTwoGraphsPlusSidebar;
    }(KGAuthor.SquareLayout));
    KGAuthor.EdgeworthBoxPlusTwoGraphsPlusSidebar = EdgeworthBoxPlusTwoGraphsPlusSidebar;
    var EdgeworthBoxAboveOneGraphPlusSidebar = /** @class */ (function (_super) {
        __extends(EdgeworthBoxAboveOneGraphPlusSidebar, _super);
        function EdgeworthBoxAboveOneGraphPlusSidebar(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var agentA = def['agentA'], agentB = def['agentB'], graph = def['graph'], sidebarDef = def['sidebar'];
            var width = 0.738, height = 0.9;
            if (def.totalGood1 > def.totalGood2) {
                height = def.totalGood2 * height / def.totalGood1;
            }
            if (def.totalGood2 > def.totalGood1) {
                height = def.totalGood1 * width / def.totalGood2;
            }
            agentA.position = {
                "x": 0.15,
                "y": 0.05,
                "width": width,
                "height": height
            };
            agentB.position = {
                "x": 0.15 + width,
                "y": 0.05 + height,
                "width": -1 * width,
                "height": -1 * height
            };
            graph.position = {
                "x": 0.15,
                "y": height + 0.15,
                "width": width,
                "height": 0.85 - height
            };
            agentA.xAxis.max = agentB.xAxis.max = def.totalGood1;
            agentA.yAxis.max = agentB.yAxis.max = def.totalGood2;
            agentB.xAxis.orient = 'top';
            agentB.yAxis.orient = 'right';
            l.subObjects.push(new KGAuthor.Graph(agentB));
            l.subObjects.push(new KGAuthor.Graph(agentA));
            l.subObjects.push(new KGAuthor.Graph(graph));
            l.subObjects.push(new KGAuthor.Sidebar(sidebarDef));
            return _this;
        }
        return EdgeworthBoxAboveOneGraphPlusSidebar;
    }(KGAuthor.SquareLayout));
    KGAuthor.EdgeworthBoxAboveOneGraphPlusSidebar = EdgeworthBoxAboveOneGraphPlusSidebar;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../eg.ts" />
var KGAuthor;
(function (KGAuthor) {
    var EntryDeterrence = /** @class */ (function (_super) {
        __extends(EntryDeterrence, _super);
        function EntryDeterrence(def) {
            return _super.call(this, def) || this;
        }
        return EntryDeterrence;
    }(KGAuthor.Tree));
    KGAuthor.EntryDeterrence = EntryDeterrence;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var EconMultivariateFunction = /** @class */ (function (_super) {
        __extends(EconMultivariateFunction, _super);
        function EconMultivariateFunction(def) {
            var _this = this;
            KG.setDefaults(def, {
                name: KG.randomString(10)
            });
            _this = _super.call(this, def) || this;
            var fn = _this;
            fn.interpolation = 'curveMonotoneX';
            if (def.hasOwnProperty('alpha')) {
                fn.alpha = def.alpha;
                fn.exponents = def.exponents || [def.alpha, KGAuthor.subtractDefs(1, def.alpha)];
                fn.coefficients = def.coefficients || [def.alpha, KGAuthor.subtractDefs(1, def.alpha)];
            }
            else if (def.hasOwnProperty('exponents')) {
                fn.exponents = def.exponents;
                fn.alpha = KGAuthor.divideDefs(fn.exponents[0], KGAuthor.addDefs(fn.exponents[0], fn.exponents[1]));
                fn.coefficients = def.coefficients;
            }
            else if (def.hasOwnProperty('coefficients')) {
                fn.exponents = def.coefficients;
                fn.coefficients = def.coefficients;
                fn.alpha = KGAuthor.divideDefs(fn.coefficients[0], KGAuthor.addDefs(fn.coefficients[0], fn.coefficients[1]));
            }
            return _this;
        }
        EconMultivariateFunction.prototype.value = function (x) {
            return null;
        };
        EconMultivariateFunction.prototype.extractLevel = function (def) {
            var u = this;
            if (def.hasOwnProperty('level') && def.level != undefined) {
                return KGAuthor.getDefinitionProperty(def.level);
            }
            else if (def.hasOwnProperty('point') && def.point != undefined) {
                return u.value(def.point);
            }
            else if (def.hasOwnProperty('budgetLine')) {
                var bl = new KGAuthor.EconBudgetLine(def.budgetLine, null);
                return u.value(u.optimalBundle(bl));
            }
        };
        EconMultivariateFunction.prototype.levelSet = function (def) {
            return [];
        };
        EconMultivariateFunction.prototype.levelCurve = function (def, graph) {
            def.interpolation = this.interpolation;
            return KGAuthor.curvesFromFunctions(this.levelSet(def), def, graph);
        };
        EconMultivariateFunction.prototype.levelCurveSlope = function (x) {
            return null;
        };
        EconMultivariateFunction.prototype.areaBelowLevelCurve = function (def, graph) {
            var fn = this;
            fn.fillBelowRect = null;
            def.interpolation = fn.interpolation;
            var fns = fn.levelSet(def);
            var objs = [];
            fns.forEach(function (fn) {
                var areaDef = KGAuthor.copyJSON(def);
                areaDef.univariateFunction1 = fn;
                objs.push(new KGAuthor.Area(areaDef, graph));
            });
            if (fn.fillBelowRect) {
                fn.fillBelowRect.show = def.show;
                fn.fillBelowRect.fill = def.fill;
                objs.push(new KGAuthor.Rectangle(fn.fillBelowRect, graph));
            }
            return objs;
        };
        EconMultivariateFunction.prototype.areaAboveLevelCurve = function (def, graph) {
            var fn = this;
            fn.fillAboveRect = null;
            def.interpolation = fn.interpolation;
            var fns = fn.levelSet(def);
            var objs = [];
            fns.forEach(function (fn) {
                var areaDef = KGAuthor.copyJSON(def);
                areaDef.univariateFunction1 = fn;
                areaDef.above = true;
                objs.push(new KGAuthor.Area(areaDef, graph));
            });
            if (fn.fillAboveRect) {
                fn.fillAboveRect.show = def.show;
                fn.fillAboveRect.fill = def.fill;
                fn.fillAboveRect.inDef = true;
                objs.push(new KGAuthor.Rectangle(fn.fillAboveRect, graph));
            }
            var clipPathName = def.hasOwnProperty('name') ? def.name + "_above" : KG.randomString(10);
            return [
                new KGAuthor.Rectangle({
                    clipPathName: clipPathName,
                    x1: graph.def.xAxis.min,
                    x2: graph.def.xAxis.max,
                    y1: graph.def.yAxis.min,
                    y2: graph.def.yAxis.max,
                    fill: def.fill,
                    show: def.show
                }, graph),
                new KGAuthor.ClipPath({
                    "name": clipPathName,
                    "paths": objs
                }, graph)
            ];
        };
        EconMultivariateFunction.prototype.lowestCostBundle = function (level, prices) {
            return []; // defined at the subclass level
        };
        /* Optimization with an exogenous income */
        EconMultivariateFunction.prototype.cornerCondition = function (budgetLine) {
            return 'false';
        };
        EconMultivariateFunction.prototype.lagrangeBundle = function (budgetLine) {
            return [];
        };
        EconMultivariateFunction.prototype.optimalBundle = function (budgetLine) {
            return [];
        };
        EconMultivariateFunction.prototype.quantityDemanded = function (budgetLine, good) {
            return this.optimalBundle(budgetLine)[good - 1];
        };
        EconMultivariateFunction.prototype.priceOfferFunction = function (budgetLine, good, min, max, graph) {
            var u = this;
            var blDef;
            if (budgetLine.hasOwnProperty('point') && budgetLine.point != undefined) {
                min = 0.01;
                max = 0.99;
                blDef = {
                    p1: '(t)',
                    p2: '1 - (t)',
                    m: "".concat(budgetLine.point[0], "*(t) + ").concat(budgetLine.point[1], "*(1-(t))")
                };
            }
            else {
                blDef = (good == 1) ? { p1: '(t)', p2: budgetLine.p2, m: budgetLine.m } : {
                    p1: budgetLine.p1,
                    p2: '(t)',
                    m: budgetLine.m
                };
            }
            var optimalBundle = u.optimalBundle(new KGAuthor.EconBudgetLine(blDef, graph));
            return [
                {
                    xFunction: optimalBundle[0],
                    yFunction: optimalBundle[1],
                    min: min,
                    max: max,
                    samplePoints: 100,
                    parametric: true
                }
            ];
        };
        EconMultivariateFunction.prototype.priceOfferCurve = function (budgetLine, good, min, max, def, graph) {
            var u = this;
            def.interpolation = 'curveMonotoneX';
            return KGAuthor.curvesFromFunctions(u.priceOfferFunction(budgetLine, good, min, max, graph), def, graph);
        };
        EconMultivariateFunction.prototype.demandFunction = function (budgetLine, good, graph) {
            var u = this, blDef = (good == 1) ? { p1: '(y)', p2: budgetLine.p2, m: budgetLine.m } : {
                p1: budgetLine.p1,
                p2: '(y)',
                m: budgetLine.m
            };
            return [
                {
                    "fn": u.quantityDemanded(new KGAuthor.EconBudgetLine(blDef, graph), good),
                    "ind": "y",
                    "samplePoints": 30
                }
            ];
        };
        EconMultivariateFunction.prototype.demandCurve = function (budgetLine, good, def, graph) {
            var u = this;
            def.interpolation = 'curveMonotoneX';
            return KGAuthor.curvesFromFunctions(u.demandFunction(budgetLine, good, graph), def, graph);
        };
        /* Net demand and supply from an endowment */
        EconMultivariateFunction.prototype.endowmentDemandFunction = function (budgetLine, good, graph) {
            var u = this;
            var netDemand = '', netSupply = '', grossDemand = '';
            var x1 = budgetLine.point[0], x2 = budgetLine.point[1];
            if (good == 2) {
                var optimalBundle = u.optimalBundle(new KGAuthor.EconBudgetLine({
                    p1: budgetLine.p1,
                    p2: '(y)',
                    m: "(".concat(x1, "*").concat(budgetLine.p1, " + ").concat(x2, "*(y))")
                }, graph));
                grossDemand = optimalBundle[1];
                netDemand = KGAuthor.subtractDefs(grossDemand, x2);
                netSupply = KGAuthor.subtractDefs(x2, grossDemand);
            }
            else {
                var optimalBundle = u.optimalBundle(new KGAuthor.EconBudgetLine({
                    p1: '(y)',
                    p2: budgetLine.p2,
                    m: "(".concat(x1, "*(y) + ").concat(x2, "*").concat(budgetLine.p2, ")")
                }, graph));
                grossDemand = optimalBundle[0];
                netDemand = KGAuthor.subtractDefs(grossDemand, x1);
                netSupply = KGAuthor.subtractDefs(x1, grossDemand);
            }
            return {
                grossDemand: [
                    {
                        fn: grossDemand,
                        ind: 'y'
                    }
                ],
                netDemand: [
                    {
                        fn: netDemand,
                        ind: 'y'
                    }
                ],
                netSupply: [
                    {
                        fn: netSupply,
                        ind: 'y'
                    }
                ]
            };
        };
        EconMultivariateFunction.prototype.grossDemandCurve = function (budgetLine, good, def, graph) {
            var u = this;
            def.interpolation = 'curveMonotoneX';
            return KGAuthor.curvesFromFunctions(u.endowmentDemandFunction(budgetLine, good, graph).grossDemand, def, graph);
        };
        EconMultivariateFunction.prototype.netDemandCurve = function (budgetLine, good, def, graph) {
            var u = this;
            def.interpolation = 'curveMonotoneX';
            return KGAuthor.curvesFromFunctions(u.endowmentDemandFunction(budgetLine, good, graph).netDemand, def, graph);
        };
        EconMultivariateFunction.prototype.netSupplyCurve = function (budgetLine, good, def, graph) {
            var u = this;
            def.interpolation = 'curveMonotoneX';
            return KGAuthor.curvesFromFunctions(u.endowmentDemandFunction(budgetLine, good, graph).netSupply, def, graph);
        };
        EconMultivariateFunction.prototype.indirectUtility = function (income, prices) {
            return this.extractLevel({ budgetLine: { p1: prices[0], p2: prices[1], m: income } });
        };
        EconMultivariateFunction.prototype.expenditure = function (level, prices) {
            var b = this.lowestCostBundle(level, prices);
            return KGAuthor.addDefs(KGAuthor.multiplyDefs(b[0], prices[0]), KGAuthor.multiplyDefs(b[1], prices[1]));
        };
        EconMultivariateFunction.prototype.laborRequirement = function (level, capital) {
            // defined at subclass level
        };
        return EconMultivariateFunction;
    }(KGAuthor.AuthoringObject));
    KGAuthor.EconMultivariateFunction = EconMultivariateFunction;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var CobbDouglasFunction = /** @class */ (function (_super) {
        __extends(CobbDouglasFunction, _super);
        function CobbDouglasFunction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CobbDouglasFunction.prototype.value = function (x) {
            var e = this.exponents, scalar = this.coefficients.length == 1 ? this.coefficients[0] : 1;
            return "(".concat(scalar, "*(").concat(x[0], ")^(").concat(e[0], "))*((").concat(x[1], ")^(").concat(e[1], "))");
        };
        CobbDouglasFunction.prototype.levelSet = function (def) {
            var e = this.exponents, scalar = this.coefficients.length == 1 ? this.coefficients[0] : 1, level = KGAuthor.divideDefs(this.extractLevel(def), scalar), xMin = "(".concat(level, ")^(1/(").concat(e[0], " + ").concat(e[1], "))"), yMin = "(".concat(level, ")^(1/(").concat(e[0], " + ").concat(e[1], "))");
            this.fillBelowRect = {
                x1: 0,
                x2: xMin,
                y1: 0,
                y2: yMin,
                show: def.show
            };
            return [
                {
                    "fn": "((".concat(level, ")/(y)^(").concat(e[1], "))^(1/(").concat(e[0], "))"),
                    "ind": "y",
                    "min": yMin,
                    "samplePoints": 30
                },
                {
                    "fn": "((".concat(level, ")/(x)^(").concat(e[0], "))^(1/(").concat(e[1], "))"),
                    "ind": "x",
                    "min": xMin,
                    "samplePoints": 30
                }
            ];
        };
        CobbDouglasFunction.prototype.levelCurveSlope = function (x) {
            var c = this.coefficients;
            return KGAuthor.negativeDef(KGAuthor.divideDefs(KGAuthor.multiplyDefs(c[0], x[1]), KGAuthor.multiplyDefs(c[1], x[0])));
        };
        CobbDouglasFunction.prototype.optimalBundle = function (budgetLine) {
            var a = this.alpha;
            return [KGAuthor.multiplyDefs(a, budgetLine.xIntercept), KGAuthor.multiplyDefs(KGAuthor.subtractDefs(1, a), budgetLine.yIntercept)];
        };
        CobbDouglasFunction.prototype.lowestCostBundle = function (level, prices) {
            var e = this.exponents, ratio = KGAuthor.multiplyDefs(KGAuthor.divideDefs(prices[0], prices[1]), KGAuthor.divideDefs(e[1], e[0])), scale = KGAuthor.addDefs(e[0], e[1]), scaledLevel = KGAuthor.raiseDefToDef(level, KGAuthor.divideDefs(1, scale));
            return [
                KGAuthor.divideDefs(scaledLevel, KGAuthor.raiseDefToDef(ratio, KGAuthor.divideDefs(e[1], scale))),
                KGAuthor.multiplyDefs(scaledLevel, KGAuthor.raiseDefToDef(ratio, KGAuthor.divideDefs(e[0], scale)))
            ];
        };
        CobbDouglasFunction.prototype.laborRequirement = function (level, capital) {
            var e = this.exponents;
            return "((".concat(level, ")/(").concat(capital, ")^(").concat(e[1], "))^(1/(").concat(e[0], "))");
        };
        return CobbDouglasFunction;
    }(KGAuthor.EconMultivariateFunction));
    KGAuthor.CobbDouglasFunction = CobbDouglasFunction;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var MinFunction = /** @class */ (function (_super) {
        __extends(MinFunction, _super);
        function MinFunction(def) {
            var _this = _super.call(this, def) || this;
            var fn = _this;
            fn.interpolation = 'curveLinear';
            if (def.hasOwnProperty('alpha')) {
                fn.coefficients = [KGAuthor.divideDefs(0.5, def.alpha), KGAuthor.divideDefs(0.5, KGAuthor.subtractDefs(1, def.alpha))];
            }
            return _this;
        }
        MinFunction.prototype.value = function (x) {
            var c = this.coefficients;
            return "(min((".concat(x[0], ")*(").concat(c[0], "),(").concat(x[1], ")*(").concat(c[1], ")))");
        };
        MinFunction.prototype.levelSet = function (def) {
            var c = this.coefficients, level = def.level || this.value(def.point), xMin = KGAuthor.divideDefs(level, c[0]), yMin = KGAuthor.divideDefs(level, c[1]);
            this.fillBelowRect = {
                x1: 0,
                x2: xMin,
                y1: 0,
                y2: yMin,
                show: def.show
            };
            return [
                {
                    "fn": KGAuthor.divideDefs(level, c[1]),
                    "ind": "x",
                    "min": xMin,
                    "samplePoints": 2
                }, {
                    "fn": KGAuthor.divideDefs(level, c[0]),
                    "ind": "y",
                    "min": yMin,
                    "samplePoints": 2
                }
            ];
        };
        MinFunction.prototype.optimalBundle = function (budgetLine) {
            var good1perBundle = KGAuthor.invertDef(this.coefficients[0]), good2perBundle = KGAuthor.invertDef(this.coefficients[1]), bundles = KGAuthor.divideDefs(budgetLine.m, KGAuthor.addDefs(KGAuthor.multiplyDefs(budgetLine.p1, good1perBundle), KGAuthor.multiplyDefs(budgetLine.p2, good2perBundle)));
            return [KGAuthor.multiplyDefs(good1perBundle, bundles), KGAuthor.multiplyDefs(good2perBundle, bundles)];
        };
        MinFunction.prototype.lowestCostBundle = function (level, prices) {
            var a = this.coefficients[0], b = this.coefficients[1];
            return [
                KGAuthor.divideDefs(level, a),
                KGAuthor.divideDefs(level, b)
            ];
        };
        return MinFunction;
    }(KGAuthor.EconMultivariateFunction));
    KGAuthor.MinFunction = MinFunction;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var LinearFunction = /** @class */ (function (_super) {
        __extends(LinearFunction, _super);
        function LinearFunction(def) {
            var _this = _super.call(this, def) || this;
            var fn = _this;
            _this.interpolation = 'curveLinear';
            if (def.hasOwnProperty('alpha')) {
                fn.coefficients = [def.alpha, KGAuthor.subtractDefs(1, def.alpha)];
            }
            return _this;
        }
        LinearFunction.prototype.value = function (x) {
            var c = this.coefficients;
            return "((".concat(x[0], ")*(").concat(c[0], ")+(").concat(x[1], ")*(").concat(c[1], "))");
        };
        LinearFunction.prototype.levelSet = function (def) {
            var c = this.coefficients, level = def.level || this.value(def.point);
            return [
                {
                    "fn": "(".concat(level, " - (").concat(c[0], ")*(x))/(").concat(c[1], ")"),
                    "ind": "x",
                    "samplePoints": 2
                }
            ];
        };
        LinearFunction.prototype.optimalBundle = function (budgetLine) {
            var c = this.coefficients;
            var buyOnlyGood2 = "((".concat(c[0], ")*(").concat(budgetLine.p2, ") < (").concat(c[1], ")*(").concat(budgetLine.p1, "))");
            return ["".concat(buyOnlyGood2, " ? 0 : ").concat(budgetLine.xIntercept), "".concat(buyOnlyGood2, " ? ").concat(budgetLine.yIntercept, " : 0")];
        };
        return LinearFunction;
    }(KGAuthor.EconMultivariateFunction));
    KGAuthor.LinearFunction = LinearFunction;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var CESFunction = /** @class */ (function (_super) {
        __extends(CESFunction, _super);
        function CESFunction(def) {
            var _this = _super.call(this, def) || this;
            var fn = _this;
            fn.interpolation = 'curveMonotoneX';
            if (def.hasOwnProperty('r')) {
                fn.r = def.r;
                fn.s = KGAuthor.divideDefs(1, KGAuthor.subtractDefs(1, def.r));
            }
            else if (def.hasOwnProperty('s')) {
                fn.s = def.s;
                fn.r = KGAuthor.subtractDefs(1, KGAuthor.divideDefs(1, def.s));
            }
            return _this;
        }
        CESFunction.prototype.value = function (x) {
            var c = this.coefficients, r = this.r;
            return KGAuthor.raiseDefToDef(KGAuthor.addDefs(KGAuthor.multiplyDefs(c[0], KGAuthor.raiseDefToDef(x[0], r)), KGAuthor.multiplyDefs(c[1], KGAuthor.raiseDefToDef(x[1], r))), KGAuthor.divideDefs(1, r));
        };
        CESFunction.prototype.levelSet = function (def) {
            var u = this, a = KGAuthor.getDefinitionProperty(u.alpha), r = KGAuthor.getDefinitionProperty(u.r), b = KGAuthor.subtractDefs(1, u.alpha), level = this.extractLevel(def);
            this.fillBelowRect = {
                x1: 0,
                x2: level,
                y1: 0,
                y2: level,
                show: def.show
            };
            return [
                {
                    fn: "((".concat(level, "^").concat(r, " - ").concat(a, "*(x)^").concat(r, ")/").concat(b, ")^(1/").concat(r, ")"),
                    ind: "x",
                    min: level
                },
                {
                    fn: "((".concat(level, "^").concat(r, " - ").concat(b, "*(y)^").concat(r, ")/").concat(a, ")^(1/").concat(r, ")"),
                    ind: "y",
                    min: level
                }
            ];
        };
        // see http://www.gamsworld.org/mpsge/debreu/ces.pdf
        CESFunction.prototype.optimalBundle = function (budgetLine) {
            var s = this.s, oneMinusS = KGAuthor.subtractDefs(1, s), a = this.alpha, oneMinusA = KGAuthor.subtractDefs(1, a), theta = KGAuthor.divideDefs(budgetLine.m, KGAuthor.addDefs(KGAuthor.multiplyDefs(KGAuthor.raiseDefToDef(a, s), KGAuthor.raiseDefToDef(budgetLine.p1, oneMinusS)), KGAuthor.multiplyDefs(KGAuthor.raiseDefToDef(oneMinusA, s), KGAuthor.raiseDefToDef(budgetLine.p2, oneMinusS)))), optimalX1 = KGAuthor.multiplyDefs(KGAuthor.raiseDefToDef(KGAuthor.divideDefs(a, budgetLine.p1), s), theta), optimalX2 = KGAuthor.multiplyDefs(KGAuthor.raiseDefToDef(KGAuthor.divideDefs(oneMinusA, budgetLine.p2), s), theta);
            return [optimalX1, optimalX2];
        };
        CESFunction.prototype.denominator = function (p1, p2) {
            var a1 = this.alpha, a2 = KGAuthor.subtractDefs(1, a1), r = this.r, pOverA1 = KGAuthor.divideDefs(p1, a1), pOverA2 = KGAuthor.divideDefs(p2, a2), oneOverR = KGAuthor.divideDefs(1, r), rOverRminusOne = KGAuthor.divideDefs(r, KGAuthor.subtractDefs(r, 1));
            return KGAuthor.raiseDefToDef(KGAuthor.addDefs(KGAuthor.multiplyDefs(a1, KGAuthor.raiseDefToDef(pOverA1, rOverRminusOne)), KGAuthor.multiplyDefs(a2, KGAuthor.raiseDefToDef(pOverA2, rOverRminusOne))), oneOverR);
        };
        // see http://personal.stthomas.edu/csmarcott/ec418/ces_cost_minimization.pdf
        CESFunction.prototype.lowestCostBundle = function (level, prices) {
            var a1 = this.alpha, a2 = KGAuthor.subtractDefs(1, a1), p1 = prices[0], p2 = prices[1], r = this.r, pOverA1 = KGAuthor.divideDefs(p1, a1), pOverA2 = KGAuthor.divideDefs(p2, a2), oneOverRminusOne = KGAuthor.divideDefs(1, KGAuthor.subtractDefs(r, 1)), denominator = this.denominator(p1, p2), numerator1 = KGAuthor.raiseDefToDef(pOverA1, oneOverRminusOne), numerator2 = KGAuthor.raiseDefToDef(pOverA2, oneOverRminusOne);
            return [
                KGAuthor.divideDefs(KGAuthor.multiplyDefs(level, numerator1), denominator),
                KGAuthor.divideDefs(KGAuthor.multiplyDefs(level, numerator2), denominator)
            ];
        };
        return CESFunction;
    }(KGAuthor.EconMultivariateFunction));
    KGAuthor.CESFunction = CESFunction;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var ConcaveFunction = /** @class */ (function (_super) {
        __extends(ConcaveFunction, _super);
        function ConcaveFunction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ConcaveFunction.prototype.value = function (x) {
            var c = this.coefficients;
            return "(".concat(c[0], ")*(").concat(x[0], ")^2+(").concat(c[1], ")*(").concat(x[1], ")^2");
        };
        ConcaveFunction.prototype.levelSet = function (def) {
            var c = this.coefficients, level = def.level || this.value(def.point), max = "((".concat(level, ")/(").concat(c[0], "+").concat(c[1], "))^(0.5)");
            this.fillAboveRect = {
                x1: max,
                x2: 50,
                y1: max,
                y2: 50,
                show: def.show
            };
            return [
                {
                    "fn": "((".concat(level, "-(").concat(c[1], ")*(y)*(y))/(").concat(c[0], "))^(0.5)"),
                    "ind": "y",
                    "min": 0,
                    "max": max,
                    "samplePoints": 30
                },
                {
                    "fn": "((".concat(level, "-(").concat(c[0], ")*(x)*(x))/(").concat(c[1], "))^(0.5)"),
                    "ind": "x",
                    "min": 0,
                    "max": max,
                    "samplePoints": 30
                }
            ];
        };
        return ConcaveFunction;
    }(KGAuthor.EconMultivariateFunction));
    KGAuthor.ConcaveFunction = ConcaveFunction;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var QuasilinearFunction = /** @class */ (function (_super) {
        __extends(QuasilinearFunction, _super);
        function QuasilinearFunction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        QuasilinearFunction.prototype.value = function (x) {
            var c = this.coefficients;
            return "(".concat(c[0], "*log(").concat(x[0], ")+").concat(x[1], ")");
        };
        QuasilinearFunction.prototype.levelSet = function (def) {
            var c = this.coefficients, level = this.extractLevel(def);
            return [
                {
                    "fn": "((".concat(level, ")-(").concat(c[0], ")*log((x)))"),
                    "ind": "x",
                    "samplePoints": 100
                }
            ];
        };
        QuasilinearFunction.prototype.cornerCondition = function (budgetLine) {
            return "(".concat(this.lagrangeBundle(budgetLine)[1], " < 0)");
        };
        QuasilinearFunction.prototype.lagrangeBundle = function (budgetLine) {
            var c = this.coefficients;
            return [KGAuthor.divideDefs(KGAuthor.multiplyDefs(c[0], budgetLine.p2), budgetLine.p1), KGAuthor.subtractDefs(budgetLine.yIntercept, c[0])];
        };
        QuasilinearFunction.prototype.optimalBundle = function (budgetLine) {
            var lagr = this.lagrangeBundle(budgetLine), cornerCondition = this.cornerCondition(budgetLine);
            return ["(".concat(cornerCondition, " ? ").concat(budgetLine.xIntercept, " : ").concat(lagr[0], ")"), "(".concat(cornerCondition, " ? 0 : ").concat(lagr[1], ")")];
        };
        return QuasilinearFunction;
    }(KGAuthor.EconMultivariateFunction));
    KGAuthor.QuasilinearFunction = QuasilinearFunction;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    function extractBudgetLine(def, graph) {
        if (def.hasOwnProperty('budgetLineObject')) {
            return def.budgetLineObject;
        }
        if (def.hasOwnProperty('budgetLine')) {
            var budgetDef = JSON.parse(JSON.stringify(def.budgetLine));
            budgetDef.show = budgetDef.show || def.show;
            if (!budgetDef.hasOwnProperty('m')) {
                if (def.hasOwnProperty('point') && def.point.length == 2) {
                    budgetDef.point = def.point;
                }
                if (def.hasOwnProperty('coordinates') && def.coordinates.length == 2) {
                    budgetDef.point = def.coordinates;
                }
                if (def.hasOwnProperty('x') && def.hasOwnProperty('y')) {
                    budgetDef.x = def.x;
                    budgetDef.y = def.y;
                }
            }
            budgetDef.color = budgetDef.color || def.color;
            return new EconBudgetLine(budgetDef, graph);
        }
        //console.log('tried to instantiate a budget line without either a budget line def or object')
    }
    KGAuthor.extractBudgetLine = extractBudgetLine;
    var EconBudgetLine = /** @class */ (function (_super) {
        __extends(EconBudgetLine, _super);
        function EconBudgetLine(def, graph) {
            var _this = this;
            def = KGAuthor.setStrokeColor(def);
            def.name = def.name || 'BL' + KG.randomString(5);
            // may define income either by income m or value of endowment point
            if (!def.hasOwnProperty('m')) {
                if (def.hasOwnProperty('x') && def.hasOwnProperty('y')) {
                    def.point = [def.x, def.y];
                }
                if (def.hasOwnProperty('point') && def.point.length == 2) {
                    def.m = KGAuthor.addDefs(KGAuthor.multiplyDefs(def.p1, def.point[0]), KGAuthor.multiplyDefs(def.p2, def.point[1]));
                }
            }
            var xIntercept = KGAuthor.divideDefs(def.m, def.p1), yIntercept = KGAuthor.divideDefs(def.m, def.p2), priceRatio = KGAuthor.divideDefs(def.p1, def.p2), endowment = { x: def.x, y: def.y };
            console.log('xIntercept', xIntercept);
            if (def.inMap) {
                def.strokeWidth = 1;
                def.lineStyle = 'dotted';
                def.layer = 0;
                def.handles = false;
                def.draggable = false;
            }
            KG.setDefaults(def, {
                a: ["calcs.".concat(def.name, ".xIntercept"), 0],
                b: [0, "calcs.".concat(def.name, ".yIntercept")],
                color: 'colors.budget',
                strokeWidth: 2,
                lineStyle: 'solid',
                buyOnly: false,
                sellOnly: false
            });
            if (def.sellOnly) {
                def.a = [def.x, def.y];
            }
            if (def.buyOnly) {
                def.b = [def.x, def.y];
            }
            if (def.draggable && typeof (def.m) == 'string') {
                def.drag = [{
                        'directions': 'xy',
                        'param': KGAuthor.paramName(def.m),
                        'expression': KGAuthor.addDefs(KGAuthor.multiplyDefs('drag.x', def.p1), KGAuthor.multiplyDefs('drag.y', def.p2))
                    }];
            }
            if (!def.inMap) {
                def.label = KG.setDefaults(def.label || {}, {
                    text: "BL",
                    location: def.sellOnly ? 0.1 : 0.9
                });
            }
            _this = _super.call(this, def, graph) || this;
            var bl = _this;
            bl.p1 = def.p1;
            bl.p2 = def.p2;
            bl.m = def.m;
            bl.xIntercept = xIntercept;
            bl.yIntercept = yIntercept;
            bl.priceRatio = priceRatio;
            bl.point = def.point;
            bl.endowment = endowment;
            if (graph) {
                var subObjects = bl.subObjects;
                var xInterceptPointDef = {
                    coordinates: ["calcs.".concat(bl.name, ".xIntercept"), 0],
                    color: def.stroke,
                    r: 4
                };
                if (def.draggable && typeof (def.p1) == 'string') {
                    xInterceptPointDef['drag'] = [{
                            directions: 'x',
                            param: KGAuthor.paramName(def.p1),
                            expression: KGAuthor.divideDefs("calcs.".concat(bl.name, ".m"), 'drag.x')
                        }];
                }
                if (def.hasOwnProperty('xInterceptLabel')) {
                    xInterceptPointDef['droplines'] = {
                        vertical: def.xInterceptLabel
                    };
                }
                bl.xInterceptPoint = new KGAuthor.Point(xInterceptPointDef, graph);
                var yInterceptPointDef = {
                    coordinates: [0, "calcs.".concat(bl.name, ".yIntercept")],
                    color: def.stroke,
                    r: 4
                };
                if (def.draggable && typeof (def.p2) == 'string') {
                    yInterceptPointDef['drag'] = [{
                            directions: 'y',
                            param: KGAuthor.paramName(def.p2),
                            expression: KGAuthor.divideDefs('calcs.' + bl.name + '.m', 'drag.y')
                        }];
                }
                if (def.hasOwnProperty('yInterceptLabel')) {
                    yInterceptPointDef['droplines'] = {
                        horizontal: def.yInterceptLabel
                    };
                }
                bl.yInterceptPoint = new KGAuthor.Point(yInterceptPointDef, graph);
                bl.budgetSetArea = new KGAuthor.Area({
                    fill: "colors.budget",
                    univariateFunction1: {
                        fn: "calcs.".concat(bl.name, ".yIntercept - calcs.").concat(bl.name, ".priceRatio*(x)"),
                        samplePoints: 2,
                        max: "calcs.".concat(bl.name, ".xIntercept")
                    },
                    show: def.set
                }, graph);
                bl.costlierArea = new KGAuthor.Area({
                    fill: "colors.costlier",
                    univariateFunction1: {
                        fn: "calcs.".concat(bl.name, ".yIntercept - calcs.").concat(bl.name, ".priceRatio*(x)"),
                        samplePoints: 2
                    },
                    show: def.costlier,
                    above: true
                }, graph);
                if (def.handles) {
                    subObjects.push(bl.xInterceptPoint);
                    subObjects.push(bl.yInterceptPoint);
                }
                if (def.set) {
                    subObjects.push(bl.budgetSetArea);
                }
                if (def.costlier) {
                    subObjects.push(bl.costlierArea);
                }
            }
            return _this;
        }
        EconBudgetLine.prototype.cost = function (bundle) {
            var c = "((".concat(this.p1, ")*(").concat(bundle.x, ") + (").concat(this.p2, ")*(").concat(bundle.y, "))");
            //console.log(c);
            return c;
        };
        EconBudgetLine.prototype.parseSelf = function (parsedData) {
            var bl = this;
            parsedData = _super.prototype.parseSelf.call(this, parsedData);
            parsedData.calcs[bl.name] = {
                xIntercept: bl.xIntercept.toString(),
                yIntercept: bl.yIntercept.toString(),
                m: bl.m.toString(),
                p1: bl.p1.toString(),
                p2: bl.p2.toString(),
                priceRatio: bl.priceRatio.toString(),
                endowment: bl.endowment.toString()
            };
            return parsedData;
        };
        return EconBudgetLine;
    }(KGAuthor.Segment));
    KGAuthor.EconBudgetLine = EconBudgetLine;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    function getUtilityFunction(def) {
        if (def != undefined) {
            def = KGAuthor.extractTypeAndDef(def);
            if (def.type == 'CobbDouglas') {
                return new KGAuthor.CobbDouglasFunction(def.def);
            }
            else if (def.type == 'Substitutes' || def.type == 'PerfectSubstitutes') {
                return new KGAuthor.LinearFunction(def.def);
            }
            else if (def.type == 'Complements' || def.type == 'PerfectComplements') {
                return new KGAuthor.MinFunction(def.def);
            }
            else if (def.type == 'Concave') {
                return new KGAuthor.ConcaveFunction(def.def);
            }
            else if (def.type == 'Quasilinear') {
                return new KGAuthor.QuasilinearFunction(def.def);
            }
            else if (def.type == 'CESFunction' || def.type == 'CES') {
                return new KGAuthor.CESFunction(def.def);
            }
        }
    }
    KGAuthor.getUtilityFunction = getUtilityFunction;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    function extractIndifferenceCurve(def, graph) {
        if (def.hasOwnProperty('indifferenceCurveObject')) {
            return def.indifferenceCurveObject;
        }
        if (def.hasOwnProperty('indifferenceCurve')) {
            var indifferenceCurveDef = KGAuthor.copyJSON(def.indifferenceCurve);
            indifferenceCurveDef.show = indifferenceCurveDef.show || def.show;
            indifferenceCurveDef.name = def.name + "_IC";
            return new EconIndifferenceCurve(indifferenceCurveDef, graph);
        }
        console.log('tried to instantiate a budget line without either a budget line def or object');
    }
    KGAuthor.extractIndifferenceCurve = extractIndifferenceCurve;
    var EconIndifferenceCurve = /** @class */ (function (_super) {
        __extends(EconIndifferenceCurve, _super);
        function EconIndifferenceCurve(def, graph) {
            var _this = this;
            if (def.inMap) {
                def.strokeWidth = 1;
                def.color = 'lightgrey';
                def.layer = 0;
            }
            KG.setDefaults(def, {
                strokeWidth: 2,
                color: 'colors.utility',
                layer: 1,
                showPreferred: false,
                showDispreferred: false,
                inMap: false,
                showMapLevels: false
            });
            if (def.inMap) {
                if (def.showMapLevels) {
                    def.label = KG.setDefaults(def.label || {}, {
                        fontSize: 8,
                        x: KGAuthor.multiplyDefs(0.98, graph.xScale.max),
                        text: "".concat(def.level, ".toFixed(0)"),
                        color: def.color,
                        bgcolor: null
                    });
                }
            }
            else {
                def.label = KG.setDefaults(def.label || {}, {
                    x: KGAuthor.multiplyDefs(0.95, graph.xScale.max),
                    text: "U",
                    color: def.color,
                    bgcolor: null,
                    position: 'bl'
                });
            }
            _this = _super.call(this, def, graph) || this;
            var curve = _this;
            var utilityFunction = KGAuthor.extractUtilityFunction(def);
            curve.utilityFunction = utilityFunction;
            curve.subObjects = curve.subObjects.concat(utilityFunction.levelCurve(def, graph));
            if (!def.inMap) {
                if (!!def.showPreferred) {
                    var preferredDef = KGAuthor.copyJSON(def);
                    //preferredDef.fill = def.preferredColor || 'colors.preferred';
                    preferredDef.fill = def.color || 'colors.preferred';
                    preferredDef.show = def.showPreferred;
                    curve.subObjects = curve.subObjects.concat(utilityFunction.areaAboveLevelCurve(preferredDef, graph));
                }
                if (!!def.showDispreferred) {
                    var dispreferredDef = KGAuthor.copyJSON(def);
                    dispreferredDef.fill = 'colors.dispreferred';
                    dispreferredDef.show = def.showDispreferred;
                    curve.subObjects = curve.subObjects.concat(utilityFunction.areaBelowLevelCurve(dispreferredDef, graph));
                }
            }
            return _this;
        }
        return EconIndifferenceCurve;
    }(KGAuthor.GraphObjectGenerator));
    KGAuthor.EconIndifferenceCurve = EconIndifferenceCurve;
    var EconIndifferenceMap = /** @class */ (function (_super) {
        __extends(EconIndifferenceMap, _super);
        function EconIndifferenceMap(def, graph) {
            var _this = _super.call(this, def, graph) || this;
            _this.subObjects = def.levels.map(function (level) {
                var icDef = KGAuthor.copyJSON(def);
                icDef.inMap = true;
                delete icDef.levels;
                if (Array.isArray(level)) {
                    icDef.point = level;
                }
                else {
                    icDef.level = level;
                }
                return new EconIndifferenceCurve(icDef, graph);
            });
            return _this;
        }
        return EconIndifferenceMap;
    }(KGAuthor.GraphObjectGenerator));
    KGAuthor.EconIndifferenceMap = EconIndifferenceMap;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    function extractUtilityFunction(def) {
        return def.utilityFunctionObject || KGAuthor.getUtilityFunction(def.utilityFunction);
    }
    KGAuthor.extractUtilityFunction = extractUtilityFunction;
    var EconBundle = /** @class */ (function (_super) {
        __extends(EconBundle, _super);
        function EconBundle(def, graph) {
            var _this = this;
            KG.setDefaults(def, {
                label: { text: 'X' },
                droplines: {
                    vertical: "x_1",
                    horizontal: "x_2"
                },
                color: "colors.utility"
            });
            KGAuthor.setFillColor(def);
            _this = _super.call(this, def, graph) || this;
            var bundle = _this;
            bundle.budgetLine = KGAuthor.extractBudgetLine(def, graph);
            if (bundle.budgetLine) {
                bundle.subObjects.push(bundle.budgetLine);
            }
            bundle.utilityFunction = extractUtilityFunction(def);
            if (bundle.utilityFunction) {
                bundle.subObjects.push(bundle.utilityFunction);
                if (def.hasOwnProperty('indifferenceCurve')) {
                    def.indifferenceCurve.level = "calcs.".concat(bundle.name, ".level");
                    def.indifferenceCurve.utilityFunction = def.utilityFunction;
                    bundle.subObjects.push(KGAuthor.extractIndifferenceCurve(def, graph));
                }
            }
            return _this;
        }
        EconBundle.prototype.parseSelf = function (parsedData) {
            var bundle = this;
            parsedData = _super.prototype.parseSelf.call(this, parsedData);
            parsedData.calcs[bundle.name] = {
                x: bundle.x,
                y: bundle.y,
                level: bundle.utilityFunction ? bundle.utilityFunction.value([bundle.x, bundle.y]) : '',
                cost: bundle.budgetLine ? bundle.budgetLine.cost(bundle) : '',
                mrs: bundle.utilityFunction ? KGAuthor.negativeDef(bundle.utilityFunction.levelCurveSlope([bundle.x, bundle.y])) : ''
            };
            return parsedData;
        };
        return EconBundle;
    }(KGAuthor.Point));
    KGAuthor.EconBundle = EconBundle;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var EconOptimalBundle = /** @class */ (function (_super) {
        __extends(EconOptimalBundle, _super);
        function EconOptimalBundle(def, graph) {
            var _this = this;
            var bl = KGAuthor.extractBudgetLine(def, graph), u = KGAuthor.extractUtilityFunction(def), coords = u.optimalBundle(bl);
            KG.setDefaults(def, {
                coordinates: coords,
                label: { text: 'X^*' },
                color: 'demand',
                droplines: {
                    vertical: "x_1^*",
                    horizontal: "x_2^*"
                },
                indifferenceCurve: {}
            });
            console.log('coords: ', coords);
            if (bl.hasOwnProperty('endowment')) {
                if (bl.def.sellOnly) {
                    def.show = "(".concat(def.show || true, " && (").concat(coords[0], " < ").concat(bl.endowment.x, "))");
                }
                if (bl.def.buyOnly) {
                    def.show = "(".concat(def.show || true, " && (").concat(coords[0], " > ").concat(bl.endowment.x, "))");
                }
            }
            def.budgetLineObject = bl;
            _this = _super.call(this, def, graph) || this;
            _this.level = u.value(coords);
            return _this;
        }
        return EconOptimalBundle;
    }(KGAuthor.EconBundle));
    KGAuthor.EconOptimalBundle = EconOptimalBundle;
    var EconLagrangeBundle = /** @class */ (function (_super) {
        __extends(EconLagrangeBundle, _super);
        function EconLagrangeBundle(def, graph) {
            if (def.hasOwnProperty('utilityFunction') && def.hasOwnProperty('budgetLine')) {
                var u = KGAuthor.getUtilityFunction(def.utilityFunction), bl = new KGAuthor.EconBudgetLine(def.budgetLine, graph);
                KG.setDefaults(def, {
                    coordinates: u.lagrangeBundle(bl),
                    color: 'colors.incomeOffer',
                    show: u.cornerCondition(bl),
                    label: { text: 'X^*_L' }
                });
            }
            else {
                console.log('oops, need to define an EconOptimalBundle with a utility function and budget line.');
            }
            return _super.call(this, def, graph) || this;
        }
        return EconLagrangeBundle;
    }(EconOptimalBundle));
    KGAuthor.EconLagrangeBundle = EconLagrangeBundle;
    var LowestCostBundle = /** @class */ (function (_super) {
        __extends(LowestCostBundle, _super);
        function LowestCostBundle(def, graph) {
            var u = KGAuthor.extractUtilityFunction(def), p1 = def.prices[0], p2 = def.prices[1], m = u.expenditure(def.level, def.prices);
            delete def.prices;
            delete def.level;
            def.budgetLine = KG.setDefaults(def.budgetLine || {}, {
                p1: p1,
                p2: p2,
                m: m
            });
            return _super.call(this, def, graph) || this;
        }
        return LowestCostBundle;
    }(EconOptimalBundle));
    KGAuthor.LowestCostBundle = LowestCostBundle;
    var EconSlutskyBundle = /** @class */ (function (_super) {
        __extends(EconSlutskyBundle, _super);
        function EconSlutskyBundle(def, graph) {
            var bl = KGAuthor.extractBudgetLine(def, graph), u = KGAuthor.extractUtilityFunction(def);
            def.budgetLine = def.budgetLine || {};
            if (def.hasOwnProperty('p1')) {
                def.budgetLine.p1 = def.p1;
                delete def.budgetLine.m;
            }
            if (def.hasOwnProperty('p2')) {
                def.budgetLine.p2 = def.p2;
                delete def.budgetLine.m;
            }
            def.budgetLine.label = KG.setDefaults(def.budgetLine.label || {}, {
                text: "BL_D"
            });
            def.budgetLine.point = u.optimalBundle(bl);
            delete def.budgetLineObject;
            return _super.call(this, def, graph) || this;
        }
        return EconSlutskyBundle;
    }(EconOptimalBundle));
    KGAuthor.EconSlutskyBundle = EconSlutskyBundle;
    var EconHicksBundle = /** @class */ (function (_super) {
        __extends(EconHicksBundle, _super);
        function EconHicksBundle(def, graph) {
            var bl = KGAuthor.extractBudgetLine(def, graph), u = KGAuthor.extractUtilityFunction(def), p1 = def.hasOwnProperty('p1') ? def.p1 : def.budgetLine.p1, p2 = def.hasOwnProperty('p2') ? def.p2 : def.budgetLine.p2, level = u.value(u.optimalBundle(bl));
            def.budgetLine.p1 = p1;
            def.budgetLine.p2 = p2;
            def.budgetLine.m = u.expenditure(level, [p1, p2]);
            def.budgetLine.label = KG.setDefaults(def.budgetLine.label || {}, {
                text: "BL_C"
            });
            def.coordinates = u.lowestCostBundle(level, [p1, p2]);
            delete def.budgetLineObject;
            return _super.call(this, def, graph) || this;
        }
        return EconHicksBundle;
    }(EconOptimalBundle));
    KGAuthor.EconHicksBundle = EconHicksBundle;
    var EconShortRunProductionBundle = /** @class */ (function (_super) {
        __extends(EconShortRunProductionBundle, _super);
        function EconShortRunProductionBundle(def, graph) {
            var u = KGAuthor.extractUtilityFunction(def), p1 = def.prices[0], p2 = def.prices[1];
            def.coordinates = [u.laborRequirement(def.level, def.capital), def.capital];
            def.budgetLine = KG.setDefaults(def.budgetLine || {}, {
                p1: p1,
                p2: p2
            });
            def.budgetLine.label = KG.setDefaults(def.budgetLine.label || {}, {
                text: "c_s(y)"
            });
            delete def.budgetLineObject;
            return _super.call(this, def, graph) || this;
        }
        return EconShortRunProductionBundle;
    }(KGAuthor.EconBundle));
    KGAuthor.EconShortRunProductionBundle = EconShortRunProductionBundle;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var EconDemandCurve = /** @class */ (function (_super) {
        __extends(EconDemandCurve, _super);
        function EconDemandCurve(def, graph) {
            var _this = this;
            var u = KGAuthor.getUtilityFunction(def.utilityFunction), bl = new KGAuthor.EconBudgetLine(def.budgetLine, graph);
            KG.setDefaults(def, {
                stroke: 'colors.demand',
                strokeWidth: 2
            });
            _this = _super.call(this, def, graph) || this;
            _this.subObjects = u.demandCurve(bl, def.good, def, graph);
            return _this;
        }
        return EconDemandCurve;
    }(KGAuthor.GraphObjectGenerator));
    KGAuthor.EconDemandCurve = EconDemandCurve;
    var EconDemandPoint = /** @class */ (function (_super) {
        __extends(EconDemandPoint, _super);
        function EconDemandPoint(def, graph) {
            if (def.hasOwnProperty('utilityFunction') && def.hasOwnProperty('budgetLine')) {
                var u = KGAuthor.getUtilityFunction(def.utilityFunction), bl = new KGAuthor.EconBudgetLine(def.budgetLine, graph);
                KG.setDefaults(def, {
                    coordinates: [u.quantityDemanded(bl, def.good), bl['p' + def.good]],
                    fill: 'colors.demand',
                    label: { text: "x_".concat(def.good, "(p_").concat(def.good, "|p_").concat(3 - def.good, ",m)") },
                    droplines: { vertical: "x_".concat(def.good, "^*") }
                });
            }
            else {
                console.log('oops, need to define an EconOptimalBundle with a utility function and budget line.');
            }
            return _super.call(this, def, graph) || this;
        }
        return EconDemandPoint;
    }(KGAuthor.Point));
    KGAuthor.EconDemandPoint = EconDemandPoint;
    var EconNetDemandCurve = /** @class */ (function (_super) {
        __extends(EconNetDemandCurve, _super);
        function EconNetDemandCurve(def, graph) {
            var _this = this;
            var u = KGAuthor.getUtilityFunction(def.utilityFunction), bl = new KGAuthor.EconBudgetLine(def.budgetLine, graph);
            KG.setDefaults(def, {
                color: 'colors.demand',
                strokeWidth: 2
            });
            _this = _super.call(this, def, graph) || this;
            _this.subObjects = u.netDemandCurve(bl, def.good, def, graph);
            return _this;
        }
        return EconNetDemandCurve;
    }(KGAuthor.GraphObjectGenerator));
    KGAuthor.EconNetDemandCurve = EconNetDemandCurve;
    var EconNetDemandPoint = /** @class */ (function (_super) {
        __extends(EconNetDemandPoint, _super);
        function EconNetDemandPoint(def, graph) {
            if (def.hasOwnProperty('utilityFunction') && def.hasOwnProperty('budgetLine')) {
                var u = KGAuthor.getUtilityFunction(def.utilityFunction), bl = new KGAuthor.EconBudgetLine(def.budgetLine, graph);
                KG.setDefaults(def, {
                    coordinates: [KGAuthor.subtractDefs(u.quantityDemanded(bl, def.good), bl.point[def.good - 1]), bl['p' + def.good]],
                    fill: 'colors.demand',
                    label: { text: "d_".concat(def.good, "(p_").concat(def.good, "|p_").concat(3 - def.good, ")") },
                    droplines: { vertical: "d_".concat(def.good, "^*") }
                });
            }
            else {
                console.log('oops, need to define an EconOptimalBundle with a utility function and budget line.');
            }
            return _super.call(this, def, graph) || this;
        }
        return EconNetDemandPoint;
    }(KGAuthor.Point));
    KGAuthor.EconNetDemandPoint = EconNetDemandPoint;
    var EconNetSupplyCurve = /** @class */ (function (_super) {
        __extends(EconNetSupplyCurve, _super);
        function EconNetSupplyCurve(def, graph) {
            var _this = this;
            var u = KGAuthor.getUtilityFunction(def.utilityFunction), bl = new KGAuthor.EconBudgetLine(def.budgetLine, graph);
            KG.setDefaults(def, {
                color: 'colors.supply',
                strokeWidth: 2
            });
            _this = _super.call(this, def, graph) || this;
            _this.subObjects = u.netSupplyCurve(bl, def.good, def, graph);
            return _this;
        }
        return EconNetSupplyCurve;
    }(KGAuthor.GraphObjectGenerator));
    KGAuthor.EconNetSupplyCurve = EconNetSupplyCurve;
    var EconNetSupplyPoint = /** @class */ (function (_super) {
        __extends(EconNetSupplyPoint, _super);
        function EconNetSupplyPoint(def, graph) {
            if (def.hasOwnProperty('utilityFunction') && def.hasOwnProperty('budgetLine')) {
                var u = KGAuthor.getUtilityFunction(def.utilityFunction), bl = new KGAuthor.EconBudgetLine(def.budgetLine, graph);
                KG.setDefaults(def, {
                    coordinates: [KGAuthor.subtractDefs(bl.point[def.good - 1], u.quantityDemanded(bl, def.good)), bl['p' + def.good]],
                    fill: 'colors.supply',
                    label: { text: "s_".concat(def.good, "(p_").concat(def.good, "|p_").concat(3 - def.good, ")") },
                    droplines: { vertical: "s_".concat(def.good, "^*") }
                });
            }
            else {
                console.log('oops, need to define an EconOptimalBundle with a utility function and budget line.');
            }
            return _super.call(this, def, graph) || this;
        }
        return EconNetSupplyPoint;
    }(KGAuthor.Point));
    KGAuthor.EconNetSupplyPoint = EconNetSupplyPoint;
    var EconPriceOfferCurve = /** @class */ (function (_super) {
        __extends(EconPriceOfferCurve, _super);
        function EconPriceOfferCurve(def, graph) {
            var _this = this;
            var u = KGAuthor.getUtilityFunction(def.utilityFunction), bl = new KGAuthor.EconBudgetLine(def.budgetLine, graph);
            KG.setDefaults(def, {
                stroke: 'colors.offer',
                strokeWidth: 2
            });
            _this = _super.call(this, def, graph) || this;
            _this.subObjects = u.priceOfferCurve(bl, def.good, def.min, def.max, def, graph);
            return _this;
        }
        return EconPriceOfferCurve;
    }(KGAuthor.GraphObjectGenerator));
    KGAuthor.EconPriceOfferCurve = EconPriceOfferCurve;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var EconOneInputProductionFunction = /** @class */ (function (_super) {
        __extends(EconOneInputProductionFunction, _super);
        function EconOneInputProductionFunction(def, graph) {
            var _this = this;
            KG.setDefaults(def, {
                coefficient: 1,
                exponent: 0.5,
                wage: 1,
                price: 1
            });
            _this = _super.call(this, def) || this;
            var f = _this;
            f.coefficient = def.coefficient;
            f.exponent = def.exponent;
            f.wage = def.wage;
            f.price = def.price;
            // if y(L) = AL^b, L(y) = [A^(-1/b)] * y^[1/b]
            f.laborRequirementExponent = KGAuthor.invertDef(def.exponent);
            f.laborRequirementCoefficient = KGAuthor.raiseDefToDef(def.coefficient, KGAuthor.negativeDef(f.laborRequirementExponent));
            // if f(L) = AL^b, f'(L) = [bA] * L^[b-1]
            f.marginalProductExponent = KGAuthor.subtractDefs(def.exponent, 1);
            f.marginalProductCoefficient = KGAuthor.multiplyDefs(def.exponent, def.coefficient);
            // if c(y) = wL(y) = w*LRC * y^LRE, c'(y) = [w*LRC*LRE] * y^[LRE - 1]
            f.marginalCostCoefficient = KGAuthor.multiplyDefs(def.wage, KGAuthor.multiplyDefs(f.laborRequirementExponent, f.laborRequirementCoefficient));
            f.marginalCostExponent = KGAuthor.subtractDefs(f.laborRequirementExponent, 1);
            // if c'(y) = MCC * y^MCE, y*(p) = MCC^(-1/MCE) * p^(1/MCE)
            f.outputSupplyCoefficient = KGAuthor.raiseDefToDef(f.marginalCostCoefficient, KGAuthor.negativeDef(KGAuthor.invertDef(f.marginalCostExponent)));
            f.outputSupplyExponent = KGAuthor.invertDef(f.marginalCostExponent);
            // if MRPL = [p * MPC] * L^MPE, L*(w) = (p*MPC)^(-1/MPE) * w^(1/MPE)
            f.laborDemandCoefficient = KGAuthor.raiseDefToDef(KGAuthor.multiplyDefs(f.price, f.marginalProductCoefficient), KGAuthor.negativeDef(KGAuthor.invertDef(f.marginalProductExponent)));
            f.laborDemandExponent = KGAuthor.invertDef(f.marginalProductExponent);
            return _this;
        }
        // output produced by L units of olabor
        EconOneInputProductionFunction.prototype.f = function (L) {
            var f = this;
            return KGAuthor.multiplyDefs(f.coefficient, KGAuthor.raiseDefToDef(L, f.exponent));
        };
        // labor required to produce y units of output
        EconOneInputProductionFunction.prototype.laborRequirement = function (y) {
            var f = this;
            return KGAuthor.multiplyDefs(f.laborRequirementCoefficient, KGAuthor.raiseDefToDef(y, f.laborRequirementExponent));
        };
        // marginal product of labor
        EconOneInputProductionFunction.prototype.MPL = function (L) {
            var f = this;
            return KGAuthor.multiplyDefs(f.marginalProductCoefficient, KGAuthor.raiseDefToDef(L, f.marginalProductExponent));
        };
        // marginal revenue product of labor is price times MPL
        EconOneInputProductionFunction.prototype.MRPL = function (L) {
            var f = this;
            return KGAuthor.multiplyDefs(f.price, f.MPL(L));
        };
        // cost is wage times labor requirement
        EconOneInputProductionFunction.prototype.cost = function (y) {
            var f = this;
            return KGAuthor.multiplyDefs(f.wage, f.laborRequirement(y));
        };
        EconOneInputProductionFunction.prototype.marginalCost = function (y) {
            var f = this;
            return KGAuthor.multiplyDefs(f.marginalCostCoefficient, KGAuthor.raiseDefToDef(y, f.marginalCostExponent));
        };
        // labor demand
        EconOneInputProductionFunction.prototype.laborDemand = function (w) {
            var f = this;
            return KGAuthor.multiplyDefs(f.laborDemandCoefficient, KGAuthor.raiseDefToDef(w, f.laborDemandExponent));
        };
        // optimal output
        EconOneInputProductionFunction.prototype.optimalOutput = function (p) {
            var f = this;
            return KGAuthor.multiplyDefs(f.outputSupplyCoefficient, KGAuthor.raiseDefToDef(p, f.outputSupplyCoefficient));
        };
        EconOneInputProductionFunction.prototype.parseSelf = function (parsedData) {
            var ppf = this;
            parsedData = _super.prototype.parseSelf.call(this, parsedData);
            parsedData.calcs[ppf.name] = {
                coefficient: ppf.coefficient,
                exponent: ppf.exponent,
                curve: ppf.f('(x)')
            };
            return parsedData;
        };
        return EconOneInputProductionFunction;
    }(KGAuthor.AuthoringObject));
    KGAuthor.EconOneInputProductionFunction = EconOneInputProductionFunction;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var EconConstantElasticityCurve = /** @class */ (function (_super) {
        __extends(EconConstantElasticityCurve, _super);
        function EconConstantElasticityCurve(def, graph) {
            var _this = this;
            def = KGAuthor.setStrokeColor(def);
            KG.setDefaults(def, {
                name: 'constElasticityCurve' + KG.randomString(5),
                color: 'colors.demand',
                strokeWidth: 2,
                lineStyle: 'solid',
                show: true
            });
            // TODO shouldn't need to convert these to strings; it should work with numbers...
            if (def.hasOwnProperty('elasticity')) {
                def.elasticity = def.elasticity.toString();
            }
            if (def.hasOwnProperty('normalizedElasticity')) {
                def.normalizedElasticity = def.normalizedElasticity.toString();
            }
            // A constant elasticity curve is defined by one point and either an elasticity, a normalized elasticity, or a second point.
            var curveDef = KGAuthor.copyJSON(def);
            curveDef.fn = KGAuthor.multiplyDefs("calcs." + def.name + ".coefficient", KGAuthor.raiseDefToDef("(y)", "calcs." + curveDef.name + ".elasticity"));
            curveDef.ind = 'y';
            curveDef.samplePoints = 500;
            curveDef.show = "((" + def.show + ") && !(calcs. " + def.name + ".elastic))";
            var invCurveDef = KGAuthor.copyJSON(def);
            invCurveDef.name = def.name + "inverse";
            invCurveDef.fn = KGAuthor.multiplyDefs("calcs." + invCurveDef.name + ".coefficient", KGAuthor.raiseDefToDef("(x)", "calcs." + invCurveDef.name + ".elasticity"));
            invCurveDef.samplePoints = 500;
            invCurveDef.ind = 'x';
            invCurveDef.show = "((" + def.show + ") && (calcs. " + def.name + ".elastic))";
            // define the control point
            var pointDef = KGAuthor.copyJSON(def.point || {});
            pointDef.color = pointDef.color || def.color;
            pointDef.show = pointDef.show || def.show;
            // define the second control point, if applicable
            if (def.hasOwnProperty('point2')) {
                var point2Def = KGAuthor.copyJSON(def.point2);
                point2Def.color = point2Def.color || def.color;
                point2Def.show = point2Def.show || def.show;
            }
            _this = _super.call(this, curveDef, graph) || this;
            var c = _this;
            c.subObjects.push(new KGAuthor.Curve(invCurveDef, graph));
            var p = new KGAuthor.Point(pointDef, graph);
            c.subObjects.push(p);
            // If defined by a second point, calculate the elasticity implied by those two points
            if (def.hasOwnProperty('point2')) {
                var pointDef2 = def.point2;
                pointDef2.color = pointDef2.color || def.color;
                var p2 = new KGAuthor.Point(pointDef2, graph);
                // calculate elasticity between the two points
                // we have x0 = a*y0^b, x1 = a*y1^b
                // therefore a = x0y0^(-b) = x1y1^(-b)
                // therefore (x0/x1) = (y0/y1)^b => b = log(x0/x1)/log(y0/y1)
                var x0overx1 = KGAuthor.divideDefs(p.x, p2.x);
                var y0overy1 = KGAuthor.divideDefs(p.y, p2.y);
                c.elasticity = KGAuthor.divideDefs("log" + x0overx1 + "", "log" + y0overy1 + "");
                c.invElasticity = KGAuthor.divideDefs("log" + y0overy1 + "", "log" + x0overx1 + "");
                c.perfectlyElastic = "(" + p.y + " == " + p2.y + ")";
                c.perfectlyInelastic = "(" + p.x + " == " + p2.x + ")";
                c.subObjects.push(p2);
            }
            // If the elasticity is normalized, 0 is perfectly inelastic, and 1 or -1 is perfectly elastic.
            else if (def.hasOwnProperty('normalizedElasticity')) {
                var absNormalizedElasticity = "(abs(" + def.normalizedElasticity + "))";
                c.elasticity = KGAuthor.divideDefs(def.normalizedElasticity, "(1 - " + absNormalizedElasticity + ")");
                c.invElasticity = KGAuthor.divideDefs("(1 - " + absNormalizedElasticity + ")", def.normalizedElasticity);
                c.perfectlyElastic = "(" + absNormalizedElasticity + " == 1)";
                c.perfectlyInelastic = "(" + def.normalizedElasticity + " == 0)";
            }
            // If the elasticity is defined directly, it can't be infinite
            else {
                c.elasticity = def.elasticity;
                c.invElasticity = KGAuthor.invertDef(def.elasticity);
                c.perfectlyInelastic = "(" + def.elasticity + " == 0)";
                c.perfectlyElastic = "false";
            }
            // we have a function of the form x = ay^b => a = x0/y0^(b)
            c.coefficient = KGAuthor.divideDefs(p.x, KGAuthor.raiseDefToDef(p.y, c.elasticity));
            // the inverse of this function is of the form y = a'x^(b') => a' = y0/x0^(b')
            c.invCoefficient = KGAuthor.divideDefs(p.y, KGAuthor.raiseDefToDef(p.x, c.invElasticity));
            // Define regions of elasticity
            c.absElasticity = "(abs(" + c.elasticity + "))";
            c.elastic = "(" + c.absElasticity + " > 1)";
            c.unitElastic = "(" + c.absElasticity + " == 1)";
            c.inelastic = "(" + c.absElasticity + " < 1)";
            return _this;
        }
        EconConstantElasticityCurve.prototype.parseSelf = function (parsedData) {
            var c = this;
            parsedData = _super.prototype.parseSelf.call(this, parsedData);
            parsedData.calcs[c.name] = {
                elasticity: c.elasticity,
                coefficient: c.coefficient,
                elastic: c.elastic,
                unitElastic: c.unitElastic,
                inelastic: c.inelastic,
                perfectlyElastic: c.perfectlyElastic,
                perfectlyInelastic: c.perfectlyInelastic
            };
            parsedData.calcs[c.name + 'inverse'] = {
                elasticity: c.invElasticity,
                coefficient: c.invCoefficient
            };
            return parsedData;
        };
        return EconConstantElasticityCurve;
    }(KGAuthor.Curve));
    KGAuthor.EconConstantElasticityCurve = EconConstantElasticityCurve;
    var EconConstantElasticityIntersection = /** @class */ (function (_super) {
        __extends(EconConstantElasticityIntersection, _super);
        function EconConstantElasticityIntersection(def, graph) {
            var _this = _super.call(this, def, graph) || this;
            var intersection = _this;
            intersection.name = def.name;
            var c1 = "(calcs." + def.curve1 + ".coefficient)", e1 = "(calcs." + def.curve1 + ".elasticity)", c2 = "(calcs." + def.curve2 + ".coefficient)", e2 = "(calcs." + def.curve2 + ".elasticity)", invc1 = "(calcs." + def.curve1 + "inverse.coefficient)", inve1 = "(calcs." + def.curve1 + "inverse.elasticity)", invc2 = "(calcs." + def.curve2 + "inverse.coefficient)", inve2 = "(calcs." + def.curve2 + "inverse.elasticity)";
            // intersection occurs at the point where c1*x^(e1) = c2*x^(e2) => x = (c1/c2)^(1/(e2 - e1))
            var P = KGAuthor.raiseDefToDef(KGAuthor.divideDefs(c1, c2), KGAuthor.invertDef(KGAuthor.subtractDefs(e2, e1)));
            var QofP = KGAuthor.multiplyDefs(c1, KGAuthor.raiseDefToDef(P, e1));
            intersection.Pdirect = P;
            intersection.Qcalc = QofP;
            // can also use the inverse curves to calculate the Q, and the P from that.
            var Q = KGAuthor.raiseDefToDef(KGAuthor.divideDefs(invc1, invc2), KGAuthor.invertDef(KGAuthor.subtractDefs(inve2, inve1)));
            var PofQ = KGAuthor.multiplyDefs(invc1, KGAuthor.raiseDefToDef(Q, inve1));
            intersection.Qdirect = Q;
            intersection.Pcalc = PofQ;
            // want to use (P, QofP) when either supply or demand is perfectly inelastic; otherwise want to use (Q, PofQ)
            var eitherPerfectlyInelastic = "(" + KGAuthor.multiplyDefs(e1, e2) + " == 0)";
            intersection.Q = "(" + eitherPerfectlyInelastic + " ? " + QofP + " : " + Q + ")";
            intersection.P = "(" + eitherPerfectlyInelastic + " ? " + P + " : " + PofQ + ")";
            return _this;
        }
        EconConstantElasticityIntersection.prototype.parseSelf = function (parsedData) {
            var c = this;
            parsedData = _super.prototype.parseSelf.call(this, parsedData);
            parsedData.calcs[c.name] = {
                Pdirect: c.Pdirect,
                Pcalc: c.Pcalc,
                Qdirect: c.Qdirect,
                Qcalc: c.Qcalc,
                Q: c.Q,
                P: c.P
            };
            return parsedData;
        };
        return EconConstantElasticityIntersection;
    }(KGAuthor.GraphObjectGenerator));
    KGAuthor.EconConstantElasticityIntersection = EconConstantElasticityIntersection;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var EconConstantElasticityEquilibrium = /** @class */ (function (_super) {
        __extends(EconConstantElasticityEquilibrium, _super);
        function EconConstantElasticityEquilibrium(def, graph) {
            var _this = this;
            KG.setDefaults(def, {
                name: 'equilibrium',
                showCS: false,
                showPS: false
            });
            _this = _super.call(this, def, graph) || this;
            var cee = _this;
            def.equilibrium.color = def.equilibrium.color || "colors.green";
            var equilibrium = new KGAuthor.Point(def.equilibrium, graph);
            cee.Q = equilibrium.x;
            cee.P = equilibrium.y;
            def.demand.point = def.equilibrium;
            def.demand.name = def.name + "dem";
            def.demand.color = "colors.demand";
            var demand = new KGAuthor.EconConstantElasticityCurve(def.demand, graph);
            console.log("demand: ", demand);
            cee.subObjects.push(demand);
            def.supply.point = def.equilibrium;
            def.supply.name = def.name + "sup";
            def.supply.color = "colors.supply";
            var supply = new KGAuthor.EconConstantElasticityCurve(def.supply, graph);
            console.log('supply: ', supply);
            cee.subObjects.push(supply);
            return _this;
        }
        EconConstantElasticityEquilibrium.prototype.parseSelf = function (parsedData) {
            var cee = this;
            parsedData = _super.prototype.parseSelf.call(this, parsedData);
            parsedData.calcs[cee.name] = {
                Q: cee.Q.toString(),
                P: cee.P.toString()
            };
            return parsedData;
        };
        return EconConstantElasticityEquilibrium;
    }(KGAuthor.GraphObjectGenerator));
    KGAuthor.EconConstantElasticityEquilibrium = EconConstantElasticityEquilibrium;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var EconLinearDemand = /** @class */ (function (_super) {
        __extends(EconLinearDemand, _super);
        function EconLinearDemand(def, graph) {
            var _this = this;
            def = KGAuthor.setStrokeColor(def);
            KG.setDefaults(def, {
                name: "demand",
                point: [0, def.yIntercept],
                slope: 0,
                color: 'colors.demand',
                strokeWidth: 2,
                lineStyle: 'solid',
                pts: []
            });
            if (def.draggable && typeof (def.xIntercept) == 'string') {
                def.drag = [{
                        'directions': 'x',
                        'param': KGAuthor.paramName(def.xIntercept),
                        'expression': KGAuthor.addDefs(def.xIntercept, 'drag.dx')
                    }];
            }
            else if (def.draggable && typeof (def.yIntercept) == 'string') {
                def.drag = [{
                        'directions': 'y',
                        'param': KGAuthor.paramName(def.yIntercept),
                        'expression': KGAuthor.addDefs(def.yIntercept, 'drag.dy')
                    }];
            }
            //def.max = def.xIntercept;
            if (def.hasOwnProperty("price")) {
                def.pts.push({
                    name: "PQ",
                    y: def.price
                });
            }
            if (def.hasOwnProperty("surplus")) {
                if (!def.hasOwnProperty("price") && def.surplus.hasOwnProperty("quantity")) {
                    def.pts.push({
                        name: "PQ",
                        x: def.surplus.quantity
                    });
                }
            }
            _this = _super.call(this, def, graph) || this;
            var ld = _this;
            if (graph) {
                var subObjects = ld.subObjects;
                var xInterceptPointDef = {
                    coordinates: [ld.xIntercept, 0],
                    color: def.color,
                    r: 4
                };
                if (def.draggable && typeof (ld.xIntercept) == 'string') {
                    xInterceptPointDef['drag'] = [{
                            directions: 'x',
                            param: KGAuthor.paramName(ld.xIntercept),
                            expression: KGAuthor.addDefs(ld.xIntercept, 'drag.dx')
                        }];
                }
                if (def.hasOwnProperty('xInterceptLabel')) {
                    xInterceptPointDef['droplines'] = {
                        vertical: def.xInterceptLabel
                    };
                }
                ld.xInterceptPoint = new KGAuthor.Point(xInterceptPointDef, graph);
                var yInterceptPointDef = {
                    coordinates: [0, ld.yIntercept],
                    color: def.color,
                    r: 4
                };
                if (def.draggable && typeof (ld.yIntercept) == 'string') {
                    yInterceptPointDef['drag'] = [{
                            directions: 'y',
                            param: KGAuthor.paramName(ld.invSlope),
                            expression: KGAuthor.negativeDef(KGAuthor.divideDefs(ld.xIntercept, 'max(drag.y,0.01)'))
                        }];
                }
                if (def.hasOwnProperty('yInterceptLabel')) {
                    yInterceptPointDef['droplines'] = {
                        horizontal: def.yInterceptLabel
                    };
                }
                ld.yInterceptPoint = new KGAuthor.Point(yInterceptPointDef, graph);
                if (def.handles) {
                    subObjects.push(ld.xInterceptPoint);
                    subObjects.push(ld.yInterceptPoint);
                }
                if (def.hasOwnProperty('marginalRevenue')) {
                    var marginalRevenueDef = KG.setDefaults(def.marginalRevenue || {}, {
                        "color": "colors.marginalRevenue",
                        "yIntercept": ld.yIntercept,
                        "slope": KGAuthor.multiplyDefs(2, ld.slope),
                        "label": {
                            "text": "MR",
                            "x": KGAuthor.multiplyDefs(0.6, ld.xIntercept)
                        }
                    });
                    ld.marginalRevenue = new KGAuthor.Line(marginalRevenueDef, graph);
                    ld.subObjects.push(ld.marginalRevenue);
                }
                if (def.hasOwnProperty('surplus')) {
                    var surplusDef = KG.setDefaults(def.surplus || {}, {
                        "fill": "colors.demand"
                    });
                    var price = surplusDef.price || "calcs.".concat(ld.name, ".PQ.y"), quantity = surplusDef.quantity || "calcs.".concat(ld.name, ".PQ.x");
                    surplusDef.univariateFunction1 = {
                        fn: ld.def.univariateFunction.fn,
                        min: 0,
                        max: quantity,
                        samplePoints: 2
                    };
                    surplusDef.univariateFunction2 = {
                        fn: price,
                        min: 0,
                        max: quantity,
                        samplePoints: 2
                    };
                    ld.subObjects.push(new KGAuthor.Area(surplusDef, graph));
                }
            }
            return _this;
        }
        return EconLinearDemand;
    }(KGAuthor.Line));
    KGAuthor.EconLinearDemand = EconLinearDemand;
    var EconCompetitiveDemand = /** @class */ (function (_super) {
        __extends(EconCompetitiveDemand, _super);
        function EconCompetitiveDemand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return EconCompetitiveDemand;
    }(EconLinearDemand));
    KGAuthor.EconCompetitiveDemand = EconCompetitiveDemand;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var EconLinearSupply = /** @class */ (function (_super) {
        __extends(EconLinearSupply, _super);
        function EconLinearSupply(def, graph) {
            var _this = this;
            def = KGAuthor.setStrokeColor(def);
            KG.setDefaults(def, {
                name: 'supply',
                color: 'colors.supply',
                strokeWidth: 2,
                lineStyle: 'solid',
                pts: []
            });
            if (def.draggable && typeof (def.slope) == 'string') {
                def.drag = [{
                        'directions': 'xy',
                        'param': KGAuthor.paramName(def.slope),
                        'expression': KGAuthor.divideDefs(KGAuthor.subtractDefs('drag.y', def.yIntercept), 'drag.x')
                    }];
            }
            else if (def.draggable && typeof (def.invSlope) == 'string') {
                def.drag = [{
                        'directions': 'xy',
                        'param': KGAuthor.paramName(def.invSlope),
                        'expression': KGAuthor.divideDefs('drag.x', KGAuthor.subtractDefs('drag.y', def.yIntercept))
                    }];
            }
            else if (def.draggable && typeof (def.yIntercept) == 'string') {
                def.drag = [{
                        'directions': 'y',
                        'param': KGAuthor.paramName(def.yIntercept),
                        'expression': KGAuthor.addDefs(def.yIntercept, 'drag.dy')
                    }];
            }
            if (def.hasOwnProperty("price")) {
                def.pts.push({
                    name: "PQ",
                    y: def.price
                });
            }
            _this = _super.call(this, def, graph) || this;
            var ls = _this;
            if (graph) {
                var subObjects = ls.subObjects;
                var yInterceptPointDef = {
                    coordinates: [0, ls.yIntercept],
                    color: def.color,
                    r: 4,
                    show: def.show
                };
                if (def.draggable && typeof (ls.yIntercept) == 'string') {
                    yInterceptPointDef['drag'] = [{
                            directions: 'y',
                            param: KGAuthor.paramName(ls.yIntercept),
                            expression: KGAuthor.addDefs(ls.yIntercept, 'drag.dy')
                        }];
                }
                if (def.hasOwnProperty('yInterceptLabel')) {
                    yInterceptPointDef['droplines'] = {
                        horizontal: def.yInterceptLabel
                    };
                }
                ls.yInterceptPoint = new KGAuthor.Point(yInterceptPointDef, graph);
                if (def.handles) {
                    subObjects.push(ls.yInterceptPoint);
                }
                if (def.hasOwnProperty('surplus')) {
                    var surplusDef = KG.setDefaults(def.surplus || {}, {
                        "fill": "colors.supply"
                    });
                    var price = surplusDef.price || "calcs.".concat(ls.name, ".PQ.y"), quantity = surplusDef.quantity || "calcs.".concat(ls.name, ".PQ.x");
                    surplusDef.univariateFunction1 = {
                        fn: ls.def.univariateFunction.fn,
                        min: 0,
                        max: quantity,
                        samplePoints: 2
                    };
                    surplusDef.univariateFunction2 = {
                        fn: price,
                        min: 0,
                        max: quantity,
                        samplePoints: 2
                    };
                    ls.subObjects.push(new KGAuthor.Area(surplusDef, graph));
                }
            }
            return _this;
        }
        return EconLinearSupply;
    }(KGAuthor.Line));
    KGAuthor.EconLinearSupply = EconLinearSupply;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var EconLinearEquilibrium = /** @class */ (function (_super) {
        __extends(EconLinearEquilibrium, _super);
        function EconLinearEquilibrium(def, graph) {
            var _this = this;
            KG.setDefaults(def, {
                name: 'equilibrium',
                showCS: false,
                showPS: false
            });
            _this = _super.call(this, def, graph) || this;
            var le = _this;
            def.demand.price = "calcs.".concat(le.name, ".P");
            def.supply.price = "calcs.".concat(le.name, ".P");
            le.demand = new KGAuthor.EconLinearDemand(def.demand, graph);
            le.supply = new KGAuthor.EconLinearSupply(def.supply, graph);
            le.subObjects.push(_this.demand);
            le.subObjects.push(_this.supply);
            var eq = KGAuthor.lineIntersection(le.demand, le.supply);
            le.Q = eq[0];
            le.P = eq[1];
            if (graph) {
                if (def.hasOwnProperty('equilibrium')) {
                    def.equilibrium = KG.setDefaults(def.equilibrium, {
                        "color": "colors.equilibriumPrice",
                        "x": le.Q,
                        "y": le.P,
                        "droplines": {
                            "vertical": "Q^*",
                            "horizontal": "P^*"
                        }
                    });
                    le.subObjects.push(new KGAuthor.Point(def.equilibrium, graph));
                }
            }
            return _this;
        }
        EconLinearEquilibrium.prototype.parseSelf = function (parsedData) {
            var le = this;
            parsedData = _super.prototype.parseSelf.call(this, parsedData);
            parsedData.calcs[le.name] = {
                Q: le.Q.toString(),
                P: le.P.toString()
            };
            return parsedData;
        };
        return EconLinearEquilibrium;
    }(KGAuthor.GraphObjectGenerator));
    KGAuthor.EconLinearEquilibrium = EconLinearEquilibrium;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var EconPPF = /** @class */ (function (_super) {
        __extends(EconPPF, _super);
        function EconPPF(def, graph) {
            var _this = this;
            def = KGAuthor.setStrokeColor(def);
            KG.setDefaults(def, {
                name: 'ppf',
                color: 'colors.supply',
                strokeWidth: 2,
                lineStyle: 'solid',
                labor: 100,
                L1: 50,
                p1: 1,
                p2: 1,
                max1: 100,
                max2: 100,
                curvature: 0.5
            });
            if (def.linear) {
                def.curvature = 1;
            }
            var fn1coeff = KGAuthor.divideDefs(def.max1, KGAuthor.raiseDefToDef(def.labor, def.curvature)), fn2coeff = KGAuthor.divideDefs(def.max2, KGAuthor.raiseDefToDef(def.labor, def.curvature));
            var fn1 = new KGAuthor.EconOneInputProductionFunction({
                name: def.name + '_prodFn1',
                coefficient: fn1coeff,
                exponent: def.curvature
            }), fn2 = new KGAuthor.EconOneInputProductionFunction({
                name: def.name + '_prodFn2',
                coefficient: fn2coeff,
                exponent: def.curvature
            });
            def.parametricFunction = {
                xFunction: fn1.f("(t)"),
                yFunction: fn2.f(KGAuthor.subtractDefs(def.labor, "(t)")),
                max: def.labor
            };
            if (def.draggable) {
                var dragLaborRequirement = KGAuthor.addDefs(fn1.laborRequirement('drag.x'), fn2.laborRequirement('drag.y'));
                def.drag = [{
                        'directions': 'xy',
                        'param': KGAuthor.paramName(def.max1),
                        'expression': fn1.f(dragLaborRequirement)
                    },
                    {
                        'directions': 'xy',
                        'param': KGAuthor.paramName(def.max2),
                        'expression': fn2.f(dragLaborRequirement)
                    }];
            }
            _this = _super.call(this, def, graph) || this;
            var ppf = _this;
            ppf.labor = def.labor;
            ppf.prodFn1 = fn1;
            ppf.prodFn2 = fn2;
            ppf.subObjects.push(fn1);
            ppf.subObjects.push(fn2);
            ppf.L1 = def.L1;
            ppf.L2 = KGAuthor.subtractDefs(def.labor, def.L1);
            ppf.y1 = ppf.prodFn1.f(ppf.L1);
            ppf.y2 = ppf.prodFn2.f(ppf.L2);
            var coefficientRatio = KGAuthor.divideDefs(def.max2, def.max1), laborRatio = KGAuthor.divideDefs(ppf.L2, def.L1), priceRatio = KGAuthor.divideDefs(def.p1, def.p2);
            if (def.curvature == 1) {
                ppf.mrt = coefficientRatio;
                ppf.optimalL1 = "((".concat(coefficientRatio, " > ").concat(priceRatio, ") ? 0 : ").concat(ppf.labor, ")");
                ppf.optimalL1 = "((".concat(coefficientRatio, " > ").concat(priceRatio, ") ? ").concat(ppf.labor, " : 0)");
            }
            else {
                ppf.mrt = KGAuthor.multiplyDefs(coefficientRatio, KGAuthor.raiseDefToDef(laborRatio, KGAuthor.subtractDefs(def.curvature, 1)));
                var theta = KGAuthor.raiseDefToDef(KGAuthor.divideDefs(coefficientRatio, priceRatio), KGAuthor.invertDef(KGAuthor.subtractDefs(def.curvature, 1)));
                ppf.optimalL1 = KGAuthor.multiplyDefs(KGAuthor.divideDefs(theta, KGAuthor.addDefs(1, theta)), ppf.labor);
                ppf.optimalL2 = KGAuthor.multiplyDefs(KGAuthor.divideDefs(1, KGAuthor.addDefs(1, theta)), ppf.labor);
            }
            ppf.optimaly1 = ppf.prodFn1.f(ppf.optimalL1);
            ppf.optimaly2 = ppf.prodFn2.f(ppf.optimalL2);
            if (graph) {
                var subObjects = ppf.subObjects;
                var xInterceptPointDef = {
                    coordinates: [def.max1, 0],
                    fill: def.stroke,
                    r: 4
                };
                if (def.draggable && typeof (def.max1) == 'string') {
                    xInterceptPointDef['drag'] = [{
                            directions: 'x',
                            param: KGAuthor.paramName(def.max1),
                            expression: KGAuthor.addDefs(def.max1, 'drag.dx')
                        }];
                }
                if (def.hasOwnProperty('xInterceptLabel')) {
                    xInterceptPointDef['droplines'] = {
                        vertical: def.xInterceptLabel
                    };
                }
                ppf.xInterceptPoint = new KGAuthor.Point(xInterceptPointDef, graph);
                var yInterceptPointDef = {
                    coordinates: [0, def.max2],
                    fill: def.stroke,
                    r: 4
                };
                if (def.draggable && typeof (def.max2) == 'string') {
                    yInterceptPointDef['drag'] = [{
                            directions: 'y',
                            param: KGAuthor.paramName(def.max2),
                            expression: KGAuthor.addDefs(def.max2, 'drag.dy')
                        }];
                }
                if (def.hasOwnProperty('yInterceptLabel')) {
                    yInterceptPointDef['droplines'] = {
                        horizontal: def.yInterceptLabel
                    };
                }
                ppf.yInterceptPoint = new KGAuthor.Point(yInterceptPointDef, graph);
                if (def.handles) {
                    subObjects.push(ppf.xInterceptPoint);
                    subObjects.push(ppf.yInterceptPoint);
                }
            }
            return _this;
        }
        EconPPF.prototype.parseSelf = function (parsedData) {
            var ppf = this;
            parsedData = _super.prototype.parseSelf.call(this, parsedData);
            parsedData.calcs[ppf.name] = {
                L1: ppf.L1,
                L2: ppf.L2,
                y1: ppf.y1,
                y2: ppf.y2,
                optimalL1: ppf.optimalL1,
                optimalL2: ppf.optimalL2,
                optimaly1: ppf.optimaly1,
                optimaly2: ppf.optimaly2,
                mrt: ppf.mrt
            };
            return parsedData;
        };
        return EconPPF;
    }(KGAuthor.Curve));
    KGAuthor.EconPPF = EconPPF;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var EconLinearMC = /** @class */ (function (_super) {
        __extends(EconLinearMC, _super);
        function EconLinearMC(def, graph) {
            return _super.call(this, def, graph) || this;
        }
        return EconLinearMC;
    }(KGAuthor.EconLinearSupply));
    KGAuthor.EconLinearMC = EconLinearMC;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var EconLinearMonopoly = /** @class */ (function (_super) {
        __extends(EconLinearMonopoly, _super);
        function EconLinearMonopoly(def, graph) {
            var _this = this;
            KG.setDefaults(def, {
                name: 'monopoly',
                showCS: false,
                showPS: false,
                showProfit: false,
                showDWL: false
            });
            _this = _super.call(this, def, graph) || this;
            var lm = _this;
            def.demand.surplus = { show: def.showCS, price: "calcs.".concat(lm.name, ".P"), quantity: "calcs.".concat(lm.name, ".Q") };
            def.cost.surplus = { show: def.showPS, price: "calcs.".concat(lm.name, ".P"), quantity: "calcs.".concat(lm.name, ".Q") };
            lm.demand = new KGAuthor.EconLinearDemand(def.demand, graph);
            lm.cost = new KGAuthor.EconLinearMC(def.cost, graph);
            var intersectMRMC = KGAuthor.lineIntersection(lm.demand.marginalRevenue, lm.cost);
            lm.Q = intersectMRMC[0];
            lm.P = lm.demand.yOfX(lm.Q);
            lm.MRMC = lm.cost.yOfX(lm.Q);
            var intersectDMC = KGAuthor.lineIntersection(lm.demand, lm.cost);
            lm.competitiveQ = intersectDMC[0];
            lm.competitiveP = lm.demand.yOfX(lm.competitiveQ);
            if (def.hasOwnProperty('showDWL')) {
                var DWLDef = {
                    show: def.showDWL,
                    fill: "colors.dwl"
                };
                DWLDef.univariateFunction1 = {
                    fn: lm.demand.def.univariateFunction.fn,
                    min: lm.Q,
                    max: lm.competitiveQ,
                    samplePoints: 2
                };
                DWLDef.univariateFunction2 = {
                    fn: lm.cost.def.univariateFunction.fn,
                    min: lm.Q,
                    max: lm.competitiveQ,
                    samplePoints: 2
                };
                lm.subObjects.push(new KGAuthor.Area(DWLDef, graph));
            }
            lm.subObjects.push(_this.demand);
            lm.subObjects.push(_this.cost);
            return _this;
        }
        EconLinearMonopoly.prototype.parseSelf = function (parsedData) {
            var lm = this;
            parsedData = _super.prototype.parseSelf.call(this, parsedData);
            parsedData.calcs[lm.name] = {
                Q: lm.Q.toString(),
                P: lm.P.toString(),
                competitiveQ: lm.competitiveQ.toString(),
                competitiveP: lm.competitiveP.toString()
            };
            return parsedData;
        };
        return EconLinearMonopoly;
    }(KGAuthor.GraphObjectGenerator));
    KGAuthor.EconLinearMonopoly = EconLinearMonopoly;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var ExchangeEquilibriumBundle = /** @class */ (function (_super) {
        __extends(ExchangeEquilibriumBundle, _super);
        function ExchangeEquilibriumBundle(def, graph) {
            var agentA = new KGAuthor.EconBundle(def.agentA, graph), agentB = new KGAuthor.EconBundle(def.agentB, graph);
            var p;
            if (def.agentA.utilityFunction.type == 'CobbDouglas' && def.agentB.utilityFunction.type == 'CobbDouglas') {
                var alphaW2 = function (agent) {
                    return KGAuthor.multiplyDefs(agent.y, agent.utilityFunction.alpha);
                }, oneMinusAlphaW1 = function (agent) {
                    return KGAuthor.multiplyDefs(agent.x, KGAuthor.subtractDefs(1, agent.utilityFunction.alpha));
                };
                p = KGAuthor.divideDefs(KGAuthor.addDefs(alphaW2(agentA), alphaW2(agentB)), KGAuthor.addDefs(oneMinusAlphaW1(agentA), oneMinusAlphaW1(agentB)));
            }
            else {
                console.log("We're just handling Edgeworth equilibrium with Cobb-Douglas so far...");
            }
            KG.setDefaults(def, {
                label: { text: 'E' },
                color: "colors.budget"
            });
            def.utilityFunctionObject = agentA.utilityFunction;
            def.budgetLine = {
                p1: p,
                p2: 1,
                point: [agentA.x, agentA.y]
            };
            return _super.call(this, def, graph) || this;
        }
        return ExchangeEquilibriumBundle;
    }(KGAuthor.EconOptimalBundle));
    KGAuthor.ExchangeEquilibriumBundle = ExchangeEquilibriumBundle;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var EconContractCurve = /** @class */ (function (_super) {
        __extends(EconContractCurve, _super);
        function EconContractCurve(def, graph) {
            var _this = this;
            var a = def.a, b = def.b, ab = KGAuthor.multiplyDefs(a, b), aMinusABtimesX = KGAuthor.multiplyDefs(KGAuthor.subtractDefs(a, ab), def.totalGood1), bMinusABtimesY = KGAuthor.multiplyDefs(KGAuthor.subtractDefs(b, ab), def.totalGood2), bMinusA = KGAuthor.subtractDefs(b, a), fnString = "".concat(bMinusABtimesY, "*(x)/(").concat(aMinusABtimesX, " + ").concat(bMinusA, "*(x))");
            def.univariateFunction = { fn: fnString };
            KG.setDefaults(def, {
                interpolation: 'curveMonotoneX',
                color: 'colors.budget'
            });
            _this = _super.call(this, def, graph) || this;
            _this.fnString = fnString;
            return _this;
        }
        EconContractCurve.prototype.parseSelf = function (parsedData) {
            var cc = this;
            parsedData = _super.prototype.parseSelf.call(this, parsedData);
            parsedData.calcs['cc'] = cc.fnString;
            return parsedData;
        };
        return EconContractCurve;
    }(KGAuthor.Curve));
    KGAuthor.EconContractCurve = EconContractCurve;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var EconParetoLens = /** @class */ (function (_super) {
        __extends(EconParetoLens, _super);
        function EconParetoLens(def, graph) {
            var _this = _super.call(this, def, graph) || this;
            _this.subObjects.push(new KGAuthor.Rectangle({
                clipPathName: def.bundleA + "_IC_above",
                clipPathName2: def.bundleB + "_IC_above",
                x1: graph.def.xAxis.min,
                x2: graph.def.xAxis.max,
                y1: graph.def.yAxis.min,
                y2: graph.def.yAxis.max,
                fill: "colors.paretoLens",
                opacity: "0.8",
                show: def.show
            }, graph));
            return _this;
        }
        return EconParetoLens;
    }(KGAuthor.GraphObjectGenerator));
    KGAuthor.EconParetoLens = EconParetoLens;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kgAuthor.ts" />
/* SCHEMAS */
/// <reference path="schemas/econSchema.ts"/>
/// <reference path="schemas/bowlesHallidaySchema.ts"/>
/// <reference path="schemas/lowdownSchema.ts"/>
/* LAYOUTS */
/// <reference path="layouts/edgeworth.ts"/>
/// <reference path="layouts/gameTree.ts"/>
/* FUNCTIONAL FORMS */
/// <reference path="functional_forms/multivariate/multivariate.ts"/>
/// <reference path="functional_forms/multivariate/cobbDouglas.ts"/>
/// <reference path="functional_forms/multivariate/complements.ts"/>
/// <reference path="functional_forms/multivariate/substitutes.ts"/>
/// <reference path="functional_forms/multivariate/ces.ts"/>
/// <reference path="functional_forms/multivariate/concave.ts"/>
/// <reference path="functional_forms/multivariate/quasilinear.ts"/>
/* MICRO */
/* Consumer Theory */
/// <reference path="micro/consumer_theory/constraints/budgetLine.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/utilitySelector.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/indifferenceCurve.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/bundle.ts"/>
/// <reference path="micro/consumer_theory/optimization/optimalBundle.ts"/>
/// <reference path="micro/consumer_theory/optimization/demandCurve.ts"/>
/* Producer Theory */
/// <reference path="micro/producer_theory/oneInputProductionFunction.ts"/>
/* Equilibrium */
/// <reference path="micro/equilibrium/constantElasticityCurve.ts"/>
/// <reference path="micro/equilibrium/constantElasticityEquilibrium.ts"/>
/// <reference path="micro/equilibrium/linearDemand.ts"/>
/// <reference path="micro/equilibrium/linearSupply.ts"/>
/// <reference path="micro/equilibrium/linearEquilibrium.ts"/>
/// <reference path="micro/equilibrium/ppf.ts"/>
/* Monopoly */
/// <reference path="micro/monopoly/linearMC.ts"/>
/// <reference path="micro/monopoly/linearMonopoly.ts"/>
/* Exchange */
/// <reference path="micro/exchange/edgeworth/exchange_equilibrium.ts"/>
/// <reference path="micro/exchange/edgeworth/contract_curve.ts"/>
/// <reference path="micro/exchange/edgeworth/pareto_lens.ts"/>
/// <reference path="../kg.ts"/>
/// <reference path="parsers/parsingFunctions.ts"/>
/// <reference path="parsers/authoringObject.ts"/>
/// <reference path="schemas/schema.ts"/>
/// <reference path="layouts/layout.ts"/>
/// <reference path="layouts/html.ts"/>
/// <reference path="layouts/oneGraph.ts"/>
/// <reference path="layouts/twoHorizontalGraphs.ts"/>
/// <reference path="layouts/threeHorizontalGraphs.ts"/>
/// <reference path="layouts/rectanglePlusTwoSquares.ts"/>
/// <reference path="layouts/twoVerticalGraphs.ts"/>
/// <reference path="layouts/squarePlusTwoVerticalGraphs.ts"/>
/// <reference path="layouts/fourGraphs.ts"/>
/// <reference path="layouts/gameMatrix.ts"/>
/// <reference path="positionedObjects/positionedObject.ts"/>
/// <reference path="positionedObjects/graph.ts"/>
/// <reference path="positionedObjects/tree.ts"/>
/// <reference path="positionedObjects/ggbContainer.ts"/>
/// <reference path="positionedObjects/mathboxContainer.ts"/>
/// <reference path="positionedObjects/divContainer.ts"/>
/// <reference path="defObjects/graphObjectGenerator.ts"/>
/// <reference path="defObjects/defObject.ts"/>
/// <reference path="defObjects/clipPath.ts"/>
/// <reference path="defObjects/marker.ts"/>
/// <reference path="defObjects/arrowDef.ts"/>
/// <reference path="graphObjects/graphObject.ts"/>
/// <reference path="graphObjects/axis.ts"/>
/// <reference path="graphObjects/grid.ts"/>
/// <reference path="graphObjects/curve.ts"/>
/// <reference path="graphObjects/line.ts"/>
/// <reference path="graphObjects/circle.ts"/>
/// <reference path="graphObjects/point.ts"/>
/// <reference path="graphObjects/segment.ts"/>
/// <reference path="graphObjects/arrow.ts"/>
/// <reference path="graphObjects/dropline.ts"/>
/// <reference path="graphObjects/area.ts"/>
/// <reference path="graphObjects/rectangle.ts"/>
/// <reference path="graphObjects/contour.ts"/>
/// <reference path="graphObjects/angle.ts"/>
/// <reference path="mathboxObjects/mathboxObject.ts"/>
/// <reference path="mathboxObjects/mathboxAxis.ts"/>
/// <reference path="mathboxObjects/mathboxPoint.ts"/>
/// <reference path="mathboxObjects/mathboxLine.ts"/>
/// <reference path="mathboxObjects/mathboxLabel.ts"/>
/// <reference path="mathboxObjects/mathboxArea.ts"/>
/// <reference path="mathboxObjects/mathboxPlane.ts"/>
/// <reference path="mathboxObjects/mathboxFunctionSurface.ts"/>
/// <reference path="mathboxObjects/mathboxCurve.ts"/>
/// <reference path="divObjects/divObject.ts"/>
/// <reference path="divObjects/positionedDiv.ts"/>
/// <reference path="divObjects/table.ts"/>
/// <reference path="divObjects/label.ts"/>
/// <reference path="divObjects/sidebar.ts"/>
/// <reference path="divObjects/explanation.ts"/>
/// <reference path="divObjects/controls.ts"/>
/// <reference path="divObjects/gameMatrix.ts"/>
/// <reference path="divObjects/ggbApplet.ts"/>
/// <reference path="divObjects/mathbox.ts"/>
/// <reference path="econ/eg.ts"/>
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var Model = /** @class */ (function () {
        function Model(parsedData) {
            var model = this;
            model.params = parsedData.params.map(function (def) {
                return new KG.Param(def);
            });
            model.initialParams = parsedData.params;
            model.calcs = parsedData.calcs;
            model.colors = parsedData.colors;
            model.idioms = parsedData.idioms;
            model.clearColor = parsedData.clearColor;
            model.restrictions = (parsedData.restrictions || []).map(function (def) {
                return new KG.Restriction(def);
            });
            model.updateListeners = [];
            model.currentParamValues = model.evalParams();
            model.evalCalcs();
            model.currentColors = model.evalObject(model.colors);
            model.currentIdioms = model.evalObject(model.idioms);
        }
        Model.prototype.addUpdateListener = function (updateListener) {
            this.updateListeners.push(updateListener);
            return this;
        };
        Model.prototype.resetParams = function () {
            console.log("resetting model parameters");
            var model = this;
            console.log('initial parameters are: ', model.initialParams);
            model.initialParams.forEach(function (p) {
                console.log('setting ', p.name, ' to ', p.value);
                model.updateParam(p.name, p.value);
            });
            model.update(true);
        };
        Model.prototype.evalParams = function () {
            var p = {};
            this.params.forEach(function (param) {
                p[param.name] = param.value;
            });
            return p;
        };
        // evaluates the calcs object; then re-evaluates to capture calcs that depend on other calcs
        Model.prototype.evalCalcs = function () {
            var model = this;
            // clear calculations so old values aren't used;
            model.currentCalcValues = {};
            // generate as many calculations from params as possible
            model.currentCalcValues = model.evalObject(model.calcs, true);
            // calculate values based on other calculations (up to a depth of 5)
            for (var i = 0; i < 5; i++) {
                for (var calcName in model.currentCalcValues) {
                    if (typeof model.calcs[calcName] == 'object') {
                        model.currentCalcValues[calcName] = model.evalObject(model.calcs[calcName], true);
                    }
                    else if (isNaN(model.currentCalcValues[calcName]) && typeof model.calcs[calcName] == 'string') {
                        model.currentCalcValues[calcName] = model.evaluate(model.calcs[calcName], true);
                    }
                }
            }
            return model.currentCalcValues;
        };
        Model.prototype.evalObject = function (obj, onlyJSMath) {
            var model = this;
            var newObj = {};
            for (var stringOrObj in obj) {
                var def = obj[stringOrObj];
                if (typeof def === 'number') {
                    newObj[stringOrObj] = def;
                }
                else if (typeof def === 'string') {
                    newObj[stringOrObj] = model.evaluate(def, onlyJSMath);
                }
                else {
                    newObj[stringOrObj] = model.evalObject(def, onlyJSMath);
                }
            }
            return newObj;
        };
        // the model serves as a model, and can evaluate expressions within the context of that model
        // if onlyJSMath is selected, it will only try to evaluate using JSMath; this is especially important for calculations.
        Model.prototype.evaluate = function (name, onlyJSMath) {
            var model = this;
            // don't just evaluate numbers
            if (!isNaN(parseFloat(name))) {
                //console.log('interpreted ', name, 'as a number.');
                return parseFloat(name);
            }
            // collect current values in a scope object
            var params = model.currentParamValues, calcs = model.currentCalcValues, colors = model.currentColors, idioms = model.currentIdioms;
            //console.log('trying to parse ', name);
            // try to evaluate using mathjs
            try {
                var compiledMath = math.compile(name);
                var result = compiledMath.evaluate({
                    params: params,
                    calcs: calcs,
                    idioms: idioms,
                    colors: colors
                });
                //onsole.log('parsed', name, 'as ', result);
                return result;
            }
            catch (err) {
                // if that doesn't work, try to evaluate using native js eval
                //console.log('unable to parse', name, 'as a pure math function, trying general eval');
                //console.log('parsing did not work');
                if (onlyJSMath) {
                    return name;
                }
                else {
                    try {
                        var result = eval(name);
                        //console.log('parsed', name, 'as an expression with value', result);
                        return result;
                    }
                    catch (err) {
                        //console.log('unable to parse', name, 'as a valid expression; generates error:', err.message);
                        return name;
                    }
                }
            }
        };
        // This is a utility for exporting currently used colors for use in LaTex documents.
        Model.prototype.latexColors = function () {
            var result = '%% econ colors %%\n', model = this;
            for (var color in model.colors) {
                result += "\\definecolor{".concat(color, "}{HTML}{").concat(model.evaluate(model.colors[color]).replace('#', ''), "}\n");
            }
            console.log(result);
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
                //restrictions aren't working right now
                var valid_1 = true;
                model.restrictions.forEach(function (r) {
                    if (!r.valid(model)) {
                        valid_1 = false;
                    }
                });
                if (valid_1) {
                    model.update(false);
                }
                else {
                    param.update(oldValue);
                }
                model.update(false);
            }
        };
        // method exposed to viewObjects to allow them to toggle a binary param
        Model.prototype.toggleParam = function (name) {
            var currentValue = this.getParam(name).value;
            this.updateParam(name, !currentValue);
        };
        // method exposed to viewObjects to allow them to cycle a discrete param
        // increments by 1 if below max value, otherwise sets to zero
        Model.prototype.cycleParam = function (name) {
            var param = this.getParam(name);
            this.updateParam(name, param.value < param.max ? param.value++ : 0);
        };
        Model.prototype.update = function (force) {
            var model = this;
            model.currentParamValues = model.evalParams();
            model.evalCalcs();
            console.log('calcs', model.currentCalcValues);
            model.currentColors = model.evalObject(model.colors);
            model.updateListeners.forEach(function (listener) {
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
    var Param = /** @class */ (function () {
        function Param(def) {
            function decimalPlaces(numAsString) {
                var match = ('' + numAsString).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
                if (!match) {
                    return 0;
                }
                return Math.max(0, 
                // Number of digits right of decimal point.
                (match[1] ? match[1].length : 0)
                    // Adjust for scientific notation.
                    - (match[2] ? +match[2] : 0));
            }
            KG.setDefaults(def, { min: 0, max: 10, round: 1, label: '' });
            this.name = def.name;
            this.label = def.label;
            if (typeof def.value == 'boolean') {
                this.value = +def.value;
                this.min = 0;
                this.max = 100;
                this.round = 1;
            }
            else {
                this.value = parseFloat(def.value);
                this.min = parseFloat(def.min);
                this.max = parseFloat(def.max);
                this.round = parseFloat(def.round);
                this.precision = parseInt(def.precision) || decimalPlaces(this.round.toString());
            }
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
            return d3.format(".".concat(precision, "f"))(this.value);
        };
        return Param;
    }());
    KG.Param = Param;
})(KG || (KG = {}));
/// <reference path="model.ts" />
var KG;
(function (KG) {
    var Restriction = /** @class */ (function () {
        function Restriction(def) {
            this.expression = def.expression;
            this.type = def.type;
            this.min = def.min;
            this.max = def.max;
        }
        Restriction.prototype.valid = function (model) {
            var r = this, value = model.evaluate(r.expression), min = model.evaluate(r.min), max = model.evaluate(r.max);
            // restrictions aren't working right now
            return true;
            //return (value >= min && value <= max);
        };
        return Restriction;
    }());
    KG.Restriction = Restriction;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    function randomString(length) {
        var text = "KGID_";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    KG.randomString = randomString;
    var UpdateListener = /** @class */ (function () {
        function UpdateListener(def) {
            def.constants = (def.constants || []).concat(['model', 'updatables', 'name']);
            var ul = this;
            ul.def = def;
            def.constants.forEach(function (c) {
                ul[c] = isNaN(parseFloat(def[c])) ? def[c] : +def[c];
            });
            ul.id = randomString(10);
            ul.model.addUpdateListener(this);
        }
        UpdateListener.prototype.updateArray = function (a) {
            var u = this;
            return a.map(function (d) {
                if (Array.isArray(d)) {
                    return u.updateArray(d);
                }
                else {
                    var initialValue = d;
                    var newValue = u.model.evaluate(d);
                    if (initialValue != newValue) {
                        u.hasChanged = true;
                    }
                    return newValue;
                }
            });
        };
        UpdateListener.prototype.updateDef = function (name) {
            var u = this;
            if (u.def.hasOwnProperty(name)) {
                var d = u.def[name], initialValue = u[name];
                if (Array.isArray(d)) {
                    u[name] = u.updateArray(d);
                }
                else {
                    var newValue = u.model.evaluate(d);
                    if (initialValue != newValue) {
                        u.hasChanged = true;
                        u[name] = newValue;
                    }
                }
                //console.log(u.constructor['name'],name,'changed from',initialValue,'to',u[name]);
            }
            return u;
        };
        UpdateListener.prototype.update = function (force) {
            var u = this;
            u.hasChanged = !!force;
            if (u.hasOwnProperty('updatables') && u.updatables != undefined) {
                u.updatables.forEach(function (name) {
                    u.updateDef(name);
                });
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
    var MathFunction = /** @class */ (function (_super) {
        __extends(MathFunction, _super);
        function MathFunction(def) {
            KG.setDefaults(def, {
                samplePoints: 50
            });
            KG.setProperties(def, 'constants', ['samplePoints']);
            KG.setProperties(def, 'updatables', ['min', 'max']);
            return _super.call(this, def) || this;
        }
        MathFunction.prototype.updateFunctionString = function (str, scope) {
            function getCalc(o, s) {
                s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
                s = s.replace(/^\./, ''); // strip a leading dot
                var a = s.split('.');
                for (var i = 0, n = a.length; i < n; ++i) {
                    var k = a[i];
                    if (k in o) {
                        o = o[k];
                    }
                    else {
                        return;
                    }
                }
                return o;
            }
            str = str.toString();
            if (str.indexOf('null') > -1 || str.indexOf('Infinity') > -1) {
                return null;
            }
            var re = /((calcs|params).[.\w]*)+/g;
            var references = str.match(re);
            if (references) {
                references.forEach(function (name) {
                    str = KGAuthor.replaceVariable(str, name, getCalc(scope, name));
                });
            }
            //console.log('updated function to ',str);
            return str;
        };
        return MathFunction;
    }(KG.UpdateListener));
    KG.MathFunction = MathFunction;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var MathFunction = KG.MathFunction;
    var UnivariateFunction = /** @class */ (function (_super) {
        __extends(UnivariateFunction, _super);
        function UnivariateFunction(def) {
            var _this = this;
            KG.setDefaults(def, {
                ind: 'x'
            });
            KG.setProperties(def, 'constants', ['fn', 'yFn']);
            KG.setProperties(def, 'updatables', ['ind', 'min', 'max']);
            _this = _super.call(this, def) || this;
            _this.fnStringDef = def.fn;
            _this.fnZStringDef = def.fnZ;
            _this.yFnStringDef = def.yFn;
            _this.yFnZStringDef = def.yFnZ;
            return _this;
        }
        UnivariateFunction.prototype.evaluate = function (input, z) {
            var fn = this;
            if (z) {
                if (fn.hasOwnProperty('yzCompiledFunction') && fn.ind == 'y') {
                    return fn.yzCompiledFunction.evaluate({ y: input });
                }
                else if (fn.hasOwnProperty('zCompiledFunction') && fn.ind == 'y') {
                    return fn.zCompiledFunction.evaluate({ y: input });
                }
                else if (fn.hasOwnProperty('zCompiledFunction')) {
                    return fn.zCompiledFunction.evaluate({ x: input });
                }
            }
            else {
                if (fn.hasOwnProperty('yCompiledFunction') && fn.ind == 'y') {
                    return fn.yCompiledFunction.evaluate({ y: input });
                }
                else if (fn.hasOwnProperty('compiledFunction') && fn.ind == 'y') {
                    return fn.compiledFunction.evaluate({ y: input });
                }
                else if (fn.hasOwnProperty('compiledFunction')) {
                    return fn.compiledFunction.evaluate({ x: input });
                }
            }
        };
        UnivariateFunction.prototype.generateData = function (min, max) {
            var fn = this, data = [];
            if (undefined != fn.min) {
                min = fn.min;
            }
            if (undefined != fn.max) {
                max = fn.max;
            }
            for (var i = 0; i < fn.samplePoints + 1; i++) {
                var a = i / fn.samplePoints, input = a * min + (1 - a) * max, output = fn.evaluate(input);
                if (!isNaN(output) && output != Infinity && output != -Infinity) {
                    data.push((fn.ind == 'x') ? { x: input, y: output } : { x: output, y: input });
                }
            }
            this.data = data;
            return data;
        };
        UnivariateFunction.prototype.mathboxFn = function (mathbox) {
            var fn = this;
            if (fn.ind == 'y') {
                return function (emit, y) {
                    var x = fn.evaluate(y), z = fn.evaluate(y, true);
                    if (x >= mathbox.xAxis.min && x <= mathbox.xAxis.max && z >= mathbox.zAxis.min && z <= mathbox.zAxis.max) {
                        emit(y, z, x);
                    }
                };
            }
            else {
                return function (emit, x) {
                    var y = fn.evaluate(x), z = fn.evaluate(x, true);
                    if (y >= mathbox.yAxis.min && y <= mathbox.yAxis.max && z >= mathbox.zAxis.min && z <= mathbox.zAxis.max) {
                        emit(y, z, x);
                    }
                };
            }
        };
        UnivariateFunction.prototype.update = function (force) {
            var fn = _super.prototype.update.call(this, force);
            //console.log('updating; currently ', fn.fnString);
            fn.scope = {
                params: fn.model.currentParamValues,
                calcs: fn.model.currentCalcValues,
                colors: fn.model.currentColors
            };
            var originalString = fn.fnString;
            if (originalString != fn.updateFunctionString(fn.fnStringDef, fn.scope)) {
                fn.hasChanged = true;
                fn.fnString = fn.updateFunctionString(fn.fnStringDef, fn.scope);
                fn.compiledFunction = math.compile(fn.fnString);
            }
            if (fn.def.hasOwnProperty('yFn')) {
                if (fn.yFnString != fn.updateFunctionString(fn.yFnStringDef, fn.scope)) {
                    fn.hasChanged = true;
                    fn.yFnString = fn.updateFunctionString(fn.yFnStringDef, fn.scope);
                    fn.yCompiledFunction = math.compile(fn.yFnString);
                }
            }
            if (fn.def.hasOwnProperty('fnZ')) {
                if (fn.fnZString != fn.updateFunctionString(fn.fnZStringDef, fn.scope)) {
                    fn.hasChanged = true;
                    fn.fnZString = fn.updateFunctionString(fn.fnZStringDef, fn.scope);
                    fn.zCompiledFunction = math.compile(fn.fnZString);
                }
            }
            if (fn.def.hasOwnProperty('yFnZ')) {
                if (fn.yFnZString != fn.updateFunctionString(fn.yFnZStringDef, fn.scope)) {
                    fn.hasChanged = true;
                    fn.yFnZString = fn.updateFunctionString(fn.yFnZStringDef, fn.scope);
                    fn.yzCompiledFunction = math.compile(fn.yFnZString);
                }
            }
            return fn;
        };
        return UnivariateFunction;
    }(MathFunction));
    KG.UnivariateFunction = UnivariateFunction;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var ParametricFunction = /** @class */ (function (_super) {
        __extends(ParametricFunction, _super);
        function ParametricFunction(def) {
            var _this = this;
            KG.setDefaults(def, {
                min: 0,
                max: 10
            });
            _this = _super.call(this, def) || this;
            _this.xFunctionStringDef = def.xFunction;
            _this.yFunctionStringDef = def.yFunction;
            return _this;
        }
        ParametricFunction.prototype.evaluate = function (input) {
            var fn = this;
            fn.scope = fn.scope || { params: fn.model.currentParamValues };
            fn.scope.t = input;
            return { x: fn.xCompiledFunction.evaluate(fn.scope), y: fn.yCompiledFunction.evaluate(fn.scope) };
        };
        ParametricFunction.prototype.generateData = function (min, max) {
            var fn = this, data = [];
            if (undefined != fn.min) {
                min = fn.min;
            }
            if (undefined != fn.max) {
                max = fn.max;
            }
            for (var i = 0; i < fn.samplePoints + 1; i++) {
                var a = i / fn.samplePoints, input = a * min + (1 - a) * max, output = fn.evaluate(input);
                if (!isNaN(output.x) && output.x != Infinity && output.x != -Infinity && !isNaN(output.y) && output.y != Infinity && output.y != -Infinity) {
                    data.push(output);
                }
            }
            this.data = data;
            return data;
        };
        ParametricFunction.prototype.update = function (force) {
            var fn = _super.prototype.update.call(this, force);
            //console.log('updating; currently ', fn.fnString);
            fn.scope = {
                params: fn.model.currentParamValues,
                calcs: fn.model.currentCalcValues,
                colors: fn.model.currentColors
            };
            var originalXFunctionString = fn.xFunctionString;
            if (originalXFunctionString != fn.updateFunctionString(fn.xFunctionStringDef, fn.scope)) {
                fn.hasChanged = true;
                fn.xFunctionString = fn.updateFunctionString(fn.xFunctionStringDef, fn.scope);
                fn.xCompiledFunction = math.compile(fn.xFunctionString);
            }
            var originalYFunctionString = fn.yFunctionString;
            if (originalYFunctionString != fn.updateFunctionString(fn.yFunctionStringDef, fn.scope)) {
                fn.hasChanged = true;
                fn.yFunctionString = fn.updateFunctionString(fn.yFunctionStringDef, fn.scope);
                fn.yCompiledFunction = math.compile(fn.yFunctionString);
            }
            return fn;
        };
        return ParametricFunction;
    }(KG.MathFunction));
    KG.ParametricFunction = ParametricFunction;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var MathFunction = KG.MathFunction;
    var MultivariateFunction = /** @class */ (function (_super) {
        __extends(MultivariateFunction, _super);
        function MultivariateFunction(def) {
            var _this = this;
            def.samplePoints = 100;
            KG.setProperties(def, 'constants', ['fn']);
            _this = _super.call(this, def) || this;
            _this.fnStringDef = def.fn;
            _this.domainConditionStringDef = def.domainCondition;
            return _this;
        }
        MultivariateFunction.prototype.inDomain = function (x, y, z) {
            var fn = this;
            if (fn.hasOwnProperty('compiledDomainCondition')) {
                return fn.compiledDomainCondition.evaluate({ x: x, y: y, z: z });
            }
            else {
                return true;
            }
        };
        MultivariateFunction.prototype.evaluate = function (x, y) {
            var fn = this;
            if (fn.hasOwnProperty('compiledFunction')) {
                var z = fn.compiledFunction.evaluate({ x: x, y: y });
                if (fn.inDomain(x, y, z)) {
                    return z;
                }
            }
        };
        MultivariateFunction.prototype.mathboxFn = function () {
            var fn = this;
            return function (emit, x, y) {
                emit(y, fn.evaluate(x, y), x);
            };
        };
        MultivariateFunction.prototype.contour = function (level, xScale, yScale, bounds) {
            var fn = this;
            bounds = KG.setDefaults(bounds || {}, {
                xMin: xScale.domainMin,
                xMax: xScale.domainMax,
                yMin: yScale.domainMin,
                yMax: yScale.domainMax
            });
            var n = 100, m = 100, values = new Array(n * m);
            for (var j = 0.5, k = 0; j < m; ++j) {
                for (var i = 0.5; i < n; ++i, ++k) {
                    var x = bounds.xMin + i * (bounds.xMax - bounds.xMin) / n, y = bounds.yMin + j * (bounds.yMax - bounds.yMin) / m;
                    values[k] = fn.evaluate(x, y);
                }
            }
            var transform = function (_a) {
                var type = _a.type, value = _a.value, coordinates = _a.coordinates;
                return {
                    type: type,
                    value: value,
                    coordinates: coordinates.map(function (rings) {
                        return rings.map(function (points) {
                            return points.map(function (_a) {
                                var x = _a[0], y = _a[1];
                                return ([xScale.scale(bounds.xMin + x * (bounds.xMax - bounds.xMin) / 100), yScale.scale(bounds.yMin + y * (bounds.yMax - bounds.yMin) / 100)]);
                            });
                        });
                    })
                };
            };
            var p = d3.geoPath();
            // Compute the contour polygons at log-spaced intervals; returns an array of MultiPolygon.
            var contourLine = d3.contours().size([n, m]).contour(values, level);
            return p(transform(contourLine));
        };
        MultivariateFunction.prototype.update = function (force) {
            var fn = _super.prototype.update.call(this, force);
            //console.log('updating; currently ', fn.fnString);
            fn.scope = {
                params: fn.model.currentParamValues,
                calcs: fn.model.currentCalcValues,
                colors: fn.model.currentColors
            };
            var originalString = fn.fnString, originalDomainCondition = fn.domainConditionString;
            if (originalString != fn.updateFunctionString(fn.fnStringDef, fn.scope)) {
                fn.hasChanged = true;
                fn.fnString = fn.updateFunctionString(fn.fnStringDef, fn.scope);
                fn.compiledFunction = math.compile(fn.fnString);
            }
            if (fn.domainConditionStringDef != undefined) {
                if (originalDomainCondition != fn.updateFunctionString(fn.domainConditionStringDef, fn.scope)) {
                    fn.hasChanged = true;
                    fn.domainConditionString = fn.updateFunctionString(fn.domainConditionStringDef, fn.scope);
                    fn.compiledDomainCondition = math.compile(fn.domainConditionString);
                }
            }
            return fn;
        };
        return MultivariateFunction;
    }(MathFunction));
    KG.MultivariateFunction = MultivariateFunction;
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
    var Listener = /** @class */ (function (_super) {
        __extends(Listener, _super);
        function Listener(def) {
            KG.setProperties(def, 'updatables', ['expression']);
            KG.setProperties(def, 'constants', ['param']);
            return _super.call(this, def) || this;
        }
        Listener.prototype.onChange = function (scope) {
            var l = this, compiledMath = math.compile(l.expression);
            var parsedMath = compiledMath.evaluate(scope);
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
    var DragListener = /** @class */ (function (_super) {
        __extends(DragListener, _super);
        function DragListener(def) {
            if (def.hasOwnProperty('vertical')) {
                def.directions = 'y';
                def.param = def.vertical;
                def.expression = "params.".concat(def.vertical, " + drag.dy");
            }
            if (def.hasOwnProperty('horizontal')) {
                def.directions = 'x';
                def.param = def.horizontal;
                def.expression = "params.".concat(def.horizontal, " + drag.dx");
            }
            KG.setDefaults(def, {
                directions: "xy"
            });
            KG.setProperties(def, 'updatables', ['draggable', 'directions']);
            return _super.call(this, def) || this;
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
    var ClickListener = /** @class */ (function (_super) {
        __extends(ClickListener, _super);
        function ClickListener(def) {
            var _this = this;
            KG.setDefaults(def, { transitions: [1, 0] }); // default to toggle on/off
            _this = _super.call(this, def) || this;
            _this.transitions = def.transitions;
            return _this;
        }
        ClickListener.prototype.click = function () {
            var c = this;
            console.log("clicking", c);
            var current = c.model.currentParamValues[c.param];
            var newvalue = c.transitions[current];
            c.model.updateParam(c.param, newvalue);
        };
        return ClickListener;
    }(KG.Listener));
    KG.ClickListener = ClickListener;
})(KG || (KG = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var InteractionHandler = /** @class */ (function (_super) {
        __extends(InteractionHandler, _super);
        function InteractionHandler(def) {
            var _this = this;
            KG.setDefaults(def, { dragListeners: [], clickListeners: [] });
            KG.setProperties(def, 'constants', ["viewObject", "dragListeners", "clickListeners"]);
            _this = _super.call(this, def) || this;
            _this.update(true);
            _this.scope = { params: {}, calcs: {}, colors: {}, drag: {} };
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
            if (ih.hasOwnProperty('clickListeners') && (ih.element != undefined)) {
                if (ih.clickListeners.length > 0) {
                    ih.element.style("pointer-events", "all");
                    ih.element.style("cursor", "pointer");
                }
            }
            return ih;
        };
        InteractionHandler.prototype.addTrigger = function (element) {
            var handler = this;
            handler.element = element;
            // add click listeners
            if (handler.clickListeners.length > 0) {
                element.on("click", function () {
                    handler.clickListeners.forEach(function (c) { c.click(); });
                });
            }
            // add drag listeners
            if (handler.dragListeners.length > 0) {
                element.call(d3.drag()
                    .on('start', function () {
                    handler.scope.params = handler.model.currentParamValues;
                    handler.scope.calcs = handler.model.currentCalcValues;
                    handler.scope.colors = handler.model.currentColors;
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
/// <reference path='../kg.ts' />
var KG;
(function (KG) {
    KG.viewData = {};
    function addView(name, def) {
        KG.viewData[name] = def;
    }
    KG.addView = addView;
    var View = /** @class */ (function () {
        function View(div, data) {
            this.render(data, div);
        }
        View.prototype.parse = function (data, div) {
            if (data.hasOwnProperty('templateDefaults')) {
                // Any terms not defined in the user's overrides should revert to the template defaults
                var defaults = data.templateDefaults;
                var dataString = JSON.stringify(data);
                for (var key in defaults) {
                    var searchTerm = new RegExp("template.\\b" + key + "\\b", "g");
                    var replaceTerm = defaults[key];
                    dataString = dataString.replace(searchTerm, replaceTerm);
                }
                data = JSON.parse(dataString);
            }
            data.schema = data.schema || "Schema";
            // allow user to specify param overrides or select idioms in methods
            var urlParams = new URLSearchParams(window.location.search);
            // override params
            data.params = (data.params || []).map(function (paramData) {
                // allow author to override initial parameter values by specifying them as div attributes
                if (div.hasAttribute(paramData.name)) {
                    paramData.value = div.getAttribute(paramData.name);
                }
                // allow user to override parameter values by specifying them in the URL
                var urlParamValue = urlParams.get(paramData.name);
                /* console.log("Searching for ", paramData.name)
                if (urlParamValue) {
                    console.log(urlParamValue)
                } else {
                    console.log('not found')
                }*/
                if (urlParamValue) {
                    paramData.value = urlParamValue;
                }
                // convert boolean params from strings to numbers
                if (paramData.value == 'true') {
                    paramData.value = 1;
                }
                if (paramData.value == 'false') {
                    paramData.value = 0;
                }
                // convert numerical params from strings to numbers
                paramData.value = isNaN(+paramData.value) ? paramData.value : +paramData.value;
                return paramData;
            });
            // allow author to set clear color as div attribute
            if (div.hasAttribute("clearColor")) {
                data.clearColor = div.getAttribute("clearColor");
            }
            var parsedData = {
                templateDefaults: data.templateDefaults || {},
                aspectRatio: data.aspectRatio || 1,
                clearColor: data.clearColor || "#FFFFFF",
                params: data.params || [],
                calcs: data.calcs || {},
                colors: data.colors || {},
                custom: data.custom || "",
                idioms: {},
                restrictions: data.restrictions,
                clipPaths: data.clipPaths || [],
                markers: data.markers || [],
                scales: data.scales || [{
                        name: 'x',
                        axis: 'x',
                        rangeMin: 0,
                        rangeMax: 1,
                        domainMin: 0,
                        domainMax: 1
                    },
                    {
                        name: 'y',
                        axis: 'y',
                        rangeMin: 0,
                        rangeMax: 1,
                        domainMin: 0,
                        domainMax: 1
                    }],
                layers: data.layers || [[], [], [], []],
                divs: data.divs || []
            };
            data.objects = data.objects || [];
            if (data.hasOwnProperty('layout')) {
                if (data.layout.hasOwnProperty('type')) {
                    data.objects.push(data.layout);
                }
                else {
                    var layoutType = Object.keys(data.layout)[0], layoutDef = data.layout[layoutType];
                    data.objects.push({ type: layoutType, def: layoutDef });
                }
            }
            if (data.hasOwnProperty('explanation')) {
                data.objects.push({ type: "Explanation", def: data.explanation });
            }
            if (data.hasOwnProperty('schema')) {
                if (urlParams.get('custom')) {
                    parsedData.custom = urlParams.get('custom');
                }
                data.objects.push({ type: data.schema, def: { custom: parsedData.custom } });
            }
            console.log('parsed data: ', parsedData);
            return KGAuthor.parse(data.objects, parsedData);
        };
        View.prototype.render = function (data, div) {
            var view = this;
            var parsedData = view.parse(data, div);
            console.log('parsedData: ', parsedData);
            div.innerHTML = "";
            view.aspectRatio = data.aspectRatio || parsedData.aspectRatio || 1;
            view.model = new KG.Model(parsedData);
            // create scales
            view.scales = parsedData.scales.map(function (def) {
                def.model = view.model;
                return new KG.Scale(def);
            });
            // create the div for the view
            view.div = d3.select(div)
                .style('position', 'relative');
            // create a spacer div to make sure text flows properly around the graph
            view.svgContainerDiv = view.div.append('div')
                .style('position', 'absolute')
                .style('left', '0px')
                .style('top', '0px');
            // create the SVG element for the view
            if (!parsedData.nosvg) {
                view.svg = view.svgContainerDiv.append('svg')
                    .style('overflow', 'visible')
                    .style('pointer-events', 'none');
            }
            view.addViewObjects(parsedData);
            view.parsedData = parsedData;
        };
        // add view information (model, layer, scales) to an object
        View.prototype.addViewToDef = function (def, layer) {
            var view = this;
            function getScale(name) {
                var result = null;
                view.scales.forEach(function (scale) {
                    if (scale.name == name) {
                        result = scale;
                    }
                });
                return result;
            }
            def.model = view.model;
            def.layer = layer;
            def.xScale = getScale(def['xScaleName']);
            def.yScale = getScale(def['yScaleName']);
            if (def.hasOwnProperty('xScale2Name')) {
                def.xScale2 = getScale(def['xScale2Name']);
                def.yScale2 = getScale(def['yScale2Name']);
            }
            return def;
        };
        // create view objects
        View.prototype.addViewObjects = function (data) {
            var view = this;
            var defURLS = {};
            if (view.svg) {
                var defLayer_1 = view.svg.append('defs');
                // create ClipPaths, generate their URLs, and add their paths to the SVG defs element.
                if (data.clipPaths.length > 0) {
                    data.clipPaths.forEach(function (def) {
                        var clipPathURL = KG.randomString(10);
                        var clipPathLayer = defLayer_1.append('clipPath').attr('id', clipPathURL);
                        def.paths.forEach(function (td) {
                            td.def.inDef = true;
                            new KG[td.type](view.addViewToDef(td.def, clipPathLayer));
                        });
                        defURLS[def.name] = clipPathURL;
                    });
                }
                // create Markers, generate their URLs, and add their paths to the SVG defs element.
                if (data.markers.length > 0) {
                    data.markers.forEach(function (def) {
                        var markerURL = KG.randomString(10);
                        def.url = markerURL;
                        defURLS[def.name] = markerURL;
                        var markerLayer = defLayer_1.append('marker')
                            .attr('id', markerURL)
                            .attr("refX", def.refX)
                            .attr("refY", 6)
                            .attr("markerWidth", 13)
                            .attr("markerHeight", 13)
                            .attr("orient", "auto")
                            .attr("markerUnits", "userSpaceOnUse");
                        view.addViewToDef(def, markerLayer);
                        new KG.Marker(def);
                    });
                }
                // add layers of objects
                data.layers.forEach(function (layerTds) {
                    if (layerTds.length > 0) {
                        var layer_1 = view.svg.append('g');
                        layerTds.forEach(function (td) {
                            var def = td.def;
                            if (def.hasOwnProperty('clipPathName')) {
                                def.clipPath = defURLS[def['clipPathName']];
                            }
                            if (def.hasOwnProperty('clipPathName2')) {
                                def.clipPath2 = defURLS[def['clipPathName2']];
                            }
                            if (def.hasOwnProperty('startArrowName')) {
                                def.startArrow = defURLS[def['startArrowName']];
                            }
                            if (def.hasOwnProperty('endArrowName')) {
                                def.endArrow = defURLS[def['endArrowName']];
                            }
                            def = view.addViewToDef(def, layer_1);
                            new KG[td.type](def);
                        });
                    }
                });
            }
            // add divs
            if (data.divs.length > 0) {
                data.divs.forEach(function (td) {
                    var def = view.addViewToDef(td.def, view.div), newDiv = new KG[td.type](def);
                    if (td.type == 'Sidebar') {
                        view.sidebar = newDiv;
                    }
                    if (td.type == 'Explanation') {
                        view.explanation = newDiv;
                    }
                });
            }
            view.updateDimensions();
        };
        // update dimensions, either when first rendering or when the window is resized
        View.prototype.updateDimensions = function (printing) {
            var view = this;
            printing = !!printing;
            //console.log('printing is ', printing);
            var width = 0, height = 0, displayHeight = 0;
            if (printing) {
                width = 600;
                height = width / view.aspectRatio;
                displayHeight = height + 20;
            }
            else {
                // read the client width of the enclosing div and calculate the height using the aspectRatio
                var clientWidth = view.div.node().clientWidth;
                width = clientWidth - 10;
                height = width / view.aspectRatio;
                var sidebarHeight = 0, explanationHeight = 0;
                // position the sidebar to the right if the screen is wide enough, or below if it isn't
                if (view.sidebar) {
                    if (width > view.sidebar.triggerWidth) {
                        height = height * 77 / 126;
                        var s_height = void 0;
                        if (view.explanation) {
                            s_height = height + view.explanation.rootElement.node().clientHeight + 10;
                        }
                        else {
                            s_height = height;
                        }
                        view.sidebar.positionRight(width, s_height);
                        width = width * 77 / 126; // make width of graph the same width as main Tufte column
                    }
                    else {
                        view.sidebar.positionBelow(width, height);
                        sidebarHeight = view.sidebar.rootElement.node().clientHeight + 30;
                    }
                }
                // position the explanation below
                if (view.explanation) {
                    view.explanation.position(width, height + sidebarHeight + 10);
                    explanationHeight = view.explanation.rootElement.node().clientHeight + 20;
                }
                displayHeight = height + sidebarHeight + explanationHeight + 10;
            }
            view.div.style('height', displayHeight + 'px');
            // set the height of the div
            view.svgContainerDiv.style('width', width);
            view.svgContainerDiv.style('height', height);
            if (view.svg) {
                // set the dimensions of the svg
                view.svg.style('width', width);
                view.svg.style('height', height);
                view.svg.attr('width', width);
                view.svg.attr('height', height);
            }
            // adjust all of the scales to be proportional to the new dimensions
            view.scales.forEach(function (scale) {
                scale.updateDimensions(width, height);
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
    var Scale = /** @class */ (function (_super) {
        __extends(Scale, _super);
        function Scale(def) {
            var _this = this;
            KG.setDefaults(def, {
                log: false
            });
            def.constants = ['rangeMin', 'rangeMax', 'axis', 'name'];
            def.updatables = ['domainMin', 'domainMax', 'intercept'];
            _this = _super.call(this, def) || this;
            _this.scale = def.log ? d3.scaleLog() : d3.scaleLinear();
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
        Scale.prototype.updateDimensions = function (width, height) {
            var s = this;
            s.extent = (s.axis == 'x') ? width : height;
            return s.update(true);
        };
        return Scale;
    }(KG.UpdateListener));
    KG.Scale = Scale;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var ViewObject = /** @class */ (function (_super) {
        __extends(ViewObject, _super);
        function ViewObject(def) {
            var _this = this;
            KG.setDefaults(def, {
                alwaysUpdate: false,
                interactive: true,
                fill: 'colors.blue',
                fillOpacity: 0.2,
                stroke: 'colors.blue',
                strokeWidth: 1,
                stokeOpacity: 1,
                show: true,
                inDef: false,
                lineStyle: 'solid',
                checkOnGraph: true
            });
            KG.setProperties(def, 'updatables', ['xScaleMin', 'xScaleMax', 'yScaleMin', 'yScaleMax', 'fill', 'stroke', 'strokeWidth', 'opacity', 'strokeOpacity', 'show', 'lineStyle']);
            KG.setProperties(def, 'constants', ['xScale', 'yScale', 'clipPath', 'clipPath2', 'interactive', 'alwaysUpdate', 'inDef', 'checkOnGraph']);
            KG.setProperties(def, 'colorAttributes', ['stroke', 'fill', 'color']);
            if (def.inDef) {
                def.show = true;
            }
            _this = _super.call(this, def) || this;
            var vo = _this;
            if (vo.hasOwnProperty('xScale') && vo.xScale) {
                def.xScaleMin = vo.xScale.def.domainMin;
                def.xScaleMax = vo.xScale.def.domainMax;
                def.yScaleMin = vo.yScale.def.domainMin;
                def.yScaleMax = vo.yScale.def.domainMax;
            }
            def.colorAttributes.forEach(function (attr) {
                var c = def[attr];
                if (vo.model.colors.hasOwnProperty(c)) {
                    def[attr] = vo.model.colors[c];
                }
            });
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
                vo.draw(def.layer).update(true).init();
            }
            return _this;
        }
        ViewObject.prototype.init = function () {
            return this; //defined at subclass level
        };
        ViewObject.prototype.addClipPathAndArrows = function () {
            var vo = this;
            if (vo.hasOwnProperty('clipPath') && vo.clipPath != undefined) {
                vo.rootElement.attr('clip-path', "url(#".concat(vo.clipPath, ")"));
            }
            if (vo.hasOwnProperty('clipPath2') && vo.clipPath2 != undefined) {
                vo.rootElement2.attr('clip-path', "url(#".concat(vo.clipPath2, ")"));
            }
            if (vo.hasOwnProperty('endArrow') && vo.endArrow != undefined) {
                vo.markedElement.attr("marker-end", "url(#".concat(vo.endArrow, ")"));
            }
            if (vo.hasOwnProperty('startArrow') && vo.endArrow != undefined) {
                vo.markedElement.attr("marker-start", "url(#".concat(vo.startArrow, ")"));
            }
            return vo;
        };
        ViewObject.prototype.addInteraction = function () {
            var vo = this;
            vo.interactionHandler.addTrigger(vo.rootElement);
            return vo;
        };
        ViewObject.prototype.draw = function (layer, inDef) {
            return this;
        };
        ViewObject.prototype.redraw = function () {
            return this;
        };
        ViewObject.prototype.drawStroke = function (el) {
            var vo = this;
            el.attr('stroke', vo.stroke);
            el.attr('stroke-width', vo.strokeWidth);
            el.style('stroke-opacity', vo.strokeOpacity);
            if (vo.lineStyle == 'dashed') {
                el.style('stroke-dashArray', '10,10');
            }
            else if (vo.lineStyle == 'dotted') {
                el.style('stroke-dashArray', '1,2');
            }
            else {
                el.style('stroke-dashArray', '10,0');
            }
        };
        ViewObject.prototype.drawFill = function (el) {
            var vo = this;
            el.style('fill', vo.fill);
            el.style('fill-opacity', vo.opacity);
        };
        ViewObject.prototype.displayElement = function (show) {
            var vo = this;
            if (vo.hasOwnProperty('rootElement')) {
                vo.rootElement.style('display', show ? null : 'none');
            }
        };
        ViewObject.prototype.onGraph = function () {
            var vo = this;
            if (vo.checkOnGraph) {
                var notBetween = function (x, a, b) {
                    var min = Math.min(a, b);
                    var max = Math.max(a, b);
                    return ((x < min) || (x > max));
                };
                if (vo.hasOwnProperty('x')) {
                    if (notBetween(vo.x, vo.xScale.domainMin, vo.xScale.domainMax)) {
                        return false;
                    }
                }
                if (vo.hasOwnProperty('y')) {
                    if (notBetween(vo.y, vo.yScale.domainMin, vo.yScale.domainMax)) {
                        return false;
                    }
                }
            }
            return true;
        };
        ViewObject.prototype.update = function (force) {
            var vo = _super.prototype.update.call(this, force);
            if ((vo.show && vo.onGraph()) || vo.inDef) {
                vo.displayElement(true);
                if (vo.hasChanged) {
                    vo.redraw();
                }
            }
            else {
                vo.displayElement(false);
            }
            return vo;
        };
        return ViewObject;
    }(KG.UpdateListener));
    KG.ViewObject = ViewObject;
})(KG || (KG = {}));
var KG;
(function (KG) {
    var Marker = /** @class */ (function (_super) {
        __extends(Marker, _super);
        function Marker(def) {
            KG.setProperties(def, 'constants', ['maskPath', 'arrowPath']);
            KG.setProperties(def, 'updatables', ['color']);
            return _super.call(this, def) || this;
        }
        Marker.prototype.draw = function (layer) {
            var m = this;
            layer.append("svg:path")
                .attr("d", m.maskPath)
                .attr("fill", "white");
            m.arrowElement = layer.append("svg:path")
                .attr("d", m.arrowPath);
            return m;
        };
        Marker.prototype.redraw = function () {
            var m = this;
            m.arrowElement.attr("fill", m.color);
            return m;
        };
        return Marker;
    }(KG.ViewObject));
    KG.Marker = Marker;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Segment = /** @class */ (function (_super) {
        __extends(Segment, _super);
        function Segment(def) {
            KG.setDefaults(def, {
                xScale2: def.xScale,
                yScale2: def.yScale,
                strokeWidth: 2
            });
            KG.setProperties(def, 'constants', ['xScale2', 'yScale2', 'startArrow', 'endArrow']);
            KG.setProperties(def, 'updatables', ['x1', 'y1', 'x2', 'y2']);
            return _super.call(this, def) || this;
        }
        // create SVG elements
        Segment.prototype.draw = function (layer) {
            var segment = this;
            segment.rootElement = layer.append('g');
            segment.dragLine = segment.rootElement.append('line').attr('stroke-width', '20px').style('stroke-opacity', 0);
            segment.line = segment.rootElement.append('line');
            segment.markedElement = segment.line;
            return segment.addClipPathAndArrows().addInteraction();
        };
        // update properties
        Segment.prototype.redraw = function () {
            var segment = this;
            var x1 = segment.xScale.scale(segment.x1), x2 = segment.xScale.scale(segment.x2), y1 = segment.yScale2.scale(segment.y1), y2 = segment.yScale2.scale(segment.y2);
            segment.dragLine
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2);
            segment.line
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2);
            segment.drawStroke(segment.line);
            return segment;
        };
        return Segment;
    }(KG.ViewObject));
    KG.Segment = Segment;
})(KG || (KG = {}));
/// <reference path='../../kg.ts' />
var KG;
(function (KG) {
    var Curve = /** @class */ (function (_super) {
        __extends(Curve, _super);
        function Curve(def) {
            var _this = this;
            var univariateFunction, parametricFunction;
            KG.setDefaults(def, {
                interpolation: 'curveBasis',
                strokeWidth: 2
            });
            KG.setProperties(def, 'constants', ['interpolation']);
            if (def.hasOwnProperty('univariateFunction')) {
                def.univariateFunction.model = def.model;
                univariateFunction = new KG.UnivariateFunction(def.univariateFunction);
                KG.setProperties(def, 'updatables', []);
            }
            else if (def.hasOwnProperty('parametricFunction')) {
                def.parametricFunction.model = def.model;
                parametricFunction = new KG.ParametricFunction(def.parametricFunction);
                KG.setProperties(def, 'updatables', []);
            }
            _this = _super.call(this, def) || this;
            var curve = _this;
            if (def.hasOwnProperty('univariateFunction')) {
                curve.univariateFunction = univariateFunction;
            }
            else if (def.hasOwnProperty('parametricFunction')) {
                def.parametricFunction.model = def.model;
                curve.parametricFunction = parametricFunction;
            }
            return _this;
        }
        // create SVG elements
        Curve.prototype.draw = function (layer) {
            var curve = this;
            curve.dataLine = d3.line()
                .curve(d3[curve.interpolation])
                .x(function (d) {
                return curve.xScale.scale(d.x);
            })
                .y(function (d) {
                return curve.yScale.scale(d.y);
            });
            curve.rootElement = layer.append('g');
            curve.dragPath = curve.rootElement.append('path').attr('stroke-width', '20px').style('stroke-opacity', 0).style('fill', 'none');
            curve.path = curve.rootElement.append('path').style('fill', 'none');
            return curve.addClipPathAndArrows().addInteraction();
        };
        // update properties
        Curve.prototype.redraw = function () {
            var curve = this;
            if (curve.hasOwnProperty('univariateFunction')) {
                var fn = curve.univariateFunction, scale = fn.ind == 'y' ? curve.yScale : curve.xScale;
                fn.generateData(scale.domainMin, scale.domainMax);
                curve.dragPath.data([fn.data]).attr('d', curve.dataLine);
                curve.path.data([fn.data]).attr('d', curve.dataLine);
            }
            if (curve.hasOwnProperty('parametricFunction')) {
                var fn = curve.parametricFunction;
                fn.generateData();
                curve.dragPath.data([fn.data]).attr('d', curve.dataLine);
                curve.path.data([fn.data]).attr('d', curve.dataLine);
            }
            curve.drawStroke(curve.path);
            return curve;
        };
        // update self and functions
        Curve.prototype.update = function (force) {
            var curve = _super.prototype.update.call(this, force);
            if (!curve.hasChanged) {
                if (curve.hasOwnProperty('univariateFunction')) {
                    if (curve.univariateFunction.hasChanged) {
                        curve.redraw();
                    }
                }
                if (curve.hasOwnProperty('parametricFunction')) {
                    if (curve.parametricFunction.hasChanged) {
                        curve.redraw();
                    }
                }
            }
            return curve;
        };
        return Curve;
    }(KG.ViewObject));
    KG.Curve = Curve;
})(KG || (KG = {}));
var KG;
(function (KG) {
    var Axis = /** @class */ (function (_super) {
        __extends(Axis, _super);
        function Axis(def) {
            KG.setDefaults(def, {
                ticks: 5,
                intercept: 0
            });
            KG.setProperties(def, 'constants', ['orient']);
            KG.setProperties(def, 'updatables', ['ticks', 'intercept', 'label', 'min', 'max', 'otherMin', 'otherMax', 'tickPrepend', 'tickPrecision', 'tickValues']);
            return _super.call(this, def) || this;
        }
        Axis.prototype.draw = function (layer) {
            var a = this;
            a.rootElement = layer.append('g').attr('class', 'axis');
            return a;
        };
        Axis.prototype.redraw = function () {
            var a = this;
            function formatTick(d) {
                if (a.tickPrecision) {
                    d = d.toFixed(a.tickPrecision);
                }
                if (a.tickPrepend) {
                    return "".concat(a.tickPrepend).concat(d);
                }
                else {
                    return d;
                }
            }
            switch (a.orient) {
                case 'bottom':
                    a.rootElement.attr('transform', "translate(0, ".concat(a.yScale.scale(a.intercept), ")"));
                    if (a.tickValues) {
                        a.rootElement.call(d3.axisBottom(a.xScale.scale).tickValues(a.tickValues).tickFormat(formatTick));
                    }
                    else {
                        a.rootElement.call(d3.axisBottom(a.xScale.scale).ticks(a.ticks).tickFormat(formatTick));
                    }
                    return a;
                case 'left':
                    a.rootElement.attr('transform', "translate(".concat(a.xScale.scale(a.intercept), ",0)"));
                    if (a.tickValues) {
                        a.rootElement.call(d3.axisLeft(a.yScale.scale).tickValues(a.tickValues).tickFormat(formatTick));
                    }
                    else {
                        a.rootElement.call(d3.axisLeft(a.yScale.scale).ticks(a.ticks).tickFormat(formatTick));
                    }
                    return a;
                case 'top':
                    a.rootElement.attr('transform', "translate(0, ".concat(a.yScale.scale(a.intercept), ")"));
                    if (a.tickValues) {
                        a.rootElement.call(d3.axisTop(a.xScale.scale).tickValues(a.tickValues).tickFormat(formatTick));
                    }
                    else {
                        a.rootElement.call(d3.axisTop(a.xScale.scale).ticks(a.ticks).tickFormat(formatTick));
                    }
                    return a;
                case 'right':
                    a.rootElement.attr('transform', "translate(".concat(a.xScale.scale(a.intercept), ",0)"));
                    if (a.tickValues) {
                        a.rootElement.call(d3.axisRight(a.yScale.scale).tickValues(a.tickValues).tickFormat(formatTick));
                    }
                    else {
                        a.rootElement.call(d3.axisRight(a.yScale.scale).ticks(a.ticks).tickFormat(formatTick));
                    }
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
    var Point = /** @class */ (function (_super) {
        __extends(Point, _super);
        function Point(def) {
            KG.setDefaults(def, {
                fill: 'colors.blue',
                opacity: 1,
                stroke: 'white',
                strokeWidth: 1,
                strokeOpacity: 1,
                r: 6
            });
            KG.setProperties(def, 'updatables', ['x', 'y', 'r']);
            return _super.call(this, def) || this;
        }
        // create SVG elements
        Point.prototype.draw = function (layer) {
            var p = this;
            p.rootElement = layer.append('g'); // SVG group
            p.dragCircle = p.rootElement.append('circle').style('fill-opacity', 0).attr('r', 20);
            p.circle = p.rootElement.append('circle');
            //p.addClipPathAndArrows()
            return p.addInteraction();
        };
        // update properties
        Point.prototype.redraw = function () {
            var p = this;
            p.rootElement.attr('transform', "translate(".concat(p.xScale.scale(p.x), " ").concat(p.yScale.scale(p.y), ")"));
            p.circle.attr('r', p.r);
            p.circle.style('fill', p.fill);
            p.circle.style('fill-opacity', p.opacity);
            p.circle.style('stroke', p.stroke);
            p.circle.style('stroke-width', "".concat(p.strokeWidth, "px"));
            p.circle.style('stroke-opacity', p.strokeOpacity);
            return p;
        };
        return Point;
    }(KG.ViewObject));
    KG.Point = Point;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Ellipse = /** @class */ (function (_super) {
        __extends(Ellipse, _super);
        function Ellipse(def) {
            KG.setDefaults(def, {
                fill: 'colors.blue',
                opacity: 1,
                stroke: 'colors.blue',
                strokeWidth: 1,
                strokeOpacity: 1,
                rx: 1,
                ry: 1,
                checkOnGraph: false
            });
            KG.setProperties(def, 'updatables', ['x', 'y', 'rx', 'ry']);
            return _super.call(this, def) || this;
        }
        // create SVG elements
        Ellipse.prototype.draw = function (layer) {
            var c = this;
            c.rootElement = layer.append('ellipse');
            return c.addClipPathAndArrows().addInteraction();
        };
        // update properties
        Ellipse.prototype.redraw = function () {
            var c = this;
            c.rootElement.attr('cx', c.xScale.scale(c.x));
            c.rootElement.attr('cy', c.yScale.scale(c.y));
            c.rootElement.attr('rx', Math.abs(c.xScale.scale(c.rx) - c.xScale.scale(0)));
            c.rootElement.attr('ry', Math.abs(c.yScale.scale(c.ry) - c.yScale.scale(0)));
            c.drawFill(c.rootElement);
            c.drawStroke(c.rootElement);
            return c;
        };
        return Ellipse;
    }(KG.ViewObject));
    KG.Ellipse = Ellipse;
    var Circle = /** @class */ (function (_super) {
        __extends(Circle, _super);
        function Circle(def) {
            return _super.call(this, def) || this;
        }
        return Circle;
    }(Ellipse));
    KG.Circle = Circle;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Rectangle = /** @class */ (function (_super) {
        __extends(Rectangle, _super);
        function Rectangle(def) {
            KG.setDefaults(def, {
                opacity: 0.2,
                stroke: "none"
            });
            KG.setProperties(def, 'updatables', ['x1', 'x2', 'y1', 'y2']);
            return _super.call(this, def) || this;
        }
        // create SVG elements
        Rectangle.prototype.draw = function (layer) {
            var rect = this;
            if (rect.inDef) {
                rect.rootElement = layer;
            }
            else {
                rect.rootElement = layer.append('g');
            }
            rect.rootElement2 = rect.rootElement.append('rect');
            //rect.interactionHandler.addTrigger(rect.rootElement);
            return rect.addClipPathAndArrows().addInteraction();
        };
        // update properties
        Rectangle.prototype.redraw = function () {
            var rect = this;
            var x1 = rect.xScale.scale(rect.x1);
            var y1 = rect.yScale.scale(rect.y1);
            var x2 = rect.xScale.scale(rect.x2);
            var y2 = rect.yScale.scale(rect.y2);
            rect.rootElement2
                .attr('x', Math.min(x1, x2))
                .attr('y', Math.min(y1, y2))
                .attr('width', Math.abs(x2 - x1))
                .attr('height', Math.abs(y2 - y1))
                .style('fill', rect.fill)
                .style('fill-opacity', rect.opacity)
                .style('stroke', rect.stroke)
                .style('stroke-width', "".concat(rect.strokeWidth, "px"))
                .style('stroke-opacity', rect.strokeOpacity);
            return rect;
        };
        return Rectangle;
    }(KG.ViewObject));
    KG.Rectangle = Rectangle;
})(KG || (KG = {}));
/// <reference path='../../kg.ts' />
var KG;
(function (KG) {
    var Area = /** @class */ (function (_super) {
        __extends(Area, _super);
        function Area(def) {
            var _this = this;
            var minValue = def.univariateFunction1.ind == 'x' ? def.yScale.domainMin : def.xScale.domainMin;
            var maxValue = def.univariateFunction1.ind == 'x' ? def.yScale.domainMax : def.xScale.domainMax;
            KG.setDefaults(def, {
                interpolation: 'curveBasis',
                ind: 'x',
                fill: 'lightsteelblue',
                opacity: 0.2,
                univariateFunction2: {
                    "fn": ((def.above && !def.useTopScale) || (!def.above && def.useTopScale)) ? maxValue : minValue,
                    "ind": def.univariateFunction1['ind'],
                    "min": def.univariateFunction1['min'],
                    "max": def.univariateFunction1['max'],
                    "samplePoints": def.univariateFunction1['samplePoints']
                }
            });
            KG.setProperties(def, 'constants', ['interpolation']);
            def.univariateFunction1.model = def.model;
            def.univariateFunction2.model = def.model;
            // need to initialize the functions before the area, so they exist when it's time to draw the area
            var univariateFunction1 = new KG.UnivariateFunction(def.univariateFunction1), univariateFunction2 = new KG.UnivariateFunction(def.univariateFunction2);
            _this = _super.call(this, def) || this;
            _this.univariateFunction1 = univariateFunction1;
            _this.univariateFunction2 = univariateFunction2;
            return _this;
        }
        // create SVG elements
        Area.prototype.draw = function (layer) {
            var ab = this;
            ab.rootElement = layer.append('path');
            ab.areaShape = d3.area()
                .x0(function (d) {
                return ab.xScale.scale(d[0].x);
            })
                .y0(function (d) {
                return ab.yScale.scale(d[0].y);
            })
                .x1(function (d) {
                return ab.xScale.scale(d[1].x);
            })
                .y1(function (d) {
                return ab.yScale.scale(d[1].y);
            });
            ab.areaPath = ab.rootElement;
            return ab.addClipPathAndArrows();
        };
        // update properties
        Area.prototype.redraw = function () {
            var area = this;
            if (area.univariateFunction1 != undefined && area.univariateFunction2 != undefined) {
                var fn1 = area.univariateFunction1, fn2 = area.univariateFunction2, scale = fn1.ind == 'y' ? area.yScale : area.xScale;
                fn1.generateData(scale.domainMin, scale.domainMax);
                fn2.generateData(scale.domainMin, scale.domainMax);
                area.areaPath
                    .data([d3.zip(fn1.data, fn2.data)])
                    .attr('d', area.areaShape);
                area.drawFill(area.areaPath);
            }
            else {
                //console.log('area functions undefined')
            }
            return area;
        };
        // update self and functions
        Area.prototype.update = function (force) {
            var area = _super.prototype.update.call(this, force);
            if (!area.hasChanged) {
                if (area.univariateFunction1.hasChanged || area.univariateFunction2.hasChanged) {
                    area.redraw();
                }
            }
            return area;
        };
        return Area;
    }(KG.ViewObject));
    KG.Area = Area;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var GeoGebraObject = /** @class */ (function (_super) {
        __extends(GeoGebraObject, _super);
        function GeoGebraObject(def) {
            KG.setDefaults(def, {
                color: '#999999',
                lineThickness: 1,
                lineStyle: 0
            });
            KG.setProperties(def, 'constants', ['command', 'color', 'lineThickness', 'lineStyle']);
            return _super.call(this, def) || this;
        }
        GeoGebraObject.prototype.establishGGB = function (applet) {
            // from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
            function hexToRgb(hex) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            }
            var obj = this;
            //console.log('sending commands to applet', applet);
            // set command
            var command = obj.name + " = " + obj.command;
            //console.log('sending command ', obj.name + " = " + obj.command);
            applet.evalCommand(command);
            if (obj.hasOwnProperty('opacity')) {
                applet.setFilling(obj.opacity);
            }
            var color = hexToRgb(obj.color);
            //console.log('sending command setColor(', obj.name, ', ', color.r, ',', color.g, ', ', color.b, ')');
            applet.setColor(obj.name, color.r, color.g, color.b);
            //console.log('sending command setLineThickness(', obj.name, ', ', obj.lineThickness, ')')
            applet.evalCommand('SetLineThickness[' + obj.name + ', ' + obj.lineThickness + ']');
            //console.log('sending command setLineStyle(', obj.name, ', ', obj.lineStyle, ')')
            applet.setLineStyle(obj.name, obj.lineStyle);
        };
        return GeoGebraObject;
    }(KG.ViewObject));
    KG.GeoGebraObject = GeoGebraObject;
})(KG || (KG = {}));
/// <reference path='../../kg.ts' />
var KG;
(function (KG) {
    var Contour = /** @class */ (function (_super) {
        __extends(Contour, _super);
        function Contour(def) {
            var _this = this;
            KG.setDefaults(def, {
                opacity: 0.2,
                stroke: "grey",
                fillAbove: "none",
                fillBelow: "none",
                strokeOpacity: 1
            });
            KG.setProperties(def, 'colorAttributes', ['fillAbove', 'fillBelow']);
            KG.setProperties(def, 'updatables', ['level', 'fillBelow', 'fillAbove', 'xMin', 'xMax', 'yMin', 'yMax']);
            _this = _super.call(this, def) || this;
            // used for shading area above
            _this.fn = new KG.MultivariateFunction({
                fn: def.fn,
                model: def.model
            }).update(true);
            // used for shading area below
            _this.negativeFn = new KG.MultivariateFunction({
                fn: "-1*(".concat(def.fn, ")"),
                model: def.model
            }).update(true);
            return _this;
        }
        Contour.prototype.draw = function (layer) {
            var c = this;
            if (c.inDef) {
                c.rootElement = layer.append('path');
                c.path = c.rootElement;
            }
            else {
                c.rootElement = layer.append('g');
                c.negativePath = c.rootElement.append('path');
                c.path = c.rootElement.append('path');
            }
            return c.addClipPathAndArrows();
        };
        Contour.prototype.redraw = function () {
            var c = this;
            if (undefined != c.fn) {
                var bounds_1 = {};
                ['xMin', 'xMax', 'yMin', 'yMax'].forEach(function (p) {
                    if (c.hasOwnProperty(p) && c[p] != undefined) {
                        bounds_1[p] = c[p];
                    }
                });
                c.path.attr("d", c.fn.contour(c.level, c.xScale, c.yScale, {
                    xMin: c.xMin,
                    xMax: c.xMax,
                    yMin: c.yMin,
                    yMax: c.yMax
                }));
                if (!c.inDef) {
                    c.path.style('fill', c.fillAbove);
                    c.path.style('fill-opacity', c.opacity);
                    c.path.style('stroke', c.stroke);
                    c.path.style('stroke-width', c.strokeWidth);
                    c.path.style('stroke-opacity', c.strokeOpacity);
                    c.negativePath.attr("d", c.negativeFn.contour(-1 * c.level, c.xScale, c.yScale));
                    c.negativePath.style('fill', c.fillBelow);
                    c.negativePath.style('fill-opacity', c.opacity);
                }
            }
            return c;
        };
        // update self and functions
        Contour.prototype.update = function (force) {
            var c = _super.prototype.update.call(this, force);
            if (!c.hasChanged) {
                if (c.fn.hasChanged) {
                    c.redraw();
                }
            }
            return c;
        };
        return Contour;
    }(KG.ViewObject));
    KG.Contour = Contour;
    var ContourMap = /** @class */ (function (_super) {
        __extends(ContourMap, _super);
        function ContourMap(def) {
            return _super.call(this, def) || this;
        }
        return ContourMap;
    }(KG.ViewObject));
    KG.ContourMap = ContourMap;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Label = /** @class */ (function (_super) {
        __extends(Label, _super);
        function Label(def) {
            var _this = this;
            var xAxisReversed = (def.xScale.rangeMin > def.xScale.rangeMax), yAxisReversed = (def.yScale.rangeMin < def.yScale.rangeMax);
            var xOffset = xAxisReversed ? 1 : -1, yOffset = yAxisReversed ? 12 : -12;
            if (def.x == 'AXIS') {
                def.x = def.yScale.intercept;
                def.align = xAxisReversed ? 'left' : 'right';
                def.xPixelOffset = xOffset;
            }
            if (def.x == 'OPPAXIS') {
                def.x = def.xScale.domainMax;
                def.align = xAxisReversed ? 'right' : 'left';
                def.xPixelOffset = -xOffset;
            }
            if (def.y == 'AXIS') {
                def.y = def.yScale.intercept;
                def.yPixelOffset = yOffset;
            }
            if (def.y == 'OPPAXIS') {
                def.y = def.yScale.domainMax;
                def.yPixelOffset = -yOffset;
            }
            //establish property defaults
            KG.setDefaults(def, {
                xPixelOffset: 0,
                yPixelOffset: 0,
                fontSize: 12,
                align: 'center',
                valign: 'middle',
                rotate: 0,
                color: 'black'
            });
            // define constant and updatable properties
            KG.setProperties(def, 'constants', ['xPixelOffset', 'yPixelOffset', 'fontSize', 'plainText']);
            KG.setProperties(def, 'updatables', ['x', 'y', 'text', 'align', 'valign', 'rotate', 'color', 'bgcolor']);
            _this = _super.call(this, def) || this;
            _this.bgcolor = def.model.clearColor;
            return _this;
        }
        // create div for text
        Label.prototype.draw = function (layer) {
            var label = this;
            label.rootElement = layer.append('div')
                .attr('class', 'draggable')
                .style('position', 'absolute')
                .style('font-size', label.fontSize + 'pt')
                .style('text-align', 'center')
                .style('padding-left', '3px')
                .style('padding-right', '3px');
            return label.addInteraction();
        };
        // update properties
        Label.prototype.redraw = function () {
            var label = this;
            label.rootElement.style('color', label.color).style('background-color', label.bgcolor);
            var x = label.xScale.scale(label.x) + (+label.xPixelOffset), y = label.yScale.scale(label.y) - (+label.yPixelOffset);
            if (undefined != label.text) {
                if (label.plainText) {
                    //console.log('rendering label as plain text: ', label.text)
                    label.rootElement.text(label.text);
                }
                else {
                    //console.log('rendering label as LaTeX: ', label.text)
                    try {
                        katex.render(label.text.toString(), label.rootElement.node());
                    }
                    catch (e) {
                        console.log("Error rendering KaTeX: ", label.text);
                    }
                }
            }
            label.rootElement.style('left', x + 'px');
            label.rootElement.style('top', y + 'px');
            var width = label.rootElement.node().clientWidth, height = label.rootElement.node().clientHeight;
            // Set left pixel margin; default to centered on x coordinate
            var alignDelta = width * 0.5;
            if (label.align == 'left') {
                alignDelta = 0;
            }
            else if (label.align == 'right') {
                // move left by half the width of the div if right aligned
                alignDelta = width;
            }
            label.rootElement.style('left', (x - alignDelta) + 'px');
            // Set top pixel margin; default to centered on y coordinate
            var vAlignDelta = height * 0.5;
            // Default to centered on x coordinate
            if (label.valign == 'top') {
                vAlignDelta = 0;
            }
            else if (label.valign == 'bottom') {
                vAlignDelta = height;
            }
            label.rootElement.style('top', (y - vAlignDelta) + 'px');
            var rotate = "rotate(-".concat(label.rotate, "deg)");
            label.rootElement.style('-webkit-transform', rotate)
                .style('transform', rotate);
            return label;
        };
        return Label;
    }(KG.ViewObject));
    KG.Label = Label;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var DivObject = /** @class */ (function (_super) {
        __extends(DivObject, _super);
        function DivObject() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DivObject.prototype.redraw = function () {
            var div = this;
            var width = Math.abs(div.xScale.scale(1) - div.xScale.scale(0)), height = Math.abs(div.yScale.scale(1) - div.yScale.scale(0));
            div.rootElement.style('left', div.xScale.scale(0) + 'px');
            div.rootElement.style('top', div.yScale.scale(1) + 'px');
            div.rootElement.style('width', width + 'px');
            div.rootElement.style('height', height + 'px');
            return div;
        };
        return DivObject;
    }(KG.ViewObject));
    KG.DivObject = DivObject;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var PositionedDiv = /** @class */ (function (_super) {
        __extends(PositionedDiv, _super);
        function PositionedDiv() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PositionedDiv.prototype.draw = function (layer) {
            var div = this;
            div.rootElement = layer.append('div');
            div.rootElement.style('position', 'absolute');
            if (div.def.hasOwnProperty('children')) {
                div.def['children'].forEach(function (child) {
                    child.def.layer = div.rootElement;
                    child.def.model = div.model;
                    new KG[child.type](child.def);
                });
            }
            return div;
        };
        PositionedDiv.prototype.redraw = function () {
            var div = this;
            var width = Math.abs(div.xScale.scale(1) - div.xScale.scale(0)), height = Math.abs(div.yScale.scale(1) - div.yScale.scale(0));
            div.rootElement.style('left', div.xScale.scale(0) + 'px');
            div.rootElement.style('top', div.yScale.scale(1) + 'px');
            div.rootElement.style('width', width + 'px');
            div.rootElement.style('height', height + 'px');
            return div;
        };
        return PositionedDiv;
    }(KG.DivObject));
    KG.PositionedDiv = PositionedDiv;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Div = /** @class */ (function (_super) {
        __extends(Div, _super);
        function Div(def) {
            //establish property defaults
            KG.setDefaults(def, {
                xPixelOffset: 0,
                yPixelOffset: 0,
                fontSize: 12
            });
            // define constant and updatable properties
            KG.setProperties(def, 'constants', ['fontSize']);
            KG.setProperties(def, 'updatables', ['html']);
            return _super.call(this, def) || this;
        }
        // create div for text
        Div.prototype.draw = function (layer) {
            var div = this;
            div.rootElement = layer.append('div')
                .style('font-size', div.fontSize + 'pt')
                .style('padding-top', '2px')
                .style('padding-bottom', '2px');
            return div;
        };
        // update properties
        Div.prototype.redraw = function () {
            var div = this;
            if (div.show) {
                div.rootElement.html(div.html);
                renderMathInElement(div.rootElement.node(), {
                    delimiters: [
                        { left: "$$", right: "$$", display: true },
                        { left: "\\[", right: "\\]", display: true },
                        { left: "$", right: "$", display: false },
                        { left: "\\(", right: "\\)", display: false }
                    ]
                });
            }
            else {
                div.rootElement.html(null);
            }
            return div;
        };
        return Div;
    }(KG.DivObject));
    KG.Div = Div;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var ParamControl = /** @class */ (function (_super) {
        __extends(ParamControl, _super);
        function ParamControl(def) {
            // establish property defaults
            KG.setDefaults(def, {
                value: 'params.' + def.param,
                alwaysUpdate: true,
                plainText: false
            });
            // define constant and updatable properties
            KG.setProperties(def, 'constants', ['param', 'plainText']);
            KG.setProperties(def, 'updatables', ['label', 'value']);
            return _super.call(this, def) || this;
        }
        return ParamControl;
    }(KG.DivObject));
    KG.ParamControl = ParamControl;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Slider = /** @class */ (function (_super) {
        __extends(Slider, _super);
        function Slider(def) {
            var _this = this;
            // establish property defaults
            KG.setDefaults(def, {
                noAxis: false,
                showNumber: true
            });
            // define constant and updatable properties
            KG.setProperties(def, 'constants', ['noAxis', 'label', 'digits']);
            KG.setProperties(def, 'updatables', ['showNumber']);
            _this = _super.call(this, def) || this;
            // calculate maximum number of digits
            var slider = _this;
            var paramObject = slider.model.getParam(slider.param);
            // number of digits for decimals
            var decimalPlaces = paramObject.precision;
            function maxMinDigits(x) {
                if (x > 0) {
                    return Math.trunc(Math.log10(x) + 1);
                }
                else {
                    return Math.trunc(Math.log10(-1 * x) + 2);
                }
            }
            // number of digits for minimum
            slider.digits = Math.max(maxMinDigits(paramObject.min), maxMinDigits(paramObject.max)) + decimalPlaces;
            return _this;
        }
        Slider.prototype.draw = function (layer) {
            var slider = this;
            slider.rootElement = layer.append('tr');
            var param = slider.model.getParam(slider.param);
            slider.labelElement = slider.rootElement.append('td')
                .attr('class', 'slider-label');
            slider.labelElementSpan = slider.labelElement.append('span').style('white-space', 'nowrap');
            function inputUpdate() {
                slider.model.updateParam(slider.param, +this.value);
            }
            slider.numberCell = slider.rootElement.append('td')
                .style('padding', '0px')
                .style('margin', '0px')
                .style('border', 'none');
            slider.numberInput = slider.numberCell.append('input')
                .attr('type', 'number')
                .attr('min', param.min)
                .attr('max', param.max)
                .attr('step', param.round)
                .attr('class', 'slider-numberInput');
            slider.numberInput.on("blur", inputUpdate);
            slider.numberInput.on("click", inputUpdate);
            slider.numberInput.on("keyup", function () {
                if (event['keyCode'] == 13) {
                    slider.model.updateParam(slider.param, +this.value);
                }
            });
            var rangeCell = slider.rootElement.append('td')
                .style('padding', '0px')
                .style('margin', '0px')
                .style('border', 'none');
            slider.rangeInput = rangeCell.append('input')
                .attr('type', 'range')
                .attr('min', param.min)
                .attr('max', param.max)
                .attr('step', param.round)
                .style('padding', '0px')
                .style('width', '100%')
                .style('margin', '0px');
            slider.rangeInput.on("input", inputUpdate);
            return slider;
        };
        // update properties
        Slider.prototype.redraw = function () {
            var slider = this;
            if (slider.showNumber) {
                if (slider.plainText) {
                    slider.labelElementSpan.text(slider.label + ' = ');
                }
                else {
                    katex.render("".concat(slider.label, " = "), slider.labelElement.node());
                }
                slider.numberInput.property('value', slider.value.toFixed(slider.model.getParam(slider.param).precision));
                slider.numberInput.style('width', "".concat(20 + slider.digits * 10, "px"));
                slider.numberInput.style('display', 'inline-block');
            }
            else {
                if (slider.plainText) {
                    slider.labelElementSpan.text(slider.label);
                }
                else {
                    katex.render(slider.label, slider.labelElement.node());
                }
                slider.numberCell.style('width', '10px');
                slider.numberInput.style('display', 'none');
            }
            slider.rangeInput.property('value', slider.value);
            return slider;
        };
        return Slider;
    }(KG.ParamControl));
    KG.Slider = Slider;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Checkbox = /** @class */ (function (_super) {
        __extends(Checkbox, _super);
        function Checkbox() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Checkbox.prototype.draw = function (layer) {
            var checkbox = this;
            checkbox.rootElement = layer.append('div').append('label');
            checkbox.inputElement = checkbox.rootElement.append('input');
            checkbox.inputElement
                .attr('type', 'checkbox');
            checkbox.inputElement.on("change", function () {
                checkbox.model.toggleParam(checkbox.param);
            });
            checkbox.labelElement = checkbox.rootElement.append('span');
            checkbox.labelElement.style('padding-left', '10px').attr('class', 'checkbox-label');
            return checkbox;
        };
        Checkbox.prototype.redraw = function () {
            var checkbox = this;
            if (checkbox.plainText) {
                console.log('checkbox is plain text');
                checkbox.labelElement.text(checkbox.label);
            }
            else {
                katex.render(checkbox.label, checkbox.labelElement.node());
            }
            checkbox.inputElement.property('checked', Boolean(checkbox.value));
            return checkbox;
        };
        return Checkbox;
    }(KG.ParamControl));
    KG.Checkbox = Checkbox;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Radio = /** @class */ (function (_super) {
        __extends(Radio, _super);
        function Radio(def) {
            KG.setProperties(def, 'constants', ['figure_id']);
            KG.setProperties(def, 'updatables', ['optionValue']);
            return _super.call(this, def) || this;
        }
        Radio.prototype.draw = function (layer) {
            var radio = this;
            radio.rootElement = layer.append('div').append('label');
            radio.inputElement = radio.rootElement.append('input');
            radio.inputElement
                .attr('type', 'radio')
                .attr('name', radio.figure_id + '_' + radio.param)
                .attr('value', radio.optionValue);
            radio.inputElement.on("change", function () {
                radio.model.updateParam(radio.param, radio.optionValue);
            });
            radio.labelElement = radio.rootElement.append('span');
            radio.labelElement.style('padding-left', '10px');
            return radio;
        };
        Radio.prototype.redraw = function () {
            var radio = this;
            radio.inputElement.property('checked', radio.value == radio.optionValue);
            katex.render(radio.label, radio.labelElement.node());
            return radio;
        };
        return Radio;
    }(KG.ParamControl));
    KG.Radio = Radio;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Controls = /** @class */ (function (_super) {
        __extends(Controls, _super);
        function Controls(def) {
            KG.setDefaults(def, {
                title: '',
                description: '',
                sliders: [],
                checkboxes: [],
                radios: [],
                divs: []
            });
            KG.setProperties(def, 'constants', ['sliders', 'checkboxes', 'radios', 'divs']);
            KG.setProperties(def, 'updatables', ['title', 'description']);
            return _super.call(this, def) || this;
        }
        // create div for text
        Controls.prototype.draw = function (layer) {
            var controls = this;
            var controls_id = KG.randomString(5);
            controls.rootElement = layer.append('div').style('padding-top', '10px').style('padding-bottom', '10px');
            controls.titleElement = controls.rootElement.append('div').style('font-size', '10pt').style('padding-bottom', 10);
            controls.rootElement.append('hr');
            controls.descriptionElement = controls.rootElement.append('div');
            controls.descriptionElement.style('margin-bottom', '10px');
            if (controls.sliders.length > 0) {
                var sliderTable_1 = controls.rootElement.append('table').style('padding', '10px').style('width', '100%').style('margin', '0px 0px 10px 0px');
                controls.sliders.forEach(function (slider) {
                    new KG.Slider({ layer: sliderTable_1, param: slider.param, label: slider.label, digits: slider.digits, showNumber: slider.showNumber, model: controls.model, show: slider.show, plainText: slider.plainText });
                });
            }
            controls.radios.forEach(function (radio) {
                radio = KG.setDefaults(radio, {
                    layer: controls.rootElement,
                    model: controls.model,
                    figure_id: controls_id
                });
                new KG.Radio(radio);
            });
            if (controls.checkboxes.length > 0) {
                if (controls.radios.length > 0) {
                    controls.rootElement.append('div').style('margin-bottom', '10px');
                }
                controls.checkboxes.forEach(function (checkbox) {
                    checkbox = KG.setDefaults(checkbox, {
                        layer: controls.rootElement,
                        model: controls.model
                    });
                    new KG.Checkbox(checkbox);
                });
            }
            controls.divs.forEach(function (div) {
                div = KG.setDefaults(div, {
                    layer: controls.rootElement,
                    model: controls.model,
                    fontSize: 14
                });
                if (div.hasOwnProperty('html')) {
                    new KG.Div(div);
                }
                else if (div.hasOwnProperty('table')) {
                    div.rows = div.table.rows;
                    div.columns = div.table.columns;
                    div.lines = div.table.lines;
                    div.fontSize = 10;
                    delete div.table;
                    new KG.Table(div);
                }
            });
            return controls;
        };
        // update properties
        Controls.prototype.redraw = function () {
            var controls = this;
            if (controls.title) {
                controls.titleElement.text(controls.title.toUpperCase());
            }
            if (controls.description) {
                controls.descriptionElement.html(controls.description);
            }
            return controls;
        };
        return Controls;
    }(KG.DivObject));
    KG.Controls = Controls;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var GameMatrix = /** @class */ (function (_super) {
        __extends(GameMatrix, _super);
        function GameMatrix(def) {
            KG.setDefaults(def, {
                players: ["Player 1", "Player 2"]
            });
            KG.setProperties(def, 'constants', ['players', 'strategies']);
            KG.setProperties(def, 'updatables', ['payoffs']);
            return _super.call(this, def) || this;
        }
        // create div for text
        GameMatrix.prototype.draw = function (layer) {
            var gameMatrix = this;
            var numStrategies1 = gameMatrix.strategies[0].length, numStrategies2 = gameMatrix.strategies[1].length;
            gameMatrix.rootElement = layer.append('div');
            var table = gameMatrix.rootElement.append('table').attr('class', 'gameMatrix');
            var topRow = table.append('tr');
            topRow.append('td').attr('colspan', '2').attr('class', 'empty');
            topRow.append('td')
                .attr('colspan', numStrategies2 * 2)
                .attr('class', 'player2 strategy empty')
                .text(gameMatrix.players[1]);
            var secondRow = table.append('tr');
            secondRow.append('td').attr('colspan', '2').attr('class', 'empty');
            gameMatrix.strategies[1].forEach(function (s) {
                secondRow.append('td').attr('colspan', '2').attr('class', 'player2 strategy').text(s);
            });
            gameMatrix.payoffNodes = [];
            for (var i = 0; i < numStrategies1; i++) {
                var row = table.append('tr');
                var payoffRow = [];
                if (i == 0) {
                    row.append('td')
                        .attr('rowSpan', numStrategies1)
                        .attr('class', 'player1 strategy empty')
                        .text(gameMatrix.players[0]);
                }
                row.append('td').text(gameMatrix.strategies[0][i]).attr('class', 'player1 strategy');
                for (var j = 0; j < numStrategies2; j++) {
                    var payoff1 = row.append('td').attr('class', 'player1 payoff');
                    var payoff2 = row.append('td').attr('class', 'player2 payoff');
                    payoffRow.push([payoff1, payoff2]);
                }
                gameMatrix.payoffNodes.push(payoffRow);
            }
            return gameMatrix;
        };
        GameMatrix.prototype.redraw = function () {
            var gameMatrix = this;
            var strategies1 = gameMatrix.strategies[0], strategies2 = gameMatrix.strategies[1];
            var numStrategies1 = strategies1.length, numStrategies2 = strategies2.length;
            for (var i = 0; i < numStrategies1; i++) {
                for (var j = 0; j < numStrategies2; j++) {
                    var cell = gameMatrix.payoffNodes[i][j];
                    katex.render(gameMatrix.payoffs[i][j][0].toString(), cell[0].node());
                    katex.render(gameMatrix.payoffs[i][j][1].toString(), cell[1].node());
                }
            }
            return gameMatrix;
        };
        return GameMatrix;
    }(KG.DivObject));
    KG.GameMatrix = GameMatrix;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var GeoGebraApplet = /** @class */ (function (_super) {
        __extends(GeoGebraApplet, _super);
        function GeoGebraApplet(def) {
            var _this = this;
            KG.setDefaults(def, {
                params: [],
                objects: [],
                axisLabels: []
            });
            def.params.forEach(function (param) {
                def[param] = 'params.' + param;
            });
            KG.setProperties(def, 'updatables', def.params);
            KG.setProperties(def, 'constants', ['axes', 'params']);
            _this = _super.call(this, def) || this;
            var div = _this;
            div.objects = def.objects.map(function (objDef) {
                objDef.model = def.model;
                return new KG.GeoGebraObject(objDef);
            });
            //console.log('created GGB javascript object ', this)
            div.axesEstablished = false;
            return _this;
        }
        // create div for text
        GeoGebraApplet.prototype.draw = function (layer) {
            var div = _super.prototype.draw.call(this, layer);
            var id = KG.randomString(10);
            div.rootElement.append('div').attr('id', id);
            var applet = new GGBApplet({
                allowStyleBar: true,
                perspective: "T",
                borderColor: "#FFFFFF",
                dataParamId: id
            }, true);
            applet.setHTML5Codebase('../../../../GeoGebra/HTML5/5.0/web3d/');
            applet.inject(id);
            return div;
        };
        GeoGebraApplet.prototype.establishGGB = function (width, height) {
            var div = this;
            //console.log('called establishGGB');
            if (undefined != document['ggbApplet']) {
                //console.log('applet exists');
                div.applet = document['ggbApplet'];
                div.params.forEach(function (p) {
                    var establishParamCommand = p + " = " + div.model.currentParamValues[p];
                    //console.log('setting param using command ', establishParamCommand);
                    div.applet.evalCommand(establishParamCommand);
                });
                div.objects.forEach(function (obj) {
                    obj.establishGGB(div.applet);
                });
                div.updateGGB(div.applet, width, height);
            }
            else {
                //console.log('applet does not exist')
            }
        };
        GeoGebraApplet.prototype.updateGGB = function (applet, width, height) {
            var div = this;
            console.log('called updateGGB');
            if (undefined != applet) {
                //console.log('applet exists');
                //console.log('setting width to ', width);
                applet.setWidth(width);
                //console.log('setting height to ', height);
                applet.setHeight(height);
                if (div.axes.length == 3) {
                    //console.log('setting coordinate system ', div.axes[0].min, div.axes[0].max, div.axes[1].min, div.axes[1].max, div.axes[2].min, div.axes[2].max)
                    applet.setCoordSystem(div.axes[0].min, div.axes[0].max, div.axes[1].min, div.axes[1].max, div.axes[2].min, div.axes[2].max);
                    //console.log('setting axis steps ', div.axes[0].step, div.axes[1].step, div.axes[2].step);
                    applet.setAxisSteps(3, div.axes[0].step, div.axes[1].step, div.axes[2].step);
                    //console.log('setting axis labels ', div.axes[0].label, div.axes[1].label, div.axes[2].label);
                    applet.setAxisLabels(3, div.axes[0].label, div.axes[1].label, div.axes[2].label);
                    applet.setColor('xAxis', 0, 0, 0);
                    applet.setColor('yAxis', 0, 0, 0);
                    applet.setColor('zAxis', 0, 0, 0);
                }
                else {
                    applet.setCoordSystem(div.axes[0].scale.domainMin, div.axes[0].scale.domainMax, div.axes[1].scale.domainMin, div.axes[1].scale.domainMax);
                    applet.setAxisSteps(2, div.axes[0].step, div.axes[1].step);
                    applet.setAxisLabels(2, div.axes[0].label, div.axes[1].label);
                    applet.setColor('xAxis', 0, 0, 0);
                    applet.setColor('yAxis', 0, 0, 0);
                }
                if (div.hasOwnProperty('params')) {
                    div.params.forEach(function (param) {
                        applet.setValue(param, div[param]);
                    });
                }
            }
            else {
                //console.log('applet does not exist')
            }
        };
        // update properties
        GeoGebraApplet.prototype.redraw = function () {
            var div = _super.prototype.redraw.call(this);
            var width = Math.abs(div.xScale.scale(1) - div.xScale.scale(0)), height = Math.abs(div.yScale.scale(1) - div.yScale.scale(0));
            var checkExist = setInterval(function () {
                if (undefined != div.applet) {
                    div.updateGGB(div.applet, width, height);
                    clearInterval(checkExist);
                }
                else {
                    div.establishGGB(width, height);
                }
            }, 100); // check every 100ms
            return div;
        };
        return GeoGebraApplet;
    }(KG.PositionedDiv));
    KG.GeoGebraApplet = GeoGebraApplet;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Mathbox = /** @class */ (function (_super) {
        __extends(Mathbox, _super);
        function Mathbox(def) {
            var _this = this;
            KG.setDefaults(def, {
                objects: []
            });
            _this = _super.call(this, def) || this;
            var mb = _this;
            mb.objectDefs = def.objects;
            mb.objects = [];
            mb.objectDefs.forEach(function (td) {
                td.def.mathbox = mb;
                td.def.model = mb.model;
                if (td.type.indexOf('Mathbox') < 0) {
                    td.type = 'Mathbox' + td.type;
                }
                try {
                    mb.objects.push(new KG[td.type](td.def));
                }
                catch (e) {
                    console.log("There's no object called ", td.type);
                }
            });
            mb.clearColor = mb.model.clearColor;
            return _this;
            //console.log('created mathbox', mb);
        }
        Mathbox.prototype.initMathbox = function () {
            var mb = this;
            mb.mathbox = mathBox({
                plugins: ['core', 'controls', 'cursor', 'mathbox'],
                controls: { klass: THREE.OrbitControls },
                element: mb.rootElement.node()
            });
            if (mb.mathbox.fallback)
                throw "WebGL not supported";
            mb.three = mb.mathbox.three;
            mb.three.renderer.setClearColor(new THREE.Color(mb.clearColor), 1.0);
            mb.mathbox.camera({ proxy: true, position: [-5, 0.5, 0.8], eulerOrder: "yzx" });
            mb.mathboxView = mb.mathbox.cartesian({ scale: [1.6, 1.6, 1.6] });
            mb.mathboxView.grid({ axes: [1, 3], width: 2, divideX: 10, divideY: 10, opacity: 0.3 });
            mb.xAxis.redraw();
            mb.yAxis.redraw();
            mb.zAxis.redraw();
            mb.objects.forEach(function (o) { o.draw().update(); });
            return mb;
        };
        // create mb for mathbox
        Mathbox.prototype.draw = function (layer) {
            //console.log('creating mathbox container');
            var mb = this;
            mb.rootElement = layer.append('div').style('position', 'absolute');
            return mb;
        };
        Mathbox.prototype.redraw = function () {
            var mb = _super.prototype.redraw.call(this);
            //console.log('called redraw');
            if (mb.mathbox == undefined && mb.rootElement.node().clientWidth > 10 && mb.zAxis != undefined) {
                mb.initMathbox();
            }
            else {
                return mb;
            }
            return mb;
        };
        return Mathbox;
    }(KG.PositionedDiv));
    KG.Mathbox = Mathbox;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Sidebar = /** @class */ (function (_super) {
        __extends(Sidebar, _super);
        function Sidebar(def) {
            KG.setDefaults(def, {
                controls: [],
                triggerWidth: 563
            });
            KG.setProperties(def, 'constants', ['controls', 'triggerWidth']);
            return _super.call(this, def) || this;
        }
        Sidebar.prototype.positionRight = function (width, height) {
            var sidebar = this;
            sidebar.rootElement
                .style('left', width * 847 / 1260 + 'px')
                .style('top', '0px')
                .style('width', (width * 413 / 1260 - 10) + 'px')
                .style('height', height + 'px')
                .style('overflow-y', 'scroll')
                .style('right', '-17px');
        };
        Sidebar.prototype.positionBelow = function (width, height) {
            var sidebar = this;
            sidebar.rootElement
                .style('left', '10px')
                .style('top', height + 40 + 'px')
                .style('width', width - 20 + 'px')
                .style('height', null);
        };
        Sidebar.prototype.draw = function (layer) {
            var sidebar = this;
            sidebar.rootElement = layer.append('div').style('position', 'absolute').attr('class', 'sidebar');
            sidebar.controls.forEach(function (controlsDef) {
                controlsDef.layer = sidebar.rootElement;
                controlsDef.model = sidebar.model;
                new KG.Controls(controlsDef);
            });
            return sidebar;
        };
        return Sidebar;
    }(KG.ViewObject));
    KG.Sidebar = Sidebar;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Explanation = /** @class */ (function (_super) {
        __extends(Explanation, _super);
        function Explanation(def) {
            KG.setDefaults(def, {
                height: 0,
                divs: [],
                border: 'none'
            });
            KG.setProperties(def, 'constants', ['divs', 'height', 'border']);
            return _super.call(this, def) || this;
        }
        Explanation.prototype.position = function (width, height) {
            var explanation = this;
            explanation.rootElement
                .style('left', '10px')
                .style('top', height + 20 + 'px')
                .style('width', width - 20 + 'px');
        };
        Explanation.prototype.draw = function (layer) {
            var explanation = this;
            explanation.rootElement = layer.append('div')
                .style('position', 'absolute')
                .style('height', explanation.height == 0 ? null : explanation.height + 'px')
                .style('overflow-y', 'scroll')
                .style('border', explanation.border);
            explanation.divs.forEach(function (div) {
                div = KG.setDefaults(div, {
                    layer: explanation.rootElement,
                    model: explanation.model,
                    fontSize: 12
                });
                if (div.hasOwnProperty('html')) {
                    new KG.Div(div);
                }
                else if (div.hasOwnProperty('table')) {
                    div.rows = div.table.rows;
                    div.columns = div.table.columns;
                    div.fontSize = 10;
                    delete div.table;
                    new KG.Table(div);
                }
            });
            return explanation;
        };
        return Explanation;
    }(KG.ViewObject));
    KG.Explanation = Explanation;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Table = /** @class */ (function (_super) {
        __extends(Table, _super);
        function Table(def) {
            KG.setDefaults(def, {
                columns: [],
                rows: [],
                fontSize: 8,
                lines: true
            });
            KG.setProperties(def, 'constants', ['fontSize', 'lines']);
            KG.setProperties(def, 'updatables', ['rows', 'columns']);
            return _super.call(this, def) || this;
        }
        // create div for text
        Table.prototype.draw = function (layer) {
            var t = this;
            console.log('table is ', t);
            var hasColumnHeaders = (t.def['columns'].length > 0), numColumns = t.def['rows'][0].length, numRows = t.def['rows'].length;
            t.rootElement = layer.append('div');
            var table = t.rootElement.append('table').attr('class', 'table');
            table
                .style('margin-left', 'auto')
                .style('margin-right', 'auto')
                .style('font-size', t.fontSize + 'pt')
                .style('text-align', 'center')
                .style('border-collapse', 'collapse')
                .style('margin-top', '15pt')
                .attr('cell-padding', '5px')
                .style('width', '80%');
            t.columnCells = [];
            if (hasColumnHeaders) {
                var columnRow = table.append('thead').append('tr');
                for (var c = 0; c < numColumns; c++) {
                    var columnCell = columnRow.append('td');
                    columnCell
                        .style('font-size', t.fontSize + 'pt')
                        .style('font-weight', 'bold')
                        .style('border-bottom', '1px solid black')
                        .style('text-align', 'center')
                        .style('padding', '0px 10px 0px 10px');
                    t.columnCells.push(columnCell);
                }
            }
            t.rowCells = [];
            var tableBody = table.append('tbody');
            for (var r = 0; r < numRows; r++) {
                var dataRow = [];
                var tableRow = tableBody.append('tr');
                for (var c = 0; c < numColumns; c++) {
                    var rowCell = tableRow.append('td');
                    rowCell
                        .style('font-size', t.fontSize + 'pt')
                        .style('text-align', 'center');
                    if (t.lines) {
                        rowCell.style('border-bottom', '0.5px solid grey');
                    }
                    dataRow.push(rowCell);
                }
                t.rowCells.push(dataRow);
            }
            return t;
        };
        Table.prototype.redraw = function () {
            var t = this;
            var hasColumnHeaders = (t.def['columns'].length > 0), numColumns = t.rows[0].length, numRows = t.rows.length;
            if (hasColumnHeaders) {
                for (var c = 0; c < numColumns; c++) {
                    katex.render("\\text{" + t.columns[c].toString() + "}", t.columnCells[c].node());
                }
            }
            for (var r = 0; r < numRows; r++) {
                for (var c = 0; c < numColumns; c++) {
                    katex.render("\\text{" + t.rows[r][c].toString() + "}", t.rowCells[r][c].node());
                }
            }
            return t;
        };
        return Table;
    }(KG.DivObject));
    KG.Table = Table;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var MathboxObject = /** @class */ (function (_super) {
        __extends(MathboxObject, _super);
        function MathboxObject(def) {
            KG.setProperties(def, 'constants', ['mathbox']);
            return _super.call(this, def) || this;
        }
        MathboxObject.prototype.onGraph = function () {
            return true; // we won't check yet to see if it's on the graph...
        };
        MathboxObject.prototype.displayElement = function (show) {
            var mbo = this;
            if (mbo.hasOwnProperty("mo")) {
                this.mo.set("visible", show);
            }
        };
        return MathboxObject;
    }(KG.ViewObject));
    KG.MathboxObject = MathboxObject;
})(KG || (KG = {}));
var KG;
(function (KG) {
    var MathboxAxis = /** @class */ (function (_super) {
        __extends(MathboxAxis, _super);
        function MathboxAxis(def) {
            KG.setDefaults(def, {
                ticks: 5,
                min: 0,
                max: 10
            });
            KG.setProperties(def, 'constants', ['axisNumber', 'ticks']);
            KG.setProperties(def, 'updatables', ['ticks', 'label', 'min', 'max']);
            return _super.call(this, def) || this;
        }
        MathboxAxis.prototype.redraw = function () {
            var a = this;
            var view = a.mathbox.mathboxView;
            if (view == undefined) {
                return a;
            }
            view.set("range", [[a.mathbox.yAxis.min, a.mathbox.yAxis.max], [a.mathbox.zAxis.min, a.mathbox.zAxis.max], [a.mathbox.xAxis.min, a.mathbox.xAxis.max]]);
            var axis = view.axis({ axis: a.axisNumber, width: 8, detail: 40, color: "black" });
            var scale = view.scale({ axis: a.axisNumber, divide: a.ticks, nice: false, zero: true });
            var ticks = view.ticks({ width: 5, size: 5, color: "gray", zBias: 2 });
            var format = view.format({ digits: 2, classes: ["tick"], style: "normal", source: scale });
            var ticklabel = view.label({ color: "gray", zIndex: 1, offset: [0, 0], points: scale, text: format, size: 10 });
            return a;
        };
        return MathboxAxis;
    }(KG.MathboxObject));
    KG.MathboxAxis = MathboxAxis;
    var MathboxXAxis = /** @class */ (function (_super) {
        __extends(MathboxXAxis, _super);
        function MathboxXAxis(def) {
            var _this = this;
            def.axisNumber = 3;
            _this = _super.call(this, def) || this;
            var xAxis = _this;
            xAxis.mathbox.xAxis = xAxis;
            return _this;
        }
        return MathboxXAxis;
    }(MathboxAxis));
    KG.MathboxXAxis = MathboxXAxis;
    var MathboxYAxis = /** @class */ (function (_super) {
        __extends(MathboxYAxis, _super);
        function MathboxYAxis(def) {
            var _this = this;
            def.axisNumber = 1;
            _this = _super.call(this, def) || this;
            var yAxis = _this;
            yAxis.mathbox.yAxis = yAxis;
            return _this;
        }
        return MathboxYAxis;
    }(MathboxAxis));
    KG.MathboxYAxis = MathboxYAxis;
    var MathboxZAxis = /** @class */ (function (_super) {
        __extends(MathboxZAxis, _super);
        function MathboxZAxis(def) {
            var _this = this;
            def.axisNumber = 2;
            _this = _super.call(this, def) || this;
            var zAxis = _this;
            zAxis.mathbox.zAxis = zAxis;
            return _this;
        }
        return MathboxZAxis;
    }(MathboxAxis));
    KG.MathboxZAxis = MathboxZAxis;
})(KG || (KG = {}));
var KG;
(function (KG) {
    var MathboxPoint = /** @class */ (function (_super) {
        __extends(MathboxPoint, _super);
        function MathboxPoint(def) {
            KG.setDefaults(def, {
                x: 0,
                y: 0,
                z: 0
            });
            KG.setProperties(def, 'updatables', ['x', 'y', 'z']);
            return _super.call(this, def) || this;
        }
        MathboxPoint.prototype.draw = function () {
            var p = this;
            p.pointData = p.mathbox.mathboxView.array({
                width: 1,
                channels: 3
            });
            p.mo = p.mathbox.mathboxView.point({
                size: 20,
                points: p.pointData,
                zIndex: 4
            });
            return p;
        };
        MathboxPoint.prototype.redraw = function () {
            var p = this;
            //console.log(p);
            p.pointData.set("data", [[p.y, p.z, p.x]]);
            p.mo.set("color", p.stroke);
            return p;
        };
        return MathboxPoint;
    }(KG.MathboxObject));
    KG.MathboxPoint = MathboxPoint;
})(KG || (KG = {}));
var KG;
(function (KG) {
    var MathboxCurve = /** @class */ (function (_super) {
        __extends(MathboxCurve, _super);
        function MathboxCurve(def) {
            var _this = this;
            KG.setDefaults(def, {
                text: "#666666",
                strokeWidth: 10
            });
            _this = _super.call(this, def) || this;
            def.fn = KG.setDefaults(def.fn, {
                model: def.model,
                samplePoints: 100
            });
            _this.fn = new KG.UnivariateFunction(def.fn).update(true);
            return _this;
        }
        MathboxCurve.prototype.draw = function () {
            var c = this;
            c.curveData = c.mathbox.mathboxView.interval({
                axis: 1,
                channels: 3,
                width: c.fn.samplePoints
            });
            c.mo = c.mathbox.mathboxView.line({
                points: c.curveData,
                zIndex: 3
            });
            return c;
        };
        MathboxCurve.prototype.redraw = function () {
            var c = this;
            //console.log(c);
            c.curveData.set("expr", c.fn.mathboxFn(c.mathbox));
            c.mo.set("color", c.stroke);
            c.mo.set("width", c.strokeWidth);
            c.mo.set("stroke", c.lineStyle);
            return c;
        };
        return MathboxCurve;
    }(KG.MathboxObject));
    KG.MathboxCurve = MathboxCurve;
    var CurveThreeD = /** @class */ (function (_super) {
        __extends(CurveThreeD, _super);
        function CurveThreeD(def) {
            return _super.call(this, def) || this;
        }
        return CurveThreeD;
    }(MathboxCurve));
    KG.CurveThreeD = CurveThreeD;
})(KG || (KG = {}));
var KG;
(function (KG) {
    var MathboxSurface = /** @class */ (function (_super) {
        __extends(MathboxSurface, _super);
        function MathboxSurface(def) {
            var _this = this;
            KG.setDefaults(def, {
                fill: "#666666",
                strokeWidth: 10,
                opacity: 0.2,
                meshWidth: 1,
                samplePoints: 100,
                axis1: "x",
                axis2: "y"
            });
            KG.setProperties(def, 'constants', ['meshWidth', 'samplePoints']);
            _this = _super.call(this, def) || this;
            var s = _this;
            var axis1 = [0, "y", "z", "x"].indexOf(def.axis1);
            var axis2 = [0, "y", "z", "x"].indexOf(def.axis2);
            s.axes = [axis1, axis2];
            return _this;
        }
        MathboxSurface.prototype.draw = function () {
            var s = this;
            s.surfaceData = s.mathbox.mathboxView.area({
                axes: s.axes,
                channels: 3,
                width: s.samplePoints,
                height: s.samplePoints
            });
            console.log('surface data: ', s.surfaceData);
            /*

            #TODO Someday we'll improve shading

            var graphColors = s.mathbox.mathboxView.area({
                expr: function (emit, x, y, i, j, t) {
                    if (x < 0)
                        emit(1.0, 0.0, 0.0, 1.0);
                    else
                        emit(0.0, 1.0, 0.0, 1.0);
                },
                axes: [1, 3],
                width: 64, height: 64,
                channels: 4, // RGBA
            });

            graphColors.set("expr",
                function (emit, x, y, i, j, t)
                {
                    var z = x*x + y*y;
                    const zMin = 0, zMax=200;
                    var percent = (z - zMin) / (zMax - zMin);
                    emit( percent, percent, percent, 1.0 );
                }
            );*/
            s.mo = s.mathbox.mathboxView.surface({
                points: s.surfaceData,
                shaded: true,
                fill: true,
                lineX: true,
                lineY: true,
                width: s.meshWidth,
                zIndex: 2
            });
            return s;
        };
        MathboxSurface.prototype.redraw = function () {
            var c = this;
            //console.log(c);
            c.surfaceData.set("expr", c.mathboxFn());
            c.mo.set("color", c.fill);
            c.mo.set("opacity", c.opacity);
            return c;
        };
        return MathboxSurface;
    }(KG.MathboxObject));
    KG.MathboxSurface = MathboxSurface;
    var MathboxFunctionSurface = /** @class */ (function (_super) {
        __extends(MathboxFunctionSurface, _super);
        function MathboxFunctionSurface(def) {
            var _this = this;
            def.fn = KG.setDefaults(def.fn, {
                model: def.model,
                samplePoints: 100
            });
            KG.setDefaults(def, {
                samplePoints: def.fn.samplePoints
            });
            _this = _super.call(this, def) || this;
            _this.fn = new KG.MultivariateFunction(def.fn).update(true);
            return _this;
        }
        MathboxFunctionSurface.prototype.mathboxFn = function () {
            var s = this;
            return function (emit, x, y) {
                emit(y, s.fn.evaluate(x, y), x);
            };
        };
        return MathboxFunctionSurface;
    }(MathboxSurface));
    KG.MathboxFunctionSurface = MathboxFunctionSurface;
})(KG || (KG = {}));
var KG;
(function (KG) {
    var MathboxDataSurface = /** @class */ (function (_super) {
        __extends(MathboxDataSurface, _super);
        function MathboxDataSurface(def) {
            var _this = this;
            KG.setDefaults(def, {
                fill: "#666666",
                strokeWidth: 10,
                opacity: 0.2,
                meshWidth: 1,
                samplePoints: 100,
                axis1: "x",
                axis2: "y"
            });
            KG.setProperties(def, 'constants', ['meshWidth', 'samplePoints']);
            _this = _super.call(this, def) || this;
            var s = _this;
            var axis1 = [0, "y", "z", "x"].indexOf(def.axis1);
            var axis2 = [0, "y", "z", "x"].indexOf(def.axis2);
            s.axes = [axis1, axis2];
            return _this;
        }
        MathboxDataSurface.prototype.draw = function () {
            var s = this;
            s.surfaceData = s.mathbox.mathboxView.area({
                axes: s.axes,
                channels: 3,
                width: s.samplePoints,
                height: s.samplePoints
            });
            /*

            #TODO Someday we'll improve shading

            var graphColors = s.mathbox.mathboxView.area({
                expr: function (emit, x, y, i, j, t) {
                    if (x < 0)
                        emit(1.0, 0.0, 0.0, 1.0);
                    else
                        emit(0.0, 1.0, 0.0, 1.0);
                },
                axes: [1, 3],
                width: 64, height: 64,
                channels: 4, // RGBA
            });

            graphColors.set("expr",
                function (emit, x, y, i, j, t)
                {
                    var z = x*x + y*y;
                    const zMin = 0, zMax=200;
                    var percent = (z - zMin) / (zMax - zMin);
                    emit( percent, percent, percent, 1.0 );
                }
            );*/
            s.mo = s.mathbox.mathboxView.surface({
                points: s.surfaceData,
                shaded: true,
                fill: true,
                lineX: true,
                lineY: true,
                width: s.meshWidth,
                zIndex: 2
            });
            return s;
        };
        MathboxDataSurface.prototype.redraw = function () {
            var c = this;
            //console.log(c);
            c.surfaceData.set("expr", c.mathboxFn());
            c.mo.set("color", c.fill);
            c.mo.set("opacity", c.opacity);
            return c;
        };
        return MathboxDataSurface;
    }(KG.MathboxSurface));
    KG.MathboxDataSurface = MathboxDataSurface;
})(KG || (KG = {}));
var KG;
(function (KG) {
    var MathboxPlane = /** @class */ (function (_super) {
        __extends(MathboxPlane, _super);
        function MathboxPlane(def) {
            var _this = this;
            var planeType = 'z';
            if (def.hasOwnProperty('x')) {
                def.axis1 = "y";
                def.axis2 = "z";
                planeType = "x";
            }
            else if (def.hasOwnProperty('y')) {
                def.axis1 = "x";
                def.axis2 = "z";
                planeType = "y";
            }
            else {
                def.axis1 = "x";
                def.axis2 = "y";
            }
            def.samplePoints = 2;
            KG.setProperties(def, 'updatables', ['x', 'y', 'z']);
            _this = _super.call(this, def) || this;
            _this.planeType = planeType;
            return _this;
        }
        MathboxPlane.prototype.mathboxFn = function () {
            var p = this;
            if (p.planeType == "x") {
                return function (emit, y, z) {
                    emit(y, z, p.x);
                };
            }
            else if (p.planeType == "y") {
                return function (emit, x, z) {
                    emit(p.y, z, x);
                };
            }
            else {
                return function (emit, x, y) {
                    emit(y, p.z, x);
                };
            }
        };
        return MathboxPlane;
    }(KG.MathboxSurface));
    KG.MathboxPlane = MathboxPlane;
})(KG || (KG = {}));
var KG;
(function (KG) {
    var MathboxShape = /** @class */ (function (_super) {
        __extends(MathboxShape, _super);
        function MathboxShape(def) {
            KG.setDefaults(def, {
                fill: "#666666",
                strokeWidth: 10,
                opacity: 0.2
            });
            return _super.call(this, def) || this;
        }
        MathboxShape.prototype.draw = function () {
            var s = this;
            s.surfaceData = s.mathbox.mathboxView.area({
                axes: [1, 3],
                channels: 3,
                width: s.fn.samplePoints,
                height: s.fn.samplePoints
            });
            s.mo = s.mathbox.mathboxView.surface({
                points: s.surfaceData,
                shaded: true,
                fill: true,
                lineX: false,
                lineY: false,
                width: 0,
                zIndex: 2
            });
            return s;
        };
        MathboxShape.prototype.redraw = function () {
            var c = this;
            //console.log(c);
            c.surfaceData.set("expr", c.fn.mathboxFn());
            c.mo.set("color", c.fill);
            c.mo.set("opacity", c.opacity);
            return c;
        };
        return MathboxShape;
    }(KG.MathboxObject));
    KG.MathboxShape = MathboxShape;
})(KG || (KG = {}));
var KG;
(function (KG) {
    var MathboxLabel = /** @class */ (function (_super) {
        __extends(MathboxLabel, _super);
        function MathboxLabel(def) {
            KG.setDefaults(def, {
                text: "foo"
            });
            KG.setProperties(def, 'updatables', ['text']);
            return _super.call(this, def) || this;
        }
        MathboxLabel.prototype.draw = function () {
            var l = this;
            l.pointData = l.mathbox.mathboxView.array({
                width: 1,
                channels: 3
            });
            l.labelData = l.mathbox.mathboxView.format({
                font: "KaTeX_Main",
                style: "normal"
            });
            l.mo = l.mathbox.mathboxView.label({
                points: l.pointData,
                zIndex: 4,
                text: l.labelData
            });
            return l;
        };
        MathboxLabel.prototype.redraw = function () {
            var l = _super.prototype.redraw.call(this);
            l.labelData.set("data", [l.text]);
            return l;
        };
        return MathboxLabel;
    }(KG.MathboxPoint));
    KG.MathboxLabel = MathboxLabel;
})(KG || (KG = {}));
var KG;
(function (KG) {
    var MathboxLine = /** @class */ (function (_super) {
        __extends(MathboxLine, _super);
        function MathboxLine(def) {
            KG.setDefaults(def, {
                x1: 0,
                y1: 0,
                z1: 0,
                x2: 0,
                y2: 0,
                z2: 0,
                lineStyle: "solid"
            });
            KG.setProperties(def, 'updatables', ['x1', 'y1', 'z1', 'x2', 'y2', 'z2']);
            KG.setProperties(def, 'constants', ['start', 'end']);
            return _super.call(this, def) || this;
        }
        MathboxLine.prototype.draw = function () {
            var p = this;
            p.pointData = p.mathbox.mathboxView.array({
                width: 2,
                channels: 3
            });
            p.mo = p.mathbox.mathboxView.line({
                points: p.pointData,
                zIndex: 4
            });
            return p;
        };
        MathboxLine.prototype.redraw = function () {
            var p = this;
            //console.log(p);
            p.pointData.set("data", [[p.y1, p.z1, p.x1], [p.y2, p.z2, p.x2]]);
            p.mo.set("color", p.stroke);
            p.mo.set("stroke", p.lineStyle);
            p.mo.set("width", p.strokeWidth);
            p.mo.set("start", p.start);
            p.mo.set("end", p.end);
            return p;
        };
        return MathboxLine;
    }(KG.MathboxObject));
    KG.MathboxLine = MathboxLine;
})(KG || (KG = {}));
/// <reference path="../../node_modules/@types/katex/index.d.ts"/>
/// <reference path="../../node_modules/@types/d3/index.d.ts"/>
/// <reference path="../../node_modules/@types/js-yaml/index.d.ts"/>
/// <reference path="lib/underscore.ts"/>
/// <reference path="KGAuthor/kgAuthor.ts"/>
/// <reference path="model/model.ts"/>
/// <reference path="model/param.ts" />
/// <reference path="model/restriction.ts" />
/// <reference path="model/updateListener.ts" />
/// <reference path="math/mathFunction.ts" />
/// <reference path="math/univariateFunction.ts" />
/// <reference path="math/parametricFunction.ts" />
/// <reference path="math/multivariateFunction.ts" />
/// <reference path="controller/listeners/listener.ts" />
/// <reference path="controller/listeners/dragListener.ts" />
/// <reference path="controller/listeners/clickListener.ts" />
/// <reference path="controller/interactionHandler.ts" />
/// <reference path="view/view.ts"/>
/// <reference path="view/scale.ts" />
/// <reference path="view/viewObjects/viewObject.ts" />
/// <reference path="view/viewObjects/marker.ts" />
/// <reference path="view/viewObjects/segment.ts" />
/// <reference path="view/viewObjects/curve.ts" />
/// <reference path="view/viewObjects/axis.ts" />
/// <reference path="view/viewObjects/point.ts" />
/// <reference path="view/viewObjects/circle.ts" />
/// <reference path="view/viewObjects/rectangle.ts" />
/// <reference path="view/viewObjects/area.ts" />
/// <reference path="view/viewObjects/ggbObject.ts" />
/// <reference path="view/viewObjects/contour.ts" />
/// <reference path="view/viewObjects/label.ts" />
/// <reference path="view/divObjects/divObject.ts" />
/// <reference path="view/divObjects/positionedDiv.ts" />
/// <reference path="view/divObjects/div.ts" />
/// <reference path="view/divObjects/paramControl.ts"/>
/// <reference path="view/divObjects/slider.ts"/>
/// <reference path="view/divObjects/checkbox.ts"/>
/// <reference path="view/divObjects/radio.ts"/>
/// <reference path="view/divObjects/controls.ts"/>
/// <reference path="view/divObjects/gameMatrix.ts"/>
/// <reference path="view/divObjects/ggbApplet.ts"/>
/// <reference path="view/divObjects/mathbox.ts"/>
/// <reference path="view/divObjects/sidebar.ts"/>
/// <reference path="view/divObjects/explanation.ts"/>
/// <reference path="view/divObjects/table.ts" />
/// <reference path="view/mathboxObjects/mathboxObject.ts" />
/// <reference path="view/mathboxObjects/mathboxAxis.ts" />
/// <reference path="view/mathboxObjects/mathboxPoint.ts" />
/// <reference path="view/mathboxObjects/mathboxCurve.ts" />
/// <reference path="view/mathboxObjects/mathboxSurface.ts" />
/// <reference path="view/mathboxObjects/mathboxDataSurface.ts" />
/// <reference path="view/mathboxObjects/mathboxPlane.ts" />
/// <reference path="view/mathboxObjects/mathboxShape.ts" />
/// <reference path="view/mathboxObjects/mathboxLabel.ts" />
/// <reference path="view/mathboxObjects/mathboxLine.ts" />
// this file provides the interface with the overall web page
var views = [];
// initialize the diagram from divs with class kg-container
function loadGraphs() {
    views = [];
    var viewDivs = document.getElementsByClassName('kg-container');
    var _loop_1 = function (i) {
        var d = viewDivs[i], src = d.getAttribute('src'), tmp = d.getAttribute('template'), fmt = d.getAttribute('format');
        //greenscreen = d.getAttribute('greenscreen') || false;
        if (d.innerHTML.indexOf('svg') > -1) {
            //console.log('already loaded');
        }
        else {
            // if there is no src attribute
            if (!src || src.indexOf('.yml') > -1) {
                try {
                    function generateViewFromYamlText(t) {
                        var y = jsyaml.load(t); // note changing from loadSafe to load...seems like jsyaml made this change
                        var j = JSON.parse(JSON.stringify(y).replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&'));
                        //j.greenscreen = greenscreen;
                        // If there is a template file, then load that and use the yml in the description to replace terms defined by "macro"
                        var custom = "";
                        if (tmp) {
                            d3.text(tmp).then(function (template_file) {
                                var yt = jsyaml.load(template_file);
                                var yts = JSON.stringify(yt).replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
                                for (var key in j) {
                                    if (key == "custom") {
                                        custom = j[key];
                                    }
                                    var searchTerm = new RegExp("template.\\b" + key + "\\b", "g");
                                    var replaceTerm = j[key];
                                    yts = yts.replace(searchTerm, replaceTerm);
                                }
                                var jt = JSON.parse(yts);
                                jt.custom = custom;
                                views.push(new KG.View(d, jt));
                            });
                        }
                        else {
                            views.push(new KG.View(d, j));
                        }
                    }
                    if (src) {
                        // load YAML from source file
                        d3.text(src).then(function (yaml_file) {
                            generateViewFromYamlText(yaml_file);
                        });
                    }
                    else {
                        // read inner HTML of div as YAML
                        var inlineDef = d.innerHTML;
                        d.innerHTML = "";
                        generateViewFromYamlText(inlineDef);
                    }
                }
                catch (e) {
                    console.log('Error reading YAML: ', e.message);
                }
            }
            // first look to see if there's a definition in the KG.viewData object
            else if (KG['viewData'].hasOwnProperty(src)) {
                viewDivs[i].innerHTML = "";
                views.push(new KG.View(viewDivs[i], KG['viewData'][src]));
            }
            else {
                // then look to see if the src is available by a URL
                d3.json(src + "?update=true").then(function (data) {
                    if (!data) {
                        d.innerHTML = "<p>oops, " + src + " doesn't seem to exist.</p>";
                    }
                    else {
                        d.innerHTML = "";
                        //data.greenscreen = greenscreen;
                        views.push(new KG.View(d, data));
                    }
                });
            }
            d.classList.add('kg-loaded');
        }
    };
    // for each div, fetch the JSON definition and create a View object with that div and data
    for (var i = 0; i < viewDivs.length; i++) {
        _loop_1(i);
    }
}
;
// When the page loads, load the graphs
window.addEventListener("load", loadGraphs);
// if the window changes size, update the dimensions of the containers
window.onresize = function () {
    views.forEach(function (c) {
        c.updateDimensions();
    });
};
(function () {
    var beforePrint = function () {
        views.forEach(function (c) {
            c.updateDimensions(true);
        });
    };
    var afterPrint = function () {
        views.forEach(function (c) {
            c.updateDimensions(false);
        });
    };
    if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function (mql) {
            if (mql.matches) {
                beforePrint();
            }
            else {
                afterPrint();
            }
        });
    }
    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;
}());
// if embedded within a slide, send slide transitions to the parent
document.addEventListener("keyup", function (event) {
    if (event.key == 'PageDown') {
        event.preventDefault();
        console.log('trigger next page');
        if (window != window.parent) {
            window.parent.postMessage(JSON.stringify({
                method: 'next'
            }), '*');
        }
    }
    if (event.key == 'PageUp') {
        event.preventDefault();
        if (window != window.parent) {
            window.parent.postMessage(JSON.stringify({
                method: 'prev'
            }), '*');
        }
    }
});
var KG;
(function (KG) {
    function resetAllParams() {
        console.log("Resetting parameters on all views");
        views.forEach(function (v) {
            v.model.resetParams();
        });
    }
    KG.resetAllParams = resetAllParams;
})(KG || (KG = {}));


