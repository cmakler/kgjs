/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class Schema extends AuthoringObject {

        public colors: {};

        constructor(def) {

            const palette = {
                blue: 'd3.schemeCategory20c[0]',    //#3182bd
                orange: 'd3.schemeCategory20c[4]',  //#e6550d
                green: 'd3.schemeCategory20c[8]',   //#31a354
                purple: 'd3.schemeCategory20c[12]', //#756bb1
                grey: 'd3.schemeCategory20c[16]',   //#636363
                olive: 'd3.schemeCategory20b[4]',   //#637939
                brown: 'd3.schemeCategory20b[8]',   //#8c6d31
                red: 'd3.schemeCategory20[6]',      //#d62728
                magenta: 'd3.schemeCategory20b[16]' //#7b4173
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

        }

        parseSelf(parsedData: KG.ViewDefinition) {
            const colors = this.colors;
            parsedData.colors = KG.setDefaults(parsedData.colors || {}, colors);
            return parsedData;
        }
    }

}