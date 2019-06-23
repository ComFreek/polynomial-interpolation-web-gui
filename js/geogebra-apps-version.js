/*eslint-env node*/
/**
  * This file exports the version of GeoGebra Apps we use.
  *
	* It is consumed in ./index.html and read by ./gui.js.
  * Also, the Travis build checks for any updates
  * and will fail if there are updates available, see
  * ../../check-geogebra-apps-version.js.
  */
const GEOGEBRA_APPS_VERSION_TO_USE = {
	major: 5,
	minor: 0,
	patch: 545,
	subpatch: 0,
	toString: function () {
		return `${this.major}.${this.minor}.${this.patch}.${this.subpatch}`;
	}
};

if (typeof module !== 'undefined') {
	module.exports = GEOGEBRA_APPS_VERSION_TO_USE;
}
