/* 
Definition
*/
    const Mandatory = {
        register: [ 'givenName', 'familyName', 'password', 'email' ],
        login: [ 'password', 'email' ],
        post: [ 'headline', 'body' ],
        comment: [ 'text', 'parentItem' ]
    } 
//

/* 
Export
*/ 
    module.exports = Mandatory;
//