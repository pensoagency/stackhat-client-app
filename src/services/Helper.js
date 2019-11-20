

//fn.$inject = ["DisplayOrderService", "$filter"];
//export default (displayOrder, $filter) => {
class Helper {

  list = {
    inArray: inArray,
    exists: exists,
    getById: getById,
    getByIds: getByIds,
    getByIdDetail: getByIdDetail,
    toggle: toggle,
    getIds: getIds,
    //displayOrder: displayOrder,
    //filter: filter,
    orderObjectBy: orderObjectBy
  }

  string = {
    isNullOrEmpty: isNullOrEmpty,
    isNullOrWhitespace: isNullOrWhitespace,
    isNumber: stringIsNumber
  }

  obj = {
    getProperty: getProperty
  }

  data = {
    toBlob: toBlob
  }

  files = {
    getFilename: getFilename
  }
}



///////////////////////////////////
// lists
///////////////////////////////////

function toggle(elem, array, shadowElem, shadowArray) {
  var i = inArray(elem, array);
  if (i === -1) {
    array.push(elem);
    if (shadowElem && shadowArray)
      shadowArray.push(shadowElem);
  } else {
    array.splice(i, 1);
    if (shadowElem && shadowArray)
      shadowArray.splice(i, 1);
  }
}
function exists(elem, array) {
  return inArray(elem, array) > -1;
}
function inArray(elem, array) {
  if (array.indexOf) {
    return array.indexOf(elem);
  }
  for (var i = 0, length = array.length; i < length; i++) {
    if (array[i] === elem) {
      return i;
    }
  }
  return -1;
}
function getById(list, idName, id, index) {
  if (list.length > 0) {
    for (var i = 0; i < list.length; i++) {
      if (list[i][idName] == id) {
        index = i;
        return list[i];
      }
    }
  }
}
function getByIdDetail(list, idName, id) {
  if (list.length > 0) {
    for (var i = 0; i < list.length; i++) {
      if (list[i][idName] == id) {
        return {
          index: i,
          item: list[i]
        }
      }
    }
  }
}
function getByIds(list, idName, ids) {
  var result = [];
  if (list.length > 0) {
    for (var i = 0; i < list.length; i++) {
      if (ids.indexOf(list[i][idName]) > -1) {
        result.push(list[i]);
      }
    }
  }
  return result;
}
function getIds(list, idName) {
  var result = [];
  if (list.length > 0) {
    for (var i = 0; i < list.length; i++) {
      result.push(list[i][idName]);
    }
  }
  return result;
}
function filter(list, expression, comparator, anyPropertyKey) {
  return $filter("filter")(list, expression, comparator, anyPropertyKey);
}
function orderObjectBy(list, field, reverse) {
  return $filter("orderObjectBy")(list, field, reverse);
}

///////////////////////////////////
// strings
///////////////////////////////////

function isNullOrEmpty(s) {
  if (typeof s === 'undefined' || s == null) return true;
  return ('' + s).length === 0;
}
function isNullOrWhitespace(s) {
  if (typeof s === 'undefined' || s == null) return true;
  return ('' + s).replace(/\s/g, '').length < 1;
}
function stringIsNumber(s) {
  var x = +s; // made cast obvious for demonstration
  return x.toString() === s;
}

///////////////////////////////////
// obj
///////////////////////////////////

function getProperty(propPath, obj) {
  var result = angular.extend({}, obj);
  for (var i = 0; i < propPath.length; i++) {
    if (result[propPath[i]] == undefined)
      return null;
    else {
      result = result[propPath[i]];
    }
  }
  return result;
}

///////////////////////////////////
// data
///////////////////////////////////

function toBlob(data, isBase64) {
  var chars = "";
  if (isBase64) chars = atob(data); else chars = data;
  var bytes = new Array(chars.length);
  for (var i = 0; i < chars.length; i++) bytes[i] = chars.charCodeAt(i);
  var blob = new Blob([new Uint8Array(bytes)]);
  return blob;
}

///////////////////////////////////
// files
///////////////////////////////////

function getFilename(title, extension) {
  return `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50)}.${extension}`
}

export default new Helper()