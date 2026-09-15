// data/aircraft.js
// The design-space expansion story: airframe configurations x size classes.
// "today" = what TASOPT currently handles well.
// "target" = what this project aims to unlock.

const CONFIGS = [
  {
    id: "tube-wing",
    name: "Tube & Wing",
    short: "T+W",
    desc: "The conventional cylindrical fuselage + swept wing. TASOPT's home turf today.",
    todaySupport: "full",
    silhouette: "tubeWing",
    photo: "assets/aircraft/tube-wing.jpg",
    photoCredit: "Airbus A350 — photo: Gyrostat / Wikimedia Commons, CC BY-SA 3.0",
    companies: ["Airbus (A320/A350 families)", "Boeing (737/787 families)"]
  },
  {
    id: "d8",
    name: "Double-Bubble (D8)",
    short: "D8",
    desc: "Two partial cylinders fused side-by-side — wider, flatter fuselage, BLI aft engines.",
    todaySupport: "partial",
    silhouette: "d8",
    photo: "assets/aircraft/d8.jpg",
    photoCredit: "MIT / Aurora Flight Sciences D8 concept — image: NASA/MIT/Aurora Flight Sciences (public domain)",
    companies: ["MIT (concept origin)", "Aurora Flight Sciences (a Boeing company)"]
  },
  {
    id: "bwb",
    name: "Blended Wing Body",
    short: "BWB",
    desc: "Fuselage and wing blend into one lifting body — huge structural & aero coupling.",
    todaySupport: "none",
    silhouette: "bwb",
    photo: "assets/aircraft/bwb.jpg",
    photoCredit: "NASA X-48B blended wing body demonstrator — photo: NASA/Carla Thomas (public domain)",
    companies: ["JetZero", "NASA / Boeing (X-48 research)"]
  },
  {
    id: "tbw",
    name: "Truss-Braced Wing",
    short: "TBW",
    desc: "A strut/truss unloads the wing root, enabling very high aspect ratio wings.",
    todaySupport: "none",
    silhouette: "tbw",
    photo: "assets/aircraft/tbw.jpg",
    photoCredit: "NASA/Boeing X-66A Sustainable Flight Demonstrator — photo: NASA (public domain)",
    companies: ["Boeing", "NASA (Sustainable Flight Demonstrator)"]
  }
];

const SIZE_CLASSES = [
  { id: "regional", name: "Regional", pax: "50–100 pax", range: "~1,500 nmi" },
  { id: "narrowbody", name: "Narrowbody", pax: "100–240 pax", range: "~3,000 nmi" },
  { id: "widebody", name: "Widebody", pax: "250–400 pax", range: "~7,500 nmi" },
  { id: "ultra", name: "Ultra-widebody", pax: "400–600+ pax", range: "~8,500+ nmi" }
];

// matrix[config][size] -> status: "today" (TASOPT handles now),
// "reference" (published concept exists, e.g. D8, TBW literature),
// "target" (this project's expansion goal)
const MATRIX_STATUS = {
  "tube-wing": { regional: "today", narrowbody: "today", widebody: "today", ultra: "target" },
  "d8":        { regional: "target", narrowbody: "reference", widebody: "target", ultra: "target" },
  "bwb":       { regional: "target", narrowbody: "target", widebody: "reference", ultra: "target" },
  "tbw":       { regional: "target", narrowbody: "reference", widebody: "target", ultra: "target" }
};
