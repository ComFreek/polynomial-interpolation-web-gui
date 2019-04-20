[![Build Status](https://api.travis-ci.com/ComFreek/polynomial-interpolation-web-gui.svg?branch=master)](https://travis-ci.com/ComFreek/polynomial-interpolation-web-gui)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a42239093d9747f0917138b40c9eea63)](https://www.codacy.com/app/ComFreek/polynomial-interpolation-web-gui?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ComFreek/polynomial-interpolation-web-gui&amp;utm_campaign=Badge_Grade) [![Greenkeeper badge](https://badges.greenkeeper.io/ComFreek/polynomial-interpolation-web-gui.svg)](https://greenkeeper.io/)

## Polynomial Interpolation Web GUI with GeoGebra

**Live version** at [https://comfreek.github.io/polynomial-interpolation-web-gui/](https://comfreek.github.io/polynomial-interpolation-web-gui/).

![Screenshot of the live version](https://cdn.jsdelivr.net/gh/ComFreek/polynomial-interpolation-web-gui@da60bd7bfd9ad04bbbe3c79c00000f9eceaffe83/Screenshot.png "Screenshot of the live version")

## Dev Notes

- We use [GeoGebra Apps Embedding](https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_Embedding) and its corresponding [GeoGebra Apps API](https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_API).
- `npm run lint`: Lint using [ESLint](https://eslint.org/)
- `npm run cy:run -- --browser chrome`: Run integration tests using [Cypress](https://www.cypress.io/) for integration tests. (Chrome is required due to [issue #2](https://github.com/ComFreek/polynomial-interpolation-web-gui/issues/2))