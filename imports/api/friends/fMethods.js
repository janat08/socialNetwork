import { Friends, Users } from '../cols.js'

Meteor.methods({
    "friends.insert" ({ firstId, requesteeId, type = 'basic' }) {
        if (this.connection){
            if (this.userId != requesteeId){
                throw new Meteor.Error('500')
            }
        }
        const startDate = new Date()
        const first = Friends.insert({ owner: firstId, target: requesteeId, type, startDate })
        const second = Friends.insert({ owner: requesteeId, target: firstId, type, startDate })
        Users.update(firstId, { $addToSet: { friendIds: first } }) 
        Users.update(requesteeId, { $addToSet: { friendIds: second } })
    }
})
