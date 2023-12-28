const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("INCORRECT DATA SUBMISSION");
  }

  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((loginInfo) => {
      const isValid = bcrypt.compareSync(password, loginInfo[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("Unable to get user"));
      } else {
        res.status(400).json("INCORRECT EMAIL/PASSWORD");
      }
    })
    .catch((err) => res.status(400).json("INCORRECT EMAIL/PASSWORD"));
};

module.exports = {
  handleSignin,
};
