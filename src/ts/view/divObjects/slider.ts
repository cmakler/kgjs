/// <reference path="../../kg.ts" />

module KG {

    export interface SliderDefinition extends ParamControlDefinition {
        noAxis?: boolean;
        showNumber?: boolean;
        digits?: any;
    }

    export class Slider extends ParamControl {

        private noAxis;
        private rangeInput;
        private numberCell;
        private numberInput;
        private labelElement;
        private showNumber;
        private inputWidth;
        public digits;

        constructor(def: SliderDefinition) {

            // establish property defaults
            setDefaults(def, {
                noAxis: false,
                showNumber: true
            });

            // define constant and updatable properties
            setProperties(def, 'constants', ['noAxis', 'label', 'digits']);
            setProperties(def, 'updatables', ['showNumber']);
            super(def);

            // calculate maximum number of digits
            let slider = this;
            const paramObject = slider.model.getParam(slider.param);

            // number of digits for decimals
            const decimalPlaces = paramObject.precision;

            function maxMinDigits(x) {
                if (x > 0) {
                    return  Math.trunc(Math.log10(x)+1);
                }
                else {
                    return Math.trunc(Math.log10(-1*x)+2);
                }
            }

            // number of digits for minimum
            slider.digits = Math.max(maxMinDigits(paramObject.min),maxMinDigits(paramObject.max)) + decimalPlaces;
            console.log("Number of digits: ", slider.digits);

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

            slider.numberCell = slider.rootElement.append('td')
                    .style('padding', '0px')
                    .style('margin', '0px')
                    .style('border', 'none');

            slider.numberInput = slider.numberCell.append('input')
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
                .style('padding-bottom', '0px');
            slider.numberInput.on("blur", inputUpdate);
            slider.numberInput.on("click", inputUpdate);
            slider.numberInput.on("keyup", function () {
                if (event['keyCode'] == 13) {
                    slider.model.updateParam(slider.param, +this.value)
                }
            });

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
                slider.numberInput.style('width',  `${20 + slider.digits*10}px`);
                slider.numberInput.style('display','inline-block');
            } else {
                katex.render(slider.label, slider.labelElement.node());
                slider.numberCell.style('width', '10px');
                slider.numberInput.style('display','none');
            }
            slider.rangeInput.property('value', slider.value);
            return slider;
        }
    }

}