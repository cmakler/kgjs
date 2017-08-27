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

            // establish property defaults
            def = _.defaults(def, {
                constants: [],
                updatables: []
            });

            // define updatable properties
            def.constants = def.constants.concat(['sliders']);
            def.updatables = def.updatables.concat(['title', 'description']);

            super(def);
        }

        positionRight(width) {
            let sidebar = this;
            sidebar.element
                .style('position', 'absolute')
                .style('left', width * 847 / 1260 + 'px')
                .style('top', '0px')
                .style('width', width * 385 / 1260 + 'px')
        }

        positionBelow() {
            let sidebar = this;
            sidebar.element
                .style('position', null)
                .style('left', null)
                .style('width', null);
        }

        addSlider(sliderDef) {

        }

        // create div for text
        draw(layer) {
            let sidebar = this;

            sidebar.element = layer.append('div').style('position', 'absolute');
            sidebar.titleElement = sidebar.element.append('p').style('width','100%').append('span').attr('class','newthought');
            sidebar.descriptionElement = sidebar.element.append('div');
            const sliderTable = sidebar.element.append('table').style('padding','10px');
            sidebar.sliders.forEach(function(slider) {
                new Slider({layer: sliderTable, param: slider.param, label: slider.label, model: sidebar.model})
            });
            return sidebar;

        }

        // update properties
        update(force) {
            let sidebar = super.update(force);
            if (sidebar.hasChanged) {
                sidebar.titleElement.text(sidebar.title.toLowerCase());
                sidebar.descriptionElement.text(sidebar.description);
            }
            return sidebar;
        }
    }

}