import { Category, City, Product } from './types';

export const CITIES: City[] = [
  { id: '1', name: 'Sangli', slug: 'sangli' },
  { id: '2', name: 'Miraj', slug: 'miraj' },
  { id: '3', name: 'Kupwad', slug: 'kupwad' },
];

// Single professional placeholder SVG with a camera/product icon
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Cpath d='M200 130a20 20 0 1 0 0 40 20 20 0 0 0 0-40zm-40 40h80v10h-80zm10-50h60v10h-60z' fill='%23cbd5e1'/%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' font-weight='600' fill='%2394a3b8' uppercase='true'%3EMATERIALCART PREVIEW%3C/text%3E%3C/svg%3E";

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Bricks & Blocks', slug: 'bricks-blocks', icon: 'Box', description: 'Red Bricks, AAC Blocks, Clay' },
  { id: '2', name: 'Cement', slug: 'cement', icon: 'HardHat', description: 'OPC 53, PPC, White Cement' },
  { id: '3', name: 'Steel (TMT)', slug: 'steel', icon: 'Layers', description: 'FE550D, FE500 Grade Bars' },
  { id: '4', name: 'Sand & Aggregates', slug: 'sand-aggregates', icon: 'Mountain', description: 'M-Sand, P-Sand, Metal' },
  { id: '5', name: 'Electrical', slug: 'electrical', icon: 'Zap', description: 'Wires, Switches, MCBs, PVC' },
  { id: '6', name: 'Plumbing', slug: 'plumbing', icon: 'Droplets', description: 'CPVC, UPVC, Fittings, Taps' },
];

export const PRODUCTS: Product[] = [
  // BRICKS & BLOCKS
  {
    id: 'b1', categoryId: '1', subCategory: 'Red Bricks',
    name: 'Standard Clay Red Bricks', priceRange: '₹8 - ₹10', uom: 'piece',
    image: PLACEHOLDER_IMAGE, description: 'Kiln-fired high durability red bricks for load-bearing structures.',
    specifications: [{ label: 'Size', value: '9" x 4" x 3"' }, { label: 'Weight', value: '3.2kg' }]
  },
  {
    id: 'b2', categoryId: '1', subCategory: 'AAC Blocks',
    name: 'Siporex AAC Block (4")', priceRange: '₹3400 - ₹3800', uom: 'CBM',
    image: PLACEHOLDER_IMAGE, description: 'Lightweight aerated concrete blocks for rapid wall construction.',
    specifications: [{ label: 'Thickness', value: '4 Inch' }, { label: 'Density', value: '600 kg/m3' }]
  },
  {
    id: 'b3', categoryId: '1', subCategory: 'AAC Blocks',
    name: 'Siporex AAC Block (6")', priceRange: '₹3400 - ₹3800', uom: 'CBM',
    image: PLACEHOLDER_IMAGE, description: 'Heavy duty lightweight blocks for external walls.',
    specifications: [{ label: 'Thickness', value: '6 Inch' }]
  },

  // CEMENT
  {
    id: 'c1', categoryId: '2', subCategory: 'OPC 53',
    name: 'UltraTech OPC 53 Cement', priceRange: '₹390 - ₹420', uom: '50kg bag',
    image: PLACEHOLDER_IMAGE, brand: 'UltraTech', description: 'High-strength Ordinary Portland Cement for slabs and columns.',
    specifications: [{ label: 'Grade', value: '53' }]
  },
  {
    id: 'c2', categoryId: '2', subCategory: 'PPC',
    name: 'ACC Suraksha PPC Cement', priceRange: '₹360 - ₹390', uom: '50kg bag',
    image: PLACEHOLDER_IMAGE, brand: 'ACC', description: 'Corrosion resistant PPC cement ideal for plastering and tiling.',
    specifications: [{ label: 'Type', value: 'PPC' }]
  },

  // STEEL
  {
    id: 's1', categoryId: '3', subCategory: 'TMT Bars',
    name: 'Tata Tiscon 10mm FE550D', priceRange: '₹68k - ₹72k', uom: 'Tonne',
    image: PLACEHOLDER_IMAGE, brand: 'Tata', description: 'Super ductile TMT bars for earthquake-resistant foundations.',
    specifications: [{ label: 'Dia', value: '10mm' }, { label: 'Grade', value: 'FE550D' }]
  },
  {
    id: 's2', categoryId: '3', subCategory: 'TMT Bars',
    name: 'JSW Neosteel 12mm FE550D', priceRange: '₹66k - ₹70k', uom: 'Tonne',
    image: PLACEHOLDER_IMAGE, brand: 'JSW', description: 'Premium TMT bars with uniform rib patterns for superior bonding.',
    specifications: [{ label: 'Dia', value: '12mm' }]
  },

  // ELECTRICAL (EXTENSIVE)
  {
    id: 'e1', categoryId: '5', subCategory: 'Wires',
    name: 'Polycab 1.5sq mm FRLS Wire', priceRange: '₹1450 - ₹1650', uom: '90m coil',
    image: PLACEHOLDER_IMAGE, brand: 'Polycab', description: 'Flame Retardant Low Smoke copper wires for household circuits.',
    specifications: [{ label: 'Length', value: '90 Meters' }, { label: 'Core', value: 'Copper' }]
  },
  {
    id: 'e2', categoryId: '5', subCategory: 'Wires',
    name: 'Finolex 2.5sq mm Wire', priceRange: '₹2200 - ₹2450', uom: '90m coil',
    image: PLACEHOLDER_IMAGE, brand: 'Finolex', description: 'Heavy-duty wires for power sockets and AC units.',
    specifications: [{ label: 'Capacity', value: '25 Amps' }]
  },
  {
    id: 'e3', categoryId: '5', subCategory: 'Switches',
    name: 'Anchor Roma 1-Way Switch', priceRange: '₹28 - ₹35', uom: 'piece',
    image: PLACEHOLDER_IMAGE, brand: 'Anchor', description: 'Modern modular switch with smooth tactile feedback.',
    specifications: [{ label: 'Rating', value: '6A' }]
  },
  {
    id: 'e4', categoryId: '5', subCategory: 'MCB',
    name: 'Havells 32A DP MCB', priceRange: '₹480 - ₹550', uom: 'piece',
    image: PLACEHOLDER_IMAGE, brand: 'Havells', description: 'Double pole circuit breaker for main line protection.',
    specifications: [{ label: 'Rating', value: '32A' }]
  },
  {
    id: 'e5', categoryId: '5', subCategory: 'Conduits',
    name: 'Precision PVC Conduit Pipe 25mm', priceRange: '₹120 - ₹140', uom: 'bundle',
    image: PLACEHOLDER_IMAGE, brand: 'Precision', description: 'Heavy duty PVC pipes for concealed wiring.',
    specifications: [{ label: 'Length', value: '3 Meters' }]
  },
  {
    id: 'e6', categoryId: '5', subCategory: 'Accessories',
    name: 'Metal Gang Box (2-Module)', priceRange: '₹45 - ₹60', uom: 'piece',
    image: PLACEHOLDER_IMAGE, description: 'GI metal boxes for mounting modular switches in walls.',
    specifications: [{ label: 'Material', value: 'GI Steel' }]
  },

  // PLUMBING (EXTENSIVE)
  {
    id: 'p1', categoryId: '6', subCategory: 'CPVC Pipes',
    name: 'Astral 1" CPVC SDR 11 Pipe', priceRange: '₹380 - ₹450', uom: 'length',
    image: PLACEHOLDER_IMAGE, brand: 'Astral', description: 'Premium CPVC pipe for hot and cold water distribution.',
    specifications: [{ label: 'Size', value: '1 Inch' }, { label: 'Rating', value: 'SDR 11' }]
  },
  {
    id: 'p2', categoryId: '6', subCategory: 'UPVC Pipes',
    name: 'Supreme 4" UPVC SWR Pipe', priceRange: '₹750 - ₹950', uom: 'length',
    image: PLACEHOLDER_IMAGE, brand: 'Supreme', description: 'Soil, Waste and Rain (SWR) drainage pipe with ring-fit joints.',
    specifications: [{ label: 'Dia', value: '110mm' }]
  },
  {
    id: 'p3', categoryId: '6', subCategory: 'Fittings',
    name: 'CPVC Elbow 90 Degree (1")', priceRange: '₹12 - ₹18', uom: 'piece',
    image: PLACEHOLDER_IMAGE, description: 'SDR 11 CPVC elbow for internal water plumbing.',
    specifications: [{ label: 'Size', value: '1 Inch' }]
  },
  {
    id: 'p4', categoryId: '6', subCategory: 'Taps & Faucets',
    name: 'Jaquar Bib Cock (Continental)', priceRange: '₹850 - ₹1100', uom: 'piece',
    image: PLACEHOLDER_IMAGE, brand: 'Jaquar', description: 'Premium chrome finished brass bib tap for bathrooms.',
    specifications: [{ label: 'Material', value: 'Brass' }]
  },
  {
    id: 'p5', categoryId: '6', subCategory: 'Adhesives',
    name: 'Solvent Cement CPVC (100ml)', priceRange: '₹95 - ₹120', uom: 'tin',
    image: PLACEHOLDER_IMAGE, brand: 'Astral', description: 'Strong bonding solvent for CPVC pipes and fittings.',
    specifications: [{ label: 'Volume', value: '100 ml' }]
  },
  {
    id: 'p6', categoryId: '6', subCategory: 'Tanks',
    name: 'Sintex 1000L Triple Layer Tank', priceRange: '₹5800 - ₹6500', uom: 'piece',
    image: PLACEHOLDER_IMAGE, brand: 'Sintex', description: 'Anti-bacterial water storage tank for terrace mounting.',
    specifications: [{ label: 'Capacity', value: '1000 Litres' }]
  }
];

export const BUSINESS_PHONE = "+919876543210";
export const WHATSAPP_LINK = "https://wa.me/919876543210";
