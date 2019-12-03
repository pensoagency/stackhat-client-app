import { extend } from 'lodash'
import AuthenticationStore from '../stores/AuthenticationStore';
import Axios from 'axios'

const configBase = { url: null, idName: null, params: null, writeStripArrayAndCommonProps: true }
const commonProps = ["UserInfo","IsInactive"]

class Resource {

  get(id, params) {
    this.log("GET", id, params, id ? `${this.config.url}/${id}` : `${this.config.url}`)
    return Axios.get(id ? `${this.config.url}/${id}` : `${this.config.url}`, {
      headers: this.getHeaders(),
      transformResponse: this.transformResponse,
      params: this.getParams(params)
    }).then(response => {
      return response.data
    })
  }

  create(data, params) {
    this.log("CREATE", data, params, `${this.config.url}`)
    return Axios.post(`${this.config.url}`, data, {
      headers: this.getHeaders(),
      transformRequest: [this.transformWriteRequest, ...Axios.defaults.transformRequest],
      transformResponse: this.transformResponse,
      params: this.getParams(params)
    }).then(response => {
      return response.data
    })
  }

  update(data, id, params) {
    this.log("UPDATE", data, id, params, `${this.config.url}/${id}`)
    return Axios.put(`${this.config.url}/${id}`, data, {
      headers: this.getHeaders(),
      transformRequest: [this.transformWriteRequest, ...Axios.defaults.transformRequest],
      transformResponse: this.transformResponse,
      params: this.getParams(params)
    }).then(response => {
      return response.data
    })
  }

  patch(data, id, params) {
    this.log("PATCH", data, id, params, `${this.config.url}/${id}`)
    return Axios.patch(`${this.config.url}/${id}`, data, {
      headers: this.getHeaders(),
      transformRequest: [this.transformWriteRequest, ...Axios.defaults.transformRequest],
      transformResponse: this.transformResponse,
      params: this.getParams(params)
    }).then(response => {
      return response.data
    })
  }

  query(params, cancelToken) {
    this.log("QUERY", params, `${this.config.url}`)
    return Axios.get(`${this.config.url}`, {
      headers: this.getHeaders(),
      transformResponse: this.transformResponseArray,
      params: this.getParams(params),
      cancelToken: cancelToken
    }).then(response => {
      return response.data
    })
  }

  list(params, cancelToken) {
    this.log("LIST", params, `${this.config.url}`)
    return Axios.get(`${this.config.url}`, {
      headers: this.getHeaders(),
      //transformResponse: this.transformResponseList,
      params: this.getParams(params),
      cancelToken: cancelToken
    }).then(response => {
      return response.data
    })
  }

  log(operation, ...args) {
    console.log("[RES]", operation, ...args)
  }

  delete(id) {
    this.log("DELETE", id, `${this.config.url}/${id}`)
    return Axios.delete(`${this.config.url}/${id}`, {
      headers: this.getHeaders()
    })
  }

  deleteMany(params, cancelToken) {
    this.log("DELETEMANY", params, `${this.config.url}`)
    return Axios.delete(`${this.config.url}`, {
      headers: this.getHeaders(),
      params: this.getParams(params),
      cancelToken: cancelToken
    })
  }

  constructor(config) {
    //{ url, idName, params, writeStripArrayProps }
    this.config = extend({}, configBase, config)
  }

  getHeaders() {
    return { Authorization: "Bearer " + AuthenticationStore.Principal.token }
  }

  getParams(params) {
    return extend({}, this.config.params, params)
  }

  transformResponse = data => {
    let result = JSON.parse(data)
    if (result) {
      this.convertDates(result)
    }
    return result;
  }

  transformResponseArray = data => {
    let result = JSON.parse(data)
    let output = null;
    if (Object.prototype.toString.call(result) === "[object Array]") {
      output = result;
    } else if (result && result.Items) {
      output = result.Items;
    }
    this.convertDates(output);
    return output;
  }
  transformResponseList = data => {
    let result = JSON.parse(data)
    if (result && result.Items) {
      this.convertDates(result.Items);
      try { result.Items.$_total = result.Total; }
      catch (ex) { }
      return result.Items;
    }
    else {
      return result;
    }
  }

  transformWriteRequest = (data, headers) => {
    let result = data
    if (this.config.writeStripArrayAndCommonProps) {
      for (var property in data) {
        if (data.hasOwnProperty(property) && (
          Array.isArray(data[property]) // array / navigation property
          || commonProps.indexOf(property) > -1) // common props
        ) {
          console.log("[RES]", "WRITE", "DEL", property)
          delete result[property] // delete prop
        }
      }
    }
    return result
  }

  convertDates(obj) {
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) continue;

      var value = obj[key];
      var typeofValue = typeof (value);

      if (typeofValue === 'object') {
        // If it is an object, check within the object for dates.
        this.convertDates(value);
      } else if (typeofValue === 'string') {
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          obj[key] = new Date(value);
        }
      }
    }
  }


  /////////////////////////////
  // utilities
  /////////////////////////////

  // quick bool flag change for collection with ability to clear others 
  // flagged in the collection
  flag = (item, flagName, collection, clearOthers, clearOthersOnly) => {
    let idName = this.config.idName
    if (clearOthers) {
      collection.map((n) => {
        if (n[idName] != item[idName] && n[flagName]) {
          n[flagName] = false;
          return this.patch({ [flagName]: n[flagName] }, n[idName], this.config.params);
        }
      });
    }
    if (!clearOthersOnly)
      return this.patch({ [flagName]: item[flagName] }, item[idName], this.config.params);
  }

}

export default Resource