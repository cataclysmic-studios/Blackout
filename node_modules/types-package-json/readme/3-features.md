**Zero overhead** - contains only types and interfaces, no actual objects
**PackageJson** - full package.json interface, name and version is required
**PackageJsonAddress** - optional email and url
**PackageJsonPerson** - required name, optional email and url
**PackageJsonDependencyTypes** - 'dependencies' | 'devDependencies' | 'peerDependencies' | 'optionalDependencies' (bundledDependencies are not included in this type as they serve different purpose)
