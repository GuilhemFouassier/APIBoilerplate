/* 
Definition
*/
    const Mandatory = {
        register: [ 'givenName', 'familyName', 'password', 'email' ],
        login: [ 'password', 'email' ],
        post: [ 'headline', 'body' ],
        comment: [ 'text', 'posts' ],
        like: []
    } 
//

/* 
Export
*/ 
    module.exports = Mandatory;
//