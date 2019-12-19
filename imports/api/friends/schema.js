import SimpleSchema from 'simpl-schema';
export default new SimpleSchema({
    type: {
        type: String
    },
    owner: {
        type: String,
        optional: true,
    },
    target: {
        type: String
    }
});