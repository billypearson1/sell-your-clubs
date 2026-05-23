export type ClubType =
  | 'driver'
  | 'fairway_wood'
  | 'hybrid'
  | 'iron_set'
  | 'iron_individual'
  | 'wedge'
  | 'putter'
  | 'complete_bag'

export type ConditionTier = 'new' | 'excellent' | 'fair'

export interface Club {
  id: number
  brand: string
  model: string
  club_type: ClubType
  price_avg: number
  created_at: string | null
  updated_at: string | null
}

export interface QuoteSpec {
  dexterity?: 'Right' | 'Left'
  loft?: string
  shaft_flex?: 'Regular' | 'Stiff' | 'X-Stiff' | 'Light-Senior' | 'Ladies'
  headcover?: 'Yes' | 'No'
  shaft_material?: 'Steel' | 'Graphite'
  length?: 'Standard' | 'Long'
}

export interface QuoteItem {
  id: string
  clubId: number
  title: string
  type: ClubType
  specs: QuoteSpec
  condition: ConditionTier
  price: number
}

export interface OrderPayload {
  full_name: string
  email: string
  phone: string
  address_line1: string
  address_line2: string
  town: string
  county: string
  postcode: string
  paypal_email: string
  items: QuoteItem[]
  total_amount: number
}

export interface OrderRow {
  id: string
  full_name: string
  email: string
  phone: string
  address_line1: string
  address_line2: string
  town: string
  county: string
  postcode: string
  paypal_email: string
  items: QuoteItem[]
  total_amount: number
  status: 'pending' | 'label_sent' | 'received' | 'paid' | 'rejected'
  created_at: string
  updated_at: string
}