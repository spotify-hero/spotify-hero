/**
* Obtains parameters from the ? of the URL
* @return Object
*/
export function getQueryParams() {
    var qs = document.location.search.split('+').join(' ');
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    return params;
}

/**
* Get text from an element and copies it to the clipboard
*/
export function copyClipboard(elementId) {
  var copyText = document.getElementById(elementId);
  if (copyText != null) {
    copyText.select();
    document.execCommand("copy");
  } else {
    console.error('copyClipboard: Could not copy text cause #'+elementId+' is null');
  }
}


/**
* AJAX request to /database/table, parsing JSON and making it into an HTML table element
* then inserting it before id with an h3 title
*/
export function addJSONBeforeElement(id, array) {

  let table = JSON.parse(array);

  if (typeof table !== 'undefined' && table.length > 0) {
    let titles = '';
    titles = Object.keys(table[0]).join('</th><th>');
    titles = '<tr><th>'+titles+'</th></tr>';

    let data = '';
    table.forEach((line)=>{
      data += '<tr><td>'+Object.values(line).join('</td><td>')+'</td></tr>';
    });

    let tableElement = document.createElement("TABLE");
    tableElement.border=1;
    tableElement.innerHTML = titles+data;

    let anchor = document.getElementById(id)
    anchor.insertBefore(tableElement, anchor.childNodes[0]);
    anchor.insertBefore(h3Element, anchor.childNodes[0]);
  }
}

/**
* Obtains common keys from previous object which are also in next object
* @return Array
*/
export function diffObj(previous , next) {
  if (previous !== undefined && next !== undefined){
    // Create arrays of property names
    let previousProps = Object.getOwnPropertyNames(previous);
    let nextProps = Object.getOwnPropertyNames(next);
  
    return previousProps.filter(value => nextProps.includes(value));
  }
}