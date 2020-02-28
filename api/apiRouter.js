const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const Users = require('../users/userModel.js');
const { jwtSecret } = require('../config/secrets');
const restricted = require('./restrictedMiddleware');


const usersRouter = require('../users/userRouter.js');
router.use('/users',  restricted,  usersRouter); 

function checkDepartment(department) {
    return (req, res, next) => {
      if (
        req.decodedToken &&
        req.decodedToken.department &&
        req.decodedToken.department.toLowerCase() === department
      ) {
        next();
      } else {
        res.status(403).json({ you: "shall not pass!" });
      }
    };
  }

router.get('/', (req, res) =>{
    res.send('Connected')
});

router.post("/register", (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10); 
    user.password = hash;
  
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });


router.post('/login', (req, res) =>{
    let { username, password } = req.body;
    console.log(username)
    
    Users.findBy({username})
    .first()
    .then(user =>{
        if(user && bcrypt.compareSync(password, user.password)) {
           const token = generateToken(user);

            res.status(200).json({ message: `Welcome ${user.username}!`, token });
        } else {
            res.status(401).json({message: 'Invalid Credentials'})
        }
    })
    .catch(({ name, message ,stack}) =>{res.status(500).json({name, message, stack})})
})



module.exports = router;

function generateToken(user) {
    const payload= {
        subject: user.id,
        username: user.username,
        department: user.department || 'user',
    }

    const options = {
        expiresIn: '2h',
    }
    return jwt.sign( payload, jwtSecret, options)
}