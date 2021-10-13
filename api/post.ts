import { KeystoneContext } from "@keystone-next/keystone/types";
import type { Request, Response } from 'express';

export const getCuratedPost = async (req: Request, res: Response) => {
    const context = (req as any).context as KeystoneContext;
    // context.session
    const posts = await context.query.Post.findMany({
        query: `
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
            }
            hearted_user {
                id
            }
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
    if (typeof req.query.id !== 'string') {
        res
            .status(400)
            .json({
                error: "POST_ID_NOT_CORRENT"
            })

        return
    }

    const context = (req as any).context as KeystoneContext;
    const queried = context.query.Post.findOne({
        where: {
            id: req.query.id
        },
        query: `
            photo,
            title,
            created_at,
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
    })

    // IMMEDIETELY TODO: PROCESS RESULT!

    if (queried) res.json(queried)
}