

import React from 'react'
import { Panel, Grid, Row, Col } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import { find } from 'lodash'
import SwitchPreference from './shared/SwitchPreference'
import SelectPreference from './shared/SelectPreference'

class Preferences extends React.Component {

  state = {
    isLoading: true,
    impact_casestudy_template_options: [],
    engagement_narrative_template_options: [],
    idea_template_options: []
  }

  constructor(props) {
    super(props)

    let auth = props.Authentication

    let isOrgAdmin = auth.IsInRole("OrgAdmin")
    this.hasIndustry = auth.Settings.user.pref_industry_profiling_access && auth.Principal.license.HasIndustryProfiling // user + license level toggle    

    // set start module options
    this.start_module_options = []
    this.start_module_options.push(
      { value: "dashboard/home/", text: "Home > My Dashboard", switchKey: "pref_enable_activity_home" },
      { value: "dashboard/notes/", text: "Home > My Notes", switchKey: "pref_enable_activity_notes" },
      { value: "dashboard/resumes/", text: "Home > My Profiles", switchKey: "pref_enable_activity_resumes" },      
    )
    if (this.hasIndustry) {
      this.start_module_options.push(
        { value: "industry/dashboard/", text: "Industry Profiling > Dashboard", switchKey: "pref_enable_industry_dashboard" },
        { value: "industry/organisations/", text: "Industry Profiling > Organisations", switchKey: "pref_enable_industry_organisations" }
      )
    }    
    this.start_module_options.push(
      { value: "pathway/project-dashboard/", text: "Pathway to Impact > Project Dashboard", switchKey: "pref_enable_activity_projectdashboard" },
      { value: "pathway/engagements/", text: "Pathway to Impact > Engagements", switchKey: "pref_enable_activity_engagements" },
      { value: "pathway/impacts/", text: "Pathway to Impact > Impacts", switchKey: "pref_enable_activity_impacts" },
      { value: "pathway/projects/", text: "Pathway to Impact > Projects", switchKey: "pref_enable_activity_projects" },
      { value: "pathway/outputs/", text: "Pathway to Impact > Outputs", switchKey: "pref_enable_activity_outputs" },
      { value: "ideas", text: "Research Ideas", switchKey: "pref_enable_activity_ideas" },      
    )
    if (isOrgAdmin) this.start_module_options.push({ value: "admin", text: "Administration", switchKey: "pref_enable_activity_admindashboard" })

  }

  componentDidMount() {
    let { CaseStudyTemplateStore, NarrativeTemplateStore, ResearchIdeaTemplateStore } = this.props

    var requests = []

    requests.push(CaseStudyTemplateStore.Load())
    requests.push(NarrativeTemplateStore.Load())
    requests.push(ResearchIdeaTemplateStore.Load())

    Promise.all(requests)
      .then(() => {

        this.setState({
          impact_casestudy_template_options: [{ value: "", text: "(None selected)" }, ...CaseStudyTemplateStore.Items.map((item) => ({ value: item.CaseStudyTemplateID, text: item.PurposeOfComment.Name }))],
          engagement_narrative_template_options: [{ value: "", text: "(None selected)" }, ...NarrativeTemplateStore.Items.map((item) => ({ value: item.NarrativeTemplateID, text: item.PurposeOfComment.Name }))],
          idea_template_options: [{ value: "", text: "(None selected)" }, ...ResearchIdeaTemplateStore.Items.map((item) => ({ value: item.ResearchIdeaTemplateID, text: item.Name }))],
          isLoading: false
        })

      })

  }

  handleStartModuleChange = (key, value) => {
    let { Settings } = this.props
    let option = find(this.start_module_options, { value })
    // is the section enabled?
    if (!Settings.user[option.switchKey])
      Settings.SetUserSetting(option.switchKey, "True") // no -> enable
  }

  render() {
    if (this.state.isLoading)
      return (null)

    let sm = this.props.Settings.user.start_module

    return (

      <Grid fluid>
        <Row className="show-grid">
          <Col md={12}>
            <Panel>
              <Panel.Heading>General</Panel.Heading>
              <Panel.Body>
                <SelectPreference title="Start Module" type="user" options={this.start_module_options} settingKey="start_module" onChange={this.handleStartModuleChange} />
              </Panel.Body>
            </Panel>
            <Panel>
              <Panel.Heading>Home</Panel.Heading>
              <Panel.Body>
                <SwitchPreference title="My Dashboard" type="user" settingKey="pref_enable_activity_home" disabled={sm === "dashboard/home/"} />
                <SwitchPreference title="My Notes/Tasks" type="user" settingKey="pref_enable_activity_notes" disabled={sm === "dashboard/notes/"} />
                <SwitchPreference title="My Profiles" type="user" settingKey="pref_enable_activity_resumes" disabled={sm === "dashboard/resumes/"} />                
              </Panel.Body>
            </Panel>
            {this.hasIndustry && <Panel>
              <Panel.Heading>Industry Profiling</Panel.Heading>
              <Panel.Body>
                <SwitchPreference title="Dashboard" type="user" settingKey="pref_enable_industry_dashboard" disabled={sm === "industry/dashboard/"} />
                <SwitchPreference title="Organisations" type="user" settingKey="pref_enable_industry_organisations" disabled={sm === "industry/organisations/"} />
              </Panel.Body>
            </Panel>}
            <Panel>
              <Panel.Heading>Pathway to Impact</Panel.Heading>
              <Panel.Body>
                <Col md={6}>
                  <Row>
                    <SwitchPreference title="Project Dashboard" type="user" settingKey="pref_enable_activity_projectdashboard" disabled={sm === "pathway/project-dashboard/"} />
                    <SwitchPreference title="Engagement" type="user" settingKey="pref_enable_activity_engagements" disabled={sm === "pathway/engagements/"} />
                    <SwitchPreference title="Impact" type="user" settingKey="pref_enable_activity_impacts" disabled={sm === "pathway/impacts/"} />
                    <SwitchPreference title="Projects" type="user" settingKey="pref_enable_activity_projects" disabled={sm === "pathway/projects/"} />
                    <SwitchPreference title="Outputs" type="user" settingKey="pref_enable_activity_outputs" disabled={sm === "pathway/outputs/"} />
                  </Row>
                </Col>
                <Col md={6}>
                  <Row>
                    <SelectPreference title="Default Impact Case Study Template" type="user" options={this.state.impact_casestudy_template_options} settingKey="impact_casestudy_template" />
                    <SelectPreference title="Default Engagement Narrative Template" type="user" options={this.state.engagement_narrative_template_options} settingKey="engagement_narrative_template" />
                  </Row>
                </Col>
              </Panel.Body>
            </Panel>
            <Panel>
              <Panel.Heading>Research Ideas</Panel.Heading>
              <Panel.Body>
                <Col md={6}>
                  <Row>
                    <SwitchPreference title="Research Ideas" type="user" settingKey="pref_enable_activity_ideas" disabled={sm === "ideas"} />
                  </Row>
                </Col>
                <Col md={6}>
                  <Row>
                    <SelectPreference title="Default Research Idea Template" type="user" options={this.state.idea_template_options} settingKey="idea_template" />
                  </Row>
                </Col>
              </Panel.Body>
            </Panel>
            <Panel>
              <Panel.Heading>Administration</Panel.Heading>
              <Panel.Body>
                <SwitchPreference title="Admin Dashboard" type="user" settingKey="pref_enable_activity_admindashboard" disabled={sm === "admin"} />
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }

}

export default inject("Authentication", "Settings", "CaseStudyTemplateStore", "NarrativeTemplateStore", "ResearchIdeaTemplateStore")(observer(Preferences))