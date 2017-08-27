/// <reference path="../../kg.ts" />

module KG {

    export class Schema extends Parser {

        constructor(author_data) {
            super(author_data)
        }

        parse(render_data) {
            return render_data;
        }

    }

}