/// <reference path="../kg.ts" />

module KG {

    export interface IContainer {
        id: string;
        div: HTMLElement;
        scope: Scope;
        data: any;
        width: number;
        height: number;
        updateWidth: () => Container;
    }

    export class Container implements IContainer {

        public div;
        public data;
        public id;
        public scope;
        public width;
        public height;
        public aspectRatio;

        constructor(div: any) {

            let container = this;

            container.div = div;

            d3.json(div.getAttribute('src'), function (data) {

                data.containerId = div.getAttribute('id');

                // override params from JSON if there are attributes on the div with the same name
                for (let param in data.params) {
                    if (data.params.hasOwnProperty(param) && div.hasAttribute(param)) {
                        data.params[param].value = div.getAttribute(param);
                    }
                }

                container.data = data;
                container.scope = new KG.Scope(data,container);
                container.aspectRatio = data.aspectRatio || 1;
                container.updateWidth();

            });




        }
        updateWidth() {
            let container= this;
                container.width = container.div.clientWidth;
            container.height = container.width/container.aspectRatio;
            container.div.style.height = container.height + 'px';
            return container;
            }
    }

}