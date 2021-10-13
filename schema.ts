import { list } from '@keystone-next/keystone';
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  integer,
  json,
} from '@keystone-next/keystone/fields';
import { document } from '@keystone-next/fields-document';

export const lists = {
  User: list({
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
  }),
  Badge: list({
    fields: {
      image: text({ validation: { isRequired: true } }),
      label: text({ validation: { isRequired: true } }),
      description: text({ validation: { isRequired: true } }),
      owner: relationship({
        ref: 'User.badge_list',
      })
    }
  }),
  Post: list({
    fields: {
      title: text({ validation: { isRequired: true } }),
      photo: json(),
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
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
  }),
  Difficulty: list({
    fields: {
      label: text({ validation: { isRequired: true } }),
      numeric_level: integer({ validation: { isRequired: true } }),
    }
  }),
  MeatType: list({
    fields: {
      label: text({ validation: { isRequired: true } })
    }
  }),
  Recipe: list({
    fields: {
      "thumbnail": text({ validation: { isRequired: true } }),
      "name": text({ validation: { isRequired: true } }),
      "description": text({ validation: { isRequired: true } }),
      "author": relationship({
        ref: 'User.uploaded_recipe',
      }),
      "duration": integer({ validation: { isRequired: true } }),
      "difficulty": relationship({
        ref: 'Difficulty',
      }),
      "hearted_user": relationship({
        ref: 'User.hearted_recipe',
        many: true
      }),
      "youtube": text({ validation: { isRequired: true } }),
      "ingredient": json(),
      "linked_post": relationship({
        ref: 'Post.linked_recipe',
        many: true
      }),
      created_at: timestamp({ db: { updatedAt: true } }),
      "meat_type": relationship({
        ref: "MeatType",
      }),
      bookmarked_user: relationship({
        ref: "User.bookmarked_recipe",
        many: true
      }),
      "steps": json()
    }
  }),
  Comment: list({
    fields: {
      content: text({ validation: { isRequired: true } }),
      author: relationship({
        ref: "User.uploaded_comment"
      }),
      post: relationship({
        ref: "Post.comment"
      }),
      created_at: timestamp({ db: { updatedAt: true } })
    }
  })
};
