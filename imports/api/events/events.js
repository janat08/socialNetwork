import { ImagesFiles, Categories, Events, Tickets } from '../cols.js'

Meteor.methods({
    "events.upsert" ({ top1, bottom1, top2, bottom2, top3, bottom3, images, frontCover, ...rest }) {
        // images length
        console.log('remove excess images', images[0])
        const limitedImages = images.filter((x,i)=>i<11||x.doc._id==frontCover).map(x=>x.doc._id)
        images.filter((x,i)=>i>10||x.doc._id!=frontCover).forEach(x=>ImagesFiles.remove(x.doc._id))
        if (!Categories.findOne({ top: top1, bottom: bottom1 })) throw new Meteor.Error('category1 non-existent')
        if (!Categories.findOne({ top: top2, bottom: bottom2 })) throw new Meteor.Error('category2 non-existent')
        if (!Categories.findOne({ top: top3, bottom: bottom3 })) throw new Meteor.Error('category3 non-existent')
        Events.insert({ top1, bottom1, top2, bottom2, top3, bottom3, ...rest, limitedImages, frontCover, userId: this.userId })
    },
    "instance.add" (event) {
        try {
            return Events.insert(event);
        }
        catch (exception) {
            throw new Meteor.Error('500', `${ exception }`);
        }
    },
    "instance.edit" (event) {
        try {
            return Events.update(event._id, {
                $set: event
            });
        }
        catch (exception) {
            throw new Meteor.Error('500', `${ exception }`);
        }
    },
    "instance.remove" (event) {
        try {
            return Events.remove(event);
        }
        catch (exception) {
            throw new Meteor.Error('500', `${ exception }`);
        }
    },
    "ticket.buy"(all){
        all.eventId = all._id
        delete all._id
        if (!this.userId) throw new Meteor.Error('login')
        return Tickets.insert({...all, userId: this.userId, paid: false})
    },
    "ticket.accept"(id){
        console.log(id)
        return Tickets.update(id, {$set: {paid: true}})
    }
})
