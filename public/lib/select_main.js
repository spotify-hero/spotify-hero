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

  console.log("Successfully loaded");
});

