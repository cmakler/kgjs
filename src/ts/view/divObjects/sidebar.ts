/// <reference path="../../kg.ts" />

module KG {

    export interface SidebarDefinition extends ViewObjectDefinition {
        title: string;
        description: string;
        sliders: any[];
    }

    export interface ISidebar extends IViewObject {
        positionRight: (width: number) => void;
        positionBelow: () => void;
    }

    export class Sidebar extends ViewObject implements ISidebar {

        private title;
        private description;
        private titleElement;
        private descriptionElement;
        public position: 'right' | 'bottom';

        constructor(def: SidebarDefinition) {

            setDefaults(def, {
                title: '',
                description: ''
            });
            setProperties(def, 'constants',['sliders','checkboxes','radios']);
            setProperties(def, 'updatables',['title', 'description']);

            super(def);
        }

        positionRight(width) {
            let sidebar = this;
            sidebar.rootElement
                .style('position', 'absolute')
                .style('left', width * 847 / 1260 + 'px')
                .style('top', '0px')
                .style('width', width * 385 / 1260 + 'px')
        }

        positionBelow() {
            let sidebar = this;
            sidebar.rootElement
                .style('position', null)
                .style('left', null)
                .style('width', null);
        }

        addSlider(sliderDef) {

        }

        // create div for text
        draw(layer) {
            let sidebar = this;

            sidebar.rootElement = layer.append('div').style('position', 'absolute');
            sidebar.titleElement = sidebar.rootElement.append('p').style('width', '100%').style('font-size', '10pt');
            sidebar.descriptionElement = sidebar.rootElement.append('div');
            const sliderTable = sidebar.rootElement.append('table').style('padding', '10px');
            sidebar.sliders.forEach(function (slider) {
                new Slider({layer: sliderTable, param: slider.param, label: slider.label, model: sidebar.model})
            });
            sidebar.checkboxes.forEach(function (checkbox) {
                new Checkbox({layer: sidebar.rootElement, param: checkbox.param, label: checkbox.label, model: sidebar.model})
            });
            sidebar.radios.forEach(function (radio) {
                new Radio({layer: sidebar.rootElement, param: radio.param, label: radio.label, optionValue: radio.optionValue, model: sidebar.model})
            });
            return sidebar;

        }

        // update properties
        redraw() {
            let sidebar = this;
            sidebar.titleElement.text(sidebar.title.toUpperCase());
            sidebar.descriptionElement.text(sidebar.description);
            return sidebar;
        }
    }

}