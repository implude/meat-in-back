import { list } from "@keystone-next/keystone";
import { text, password, relationship, timestamp } from "@keystone-next/keystone/fields";

export const User = list({
    fields: {
        name: text({ validation: { isRequired: true } }),
        photo: text({ validation: { isRequired: true } }),
        email: text({
            validation: { isRequired: true },
            isIndexed: 'unique',
            isFilterable: true,
        }),
        password: password({ validation: { isRequired: true } }),
        uploaded_posts: relationship({ ref: 'Post.author', many: true }),
        uploaded_recipe: relationship({ ref: 'Recipe.author', many: true }),
        rep_badge: relationship({ ref: 'Badge' }),
        badge_list: relationship({ ref: 'Badge.owner', many: true }),
        hearted_post: relationship({
            ref: "Post.hearted_user",
            many: true
        }),
        hearted_recipe: relationship({
            ref: "Recipe.hearted_user",
            many: true
        }),
        uploaded_comment: relationship({
            ref: "Comment.author",
            many: true
        }),
        bookmarked_post: relationship({
            ref: "Post.bookmarked_user"
        }),
        bookmarked_recipe: relationship({
            ref: "Recipe.bookmarked_user"
        }),
        created_at: timestamp({ db: { updatedAt: true } })
    },
    ui: {
        listView: {
            initialColumns: ['name', 'uploaded_posts'],
        },
    },
})
