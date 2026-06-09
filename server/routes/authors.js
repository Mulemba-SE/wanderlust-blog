import { Router } from "express";
import { getAllAuthors } from "../db/queries/authors";
const router = Router();
router.get("/authors", async (req, res) => {
    try {
        const authors = await getAllAuthors();
        res.json({ data: authors, total: authors.length });
    }
    catch (err) {
        console.error("[GET /authors]", err);
        res.status(500).json({ message: "Failed to fetch authors" });
    }
});
export default router;
