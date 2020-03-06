import CategoriesSchema from './schema.js';

const Categories = new Mongo.Collection('categories');
if (Meteor.isServer) {
    Categories._ensureIndex({ bottom: 1 }, { unique: true })
}
export default Categories;

Categories.attachSchema(CategoriesSchema);
