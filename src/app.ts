import express from "express";
import { router } from "./routes";

const app = express()

app.get('/', (req, res) => {
  res.sendStatus(200)
})
app.use('/api/v1', router)

export { app }
