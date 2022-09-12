const express = require("express");
const router = express.Router();

//Controllers
const userController = require("./controllers/userController");
const ingredientController = require("./controllers/ingredientController");
const recipeController = require("./controllers/recipeController");
const wasteController = require("./controllers/wasteController");

// 1 add new user
router.post("/newuser", (req, res) => {
  userController
    .createNewUser(req.body.userid, req.body.name)
    .then((result) => {
      console.log(`successfully added new user ${req.body.userid}`);
      res.send("success");
    })
    .catch((err) => {
      res.send(err);
    });
});

//2 get list of ingredients with given query param
router.get("/searchIngredient", (req, res) => {
  ingredientController
    .searchIngredient(req.headers.query, req.headers.offset)
    .then((result) => {
      console.log(
        `searching for recipes with param: ${req.headers.query} with offset:${req.headers.offset}`
      );
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

//3 get user's ingredients
router.get("/ingredient", (req, res) => {
  ingredientController
    .getUserIngredients(req.headers.userid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

//4 add a new ingredient to the user's inventory
router.post("/ingredient", async (req, res) => {
  const record = {
    userid: req.body.userid,
    ingredientid: req.body.ingredientid,
    quantity: req.body.quantity,
    expiry: req.body.expiry,
    name: req.body.name,
    category: req.body.category,
  };
  ingredientController
    .addUserIngredient(record)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

//edit the ingredient based userid and ingredient details
router.put("/ingredient", (req, res) => {
  const record = {
    id: req.body.id,
    userid: req.body.userid,
    ingredientid: req.body.ingredientid,
    quantity: req.body.quantity,
    expiry: req.body.expiry,
    name: req.body.name,
    category: req.body.category,
  };
  ingredientController
    .editUserIngredient(record)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

// delete a ingredient in the user's inventory
router.delete("/ingredient", (req, res) => {
  ingredientController
    .deleteUserIngredient(req.body.userid, req.body.id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

// discard ingredient => delete the ingredient, then record the deletion
router.delete("/discardIngredient", async (req, res) => {
  ingredientController
    .discardUserIngredient(req.body.userid, req.body.id)
    .then((result) => {
      res.send("success");
    })
    .catch((err) => {
      res.send(err);
    });
});

// search for recipe with search params
router.get("/searchRecipe", (req, res) => {
  console.log(`searching for recipes with param: ${req.headers.query}`);
  recipeController
    .searchRecipe(req.headers.query, req.headers.offset)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

// retrieve recipe that the user is able to make
router.get("/recommendRecipe", (req, res) => {
  recipeController
    .recommendRecipe(req.headers.userid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

// Get information about a recipe
router.get("/recipeInformation", (req, res) => {
  console.log(`retrieving recipe with id: ${req.headers.recipeid}`);
  recipeController
    .getRecipeInformation(req.headers.recipeid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

// get a percentage of food waste for each category in a pie chart, then total waste of each month
router.get("/getStats", (req, res) => {
  wasteController
    .getStats(req.headers.userid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

// reduce the servings of ingredients in the recipe by 1
router.put("/useRecipe", (req, res) => {
  // return res.send(ingredientController.useRecipe(req.body.userid, req.body.recipeid))
  console.log(`user: ${req.body.userid} is using recipe: ${req.body.recipeid}`);
  recipeController
    .useRecipe(req.body.userid, req.body.recipeid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
