import React, { useEffect, useState } from "react"
import { RouteComponentProps } from "@reach/router"
import SEO from "../../components/SEO"
import { convertToRaw, Editor, EditorState } from "draft-js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import styled from "styled-components"
import { useMetaData } from "../../context/MetaData"
import ErrorMessage from "../../components/ErrorMessage"
import Toggle from "../../components/Toggle"
import { TextInput, PrimaryInputSubmit } from "../../components/elements"
import { useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { GQL } from "../../types"
import { navigate } from "gatsby"
import { CREATE_TEMPLATE } from "../../gql/mutations"

const Wrapper = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`
const DetailsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 1rem;
`
const FormSection = styled.section`
  display: flex;
  flex-direction: column;
`
const TagCollection = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`
const Tag = styled.li`
  background: var(--main);
  color: var(--background);
  padding-right: 1rem;
`
const RemoveButton = styled.button`
  border: none;
  color: var(--background);
  background: none;
  padding: 1rem;
  &:hover {
    color: var(--accent);
  }
`
const RemoveIcon = styled(FontAwesomeIcon)`
  height: 0.69rem !important;
  width: 0.69rem !important;
`
const EditorWrapper = styled.div`
  border: 1px solid var(--accent);
  margin: 1rem 0;
  padding: 1rem;
  font-family: var(--formalFont);
`

const CreateTemplate = (props: RouteComponentProps) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [characterCount, setCharacterCount] = useState(5000)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [title, setTitle] = useState("")
  const [nextTag, setNextTag] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [searchable, setSearchable] = useState<boolean>(false)
  const [createTemplate] = useMutation<GQL.CreateTemplateData, GQL.CreateTemplateVars>(CREATE_TEMPLATE)
  const MetaData = useMetaData()

  /**
   * set the title
   */
  // useEffect(() => {
  //   MetaData?.safeSetTitle("Write a letter")
  // }, [MetaData])

  /**
   * On state change calcuate the number of characters remaining.
   */
  useEffect(() => {
    const contentState = editorState.getCurrentContent()
    const content = convertToRaw(contentState)
    const charCount = content.blocks.reduce((acc, val) => acc + val.text.length, 0)
    setCharacterCount(5000 - charCount)
  }, [editorState])

  /**
   * Clear error after some time
   */
  useEffect(() => {
    let timeoutId: number
    if (error) {
      timeoutId = setTimeout(() => setError(undefined), 10000)
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [error])

  /**
   * Set the template title
   */
  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  /**
   * Set template tags
   */
  const handleTags = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!/^#/.test(event.target.value)) {
      // the string did not begin with a #
      setNextTag(`#${event.target.value}`)
    } else if (/\s+$/.test(event.target.value)) {
      // the string ends with one or more spaces
      const newTag = event.target.value.trim()
      if (newTag.length > 1 && !tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setNextTag("")
    } else {
      // the string does not end in a space
      setNextTag(event.target.value)
    }
  }

  /**
   * Handle searchable toggle
   */
  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchable(event.target.checked)
  }

  /**
   * Save template
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const contentState = editorState.getCurrentContent()
    const content = convertToRaw(contentState)
    createTemplate({ variables: { template: { content, isSearchable: searchable, tags, title } } })
      .then(res => {
        navigate(`/registered-letters/${res.data?.createTemplate.id}`)
      })
      .catch(err => {
        setError(err)
      })
  }

  /**
   * Remove a tag
   */
  const handleRemove = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const tagToRemove = event.currentTarget.dataset.tag
    if (tagToRemove) {
      setTags(tags.filter(tag => tag !== tagToRemove))
    }
  }

  return (
    <Wrapper>
      <SEO title="Mail a letter to your representative" description="Write and mail a letter to your representative." />
      <form method="post" onSubmit={handleSubmit}>
        {characterCount < 100 && (
          <div>
            <p>You have {characterCount} characters left. There is a 5,000 character limit.</p>
          </div>
        )}
        <ErrorMessage error={error} />
        <h2>Registered letter details</h2>
        <DetailsWrapper>
          <FormSection>
            <label htmlFor="title">Letter title</label>
            <TextInput
              type="text"
              name="title"
              id="title"
              placeholder="Letter title"
              aria-label="Letter title"
              value={title}
              onChange={handleTitle}
            />
          </FormSection>
          <FormSection>
            <label htmlFor="tags">Hashtags</label>
            <TextInput
              type="text"
              name="tags"
              id="tags"
              placeholder="#addTags #🐶😄"
              aria-describedby="tag-description"
              value={nextTag}
              onChange={handleTags}
            />
            <p id="tag-description">
              <small>Type in a tag that you want then press the space bar to add it to the list below.</small>
            </p>
          </FormSection>
          <div>
            <Toggle
              checked={searchable}
              handleCheckbox={handleCheckbox}
              toggleName="searchable"
              toggleId="searchable"
              labelText="Publicly searchable"
            />
            <p>
              <small>
                If your letter is publicly searchable then people will be able to find your letter and use it themselves
                by searching for the title or the tags you used.
              </small>
            </p>
          </div>
        </DetailsWrapper>
        <h3>Tags:</h3>
        <TagCollection>
          {tags.map((tag, index) => (
            <Tag key={index}>
              <RemoveButton onClick={handleRemove} data-tag={tag}>
                <RemoveIcon icon={faTimes} />
              </RemoveButton>
              {tag}
            </Tag>
          ))}
        </TagCollection>
        <div>
          <h2>Write your letter here</h2>
        </div>
        <EditorWrapper>
          <Editor editorState={editorState} onChange={setEditorState} />
        </EditorWrapper>
        <PrimaryInputSubmit value="Save" type="submit" />
      </form>
    </Wrapper>
  )
}

export default CreateTemplate
