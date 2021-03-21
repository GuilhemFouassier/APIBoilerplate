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
            Models.comment.create( req.body )
            .then( data => {
                resolve(data);
                Models.post.findById( data.parentItem )
                .then( post => {
                    post.comments.push(data._id);
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
            Models.comment.find({parentItem: req.params.postId})
            .populate('author', [ '-password' ])
            .exec( (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }

    const readOne = id => {
        return new Promise( (resolve, reject) => {
            // Mongoose population to get associated data
            Models.comment.findById( id )
            .populate('author', [ '-password' ])
            .exec( (err, data) => {
                console.log(data)
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }

    const updateOne = req => {
        return new Promise( (resolve, reject) => {
            // Get post by ID
            Models.comment.findById( req.params.id )
            .then( comment => {
                // Update object
                comment.headline = req.body.text;

                // TODO: Check author
                /* if( post.author !== req.user._id ){ return reject('User not authorized') }
                else{ } */

                // Save post changes
                comment.save()
                .then( updatedPost => resolve(updatedPost) )
                .catch( updateError => reject(updateError) )
            })
            .catch( err => reject(err) )
        })
    }

    const deleteOne = req => {
        return new Promise( (resolve, reject) => {
             // Delete object
             Models.comment.findByIdAndDelete( req.params.id, (err, deleted) => {
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