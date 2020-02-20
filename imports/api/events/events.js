import { Categories, Events } from '../cols.js'

Meteor.methods({
    "events.upsert" ({ top1, bottom1, top2, bottom2, top3, bottom3, title }) {
        console.log(top1, bottom1, top2, bottom2, top3, bottom3,)
        if (!Categories.findOne({ top: top1, bottom: bottom1 })) throw new Meteor.Error('category1 non-existent')
        if (!Categories.findOne({ top: top2, bottom: bottom2 })) throw new Meteor.Error('category2 non-existent')
        if (!Categories.findOne({ top: top3, bottom: bottom3 })) throw new Meteor.Error('category3 non-existent')
        Events.insert({ top1, bottom1, top2, bottom2, top3, bottom3 })
    },
})
