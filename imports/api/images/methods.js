// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ImagesFiles, Auctions } from '../cols.js';

Meteor.methods({
  'images.remove'(id) {
    check(id, String)
    const auctionId = ImagesFiles.findOne(id).meta.auctionId
    if (auctionId) Auctions.update(auctionId, { $pull: { imageIds: id } })
    return ImagesFiles.remove(id);
  },
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
                FilesCollection.remove(cursor.fetch().filter(y => y._id != x.profile.avatar))
            }
        })
    }
});
