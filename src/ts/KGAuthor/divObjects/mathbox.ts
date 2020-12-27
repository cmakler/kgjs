/// <reference path="../../kg.ts" />

module KGAuthor {

    export interface MathboxDefinition extends DivObjectDefinition {
        xAxis: MathboxAxisDefinition;
        yAxis: MathboxAxisDefinition;
        zAxis: MathboxAxisDefinition;
        objects: KG.TypeAndDef[];
        xScaleName?: string;
        yScaleName?: string;
        zScaleName?: string;
    }

    export interface IMathbox {
        addObject: (mbo: {type: string; def: MathboxObjectDefinition}) => Mathbox;
    }

    export class Mathbox extends DivObject implements IMathbox {
        constructor(def: MathboxDefinition) {
            super(def);
            let mb = this;
            mb.type = 'Mathbox';
            def.objects.forEach(function(mbo) {mbo.def.mb = mb});
        }

        addObject(mbo) {
            this.def.objects.push(mbo);
            return this;
        }
    }




}