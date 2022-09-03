const express = require('express');
const router = express.Router();

const recipe = require('./controllers/recipeController')
const ingredient = require('./controllers/ingredientController')
const user = require('./controllers/userController');
const { default: axios } = require('axios');
const { response } = require('express');


// home route
router.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});

// router.post('/newuser', createNewUser())

// router.get('/allingredient', getIngredient())
// router.get('/ingredient', (req, res) => {
//     getUserIngredients(res.userid)
//     res.send("temp")
// })
// router.post('/ingredient', (req, res) => {
//     addUserIngredient(req.userid, req.ingredientid)
//     res.send("success")
// })
router.delete('/ingredient', (req, res) => {
    ingredient.deleteUserIngredient(req.headers.userid, req.headers.ingredientid)
    res.send("success")
})

router.get('/searchRecipe', (req, res) => {
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
})

router.get('/userrecipe', (req, res) => {
    res.send(recipe.getUserRecipe(req.headers.userid))
})


router.get('/recipe', (req, res) => {
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
})


module.exports = router;