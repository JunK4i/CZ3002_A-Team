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
const getUserIngredients = (req, res) => {
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
      return res.send({
        message: "success",
      });
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
  getUserIngredients,
  addUserIngredient,
  deleteUserIngredient,
};
