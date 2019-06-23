/*eslint-env node*/
/*eslint no-console: 0*/

/**
 * This script checks whether the used GeoGebra Apps version
 * (as specified in ./geogebra-apps-version.js) is in fact the latest one.
 * If so, the script exits with code 0, otherwise with a non-zero value.
 *
 * It is intended to be run as part of a CI build and thus fail the CI
 * build if we are not using the latest version anymore!
 */

const usedGeoGebraAppsVersion = require('./src/js/geogebra-apps-version');
const request = require('request-promise-native');
const compareVersions = require('compare-versions');

/**
  * Extract the GeoGebra Apps version from its download URI.
  *
  * Sample input: 'https://download.geogebra.org/installers/5.0/geogebra-math-apps-bundle-5-0-534-0.zip'
  * Sample output: {major: 5, minor: 0, patch: 534, subpatch: 0}
  */
function extractVersionFromURI(uri) {
	const regex = /(?<major>\d+)-(?<minor>\d+)-(?<patch>\d+)-(?<subpatch>\d+)\.zip$/;
	const parts = uri.match(regex).groups;

	const version = {
		major: parseInt(parts.major, 10),
		minor: parseInt(parts.minor, 10),
		patch: parseInt(parts.patch, 10),
		subpatch: parseInt(parts.subpatch, 10)
	};

	if (Object.values(version).some(isNaN)) {
		throw new Error(`Version contained in URI ${uri} lead to NaNs being parsed.`);
	}

	return version;
}

/**
 * Inquire the latest GeoGebra Apps version and return it as a string.
 */
async function getLatestGeoGebraAppsVersion() {
	const LATEST_REDIRECTING_GEOGEBRA_APPS_URI = 'https://download.geogebra.org/package/geogebra-math-apps-bundle';
	return request.head({
		uri: LATEST_REDIRECTING_GEOGEBRA_APPS_URI,
		resolveWithFullResponse: true
	}).then(response => response.request.uri.href).then(extractVersionFromURI);
}

/**
  * Convert a version object as returned from `extractVersionFromURI` to a string.
  * @param version Same format as returned from `extractVersionFromURI`
  * @param considerSubPatch Boolean indicating whether the subpatch (fourth) version level should be considered or not.
  *        If false, it's overwritten with a 0.
  * @return A string, e.g. '1.0.2.3' for input {major: 1, minor: 0, patch: 2, subpatch: 3}.
  *                   e.g. '1.0.2.0' for input {major: 1, minor: 0, patch: 2, subpatch: 3} and considerSubPatch=false.
  */
function versionToStr(version, considerSubPatch = true) {
	return `${version.major}.${version.minor}.${version.patch}.${considerSubPatch ? version.subpatch : 0}`;
}

/**
  * Compare two versions wrt. condition ignoring subpatch versions.
  * @param version1 Same format as returned from `extractVersionFromURI`
  * @param version2 Same format as returned from `extractVersionFromURI`
  * @param condition One of '<', '<=', '=', '>=' or '>'.
  *
  * @return True if the versions fulfill the stated condition.
  */
function compareVersionsModuloSubpatch(version1, version2, condition) {
	const [version1Str, version2Str] = [
		versionToStr(version1, false),
		versionToStr(version2, false)
	];

	return compareVersions(version1Str, version2Str, condition);
}

getLatestGeoGebraAppsVersion().then(latestGeoGebraAppsVersion => {
	console.log(`Used GeoGebra version:                                ${versionToStr(usedGeoGebraAppsVersion)}`);
	console.log(`Latest GeoGebra version according to GeoGebra server: ${versionToStr(latestGeoGebraAppsVersion)}`);
	console.log(``);
	if (compareVersionsModuloSubpatch(usedGeoGebraAppsVersion, latestGeoGebraAppsVersion, '<')) {
		console.log('Ignoring the subpatch level, you are using the latest GeoGebra Apps version. Everything is fine!');
	}
	else {
		console.error(`Outdated GeoGebra Apps version, please upgrade. Failing Travis build!`);
		process.exit(1);
	}
}).catch(err => {
	console.error(err);
	process.exit(1);
});