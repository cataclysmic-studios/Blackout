GUID
=====
Compile-time GUID generation library. This can be used for networking remote purposes, or for general compile-time hash requirements.

## Usage
This transformer makes use of the `uuid` jsdoc tag. By default it will use `hashids` for the generated strings. 

```ts
/**
 * @uuid
 */
export const enum UUID {
    A = "Test",
    B = "Test2",
    C = "Test3"
}
```

So now
```ts
/**
 * @uuid
 */
export const enum UUID {
    A = "Test",
    B = "Test2",
    C = "Test3"
}

const test = UUID.A;
```
which will compile to
```lua
local test = "TDr8PURNna"
```

## Macros
### `debugUUIDs` `<T>`
Will reverse hashed enums, e.g.

```ts
/**
 * @uuid
 */
export const enum Test {
  RemoteName1 = "SomethingGoesHereLol",
  RemoteName2 = "AnotherThingGoesHere",
}

const uuids = $debugUUIDs<typeof Test>(); // NOTE: MUST BE `typeof EnumNameHere`.
```

```lua
local uuids = {
	["9QiYxp4Qy60"] = "RemoteName1",
	["0Ysr4LNVO9x"] = "RemoteName2",
}
```

## Configuration
### `verbose: boolean`
Whether or not the transformer's output is verbose, this can also be toggled using `--verbose` to rbxtsc.
### `generateEnumUUIDs: boolean`
Whether or not to generate the UUIDs on compile - will default to true, overridden by `environments`.
### `environments: string[]`
The environments this transformer will run the generators on - defaults to `production`.
### `generationType: UUIDGenerationType`
The type of strings to generate per UUID use - This can be `hashids`, `uuidv4` or `string`.