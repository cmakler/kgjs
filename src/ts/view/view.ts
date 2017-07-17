/// <reference path="../kg.ts" />

module KG {

    export interface RefCategoryDef {
        category: string;
        className: string;
        refName: string;
        propName: string;
    }

    export interface ViewObjectCategoryDef {
        name: string;
        parent: string;
        element: string;
        className: string;
    }

    export interface ViewDefinition {
        aspectRatio: number;
        params?: ParamDefinition[];
        restrictions?: RestrictionDefinition[];
        scales?: ScaleDefinition[];
        dragListeners?: DragListenerDefinition[];
        clickListeners?: ClickListenerDefinition[];
        univariateFunctions?: UnivariateFunctionDefinition[];
        curves?: CurveDefinition[];
        segments?: SegmentDefinition[];
        points?: PointDefinition[];
        labels?: LabelDefinition[];
        axes?: AxisDefinition[];
        clipPaths?: ClipPathDefinition[];
    }

    export interface IView {
        updateDimensions: () => void;  // called on a window resize event; updates the size of the Container
    }

    export const REF_CATEGORIES: RefCategoryDef[] = [
        {
            category: 'xScales',
            className: 'Scale',
            propName: 'xScale',
            refName: 'xScaleName'
        },
        {
            category: 'yScales',
            className: 'Scale',
            propName: 'yScale',
            refName: 'yScaleName'
        },
        {
            category: 'clickListeners',
            className: 'ClickListener',
            propName: 'clickListeners',
            refName: 'clickListenerNames'
        },
        {
            category: 'dragListeners',
            className: 'DragListener',
            propName: 'dragListeners',
            refName: 'dragListenerNames'
        },
        {
            category: 'univariateFunctions',
            className: 'UnivariateFunction',
            propName: 'univariateFunctions',
            refName: 'univariateFunctionNames'
        }
    ];

    export const STORED_CATEGORIES = ['xScales', 'yScales'];

    export const VIEW_OBJECT_CATEGORIES: ViewObjectCategoryDef[] = [
        {
            name: 'clipPaths',
            parent: 'defs',
            element: '',
            className: 'ClipPath'
        },
        {
            name: 'segments',
            parent: 'svg',
            element: 'g',
            className: 'Segment'
        },
        {
            name: 'curves',
            parent: 'svg',
            element: 'g',
            className: 'Curve'
        },
        {
            name: 'axes',
            parent: 'svg',
            element: 'g',
            className: 'Axis'
        },
        {
            name: 'points',
            parent: 'svg',
            element: 'g',
            className: 'Point'
        },
        {
            name: 'labels',
            parent: 'div',
            element: 'div',
            className: 'Label'
        },

    ];

    export class View implements IView {

        private div;
        private svg;
        private svgDefs;
        private model;
        private xScales;
        private yScales;
        private aspectRatio: number;
        private refs: any;

        constructor(div: Element, data: ViewDefinition) {


            data.params = (data.params || []).map(function (paramData) {
                // allow author to override initial parameter values by specifying them as div attributes
                if (div.hasAttribute(paramData.name)) {
                    paramData.value = div.getAttribute(paramData.name)
                }
                // convert numerical params from strings to numbers
                paramData.value = isNaN(+paramData.value) ? paramData.value : +paramData.value;
                return paramData;
            });

            let view = this;
            view.div = d3.select(div).style('position', 'relative');
            view.svg = view.div.append("svg").style("overflow", "visible").style("pointer-events", "none");
            view.svgDefs = view.svg.append("defs");
            view.aspectRatio = data.aspectRatio || 1;
            view.model = new KG.Model(data.params, data.restrictions);


            /*
             Each REF_CATEGORY is a category of REF -- e.g., a scale or a function.
             Each REF is a JS object that is used by viewable objects, but has no DOM representation.
             This next part of the code reads each category of REF and generates the appropriate REF objects.
             Each REF has a name that is unique within its category; the global key for each REF is category_name.
             For example, an xAxis REF named 'good1' would now be referred to as 'view.refs.xAxis_good1.'
             */

            view.refs = {};
            REF_CATEGORIES.forEach(function (refDef: RefCategoryDef) {
                if (data.hasOwnProperty(refDef.category)) {
                    data[refDef.category].forEach(function (def) {

                        // each object has a reference to the model so it can update itself
                        def.model = view.model;

                        // create the object
                        const newRef = new KG[refDef.className](def);

                        // add the object, with a unique name, to the view.refs object
                        view.refs[refDef.category + '_' + def.name] = newRef;

                        // store some categories (e.g., scales) as properties of the view
                        STORED_CATEGORIES.forEach(function (category) {
                            view[category] = view[category] || [];
                            if (refDef.category == category) {
                                view[category].push(newRef);
                            }
                        })
                    })
                }
            });

            /*
             Each VIEW_OBJECT_CATEGORY is a category of a viewObject -- e.g., a point or a segment.
             Each category is allocated a "layer" in the SVG (or div).
             As each is created, it adds elements to the DOM within that layer.
             Once the diagram is completed, only the attributes of the DOM change; no new elements are added.
             */

            VIEW_OBJECT_CATEGORIES.forEach(function (voCategoryDef: ViewObjectCategoryDef) {
                    if (data.hasOwnProperty(voCategoryDef.name)) {

                        // Create the DOM parent for the category
                        const layer = (voCategoryDef.parent == 'defs') ? view.svgDefs : view[voCategoryDef.parent].append(voCategoryDef.element).attr('class', voCategoryDef.name);

                        // Create a JS object for each element of the category by creating its definition object
                        data[voCategoryDef.name].forEach(function (def) {

                            // each object has a reference to the model so it can update itself
                            def.model = view.model;

                            // each object is assigned its category's "layer" in the SVG (or div).
                            def.layer = layer;

                            // a clip path is both a layer and a ref; needs to be handled separately from other REFs.
                            if (def.hasOwnProperty('clipPathName')) {
                                def.clipPath = view.refs["clipPaths_" + def.clipPathName]
                            }

                            // point to previously created REFs in each category of REF
                            REF_CATEGORIES.forEach(function (ref: RefCategoryDef) {
                                if (!def.hasOwnProperty(ref.refName)) return;
                                if (def[ref.refName] instanceof Array) {
                                    def[ref.propName] = def[ref.refName].map(function (name) {
                                        return view.refs[ref.category + '_' + name]
                                    })
                                } else {
                                    def[ref.propName] = view.refs[ref.category + '_' + def[ref.refName]];
                                }

                            });

                            // use the definition object to create the ViewObject
                            const newViewObject = new KG[voCategoryDef.className](def);

                            // a clip path is both a layer and a ref; need to store them to view.refs
                            if (voCategoryDef.className == 'ClipPath') {
                                view.refs['clipPaths_' + def.name] = newViewObject;
                            }

                        });
                    }
                }
            );

            view.updateDimensions();

        }

        // update dimensions, either when first rendering or when the window is resized
        updateDimensions() {
            let view = this;

            // read the client width of the enclosing div and calculate the height using the aspectRatio
            const width = view.div.node().clientWidth,
                height = width / view.aspectRatio;

            // set the height of the div
            view.div.style.height = height + 'px';

            // set the dimensions of the svg
            view.svg.style('width', width);
            view.svg.style('height', height);

            // adjust all of the scales to be proportional to the new dimensions
            view.xScales.forEach(function (scale) {
                scale.extent = width;
            });
            view.yScales.forEach(function (scale) {
                scale.extent = height;
            });

            // once the scales are updated, update the coordinates of all view objects
            view.model.update(true);
        }
    }

}