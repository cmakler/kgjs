/// <reference path="../../kg.ts" />

module KG {

    export interface ClipPathDefinition extends ViewObjectDefinition {

    }

    export class ClipPath extends ViewObject {

        draw(layer) {
            const cp = this;
            layer.append("clipPath").attr("id",cp.name);
            return cp;
        }

        update(force) {
            let cp = super.update(force);
            return cp;
        }

    }

}