import { KeystoneContext } from "@keystone-next/keystone/types";
import type { Request, Response } from 'express';

export const getCuratedPost = async (req: Request, res: Response) => {
    const context = (req as any).context as KeystoneContext;
    const post = await context.query.Post.findMany({
        query: `
            author {
                name,
                photo
            },
            hearted_user,
            comment
        `
    });
    console.log(post)

    res.json(post);
}
