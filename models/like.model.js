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

    result: Boolean,

    // Associer le profil utilisateur
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'  
    },
    parentItem: {
        type: Schema.Types.ObjectId,
        ref: 'post'  
    },
})
//

/* 
Export
*/
module.exports = mongoose.model('like', MySchema)
//