var con = require("../utility/dbconfig");

const recordWaste = (record) => {
    return new Promise((resolve, reject) => {
        if (!record) reject({ error: true, message: "please provide the required paramters" })
        con.query("INSERT INTO discard SET userid=?, name=?, ingredientid=? ,expiry=?, quantity=?, category=?", [record.userid, record.name, record.ingredientid, record.expiry, record.quantity, record.category],
            (error, results, fields) => {
                if (error) reject(error)
                console.log(results)
                resolve("success")
            }
        )
    })
}

const getStats = (userid) => {
    return new Promise((resolve, reject) => {
        if (!userid) reject({ error: true, message: "please provide the required paramters" })
        con.query("SELECT * FROM discard WHERE userid=?", [userid],
            (error, results, fields) => {
                if (error) reject(error)
                resolve(results)
            }
        )
    })
}
module.exports = {
    recordWaste,
    getStats
}