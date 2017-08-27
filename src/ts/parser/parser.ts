/// <reference path="../kg.ts" />

module KG {

    interface GraphDef {
        type: string;
        def: any;
    }

    interface IParser {
        parseSpecial: (data: any) => any;
        parse: (data:any) => any;
    }

    class Parser {

        public specialTypes: string[];

        constructor(defs:AuthoringObjectDefinition[])

        parse(data) {
            return data;
        }
    }

}