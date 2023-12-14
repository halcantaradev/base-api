export function setCustomHour(
	date: string | Date,
	hour = 0,
	minute = 0,
	second = 0,
): Date {
	return new Date(new Date(date).setHours(hour, minute, second));
}

export function formatDateTimeBr(dateParam: Date) {
	return new Intl.DateTimeFormat('pt-BR', {
		dateStyle: 'short',
		timeStyle: 'short',
		timeZone: 'America/Sao_Paulo',
	}).format(dateParam);
}

export function formatDateLongBr(dateParam: Date) {
	return new Intl.DateTimeFormat('pt-BR', {
		dateStyle: 'long',
		timeZone: 'America/Sao_Paulo',
	}).format(dateParam);
}

export function formatDateShortBr(dateParam: Date) {
	return new Intl.DateTimeFormat('pt-BR', {
		dateStyle: 'short',
		timeZone: 'America/Sao_Paulo',
	}).format(dateParam);
}

export function formatDateNormalBr(dateParam: Date) {
	return new Intl.DateTimeFormat('pt-BR', {
		timeZone: 'America/Sao_Paulo',
	}).format(dateParam);
}
