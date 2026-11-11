import type { TranslatedLocale } from "./routing";

interface CasePageCopy {
	metaTitle: string;
	description: string;
	imageAlt: string;
	headline: string;
	lede: string;
	domain: string;
	section: string;
	tags: string[];
	eyebrow: string;
	closingTitle: string;
	closingBody: string;
}

interface EditorialCopy {
	article: {
		readingTime: string;
		updated: string;
		relatedProject: string;
		relatedArticles: string;
		nextTitle: string;
		nextBody: string;
		writeCta: string;
		projectsCta: string;
		cvCta: string;
	};
	blog: {
		metaTitle: string;
		metaDescription: string;
		eyebrow: string;
		title: string;
		lede: string;
		featured: string;
		allArticles: string;
		newest: string;
		readArticle: string;
		closingTitle: string;
		closingBody: string;
		projectsCta: string;
		contactCta: string;
	};
	projects: {
		metaTitle: string;
		metaDescription: string;
		eyebrow: string;
		title: string;
		lede: string;
		metaCases: string;
		metaProjects: string;
		metaStructure: string;
		featured: string;
		selected: string;
		cases: string;
		closingTitle: string;
		closingBody: string;
		contactCta: string;
		blogCta: string;
	};
	case: {
		role: string;
		context: string;
		domain: string;
		technologies: string;
		relatedArticles: string;
		nextTitle: string;
		contactCta: string;
		projectsCta: string;
		cvCta: string;
	};
	posts: Record<string, { tags: string[] }>;
	cases: Record<string, CasePageCopy>;
}

export const EDITORIAL: Record<TranslatedLocale, EditorialCopy> = {
	en: {
		article: {
			readingTime: "min read",
			updated: "Updated",
			relatedProject: "Related project",
			relatedArticles: "Related articles",
			nextTitle: "Next step",
			nextBody:
				"If you are working on a similar problem and want a second opinion, write to me. You can also see the rest of the projects or download the CV.",
			writeCta: "Write to me",
			projectsCta: "See projects",
			cvCta: "See CV",
		},
		blog: {
			metaTitle: "Writing on software architecture, backend and distributed systems",
			metaDescription:
				"Articles on architecture, distributed systems, DDD, real-time backend and industrial automation, written from real projects.",
			eyebrow: "Writing",
			title: "Articles written from projects, my experience and my point of view.",
			lede:
				"I write about the problems that appear when designing and maintaining real systems: domain boundaries, communication between services, automation, testing, deployment and technical leadership.",
			featured: "Featured article",
			allArticles: "All articles",
			newest: "newest first",
			readArticle: "Read the article",
			closingTitle: "Explore related projects",
			closingBody:
				"These articles come from concrete projects. If you want the full problem, the role and the decisions, they are in the portfolio.",
			projectsCta: "See projects",
			contactCta: "Get in touch",
		},
		projects: {
			metaTitle: "Projects on software architecture and distributed systems",
			metaDescription:
				"Case studies by Gabriel Alcántara: industrial automation, distributed systems, digital products and enterprise platforms.",
			eyebrow: "Projects",
			title: "Case studies: problem, role, decision and outcome.",
			lede:
				"These projects show some of the technical and business problems I have worked on, from enterprise platforms to connected industrial systems.",
			metaCases: "documented cases",
			metaProjects: "projects in my career",
			metaStructure: "problem · role · decision · outcome",
			featured: "Main case study",
			selected: "Selected projects",
			cases: "cases",
			closingTitle: "Next step",
			closingBody:
				"If one of these problems looks like the one in front of you, I can tell you more about how I approached it and what I learned along the way.",
			contactCta: "Get in touch",
			blogCta: "Read the writing",
		},
		case: {
			role: "Role",
			context: "Context",
			domain: "Domain",
			technologies: "Technologies",
			relatedArticles: "Related articles",
			nextTitle: "Next step",
			contactCta: "Get in touch",
			projectsCta: "See more projects",
			cvCta: "See the CV",
		},
		posts: {
			"ddd-dominios-complejos": {
				tags: ["DDD", "Domain modelling", "Architecture"],
			},
			"websockets-operaciones-tiempo-real": {
				tags: ["WebSocket", "RBAC", "Real time"],
			},
			"arquitectura-orientada-a-eventos": {
				tags: ["EDA", "Events", "Microservices"],
			},
			"lecciones-plataforma-industrial": {
				tags: ["Industrial", "Integration", "Architecture"],
			},
		},
		cases: {
			"nakire-tps": {
				metaTitle:
					"Nakire TPS: industrial architecture in real time | Gabriel Alcántara",
				description:
					"Nakire TPS case study: domains and services, events, integration with robots, PLCs, LEDs and cameras, WebSockets, RBAC and CI/CD on real hardware.",
				imageAlt: "Nakire TPS — case study by Gabriel Alcántara",
				headline:
					"Nakire TPS: distributed software for real-time industrial operations",
				lede:
					"An in-house product: one domain per module with its own API, microservices per device family, backoffice, frontend and role-based access control.",
				domain: "Logistics and warehouse automation",
				section: "Distributed systems",
				tags: [
					"Industrial automation",
					"EDA",
					"DDD",
					"Microservices",
					"WebSocket",
				],
				eyebrow: "Case study",
				closingTitle: "Next step",
				closingBody:
					"If you are designing a platform that connects software with physical operations, or need to bring order to an architecture that already exists, I can help you define the domains and integrations.",
			},
			"bodega-digital": {
				metaTitle:
					"Bodega Digital: wine inventory with RFID and ML | Gabriel Alcántara",
				description:
					"Bodega Digital case study: bottle-level RFID identification, machine-learning demand forecasting and traceability on a monorepo monolith with DDD and TDD.",
				imageAlt: "Bodega Digital — case study by Gabriel Alcántara",
				headline: "Bodega Digital: real-time wine inventory",
				lede:
					"A tool for wineries and wine companies: bottle-level RFID identification, machine-learning demand forecasting and traceability. Built as a monorepo monolith, with DDD and TDD.",
				domain: "Wine and agrifood",
				section: "Wine and agrifood",
				tags: ["RFID", "IoT", "Machine Learning", "DDD", "Monolith"],
				eyebrow: "Case study",
				closingTitle: "Next step",
				closingBody:
					"If you are digitising an operation with physical hardware —tags, cameras, sensors— I can help you decide where to place the boundaries between domain and device.",
			},
			"pachanga-community": {
				metaTitle:
					"Pachanga Community: an end-to-end amateur football product | Gabriel Alcántara",
				description:
					"Pachanga Community case study: React Native app with hexagonal architecture and DDD, Ghost website in three languages, universal links and its own deployment.",
				imageAlt: "Pachanga Community — case study by Gabriel Alcántara",
				headline: "Pachanga Community: app and web for amateur football, end to end",
				lede:
					"Organising a football group's matches, from the calendar to the statistics. Mobile, web, universal links, stores and deployment: all built and maintained by one person.",
				domain: "Digital product · amateur football",
				section: "Own product",
				tags: ["React Native", "DDD", "Ghost", "Dokploy", "Product"],
				eyebrow: "Case study · own product",
				closingTitle: "Next step",
				closingBody:
					"If you have a product to maintain with a small team, I can help you decide which parts to isolate so the cost does not grow with it.",
			},
		},
	},
	ca: {
		article: {
			readingTime: "min de lectura",
			updated: "Actualitzat",
			relatedProject: "Projecte relacionat",
			relatedArticles: "Articles relacionats",
			nextTitle: "Següent pas",
			nextBody:
				"Si estàs treballant en un problema semblant i vols contrastar-lo, pots escriure'm. També pots veure la resta de projectes o descarregar el CV.",
			writeCta: "Escriu-me",
			projectsCta: "Veure projectes",
			cvCta: "Veure el CV",
		},
		blog: {
			metaTitle: "Articles sobre arquitectura de programari, backend i sistemes distribuïts",
			metaDescription:
				"Articles sobre arquitectura, sistemes distribuïts, DDD, backend en temps real i automatització industrial, escrits des de projectes reals.",
			eyebrow: "Articles",
			title: "Articles escrits des de projectes, la meva experiència i el meu punt de vista.",
			lede:
				"Escric sobre els problemes que apareixen en dissenyar i mantenir sistemes reals: límits de domini, comunicació entre serveis, automatització, testing, desplegament i lideratge tècnic.",
			featured: "Article destacat",
			allArticles: "Tots els articles",
			newest: "més recents primer",
			readArticle: "Llegir l'article",
			closingTitle: "Explorar projectes relacionats",
			closingBody:
				"Els articles surten de projectes concrets. Si vols veure el problema complet, el rol i les decisions, són al portfolio.",
			projectsCta: "Veure projectes",
			contactCta: "Contactar",
		},
		projects: {
			metaTitle: "Projectes d'arquitectura de programari i sistemes distribuïts",
			metaDescription:
				"Casos d'estudi de Gabriel Alcántara: automatització industrial, sistemes distribuïts, productes digitals i plataformes empresarials.",
			eyebrow: "Projectes",
			title: "Casos d'estudi: problema, rol, decisió i resultat.",
			lede:
				"Aquests projectes mostren alguns dels problemes tècnics i de negoci en què he treballat, des de plataformes empresarials fins a sistemes industrials connectats.",
			metaCases: "casos documentats",
			metaProjects: "projectes a la trajectòria",
			metaStructure: "problema · rol · decisió · resultat",
			featured: "Cas d'estudi principal",
			selected: "Projectes seleccionats",
			cases: "casos",
			closingTitle: "Següent pas",
			closingBody:
				"Si algun d'aquests problemes s'assembla al que tens davant, puc explicar-te amb més detall com el vaig abordar i què vaig aprendre pel camí.",
			contactCta: "Contactar",
			blogCta: "Llegir els articles",
		},
		case: {
			role: "Rol",
			context: "Context",
			domain: "Domini",
			technologies: "Tecnologies",
			relatedArticles: "Articles relacionats",
			nextTitle: "Següent pas",
			contactCta: "Contactar",
			projectsCta: "Veure més projectes",
			cvCta: "Veure el CV",
		},
		posts: {
			"ddd-dominios-complejos": {
				tags: ["DDD", "Modelatge de domini", "Arquitectura"],
			},
			"websockets-operaciones-tiempo-real": {
				tags: ["WebSocket", "RBAC", "Temps real"],
			},
			"arquitectura-orientada-a-eventos": {
				tags: ["EDA", "Esdeveniments", "Microserveis"],
			},
			"lecciones-plataforma-industrial": {
				tags: ["Industrial", "Integració", "Arquitectura"],
			},
		},
		cases: {
			"nakire-tps": {
				metaTitle:
					"Nakire TPS: arquitectura industrial en temps real | Gabriel Alcántara",
				description:
					"Cas d'estudi de Nakire TPS: dominis i serveis, esdeveniments, integració amb robots, PLC, LEDs i càmeres, WebSockets, RBAC i CI/CD sobre maquinari real.",
				imageAlt: "Nakire TPS — cas d'estudi de Gabriel Alcántara",
				headline:
					"Nakire TPS: programari distribuït per a operacions industrials en temps real",
				lede:
					"Un desenvolupament propi: dominis per mòdul amb la seva pròpia API, microserveis per família de dispositius, backoffice, frontend i control d'accés per rol.",
				domain: "Logística i automatització d'emmagatzems",
				section: "Sistemes distribuïts",
				tags: [
					"Automatització industrial",
					"EDA",
					"DDD",
					"Microserveis",
					"WebSocket",
				],
				eyebrow: "Cas d'estudi",
				closingTitle: "Següent pas",
				closingBody:
					"Si estàs dissenyant una plataforma que connecta programari amb operacions físiques, o necessites ordenar una arquitectura que ja existeix, puc ajudar-te a delimitar els dominis i les integracions.",
			},
			"bodega-digital": {
				metaTitle:
					"Bodega Digital: inventari de vi amb RFID i ML | Gabriel Alcántara",
				description:
					"Cas d'estudi de Bodega Digital: identificació d'ampolles per RFID, predicció de demanda amb machine learning i traçabilitat sobre un monòlit monorepo amb DDD i TDD.",
				imageAlt: "Bodega Digital — cas d'estudi de Gabriel Alcántara",
				headline: "Bodega Digital: inventari de vi en temps real",
				lede:
					"Una eina per a cellers i empreses vinícoles: identificació d'ampolles per RFID, predicció de demanda amb machine learning i traçabilitat. Construïda com a monòlit monorepo, amb DDD i TDD.",
				domain: "Vi i agroalimentació",
				section: "Vi i agroalimentació",
				tags: ["RFID", "IoT", "Machine Learning", "DDD", "Monòlit"],
				eyebrow: "Cas d'estudi",
				closingTitle: "Següent pas",
				closingBody:
					"Si estàs digitalitzant una operació amb maquinari físic —etiquetes, càmeres, sensors—, puc ajudar-te a decidir on posar els límits entre domini i dispositiu.",
			},
			"pachanga-community": {
				metaTitle:
					"Pachanga Community: producte propi de futbol amateur | Gabriel Alcántara",
				description:
					"Cas d'estudi de Pachanga Community: app mòbil amb hexagonal i DDD, web en Ghost amb tres idiomes, enllaços universals i desplegament propi.",
				imageAlt: "Pachanga Community — cas d'estudi de Gabriel Alcántara",
				headline:
					"Pachanga Community: app i web de futbol amateur, de principi a fi",
				lede:
					"Organitzar les pachangas d'un grup de futbol, des del calendari fins a les estadístiques. Mòbil, web, enllaços universals, botigues i desplegament: tot fet i mantingut per una sola persona.",
				domain: "Producte digital · futbol amateur",
				section: "Producte propi",
				tags: ["React Native", "DDD", "Ghost", "Dokploy", "Producte"],
				eyebrow: "Cas d'estudi · producte propi",
				closingTitle: "Següent pas",
				closingBody:
					"Si tens un producte per mantenir amb un equip petit, puc ajudar-te a decidir quines peces convé aïllar perquè el cost no creixi amb tu.",
			},
		},
	},
};
