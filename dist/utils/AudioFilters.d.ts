import { FiltersName } from "../types/types";
/**
 * The available audio filters
 * @typedef {object} AudioFilters
 * @property {string} bassboost_low The bassboost filter (+15dB)
 * @property {string} bassboost The bassboost filter (+20dB)
 * @property {string} bassboost_high The bassboost filter (+30dB)
 * @property {string} 8D The 8D filter
 * @property {string} vaporwave The vaporwave filter
 * @property {string} nightcore The nightcore filter
 * @property {string} phaser The phaser filter
 * @property {string} tremolo The tremolo filter
 * @property {string} vibrato The vibrato filter
 * @property {string} reverse The reverse filter
 * @property {string} treble The treble filter
 * @property {string} normalizer The normalizer filter (dynamic audio normalizer based)
 * @property {string} normalizer2 The normalizer filter (audio compressor based)
 * @property {string} surrounding The surrounding filter
 * @property {string} pulsator The pulsator filter
 * @property {string} subboost The subboost filter
 * @property {string} karaoke The kakaoke filter
 * @property {string} flanger The flanger filter
 * @property {string} gate The gate filter
 * @property {string} haas The haas filter
 * @property {string} mcompand The mcompand filter
 * @property {string} mono The mono filter
 * @property {string} mstlr The mstlr filter
 * @property {string} mstrr The mstrr filter
 * @property {string} compressor The compressor filter
 * @property {string} expander The expander filter
 * @property {string} softlimiter The softlimiter filter
 * @property {string} chorus The chorus filter
 * @property {string} chorus2d The chorus2d filter
 * @property {string} chorus3d The chorus3d filter
 * @property {string} fadein The fadein filter
 * @property {string} dim The dim filter
 * @property {string} earrape The earrape filter
 */
declare const FilterList: {
    bassboost_low: string;
    bassboost: string;
    bassboost_high: string;
    "8D": string;
    vaporwave: string;
    nightcore: string;
    phaser: string;
    tremolo: string;
    vibrato: string;
    reverse: string;
    treble: string;
    normalizer: string;
    normalizer2: string;
    surrounding: string;
    pulsator: string;
    subboost: string;
    karaoke: string;
    flanger: string;
    gate: string;
    haas: string;
    mcompand: string;
    mono: string;
    mstlr: string;
    mstrr: string;
    compressor: string;
    expander: string;
    softlimiter: string;
    chorus: string;
    chorus2d: string;
    chorus3d: string;
    fadein: string;
    dim: string;
    earrape: string;
    [Symbol.iterator](): IterableIterator<{
        name: FiltersName;
        value: string;
    }>;
    readonly names: (keyof import("../types/types").QueueFilters)[];
    readonly length: number;
    toString(): string;
    create(filter?: FiltersName[]): string;
    define(filterName: string, value: string): void;
    defineBulk(filterArray: {
        name: string;
        value: string;
    }[]): void;
};
export default FilterList;
export { FilterList as AudioFilters };
