import { gql } from "@keystone-next/keystone";
import { KeystoneContext } from "@keystone-next/keystone/types";
import { Request, Response } from 'express';
import { Router } from "express"
import { checkReq, endpoint, HTTPError, needAuth } from "../../endpointTemplate";

const COMMENT_QUERY = `
author {
    name,
    photo,
    id
}
created_at
content`
const WHOLE_POST_QUERY = `
photo,
title,
created_at
author {
    name,
    photo,
    rep_badge {
        image,
        label,
        description
    }
}
content,
linked_recipe {
    name,
    thumbnail,
    meat_type {
        label
    }
    duration
    difficulty {
        label
    }
    created_at
    hearted_user {
        id
    }
}
hearted_user {
    id
}
bookmarked_user {
    id
}
comment {
    ${COMMENT_QUERY}   
}
`

export const BRIEF_POST_QUERY = `
author {
    name,
    photo,
    rep_badge {
        image,
        label,
        description
    }
},
comment {
    id
}
hearted_user {
    id
}
id
created_at
`

export const getCuratedPost = endpoint(async (req, res) => {
    const authed = needAuth(req)

    const posts = await req.context.query.Post.findMany({
        query: BRIEF_POST_QUERY
    });

    res.json(
        [...posts
            .map(post => ({
                ...post,
                heart: {
                    count: post.hearted_user.length,
                    hearted: post.hearted_user.includes(authed.id)
                },
                hearted_user: undefined,
                created_at: +new Date(post.created_at)
            }))]
            .sort(() => 0.5 - Math.random())
    );
})

export const getSpecificPost = endpoint(async (req, res) => {
    if (typeof req.params.id !== 'string') {
        throw new HTTPError({
            message: "POST_ID_NOT_CORRECT"
        })
    }

    const queried = await req.context.query.Post.findOne({
        where: {
            id: req.params.id
        },
        query: WHOLE_POST_QUERY
    })
    if (queried) res.json({ ...queried, created_at: +new Date(queried.created_at) })
})

export const createPost = endpoint(async (req, res) => {
    const authed = needAuth(req)

    const createdPost = await req.context.query.Post.createOne({
        data: {
            ...req.body, author: {
                connect: {
                    id: authed.id
                }
            }
        },
        query: WHOLE_POST_QUERY
    })

    if (createdPost.id) res.json({ ...createdPost, created_at: +new Date(createdPost.created_at) })
})

export const createComment = endpoint(async (req: Request, res: Response) => {
    const context = (req as any).context as KeystoneContext;
    if (!req.params.id) throw new HTTPError({
        message: "POST_ID_NOT_CORRECT", code: 400
    })

    const createdComment = await context.query.Comment.createOne({
        data: {
            ...req.body,
            post: {
                connect: {
                    id: req.params.id
                }
            }
        },
        query: COMMENT_QUERY
    })

    res.json({...createdComment, created_at: +new Date(createdComment.created_at)})
})

const heartPost = endpoint(async (req, res) => {
    const authed = needAuth(req)
    const update = await req.context.query.Post.updateOne({
        where: {
            id: req.params.id
        },
        data: {
            hearted_user: {
                connect: {
                    id: authed.id
                }
            }
        }
    })

    return res.json(update)
})

const bookmarkPost = endpoint(async (req, res) => {
    const authed = needAuth(req)
    const update = await req.context.query.Post.updateOne({
        where: {
            id: req.params.id
        },
        data: {
            bookmarked_user: {
                connect: {
                    id: authed.id
                }
            }
        }
    })

    return res.json(update)
})

const unheartPost = endpoint(async (req, res) => {
    const authed = needAuth(req)
    const update = await req.context.query.Post.updateOne({
        where: {
            id: req.params.id
        },
        data: {
            hearted_user: {
                disconnect: {
                    id: authed.id
                }
            }
        }
    })

    return res.json(update)
})

const unbookmarkPost = endpoint(async (req, res) => {
    const authed = needAuth(req)
    const update = await req.context.query.Post.updateOne({
        where: {
            id: req.params.id
        },
        data: {
            bookmarked_user: {
                disconnect: {
                    id: authed.id
                }
            }
        }
    })

    return res.json(update)
})

const router = Router()
router.get('/curated', getCuratedPost);
router.get('/:id', getSpecificPost);
router.post('/:id/heart', heartPost);
router.post('/:id/bookmark', bookmarkPost);
router.delete('/:id/unheart', unheartPost);
router.delete('/:id/unbookmark', unbookmarkPost);
router.post('/:id/comment', createComment);
router.post('/', createPost);

export { router as postRouter }
