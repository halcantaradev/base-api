export function setCustomHour(
	date: string,
	hour = 0,
	minute = 0,
	second = 0,
): Date {
	return new Date(new Date(date).setHours(hour, minute, second));
}
