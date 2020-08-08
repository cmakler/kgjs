/// <reference path="../../kg.ts" />

module KG {

    export class Radio extends ParamControl {

        private inputElement;
        private labelElement;
        private optionValue;
        private figure_id;

        constructor(def) {
            setProperties(def,'constants',['figure_id']);
            setProperties(def,'updatables',['optionValue']);
            super(def);
        }

        draw(layer) {
            let radio = this;
            radio.rootElement = layer.append('div').append('label');
            radio.inputElement = radio.rootElement.append('input');
            radio.inputElement
                .attr('type','radio')
                .attr('name', radio.figure_id + '_'+ radio.param)
                .attr('value', radio.optionValue);
            radio.inputElement.on("change", function () {
                radio.model.updateParam(radio.param, radio.optionValue);
            });
            radio.labelElement = radio.rootElement.append('span');
            radio.labelElement.style('padding-left','10px');
            return radio;
        }

        redraw() {
            const radio = this;
            radio.inputElement.property('checked',radio.value == radio.optionValue);
            katex.render(radio.label, radio.labelElement.node());
            return radio;
        }
    }

}