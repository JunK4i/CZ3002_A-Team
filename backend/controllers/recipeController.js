const { default: axios } = require('axios')
const con = require('../utility/dbconfig')
const ingredientController = require('./ingredientController')


const searchRecipe = (query, offset) => {
  return new Promise((resolve, reject) => {
    if (!query) reject({ error: true, message: "please provide the required parameters" })
    let params = {
      params: {
        query: query,
        offset: 0,
        apiKey: process.env.API_KEY
      }
    }
    if (offset) {
      params.params.offset = offset
    }
    url = "https://api.spoonacular.com/recipes/complexSearch"
    axios.get(url, params).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })

}

const getRecipeInformation = (recipeid) => {
  return new Promise((resolve, reject) => {
    if (!recipeid) reject({ error: true, message: "please provide the required parameters." })
    url = `https://api.spoonacular.com/recipes/${recipeid}/information`
    axios.get(url, {
      params: {
        id: recipeid,
        apiKey: process.env.API_KEY
      }
    }).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err.response.data.message)
    })
  })
}

const recommendRecipe = (userid) => {
  return new Promise((resolve, reject) => {
    console.log(userid)
    if (!userid) reject({ error: true, message: "please provided the required paramters" })
    ingredientController.getUserIngredients(userid)
      .then((result) => {
        if (result.length === 0) reject({ error: true, message: "you do not have any ingredient in your inventory," })
        let searchString = ''
        result.forEach((ingredient) => {
          searchString += ingredient.name + ',+'
        })
        searchString = searchString.substring(0, searchString.length - 2);
        // resolve(searchString)
        axios.get("https://api.spoonacular.com/recipes/findByIngredients", {
          params: {
            ingredients: searchString,
            apiKey: process.env.API_KEY
          }
        }).then((response) => {
          resolve(response.data)
        }).catch((err) => {
          reject(err)
        })
      })
  })
}


const useRecipe = (userid, recipeid) => {
  return new Promise(async (resolve, reject) => {
    url = `https://api.spoonacular.com/recipes/${req.headers.recipeid}/information`;
    const result = await axios.get(url, {
      params: {
        apiKey: process.env.API_KEY,
      },
    })
    let length = result.data.extendedIngredients.length
    console.log(length)
    // .then((response) => {
    //   var length = response.data.extendedIngredients.length;
    //   console.log(response.extendedIngredients)
    //   for (var i = 0; i < length; i++) {
    //     con.query(
    //       "SELECT * FROM inventory WHERE userid=? AND ingredientid=?",
    //       [userid, response.data.extendedIngredients[i].id],
    //       function (error, results, fields) {
    //         if (error) throw error;
    //       });
    //     con.query(
    //       "SELECT * FROM inventory WHERE userid=? AND ingredientid=?", []
    //     )
    //   }
    //   res.send(response.data.extendedIngredients);
    // })
    // .catch((err) => {
    //   res.send(err);
    // });

  })

};


module.exports = {
  searchRecipe,
  getRecipeInformation,
  recommendRecipe,
  useRecipe
}
