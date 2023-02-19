const User = require('../models/usersDB');
const bcrypt = require('bcryptjs');
const validateMe = require('../utils/validations');
const auth = require('../utils/auth');
const cl = require('../utils/logAlias');

const userLogin = async(req, res)=>{
    let body = req.body;
    //check if existing email
    const checkData = await User.findOne({email: req.body.email})
        if(!checkData) return res.status(400).render("login",{title: 'Login', message: 'Email or Password is incorrect'});
    //validate password
    const userPass = await bcrypt.compare(req.body.password, checkData.password)
        if(!userPass) return res.status(400).render("login",{title: 'Login', message: 'Email or Password is incorrect'});
    const token = auth.genToken({username: checkData.username, email: checkData.email});
    // Store JWT token in a cookie
    res.cookie("token", token, { httpOnly: true });
    res.status(200).redirect("/library");
    cl("Login Success!\nToken Granted To: "+checkData.username);
}

const userLogout = (req, res)=>{
res.clearCookie('token');
cl({ message: 'Logout successful' });
res.status(200).redirect('/library');
}

const userLoginHome = (req, res)=>{
    res.render("login", {title: 'Login', message: false });
}

const userRegHome = (req, res)=>{
    res.render("register", {title: 'Register', message: false });
}
const userReg =  async(req, res)=>{
    //validate registration
    const validateData = validateMe.checkReg.validate(req.body);
        if(validateData.error) return res.status(400).render('register',{title: 'Register', message: validateData.error.details[0].message});
    //check if user name exist
    const userName = await User.findOne({username: req.body.username}); 
        if(userName) return res.status(400).render('register',{title: 'Register', message:`Choose another username!`}); 
    //check if email exist
    const userEmail = await User.findOne({email: req.body.email});
        if(userEmail) return res.status(400).render('register',{title: 'Register', message:`Email exists, Please Login!`}); 
    //Encrypt Password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
        username: req.body.username,
        password: hashedPass,
        email: req.body.email
    });
    try {
        await newUser.save();
        console.log('New User Added!');
        res.status(201).redirect('/login');
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {userLogin, userLogout, userReg, userLoginHome, userRegHome}