import React, { Component } from "react"
import { RouteComponentProps, navigate } from "@reach/router"
import { GeocodeResult } from "../../types"
import LocationDisplay from "./LocationDisplay"
import { RepresentativeContext } from "../../context/Representatives"

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

  reverseGeocode = (position: Position) => {
    console.log("Received location, ", position)
    const cordinates = position.coords
    const googleKey = process.env.REACT_APP_GOOGLE_API_KEY
    const latlng = `latlng=${cordinates.latitude},${cordinates.longitude}`
    const key = `key=${googleKey}`
    const url = encodeURI(`https://maps.googleapis.com/maps/api/geocode/json?${latlng}&${key}`)
    const { signal } = this.controller

    console.log("Fetching reverse geocode")
    this.setState({ disabled: true })
    fetch(url, { signal })
      .then((response) => response.json())
      .then((results) => {
        console.log("Recevied results: ", results)
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
    console.log("Transforming result to match form: ", address)
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
    console.log("State set")
  }

  handlePositionError: PositionErrorCallback = (error: PositionError) => {
    console.log("Handle error")
    // TODO: Report error or do something.
    console.log(error)
  }

  handleError = (error: Error) => {
    console.log(error)
  }

  getGeoLocation = () => {
    console.log("Getting geolocation")

    new Promise((resolve, reject) => {
      const timerId = window.setTimeout(() => {
        const err = new Error("Browser did not return a position.")
        reject(err)
      }, 5000)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          window.clearTimeout(timerId)
          resolve(position)
        },
        (error) => {
          window.clearTimeout(timerId)
          reject(error)
        },
      )
    })
      .then((pos) => {
        this.reverseGeocode(pos as Position)
      })
      .catch((error) => this.handlePositionError(error))
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = ({ [event.target.name]: event.target.value } as unknown) as LocationState

    this.setState(name)
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // ! Validate address fields
    const { streetAddress, city, state, zipCode } = this.state
    if (!streetAddress || !city || !state || !zipCode) {
      // TODO: set error message of some kind
    }
    // ! make fetch request
    const address = {
      line1: streetAddress,
      city,
      state,
      zip: zipCode,
    }
    const reps = this.context
    reps
      .getRepresentativesByAddress(address)
      .then(() => {
        navigate("/reps")
      })
      .catch((error: Error) => this.handleError(error))
    // ! store result in local storage
    // ! change page to /reps
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
        handleSubmit={this.handleSubmit}
      />
    )
  }
}
Location.contextType = RepresentativeContext

export default Location
