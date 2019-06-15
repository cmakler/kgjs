/// <reference path="../../kg.ts" />

module KGAuthor {

    export interface DivObjectDefinition extends GraphObjectDefinition {

    }

    export class DivObject extends GraphObject {

    	parseSelf(parsedData: KG.ViewDefinition) {
            parsedData.divs.push(this);
            return parsedData;
        }
    }

    export class Div extends DivObject {

    	constructor(def) {
    		super(def);
    		this.type = "Div"
    	}
    	
    }

}