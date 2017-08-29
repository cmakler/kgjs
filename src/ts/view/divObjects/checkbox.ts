/// <reference path="../../kg.ts" />

module KG {

    export class Checkbox extends ParamControl {

        draw(layer) {
            let checkbox = this;
            checkbox.element = layer.append('tr');
            const param = checkbox.model.getParam(checkbox.param);
            checkbox.labelElement = checkbox.element.append('td')
                .style('font-size', '14pt')

            checkbox.numberInput = checkbox.element.append('td').append('input')
                .attr('type', 'number')
                .attr('min', param.min)
                .attr('max', param.max)
                .attr('step', param.round)
                .style('font-size', '14pt')
                .style('border','none')
                .style('background','none')
                .style('padding-left','5px')
                .style('font-family','KaTeX_Main');
            checkbox.numberInput.on("input", function () {
                checkbox.model.updateParam(checkbox.param, +this.value)
            });

            checkbox.rangeInput = checkbox.element.append('td').append('input')
                .attr('type', 'range')
                .attr('min', param.min)
                .attr('max', param.max)
                .attr('step', param.round);
            checkbox.rangeInput.on("input", function () {
                checkbox.model.updateParam(checkbox.param, +this.value)
            });
            return checkbox;

        }

        // update properties
        update(force) {
            let checkbox = super.update(force);
            if (checkbox.hasChanged) {
                katex.render(`${checkbox.label} = `, checkbox.labelElement.node());
                checkbox.numberInput.property('value', checkbox.value.toFixed(checkbox.model.getParam(checkbox.param).precision));
                checkbox.rangeInput.property('value', checkbox.value);
            }
            return checkbox;
        }
    }

}