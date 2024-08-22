/// <reference path="../eg.ts" />

module KGAuthor {
    export class LowdownSchema extends EconSchema {

        constructor(def) {

            // create color scheme here; I took these from the spreadsheet
            let blue = "'#0000AA'",
                red = "'#AA0000'";

            // define any overrides to the defined Econ schema here
            def.colors = {

                // consumer theory
                demand: blue,
                supply: blue,
                equilibriumPrice: red

            };
            super(def);

        }
    }

}