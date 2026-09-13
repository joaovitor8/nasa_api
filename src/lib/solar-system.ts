/**
 * Catálogo dos corpos do Sistema Solar.
 *
 * Dados físicos hardcoded — são estáveis, não fazem sentido vir de API.
 * O texto descritivo e a thumbnail vêm da Wikipedia REST API (ver /api/wikipedia).
 */

export type BodyType = "star" | "planet" | "dwarf-planet";

export interface SolarBody {
  id: string;
  pt: string;
  en: string;
  type: BodyType;
  /** Título do artigo na Wikipedia PT */
  wikiPt: string;
  /** Título do artigo na Wikipedia EN */
  wikiEn: string;
  /** Cor de destaque (oklch) refletindo a aparência real do corpo. */
  accent: string;
  /** Diâmetro equatorial em km. */
  diameterKm: number;
  /** Massa em kg (notação científica como string para exibir formatado). */
  massKg: string;
  /** Distância média do Sol em UA. `null` para o Sol. */
  distanceAuFromSun: number | null;
  /** Período orbital em dias. `null` para o Sol. */
  orbitalPeriodDays: number | null;
  /** Período de rotação em horas. Negativo indica rotação retrógrada. */
  rotationPeriodHours: number;
  /** Número de luas / satélites naturais. */
  moonsCount: number;
  /** Temperatura média em °C (superfície ou fotosfera, conforme o tipo). */
  meanTempC: number;
  /** Ano de descoberta, ou "Antiguidade". */
  discovered: string;
  /** Possui sistema de anéis perceptível. */
  hasRings: boolean;
  /** Posição orbital (1 = Mercúrio, 9 = Plutão; 0 = Sol no centro). */
  orbitIndex: number;
  /** Raio visual relativo (apenas para o diagrama orbital, não escala real). */
  visualRadius: number;
}

export const SOLAR_BODIES: SolarBody[] = [
  {
    id: "sol",
    pt: "Sol",
    en: "Sun",
    type: "star",
    wikiPt: "Sol",
    wikiEn: "Sun",
    accent: "oklch(0.85 0.18 80)",
    diameterKm: 1_392_700,
    massKg: "1.989e30",
    distanceAuFromSun: null,
    orbitalPeriodDays: null,
    rotationPeriodHours: 609.6,
    moonsCount: 0,
    meanTempC: 5500,
    discovered: "—",
    hasRings: false,
    orbitIndex: 0,
    visualRadius: 50,
  },
  {
    id: "mercurio",
    pt: "Mercúrio",
    en: "Mercury",
    type: "planet",
    wikiPt: "Mercúrio (planeta)",
    wikiEn: "Mercury_(planet)",
    accent: "oklch(0.65 0.04 70)",
    diameterKm: 4_879,
    massKg: "3.3011e23",
    distanceAuFromSun: 0.387,
    orbitalPeriodDays: 88,
    rotationPeriodHours: 1407.6,
    moonsCount: 0,
    meanTempC: 167,
    discovered: "Antiguidade",
    hasRings: false,
    orbitIndex: 1,
    visualRadius: 6,
  },
  {
    id: "venus",
    pt: "Vênus",
    en: "Venus",
    type: "planet",
    wikiPt: "Vênus (planeta)",
    wikiEn: "Venus",
    accent: "oklch(0.80 0.10 80)",
    diameterKm: 12_104,
    massKg: "4.8675e24",
    distanceAuFromSun: 0.723,
    orbitalPeriodDays: 224.7,
    rotationPeriodHours: -5832.5,
    moonsCount: 0,
    meanTempC: 464,
    discovered: "Antiguidade",
    hasRings: false,
    orbitIndex: 2,
    visualRadius: 12,
  },
  {
    id: "terra",
    pt: "Terra",
    en: "Earth",
    type: "planet",
    wikiPt: "Terra",
    wikiEn: "Earth",
    accent: "oklch(0.65 0.16 220)",
    diameterKm: 12_742,
    massKg: "5.972e24",
    distanceAuFromSun: 1.0,
    orbitalPeriodDays: 365.25,
    rotationPeriodHours: 24,
    moonsCount: 1,
    meanTempC: 15,
    discovered: "—",
    hasRings: false,
    orbitIndex: 3,
    visualRadius: 13,
  },
  {
    id: "marte",
    pt: "Marte",
    en: "Mars",
    type: "planet",
    wikiPt: "Marte",
    wikiEn: "Mars",
    accent: "oklch(0.65 0.18 30)",
    diameterKm: 6_779,
    massKg: "6.4171e23",
    distanceAuFromSun: 1.524,
    orbitalPeriodDays: 687,
    rotationPeriodHours: 24.6,
    moonsCount: 2,
    meanTempC: -63,
    discovered: "Antiguidade",
    hasRings: false,
    orbitIndex: 4,
    visualRadius: 8,
  },
  {
    id: "jupiter",
    pt: "Júpiter",
    en: "Jupiter",
    type: "planet",
    wikiPt: "Júpiter (planeta)",
    wikiEn: "Jupiter",
    accent: "oklch(0.72 0.12 60)",
    diameterKm: 139_820,
    massKg: "1.898e27",
    distanceAuFromSun: 5.204,
    orbitalPeriodDays: 4_333,
    rotationPeriodHours: 9.93,
    moonsCount: 95,
    meanTempC: -110,
    discovered: "Antiguidade",
    hasRings: true,
    orbitIndex: 5,
    visualRadius: 30,
  },
  {
    id: "saturno",
    pt: "Saturno",
    en: "Saturn",
    type: "planet",
    wikiPt: "Saturno (planeta)",
    wikiEn: "Saturn",
    accent: "oklch(0.78 0.10 90)",
    diameterKm: 116_460,
    massKg: "5.683e26",
    distanceAuFromSun: 9.582,
    orbitalPeriodDays: 10_759,
    rotationPeriodHours: 10.7,
    moonsCount: 146,
    meanTempC: -140,
    discovered: "Antiguidade",
    hasRings: true,
    orbitIndex: 6,
    visualRadius: 26,
  },
  {
    id: "urano",
    pt: "Urano",
    en: "Uranus",
    type: "planet",
    wikiPt: "Urano (planeta)",
    wikiEn: "Uranus",
    accent: "oklch(0.78 0.10 200)",
    diameterKm: 50_724,
    massKg: "8.681e25",
    distanceAuFromSun: 19.18,
    orbitalPeriodDays: 30_688,
    rotationPeriodHours: -17.24,
    moonsCount: 27,
    meanTempC: -195,
    discovered: "1781",
    hasRings: true,
    orbitIndex: 7,
    visualRadius: 18,
  },
  {
    id: "netuno",
    pt: "Netuno",
    en: "Neptune",
    type: "planet",
    wikiPt: "Netuno (planeta)",
    wikiEn: "Neptune",
    accent: "oklch(0.62 0.18 260)",
    diameterKm: 49_244,
    massKg: "1.024e26",
    distanceAuFromSun: 30.07,
    orbitalPeriodDays: 60_195,
    rotationPeriodHours: 16.11,
    moonsCount: 14,
    meanTempC: -200,
    discovered: "1846",
    hasRings: true,
    orbitIndex: 8,
    visualRadius: 17,
  },
  {
    id: "plutao",
    pt: "Plutão",
    en: "Pluto",
    type: "dwarf-planet",
    wikiPt: "Plutão",
    wikiEn: "Pluto",
    accent: "oklch(0.65 0.06 50)",
    diameterKm: 2_377,
    massKg: "1.303e22",
    distanceAuFromSun: 39.48,
    orbitalPeriodDays: 90_560,
    rotationPeriodHours: -153.3,
    moonsCount: 5,
    meanTempC: -229,
    discovered: "1930",
    hasRings: false,
    orbitIndex: 9,
    visualRadius: 4,
  },
];

export const getBody = (id: string): SolarBody | undefined =>
  SOLAR_BODIES.find((b) => b.id === id);

export const BODY_TYPE_LABEL: Record<BodyType, { pt: string; en: string }> = {
  star: { pt: "Estrela", en: "Star" },
  planet: { pt: "Planeta", en: "Planet" },
  "dwarf-planet": { pt: "Planeta-Anão", en: "Dwarf Planet" },
};
