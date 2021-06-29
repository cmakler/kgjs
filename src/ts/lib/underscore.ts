module KG {

    /*

 from underscorejs

 Copyright (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative
 Reporters & Editors

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.*/


// I adapted these functions from the amazing underscorejs library.

    function isObject(obj) {
        const type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    }

    export function allKeys(obj) {
        if (!isObject(obj)) return [];
        let keys = [];
        for (let key in obj) keys.push(key);
        return keys;
    }

    function defaults(obj: any, def: any) {
        if (def == null || obj == null) return obj;
        const keys = allKeys(def),
            l = keys.length;
        for (let i = 0; i < l; i++) {
            const key = keys[i];
            if (obj[key] === void 0) obj[key] = def[key];
        }
        return obj;
    }

    // End of underscorejs functions

    export function setDefaults(def: any, defaultValues: any) {
        def = defaults(def, defaultValues);
        return def;
    }

    export function setProperties(def: any, name: 'constants' | 'updatables' | 'colorAttributes', props: string[]) {
        def[name] = (def[name] || []).concat(props);
        return def;
    }

}

