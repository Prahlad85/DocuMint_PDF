# DocuMint SaaS - Full Setup & Deployment Guide

This repository has been fully upgraded to a production-grade full-stack Next.js application. 

The frontend uses `pdf-lib` for lightning-fast client-side native PDF manipulations (Merge, Split, Rotate, Organize, Watermark). For everything else (Compression, OCR, Word/Excel conversions, and AI), the backend Next.js API Routes process the files using heavy system-level binaries.

---

## 🛠️ 1. Required System Installations (Windows Compatible)

To run the backend conversions locally on Windows, you **MUST** install the following system binaries and add them to your System `PATH`:

1. **LibreOffice** (For PDF ↔ Word / Excel / PPT)
   - Download: https://www.libreoffice.org/download/download/
   - After installation, ensure the `soffice` command works in your terminal by adding `C:\Program Files\LibreOffice\program` to your Windows Environment Variables `PATH`.
2. **Ghostscript** (For PDF Compression)
   - Download: https://ghostscript.com/releases/gsdnld.html
   - After installation, rename the executable (e.g. `gswin64c.exe`) to `gs.exe` or add it to your `PATH` so that the command `gs` executes successfully.
3. **Tesseract OCR** (For Extracting Text from Scanned PDFs)
   - Download: https://github.com/UB-Mannheim/tesseract/wiki
   - Add the installation directory (usually `C:\Program Files\Tesseract-OCR`) to your `PATH`.

---

## 🔑 2. Environment Variables (`.env`)

In the root of the `documint` folder, create a `.env.local` file for the AI Tools (Summarizer & Translator):

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

---

## 🚀 3. Running Locally

Once dependencies and binaries are installed:

```bash
# Terminal 1: Start the Next.js Frontend
npm install
npm run dev

# Terminal 2: Start the Express Backend
cd backend
npm install
node server.js
```

Visit `http://localhost:3000` and all tools will automatically proxy to the `http://localhost:5000` Express backend running Multer!

---

## 🌍 4. Deployment Guide (Production)

Deploying a heavy processing backend requires an environment that supports Linux binaries (LibreOffice, Tesseract, Ghostscript). Vercel Serverless Functions do **not** support installing massive binaries like LibreOffice natively.

### Architecture Recommendation:
* **Frontend:** Deploy to **Vercel**
* **Backend (`/api/process`):** Deploy a separate Node/Express Docker container to **Render**, **Railway**, or **AWS ECS/EC2**.

### Dockerfile Example for the Backend Server (Render / Railway):
To deploy the backend, wrap your API route in an Express server inside a Dockerfile that installs all dependencies:

```dockerfile
FROM node:18-bullseye

# Install Heavy Dependencies
RUN apt-get update && apt-get install -y \
    libreoffice \
    ghostscript \
    tesseract-ocr \
    tesseract-ocr-eng \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Run your Node server
CMD ["npm", "start"]
```

**Steps to deploy on Render:**
1. Connect your GitHub repository to Render.
2. Select "Web Service" and choose "Docker" as the environment.
3. Render will automatically build the Dockerfile, installing LibreOffice, Ghostscript, and Tesseract alongside your Node.js app.
4. Add your `OPENAI_API_KEY` to the Render Environment Variables.
5. In your Vercel Frontend, change the `fetch('/api/process')` endpoint to point to your new Render URL!
