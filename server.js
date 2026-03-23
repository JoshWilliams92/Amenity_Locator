const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load .env.local if it exists, otherwise fall back to .env
const envLocal = path.join(__dirname, '.env.local');
require('dotenv').config({ path: fs.existsSync(envLocal) ? envLocal : undefined });

const app = express();
const upload = multer();

const hfApiKey = process.env.HF_API_KEY;
const model = process.env.MODEL_NAME || 'google/vit-base-patch16-224';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Image classification via Hugging Face Inference API
app.post('/detect', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    if (!hfApiKey) {
      return res.status(500).json({ error: 'HF_API_KEY not configured on server' });
    }

    const contentType = req.file.mimetype === 'image/png' ? 'image/png' : 'image/jpeg';

    const hfResponse = await fetch(
      `https://router.huggingface.co/hf-inference/models/${model}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${hfApiKey}`,
          'Content-Type': contentType,
        },
        body: req.file.buffer,
      }
    );

    if (!hfResponse.ok) {
      const err = await hfResponse.text();
      return res.status(502).json({ error: `Hugging Face API error: ${err}` });
    }

    const predictions = await hfResponse.json();

    res.json({
      success: true,
      topPredictions: predictions,
    });
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message || error}` });
  }
});

// Classify image from URL
app.post('/classify/url', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'No imageUrl provided' });
    }

    if (!hfApiKey) {
      return res.status(500).json({ error: 'HF_API_KEY not configured on server' });
    }

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return res.status(400).json({ error: `Failed to fetch image from URL: ${imageResponse.status}` });
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    const hfResponse = await fetch(
      `https://router.huggingface.co/hf-inference/models/${model}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${hfApiKey}`,
          'Content-Type': contentType,
        },
        body: imageBuffer,
      }
    );

    if (!hfResponse.ok) {
      const err = await hfResponse.text();
      return res.status(502).json({ error: `Hugging Face API error: ${err}` });
    }

    const predictions = await hfResponse.json();

    res.json({
      success: true,
      predictions: predictions,
    });
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message || error}` });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
