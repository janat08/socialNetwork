import { Posts, Users, Friends } from '../cols.js'

Meteor.methods({
    //you can message to type of friends by using friendIds = ['friends']
    "posts.insert" ({ friendIds, authorId, instanceIds, ...rest }) {
        if (this.connection) {
            authorId = this.userId
        }
        const user = Users.findOne(authorId)
        if (['family', 'besties', 'colleague', 'friends'].indexOf(friendIds[0]) != -1) {
            const u = user
            if (u && u.friends) {
                friendIds = u.friends.filter(x => !!friendIds.filter(y => {
                    const a = x.type == y
                    return a
                }).length).map(x => x.targetId)
            }
            else {
                throw new Meteor.Error('login or add friends first before posting')
            }
        }
        const post = { authorId, ...rest }
        if (instanceIds) post.instanceIds = instanceIds
        console.log(post)
        const postId = Posts.insert(post)
        const ids = user.friends.map(x => x.targetId)
        friendIds.filter(x => {
            return ids.indexOf(x) == -1 ? false : true
        }).map(x => {
            const user = Users.findOne(x)._id
            return Meteor.call('owners.insert', { ownerId: user, postId, authorId })
        })
    },
})

// Meteor.call('events.upsert', {type: false,
// frontCover: "dejKyPn4C6nviMySe",
// images: [],
// _id: "FDoMiDst3Npnurbdd",
// publicity: false,
// family: "on",
// besties: "on",
// friends: "on",
// colleague: "on",
// title: "aaaa",
// description: "ffffffff",
// eventType: "periodical",
// childrenPrice: "",
// adultPrice: "",
// adultAge: "",
// seniorPrice: "",
// seniorAge: "",
// top1: "asdf",
// bottom1: "asdf",
// top2: "asdf",
// bottom2: "asdf",
// top3: "asdf",
// bottom3: "asdf",
// "route(street)": "",
// street_number: "",
// postal_code: "",
// formatted_address: "",
// lng: "",
// locations: "",
// bounds: "",
// locality: "",
// sublocality: "",
// country: "",
// administrative_area_level_2: "",
// lat: ""})
