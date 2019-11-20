import React from 'react'
import { Redirect } from 'react-router-dom'
import { Panel, Button } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { extend } from 'lodash'
import { InlineInput } from '../forms'
import { scroller, Element } from 'react-scroll'
import FileDownload from 'js-file-download'
import { PanelHeadingFunctions, PanelHeadingLinkButton, PanelHeadingButton } from '../panels'
import Notify from '../../services/Notify'
import Printer from '../print/Printer'
import Helper from '../../services/Helper'
import { HelpArea, Help } from '../help'

class ItemEditor extends React.Component {

  state = {
    isLoading: false,
    redirectTo: null
  }

  componentDidUpdate() {
    if (this.props.enableScroller) {
      scroller.scrollTo("itemEditor", {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        offset: -50
      })
    }
  }

  handleUpdate = (data) => {
    this.setState({ isLoading: true }, () => {
      this.props.editStore.Update(this.props.editID, data)
        .then((item) => {
          extend(target, item)
          this.setState({ isLoading: false })
        })
    })
  }
  handleRemove = () => {
    if (confirm("Delete: Are you sure?")) {
      this.props.editStore.Remove(this.props.editID)
        .then(() => {
          this.setState({ redirectTo: this.props.closeNavigateTo ? this.props.closeNavigateTo : "./" })
        })
    }
  }
  handleCopy = () => {
    if (confirm("Copy: Are you sure?")) {
      this.props.store.Copy(this.props.id)
        .then(() => {
          this.props.store.Load()
        })
    }
  }
  handleDownload = () => {
    if (this.props.item && this.props.itemTitle)
      FileDownload(JSON.stringify(this.props.itemTitle), Helper.files.getFilename(this.props.itemTitle, "json"), "text/json")
    else
      Notify.info("Download not implemented for this item.")
  }

  Add = async (data) => {
    this.SetLoading(true)
    const response = await this.Api[this.apiSetName].create(data)
    this.SetLoading(false)
    return response
  }

  render() {

    if (this.state.redirectTo)
      return (<Redirect to={this.state.redirectTo} />)

    if (!this.props.itemTitle) {
      return (null)
    }

    let functions = extend({ print: true, download: true, remove: false, copy: false, close: true }, this.props.functions)

    return (
      <Element name="itemEditor" id={`itemEditor${this.props.id}`} className="item-editor">
        <HelpArea>
          <Panel>
            <Panel.Heading>
              <PanelHeadingFunctions>

                {/* <PanelHeadingButton title="Link" icon="link" /><PanelHeadingButton title="Edit" icon="edit" /> */}

                {functions.copy && <PanelHeadingButton title="Create Copy" icon="copy" onClick={this.handleCopy} />}
                {functions.remove && <PanelHeadingButton title="Delete" icon="trash" onClick={this.handleRemove} />}
                {functions.print && <PanelHeadingButton title="Print" icon="print" onClick={() => Printer.print(`itemEditor${this.props.id}`)} />}
                {functions.download && <PanelHeadingButton title="Download" icon="download" onClick={this.handleDownload} />}

                {functions.close && <PanelHeadingLinkButton to={this.props.closeNavigateTo ? this.props.closeNavigateTo : "./"} title="Close" icon="times" />}
              </PanelHeadingFunctions>
              {this.renderHeading()}
            </Panel.Heading>
            <Panel.Body>
              <Icon className="pull-right" size="2x" name={this.props.iconName} />
              <h1 className="h3 item-editor__heading">
                {this.props.editStore ?
                  <InlineInput value={this.props.itemTitle} change={(data) => this.handleUpdate(data)} propName={this.props.editPropNames.title} />
                  : this.props.itemTitle}
              </h1>
              {!this.props.leaveOpen && <hr />}

              {this.props.children}

              {this.props.isNew &&
                <div className="pull-right">
                  <Button bsStyle="success"><Icon name="plus" /> Submit</Button>
                </div>
              }
            </Panel.Body>
          </Panel>
        </HelpArea>
      </Element>
    )
  }

  renderHeading() {
    let { titleIconName, typeTitle, helpKey } = this.props
    return (
      <div>
        {titleIconName && <Icon name={titleIconName} className="panel-heading-icon" />}
        {typeTitle}
        {helpKey && <Help helpKey={helpKey} />}
      </div>
    )
  }

}

export default ItemEditor