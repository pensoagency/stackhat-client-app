import React from 'react'
import { InlineTagsInput } from '.'

export default
  (props) => (
    <InlineTagsInput
      icon="tag"
      value={props.items}

      editConfig={{
        apiSet: "MetricKeywords",
        idKey: "MetricKeywordID",
        labelKey: "Keyword",
        selectedLabelResolver: (item) => item.Keyword,
        onAddTag: (adding) => {
          return props.store.AddTag(props.id, adding.MetricKeywordID)
        },
        onRemoveTag: (removing) => {
          props.store.RemoveTag(removing[props.linkIdName])
        }
      }}
      textResolver={(tag) => tag.MetricKeyword.Keyword}
      idKey={props.linkIdName}
      change={() => { }}
      propName="NA"
    />
  )
