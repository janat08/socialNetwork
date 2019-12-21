import { Friends, Users } from '../cols.js'

Meteor.methods({
    "friends.insert" ({ firstId, requesteeId, type = 'basic' }) {
        if (this.connection){
            if (this.userId != requesteeId){
                throw new Meteor.Error('500')
            }
        }
        const first = Friends.insert({ owner: firstId, target: requesteeId, type })
        const second = Friends.insert({ owner: requesteeId, target: firstId, type })
        Users.update(firstId, { $addToSet: { friendIds: first } }) 
        Users.update(requesteeId, { $addToSet: { friendIds: second } })
    }
})
