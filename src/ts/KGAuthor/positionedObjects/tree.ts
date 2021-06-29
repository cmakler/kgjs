/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface TreeDefinition extends GraphDefinition {
        nodes: NodeDefinition[]
        edges?: EdgeDefinition[]
    }

    export class Tree extends Graph {

        public nodeCoordinates: any;

        constructor(def: TreeDefinition) {
            let graphDef = {
                position: def.position,
                objects: def.objects,
                xAxis: {max: 24, show: false},
                yAxis: {max: 24, show: false}
            }
            super(graphDef);
            const t = this;
            t.nodeCoordinates = {};
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