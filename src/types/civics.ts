import { Address } from "./address"

/**
 * JSON returned from Google Civic API
 */
export interface CivicInfo {
  kind: string
  normalizedInput: Address
  divisions: Divisions
  offices: Office[]
  officials: Representative[]
}

export interface Divisions {
  [x: string]: Division
}

export interface Division {
  name: string
  officeIndices: number[]
}

export interface Office {
  name: string
  divisionId: string
  levels: string[]
  roles: string[]
  sources: OfficeSource[]
  officialIndices: number[]
}

export interface OfficeSource {
  name: string
  official: boolean
}

export interface Representative {
  name: string
  address: Address[]
  party: string
  phones: string[]
  urls: string[]
  photoUrl: string
  emails: string[]
  channels: SocialMediaChannel[]
  title?: string // office name sometimes attached to the object
  index?: number // the index position of the rep in civic info json
}

export interface SocialMediaChannel {
  type: string
  id: string
}

export interface DivisionWithRepresentatives {
  id: string
  name: string
  reps: Representative[]
}

export type RepresentativesGroupedByDivision = DivisionWithRepresentatives[]
