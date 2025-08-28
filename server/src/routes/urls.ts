import { Router } from "express";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get('/test-protected', authMiddleware, (req, res) => {
    res.status(200).json({
        message: "You are authenticated!",
        user: req.user
    });
});

export default router;