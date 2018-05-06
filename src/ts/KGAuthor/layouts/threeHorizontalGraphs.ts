/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class ThreeHorizontalGraphs extends Layout {

        constructor(def) {
            super(def);

            const l = this;
            let leftGraphDef = def['leftGraph'],
                middleGraphDef = def['middleGraph'],
                rightGraphDef = def['rightGraph'];

            const leftX = 0.05,
                middleX = 0.35,
                rightX = 0.65,
                topY = 0.025,
                bottomY = 0.65,
                width = 0.25,
                controlHeight = 0.3;

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

            if (def.hasOwnProperty('middleControls')) {

                l.subObjects.push(new DivContainer({
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

            middleGraphDef.position = {
                "x": middleX,
                "y": topY,
                "width": width,
                "height": graphHeight
            };

            l.subObjects.push(new Graph(middleGraphDef));


            rightGraphDef.position = {
                "x": rightX,
                "y": topY,
                "width": width,
                "height": graphHeight
            };

            l.subObjects.push(new Graph(rightGraphDef));



        }

    }


}