import React from 'react'
import { Redirect } from 'react-router-dom'
import { Panel } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { observer } from 'mobx-react'
import { InlineInput } from '../forms'
import { scroller, Element } from 'react-scroll'
import { extend } from 'lodash'
import FileDownload from 'js-file-download'
import { FormatDate } from '../formatting'
import { PanelHeadingFunctions, PanelHeadingLinkButton, PanelHeadingButton } from '../panels'
import Notify from '../../services/Notify'
import Printer from '../print/Printer'
import Helper from '../../services/Helper'
import { HelpArea, Help } from '../help'
import { BusySpinner } from '../modals';

class ItemEditorNeo extends React.Component {

  state = {
    redirectTo: null,
    collapsed: false
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
    this.props.store.Update(this.props.id, data, { extendSelected: true })
      .then(() => {
        if (this.props.onAfterUpdate)
          this.props.onAfterUpdate()
        else
          this.props.store.Load()
      })
  }
  handleRemove = () => {
    if (confirm(this.props.deleteMessage ? this.props.deleteMessage : "Delete: Are you sure?")) {
      this.props.store.Remove(this.props.id)
        .then(() => {
          if (this.props.onAfterRemove) this.props.onAfterRemove()
          this.props.store.Load()
            .then(() => {
              this.setState({ redirectTo: this.props.closeNavigateTo ? this.props.closeNavigateTo : "./" })
            })
        })
    }
  }
  handleCopy = () => {
    if (confirm("Copy: Are you sure?")) {
      this.props.store.Copy(this.props.id)
        .then((newItem) => {
          this.props.store.Load()
          if (this.props.copyNavigateTo)
            this.setState({ redirectTo: this.props.copyNavigateTo(newItem) })
        })
    }
  }
  handleDownload = () => {
    let { store, propNames } = this.props
    if (store && store.Selected)
      FileDownload(JSON.stringify(store.Selected), Helper.files.getFilename(store.Selected[propNames.title], "json"), "text/json")
    else
      Notify.info("Download not implemented for this item.")
  }
  handlePrint = () => {
    if (this.props.functions.onPrint)
      this.props.functions.onPrint() // custom
    else
      Printer.print(`itemEditor${this.props.id}`)
  }
  handleToggleCollapsed = () => {
    let { collapsible } = this.props
    if (typeof collapsible === "object") {
      // external toggle
      collapsible.onCollapseChange(collapsible.collapsed)
    } else {
      // internal toggle
      this.setState({ collapsed: !this.state.collapsed })
    }
  }

  render() {

    if (this.state.redirectTo)
      return (<Redirect to={this.state.redirectTo} />)

    let { propNames, propSizes, store, edit, collapsible } = this.props
    let collapsed = typeof collapsible === "object" ? collapsible.collapsed : this.state.collapsed
    let isLoaded = !this.props.store.IsLoading

    if (!store || (typeof propNames.title !== "function" && typeof store.Selected[propNames.title] === "undefined"))
      return (null)

    let item = this.props.store.Selected

    let functions = extend({ print: true, download: true, remove: false, copy: false, close: true }, this.props.functions)

    return (
      <Element name="itemEditor" className="item-editor" id={`itemEditor${this.props.id}`} key={this.props.id}>
        <HelpArea>
          <Panel>
            <Panel.Heading className={collapsible ? "clickable" : ""} onClick={collapsible ? this.handleToggleCollapsed : null}>
              <PanelHeadingFunctions>
                {/* <PanelHeadingButton title="Link" icon="link" />
                <PanelHeadingButton title="Edit" icon="edit" /> */}

                {functions.custom && functions.custom()}

                {functions.copy && <PanelHeadingButton title="Create Copy" icon="copy" onClick={this.handleCopy} />}
                {functions.remove && <PanelHeadingButton title="Delete" icon="trash" onClick={this.handleRemove} />}
                {functions.print && <PanelHeadingButton title="Print" icon="print" onClick={this.handlePrint} />}
                {functions.download && <PanelHeadingButton title="Download" icon="download" onClick={this.handleDownload} />}

                {functions.close && <PanelHeadingLinkButton to={this.props.closeNavigateTo ? this.props.closeNavigateTo : "./"} title="Close" icon="times" />}

                {collapsible && <PanelHeadingButton title={collapsed ? "Expand" : "Collapse"} icon={collapsed ? "plus-square" : "minus-square"} onClick={this.handleToggleCollapsed} customClass="collapsible" />}
              </PanelHeadingFunctions>
              {this.renderHeading()}
            </Panel.Heading>
            {!collapsed && <Panel.Body>
              {!isLoaded && <BusySpinner />}
              {isLoaded &&
                <div>
                  <Icon className="pull-right" size="2x" name={this.props.iconName} />
                  <h1 className="h3 item-editor__heading">
                    {store && edit ? <InlineInput value={(""+item[propNames.title]).trim() ? item[propNames.title] : "(empty)"} editProps={{ maxLength: (propSizes && propSizes.title ? propSizes.title : 255) }} change={this.handleUpdate} propName={propNames.title} /> : (typeof propNames.title === "function" ? propNames.title(item) : item[propNames.title])}
                  </h1>
                  {propNames.date && <p><FormatDate value={item[propNames.date]} /></p>}
                  <hr />
                  {this.props.children}
                </div>
              }
            </Panel.Body>}
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

export default observer(ItemEditorNeo)