import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())
app.use((req, res, next) => setTimeout(next, 600))

let favorites = []

app.get("/favorites", (req, res) => {
    res.json(favorites)
})

app.post("/favorites", (req, res) => {
    const { id, title, thumb } = req.body
    if (!id || !title) {
        return res.status(400).json({ message: "Нужны id и title" })
    }
    if (favorites.some((item) => item.id === id)) {
        return res.status(409).json({ message: "Уже в избранном" })
    }
    const item = { id, title, thumb }
    favorites.push(item)
    res.status(201).json(item)
})

app.delete("/favorites/:id", (req, res) => {
    const before = favorites.length
    favorites = favorites.filter((item) => item.id !== req.params.id)
    if (favorites.length === before) {
        return res.status(404).json({ message: "Не найдено" })
    }
    res.status(204).end()
})

app.listen(3001, () => console.log("Server: http://localhost:3001"))
