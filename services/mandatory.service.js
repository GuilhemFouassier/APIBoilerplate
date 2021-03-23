/* 
Definition
*/
    const Mandatory = {
        register: [ 'givenName', 'familyName', 'password', 'email' ],
        login: [ 'password', 'email' ],
        post: [ 'headline', 'body' ],
        comment: [ 'text', 'posts' ],
        like : ['posts']
    } 
//

/* 
Export
*/ 
    module.exports = Mandatory;
//