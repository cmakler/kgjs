/// <reference path="./kg.ts" />

module KG {

    export interface IContainer {

        div: HTMLElement;   // the Container is defined by an HTML element with a src attribute
        model: Model;       // the Container creates a Model for all objects within it
        views: View[];      // the Container creates a View to display objects

        aspectRatio: number;    // the JSON description of the diagram includes its aspect ratio
        width: number;          // the measured width of the Container
        height: number;         // the height of the Container is determined from its width and the aspect ratio

        updateDimensions: () => Container;  // called on a window resize event; updates the size of the Container

    }

    export class Container implements IContainer {

        public div;
        public model;
        public width;
        public height;
        public aspectRatio;
        public views;

        constructor(div: any) {

            let container = this;

            container.div = div;
            container.views = [];

            d3.json(div.getAttribute('src'), function (data) {

                // override params from JSON if there are attributes on the div with the same name
                for (let param in data.params) {
                    if (data.params.hasOwnProperty(param) && div.hasAttribute(param)) {
                        data.params[param].value = div.getAttribute(param);
                    }
                }

                container.model = new KG.Model(data);
                container.aspectRatio = data.aspectRatio || 1;

                // establish container dimensions
                container.updateDimensions();

                // create new view objects from data
                if (data.hasOwnProperty('views')) {
                    container.views = data.views.map(function (viewDef) {
                        return new View(container, viewDef)
                    });
                }

            });
        }

        updateDimensions() {
            let container = this;
            container.width = container.div.clientWidth;
            container.height = container.width / container.aspectRatio;
            container.div.style.height = container.height + 'px';
            container.views.forEach(function (v) {
                v.updateDimensions()
            });
            return container;
        }
    }

}