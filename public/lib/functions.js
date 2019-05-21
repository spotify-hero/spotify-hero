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
* Get text from an element and copies it to the clipboard
* @return nothing
*/
function copyClipboard(elementId) {
  var copyText = document.getElementById(elementId);
  if (copyText != null) {
    copyText.select();
    document.execCommand("copy");
  } else {
    console.log('copyClipboard: Could not copy text cause element is null');
  }
}

export {getHashParams, copyClipboard};