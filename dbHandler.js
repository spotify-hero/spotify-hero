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
        callback("ERROR: request to "+table+" failed with "+String(err));
      } else {
        callback(rows);
      }
    });
  },

  insertInto: function(db, table, values, callback) {
    if (typeof values !== 'undefined' && values.length > 0 && table !== "") {
      // base query
      let query = 'INSERT INTO '+table+' VALUES ';

      // concat all values to query like this ('val1', 'val2'), ('val3', 'val4'),
      values.forEach((line)=>{
        query+=" ('"+Object.values(line).join("','")+"'),";
      });
      // replace last , with ;
      query = query.substring(0, query.length-1) + ';';

      db.run(query, [], (err, rows) => {
        if (err) {
          console.error(err);
          callback("ERROR: request to "+table+" failed with "+String(err));
        } else {
          callback();
        }
      });
    } else {
      callback("Bad request : empty values");
      callback(table);
      callback(values);
    }

  },

  insertOneInto: function(db, table, values, callback) {
    let query = 'INSERT INTO '+table;

    query+=" VALUES('"+values.join("','")+"');";

    db.run(query, [], (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        callback();
      }
    });
  },

  insertManyIntoTrack: function(db, values, callback) {
    let query = 'INSERT INTO Track(TrackURI,Trackname,Trackartist,Trackcover,Trackdelay,OSUfile)';

    values.forEach((line)=>{
      query+=" VALUES('"+line.join("','")+"')";
    });

    db.run(query, [], (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        callback();
      }
    });
  },

}
