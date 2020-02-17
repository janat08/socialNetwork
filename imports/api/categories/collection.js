import CategoriesSchema from './schema.js';

const Categories = new Mongo.Collection('categories');
export default Categories;

Categories.attachSchema(CategoriesSchema);
