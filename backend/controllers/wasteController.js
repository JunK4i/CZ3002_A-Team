var con = require("../utility/dbconfig");

const recordWaste = (record) => {
  return new Promise((resolve, reject) => {
    if (!record)
      reject({ error: true, message: "please provide the required paramters" });
    con.query(
      "INSERT INTO discard SET userid=?, name=?, ingredientid=? ,expiry=?, quantity=?, category=?",
      [
        record.userid,
        record.name,
        record.ingredientid,
        record.expiry,
        record.quantity,
        record.category,
      ],
      (error, results, fields) => {
        if (error) reject(error);
        console.log(results);
        resolve("success");
      }
    );
  });
};

const getStats = (userid) => {
  return new Promise((resolve, reject) => {
    if (!userid)
      reject({ error: true, message: "please provide the required paramters" });
    con.query(
      "SELECT * FROM discard WHERE userid=?",
      [userid],
      async (error, results, fields) => {
        if (error) reject(error);
        try {
          var category_results = await groupByCategory(results, userid);
          var month_results = await groupByMonth(results, userid);
          var dict = {};
          dict["groupByCategory"] = category_results;
          dict["groupByMonth"] = month_results;
          resolve(dict);
        } catch (err) {
          reject(error);
        }
      }
    );
  });
};

const groupByCategory = (record, userid) => {
  return new Promise((resolve, reject) => {
    if (record.length === 0) {
      resolve({ error: true, message: "No result found." }); // used resolve here bcz output doesnt print error msg when use reject
    }
    con.query(
      "SELECT category, SUM(quantity) FROM discard WHERE userid = ? GROUP BY category",
      [userid],
      function (error, results, fields) {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
};

const groupByMonth = (record, userid) => {
  return new Promise((resolve, reject) => {
    if (record.length === 0) {
      resolve({ error: true, message: "No result found." }); // used resolve here bcz output doesnt print error msg when use reject
    }
    con.query(
      "SELECT MONTH(expiry), SUM(quantity) FROM discard WHERE userid = ? GROUP BY MONTH(expiry)",
      [userid],
      function (error, results, fields) {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
};
module.exports = {
  recordWaste,
  getStats,
};
