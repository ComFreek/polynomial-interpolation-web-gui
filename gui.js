import { GeogebraApplet } from './geogebra-applet.js';
import { createPolynomialCommand } from './geogebra-helpers.js';


const ggbApplet = new GeogebraApplet();
const $formulaOutput = document.getElementById('formulaOutput');
const $wolframLink = document.getElementById('wolframLink');
const GEOGEBRA_APPLET_CONTAINER_ID = 'applet_container';

ggbApplet.injectInto(GEOGEBRA_APPLET_CONTAINER_ID);
setupEventListeners();

// ----------------------------------------------------
// Only function definitions follow.
// ----------------------------------------------------

/**
 * Interpolate the points from ggbApplet and shows them in the UI.
 */
function interpolate() {
	const INTERPOLATION_FUNCTION_NAME = 'f';

	const points = ggbApplet.readAllPoints();
	if (points.length <= 1) {
		alert('Please add more than one point.');
		return;
	}
	ggbApplet.applet.evalCommand(createPolynomialCommand(points, INTERPOLATION_FUNCTION_NAME));

	const functionFormula = ggbApplet.readFunctionFormula(INTERPOLATION_FUNCTION_NAME);
	$formulaOutput.value = functionFormula;
	$wolframLink.href = `https://www.wolframalpha.com/input/?i=${encodeURIComponent(functionFormula)}`;
}

function loadPointsFromString(str) {
	return JSON.parse(str);
}

function savePointsToString(points) {
	return JSON.stringify(points, null, '\t');
}

function reloadPoints(points) {
	ggbApplet.deleteAllObjects();
	points.forEach(point => ggbApplet.applet.evalCommand(`(${point.x}, ${point.y})`));

	interpolate();
}

function setupEventListeners() {
	const $interpolateButton = document.getElementById('interpolate');

	const $loadButton = document.getElementById('load');
	const $saveButton = document.getElementById('save');
	const $dataSwapArea = document.getElementById('dataSwapArea');

	$interpolateButton.addEventListener('click', () => {
		interpolate();
	});

	$saveButton.addEventListener('click', () => {
		$dataSwapArea.value = savePointsToString(ggbApplet.readAllPoints());
	});

	$loadButton.addEventListener('click', () => {
		try {
			const points = loadPointsFromString($dataSwapArea.value);
			reloadPoints(points);
		}
		catch (err) {
			alert(`Error while loading points: ${err}.`);
			throw err;
		}
	});
}
