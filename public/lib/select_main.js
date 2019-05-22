import jquery from '../vendor/jquery.min';
import {getQueryParams, addTableHTMLBeforeElement,addTrackHTMLBeforeElement} from './functions';

document.addEventListener("DOMContentLoaded", () => {
  let array = getQueryParams().table.split(' ');

  array.forEach((table)=> {
    if (table.toLowerCase() == 'track') {
      addTrackHTMLBeforeElement('anchor');
    } else {
      addTableHTMLBeforeElement('anchor', table);
    }
  });
/*
  document.getElementByClassname('searchTerm').onclick;
  searchButton
  document.getElementsByClassName('retry-pause')[0].onclick = function(){
    document.location.reload(false);
  }*/


  console.log("Successfully loaded");
});

