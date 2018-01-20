/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class OneGraph extends SquareLayout {

        constructor(def) {
            super(def);

            const l = this;
            let graphDef = def['graph'];

            graphDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.74,
                "height": 0.9
            };

            l.subObjects.push(new Graph(graphDef));
        }
    }

    export class OneGraphPlusSidebar extends SquareLayout {

        constructor(def) {
            super(def);

            const l = this;
            let graphDef = def['graph'],
                sidebarDef = def['sidebar'];

            graphDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.738,
                "height": 0.9
            };

            l.subObjects.push(new Graph(graphDef));
            l.subObjects.push(new Sidebar(sidebarDef));

        }

    }

    export class EdgeworthBoxPlusSidebar extends SquareLayout {

        constructor(def) {
            super(def);

            const l = this;
            let agentA = def['agentA'],
                agentB = def['agentB'],
                sidebarDef = def['sidebar'];

            let width = 0.738, height = 0.9;

            if(def.totalGood1 > def.totalGood2) {
                height = def.totalGood2*height/def.totalGood1;
            }

            if(def.totalGood2 > def.totalGood1) {
                height = def.totalGood1*width/def.totalGood2;
            }

            agentA.position = {
                "x": 0.15,
                "y": 0.025,
                "width": width,
                "height": height
            };

            agentB.position = {
                "x": 0.15 + width,
                "y": 0.025 + height,
                "width": -1*width,
                "height": -1*height
            };

            agentA.xAxis.max = agentB.xAxis.max = def.totalGood1;
            agentA.yAxis.max = agentB.yAxis.max = def.totalGood2;
            agentB.xAxis.orient = 'top';
            agentB.yAxis.orient = 'right';

            l.subObjects.push(new Graph(agentA));
            l.subObjects.push(new Graph(agentB));
            l.subObjects.push(new Sidebar(sidebarDef));

        }

    }

    export class GeoGebraPlusSidebar extends SquareLayout {

        constructor(def) {
            super(def);

            const l = this;
            let ggbAppletDef = def['ggbApplet'],
                sidebarDef = def['sidebar'];

            ggbAppletDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.738,
                "height": 0.9
            };

            l.subObjects.push(new GeoGebraContainer(ggbAppletDef));
            l.subObjects.push(new Sidebar(sidebarDef));

        }

    }




}