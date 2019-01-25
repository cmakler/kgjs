/// <reference path="../../kg.ts" />

module KG {

    export interface SidebarDefinition extends ViewObjectDefinition {
        controls: ControlsDefinition[];
    }

    export interface ISidebar extends IViewObject {
        positionRight: (width: number) => void;
        positionBelow: () => void;
    }

    export class Sidebar extends ViewObject implements ISidebar {

        public position: 'right' | 'bottom';

        constructor(def: SidebarDefinition) {

            setDefaults(def, {
                controls: []
            });
            setProperties(def, 'constants',['controls']);
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
                .style('width', null)
                .style('padding-top', '20px');
        }


        draw(layer) {
            let sidebar = this;

            sidebar.rootElement = layer.append('div').style('position', 'absolute');
            sidebar.controls.forEach(function (controlsDef) {
                controlsDef.layer = sidebar.rootElement;
                controlsDef.model = sidebar.model;
                new Controls(controlsDef);
            });
            return sidebar;

        }
    }

}