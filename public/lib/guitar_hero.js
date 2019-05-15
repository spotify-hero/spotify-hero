import Game from "./game";

document.addEventListener("DOMContentLoaded", () => {
  let game = new Game();
  console.log("Successfully loaded")

  document.getElementsByClassName('close-pause')[0].onclick = function(){
    console.log("retry !!! ")
    document.location.reload(false);
  }
  
});
