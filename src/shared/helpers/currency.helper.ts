export function format(value: number): number {
	const valueFormated = Intl.NumberFormat('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);

	return +valueFormated.replaceAll(',', '');
}
