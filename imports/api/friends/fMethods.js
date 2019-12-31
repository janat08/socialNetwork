import { Friends, Users, friendTypes } from '../cols.js'

Meteor.methods({
    // "friends.insert" ({ firstId, requesteeId, type = 'friends' }) {
    //     if (this.connection) {
    //         if (this.userId != requesteeId) {
    //             throw new Meteor.Error('500')
    //         }
    //     }
    //     if (friendTypes.indexOf(type) == -1) throw new Meteor.Error('500')

    //     const startDate = new Date()
    //     const first = Friends.insert({ owner: firstId, target: requesteeId, type, startDate })
    //     const second = Friends.insert({ owner: requesteeId, target: firstId, type, startDate })
    //     Users.update(firstId, { $addToSet: { friendIds: first } })
    //     Users.update(requesteeId, { $addToSet: { friendIds: second } })
    // },
    // "friends.typeSelect" ({ _id, selected }) {
    //     if (!this.userId) throw new Meteor.Error("logged out")
    //     if (friendTypes.indexOf(selected) == -1) throw new Meteor.Error('500')
    //     return Friends.update({ _id, owner: this.userId }, { $set: { type: selected } })
    // },
    // "friends.toggleBlock" ({ _id, blocked }) {
    //     if (!this.userId) throw new Meteor.Error("logged out")
    //     return Friends.update({ _id, owner: this.userId }, { $set: { blocked: !blocked } })
    // },
    "friends.typeSelect" ({ targetId, selected }) {
        if (!this.userId) throw new Meteor.Error("logged out")
        if (friendTypes.indexOf(selected) == -1) throw new Meteor.Error('500')
        Users.update({ _id: this.userId, "friends.targetId": targetId }, { $set: { "friends.$.type": selected } })
    },
    "friends.toggleBlock" ({ _id, blocked }) {
        if (!this.userId) throw new Meteor.Error("logged out")
        return Users.update({ _id: this.userId, "friends.targetId": _id }, { $set: { "friends.$.blocked": blocked } })
    }
})
