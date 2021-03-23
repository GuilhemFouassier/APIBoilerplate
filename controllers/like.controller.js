/* 
Imports
*/
const { models, Model } = require('mongoose');
const Models = require('../models/index');
//

/*  
CRUD methods
*/
    const createOne = req => {
        return new Promise((resolve, reject) => {
            Models.like.create(req.body)
                .then(data => {
                    resolve(data);
                    // Si on possède un champs post
                    if (data.posts != null) {
                        Models[req.query.model].findById(data.posts)
                            .then(post => {
                                post.likes.push(data._id);
                                post.save()
                                    .then(updatedPost => resolve(updatedPost))
                                    .catch(updateError => reject(updateError))
                            })
                            .catch(err => reject(err))
                    } else {
                        // Sinon on possède un champs comment
                        Models[req.query.model].findById(data.comments)
                            .then(comments => {
                                comments.likes.push(data._id);
                                comments.save()
                                    .then(updatedPost => resolve(updatedPost))
                                    .catch(updateError => reject(updateError))
                            })
                            .catch(err => reject(err))
                    }

                })
                .catch(err => reject(err))
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

    const deleteOne = data => {
        return new Promise( (resolve, reject) => {
             // Get comment by ID
             Models.like.findByIdAndDelete( data._id, (err, deleted) => {
                if( err ){ 
                    return reject(err)
                }
                else{
                    Models.post.findById(data.posts)
                    .then( post => {
                        // Delete Comment Id
                        post.likes.pull(data._id) ;
                        // Save post changes
                        post.save()
                        .then( updatedPost => resolve(updatedPost) )
                        .catch( updateError => reject(updateError) )
                    })
                    .catch( err => reject(err) )
                    return resolve(deleted) 
                    }
                })
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
        deleteOne
    }
//