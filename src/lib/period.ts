const MONTHS_ES = [
	"ene",
	"feb",
	"mar",
	"abr",
	"may",
	"jun",
	"jul",
	"ago",
	"sep",
	"oct",
	"nov",
	"dic",
];

/**
 * Months are a linear index: year * 12 + (month - 1). They keep the timeline
 * exact for three-month stints and still render as years in the axis.
 */
export function parseMonth(value: string): number {
	const match = /^(\d{4})-(\d{2})$/.exec(value);
	if (!match) {
		throw new Error(`invalid month "${value}", expected YYYY-MM`);
	}
	const year = Number(match[1]);
	const month = Number(match[2]);
	if (month < 1 || month > 12) {
		throw new Error(`invalid month "${value}", month must be 01-12`);
	}
	return year * 12 + (month - 1);
}

export function monthLabel(month: number): string {
	const year = Math.floor(month / 12);
	const rest = month - year * 12;
	return `${MONTHS_ES[rest]} ${year}`;
}

/** Label for an inclusive span: the last worked month is `toExclusive - 1`. */
export function spanLabel(from: number, toExclusive: number): string {
	return `${monthLabel(from)} — ${monthLabel(toExclusive - 1)}`;
}

export function durationLabel(months: number): string {
	if (months <= 0) return "0 meses";
	const years = Math.floor(months / 12);
	const rest = months - years * 12;
	const yearPart = years === 1 ? "1 año" : `${years} años`;
	const monthPart = rest === 1 ? "1 mes" : `${rest} meses`;
	if (years === 0) return monthPart;
	if (rest === 0) return yearPart;
	return `${yearPart} ${monthPart}`;
}

export function currentMonth(now: Date = new Date()): number {
	return now.getFullYear() * 12 + now.getMonth();
}
