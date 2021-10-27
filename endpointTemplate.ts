import { KeystoneContext } from "@keystone-next/keystone/types";
import { Request, Response } from 'express';
import jwt from "jsonwebtoken"

type EndpointFunction = (req: Request & {
    context: KeystoneContext
}, res: Response) => Promise<unknown>

type KeystoneRequest = Request & {
    context: KeystoneContext
}

type Session = {
    id: string
    name: string
}

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

export const needAuth = (req: KeystoneRequest) => {
    const token = req.headers.authorization?.split(' ')[1]
    if(!token) throw new HTTPError({
        message: "token is not provided",
        code: 400
    })

    const info = jwt.decode(token)
    if(!info) throw new HTTPError({
        message: "token has malformed",
        code: 400
    })
    
    return info as Session
}

export const endpoint = (endpoint: EndpointFunction) => (req: Request, res: Response) => {
    (async () => {
        try {
            await endpoint(req as KeystoneRequest, res)
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
