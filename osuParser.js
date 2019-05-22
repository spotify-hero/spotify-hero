module.exports = {
  //parse Osu file and create JSON
  parser : function(textByLine){
    let found = false

    let hitObject = []

    versionNb = textByLine[0].match( /\d+/g ).join([])
    console.log("OsuFileFormat Version : " + versionNb)

    //on cherche première occurence de HitObject
    for (const[i, element] of textByLine.entries()){

      if (element.includes('HitObjects')){
        found = true;
        hitObject = textByLine.slice(i+1);
        break;
      }
    }

    if (!found){
      console.log("Error, HitObject not found in osu file !")
    }

    hitTab = []

    hitObject.forEach(function(element){
      if (element !== null){
        tab = element.match((/\d+\.\d+|\d+\b|\d+(?=\w)/g)||[])

        if(tab){
          hitTab.push(tab.map(function (v) {return +v;}));
        }
      }

    })

    let finalRes = [];

    hitTab.map(function(item) {
      let position;

      if (item[0]<128) {
        position = 0;
      }else if (item[0]<256) {
        position = 1;
      }else if (item[0]<384) {
        position = 2;
      }else {
        position = 3;
      }

      let duration = 0;

      if (item[5]>0){
        duration = item[5] - item[2];
      }

      finalRes.push({
        "position" : position,
        "startTime": item[2],
        "duration"  : duration
      });
    })

    return JSON.stringify(finalRes);
  },

  convertPosition(position){
    if (position == 0){
      return 60;
    }
    if (position == 1){
      return 200;
    }
    if (position == 2){
      return 300;
    }
    if (position == 3){
      return 400;
    }
  }

};