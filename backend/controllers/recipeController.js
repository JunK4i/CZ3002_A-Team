const { default: axios } = require('axios')
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

// const getUserRecipe = (req, res) => {
//     // res.send(recipe.getUserRecipe(req.headers.userid))
//     var con = require("../utility/dbconfig");
//     let userid = req.headers.userid;
//     if (!userid) {
//         return res
//             .status(400)
//             .send({ error: true, message: "Please provide userid of user" });
//     }
//     con.query(
//         "SELECT * from inventory WHERE userid=?",
//         [userid],
//         function (error, results, fields) {
//             if (error) throw error;

//             ingredientString = ""

//             Object.keys(results).forEach(
//                 (key) => {
//                     let row = result[key]
//                     url = `https://api.spoonacular.com/food/ingredients/${row.ingredientid}/information`
//                     axios.get(url, {
//                         params: {
//                             apiKey: process.env.API_KEY
//                         }
//                     }).then((response) => {
//                         ingredientString += response.data.name + ",+"
//                     })

//                 }
//             )

// axios.get("https://api.spoonacular.com/recipes/findByIngredients", {
//     params: {
//         ingredients: ingredientString,
//         apiKey: process.env.API_KEY
//     }
// }).then((response) => {
//     return res.send(response)
// }).catch((err) => {
//     return res.send(err)
// })
//         }
//     );

// }

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
            if (err.response.data.message === 'A recipe with the id 716428 does not exist.') reject({ error: true, message: 'A recipe with the id 716428 does not exist.' })
            reject({ error: true, message: "an error has occured" })
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

module.exports = {
    searchRecipe,
    getRecipeInformation,
    recommendRecipe
}