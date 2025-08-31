// Medical clothing standard colors - Extended palette
export const MEDICAL_COLORS = [
  // Blues (Most popular in healthcare)
  { id: 'navy', name: 'Navy Blue', hex: '#003366', pantone: '533C' },
  { id: 'ceil', name: 'Ceil Blue', hex: '#8AC5D8', pantone: '5415C' },
  { id: 'royal', name: 'Royal Blue', hex: '#4169E1', pantone: '286C' },
  { id: 'caribbean', name: 'Caribbean Blue', hex: '#00CED1', pantone: '3125C' },
  { id: 'galaxy', name: 'Galaxy Blue', hex: '#2C5985', pantone: '7469C' },
  { id: 'ciel', name: 'Ciel', hex: '#A4C8E1', pantone: '543C' },
  { id: 'turquoise', name: 'Turquoise', hex: '#40E0D0', pantone: '3252C' },
  { id: 'powder', name: 'Powder Blue', hex: '#B0E0E6', pantone: '656C' },
  { id: 'slate', name: 'Slate Blue', hex: '#6A5ACD', pantone: '2725C' },
  
  // Greens
  { id: 'surgical-green', name: 'Surgical Green', hex: '#7CB342', pantone: '7489C' },
  { id: 'hunter', name: 'Hunter Green', hex: '#355E3B', pantone: '5535C' },
  { id: 'olive', name: 'Olive', hex: '#6B8E23', pantone: '5757C' },
  { id: 'sage', name: 'Sage Green', hex: '#87A96B', pantone: '5783C' },
  { id: 'mint', name: 'Mint', hex: '#98FB98', pantone: '351C' },
  { id: 'emerald', name: 'Emerald', hex: '#50C878', pantone: '3415C' },
  { id: 'seafoam', name: 'Seafoam', hex: '#93E9BE', pantone: '332C' },
  { id: 'teal', name: 'Teal', hex: '#008B8B', pantone: '3155C' },
  
  // Purples & Pinks
  { id: 'wine', name: 'Wine', hex: '#722F37', pantone: '7428C' },
  { id: 'burgundy', name: 'Burgundy', hex: '#800020', pantone: '7421C' },
  { id: 'plum', name: 'Plum', hex: '#8E4585', pantone: '2583C' },
  { id: 'eggplant', name: 'Eggplant', hex: '#614051', pantone: '5195C' },
  { id: 'lavender', name: 'Lavender', hex: '#B57EDC', pantone: '2567C' },
  { id: 'orchid', name: 'Orchid', hex: '#DA70D6', pantone: '2572C' },
  { id: 'lilac', name: 'Lilac', hex: '#C8A2C8', pantone: '522C' },
  { id: 'fuchsia', name: 'Fuchsia', hex: '#FF1493', pantone: '241C' },
  { id: 'raspberry', name: 'Raspberry', hex: '#E30B5D', pantone: '7425C' },
  { id: 'rose', name: 'Rose', hex: '#FF007F', pantone: '213C' },
  { id: 'coral', name: 'Coral', hex: '#FF7F50', pantone: '7416C' },
  { id: 'peach', name: 'Peach', hex: '#FFDAB9', pantone: '162C' },
  
  // Grays & Neutrals
  { id: 'black', name: 'Black', hex: '#000000', pantone: 'Black C' },
  { id: 'charcoal', name: 'Charcoal', hex: '#36454F', pantone: '432C' },
  { id: 'pewter', name: 'Pewter Gray', hex: '#91989F', pantone: '429C' },
  { id: 'graphite', name: 'Graphite', hex: '#41424C', pantone: '433C' },
  { id: 'steel', name: 'Steel Gray', hex: '#71797E', pantone: '444C' },
  { id: 'silver', name: 'Silver', hex: '#C0C0C0', pantone: '427C' },
  { id: 'heather', name: 'Heather Gray', hex: '#9AA0A6', pantone: '422C' },
  { id: 'white', name: 'White', hex: '#FFFFFF', pantone: 'White' },
  
  // Earth Tones
  { id: 'sand', name: 'Sand', hex: '#C2B280', pantone: '4525C' },
  { id: 'khaki', name: 'Khaki', hex: '#8F8B66', pantone: '4505C' },
  { id: 'taupe', name: 'Taupe', hex: '#483C32', pantone: '7519C' },
  { id: 'mocha', name: 'Mocha', hex: '#6F4E37', pantone: '7582C' },
  { id: 'chocolate', name: 'Chocolate', hex: '#7B3F00', pantone: '4695C' },
  { id: 'cocoa', name: 'Cocoa', hex: '#875A2C', pantone: '7526C' },
  { id: 'camel', name: 'Camel', hex: '#C19A6B', pantone: '465C' },
  
  // Bright Colors (Popular for Pediatric/Specialty units)
  { id: 'red', name: 'Red', hex: '#FF0000', pantone: '185C' },
  { id: 'orange', name: 'Orange', hex: '#FFA500', pantone: '1585C' },
  { id: 'yellow', name: 'Yellow', hex: '#FFFF00', pantone: 'Yellow C' },
  { id: 'lime', name: 'Lime', hex: '#32CD32', pantone: '375C' },
  { id: 'aqua', name: 'Aqua', hex: '#00FFFF', pantone: '3125C' },
  { id: 'violet', name: 'Violet', hex: '#8B00FF', pantone: 'Violet C' },
  { id: 'maroon', name: 'Maroon', hex: '#800000', pantone: '7421C' }
] as const

// Organized color categories for better UI
export const COLOR_CATEGORIES = {
  blues: {
    name: 'Blues',
    colors: ['navy', 'ceil', 'royal', 'caribbean', 'galaxy', 'ciel', 'turquoise', 'powder', 'slate']
  },
  greens: {
    name: 'Greens',
    colors: ['surgical-green', 'hunter', 'olive', 'sage', 'mint', 'emerald', 'seafoam', 'teal']
  },
  purplesPinks: {
    name: 'Purples & Pinks',
    colors: ['wine', 'burgundy', 'plum', 'eggplant', 'lavender', 'orchid', 'lilac', 'fuchsia', 'raspberry', 'rose', 'coral', 'peach']
  },
  neutrals: {
    name: 'Grays & Neutrals',
    colors: ['black', 'charcoal', 'pewter', 'graphite', 'steel', 'silver', 'heather', 'white']
  },
  earthTones: {
    name: 'Earth Tones',
    colors: ['sand', 'khaki', 'taupe', 'mocha', 'chocolate', 'cocoa', 'camel']
  },
  brights: {
    name: 'Bright Colors',
    colors: ['red', 'orange', 'yellow', 'lime', 'aqua', 'violet', 'maroon']
  }
} as const

// Medical clothing size categories
export const MEDICAL_SIZES = {
  unisex: ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
  women: ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  men: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
  petite: ['XSP', 'SP', 'MP', 'LP', 'XLP', '2XLP'],
  tall: ['ST', 'MT', 'LT', 'XLT', '2XLT', '3XLT']
} as const

// Fabric types for medical clothing
export const FABRIC_TYPES = [
  { value: 'cotton-100', label: '100% Cotton', description: 'Soft, breathable, natural fiber' },
  { value: 'poly-cotton-65-35', label: '65/35 Poly-Cotton Blend', description: 'Durable, wrinkle-resistant' },
  { value: 'poly-cotton-55-45', label: '55/45 Poly-Cotton Blend', description: 'Balanced comfort and durability' },
  { value: 'performance-stretch', label: 'Performance Stretch', description: '4-way stretch fabric with moisture-wicking' },
  { value: 'polyester-100', label: '100% Polyester', description: 'Easy care, color-fast' },
  { value: 'poly-rayon-spandex', label: 'Poly-Rayon-Spandex Blend', description: 'Ultra-soft with stretch' }
] as const

// Fabric weights
export const FABRIC_WEIGHTS = [
  { value: 'light', label: 'Light (4.5-5.5 oz)', ideal: 'Hot climates, long shifts' },
  { value: 'medium', label: 'Medium (5.5-6.5 oz)', ideal: 'All-season, everyday wear' },
  { value: 'heavy', label: 'Heavy (6.5-7.5 oz)', ideal: 'Durability, cooler climates' }
] as const

// Fit types
export const FIT_TYPES = [
  { value: 'classic', label: 'Classic Fit', description: 'Traditional, roomy fit' },
  { value: 'modern', label: 'Modern Fit', description: 'Contemporary, semi-fitted' },
  { value: 'athletic', label: 'Athletic Fit', description: 'Tapered, fitted through body' },
  { value: 'relaxed', label: 'Relaxed Fit', description: 'Loose, comfortable fit' },
  { value: 'slim', label: 'Slim Fit', description: 'Close-fitting, tailored' }
] as const

// Gender options
export const GENDER_OPTIONS = [
  { value: 'unisex', label: 'Unisex' },
  { value: 'women', label: 'Women\'s' },
  { value: 'men', label: 'Men\'s' }
] as const

// Product features
export const PRODUCT_FEATURES = [
  { id: 'pockets', label: 'Number of Pockets', type: 'number' },
  { id: 'loops', label: 'Has Belt Loops', type: 'boolean' },
  { id: 'vents', label: 'Has Side Vents', type: 'boolean' },
  { id: 'antimicrobial', label: 'Antimicrobial Treatment', type: 'boolean' },
  { id: 'fluid-resistant', label: 'Fluid Resistant', type: 'boolean' },
  { id: 'fade-resistant', label: 'Fade Resistant', type: 'boolean' }
] as const

// Size chart data (in inches)
export const SIZE_CHARTS = {
  unisex_tops: {
    'XXS': { chest: '30-32', length: '25' },
    'XS': { chest: '32-34', length: '26' },
    'S': { chest: '34-36', length: '27' },
    'M': { chest: '38-40', length: '28' },
    'L': { chest: '42-44', length: '29' },
    'XL': { chest: '46-48', length: '30' },
    '2XL': { chest: '50-52', length: '31' },
    '3XL': { chest: '54-56', length: '32' },
    '4XL': { chest: '58-60', length: '33' },
    '5XL': { chest: '62-64', length: '34' }
  },
  unisex_pants: {
    'XXS': { waist: '24-26', inseam: '30' },
    'XS': { waist: '26-28', inseam: '30' },
    'S': { waist: '28-30', inseam: '31' },
    'M': { waist: '32-34', inseam: '31' },
    'L': { waist: '36-38', inseam: '32' },
    'XL': { waist: '40-42', inseam: '32' },
    '2XL': { waist: '44-46', inseam: '33' },
    '3XL': { waist: '48-50', inseam: '33' },
    '4XL': { waist: '52-54', inseam: '34' },
    '5XL': { waist: '56-58', inseam: '34' }
  }
}