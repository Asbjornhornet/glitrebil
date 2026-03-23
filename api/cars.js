export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://cache.api.finn.no/iad/search/car-norway?orgId=898948523',
      {
        headers: {
          'X-FINN-apikey': process.env.FINN_API_KEY,
          'Accept': 'application/json'
        }
      }
    );

    const text = await response.text();

    // 👉 FINN gir ofte XML, ikke JSON
    console.log('RAW:', text);

    return res.status(200).send(text);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'fail' });
  }
}
