/// <reference path="../../kg.ts" />

module KG {

    export interface SliderDefinition extends DivObjectDefinition {
        param: string;
        label: string;
        noAxis?: boolean;
    }

    export interface ISlider extends IDivObject {

    }

    export class Slider extends DivObject {

        private param;
        private label;
        private noAxis;
        private rangeInput;
        private numberInput;
        private labelElement;

        constructor(def: SliderDefinition) {

            // establish property defaults
            def = _.defaults(def, {
                value: 'params.' + def.param,
                noAxis: false,
                constants: [],
                updatables: []
            });

            // define constant and updatable properties
            def.constants = def.constants.concat(['param', 'noAxis'])
            def.updatables = def.updatables.concat(['label', 'value']);

            super(def);
        }

        draw(layer) {
            let slider = this;
            slider.element = layer.append('tr');
            const param = slider.model.getParam(slider.param);
            slider.labelElement = slider.element.append('td')
                .style('font-size', '14pt')

            slider.numberInput = slider.element.append('td').append('input')
                .attr('type', 'number')
                .attr('min', param.min)
                .attr('max', param.max)
                .attr('step', param.round)
                .style('font-size', '14pt')
                .style('border','none')
                .style('background','none')
                .style('padding-left','5px')
                .style('font-family','KaTeX_Main');
            slider.numberInput.on("input", function () {
                slider.model.updateParam(slider.param, +this.value)
            });

            slider.rangeInput = slider.element.append('td').append('input')
                .attr('type', 'range')
                .attr('min', param.min)
                .attr('max', param.max)
                .attr('step', param.round);
            slider.rangeInput.on("input", function () {
                slider.model.updateParam(slider.param, +this.value)
            });
            return slider;

        }

        // update properties
        update(force) {
            let slider = super.update(force);
            if (slider.hasChanged) {
                katex.render(`${slider.label} = `, slider.labelElement.node());
                slider.numberInput.property('value', slider.value.toFixed(slider.model.getParam(slider.param).precision));
                slider.rangeInput.property('value', slider.value);
            }
            return slider;
        }
    }

}