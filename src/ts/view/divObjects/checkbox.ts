/// <reference path="../../kg.ts" />

module KG {

    export class Checkbox extends ParamControl {

        private inputElement;
        private labelElement;

        draw(layer) {
            let checkbox = this;
            checkbox.rootElement = layer.append('div').append('label');
            checkbox.inputElement = checkbox.rootElement.append('input');
            checkbox.inputElement
                .attr('type','checkbox');
            checkbox.inputElement.on("change", function () {
                checkbox.model.toggleParam(checkbox.param)
            });
            checkbox.labelElement = checkbox.rootElement.append('span');
            checkbox.labelElement.style('padding-left','10px').attr('class','checkbox-label');
            return checkbox;
        }

        redraw() {
            const checkbox = this;
            if (checkbox.plainText) {
                console.log('checkbox is plain text');
                checkbox.labelElement.text(checkbox.label);
            } else {
                katex.render(checkbox.label, checkbox.labelElement.node());
            }
            checkbox.inputElement.property('checked',Boolean(checkbox.value));

            return checkbox;
        }
    }

}