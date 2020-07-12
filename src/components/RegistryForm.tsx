import React, { useState } from "react"
import { Form, TextInputs, TextInput, PrimaryInputSubmit } from "./elements"
import { RawDraftContentState } from "draft-js"
import { useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import styled from "styled-components"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { GQL } from "../types"
import ErrorMessage from "./ErrorMessage"

const CREATE_TEMPLATE = gql`
  mutation CreateTemplate($template: TemplateInput!) {
    createTemplate(template: $template) {
      id
    }
  }
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

interface Props {
  letterContent: RawDraftContentState
  close: () => void
  templateId: string | undefined
  setTemplateId: (id: string) => void
}

const RegistryForm = (props: Props) => {
  const [title, setTitle] = useState("")
  const [nextTag, setNextTag] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [error, setError] = useState<GQL.GQLError | Error | undefined>(undefined)
  const [createTemplate] = useMutation<GQL.CreateTemplateData, GQL.CreateTemplateVars>(CREATE_TEMPLATE)

  const handleAddTag = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const tagToRemove = event.currentTarget.dataset.tag
    if (tagToRemove) {
      setTags(tags.filter(tag => tag !== tagToRemove))
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title) {
      setError(new Error("You must have a title for your letter."))
      return
    }
    if (!tags.length) {
      setError(new Error("You must have tags for your letter."))
      return
    }
    if (props.letterContent.blocks.length < 2) {
      setError(new Error("You must have more than one line in your letter."))
      return
    }
    createTemplate({ variables: { template: { content: props.letterContent, tags, title } } })
      .then(response => {
        if (response.data?.createTemplate.id) {
          props.setTemplateId(response.data.createTemplate.id)
        }
        props.close()
      })
      .catch(err => setError(err))
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <ErrorMessage error={error} />
        <TextInputs>
          <TextInput
            type="text"
            name="title"
            id="title"
            placeholder="Subject"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
          <TextInput
            type="text"
            name="tags"
            id="tags"
            placeholder="#add #hashtags #🐶😄 #yesYouCanUseEmojis"
            value={nextTag}
            onChange={handleAddTag}
          />
          <PrimaryInputSubmit type="submit" value="add my letter" />
        </TextInputs>
      </Form>
      <div>
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
      </div>
    </div>
  )
}

export default RegistryForm
