#trucker

Trucker is a command-line tool for developers using Node that helps you to move source files without breaking inter-file ```require``` dependencies.

It hauls your files around without breaking them.

You can think of it as a require-aware wrapper similar to rename or mv.

#Installation

```npm install -g trucker```

(note: trucker requires node.js and npm)

#Usage

```trucker [flags] [source] [destination]```


##Examples
in the examples directory (provided), you can try the following (add ```-n``` for dry run mode if desired):

- Move a single file:
```trucker stark/eddard.js deceased/```

- Move a single file, specifying destination path:
```trucker stark/eddard.js deceased/ned.js```

- Move multiple files with globbing
```trucker stark/* deceased/```

- Move multiple files explicitly
```trucker stark/eddard.js tully/catelyn.js deceased/```

- Move a directory:
```trucker stark deceased/stark```

- Paths are automatically created:
```trucker stark/eddard.js deceased/in/book1/```

##Options
```-h, --help``` prints the help

```-n, --dry-run``` tells trucker not to move any files, but to instead print out a list of all of the changes that would have been made if this option was not set.

```-s, --scope``` can be used to expand or contract the set of files that trucker searches for dependencies. This defaults to the present working directory. If you have a very large project you may wish to constrain the scope for performance reasons (analysis takes time), or in some cases you may wish to expand the scope beuyon the current directory. Use ```--scope``` for this.

```-q, --quiet``` suppress output

# Supported file types

Trucker supports javascript and coffeescript source files. It can handle projects that have both of these file types intermixed.

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

