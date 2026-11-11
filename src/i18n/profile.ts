import type { TranslatedLocale } from "./routing";

export interface ProfileProjectCopy {
	area: string;
	role: string;
	problem: string;
	decision: string;
	outcome: string;
}

export interface ProfilePostCopy {
	title: string;
	description: string;
	category: string;
}

interface ProfileCopy {
	metaTitle: string;
	metaDescription: string;
	eyebrow: string;
	heroTitle: string;
	/** The fixed lead-in and the words the headline wheel plays. */
	heroStem: string;
	heroWords: string[];
	heroLede: string;
	ctaProjects: string;
	ctaCv: string;
	ctaContact: string;
	availability: string;
	location: string;
	metaProjects: string;
	metaSince: string;
	about: {
		title: string;
		lede: string;
		paragraphs: string[];
	};
	expertise: {
		title: string;
		meta: string;
		items: { title: string; body: string }[];
	};
	selected: {
		title: string;
		meta: string;
		role: string;
		decision: string;
		outcome: string;
		readCase: string;
		note: string;
		allProjects: string;
	};
	experience: {
		title: string;
		meta: string;
		stages: Record<string, { roles: string; focus: string }>;
		note: string;
		fullCareer: string;
	};
	writing: {
		title: string;
		meta: string;
		note: string;
		read: string;
	};
	services: {
		title: string;
		meta: string;
		items: { title: string; body: string }[];
		note: string;
	};
	contact: {
		title: string;
		meta: string;
		lede: string;
		emailLabel: string;
		emailNote: string;
		githubNote: string;
		socialNote: string;
		cvLabel: string;
		cvValue: string;
		cvNote: string;
		closingTitle: string;
		closingBody: string;
	};
	cv: {
		title: string;
		meta: string;
		lede: string;
		points: string[];
		note: string;
		cta: string;
	};
	projects: Record<string, ProfileProjectCopy>;
	posts: Record<string, ProfilePostCopy>;
}

export const PROFILE: Record<TranslatedLocale, ProfileCopy> = {
	en: {
		metaTitle: "Gabriel Alcántara | Solutions Architect & Software Engineer",
		metaDescription:
			"Solutions Architect and software engineer specialising in distributed systems, event-driven architectures, backend engineering and connected industrial solutions.",
		eyebrow: "Software Engineer · Solutions Architect",
		heroTitle:
			"Fifteen years of evolution, from junior developer to Solutions Architect: requirements, data, backend, frontend, mobile and architecture.",
		heroStem: "15 years",
		heroWords: [
			"building",
			"solving",
			"learning",
			"untangling",
			"growing",
			"taking on challenges",
		],
		heroLede:
			"I'm Gabriel Alcántara, a Solutions Architect and software engineer specialising in distributed systems, event-driven architectures, backend engineering and connected industrial solutions.",
		ctaProjects: "See projects",
		ctaCv: "See full CV",
		ctaContact: "Get in touch",
		availability: "Available",
		location: "Barcelona · remote",
		metaProjects: "projects across my career",
		metaSince: "since 2011",
		about: {
			title: "About",
			lede: "Architecture, engineering, mentoring and consulting.",
			paragraphs: [
				"I started in 2011 at ACD Sistemes, a product company, working on accounting audit software: SQL queries, the data importer and the migration of the auditor from Delphi to Velneo. At 21 I travelled to Brazil and Angola to implement and deploy audit solutions for public institutions. Later I took on the web solutions for the insolvency product and technical responsibility for them.",
				"At Basetis I joined as a full-stack developer and ended up as team lead. I worked on web and mobile development for the Generalitat, Siebel for ACA CSV, a product with a Mulesoft integration layer and team management, application maintenance on EC2, and LoveISDIN, where I defined PRDs with the business, reviewed PRs, mentored the team and owned the most critical components.",
				"From 2024 to August 2026 I was a solutions architect at Quabu Solutions. There I designed and implemented an event-driven system built on DDD, TDD and microservices for smart-warehouse automation, integrating robots, PLCs, LEDs, picking and cameras, with real-time communication with operations.",
			],
		},
		expertise: {
			title: "Four areas of work",
			meta: "4 fronts",
			items: [
				{
					title: "Solutions Architecture",
					body: "Design and evolution of complex systems: boundaries between domains, documented decisions and real room to change.",
				},
				{
					title: "Distributed systems",
					body: "Services, events, communication and resilience. Decoupling what changes at different speeds without losing traceability.",
				},
				{
					title: "Technical leadership",
					body: "Architecture decisions, PR reviews, PRDs and mentoring so the team can move forward with its own judgement.",
				},
				{
					title: "Industrial automation",
					body: "Integration between software, operations and hardware: robots, PLCs, LEDs and cameras in the same workflow.",
				},
			],
		},
		selected: {
			title: "Selected work",
			meta: "problem · role · decision · outcome",
			role: "Role",
			decision: "Decision",
			outcome: "Outcome",
			readCase: "Read the case study",
			note: "The full case studies are available in English and Catalan.",
			allProjects: "See the project index",
		},
		experience: {
			title: "Experience",
			meta: "product, consulting and architecture",
			stages: {
				acd: {
					roles: "Junior Software Developer → Full Stack Developer → Product Owner & Developer",
					focus: "Accounting audit product, web suite and international delivery",
				},
				basetis: {
					roles: "Web Software Developer → Full Stack Developer → Senior Technical Team Lead",
					focus: "Public sector, product teams and technical leadership at LoveISDIN",
				},
				quabu: {
					roles: "Solutions Architect",
					focus: "Event-driven architecture, microservices and industrial automation",
				},
				pachanga: {
					roles: "Architect and developer · own product",
					focus: "Mobile and web product for amateur football",
				},
			},
			note: "The detailed career page, with every position and project, is in Spanish.",
			fullCareer: "See the full career",
		},
		writing: {
			title: "Writing",
			meta: "articles from real projects",
			note: "Articles are available in English and Catalan.",
			read: "Read the article",
		},
		services: {
			title: "How I can help",
			meta: "6 ways to collaborate",
			items: [
				{
					title: "Architecture review",
					body: "An outside reading of your system: where the coupling is, which decisions deserve another look and what can wait.",
				},
				{
					title: "Distributed system design",
					body: "Service boundaries, event communication, consistency and resilience before the system grows too far.",
				},
				{
					title: "Platform modernisation",
					body: "Evolve an existing system without rewriting it: separate domains, isolate what changes most and enable independent deployments.",
				},
				{
					title: "Integration design",
					body: "APIs, integration layers and adapters to connect software with other systems, devices or external providers.",
				},
				{
					title: "Domain modelling",
					body: "Understand the business before choosing the technology: shared language, aggregates and boundaries that survive the next requirement.",
				},
				{
					title: "Technical mentoring",
					body: "Work alongside the team on decisions and code, with PR reviews and shared context.",
				},
			],
			note: "I prefer a small number of collaborations where I can be involved in both the decisions and their execution.",
		},
		contact: {
			title: "Let's talk about your next technical challenge",
			meta: "direct channels",
			lede: "Write to me if you want to talk about Solutions Architecture, distributed systems, automation, technical leadership or the evolution of an existing platform.",
			emailLabel: "Professional email",
			emailNote: "The most direct way to start a conversation.",
			githubNote: "Code, tests and public projects.",
			socialNote: "Short notes on architecture and technical work.",
			cvLabel: "CV",
			cvValue: "gabrielalcantara.com/cv",
			cvNote: "Full CV in Spanish, with PDF export.",
			closingTitle: "Shall we continue?",
			closingBody: "Tell me what is happening, where the project stands and what kind of help you need. With that I can tell you whether it fits and how I would approach it.",
		},
		cv: {
			title: "CV",
			meta: "fifteen years in software",
			lede: "Solutions Architect and software engineer with experience in distributed systems, event-driven architecture, backend, frontend, mobile, industrial automation and technical leadership.",
			points: [
				"Solutions architect at Quabu Solutions, 2024–2026.",
				"Senior Technical Team Lead at Basetis, 2021–2024.",
				"Full-stack development across product, consulting and public-sector projects since 2011.",
				"DDD, TDD, hexagonal architecture, event-driven systems, CI/CD and cloud deployment.",
			],
			note: "The complete CV, with every position, stack, certification and language, is maintained in Spanish.",
			cta: "Open the full CV",
		},
		projects: {
			"nakire-tps": {
				area: "Distributed systems",
				role: "Solutions architect · architecture, domain and service design",
				problem:
					"Coordinating people, software and industrial devices —robots, PLCs, LEDs, cameras and sound— in a warehouse operation that had to be traceable and able to evolve.",
				decision:
					"Split the system into domains and services with an agent core that orders, prioritises and distributes atomic tasks across device families, each with adapters by model, version and protocol.",
				outcome:
					"A distributed system connecting software and industrial operations with real-time communication and task traceability.",
			},
			"bodega-digital": {
				area: "Wine and agrifood",
				role: "Solutions architect · architecture, domain modelling and development",
				problem:
					"Identify and locate every bottle in wineries with thousands of similar references —vintage, variety, plot— and ageing of up to fifteen years.",
				decision:
					"A monorepo monolith with DDD and TDD, with adapters for RFID readers, computer vision and the demand-forecasting model.",
				outcome:
					"Real-time inventory, demand forecasting and bottle-level traceability. The way of working —modelled domain, adapters per integration and tests first— carried into later projects.",
			},
			"pachanga-community": {
				area: "Own product",
				role: "Architect and developer · end-to-end product",
				problem:
					"Organising a football group's matches ends up in an endless chat: who plays, how teams are split and what happened in the last match.",
				decision:
					"Build the whole product: a mobile app with hexagonal architecture over DDD and Atomic Design, a Ghost website in three languages and universal links, with its own deployment and support.",
				outcome:
					"An app published on the App Store and Play Store, with its website, universal links and support channel, sustained by one person.",
			},
		},
		posts: {
			"ddd-dominios-complejos": {
				title: "DDD when the domain is complex",
				description:
					"What changes when the domain has rules that don't fit in a table: boundaries, shared language and the decisions I made when modelling a winery's inventory.",
				category: "DDD",
			},
			"websockets-operaciones-tiempo-real": {
				title: "WebSockets for real-time operations",
				description:
					"When the interface stops being a form and starts reflecting the state of a physical operation, the channel, the role and reconnection become part of the design.",
				category: "Backend",
			},
			"arquitectura-orientada-a-eventos": {
				title: "Event-driven architecture in real systems",
				description:
					"Events are not a messaging layer added at the end: they are a way of distributing responsibilities. Where they help and where they only add ceremony.",
				category: "Distributed systems",
			},
			"lecciones-plataforma-industrial": {
				title: "Lessons from designing a connected industrial platform",
				description:
					"An automated warehouse teaches things a CRUD does not: hardware sets the pace, versions coexist and traceability is not optional.",
				category: "Industrial automation",
			},
		},
	},
	ca: {
		metaTitle: "Gabriel Alcántara | Solutions Architect & Software Engineer",
		metaDescription:
			"Arquitecte de programari i enginyer de programari especialitzat en sistemes distribuïts, arquitectures orientades a esdeveniments, backend i solucions industrials connectades.",
		eyebrow: "Enginyer de programari · Arquitecte de solucions",
		heroTitle:
			"Quinze anys d'evolució, de júnior a enginyer: requisits, base de dades, backend, frontend, mòbil i arquitectura.",
		heroStem: "15 anys",
		heroWords: [
			"construint",
			"resolent",
			"aprenent",
			"solucionant",
			"creixent",
			"superant reptes",
		],
		heroLede:
			"Sóc en Gabriel Alcántara, arquitecte de programari i enginyer de programari especialitzat en sistemes distribuïts, arquitectures orientades a esdeveniments, backend i solucions industrials connectades.",
		ctaProjects: "Veure projectes",
		ctaCv: "Veure el CV complet",
		ctaContact: "Contactar",
		availability: "Disponible",
		location: "Barcelona · remot",
		metaProjects: "projectes a la trajectòria",
		metaSince: "des del 2011",
		about: {
			title: "Sobre mi",
			lede: "Arquitectura, enginyeria, mentoria i consultoria.",
			paragraphs: [
				"Vaig començar el 2011 a ACD Sistemes, una empresa de producte, on vaig treballar en el producte d'auditoria comptable: consultes SQL, l'importador de dades i la migració de l'auditor de Delphi a Velneo. Amb 21 anys vaig viatjar al Brasil i Angola per implantar i desplegar solucions d'auditoria en institucions públiques. Després van arribar les solucions web del producte concursal i la responsabilitat tècnica sobre elles.",
				"A Basetis vaig entrar com a full stack i vaig acabar com a team lead. Vaig passar per desenvolupament web i mòbil per a la Generalitat, Siebel per a ACA CSV, un producte amb capa d'integració Mulesoft i gestió d'equip, manteniment d'aplicacions sobre EC2 i LoveISDIN, on vaig definir PRDs amb negoci, vaig revisar PRs, vaig mentoritzar l'equip i vaig assumir els components més crítics.",
				"Del 2024 a l'agost del 2026 vaig ser arquitecte de solucions a Quabu Solutions. Allà vaig dissenyar i implementar un sistema orientat a esdeveniments sobre DDD, TDD i microserveis per a l'automatització d'emmagatzems intel·ligents, amb integració de robots, PLC, LEDs, picking i càmeres, i comunicació en temps real amb l'operació.",
			],
		},
		expertise: {
			title: "Quatre àrees de treball",
			meta: "4 fronts",
			items: [
				{
					title: "Arquitectura de programari",
					body: "Disseny i evolució de sistemes complexos: límits entre dominis, decisions documentades i marge real per canviar.",
				},
				{
					title: "Sistemes distribuïts",
					body: "Serveis, esdeveniments, comunicació i resiliència. Desacoblar allò que canvia a velocitats diferents sense perdre traçabilitat.",
				},
				{
					title: "Lideratge tècnic",
					body: "Decisions d'arquitectura, revisió de PRs, PRDs i mentoria perquè l'equip avanci amb criteri propi.",
				},
				{
					title: "Automatització industrial",
					body: "Integració entre programari, operacions i maquinari: robots, PLC, LEDs i càmeres dins del mateix flux de treball.",
				},
			],
		},
		selected: {
			title: "Treball seleccionat",
			meta: "problema · rol · decisió · resultat",
			role: "Rol",
			decision: "Decisió",
			outcome: "Resultat",
			readCase: "Llegir el cas d'estudi",
			note: "Els casos d'estudi complets estan disponibles en anglès i català.",
			allProjects: "Veure l'índex de projectes",
		},
		experience: {
			title: "Experiència",
			meta: "producte, consultoria i arquitectura",
			stages: {
				acd: {
					roles: "Junior Software Developer → Full Stack Developer → Product Owner & Developer",
					focus: "Producte d'auditoria comptable, suite web i entrega internacional",
				},
				basetis: {
					roles: "Web Software Developer → Full Stack Developer → Senior Technical Team Lead",
					focus: "Sector públic, equips de producte i lideratge tècnic a LoveISDIN",
				},
				quabu: {
					roles: "Arquitecte de solucions",
					focus: "Arquitectura orientada a esdeveniments, microserveis i automatització industrial",
				},
				pachanga: {
					roles: "Arquitecte i desenvolupador · producte propi",
					focus: "Producte mòbil i web de futbol amateur",
				},
			},
			note: "La pàgina detallada de trajectòria, amb tots els càrrecs i projectes, és en castellà.",
			fullCareer: "Veure la trajectòria completa",
		},
		writing: {
			title: "Articles",
			meta: "articles nascuts de projectes reals",
			note: "Els articles estan disponibles en anglès i català.",
			read: "Llegir l'article",
		},
		services: {
			title: "Com puc ajudar",
			meta: "6 maneres de col·laborar",
			items: [
				{
					title: "Revisió d'arquitectura",
					body: "Una lectura externa del teu sistema: on és l'acoblament, quines decisions mereixen una altra mirada i què pot esperar.",
				},
				{
					title: "Disseny de sistemes distribuïts",
					body: "Límits de servei, comunicació per esdeveniments, consistència i resiliència abans que el sistema creixi massa.",
				},
				{
					title: "Modernització de plataformes",
					body: "Fer evolucionar un sistema existent sense reescriure'l: separar dominis, aïllar allò que canvia més i permetre desplegaments independents.",
				},
				{
					title: "Disseny d'integracions",
					body: "APIs, capes d'integració i adaptadors per connectar programari entre si i amb dispositius o proveïdors externs.",
				},
				{
					title: "Modelatge de dominis",
					body: "Entendre el negoci abans de triar la tecnologia: llenguatge comú, agregats i límits que sobrevisquin al següent requisit.",
				},
				{
					title: "Mentoria tècnica",
					body: "Treballar al costat de l'equip en les decisions i el codi, amb revisió de PRs i context compartit.",
				},
			],
			note: "Prefereixo poques col·laboracions on pugui implicar-me tant en les decisions com en la seva execució.",
		},
		contact: {
			title: "Parlem del teu proper repte tècnic",
			meta: "canals directes",
			lede: "Escriu-me si vols parlar d'arquitectura de programari, sistemes distribuïts, automatització, lideratge tècnic o evolució d'una plataforma existent.",
			emailLabel: "Correu professional",
			emailNote: "La manera més directa de començar una conversa.",
			githubNote: "Codi, proves i projectes públics.",
			socialNote: "Notes curtes sobre arquitectura i treball tècnic.",
			cvLabel: "CV",
			cvValue: "gabrielalcantara.com/cv",
			cvNote: "CV complet en castellà, amb exportació a PDF.",
			closingTitle: "Continuem?",
			closingBody: "Explica'm què està passant, en quina fase és el projecte i quin tipus d'ajuda necessites. Amb això puc dir-te si encaixa i com ho abordaria.",
		},
		cv: {
			title: "CV",
			meta: "quinze anys en programari",
			lede: "Arquitecte de programari i enginyer de programari amb experiència en sistemes distribuïts, arquitectura orientada a esdeveniments, backend, frontend, mòbil, automatització industrial i lideratge tècnic.",
			points: [
				"Arquitecte de solucions a Quabu Solutions, 2024–2026.",
				"Senior Technical Team Lead a Basetis, 2021–2024.",
				"Desenvolupament full stack en producte, consultoria i sector públic des del 2011.",
				"DDD, TDD, arquitectura hexagonal, sistemes orientats a esdeveniments, CI/CD i desplegament al núvol.",
			],
			note: "El CV complet, amb tots els càrrecs, stack, certificacions i idiomes, es manté en castellà.",
			cta: "Obrir el CV complet",
		},
		projects: {
			"nakire-tps": {
				area: "Sistemes distribuïts",
				role: "Arquitecte de solucions · arquitectura, dominis i serveis",
				problem:
					"Coordinar persones, programari i dispositius industrials —robots, PLC, LEDs, càmeres i so— dins d'una operació d'emmagatzem que havia de ser traçable i capaç d'evolucionar.",
				decision:
					"Separar el sistema en dominis i serveis amb un core d'agents que ordena, prioritza i reparteix tasques atòmiques entre famílies de dispositius, cadascuna amb adaptadors per model, versió i protocol.",
				outcome:
					"Un sistema distribuït que connecta programari i operació industrial amb comunicació en temps real i traçabilitat de les tasques.",
			},
			"bodega-digital": {
				area: "Vi i agroalimentació",
				role: "Arquitecte de solucions · arquitectura, modelatge de domini i desenvolupament",
				problem:
					"Identificar i localitzar cada ampolla en cellers amb milers de referències semblants —anyada, varietat, parcel·la— i criança de fins a quinze anys.",
				decision:
					"Un monòlit monorepo amb DDD i TDD, amb adaptadors per a lectors RFID, visió per computador i el model de predicció de demanda.",
				outcome:
					"Inventari en temps real, predicció de demanda i traçabilitat per ampolla. La manera de treballar —domini modelat, adaptadors per integració i proves primer— va passar als projectes següents.",
			},
			"pachanga-community": {
				area: "Producte propi",
				role: "Arquitecte i desenvolupador · producte complet",
				problem:
					"Organitzar les pachangas d'un grup de futbol acaba en un xat interminable: qui juga, com es reparteixen els equips i què va passar a l'últim partit.",
				decision:
					"Construir el producte sencer: app mòbil amb arquitectura hexagonal sobre DDD i Atomic Design, web en Ghost amb tres idiomes i enllaços universals, amb desplegament i suport propis.",
				outcome:
					"Una app publicada a l'App Store i Play Store, amb la seva web, els seus enllaços universals i el seu canal de suport, sostinguda per una sola persona.",
			},
		},
		posts: {
			"ddd-dominios-complejos": {
				title: "DDD quan el domini és complex",
				description:
					"Què canvia quan el domini té regles que no caben en una taula: límits, llenguatge comú i les decisions que vaig prendre en modelar l'inventari d'un celler.",
				category: "DDD",
			},
			"websockets-operaciones-tiempo-real": {
				title: "WebSockets per a operacions en temps real",
				description:
					"Quan la interfície deixa de ser un formulari i passa a reflectir l'estat d'una operació física, el canal, el rol i la reconnexió esdevenen part del disseny.",
				category: "Backend",
			},
			"arquitectura-orientada-a-eventos": {
				title: "Arquitectura orientada a esdeveniments en sistemes reals",
				description:
					"Els esdeveniments no són una capa de missatgeria afegida al final: són una manera de repartir responsabilitats. On ajuden i on només afegeixen cerimònia.",
				category: "Sistemes distribuïts",
			},
			"lecciones-plataforma-industrial": {
				title: "Lliçons de dissenyar una plataforma industrial connectada",
				description:
					"Un magatzem automatitzat ensenya coses que un CRUD no ensenya: el maquinari marca el ritme, les versions conviuen i la traçabilitat no és opcional.",
				category: "Automatització industrial",
			},
		},
	},
};
