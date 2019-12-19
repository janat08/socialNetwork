import {Posts} from '../cols.js'

Meteor.methods({
    "posts.insert"({ownerIds, authorId, ...rest}){
        const postId = Posts.insert({ownerIds, authorId, ...rest})
        ownerIds.forEach(x=>{
            Meteor.call('owners.insert', {owner: x, postId})
        })
    }
})