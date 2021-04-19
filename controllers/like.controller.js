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
                    if (data.post != null) {
                        Models.post.findById(data.post)
                            .then(post => {
                                post.likes.push(data._id);
                                post.save()
                                    .then(updatedPost => resolve(updatedPost))
                                    .catch(updateError => reject(updateError))
                            })
                            .catch(err => reject(err))
                    } else if (data.comment != null) {
                        // Sinon on possède un champs comment
                        Models.comment.findById(data.comment)
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

    const deleteOne = req => {
        return new Promise( (resolve, reject) => {
             // Get Like by ID
             Models.like.findById( req.params.id )
             .populate('author', [ '-password' ])
            .then( data => {
                if( `${req.user._id}` !== `${data.author._id}` ){
                    return reject('User not authorized') 
                }
                else{
                    Models.like.findByIdAndDelete( req.params.id, (err, deleted) => {
                    if( err ){ 
                        return reject(err)
                    }
                    else{
                        if(data.post){
                            Models.post.findById(data.post)
                        .then( post => {
                            // Delete Comment Id
                            post.likes.pull(data._id) ;
                            // Save post changes
                            post.save()
                            .then( updatedPost => resolve(updatedPost) )
                            .catch( updateError => reject(updateError) )
                        })
                        .catch( err => reject(err) )
                        }else if(data.comment){
                            Models.comment.findById(data.comment)
                        .then( comment => {
                            // Delete Comment Id
                            comment.likes.pull(data._id) ;
                            // Save post changes
                            comment.save()
                            .then( updatedPost => resolve(updatedPost) )
                            .catch( updateError => reject(updateError) )
                        })
                        }
                        
                        
                        return resolve(deleted) 
                        }
                    })
                }
            })
            .catch( err => reject(err) ); 
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