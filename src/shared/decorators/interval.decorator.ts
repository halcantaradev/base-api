import { Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
const logger = new Logger();

export function IntervalWhen(
	intervalMs: number,
	name = 'Interval',
	enabled = false,
): MethodDecorator {
	if (enabled) return Interval(intervalMs);
	logger.warn('Job is disable', name);
	return () => null;
}
