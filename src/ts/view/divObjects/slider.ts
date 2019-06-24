/// <reference path="../../kg.ts" />

module KG {

    export interface SliderDefinition extends ParamControlDefinition {
        noAxis?: boolean;
    }

    export class Slider extends ParamControl {

        private noAxis;
        private rangeInput;
        private numberInput;
        private labelElement;

        constructor(def: SliderDefinition) {

            // establish property defaults
            setDefaults(def, {
                noAxis: false
            });

            // define constant and updatable properties
            setProperties(def, 'constants',['noAxis']);

            super(def);
        }

        draw(layer) {
            let slider = this;
            slider.rootElement = layer.append('tr');
            const param = slider.model.getParam(slider.param);
            slider.labelElement = slider.rootElement.append('td')
                .style('font-size', '14pt');

            function inputUpdate() {
                slider.model.updateParam(slider.param, +this.value)
            }

            slider.numberInput = slider.rootElement.append('td').append('input')
                .attr('type', 'number')
                .attr('min', param.min)
                .attr('max', param.max)
                .attr('step', param.round)
                .style('font-size', '14pt')
                .style('border', 'none')
                .style('background', 'none')
                .style('padding-left', '5px')
                .style('font-family', 'KaTeX_Main')
                .style('width','50px');
            slider.numberInput.on("blur", inputUpdate);
            slider.numberInput.on("click", inputUpdate);
            slider.numberInput.on("keyup", function() {
                if(event['keyCode'] == 13) {slider.model.updateParam(slider.param, +this.value)}
            });

            slider.rangeInput = slider.rootElement.append('td').append('input')
                .attr('type', 'range')
                .attr('min', param.min)
                .attr('max', param.max)
                .attr('step', param.round)
                .style('width', '50px');
            slider.rangeInput.on("input", inputUpdate);
            return slider;

        }

        // update properties
        redraw() {
            let slider = this;
            katex.render(`${slider.label} = `, slider.labelElement.node());
            slider.numberInput.property('value', slider.value.toFixed(slider.model.getParam(slider.param).precision));
            slider.rangeInput.property('value', slider.value);
            return slider;
        }
    }

}