/// <reference path="../../kg.ts" />

module KG {

    export interface LegendDefinition extends ViewObjectDefinition {
        title: string;
        description: string;
        sliders: any[];
    }

    export interface ILegend extends IViewObject {
        positionRight: (width: number) => void;
        positionBelow: () => void;
    }

    export class Legend extends ViewObject {

        private title;
        private description;
        private titleElement;
        private descriptionElement;
        public position: 'right' | 'bottom';

        constructor(def: LegendDefinition) {

            // establish property defaults
            def = _.defaults(def, {
                constants: [],
                updatables: []
            });

            // define updatable properties
            def.constants = def.constants.concat(['sliders']);
            def.updatables = def.updatables.concat(['title', 'description']);

            super(def);
        }

        positionRight(width) {
            let legend = this;
            legend.element
                .style('position', 'absolute')
                .style('left', width * 847 / 1260 + 'px')
                .style('top', '0px')
                .style('width', width * 385 / 1260 + 'px')
        }

        positionBelow() {
            let legend = this;
            legend.element
                .style('position', null)
                .style('left', null)
                .style('width', null);
        }

        addSlider(sliderDef) {

        }

        // create div for text
        draw(layer) {
            let legend = this;

            legend.element = layer.append('div').style('position', 'absolute');
            legend.titleElement = legend.element.append('p').style('width','100%').append('span').attr('class','newthought');
            legend.descriptionElement = legend.element.append('div');
            const sliderTable = legend.element.append('table').style('padding','10px');
            legend.sliders.forEach(function(slider) {
                new Slider({layer: sliderTable, param: slider.param, label: slider.label, model: legend.model})
            });
            return legend;

        }

        // update properties
        update(force) {
            let legend = super.update(force);
            if (legend.hasChanged) {
                legend.titleElement.text(legend.title.toLowerCase());
                legend.descriptionElement.text(legend.description);
            }
            return legend;
        }
    }

}