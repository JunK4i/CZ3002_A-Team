const { default: axios } = require("axios");
const { response } = require("express");

const searchRecipe = (req, res) => {
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
  url = "https://api.spoonacular.com/recipes/complexSearch";
  axios
    .get(url, params)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      res.send(err);
    });
};

const getUserRecipe = (req, res) => {
  // res.send(recipe.getUserRecipe(req.headers.userid))
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

      ingredientString = "";

      Object.keys(result).forEach((key) => {
        let row = result[key];
        url = `https://api.spoonacular.com/food/ingredients/${row.ingredientid}/information`;
        axios
          .get(url, {
            params: {
              apiKey: process.env.API_KEY,
            },
          })
          .then((response) => {
            ingredientString += response.data.name;
          });
      });

      axios
        .get("https://api.spoonacular.com/recipes/findByIngredients", {
          params: {
            ingredients: ingredientString,
            apiKey: process.env.API_KEY,
          },
        })
        .then((response) => {
          return res.send(response);
        })
        .catch((err) => {
          return res.send(err);
        });
    }
  );
};

const getRecipe = (req, res) => {
  console.log(`retrieving recipe with id: ${req.headers.recipeid}`);
  url = `https://api.spoonacular.com/recipes/${req.headers.recipeid}/information`;
  axios
    .get(url, {
      params: {
        apiKey: process.env.API_KEY,
      },
    })
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      res.send(err);
    });
};

const useRecipe = (req, res) => {
  var con = require("../utility/dbconfig");
  recipeid = req.headers.recipeid;
  url = `https://api.spoonacular.com/recipes/${req.headers.recipeid}/information`;
  axios
    .get(url, {
      params: {
        apiKey: process.env.API_KEY,
      },
    })
    .then((response) => {
      var length = response.data.extendedIngredients.length;
      for (var i = 0; i < length; i++) {
        con.query(
          "UPDATE inventory SET quantity = quantity - 1 WHERE ingredientid = ? ",
          [response.data.extendedIngredients[i].id],
          function (error, results, fields) {
            if (error) throw error;
          }
        );
      }
      res.send(response.data.extendedIngredients);
    })
    .catch((err) => {
      res.send(err);
    });
};

module.exports = {
  getUserRecipe,
  searchRecipe,
  getRecipe,
  useRecipe,
};
