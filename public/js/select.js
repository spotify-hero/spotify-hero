import jquery from '../lib/jquery.min';
import { getQueryParams } from '../lib/functions';

import '../css/select.scss';

document.addEventListener("DOMContentLoaded", () => {

  let array = getQueryParams().table.split(' ');

  array.forEach((table)=> {
    addTrackHTMLBeforeElement(table);
  });
  document.getElementById('searchTerm').onkeypress = (()=>{filterList('searchTerm')});
  document.getElementById('searchTerm').onkeyup = (()=>{filterList('searchTerm')});
  document.getElementById('searchButton').onclick = (()=>{filterList('searchTerm')});
  console.log("Successfully loaded");
});

function filterList(inputId){
  var words = document.getElementById(inputId).value.toLowerCase().split(" ");
  // on enleve les espaces
  words = words.filter(Boolean);

  jquery(".card").each(function(){
    let text = jquery(this).prop("title").toLowerCase().split(" ");
    let found = false;
    words.forEach(word => {
      if (text.some(res => res.includes(word))>0){
        found = true;
      }
    });
    if (found || words.length == 0 || words == undefined){
      jquery(this).show();
    }else{
     jquery(this).hide();
    }
  })
}

/**
* Same as addTableHTMLBeforeElement but for the database table 'track' only
* Allows to insert links and images for specific elements
*/
function addTrackHTMLBeforeElement(tableName) {
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
        //counter
        let i = 0;
        
        table.forEach((line) => {
          let title = line.Trackname;
          let artist = line.Trackartist;
          let cover = line.Trackcover;
          let link = "";

          Object.keys(line).forEach((key)=> {
            if (key==="TrackURI" || key=="Filename") {
              link = baseLink;
              Object.keys(line).forEach((key)=> {
                link += '&'+encodeURIComponent(key)+"="+encodeURIComponent(line[key]);
              });
            }
          });

          let a1 = "<div class=card id="+tableName+"_"+i+"><div class=card-image><a href=" + link +"><img src="+ cover + "></a>";
          a1 += "</div><div class=card-body><div class=card-date><time>" + artist + "</time></div><div class=card-title>";
          a1 += "<h2>" + title + "</h2></div><div class=card-excerpt></div></div></a></div>"

          jquery('#cards').append(jquery(a1).attr("title", title + " " + artist));
          i++
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