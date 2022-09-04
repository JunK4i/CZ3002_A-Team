const { default: axios } = require("axios");

const getIngredient = (req, res) => {
  var con = require("../utility/dbconfig");
  let ingredient = req.headers.ingredient;
  axios
    .get(
      `https://api.spoonacular.com/food/ingredients/search?apiKey=${process.env.API_KEY}&query=${ingredient}`
    )
    .then((data) => res.json(data))
    .catch((err) => next(err));
};

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

const addUserIngredient = (req, res) => {
  var con = require("../utility/dbconfig");
  let userid = req.body.userid;
  let ingredient = req.body.ingredient;
  if (!userid || !ingredient) {
    return res.status(400).send({
      error: true,
      message: "Please provide userid of user and the ingredient",
    });
  }
  con.query(
    "INSERT INTO inventory SET userid=?, ingredientid=? ",
    [userid, ingredient],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        message: "success",
      });
    }
  );
};

const deleteUserIngredient = (req, res) => {
  var con = require("../utility/dbconfig");
  let userid = req.body.userid;
  let ingredient = req.body.ingredientid;
  if (!userid || !ingredient) {
    return res.status(400).send({
      error: true,
      message: "Please provide userid of user and the ingredient",
    });
  }
  con.query(
    "DELETE FROM inventory SET userid=? AND ingredientid=? ",
    [userid, ingredientid],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        message: "success",
      });
    }
  );
};

module.exports = { getIngredient, getUserIngredients, addUserIngredient, deleteUserIngredient };