/// <reference path="../../kg.ts" />


module KG {

    export interface TableDefinition extends DivObjectDefinition {
        columns?: string[];
        rows: string[][];
        lines?: boolean;
    }

    export class Table extends DivObject {

        public columns: any[];
        public rows: any[][];
        private columnCells: any[];
        private rowCells: any[][];
        private lines: boolean;

        constructor(def: TableDefinition) {
            KG.setDefaults(def, {
                columns: [],
                rows: [],
                fontSize: 8,
                lines: true
            });
            setProperties(def, 'constants', ['fontSize', 'lines']);
            setProperties(def, 'updatables', ['rows', 'columns']);
            super(def);
        }

        // create div for text
        draw(layer) {
            let t = this;
            console.log('table is ', t);
            const hasColumnHeaders = (t.def['columns'].length > 0),
                numColumns = t.def['rows'][0].length,
                numRows = t.def['rows'].length;

            t.rootElement = layer.append('div');

            let table = t.rootElement.append('table').attr('class', 'table');

            table
                .style('margin-left', 'auto')
                .style('margin-right', 'auto')
                .style('font-size', t.fontSize + 'pt')
                .style('text-align', 'center')
                .style('border-collapse', 'collapse')
                .style('margin-top', '15pt')
                .attr('cell-padding', '5px')
                .style('width', '80%');

            t.columnCells = [];


            if (hasColumnHeaders) {
                let columnRow = table.append('thead').append('tr');
                for (let c = 0; c < numColumns; c++) {
                    let columnCell = columnRow.append('td');
                    columnCell
                        .style('font-size', t.fontSize + 'pt')
                        .style('font-weight', 'bold')
                        .style('border-bottom', '1px solid black')
                        .style('text-align', 'center')
                        .style('padding', '0px 10px 0px 10px');
                    t.columnCells.push(columnCell);
                }
            }

            t.rowCells = [];

            let tableBody = table.append('tbody');

            for (let r = 0; r < numRows; r++) {
                let dataRow = []
                let tableRow = tableBody.append('tr');
                for (let c = 0; c < numColumns; c++) {
                    let rowCell = tableRow.append('td');
                    rowCell
                        .style('font-size', t.fontSize + 'pt')
                        .style('text-align', 'center');
                    if (t.lines) {
                        rowCell.style('border-bottom', '0.5px solid grey');
                    }
                    dataRow.push(rowCell);
                }
                t.rowCells.push(dataRow);
            }
            return t;

        }

        redraw() {
            let t = this;

            const hasColumnHeaders = (t.def['columns'].length > 0),
                numColumns = t.rows[0].length,
                numRows = t.rows.length;

            if (hasColumnHeaders) {
                for (let c = 0; c < numColumns; c++) {
                    katex.render("\\text{" + t.columns[c].toString() + "}", t.columnCells[c].node());
                }
            }

            for (let r = 0; r < numRows; r++) {
                for (let c = 0; c < numColumns; c++) {
                    katex.render("\\text{" + t.rows[r][c].toString() + "}", t.rowCells[r][c].node());
                }
            }
            return t;
        }
    }

}