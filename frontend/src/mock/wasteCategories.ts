import type { WasteCategory } from '../types';

export const wasteCategories: WasteCategory[] = [
  {
    id: 'wc-1',
    name: 'E-Waste',
    slug: 'e-waste',
    icon: 'Monitor',
    description: 'Electronic waste including old computers, phones, TVs, and other electronic devices that contain hazardous materials.',
    color: '#059669',
    examples: ['Old laptops', 'Mobile phones', 'Televisions', 'Printers', 'Computer peripherals'],
  },
  {
    id: 'wc-2',
    name: 'Battery',
    slug: 'battery',
    icon: 'Battery',
    description: 'All types of batteries including lithium-ion, alkaline, lead-acid, and rechargeable batteries.',
    color: '#d97706',
    examples: ['Car batteries', 'Phone batteries', 'AA/AAA batteries', 'Laptop batteries', 'UPS batteries'],
  },
  {
    id: 'wc-3',
    name: 'Plastic',
    slug: 'plastic',
    icon: 'Package',
    description: 'Recyclable plastic waste including bottles, containers, packaging materials, and plastic bags.',
    color: '#2563eb',
    examples: ['PET bottles', 'HDPE containers', 'Plastic bags', 'Food packaging', 'Plastic furniture'],
  },
  {
    id: 'wc-4',
    name: 'Electronics',
    slug: 'electronics',
    icon: 'Cpu',
    description: 'Working or non-working electronic components, circuit boards, and small appliances.',
    color: '#7c3aed',
    examples: ['Circuit boards', 'Hard drives', 'Power supplies', 'Cables', 'Small appliances'],
  },
  {
    id: 'wc-5',
    name: 'Other',
    slug: 'other',
    icon: 'Recycle',
    description: 'Other recyclable waste including paper, glass, metal, textiles, and organic waste.',
    color: '#64748b',
    examples: ['Paper', 'Glass bottles', 'Metal cans', 'Old clothes', 'Organic waste'],
  },
];
