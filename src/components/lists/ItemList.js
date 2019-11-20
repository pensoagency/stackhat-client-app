import React from 'react'
import { Panel, FormControl, Clearfix, SplitButton, MenuItem, Button } from 'react-bootstrap'
import { debounce, filter } from 'lodash'
import Icon from 'react-fontawesome'
import { observer } from 'mobx-react'
import { Link, withRouter } from 'react-router-dom'
import { Element as ScrollElement } from 'react-scroll'
import { Paginator, PanelLink } from '../navigation'
import { FormatDate } from '../formatting'
import { HelpArea, Help } from '../help'
import { PanelHeadingFunctions, PanelHeadingButton } from '../panels';
import { BusySpinner } from '../modals';
import { ErrorBoundary } from '../errors';

class ItemList extends React.Component {

  state = {
    collapsed: false
  }

  componentDidMount() {
    this.initFilters()
    this.search()
  }

  debouncedSearch = debounce(() => {
    this.search()
  }, 300)

  search() {
    // default first search order
    if (!this.props.store.Query.api_order && this.props.sortByOptions && this.props.sortByOptions.length)
      this.props.store.ExtendQuery({ api_order: this.props.sortByOptions[0].Key })

    this.props.store.Load()
      .then(() => {
        if (this.props.onAfterLoad) {
          this.props.onAfterLoad()
        }
      })
  }
  initFilters() {
    if (this.props.filters)
      this.props.filters.map((f) => {
        if (typeof f.OnInit !== 'undefined')
          f.OnInit(this.props.store, f)
      })
  }

  handleSearchChange = (event) => {
    if (this.props.onSearchChanged) {
      this.props.onSearchChanged(event.target.value)
    } else {
      this.props.store.ExtendQuery({ [this.props.searchKey]: event.target.value })
      this.debouncedSearch()
    }
  }
  handleSortBySelect = (key) => {
    this.props.store.ExtendQuery({ api_order: key })
    this.search()
  }
  handleFilterSelect = (key, filter) => {
    filter.Values.map((f) => {
      f.Selected = f.Value === key
    })
    filter.OnChange(key, this.props.store)
  }
  handleClearSearch = () => {
    if (this.props.onSearchChanged) {
      this.props.onSearchChanged("")
    } else {
      this.props.store.ExtendQuery({ [this.props.searchKey]: "" })
      this.search()
    }
  }
  handleMoreClick = () => {
    let { store } = this.props
    let newLimit = store.Query.api_limit + this.props.pagingMoreCount
    if (store.Items.length < newLimit) {
      store.ExtendQuery({ api_limit: newLimit })
      this.search()
    }
  }
  handleLessClick = () => {
    let { store } = this.props
    let newLimit = store.Query.api_limit - this.props.pagingMoreCount
    if (store.Items.length > newLimit) {
      store.ExtendQuery({ api_limit: newLimit })
      this.search()
    }
  }
  handleToggleCollapsed = (event) => {
    event.stopPropagation()
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

    let { store, customTools, helpKey, pageSizes, collapsible, prominent, busyShowTools } = this.props
    let collapsed = typeof collapsible === "object" ? collapsible.collapsed : this.state.collapsed

    let paging = this.props.paging === "more" ? "more" : "paginate"

    let isBusy = store.IsLoading && (store.Items.length === 0 || paging === "more")
    let isBusyAll = !busyShowTools && isBusy

    let addActive = this.props.match.params.id == "new"

    let newLink = this.props.newLink ? this.props.newLink : "./new"

    let searchEnabled = this.props.onSearchChanged || this.props.searchKey
    let searchValue = null
    if (searchEnabled && (this.props.getSearchValue || this.props.searchKey)) {
      searchValue = this.props.getSearchValue ? this.props.getSearchValue() : store.Query[this.props.searchKey]
    }

    let paginatorTop = this.props.paginatorTop == false ? false : true
    let paginatorBottom = this.props.paginatorBottom == false ? false : true

    if (!pageSizes)
      pageSizes = [5, 10, 20]

    return (
      <ScrollElement name={this.props.scrollToId}>
        <HelpArea>
          <Panel className={prominent ? "prominent" : ""}>
            <Panel.Heading className={collapsible ? "clickable" : ""} onClick={collapsible ? this.handleToggleCollapsed : null}>
              <PanelHeadingFunctions>
                {collapsible && <PanelHeadingButton title={collapsed ? "Expand" : "Collapse"} icon={collapsed ? "plus-square" : "minus-square"} onClick={this.handleToggleCollapsed} />}
              </PanelHeadingFunctions>
              {this.renderHeading(collapsed, isBusy)}
            </Panel.Heading>
            {!collapsed && <Panel.Body>
              {isBusyAll && <BusySpinner />}
              {!isBusyAll && <ErrorBoundary>
                <Clearfix>
                  {!customTools && <div className="panel-tools form-inline">
                    {searchEnabled && <div className="form-group">
                      {<Icon name="search" />}
                      {<FormControl placeholder={this.props.searchPlaceholder || "Search..."} value={searchValue} onChange={this.handleSearchChange} className="size-2" />}
                      {searchValue && <Button bsStyle="link" onClick={this.handleClearSearch}>View all</Button>}
                    </div>}
                    {this.renderFilters()}
                    {this.renderSortBy()}
                    {this.props.hasNew &&
                      <div className="form-group pull-right">
                        <Button componentClass={Link} bsStyle="primary" href={addActive ? "./" : newLink} to={addActive ? "./" : newLink} active={addActive}><Icon name="plus" /> {this.props.hasNew.text ? this.props.hasNew.text : 'Add New'}</Button>
                      </div>
                    }
                    {this.props.hasCustomButtons &&
                      this.props.hasCustomButtons()
                    }
                  </div>}
                  {customTools && customTools({
                    sortBy: this.renderSortBy()
                  })}
                </Clearfix>
                {isBusy && <BusySpinner />}
                {!isBusy &&
                  <div>
                    {paging === "paginate" && paginatorTop && <Paginator store={store} scrollToElementName={this.props.scrollToId} pageSizes={pageSizes} />}
                    <div className="item-list">
                      {store.IsLoading && store.Items.length === 0 ? <p className="text-center">Loading...</p> : this.renderList()}
                    </div>
                    {paging === "paginate" && paginatorBottom && <Paginator store={store} scrollToElementName={this.props.scrollToId} pageSizes={pageSizes} />}
                    {paging === "more" && <div className="item-list-more">
                      {store.Total > store.Items.length && <Button onClick={this.handleMoreClick} className="pull-right" bsSize="small">Show More</Button>}
                      {store.Items.length > this.props.pagingMoreCount && <Button onClick={this.handleLessClick} className="pull-right" bsSize="small">Show Less</Button>}
                    </div>}
                  </div>}
              </ErrorBoundary>}
            </Panel.Body>}
          </Panel>
        </HelpArea>
      </ScrollElement>
    )

  }

  renderHeading(collapsed, isBusy) {
    let { store, titleIconName, heading, helpKey } = this.props

    return (
      <div>
        {titleIconName && <Icon name={titleIconName} className="panel-heading-icon" />}
        {heading}
        {collapsed && !isBusy && store.Total > 0 && <span> <em>({store.Total})</em></span>}
        {helpKey && <Help helpKey={helpKey} />}
      </div>
    )
  }

  renderList() {
    let store = this.props.store

    // list items
    return (store.Items.length ?
      store.Items.map((item) => {
        return this.renderListItem(item)
      }) : <p className="text-center">{this.props.noItemsText ? this.props.noItemsText : "No matching items."}</p>)
  }

  renderListItem(item) {

    var idName = this.props.idName
    var to = this.props.navigateToResolver ? this.props.navigateToResolver(item) : "."
    var active = item[this.props.idName] == this.props.match.params.id
    var icon = this.props.iconResolver ? this.props.iconResolver(item) : this.props.iconName
    var organisation = item.RelatedOrganisationName ? " | " + item.RelatedOrganisationName : ""
    var title = this.props.titleResolver ? this.props.titleResolver(item) : item[this.props.titleName]

    if (this.props.renderListItemContent) {
      if (this.props.renderListUnlinked) {
        return (<div key={item[idName]} className="item-list-item">
          <Panel>
            <Panel.Body>
              {this.props.renderListItemContent(item)}
            </Panel.Body>
          </Panel>
        </div>)
      } else {
        return (
          <PanelLink key={item[idName]} to={to} active={active} className="item-list-item">
            {this.props.renderListItemContent(item)}
          </PanelLink>
        )
      }
    } else {
      return (
        <PanelLink key={item[idName]} to={to} active={active} className="item-list-item">
          <div className="pull-right">
            <Icon name={icon} size="2x" />
          </div>
          <h4 className="item-list-item__heading">{title}</h4>
          <div className="item-list-item__details">
            <div className="item-list-item__detail">
              <Icon name="calendar-alt" /> <FormatDate value={item.Modified ? item.Modified : item.Created} />
            </div>
          </div>
          {organisation}
        </PanelLink>
      )
    }

  }

  renderSortBy() {
    let { props } = this

    if (!props.sortByOptions)
      return null

    // sort by items
    let selectedSortBy = null;
    let sortByItems = props.sortByOptions.map((item) => {
      if (item.Key === props.store.Query.api_order)
        selectedSortBy = item
      return this.renderSortByItem(item, props.store.Query.api_order, this.handleSortBySelect)
    })
    if (!selectedSortBy)
      selectedSortBy = props.sortByOptions[0]

    return (<div className="form-group" title="Sort By">
      <SplitButton id="sortBy" key={selectedSortBy.Key} title={selectedSortBy.Name}>
        {sortByItems}
      </SplitButton>
    </div>)
  }

  renderSortByItem(item, sortByKey, handleSortBySelect) {
    return (
      <MenuItem key={item.Key} eventKey={item.Key} active={item.Key === sortByKey} onSelect={handleSortBySelect}>{item.Name}</MenuItem>
    )
  }

  renderFilters() {

    if (!this.props.filters)
      return (null)

    return this.props.filters.map((f, index) => {

      var selectedValue = filter(f.Values, { Selected: true })[0]

      return (<div className="form-group" key={index} title={f.Title}>
        <SplitButton id={f.Property} title={selectedValue.Label} onSelect={(key) => this.handleFilterSelect(key, f)}>
          {f.Values.map((v, index) => (
            <MenuItem key={index} eventKey={v.Value} active={v.Value === f.Value}>{v.Label}</MenuItem>
          ))}
        </SplitButton>
      </div>)

    })
  }

}

export default withRouter(observer(ItemList))
