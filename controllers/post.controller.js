/* 
Imports
*/
    const { comment } = require('../models/index');
const Models = require('../models/index');
//

/*  
CRUD methods
*/
    const createOne = req => {
        return new Promise( (resolve, reject) => {
            Models.post.create( req.body )
            .then( data => resolve(data) )
            .catch( err => reject(err) )
        })
    }
 
    const readAll = () => {
        return new Promise( (resolve, reject) => {
            // Mongoose population to get associated data
            Models.post.find()
            .populate('author', [ '-password' ])
            .populate('comments')
            .exec( (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }

    const readOne = id => {
        return new Promise( (resolve, reject) => {
            // Mongoose population to get associated data
            Models.post.findById( id )
            .populate('author', [ '-password' ])
            .populate({
                path: 'comments',  
                populate: { path: 'author' },
                populate: { path : 'likes'}

            })
            .populate('likes')
            .exec( (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }

    const updateOne = req => {
        return new Promise( (resolve, reject) => {
            // Get post by ID
            Models.post.findById( req.params.id )
            .then( post => {
                // Update object
                post.headline = req.body.headline;
                post.body = req.body.body;
                post.dateModified = new Date();

                if( `${req.user._id}` !== `${post.author._id}` ){ return reject('User not authorized') }
                else{ 
                    // Save post changes
                    post.save()
                    .then( updatedPost => resolve(updatedPost) )
                    .catch( updateError => reject(updateError) )
                }
            })
            .catch( err => reject(err) )
        })
    }

    const deleteOne = req => {
        return new Promise( (resolve, reject) => {
            Models.post.findById(req.params.id)
            .populate('author', [ '-password' ])
            .then( post => {
                if( `${req.user._id}` !== `${post.author._id}` ){
                    return reject('User not authorized') 
                }
                else{
                    Models.post.findByIdAndDelete( req.params.id, (err, deleted) => {
                    if( err ){ 
                        return reject(err)
                    }
                    else{
                        Models.comment.find({posts : req.params.id})
                        .then(comments => {
                            comments.forEach( data => {
                                Models.like.deleteMany({comments : data._id}, (err, deleted) => {
                                    if( err ){ 
                                        return reject(err) 
                                    }
                                    else{
                                        return resolve(deleted) 
                                    }
                                })
                            })
                            Models.comment.deleteMany({posts : req.params.id}, (err, deleted) => {
                                if( err ){ 
                                    return reject(err) 
                                }
                                else{
                                    return resolve(deleted) 
                                }
                            })
                        })
                        .catch(err => reject(err))
                        Models.like.deleteMany({posts : req.params.id}, (err, deleted) => {
                            if( err ){ 
                                return reject(err) 
                            }
                            else{
                                return resolve(deleted) 
                            }
                        })
                        return resolve(deleted) 
                    }
                })
                }
            })
            .catch( err => {
                reject(err)
            } );
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