/**
 * Wrapper of a [GeoGebra HTML5 applet](https://wiki.geogebra.org/en/Reference:JavaScript).
 */
export class GeogebraApplet {
	/**
	 * Create a new instance and initialize the applet with default parameters.
	 *
	 * You have to call injectInto() to make the applet actually visible and usable.
	 */
	constructor() {
		if (GeogebraApplet.geogebraAppletInstance !== null) {
			throw new Error(`You can only instantiate GeogebraApplet once for now.\
 This is a limitation of the underlying GeoGebra library which "occupies" document.ggbApplet
 document-wide for every created applet.`);
		}
		GeogebraApplet.geogebraAppletInstance = this;

		this.appletHandle = new GGBApplet('5.0', {
			'prerelease': false,
			'width': 1000,
			'height': 500,
			'showToolBar': true,
			'borderColor': null,
			'showMenuBar': false,
			'showAlgebraInput': false,
			'showResetIcon': true,
			'enableLabelDrags': false,
			'enableShiftDragZoom': true,
			'enableRightClick': false,
			'capturingThreshold': null,
			'showToolBarHelp': false,
			'errorDialogsActive': true,
			'useBrowserForJS': false,
		});
	}

	/**
	 * Inject the applet into a DOM container referenced by its ID.
	 * @param {string} domID
	 */
	injectInto(domID) {
		this.appletHandle.inject(domID);
	}

	/**
	 * Access to the underlying GeoGebra applet object.
	 */
	get applet() {
		// The use of a getter is a hack to overcome the problem that
		// `document.ggbApplet` is neither available after 'new GGBApplet'
		// in the constructor nor after injectInto() is called.
		//
		// `document.ggbApplet` is probably filled upon an (unknown) DOM event.
		return document.ggbApplet;
	}

	getObjectNames() {
		// Creates an array containing 0 up to n (exclusive)
		const range = n => Array(n).fill(0xDEADBEEF).map((_, idx) => idx);

		return range(this.applet.getObjectNumber())
			.map((_, idx) => this.applet.getObjectName(idx));
	}

	getObjectNamesByType(type) {
		return this.getObjectNames(this.applet)
			.filter(name => this.applet.getObjectType(name) === type)
	}

	deleteAllObjects() {
		return this.getObjectNames(this.applet).forEach(object => this.applet.deleteObject(object));
	}

	/**
	 * Read all points.
	 * @returns An array of {x: number, y: number} objects.
	 */
	readAllPoints() {
		return this.getObjectNamesByType('point')
			.map(name => this.applet.getValueString(name))
			.map(valueString => {
				// valueString might be 'P = (3.44, -4.68)'
				let [_, x, y] = valueString.match(/\((-?[\d.]+), (-?[\d.]+)\)/);
				return { x: parseFloat(x), y: parseFloat(y) };
			});
	}

	/**
	 * Read the formula of a specific function defined within the GeoGebra applet.
	 * @param {string} functionName The function name, e.g. 'f' in order to read 'f(x) = 3x^2'.
	 * @returns The function definition, e.g. 'f(x) = 3x^2'.
	 */
	readFunctionFormula(functionName) {
		const matchingFunctions = this.getObjectNamesByType('function')
			.filter(name => name === functionName);

		if (matchingFunctions.length === 0) {
			throw new Error(`No function found with name '${functionName}'.`);
		}
		if (matchingFunctions.length > 1) {
			throw new Error(`More than one function found with name '${functionName}'.`);
		}

		return this.applet.getValueString(matchingFunctions[0]);
	}
}
