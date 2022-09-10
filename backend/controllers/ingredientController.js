const { default: axios } = require("axios");
var con = require("../utility/dbconfig");

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
        resolve(results)
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
    con.query("UPDATE inventory SET quantity=? WHERE id=? AND userid=? AND expiry=?",
      [record.quantity, record.id, record.userid, record.expiry], function (error, results, fields) {
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

module.exports = {
  searchIngredient,
  getUserIngredients,
  addUserIngredient,
  editUserIngredient,
  deleteUserIngredient,
  getIngredientsByUserIdAndIngredientIdAndExpiry,
  getIngredientByUseridAndId
};
