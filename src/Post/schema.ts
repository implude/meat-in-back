import { list } from "@keystone-next/keystone";
import { text, json, relationship, timestamp } from "@keystone-next/keystone/fields";

export const Post = list({
    fields: {
        title: text({ validation: { isRequired: true } }),
        photo: json(),
        content: text({
            ui: {
                displayMode: "textarea"
            },
            validation: {
                isRequired: true
            }
        }),
        author: relationship({
            ref: 'User.uploaded_posts',
            ui: {
                displayMode: 'cards',
                cardFields: ['name', 'email'],
                inlineEdit: { fields: ['name', 'email'] },
                linkToItem: true,
                inlineCreate: { fields: ['name', 'email'] },
            },
        }),
        hearted_user: relationship({
            ref: "User.hearted_post",
            many: true
        }),
        linked_recipe: relationship({
            ref: "Recipe.linked_post"
        }),
        bookmarked_user: relationship({
            ref: "User.bookmarked_post",
            many: true
        }),
        comment: relationship({
            ref: "Comment.post",
            many: true
        }),
        created_at: timestamp({ db: { updatedAt: true } })
    },
})
