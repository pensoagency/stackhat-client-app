import React from 'react'
import { Modal, Button, Table, FormControl } from 'react-bootstrap'
import { extend, findIndex, debounce } from 'lodash'
import { observer, inject } from 'mobx-react'
import Icon from 'react-fontawesome'
import { SearcherStore } from '../../stores'
import Api from '../../services/Api'
import Helper from '../../services/Helper'
import { Paginator } from '../navigation'
import { FormatDateShort, FormatNumber, FormatCurrency } from '../formatting'

class SearcherModal extends React.Component {

  mode = "buttons"

  constructor(props) {
    super(props)

    this.searcherStore = new SearcherStore(props.Authentication)
  }

  componentDidMount() {
    this.init()
  }

  init() {

    let config = this.props.config
    let store = this.searcherStore

    // init store
    store.SetApi(config.sourceSetName, config.sourceIdName, config.list, config.listIdName)

    // init state
    store.ExtendQuery({ api_page: 1 })
    if (config.params) {
      store.ExtendQuery(config.params)
    }

    this.mode = config.mode || "buttons"

    // init filters
    let queryFields = {}
    let requests = []
    if (config.filters) {
      config.filters.map((filter) => {
        if (filter.type !== "range" && filter.type !== "bool") {

          let entityProperty = filter.entityProperty ? filter.entityProperty : filter.property
          requests.push(new Promise((resolve, reject) => {
            Api.DistinctValues({ entity: filter.entity, property: entityProperty, type: filter.type, query: "", sublength: filter.sublength })
              .then((result) => {
                // keep only single empty or null result
                if (result.length > 1 && Helper.string.isNullOrEmpty(result[0]) && Helper.string.isNullOrEmpty(result[1])) {
                  result.splice(0, 1);
                }
                filter.values = result
                if (filter.filterProperty) {
                  filter.property = filter.filterProperty // patch different filter prop to main prop value
                }
                // set default
                queryFields[filter.property] = "*"
                if (filter.default && filter.values.length > 0) {
                  // ensure default value present
                  for (let i = 0; i < filter.values.length; i++) {
                    if (("" + filter.values[i]) == ("" + filter.default)) {
                      queryFields[filter.property] = "" + filter.default // set as default                  
                      break;
                    }
                  }
                }
                resolve();
              })

          }))

        }
      })
    }
    Promise.all(requests).then(() => {
      if (config.filters) {
        config.filters.map((filter) => {
          if (filter.type === "range" || filter.type === "bool") {
            queryFields[filter.property] = "*"
            if (filter.default) {
              queryFields[filter.property] = filter.default // set as default
            }
          }

        })
      }

      store.ExtendQuery(queryFields)

      this.search()

    })
  }

  search() {

    let config = this.props.config
    let store = this.searcherStore

    let query = store.Query

    if (config.filters && config.filters.length > 0) {
      for (let i = 0; i < config.filters.length; i++) {
        let filter = config.filters[i];

        // delete any empty filter props or false bool
        if (query[filter.property] === "*") {
          delete query[filter.property]
          continue;
        }
        // range filter
        if (filter.type === "range" && query[filter.property]) {
          let r = query[filter.property].split(",")
          let min = r[0];
          let max = r[1];
          delete query[filter.property];
          if (!min && !max)
            query[filter.property + "_Null"] = ""
          else {
            if (min)
              query[filter.property + "_GreaterThanOrEqual"] = min
            if (max)
              query[filter.property + "_LessThanOrEqual"] = max
          }
          continue;
        }
        // handle null or empty filter
        if (query[filter.property] === "") {
          query[filter.property + "_NullOrEmpty"] = ""
          delete query[filter.property];
          continue;
        }
        // handle sub filter
        if (filter.sublength) {
          query[filter.property + "_StartsWith"] = query[filter.property]
          delete query[filter.property];
        }
      }
    }

    store.SetQuery(query)

    store.Load()
      .then(() => {

      })
  }

  handleConfirm = () => {
    this.props.onConfirm()
  }

  handleAdd = (item) => {

    let config = this.props.config
    let store = this.searcherStore
    let list = store.list

    let newItem = {}
    extend(newItem, item);
    newItem[config.parentIdName] = config.parentId;

    if (config.addPreTransform)
      newItem = config.addPreTransform(newItem);
    delete newItem.__added
    delete newItem.__item
    store.UpdateItem(item, { __added: true })

    // remove any deletes
    if (config.deletes) {
      config.deletes.map((del) => {
        delete newItem[del];
      })
    }
    if (config.destSetName) {
      Api[config.destSetName].create(newItem)
        .then((result) => {
          list.unshift(result)
          store.UpdateItem(item, { __item: result })
          if (result && config.onAfterAdd) {
            config.onAfterAdd(result)
          }
        }, (err) => {
          store.UpdateItem(item, { __added: false })
        });
    }
    else {
      list.unshift(item)
    }
  }

  handleRemove = (item) => {
    let config = this.props.config
    let store = this.searcherStore
    let list = store.list

    // get index from list
    let index = findIndex(list, { [config.listIdName]: item.__item[config.listIdName] })
    if (index > -1) {
      let id = item.__item[config.listIdName]
      store.UpdateItem(item, { __added: false, __item: null })
      if (config.removeHandler)
        config.removeHandler(id)
      else if (config.destSetName)
        Api[config.destSetName].delete(id)
          .then(() => {
            list.splice(index, 1)
            if (config.onAfterRemove) {
              config.onAfterRemove(index)
            }
          })
      else
        list.splice(index, 1)
    }

  }

  debouncedSearch = debounce(() => {
    this.search()
  }, 300)
  handleSearchChange = (e) => {
    this.searcherStore.ExtendQuery({ [`api_search_${this.props.config.search}`]: e.target.value })
    this.debouncedSearch()
  }
  handleClearSearch = (e) => {
    this.searcherStore.ExtendQuery({ [`api_search_${this.props.config.search}`]: "" })
    this.search()
  }

  render() {

    let config = this.props.config
    let store = this.searcherStore

    let searchEnabled = config.search
    let searchValue = null
    if (searchEnabled) {
      searchValue = store.Query[`api_search_${config.search}`] ? store.Query[`api_search_${config.search}`] : ""
    }

    return (
      <Modal show={true} dialogClassName="modal-90w" onHide={this.props.onHide} backdrop="static">
        <Modal.Header>
          <Modal.Title>{config.title ? config.title : "Search"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="panel-tools form-inline">
            <div className="form-group">
              {searchEnabled && <Icon name="search" />}
              {searchEnabled && <FormControl placeholder={config.searchPlaceholder || "Search..."} value={searchValue} onChange={this.handleSearchChange} className="size-2" />}
              {searchValue && <Button bsStyle="link" onClick={this.handleClearSearch}>View all</Button>}
            </div>
          </div>
          <Table>
            {this.renderTableHead()}
            {this.renderTableBody()}
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Paginator store={store} />
          <Button onClick={this.props.onHide} className="pull-left">Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  renderTableHead() {
    let config = this.props.config
    return (
      <thead>
        <tr>
          <th></th>
          {config.fields.map((field, index) => <th key={index}>{field.label || field.name}</th>)}
          {config.mode === "buttons" && <th>Added</th>}
        </tr>
      </thead>
    )
  }

  renderTableBody() {

    let config = this.props.config
    let store = this.searcherStore

    return (
      <tbody>
        {store.Items.map((item, rowIndex) => (
          <tr key={rowIndex}>
            <td>
              {this.mode === "buttons" && <span>
                {!item.__added && <Button onClick={(e) => this.handleAdd(item)}>Add</Button>}
                {item.__added && <Button onClick={(e) => this.handleRemove(item)} ><Icon name="trash" /></Button>}
              </span>}
            </td>
            {config.fields.map((field, colIndex) => <td key={colIndex}>
              {field.type === 'display' && !field.property && <span>
                {field.format === 'text' && <span>{item[field.name]}</span>}
                {field.format === 'date' && <FormatDateShort value={item[field.name]} />}
                {field.format === 'money' && <FormatCurrency value={item[field.name]} />}
                {field.format === 'custom' && field.renderCustom(item)}
              </span>}
              {field.type === 'display' && field.property && <span>
                {field.format === 'text' && item[field.property] && <span>{item[field.property][field.name]}</span>}
                {field.format === 'date' && item[field.property] && <FormatDateShort value={item[field.property][field.name]} />}
                {field.format === 'money' && item[field.property] && <FormatCurrency value={item[field.property][field.name]} />}
              </span>}
            </td>)}
            {config.mode === "buttons" && <td>
              {item.__added && <Icon name="check">Added</Icon>}
              {item.IsOrphaned && <Icon name="tick" icon="exclamation-circle" title="This record has no matching parent / source record">Orphaned Record</Icon>}
            </td>}
          </tr>
        ))}
      </tbody>
    )
  }
}

export default inject("Authentication")(observer(SearcherModal))