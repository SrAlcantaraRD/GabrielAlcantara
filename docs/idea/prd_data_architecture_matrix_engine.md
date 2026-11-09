# Product Requirement Document (PRD): Matrix CV Data Model & Engine

## 1. Executive Summary

El **Matrix CV Engine** es un modelo de presentación bidimensional interactivo diseñado para perfiles de **Solución de Arquitectura** y **Senior Engineering**. A diferencia de un currículum PDF estático, esta arquitectura de software mapea la experiencia profesional a través de un plano cartesiano dinámico:

* **Eje X (Línea Temporal / Timeline):** Rango contiguo desde `2011` hasta el año corriente (`2026`).
* **Eje Y (Vistas Pivoteables):** Agrupación multidimensional intercambiable (`By Company / Position` o `By Architectural Domain`).
* **Matriz de Intersección (Barras horizontales):** Bloques interactivos enriquecidos con categorización por pilares técnicos, competencias clave, etiquetado y puntuación de encaje con ofertas específicas (p. ej., Banco Sabadell).

---

## 2. Definición del Esquema de Datos (`types.ts`)

A continuación se especifica la interfaz de datos en TypeScript encargada de modelar la trayectoria profesional, los hitos temporales y las métricas de alineación.

```typescript
/**
 * Pillar Taxonomy for High-Level Categorization
 */
export type ArchitecturePillar = 
  | 'eda'       // Event-Driven Architecture (Kafka, Async processing)
  | 'micro'     // Microservices & RESTful APIs
  | 'cloud'     // Cloud Computing (AWS/Azure) & Kubernetes/Docker
  | 'robotics'  // IoT, Hardware / Warehouse Integration (Nakire TPS)
  | 'security'  // Auth (OAuth2/JWT), QA Gates & Security
  | 'lead';     // ITIL, PRDs, UML & Leadership

/**
 * Architectural Domain Classification
 */
export type ArchitectureDomain =
  | 'Event-Driven & Microservices'
  | 'Cloud Enterprise & Microservices'
  | 'Security & Governance'
  | 'Web, Mobile & IoT'
  | 'Financial & Concursal Platforms';

/**
 * Maping metric to assess alignment with specific job postings (e.g. Banco Sabadell)
 */
export interface JobRequirementsMatch {
  requirementTag: string; // e.g., "Event-Driven (EDA)", "UML", "Kubernetes"
  relevanceScore: number; // 1 to 5
}

/**
 * Core Data Entry representing a project or role block in the matrix timeline
 */
export interface MatrixCVItem {
  /** Unique Identifier */
  id: string;

  /** Organization metadata */
  company: string;
  role: string;
  project: string;

  /** Chronological boundaries */
  period: string; // Printable string, e.g., "2024 - 2026"
  startYear: number; // Numeric start year (e.g. 2024)
  endYear: number;   // Numeric end year (e.g. 2026)

  /** Architectural Domain classification for Y-axis pivoting */
  domain: ArchitectureDomain;

  /** Comprehensive architectural breakdown */
  summary: string;
  achievements: string[];

  /** Technical tags */
  stack: string[];

  /** Categorization pillars for visual styling & filtering */
  pillars: ArchitecturePillar[];

  /** Match criteria tailored to target position */
  sabadellMatch: string[];
}

/**
 * Configuration State for Matrix View Controller
 */
export type AxisPivotMode = 'role' | 'domain';

export interface MatrixFilterState {
  pivotMode: AxisPivotMode;
  activePillar: ArchitecturePillar | 'all';
  searchQuery: string;
  timeframe: {
    minYear: number;
    maxYear: number;
  };
}
```

---

## 3. Matriz de Cálculo & Lógica Inicial de Renderizado

Para que las barras horizontales ocupen la escala porcentual correcta en la tabla, el motor realiza una transformación proporcional entre el tiempo de inicio y fin dentro del marco global de 15 años ($2011 \rightarrow 2026$).

### Fórmula de Posicionamiento en Eje X

Dado un año de inicio $Y_{start}$ y un año de fin $Y_{end}$, dentro del rango base $Y_{min} = 2011$ y $Y_{max} = 2026$:

$$\text{Total Years} = Y_{max} - Y_{min} = 15$$

$$\text{Start Percentage (\%)} = \left( \frac{Y_{start} - Y_{min}}{\text{Total Years}} \right) \times 100$$

$$\text{Width Percentage (\%)} = \left( \frac{Y_{end} - Y_{start}}{\text{Total Years}} \right) \times 100$$

---

## 4. Implementación de la Lógica Base (`matrixEngine.ts`)

```typescript
import { MatrixCVItem, MatrixFilterState, ArchitecturePillar } from './types';

export class MatrixEngine {
  private items: MatrixCVItem[];
  private state: MatrixFilterState;

  constructor(items: MatrixCVItem[]) {
    this.items = items;
    this.state = {
      pivotMode: 'role',
      activePillar: 'all',
      searchQuery: '',
      timeframe: { minYear: 2011, maxYear: 2026 }
    };
  }

  /**
   * Updates state parameters and returns recalculated dataset
   */
  public updateState(newState: Partial<MatrixFilterState>): MatrixCVItem[] {
    this.state = { ...this.state, ...newState };
    return this.getFilteredItems();
  }

  /**
   * Filter algorithm: Evaluates Pillar tags, search terms, and time bounds
   */
  public getFilteredItems(): MatrixCVItem[] {
    return this.items.filter(item => {
      // 1. Pillar Filter
      if (this.state.activePillar !== 'all' && !item.pillars.includes(this.state.activePillar as ArchitecturePillar)) {
        return false;
      }

      // 2. Search Query Search matching against stack, domain, role, and requirements
      if (this.state.searchQuery.trim() !== '') {
        const query = this.state.searchQuery.toLowerCase();
        const searchableContent = [
          item.company,
          item.role,
          item.project,
          item.domain,
          ...item.stack,
          ...item.sabadellMatch
        ].join(' ').toLowerCase();

        if (!searchableContent.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Computes position & width percentages for Gantt rendering
   */
  public calculateTimelinePosition(item: MatrixCVItem) {
    const totalSpan = this.state.timeframe.maxYear - this.state.timeframe.minYear;
    
    const startPct = ((item.startYear - this.state.timeframe.minYear) / totalSpan) * 100;
    const rawWidthPct = ((item.endYear - item.startYear) / totalSpan) * 100;
    
    // Ensure minimum bar width for visual readability
    const widthPct = Math.max(rawWidthPct, 8.0);

    return {
      leftPct: Number(startPct.toFixed(2)),
      widthPct: Number(widthPct.toFixed(2))
    };
  }
}
```

---

## 5. Dataset de Prueba (Gabriel Alcántara Dataset)

```typescript
export const CV_DATASET: MatrixCVItem[] = [
  {
    id: 'quabu_nakire',
    company: 'Quabu SLU',
    role: 'Solution Architect & Senior Engineer',
    project: 'Nakire TPS & Warehouse Automation',
    period: '2024 - 2026',
    startYear: 2024,
    endYear: 2026,
    domain: 'Event-Driven & Microservices',
    summary: 'Diseño integral de la arquitectura para el sistema transaccional Nakire TPS y logística de almacén automatizado (Warehouse), orquestando robótica en tiempo real y eventos de alto rendimiento.',
    achievements: [
      'Definición de Arquitectura Orientada a Eventos (EDA) para comunicación asíncrona con middleware robótico.',
      'Orquestación de microservicios contenerizados (Docker/Kubernetes) en infraestructura Cloud (AWS/Azure).',
      'Integración de pipelines CI/CD automatizadas en Bitbucket/Jenkins con QA Gates y observabilidad.',
      'Modelado de persistencia heterogénea (Bases NoSQL Time-Series para métricas y PostgreSQL/Redis para transacciones).'
    ],
    stack: ['Kafka', 'Microservicios', 'Docker', 'Kubernetes', 'AWS', 'Time-Series', 'ElysiaJS', 'PostgreSQL', 'Redis'],
    pillars: ['eda', 'micro', 'cloud', 'robotics'],
    sabadellMatch: ['Event-Driven (EDA)', 'Microservicios', 'APIs REST', 'Kubernetes / Docker', 'AWS / Cloud']
  },
  {
    id: 'basetis_lead',
    company: 'BaseTIS S.L',
    role: 'Team Lead & Tech Architect',
    project: 'Love ISDIN PIN & Plataformas Corporativas',
    period: '2021 - 2024',
    startYear: 2021,
    endYear: 2024,
    domain: 'Security & Governance',
    summary: 'Liderazgo técnico en el diseño de arquitectura y análisis de viabilidad para plataformas empresariales complejas. Gobierno de seguridad y calidad.',
    achievements: [
      'Elaboración de PRDs y modelado de diagramas UML para la interlocución entre negocio y desarrollo.',
      'Gobierno e implementación de patrones de seguridad con OAuth2, JWT y API Gateways.',
      'Mentoría técnica, revisión de código (PRs) y desarrollo de componentes críticos del sistema.'
    ],
    stack: ['OAuth2', 'JWT', 'API Gateway', 'UML', 'PRD', 'ITIL', 'Team Leadership'],
    pillars: ['security', 'micro', 'lead'],
    sabadellMatch: ['Seguridad OAuth2/JWT', 'API Gateway', 'Modelado UML', 'Service Management (ITIL)']
  }
];
```