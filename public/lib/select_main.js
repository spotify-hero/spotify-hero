import jquery from '../vendor/jquery.min';
import {getQueryParams} from './functions';

document.addEventListener("DOMContentLoaded", () => {
  let array = getQueryParams().table.split(' ');

  array.forEach((table)=> {
    if (table.toLowerCase() == 'track') {
      addTrackHTMLBeforeElement('anchor');
    } else {
      addTableHTMLBeforeElement('anchor', table);
    }
  });

  document.getElementById('searchTerm').onchange = (()=>{filterList('searchTerm', "track_table")});
  document.getElementById('searchButton').onclick = (()=>{filterList('searchTerm', "track_table")});

  console.log("Successfully loaded");
});

function filterList(inputId, tableId){
  var array = [];
  var arrayFiltered = [];
  var words = [];
  var regex = [];

  var table = document.getElementById(tableId);
  for (var r = 0, n = table.rows.length; r < n; r++) {
      for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
          array.push({row : r, data : table.rows[r].cells[c].innerHTML});
      }
  }

  var words = document.getElementById(inputId).value.split(' ');
  words.forEach((ele)=> {
    regex.push(new RegExp(ele, 'i'));
  });

  array.forEach((ele)=> {
    regex.forEach((re)=> {
      if (re.test(ele.data)) {
        arrayFiltered.push(ele.row);
      }
    });
  });

  arrayFiltered = [...new Set(arrayFiltered)];

  for (var r = 0, n = table.rows.length; r < n; r++) {
    if (!arrayFiltered.includes(r)) {
      table.rows[r].style="display:none";
    } else {
      table.rows[r].style="display:table-row";
    }
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
          tableElement.border=0;
          tableElement.id="track_table"
          tableElement.innerHTML = titles+data;

          let anchor = document.getElementById(id)
          anchor.insertBefore(tableElement, anchor.childNodes[0]);
          anchor.insertBefore(h3Element, anchor.childNodes[0]);
      }
    }
  });
}