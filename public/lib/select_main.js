import jquery from '../vendor/jquery.min';
import {getHashParams, copyClipboard} from './functions';

document.addEventListener("DOMContentLoaded", () => {
  let params = getHashParams();
  if (params.t === 'all') {
    addTableHTMLBeforeElement('anchor', 'track');
    //addTableHTMLBeforeElement('anchor', 'score');
  } else {
    addTableHTMLBeforeElement('anchor', params.t);
  }
  console.log("Successfully loaded");
});

function addTableHTMLBeforeElement(id, tableName) {

  jquery.ajax({
      type:'GET',
      url: '/database/'+tableName,
      success: function(array) {
        let table = JSON.parse(array);

        let titles = '';
        //console.log(table[0]['TrackURI']);
        titles = Object.keys(table[0]).join('</th><th>');
        titles = '<tr><th>'+titles+'</th></tr>';

       /* forEach((key)=> {
            titles+='<th>'+key+'</th>';
        });*/
          //if (table[0].hasOwnProperty(key)) {
            //console.log(titles);
          //} else {
          //}
        //}

        let data = '';
        table.forEach((line)=>{
          data += '<tr><td>'+Object.values(line).join('</td><td>')+'</td></tr>';
        });
/*
        for (line in table) {
          if (table.hasOwnProperty(line)) {

            for (key in table[line]) {
              if (table[line].hasOwnProperty(key)) {
                data+='<td>'+table[line][key]+'</td>';
              }
            }
            data = '<tr>'+data+'</tr>';
          }
        }*/

        let h3Element = document.createElement("H3");
        h3Element.innerHTML = tableName;

        let tableElement = document.createElement("TABLE");
        tableElement.border=1;
        tableElement.innerHTML = titles+data;

        let anchor = document.getElementById(id)
        anchor.insertBefore(tableElement, anchor.childNodes[0]);
        anchor.insertBefore(h3Element, anchor.childNodes[0]);
      }
    });
}

/*$(document).ready(function(){
    $("#tracklist td").click(function() {     
 
        var column_num = parseInt( $(this).index());
        var row_num = parseInt( $(this).parent().index());  

        console.log("ligne = " + row_num);
 
    });
});*/