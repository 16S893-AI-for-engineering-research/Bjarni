// data/fuels.js
// Energy carriers database: Fossil-derived and renewable variants
//
// Reference values:
// - Jet-A: 43 MJ/kg, 0.8 kg/L → 34.4 MJ/L
//
// Cost conversion: $/MJ = Market_Price_per_kg / Specific_Energy_MJ_per_kg
// LCA: All in gCO2eq/MJ (well-to-wake)

const FUELS = [
  // ─────────────────────── JET-A & SAF ───────────────────────
  {
    id: "jetA",
    name: "Jet-A",
    variant: "fossil",
    type: "alkane",
    derivedFrom: null,
    lhv_gravimetric: 43.0,
    lhv_volumetric: 34.4,
    costPerMJ: 0.014535,  // $0.5/L ÷ 34.4 MJ/L
    lcaPerMJ: 89,
    market_size_ej: 12,
    market_size_mmt: null,
    color: "#5c7cfa",
    tag: "Alkane (fossil)"
  },
  {
    id: "saf",
    name: "SAF (Blended)",
    variant: "green",
    type: "alkane",
    derivedFrom: null,
    lhv_gravimetric: 43.0,
    lhv_volumetric: 34.4,
    costPerMJ: 0.049709,  // $1.71/L ÷ 34.4 MJ/L
    lcaPerMJ: 17.8,
    market_size_ej: 0.036,
    market_size_mmt: null,
    color: "#51cf66",
    tag: "Alkane (renewable, SAF)"
  },

  // ─────────────────────── METHANE ───────────────────────
  {
    id: "methane_fossil",
    name: "Methane",
    variant: "fossil",
    type: "alkane",
    derivedFrom: null,
    lhv_gravimetric: 50.0,
    lhv_volumetric: 21.15,
    costPerMJ: 0.006316,  // $0.31581/kg ÷ 50 MJ/kg
    lcaPerMJ: 74,
    market_size_ej: 152.15,
    market_size_mmt: 3043,
    color: "#5c7cfa",
    tag: "Alkane (fossil)"
  },
  {
    id: "methane_green",
    name: "Methane",
    variant: "green",
    type: "alkane",
    derivedFrom: null,
    lhv_gravimetric: 50.0,
    lhv_volumetric: 21.15,
    costPerMJ: 0.020000,  // $1.00/kg ÷ 50 MJ/kg
    lcaPerMJ: 19.6,
    market_size_ej: 1.35,
    market_size_mmt: 27,
    color: "#51cf66",
    tag: "Alkane (renewable)"
  },

  // ─────────────────────── ETHANE ───────────────────────
  // Green ethane derived from ethanol
  {
    id: "ethane_fossil",
    name: "Ethane",
    variant: "fossil",
    type: "alkane",
    derivedFrom: null,
    lhv_gravimetric: 47.5,
    lhv_volumetric: 25.84,
    costPerMJ: 0.005245,  // $0.24915/kg ÷ 47.5 MJ/kg
    lcaPerMJ: 94.103,
    market_size_ej: 16.753,
    market_size_mmt: 352.69,
    color: "#5c7cfa",
    tag: "Alkane (fossil)"
  },
  {
    id: "ethane_green",
    name: "Ethane",
    variant: "green",
    type: "alkane",
    derivedFrom: "ethanol",
    lhv_gravimetric: 47.5,
    lhv_volumetric: 25.84,
    costPerMJ: 0.026518,  // $1.2596/kg ÷ 47.5 MJ/kg
    lcaPerMJ: 54.414,
    market_size_ej: 2.8988,
    market_size_mmt: 61.028,
    color: "#51cf66",
    tag: "Alkane (renewable, ex-ethanol)"
  },

  // ─────────────────────── ETHYLENE ───────────────────────
  // Green ethylene derived from ethanol
  {
    id: "ethylene_fossil",
    name: "Ethylene",
    variant: "fossil",
    type: "alkene",
    derivedFrom: null,
    lhv_gravimetric: 47.16,
    lhv_volumetric: 26.881,
    costPerMJ: 0.022000,  // $1.0375/kg ÷ 47.16 MJ/kg
    lcaPerMJ: 94.944,
    market_size_ej: 15.516,
    market_size_mmt: 329,
    color: "#5c7cfa",
    tag: "Alkene (fossil)"
  },
  {
    id: "ethylene_green",
    name: "Ethylene",
    variant: "green",
    type: "alkene",
    derivedFrom: "ethanol",
    lhv_gravimetric: 47.16,
    lhv_volumetric: 26.881,
    costPerMJ: 0.022445,  // $1.0585/kg ÷ 47.16 MJ/kg
    lcaPerMJ: 48.013,
    market_size_ej: 2.6852,
    market_size_mmt: 56.937,
    color: "#51cf66",
    tag: "Alkene (renewable, ex-ethanol)"
  },

  // ─────────────────────── HYDROGEN ───────────────────────
  // Blue = fossil-derived (steam methane reforming), Green = renewable (electrolysis)
  {
    id: "hydrogen_blue",
    name: "Hydrogen",
    variant: "fossil",
    type: "element",
    derivedFrom: null,
    lhv_gravimetric: 120.0,
    lhv_volumetric: 8.5,
    costPerMJ: 0.026921,  // $3.2305/kg ÷ 120 MJ/kg
    lcaPerMJ: 139.03,
    market_size_ej: 12,
    market_size_mmt: 100,
    color: "#5c7cfa",
    tag: "Blue Hydrogen (fossil-derived)"
  },
  {
    id: "hydrogen_green",
    name: "Hydrogen",
    variant: "green",
    type: "element",
    derivedFrom: null,
    lhv_gravimetric: 120.0,
    lhv_volumetric: 8.5,
    costPerMJ: 0.050564,  // $6.0677/kg ÷ 120 MJ/kg
    lcaPerMJ: 17.5,
    market_size_ej: 0.12,
    market_size_mmt: 1,
    color: "#51cf66",
    tag: "Green Hydrogen (renewable)"
  },

  // ─────────────────────── BUTANE ───────────────────────
  // Green butane derived from ethanol
  {
    id: "butane_fossil",
    name: "Butane",
    variant: "fossil",
    type: "alkane",
    derivedFrom: null,
    lhv_gravimetric: 45.75,
    lhv_volumetric: 27.45,
    costPerMJ: 0.014863,  // $0.68/kg ÷ 45.75 MJ/kg
    lcaPerMJ: 99.97,
    market_size_ej: 9.0128,
    market_size_mmt: 197,
    color: "#5c7cfa",
    tag: "Alkane (fossil)"
  },
  {
    id: "butane_green",
    name: "Butane",
    variant: "green",
    type: "alkane",
    derivedFrom: "ethanol",
    lhv_gravimetric: 45.75,
    lhv_volumetric: 27.45,
    costPerMJ: 0.041834,  // $1.9139/kg ÷ 45.75 MJ/kg
    lcaPerMJ: 39.342,
    market_size_ej: 0.0060987,
    market_size_mmt: 0.13331,
    color: "#51cf66",
    tag: "Alkane (renewable, ex-ethanol)"
  },

  // ─────────────────────── METHANOL ───────────────────────
  // Fossil-derived only (from natural gas)
  {
    id: "methanol_fossil",
    name: "Methanol",
    variant: "fossil",
    type: "alcohol",
    derivedFrom: null,
    lhv_gravimetric: 19.93,
    lhv_volumetric: 15.785,
    costPerMJ: 0.030105,  // $0.6/kg ÷ 19.93 MJ/kg
    lcaPerMJ: 122,
    market_size_ej: 3.5874,
    market_size_mmt: 180,
    color: "#5c7cfa",
    tag: "Alcohol (fossil)"
  },
  {
    id: "methanol_green",
    name: "Methanol",
    variant: "green",
    type: "alcohol",
    derivedFrom: null,
    lhv_gravimetric: 19.93,
    lhv_volumetric: 15.785,
    costPerMJ: 0.050176,  // $1.0/kg ÷ 19.93 MJ/kg
    lcaPerMJ: 19,
    market_size_ej: 0.009965,
    market_size_mmt: 0.5,
    color: "#51cf66",
    tag: "Alcohol (renewable)"
  },

  // ─────────────────────── ETHANOL ───────────────────────
  // Renewable ONLY (no significant fossil pathway for this application)
  {
    id: "ethanol_green",
    name: "Ethanol",
    variant: "green",
    type: "alcohol",
    derivedFrom: null,
    lhv_gravimetric: 26.8,
    lhv_volumetric: 21.2,
    costPerMJ: 0.024052,  // $0.6446/kg ÷ 26.8 MJ/kg
    lcaPerMJ: 55.5,
    market_size_ej: 2.5058,
    market_size_mmt: 93.5,
    color: "#51cf66",
    tag: "Alcohol (renewable)"
  },

  // ─────────────────────── DME (DIMETHYL ETHER) ───────────────────────
  {
    id: "dme_fossil",
    name: "DME",
    variant: "fossil",
    type: "ether",
    derivedFrom: null,
    lhv_gravimetric: 28.9,
    lhv_volumetric: 21.241,
    costPerMJ: 0.028880,  // $0.83463/kg ÷ 28.9 MJ/kg
    lcaPerMJ: 169.71,
    market_size_ej: 0.2601,
    market_size_mmt: 9,
    color: "#5c7cfa",
    tag: "Ether (fossil)"
  },
  {
    id: "dme_green",
    name: "DME",
    variant: "green",
    type: "ether",
    derivedFrom: "ethanol",
    lhv_gravimetric: 28.9,
    lhv_volumetric: 21.241,
    costPerMJ: 0.048131,  // $1.391/kg ÷ 28.9 MJ/kg
    lcaPerMJ: 26.43,
    market_size_ej: 0.021675,
    market_size_mmt: 0.75,
    color: "#51cf66",
    tag: "Ether (renewable, ex-ethanol)"
  },

  // ─────────────────────── BUTANOL ───────────────────────
  {
    id: "butanol_fossil",
    name: "Butanol",
    variant: "fossil",
    type: "alcohol",
    derivedFrom: null,
    lhv_gravimetric: 32.9,
    lhv_volumetric: 26.649,
    costPerMJ: 0.027356,  // $0.9/kg ÷ 32.9 MJ/kg
    lcaPerMJ: 74.468,
    market_size_ej: 0.17108,
    market_size_mmt: 5.2,
    color: "#5c7cfa",
    tag: "Alcohol (fossil)"
  },
  {
    id: "butanol_green",
    name: "Butanol",
    variant: "green",
    type: "alcohol",
    derivedFrom: "ethanol",
    lhv_gravimetric: 32.9,
    lhv_volumetric: 26.649,
    costPerMJ: 0.041641,  // $1.37/kg ÷ 32.9 MJ/kg
    lcaPerMJ: 37.75,
    market_size_ej: 0.005593,
    market_size_mmt: 0.17,
    color: "#51cf66",
    tag: "Alcohol (renewable, ex-ethanol)"
  },

  // ─────────────────────── BUTYLENE ───────────────────────
  // Green butylene derived from ethanol (via ethanol dehydration)
  {
    id: "butylene_fossil",
    name: "Butylene",
    variant: "fossil",
    type: "alkene",
    derivedFrom: null,
    lhv_gravimetric: 45.2,
    lhv_volumetric: 26.578,
    costPerMJ: 0.025896,  // $1.1705/kg ÷ 45.2 MJ/kg
    lcaPerMJ: null,       // NaN in source data
    market_size_ej: 0.06102,
    market_size_mmt: 1.35,
    color: "#5c7cfa",
    tag: "Alkene (fossil)"
  },
  {
    id: "butylene_green",
    name: "Butylene",
    variant: "green",
    type: "alkene",
    derivedFrom: "ethanol",
    lhv_gravimetric: 45.2,
    lhv_volumetric: 26.578,
    costPerMJ: 0.040042,  // $1.8099/kg ÷ 45.2 MJ/kg
    lcaPerMJ: 36.3,
    market_size_ej: 0.0058165,
    market_size_mmt: 0.12868,
    color: "#51cf66",
    tag: "Alkene (renewable, ex-ethanol)"
  },

  // ─────────────────────── DIBUTYL ETHER ───────────────────────
  // Green DBE derived from ethanol
  {
    id: "dbe_fossil",
    name: "Dibutyl Ether",
    variant: "fossil",
    type: "ether",
    derivedFrom: null,
    lhv_gravimetric: 41.025,
    lhv_volumetric: 31.59,
    costPerMJ: 0.024973,  // $1.0245/kg ÷ 41.025 MJ/kg
    lcaPerMJ: null,       // NaN in source data
    market_size_ej: null,
    market_size_mmt: null,
    color: "#5c7cfa",
    tag: "Ether (fossil)"
  },
  {
    id: "dbe_green",
    name: "Dibutyl Ether",
    variant: "green",
    type: "ether",
    derivedFrom: "ethanol",
    lhv_gravimetric: 41.025,
    lhv_volumetric: 31.59,
    costPerMJ: 0.038013,  // $1.5595/kg ÷ 41.025 MJ/kg
    lcaPerMJ: null,       // NaN in source data
    market_size_ej: 0.0052791,
    market_size_mmt: 0.12868,
    color: "#51cf66",
    tag: "Ether (renewable, ex-ethanol)"
  }
];

// Convenient lookups
const FUEL_BY_ID = Object.fromEntries(FUELS.map(f => [f.id, f]));
