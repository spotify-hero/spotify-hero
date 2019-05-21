import jquery from '../vendor/jquery.min';

/**
* Obtains parameters from the hash of the URL
* @return Object
*/
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

/**
* Obtains parameters from the ? of the URL
* @return Object
*/
function getQueryParams() {
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
function copyClipboard(elementId) {
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
function addJSONBeforeElement(id, array) {

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
* AJAX request to /database/table, parsing JSON and making it into an HTML table element
* then inserting it before id with an h3 title
*/
function addTableHTMLBeforeElement(id, tableName) {

  jquery.ajax({
      type:'GET',
      url: '/database/'+tableName,
      success: function(array) {
        let table = JSON.parse(array);

        if (typeof table !== 'undefined' && table.length > 0) {
          let titles = '';
          titles = Object.keys(table[0]).join('</th><th>');
          titles = '<tr><th>'+titles+'</th></tr>';

          let data = '';
          table.forEach((line)=>{
            data += '<tr><td>'+Object.values(line).join('</td><td>')+'</td></tr>';
          });

          let h3Element = document.createElement("H3");
          h3Element.innerHTML = tableName;

          let tableElement = document.createElement("TABLE");
          tableElement.border=1;
          tableElement.innerHTML = titles+data;

          let anchor = document.getElementById(id)
          anchor.insertBefore(tableElement, anchor.childNodes[0]);
          anchor.insertBefore(h3Element, anchor.childNodes[0]);
        }
      }
  });
}


/**
* Same as addTableHTMLBeforeElement but for the database table 'track' only
* Allows to insert links and images for specific elements
*/
function addTrackHTMLBeforeElement(id) {

  jquery.ajax({
      type:'GET',
      url: '/database/track',
      success: function(array) {
        let table = JSON.parse(array);
        let baseLink = '/game?access_token='+getQueryParams().access_token;

        if (typeof table !== 'undefined' && table.length > 0) {
          let titles = '';
          titles = Object.keys(table[0]).join('</th><th>');
          titles = '<tr><th>'+titles+'</th></tr>';

          let data = '';
          let link = '';
          let cover = '';
          let lineStr = '';

          table.forEach((line)=>{
            lineStr = '';

            Object.keys(line).forEach((key)=> {
              if (key==='TrackURI') {
                link = '<a href="'+baseLink;
                Object.keys(line).forEach((key)=> {
                  link += '&'+encodeURIComponent(key)+"="+encodeURIComponent(line[key]);
                });
                link += '">'+line[key]+'</a>'

                lineStr += '<td>'+link+'</td>';
              }
              else if (key==='Trackcover') {
                cover = '<img width="64" src="'+line[key]+'" />'
                lineStr += '<td>'+cover+'</td>';
              }
              else {
                lineStr += '<td>'+line[key]+'</td>';
              }
            });
            data += '<tr>'+lineStr+'</tr>';
          });

          let h3Element = document.createElement("H3");
          h3Element.innerHTML = "Track";

          let tableElement = document.createElement("TABLE");
          tableElement.border=1;
          tableElement.innerHTML = titles+data;

          let anchor = document.getElementById(id)
          anchor.insertBefore(tableElement, anchor.childNodes[0]);
          anchor.insertBefore(h3Element, anchor.childNodes[0]);
      }
    }
  });
}
export {
  getHashParams,
  copyClipboard,
  getQueryParams,
  addTableHTMLBeforeElement,
  addTrackHTMLBeforeElement,
  addJSONBeforeElement
};