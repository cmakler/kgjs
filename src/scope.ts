/// <reference path="../kg.ts" />

module KG {

    export interface IScope {
        container: Container;
        params: Param[];
        root: HTMLDivElement;
        svg: d3.Selection<SVGElement, {}, HTMLElement, any>;
        children: ViewObject[];

    }

    export class Scope implements IScope {

        public container;
        public root;
        public params;
        public children;
        public scale;
        public svg;

        constructor(scopeDef,container) {
            
            let scope = this;
            scope.container = container;
            scope.root = d3.select(container.div);
            scope.svg = scope.root.selectAll("svg").append("svg");
            scope.params = {};
            scope.children = [];
            scope.scale = 22;

            // initialize explanation HTML
            scope.root.selectAll("p").data(scopeDef.objects.explanation).enter().append("p").html(function(d) { return d});

            // initialize parameters
            for (const paramName in scopeDef.params) {

                if (scopeDef.params.hasOwnProperty(paramName)) {
                    //initialize parameter
                    let param = new Param(scopeDef.params[paramName]);
                    scope.params[paramName] = param;

                    //initialize all fields that display this param
                    scope.updateParamFields(paramName);

                    // set scrubbing behavior on any element that identifies itself as a control for this param
                    scope.root.selectAll(`[data-name='${paramName}']`).call(d3.drag()
                        .on('drag', function () {
                            scope.updateParam(paramName, param.positionToValue()(d3.event.x));
                        }));
                }
            }

            // draw backgraound grid (will replace with more general axis objects)
            let g = scope.svg.append('g').attr('class', "grid");
            for (let x = 0; x < 25; x++) {
                for (let y = 0; y < 10; y++) {
                    g.append('rect')
                        .attr('transform', `translate(${x*scope.scale}, ${y*scope.scale})`)
                        .attr('width', scope.scale)
                        .attr('height', scope.scale);
                }
            }

            // initialize points by adding them to a point layer and to the scope's array of children
            let pointLayer = scope.svg.append('g').attr('class', 'points');
            scopeDef.objects.points.forEach(function (def) {
                scope.children.push(new Point(scope, pointLayer, def))
            });

            // initialize labels by adding them to a label layer and to the scope's array of children
            let labelLayer = scope.svg.append('g').attr('class', 'labels');
            scopeDef.objects.labels.forEach(function (def) {
                scope.children.push(new Label(scope, labelLayer, def))
            });

            scope.updateChildren();
            scope.updateCalculations();

            console.log('initialized scope object: ', scope);



        }

        // the scope serves as a scope, and can evaluate expressions within the context of that scope
        evaluate(name) {
            console.log('getting current value of param ', name);
            let params = this.params;
            if (params.hasOwnProperty(name)) {
                return params[name].value
            }
            try {
                let currentParamValues = {};
                for (const paramName in params) {
                    if(params.hasOwnProperty(paramName)) {
                        currentParamValues[paramName] = params[paramName].value;
                    }
                }
                return math.eval(name, currentParamValues);
            }
            catch (err) {
                return 'fail';
            }
        }


        /* UPDATE CYCLE */

        // update cycle stage 1: user interaction sends an updateParam event to the scope
        updateParam(name, newValue) {
            let scope = this;
            if (scope.params.hasOwnProperty(name)) {
                const oldValue = scope.params[name].value;
                scope.params[name].update(newValue);

                // if param has changed, propagate change to fields and children
                if (oldValue != scope.params[name].value) {
                    scope.updateParamFields(name);
                    scope.updateChildren();
                    scope.updateCalculations();
                }
            }
        }

        // update cycle stage 2: all fields displaying the updated parameter show new value
        updateParamFields(paramName) {
            let scope = this;
            scope.root.selectAll(`[data-name='${paramName}']`).text(() => {
                return scope.params[paramName].formatted();
            });
        }

        // update cycle stage 3: coordinates of all objects are updated
        updateChildren() {
            this.children.forEach(function (child) {
                child.update()
            });
        }

        // update cycle stage 4: update text fields based on calculations
        updateCalculations() {
            let scope = this,
                elements = scope.root.selectAll(`[calculation]`);
            console.log(elements);
            if(elements.size() > 0) {
                let precision = elements.attr('precision') || 0;
            elements.text(() => d3.format(`.${precision}f`)(scope.evaluate(elements.attr('calculation'))));}
        }
    }


}