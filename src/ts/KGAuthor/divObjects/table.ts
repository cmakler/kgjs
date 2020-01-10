/// <reference path="../../kg.ts" />

module KGAuthor {

    export interface TableDefinition extends DivObjectDefinition {
        columns?: string[];
        rows: string[][];
        lines?: boolean;
    }

    export class Table extends Div {

        constructor(def: TableDefinition) {

            super(def);
            this.type = 'Table';

        }

    }


}