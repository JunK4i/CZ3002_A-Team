const { default: axios } = require("axios");
var con = require("../utility/dbconfig");
const { recordWaste } = require('./wasteController');

const searchIngredient = (query, offset) => {
  return new Promise((resolve, reject) => {
    let params = {
      params: {
        query: query,
        offset: 0,
        apiKey: process.env.API_KEY,
      },
    };
    if (typeof offset !== "undefined") {
      params.params.offset = offset;
    }
    url = "https://api.spoonacular.com/food/ingredients/search";
    axios
      .get(url, params)
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        reject(err)
      });

  })
};

// return new Promise((resolve,reject)=>{

// })

// need to calculate numbers of days to expiry and return
const getUserIngredients = (userid) => {
  return new Promise((resolve, reject) => {
    if (!userid) {
      reject({ error: true, message: "Please provide userid of user" })
    }
    con.query(
      "SELECT * from inventory WHERE userid=?",
      [userid],
      function (error, results, fields) {
        if (error) reject(error);
        try {
          if (results.length != 0) {
            var length = results.length;
            for (var i = 0; i < length; i++) {
              let expiry = results[i].expiry;
              var javaDate = new Date(expiry);
              var today = new Date();
              var difference_in_Time = javaDate.getTime() - today.getTime();
              var difference_in_days = Math.ceil(
                difference_in_Time / (1000 * 3600 * 24)
              );
              results[i].days_to_expiry = difference_in_days;
            }
            resolve(results)
          }
          else {
            resolve(results)
          }
        } catch (err) {
          reject(err)
        }
      }
    );
  })
};

// if same expiry, add in as same ingredient, instead of separate
const addUserIngredient = (record) => {
  return new Promise((resolve, reject) => {
    console.log(record)
    if (!record.userid || !record.ingredientid || !record.quantity || !record.expiry || !record.name || !record.category) {
      reject({
        error: true,
        message: "Please provide the required parameters. ",
      });
    }
    con.query(
      "INSERT INTO inventory SET userid=?, ingredientid=?, quantity=?, expiry=?, name=?, category=?  ",
      [record.userid, record.ingredientid, record.quantity, record.expiry, record.name, record.category],
      function (error, results, fields) {
        if (error) throw (error);
        resolve(results)
      }
    );


    // con.query(
    //   "SELECT * FROM inventory WHERE userid=? and ingredientid=? and  expiry=? and name=? and category=?; ",
    //   [userid, ingredientid, expiry, name, category],
    //   function (error, results, fields) {
    //     if (error) throw error;
    //     try {
    //       if (results[0].id != null) {
    //         con.query(
    //           "UPDATE inventory SET quantity=quantity + ? WHERE userid = ? AND ingredientid= ? AND expiry = ? AND category= ?  ",
    //           [quantity, userid, ingredientid, expiry, category]
    //         );
    //         return res.send({
    //           message: "success",
    //         });
    //       }
    //     } catch (err) {
    //       con.query(
    //         "INSERT INTO inventory SET userid=?, ingredientid=?, quantity=?, expiry=?, name=?, category=?  ",
    //         [userid, ingredientid, quantity, expiry, name, category]
    //       );
    //       return res.send({
    //         message: "success",
    //       });
    //     }
    //   }
    // );
  })

};

const editUserIngredient = (record) => {
  return new Promise((resolve, reject) => {
    if (!record.id || !record.userid || !record.ingredientid || !record.quantity || !record.expiry || !record.name || !record.category) {
      reject({ error: true, message: "Please provide the required parameters. ", })
    }
    con.query("UPDATE inventory SET quantity=?, expiry=? WHERE id=? AND userid=?",
      [record.quantity, record.expiry, record.id, record.userid], function (error, results, fields) {
        if (error) {
          reject(error)
        }
        resolve(results)
      })

  })
}

const deleteUserIngredient = (userid, id) => {
  return new Promise((resolve, reject) => {
    if (!userid || !id) {
      reject({ error: true, message: "please provide the required parameters. " })
    }
    con.query(
      "DELETE FROM inventory WHERE userid=? AND id=? ",
      [userid, id],
      function (error, results, fields) {
        if (error) reject(error);
        resolve(results)
      }
    );
  })
};

const discardUserIngredient = (userid, id) => {
  return new Promise(async (resolve, reject) => {
    if (!userid || !id) {
      reject({ error: true, message: "please provide the required parameters. " })
    }
    try {
      let result = await getIngredientByUseridAndId(userid, id)
      if (result.length === 1) {
        await deleteUserIngredient(userid, id)
        result[0].userid = userid
        await recordWaste(result[0])
      }
      resolve("success")
    } catch (err) { reject(err) }
  })
}

const getIngredientsByUserIdAndIngredientIdAndExpiry = (userid, ingredientid, expiry) => {
  return new Promise((resolve, reject) => {
    if (!userid || !ingredientid || !expiry) {
      reject({ error: true, message: "please provide the required parameters" })
    }
    con.query(
      "SELECT * FROM inventory where userid=? AND ingredientid=? AND expiry=?",
      [userid, ingredientid, expiry],
      function (error, results, fields) {
        if (error) reject(error);
        resolve(results)
      }
    );
  })
}
const getIngredientByUseridAndId = (userid, id) => {
  console.log(userid, id)
  return new Promise((resolve, reject) => {
    if (!userid || !id) {
      reject({ error: true, message: "please provide the required parameters" })
    }
    con.query(
      "SELECT * FROM inventory where userid=? AND id=?",
      [userid, id],
      function (error, results, fields) {
        if (error) reject(error);
        resolve(results)
      }
    );
  })
}

const getIngredientByUserIdAndIngredientId = (userid, ingredientid) => {
  if (!userid || !ingredientid) reject({ error: true, message: "Please provide the required parameters." })
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM inventory WHERE userid=? AND ingredientid=?", [userid, ingredientid], (error, results, fields) => {
      if (error) reject(error)
      resolve(results)
    })
  })
}

const useIngredientByUserIdAndId = (userid, id) => {
  return new Promise((resolve, reject) => {
    if (!userid || !id) reject({ error: true, message: "Please provide the required parameters." })
    con.query("UPDATE inventory SET quantity = quantity - 1 WHERE userid=? AND id=?", [userid, id], (error, results, fields) => {
      if (error) reject(error)
      resolve(results)
    })


  })
}

module.exports = {
  searchIngredient,
  getUserIngredients,
  addUserIngredient,
  editUserIngredient,
  deleteUserIngredient,
  discardUserIngredient,
  getIngredientsByUserIdAndIngredientIdAndExpiry,
  getIngredientByUseridAndId,
  getIngredientByUserIdAndIngredientId,
  useIngredientByUserIdAndId
};
