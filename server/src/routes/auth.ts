import { Router } from "express";
import { createUser, loginUser } from "../../services/userService";

const router = Router();

router.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await createUser(email, password);
        res.status(201).json({ user });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
    }

});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await loginUser(email, password);
        res.status(200).json({ user });
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ error: error.message });
        }
    }
});

export default router;