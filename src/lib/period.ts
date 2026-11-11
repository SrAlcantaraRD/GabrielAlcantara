import type { Locale } from "../i18n/routing.ts";

const MONTHS: Record<Locale, string[]> = {
	es: [
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
	],
	en: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	],
	ca: [
		"gen",
		"febr",
		"març",
		"abr",
		"maig",
		"juny",
		"jul",
		"ago",
		"set",
		"oct",
		"nov",
		"des",
	],
};

/**
 * Months are a linear index: year * 12 + (month - 1). They keep the timeline
 * exact for three-month stints and still render as years in the axis.
 */
export function parseMonth(value: string): number {
	const match = /^(\d{4})[-.](\d{2})$/.exec(value);
	if (!match) {
		throw new Error(`invalid month "${value}", expected YYYY.MM`);
	}
	const year = Number(match[1]);
	const month = Number(match[2]);
	if (month < 1 || month > 12) {
		throw new Error(`invalid month "${value}", month must be 01-12`);
	}
	return year * 12 + (month - 1);
}

export function monthLabel(month: number): string {
	return monthLabelIn(month, "es");
}

/** Month label in the language of the page that renders it. */
export function monthLabelIn(month: number, locale: Locale): string {
	const year = Math.floor(month / 12);
	const rest = month - year * 12;
	return `${MONTHS[locale][rest]} ${year}`;
}

/** Label for an inclusive span: the last worked month is `toExclusive - 1`. */
export function spanLabel(from: number, toExclusive: number): string {
	return spanLabelIn(from, toExclusive, "es");
}

export function spanLabelIn(
	from: number,
	toExclusive: number,
	locale: Locale,
): string {
	return `${monthLabelIn(from, locale)} — ${monthLabelIn(toExclusive - 1, locale)}`;
}

export function durationLabel(months: number): string {
	return durationLabelIn(months, "es");
}

export function durationLabelIn(months: number, locale: Locale): string {
	const years = Math.floor(months / 12);
	const rest = months - years * 12;
	if (locale === "en") {
		if (months <= 0) return "0 months";
		const yearPart = years === 1 ? "1 year" : `${years} years`;
		const monthPart = rest === 1 ? "1 month" : `${rest} months`;
		if (years === 0) return monthPart;
		if (rest === 0) return yearPart;
		return `${yearPart} ${monthPart}`;
	}
	if (locale === "ca") {
		if (months <= 0) return "0 mesos";
		const yearPart = years === 1 ? "1 any" : `${years} anys`;
		const monthPart = rest === 1 ? "1 mes" : `${rest} mesos`;
		if (years === 0) return monthPart;
		if (rest === 0) return yearPart;
		return `${yearPart} ${monthPart}`;
	}
	if (months <= 0) return "0 meses";
	const yearPart = years === 1 ? "1 año" : `${years} años`;
	const monthPart = rest === 1 ? "1 mes" : `${rest} meses`;
	if (years === 0) return monthPart;
	if (rest === 0) return yearPart;
	return `${yearPart} ${monthPart}`;
}

export function currentMonth(now: Date = new Date()): number {
	return now.getFullYear() * 12 + now.getMonth();
}
