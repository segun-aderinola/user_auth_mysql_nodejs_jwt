const express = require('express');
const {signup, login, updateUser, getUser, deleteUser} = require('../controllers/user_auth');
const welcomePage = require('../controllers/welcome');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.get('/', getUser)
router.delete('/:id', deleteUser)
router.put('/:id', updateUser)
router.get('/welcome', verifyToken, welcomePage)

module.exports = router;