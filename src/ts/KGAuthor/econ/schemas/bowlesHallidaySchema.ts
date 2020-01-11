/// <reference path="../eg.ts" />

module KGAuthor {
    export class BowlesHallidaySchema extends EconSchema {

        constructor(def) {

            // create color scheme here; I took these from the spreadsheet
            let purple = "'#3f007d'",
                blue = "'#084081'",
                green = "'#005824'";

            // define any overrides to the defined Econ schema here
            def.colors = {

                // consumer theory
                demand: purple,
                supply: blue,
                equilibriumPrice: green,
                indifferenceCurve: green,
                bestResponse: purple

            };
            super(def);

        }
    }

}