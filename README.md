[![Build Status](https://travis-ci.org/davidmfoley/node-trucker.svg?branch=master)](https://travis-ci.org/davidmfoley/node-trucker)
[![NPM Version](https://img.shields.io/npm/v/trucker.svg)](https://www.npmjs.com/package/trucker)
# trucker

Trucker is a tool that helps manage dependencies between javascript files


It has three main functions:

1. Show all inbound and outbound dependencies for javascript and coffeescript source files. (```trucker --info filename.js``` or ```trucker -i filename.js```)

1. Move/rename source files while fixing up the paths used in requires. (```trucker --move source destination``` or ```trucker -m source destination```)

1. Find unused files (files that are not required by any other files). (```trucker --unused``` or ```trucker -u```)

Why is it called trucker? Because it hauls your files around without breaking them.

# Support

## Languages

* Javascript, as parsed by babel (up to ES7)

* Coffeescript

## Module systems

* CommonJS - i.e. ```module.exports``` and ```require``` (for example: node.js or browserify source files)

* ECMAScript 6 - i.e. ```export``` and ```import```.

# Installation

```npm install -g trucker```

Trucker requires node.js 0.12 or greater.

The unit tests use block scoping and arrow functions, so they require Node 4+.

# Usage

### Move files

To move files:

```trucker  --move [flags] source [additional sources...] destination```

### Get dependency info about files

To get info about files:

```trucker --info [optional file paths]```

If no paths are passed, trucker will spit out information for all files in the `base` path (see options below).

### Find unused files

Find files that are not required by any other source files in given path

```trucker --unused [path]```

## Examples

in the examples directory (provided), you can try the following (add ```-n``` for dry run mode if desired):

- Get info about all dependencies in the current directory and all sub directories
```trucker --info```

- Get dependencies for just one subdirectory
```trucker -i stark/```

- Move a single file:
```trucker --move stark/eddard.js deceased/```

- Move a single file, specifying destination path:
```trucker -m stark/eddard.js deceased/ned.js```

- Move multiple files explicitly
```trucker -m stark/eddard.js tully/catelyn.js deceased/```

- Move a directory:
```trucker -m stark deceased/stark```

- Paths are automatically created:
```trucker -m stark/eddard.js deceased/in/book1/```

## Options
```-h, --help``` prints the help

```-n, --dry-run``` tells trucker not to move any files, but to instead print out a list of all of the changes that would have been made if this option was not set.

```-s, --scope``` can be used to expand or contract the set of files that trucker searches for dependencies. This defaults to the present working directory. If you have a very large project you may wish to constrain the scope for performance reasons (analysis takes time), or in some cases you may wish to expand the scope beyond the current directory. Use ```--scope``` for this.

```-q, --quiet``` suppress output

```-e, --exclude``` Add file glob pattern to ignore to those found in the `.gitignore` file. Repeat this options to add many patterns.

# Supported file types

Trucker supports javascript and coffeescript source files. It can handle projects that have both of these file types intermixed.

# Ignored files

Trucker ignores files using the first .gitignore it finds, starting from the base directory (usually cwd), and ascending to the root.

See too the `--exclude` option above.

# Limitations

## Tested on OSX

Should also work on other platforms. Let me know if you have a problem.

## require syntax

Trucker only recognizes basic require syntax.

Trucker doesn't recognize this, for example:
```javascript
var x = '../foo/bar';
var y = require(x);
```
