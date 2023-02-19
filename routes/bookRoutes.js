const router = require('express').Router();
const verify = require('../utils/auth').checkToken
const booksCon = require('../controllers/booksCon');
const userCon = require('../controllers/userCon');

//Login
router.post('/login', userCon.userLogin);
router.get('/login', userCon.userLoginHome);
//Register
router.post('/register', userCon.userReg);
router.get('/register', userCon.userRegHome);
//Logout
router.get('/library/logout', userCon.userLogout);
//View book
router.get('/library/view/:id', booksCon.books_view)
//Delete book
router.post('/library/del/:id', verify, booksCon.books_delete)
//Get book by id
router.get('/library/edit/:id', verify, booksCon.books_edit)
//Update book by id
router.post('/library/edit/:id', verify, booksCon.books_toEdit)
//Library Page / Get all
router.get('/library', booksCon.books_library)
//Add book
router.post('/library', verify, booksCon.books_add)

//Index/Landing page
router.get('/', (req, res)=>{
    res.render('index', {title:'Home'});
});
router.get('/index', (req, res)=>{
    res.render('index', {title:'Home'});
});
//About Page
router.get('/about', (req, res)=>{
    res.render('about', {title:'about'});
});

module.exports = router;