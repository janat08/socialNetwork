// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ImagesFiles, Users, ImagesCollection } from '../cols.js';

Meteor.methods({
  'images.remove'(id) {
    check(id, String)
    const userId = ImagesFiles.findOne(id).userId
    if (userId) Users.update(this.userId, { $unset: {"profile.avatar": ""} })
    return ImagesFiles.remove(id);
  },
});
