//parse Osu file and create JSON

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/osu/map.osu')
  });
  
  lineReader.on('line', function (line) {
    if (line.indexOf("HitObjects"))
        console.log('Line from file:', line);
  });