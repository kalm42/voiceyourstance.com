import React, { useEffect, useRef, useState, useCallback } from "react"
import styled from "styled-components"
import { navigate } from "gatsby"
import { GeocodeResult } from "../types"
import { useRepresentatives } from "../context/Representatives"
import ErrorMessage from "../components/ErrorMessage"
import ErrorReportingBoundry from "../components/ErrorReportingBoundry"
import { useMetaData } from "../context/MetaData"
import { Form, Input, PrimaryInputSubmit, SecondaryButton } from "../components/elements"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { useLocation } from "@reach/router"

const PageContent = styled.div`
  max-width: 800px;
  width: 67vw;
  margin: 0 auto;
  padding-bottom: 2rem;
`

type AcceptableErrors = Error | PositionError

const IndexPage = () => {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [streetAddress, setStreetAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [disabled, setDisabled] = useState(false)
  const [error, setError] = useState<AcceptableErrors | undefined>(undefined)
  const reps = useRepresentatives()
  const MetaData = useMetaData()
  const location = useLocation()

  /**
   * set the title
   */
  useEffect(() => {
    if (MetaData && MetaData.safeSetTitle) {
      MetaData.safeSetTitle("Find my representatives")
    }
  }, [])

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
    const googleKey = process.env.GATSBY_GOOGLE_API_KEY
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
      .then(response => response.json())
      .then(results => {
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
        position => {
          window.clearTimeout(timerId)
          resolve(position)
        },
        error => {
          window.clearTimeout(timerId)
          reject(error)
        },
      )
    })
      .then(pos => {
        reverseGeocode(pos as Position)
      })
      .catch(error => handleError(error))
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
      .fetchRepresentativesByAddress(address)
      .then(() => {
        navigate("/reps")
      })
      .catch((error: Error) => handleError(error))
  }

  /**
   * Check for an error query param. Other pages are set to push to this page with an error message in the query param.
   */
  const checkForError = useCallback(() => {
    const queryParams = new URLSearchParams(location.search)
    const errorMessage = queryParams.get("error")
    if (errorMessage && errorMessage.length) {
      setError(new Error(decodeURIComponent(errorMessage as string)))
    }
  }, [])

  useEffect(() => {
    checkForError()
  }, [checkForError])

  return (
    <Layout>
      <SEO
        description="Enter your registered voting address to find out who your representatives are."
        title="Find out who your representatives are | Voice Your Stance"
      />
      <ErrorReportingBoundry>
        <ErrorMessage error={error} />
        <PageContent>
          <p>What is your voter registration address?</p>
          <SecondaryButton onClick={getGeoLocation} id="browser-geolocation">
            Use my current location
          </SecondaryButton>
          <Form method="post" onSubmit={handleSubmit}>
            <Input
              type="text"
              name="streetAddress"
              id="street-address"
              placeholder="1600 Pennsylvania Ave"
              aria-label="Street address"
              value={streetAddress}
              onChange={handleChange}
              disabled={disabled}
            />
            <Input
              type="text"
              name="city"
              id="city"
              placeholder="Washington"
              aria-label="City"
              value={city}
              onChange={handleChange}
              disabled={disabled}
            />
            <Input
              type="text"
              name="state"
              id="state"
              placeholder="DC"
              aria-label="State"
              value={state}
              onChange={handleChange}
              disabled={disabled}
            />
            <Input
              type="text"
              name="zipCode"
              id="zipcode"
              placeholder="20003"
              aria-label="Zip code"
              value={zipCode}
              onChange={handleChange}
              disabled={disabled}
            />
            <PrimaryInputSubmit type="submit" value="Find my representatives" />
          </Form>
        </PageContent>
      </ErrorReportingBoundry>
    </Layout>
  )
}

export default IndexPage
