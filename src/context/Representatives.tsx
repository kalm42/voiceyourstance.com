import React, { useState, useEffect } from "react"
import { Address } from "../types"

const LOCAL_STORAGE_KEY = "vys-representatives"

interface RepresentativeContextInterface {
  civicInfo: CivicInfo | null
  getRepresentativesByAddress: (address: Address) => Promise<Response>
}

interface CivicInfo {
  kind: string
  normalizedInput: Address
  divisions: {
    [x: string]: {
      name: string
      officeIndices: number[]
    }
  }
  offices: Office[]
  officials: Representative[]
}

interface Office {
  name: string
  divisionId: string
  levels: string[]
  roles: string[]
  sources: OfficeSource[]
  officialIndices: number[]
}

interface OfficeSource {
  name: string
  official: boolean
}

interface Representative {
  name: string
  address: Address[]
  party: string
  phones: string[]
  urls: string[]
  photoUrl: string
  emails: string[]
  channels: SocialMediaChannel[]
}

interface SocialMediaChannel {
  type: string
  id: string
}

function addressToString(address: Address) {
  let addr = ""

  if (address.locationName) {
    addr += `${address.locationName}, `
  }
  if (address.line1) {
    addr += `${address.line1}, `
  }
  if (address.line2) {
    addr += `${address.line2}, `
  }
  if (address.line3) {
    addr += `${address.line3}, `
  }
  if (address.city) {
    addr += `${address.city} `
  }
  if (address.state) {
    addr += `${address.state} `
  }
  if (address.zip) {
    addr += `${address.zip} `
  }

  return addr
}

interface Props {}

const RepresentativeContext = React.createContext<RepresentativeContextInterface | null>(null)

function RepresentativeProvider(props: Props) {
  const [civicInfo, setCivicInfo] = useState<CivicInfo | null>(null)

  useEffect(() => {
    if (!civicInfo) {
      const coldData = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (coldData) {
        const civic = JSON.parse(coldData)
        setCivicInfo(civic)
      }
    }
  }, [civicInfo])

  const getRepresentativesByAddress = (address: Address) => {
    const addr = encodeURIComponent(addressToString(address))
    const key = process.env.REACT_APP_GOOGLE_API_KEY_CIVIC
    const url = `https://www.googleapis.com/civicinfo/v2/representatives?key=${key}&address=${addr}`

    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error.message)
        }
        const sData = JSON.stringify(data)
        localStorage.setItem(LOCAL_STORAGE_KEY, sData)
        setCivicInfo(data)
        return data
      })
  }

  return <RepresentativeContext.Provider value={{ civicInfo, getRepresentativesByAddress }} {...props} />
}

const useRepresentatives = () => React.useContext(RepresentativeContext)

export { RepresentativeProvider, RepresentativeContext, useRepresentatives }
