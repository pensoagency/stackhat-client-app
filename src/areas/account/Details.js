import React from 'react'
import { Panel, Grid, Row, Col } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import { debounce } from 'lodash'
import MobxReactForm from 'mobx-react-form'
import { Input, TextArea, DatePicker, TagsInput, IndustryOrganisationPicker } from '../../components/forms'
import DetailsForm from './details/DetailsForm'
import Api from '../../services/Api'

class Details extends React.Component {

  componentWillMount() {
    Api.AppUsers.get(this.props.Authentication.Principal.userId)
      .then((response) => {
        let item = response
        for (let prop in response) {
          if (item.hasOwnProperty(prop)) {
            if (this.detailsForm.has(prop) && item[prop] != null) {
              this.detailsForm.$(prop).value = item[prop]
            }
          }
        }
      })

    Api.UserClassifications.query({}, { UserID: this.props.Authentication.Principal.userId })
      .then((response) => {
        let tags = []
        _.each(response, (tag) => {
          tags.push(tag.Classification)
        })
        this.detailsForm.$("Classification").value = tags
      })

    Api.UserTags.query({}, { UserID: this.props.Authentication.Principal.userId })
      .then((response) => {
        let tags = []
        _.each(response, (tag) => {
          tags.push(tag.Tag)
        })
        this.detailsForm.$("Tag").value = tags
      })

    const textFieldHandlers = {
      onChange: (field) => (e) => {
        field.set(e.target.value);
        this.debouncedSave(field)
      },
    }

    const handlers = {
      "FirstName": textFieldHandlers,
      "LastName": textFieldHandlers,
      "Position": textFieldHandlers,
      "PhoneMobile": textFieldHandlers,
      "Email": textFieldHandlers,
      "EmploymentHistory": textFieldHandlers,
      "Qualifications": textFieldHandlers,
      "PreviousResearchExperienceContributions": textFieldHandlers
    }

    DetailsForm.handlers = handlers

    this.detailsForm = new MobxReactForm(DetailsForm, { plugins: DetailsForm.plugins })
  }

  debouncedSave = debounce((field) => {
    this.save(field)
  }, 300)
  save(field) {
    Api.AppUsers.update({ [field.name]: field.value }, this.props.Authentication.Principal.userId)
  }

  handleAddTag = (field, tag) => {
    var store = this.props[`User${field.name}Store`]
    store.Add({
      [`${field.name}ID`]: tag[`${field.extra.idKey}`],
      UserID: this.props.Authentication.Principal.userId
    }).then(() => {
      if (field.name === "Classification")
        Api.CalculateUserIndustryOrganisations()
    })
  }
  handleRemoveTag = (field, tag) => {
    let store = this.props[`User${field.name}Store`]
    let op, param
    if (tag[`User${field.name}ID`]) {
      param = tag[`User${field.name}ID`]
      op = store.Remove
    } else {
      param = tag[field.extra.idKey]
      op = store[`RemoveBy${field.name}ID`]
    }
    op(param)
      .then(() => {
        // run recalculate for classification change
        if (field.name === "Classification")
          Api.CalculateUserIndustryOrganisations()
      })

  }

  render() {

    var df = this.detailsForm

    return (

      <Grid fluid>
        <Row className="show-grid">
          <Col md={12}>
            <form onSubmit={this.detailsForm.onSubmit}>
              <Panel>
                <Panel.Heading>Personal Details</Panel.Heading>
                <Panel.Body>
                  <Row>
                    <Col md={4}>{this.renderField(df, "FirstName")}</Col>
                    <Col md={4}>{this.renderField(df, "LastName")}</Col>
                    <Col md={4}>{this.renderField(df, "Position")}</Col>
                  </Row>
                  <Row>
                    <Col md={8}>{this.renderField(df, "Email")}</Col>
                    <Col md={4}>{this.renderField(df, "PhoneMobile")}</Col>
                  </Row>
                </Panel.Body>
              </Panel>
              <Panel>
                <Panel.Heading>Experience &amp; Qualifications</Panel.Heading>
                <Panel.Body>
                  {this.renderField(df, "EmploymentHistory")}
                  {this.renderField(df, "Qualifications")}
                  {this.renderField(df, "PreviousResearchExperienceContributions")}
                </Panel.Body>
              </Panel>
              <Panel>
                <Panel.Heading>Research Areas of Interest</Panel.Heading>
                <Panel.Body>
                  {this.renderField(df, "Classification")}
                </Panel.Body>
              </Panel>
              <Panel>
                <Panel.Heading>Research Keywords</Panel.Heading>
                <Panel.Body>
                  {this.renderField(df, "Tag")}
                </Panel.Body>
              </Panel>
            </form>
          </Col>
        </Row>
      </Grid>
    )
  }

  renderField(form, fieldName) {
    var field = form.$(fieldName)

    switch (field.type) {
      case "datepicker":
        return (<DatePicker key={field.name} field={field} />)
      case "indorganisationpicker":
        return (<IndustryOrganisationPicker key={field.name} field={field} />)
      case "tagsinput":
        return (<TagsInput key={field.name} field={field} {...field.extra} onAddTag={this.handleAddTag} onRemoveTag={this.handleRemoveTag} />)
      case "textarea":
        return (<TextArea key={field.name} field={field} />)
      default:
        return (<Input key={field.name} field={field} />)
    }
  }
}

export default inject("AppUserStore", "UserClassificationStore", "UserTagStore", "ResourceStore", "Authentication")(observer(Details))