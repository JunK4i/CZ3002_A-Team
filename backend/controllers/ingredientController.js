const { default: axios } = require("axios");
var con = require("../utility/dbconfig");

const searchIngredient = (query, offset) => {
  return new Promise((resolve, reject) => {
    console.log(
      `searching for recipes with param: ${query} with offset:${offset}`
    );
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
        if (error) reject(error);
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

const editUserIngredient = (userid, ingredient) => {
  console.log("editing user ingredient")
  return "success"
}

const deleteUserIngredient = (req, res) => {
  var con = require("../utility/dbconfig");
  let userid = req.body.userid;
  let id = req.body.id;
  if (!userid || !id) {
    return res.status(400).send({
      error: true,
      message: "Please provide userid of user and the id",
    });
  }
  con.query(
    "DELETE FROM inventory WHERE userid=? AND id=? ",
    [userid, id],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        message: "success",
      });
    }
  );
};

module.exports = {
  searchIngredient,
  getUserIngredients,
  addUserIngredient,
  editUserIngredient,
  deleteUserIngredient,
};
