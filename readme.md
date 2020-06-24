# Uneets v3

Uneets ("units") is a framework/boilerplate for creating Wordpress and Drupal themes.

## Using Uneets

A Uneet is basically a component (markup - HTML, styling - CSS and logic - JS). A module is a component that does not have any logic (is just markup and styling).

#### Creating Uneets / Modules

- Create a new Uneet: `npm run uneets create USomeUneetName` (make sure it starts with `U`)
- Create a new Module: `npm run uneets create MSomeModuleName` (make sure it starts with `M`)

This will create 3 or 2 files for Uneets or Modules respectively in the `./src/uneets/USomeUneetName` or `./src/uneets/MSomeModuleName` folders.

This will also add the proper reference to those files in `./src/uneets/_base/uneets.js` and `./src/uneets/_base/_uneets.pcss`.

#### Removing Uneets / Modules

- Remove a Uneet or Module: `npm run uneets remove USomeUneetName` or `npm run uneets remove MSomeModuleName`.

This will remove the folders `./src/uneets/USomeUneetName` or `./src/uneets/MSomeModuleName` accordingly and the references added in `./src/uneets/_base/uneets.js` and `./src/uneets/_base/_uneets.pcss`.

#### Coding with Uneets

- All Uneets JS files are automatically bundled with Webpack, which is why it is important to only create Uneets when they will employ JS logic, otherwise create a Module.
- All Uneets post css files (`*.pcss`) are automatically processed. For reference on the included post-css plugins and what you can do with them please see `./src/css/postcss-tests/_main.pcss`.
- All Uneets JS code is automatically intialized, unless the markup of the Uneet has the `data-u-noinit` attribute. If that is present, auto-initialization will be avoided and is required to be manually initialized from another Uneet.