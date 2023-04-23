// this file uses features that eslint doesn't like :(

/** Returns a union of all the keys of T which do not start with `_nominal_` */
type ExcludeNominalKeys<T> = { [K in keyof T]: K extends `_nominal_${infer _U}` ? never : K }[keyof T];
