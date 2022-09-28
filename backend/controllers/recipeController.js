const { default: axios } = require("axios");
const con = require("../utility/dbconfig");
const ingredientController = require("./ingredientController");

const searchRecipe = (query, offset) => {
  return new Promise((resolve, reject) => {
    if (!query)
      reject({
        error: true,
        message: "please provide the required parameters",
      });
    let params = {
      params: {
        query: query,
        offset: 0,
        apiKey: process.env.API_KEY,
      },
    };
    if (offset) {
      params.params.offset = offset;
    }
    url = "https://api.spoonacular.com/recipes/complexSearch";
    axios
      .get(url, params)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getRecipeInformation = (recipeid) => {
  return new Promise((resolve, reject) => {
    if (!recipeid)
      reject({
        error: true,
        message: "please provide the required parameters.",
      });
    url1 = `https://api.spoonacular.com/recipes/${recipeid}/information`;
    const queryParam = {
      params: {
        id: recipeid,
        apiKey: process.env.API_KEY,
      },
    }
    axios.get(url1, queryParam)
      .then((result) => {
        resolve(result.data)
      }).catch((err) => {
        reject(err)
      })


  });
};

const recommendRecipe = (userid) => {
  return new Promise((resolve, reject) => {
    console.log(userid);
    if (!userid)
      reject({
        error: true,
        message: "please provided the required paramters",
      });
    ingredientController.getUserIngredients(userid).then((result) => {
      if (result.length === 0)
        reject({
          error: true,
          message: "you do not have any ingredient in your inventory,",
        });
      let searchString = "";
      result.forEach((ingredient) => {
        searchString += ingredient.name + ",+";
      });
      searchString = searchString.substring(0, searchString.length - 2);
      axios.get("https://api.spoonacular.com/recipes/findByIngredients", {
        params: {
          ingredients: searchString,
          apiKey: process.env.API_KEY,
          number: 100,
        },
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};

const useRecipe = (userid, recipeid) => {
  return new Promise(async (resolve, reject) => {
    url = `https://api.spoonacular.com/recipes/${recipeid}/information`;
    const apiResponse = await axios.get(url, {
      params: {
        apiKey: process.env.API_KEY,
      },
    });
    let ingredients = apiResponse.data.extendedIngredients;
    let length = ingredients.length;
    let tempIngredientList = [];
    for (let i = 0; i < length; i++) {
      const result =
        await ingredientController.getIngredientByUserIdAndIngredientId(
          userid,
          ingredients[i].id
        );
      if (result.length > 1) {
        // pick the correct one then add to the temp list
        // sort date, check if no expiry, check quantity
        result.sort((a, b) => {
          return new Date(a.expiry, b.expiry);
        });
        for (let i = 0; i < result.length; i++) {
          if (
            Date.parse(new Date(result[i].expiry)) - Date.parse(new Date()) <
            0
          )
            continue;
          tempIngredientList.push([i]);
          break;
        }
      } else if (result.length === 1) {
        tempIngredientList.push(result[0]);
      }
    }
    for (let i = 0; i < tempIngredientList.length; i++) {
      if (tempIngredientList[i].quantity <= 1) {
        await ingredientController.deleteUserIngredient(
          userid,
          tempIngredientList[i].id
        );
      } else {
        await ingredientController.useIngredientByUserIdAndId(
          userid,
          tempIngredientList[i].id
        );
      }
    }
    resolve("success");
  });
};
module.exports = {
  searchRecipe,
  getRecipeInformation,
  recommendRecipe,
  useRecipe,
};
