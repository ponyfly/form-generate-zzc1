export function isNumberStr(value) {
	return !isNaN(parseFloat(value)) && isFinite(value);
}
