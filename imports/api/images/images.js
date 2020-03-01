// Definition of the links collection

import { Mongo } from 'meteor/mongo';
import { FilesCollection } from 'meteor/ostrio:files';
import { Users } from '../cols.js'

export const ImagesCollection = new Mongo.Collection('images')
var config = {
    collection: ImagesCollection
}
if (!Meteor.isProduction) {
    Object.assign(config, { storagePath: "C:\shop_pix" })
}
// if (!Meteor.isProduction) {
//     Object.assign(config, { storagePath: "/home/ubuntu/environment/images" })
// }
export const ImagesFiles = new FilesCollection(config);

