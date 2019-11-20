import React from 'react'
import { sortBy } from 'lodash'
import { inject } from 'mobx-react'
import { InlineTagsInput } from './'

class InlineForInput extends React.Component {

  render() {
    let { props } = this

    return (
      <InlineTagsInput
        icon="folder"
        value={sortBy(props.items, (o) => o.Name ? o.Name : (o.Classification ? o.Classification.Name : "Unknown"))}

        editConfig={props.editable ? {
          apiSet: "FORs",
          idKey: "ClassificationID",
          searchKey: "Code_Name", labelKey: (item) => `${item.Code} - ${item.Name}`,
          searchLimit: 9999,
          minLength: 3,
          selectedLabelResolver: (item) => `${FormatForCode.TrimCode(item.Code)} - ${item.Name}`,
          onAddTag: (adding) => {
            return props.store.AddFor(props.id, adding.ClassificationID, adding)
              .then(record => {
                if (props.onAfterUpdate) setTimeout(props.onAfterUpdate, 0)
                return record
              })
          },
          onRemoveTag: (removing) => {
            return props.store.RemoveFor(removing[props.linkIdName])
              .then(record => {
                if (this.props.onAfterUpdate) setTimeout(props.onAfterUpdate, 0)
                return record                
              })
          },
          onValidateRemoveTag: (removing) => {
            return this.props.Authentication.IsUser(removing.UserID)
          }
        } : null}

        textResolver={(tag) => tag.Name ? tag.Name : (tag.Classification ? tag.Classification.Name : "Unknown")}
        titleResolver={(tag) => `FOR: ${tag.Code ? tag.Code : (tag.Classification ? tag.Classification.Code : "Unknown")}`}
        idKey={props.linkIdName}
        change={() => { }}
        propName="NA"
        emptyText={`No FoRs defined.${props.editable ? " Click to edit." : ""}`}
      />)

  }
}

export default inject("Authentication")(InlineForInput)