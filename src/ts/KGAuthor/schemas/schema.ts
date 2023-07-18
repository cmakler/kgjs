/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface SchemaDefinition extends AuthoringObjectDefinition {
        custom: string;
        idioms: any;
        colors: any;
    }

    export class Schema extends AuthoringObject {

        public colors: {};
        public idioms: {};
        public idiomMenu: any[];

        constructor(def:SchemaDefinition) {

            const palette = {
                blue: 'd3.schemeCategory10[0]',     //#3182bd
                orange: 'd3.schemeCategory10[1]',   //#e6550d
                green: 'd3.schemeCategory10[2]',    //#31a354
                red: 'd3.schemeCategory10[3]',      //#d62728
                purple: 'd3.schemeCategory10[4]',   //#756bb1
                brown: 'd3.schemeCategory10[5]',    //#8c6d31
                magenta: 'd3.schemeCategory10[6]',  //#7b4173
                grey: 'd3.schemeCategory10[7]',     //#636363
                gray: 'd3.schemeCategory10[7]',     //#636363
                olive: 'd3.schemeCategory10[8]'     //#637939
            };

            for(const color in def.colors) {
                const colorName = def.colors[color];
                if(palette.hasOwnProperty(colorName)) {
                    def.colors[color] = palette[colorName];
                }
            }

            def.colors = KG.setDefaults(def.colors || {}, palette);

            super(def);

            this.colors = def.colors;
            this.idioms = def.idioms;

        }

        parseSelf(parsedData: KG.ViewDefinition) {
            const colors = this.colors;
            parsedData.colors = KG.setDefaults(parsedData.colors || {}, colors);
            parsedData.idioms = this.idioms;
            return parsedData;
        }
    }

}