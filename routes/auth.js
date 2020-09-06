/* 
    path: /api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { createUser, login, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();



router.post('/new', [
    check('name','Name is required').notEmpty(),
    check('password','Password is required').notEmpty(),
    check('email','Email is required').not().isEmpty(),
    check('email','Must be a valid email').isEmail(),
    
    validateFields,
] ,createUser );

router.post('/', [
    check('email','Email is required').not().isEmpty(),
    check('email','Must be a valid email').isEmail(),
    check('password','Password is required').notEmpty(),
    
    validateFields,
] ,login );

router.get('/renew', validateJWT, renewToken);




module.exports = router;


