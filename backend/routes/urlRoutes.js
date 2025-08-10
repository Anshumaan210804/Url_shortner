const express = require('express');
const shortid = require('shortid');
const Url = require('../models/Url');
const router = express.Router();

// Create short URL
router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ error: 'URL is required' });

  try {
    const shortUrlCode = shortid.generate();
    const newUrl = new Url({
      originalUrl,
      shortUrl: shortUrlCode
    });

    await newUrl.save();
    res.json({ shortUrl: `http://localhost:5000/${shortUrlCode}` });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Redirect short URL to original
router.get('/:shortUrl', async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    if (url) {
      return res.redirect(url.originalUrl);
    } else {
      res.status(404).json({ error: 'No URL found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
