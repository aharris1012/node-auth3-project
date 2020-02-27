const router = require('express').Router();

const Users = require('./userModel.js');

router.get('/', (req, res) =>{
    Users.find()
    .then(users =>{
        res.status(200).json(users);
    })
    .catch(({ name, message ,stack}) =>{res.status(500).json({name, message, stack});
    });
});

module.exports = router;