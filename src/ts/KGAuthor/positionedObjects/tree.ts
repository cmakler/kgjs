/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface TreeDefinition extends GraphDefinition {
        nodes: NodeDefinition[]
        edges?: EdgeDefinition[]
        showGrid: any
    }

    export class Tree extends Graph {

        public nodeCoordinates: any;

        constructor(def: TreeDefinition) {
            let showGrid = def.showGrid || false;
            let graphDef = {
                position: def.position,
                objects: def.objects,
                xAxis: {max: 24, ticks: 24, show: showGrid},
                yAxis: {max: 24, ticks: 24, show: showGrid}
            }
            super(graphDef);
            const t = this;
            t.nodeCoordinates = {};
            t.subObjects.push(new Grid({
                xStep: 3,
                yStep: 3,
                show: showGrid
            }, t))
            def.nodes.forEach(function (nodeDef) {
                t.subObjects.push(new Node(nodeDef, t));
            })
            if (def.hasOwnProperty('edges')) {
                def.edges.forEach(function (edgeDef) {
                    t.subObjects.push(new Edge(edgeDef, t));
                })
            }


        }
    }

}