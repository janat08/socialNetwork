import SimpleSchema from 'simpl-schema';
export default new SimpleSchema({
    ownerId: {
        type: SimpleSchema.RegEx.Id
    },
    approved: {
        type: Boolean
    },
    author: {
        type: SimpleSchema.RegEx.Id
    },
    content: {
        type: String,
        optional: true
    },
    imageId: {
        type: SimpleSchema.RegEx.Id,
        optional: true,
    }
})
