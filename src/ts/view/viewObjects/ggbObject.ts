/// <reference path="../../kg.ts" />

module KG {

    export interface GeoGebraObjectDefinition extends ViewObjectDefinition {
        command: string;
        color: string;
    }

    export class GeoGebraObject extends ViewObject {

        private command;

        constructor(def: GeoGebraObjectDefinition) {

            setProperties(def, 'constants', ['command','color']);
            super(def);
        }

        establishGGB(applet) {

            // from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
            function hexToRgb(hex) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            }

            const obj = this;

            console.log('sending commands to applet', applet);

            // set command
            const command = obj.name + " = " + obj.command;
            console.log('sending command ',obj.name + " = " + obj.command);
            applet.evalCommand(command);
            if (obj.hasOwnProperty('opacity')) {
                applet.setFilling(obj.opacity);
            }
            const color = hexToRgb(obj.color);
            console.log('sending command setColor(',obj.name,', ',color.r,',',color.g,', ',color.b,')' );
            if (color) {
                applet.setColor(obj.name, color.r, color.g, color.b);
            }

        }
    }

}
