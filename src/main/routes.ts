import { Router } from "express"

export default (): Router => {
    const router = Router()

    router.get("/", (_req, res) => {
        res.send("GET request")
    })

    router.post("/", (_req, res) => {
        res.json({ message: "POST request" })
    })

    return router
}