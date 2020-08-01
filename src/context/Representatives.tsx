import React, { useState, useEffect } from "react"
import {
  Address,
  CivicInfo,
  RepresentativesGroupedByDivision,
  Representative,
  DivisionWithRepresentatives,
} from "../types"

const LOCAL_STORAGE_KEY = "vys-representatives"

interface RepresentativeContextInterface {
  civicInfo: CivicInfo | null
  fetchRepresentativesByAddress: (address: Address) => Promise<Response>
  getRepresentatives: () => Representative[]
  getRepresentativeById: (id: number) => Representative | null
  getRepresentativesGroupedByDivision: () => RepresentativesGroupedByDivision
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

  const fetchRepresentativesByAddress = (address: Address) => {
    const addr = encodeURIComponent(addressToString(address))
    const key = process.env.GATSBY_GOOGLE_API_KEY_CIVIC
    const url = `https://www.googleapis.com/civicinfo/v2/representatives?key=${key}&address=${addr}`

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error.message)
        }
        const sData = JSON.stringify(data)
        localStorage.setItem(LOCAL_STORAGE_KEY, sData)
        setCivicInfo(data)
        return data
      })
  }

  const getRepresentativesGroupedByDivision = () => {
    const rgbd: RepresentativesGroupedByDivision = []
    if (!civicInfo) return rgbd

    for (const divisionId in civicInfo.divisions) {
      if (civicInfo.divisions.hasOwnProperty(divisionId)) {
        const division = civicInfo.divisions[divisionId]
        const reps: Representative[] = []

        if (division.officeIndices) {
          division.officeIndices.forEach(officeIndex => {
            const office = civicInfo.offices[officeIndex]
            const title = office.name

            for (const index of office.officialIndices) {
              const official = civicInfo.officials[index]
              reps.push({ ...official, title, index })
            }
          })

          const department: DivisionWithRepresentatives = {
            id: divisionId,
            name: division.name,
            reps,
          }
          rgbd.push(department)
        }
      }
    }

    return rgbd
  }

  const getRepresentatives = () => {
    return civicInfo ? civicInfo.officials : ([] as Representative[])
  }

  const getRepresentativeById = (id: number) => {
    // Add their title, aka the related office name
    const reps: Representative[] = []
    if (!civicInfo) return null

    for (const office of civicInfo.offices) {
      const title = office.name

      for (const index of office.officialIndices) {
        const official = civicInfo.officials[index]
        reps.push({ ...official, title, index: id })
      }
    }

    return reps[id]
  }

  return (
    <RepresentativeContext.Provider
      value={{
        civicInfo,
        fetchRepresentativesByAddress,
        getRepresentativesGroupedByDivision,
        getRepresentatives,
        getRepresentativeById,
      }}
      {...props}
    />
  )
}

const useRepresentatives = () => React.useContext(RepresentativeContext)

export { RepresentativeProvider, RepresentativeContext, useRepresentatives }
