export default async function handler(req, res) {
  try {
    // 👉 hent liste (root endpoint)
    const response = await fetch('https://cache.api.finn.no/iad/', {
      headers: {
        'X-FINN-apikey': process.env.FINN_API_KEY
      }
    });

    const text = await response.text();
    console.log('RAW:', text);

    return res.status(200).json({ raw: text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'fail' });
  }
}
