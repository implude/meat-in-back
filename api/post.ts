import { gql } from "@keystone-next/keystone";
import { KeystoneContext } from "@keystone-next/keystone/types";
import { Request, Response } from 'express';
import { checkReq, endpoint, HTTPError } from "../endpointTemplate";

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

export const getCuratedPost = endpoint(async (req, res) => {
    const posts = await req.context.query.Post.findMany({
        query: gql`
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
    });

    res.json(
        posts
            .map(post => ({
                ...post,
                heart: {
                    // TODO: IMPLEMENT HEARTED LOGIC
                    count: post.hearted_user.length,
                    hearted: Math.random() > 0.5
                },
                hearted_user: undefined
            }))
            .sort(() => 0.5 - Math.random())
    );
})

export const getSpecificPost = async (req: Request, res: Response) => {
    console.log("GETTING_POST")
    const context = (req as any).context as KeystoneContext;
    if (typeof req.params.id !== 'string') {
        throw new HTTPError({
            message: "POST_ID_NOT_CORRENT"
        })
    }

    const queried = await context.query.Post.findOne({
        where: {
            id: req.params.id
        },
        query: WHOLE_POST_QUERY
    })
    if (queried) res.json(queried)
}

export const createPost = async (req: Request, res: Response) => {
    console.log("CREATING_POST")
    const context = (req as any).context as KeystoneContext;

    const createdPost = await context.query.Post.createOne({
        // TODO: IMPLEMENT AUTHOR, EXAMPLE: NUTYWORKS
        data: { ...req.query, author: "ckuphca1e0164tl9o8xl3iqvs" },
        query: WHOLE_POST_QUERY
    })

    if (createdPost.id) res.json(createdPost)
}


export const createComment = endpoint(async (req: Request, res: Response) => {
    const context = (req as any).context as KeystoneContext;
    if (!req.params.id) throw new HTTPError({
        message: "POST_ID_NOT_CORRECT", code: 400
    })

    checkReq(req.body, ["author"])

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

    res.json(createdComment)
})
