/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface PointDefinition extends GraphObjectDefinition {
        label?: LabelDefinition;
        draggable?: boolean;
        x?: any;
        y?: any;
        coordinates?: any[];
        droplines?: { horizontal?: string; vertical?: string; top?: string; right?: string; };
        r?: any;
    }

    export class Point extends GraphObject {

        public x;
        public y;

        constructor(def: PointDefinition, graph) {

            KG.setDefaults(def,{
                color: 'colors.blue'
            });

            def = setFillColor(def);

            super(def, graph);

            const p = this;
            p.type = 'Point';
            p.layer = 3;
            p.extractCoordinates();

            def = makeDraggable(def);

            if (def.hasOwnProperty('label')) {
                let labelDef = copyJSON(def);
                delete labelDef.label;
                labelDef = KG.setDefaults(labelDef, def.label);
                labelDef = KG.setDefaults(labelDef, {
                    fontSize: 10,
                    position: 'bl',
                    color: def.color,
                    bgcolor: null
                });
                p.subObjects.push(new Label(labelDef, graph));
            }

            if (def.hasOwnProperty('droplines')) {
                if (def.droplines.hasOwnProperty('vertical')) {
                    let verticalDroplineDef = copyJSON(def);

                    // only drag vertical droplines horizontally
                    if(verticalDroplineDef.hasOwnProperty('drag')) {
                        verticalDroplineDef.drag = verticalDroplineDef.drag.filter(function(value, index, arr) {return ((value.directions == 'x') || value.hasOwnProperty('horizontal'))});
                    }

                    if (def.droplines.hasOwnProperty('top')) {
                        verticalDroplineDef.y = graph.yScale.max;
                        let xTopAxisLabelDef = copyJSON(verticalDroplineDef);
                        xTopAxisLabelDef.y = 'OPPAXIS';
                        KG.setDefaults(xTopAxisLabelDef, {
                            text: def.droplines.top,
                            fontSize: 10
                        });
                        p.subObjects.push(new Label(xTopAxisLabelDef, graph));
                    }
                    p.subObjects.push(new VerticalDropline(verticalDroplineDef, graph));
                    let xAxisLabelDef = copyJSON(verticalDroplineDef);
                    xAxisLabelDef.y = 'AXIS';
                    KG.setDefaults(xAxisLabelDef, {
                        text: def.droplines.vertical,
                        fontSize: 10
                    });
                    p.subObjects.push(new Label(xAxisLabelDef, graph));
                }
                if (def.droplines.hasOwnProperty('horizontal')) {
                    let horizontalDroplineDef = copyJSON(def);

                    // only drag horizontal droplines vertically
                    if(horizontalDroplineDef.hasOwnProperty('drag')) {
                        horizontalDroplineDef.drag = horizontalDroplineDef.drag.filter(function(value, index, arr) {return ((value.directions == 'y') || value.hasOwnProperty('vertical'))});
                    }

                    p.subObjects.push(new HorizontalDropline(horizontalDroplineDef, graph));

                    let yAxisLabelDef = copyJSON(horizontalDroplineDef);
                    yAxisLabelDef.x = 'AXIS';
                    KG.setDefaults(yAxisLabelDef, {
                        text: def.droplines.horizontal,
                        fontSize: 10
                    });
                    p.subObjects.push(new Label(yAxisLabelDef, graph));
                }
            }

        }

    }

    export interface NodeDefinition extends PointDefinition {
        name: string;
        children?: NodeDefinition[];
        childSelectParam?: string;
        edgeLabel?: string; // used to label the edge from the parent node
    }

    export class Node extends Point {

        public name;
        private selectChildren;

        constructor(def: NodeDefinition, tree: Tree) {
            KG.setDefaults(def, {
                name: KG.randomString(10)
            })
            super(def, tree);
            const node = this;
            tree.nodeCoordinates[def.name] = [node.x, node.y];
            node.name = def.name;

            if(def.hasOwnProperty('children')) {
                const n = def.children.length;
                for(let i = 0; i < n; i++) {
                    const childNum = i + 1 // number of child, with first being 1 rather than 0;
                    let nodeDef:NodeDefinition = def.children[i];
                    KG.setDefaults(nodeDef, {
                        name: KG.randomString(10)
                    })
                    let edgeDef:EdgeDefinition = {
                        nodeA: def.name,
                        nodeB: nodeDef.name,
                        color: def.color,
                        label: {text: nodeDef.edgeLabel}
                    };

                    // if selectChildren is true, create a parameter called "select[nodeName]"
                    // which is used to select which child is active
                    // when true, clicking on an edge selects that edge
                    // unless the edge is already selected, in which case no edge is selected
                    if(def.hasOwnProperty('childSelectParam')) {
                        let param = def.childSelectParam;
                        let transitions = new Array(n + 1);
                        transitions[0] = childNum;
                        for (let j = 1; j < n + 1; j++) {
                            transitions[j] = (j == childNum) ? 0 : childNum;
                        }
                        edgeDef['click'] = [{
                            param: param,
                            transitions: transitions
                        }]
                        edgeDef['strokeWidth'] = `((params.${def.childSelectParam} == ${childNum}) ? 4 : 2)`
                    }

                    tree.subObjects.push(new Node(nodeDef, tree));
                    tree.subObjects.push(new Edge(edgeDef, tree));
                }
            }
        }

    }

}