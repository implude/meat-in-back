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
                    count: post.hearted_user.length,
                    hearted: Math.random() > 0.5
                },
                hearted_user: undefined
            }))
            .sort(() => 0.5 - Math.random())
    );
}
