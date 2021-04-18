/* 
Imports
*/
    const Models = require('../models/index');
    const bcrypt = require('bcryptjs');
//

/*  
Controller methods
*/
const register = (req, res) => {
    return new Promise( async (resolve, reject) => {
        const userExists = await Models.user.exists({ email: req.body.email })
        if (!userExists) {
            // Encrypt yser password
            req.body.password = await bcrypt.hash( req.body.password, 10 );
            // TODO: encrypt RGPD data
            try {
                const user = await Models.user.create(req.body)
                const jwt = user.generateJwt(user)
                res.cookie( process.env.COOKIE_NAME, jwt, { maxAge: 700000, httpOnly: false, sameSite :  'none', secure : true} )
                return resolve(user)
            } catch (error) {
                return reject(error)
            }

            // Register new user
            Models.user.create( req.body )
                .then( data => resolve(data) )
                .catch( err => reject(err) );
        } else {
            return reject('Email address already used')
        }
    })
}


    const login = (req, res) => {
        return new Promise( (resolve, reject) => {
            // Find user from email
            Models.user.findOne( { email: req.body.email }, (err, data) => {
                if( err || data === null ){ return reject('Email not found') }
                else{
                    // Check user password
                    const validatedPassword = bcrypt.compareSync( req.body.password, data.password );
                    if( !validatedPassword ){ return reject('Invalid password') }
                    else{
                        // Generate user JWT
                        const userJwt = data.generateJwt(data);
                        // Set response cookie
                        res.cookie( process.env.COOKIE_NAME, userJwt, { maxAge: 700000, httpOnly: false, sameSite :  'none', secure : true } )
                        return resolve(data)
                    };
                }
            })
        })
    }

    const logout = (req, res) => {
        return new Promise( (resolve, reject) => {
            // Set response cookie
            res.cookie.set( process.env.COOKIE_NAME, userJwt, { expires: Date.now() } )

            return resolve(true)
        })
    }
//

/* 
Export controller methods
*/
    module.exports = {
        register,
        login,
        logout
    }
//