import type { PRODUCT_CATEGORIES } from "./types";

type Category = (typeof PRODUCT_CATEGORIES)[number];

export interface VendorCatalogProduct {
  name: string;
  manufacturer: string;
  model: string;
  category: Category;
  keywords: string[];
  datasheetUrl: string | null;
}

export interface VendorCatalogEntry {
  name: string;
  website: string;
  literatureUrl: string;
  products: VendorCatalogProduct[];
}

/**
 * Pasco Pipe Supply vendor line card with each vendor's flagship waterworks
 * products and direct links to their published submittal / data sheet PDFs.
 */
export const VENDOR_CATALOG: VendorCatalogEntry[] = [
  {
    "name": "McWane Ductile",
    "website": "https://www.mcwaneductile.com",
    "literatureUrl": "https://www.mcwaneductile.com/submittal-builder/",
    "products": [
      {
        "name": "Tyton Joint Ductile Iron Pipe (Push-On, 3\"-36\")",
        "manufacturer": "McWane Ductile",
        "model": "Tyton Joint",
        "category": "Pipe",
        "keywords": [
          "di",
          "dip",
          "tyton",
          "tj",
          "push-on",
          "c151",
          "c111",
          "pc350",
          "cement lined",
          "awwa",
          "zinc coated"
        ],
        "datasheetUrl": "https://www.mcwaneductile.com/upl/downloads/submittal-builder/tyton-joint-pipe-3-36-brochure.pdf"
      },
      {
        "name": "TR Flex Restrained Joint Ductile Iron Pipe (4\"-36\")",
        "manufacturer": "McWane Ductile",
        "model": "TR Flex",
        "category": "Pipe",
        "keywords": [
          "di",
          "dip",
          "tr flex",
          "trf",
          "rj",
          "restrained joint",
          "boltless",
          "c151",
          "pc350",
          "hdd"
        ],
        "datasheetUrl": "https://www.mcwaneductile.com/upl/downloads/submittal-builder/tr-flex-restrained-joint-pipe-and-fittings-4-36-submittal.pdf"
      },
      {
        "name": "Mechanical Joint Ductile Iron Pipe (3\"-24\")",
        "manufacturer": "McWane Ductile",
        "model": "Mechanical Joint",
        "category": "Pipe",
        "keywords": [
          "di",
          "dip",
          "mj",
          "mech joint",
          "c111",
          "c151",
          "cement lined",
          "gland",
          "t-bolt"
        ],
        "datasheetUrl": "https://www.mcwaneductile.com/upl/downloads/submittal-builder/mechanical-joint-pipe-3-24-brochure.pdf"
      }
    ]
  },
  {
    "name": "Kennedy Valve",
    "website": "https://www.kennedyvalve.com",
    "literatureUrl": "https://www.kennedyvalve.com/resources/",
    "products": [
      {
        "name": "Guardian K81D Dry Barrel Fire Hydrant",
        "manufacturer": "Kennedy Valve",
        "model": "K81D",
        "category": "Hydrants",
        "keywords": [
          "k81d",
          "guardian",
          "hydrant",
          "c502",
          "dry barrel",
          "5-1/4",
          "mj shoe",
          "traffic model",
          "nst",
          "3-way"
        ],
        "datasheetUrl": "https://www.kennedyvalve.com/upl/downloads/resources/submittal-sheets/kennedy-guardian-k81d-k81a-and-k81am.pdf"
      },
      {
        "name": "KS-RW Resilient Wedge Gate Valve (AWWA C515)",
        "manufacturer": "Kennedy Valve",
        "model": "KS-RW",
        "category": "Valves",
        "keywords": [
          "ks-rw",
          "rw",
          "rs",
          "gate valve",
          "c515",
          "mj",
          "fl",
          "nrs",
          "epoxy",
          "ow",
          "2in nut"
        ],
        "datasheetUrl": "https://cadlibrary.kennedyvalve.com/Asset/gate-valve-specification-sheet-fc26f358.pdf"
      },
      {
        "name": "KS-FW UL/FM Resilient Wedge Gate Valve 2\"-12\" (AWWA C509)",
        "manufacturer": "Kennedy Valve",
        "model": "KS-FW",
        "category": "Valves",
        "keywords": [
          "ks-fw",
          "ulfm",
          "c509",
          "rw",
          "gate valve",
          "fire main",
          "os&y",
          "fl",
          "mj",
          "250 psi"
        ],
        "datasheetUrl": "https://www.kennedyvalve.com/upl/downloads/catalog/products/ks-fw-submittal-2-12-c509.pdf"
      }
    ]
  },
  {
    "name": "M&H Valve Company",
    "website": "https://www.mh-valve.com",
    "literatureUrl": "https://www.mh-valve.com/products/",
    "products": [
      {
        "name": "Style 929 Reliant Dry Barrel Fire Hydrant",
        "manufacturer": "M&H Valve",
        "model": "929",
        "category": "Hydrants",
        "keywords": [
          "929",
          "reliant",
          "hydrant",
          "c502",
          "dry barrel",
          "5-1/4",
          "traffic model",
          "mj shoe",
          "nst",
          "3-way"
        ],
        "datasheetUrl": "https://www.mh-valve.com/upl/downloads/catalog/products/submittal-sheet-929-75c04d89.pdf"
      },
      {
        "name": "Style 129 Dry Barrel Fire Hydrant",
        "manufacturer": "M&H Valve",
        "model": "129",
        "category": "Hydrants",
        "keywords": [
          "129",
          "hydrant",
          "c502",
          "dry barrel",
          "4-1/2",
          "5-1/4",
          "nst",
          "traffic",
          "3-way"
        ],
        "datasheetUrl": "https://www.mh-valve.com/upl/downloads/catalog/products/submittal-sheet-129-hydrant.pdf"
      },
      {
        "name": "Resilient Wedge Gate Valve 4\"-20\" (AWWA C515)",
        "manufacturer": "M&H Valve",
        "model": "C515 RW",
        "category": "Valves",
        "keywords": [
          "rw",
          "gate valve",
          "c515",
          "mj",
          "fl",
          "nrs",
          "epoxy",
          "resilient wedge",
          "2in nut",
          "ow"
        ],
        "datasheetUrl": "https://www.mh-valve.com/upl/downloads/resources/submittal-sheets/c515-4-20.pdf"
      }
    ]
  },
  {
    "name": "EBAA Iron",
    "website": "https://ebaa.com",
    "literatureUrl": "https://ebaa.com/documents/submittal-packages/",
    "products": [
      {
        "name": "MEGALUG Series 1100 Mechanical Joint Restraint for Ductile Iron Pipe",
        "manufacturer": "EBAA Iron",
        "model": "1100",
        "category": "Restraint",
        "keywords": [
          "megalug",
          "1100",
          "mj",
          "restraint",
          "di",
          "dip",
          "wedge",
          "gland",
          "c111",
          "350 psi"
        ],
        "datasheetUrl": "https://ebaa.com/app/uploads/files/Brochure.1100.pdf"
      },
      {
        "name": "MEGALUG Series 2000PV Mechanical Joint Restraint for PVC Pipe",
        "manufacturer": "EBAA Iron",
        "model": "2000PV",
        "category": "Restraint",
        "keywords": [
          "megalug",
          "2000pv",
          "mj",
          "restraint",
          "pvc",
          "c900",
          "gland",
          "wedge",
          "dr18"
        ],
        "datasheetUrl": "https://ebaa.com/app/uploads/files/Brochure.2000PV-1.pdf"
      },
      {
        "name": "Series 1700 Restraint Harness for Ductile Iron Push-On Joints",
        "manufacturer": "EBAA Iron",
        "model": "1700",
        "category": "Restraint",
        "keywords": [
          "1700",
          "harness",
          "bell restraint",
          "push-on",
          "tyton",
          "di",
          "dip",
          "joint restraint"
        ],
        "datasheetUrl": "https://ebaa.com/app/uploads/files/Brochure.1700.pdf"
      },
      {
        "name": "MEGAFLANGE Series 2100 Restrained Flange Adapter",
        "manufacturer": "EBAA Iron",
        "model": "2100",
        "category": "Restraint",
        "keywords": [
          "megaflange",
          "2100",
          "flange adapter",
          "restrained",
          "fl",
          "di",
          "pvc",
          "class 150"
        ],
        "datasheetUrl": "https://ebaa.com/app/uploads/files/Brochure.2100.pdf"
      }
    ]
  },
  {
    "name": "ROMAC Industries Inc",
    "website": "https://www.romac.com",
    "literatureUrl": "https://www.romac.com/documents-2",
    "products": [
      {
        "name": "SS1 Stainless Steel Repair Clamp",
        "manufacturer": "ROMAC Industries",
        "model": "SS1",
        "category": "Couplings & Repair",
        "keywords": [
          "ss1",
          "ss2",
          "ss3",
          "repair",
          "clamp",
          "stainless",
          "full circle",
          "romac",
          "pipe repair",
          "band"
        ],
        "datasheetUrl": "https://www.romac.net/Submittals/CLAMPS/ss1-2-3-sub.pdf"
      },
      {
        "name": "SST Stainless Steel Tapping Sleeve",
        "manufacturer": "ROMAC Industries",
        "model": "SST",
        "category": "Tapping",
        "keywords": [
          "sst",
          "tapping",
          "sleeve",
          "stainless",
          "flange",
          "wet tap",
          "hot tap",
          "romac",
          "awwa c223"
        ],
        "datasheetUrl": "https://www.romac.net/Submittals/SST/sst-ss-flg-sub.pdf"
      },
      {
        "name": "Style 501 Ductile Iron Coupling",
        "manufacturer": "ROMAC Industries",
        "model": "501",
        "category": "Couplings & Repair",
        "keywords": [
          "501",
          "rc501",
          "coupling",
          "ductile iron",
          "transition",
          "reducing",
          "bolted",
          "romac",
          "sleeve coupling"
        ],
        "datasheetUrl": "https://www.romac.net/Submittals/COUPLINGS/501-RC501-SUB.pdf"
      },
      {
        "name": "Alpha Wide Range Restrained Coupling",
        "manufacturer": "ROMAC Industries",
        "model": "ALPHA",
        "category": "Restraint",
        "keywords": [
          "alpha",
          "restrained",
          "coupling",
          "wide range",
          "two bolt",
          "restraint",
          "romac",
          "di",
          "pvc",
          "hdpe"
        ],
        "datasheetUrl": "https://www.romac.net/Submittals/COUPLINGS/alpha-SUB.pdf"
      }
    ]
  },
  {
    "name": "JCM Industries",
    "website": "https://www.jcmindustries.com",
    "literatureUrl": "https://www.jcmindustries.com/products/product-specifications/",
    "products": [
      {
        "name": "JCM 412 Fabricated Steel Tapping Sleeve",
        "manufacturer": "JCM Industries",
        "model": "412",
        "category": "Tapping",
        "keywords": [
          "412",
          "tapping",
          "sleeve",
          "fabricated",
          "steel",
          "mj",
          "flange",
          "hot tap",
          "jcm",
          "awwa"
        ],
        "datasheetUrl": "https://www.jcmindustries.com/wp-content/uploads/JCM-412-Fabricated-Tapping-Sleeve-040926.pdf"
      },
      {
        "name": "JCM 101 Universal Clamp Coupling (Repair Clamp)",
        "manufacturer": "JCM Industries",
        "model": "101",
        "category": "Couplings & Repair",
        "keywords": [
          "101",
          "ucc",
          "universal",
          "clamp",
          "coupling",
          "repair",
          "single band",
          "stainless",
          "jcm",
          "awwa c230"
        ],
        "datasheetUrl": "https://www.jcmindustries.com/wp-content/uploads/JCM-101-Universal-Clamp-Coupling-07292021-1.pdf"
      },
      {
        "name": "JCM 201 Steel Bolted Coupling",
        "manufacturer": "JCM Industries",
        "model": "201",
        "category": "Couplings & Repair",
        "keywords": [
          "201",
          "coupling",
          "steel",
          "bolted",
          "compression",
          "plain end",
          "transition",
          "jcm",
          "sleeve"
        ],
        "datasheetUrl": "https://www.jcmindustries.com/wp-content/uploads/JCM-201-Steel-Couplings-09212021.pdf"
      },
      {
        "name": "JCM 401 Coated Steel Service Saddle",
        "manufacturer": "JCM Industries",
        "model": "401",
        "category": "Tapping",
        "keywords": [
          "401",
          "service",
          "saddle",
          "tap",
          "corporation stop",
          "coated steel",
          "double strap",
          "jcm",
          "outlet"
        ],
        "datasheetUrl": "https://www.jcmindustries.com/wp-content/uploads/JCM-401-Service-Saddle-031921-2.pdf"
      }
    ]
  },
  {
    "name": "Total Piping Solutions",
    "website": "https://dresserutility.com/coupling-repair/water-and-industrial-markets/",
    "literatureUrl": "https://dresserutility.com/literature-center/",
    "products": [
      {
        "name": "Triple Tap Tapping Sleeve",
        "manufacturer": "Total Piping Solutions (Dresser)",
        "model": "Triple Tap",
        "category": "Tapping",
        "keywords": [
          "triple tap",
          "tapping",
          "sleeve",
          "universal",
          "wide range",
          "tps",
          "hot tap",
          "mj",
          "stainless"
        ],
        "datasheetUrl": "https://dresserutility.com/wp-content/uploads/Triple-Tap-Tapping-Sleeve-Technical-Specifications-ENGTS-01-11_6_2018-Revision-15.pdf"
      },
      {
        "name": "TX3 Extended Range Transition Coupling",
        "manufacturer": "Total Piping Solutions (Dresser)",
        "model": "TX3",
        "category": "Couplings & Repair",
        "keywords": [
          "tx3",
          "coupling",
          "extended range",
          "transition",
          "wide range",
          "tps",
          "bolted",
          "di",
          "pvc"
        ],
        "datasheetUrl": "https://dresserutility.com/wp-content/uploads/TX3-Product-Submittal.pdf"
      },
      {
        "name": "Quick-Cam Wide Range Repair Clamp",
        "manufacturer": "Total Piping Solutions (Dresser)",
        "model": "Quick-Cam",
        "category": "Couplings & Repair",
        "keywords": [
          "quick cam",
          "quickcam",
          "repair",
          "clamp",
          "wide range",
          "stainless",
          "tps",
          "full circle",
          "band"
        ],
        "datasheetUrl": "https://dresserutility.com/wp-content/uploads/Quick-Cam-Wide-Range-Repair-Clamp-Techinal-Specification-REV-B-Jul-2017.pdf"
      },
      {
        "name": "T3 Wide Range Service Saddle",
        "manufacturer": "Total Piping Solutions (Dresser)",
        "model": "T3",
        "category": "Tapping",
        "keywords": [
          "t3",
          "service",
          "saddle",
          "wide range",
          "tap",
          "corporation",
          "tps",
          "stainless",
          "outlet"
        ],
        "datasheetUrl": "https://dresserutility.com/wp-content/uploads/Single-Panel_T3-Service-Saddle-Technical-Specifications_030819-Release.pdf"
      }
    ]
  },
  {
    "name": "Star Pipe Products",
    "website": "https://www.starpipeproducts.com",
    "literatureUrl": "https://www.starpipeproducts.com/submittals/",
    "products": [
      {
        "name": "StarGrip Series 3000 MJ Wedge Action Restraint (Ductile Iron Pipe)",
        "manufacturer": "Star Pipe Products",
        "model": "Series 3000",
        "category": "Restraint",
        "keywords": [
          "stargrip",
          "3000",
          "restraint",
          "mj",
          "mechanical joint",
          "wedge",
          "gland",
          "ductile iron",
          "megalug equal",
          "star"
        ],
        "datasheetUrl": "https://www.starpipeproducts.com/wp-content/uploads/3000_Submittal_2401.pdf"
      },
      {
        "name": "PVC StarGrip Series 4100P Restraint (PVC Pipe)",
        "manufacturer": "Star Pipe Products",
        "model": "Series 4100P",
        "category": "Restraint",
        "keywords": [
          "stargrip",
          "4100p",
          "pvc",
          "restraint",
          "c900",
          "mj",
          "gland",
          "wedge",
          "star",
          "joint restraint"
        ],
        "datasheetUrl": "https://www.starpipeproducts.com/wp-content/uploads/4100P_Submittal_2401.pdf"
      },
      {
        "name": "C153 Ductile Iron Compact Mechanical Joint Fittings",
        "manufacturer": "Star Pipe Products",
        "model": "C153 Compact MJ",
        "category": "Fittings",
        "keywords": [
          "c153",
          "mj",
          "fittings",
          "compact",
          "ductile iron",
          "bend",
          "tee",
          "awwa",
          "cement lined",
          "star"
        ],
        "datasheetUrl": "https://www.starpipeproducts.com/wp-content/uploads/Import_MJCompact_Submittal2001.pdf"
      },
      {
        "name": "StarFlange Series 3200 Restrained Flange Adapter (Ductile Iron Pipe)",
        "manufacturer": "Star Pipe Products",
        "model": "Series 3200",
        "category": "Restraint",
        "keywords": [
          "starflange",
          "3200",
          "flange adapter",
          "restrained",
          "ductile iron",
          "coupling",
          "star",
          "flange",
          "restraint"
        ],
        "datasheetUrl": "https://www.starpipeproducts.com/wp-content/uploads/3200_Submittal_2101-2.pdf"
      }
    ]
  },
  {
    "name": "AY McDonald",
    "website": "https://www.aymcdonald.com",
    "literatureUrl": "https://www.aymcdonald.com/en/catalog/node/water-works",
    "products": [
      {
        "name": "NL Ball Style Corporation Stop (AWWA Taper x CTS Compression)",
        "manufacturer": "AY McDonald",
        "model": "74701B / 74701BA",
        "category": "Service Brass",
        "keywords": [
          "corp",
          "stop",
          "corporation",
          "awwa",
          "cc",
          "cts",
          "compression",
          "brass",
          "nl",
          "ball",
          "74701b",
          "c800"
        ],
        "datasheetUrl": "https://www.aymcdonald.com/Image/GetDocument/en/5936/74701ba.pdf"
      },
      {
        "name": "NL Ball Style Curb Stop (CTS Compression x CTS Compression)",
        "manufacturer": "AY McDonald",
        "model": "76106Q / 76106QA",
        "category": "Service Brass",
        "keywords": [
          "curb",
          "stop",
          "ball",
          "curb valve",
          "cts",
          "compression",
          "brass",
          "nl",
          "76100",
          "76106",
          "c800"
        ],
        "datasheetUrl": "https://www.aymcdonald.com/Image/GetDocument/en/10523/76106qa.pdf"
      },
      {
        "name": "NL Copper Meter Setter (Double Purpose x Double Purpose)",
        "manufacturer": "AY McDonald",
        "model": "720-4D4",
        "category": "Meters",
        "keywords": [
          "meter",
          "setter",
          "yoke",
          "copper",
          "720",
          "nl",
          "brass",
          "double",
          "purpose",
          "cts",
          "setter"
        ],
        "datasheetUrl": "https://www.aymcdonald.com/Image/GetDocument/en/3107/720-4d4.pdf"
      }
    ]
  },
  {
    "name": "Advanced Drainage Systems (ADS)",
    "website": "https://www.adspipe.com",
    "literatureUrl": "https://www.adspipe.com/resources",
    "products": [
      {
        "name": "N-12 WT Dual Wall HDPE Pipe, Watertight (per ASTM F2648)",
        "manufacturer": "ADS",
        "model": "N-12 WT",
        "category": "Drainage",
        "keywords": [
          "n-12",
          "n12",
          "hdpe",
          "dual",
          "wall",
          "corrugated",
          "pipe",
          "wt",
          "watertight",
          "storm",
          "f2648",
          "bell"
        ],
        "datasheetUrl": "https://assets.adspipe.com/m/4520cdffa033cf12/original/N-12-Water-Tight-per-ASTM-F2648-Submittal-Package.pdf"
      },
      {
        "name": "SaniTite HP Polypropylene Sanitary Sewer Pipe 12\"-60\"",
        "manufacturer": "ADS",
        "model": "SaniTite HP",
        "category": "Pipe",
        "keywords": [
          "sanitite",
          "hp",
          "pp",
          "polypropylene",
          "sanitary",
          "sewer",
          "pipe",
          "f2764",
          "gravity",
          "triple",
          "wall"
        ],
        "datasheetUrl": "https://assets.adspipe.com/m/3367c6c5d1b6e8df/original/SaniTite-HP-12-60-Brochure.pdf"
      },
      {
        "name": "HP Storm Polypropylene Storm Drainage Pipe",
        "manufacturer": "ADS",
        "model": "HP Storm",
        "category": "Drainage",
        "keywords": [
          "hp",
          "storm",
          "pp",
          "polypropylene",
          "pipe",
          "dual",
          "wall",
          "storm",
          "drain",
          "f2881",
          "corrugated"
        ],
        "datasheetUrl": "https://assets.adspipe.com/m/219d863c358b4595/original/HP-Storm-Submittal-Package.pdf"
      }
    ]
  },
  {
    "name": "Liberty Pumps",
    "website": "https://www.libertypumps.com",
    "literatureUrl": "https://www.libertypumps.com/en-us/wp/dom/Resources",
    "products": [
      {
        "name": "280-Series 1/2 HP Cast Iron Sump/Effluent Pump (Model 287)",
        "manufacturer": "Liberty Pumps",
        "model": "287 / 280-Series",
        "category": "Pumps",
        "keywords": [
          "sump",
          "pump",
          "287",
          "280",
          "effluent",
          "submersible",
          "vmf",
          "cast",
          "iron",
          "115v",
          "1/2hp"
        ],
        "datasheetUrl": "https://www.libertypumps.com/Portals/0/Files/Engineering%20Specifications/English/280-Series_EN.pdf"
      },
      {
        "name": "LE50-Series 1/2 HP Submersible Sewage Pump (2\" Solids)",
        "manufacturer": "Liberty Pumps",
        "model": "LE50-Series",
        "category": "Pumps",
        "keywords": [
          "sewage",
          "pump",
          "le50",
          "le51",
          "submersible",
          "solids",
          "cast",
          "iron",
          "2in",
          "ejector",
          "1/2hp"
        ],
        "datasheetUrl": "https://www.libertypumps.com/Portals/0/Files/Engineering%20Specifications/English/LE50-60Hz-Series_EN.pdf"
      },
      {
        "name": "PRG-Series ProVore 1 HP Submersible Grinder Pump",
        "manufacturer": "Liberty Pumps",
        "model": "PRG101 / PRG-Series",
        "category": "Pumps",
        "keywords": [
          "grinder",
          "pump",
          "provore",
          "prg",
          "prg101",
          "submersible",
          "sewage",
          "1hp",
          "slurry",
          "cast",
          "iron"
        ],
        "datasheetUrl": "https://www.libertypumps.com/Portals/0/Files/Engineering%20Specifications/English/PRG-Series_EN.pdf"
      }
    ]
  },
  {
    "name": "GPK Products Inc",
    "website": "https://www.gpk-fargo.com",
    "literatureUrl": "https://www.gpk-fargo.com/resources/",
    "products": [
      {
        "name": "SDR35 Gasketed PVC Sewer Fittings (ASTM D3034 / F679)",
        "manufacturer": "GPK Products",
        "model": "SDR35",
        "category": "Fittings",
        "keywords": [
          "sdr35",
          "pvc",
          "sewer",
          "fitting",
          "gasketed",
          "d3034",
          "f679",
          "wye",
          "tee",
          "bend",
          "sanitary"
        ],
        "datasheetUrl": "https://www.gpk-fargo.com/wp-content/uploads/2024/10/Sewer-Fittings-Submittal-2024-.pdf"
      },
      {
        "name": "Ultra-Corr Corrugated Pipe PVC Fittings",
        "manufacturer": "GPK Products",
        "model": "Ultra-Corr",
        "category": "Fittings",
        "keywords": [
          "ultra-corr",
          "ultracorr",
          "corrugated",
          "pvc",
          "fitting",
          "hdpe",
          "adapter",
          "storm",
          "drainage",
          "gasketed"
        ],
        "datasheetUrl": "https://www.gpk-fargo.com/wp-content/uploads/2024/10/Ultra-Core-Fitting-Submittal-2024.pdf"
      },
      {
        "name": "IPS SDR26 Non-Pressure PVC Fittings",
        "manufacturer": "GPK Products",
        "model": "IPS SDR26",
        "category": "Fittings",
        "keywords": [
          "ips",
          "sdr26",
          "pvc",
          "fitting",
          "non-pressure",
          "gasketed",
          "sewer",
          "wye",
          "bend",
          "coupling"
        ],
        "datasheetUrl": "https://www.gpk-fargo.com/wp-content/uploads/2024/10/IPS-SDR26-Fitting-Submittal-2025.pdf"
      },
      {
        "name": "SMARTplug Sewer Lateral Plug",
        "manufacturer": "GPK Products",
        "model": "SMARTplug",
        "category": "Other",
        "keywords": [
          "smartplug",
          "plug",
          "lateral",
          "sewer",
          "pvc",
          "test",
          "cap",
          "stub",
          "gasketed"
        ],
        "datasheetUrl": "https://www.gpk-fargo.com/wp-content/uploads/2024/10/smartplug-submittal_0.pdf"
      }
    ]
  },
  {
    "name": "Sigma Piping Products",
    "website": "https://www.sigmaco.com/",
    "literatureUrl": "https://www.sigmaco.com/resources",
    "products": [
      {
        "name": "AWWA C153 Ductile Iron Compact Mechanical Joint Fittings",
        "manufacturer": "Sigma Corporation",
        "model": "C153 MJ",
        "category": "Fittings",
        "keywords": [
          "c153",
          "mj",
          "mechanical joint",
          "ductile iron",
          "di",
          "compact",
          "bend",
          "tee",
          "cement lined",
          "350 psi",
          "awwa"
        ],
        "datasheetUrl": "https://www.sigmaco.com/s/SUBMITTAL_C153-DI-MJ-FITTINGS-Customizable-Version-4-April2025-6efn.pdf"
      },
      {
        "name": "ONE-LOK SLDE Mechanical Joint Wedge Restraint Gland for Ductile Iron Pipe",
        "manufacturer": "Sigma Corporation",
        "model": "ONE-LOK SLDE",
        "category": "Restraint",
        "keywords": [
          "one-lok",
          "slde",
          "restraint",
          "gland",
          "wedge",
          "mj",
          "ductile iron",
          "dip",
          "megalug equal",
          "joint restraint"
        ],
        "datasheetUrl": "https://www.sigmaco.com/s/SUBMITTAL_SLDE-for-DI-Pipe-Customizable-Sheet-V3-2.pdf"
      },
      {
        "name": "PV-LOK PWP Restraint Harness for C900 PVC Pipe",
        "manufacturer": "Sigma Corporation",
        "model": "PV-LOK PWP",
        "category": "Restraint",
        "keywords": [
          "pv-lok",
          "pwp",
          "restraint",
          "harness",
          "c900",
          "pvc",
          "bell restraint",
          "serrated",
          "dr18",
          "joint restraint"
        ],
        "datasheetUrl": "https://www.sigmaco.com/s/PV-LOK-Model-PWP-for-PVC-Pipe-Submittal-24xl.pdf"
      },
      {
        "name": "Cast Iron Valve Boxes (Screw Type & Slide Type)",
        "manufacturer": "Sigma Corporation",
        "model": "VB Series",
        "category": "Other",
        "keywords": [
          "valve box",
          "vb",
          "screw type",
          "slide type",
          "cast iron",
          "riser",
          "lid",
          "curb box",
          "buffalo",
          "5-1/4"
        ],
        "datasheetUrl": "https://www.sigmaco.us/SigmaContentFiles/PRODUCTS/1%20WATERWORKS%20PRODUCTS/4%20MUNICIPAL%20CASTINGS/H.%20Midwest%20MCC%20-%20Valve%20and%20Curb%20Boxes/mid_MCC_VALVEBOX.PDF"
      }
    ]
  },
  {
    "name": "National Pipe and Plastics Inc",
    "website": "https://nationalpipe.com/",
    "literatureUrl": "https://nationalpipe.com/resources/",
    "products": [
      {
        "name": "DURA-BLUE AWWA C900 PVC Municipal Water Distribution Pipe (4\"-12\")",
        "manufacturer": "National Pipe & Plastics",
        "model": "DURA-BLUE C900",
        "category": "Pipe",
        "keywords": [
          "c900",
          "dr14",
          "dr18",
          "dr25",
          "pvc",
          "pressure pipe",
          "water main",
          "ciod",
          "gasketed",
          "blue",
          "durablue",
          "awwa"
        ],
        "datasheetUrl": "https://nationalpipe.com/wp-content/uploads/DuraBlue-C900-4-48-inch.pdf"
      },
      {
        "name": "DURA-BLUE AWWA C900 PVC Water Transmission Pipe (14\"-24\")",
        "manufacturer": "National Pipe & Plastics",
        "model": "DURA-BLUE C900",
        "category": "Pipe",
        "keywords": [
          "c900",
          "transmission",
          "dr18",
          "dr25",
          "pvc",
          "pressure pipe",
          "ciod",
          "gasketed",
          "large diameter",
          "awwa"
        ],
        "datasheetUrl": "https://nationalpipe.com/wp-content/uploads/2023/09/DuraBlue-C900-14-48-inch.pdf"
      },
      {
        "name": "PVC Gravity Sewer Pipe (ASTM D3034 SDR-35 / F679)",
        "manufacturer": "National Pipe & Plastics",
        "model": "NPP Sewer",
        "category": "Pipe",
        "keywords": [
          "sdr35",
          "d3034",
          "f679",
          "ps46",
          "gravity sewer",
          "gasketed",
          "green",
          "psm",
          "pvc",
          "sewer main"
        ],
        "datasheetUrl": "https://nationalpipe.com/wp-content/uploads/NPP-Sewer-Spec-Sheet-WEB-1.pdf"
      },
      {
        "name": "DURA-FLOW PVC Pressure-Rated Pipe (SDR Series, ASTM D2241)",
        "manufacturer": "National Pipe & Plastics",
        "model": "DURA-FLOW",
        "category": "Pipe",
        "keywords": [
          "d2241",
          "sdr21",
          "sdr26",
          "ips",
          "pressure pipe",
          "gasketed",
          "d3139",
          "solvent weld",
          "pvc",
          "duraflow"
        ],
        "datasheetUrl": "https://nationalpipe.com/wp-content/uploads/OCI-537-DuraFlow-Spec-Sheet-Update.pdf"
      }
    ]
  },
  {
    "name": "Sanderson Pipe Corporation",
    "website": "https://sandersonpipe.com/",
    "literatureUrl": "https://sandersonpipe.com/resources/",
    "products": [
      {
        "name": "AWWA C900 PVC Pressure Pipe",
        "manufacturer": "Sanderson Pipe",
        "model": "C900",
        "category": "Pipe",
        "keywords": [
          "c900",
          "dr14",
          "dr18",
          "pvc",
          "pressure pipe",
          "water main",
          "ciod",
          "gasketed",
          "blue",
          "awwa",
          "municipal"
        ],
        "datasheetUrl": "https://sandersonpipe.com/wp-content/uploads/2025/06/catalog-2025_c900.pdf"
      },
      {
        "name": "PVC Gasketed Gravity Sewer Pipe (ASTM D3034 SDR-35)",
        "manufacturer": "Sanderson Pipe",
        "model": "SDR-35 Sewer",
        "category": "Pipe",
        "keywords": [
          "sdr35",
          "d3034",
          "ps46",
          "gravity sewer",
          "gasketed",
          "green",
          "pvc",
          "sewer pipe",
          "f477"
        ],
        "datasheetUrl": "https://sandersonpipe.com/wp-content/uploads/2025/06/catalog-2025_sewer.pdf"
      },
      {
        "name": "IPS PVC Pressure Pipe (ASTM D2241 SDR Series)",
        "manufacturer": "Sanderson Pipe",
        "model": "IPS SDR 21/26",
        "category": "Pipe",
        "keywords": [
          "d2241",
          "sdr21",
          "sdr26",
          "ips",
          "pressure pipe",
          "gasketed",
          "solvent weld",
          "pvc",
          "irrigation",
          "160 psi",
          "200 psi"
        ],
        "datasheetUrl": "https://sandersonpipe.com/wp-content/uploads/2025/06/catalog-2025_ips.pdf"
      },
      {
        "name": "PVC Well Casing Pipe",
        "manufacturer": "Sanderson Pipe",
        "model": "Well Casing",
        "category": "Pipe",
        "keywords": [
          "well casing",
          "f480",
          "pvc",
          "sdr21",
          "casing",
          "water well",
          "solvent weld"
        ],
        "datasheetUrl": "https://sandersonpipe.com/wp-content/uploads/2025/06/catalog-2025_well.pdf"
      }
    ]
  },
  {
    "name": "Multi Fittings",
    "website": "https://multifittings.com/",
    "literatureUrl": "https://multifittings.com/submittal-sheets/",
    "products": [
      {
        "name": "Trench Tough Plus Molded SDR35 Gasketed PVC Sewer Fittings",
        "manufacturer": "Multi Fittings",
        "model": "Trench Tough Plus",
        "category": "Fittings",
        "keywords": [
          "sdr35",
          "gasketed",
          "sewer fittings",
          "pvc",
          "d3034",
          "wye",
          "tee",
          "bend",
          "trench tough",
          "f477",
          "molded"
        ],
        "datasheetUrl": "https://multifittings.com/wp-content/uploads/2023/04/PVC_SDR35_Gasket-2.US-P.pdf"
      },
      {
        "name": "SDR26 Heavy Wall Gasketed PVC Sewer Fittings",
        "manufacturer": "Multi Fittings",
        "model": "SDR26 Heavy Wall",
        "category": "Fittings",
        "keywords": [
          "sdr26",
          "heavy wall",
          "gasketed",
          "sewer fittings",
          "pvc",
          "d3034",
          "force main",
          "wye",
          "bend"
        ],
        "datasheetUrl": "https://multifittings.com/wp-content/uploads/2023/04/PVC_SDR26_Gasket-6-P.pdf"
      },
      {
        "name": "Blue Brute C900/C907 PVC Pressure Fittings",
        "manufacturer": "Multi Fittings",
        "model": "Blue Brute",
        "category": "Fittings",
        "keywords": [
          "c907",
          "c900",
          "blue brute",
          "pressure fittings",
          "pvc",
          "ciod",
          "dr18",
          "gasketed",
          "water main",
          "molded"
        ],
        "datasheetUrl": "https://multifittings.com/wp-content/uploads/2023/04/Brochure-US-Multi-PVC-Fittings.pdf"
      },
      {
        "name": "SewerBrute Large Diameter Fabricated PVC Sewer Fittings",
        "manufacturer": "Multi Fittings",
        "model": "SewerBrute",
        "category": "Fittings",
        "keywords": [
          "sewerbrute",
          "fabricated",
          "large diameter",
          "sewer fittings",
          "pvc",
          "wye",
          "45 degree",
          "f679",
          "gasketed"
        ],
        "datasheetUrl": "https://multifittings.com/wp-content/uploads/2023/04/SewerBrute-45-degree-Wye-BxBxB.pdf"
      }
    ]
  }
];
