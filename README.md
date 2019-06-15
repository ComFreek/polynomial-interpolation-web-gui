[![Build Status](https://api.travis-ci.com/ComFreek/polynomial-interpolation-web-gui.svg?branch=master)](https://travis-ci.com/ComFreek/polynomial-interpolation-web-gui)
[![Greenkeeper badge](https://badges.greenkeeper.io/ComFreek/polynomial-interpolation-web-gui.svg)](https://greenkeeper.io/)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a42239093d9747f0917138b40c9eea63)](https://www.codacy.com/app/ComFreek/polynomial-interpolation-web-gui?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ComFreek/polynomial-interpolation-web-gui&amp;utm_campaign=Badge_Grade)

## Polynomial Interpolation Web GUI with GeoGebra

**Live version** at [https://comfreek.github.io/polynomial-interpolation-web-gui/](https://comfreek.github.io/polynomial-interpolation-web-gui/).

![Screenshot of the live version](https://cdn.jsdelivr.net/gh/ComFreek/polynomial-interpolation-web-gui@da60bd7bfd9ad04bbbe3c79c00000f9eceaffe83/Screenshot.png "Screenshot of the live version")

## Dev Notes

- We use [GeoGebra Apps Embedding](https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_Embedding) and its corresponding [GeoGebra Apps API](https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_API).
- `npm run lint`: Lint using [ESLint](https://eslint.org/)
- `npm test`: Run integration tests using [Cypress](https://www.cypress.io/). (As set by `package.json`, Chrome is hardcoded as the browser due to [issue #2](https://github.com/ComFreek/polynomial-interpolation-web-gui/issues/2).)
- `node check-geogebra-apps-version.js`: Check whether we use the latest GeoGebra apps version and return a non-zero exit code if not. The script is used to fail the Travis build, which is set up to run every 2 weeks -- apart from regular commits. On failure, the repository's owner (that's me!) gets an e-mail. Thus, we more or less fake Greenkeeper behavior for GeoGebra Apps, for which no officially maintained NPM package exists.
