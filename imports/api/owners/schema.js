import SimpleSchema from 'simpl-schema';
export default new SimpleSchema({
    approved: {
        type: Boolean,
    },
    postId: {
        type: String
    },
    ownerId: {
        type: String
    }
});