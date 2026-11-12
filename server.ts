import express from 'express';
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Viral Blueprint Generation Endpoint
app.post('/api/generate-blueprint', async (req, res) => {
  const { topic, platform, language, tone, targetAudience } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const prompt = `You are a world-class viral video strategist specializing in high-engagement content for platforms like ${platform}.
Generate a viral content blueprint for:
- Video Topic: "${topic}"
- Target Platform: "${platform}"
- Language Format: "${language}" (If Sinhala, use proper Unicode. If Singlish, use Romanized hybrid. If English, use snappy creator tone).
- Tone & Vibe: "${tone}"
- Target Audience: "${targetAudience}"

Provide the response in JSON format according to the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hooks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hookType: { type: Type.STRING },
                  scriptLine: { type: Type.STRING },
                  retentionTactic: { type: Type.STRING }
                },
                required: ["hookType", "scriptLine", "retentionTactic"]
              }
            },
            script: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.STRING },
                  visualCue: { type: Type.STRING },
                  voiceoverOrDialogue: { type: Type.STRING }
                },
                required: ["timestamp", "visualCue", "voiceoverOrDialogue"]
              }
            },
            thumbnails: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  visualSetup: { type: Type.STRING },
                  boldTextOverlay: { type: Type.STRING }
                },
                required: ["title", "visualSetup", "boldTextOverlay"]
              }
            },
            titlesAndCaptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  style: { type: Type.STRING }
                },
                required: ["title", "style"]
              }
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            audioVibe: { type: Type.STRING },
            creatorRetentionHack: { type: Type.STRING }
          },
          required: ["hooks", "script", "thumbnails", "titlesAndCaptions", "hashtags", "audioVibe", "creatorRetentionHack"]
        }
      }
    });

    const blueprint = JSON.parse(response.text || '{}');
    res.json(blueprint);
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate blueprint' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = process.env.PORT || 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await (await import('fs')).readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
