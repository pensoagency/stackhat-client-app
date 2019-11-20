import React from 'react'
import { observer } from 'mobx-react'
import { sortBy } from 'lodash'
import { InlineTagsInput } from '.'

class InlineMultiOrganisationUnitPicker extends React.Component {

  render() {
    let { store, editable } = this.props

    return <InlineTagsInput
      icon="building"
      value={sortBy(store.SelectedRoleOrganisationUnits, (o) => o.Name)}

      editConfig={editable ? {
        apiSet: "OrganisationUnits",
        idKey: "OrganisationUnitID",
        searchKey: "Code_Name", labelKey: (item) => `${item.Code} - ${item.Name}`,
        selectedLabelResolver: (item) => `${FormatForCode.TrimCode(item.Code)} - ${item.Name}`,
        onAddTag: (adding) => {
          return store.AddAOUToSelected(adding.OrganisationUnitID)
        },
        onRemoveTag: (removing) => {
          store.RemoveAOUFromSelected(removing.OrganisationUnitID)
        }
      } : null}

      textResolver={(tag) => tag.Name}
      titleResolver={(tag) => `AOU: ${tag.Code}`}
      idKey={"OrganisationUnitID"}
      change={() => { }}
      propName="NA"
      emptyText={`No AOUs defined.${editable ? " Click to edit." : ""}`}
    />
  }
}

export default observer(InlineMultiOrganisationUnitPicker)