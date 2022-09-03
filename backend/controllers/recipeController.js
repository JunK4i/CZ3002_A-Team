const searchRecipe = (req, res) => {
    console.log(`searching for recipes with param: ${req.headers.query} with offset:${req.headers.offset}`)
    let params = {
        params: {
            query: req.headers.query,
            offset: 0,
            apiKey: process.env.API_KEY
        }
    }
    if (typeof req.headers.offset !== "undefined") {
        params.params.offset = req.headers.offset
    }
    url = "https://api.spoonacular.com/recipes/complexSearch"
    axios.get(url, params).then((response) => {
        res.send(response.data)
    }).catch((err) => {
        res.send(err)
    })
}

const getUserRecipe = (userid) => {
    console.log("retrieving recipes that can be made with ingredients in the user's inventory")
}

const getRecipe = (req, res) => {
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
    getRecipe
}