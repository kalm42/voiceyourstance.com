import React from "react"

interface RepresentativeContextInterface {
  representatives: Representative[] | []
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

interface Address {
  locationName?: string
  line1: string
  line2?: string
  line3?: string
  city: string
  state: string
  zip: string
}

interface Props {}

const RepresentativeContext = React.createContext<RepresentativeContextInterface | null>(null)

function RepresentativeProvider(props: Props) {
  const reps = {
    representatives: [],
  }

  return <RepresentativeContext.Provider value={reps} {...props} />
}

const useRepresentative = () => React.useContext(RepresentativeContext)

export { RepresentativeProvider, useRepresentative }
