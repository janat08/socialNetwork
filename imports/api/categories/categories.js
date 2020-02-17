import { Categories } from '../cols.js'

Meteor.methods({
    "categories.upsert" ({oldBot, ...rest}) {
        console.log(oldBot)
        return Categories.upsert({bottom: oldBot? oldBot : false}, {$set: rest})
    },
    "categories.remove" (bottom) {
        Categories.remove({bottom})
    },
})
