import React from 'react'
import { NavLink } from 'react-router-dom'
import { Grid, Row, Col } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import MobxReactForm from 'mobx-react-form'
import AuditForm from './AuditForm'
import { ItemCreatorFields } from '../../components/lists'

class Audit extends React.Component {

  componentDidMount() {
    this.auditForm = new AuditForm(this.handleSuccess)
    this.form = new MobxReactForm(this.auditForm.fieldInfo, this.auditForm.formInfo)
  }

  handleSuccess(data) {

  }

  render() {
    if (!this.form)
      return null

    return <Grid>

      <ItemCreatorFields form={this.form} fields={this.auditForm.fieldInfo.fields} />

    </Grid>

  }

}

export default observer(Audit)
