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


// These are the (very few) functions I use from the amazing underscorejs library.

module _ {

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

    // An internal function for creating assigner functions.
    function createAssigner(keysFunc, undefinedOnly) {
        return function (obj) {
            const length = arguments.length;
            if (length < 2 || obj == null) return obj;
            for (let index = 1; index < length; index++) {
                let source = arguments[index],
                    keys = keysFunc(source),
                    l = keys.length;
                for (let i = 0; i < l; i++) {
                    const key = keys[i];
                    if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
                }
            }
            return obj;
        };
    }

    export const defaults:(obj:{},def:{}) => any = createAssigner(allKeys, true);
}