const { default: axios } = require('axios')

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

            ingredientString = ""

            Object.keys(results).forEach(
                (key) => {
                    let row = result[key]
                    url = `https://api.spoonacular.com/food/ingredients/${row.ingredientid}/information`
                    axios.get(url, {
                        params: {
                            apiKey: process.env.API_KEY
                        }
                    }).then((response) => {
                        ingredientString += response.data.name + ",+"
                    })

                }
            )

            axios.get("https://api.spoonacular.com/recipes/findByIngredients", {
                params: {
                    ingredients: ingredientString,
                    apiKey: process.env.API_KEY
                }
            }).then((response) => {
                return res.send(response)
            }).catch((err) => {
                return res.send(err)
            })
        }
    );

}

const getRecipeInformation = (req, res) => {
    console.log(`retrieving recipe with id: ${req.headers.recipeid}`)
    url = `https://api.spoonacular.com/recipes/${req.headers.recipeid}/information`
    axios.get(url, {
        params: {
            apiKey: process.env.API_KEY
        }
    }).then((response) => {
        res.send(response.data)
    }).catch((err) => {
        res.send(err)
    })
}

module.exports = {
    getUserRecipe,
    searchRecipe,
    getRecipeInformation
}