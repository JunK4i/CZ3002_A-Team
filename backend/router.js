const express = require("express");
const router = express.Router();

//Controllers
const userController = require("./controllers/userController");
const ingredientController = require("./controllers/ingredientController");
const recipeController = require("./controllers/recipeController");

// home route
router.get("/", function (req, res) {
  return res.send("hi welcome!");
});

// add new user
router.post("/newuser", userController.createNewUser);

// get list of ingredients
router.get("/searchingredient", ingredientController.getIngredient);

// get user's ingredients
router.get("/ingredient", ingredientController.getUserIngredient);

// update user's ingredients
router.put("/ingredient", ingredientController.updateUserIngredient);

// set new ingredient based on userid
router.post("/ingredient", ingredientController.addUserIngredient);

// delete a ingredient in the user's inventory
router.delete("/ingredient", ingredientController.deleteUserIngredient);

// search for recipe with search params
router.get("/searchRecipe", recipeController.searchRecipe);

// retrive recipe that the user is able to make
router.get("/userrecipe", recipeController.getUserRecipe);

// Get information about a recipe
router.get("/recipe", recipeController.getRecipe);

// Make the recipe using ingredients that users have
router.put("/useRecipe", recipeController.useRecipe);

module.exports = router;
