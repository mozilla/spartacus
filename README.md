[![Build Status](https://travis-ci.org/mozilla/spartacus.svg?branch=master)](https://travis-ci.org/mozilla/spartacus)

![SPARTACUS](https://raw.github.com/mozilla/spartacus/master/spartacus.png)

Spartacus is a single page app front-end for [Webpay](https://github.com/mozilla/webpay/)


## Running Spartacus

 * Checkout the build
 * Run `npm install`
 * Run `npm install -g grunt-cli` (This is the recommended approach for installing the cli - the runner is local to the project see http://gruntjs.com/getting-started#installing-the-cli)
 * Use one of the following grunt commands

### Running the dev server

Run `grunt start`

### Running the styleguide

Run `grunt styleguide`

### Running the unit tests

Run `grunt test`

### Running the UI tests

Run `grunt uitest`. To run a single UI test pass the file with a flag e.g:

`grunt uitest --test tests/ui/test-basic.js`


## Todos

- [ ] Setup Pin Create Flow + Tests
- [ ] Setup Pin Entry Flow + Tests
- [ ] Setup Pin Reset Flow + Tests
- [ ] Setup Tracking + Tests
- [ ] Define build processes (e.g. minification) for JS/CSS etc.
- [ ] Work out deployment strategy.

## Done

- [x] Setup Persona + Tests
- [x] Setup UI Test environment.
- [x] Setup Styleguide
- [x] Setup l10n framework
- [x] Setup template pre-compilation.
- [x] Setup stub views L+F
- [x] Setup Unit Test environment.
- [x] Setup views
- [x] Sort out serving


