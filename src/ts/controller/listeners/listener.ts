/// <reference path="../../kg.ts" />

module KG {

    export interface ListenerDefinition extends UpdateListenerDefinition {
        param: string;
        expression?: string;
    }

    export interface IListener extends IUpdateListener {
        onChange: (scope: { params: {}, drag: {} }) => void;
    }

    /*

        A listener is defined by a param and an expression.
        When the interactionHandler senses a change, it generates a scope of the current state of the model.
        The listener then determines the current value of its expression within the context of that scope,
        and sends a signal to the model to update its param.

     */

    export class Listener extends UpdateListener implements IListener {

        public param;
        public expression;

        constructor(def: ListenerDefinition) {
            setProperties(def, 'updatables',['expression']);
            setProperties(def, 'constants',['param']);
            super(def);
        }

        onChange(scope) {
            const l = this,
                compiledMath = math.compile(l.expression);
            let parsedMath = compiledMath.evaluate(scope);
            l.model.updateParam(l.param, parsedMath);
        }

    }

}