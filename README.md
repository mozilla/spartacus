[![Build Status](https://travis-ci.org/mozilla/spartacus.svg?branch=master)](https://travis-ci.org/mozilla/spartacus)

![SPARTACUS](https://raw.github.com/mozilla/spartacus/master/spartacus.png)

Spartacus is a single page app front-end for [Webpay](https://github.com/mozilla/webpay/)


## Running Spartacus

 * Checkout the build
 * Run `npm install`
 * Run `npm install -g grunt-cli` (This is the recommended approach for
   installing the cli - the runner is local to the project see
   http://gruntjs.com/getting-started#installing-the-cli)
 * Use one of the following grunt commands

### Running the dev server

Run `grunt start`

### Running with Webpay

You'll need to point webpay at your running Spartacus installation for static
files only.

The webpay setting `SPARTACUS_STATIC` is pointing at `localhost:2604` by default.
Modify this if your local settings if you need to.

You'll also need to make sure your local webpay settings have `SPA_ENABLE` and
`SPA_ENABLE_URLS` are both set to `True`. This will enable webpay to serve
Spartacus for the relevant urls.

#### Changing settings via Webpay

To change settings you can override any of the JS settings (see
`public/js/settings.js`) by updating the settings in webpay. The settings
key to look for is `SPA_SETTINGS`.

### Running the styleguide

Run `grunt styleguide`

### Running the unit tests

Run `grunt test`

### Running the UI tests

Run `grunt uitest`. To run a single UI test pass the file with a flag e.g:

`grunt uitest --test tests/ui/test-basic.js`

### Bugs

Tracker bug is here: https://bugzilla.mozilla.org/show_bug.cgi?id=837289
