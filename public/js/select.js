import jquery from '../lib/jquery.min';
import { getQueryParams } from '../lib/functions';
import SpotifyAPI from '../lib/SpotifyAPI';

import '../css/select.scss';

document.addEventListener("DOMContentLoaded", () => {
  let spAPI = new SpotifyAPI();
  let array = getQueryParams().table.split(' ');
  let access_token = getQueryParams().access_token || undefined;

  array.forEach((table)=> {
    addTrackHTMLBeforeElement(table);
  });

  document.getElementById('searchTerm').onkeypress = (()=>{filterList('searchTerm')});
  document.getElementById('searchTerm').onkeyup = (()=>{filterList('searchTerm')});
  document.getElementById('searchButton').onclick = (()=>{filterList('searchTerm')});
  console.log("Successfully loaded");

  jquery('#cards').on('click','.card',function(){
    let trackURI = jquery(this).attr("URI");
    if (trackURI.includes("spotify")){
      spAPI.setVolume(access_token, 0);

      jquery(".loader-wrapper").slideDown();
      jquery(".cards").fadeOut(400);
      jquery(".search").fadeOut(400);


      setTimeout( ()=>{
        spAPI.play(access_token, trackURI, null);
      },100);

      setTimeout(()=>{
        window.location.href = jquery(this).attr("gameLink");
      }, 3000);
    }else{
      window.location.href = jquery(this).attr("gameLink");
    }
  });
});

function filterList(inputId){
  var words = document.getElementById(inputId).value.toLowerCase().split(" ");
  // on enleve les espaces
  words = words.filter(Boolean);

  jquery(".card").each(function(){
    let text = jquery(this).attr("title").toLowerCase();
    let found = false;

    if (words.every(res => text.includes(res))>0){
      found = true;
    }
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

      data.UserURI = getQueryParams().UserURI || undefined;
      data.access_token = getQueryParams().access_token || undefined;

      let baseLink = "/game?" + encodeQueryData(data);
            
      if (typeof table !== 'undefined' && table.length > 0) {
        
        table.forEach((line) => {
          let title = line.Trackname;
          let artist = line.Trackartist;
          let cover = line.Trackcover;
          let trackURI = line.TrackURI || line.Filename;
          let link = "";

          Object.keys(line).forEach((key)=> {
            if (key==="TrackURI" || key=="Filename") {
              link = baseLink;
              Object.keys(line).forEach((key)=> {
                link += '&'+encodeURIComponent(key)+"="+encodeURIComponent(line[key]);
              });
            }
          });

          let a1 = "<div class=card><div class=card-image><img src="+ cover + ">";
          a1 += "</div><div class=card-body><div class=card-date><time>" + artist + "</time></div><div class=card-title>";
          a1 += "<h2>" + title + "</h2></div><div class=card-excerpt></div></div></a></div>"

          jquery('#cards').append(jquery(a1).attr({
            title: title + " " + artist,
            URI: trackURI,
            gameLink: link
          }));
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