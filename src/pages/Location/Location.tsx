import React, { useEffect, useRef, useState, useCallback } from "react"
import { GeocodeResult } from "../../types"
import LocationDisplay from "./LocationDisplay"
import { useRepresentatives } from "../../context/Representatives"
import ErrorMessage from "../../common/ErrorMessage"
import { useLocation, useHistory } from "react-router-dom"
import { useAnalytics } from "../../context/Analytics"

type AcceptableErrors = Error | PositionError

const Location = () => {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [streetAddress, setStreetAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [disabled, setDisabled] = useState(false)
  const [error, setError] = useState<AcceptableErrors | undefined>(undefined)
  const search = useLocation().search
  const reps = useRepresentatives()
  const history = useHistory()
  const analytics = useAnalytics()

  /**
   * If the page changes during the fetch this will abort the fetch request
   */
  useEffect(() => {
    abortControllerRef.current = new AbortController()
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  /**
   * Takes in errors and reports them to the necessary reports and then alerts the user.
   * @param error
   */
  const handleError = (error: AcceptableErrors) => {
    setError(error)
  }

  /**
   * Takes the reverse geocode result and set's it to state.
   * @param address GeocodeResult
   */
  const massageResults = (address: GeocodeResult) => {
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

    setStreetAddress(`${streetNumber} ${route}`)
    setCity(city)
    setState(state)
    setZipCode(zipCode)
  }

  /**
   * Takes the browser's coordinates and requests estimated addresses from Google
   * @param position Position
   */
  const reverseGeocode = (position: Position) => {
    const cordinates = position.coords
    const googleKey = process.env.REACT_APP_GOOGLE_API_KEY
    const latlng = `latlng=${cordinates.latitude},${cordinates.longitude}`
    const key = `key=${googleKey}`
    const url = encodeURI(`https://maps.googleapis.com/maps/api/geocode/json?${latlng}&${key}`)
    const abrt = abortControllerRef.current
    if (!abrt) {
      setError(new Error("Abort controller not set"))
      return
    }
    const { signal } = abrt

    // start fetch
    setDisabled(true)
    fetch(url, { signal })
      .then((response) => response.json())
      .then((results) => {
        setDisabled(false)
        if (results.status === "OK") {
          const result = results.results[0]
          return result
        } else {
          setError(new Error(results.status))
        }
      })
      .then(massageResults)
      .catch(handleError)
  }

  /**
   * Get the geo location from the browser. If it fails tell the user.
   */
  const getGeoLocation = () => {
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
        reverseGeocode(pos as Position)
      })
      .catch((error) => handleError(error))
  }

  /**
   * Update state for the address.
   * @param event Change Event
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
      case "streetAddress":
        setStreetAddress(event.target.value)
        break
      case "city":
        setCity(event.target.value)
        break
      case "state":
        setState(event.target.value)
        break
      case "zipCode":
        setZipCode(event.target.value)
        break
      default:
        break
    }
  }

  /**
   * Get representatives from google.
   * @param event Form Submission
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!streetAddress.length || !city.length || !state.length || !zipCode.length) {
      handleError(new Error("You must have a complete address."))
      return
    }

    const address = {
      line1: streetAddress,
      city,
      state,
      zip: zipCode,
    }
    if (!reps) {
      handleError(new Error("There has been an error. Please refresh the page."))
      return
    }
    reps
      .getRepresentativesByAddress(address)
      .then(() => {
        history.push("/reps")
      })
      .catch((error: Error) => handleError(error))
  }

  /**
   * Check for an error query param. Other pages are set to push to this page with an error message in the query param.
   */
  const checkForError = useCallback(() => {
    const urlParams = new URLSearchParams(search)
    const errorMessage = urlParams.get("error")
    if (errorMessage && errorMessage.length) {
      setError(new Error(decodeURIComponent(errorMessage)))
    }
  }, [search])

  useEffect(() => {
    checkForError()
  }, [checkForError])

  /**
   * Analytics Report Page View
   */
  useEffect(() => {
    analytics?.pageView()
  }, [analytics])

  return (
    <div>
      <ErrorMessage error={error} />
      <LocationDisplay
        streetAddress={streetAddress}
        city={city}
        state={state}
        zipCode={zipCode}
        getGeoLocation={getGeoLocation}
        handleChange={handleChange}
        disabled={disabled}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

export default Location
