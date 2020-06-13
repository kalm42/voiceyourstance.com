import React, { Component } from "react"
import { RouteComponentProps, navigate } from "@reach/router"
import { GeocodeResult } from "../../types"
import LocationDisplay from "./LocationDisplay"
import { RepresentativeContext } from "../../context/Representatives"
import ErrorMessage from "../../common/ErrorMessage"

type LocationState = {
  streetAddress: string
  city: string
  state: string
  zipCode: string
  disabled: boolean
  error: undefined | Error | PositionError
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
      error: undefined,
    }
    this.controller = new AbortController()
  }

  componentWillUnmount() {
    this.controller.abort()
  }

  reverseGeocode = (position: Position) => {
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
          this.setState({ error: new Error(results.status) })
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

  handlePositionError: PositionErrorCallback = (error: PositionError) => {
    this.handleError(error)
  }

  handleError = (error: Error | PositionError) => {
    this.setState({ error })
  }

  getGeoLocation = () => {
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

    const { streetAddress, city, state, zipCode } = this.state

    if (!streetAddress.length || !city.length || !state.length || !zipCode.length) {
      this.handleError(new Error("You must have a complete address."))
    }

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
  }

  checkForError = () => {
    if (this.props.location?.search) {
      const { search } = this.props.location
      const urlParams = new URLSearchParams(search)
      const errorMessage = urlParams.get("error")
      if (errorMessage && errorMessage.length) {
        this.setState({ error: new Error(decodeURIComponent(errorMessage)) })
      }
    }
  }

  render() {
    if (!this.state.error) {
      this.checkForError()
    }

    return (
      <div>
        <ErrorMessage error={this.state.error} />
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
      </div>
    )
  }
}
Location.contextType = RepresentativeContext

export default Location
