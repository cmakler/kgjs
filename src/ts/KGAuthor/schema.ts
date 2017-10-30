/// <reference path="../kg.ts" />

module KGAuthor {

    import setDefaults = KG.setDefaults;

    export class Schema extends AuthoringObject {

        public colors: {};

        constructor(def) {

            const palette = {
                blue: 'd3.schemeCategory20c[0]',
                orange: 'd3.schemeCategory20c[4]',
                green: 'd3.schemeCategory20c[8]',
                purple: 'd3.schemeCategory20c[12]',
                grey: 'd3.schemeCategory20c[16]',
                olive: 'd3.schemeCategory20b[4]',
                brown: 'd3.schemeCategory20b[8]',
                red: 'd3.schemeCategory20[6]',
                magenta: 'd3.schemeCategory20b[16]'
            };

            for(const color in def.colors) {
                const colorName = def.colors[color];
                if(palette.hasOwnProperty(colorName)) {
                    def.colors[color] = palette[colorName];
                }
            }

            def.colors = setDefaults(def.colors || {}, palette);

            super(def);

            this.colors = def.colors;

        }

        parseSelf(parsedData: KG.ViewDefinition) {
            const colors = this.colors;
            parsedData.colors = setDefaults(parsedData.colors || {}, colors);
            return parsedData;
        }
    }

}