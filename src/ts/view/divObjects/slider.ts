/// <reference path="../../kg.ts" />

module KG {

    export interface SliderDefinition extends ParamControlDefinition {
        noAxis?: boolean;
        showNumber?: boolean;
    }

    export class Slider extends ParamControl {

        private noAxis;
        private rangeInput;
        private numberInput;
        private labelElement;
        private showNumber;

        constructor(def: SliderDefinition) {

            // establish property defaults
            setDefaults(def, {
                noAxis: false,
                showNumber: true
            });

            // define constant and updatable properties
            setProperties(def, 'constants', ['noAxis', 'showNumber']);

            super(def);
        }

        draw(layer) {
            let slider = this;
            slider.rootElement = layer.append('tr');
            const param = slider.model.getParam(slider.param);
            slider.labelElement = slider.rootElement.append('td')
                .style('font-size', '14pt')
                .style('text-align', 'right')
                .style('padding', '0px')
                .style('margin', '0px')
                .style('border', 'none');

            function inputUpdate() {
                slider.model.updateParam(slider.param, +this.value)
            }

            let numberCell = slider.rootElement.append('td')
                    .style('padding', '0px')
                    .style('margin', '0px')
                    .style('border', 'none');

            if (slider.showNumber) {
                slider.numberInput = numberCell.append('input')
                    .attr('type', 'number')
                    .attr('min', param.min)
                    .attr('max', param.max)
                    .attr('step', param.round)
                    .style('font-size', '14pt')
                    .style('border', 'none')
                    .style('background', 'none')
                    .style('font-family', 'KaTeX_Main')
                    .style('margin', '0px')
                    .style('padding-top', '0px')
                    .style('padding-bottom', '0px')
                    .style('width', '100%');
                slider.numberInput.on("blur", inputUpdate);
                slider.numberInput.on("click", inputUpdate);
                slider.numberInput.on("keyup", function () {
                    if (event['keyCode'] == 13) {
                        slider.model.updateParam(slider.param, +this.value)
                    }
                });
            } else {
                numberCell.style('width','10px')
            }

            let rangeCell = slider.rootElement.append('td')
                .style('padding', '0px')
                .style('margin', '0px')
                .style('border', 'none');

            slider.rangeInput = rangeCell.append('input')
                .attr('type', 'range')
                .attr('min', param.min)
                .attr('max', param.max)
                .attr('step', param.round)
                .style('padding', '0px')
                .style('width', '100%')
                .style('margin', '0px');
            slider.rangeInput.on("input", inputUpdate);
            return slider;

        }

        // update properties
        redraw() {
            let slider = this;
            if (slider.showNumber) {
                katex.render(`${slider.label} = `, slider.labelElement.node());
                slider.numberInput.property('value', slider.value.toFixed(slider.model.getParam(slider.param).precision));
            } else {
                katex.render(slider.label, slider.labelElement.node());
            }
            slider.rangeInput.property('value', slider.value);
            return slider;
        }
    }

}