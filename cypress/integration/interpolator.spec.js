/// <reference types="Cypress" />

describe('Polynomial Interpolation Web GUI with GeoGebra', function() {

	function expectAlert(message) {
		const stub = cy.stub()
		cy.on ('window:alert', stub)
		return {
			now: () => expect(stub.getCall(0)).to.be.calledWithMatch(message)
		};
	}

	/**
	 * Select GeoGebra's point tool such that clicks on the GeoGebra
	 * canvas will insert points.
	 */
	function selectPointTool() {
		cy.get('#applet_container .GGWToolbar li:nth-child(2)').click();
		cy.get('#applet_container .GGWToolbar li:nth-child(2) .toolbar_submenu ul.submenuContent li:nth-child(1)').click();
	}

	/**
	 * Insert a point in the GeoGebra canvas.
	 *
	 * `selectPointTool()` must be called before!
	 *
	 * @param x The x coordinate relative to the <canvas> element
	 * @param y The x coordinate relative to the <canvas> element
	 */
	function insertPoint(x, y) {
		cy.get('#applet_container .EuclidianPanel canvas')
		.trigger('pointerdown', x, y)
		.trigger('pointerup', x, y);
	}

	it('Page loads', () => {
		cy.visit('index.html');
	});

	it('Can add single point', () => {
		cy.visit('index.html');

		selectPointTool();
		insertPoint(150, 150);
	});

	it('Error when interpolating without any points', () => {
		cy.visit('index.html');

		const expectedAlert = expectAlert(/more than one point/);
		cy.get('button#interpolate').click().then(() => expectedAlert.now());
	});

	it('Error when interpolating with a single point', () => {
		cy.visit('index.html');

		selectPointTool();
		insertPoint(150, 150);

		const expectedAlert = expectAlert(/more than one point/);
		cy.get('button#interpolate').click().then(() => expectedAlert.now());
	});
});