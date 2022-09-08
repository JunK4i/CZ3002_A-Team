const { default: axios } = require("axios");

const getIngredient = (req, res) => {
  console.log(
    `searching for recipes with param: ${req.headers.query} with offset:${req.headers.offset}`
  );
  let params = {
    params: {
      query: req.headers.query,
      offset: 0,
      apiKey: process.env.API_KEY,
    },
  };
  if (typeof req.headers.offset !== "undefined") {
    params.params.offset = req.headers.offset;
  }
  url = "https://api.spoonacular.com/food/ingredients/search";
  axios
    .get(url, params)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      res.send(err);
    });
  // var con = require("../utility/dbconfig");
  // let query = req.headers.ingredient;
  // axios
  //   .get(
  //     `https://api.spoonacular.com/food/ingredients/search?apiKey=${process.env.API_KEY}&query=${ingredient}`
  //   )
  //   .then((data) => res.json(data))
  //   .catch((err) => next(err));
};

// need to calculate numbers of days to expiry and return
const getUserIngredient = (req, res) => {
  var con = require("../utility/dbconfig");
  let userid = req.headers.userid;
  if (!userid) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide userid of user" });
  }
  con.query(
    "SELECT * from inventory WHERE userid=?",
    [userid],
    function (error, results, fields) {
      if (error) throw error;
      try {
        if (results[0].userid != null) {
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
          return res.send(results);
        }
      } catch (err) {
        return res.send("hi");
      }
    }
  );
};

// if same expiry, add in as same ingredient, instead of separate
const addUserIngredient = (req, res) => {
  var con = require("../utility/dbconfig");
  let userid = req.body.userid;
  let ingredientid = req.body.ingredientid;
  let quantity = req.body.quantity;
  let expiry = req.body.expiry;
  let name = req.body.name;
  let category = req.body.category;
  if (!userid || !ingredientid || !quantity || !expiry || !name || !category) {
    return res.status(400).send({
      error: true,
      message: "Please provide the required parameters. ",
    });
  }
  con.query(
    "SELECT * FROM inventory WHERE userid=? and ingredientid=? and  expiry=? and name=? and category=?; ",
    [userid, ingredientid, expiry, name, category],
    function (error, results, fields) {
      if (error) throw error;
      try {
        if (results[0].id != null) {
          con.query(
            "UPDATE inventory SET quantity=quantity + ? WHERE userid = ? AND ingredientid= ? AND expiry = ? AND category= ?  ",
            [quantity, userid, ingredientid, expiry, category]
          );
          return res.send({
            message: "success",
          });
        }
      } catch (err) {
        con.query(
          "INSERT INTO inventory SET userid=?, ingredientid=?, quantity=?, expiry=?, name=?, category=?  ",
          [userid, ingredientid, quantity, expiry, name, category]
        );
        return res.send({
          message: "success",
        });
      }
    }
  );
};

const updateUserIngredient = (req, res) => {
  var con = require("../utility/dbconfig");
  let userid = req.body.userid;
  let ingredientid = req.body.ingredientid;
  let quantity = req.body.quantity;
  let expiry = req.body.expiry;
  let name = req.body.name;
  let category = req.body.category;
  if (!userid || !ingredientid || !quantity || !expiry || !name || !category) {
    return res.status(400).send({
      error: true,
      message: "Please provide the required parameters. ",
    });
  }
  con.query(
    "SELECT id FROM inventory WHERE userid=? and ingredientid=? and expiry=?; ",
    [userid, ingredientid, expiry],
    function (error, results, fields) {
      if (error) throw error;
      try {
        if (results[0].id != null) {
          con.query(
            "UPDATE inventory SET userid=?, ingredientid=?, quantity=?, expiry=?, name=?, category=?  WHERE id = ?  ",
            [
              userid,
              ingredientid,
              quantity,
              expiry,
              name,
              category,
              results[0].id,
            ]
          );
          return res.send({
            message: "success",
          });
        }
      } catch (err) {
        return res.send({
          message: "failed",
        });
      }
    }
  );
};
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
  getIngredient,
  getUserIngredient,
  addUserIngredient,
  updateUserIngredient,
  deleteUserIngredient,
};
