/**
 * Editorial index of the blog.
 *
 * Post bodies are Astro pages (real HTML, no client rendering) and link back
 * to this metadata, so the index, the category pages, the related posts and
 * the sitemap all read from a single list.
 */

export interface Category {
	slug: string;
	label: string;
	description: string;
}

export const CATEGORIES: Category[] = [
	{
		slug: "arquitectura",
		label: "Arquitectura",
		description:
			"Decisiones de diseño, límites entre sistemas y evolución de plataformas reales.",
	},
	{
		slug: "sistemas-distribuidos",
		label: "Sistemas distribuidos",
		description:
			"Servicios, eventos, comunicación y resiliencia cuando el sistema deja de ser uno solo.",
	},
	{
		slug: "backend",
		label: "Backend",
		description:
			"APIs, tiempo real y las piezas del servidor que sostienen la operación.",
	},
	{
		slug: "ddd",
		label: "DDD",
		description:
			"Modelar el dominio antes de modelar la base de datos, y los límites que se derivan de ello.",
	},
	{
		slug: "automatizacion-industrial",
		label: "Automatización industrial",
		description:
			"Software que conversa con robots, PLC, sensores y personas dentro de una operación física.",
	},
];

export interface PostMeta {
	slug: string;
	title: string;
	description: string;
	/** ISO date, `YYYY-MM-DD`. */
	date: string;
	updated?: string;
	category: string;
	tags: string[];
	readingMinutes: number;
	/** Project ids from `cv.ts` this article is grounded in. */
	projectIds: string[];
	/** Slugs of related posts. */
	related: string[];
	/** Social card override; defaults to `/og/<slug>.png`. */
	image?: string;
	/**
	 * Card-sized lines for a fixed five-slot template: one headline at 76px and
	 * one standfirst at 44px, each on a single line. `title` and `description`
	 * stay as long as the page needs. Defaults to `title` when omitted.
	 */
	cardTitle?: string;
	cardSub?: string;
	featured?: boolean;
}

export const POSTS: PostMeta[] = [
	{
		slug: "ddd-dominios-complejos",
		title: "DDD cuando el dominio es complejo",
		cardTitle: "DDD en dominios complejos",
		cardSub: "Límites, lenguaje común y decisiones al modelar.",
		description:
			"Qué cambia cuando el dominio tiene reglas que no caben en una tabla: límites, lenguaje común y las decisiones que tomé al modelar el inventario de una bodega.",
		date: "2026-11-03",
		category: "ddd",
		tags: ["DDD", "Diseño de dominios", "Arquitectura"],
		readingMinutes: 8,
		projectIds: ["bodega-digital"],
		related: ["arquitectura-orientada-a-eventos", "lecciones-plataforma-industrial"],
	},
	{
		slug: "websockets-operaciones-tiempo-real",
		title: "WebSockets para operaciones en tiempo real",
		cardTitle: "WebSockets en tiempo real",
		cardSub: "El canal, el rol y la reconexión como diseño.",
		description:
			"Cuando la interfaz deja de ser un formulario y pasa a reflejar el estado de una operación física, el canal, el rol y la reconexión se vuelven parte del diseño.",
		date: "2026-10-20",
		category: "backend",
		tags: ["WebSocket", "RBAC", "Tiempo real"],
		readingMinutes: 7,
		projectIds: ["nakire-tps"],
		related: ["arquitectura-orientada-a-eventos", "lecciones-plataforma-industrial"],
	},
	{
		slug: "arquitectura-orientada-a-eventos",
		title: "Arquitectura orientada a eventos en sistemas reales",
		cardTitle: "Arquitectura por eventos",
		cardSub: "Repartir responsabilidades, no añadir mensajería.",
		description:
			"Los eventos no son una capa de mensajería añadida al final: son una forma de repartir responsabilidades. Dónde ayudan y dónde solo añaden ceremonia.",
		date: "2026-10-06",
		category: "sistemas-distribuidos",
		tags: ["EDA", "Eventos", "Microservicios"],
		readingMinutes: 9,
		projectIds: ["nakire-tps"],
		related: ["lecciones-plataforma-industrial", "ddd-dominios-complejos"],
	},
	{
		slug: "lecciones-plataforma-industrial",
		title: "Lecciones de diseñar una plataforma industrial conectada",
		cardTitle: "Plataforma industrial conectada",
		cardSub: "El hardware marca el ritmo; la traza no es opcional.",
		description:
			"Un almacén automatizado enseña cosas que un CRUD no enseña: el hardware marca el ritmo, las versiones conviven y la trazabilidad no es opcional.",
		date: "2026-09-15",
		category: "automatizacion-industrial",
		tags: ["Industrial", "Integración", "Arquitectura"],
		readingMinutes: 9,
		projectIds: ["nakire-tps"],
		related: ["arquitectura-orientada-a-eventos", "websockets-operaciones-tiempo-real"],
		featured: true,
	},
];

const byDateDesc = (a: PostMeta, b: PostMeta) => b.date.localeCompare(a.date);

export const SORTED_POSTS: PostMeta[] = [...POSTS].sort(byDateDesc);

export const FEATURED_POST: PostMeta =
	SORTED_POSTS.find((post) => post.featured) ?? SORTED_POSTS[0];

export const OTHER_POSTS: PostMeta[] = SORTED_POSTS.filter(
	(post) => post.slug !== FEATURED_POST.slug,
);

/** Only categories with published posts get an indexable page. */
export const ACTIVE_CATEGORIES: Category[] = CATEGORIES.filter((category) =>
	POSTS.some((post) => post.category === category.slug),
);

export function categoryOf(slug: string): Category {
	const category = CATEGORIES.find((item) => item.slug === slug);
	if (!category) throw new Error(`unknown blog category "${slug}"`);
	return category;
}

export function postOf(slug: string): PostMeta {
	const post = POSTS.find((item) => item.slug === slug);
	if (!post) throw new Error(`unknown post "${slug}"`);
	return post;
}

export function postsInCategory(slug: string): PostMeta[] {
	return SORTED_POSTS.filter((post) => post.category === slug);
}

export function relatedPosts(post: PostMeta): PostMeta[] {
	return post.related.map(postOf);
}

const dateFormat = new Intl.DateTimeFormat("es-ES", {
	day: "numeric",
	month: "long",
	year: "numeric",
	timeZone: "UTC",
});

export function formatDate(iso: string): string {
	return dateFormat.format(new Date(`${iso}T00:00:00Z`));
}

export function postHref(slug: string): string {
	return `/blog/${slug}/`;
}

export function categoryHref(slug: string): string {
	return `/blog/categoria/${slug}/`;
}
