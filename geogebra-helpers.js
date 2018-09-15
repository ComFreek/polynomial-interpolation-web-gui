/**
 * Build the GeoGebra command for interpolating a polynomial from given points.
 * The command looks like "f(x) = Polynomial({(0, 0), (1, 2)})" for points (0, 0) and (1, 2).
 *
 * @param points An array of {x: number, y: number} POD point objects
 * @param functionName The function name, i.e. the part in front of "(x)" in "f(x) = ..." (here: "f")
 * @return A GeoGebra command of the form "f(x) = Polynomial({(0, 0), (1, 2), ...})"
 *         with the given points.
 */
export function createPolynomialCommand(points, functionName = 'f') {
	// e.g. Polynomial({(1, 1), (2, 3), (3, 6)}
	const polynomialCommand = `${functionName}(x) = Polynomial({` + points.map(p => `(${p.x}, ${p.y})`).join(',') + `})`;

	return polynomialCommand;
}