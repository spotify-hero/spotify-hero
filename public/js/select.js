import jquery from "../lib/jquery.min";
import { getQueryParams } from "../lib/functions";
import SpotifyAPI from "../lib/SpotifyAPI";

import "../css/select.scss";

document.addEventListener("DOMContentLoaded", () => {
  let spAPI = new SpotifyAPI();
  let array = getQueryParams().table.split(" ");
  let access_token = getQueryParams().access_token || undefined;

  //for each database (track & mp3 for now) create cards
  array.forEach(table => {
    addTrackHTMLBeforeElement(table);
  });

  document.getElementById("searchTerm").onkeypress = () => {
    filterList("searchTerm");
  };
  document.getElementById("searchTerm").onkeyup = () => {
    filterList("searchTerm");
  };
  document.getElementById("searchButton").onclick = () => {
    filterList("searchTerm");
  };
  console.log("Successfully loaded");

  //on click on a card, set Volume of Spotify to 0 and load the track on spotify -> display loading animation
  jquery("#cards").on("click", ".card", function() {
    let trackURI = jquery(this).attr("URI");
    if (trackURI.includes("spotify")) {
      spAPI
        .setVolume(access_token, 0) //spotify now silent
        .then(() => {
          //animation to distract user while caching spotify
          jquery(".loader-wrapper").slideDown();
          jquery(".cards").fadeOut(400);
          jquery(".search").fadeOut(400);

          //caching spotify track silently
          setTimeout(() => {
            spAPI.play(access_token, trackURI, null);
          }, 100);

          //redirect user to the game once track cached
          setTimeout(() => {
            window.location.href = jquery(this).attr("gameLink");
          }, 3000);
        })
        .catch(reject => {
          console.log("error : should display alert to user from play request");
        });
    } else {
      window.location.href = jquery(this).attr("gameLink");
    }
  });
});

/** Search among the cards based on artist & track names
 *  Change property of found cards from showed to hidden
 * @param String inputId
 */
function filterList(inputId) {
  var words = document
    .getElementById(inputId)
    .value.toLowerCase()
    .split(" ");
  // removing spaces
  words = words.filter(Boolean);

  jquery(".card").each(function() {
    let text = jquery(this)
      .attr("title")
      .toLowerCase();
    let found = false;

    if (words.every(res => text.includes(res)) > 0) {
      found = true;
    }
    if (found || words.length == 0 || words == undefined) {
      jquery(this).show();
    } else {
      jquery(this).hide();
    }
  });
}

/**
 * Same as addTableHTMLBeforeElement but for the database table 'track' only
 * Allows to insert links and images for specific elements
 */
function addTrackHTMLBeforeElement(tableName) {
  //retrieve entire table from database
  jquery.ajax({
    type: "GET",
    url: "/database/" + tableName,
    success: function(array) {
      let table = JSON.parse(array);
      let data = { audio: tableName };

      data.UserURI = getQueryParams().user_uri || undefined;
      data.access_token = getQueryParams().access_token || undefined;

      let baseLink = "/game?" + encodeQueryData(data);

      if (typeof table !== "undefined" && table.length > 0) {
        table.forEach(line => {
          let title = line.track_name;
          let artist = line.track_artist;
          let cover = line.track_cover;
          let trackURI = line.track_uri || line.mp3_file;
          let link = "";

          Object.keys(line).forEach(key => {
            if (key === "track_uri" || key == "mp3_file") {
              link = baseLink;
              Object.keys(line).forEach(key => {
                link +=
                  "&" +
                  encodeURIComponent(key) +
                  "=" +
                  encodeURIComponent(line[key]);
              });
            }
          });

          //create HTML Element (should improve this...)
          let a1 =
            "<div class=card><div class=card-image><img src=" + cover + ">";
          a1 +=
            "</div><div class=card-body><div class=card-date><time>" +
            artist +
            "</time></div><div class=card-title>";
          a1 +=
            "<h2>" +
            title +
            "</h2></div><div class=card-excerpt></div></div></a></div>";

          jquery("#cards").append(
            jquery(a1).attr({
              title: title + " " + artist,
              URI: trackURI,
              gameLink: link
            })
          );
        });
      }
    }
  });
}

function encodeQueryData(data) {
  const ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  return ret.join("&");
}
