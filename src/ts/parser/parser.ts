/// <reference path="../kg.ts" />

module KG {

    interface IParser {
        parse: (render_data:ViewDefinition) => ViewDefinition;
    }

    export class Parser implements IParser {

        private author_data;
        private schema;
        public specialTypes: string[];

        constructor(author_data) {
            let parser = this;
            parser.author_data = author_data;
            if (author_data.hasOwnProperty('schema')) {
                if (author_data['schema'] == 'econ') {
                    parser.schema = new EconSchema(author_data)
                }
            }
        }

        parse(render_data) {

            let author_data = this.author_data;

            return render_data;


        }
    }

}