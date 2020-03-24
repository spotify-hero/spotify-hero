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
        console.error('DB ERROR >> '+err);
      } else {
        console.log('>> '+query);
        callback(rows);
      }
    });
  },

  /**
  * insert an array of values into any table of the database
  * VALUES must be in this form :
  * [
  *     { TrackURI : 'spotify:track:LKJ32L23KJ4', Name : 'Pookie', Artist : 'Nakamura'},
  *     { TrackURI : 'spotify:track:j9p8dik639b', Name : 'Bouyon', Artist : 'Booba'},
  *     { TrackURI : 'spotify:track:LKJ32L23KJ4', Name : 'Uprising', Artist : 'Muse'}
  * ]
  */
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
          console.error('DB ERROR >> '+err);
          // throw new Error();
        } else {
          console.log('>> '+query);
          callback();
        }
      });

    } else {
      console.error('DB ERROR >> '+err);
      // throw new Error();
    }

  },

  insertFieldsInto: function(db, table, fields, values, callback) {
    if (typeof values !== 'undefined' && values.length > 0 && table !== "" && typeof fields !== 'undefined' && fields.length > 0) {

      let query = 'INSERT INTO '+table+'VALUES(';

      query+= fields.join(', ')+') '
      // concat all values to query like this ('val1', 'val2'), ('val3', 'val4'),
      values.forEach((line)=>{
        query+=" ('"+Object.values(line).join("','")+"'),";
      });
      // replace last , with ;
      query = query.substring(0, query.length-1) + ';';

      db.run(query, [], (err, rows) => {
        if (err) {
          console.error('DB ERROR >> '+err);
          // throw new Error();
        } else {
          console.log('>> '+query);
          callback();
        }
      });
    } else {

      console.error('DB ERROR >> '+err);
      // throw new Error();
    }
  },

  insertManyIntoTrack: function(db, values, callback) {
    let query = 'INSERT INTO Track(TrackURI,Trackname,Trackartist,Trackcover,Trackdelay,OSUfile)';

    values.forEach((line)=>{
      query+=" VALUES('"+line.join("','")+"')";
    });

    db.run(query, [], (err, rows) => {
      if (err) {
        console.error('DB ERROR >> '+err);
        // throw new Error();
      } else {
        console.log('>> '+query);
        callback();
      }
    });
  },

  updateTrackFields: function(db, table, primary_key, update, callback) {
    if (primary_key && table && update ) {

      
      table = table.toLowerCase();
      dbToPrimary = { 'track' : 'TrackURI', 'mp3' : 'Filename'};

      let query = "UPDATE "+table+" SET "+update+" WHERE "+dbToPrimary[table]+" ='"+primary_key+"'";

      db.run(query, [], (err, rows) => {
        if (err) {
          console.error('DB ERROR >> '+err);
          // throw new Error();
        } else {
          console.error('>> '+query);
          callback(update);
        }
      });

    } else {
      console.error('DB ERROR >> '+err);
      // throw new Error();
    }
  }

}
