import { KeystoneContext } from "@keystone-next/keystone/types";
import { Request, Response } from 'express';

type EndpointFunction = (req: Request & {
    context: KeystoneContext
}, res: Response) => Promise<unknown>

export class HTTPError extends Error {
    code: number
    constructor(props: {
        message: string
        code?: number
    }) {
        super(props.message)
        this.code = props.code || 400
        console.log('ERROR[HTTP]', (new Date()).toISOString(), props.message)
    }
}

export const checkReq = (req: Record<string, string>, requiredFields: string[]) => {
    const emptyFields = requiredFields.filter(e =>
        !req[e]
    )
    if (emptyFields.length !== 0) throw new HTTPError({
        message: `required field [${emptyFields.join()}] is not provided. got value: ${JSON.stringify(req)}`,
    })
}

export const endpoint = (endpoint: EndpointFunction) => (req: Request, res: Response) => {
    (async () => {
        try {
            await endpoint(req as Request & {
                context: KeystoneContext
            }, res)
        } catch (e) {
            if (e instanceof HTTPError) {
                res
                    .status(e.code)
                    .json({
                        message: e.message
                    })
            } else {
                const message = (e as Error)?.message
                    || (typeof e === 'string' && e)
                    || "조때써요"
                console.log('ERROR[HTTP]', (new Date()).toISOString(), message)
                res.status(400).send({
                    message
                })
            }
        }
    })()
}
