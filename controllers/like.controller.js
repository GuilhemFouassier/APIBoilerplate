/* 
Imports
*/
const Models = require('../models/index');
//

/*  
CRUD methods
*/
    const createOne = req => {
        return new Promise( (resolve, reject) => {
            Models.like.create( req.body )
            .then( data => {
                resolve(data);
                Models.post.findById( data.parentItem )
                .then( post => {
                    post.likes.push(data._id);
                    post.save()
                    .then( updatedPost => resolve(updatedPost) )
                    .catch( updateError => reject(updateError) )
                })
            .catch( err => reject(err) )
            } )
            .catch( err => reject(err) )
        })
    }
 
    // Find all the comments of the post
    const readAll = req => {
        return new Promise( (resolve, reject) => {
            // Mongoose population to get associated data
            Models.like.find({parentItem: req.params.postId})
            .populate('author', [ '-password' ])
            .populate('parentItem')
            .exec( (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }

    const readOne = id => {
        return new Promise( (resolve, reject) => {
            // Mongoose population to get associated data
            Models.like.findById( id )
            .populate('author', [ '-password' ])
            .populate('parentItem')
            .exec( (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }

    const updateOne = req => {
        return new Promise( (resolve, reject) => {
            // Get post by ID
            Models.like.findById( req.params.id )
            .then( like => {
                // Update object
                like.result = req.body.bool;

                // TODO: Check author
                /* if( post.author !== req.user._id ){ return reject('User not authorized') }
                else{ } */

                // Save post changes
                like.save()
                .then( updatedPost => resolve(updatedPost) )
                .catch( updateError => reject(updateError) )
            })
            .catch( err => reject(err) )
        })
    }

    const deleteOne = req => {
        return new Promise( (resolve, reject) => {
             // Delete object
             Models.like.findByIdAndDelete( req.params.id, (err, deleted) => {
                if( err ){ return reject(err) }
                else{ return resolve(deleted) };
            })
            
            // Get post by ID
            /* Models.post.findById( req.params.id )
            .then( post => {
                // TODO: Check author
                if( post.author !== req.user._id ){ return reject('User not authorized') }
                else{
                    // Delete object
                    Models.post.findByIdAndDelete( req.params.id, (err, deleted) => {
                        if( err ){ return reject(err) }
                        else{ return resolve(deleted) };
                    })
                }
            })
            .catch( err => reject(err) ); */
        });
    }
//

/* 
Export controller methods
*/
    module.exports = {
        readAll,
        readOne,
        createOne,
        updateOne,
        deleteOne
    }
//