// exports.createNewUser = (req, res) => {
//   let userid = req.body.userid;
//   if (!userid) {
//     return res
//       .status(400)
//       .send({ error: true, message: "Please provide userid" });
//   }
//   con.query(
//     "INSERT INTO users SET userid=? ",
//     [userid],
//     function (error, results, fields) {
//       if (error) throw error;
//       return res.send({
//         error: false,
//         data: results,
//         message: "success",
//       });
//     }
//   );
// };

const createNewUser = (req, res) => {
  var con = require("../utility/dbconfig");
  let userid = req.body.userid;
  let name = req.body.name;
  if (!userid || !name) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide userid and name of user" });
  }
  con.query(
    "INSERT INTO users SET userid=?, name=? ",
    [userid, name],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        message: "success",
      });
    }
  );
};

module.exports = { createNewUser };
