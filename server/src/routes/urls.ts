import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { createUrl, getUrlsByUserId, deleteUrl } from "../services/urlService";

const router = Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication error, user not found.' });
    }

    const { url } = req.body;
    const userId = req.user.id;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const newUrl = await createUrl(url, userId);

    res.status(201).json(newUrl);
  } catch (error) {
    console.error("Failed to create");
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication error, user not found.'});
    }

    const userId = req.user.id;
    const userUrls = await getUrlsByUserId(userId);

    return res.status(200).json(userUrls);

  } catch (error) {
    console.error('Failed to fetch URLs:', error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication error, user not found.'});
    }

    if (!req.params.id) {
      return res.status(401).json({ error: 'Invalid URL id.' });
    }

    const urlId = req.params.id;
    const userId = req.user.id;

    await deleteUrl(urlId, userId);

    res.status(204).send();

  } catch (error) {
    console.error("Failed to delete");
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});


export default router;
