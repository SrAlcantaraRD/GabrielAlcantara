/**
 * Hover previews for terms, libraries and companies mentioned in the copy.
 *
 * A preview is authored, never inferred: this registry supplies the card and
 * the `spellings` that name it in prose. A block wrapped in `<AutoPreviews>`
 * turns those spellings into triggers in place, so the copy carries the term
 * without anyone marking it; a template that builds its labels in the browser,
 * or that wants one exact mention named, still writes `<PreviewTerm>` by hand.
 *
 * Company ids match `Company.id` in `data/cv.ts`, so the matrix, the trajectory
 * and the CV can point at them with the id they already hold.
 *
 * Every entry carries its own copy in the three locales, so the card reads in
 * the language of the page it opens on. `media` is optional on purpose: a term
 * without a capture is a text card, not a broken one.
 */
import type { Locale } from "../i18n/routing.ts";
import type { UiKey } from "../i18n/ui.ts";

export type PreviewKind = "concept" | "library" | "company" | "tool";

export interface PreviewMedia {
	type: "image" | "video";
	/** Path under `public/`, so the card never depends on a third-party host. */
	src: string;
	/** First frame for a video, shown before it plays. */
	poster?: string;
	/** How the capture fills its 16:9 box: photos cover it, logos sit inside. */
	fit?: "cover" | "contain";
}

/**
 * Where the card's link goes. Only the companies he worked at link out to their
 * own site: a technology or a concept carries no outbound link, so its card
 * stays the definition written here instead of sending the reader to a vendor.
 */
export type PreviewLink =
	| { kind: "external"; href: string }
	| { kind: "internal"; path: string; hash?: string };

/** The spellings that name an entry, per locale; `all` reads the same everywhere. */
export type PreviewSpellings = Partial<Record<Locale | "all", string[]>>;

export interface PreviewEntry {
	id: string;
	kind: PreviewKind;
	/** The proper noun the card repeats as its title; never translated. */
	name: string;
	/**
	 * How prose spells it, for `<AutoPreviews>`, in the language that prose is
	 * written in: `all` holds the proper nouns, which read the same everywhere,
	 * and each locale key holds the ordinary-language aliases of that copy.
	 * Absent means the term is only explained where a template names it by hand,
	 * which is also how a spelling that would fire on ordinary words stays out.
	 */
	spellings?: PreviewSpellings;
	copy: Record<
		Locale,
		{
			definition: string;
			/** Alt text or, for a video, the line read in its place. */
			mediaAlt?: string;
		}
	>;
	link?: PreviewLink;
	media?: PreviewMedia;
	/**
	 * The site's own preview, read from its `og:` tags. When it is here the card
	 * is an unfurl —image, domain, title, description— instead of authored copy,
	 * the way Slack presents a link.
	 */
	site?: { title: string; description?: string };
	/**
	 * The label the link carries when it is not a domain. A UI label belongs to
	 * the dictionary, so the registry names its key instead of repeating the
	 * same sentence in three locales.
	 */
	linkLabelKey?: UiKey;
}

/**
 * The kind is a UI label, so it comes from the shared dictionary and stays in
 * step with the rest of the chrome.
 */
export const KIND_LABEL: Record<PreviewKind, UiKey> = {
	concept: "previewConcept",
	library: "previewLibrary",
	company: "previewCompany",
	tool: "previewTool",
};

export const PREVIEWS: PreviewEntry[] = [
	{
		id: "universal-link",
		kind: "concept",
		name: "Universal link",
		spellings: {
			es: ["enlaces universales", "enlace universal"],
			en: ["universal links", "universal link"],
			ca: ["enllaços universals", "enllaç universal"],
		},
		copy: {
			es: {
				definition:
					"Enlace universal en iOS y App Link en Android: los enlaces de tu dominio abren la app instalada directamente, sin pasar por el navegador. Si la app no está, el mismo enlace cae en la web, que decide qué enseñar —la ficha de la tienda, por ejemplo— en lugar de dejar una página de error.",
				mediaAlt:
					"En el simulador de iOS se abre WhatsApp, se toca un enlace de pachangaapp.com y arranca la app instalada.",
			},
			en: {
				definition:
					"Universal links on iOS and App Links on Android: links on your own domain open the installed app directly, without going through the browser. Without the app, the same link falls back to the website, which decides what to show —the store listing, for instance— instead of leaving an error page.",
				mediaAlt:
					"In the iOS simulator WhatsApp opens, a pachangaapp.com link is tapped and the installed app comes up.",
			},
			ca: {
				definition:
					"Enllaç universal a iOS i App Link a Android: els enllaços del teu domini obren l'app instal·lada directament, sense passar pel navegador. Si l'app no hi és, el mateix enllaç cau a la web, que decideix què ensenyar —la fitxa de la botiga, per exemple— en lloc de deixar una pàgina d'error.",
				mediaAlt:
					"Al simulador d'iOS s'obre WhatsApp, es toca un enllaç de pachangaapp.com i arrenca l'app instal·lada.",
			},
		},
		link: {
			kind: "internal",
			path: "/projects/pachanga-community/",
			hash: "#enlaces",
		},
		linkLabelKey: "previewSeeCase",
		// Ready for a capture: add `public/previews/universal-link.mp4` (and a
		// `poster`) and the card plays it while open. Until then it is a text card.
	},
	{
		id: "zod",
		kind: "library",
		name: "Zod",
		spellings: { all: ["Zod"] },
		copy: {
			es: {
				definition:
					"Librería de validación para TypeScript. Escribes el esquema una vez y salen las dos cosas a la vez: el tipo que conoce el compilador y la comprobación que se ejecuta con datos reales, así que la forma del dato no se declara dos veces ni se queda desincronizada.",
				mediaAlt:
					"Tarjeta de presentación de zod.dev, con el logotipo de Zod sobre fondo oscuro.",
			},
			en: {
				definition:
					"A validation library for TypeScript. You write the schema once and get both things at once: the type the compiler knows and the check that runs against real data, so the shape of the data is never declared twice or left out of sync.",
				mediaAlt:
					"zod.dev's social card, with the Zod logo on a dark background.",
			},
			ca: {
				definition:
					"Llibreria de validació per a TypeScript. Escrius l'esquema una vegada i en surten les dues coses alhora: el tipus que coneix el compilador i la comprovació que s'executa amb dades reals, així que la forma de la dada no es declara dues vegades ni queda desincronitzada.",
				mediaAlt:
					"Targeta de presentació de zod.dev, amb el logotip de Zod sobre fons fosc.",
			},
		},
		media: { type: "image", src: "/previews/zod-og.png" },
	},
	{
		id: "supabase",
		kind: "tool",
		name: "Supabase",
		spellings: { all: ["Supabase"] },
		copy: {
			es: {
				definition:
					"Backend como servicio sobre Postgres: base de datos, autenticación, storage y realtime detrás de una API que se genera sola. En Pachanga es el adaptador de persistencia detrás de los puertos, así que los casos de uso se prueban sin base de datos.",
			},
			en: {
				definition:
					"A backend as a service on Postgres: database, auth, storage and realtime behind an API that generates itself. In Pachanga it is the persistence adapter behind the ports, so the use cases are tested without a database.",
			},
			ca: {
				definition:
					"Backend com a servei sobre Postgres: base de dades, autenticació, storage i realtime darrere d'una API que es genera sola. A Pachanga és l'adaptador de persistència darrere dels ports, així que els casos d'ús es proven sense base de dades.",
			},
		},
		media: { type: "image", src: "/previews/supabase-og.png" },
	},
	{
		id: "expo",
		kind: "tool",
		name: "Expo",
		spellings: { all: ["Expo"] },
		copy: {
			es: {
				definition:
					"Framework sobre React Native: rutas por ficheros con Expo Router, builds en la nube con EAS y módulos nativos sin abrir Xcode ni Android Studio. La app de Pachanga es Expo Router con TypeScript.",
			},
			en: {
				definition:
					"A framework on top of React Native: file-based routes with Expo Router, cloud builds with EAS and native modules without opening Xcode or Android Studio. Pachanga's app is Expo Router with TypeScript.",
			},
			ca: {
				definition:
					"Framework sobre React Native: rutes per fitxers amb Expo Router, builds al núvol amb EAS i mòduls natius sense obrir Xcode ni Android Studio. L'app de Pachanga és Expo Router amb TypeScript.",
			},
		},
		media: { type: "image", src: "/previews/expo-og.jpg" },
	},
	{
		id: "ghost",
		kind: "tool",
		name: "Ghost",
		spellings: { all: ["Ghost"] },
		copy: {
			es: {
				definition:
					"CMS de publicación con API de contenido y temas en Handlebars. La web de Pachanga corre sobre Ghost con un tema generado que sirve tres idiomas, sin editar el tema a mano.",
			},
			en: {
				definition:
					"A publishing CMS with a content API and Handlebars themes. Pachanga's site runs on Ghost with a generated theme that serves three languages, without editing the theme by hand.",
			},
			ca: {
				definition:
					"CMS de publicació amb API de contingut i temes Handlebars. La web de Pachanga corre sobre Ghost amb un tema generat que serveix tres idiomes, sense editar el tema a mà.",
			},
		},
		media: { type: "image", src: "/previews/ghost-og.jpg" },
	},
	{
		id: "terraform",
		kind: "tool",
		name: "Terraform",
		spellings: { all: ["Terraform"] },
		copy: {
			es: {
				definition:
					"Infraestructura como código: se declara el estado deseado y la herramienta calcula el plan para llegar, con el estado guardado y revisable. Cloud, DNS y contenedores dejan de configurarse a mano.",
			},
			en: {
				definition:
					"Infrastructure as code: you declare the desired state and the tool works out the plan to reach it, with the state stored and reviewable. Cloud, DNS and containers stop being configured by hand.",
			},
			ca: {
				definition:
					"Infraestructura com a codi: es declara l'estat desitjat i l'eina calcula el pla per arribar-hi, amb l'estat desat i revisable. Cloud, DNS i contenidors deixen de configurar-se a mà.",
			},
		},
		media: { type: "image", src: "/previews/terraform-og.jpg" },
	},
	{
		id: "mulesoft",
		kind: "tool",
		name: "MuleSoft",
		spellings: { all: ["MuleSoft", "Mulesoft"] },
		copy: {
			es: {
				definition:
					"Plataforma de integración, hoy dentro de Salesforce: los flujos se dibujan como conectores y transformaciones encadenados, con políticas de API por encima. En MSyupply era la capa de integración del producto.",
				mediaAlt:
					"Imagen de marca de MuleSoft: el logotipo sobre un fondo azul con estrellas.",
			},
			en: {
				definition:
					"An integration platform, now part of Salesforce: flows are drawn as connectors and transformations chained together, with API policies on top. In MSyupply it was the product's integration layer.",
				mediaAlt:
					"MuleSoft's brand image: the logo over a blue background with stars.",
			},
			ca: {
				definition:
					"Plataforma d'integració, avui dins de Salesforce: els fluxos es dibuixen com a connectors i transformacions encadenats, amb polítiques d'API al damunt. A MSyupply era la capa d'integració del producte.",
				mediaAlt:
					"Imatge de marca de MuleSoft: el logotip sobre un fons blau amb estrelles.",
			},
		},
		media: { type: "image", src: "/previews/mulesoft-og.jpg" },
	},
	{
		id: "siebel",
		kind: "tool",
		name: "Siebel CRM",
		spellings: { all: ["Siebel CRM", "Siebel"] },
		copy: {
			es: {
				definition:
					"El CRM empresarial de Oracle: modelo de datos propio, vistas de applets y lógica de negocio encima. Se configura más de lo que se escribe desde cero. En ACA CSV desarrollé sobre Siebel, con Oracle PL/SQL detrás.",
			},
			en: {
				definition:
					"Oracle's enterprise CRM: its own data model, applet views and business logic on top. More configured than written from scratch. In ACA CSV I developed on Siebel, with Oracle PL/SQL behind it.",
			},
			ca: {
				definition:
					"El CRM empresarial d'Oracle: model de dades propi, vistes d'applets i lògica de negoci al damunt. Es configura més del que s'escriu des de zero. A ACA CSV vaig desenvolupar sobre Siebel, amb Oracle PL/SQL al darrere.",
			},
		},
		media: {
			type: "image",
			src: "/previews/siebel-logo.svg",
			fit: "contain",
		},
	},
	{
		id: "velneo",
		kind: "tool",
		name: "Velneo",
		spellings: { all: ["Velneo"] },
		copy: {
			es: {
				definition:
					"Plataforma española para construir aplicaciones de gestión: motor de datos propio (vData), editor visual y cliente propio. En ACD el auditor pasó de Delphi a Velneo y las primeras gráficas del producto se hicieron encima.",
			},
			en: {
				definition:
					"A Spanish platform for building business-management applications: its own data engine (vData), a visual editor and its own client. At ACD the auditor moved from Delphi to Velneo and the product's first charts were built on it.",
			},
			ca: {
				definition:
					"Plataforma espanyola per construir aplicacions de gestió: motor de dades propi (vData), editor visual i client propi. A ACD l'auditor va passar de Delphi a Velneo i les primeres gràfiques del producte es van fer al damunt.",
			},
		},
		media: {
			type: "image",
			src: "/previews/velneo-logo.svg",
			fit: "contain",
		},
	},
	{
		id: "delphi",
		kind: "tool",
		name: "Delphi",
		spellings: { all: ["Delphi"] },
		copy: {
			es: {
				definition:
					"El entorno de Borland, hoy Embarcadero, para aplicaciones nativas en Object Pascal: compilación a código máquina, componentes visuales y acceso directo a la API del sistema. El auditor de ACD estaba escrito en Delphi antes de la migración a Velneo.",
				mediaAlt:
					"El IDE de Delphi abierto con dos ventanas de código y una demo ejecutándose en un portátil y un móvil.",
			},
			en: {
				definition:
					"Borland's environment, now Embarcadero's, for native applications in Object Pascal: machine-code compilation, visual components and direct access to the system API. ACD's auditor was written in Delphi before the move to Velneo.",
				mediaAlt:
					"The Delphi IDE open with two code windows and a demo running on a laptop and a phone.",
			},
			ca: {
				definition:
					"L'entorn de Borland, avui Embarcadero, per a aplicacions nadiues en Object Pascal: compilació a codi màquina, components visuals i accés directe a l'API del sistema. L'auditor d'ACD estava escrit en Delphi abans de la migració a Velneo.",
				mediaAlt:
					"L'IDE de Delphi obert amb dues finestres de codi i una demo executant-se en un portàtil i un mòbil.",
			},
		},
		media: { type: "image", src: "/previews/delphi-og.jpg" },
	},
	{
		id: "loveisdin",
		kind: "company",
		name: "LoveISDIN",
		spellings: { all: ["LoveISDIN"] },
		copy: {
			es: {
				definition:
					"Plataforma de ISDIN para el cuidado de la piel: catálogo, contenido y compra. Allí lideré el equipo técnico, definí los PRDs con negocio y asumí los componentes más críticos sobre AWS, Node.js, Next.js y React.",
			},
			en: {
				definition:
					"ISDIN's skincare platform: catalogue, content and checkout. There I led the technical team, defined the PRDs with the business and owned the most critical components on AWS, Node.js, Next.js and React.",
			},
			ca: {
				definition:
					"Plataforma d'ISDIN per a la cura de la pell: catàleg, contingut i compra. Allà vaig liderar l'equip tècnic, vaig definir els PRDs amb negoci i vaig assumir els components més crítics sobre AWS, Node.js, Next.js i React.",
			},
		},
		link: { kind: "external", href: "https://www.isdin.com" },
		site: {
			title: "ISDIN",
			description:
				"En ISDIN nos preocupamos por la salud de tu piel: productos y consejos para protegerla y repararla.",
		},
		media: {
			type: "image",
			src: "/previews/isdin-logo.svg",
			fit: "contain",
		},
	},
	{
		id: "acd",
		kind: "company",
		name: "ACD Sistemes SL",
		spellings: { all: ["ACD Sistemes", "ACD"] },
		copy: {
			es: {
				definition:
					"Consultora de software de Igualada. Aquí empecé en 2011: el producto de auditoría contable entre Delphi y Velneo, después la suite web del producto concursal y una entrega internacional para el IGF de Angola.",
			},
			en: {
				definition:
					"A software consultancy in Igualada. I started here in 2011: the accounting-audit product between Delphi and Velneo, then the web suite for the insolvency product and an international delivery for Angola's IGF.",
			},
			ca: {
				definition:
					"Consultoria de programari d'Igualada. Aquí vaig començar el 2011: el producte d'auditoria comptable entre Delphi i Velneo, després la suite web del producte concursal i una entrega internacional per a l'IGF d'Angola.",
			},
		},
		link: { kind: "external", href: "https://www.asdaudit.com" },
		site: {
			title: "Programas para auditorías contables | ASD Audit",
			description:
				"Software para Auditores Financieros. Digitaliza y automatiza tus trabajos de auditoría contable financiera con los programas de ASD Audit.",
		},
	},
	{
		id: "basetis",
		kind: "company",
		name: "Basetis",
		spellings: { all: ["Basetis"] },
		copy: {
			es: {
				definition:
					"Consultora tecnológica de Barcelona. Sector público y producto: Siebel para la ACA, una capa de integración con Mulesoft, mantenimiento sobre EC2 y LoveISDIN, donde acabé liderando el equipo técnico.",
			},
			en: {
				definition:
					"A technology consultancy in Barcelona. Public sector and product: Siebel for the ACA, a Mulesoft integration layer, EC2 maintenance and LoveISDIN, where I ended up leading the technical team.",
			},
			ca: {
				definition:
					"Consultoria tecnològica de Barcelona. Sector públic i producte: Siebel per a l'ACA, una capa d'integració amb Mulesoft, manteniment sobre EC2 i LoveISDIN, on vaig acabar liderant l'equip tècnic.",
			},
		},
		link: { kind: "external", href: "https://www.basetis.com/es/" },
		site: {
			title: "Basetis - Servicios tecnológicos y de consultoría",
			description:
				"Somos un equipo de personas comprometidas con la sociedad y con el objetivo de realizar servicios tecnológicos y de consultoría.",
		},
		media: {
			type: "image",
			src: "/previews/basetis-og.png",
			fit: "contain",
		},
	},
	{
		id: "quabu",
		kind: "company",
		name: "Quabu Solutions",
		spellings: { all: ["Quabu Solutions", "Quabu"] },
		copy: {
			es: {
				definition:
					"Estudio de producto y arquitectura. Varios productos en paralelo: inventario de vino con RFID y machine learning, los addons de Atlassian, un producto de microservicios y la automatización de almacenes con robótica.",
			},
			en: {
				definition:
					"A product and architecture studio. Several products in parallel: wine inventory with RFID and machine learning, the Atlassian addons, a microservices product and warehouse automation with robotics.",
			},
			ca: {
				definition:
					"Estudi de producte i arquitectura. Diversos productes en paral·lel: inventari de vi amb RFID i machine learning, els addons d'Atlassian, un producte de microserveis i l'automatització de magatzems amb robòtica.",
			},
		},
		link: { kind: "external", href: "https://www.quabu.eu" },
		site: {
			title: "Impulsa tu Futuro Digital con Quabu Solutions",
			description:
				"En Quabu, te ofrecemos soluciones digitales efectivas que aceleran el valor y mejoran tu productividad, con herramientas diseñadas para facilitar tu día a día.",
		},
		media: {
			type: "image",
			src: "/previews/quabu-og.png",
			fit: "contain",
		},
	},
	{
		id: "pachanga",
		kind: "company",
		name: "Pachanga Community",
		spellings: { all: ["Pachanga Community", "Pachanga"] },
		copy: {
			es: {
				definition:
					"Producto propio: la app móvil y la web que organizan los partidos de un grupo, de la arquitectura al despliegue. Sin equipo detrás.",
			},
			en: {
				definition:
					"An in-house product: the mobile app and website that organise a group's matches, from architecture to deployment. No team behind it.",
			},
			ca: {
				definition:
					"Producte propi: l'app mòbil i la web que organitzen els partits d'un grup, de l'arquitectura al desplegament. Sense equip darrere.",
			},
		},
		link: { kind: "external", href: "https://pachangaapp.com/" },
		site: {
			title: "Pachanga Community — Organiza partidos con amigos",
			description:
				"Equipos equilibrados, convocatorias, resultados y estadísticas. Gratis en iOS y Android. Solo equipos privados.",
		},
		media: { type: "image", src: "/previews/pachanga-og.jpg" },
	},
	{
		id: "ddd",
		kind: "concept",
		name: "DDD",
		spellings: {
			all: ["DDD"],
			es: ["diseño guiado por el dominio"],
			en: ["domain-driven design"],
			ca: ["disseny guiat pel domini"],
		},
		copy: {
			es: {
				definition:
					"Domain-Driven Design: diseñar el software alrededor del negocio. Un lenguaje común con quien lo usa, límites explícitos entre dominios y reglas que pueden probarse sin base de datos, en lugar de validaciones repartidas entre tablas, controladores y pantallas.",
				mediaAlt:
					"Diagrama de un contexto delimitado con sus capas —dominio, aplicación e infraestructura— y un evento saliendo hacia otro contexto.",
			},
			en: {
				definition:
					"Domain-Driven Design: designing the software around the business. A language shared with the people who use it, explicit boundaries between domains, and rules that can be tested without a database — instead of validations scattered across tables, controllers and screens.",
				mediaAlt:
					"Diagram of a bounded context and its layers —domain, application, infrastructure— with an event leaving towards another context.",
			},
			ca: {
				definition:
					"Domain-Driven Design: dissenyar el programari al voltant del negoci. Un llenguatge comú amb qui l'utilitza, límits explícits entre dominis i regles que es poden provar sense base de dades, en lloc de validacions repartides entre taules, controladors i pantalles.",
				mediaAlt:
					"Diagrama d'un context delimitat amb les seves capes —domini, aplicació i infraestructura— i un esdeveniment sortint cap a un altre context.",
			},
		},
		media: {
			type: "image",
			src: "/previews/ddd-diagram.svg",
			fit: "contain",
		},
	},
	{
		id: "event-driven",
		kind: "concept",
		name: "Event-driven architecture",
		spellings: {
			es: ["arquitectura orientada a eventos"],
			en: ["event-driven architecture", "event-driven"],
			ca: ["arquitectura orientada a esdeveniments"],
		},
		copy: {
			es: {
				definition:
					"Arquitectura orientada a eventos: los eventos reparten responsabilidades en lugar de ser una capa de mensajería al final del sistema. Un evento declara que algo ya ocurrió y no le importa quién lo escucha; un comando pide algo a un destinatario concreto.",
				mediaAlt:
					"Diagrama de un productor que escribe en un log de tres particiones y dos consumidores que leen cada uno a su ritmo.",
			},
			en: {
				definition:
					"Event-driven architecture: events divide responsibilities instead of being a messaging layer bolted onto the end of the system. An event states that something already happened and does not care who listens; a command asks a specific recipient to do something.",
				mediaAlt:
					"Diagram of a producer writing into a three-partition log and two consumers reading at their own pace.",
			},
			ca: {
				definition:
					"Arquitectura orientada a esdeveniments: els esdeveniments reparteixen responsabilitats en lloc de ser una capa de missatgeria al final del sistema. Un esdeveniment declara que alguna cosa ja ha passat i no li importa qui l'escolta; una ordre demana alguna cosa a un destinatari concret.",
				mediaAlt:
					"Diagrama d'un productor que escriu en un log de tres particions i dos consumidors que llegeixen cadascun al seu ritme.",
			},
		},
		media: {
			type: "image",
			src: "/previews/event-driven-diagram.svg",
			fit: "contain",
		},
	},
	{
		id: "kafka",
		kind: "tool",
		name: "Apache Kafka",
		spellings: { all: ["Apache Kafka", "Kafka"] },
		copy: {
			es: {
				definition:
					"Plataforma distribuida de registro de eventos: los productores escriben en un log particionado y cada consumidor lee a su ritmo, sin que el productor sepa quién escucha. En Nakire separa el core industrial del frontend y del resto de microservicios.",
			},
			en: {
				definition:
					"A distributed event log: producers append to a partitioned log and each consumer reads at its own pace, without the producer knowing who listens. At Nakire it separates the industrial core from the frontend and the other microservices.",
			},
			ca: {
				definition:
					"Plataforma distribuïda de registre d'esdeveniments: els productors escriuen en un log particionat i cada consumidor llegeix al seu ritme, sense que el productor sàpiga qui escolta. A Nakire separa el core industrial del frontend i de la resta de microserveis.",
			},
		},
		media: {
			type: "image",
			src: "/previews/kafka-logo.png",
			fit: "contain",
		},
	},
];

/**
 * The stack labels the CV prints verbatim, mapped to the preview that explains
 * them. Only the labels that need explaining are listed: `React` or `SQL`
 * carry their own meaning, and a label missing from here stays plain text.
 */
export const PREVIEW_BY_STACK_LABEL: Record<string, string> = {
	Mulesoft: "mulesoft",
	Siebel: "siebel",
	"Siebel CRM": "siebel",
	Velneo: "velneo",
	Delphi: "delphi",
	Kafka: "kafka",
	DDD: "ddd",
	"Event Arch": "event-driven",
};

/**
 * Pages where a term is deliberately left unmarked, keyed by the path without
 * its locale prefix so the three languages share the entry. A term belongs
 * here when the page is already about it — or when its card would link back to
 * the page you are reading —, where a trigger would explain a sentence with
 * itself.
 */
export const PREVIEW_EXCLUSIONS: Record<string, string[]> = {
	"/projects/pachanga-community/": ["pachanga", "universal-link"],
	"/blog/ddd-dominios-complejos/": ["ddd"],
	"/blog/arquitectura-orientada-a-eventos/": ["event-driven"],
};

const BY_ID = new Map(PREVIEWS.map((entry) => [entry.id, entry]));

/** The entry for a slug; a typo fails the build instead of rendering nothing. */
export function previewOf(id: string): PreviewEntry {
	const entry = BY_ID.get(id);
	if (!entry) {
		throw new Error(
			`Unknown preview "${id}". Known previews: ${[...BY_ID.keys()].join(", ")}.`,
		);
	}
	return entry;
}

/**
 * The card's destination in the language of the page it opens on.
 *
 * Case studies and articles keep their path across locales (`/en/projects/…`),
 * which `localizedEntry()` cannot express for a link that carries a hash, so the
 * prefix is applied here — and only for those two routable sections, so a typo
 * can never produce a 404.
 */
export function previewHref(link: PreviewLink | undefined, locale: Locale): string | undefined {
	if (!link) return undefined;
	if (link.kind === "external") return link.href;

	const { path, hash = "" } = link;
	if (!/^\/(blog|projects)\//.test(path)) {
		throw new Error(
			`Preview link "${path}" must point at /blog/… or /projects/…: those are the routes that keep their path across locales.`,
		);
	}
	return locale === "es" ? `${path}${hash}` : `/${locale}${path}${hash}`;
}

/** The domain shown as the card's link label, without the `www.`. */
export function domainOf(href: string): string {
	try {
		return new URL(href).hostname.replace(/^www\./, "");
	} catch {
		return href;
	}
}
