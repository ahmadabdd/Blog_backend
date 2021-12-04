const process = require('process');
const models = require('../models');
const bcryptjs = require('bcryptjs');
const Validator = require('fastest-validator');

const jwt = require('jsonwebtoken');

function signUp(req, res) {

    models.User.findOne({where: {email:req.body.email}}).then(result => {
        if(result) {
            res.status(409).json({
                message: "Email already exists."
            });
        } else {
            bcryptjs.genSalt(10, function(err, salt) {
                bcryptjs.hash(req.body.password, salt, function(err, hash) {
                    const user = {
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    }

                    const schema = {
                        name: {type: "string", optional: false, min: "5",max: "25"},
                        email: {type: "email", optional: false},
                        password: {type: "string", optional: false},
                    }
                
                    const v = new Validator();
                    const validationResponse = v.validate(user, schema);
                
                    if (validationResponse !== true) {
                        return res.status(400).json({
                            message: "Validation failed",
                            error: validationResponse
                        });
                    }                
                
                    models.User.create(user).then(result => {
                        res.status(200).json({
                            message: "Signed-up  successfully.",
                        })
                    }).catch(error => {
                        res.status(500).json({
                            message: "Something went wrong."
                        });
                    });
                });
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong."
        });
    })
}

function login(req, res) {
    models.User.findOne({where:{email: req.body.email}}).then(user => {
        if (user === null) {
            res.status(401).json({
                message: "Invalid credentials."
            });
        } else {
            bcryptjs.compare(req.body.password, user.password, function(err, result) {
                if (result) {
                    const token = jwt.sign({
                        email: user.email,
                        userID: user.id,
                    }, "secret", function(err, token) {
                        res.status(200).json({
                            message: "Authentication successfull",
                            token: token
                        });
                    });
                } else {
                    res.status(401).json({
                        message: "Invalid credentials."
                    });
                }
            });
        }
    }).catch(errer => {
        res.status(500).json({
            message: "Something went wrong."
        });
    })
}

module.exports = {
    signUp: signUp,
    login: login
}