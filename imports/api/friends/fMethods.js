import { Friends, Users } from '../cols.js'

Meteor.methods({
    "friends.insert" ({ firstId, secondId, type = 'basic' }) {
        const first = Friends.insert({ owner: firstId, target: secondId, type })
        const second = Friends.insert({ owner: secondId, target: firstId, type })
        Users.update(firstId, { $addToSet: { friendsIds: first } })
        Users.update(secondId, { $addToSet: { friendsIds: second } })
    }
})
