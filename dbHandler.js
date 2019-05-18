module.exports = {

/*  info: function(db, table, callback) {
    let query = 'PRAGMA table_info('+table+')';

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error(err);
        callback("ERROR: no such table "+table);
      } else {
        callback(rows);
      }
    });
  },*/

  selectAll: function(db, table, callback) {
    let query = 'SELECT * from '+table;

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error(err);
        callback("ERROR: no such table "+table);
      } else {
        callback(rows);
      }
    });
  },

  insertIntoTrack: function(db, table, values, callback) {
    let query = 'INSERT INTO Track(TrackURI,Trackname,Trackartist,Trackcover,Trackdelay,OSUfile) ';

    values.forEach((line)=>{
      query+="VALUES('"+line.join("','")+"')";
    });

    db.run(query, [], (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        callback();
      }
    });
  }

}
