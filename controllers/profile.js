const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({
      id,
    })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json("NO USER FOUND");
      }
    })
    .catch((err) => {
      res.status(404).json("ERROR GETTING USER");
    });
};

module.exports = {
  handleProfileGet,
};
