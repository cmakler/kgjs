/// <reference path="../kgAuthor.ts" />

module KGAuthor {


    export class TwoHorizontalGraphs extends Layout {

        constructor(def) {
            super(def);

            const l = this;
            let leftGraphDef = def['leftGraph'],
                rightGraphDef = def['rightGraph'];

            const leftX = 0.15,
                rightX = 0.65,
                topY = 0.1,
                bottomY = 0.9,
                width = 0.3,
                controlHeight = 0.25;

            let includeControls = false;

            console.log('layout: ',l);

            if (def.hasOwnProperty('leftControls')) {

                l.subObjects.push(new DivContainer({
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

                l.subObjects.push(new DivContainer({
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

            let graphHeight = includeControls ? 0.5 : 0.9;

            this.aspectRatio = includeControls ? 2 : 4;


            leftGraphDef.position = {
                x: leftX,
                y: topY,
                width: width,
                height: graphHeight
            };

            l.subObjects.push(new Graph(leftGraphDef));

            rightGraphDef.position = {
                "x": rightX,
                "y": topY,
                "width": width,
                "height": graphHeight
            };

            l.subObjects.push(new Graph(rightGraphDef));



        }

    }

    export class TwoHorizontalGraphsPlusSidebar extends Layout {

        constructor(def) {
            super(def);

            const l = this;
            let leftGraphDef = def['leftGraph'],
                rightGraphDef = def['rightGraph'],
                sidebarDef = def['sidebar'];

            let includeControls = false;

            const leftX = 0.1,
                rightX = 0.6,
                topY = 0.025,
                bottomY = 1.2,
                width = 0.369,
                controlHeight = 0.3,
                controlBottom = 0.65;

            if (def.hasOwnProperty('leftControls')) {
                const leftControlsContainer = {
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
                l.subObjects.push(new DivContainer(leftControlsContainer));
            }

            if (def.hasOwnProperty('rightControls')) {
                const rightControlsContainer = {
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
                l.subObjects.push(new DivContainer(rightControlsContainer));
            }

            let graphHeight = includeControls ? 0.5 : 0.9;

            this.aspectRatio = includeControls ? 1.2 : 2.4;

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

            const leftGraph = new Graph(leftGraphDef),
                rightGraph = new Graph(rightGraphDef),
                sidebar = new Sidebar(sidebarDef);

            l.subObjects.push(leftGraph);
            l.subObjects.push(rightGraph);
            l.subObjects.push(sidebar);



        }

    }

    export class MathboxPlusGraph extends Layout {

        constructor(def) {
            super(def);

            const l = this;
            let mathboxDef = def['mathbox'],
                graphDef = def['graph'];

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

            l.subObjects.push(new Mathbox(mathboxDef));
            l.subObjects.push(new Graph(graphDef));

        }

    }

    export class GameMatrixPlusGraph extends Layout {

        constructor(def) {
            super(def);

            const l = this;
            let graphDef = def['graph'];

            let gameDivDef = {
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

            l.subObjects.push(new DivContainer(gameDivDef));
            l.subObjects.push(new Graph(graphDef));

        }

    }

        export class GameMatrixPlusGraphPlusSidebar extends Layout {

        constructor(def) {
            super(def);

            const l = this;
            let graphDef = def['graph'];
            let sidebarDef= def['sidebar'];

            let gameDivDef = {
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

            l.subObjects.push(new DivContainer(gameDivDef));
            l.subObjects.push(new Graph(graphDef));
            l.subObjects.push(new Sidebar(sidebarDef));

        }

    }

    export class GeoGebraPlusGraph extends Layout {

        constructor(def) {
            super(def);

            const l = this;
            let ggbAppletDef = def['ggbApplet'],
                graphDef = def['graph'];

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

            l.subObjects.push(new GeoGebraContainer(ggbAppletDef));
            l.subObjects.push(new Graph(graphDef));

        }

    }

    export class GeoGebraPlusGraphPlusSidebar extends WideRectangleLayout {

        constructor(def) {
            super(def);

            const l = this;
            let ggbAppletDef = def['ggbApplet'],
                graphDef = def['graph'],
                sidebarDef = def['sidebar'];

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

            l.subObjects.push(new GeoGebraContainer(ggbAppletDef));
            l.subObjects.push(new Graph(graphDef));
            l.subObjects.push(new Sidebar(sidebarDef));

        }


    }

    export class MathboxPlusGraphPlusSidebar extends WideRectangleLayout {

        constructor(def) {
            super(def);

            const l = this;
            let mathboxDef = def['mathbox'],
                graphDef = def['graph'],
                sidebarDef = def['sidebar'];

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

            l.subObjects.push(new MathboxContainer(mathboxDef));
            l.subObjects.push(new Graph(graphDef));
            l.subObjects.push(new Sidebar(sidebarDef));

        }


    }


}