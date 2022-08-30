const express = require('express');
const router = express.Router();

// home route
router.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});

router.post('/newuser', createNewUser())

router.get('/allingredient', getIngredient())
router.get('/ingredient', (req, res) => {
    getUserIngredients(res.userid)
    res.send("temp")
})
router.post('/ingredient', (req, res) => {
    addUserIngredient(req.userid, req.ingredientid)
    res.send("success")
})
router.delete('/ingredient', (req, res) => {
    deleteUserIngredient(req.userid, req.ingredientid)
    res.send("success")
})

router.get('/allrecipe', getAllReciepe)

router.get('/userrecipe', (req, res) => {
    res.send(getUserRecipe(req.userid))
})

router.get('/recipe', (req, res) => {
    res.send(getRecipe(req.recipeId))
})

// // Retrieve all users 
// app.get('/users', function (req, res) {
//     con.query('SELECT * FROM users', function (error, results, fields) {
//         if (error) throw error;
//         return res.send({ error: false, data: results, message: 'users list.' });
//     });
// });

// // Retrieve user with id 
// app.get('/user/:id', function (req, res) {
//     let user_id = req.params.id;
//     if (!user_id) {
//         return res.status(400).send({ error: true, message: 'Please provide user_id' });
//     }
//     con.query('SELECT * FROM users where id=?', user_id, function (error, results, fields) {
//         if (error) throw error;
//         return res.send({ error: false, data: results[0], message: 'users list.' });
//     });
// });

// // Add a new user  
// app.post('/add', function (req, res) {
//     let user = req.body.user;
//     if (!user) {
//         return res.status(400).send({ error: true, message: 'Please provide user' });
//     }
//     con.query("INSERT INTO users SET ? ", { name: user }, function (error, results, fields) {
//         if (error) throw error;
//         return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
//     });
// });

// //  Update user with id
// app.put('/user', function (req, res) {
//     let user_id = req.body.user_id;
//     let user = req.body.user;
//     if (!user_id || !user) {
//         return res.status(400).send({ error: user, message: 'Please provide user and user_id' });
//     }
//     con.query("UPDATE users SET user = ? WHERE id = ?", [user, user_id], function (error, results, fields) {
//         if (error) throw error;
//         return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
//     });
// });

// //  Delete user
// app.delete('/user', function (req, res) {
//     let user_id = req.body.user_id;
//     if (!user_id) {
//         return res.status(400).send({ error: true, message: 'Please provide user_id' });
//     }
//     con.query('DELETE FROM users WHERE id = ?', [user_id], function (error, results, fields) {
//         if (error) throw error;
//         return res.send({ error: false, data: results, message: 'User has been updated successfully.' });

//     })});

module.exports = router;