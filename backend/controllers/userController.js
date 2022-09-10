const createNewUser = (userid, name) => {
  return new Promise((resolve, reject) => {
    var con = require("../utility/dbconfig");
    if (!userid || !name) {
      reject({ error: true, message: "Please provide userid and name of user" })
    }
    con.query(
      "INSERT INTO user SET userid=?, name=? ",
      [userid, name],
      function (error, results, fields) {
        if (error) reject(error);
        resolve(results);
      }
    );
  })
};

module.exports = { createNewUser };
