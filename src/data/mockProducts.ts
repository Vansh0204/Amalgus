export interface Product {
  id: string;
  name: string;
  category: string;
  specs: {
    thickness: string;
    dimensions: string;
    colorTint: string;
    coating: string;
    edgeFinish: string;
    certification: string;
  };
  supplier: {
    name: string;
    type: "manufacturer" | "fabricator" | "supplier";
  };
  pricePerSqm: number;
  currency: string;
  description: string;
  tags: string[];
}

const suppliers = [
  { name: "Asahi India Glass (AIS)", type: "manufacturer" },
  { name: "Saint-Gobain India", type: "manufacturer" },
  { name: "Gold Plus Glass Industry", type: "manufacturer" },
  { name: "Sisecam Flat Glass", type: "manufacturer" },
  { name: "ModiGuard", type: "manufacturer" },
  { name: "Gopal Glass Works", type: "fabricator" },
  { name: "Hinduja Glass", type: "fabricator" },
  { name: "Sejal Glass", type: "fabricator" },
  { name: "Impact Glass Solutions", type: "fabricator" },
  { name: "Ozone Overseas", type: "supplier" },
  { name: "Kich Architectural Products", type: "supplier" },
  { name: "Dorma Kaba India", type: "supplier" },
  { name: "Glass Solutions Ltd", type: "supplier" },
  { name: "Indo Glass Hardware", type: "supplier" }
];

const categories = [
  "Float Glass",
  "Tempered Glass",
  "Laminated Safety Glass",
  "Insulated Glass Units (IGU)",
  "Mirrors",
  "Aluminium Hardware"
];

function generateProducts(): Product[] {
  const products: Product[] = [];

  // 1. Float Glass (12 items)
  const floatSuppliers = [suppliers[0], suppliers[1], suppliers[2], suppliers[3]];
  const tints = ["Clear", "Euro Grey", "Bronze", "Ocean Blue", "Dark Green", "Extra Clear"];
  const thicknesses = ["4mm", "5mm", "6mm", "8mm", "10mm", "12mm"];

  for (let i = 1; i <= 12; i++) {
    const tint = tints[i % tints.length];
    const thick = thicknesses[i % thicknesses.length];
    const sup = floatSuppliers[i % floatSuppliers.length];
    products.push({
      id: `float-${i.toString().padStart(3, '0')}`,
      name: `${tint} Float Glass - ${thick}`,
      category: "Float Glass",
      specs: {
        thickness: thick,
        dimensions: "3660mm x 2440mm",
        colorTint: tint,
        coating: i % 3 === 0 ? "Hard Coat Reflective" : "None",
        edgeFinish: "Machine Polished",
        certification: "IS 2835",
      },
      supplier: sup as any,
      pricePerSqm: 600 + (parseInt(thick) * 80) + (tint !== "Clear" ? 200 : 0),
      currency: "INR",
      description: `High-quality ${tint.toLowerCase()} sheet with excellent flatness indices. Suitable for architectural and furniture applications.`,
      tags: ["float", tint.toLowerCase(), thick, "basic"],
    });
  }

  // 2. Tempered (12 items)
  const tempSuppliers = [suppliers[1], suppliers[2], suppliers[7], suppliers[5]];
  for (let i = 1; i <= 12; i++) {
    const thick = [8, 10, 12, 15, 19][i % 5];
    const tint = i % 4 === 0 ? "Frosted" : "Clear";
    products.push({
      id: `temp-${i.toString().padStart(3, '0')}`,
      name: `Toughened ${tint} Safety Glass ${thick}mm`,
      category: "Tempered Glass",
      specs: {
        thickness: `${thick}mm`,
        dimensions: "Custom Sizes Available",
        colorTint: tint,
        coating: "None",
        edgeFinish: "Flat Polished with Ariss",
        certification: "IS 2553 (Part 1)",
      },
      supplier: tempSuppliers[i % tempSuppliers.length] as any,
      pricePerSqm: 1200 + (thick * 120),
      currency: "INR",
      description: `Thermally strengthened ${tint.toLowerCase()} safety glass with high impact resistance. Mandatory for doors, showers, and public areas.`,
      tags: ["tempered", "toughened", "safety", tint.toLowerCase(), `${thick}mm`],
    });
  }

  // 3. Laminated (10 items)
  const lamSuppliers = [suppliers[1], suppliers[8], suppliers[5]];
  const interlayers = ["0.38mm PVB", "0.76mm PVB", "1.52mm SGP", "Acoustic PVB"];
  for (let i = 1; i <= 10; i++) {
    const type = interlayers[i % interlayers.length];
    products.push({
      id: `lam-${i.toString().padStart(3, '0')}`,
      name: `Laminated ${type} Glass`,
      category: "Laminated Safety Glass",
      specs: {
        thickness: "6.38mm to 25.52mm",
        dimensions: "Up to 6000mm length",
        colorTint: i % 4 === 0 ? "Opal White" : "Clear",
        coating: type,
        edgeFinish: "Rough / Polished",
        certification: "BIS Standard",
      },
      supplier: lamSuppliers[i % lamSuppliers.length] as any,
      pricePerSqm: 2500 + (i * 300),
      currency: "INR",
      description: `Multi-layered safety glass that stays intact upon impact. Ideal for overhead glazing, sound reduction, and high security.`,
      tags: ["laminated", "pvb", "sgp", "acoustic", "security"],
    });
  }

  // 4. IGU (8 items)
  const iguSuppliers = [suppliers[6], suppliers[7], suppliers[1]];
  for (let i = 1; i <= 8; i++) {
    const gas = i % 2 === 0 ? "Argon" : "Air";
    products.push({
      id: `igu-${i.toString().padStart(3, '0')}`,
      name: `DGU ${gas} Filled - High Performance`,
      category: "Insulated Glass Units (IGU)",
      specs: {
        thickness: "18mm to 32mm",
        dimensions: "Custom Fabricated",
        colorTint: i % 3 === 0 ? "Blue Reflective" : "Neutral",
        coating: "Double Silver Low-E",
        edgeFinish: "Secondary Structural Seal",
        certification: "EN 1279",
      },
      supplier: iguSuppliers[i % iguSuppliers.length] as any,
      pricePerSqm: 3800 + (i * 200),
      currency: "INR",
      description: `Double glazed units providing extreme thermal and acoustic insulation. Reduces HVAC costs by up to 40% in commercial buildings.`,
      tags: ["igu", "dgu", "double glazed", "low-e", "argon", "insulation"],
    });
  }

  // 5. Mirrors (8 items)
  const mirSuppliers = [suppliers[4], suppliers[0], suppliers[12]];
  const mirTints = ["Silver", "Bronze", "Grey", "Antique Gold"];
  for (let i = 1; i <= 8; i++) {
    const tint = mirTints[i % mirTints.length];
    products.push({
      id: `mir-${i.toString().padStart(3, '0')}`,
      name: `${tint} Wall Mirror - Premium Grade`,
      category: "Mirrors",
      specs: {
        thickness: "4mm / 5mm / 6mm",
        dimensions: "2440mm x 1830mm",
        colorTint: tint,
        coating: "Double Layer Lead-Free",
        edgeFinish: "Beveled / Polished",
        certification: "ISO 9001",
      },
      supplier: mirSuppliers[i % mirSuppliers.length] as any,
      pricePerSqm: 900 + (i * 150),
      currency: "INR",
      description: `Highly reflective decorative mirror with enhanced corrosion resistance. Perfect for wall cladding, washrooms, and interior styling.`,
      tags: ["mirror", "silver", tint.toLowerCase(), "interior", "decor"],
    });
  }

  // 6. Hardware (10 items)
  const hwSuppliers = [suppliers[9], suppliers[10], suppliers[11], suppliers[13]];
  const items = ["Patch Fitting", "D-Bracket", "Soft-Close Hinge", "Spider Fitting", "U-Channel", "Floor Spring"];
  for (let i = 1; i <= 10; i++) {
    const item = items[i % items.length];
    products.push({
      id: `hw-${i.toString().padStart(3, '0')}`,
      name: `${item} - Stainless Steel Series`,
      category: "Aluminium Hardware",
      specs: {
        thickness: "SS 304 / 316 Grade",
        dimensions: "Standard architectural",
        colorTint: i % 2 === 0 ? "Satin Finish" : "Matt Black",
        coating: "PVD / Anodized",
        edgeFinish: "Non-corrosive",
        certification: "Grade 316",
      },
      supplier: hwSuppliers[i % hwSuppliers.length] as any,
      pricePerSqm: 0,
      currency: "INR",
      description: `High-durability hardware for frameless glass installations. Tested for 500k+ cycles for long term heavy-duty usage.`,
      tags: ["hardware", item.toLowerCase(), "ss304", "fittings"],
    });
  }

  return products;
}

export const MOCK_PRODUCTS: Product[] = generateProducts();
