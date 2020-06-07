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
const https = require('https');
const compareVersions = require('compare-versions');

/**
	* Extract the GeoGebra Apps version from its download URI or parts thereof.
	*
	* Sample input: 'https://download.geogebra.org/installers/5.0/geogebra-math-apps-bundle-5-0-534-0.zip'
	* Sample input: 'geogebra-math-apps-bundle-5-0-534-0.zip'
	* Sample output in both cases: {major: 5, minor: 0, patch: 534, subpatch: 0}
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
	// Send a request to 'https://download.geogebra.org/package/geogebra-math-apps-bundle'
	// that will (hopefully) be redirected by the server to a URI containing the
	// current version.
	//
	// e.g. at time of writing it redirects to
	// https://download.geogebra.org/installers/5.0/geogebra-math-apps-bundle-5-0-587-0.zip
	return new Promise((resolve, reject) => {
		https.get({
			method: 'HEAD',
			hostname: 'download.geogebra.org',
			path: '/package/geogebra-math-apps-bundle'
		}, response => {
			response.resume(); // discard any further response data
			if (response.headers.location) {
				resolve(extractVersionFromURI(response.headers.location));
			} else {
				reject('URI that was assumed to redirect to a URI containing the current version did in fact not redirect.');
			}
			
		}).on('error', reject);
	});
}

/**
	* Convert a version object as returned from `extractVersionFromURI` to a string.
	* @param version Same format as returned from `extractVersionFromURI`
	* @param considerPatch Boolean indicating whether the patch and even lower version levels (i.e. third and lower) should be considered or not.
	* @return A string, e.g. '1.0.2.3' for input {major: 1, minor: 0, patch: 2, subpatch: 3}.
	*									 e.g. '1.42' for input {major: 1, minor: 42, patch: 2, subpatch: 3} and considerPatch=false.
	*/
function versionToStr(version, considerPatchAndBelow = true) {
	return `${version.major}.${version.minor}` + (considerPatchAndBelow ? `.${version.patch}.${version.subpatch}` : ``);
}

/**
	* Compare two versions wrt. condition ignoring patch and even lower version levels.
	* @param version1 Same format as returned from `extractVersionFromURI`
	* @param version2 Same format as returned from `extractVersionFromURI`
	* @param condition One of '<', '<=', '=', '>=' or '>'.
	*
	* @return True if the versions fulfill the stated condition.
	*/
function compareVersionsModuloPatch(version1, version2, condition) {
	const [version1Str, version2Str] = [
		versionToStr(version1, false),
		versionToStr(version2, false)
	];

	const comparisonResult = compareVersions.compare(version1Str, version2Str, condition);
	console.log(`Compared ${version1Str} to ${version2Str} wrt. ${condition}: ${comparisonResult}`);
	
	return comparisonResult;
}

getLatestGeoGebraAppsVersion().then(latestGeoGebraAppsVersion => {
	console.log(`Used GeoGebra version:                                ${versionToStr(usedGeoGebraAppsVersion)}`);
	console.log(`Latest GeoGebra version according to GeoGebra server: ${versionToStr(latestGeoGebraAppsVersion)}`);
	console.log(``);
	if (compareVersionsModuloPatch(usedGeoGebraAppsVersion, latestGeoGebraAppsVersion, '=')) {
		console.log('Ignoring the patch and lower levels, you are using the latest GeoGebra Apps version. Everything is fine!');
	}
	else {
		console.error(`Outdated GeoGebra Apps version, please upgrade. Failing Travis build!`);
		process.exit(1);
	}
}).catch(err => {
	console.error(err);
	process.exit(1);
});