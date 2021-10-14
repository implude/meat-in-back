import { gql } from "@keystone-next/keystone";
import { KeystoneContext } from "@keystone-next/keystone/types";
import type { Request, Response } from 'express';

const WHOLE_POST_QUERY = gql`
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
comment {
    author {
        name,
        photo,
        id
    }
    created_at
    content
}
hearted_user {
    id
}
bookmarked_user {
    id
}
`

export const getCuratedPost = async (req: Request, res: Response) => {
    const context = (req as any).context as KeystoneContext;
    // context.session
    const posts = await context.query.Post.findMany({
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
                content
                id
                author {
                    id
                    name
                    created_at
                }
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
}

export const getSpecificPost = async (req: Request, res: Response) => {
    const context = (req as any).context as KeystoneContext;
    if (typeof req.params.id !== 'string') {
        res
            .status(400)
            .json({
                error: "POST_ID_NOT_CORRENT"
            })

        return
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
    const context = (req as any).context as KeystoneContext;
    console.log(req.query)

    const createdResult = await context.query.Post.createOne({
        // TODO: IMPLEMENT AUTHOR, EXAMPLE: NUTYWORKS
        data: { ...req.query, author: "ckuphca1e0164tl9o8xl3iqvs" },
        query: WHOLE_POST_QUERY
    })

    if (createdResult.id) res.json(createdResult)
}
