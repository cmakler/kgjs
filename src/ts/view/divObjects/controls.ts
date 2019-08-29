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
            setProperties(def, 'constants', ['sliders', 'checkboxes', 'radios', 'divs']);
            setProperties(def, 'updatables', ['title', 'description']);

            super(def);
        }

        // create div for text
        draw(layer) {
            let controls = this;

            controls.rootElement = layer.append('div').style('padding-top','10px').style('padding-bottom','10px');
            controls.titleElement = controls.rootElement.append('p').style('width', '100%').style('font-size', '10pt').style('margin-bottom', 10);
            controls.rootElement.append('hr');
            controls.descriptionElement = controls.rootElement.append('div');
            if (controls.sliders.length > 0) {
                const sliderTable = controls.rootElement.append('table').style('padding', '10px').style('width', '100%').style('margin','0px');
                controls.sliders.forEach(function (slider) {
                    new Slider({layer: sliderTable, param: slider.param, label: slider.label, model: controls.model})
                });
            }
            controls.checkboxes.forEach(function (checkbox) {
                checkbox = setDefaults(checkbox, {
                    layer: controls.rootElement,
                    model: controls.model
                });
                new Checkbox(checkbox)
            });
            controls.radios.forEach(function (radio) {
                radio = setDefaults(radio, {
                    layer: controls.rootElement,
                    model: controls.model
                });
                new Radio(radio)
            });
            controls.divs.forEach(function (div) {
                div = setDefaults(div, {
                    layer: controls.rootElement,
                    model: controls.model,
                    fontSize: 14
                });
                new Div(div)
            });
            return controls;

        }

        // update properties
        redraw() {
            let controls = this;
            if (controls.title.length > 0) {
                controls.titleElement.text(controls.title.toUpperCase());
            }
            controls.descriptionElement.text(controls.description);
            return controls;
        }
    }

}