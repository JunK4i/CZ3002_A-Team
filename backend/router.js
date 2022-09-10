const express = require("express");
const router = express.Router();

//Controllers
const userController = require("./controllers/userController");
const ingredientController = require("./controllers/ingredientController");
const recipeController = require("./controllers/recipeController");
const wasteController = require("./controllers/wasteController")


// 1 add new user
router.post("/newuser", (req, res) => {
  userController.createNewUser(req.body.userid, req.body.name)
    .then((result) => {
      console.log(`successfully added new user ${req.body.userid}`)
      res.send("success")
    })
    .catch((err) => {
      res.send(err)
    })
});

//2 get list of ingredients with given query param
router.get("/searchIngredient", (req, res) => {
  ingredientController.searchIngredient(req.headers.query, req.headers.offset)
    .then((result) => {
      res.send(result)
    }).catch((err) => {
      res.send(err)
    })
});

//3 get user's ingredients
router.get("/ingredient", (req, res) => {
  ingredientController.getUserIngredients(req.headers.userid)
    .then((result) => {
      res.send(result)
    }).catch((err) => {
      res.send(err)
    })

});

//4 add a new ingredient to the user's inventory
router.post("/ingredient", () => {
  const ingredient = {
    ingredientid: req.body.ingredientid,
    quantity: req.body.quantity,
    expiry: req.body.expiry,
    name: req.body.name,
    category: req.body.category
  }
  res.send(ingredientController.addUserIngredient(req.body.userid, ingredient))
});

//edit the ingredient based userid and ingredient details
router.put('/ingredient', (req, res) => {
  const ingredient = {
    ingredientid: req.body.ingredientid,
    quantity: req.body.quantity,
    expiry: req.body.expiry,
    name: req.body.name,
    category: req.body.category
  }
  res.send(ingredientController.editUserIngredient(req.body.userid, ingredient))
})

// delete a ingredient in the user's inventory
router.delete("/ingredient", (req, res) => {
  const result = ingredientController.getUserIngredients(req.body.userid, req.body.id)
  if (typeof result !== "undefined") {
    ingredientController.deleteUserIngredient(req.body.userid)
    return res.send("success")
  }
  return res.send("unable to delete user ingredient")

  res.send(ingredientController.deleteUserIngredient(req.body.userid, req.body.id))
});

// discard ingredient => delete the ingredient, then record the deletion
router.delete('/discardIngredient', (req, res) => {
  const result = ingredientController.getUserIngredients(req.body, userid, req.body.id)
  if (typeof result !== "undefined") {
    ingredientController.deleteUserIngredient(req.body.userid)
    wasteController.recordWaste(result)
    return res.send("success")
  }
  return res.send("unable to discard ingredient")
})

// search for recipe with search params
router.get("/searchRecipe", (req, res) => {
  res.send(recipeController.getRecipe(req.headers.query))
});

// retrive recipe that the user is able to make
router.get("/recommendRecipe", (req, res) => {
  res.send(recipeController.getUserRecipe(req.headers.userid))
});

// Get information about a recipe
router.get("/recipeInformation", (req, res) => {
  res.send(recipeController.getRecipeInformation(req.headers.recipeid))
});

// get get a percentage of food waste for each category in a pie chart, then total waste of each month
router.get("/statisctics", (req, res) => {
  return res.send(wasteController.getStats(req.headers.userid))
})

// reduce the servings of ingredients in the recipe by 1
router.put("/useRecipe", (req, res) => {
  return res.send(ingredientController.useRecipe(req.body.userid, req.body.recipeid))

})
module.exports = router;
