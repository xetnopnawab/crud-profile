const fs = require('fs');
const path = require('path');
const User = require('../model/userSchema');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../model/keys').url;
const nodemailer = require('nodemailer');
const upload = require('../routes/utility/multimedia').single('avatar');


/**POST /user homepage controller */
exports.homepageRoute = (req, res, next) => {
    res.status(200).json({message: 'Hello from nawab!'});
    };


/**POST /user/signup signup controller */
exports.signupRoute = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(406).json(errors.errors);

    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password});

    User.findOne({username}).
        then( user => {

            if(user) return res.status(302).json({message: 'User already exists'});

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save(). 
                then( user => res.status(201).json({message: 'New user created', user})). 
                catch( err => res.status(500).json({message: 'Internal server problem', error: err}));
                });
            });
        }). 
        catch( err => res.status(500).json({message: 'Internal server problem', error: err}));
    };

    
/**POST /user/signin signin controller */
exports.signinRoute = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(406).json(errors.errors);

    const { username, password } = req.body;
    

    User.findOne({username}).
        then( user => {

            if(!user) return res.status(401).json({message: 'User not found'});

            bcrypt.compare(password, user.password). 
                then( isMatch => {
                    if(!isMatch) return res.status(203).json({message: 'Password incorrect'});
                    
                    const token = jwt.sign({user}, jwtSecretKey, { expiresIn: 3600 });
                    req.header('auth-token', token);
                    res.status(200).json({message: 'Successfully signed in', token});
                });


        }). 
        catch( err => res.status(500).json({message: 'Internal server problem', error: err}));
    };

    
/**POST /user/editprofile editprofile controller */
exports.editprofileRoute = (req, res, next) => {
    
        const { username, email, name, address, contact, gender, about } = req.body;
        const updatedUser = { username, email, name, address, contact, gender, about };

        User.findOneAndUpdate(
                {username: req.user.username},
                { $set: updatedUser },
                { new: true, useFindAndModify: false}
            ).
            then( user => {
                    const token = jwt.sign({user}, jwtSecretKey, { expiresIn: 3600 });
                    req.header('auth-token', token);
                    res.status(200).json({message: 'User details updated', token});
               }). 
            catch( err => res.status(500).json({message: 'Internal server problem', error: err}));
        };


/**POST /user/resetpassword resetpassword controller */
exports.resetpasswordRoute = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(406).json(errors.errors);
    
    const { newpassword, oldpassword } = req.body;
    
    User.findOne({username: req.user.username}).
    then( user => {

        if(!user) return res.status(401).json({message: 'User not found'});

        bcrypt.compare(oldpassword, user.password). 
            then( isMatch => {
                if(!isMatch) return res.status(203).json({message: 'Password incorrect'}); 

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newpassword, salt, (err, hash) => {
                        if(err) throw err;
                        user.password = hash;
                        user.save()
                    res.status(201).json({message: 'Password successfully changed', user});
                });
            });        
        }); 
    }).
    catch( err => res.status(500).json({message: 'Internal server problem', error: err}));
};


/**POST /user/forgetpassword forgetpassword controller */
exports.forgetpasswordRoute = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(406).json(errors.errors);
    
    let password = String(Math.floor(Math.random() * (999999999 - 100000) + 100000));

    User.findOne({email: req.body.email}).
    then( user => {

        if(!user) return res.status(401).json({message: 'User not found'});


        const transporter = nodemailer.createTransport({
           service: 'gmail',
           auth: {
               user: 'dhanesh1296@gmail.com',
               pass: 'Dhanesh1998@'
           }
        });

        const mailOptions = {
            from: '"nawab Inc." <nawab.stack@gmail.com>',
            to: req.body.email.trim(),
            subject: "Auto Generated Password",
            text: `Your Password is: "${password}".` 
        }

        transporter.sendMail(mailOptions, (error, info) => {
                if(error) res.status(500).json({message: 'Internal server problem', error});

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if(err) throw err;
                        user.password = hash;
                        user.save()
                    res.status(201).json({message: 'Password recovered successfully, check your email'});
                });
            });   

        });     
    }).
    catch( err => res.status(500).json({message: 'Internal server problem', error: err}));
};



/**POST /user/deleteprofile deleteprofile controller */
exports.deleteprofileRoute = (req, res, next) => {
    User.findOneAndDelete({username: req.user.username}).
        then( () => res.status(200).json({message: 'User profile deleted'}))
        .catch( err => res.status(500).json({message: 'Internal server problem', error: err}));
};

/**POST /user/uploadimage uploadimag controller */
exports.uploadimageRoute = (req, res, next) => {
    upload(req, res, (err) => {
        if(err) throw err;
        if(req.body.oldavatar !== 'dummy.png') {
            fs.unlinkSync(path.join(__dirname, '..', 'public', 'images', 'uploads', req.body.oldavatar));
        }

        User.findOne({username: req.user.username})
            .then(user => {
                user.avatar = req.file.filename;
                user.save().then( updatedImageUser =>{
                    const token = jwt.sign({user: updatedImageUser}, jwtSecretKey, { expiresIn: 3600 });
                    req.header('auth-token', token);
                    res.status(200).json({message: 'Image uploaded', token});
                } )
            .catch( err => res.status(500).json({message: 'Internal server problem', error: err}));
            })
            .catch( err => res.status(500).json({message: 'Internal server problem', error: err}));
    });
};
