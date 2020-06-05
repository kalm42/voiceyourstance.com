import React, { Component } from "react"
import { RouteComponentProps } from "@reach/router"
import { GeocodeResult } from "../../types"
import LocationDisplay from "./LocationDisplay"

type LocationState = {
  streetAddress: string
  city: string
  state: string
  zipCode: string
  disabled: boolean
}

export class Location extends Component<RouteComponentProps, LocationState> {
  controller: AbortController

  constructor(props: RouteComponentProps) {
    super(props)
    this.state = {
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      disabled: false,
    }
    this.controller = new AbortController()
  }

  componentWillUnmount() {
    this.controller.abort()
  }

  reverseGeocode: PositionCallback = (position: Position) => {
    const cordinates = position.coords
    const googleKey = process.env.REACT_APP_GOOGLE_API_KEY
    const latlng = `latlng=${cordinates.latitude},${cordinates.longitude}`
    const key = `key=${googleKey}`
    const url = encodeURI(`https://maps.googleapis.com/maps/api/geocode/json?${latlng}&${key}`)
    const { signal } = this.controller

    this.setState({ disabled: true })
    fetch(url, { signal })
      .then((response) => response.json())
      .then((results) => {
        this.setState({ disabled: false })
        if (results?.status === "OK") {
          const result = results.results[0]
          return result
        } else {
          throw new Error(results.status)
        }
      })
      .then(this.massageResult)
      .catch(this.handleError)
  }

  massageResult = (address: GeocodeResult) => {
    let streetNumber = ""
    let route = ""
    let city = ""
    let state = ""
    let zipCode = ""

    for (const adrComp of address.address_components) {
      const { types } = adrComp
      for (const type of types) {
        switch (type) {
          case "street_number":
            streetNumber = adrComp.long_name
            break
          case "route":
            route = adrComp.long_name
            break
          case "locality":
            city = adrComp.long_name
            break
          case "administrative_area_level_1":
            state = adrComp.short_name
            break
          case "postal_code":
            zipCode = adrComp.long_name
            break
          default:
            break
        }
      }
    }

    this.setState({
      streetAddress: `${streetNumber} ${route}`,
      city,
      state,
      zipCode,
    })
  }

  handleError: PositionErrorCallback = (error) => {
    // TODO: Report error or do something.
    console.log(error)
  }

  getGeoLocation = () => {
    navigator.geolocation.getCurrentPosition(this.reverseGeocode, this.handleError)
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = ({ [event.target.name]: event.target.value } as unknown) as LocationState

    this.setState(name)
  }

  render() {
    return (
      <LocationDisplay
        streetAddress={this.state.streetAddress}
        city={this.state.city}
        state={this.state.state}
        zipCode={this.state.zipCode}
        getGeoLocation={this.getGeoLocation}
        handleChange={this.handleChange}
        disabled={this.state.disabled}
      />
    )
  }
}

export default Location
