# 🗺️ Public Amenity Locator

A community-driven web app for identifying and mapping public amenities using AI image recognition. Upload a photo of an amenity, and AI verifies what it is — helping build a crowdsourced map of useful public infrastructure.

## Demo

https://github.com/user-attachments/assets/Amenity%20Locator.mp4

## Features

- **AI-Powered Verification** — Upload a photo, and the Hugging Face image classification API confirms the amenity type
- **8 Amenity Types** — Rubbish bins, dog waste stations, benches,  postboxes, drinking fountains, bicycle racks, ATMs and EV charging stations.
- **Image Upload & URL** — Drag-and-drop, file picker, or paste an image URL
- **Geolocation** — Captures GPS coordinates for mapping verified amenities
- **Gamification** — Points system, leaderboard, and achievement popups to encourage contributions
- **Responsive** — Works on desktop and mobile

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** Plain HTML/CSS/JS (served as static files)
- **AI:** Hugging Face Inference API (`google/vit-base-patch16-224`)
- **Upload Handling:** Multer

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/JoshWilliams92/amenity-locator.git
cd amenity-locator
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and add your [Hugging Face API key](https://huggingface.co/settings/tokens):

```
HF_API_KEY=hf_your_token_here
```

### 4. Run

```bash
pnpm start
```

Open [http://localhost:3000](http://localhost:3000).

For development with auto-restart:

```bash
pnpm dev
```

## Project Structure

```
amenity-locator/
├── public/
│   └── index.html       # Single-page app (all UI, CSS, JS inline)
├── assets/
│   └── Amenity Locator.mp4  # Demo video
├── server.js            # Express server + /detect and /classify/url endpoints
├── .env.example         # Environment variable template
├── .gitignore
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/detect` | Upload an image (multipart form) for classification |
| `POST` | `/classify/url` | Classify an image from a URL (JSON body: `{ "imageUrl": "..." }`) |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `HF_API_KEY` | Yes | — | Hugging Face API token |
| `PORT` | No | `3000` | Server port |
| `MODEL_NAME` | No | `google/vit-base-patch16-224` | HF model for classification |

## License

ISC
