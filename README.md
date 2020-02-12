# express-composition

Useful complement for `express` applications.

## Installation

`$ npm i express-composition`

## Why?

This package aims to be a good complement for [`express`](https://www.npmjs.com/package/express) applications.

## API

Go to [README.api.md](https://github.com/allnulled/express-composition/blob/master/README.api.md) to see the whole API documentation.

## Examples

This section will give a complete example of the usage of each utility of the package.

The order of the utilities is from most abstract to least, so parent classes come first.

The following examples use [`chai`](https://github.com/chaijs/chai) to demonstrate the usage of the utilities listed.



### `Composable`

This class makes the first argument of its constructor to be an object that overrides the properties and methods of the created instance.

Class thought to be extended.

The following examples can be found at [examples folder](https://github.com/allnulled/express-composition/tree/master/example).

The following examples will use [`chai`]() for assertions to demonstrate how these utilities work.

When you see `require(__dirname + "/../src/index.js")`, you have to think about it as `require("express-composition")`.

#### Code example

```js
const { expect } = require("chai");
const { Composable } = require(__dirname + "/../src/index.js");
const composed = new Composable({a:0});
expect(composed.a).to.equal(0);
```

### `Controller` (extends `Composable`)

Class thought to be extended.

This class creates the basis of an `express-composition` controller.

#### Code example

```js
const { Controller } = require(__dirname + "/../src/index.js");
class MyController extends Controller {
    onMount(application) {
        application[this.method](this.route, this.middleware, function(request, response, next) {
            response.send("This is a custom controller");
        });
    }
}
const myController = new MyController();
```

### `AppComposer` (extends `Composable`)

@TODO...

#### Code example

### `EjsTemplate` (extends `Controller`)

#### Code example

### `JsFactory` (extends `Controller`)

#### Code example

### `JsFactoryFile` (extends `Controller`)

#### Code example

### `JsFile` (extends `Controller`)

#### Code example

### `MySqlRestApi` (extends `Controller`)

#### Code example

### `StaticFiles` (extends `Controller`)

#### Code example

## Tests

To run the test, clone the repository and run `npm run test`.

## Coverage

To run the coverage test, clone the repository and run `npm run cover`.

## License

This project is licensed under [WTFPL](https://es.wikipedia.org/wiki/WTFPL), which stands for *Do What The Fuck You Want To Public License*.

## Versioning

This project adheres to [semantic versioning 2.0](https://semver.org/).

## Issues

To communicate issues [here](https://github.com/allnulled/express-composition/issues/new).