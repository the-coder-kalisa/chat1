const { register, login, setAvatar, allusers } = require('../controllers/userController');

const router = require('express').Router();
router.post('/register', register);
router.post('/login', login);
router.post('/setAvatar/:id', setAvatar);
router.get('/allusers', allusers);
module.exports = router;
