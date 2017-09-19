/// <reference path="../../kg.ts" />

module KG {

    export interface ControlsDefinition extends DivObjectDefinition {
        title: string;
        description: string;
        sliders: any[];
        checkboxes: any[];
        radios: any[];
        divs: any[];
    }

    export class Controls extends DivObject {

        private title;
        private description;
        private titleElement;
        private descriptionElement;

        constructor(def: ControlsDefinition) {

            setDefaults(def, {
                title: '',
                description: '',
                sliders: [],
                checkboxes: [],
                radios: [],
                divs: []
            });
            setProperties(def, 'constants',['sliders','checkboxes','radios','divs']);
            setProperties(def, 'updatables',['title', 'description']);

            super(def);
        }

        // create div for text
        draw(layer) {
            let controls = this;

            controls.rootElement = layer.append('div');
            controls.titleElement = controls.rootElement.append('p').style('width', '100%').style('font-size', '10pt');
            controls.descriptionElement = controls.rootElement.append('div');
            const sliderTable = controls.rootElement.append('table').style('padding', '10px');
            controls.sliders.forEach(function (slider) {
                new Slider({layer: sliderTable, param: slider.param, label: slider.label, model: controls.model})
            });
            controls.checkboxes.forEach(function (checkbox) {
                new Checkbox({layer: controls.rootElement, param: checkbox.param, label: checkbox.label, model: controls.model})
            });
            controls.radios.forEach(function (radio) {
                new Radio({layer: controls.rootElement, param: radio.param, label: radio.label, optionValue: radio.optionValue, model: controls.model})
            });
            controls.divs.forEach(function (div) {
                new Div({layer: controls.rootElement, html: div.html, fontSize: 14, model: controls.model})
            });
            return controls;

        }

        // update properties
        redraw() {
            let controls = this;
            controls.titleElement.text(controls.title.toUpperCase());
            controls.descriptionElement.text(controls.description);
            return controls;
        }
    }

}