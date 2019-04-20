/*eslint-env node*/
/* eslint no-console: 0 */

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
  * Sample output: '5.0.534.0'
  */
function extractVersionFromURI(uri) {
	const regex = /(?<major>\d+)-(?<minor>\d+)-(?<patch>\d+)-(?<subpatch>\d+)\.zip$/;
	const parts = uri.match(regex).groups;

	return `${parts.major}.${parts.minor}.${parts.patch}.${parts.subpatch}`;
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

getLatestGeoGebraAppsVersion().then(latestGeoGebraAppsVersion => {
	if (compareVersions(usedGeoGebraAppsVersion, latestGeoGebraAppsVersion) === 0) {
		console.log('You use the latest GeoGebra Apps version. Everything is fine!');
	}
	else {
		console.error(`Outdated GeoGebra Apps version in use (${usedGeoGebraAppsVersion}), latest is ${latestGeoGebraAppsVersion}.`);
		process.exit(1);
	}
}).catch(err => {
	console.error(err);
	process.exit(1);
});