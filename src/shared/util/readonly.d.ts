// from https://github.com/grilme99/tabletop-island/blob/main/src/types/util/readonly.d.ts
export type DeepReadonly<T> = T extends (infer R)[]
	? DeepReadonlyArray<R>
	: T extends Callback
	? T
	: T extends object
	? DeepReadonlyObject<T>
	: T;

export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> { }

export type DeepReadonlyObject<T> = {
	readonly [P in keyof T]: DeepReadonly<T[P]>;
};