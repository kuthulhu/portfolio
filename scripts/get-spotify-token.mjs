// One-time helper that prints a Spotify refresh token for the SPOTIFY_REFRESH_TOKEN secret.
// Add http://127.0.0.1:8888/callback as a Redirect URI in the Spotify app's settings, then run:
//   SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/get-spotify-token.mjs
import { createServer } from 'node:http';

const REDIRECT_URI = 'http://127.0.0.1:8888/callback';
const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret } = process.env;
if (!clientId || !clientSecret) throw new Error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.');

const authorizeUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
  client_id: clientId,
  response_type: 'code',
  redirect_uri: REDIRECT_URI,
  scope: 'user-read-recently-played',
})}`;

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== '/callback') return res.writeHead(404).end();

  const code = url.searchParams.get('code');
  if (!code) {
    res.end(`Spotify returned: ${url.searchParams.get('error')}`);
    return server.close();
  }

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT_URI }),
  });
  const body = await tokenRes.json();

  if (body.refresh_token) {
    console.log(`\nSPOTIFY_REFRESH_TOKEN:\n${body.refresh_token}\n`);
    res.end('Done. The refresh token is printed in your terminal; you can close this tab.');
  } else {
    console.error(body);
    res.end('Token exchange failed; see the terminal.');
  }
  server.close();
});

server.listen(8888, '127.0.0.1', () => console.log(`Open this URL and approve access:\n\n${authorizeUrl}\n`));
