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
    '@type': { type: String, default: 'Comment' },

    text: String,

    // Associer le profil utilisateur
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'  
    },
    parentItem: {
        type: Schema.Types.ObjectId,
        ref: 'post'  
    },

    // Définir une valeur par défaut
    creationDate: { type: Date, default: new Date() },
    dateModified: { type: Date, default: new Date() },
    isPublished: { type: Boolean, default: false }
})
//

/* 
Export
*/
module.exports = mongoose.model('comment', MySchema)
//