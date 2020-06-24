export enum GeocodeStatus {
  Ok = "OK",
  ZeroResults = "ZERO_RESULTS",
  OverDailyLimit = "OVER_DAILY_LIMIT",
  OverQueryLimit = "OVER_QUERY_LIMIT",
  RequestDenied = "REQUEST_DENIED",
  InvalidRequest = "INVALID_REQUEST",
  UnkownError = "UNKNOWN_ERROR",
}

export enum GeocodeLocationType {
  rooftop = "ROOFTOP",
  range_interpolated = "RANGE_INTERPOLATED",
  geometric_center = "GEOMETRIC_CENTER",
  approximate = "APPROXIMATE",
}

export enum GeocodeAddressComponentType {
  administrative_area_level_1 = "administrative_area_level_1",
  administrative_area_level_2 = "administrative_area_level_2",
  administrative_area_level_3 = "administrative_area_level_3",
  administrative_area_level_4 = "administrative_area_level_4",
  administrative_area_level_5 = "administrative_area_level_5",
  airport = "airport",
  colloquial_area = "colloquial_area",
  country = "country",
  intersection = "intersection",
  locality = "locality",
  natural_feature = "natural_feature",
  neighborhood = "neighborhood",
  park = "park",
  plus_code = "plus_code",
  point_of_interest = "point_of_interest",
  political = "political",
  postal_code = "postal_code",
  premise = "premise",
  route = "route",
  street_address = "street_address",
  street_number = "street_number",
  sublocality = "sublocality",
  sublocality_level_1 = "sublocality_level_1",
  sublocality_level_2 = "sublocality_level_2",
  sublocality_level_3 = "sublocality_level_3",
  sublocality_level_4 = "sublocality_level_4",
  sublocality_level_5 = "sublocality_level_5",
  subpremise = "subpremise",
}

export interface GeocodeResponse {
  results: GeocodeResult[]
  status: GeocodeStatus
}

export interface GeocodeAddressComponent {
  long_name: string
  short_name: string
  types: GeocodeAddressComponentType[]
}

export interface GeocodeCordinates {
  lat: number
  lng: number
}

export interface GeocodeGeometry {
  location: GeocodeCordinates
  location_type: GeocodeLocationType
  viewport: {
    northeast: GeocodeCordinates
    southwest: GeocodeCordinates
  }
}

export interface GeocodeResult {
  address_components: GeocodeAddressComponent[]
  formatted_address: string
  geometry: GeocodeGeometry
  place_id: string
  plus_code: {
    compound_code: string
    global_code: string
  }
  types: GeocodeAddressComponentType[]
}
