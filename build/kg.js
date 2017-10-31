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
/// <reference path="../kg.ts" />
var KGAuthor;
(function (KGAuthor) {
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
    function negativeDef(def) {
        return (typeof def == 'number') ? (-1) * def : "(-" + getDefinitionProperty(def) + ")";
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
        return binaryFunction(def1, def2, '+');
    }
    KGAuthor.addDefs = addDefs;
    function subtractDefs(def1, def2) {
        return binaryFunction(def1, def2, '-');
    }
    KGAuthor.subtractDefs = subtractDefs;
    function divideDefs(def1, def2) {
        return binaryFunction(def1, def2, '/');
    }
    KGAuthor.divideDefs = divideDefs;
    function invertDef(def) {
        return binaryFunction(1, def, '/');
    }
    KGAuthor.invertDef = invertDef;
    function multiplyDefs(def1, def2) {
        return binaryFunction(def1, def2, '*');
    }
    KGAuthor.multiplyDefs = multiplyDefs;
    function averageDefs(def1, def2) {
        return "(0.5*" + addDefs(def1, def2) + ")";
    }
    KGAuthor.averageDefs = averageDefs;
    function squareDef(def) {
        return binaryFunction(def, def, '*');
    }
    KGAuthor.squareDef = squareDef;
    function sqrtDef(def) {
        return 'Math.sqrt(' + def + ')';
    }
    KGAuthor.sqrtDef = sqrtDef;
    function raiseDefToDef(def1, def2) {
        return binaryFunction(def1, def2, '^');
    }
    KGAuthor.raiseDefToDef = raiseDefToDef;
    function paramName(def) {
        if (typeof (def) == 'string') {
            return def.replace('params.', '');
        }
        else {
            return def;
        }
    }
    KGAuthor.paramName = paramName;
    function curvesFromFunctions(fns, def, graph) {
        return fns.map(function (fn) {
            var curveDef = JSON.parse(JSON.stringify(def));
            if (fn.hasOwnProperty('parametric')) {
                curveDef.parametricFunction = fn;
            }
            else {
                curveDef.univariateFunction = fn;
            }
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
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kg.ts" />
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
            parsedData = this.parseSelf(parsedData);
            this.subObjects.forEach(function (obj) {
                parsedData = obj.parse(parsedData);
            });
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
/// <reference path="../kg.ts" />
var KGAuthor;
(function (KGAuthor) {
    var setDefaults = KG.setDefaults;
    var Schema = /** @class */ (function (_super) {
        __extends(Schema, _super);
        function Schema(def) {
            var _this = this;
            var palette = {
                blue: 'd3.schemeCategory20c[0]',
                orange: 'd3.schemeCategory20c[4]',
                green: 'd3.schemeCategory20c[8]',
                purple: 'd3.schemeCategory20c[12]',
                grey: 'd3.schemeCategory20c[16]',
                olive: 'd3.schemeCategory20b[4]',
                brown: 'd3.schemeCategory20b[8]',
                red: 'd3.schemeCategory20[6]',
                magenta: 'd3.schemeCategory20b[16]'
            };
            for (var color in def.colors) {
                var colorName = def.colors[color];
                if (palette.hasOwnProperty(colorName)) {
                    def.colors[color] = palette[colorName];
                }
            }
            def.colors = setDefaults(def.colors || {}, palette);
            _this = _super.call(this, def) || this;
            _this.colors = def.colors;
            return _this;
        }
        Schema.prototype.parseSelf = function (parsedData) {
            var colors = this.colors;
            parsedData.colors = setDefaults(parsedData.colors || {}, colors);
            return parsedData;
        };
        return Schema;
    }(KGAuthor.AuthoringObject));
    KGAuthor.Schema = Schema;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kg.ts" />
var KGAuthor;
(function (KGAuthor) {
    var PositionedObject = /** @class */ (function (_super) {
        __extends(PositionedObject, _super);
        function PositionedObject(def) {
            var _this = this;
            KG.setDefaults(def, { xAxis: {}, yAxis: {} });
            KG.setDefaults(def.xAxis, { min: 0, max: 10, title: '', orient: 'bottom' });
            KG.setDefaults(def.yAxis, { min: 0, max: 10, title: '', orient: 'left' });
            _this = _super.call(this, def) || this;
            var po = _this;
            po.xScale = new Scale({
                "name": KG.randomString(10),
                "axis": "x",
                "domainMin": def.xAxis.min,
                "domainMax": def.xAxis.max,
                "rangeMin": def.position.x,
                "rangeMax": KGAuthor.addDefs(def.position.x, def.position.width)
            });
            po.yScale = new Scale({
                "name": KG.randomString(10),
                "axis": "y",
                "domainMin": def.yAxis.min,
                "domainMax": def.yAxis.max,
                "rangeMin": KGAuthor.addDefs(def.position.y, def.position.height),
                "rangeMax": def.position.y
            });
            po.subObjects = [po.xScale, po.yScale];
            return _this;
        }
        return PositionedObject;
    }(KGAuthor.AuthoringObject));
    KGAuthor.PositionedObject = PositionedObject;
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
    }(PositionedObject));
    KGAuthor.GeoGebraContainer = GeoGebraContainer;
    var Graph = /** @class */ (function (_super) {
        __extends(Graph, _super);
        function Graph(def) {
            var _this = _super.call(this, def) || this;
            var g = _this;
            g.clipPath = new ClipPath({
                "name": KG.randomString(10),
                "paths": [new KGAuthor.Rectangle({
                        x1: def.xAxis.min,
                        x2: def.xAxis.max,
                        y1: def.yAxis.min,
                        y2: def.yAxis.max,
                        inClipPath: true
                    }, g)]
            }, g);
            g.subObjects.push(g.clipPath);
            g.def.objects.unshift({
                type: 'Axis',
                def: _this.def.xAxis
            });
            g.def.objects.unshift({
                type: 'Axis',
                def: _this.def.yAxis
            });
            g.def.objects.forEach(function (obj) {
                g.subObjects.push(new KGAuthor[obj.type](obj.def, g));
            });
            console.log(g);
            return _this;
        }
        return Graph;
    }(PositionedObject));
    KGAuthor.Graph = Graph;
    var GraphObjectGenerator = /** @class */ (function (_super) {
        __extends(GraphObjectGenerator, _super);
        function GraphObjectGenerator(def, graph) {
            var _this = _super.call(this, def) || this;
            if (graph) {
                _this.def.xScaleName = graph.xScale.name;
                _this.def.yScaleName = graph.yScale.name;
                if (!def.inClipPath) {
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
                obj[xKey] = def[coordinatesKey][0].toString();
                obj[yKey] = def[coordinatesKey][1].toString();
                delete def[coordinatesKey];
            }
        };
        return GraphObjectGenerator;
    }(KGAuthor.AuthoringObject));
    KGAuthor.GraphObjectGenerator = GraphObjectGenerator;
    var GraphObject = /** @class */ (function (_super) {
        __extends(GraphObject, _super);
        function GraphObject(def, graph) {
            var _this = _super.call(this, def, graph) || this;
            var g = _this;
            if (def.hasOwnProperty('color')) {
                g.color = def.color;
            }
            return _this;
        }
        GraphObject.prototype.parseSelf = function (parsedData) {
            parsedData.layers[this.layer].push(this);
            return parsedData;
        };
        return GraphObject;
    }(GraphObjectGenerator));
    KGAuthor.GraphObject = GraphObject;
    var ClipPath = /** @class */ (function (_super) {
        __extends(ClipPath, _super);
        function ClipPath(def, graph) {
            var _this = this;
            def.inClipPath = true;
            _this = _super.call(this, def, graph) || this;
            return _this;
        }
        ClipPath.prototype.parseSelf = function (parsedData) {
            delete this.def.clipPathName;
            parsedData.clipPaths.push(this.def);
            return parsedData;
        };
        return ClipPath;
    }(GraphObjectGenerator));
    KGAuthor.ClipPath = ClipPath;
    var Scale = /** @class */ (function (_super) {
        __extends(Scale, _super);
        function Scale(def) {
            var _this = _super.call(this, def) || this;
            _this.min = def.domainMin;
            _this.max = def.domainMax;
            return _this;
        }
        Scale.prototype.parseSelf = function (parsedData) {
            parsedData.scales.push(this.def);
            return parsedData;
        };
        return Scale;
    }(KGAuthor.AuthoringObject));
    KGAuthor.Scale = Scale;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kg.ts" />
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
    var Label = /** @class */ (function (_super) {
        __extends(Label, _super);
        function Label(def, graph) {
            var _this = this;
            if (def.hasOwnProperty('position')) {
                if (def.position.toLowerCase() == 'bl') {
                    def.xPixelOffset = 5;
                    def.yPixelOffset = 10;
                    def.align = 'left';
                }
                if (def.position.toLowerCase() == 'tr') {
                    def.xPixelOffset = -5;
                    def.yPixelOffset = -12;
                    def.align = 'right';
                }
            }
            _this = _super.call(this, def, graph) || this;
            _this.type = 'Label';
            _this.extractCoordinates();
            return _this;
        }
        return Label;
    }(DivObject));
    KGAuthor.Label = Label;
    var Sidebar = /** @class */ (function (_super) {
        __extends(Sidebar, _super);
        function Sidebar(def) {
            var _this = _super.call(this, def) || this;
            _this.type = 'Sidebar';
            return _this;
        }
        return Sidebar;
    }(DivObject));
    KGAuthor.Sidebar = Sidebar;
    var GeoGebraApplet = /** @class */ (function (_super) {
        __extends(GeoGebraApplet, _super);
        function GeoGebraApplet(def) {
            var _this = _super.call(this, def) || this;
            _this.type = 'GeoGebraApplet';
            return _this;
        }
        return GeoGebraApplet;
    }(DivObject));
    KGAuthor.GeoGebraApplet = GeoGebraApplet;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kg.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Axis = /** @class */ (function (_super) {
        __extends(Axis, _super);
        function Axis(def, graph) {
            var _this = _super.call(this, def, graph) || this;
            var a = _this;
            a.type = 'Axis';
            a.layer = 2;
            if (def.hasOwnProperty('title')) {
                if (def.orient == 'bottom') {
                    a.subObjects.push(new KGAuthor.Label({
                        text: "\\text{" + def.title + "}",
                        x: KGAuthor.averageDefs(graph.xScale.min, graph.xScale.max),
                        y: graph.yScale.min,
                        yPixelOffset: -40
                    }, graph));
                }
                else if (def.orient == 'left') {
                    a.subObjects.push(new KGAuthor.Label({
                        text: "\\text{" + def.title + "}",
                        x: graph.xScale.min,
                        y: KGAuthor.averageDefs(graph.yScale.min, graph.yScale.max),
                        xPixelOffset: -40,
                        rotate: 90
                    }, graph));
                }
                else if (def.orient == 'top') {
                    a.subObjects.push(new KGAuthor.Label({
                        text: "\\text{" + def.title + "}",
                        x: KGAuthor.averageDefs(graph.xScale.min, graph.xScale.max),
                        y: graph.yScale.max,
                        yPixelOffset: 40
                    }, graph));
                }
                else {
                    a.subObjects.push(new KGAuthor.Label({
                        text: "\\text{" + def.title + "}",
                        x: graph.xScale.max,
                        y: KGAuthor.averageDefs(graph.yScale.min, graph.yScale.max),
                        xPixelOffset: 40,
                        rotate: 270
                    }, graph));
                }
            }
            return _this;
        }
        return Axis;
    }(KGAuthor.GraphObject));
    KGAuthor.Axis = Axis;
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
                var gxDef = JSON.parse(JSON.stringify(def)), gyDef = JSON.parse(JSON.stringify(def));
                gxDef.a = [x, graph.yScale.min];
                gxDef.b = [x, graph.yScale.max];
                gyDef.a = [graph.xScale.min, y];
                gyDef.b = [graph.xScale.max, y];
                g.subObjects.push(new Segment(gxDef, graph));
                g.subObjects.push(new Segment(gyDef, graph));
            }
            return _this;
        }
        return Grid;
    }(KGAuthor.GraphObjectGenerator));
    KGAuthor.Grid = Grid;
    var Curve = /** @class */ (function (_super) {
        __extends(Curve, _super);
        function Curve(def, graph) {
            var _this = this;
            def = KGAuthor.setStrokeColor(def);
            if (def.hasOwnProperty('univariateFunctions')) {
                delete def.univariateFunctions;
            }
            _this = _super.call(this, def, graph) || this;
            _this.type = 'Curve';
            _this.layer = def.layer || 1;
            return _this;
        }
        return Curve;
    }(KGAuthor.GraphObject));
    KGAuthor.Curve = Curve;
    var Line = /** @class */ (function (_super) {
        __extends(Line, _super);
        function Line(def, graph) {
            var _this = this;
            var intercept = KGAuthor.subtractDefs(def.point[1], KGAuthor.multiplyDefs(def.slope, def.point[0]));
            def.univariateFunction = {
                fn: intercept + " + (" + def.slope + ")*x",
                samplePoints: 2
            };
            _this = _super.call(this, def, graph) || this;
            return _this;
        }
        return Line;
    }(Curve));
    KGAuthor.Line = Line;
    var Point = /** @class */ (function (_super) {
        __extends(Point, _super);
        function Point(def, graph) {
            var _this = this;
            def = KGAuthor.setFillColor(def);
            _this = _super.call(this, def, graph) || this;
            var p = _this;
            p.type = 'Point';
            p.layer = 3;
            p.extractCoordinates();
            if (def.hasOwnProperty('label')) {
                var labelDef = JSON.parse(JSON.stringify(def));
                delete labelDef.label;
                labelDef = KG.setDefaults(labelDef, def.label);
                labelDef = KG.setDefaults(labelDef, {
                    fontSize: 10,
                    position: 'bl',
                    color: def.color
                });
                p.subObjects.push(new KGAuthor.Label(labelDef, graph));
            }
            if (def.hasOwnProperty('droplines')) {
                if (def.droplines.hasOwnProperty('vertical')) {
                    var verticalDroplineDef = JSON.parse(JSON.stringify(def));
                    verticalDroplineDef.stroke = def.fill;
                    p.subObjects.push(new VerticalDropline(verticalDroplineDef, graph));
                    var xAxisLabelDef = JSON.parse(JSON.stringify(def));
                    xAxisLabelDef.y = 'AXIS';
                    KG.setDefaults(xAxisLabelDef, {
                        text: def.droplines.vertical,
                        fontSize: 10
                    });
                    p.subObjects.push(new KGAuthor.Label(xAxisLabelDef, graph));
                }
                if (def.droplines.hasOwnProperty('horizontal')) {
                    var horizontalDroplineDef = JSON.parse(JSON.stringify(def));
                    horizontalDroplineDef.stroke = def.fill;
                    p.subObjects.push(new HorizontalDropline(horizontalDroplineDef, graph));
                    var yAxisLabelDef = JSON.parse(JSON.stringify(def));
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
        return Point;
    }(KGAuthor.GraphObject));
    KGAuthor.Point = Point;
    var Segment = /** @class */ (function (_super) {
        __extends(Segment, _super);
        function Segment(def, graph) {
            var _this = this;
            def = KGAuthor.setStrokeColor(def);
            _this = _super.call(this, def, graph) || this;
            var s = _this;
            s.type = 'Segment';
            s.layer = 1;
            s.extractCoordinates('a', 'x1', 'y1');
            s.extractCoordinates('b', 'x2', 'y2');
            return _this;
        }
        return Segment;
    }(KGAuthor.GraphObject));
    KGAuthor.Segment = Segment;
    var CrossGraphSegment = /** @class */ (function (_super) {
        __extends(CrossGraphSegment, _super);
        function CrossGraphSegment(def, graph) {
            var _this = this;
            def.xScale2Name = '';
            _this = _super.call(this, def, graph) || this;
            return _this;
        }
        return CrossGraphSegment;
    }(Segment));
    KGAuthor.CrossGraphSegment = CrossGraphSegment;
    var Dropline = /** @class */ (function (_super) {
        __extends(Dropline, _super);
        function Dropline(def, graph) {
            var _this = this;
            def.lineStyle = 'dotted';
            _this = _super.call(this, def, graph) || this;
            return _this;
        }
        return Dropline;
    }(Segment));
    KGAuthor.Dropline = Dropline;
    var VerticalDropline = /** @class */ (function (_super) {
        __extends(VerticalDropline, _super);
        function VerticalDropline(def, graph) {
            var _this = this;
            def.a = [def.x, graph.yScale.min];
            def.b = [def.x, def.y];
            _this = _super.call(this, def, graph) || this;
            return _this;
        }
        return VerticalDropline;
    }(Dropline));
    KGAuthor.VerticalDropline = VerticalDropline;
    var CrossGraphVerticalDropline = /** @class */ (function (_super) {
        __extends(CrossGraphVerticalDropline, _super);
        function CrossGraphVerticalDropline(def, graph) {
            var _this = this;
            def.xScale2Name = '';
            _this = _super.call(this, def, graph) || this;
            return _this;
        }
        return CrossGraphVerticalDropline;
    }(VerticalDropline));
    KGAuthor.CrossGraphVerticalDropline = CrossGraphVerticalDropline;
    var HorizontalDropline = /** @class */ (function (_super) {
        __extends(HorizontalDropline, _super);
        function HorizontalDropline(def, graph) {
            var _this = this;
            def.a = [graph.xScale.min, def.y];
            def.b = [def.x, def.y];
            _this = _super.call(this, def, graph) || this;
            return _this;
        }
        return HorizontalDropline;
    }(Dropline));
    KGAuthor.HorizontalDropline = HorizontalDropline;
    var CrossGraphHorizontalDropline = /** @class */ (function (_super) {
        __extends(CrossGraphHorizontalDropline, _super);
        function CrossGraphHorizontalDropline(def, graph) {
            var _this = this;
            def.xScale2Name = '';
            _this = _super.call(this, def, graph) || this;
            return _this;
        }
        return CrossGraphHorizontalDropline;
    }(HorizontalDropline));
    KGAuthor.CrossGraphHorizontalDropline = CrossGraphHorizontalDropline;
    var Rectangle = /** @class */ (function (_super) {
        __extends(Rectangle, _super);
        function Rectangle(def, graph) {
            var _this = _super.call(this, def, graph) || this;
            _this.type = 'Rectangle';
            _this.layer = def.layer || 0;
            _this.extractCoordinates('a', 'x1', 'y1');
            _this.extractCoordinates('b', 'x2', 'y2');
            return _this;
        }
        return Rectangle;
    }(KGAuthor.GraphObject));
    KGAuthor.Rectangle = Rectangle;
    var Area = /** @class */ (function (_super) {
        __extends(Area, _super);
        function Area(def, graph) {
            var _this = this;
            if (def.hasOwnProperty('univariateFunctions')) {
                delete def.univariateFunctions;
            }
            _this = _super.call(this, def, graph) || this;
            _this.type = 'Area';
            _this.layer = def.layer || 0;
            return _this;
        }
        return Area;
    }(KGAuthor.GraphObject));
    KGAuthor.Area = Area;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kg.ts" />
var KGAuthor;
(function (KGAuthor) {
    var Layout = /** @class */ (function (_super) {
        __extends(Layout, _super);
        function Layout() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Layout.prototype.parseSelf = function (parsedData) {
            parsedData.aspectRatio = 2;
            return parsedData;
        };
        return Layout;
    }(KGAuthor.AuthoringObject));
    KGAuthor.Layout = Layout;
    var SquareLayout = /** @class */ (function (_super) {
        __extends(SquareLayout, _super);
        function SquareLayout() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // creates a square layout (aspect ratio of 1)
        SquareLayout.prototype.parseSelf = function (parsedData) {
            parsedData.aspectRatio = 1.22;
            return parsedData;
        };
        return SquareLayout;
    }(Layout));
    KGAuthor.SquareLayout = SquareLayout;
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
    }(SquareLayout));
    KGAuthor.OneGraph = OneGraph;
    var SquarePlusSidebarLayout = /** @class */ (function (_super) {
        __extends(SquarePlusSidebarLayout, _super);
        function SquarePlusSidebarLayout() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // creates a square within the main body of the text
        // to make a square graph, the ratio of width to height should be 0.82
        SquarePlusSidebarLayout.prototype.parseSelf = function (parsedData) {
            parsedData.aspectRatio = 1.22;
            return parsedData;
        };
        return SquarePlusSidebarLayout;
    }(Layout));
    KGAuthor.SquarePlusSidebarLayout = SquarePlusSidebarLayout;
    var TwoHorizontalGraphs = /** @class */ (function (_super) {
        __extends(TwoHorizontalGraphs, _super);
        function TwoHorizontalGraphs(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var leftGraphDef = def['leftGraph'], rightGraphDef = def['rightGraph'];
            leftGraphDef.position = {
                "x": 0.05,
                "y": 0.025,
                "width": 0.45,
                "height": 0.9
            };
            rightGraphDef.position = {
                "x": 0.55,
                "y": 0.025,
                "width": 0.45,
                "height": 0.9
            };
            l.subObjects.push(new KGAuthor.Graph(leftGraphDef));
            l.subObjects.push(new KGAuthor.Graph(rightGraphDef));
            return _this;
        }
        return TwoHorizontalGraphs;
    }(Layout));
    KGAuthor.TwoHorizontalGraphs = TwoHorizontalGraphs;
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
    }(SquarePlusSidebarLayout));
    KGAuthor.TwoVerticalGraphsPlusSidebar = TwoVerticalGraphsPlusSidebar;
    var WideRectanglePlusSidebarLayout = /** @class */ (function (_super) {
        __extends(WideRectanglePlusSidebarLayout, _super);
        function WideRectanglePlusSidebarLayout() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // creates a rectangle, twice as wide as it is high, within the main body of the text
        // to make a square graph, the ratio of width to height should be 0.41
        WideRectanglePlusSidebarLayout.prototype.parseSelf = function (parsedData) {
            parsedData.aspectRatio = 2.44;
            return parsedData;
        };
        return WideRectanglePlusSidebarLayout;
    }(Layout));
    KGAuthor.WideRectanglePlusSidebarLayout = WideRectanglePlusSidebarLayout;
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
    }(SquarePlusSidebarLayout));
    KGAuthor.OneGraphPlusSidebar = OneGraphPlusSidebar;
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
    }(SquarePlusSidebarLayout));
    KGAuthor.GeoGebraPlusSidebar = GeoGebraPlusSidebar;
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
    }(Layout));
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
    }(WideRectanglePlusSidebarLayout));
    KGAuthor.GeoGebraPlusGraphPlusSidebar = GeoGebraPlusGraphPlusSidebar;
    var TwoHorizontalGraphsPlusSidebar = /** @class */ (function (_super) {
        __extends(TwoHorizontalGraphsPlusSidebar, _super);
        function TwoHorizontalGraphsPlusSidebar(def) {
            var _this = _super.call(this, def) || this;
            var l = _this;
            var leftGraphDef = def['leftGraph'], rightGraphDef = def['rightGraph'], sidebarDef = def['sidebar'];
            leftGraphDef.position = {
                "x": 0.1,
                "y": 0.025,
                "width": 0.369,
                "height": 0.9
            };
            rightGraphDef.position = {
                "x": 0.6,
                "y": 0.025,
                "width": 0.369,
                "height": 0.9
            };
            var leftGraph = new KGAuthor.Graph(leftGraphDef), rightGraph = new KGAuthor.Graph(rightGraphDef), sidebar = new KGAuthor.Sidebar(sidebarDef);
            l.subObjects.push(leftGraph);
            l.subObjects.push(rightGraph);
            l.subObjects.push(sidebar);
            return _this;
        }
        return TwoHorizontalGraphsPlusSidebar;
    }(WideRectanglePlusSidebarLayout));
    KGAuthor.TwoHorizontalGraphsPlusSidebar = TwoHorizontalGraphsPlusSidebar;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var EconBudgetLine = /** @class */ (function (_super) {
        __extends(EconBudgetLine, _super);
        function EconBudgetLine(def, graph) {
            var _this = this;
            def = KGAuthor.setStrokeColor(def);
            // may define income either by income m or value of endowment point
            def.m = def.m || KGAuthor.addDefs(KGAuthor.multiplyDefs(def.p1, def.point[0]), KGAuthor.multiplyDefs(def.p2, def.point[1]));
            var xIntercept = KGAuthor.divideDefs(def.m, def.p1), yIntercept = KGAuthor.divideDefs(def.m, def.p2), priceRatio = KGAuthor.divideDefs(def.p1, def.p2);
            KG.setDefaults(def, {
                a: [xIntercept, 0],
                b: [0, yIntercept],
                stroke: 'colors.budget',
                strokeWidth: 2,
                label: 'BL',
                lineStyle: 'solid'
            });
            if (def.draggable && typeof (def.m) == 'string') {
                def.drag = [{
                        'directions': 'xy',
                        'param': KGAuthor.paramName(def.m),
                        'expression': KGAuthor.addDefs(KGAuthor.multiplyDefs('drag.x', def.p1), KGAuthor.multiplyDefs('drag.y', def.p2))
                    }];
            }
            _this = _super.call(this, def, graph) || this;
            var bl = _this;
            bl.p1 = def.p1;
            bl.p2 = def.p2;
            bl.m = def.m;
            bl.xIntercept = xIntercept;
            bl.yIntercept = yIntercept;
            if (graph) {
                var subObjects = bl.subObjects;
                var xInterceptPointDef = {
                    coordinates: [xIntercept, 0],
                    fill: def.stroke,
                    r: 4
                };
                if (def.draggable && typeof (def.p1) == 'string') {
                    xInterceptPointDef['drag'] = [{
                            directions: 'x',
                            param: KGAuthor.paramName(def.p1),
                            expression: KGAuthor.divideDefs(def.m, 'drag.x')
                        }];
                }
                bl.xInterceptPoint = new KGAuthor.Point(xInterceptPointDef, graph);
                var yInterceptPointDef = {
                    coordinates: [0, yIntercept],
                    fill: def.stroke,
                    r: 4
                };
                if (def.draggable && typeof (def.p2) == 'string') {
                    yInterceptPointDef['drag'] = [{
                            directions: 'y',
                            param: KGAuthor.paramName(def.p2),
                            expression: KGAuthor.divideDefs(def.m, 'drag.y')
                        }];
                }
                bl.yInterceptPoint = new KGAuthor.Point(yInterceptPointDef, graph);
                bl.budgetSetArea = new KGAuthor.Area({
                    fill: "colors.budget",
                    univariateFunction1: {
                        fn: yIntercept + " - " + priceRatio + "*x",
                        samplePoints: 2,
                        max: xIntercept
                    },
                    show: def.set
                }, graph);
                bl.costlierArea = new KGAuthor.Area({
                    fill: "colors.costlier",
                    univariateFunction1: {
                        fn: yIntercept + " - " + priceRatio + "*x",
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
        return EconBudgetLine;
    }(KGAuthor.Segment));
    KGAuthor.EconBudgetLine = EconBudgetLine;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var UtilityFunction = /** @class */ (function (_super) {
        __extends(UtilityFunction, _super);
        function UtilityFunction(def) {
            var _this = this;
            KG.setDefaults(def, {
                name: KG.randomString(10)
            });
            _this = _super.call(this, def) || this;
            var fn = _this;
            fn.interpolation = 'curveMonotoneX';
            if (def.hasOwnProperty('alpha')) {
                fn.alpha = def.alpha;
                fn.exponents = [def.alpha, KGAuthor.subtractDefs(1, def.alpha)];
                fn.coefficients = [def.alpha, KGAuthor.subtractDefs(1, def.alpha)];
            }
            else if (def.hasOwnProperty('exponents')) {
                fn.exponents = def.exponents;
                fn.alpha = KGAuthor.divideDefs(fn.exponents[0], KGAuthor.addDefs(fn.exponents[0], fn.exponents[1]));
            }
            else if (def.hasOwnProperty('coefficients')) {
                fn.coefficients = def.coefficients;
                fn.alpha = KGAuthor.divideDefs(fn.coefficients[0], KGAuthor.addDefs(fn.coefficients[0], fn.coefficients[1]));
            }
            return _this;
        }
        UtilityFunction.prototype.value = function (x) {
            return null;
        };
        UtilityFunction.prototype.extractLevel = function (def) {
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
        UtilityFunction.prototype.levelSet = function (def) {
            return [];
        };
        UtilityFunction.prototype.levelCurve = function (def, graph) {
            def.interpolation = this.interpolation;
            return KGAuthor.curvesFromFunctions(this.levelSet(def), def, graph);
        };
        UtilityFunction.prototype.areaBelowLevelCurve = function (def, graph) {
            var fn = this;
            fn.fillBelowRect = null;
            def.interpolation = fn.interpolation;
            var fns = fn.levelSet(def);
            var objs = [];
            fns.forEach(function (fn) {
                var areaDef = JSON.parse(JSON.stringify(def));
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
        UtilityFunction.prototype.areaAboveLevelCurve = function (def, graph) {
            var fn = this;
            fn.fillAboveRect = null;
            def.interpolation = fn.interpolation;
            var fns = fn.levelSet(def);
            var objs = [];
            fns.forEach(function (fn) {
                var areaDef = JSON.parse(JSON.stringify(def));
                areaDef.univariateFunction1 = fn;
                areaDef.above = true;
                objs.push(new KGAuthor.Area(areaDef, graph));
            });
            if (fn.fillAboveRect) {
                fn.fillAboveRect.show = def.show;
                fn.fillAboveRect.fill = def.fill;
                fn.fillAboveRect.inClipPath = true;
                objs.push(new KGAuthor.Rectangle(fn.fillAboveRect, graph));
            }
            var clipPathName = KG.randomString(10);
            return [
                new KGAuthor.Rectangle({
                    clipPathName: clipPathName,
                    x1: graph.def.xAxis.min,
                    x2: graph.def.xAxis.max,
                    y1: graph.def.yAxis.min,
                    y2: graph.def.yAxis.max,
                    show: def.show
                }, graph),
                new KGAuthor.ClipPath({
                    "name": clipPathName,
                    "paths": objs
                }, graph)
            ];
        };
        UtilityFunction.prototype.cornerCondition = function (budgetLine) {
            return 'false';
        };
        UtilityFunction.prototype.lagrangeBundle = function (budgetLine) {
            return [];
        };
        UtilityFunction.prototype.optimalBundle = function (budgetLine) {
            return [];
        };
        UtilityFunction.prototype.lowestCostBundle = function (level, prices) {
            return []; // defined at the subclass level
        };
        UtilityFunction.prototype.priceOfferFunction = function (budgetLine, good, min, max, graph) {
            var u = this, blDef = (good == 1) ? { p1: 't', p2: budgetLine.p2, m: budgetLine.m } : {
                p1: budgetLine.p1,
                p2: 't',
                m: budgetLine.m
            }, optimalBundle = u.optimalBundle(new KGAuthor.EconBudgetLine(blDef, graph));
            return [
                {
                    xFunction: optimalBundle[0],
                    yFunction: optimalBundle[1],
                    min: min,
                    max: max,
                    samplePoints: 30,
                    parametric: true
                }
            ];
        };
        UtilityFunction.prototype.priceOfferCurve = function (budgetLine, good, min, max, def, graph) {
            var u = this;
            def.interpolation = 'curveMonotoneX';
            return KGAuthor.curvesFromFunctions(u.priceOfferFunction(budgetLine, good, min, max, graph), def, graph);
        };
        UtilityFunction.prototype.demandFunction = function (budgetLine, good, graph) {
            var u = this, blDef = (good == 1) ? { p1: 'y', p2: budgetLine.p2, m: budgetLine.m } : {
                p1: budgetLine.p1,
                p2: 'y',
                m: budgetLine.m
            };
            return [
                {
                    "fn": u.optimalBundle(new KGAuthor.EconBudgetLine(blDef, graph))[good - 1],
                    "ind": "y",
                    "samplePoints": 30
                }
            ];
        };
        UtilityFunction.prototype.demandCurve = function (budgetLine, good, def, graph) {
            var u = this;
            def.interpolation = 'curveMonotoneX';
            return KGAuthor.curvesFromFunctions(u.demandFunction(budgetLine, good, graph), def, graph);
        };
        UtilityFunction.prototype.quantityDemanded = function (budgetLine, good) {
            return this.optimalBundle(budgetLine)[good - 1];
        };
        UtilityFunction.prototype.indirectUtility = function (income, prices) {
            return this.extractLevel({ budgetLine: { p1: prices[0], p2: prices[1], m: income } });
        };
        UtilityFunction.prototype.expenditure = function (level, prices) {
            var b = this.lowestCostBundle(level, prices);
            return KGAuthor.addDefs(KGAuthor.multiplyDefs(b[0], prices[0]), KGAuthor.multiplyDefs(b[1], prices[1]));
        };
        return UtilityFunction;
    }(KGAuthor.AuthoringObject));
    KGAuthor.UtilityFunction = UtilityFunction;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var CobbDouglasFunction = /** @class */ (function (_super) {
        __extends(CobbDouglasFunction, _super);
        function CobbDouglasFunction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CobbDouglasFunction.prototype.value = function (x) {
            var e = this.exponents;
            return "((" + x[0] + ")^(" + e[0] + "))*((" + x[1] + ")^(" + e[1] + "))";
        };
        CobbDouglasFunction.prototype.levelSet = function (def) {
            var e = this.exponents, level = this.extractLevel(def), xMin = "(" + level + ")^(1/(" + e[0] + " + " + e[1] + "))", yMin = "(" + level + ")^(1/(" + e[0] + " + " + e[1] + "))";
            this.fillBelowRect = {
                x1: 0,
                x2: xMin,
                y1: 0,
                y2: yMin,
                show: def.show
            };
            return [
                {
                    "fn": "(" + level + "/y^(" + e[1] + "))^(1/(" + e[0] + "))",
                    "ind": "y",
                    "min": yMin,
                    "samplePoints": 30
                },
                {
                    "fn": "(" + level + "/x^(" + e[0] + "))^(1/(" + e[1] + "))",
                    "ind": "x",
                    "min": xMin,
                    "samplePoints": 30
                }
            ];
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
        return CobbDouglasFunction;
    }(KGAuthor.UtilityFunction));
    KGAuthor.CobbDouglasFunction = CobbDouglasFunction;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
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
            console.log('foo');
            return "(min((" + x[0] + ")*(" + c[0] + "),(" + x[1] + ")*(" + c[1] + ")))";
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
    }(KGAuthor.UtilityFunction));
    KGAuthor.MinFunction = MinFunction;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
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
            return "((" + x[0] + ")*(" + c[0] + ")+(" + x[1] + ")*(" + c[1] + "))";
        };
        LinearFunction.prototype.levelSet = function (def) {
            var c = this.coefficients, level = def.level || this.value(def.point);
            return [
                {
                    "fn": "(" + level + " - (" + c[0] + ")*x)/(" + c[1] + ")",
                    "ind": "x",
                    "samplePoints": 2
                }
            ];
        };
        return LinearFunction;
    }(KGAuthor.UtilityFunction));
    KGAuthor.LinearFunction = LinearFunction;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var CES = /** @class */ (function (_super) {
        __extends(CES, _super);
        function CES(def) {
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
        CES.prototype.parseSelf = function (parsedData) {
            var u = this, a = KGAuthor.getDefinitionProperty(u.alpha), r = KGAuthor.getDefinitionProperty(u.r), b = KGAuthor.subtractDefs(1, u.alpha);
            parsedData.calcs[u.name] = {
                xFunction: 'foo'
            };
            return parsedData;
        };
        CES.prototype.value = function (x) {
            var c = this.coefficients, r = this.r;
            return "((params.r == 0) ? (" + KGAuthor.multiplyDefs(KGAuthor.raiseDefToDef(x[0], c[0]), KGAuthor.raiseDefToDef(x[1], c[1])) + ") : (" + KGAuthor.raiseDefToDef(KGAuthor.addDefs(KGAuthor.multiplyDefs(c[0], KGAuthor.raiseDefToDef(x[0], r)), KGAuthor.multiplyDefs(c[1], KGAuthor.raiseDefToDef(x[1], r))), KGAuthor.divideDefs(1, r)) + "))";
        };
        CES.prototype.levelSet = function (def) {
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
                    "fn": "((" + r + " == 0) ? (" + level + "/x^(" + a + "))^(1/(" + b + ")) : ((" + level + "^" + r + " - " + a + "*x^" + r + ")/" + b + ")^(1/" + r + "))",
                    "ind": "x",
                    "min": level,
                    "samplePoints": 60
                },
                {
                    "fn": "((" + r + " == 0) ? (" + level + "/y^( " + b + "))^(1/(" + a + ")) : ((" + level + "^" + r + " - " + b + "*y^" + r + ")/" + a + ")^(1/" + r + "))",
                    "ind": "y",
                    "min": level,
                    "samplePoints": 60
                }
            ];
        };
        // see http://www.gamsworld.org/mpsge/debreu/ces.pdf
        CES.prototype.optimalBundle = function (budgetLine) {
            var s = this.s, oneMinusS = KGAuthor.subtractDefs(1, s), a = this.alpha, oneMinusA = KGAuthor.subtractDefs(1, a), theta = KGAuthor.divideDefs(budgetLine.m, KGAuthor.addDefs(KGAuthor.multiplyDefs(KGAuthor.raiseDefToDef(a, s), KGAuthor.raiseDefToDef(budgetLine.p1, oneMinusS)), KGAuthor.multiplyDefs(KGAuthor.raiseDefToDef(oneMinusA, s), KGAuthor.raiseDefToDef(budgetLine.p2, oneMinusS)))), optimalX1 = "(" + this.r + " == 0) ? " + KGAuthor.multiplyDefs(a, budgetLine.xIntercept) + " : " + KGAuthor.multiplyDefs(KGAuthor.raiseDefToDef(KGAuthor.divideDefs(a, budgetLine.p1), s), theta), optimalX2 = "(" + this.r + " == 0) ? " + KGAuthor.multiplyDefs(oneMinusA, budgetLine.yIntercept) + " : " + KGAuthor.multiplyDefs(KGAuthor.raiseDefToDef(KGAuthor.divideDefs(oneMinusA, budgetLine.p2), s), theta);
            return [optimalX1, optimalX2];
        };
        CES.prototype.denominator = function (p1, p2) {
            var a1 = this.alpha, a2 = KGAuthor.subtractDefs(1, a1), r = this.r, pOverA1 = KGAuthor.divideDefs(p1, a1), pOverA2 = KGAuthor.divideDefs(p2, a2), oneOverR = KGAuthor.divideDefs(1, r), rOverRminusOne = KGAuthor.divideDefs(r, KGAuthor.subtractDefs(r, 1));
            return KGAuthor.raiseDefToDef(KGAuthor.addDefs(KGAuthor.multiplyDefs(a1, KGAuthor.raiseDefToDef(pOverA1, rOverRminusOne)), KGAuthor.multiplyDefs(a2, KGAuthor.raiseDefToDef(pOverA2, rOverRminusOne))), oneOverR);
        };
        // see http://personal.stthomas.edu/csmarcott/ec418/ces_cost_minimization.pdf
        CES.prototype.lowestCostBundle = function (level, prices) {
            var a1 = this.alpha, a2 = KGAuthor.subtractDefs(1, a1), p1 = prices[0], p2 = prices[1], r = this.r, pOverA1 = KGAuthor.divideDefs(p1, a1), pOverA2 = KGAuthor.divideDefs(p2, a2), oneOverRminusOne = KGAuthor.divideDefs(1, KGAuthor.subtractDefs(r, 1)), denominator = this.denominator(p1, p2), numerator1 = KGAuthor.raiseDefToDef(pOverA1, oneOverRminusOne), numerator2 = KGAuthor.raiseDefToDef(pOverA2, oneOverRminusOne);
            console.log('denominator', denominator);
            console.log('numerator1', numerator1);
            console.log('numerator2', numerator2);
            return [
                KGAuthor.divideDefs(KGAuthor.multiplyDefs(level, numerator1), denominator),
                KGAuthor.divideDefs(KGAuthor.multiplyDefs(level, numerator2), denominator)
            ];
        };
        return CES;
    }(KGAuthor.UtilityFunction));
    KGAuthor.CES = CES;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var ConcaveUtility = /** @class */ (function (_super) {
        __extends(ConcaveUtility, _super);
        function ConcaveUtility() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ConcaveUtility.prototype.value = function (x) {
            var c = this.coefficients;
            return "(" + c[0] + ")*(" + x[0] + ")^2+(" + c[1] + ")*(" + x[1] + ")^2";
        };
        ConcaveUtility.prototype.levelSet = function (def) {
            var c = this.coefficients, level = def.level || this.value(def.point), max = "((" + level + ")/(" + c[0] + "+" + c[1] + "))^(0.5)";
            this.fillAboveRect = {
                x1: max,
                x2: 50,
                y1: max,
                y2: 50,
                show: def.show
            };
            return [
                {
                    "fn": "((" + level + "-(" + c[1] + ")*y*y)/(" + c[0] + "))^(0.5)",
                    "ind": "y",
                    "min": 0,
                    "max": max,
                    "samplePoints": 30
                },
                {
                    "fn": "((" + level + "-(" + c[0] + ")*x*x)/(" + c[1] + "))^(0.5)",
                    "ind": "x",
                    "min": 0,
                    "max": max,
                    "samplePoints": 30
                }
            ];
        };
        return ConcaveUtility;
    }(KGAuthor.UtilityFunction));
    KGAuthor.ConcaveUtility = ConcaveUtility;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var QuasilinearFunction = /** @class */ (function (_super) {
        __extends(QuasilinearFunction, _super);
        function QuasilinearFunction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        QuasilinearFunction.prototype.value = function (x) {
            var c = this.coefficients;
            return "(" + c[0] + "*log(" + x[0] + ")+" + x[1] + ")";
        };
        QuasilinearFunction.prototype.levelSet = function (def) {
            var c = this.coefficients, level = this.extractLevel(def);
            return [
                {
                    "fn": "((" + level + ")-(" + c[0] + ")*log(x))",
                    "ind": "x",
                    "samplePoints": 100
                }
            ];
        };
        QuasilinearFunction.prototype.cornerCondition = function (budgetLine) {
            return "(" + this.lagrangeBundle(budgetLine)[1] + " < 0)";
        };
        QuasilinearFunction.prototype.lagrangeBundle = function (budgetLine) {
            var c = this.coefficients;
            return [KGAuthor.divideDefs(KGAuthor.multiplyDefs(c[0], budgetLine.p2), budgetLine.p1), KGAuthor.subtractDefs(budgetLine.yIntercept, c[0])];
        };
        QuasilinearFunction.prototype.optimalBundle = function (budgetLine) {
            var lagr = this.lagrangeBundle(budgetLine), cornerCondition = this.cornerCondition(budgetLine);
            return ["(" + cornerCondition + " ? " + budgetLine.xIntercept + " : " + lagr[0] + ")", "(" + cornerCondition + " ? 0 : " + lagr[1] + ")"];
        };
        return QuasilinearFunction;
    }(KGAuthor.UtilityFunction));
    KGAuthor.QuasilinearFunction = QuasilinearFunction;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    function getUtilityFunction(def) {
        if (def != undefined) {
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
                return new KGAuthor.ConcaveUtility(def.def);
            }
            else if (def.type == 'Quasilinear') {
                return new KGAuthor.QuasilinearFunction(def.def);
            }
            else if (def.type == 'CES') {
                return new KGAuthor.CES(def.def);
            }
        }
    }
    KGAuthor.getUtilityFunction = getUtilityFunction;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../../../eg.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var EconIndifferenceCurve = /** @class */ (function (_super) {
        __extends(EconIndifferenceCurve, _super);
        function EconIndifferenceCurve(def, graph) {
            var _this = this;
            if (def.inMap) {
                def.strokeWidth = 1;
                def.stroke = 'lightgrey';
                def.layer = 0;
            }
            KG.setDefaults(def, {
                strokeWidth: 2,
                color: 'colors.utility',
                layer: 1,
                showPreferred: false,
                showDispreferred: false,
                inMap: false
            });
            _this = _super.call(this, def, graph) || this;
            var curve = _this;
            var utilityFunction = KGAuthor.extractUtilityFunction(def);
            if (Array.isArray(def.utilityFunction.type)) {
                curve.subObjects = def.utilityFunction.map(function (u) {
                    var uDef = JSON.parse(JSON.stringify(def));
                    uDef.utilityFunction.type = u;
                    return utilityFunction.levelCurve(uDef, graph);
                });
            }
            else {
                curve.subObjects = utilityFunction.levelCurve(def, graph);
                if (!def.inMap) {
                    if (!!def.showPreferred) {
                        var preferredDef = JSON.parse(JSON.stringify(def));
                        preferredDef.fill = 'colors.preferred';
                        preferredDef.show = def.showPreferred;
                        curve.subObjects = curve.subObjects.concat(utilityFunction.areaAboveLevelCurve(preferredDef, graph));
                    }
                    if (!!def.showDispreferred) {
                        var dispreferredDef = JSON.parse(JSON.stringify(def));
                        dispreferredDef.fill = 'colors.dispreferred';
                        dispreferredDef.show = def.showDispreferred;
                        curve.subObjects = curve.subObjects.concat(utilityFunction.areaBelowLevelCurve(dispreferredDef, graph));
                    }
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
                var icDef = JSON.parse(JSON.stringify(def));
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
                name: KG.randomString(10),
                label: { text: 'X' },
                indifferenceCurveLabel: { text: 'U' },
                droplines: {
                    vertical: "x_1",
                    horizontal: "x_2"
                },
                showIndifferenceCurve: false,
                showPreferred: false,
                showDispreferred: false,
                color: "colors.utility"
            });
            KGAuthor.setFillColor(def);
            _this = _super.call(this, def, graph) || this;
            var bundle = _this;
            var budgetLine = KGAuthor.extractBudgetLine(def, graph);
            if (budgetLine) {
                _this.subObjects.push(budgetLine);
            }
            bundle.utilityFunction = extractUtilityFunction(def);
            if (bundle.utilityFunction) {
                _this.subObjects.push(bundle.utilityFunction);
                var indifferenceCurveDef = JSON.parse(JSON.stringify(def));
                delete indifferenceCurveDef.stroke;
                delete indifferenceCurveDef.color;
                indifferenceCurveDef = KG.setDefaults(indifferenceCurveDef, {
                    label: def.indifferenceCurveLabel,
                    level: "calcs." + bundle.name + ".level",
                    show: def.showIndifferenceCurve,
                    color: def.indifferenceCurveColor || 'colors.utility'
                });
                _this.subObjects.push(new KGAuthor.EconIndifferenceCurve(indifferenceCurveDef, graph));
            }
            return _this;
        }
        EconBundle.prototype.parseSelf = function (parsedData) {
            var bundle = this;
            parsedData = _super.prototype.parseSelf.call(this, parsedData);
            parsedData.calcs[bundle.name] = {
                x: bundle.x,
                y: bundle.y,
                level: bundle.utilityFunction ? bundle.utilityFunction.value([bundle.x, bundle.y]) : ''
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
    function extractBudgetLine(def, graph) {
        if (def.hasOwnProperty('budgetLineObject')) {
            return def.budgetLineObject;
        }
        if (def.hasOwnProperty('budgetLine')) {
            var budgetDef = JSON.parse(JSON.stringify(def.budgetLine));
            budgetDef.show = def.showBudgetLine;
            return new KGAuthor.EconBudgetLine(budgetDef, graph);
        }
        console.log('tried to instantiate a budget line without either a budget line def or object');
    }
    KGAuthor.extractBudgetLine = extractBudgetLine;
    var EconOptimalBundle = /** @class */ (function (_super) {
        __extends(EconOptimalBundle, _super);
        function EconOptimalBundle(def, graph) {
            var _this = this;
            var bl = extractBudgetLine(def, graph), u = KGAuthor.extractUtilityFunction(def), coords = u.optimalBundle(bl);
            KG.setDefaults(def, {
                coordinates: coords,
                label: { text: 'X^*' },
                color: bl.color,
                indifferenceCurveLabel: { text: 'U^*' },
                budgetLineLabel: { text: 'BL' },
                droplines: {
                    vertical: "x_1^*",
                    horizontal: "x_2^*"
                },
                showIndifferenceCurve: true,
                showBudgetLine: true
            });
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
            var _this = this;
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
            _this = _super.call(this, def, graph) || this;
            return _this;
        }
        return EconLagrangeBundle;
    }(EconOptimalBundle));
    KGAuthor.EconLagrangeBundle = EconLagrangeBundle;
    var LowestCostBundle = /** @class */ (function (_super) {
        __extends(LowestCostBundle, _super);
        function LowestCostBundle(def, graph) {
            var _this = this;
            var u = KGAuthor.extractUtilityFunction(def), p1 = def.prices[0], p2 = def.prices[1], m = u.expenditure(def.level, def.prices);
            delete def.prices;
            delete def.level;
            def.budgetLine = {
                p1: p1,
                p2: p2,
                m: m
            };
            _this = _super.call(this, def, graph) || this;
            return _this;
        }
        return LowestCostBundle;
    }(EconOptimalBundle));
    KGAuthor.LowestCostBundle = LowestCostBundle;
    var EconSlutskyBundle = /** @class */ (function (_super) {
        __extends(EconSlutskyBundle, _super);
        function EconSlutskyBundle(def, graph) {
            var _this = this;
            var bl = extractBudgetLine(def, graph), u = KGAuthor.extractUtilityFunction(def);
            def.budgetLine = def.budgetLine || {};
            if (def.hasOwnProperty('p1')) {
                def.budgetLine.p1 = def.p1;
                delete def.budgetLine.m;
            }
            if (def.hasOwnProperty('p2')) {
                def.budgetLine.p2 = def.p2;
                delete def.budgetLine.m;
            }
            def.budgetLine.point = u.optimalBundle(bl);
            delete def.budgetLineObject;
            _this = _super.call(this, def, graph) || this;
            return _this;
        }
        return EconSlutskyBundle;
    }(EconOptimalBundle));
    KGAuthor.EconSlutskyBundle = EconSlutskyBundle;
    var EconHicksBundle = /** @class */ (function (_super) {
        __extends(EconHicksBundle, _super);
        function EconHicksBundle(def, graph) {
            var _this = this;
            var bl = extractBudgetLine(def, graph), u = KGAuthor.extractUtilityFunction(def), p1 = def.hasOwnProperty('p1') ? def.p1 : def.budgetLine.p1, p2 = def.hasOwnProperty('p2') ? def.p2 : def.budgetLine.p2, level = u.value(u.optimalBundle(bl));
            def.budgetLine.p1 = p1;
            def.budgetLine.p2 = p2;
            def.budgetLine.m = u.expenditure(level, [p1, p2]);
            def.coordinates = u.lowestCostBundle(level, [p1, p2]);
            delete def.budgetLineObject;
            _this = _super.call(this, def, graph) || this;
            return _this;
        }
        return EconHicksBundle;
    }(EconOptimalBundle));
    KGAuthor.EconHicksBundle = EconHicksBundle;
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
            var _this = this;
            if (def.hasOwnProperty('utilityFunction') && def.hasOwnProperty('budgetLine')) {
                var u = KGAuthor.getUtilityFunction(def.utilityFunction), bl = new KGAuthor.EconBudgetLine(def.budgetLine, graph);
                KG.setDefaults(def, {
                    coordinates: [u.quantityDemanded(bl, def.good), bl['p' + def.good]],
                    fill: 'colors.demand',
                    label: { text: "x_" + def.good + "(p_" + def.good + "|p_" + (3 - def.good) + ",m)" },
                    droplines: { vertical: "x_" + def.good + "^*" }
                });
            }
            else {
                console.log('oops, need to define an EconOptimalBundle with a utility function and budget line.');
            }
            _this = _super.call(this, def, graph) || this;
            return _this;
        }
        return EconDemandPoint;
    }(KGAuthor.Point));
    KGAuthor.EconDemandPoint = EconDemandPoint;
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
/// <reference path="../../kg.ts"/>
/* MICRO */
/* Consumer Theory */
/// <reference path="micro/consumer_theory/constraints/budgetLine.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/twoGoodUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/cobbDouglasUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/complementsUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/substitutesUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/cesUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/concaveUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/quasilinearUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/utilitySelector.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/indifferenceCurve.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/bundle.ts"/>
/// <reference path="micro/consumer_theory/optimization/optimalBundle.ts"/>
/// <reference path="micro/consumer_theory/optimization/demandCurve.ts"/>
var KGAuthor;
(function (KGAuthor) {
    var EconSchema = /** @class */ (function (_super) {
        __extends(EconSchema, _super);
        function EconSchema(def) {
            var _this = this;
            def.colors = {
                // consumer theory
                utility: 'purple',
                mrs: 'blue',
                dispreferred: 'red',
                preferred: 'purple',
                offer: 'blue',
                incomeOffer: 'orange',
                demand: 'blue',
                budget: 'green',
                costlier: 'red',
                // producer theory
                production: 'blue',
                marginalCost: 'orange',
                supply: 'orange',
                // equilibrium
                price: 'grey',
                // macro
                consumption: 'blue',
                depreciation: "red",
                savings: "green",
                tax: 'red'
            };
            _this = _super.call(this, def) || this;
            return _this;
        }
        return EconSchema;
    }(KGAuthor.Schema));
    KGAuthor.EconSchema = EconSchema;
})(KGAuthor || (KGAuthor = {}));
/// <reference path="../kg.ts" />
var KG;
(function (KG) {
    var Model = /** @class */ (function () {
        function Model(parsedData) {
            var model = this;
            model.params = parsedData.params.map(function (def) {
                return new KG.Param(def);
            });
            model.calcs = parsedData.calcs;
            model.colors = parsedData.colors;
            model.restrictions = (parsedData.restrictions || []).map(function (def) {
                return new KG.Restriction(def);
            });
            model.updateListeners = [];
            model.currentParamValues = model.evalParams();
            model.currentCalcValues = model.evalObject(model.calcs);
            model.currentColors = model.evalObject(model.colors);
        }
        Model.prototype.addUpdateListener = function (updateListener) {
            this.updateListeners.push(updateListener);
            return this;
        };
        Model.prototype.evalParams = function () {
            var p = {};
            this.params.forEach(function (param) {
                p[param.name] = param.value;
            });
            return p;
        };
        Model.prototype.evalObject = function (obj) {
            var model = this;
            var newObj = {};
            for (var stringOrObj in obj) {
                var def = obj[stringOrObj];
                if (typeof def === 'string') {
                    newObj[stringOrObj] = model.eval(def);
                }
                else {
                    newObj[stringOrObj] = model.evalObject(def);
                }
            }
            return newObj;
        };
        // the model serves as a model, and can evaluate expressions within the context of that model
        Model.prototype.eval = function (name) {
            var model = this;
            // don't just evaluate numbers
            if (!isNaN(parseFloat(name))) {
                //console.log('interpreted ', name, 'as a number.');
                return parseFloat(name);
            }
            // collect current values in a scope object
            var params = model.currentParamValues, calcs = model.currentCalcValues, colors = model.currentColors;
            // try to evaluate using mathjs
            try {
                var compiledMath = math.compile(name);
                var result = compiledMath.eval({
                    params: params,
                    calcs: calcs,
                    colors: colors
                });
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
            model.currentCalcValues = model.evalObject(model.calcs);
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
            return d3.format("." + precision + "f")(this.value);
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
    var UnivariateFunction = /** @class */ (function (_super) {
        __extends(UnivariateFunction, _super);
        function UnivariateFunction(def) {
            var _this = this;
            KG.setDefaults(def, {
                ind: 'x',
                samplePoints: 50
            });
            KG.setProperties(def, 'constants', ['samplePoints', 'ind', 'fn']);
            KG.setProperties(def, 'updatables', ['min', 'max']);
            _this = _super.call(this, def) || this;
            _this.compiledFunction = math.compile(def.fn);
            return _this;
        }
        UnivariateFunction.prototype.eval = function (input) {
            var fn = this;
            // collect current values in a scope object
            var scope = {
                params: fn.model.currentParamValues,
                calcs: fn.model.currentCalcValues,
                colors: fn.model.currentColors
            };
            fn.scope = fn.scope || scope;
            fn.scope[fn.ind] = input;
            return fn.compiledFunction.eval(fn.scope);
        };
        UnivariateFunction.prototype.generateData = function (min, max) {
            var fn = this, data = [];
            min = fn.min || min;
            max = fn.max || max;
            for (var i = 0; i < fn.samplePoints + 1; i++) {
                var a = i / fn.samplePoints, input = a * min + (1 - a) * max, output = fn.eval(input);
                if (!isNaN(output) && output != Infinity && output != -Infinity) {
                    data.push((fn.ind == 'x') ? { x: input, y: output } : { x: output, y: input });
                }
            }
            this.data = data;
            return data;
        };
        UnivariateFunction.prototype.update = function (force) {
            var fn = _super.prototype.update.call(this, force);
            fn.scope = {
                params: fn.model.currentParamValues,
                calcs: fn.model.currentCalcValues,
                colors: fn.model.currentColors
            };
            return fn;
        };
        return UnivariateFunction;
    }(KG.UpdateListener));
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
                max: 10,
                samplePoints: 50
            });
            KG.setProperties(def, 'constants', ['samplePoints']);
            KG.setProperties(def, 'updatables', ['min', 'max']);
            _this = _super.call(this, def) || this;
            _this.xCompiledFunction = math.compile(def.xFunction);
            _this.yCompiledFunction = math.compile(def.yFunction);
            return _this;
        }
        ParametricFunction.prototype.eval = function (input) {
            var fn = this;
            fn.scope = fn.scope || { params: fn.model.currentParamValues };
            fn.scope.t = input;
            return { x: fn.xCompiledFunction.eval(fn.scope), y: fn.yCompiledFunction.eval(fn.scope) };
        };
        ParametricFunction.prototype.generateData = function (min, max) {
            var fn = this, data = [];
            min = fn.min || min;
            max = fn.max || max;
            for (var i = 0; i < fn.samplePoints + 1; i++) {
                var a = i / fn.samplePoints, input = a * min + (1 - a) * max, output = fn.eval(input);
                if (!isNaN(output.x) && output.x != Infinity && output.x != -Infinity && !isNaN(output.y) && output.y != Infinity && output.y != -Infinity) {
                    data.push(output);
                }
            }
            this.data = data;
            return data;
        };
        ParametricFunction.prototype.update = function (force) {
            var fn = _super.prototype.update.call(this, force);
            fn.scope = { params: fn.model.currentParamValues };
            return fn;
        };
        return ParametricFunction;
    }(KG.UpdateListener));
    KG.ParametricFunction = ParametricFunction;
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
            var _this = this;
            KG.setProperties(def, 'updatables', ['expression']);
            KG.setProperties(def, 'constants', ['param']);
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
    var DragListener = /** @class */ (function (_super) {
        __extends(DragListener, _super);
        function DragListener(def) {
            var _this = this;
            KG.setDefaults(def, {
                directions: "xy"
            });
            KG.setProperties(def, 'updatables', ['draggable', 'directions']);
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
    var ClickListener = /** @class */ (function (_super) {
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
    var InteractionHandler = /** @class */ (function (_super) {
        __extends(InteractionHandler, _super);
        function InteractionHandler(def) {
            var _this = this;
            KG.setDefaults(def, { dragListeners: [], clickListeners: [] });
            KG.setProperties(def, 'constants', ["viewObject", "dragListeners", "clickListeners"]);
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
                    handler.scope.params = handler.model.currentParamValues;
                    handler.clickListeners.forEach(function (d) {
                        d.onChange(handler.scope);
                    });
                });
            }
            // add drag listeners
            if (handler.dragListeners.length > 0) {
                element.call(d3.drag()
                    .on('start', function () {
                    handler.scope.params = handler.model.currentParamValues;
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
            data.params = (data.params || []).map(function (paramData) {
                // allow author to override initial parameter values by specifying them as div attributes
                if (div.hasAttribute(paramData.name)) {
                    paramData.value = div.getAttribute(paramData.name);
                }
                // convert numerical params from strings to numbers
                paramData.value = isNaN(+paramData.value) ? paramData.value : +paramData.value;
                return paramData;
            });
            var parsedData = {
                aspectRatio: data.aspectRatio || 1,
                params: data.params || [],
                calcs: data.calcs || {},
                colors: data.colors || {},
                restrictions: data.restrictions,
                clipPaths: data.clipPaths || [],
                scales: data.scales || [],
                layers: data.layers || [[], [], [], []],
                divs: data.divs || []
            };
            data.objects = data.objects || [];
            if (data.hasOwnProperty('layout')) {
                data.objects.push(data.layout);
            }
            if (data.hasOwnProperty('schema')) {
                data.objects.push({ type: data.schema, def: {} });
            }
            parsedData = KGAuthor.parse(data.objects, parsedData);
            console.log(parsedData);
            var view = this;
            view.aspectRatio = parsedData.aspectRatio || 1;
            view.model = new KG.Model(parsedData);
            // create scales
            view.scales = parsedData.scales.map(function (def) {
                def.model = view.model;
                return new KG.Scale(def);
            });
            // create the div for the view
            view.div = d3.select(div)
                .style('position', 'relative');
            // create the SVG element for the view
            view.svg = view.div.append('svg')
                .style('overflow', 'visible')
                .style('pointer-events', 'none');
            view.addViewObjects(parsedData);
        }
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
            var clipPathURLs = {};
            var defLayer = view.svg.append('defs');
            // create ClipPaths, generate their URLs, and add their paths to the SVG defs element.
            if (data.clipPaths.length > 0) {
                data.clipPaths.forEach(function (def) {
                    var clipPathURL = KG.randomString(10);
                    var clipPathLayer = defLayer.append('clipPath').attr('id', clipPathURL);
                    def.paths.forEach(function (td) {
                        new KG[td.type](view.addViewToDef(td.def, clipPathLayer));
                    });
                    clipPathURLs[def.name] = clipPathURL;
                });
            }
            // add layers of objects
            data.layers.forEach(function (layerTds) {
                if (layerTds.length > 0) {
                    var layer_1 = view.svg.append('g');
                    layerTds.forEach(function (td) {
                        var def = td.def;
                        if (def.hasOwnProperty('clipPathName')) {
                            def.clipPath = clipPathURLs[def['clipPathName']];
                        }
                        def = view.addViewToDef(def, layer_1);
                        new KG[td.type](def);
                    });
                }
            });
            // add divs
            if (data.divs.length > 0) {
                data.divs.forEach(function (td) {
                    var def = view.addViewToDef(td.def, view.div), newDiv = new KG[td.type](def);
                    if (td.type == 'Sidebar') {
                        view.sidebar = newDiv;
                    }
                });
            }
            view.updateDimensions();
        };
        // update dimensions, either when first rendering or when the window is resized
        View.prototype.updateDimensions = function () {
            var view = this;
            // read the client width of the enclosing div and calculate the height using the aspectRatio
            var width = view.div.node().clientWidth;
            if (width > 563 && view.sidebar) {
                view.sidebar.positionRight(width);
                width = width * 77 / 126; // make width of graph the same width as main Tufte column
            }
            else if (view.sidebar) {
                view.sidebar.positionBelow();
            }
            var height = width / view.aspectRatio;
            // set the height of the div
            view.div.style.height = height + 'px';
            // set the dimensions of the svg
            view.svg.style('width', width);
            view.svg.style('height', height);
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
                stroke: 'black',
                strokeWidth: 1,
                show: true,
                inClipPath: false,
                lineStyle: 'solid'
            });
            KG.setProperties(def, 'updatables', ['fill', 'stroke', 'strokeWidth', 'opacity', 'strokeOpacity', 'show', 'lineStyle']);
            KG.setProperties(def, 'constants', ['xScale', 'yScale', 'clipPath', 'interactive', 'alwaysUpdate', 'inClipPath']);
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
        ViewObject.prototype.addClipPath = function () {
            var vo = this;
            if (vo.hasOwnProperty('clipPath') && vo.clipPath != undefined) {
                vo.rootElement.attr('clip-path', "url(#" + vo.clipPath + ")");
            }
            return vo;
        };
        ViewObject.prototype.addInteraction = function () {
            var vo = this;
            vo.interactionHandler.addTrigger(vo.rootElement);
            return vo;
        };
        ViewObject.prototype.draw = function (layer, inClipPath) {
            return this;
        };
        ViewObject.prototype.redraw = function () {
            return this;
        };
        ViewObject.prototype.displayElement = function (show) {
            var vo = this;
            if (vo.hasOwnProperty('rootElement')) {
                vo.rootElement.style('display', show ? null : 'none');
            }
        };
        ViewObject.prototype.onGraph = function () {
            var vo = this;
            if (vo.hasOwnProperty('x')) {
                if (vo.x < vo.xScale.domainMin || vo.x > vo.xScale.domainMax) {
                    return false;
                }
            }
            if (vo.hasOwnProperty('y')) {
                if (vo.y < vo.yScale.domainMin || vo.y > vo.yScale.domainMax) {
                    return false;
                }
            }
            return true;
        };
        ViewObject.prototype.update = function (force) {
            var vo = _super.prototype.update.call(this, force);
            if (vo.show && vo.onGraph()) {
                vo.displayElement(true);
                if (vo.hasChanged || vo.alwaysUpdate) {
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
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Segment = /** @class */ (function (_super) {
        __extends(Segment, _super);
        function Segment(def) {
            var _this = this;
            KG.setDefaults(def, {
                xScale2: def.xScale,
                yScale2: def.yScale,
                strokeWidth: 2
            });
            KG.setProperties(def, 'constants', ['xScale2', 'yScale2']);
            KG.setProperties(def, 'updatables', ['x1', 'y1', 'x2', 'y2']);
            _this = _super.call(this, def) || this;
            return _this;
        }
        // create SVG elements
        Segment.prototype.draw = function (layer) {
            var segment = this;
            segment.rootElement = layer.append('g');
            segment.dragLine = segment.rootElement.append('line').attr('stroke-width', '20px').style('stroke-opacity', 0);
            segment.line = segment.rootElement.append('line');
            return segment.addClipPath().addInteraction();
        };
        // update properties
        Segment.prototype.redraw = function () {
            var segment = this;
            var x1 = segment.xScale.scale(segment.x1), x2 = segment.xScale.scale(segment.x2), y1 = segment.yScale2.scale(segment.y1), y2 = segment.yScale2.scale(segment.y2), stroke = segment.stroke, strokeWidth = segment.strokeWidth;
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
            if (segment.lineStyle == 'dashed') {
                segment.line.style('stroke-dashArray', '10,10');
            }
            if (segment.lineStyle == 'dotted') {
                segment.line.style('stroke-dashArray', '1,2');
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
    var Curve = /** @class */ (function (_super) {
        __extends(Curve, _super);
        function Curve(def) {
            var _this = this;
            KG.setDefaults(def, {
                alwaysUpdate: true,
                interpolation: 'curveBasis',
                strokeWidth: 2
            });
            KG.setProperties(def, 'constants', ['interpolation']);
            _this = _super.call(this, def) || this;
            var curve = _this;
            if (def.hasOwnProperty('univariateFunction')) {
                def.univariateFunction.model = def.model;
                curve.univariateFunction = new KG.UnivariateFunction(def.univariateFunction);
            }
            else if (def.hasOwnProperty('parametricFunction')) {
                def.parametricFunction.model = def.model;
                curve.parametricFunction = new KG.ParametricFunction(def.parametricFunction);
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
            return curve.addClipPath().addInteraction();
        };
        // update properties
        Curve.prototype.redraw = function () {
            var curve = this;
            if (curve.hasOwnProperty('univariateFunction')) {
                var fn = curve.univariateFunction.update(true);
                if (fn.hasChanged) {
                    var scale = fn.ind == 'y' ? curve.yScale : curve.xScale;
                    fn.generateData(scale.domainMin, scale.domainMax);
                    curve.dragPath.data([fn.data]).attr('d', curve.dataLine);
                    curve.path.data([fn.data]).attr('d', curve.dataLine);
                }
            }
            if (curve.hasOwnProperty('parametricFunction')) {
                var fn = curve.parametricFunction.update(true);
                if (fn.hasChanged) {
                    fn.generateData();
                    curve.dragPath.data([fn.data]).attr('d', curve.dataLine);
                    curve.path.data([fn.data]).attr('d', curve.dataLine);
                }
            }
            curve.path.attr('stroke', curve.stroke);
            curve.path.attr('stroke-width', curve.strokeWidth);
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
            var _this = this;
            KG.setDefaults(def, {
                ticks: 5,
                intercept: 0
            });
            KG.setProperties(def, 'constants', ['orient']);
            KG.setProperties(def, 'updatables', ['ticks', 'intercept', 'label', 'min', 'max']);
            _this = _super.call(this, def) || this;
            return _this;
        }
        Axis.prototype.draw = function (layer) {
            var a = this;
            a.rootElement = layer.append('g').attr('class', 'axis');
            return a;
        };
        Axis.prototype.redraw = function () {
            var a = this;
            switch (a.orient) {
                case 'bottom':
                    a.rootElement.attr('transform', "translate(0, " + a.yScale.scale(a.intercept) + ")");
                    a.rootElement.call(d3.axisBottom(a.xScale.scale).ticks(a.ticks));
                    return a;
                case 'left':
                    a.rootElement.attr('transform', "translate(" + a.xScale.scale(a.intercept) + ",0)");
                    a.rootElement.call(d3.axisLeft(a.yScale.scale).ticks(a.ticks));
                    return a;
                case 'top':
                    a.rootElement.attr('transform', "translate(0, " + a.yScale.scale(a.intercept) + ")");
                    a.rootElement.call(d3.axisTop(a.xScale.scale).ticks(a.ticks));
                    return a;
                case 'right':
                    a.rootElement.attr('transform', "translate(" + a.xScale.scale(a.intercept) + ",0)");
                    a.rootElement.call(d3.axisRight(a.yScale.scale).ticks(a.ticks));
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
            var _this = this;
            KG.setDefaults(def, {
                fill: 'blue',
                opacity: 1,
                stroke: 'white',
                strokeWidth: 1,
                strokeOpacity: 1,
                r: 6
            });
            KG.setProperties(def, 'updatables', ['x', 'y', 'r']);
            _this = _super.call(this, def) || this;
            return _this;
        }
        // create SVG elements
        Point.prototype.draw = function (layer) {
            var p = this;
            p.rootElement = layer.append('g'); // SVG group
            p.dragCircle = p.rootElement.append('circle').style('fill-opacity', 0).attr('r', 20);
            p.circle = p.rootElement.append('circle');
            //p.addClipPath()
            return p.addInteraction();
        };
        // update properties
        Point.prototype.redraw = function () {
            var p = this;
            p.rootElement.attr('transform', "translate(" + p.xScale.scale(p.x) + " " + p.yScale.scale(p.y) + ")");
            p.circle.attr('r', p.r);
            p.circle.style('fill', p.fill);
            p.circle.style('opacity', p.opacity);
            p.circle.style('stroke', p.stroke);
            p.circle.style('stroke-width', p.strokeWidth + "px");
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
    var Rectangle = /** @class */ (function (_super) {
        __extends(Rectangle, _super);
        function Rectangle(def) {
            var _this = this;
            KG.setDefaults(def, {
                fill: 'blue',
                opacity: 0.2
            });
            KG.setProperties(def, 'updatables', ['x1', 'x2', 'y1', 'y2']);
            _this = _super.call(this, def) || this;
            return _this;
        }
        // create SVG elements
        Rectangle.prototype.draw = function (layer) {
            var rect = this;
            if (rect.inClipPath) {
                rect.rootElement = layer;
            }
            else {
                rect.rootElement = layer.append('g');
                rect.addClipPath().addInteraction();
            }
            rect.shape = rect.rootElement.append('rect');
            //rect.interactionHandler.addTrigger(rect.rootElement);
            return rect.addClipPath().addInteraction();
        };
        // update properties
        Rectangle.prototype.redraw = function () {
            var rect = this;
            var x1 = rect.xScale.scale(rect.x1);
            var y1 = rect.yScale.scale(rect.y1);
            var x2 = rect.xScale.scale(rect.x2);
            var y2 = rect.yScale.scale(rect.y2);
            rect.shape
                .attr('x', Math.min(x1, x2))
                .attr('y', Math.min(y1, y2))
                .attr('width', Math.abs(x2 - x1))
                .attr('height', Math.abs(y2 - y1))
                .attr('fill', rect.fill)
                .style('opacity', rect.opacity);
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
                alwaysUpdate: true,
                interpolation: 'curveBasis',
                ind: 'x',
                fill: 'lightsteelblue',
                opacity: 0.2,
                univariateFunction2: {
                    "fn": def.above ? maxValue : minValue,
                    "ind": def.univariateFunction1['ind'],
                    "min": def.univariateFunction1['min'],
                    "max": def.univariateFunction1['max'],
                    "samplePoints": def.univariateFunction1['samplePoints']
                }
            });
            KG.setProperties(def, 'constants', ['interpolation']);
            _this = _super.call(this, def) || this;
            def.univariateFunction1.model = def.model;
            def.univariateFunction2.model = def.model;
            _this.univariateFunction1 = new KG.UnivariateFunction(def.univariateFunction1);
            _this.univariateFunction2 = new KG.UnivariateFunction(def.univariateFunction2);
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
            return ab.addClipPath();
        };
        // update properties
        Area.prototype.redraw = function () {
            var ab = this, fn1 = ab.univariateFunction1, fn2 = ab.univariateFunction2;
            if (fn1 != undefined && fn2 != undefined) {
                ab.updateFn(fn1);
                ab.updateFn(fn2);
                if (fn1.hasChanged || fn2.hasChanged) {
                    ab.areaPath
                        .data([d3.zip(ab.univariateFunction1.data, ab.univariateFunction2.data)])
                        .attr('d', ab.areaShape)
                        .style('fill', ab.fill)
                        .style('opacity', ab.opacity);
                }
            }
            return ab;
        };
        Area.prototype.updateFn = function (fn) {
            var scale = (fn.ind == 'y') ? this.yScale : this.xScale;
            fn.update(true);
            if (fn.hasChanged) {
                fn.generateData(scale.domainMin, scale.domainMax);
            }
            return false;
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
            var _this = this;
            KG.setDefaults(def, {
                color: '#999999',
                lineThickness: 1,
                lineStyle: 0
            });
            KG.setProperties(def, 'constants', ['command', 'color', 'lineThickness', 'lineStyle']);
            _this = _super.call(this, def) || this;
            return _this;
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
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var DivObject = /** @class */ (function (_super) {
        __extends(DivObject, _super);
        function DivObject() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return DivObject;
    }(KG.ViewObject));
    KG.DivObject = DivObject;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Div = /** @class */ (function (_super) {
        __extends(Div, _super);
        function Div(def) {
            var _this = this;
            //establish property defaults
            KG.setDefaults(def, {
                xPixelOffset: 0,
                yPixelOffset: 0,
                fontSize: 12
            });
            // define constant and updatable properties
            KG.setProperties(def, 'constants', ['fontSize']);
            KG.setProperties(def, 'updatables', ['html']);
            _this = _super.call(this, def) || this;
            return _this;
        }
        // create div for text
        Div.prototype.draw = function (layer) {
            var div = this;
            div.rootElement = layer.append('div')
                .style('font-size', div.fontSize + 'pt')
                .style('padding-top', '10px')
                .style('padding-bottom', '10px');
            return div;
        };
        // update properties
        Div.prototype.redraw = function () {
            var div = this;
            div.rootElement.html(div.html);
            renderMathInElement(div.rootElement.node(), {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "\\[", right: "\\]", display: true },
                    { left: "$", right: "$", display: false },
                    { left: "\\(", right: "\\)", display: false }
                ]
            });
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
            var _this = this;
            // establish property defaults
            KG.setDefaults(def, {
                value: 'params.' + def.param,
                alwaysUpdate: true
            });
            // define constant and updatable properties
            KG.setProperties(def, 'constants', ['param']);
            KG.setProperties(def, 'updatables', ['label', 'value']);
            _this = _super.call(this, def) || this;
            return _this;
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
                noAxis: false
            });
            // define constant and updatable properties
            KG.setProperties(def, 'constants', ['noAxis']);
            _this = _super.call(this, def) || this;
            return _this;
        }
        Slider.prototype.draw = function (layer) {
            var slider = this;
            slider.rootElement = layer.append('tr');
            var param = slider.model.getParam(slider.param);
            slider.labelElement = slider.rootElement.append('td')
                .style('font-size', '14pt');
            slider.numberInput = slider.rootElement.append('td').append('input')
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
            slider.rangeInput = slider.rootElement.append('td').append('input')
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
        Slider.prototype.redraw = function () {
            var slider = this;
            katex.render(slider.label + " = ", slider.labelElement.node());
            slider.numberInput.property('value', slider.value.toFixed(slider.model.getParam(slider.param).precision));
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
            checkbox.labelElement.style('padding-left', '10px');
            return checkbox;
        };
        Checkbox.prototype.redraw = function () {
            var checkbox = this;
            checkbox.inputElement.property('checked', Boolean(checkbox.value));
            katex.render(checkbox.label, checkbox.labelElement.node());
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
            var _this = this;
            KG.setProperties(def, 'updatables', ['optionValue']);
            _this = _super.call(this, def) || this;
            return _this;
        }
        Radio.prototype.draw = function (layer) {
            var radio = this;
            radio.rootElement = layer.append('div').append('label');
            radio.inputElement = radio.rootElement.append('input');
            radio.inputElement
                .attr('type', 'radio')
                .attr('name', 'r_' + radio.param)
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
            var _this = this;
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
            _this = _super.call(this, def) || this;
            return _this;
        }
        // create div for text
        Controls.prototype.draw = function (layer) {
            var controls = this;
            controls.rootElement = layer.append('div');
            controls.titleElement = controls.rootElement.append('p').style('width', '100%').style('font-size', '10pt').style('margin-bottom', 0);
            controls.descriptionElement = controls.rootElement.append('div');
            var sliderTable = controls.rootElement.append('table').style('padding', '10px');
            controls.sliders.forEach(function (slider) {
                new KG.Slider({ layer: sliderTable, param: slider.param, label: slider.label, model: controls.model });
            });
            controls.checkboxes.forEach(function (checkbox) {
                new KG.Checkbox({ layer: controls.rootElement, param: checkbox.param, label: checkbox.label, model: controls.model });
            });
            controls.radios.forEach(function (radio) {
                new KG.Radio({ layer: controls.rootElement, param: radio.param, label: radio.label, optionValue: radio.optionValue, model: controls.model });
            });
            controls.divs.forEach(function (div) {
                new KG.Div({ layer: controls.rootElement, html: div.html, fontSize: 14, model: controls.model });
            });
            return controls;
        };
        // update properties
        Controls.prototype.redraw = function () {
            var controls = this;
            controls.titleElement.text(controls.title.toUpperCase());
            controls.descriptionElement.text(controls.description);
            return controls;
        };
        return Controls;
    }(KG.DivObject));
    KG.Controls = Controls;
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
            var div = this;
            var id = KG.randomString(10);
            div.rootElement = layer.append('div');
            div.rootElement.style('position', 'absolute');
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
            var div = this;
            var width = Math.abs(div.xScale.scale(1) - div.xScale.scale(0)), height = Math.abs(div.yScale.scale(1) - div.yScale.scale(0));
            div.rootElement.style('left', div.xScale.scale(0) + 'px');
            div.rootElement.style('top', div.yScale.scale(1) + 'px');
            div.rootElement.style('width', width + 'px');
            div.rootElement.style('height', height + 'px');
            //console.log('redrawing');
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
    }(KG.ViewObject));
    KG.GeoGebraApplet = GeoGebraApplet;
})(KG || (KG = {}));
/// <reference path="../../kg.ts" />
var KG;
(function (KG) {
    var Sidebar = /** @class */ (function (_super) {
        __extends(Sidebar, _super);
        function Sidebar(def) {
            var _this = this;
            KG.setDefaults(def, {
                controls: []
            });
            KG.setProperties(def, 'constants', ['controls']);
            _this = _super.call(this, def) || this;
            return _this;
        }
        Sidebar.prototype.positionRight = function (width) {
            var sidebar = this;
            sidebar.rootElement
                .style('position', 'absolute')
                .style('left', width * 847 / 1260 + 'px')
                .style('top', '0px')
                .style('width', width * 385 / 1260 + 'px');
        };
        Sidebar.prototype.positionBelow = function () {
            var sidebar = this;
            sidebar.rootElement
                .style('position', null)
                .style('left', null)
                .style('width', null);
        };
        Sidebar.prototype.draw = function (layer) {
            var sidebar = this;
            sidebar.rootElement = layer.append('div').style('position', 'absolute');
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
    var Label = /** @class */ (function (_super) {
        __extends(Label, _super);
        function Label(def) {
            var _this = this;
            if (def.x == 'AXIS') {
                def.x = 0;
                def.align = 'right';
                def.xPixelOffset = -6;
            }
            if (def.y == 'AXIS') {
                def.y = 0;
                def.yPixelOffset = -14;
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
            KG.setProperties(def, 'constants', ['xPixelOffset', 'yPixelOffset', 'fontSize']);
            KG.setProperties(def, 'updatables', ['x', 'y', 'text', 'align', 'valign', 'rotate', 'color']);
            _this = _super.call(this, def) || this;
            return _this;
        }
        // create div for text
        Label.prototype.draw = function (layer) {
            var label = this;
            label.rootElement = layer.append('div')
                .attr('class', 'draggable')
                .style('position', 'absolute')
                .style('background-color', 'white')
                .style('font-size', label.fontSize + 'pt');
            return label.addInteraction();
        };
        // update properties
        Label.prototype.redraw = function () {
            var label = this;
            label.rootElement.style('color', label.color);
            var x = label.xScale.scale(label.x) + (+label.xPixelOffset), y = label.yScale.scale(label.y) - (+label.yPixelOffset);
            if (undefined != label.text) {
                katex.render(label.text.toString(), label.rootElement.node());
            }
            label.rootElement.style('left', x + 'px');
            label.rootElement.style('top', y + 'px');
            var width = label.rootElement.node().clientWidth, height = label.rootElement.node().clientHeight;
            // Set left pixel margin; default to centered on x coordinate
            var alignDelta = width * 0.5;
            if (label.align == 'left') {
                alignDelta = 0;
                label.rootElement.style('text-align', 'left');
            }
            else if (label.align == 'right') {
                // move left by half the width of the div if right aligned
                alignDelta = width + 2;
                label.rootElement.style('text-align', 'right');
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
            var rotate = "rotate(-" + label.rotate + "deg)";
            label.rootElement.style('-webkit-transform', rotate)
                .style('transform', rotate);
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
/// <reference path="KGAuthor/parsingFunctions.ts"/>
/// <reference path="KGAuthor/authoringObject.ts"/>
/// <reference path="KGAuthor/schema.ts"/>
/// <reference path="KGAuthor/graph.ts"/>
/// <reference path="KGAuthor/divObject.ts"/>
/// <reference path="KGAuthor/graphObject.ts"/>
/// <reference path="KGAuthor/layout.ts"/>
/// <reference path="KGAuthor/econ/eg.ts"/>
/// <reference path="model/model.ts"/>
/// <reference path="model/param.ts" />
/// <reference path="model/restriction.ts" />
/// <reference path="model/updateListener.ts" />
/// <reference path="math/univariateFunction.ts" />
/// <reference path="math/parametricFunction.ts" />
/// <reference path="controller/listeners/listener.ts" />
/// <reference path="controller/listeners/dragListener.ts" />
/// <reference path="controller/listeners/clickListener.ts" />
/// <reference path="controller/interactionHandler.ts" />
/// <reference path="view/view.ts"/>
/// <reference path="view/scale.ts" />
/// <reference path="view/viewObjects/viewObject.ts" />
/// <reference path="view/viewObjects/segment.ts" />
/// <reference path="view/viewObjects/curve.ts" />
/// <reference path="view/viewObjects/axis.ts" />
/// <reference path="view/viewObjects/point.ts" />
/// <reference path="view/viewObjects/rectangle.ts" />
/// <reference path="view/viewObjects/area.ts" />
/// <reference path="view/viewObjects/ggbObject.ts" />
/// <reference path="view/divObjects/divObject.ts" />
/// <reference path="view/divObjects/div.ts" />
/// <reference path="view/divObjects/paramControl.ts"/>
/// <reference path="view/divObjects/slider.ts"/>
/// <reference path="view/divObjects/checkbox.ts"/>
/// <reference path="view/divObjects/radio.ts"/>
/// <reference path="view/divObjects/controls.ts"/>
/// <reference path="view/divObjects/ggbApplet.ts"/>
/// <reference path="view/divObjects/sidebar.ts"/>
/// <reference path="view/viewObjects/label.ts" />
// this file provides the interface with the overall web page
var views = [];
// initialize the diagram from divs with class kg-container
window.addEventListener("load", function () {
    var viewDivs = document.getElementsByClassName('kg-container');
    var _loop_1 = function (i) {
        var src = viewDivs[i].getAttribute('src');
        viewDivs[i].innerHTML = "<p>loading...</p>";
        // first look to see if there's a definition in the KG.viewData object
        if (KG['viewData'].hasOwnProperty(src)) {
            viewDivs[i].innerHTML = "";
            views.push(new KG.View(viewDivs[i], KG['viewData'][src]));
        }
        else {
            // then look to see if the src is available by a URL
            d3.json(src, function (data) {
                if (!data) {
                    viewDivs[i].innerHTML = "<p>oops, " + src + " doesn't seem to exist.</p>";
                }
                else {
                    viewDivs[i].innerHTML = "";
                    views.push(new KG.View(viewDivs[i], data));
                }
            });
        }
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