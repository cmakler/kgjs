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
            let controls_id = KG.randomString(5);

            controls.rootElement = layer.append('div').style('padding-top', '10px').style('padding-bottom', '10px');
            controls.titleElement = controls.rootElement.append('div').style('font-size', '10pt').style('padding-bottom', 10);
            controls.rootElement.append('hr');
            controls.descriptionElement = controls.rootElement.append('div');
            controls.descriptionElement.style('margin-bottom', '10px');

            if (controls.sliders.length > 0) {
                const sliderTable = controls.rootElement.append('table').style('padding', '10px').style('width', '100%').style('margin', '0px 0px 10px 0px');
                controls.sliders.forEach(function (slider) {
                    new Slider({layer: sliderTable, param: slider.param, label: slider.label, digits: slider.digits, showNumber: slider.showNumber, model: controls.model, show: slider.show})
                });
            }

            controls.radios.forEach(function (radio) {
                radio = setDefaults(radio, {
                    layer: controls.rootElement,
                    model: controls.model,
                    figure_id: controls_id
                });
                new Radio(radio)
            });


            if (controls.checkboxes.length > 0) {
                if (controls.radios.length > 0) {
                    controls.rootElement.append('div').style('margin-bottom', '10px');
                }
                controls.checkboxes.forEach(function (checkbox) {
                    checkbox = setDefaults(checkbox, {
                        layer: controls.rootElement,
                        model: controls.model
                    });
                    new Checkbox(checkbox)
                });
            }


            controls.divs.forEach(function (div) {
                div = setDefaults(div, {
                    layer: controls.rootElement,
                    model: controls.model,
                    fontSize: 14
                });
                if (div.hasOwnProperty('html')) {
                    new Div(div)
                } else if (div.hasOwnProperty('table')) {
                    div.rows = div.table.rows;
                    div.columns = div.table.columns;
                    div.lines = div.table.lines;
                    div.fontSize = 10;
                    delete div.table;
                    new Table(div)
                }

            });
            return controls;

        }

        // update properties
        redraw() {
            let controls = this;
            if (controls.title.length > 0) {
                controls.titleElement.text(controls.title.toUpperCase());
            }
            controls.descriptionElement.html(controls.description);
            return controls;
        }
    }

}