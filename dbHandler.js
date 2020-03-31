const run = function(db, query) {

  return new Promise((resolve, reject) => {
    db
    .query(query)
    .then(res => {
      console.log("\x1b[33m>> " + query + "\x1b[0m");
      resolve(res.rows);
    })
    .catch(err => {
      console.error("\x1b[31mDB ERROR >> " + query + "\x1b[0m");
      reject(err);
    });
  });
}

module.exports = {

  selectAll: function(db, table, callback) {
    if(table) {
      let query = 'SELECT * FROM "' + table + '";';
      run(db, query)
      .then( (res) => callback(res))
      .catch( (err) => console.error(err));
    }
  },


  selectAllWhere: function(db, table, criteria) {

    return new Promise((resolve, reject) => {

      if(db && table && criteria) {

        let query = 'SELECT * FROM "' + table + '" WHERE '+criteria + ';';
        resolve(run(db, query));
      }

      else reject();
    });
  },


  insertInto: function(db, table, values, callback) {
    if (table && values) {
      // PostgreSQL expect identifiers in "double quotes" and strings in 'single quotes'
      // table is the name of the table = identifier
      // values = strings
      let query = 'INSERT INTO "'+ table +'" VALUES (\'' + values.join('\',\'') + '\');'
      run(db, query)
      .then( (res) => callback(res))
      .catch( (err) => console.error(err));
    }
  },


  update: function(db, table, primary_key, update, callback) {
    if (table && primary_key && update) {

      dbToPrimary = { track: "track_uri", mp3: "mp3_file" };

      let query = "UPDATE "+ table +" SET " +update +
                  " WHERE " +dbToPrimary[table] +"='" +primary_key +"'";

      run(db, query)
      .then( (res) => callback(res))
      .catch( (err) => console.error(err));
    }
  },


  delete: function(argument) {
    // body...
  }
};
