import USCities from "./USCities.json"

interface USCity {
  zip_code: number
  latitude: number
  longitude: number
  city: string
  state: string
  county: string
}
type Cities = USCity[]

export default function matchCity(zip: string) {
  const uscities: Cities = (USCities as unknown) as Cities
  for (const city of uscities) {
    if (zip === city.zip_code.toString()) {
      return city
    }
  }
  return undefined
}
