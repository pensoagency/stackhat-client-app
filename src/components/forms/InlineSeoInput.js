import React from 'react'
import { observer } from 'mobx-react'
import { sortBy } from 'lodash'
import { InlineTagsInput } from './'

export default observer(
  (props) => (
    <InlineTagsInput
      icon="project-diagram"
      value={sortBy(props.items, (o) => o.Classification.Name)}

      editConfig={props.editable ? {
        apiSet: "SEOs",
        idKey: "ClassificationID",
        searchKey: "Code_Name", labelKey: (item) => `${item.Code} - ${item.Name}`,
        selectedLabelResolver: (item) => `${FormatForCode.TrimCode(item.Code)} - ${item.Name}`,
        onAddTag: (adding) => {
          return props.store.AddSeo(props.id, adding.ClassificationID)
        },
        onRemoveTag: (removing) => {
          props.store.RemoveSeo(removing[props.linkIdName])
        }
      } : null}

      textResolver={(tag) => tag.Classification.Name}
      titleResolver={(tag) => `SEO: ${tag.Classification.Code}`}
      idKey={props.linkIdName}
      change={() => { }}
      propName="NA"
      emptyText={`No SEOs defined.${props.editable ? " Click to edit." : ""}`}
    />
  )
)