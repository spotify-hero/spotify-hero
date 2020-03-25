import jquery from '../lib/jquery.min';
import { getQueryParams } from '../lib/functions';
import SpotifyAPI from '../lib/SpotifyAPI';

import '../css/select.scss';

document.addEventListener("DOMContentLoaded", () => {

  let array = getQueryParams().table.split(' ');

  array.forEach((table)=> {
    addTrackHTMLBeforeElement(table);
  });

  document.getElementById('searchTerm').onkeypress = (()=>{filterList('searchTerm')});
  document.getElementById('searchTerm').onkeyup = (()=>{filterList('searchTerm')});
  document.getElementById('searchButton').onclick = (()=>{filterList('searchTerm')});
  document.getElementById('addSpotifyButton').onclick = addTrack;

  console.log('Successfully loaded');
});

const addTrack = function() {
  const link = document.getElementById('addSpotifyInput').value;
  const file = document.getElementById('addMP3Input').files[0];

  let trackID, audio;

  if (link) {
    let audio = "track";
    let test = link.match(/^(https?:\/\/)?open\.spotify\.com\/track\/(.*)$/);

    // we add the Spotify track directly with its URI
    if (test.length == 3 && getQueryParams().access_token) {
        const spAPI = new SpotifyAPI();
        spAPI.searchOne(test[2], getQueryParams().access_token);
    }

  } else if(file) {
    let audio = "mp3";

  /*  if(trackID) {
      // insert into database
      jquery.ajax({
        async: false,
        type:'POST',
        url: '/database/'+audio,
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(recordMap),

        success: function(response) {
          window.location.href = "/select?table=track%20mp3"+"&UserURI="+getQueryParams().UserURI+"&access_token="+getQueryParams().access_token;
        },
        error: function(response) {
          alert('Database PUT request failed !');
        }
      });
    }*/
  }
}

function filterList(inputId){
  var words = document.getElementById(inputId).value.toLowerCase().split(" ");
  // on enleve les espaces
  words = words.filter(Boolean);

  jquery(".card").each(function(){
    let text = jquery(this).prop("title").toLowerCase();
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

        // special card to add tracks
        let special = '<div class="card" id=special-card><div class="card-image"><img src="/img/plus.svg"></div>';
        special += "<div class=card-body><div class=card-date><time> ADD A TRACK </time></div><div class=card-title>";
        special += "<h2>click me</h2></div><div class=card-excerpt></div></div>";
        jquery('#cards').append(jquery(special));
        document.getElementById('special-card').onclick = (() =>
        {
          let disp = document.getElementById("addTrackContainer").style.display;
          document.getElementById("addTrackContainer").style.display = (disp == "none")? "block" : "none";
        });

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