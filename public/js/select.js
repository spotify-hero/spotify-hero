import jquery from '../lib/jquery.min';
import { getQueryParams } from '../lib/functions';

import '../css/select.scss';

document.addEventListener("DOMContentLoaded", () => {

  let array = getQueryParams().table.split(' ');

  array.forEach((table)=> {
    addTrackHTMLBeforeElement('anchor', table);
  });
  document.getElementById('searchTerm').onkeypress = (()=>{filterList('searchTerm', "track_table")});
  document.getElementById('searchTerm').onkeyup = (()=>{filterList('searchTerm', "track_table")});
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
* Same as addTableHTMLBeforeElement but for the database table 'track' only
* Allows to insert links and images for specific elements
*/
function addTrackHTMLBeforeElement(id, tableName) {
  jquery.ajax({
    type:'GET',
    url: '/database/' + tableName,
    success: function(array) {

      let table = JSON.parse(array);
      let data = {audio : tableName};

      if (tableName == "track"){
        data.UserURI = getQueryParams().UserURI;
        data.access_token = getQueryParams().access_token;
      }

      let baseLink = "/game?" + encodeQueryData(data);

      if (typeof table !== 'undefined' && table.length > 0) {
        let titles = '';
        titles = Object.keys(table[0]).join('</th><th>');
        titles = '<tr><th>'+titles+'</th></tr>';

        console.log(table[0]);

        let data = '';
        let link = '';
        let cover = '';
        let lineStr = '';

        table.forEach((line)=>{
          lineStr = '';
          Object.keys(line).forEach((key)=> {
            if (key==="TrackURI" || key=="Filename") {
              link = baseLink;
              Object.keys(line).forEach((key)=> {
                link += '&'+encodeURIComponent(key)+"="+encodeURIComponent(line[key]);
              });
            }
            else if (key==='Trackcover') {
              cover = line[key];
            }
            else {
              lineStr += '<td>'+line[key]+'</td>';
            }
          });

          let a1 = "<div class=card><div class=card-image><a href=" + link +"><img src="+ cover + "></a>";
          a1 += "</div><div class=card-body><div class=card-date><time>" + line["Trackartist"] + "</time></div><div class=card-title>";
          a1 += "<h2>" + line["Trackname"] + "</h2></div><div class=card-excerpt></div></div></a></div>"

          console.log(a1);
          jquery('#container').append(jquery(a1));
        });
      }
    }
  });
}

function encodeQueryData(data) {
  const ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  return ret.join('&');
}