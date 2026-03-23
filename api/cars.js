export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://cache.api.finn.no/iad/search/car-norway?orgId=898948523',
      {
        headers: {
          'X-FINN-apikey': process.env.FINN_API_KEY
        }
      }
    );

    const xml = await response.text();

    // 👉 hent titler direkte fra XML (enkel parsing først)
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)]
      .map(m => m[1])
      .filter(t => t !== 'Biler til salgs')
      .slice(0, 12);

    const cars = titles.map(title => ({
      title,
      price: '',
      image: '',
      year: '',
      km: ''
    }));

    res.status(200).json(cars);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'fail' });
  }
}
