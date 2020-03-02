import { ImagesFiles, ImagesCollection, Users, Events, Tickets, Instances } from './cols.js'
import moment from 'moment'

SyncedCron.add({
    name: 'deleteEvents',
    schedule: function(parser) {
        return parser.text('every day')
    },
    job: function() {
        console.log('removing')
        const query = {start: true, date: {$lte: moment().subtract(1, 'days').toDate()}}
        const ids = Events.find(query).fetch().map(x=>x._id)
        ImagesFiles.remove({"meta.eventId": {$in: ids}})
        Events.remove(query)
    }
});

SyncedCron.add({
    name: 'deleteUnboughtTickets',
    schedule: function(parser) {
        return parser.text('every day')
    },
    job: function() {
        Tickets.remove({paid: false, date: {$lte: moment().subtract(1, 'days').toDate()}})
    }
});

SyncedCron.add({
    name: 'deleteImages',
    schedule: function(parser) {
        return parser.text('every day')
    },
    job: function() {
        Users.find({ "profile.avatar": { $exists: true } }).fetch().map(x => {
            const cursor = ImagesCollection.find({ "meta.uploader": x._id })
            if (cursor.count() > 1) {
                ImagesFiles.remove(cursor.fetch().filter(y => y._id != x.profile.avatar))
            }
        })
    }
});

SyncedCron.start()