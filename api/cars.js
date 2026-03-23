export default async function handler(req, res) {
  try {
    // 🔹 1. Hent liste
    const listRes = await fetch(
      'https://cache.api.finn.no/iad/search/car-norway?orgId=898948523',
      {
        headers: {
          'X-FINN-apikey': process.env.FINN_API_KEY
        }
      }
    );

    const listText = await listRes.text();

    // 🔹 2. Finn ID’er (regex hack – funker bra)
    const ids = [...listText.matchAll(/urn:id:(\\d+)/g)].map(m => m[1]);

    const firstIds = ids.slice(0, 12); // maks 12 biler

    // 🔹 3. Hent detaljer per bil
    const cars = await Promise.all(
      firstIds.map(async (id) => {
        try {
          const res = await fetch(
            `https://cache.api.finn.no/iad/ad/${id}`,
            {
              headers: {
                'X-FINN-apikey': process.env.FINN_API_KEY,
                'Accept': 'application/json'
              }
            }
          );

          const data = await res.json();

          return {
            title: data.heading,
            price: data.price?.amount || '',
            image: data.images?.[0]?.url || '',
            year: data.modelYear || '',
            km: data.mileage || ''
          };

        } catch {
          return null;
        }
      })
    );

    res.status(200).json(cars.filter(Boolean));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'fail' });
  }
}
