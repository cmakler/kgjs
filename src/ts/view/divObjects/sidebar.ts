/// <reference path="../../kg.ts" />

module KG {

    export interface SidebarDefinition extends ViewObjectDefinition {
        controls: ControlsDefinition[];
    }

    export interface ISidebar extends IViewObject {
        positionRight: (width: number, height: number) => void;
        positionBelow: (width: number, height: number) => void;
    }

    export class Sidebar extends ViewObject implements ISidebar {

        public position: 'right' | 'bottom';
        public triggerWidth: number;

        constructor(def: SidebarDefinition) {

            setDefaults(def, {
                controls: [],
                triggerWidth: 563
            });
            setProperties(def, 'constants', ['controls', 'triggerWidth']);
            super(def);
        }

        positionRight(width, height) {
            let sidebar = this;
            sidebar.rootElement
                .style('left', width * 847 / 1260 + 'px')
                .style('top', '0px')
                .style('width', (width * 413 / 1260 - 10) + 'px')
                .style('height', height + 'px')
                .style('overflow-y', 'scroll')
                .style('right', '-17px')
        }

        positionBelow(width, height) {
            let sidebar = this;
            sidebar.rootElement
                .style('left', '10px')
                .style('top', height + 20 + 'px')
                .style('width', width - 20 + 'px')
                .style('height', null)
        }


        draw(layer) {
            let sidebar = this;

            sidebar.rootElement = layer.append('div').style('position', 'absolute').attr('class', 'sidebar');
            sidebar.controls.forEach(function (controlsDef) {
                controlsDef.layer = sidebar.rootElement;
                controlsDef.model = sidebar.model;
                new Controls(controlsDef);
            });
            return sidebar;

        }
    }

}