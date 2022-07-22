// require JWT_SECRET from .env file // use this secret!
// require DB to get the user information
const jwt = require('jsonwebtoken');
const Users = require('../users/users-model');
const db = require('../../data/db-config.js')
const JWT_SECRET = "sirwayn";

const restricted = (req, res, next) => {
const token = req.headers.authorization;
    console.log("RESITERED FUN")
    if (token) {
        console.log("TOKEN SUCCES")
        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if(err != null) {
                res.status(401).json({ message: 'access is restricted' });
                return;
            }

            const user = await Users.findById(decoded.subject);
            console.log("USER", user)
            if (user == null) {
                res.status(401).json({ message: 'access is restricted' });
                return;
            }
            
            console.log("decoded", decoded)
            req.decodedJwt = decoded
            console.log("req.decodedJwt", req.decodedJwt)
            next();

        })
    }
  /*
    If the user does not provide a token in the Authorization header:
    status 401
    {
      "message": "Token required"
    }

    If the provided token does not verify:
    status 401
    {
      "message": "Token invalid"
    }

    Put the decoded token in the req object, to make life easier for middlewares downstream!
  */
}

const checkRoleType = role_name => (req, res, next) => {
  /*
    If the user does not provide a token in the Authorization header with a role_name
    inside its payload matching the role_name passed to this function as its argument:
    status 403
    {
      "message": "This is not for you"
    }

    Pull the decoded token from the req object, to avoid verifying it again!
  */
}


const checkUsernameExists = (req, res, next) => {
  const {username, password} = req.body;
  const existinUser = Users.findBy({username}).first();
  if(existinUser == null){
   res.status(400).json({message: "username Does not Exist"})
    return;
  }
  next();
  /*
    If the username in req.body does NOT exist in the database
    status 401
    {
      "message": "Invalid credentials"
    }
  */
  }


const validateRoleName = (req, res, next) => {
  /*
    If the role_name in the body is valid, set req.role_name to be the trimmed string and proceed.

    If role_name is missing from req.body, or if after trimming it is just an empty string,
    set req.role_name to be 'student' and allow the request to proceed.

    If role_name is 'admin' after trimming the string:
    status 422
    {
      "message": "Role name can not be admin"
    }

    If role_name is over 32 characters after trimming the string:
    status 422
    {
      "message": "Role name can not be longer than 32 chars"
    }
  */
}

module.exports = {
  restricted,
  checkUsernameExists,
  validateRoleName,
  checkRoleType,
}
