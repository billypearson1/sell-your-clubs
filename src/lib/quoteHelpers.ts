import type { Club, ClubType, ConditionTier, QuoteSpec } from './types'

export const clubTypeLabels: Record<ClubType, string> = {
  driver: 'Driver',
  fairway_wood: 'Fairway Wood',
  hybrid: 'Hybrid',
  iron_set: 'Iron Set',
  iron_individual: 'Individual Iron',
  wedge: 'Wedge',
  putter: 'Putter',
  complete_bag: 'Complete Bag',
}

export const conditionDescriptions: Record<ConditionTier, string> = {
  new: 'Unused, mint condition with no signs of wear.',
  excellent: 'Lightly used, excellent appearance with minimal marks.',
  fair: 'Well-used with cosmetic wear. No dents or cracks.',
}

export const conditionLabels: Record<ConditionTier, string> = {
  new: 'New',
  excellent: 'Excellent',
  fair: 'Fair',
}



export const shaftFlexOptions = ['Regular', 'Stiff', 'X-Stiff', 'Light-Senior', 'Ladies'] as const
export const dexterityOptions = ['Right', 'Left'] as const
export const lengthOptions = ['Standard', 'Long'] as const
export const shaftMaterialOptions = ['Steel', 'Graphite'] as const

export const AFTERMARKET_SHAFTS = [
  'Fujikura Ventus Velocore Blue',
  'Fujikura Ventus Velocore Red',
  'Fujikura Ventus Velocore Black',
  'Fujikura Ventus Velocore+ Blue',
  'Fujikura Ventus Velocore+ Red',
  'Fujikura Ventus Velocore+ Black',
  'Fujikura Speeder NX Green',
  'Graphite Design Tour AD DI',
  'Graphite Design Tour AD UB',
  'Graphite Design Tour AD HD',
  'Graphite Design Tour AD IZ',
  'Graphite Design Tour AD XC',
  'Mitsubishi Diamana WB',
  'Mitsubishi Diamana RB',
  'Mitsubishi Diamana TB',
  'Mitsubishi Diamana GT',
  'Accra TZ Six',
  'Accra GX',
  'Accra TZ RPG',
  'Project X HZRDUS Smoke Green Small Batch',
]

export const AFTERMARKET_BONUS = 50

// Spec-based price adjustments
export const SPEC_ADJUSTMENTS: Partial<Record<keyof QuoteSpec, Record<string, number>>> = {
  dexterity: {
    'Right': 0,
    'Left': -21,
  },
  shaft_flex: {
    'Regular': 0,
    'Stiff': 0,
    'X-Stiff': 0,
    'Light-Senior': -34,
    'Ladies': -43,
  },
  headcover: {
    'Yes': 0,
    'No': -10,
  },
}

const CONDITION_MULTIPLIERS: Record<ConditionTier, number> = {
  new: 0.74,
  excellent: 0.68,
  fair: 0.60,
}

export function getConditionPrice(club: Club, condition: ConditionTier, specs?: QuoteSpec, aftermarket?: boolean): number {
  let price = Math.round(club.price_avg * CONDITION_MULTIPLIERS[condition] * 100) / 100

  if (specs) {
    for (const [key, adjustments] of Object.entries(SPEC_ADJUSTMENTS)) {
      const specValue = specs[key as keyof QuoteSpec]
      if (specValue && adjustments[specValue] !== undefined) {
        price += adjustments[specValue]
      }
    }
  }

  if (aftermarket) {
    price += AFTERMARKET_BONUS
  }

  return Math.max(0, Math.round(price * 100) / 100)
}

export function availableConditions(club: Club): ConditionTier[] {
  if (!club.price_avg || club.price_avg <= 0) return []
  return ['new', 'excellent', 'fair'] as ConditionTier[]
}

export function getClubFields(type: ClubType) {
  const baseFields = [{ name: 'dexterity', label: 'Dexterity', options: dexterityOptions }]
  switch (type) {
    case 'driver':
    case 'fairway_wood':
    case 'hybrid':
      return [
        ...baseFields,
    
        { name: 'shaft_flex', label: 'Shaft flex', options: shaftFlexOptions },
        { name: 'aftermarket_shaft', label: 'Aftermarket shaft', options: ['No', 'Yes (+£50)'] },
        { name: 'headcover', label: 'Headcover included', options: ['Yes', 'No'] },
      ]
    case 'iron_set':
    case 'iron_individual':
      return [
        ...baseFields,
        { name: 'shaft_flex', label: 'Shaft flex', options: shaftFlexOptions },
        { name: 'shaft_material', label: 'Shaft material', options: shaftMaterialOptions },
      ]
    case 'wedge':
      return [
        ...baseFields,
        { name: 'shaft_flex', label: 'Shaft flex', options: shaftFlexOptions },
      ]
    case 'putter':
      return [
        ...baseFields,
        { name: 'length', label: 'Length', options: lengthOptions },
      ]
    case 'complete_bag':
      return [{ name: 'conditionOnly', label: 'Condition', options: [] }]
    default:
      return baseFields
  }
}

import Fuse from 'fuse.js'
export function createClubSearch(clubs: Club[]) {
  const fuse = new Fuse(clubs, {
    keys: ['brand', 'model'],
    threshold: 0.3,
    minMatchCharLength: 1,
    ignoreLocation: true,
  })
  return (query: string) => {
    if (!query.trim()) return clubs
    return fuse.search(query).slice(0, 5).map((result) => result.item)
  }
}
