// Writes the most recently played Spotify track to public/spotify.json.
// Run by .github/workflows/update-spotify.yml; needs SPOTIFY_CLIENT_ID,
// SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN in the environment.
import { writeFile } from 'node:fs/promises';

const OUTPUT = new URL('../public/spotify.json', import.meta.url);

const env = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
};

const getJson = async (url, init) => {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${url} failed: ${res.status} ${await res.text()}`);
  return res.json();
};

const getAccessToken = async () => {
  const credentials = Buffer.from(`${env('SPOTIFY_CLIENT_ID')}:${env('SPOTIFY_CLIENT_SECRET')}`).toString('base64');
  const { access_token } = await getJson('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: env('SPOTIFY_REFRESH_TOKEN') }),
  });
  return access_token;
};

// Spotify returns a null preview_url for most tracks, so look the song up on iTunes instead.
const findItunesPreview = async (songName, artistName) => {
  const term = encodeURIComponent(`${songName} ${artistName}`);
  try {
    const { results } = await getJson(`https://itunes.apple.com/search?term=${term}&entity=song&limit=1`);
    return results[0]?.previewUrl ?? null;
  } catch (error) {
    console.warn(`iTunes lookup failed: ${error.message}`);
    return null;
  }
};

const token = await getAccessToken();
const { items } = await getJson('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
  headers: { Authorization: `Bearer ${token}` },
});

const track = items?.[0]?.track;
if (!track) {
  console.log('No recently played track; leaving spotify.json unchanged.');
  process.exit(0);
}

const songName = track.name;
const artistName = track.artists.map((artist) => artist.name).join(', ');
const payload = {
  songName,
  artistName,
  trackUrl: track.external_urls.spotify,
  previewUrl: track.preview_url ?? (await findItunesPreview(songName, artistName)),
};

await writeFile(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Wrote ${songName} by ${artistName} (preview: ${payload.previewUrl ? 'yes' : 'none'})`);
