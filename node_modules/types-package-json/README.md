<p align="center">
    <h1>types-package-json</h1>
    <div>A handful set of package.json types and interfaces to improve working with dynamically imported package.json files.</div>
</p>

## Table of contents

1. [Getting Started](#getting-started)

2. [Usage](#usage)

3. [Features](#features)

## Getting Started

`npm i -D types-package-json`

## Usage

```ts
import type { PackageJson } from 'types-package-json';

const packageJsonPath = path.resolve(process.cwd(), `package.json`);
const packageJson: Partial<PackageJson> = await import(packageJsonPath);
```

## Features

**Zero overhead** - contains only types and interfaces, no actual objects.
**PackageJson** - full package.json interface, name and version is required
**PackageJsonAddress** - optional email and url
**PackageJsonPerson** - required name, optional email and url
**PackageJsonDependencyTypes** - 'dependencies' | 'devDependencies' | 'peerDependencies' | 'optionalDependencies' (bundledDependencies are not included in this type as they serve different purpose).
