import { Categories, Events } from '../cols.js'

Meteor.methods({
    "events.upsert" ({ top, bottom, ...rest }) {
        if (!Categories.findOne({ top, bottom })) throw new Meteor.Error('category non-existent')
        console.log('inserting')
        Events.insert({ top, bottom, ...rest })
        console.log(Events.findOne(), { top, bottom, ...rest })
    },
})
