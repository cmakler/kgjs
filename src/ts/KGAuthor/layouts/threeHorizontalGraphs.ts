/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class ThreeHorizontalGraphs extends Layout {

        constructor(def) {
            super(def);

            const l = this;
            let leftGraphDef = def['leftGraph'],
                leftControlsDef = def['leftControls'] || {"title": ""},
                middleGraphDef = def['middleGraph'],
                middleControlsDef = def['middleControls'] || {"title": ""},
                rightGraphDef = def['rightGraph'],
                rightControlsDef = def['rightControls'] || {"title": ""};

            const leftX = 0.05,
                middleX = 0.35,
                rightX = 0.65,
                topY = 0.025,
                bottomY = 0.65,
                width = 0.25,
                graphHeight = 0.5,
                controlHeight = 0.3;

            leftGraphDef.position = {
                x: leftX,
                y: topY,
                width: width,
                height: graphHeight
            };

            const leftControlsContainer = {
                position: {
                    x: leftX,
                    y: bottomY,
                    width: width,
                    height: controlHeight
                },
                children: [
                    {
                        type: "Controls",
                        def: leftControlsDef
                    }
                ]
            };

            middleGraphDef.position = {
                "x": middleX,
                "y": topY,
                "width": width,
                "height": graphHeight
            };

            const middleControlsContainer = {
                position: {
                    x: middleX,
                    y: bottomY,
                    width: width,
                    height: controlHeight
                },
                children: [
                    {
                        type: "Controls",
                        def: middleControlsDef
                    }
                ]
            };

            rightGraphDef.position = {
                "x": rightX,
                "y": topY,
                "width": width,
                "height": graphHeight
            };

            const rightControlsContainer = {
                position: {
                    x: rightX,
                    y: bottomY,
                    width: width,
                    height: controlHeight
                },
                children: [
                    {
                        type: "Controls",
                        def: rightControlsDef
                    }
                ]
            };

            l.subObjects.push(new Graph(leftGraphDef));
            l.subObjects.push(new DivContainer(leftControlsContainer));
            l.subObjects.push(new Graph(middleGraphDef));
            l.subObjects.push(new DivContainer(middleControlsContainer));
            l.subObjects.push(new Graph(rightGraphDef));
            l.subObjects.push(new DivContainer(rightControlsContainer));


        }

    }


}