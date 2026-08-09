import apiClient from './client';
import type { WasteCategory } from '../types';

const ICON_MAP: Record<string, string> = {
  'E-Waste': 'Monitor',
  'Battery': 'Battery',
  'Plastic': 'Package',
  'Paper': 'FileText',
  'Glass': 'Wine',
  'Metal': 'Shield',
  'Electronics': 'Cpu',
  'Organic': 'Leaf',
};

const COLOR_MAP: Record<string, string> = {
  'E-Waste': '#059669',
  'Battery': '#d97706',
  'Plastic': '#2563eb',
  'Paper': '#ea580c',
  'Glass': '#0891b2',
  'Metal': '#475569',
  'Electronics': '#7c3aed',
  'Organic': '#16a34a',
};

export function mapWasteCategory(raw: any): WasteCategory {
  const name = raw.name || 'Category';
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const icon = ICON_MAP[name] || 'Recycle';
  const color = COLOR_MAP[name] || '#059669';

  return {
    id: String(raw.id),
    name,
    slug,
    icon,
    description: raw.description || 'EcoDrop accepted waste category',
    color,
    examples: raw.disposal_instructions
      ? [raw.disposal_instructions]
      : ['Sort and clean before drop-off'],
  };
}

export const wasteApi = {
  async getCategories(): Promise<WasteCategory[]> {
    const { data } = await apiClient.get<any[]>('/waste-categories');
    return data.map(mapWasteCategory);
  },

  async getCategoryById(id: string): Promise<WasteCategory> {
    const { data } = await apiClient.get<any>(`/waste-categories/${id}`);
    return mapWasteCategory(data);
  },
};
