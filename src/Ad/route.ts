import { Router } from "express"
import { endpoint } from "../../endpointTemplate";

const router = endpoint(async (req, res) => {
    const allAds = await req.context.query.Ad.findMany({
        query: `
            id,
            image,
            title,
            description,
            target_url
        `
    })
    res.json(
        allAds[Math.floor(allAds.length * Math.random())]
    )
})

const adRouter = Router()
adRouter.get('/current')
export { router as adRouter }
