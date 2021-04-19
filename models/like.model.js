/*
Import
*/
const mongoose = require('mongoose');
const { Schema } = mongoose;
//

/*
Definition
*/
const MySchema = new Schema({
    // Schema.org
    '@context': { type: String, default: 'http://schema.org' },
    '@type': { type: String, default: 'LikeAction' },

    // Associer le profil utilisateur
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'  
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post'  
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'comment'  
    }
})
//

/* 
Export
*/
module.exports = mongoose.model('like', MySchema)
//