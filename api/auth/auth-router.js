const bcrypt = require('bcrypt')
const router = require("express").Router();
const { checkUsernameExists, validateRoleName } = require('./auth-middleware');
const Users = require('../users/users-model.js')
const jwt = require('jsonwebtoken');
// require JWT_SECRET from .env file // use this secret!

router.post("/register", async (req, res, next) => {
  try {
    const { username, password, role_id } = req.body;
    const existingUser = await Users.findBy({ username }).first();
    if(existingUser != null){
      res.status(404).json({message: 'username already exists'})
     
      return;
    }
    const hash = bcrypt.hashSync(password, 10)
 Users.add({username, password, role_id})
    res.status(200).json({message: `You are Now Registered, ${username}!`})
  } catch (error) {
    next(error)
  }
  /**
    [POST] /api/auth/register { "username": "anna", "password": "1234", "role_name": "team lead" }

    response:
    status 201
    {
      "user"_id: 3,
      "username": "anna",
      "role_name": "team lead"
    }
   */
});


router.post("/login",  async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const existingUser = await Users.findBy({ username }).first();
    if(existingUser == null) {
      res.status(400).json({message: "username Does not Exist"});
        return;
    }

    if(bcrypt.compareSync(password, existingUser.password) == false) {
      res.status(400).json({message: "Invalid Credentials"})
        return;
    }

    //Give user a token
    const token = generateToken(existingUser)
    console.log("token", token)

    //Add user to ther Session
    req.session.user = existingUser;

    res.status(200).json({ 
      message: `Welcome back, ${username}!`,
      Token: token
    });

} catch(err) {
  next(err);
}
  //Create Token
  function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        password: user.password
    };

    const options = {
        expiresIn: '5m'
    }
    const JWT_SECRET = "sirwayn"
    return jwt.sign(payload, JWT_SECRET, options)
}

  /**
    [POST] /api/auth/login { "username": "Hamdi", "password": "1234" }

    response:
    status 200
    {
      "message": "Hamdi is back!",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ETC.ETC"
    }

    The token must expire in one day, and must provide the following information
    in its payload:

    {
      "subject"  : 1       // the user_id of the authenticated user
      "username" : "hamdi"   // the username of the authenticated user
      "role_name": "instructor" // the role of the authenticated user
    }
   */
});

module.exports = router;
