// data/fuels.js
// Reference + 12 alternative fuels under consideration for expanding TASOPT's
// fuel-aircraft co-design space.
//
// Energy density figures: standard literature LHV values.
// Cost & LCA figures are pulled from Bjarni's own downselection dataset
// (Energy_Carrier_Impact.m, LAE / MIT, 2026 pricing snapshots) where available,
// normalized to $/MJ and gCO2e/MJ so every fuel is compared on equal footing.
// Fuels not in that dataset (NH3, LOHC, SAF sub-types, e-kerosene) use
// order-of-magnitude literature estimates — good enough for this class site,
// not citation-grade.

const FUELS = [
  {
    id: "jetA",
    name: "Jet-A",
    tag: "REFERENCE",
    category: "drop-in",
    state: "liquid, ambient",
    lhv_gravimetric: 43.0,   // MJ/kg
    lhv_volumetric: 34.4,    // MJ/L (0.8 kg/L)
    storageC: 15,
    tankPenalty: 1.0,
    costPerMJ: 0.0145,       // ~$14.5/GJ — $0.50/L @ 0.8 kg/L, 43 MJ/kg
    lcaPerMJ: 89,            // gCO2e/MJ — well-to-wake, fossil baseline
    challenge: "Baseline. TASOPT already models this well.",
    color: "#e8b04b"
  },
  {
    id: "hefa",
    name: "SAF – HEFA",
    tag: "drop-in SAF",
    category: "drop-in",
    state: "liquid, ambient",
    lhv_gravimetric: 44.0,
    lhv_volumetric: 34.0,
    storageC: 15,
    tankPenalty: 1.0,
    costPerMJ: 0.0497,       // ~$49.7/GJ — SAF avg market price, LAE dataset
    lcaPerMJ: 17.8,          // ~80% reduction vs Jet-A (IATA)
    challenge: "Near-identical properties to Jet-A; feedstock-limited supply.",
    color: "#f2c879"
  },
  {
    id: "ft",
    name: "SAF – Fischer–Tropsch",
    tag: "drop-in SAF",
    category: "drop-in",
    state: "liquid, ambient",
    lhv_gravimetric: 44.2,
    lhv_volumetric: 33.5,
    storageC: 15,
    tankPenalty: 1.0,
    costPerMJ: 0.052,
    lcaPerMJ: 20,
    challenge: "Slightly lower aromatics; seal-swell / density trade-offs.",
    color: "#f2c879"
  },
  {
    id: "atj",
    name: "SAF – Alcohol-to-Jet",
    tag: "drop-in SAF",
    category: "drop-in",
    state: "liquid, ambient",
    lhv_gravimetric: 43.8,
    lhv_volumetric: 33.9,
    storageC: 15,
    tankPenalty: 1.0,
    costPerMJ: 0.048,
    lcaPerMJ: 24,
    challenge: "Feedstock-flexible (ethanol/isobutanol) but conversion losses.",
    color: "#f2c879"
  },
  {
    id: "ptl",
    name: "e-Kerosene (PtL)",
    tag: "drop-in SAF",
    category: "drop-in",
    state: "liquid, ambient",
    lhv_gravimetric: 44.0,
    lhv_volumetric: 34.5,
    storageC: 15,
    tankPenalty: 1.0,
    costPerMJ: 0.085,        // synthetic e-fuels remain the most expensive SAF pathway
    lcaPerMJ: 12,
    challenge: "Energy-intensive synthesis (DAC + electrolysis); cost >> Jet-A.",
    color: "#f2c879"
  },
  {
    id: "lh2",
    name: "Liquid Hydrogen",
    tag: "cryogenic",
    category: "cryogenic",
    state: "liquid, −253°C",
    lhv_gravimetric: 120.0,
    lhv_volumetric: 8.5,
    storageC: -253,
    tankPenalty: 4.2,
    costPerMJ: 0.0191,       // $19/GJ — global average LH2 market price, LAE dataset
    lcaPerMJ: 96.7,          // current tech mostly SMR-based → higher than Jet-A!
    challenge: "3x energy/kg but 4x volume/kg — insulated cryo tanks reshape the whole airframe.",
    color: "#5fd2c2"
  },
  {
    id: "lch4",
    name: "Liquid Methane (LNG)",
    tag: "cryogenic",
    category: "cryogenic",
    state: "liquid, −162°C",
    lhv_gravimetric: 50.0,
    lhv_volumetric: 21.2,
    storageC: -162,
    tankPenalty: 2.1,
    costPerMJ: 0.0063,       // $6.3/GJ — US long-term average, LAE dataset
    lcaPerMJ: 74,
    challenge: "Cryo tankage less extreme than LH2, still needs insulation & boil-off mgmt.",
    color: "#7fd8e0"
  },
  {
    id: "nh3",
    name: "Ammonia",
    tag: "non-drop-in",
    category: "non-drop-in liquid",
    state: "liquid, −33°C or pressurized",
    lhv_gravimetric: 18.6,
    lhv_volumetric: 11.5,
    storageC: -33,
    tankPenalty: 1.8,
    costPerMJ: 0.014,        // fertilizer-grade NH3 is cheap per kg, ~$0.25-0.40/kg
    lcaPerMJ: 121,           // Haber-Bosch is fossil-gas-intensive today (grey NH3)
    challenge: "Toxicity, low flame speed, big tanks — combustor & safety case are hard.",
    color: "#8ea0e8"
  },
  {
    id: "meoh",
    name: "Methanol",
    tag: "non-drop-in",
    category: "non-drop-in liquid",
    state: "liquid, ambient",
    lhv_gravimetric: 19.9,
    lhv_volumetric: 15.8,
    storageC: 15,
    tankPenalty: 1.3,
    costPerMJ: 0.0302,       // $30.2/GJ — global avg, LAE dataset (imarcgroup, 2026)
    lcaPerMJ: 122,           // via natural gas — fossil pathway
    challenge: "Handles like a liquid, but ~half the energy density of Jet-A by mass.",
    color: "#b98ee8"
  },
  {
    id: "etoh",
    name: "Ethanol",
    tag: "non-drop-in",
    category: "non-drop-in liquid",
    state: "liquid, ambient",
    lhv_gravimetric: 26.8,
    lhv_volumetric: 21.2,
    storageC: 15,
    tankPenalty: 1.2,
    costPerMJ: 0.0241,       // $24.1/GJ — tradingeconomics.com, LAE dataset
    lcaPerMJ: 55.5,          // corn ethanol average
    challenge: "Better than methanol, still well below Jet-A; corrosion considerations.",
    color: "#c98ee8"
  },
  {
    id: "btoh",
    name: "Butanol",
    tag: "non-drop-in",
    category: "non-drop-in liquid",
    state: "liquid, ambient",
    lhv_gravimetric: 33.1,
    lhv_volumetric: 26.9,
    storageC: 15,
    tankPenalty: 1.1,
    costPerMJ: 0.0272,       // $27.2/GJ — LAE dataset (businessanalytiq, 2026)
    lcaPerMJ: 74.0,          // petrochemical feedstock pathway
    challenge: "Closest alcohol analogue to Jet-A energy density; blending candidate.",
    color: "#d98aa8"
  },
  {
    id: "dme",
    name: "DME",
    tag: "non-drop-in",
    category: "pressurized liquid",
    state: "liquid, pressurized (~5 atm)",
    lhv_gravimetric: 28.9,
    lhv_volumetric: 19.3,
    storageC: 20,
    tankPenalty: 1.5,
    costPerMJ: 0.0289,       // derived from methanol price, LAE dataset
    lcaPerMJ: 169.7,         // derived from methanol LCA — worst-in-class here
    challenge: "LPG-like handling; pressurized tankage adds mass & complexity.",
    color: "#e88e6a"
  },
  {
    id: "lohc",
    name: "LOHC (H2 carrier)",
    tag: "non-drop-in",
    category: "hydrogen-carrier",
    state: "liquid, ambient (carries H2)",
    lhv_gravimetric: 7.4,   // effective — H18-DBT class carriers hold ~6.2 wt% H2
    lhv_volumetric: 6.7,
    storageC: 15,
    tankPenalty: 1.4,
    costPerMJ: 0.09,         // carrier round-trip + dehydrogenation energy makes this pricey per usable MJ
    lcaPerMJ: 55,
    challenge: "Ambient-liquid H2 delivery, but only ~6 wt% is actually hydrogen — most of the mass is dead carrier weight.",
    color: "#9ad1a0"
  },
  {
    id: "magma",
    name: "Icelandic Magma",
    tag: "🥚 CLASSIFIED",
    category: "geothermal exotic",
    state: "liquid, ~1200°C",
    lhv_gravimetric: 0.4,     // mostly just... hot rock
    lhv_volumetric: 1.1,
    storageC: 1200,
    tankPenalty: 9.9,
    costPerMJ: 0.001,
    lcaPerMJ: -5,             // technically geothermal, technically negative if you squint
    challenge: "Infinite local supply in Iceland. Tank material TBD. Combustor is really more of a volcano.",
    color: "#ff5a3d",
    hidden: true
  }
];

// convenient lookups
const FUEL_BY_ID = Object.fromEntries(FUELS.map(f => [f.id, f]));
