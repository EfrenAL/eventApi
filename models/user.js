/**
 * Created by efren on 03/06/17.
 */

var bcrypt = require('bcryptjs');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function (sequelize, DataTypes) {
    var user = sequelize.define('user', {
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        salt:{
            type: DataTypes.STRING
        },
        password_hash: {
            type: DataTypes.STRING
        },
        password:{
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len:[7,100]
            },
            set: function (value) {
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(value,salt);
                this.setDataValue('password',value);
                this.setDataValue('salt',salt);
                this.setDataValue('password_hash',hashedPassword);
            }

        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 50]
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 50]
            }
        },
        company: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 50]
            }
        },
        position: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 50]
            }
        },
        pictureUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 300]
            }
        }
    }, {
        hooks: {
            beforeValidate: function (user, options) {
                //User.email convert to lower case
                if (typeof user.email === 'string'){
                    user.email = user.email.toLowerCase();
                }
            }
        },
        classMethods:{
            authenticate: function (body) {

                return new Promise(function (resolve, reject) {
                    if (typeof body.email !=='string' || typeof body.password !== 'string'){
                        return reject();
                    }

                    user.findOne({
                        where:{
                            email: body.email
                        }
                    }).then(function (user) {
                        if(!user || !bcrypt.compareSync(body.password, user.get('password_hash'))){
                            return reject();
                        }
                        resolve(user);

                    },function (error) {
                        reject();
                    });
                })

            },
            findByToken: function(token){
                return new Promise(function (resolve, reject) {
                    try {
                        console.log('User Token: ' + token + '\n')
                        var decodeJwt = jwt.verify(token, 'qwerty098');
                        var bytes = cryptojs.AES.decrypt(decodeJwt.token, 'abc123!@#!');
                        var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
                        console.log('User Id: ' + tokenData.id + '\n')
                        user.findById(tokenData.id).then(function (user) {
                            if(user){
                                resolve(user);
                            }else{
                                reject();
                            }
                        },function (error) {
                            reject();
                        })

                    }catch(e){
                        reject();
                    }
                });
            }
        },
        instanceMethods: {
            toPublicJSON: function () {
                var json = this.toJSON();
                //return _.pick(json,'id','email','name','description', 'pictureUrl','createdAt','updatedAt');
                return _.pick(json,'id','email','name','description', 'pictureUrl','company','position');
            },
            generateToken: function (type) {
                if(!_.isString(type)){
                    return undefined;
                }
                try {
                    var stringData = JSON.stringify({id: this.get('id'), type: type})
                    var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#!').toString();
                    token = jwt.sign({
                        token: encryptedData
                    }, 'qwerty098');
                    return token;
                }catch (e){
                    return undefined;
                }


            }
        }
    });

    return user;
};