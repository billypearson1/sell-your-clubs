import type { Club, ClubType, ConditionTier } from './types'

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

export const loftOptions = [
  '7°', '8°', '9°', '10°', '11°', '12°', '13°', '14°',
  '15°', '16°', '17°', '18°', '19°', '20°', '21°', '22°',
  '23°', '24°', '25°', '26°', '27°', '28°', '29°', '30°',
]

export const shaftFlexOptions = ['Regular', 'Stiff', 'X-Stiff', 'Light-Senior', 'Ladies'] as const
export const dexterityOptions = ['Right', 'Left'] as const
export const lengthOptions = ['Standard', 'Long'] as const
export const shaftMaterialOptions = ['Steel', 'Graphite'] as const

const MARGIN = 0.55
const CONDITION_MULTIPLIERS: Record<ConditionTier, number> = {
  new: 1.00,
  excellent: 1.0,
  fair: 0.90,
}

export function getConditionPrice(club: Club, condition: ConditionTier) {
  return Math.round(club.price_avg * MARGIN * CONDITION_MULTIPLIERS[condition] * 100) / 100
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
        { name: 'loft', label: 'Loft', options: loftOptions },
        { name: 'shaft_flex', label: 'Shaft flex', options: shaftFlexOptions },
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
        { name: 'loft', label: 'Loft', options: loftOptions },
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
