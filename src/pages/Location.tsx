import React, { Component } from "react"
import { RouteComponentProps } from "@reach/router"
import { GeocodeResult } from "../types"

type LocationState = {
  streetAddress: string
  city: string
  state: string
  zipCode: string
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
    console.log(url)
    const { signal } = this.controller

    fetch(url, { signal })
      .then((response) => response.json())
      .then((results) => {
        debugger
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
    const name = { [event.target.name]: event.target.value } as LocationState

    this.setState(name)
  }

  render() {
    return (
      <div>
        <p>What is your voter registration address?</p>
        <button onClick={this.getGeoLocation}>Use my current location</button>
        <form method="post">
          <input
            type="text"
            name="streetAddress"
            id="street-address"
            placeholder="1600 Pennsylvania Ave"
            aria-label="Street address"
            value={this.state.streetAddress}
            onChange={this.handleChange}
          />
          <input
            type="text"
            name="city"
            id="city"
            placeholder="Washington"
            aria-label="City"
            value={this.state.city}
            onChange={this.handleChange}
          />
          <input
            type="text"
            name="state"
            id="state"
            placeholder="DC"
            aria-label="State"
            value={this.state.state}
            onChange={this.handleChange}
          />
          <input
            type="text"
            name="zipCode"
            id="zipcode"
            placeholder="20003"
            aria-label="Zip code"
            value={this.state.zipCode}
            onChange={this.handleChange}
          />
          <input type="submit" value="Find my representatives" />
        </form>
      </div>
    )
  }
}

export default Location
