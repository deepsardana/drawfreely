import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DIST_DIR = path.join(__dirname, 'dist');
const UPLOADS_DIR = path.join(DIST_DIR, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.wasm': 'application/wasm',
  '.xml': 'application/xml; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

const readJsonBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 50 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
};

const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
};

const server = http.createServer(async (req, res) => {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Parse path
  let reqPath = req.url.split('?')[0];

  // ==========================================
  // NOTION & JIRA PROXY API ENDPOINTS
  // ==========================================
  if (reqPath.startsWith('/api/')) {
    try {
      if (req.method !== 'POST') {
        sendJson(res, 405, { error: 'Method not allowed' });
        return;
      }

      const body = await readJsonBody(req);

      // --- Notion Test ---
      if (reqPath === '/api/notion/test') {
        const { token, pageId } = body;
        if (!token) {
          sendJson(res, 400, { success: false, error: 'Token is required' });
          return;
        }

        const notionRes = await fetch('https://api.notion.com/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Notion-Version': '2022-06-28',
          },
        });
        const notionData = await notionRes.json();
        if (!notionRes.ok) {
          sendJson(res, notionRes.status, { success: false, error: notionData.message || 'Authentication failed' });
          return;
        }

        if (pageId) {
          const pageRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Notion-Version': '2022-06-28',
            },
          });
          if (!pageRes.ok) {
            const pageData = await pageRes.json();
            sendJson(res, pageRes.status, { success: false, error: `Token valid, but cannot access page: ${pageData.message}` });
            return;
          }
        }

        sendJson(res, 200, {
          success: true,
          botName: notionData.name || notionData.bot?.owner?.workspace_name || 'DrawFreely Bot',
        });
        return;
      }

      // --- Notion Save ---
      if (reqPath === '/api/notion/save') {
        const { token, pageId, title, imageBase64, diagramJson } = body;
        if (!token || !pageId) {
          sendJson(res, 400, { success: false, error: 'Token and pageId are required' });
          return;
        }

        // Save image to local uploads dir
        let localImageUrl = '';
        if (imageBase64 && imageBase64.includes('base64,')) {
          const base64Data = imageBase64.split('base64,')[1];
          const fileName = `diagram-${Date.now()}.png`;
          const filePath = path.join(UPLOADS_DIR, fileName);
          fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
          localImageUrl = `/uploads/${fileName}`;
        }

        // Call Notion API to append block
        const blockChildren = [
          {
            object: 'block',
            type: 'heading_2',
            heading_2: {
              rich_text: [{ type: 'text', text: { content: `📊 ${title || 'DrawFreely Whiteboard Diagram'}` } }],
            },
          },
          {
            object: 'block',
            type: 'callout',
            callout: {
              rich_text: [
                {
                  type: 'text',
                  text: { content: `Exported from DrawFreely whiteboard on ${new Date().toLocaleString()}. Contains full vector diagram and cloud architecture components.` },
                },
              ],
              icon: { emoji: '🎨' },
            },
          },
        ];

        if (diagramJson) {
          const truncatedJson = diagramJson.length > 1800 ? diagramJson.slice(0, 1800) + '...' : diagramJson;
          blockChildren.push({
            object: 'block',
            type: 'code',
            code: {
              rich_text: [{ type: 'text', text: { content: truncatedJson } }],
              language: 'json',
            },
          });
        }

        const appendRes = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ children: blockChildren }),
        });

        const appendData = await appendRes.json();
        if (!appendRes.ok) {
          sendJson(res, appendRes.status, { success: false, error: appendData.message || 'Failed to append block to Notion page' });
          return;
        }

        sendJson(res, 200, {
          success: true,
          url: `https://notion.so/${pageId.replace(/-/g, '')}`,
          imageUrl: localImageUrl,
        });
        return;
      }

      // --- Jira Test ---
      if (reqPath === '/api/jira/test') {
        const { host, email, apiToken, issueKey } = body;
        if (!host || !email || !apiToken) {
          sendJson(res, 400, { success: false, error: 'Host, email, and apiToken are required' });
          return;
        }

        const authHeader = `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`;
        const jiraRes = await fetch(`${host}/rest/api/3/myself`, {
          headers: {
            'Authorization': authHeader,
            'Accept': 'application/json',
          },
        });

        const jiraData = await jiraRes.json();
        if (!jiraRes.ok) {
          sendJson(res, jiraRes.status, { success: false, error: jiraData.message || jiraData.errorMessages?.[0] || 'Authentication failed' });
          return;
        }

        if (issueKey) {
          const issueRes = await fetch(`${host}/rest/api/3/issue/${issueKey}`, {
            headers: {
              'Authorization': authHeader,
              'Accept': 'application/json',
            },
          });
          if (!issueRes.ok) {
            sendJson(res, issueRes.status, { success: false, error: `Authentication valid, but cannot find issue ${issueKey}` });
            return;
          }
        }

        sendJson(res, 200, {
          success: true,
          displayName: jiraData.displayName || email,
        });
        return;
      }

      // --- Jira Attach ---
      if (reqPath === '/api/jira/attach') {
        const { host, email, apiToken, issueKey, imageBase64, diagramJson } = body;
        if (!host || !email || !apiToken || !issueKey) {
          sendJson(res, 400, { success: false, error: 'Host, email, apiToken, and issueKey are required' });
          return;
        }

        const authHeader = `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`;

        // Prepare multipart upload
        const formData = new FormData();

        if (imageBase64 && imageBase64.includes('base64,')) {
          const imgBuffer = Buffer.from(imageBase64.split('base64,')[1], 'base64');
          const imgBlob = new Blob([imgBuffer], { type: 'image/png' });
          formData.append('file', imgBlob, `drawfreely-diagram-${Date.now()}.png`);
        }

        if (diagramJson) {
          const jsonBlob = new Blob([diagramJson], { type: 'application/json' });
          formData.append('file', jsonBlob, `diagram.drawfreely`);
        }

        const uploadRes = await fetch(`${host}/rest/api/3/issue/${issueKey}/attachments`, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'X-Atlassian-Token': 'no-check',
          },
          body: formData,
        });

        if (!uploadRes.ok) {
          const errText = await uploadRes.text();
          sendJson(res, uploadRes.status, { success: false, error: `Jira upload failed: ${errText}` });
          return;
        }

        // Post a friendly comment with preview
        try {
          await fetch(`${host}/rest/api/3/issue/${issueKey}/comment`, {
            method: 'POST',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              body: {
                type: 'doc',
                version: 1,
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        text: '📊 [DrawFreely] Whiteboard diagram & architecture attached.',
                        marks: [{ type: 'strong' }],
                      },
                    ],
                  },
                ],
              },
            }),
          });
        } catch (e) {
          // Comment is optional, don't fail attachment
        }

        sendJson(res, 200, {
          success: true,
          issueUrl: `${host}/browse/${issueKey}`,
        });
        return;
      }

      // --- Notion Direct Zero-Token Bridge ---
      if (reqPath === '/api/integrations/notion') {
        const { image } = body;
        const filename = `notion-diagram-${Date.now()}.png`;
        const filepath = path.join(UPLOADS_DIR, filename);
        if (image) {
          fs.writeFileSync(filepath, Buffer.from(image, 'base64'));
        }
        const hostHeader = req.headers.host || `localhost:${PORT}`;
        const directUrl = `http://${hostHeader}/uploads/${filename}`;
        sendJson(res, 200, {
          success: true,
          directMode: true,
          link: directUrl,
          message: 'Direct Notion Bridge snapshot stored successfully',
        });
        return;
      }

      // --- Jira Direct Zero-Token Bridge ---
      if (reqPath === '/api/integrations/jira') {
        const { image, filename: customName } = body;
        const filename = customName || `jira-diagram-${Date.now()}.png`;
        const filepath = path.join(UPLOADS_DIR, filename);
        if (image) {
          fs.writeFileSync(filepath, Buffer.from(image, 'base64'));
        }
        const hostHeader = req.headers.host || `localhost:${PORT}`;
        const directUrl = `http://${hostHeader}/uploads/${filename}`;
        sendJson(res, 200, {
          success: true,
          directMode: true,
          link: directUrl,
          message: 'Direct Jira Bridge attachment stored successfully',
        });
        return;
      }

      sendJson(res, 404, { error: 'API route not found' });
      return;
    } catch (err) {
      console.error('API Error:', err);
      sendJson(res, 500, { success: false, error: err.message || 'Internal server error' });
      return;
    }
  }

  // ==========================================
  // STATIC FILE SERVING
  // ==========================================
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(reqPath);
  } catch (e) {
    decodedPath = reqPath;
  }

  let filePath = path.join(DIST_DIR, decodedPath);

  // Security check: ensure path is within DIST_DIR
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // If path is a directory or root, serve index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // SPA fallback
  if (!fs.existsSync(filePath)) {
    const ext = path.extname(decodedPath);
    if (!ext || ext === '.html') {
      filePath = path.join(DIST_DIR, 'index.html');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found: ${decodedPath}`);
      return;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Cache headers
  if (filePath.endsWith('index.html') || filePath.endsWith('sw.js') || filePath.endsWith('manifest.webmanifest')) {
    res.setHeader('Cache-Control', 'no-cache');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }

  res.writeHead(200, { 'Content-Type': contentType });
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(` DrawFreely App + Notion & Jira API Proxy running at:`);
  console.log(` -> http://localhost:${PORT}`);
  console.log(`====================================================`);
});
