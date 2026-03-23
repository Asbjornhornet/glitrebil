export default async function handler(req, res) {
  try {
    const listRes = await fetch(
      'https://cache.api.finn.no/iad/search/car-norway?orgId=898948523',
      {
        headers: {
          'X-FINN-apikey': process.env.FINN_API_KEY
        }
      }
    );

    const xml = await listRes.text();

    const ids = [...xml.matchAll(/urn:id:(\\d+)/g)].map(m => m[1]).slice(0, 12);

    const cars = await Promise.all(ids.map(async (id) => {
      try {
        const res = await fetch(`https://cache.api.finn.no/iad/ad/${id}`, {
          headers: {
            'X-FINN-apikey': process.env.FINN_API_KEY
          }
        });

        const xml = await res.text();

        const title = xml.match(/<title>(.*?)<\\/title>/)?.[1] || '';
        const price = xml.match(/<finn:price[^>]*>(.*?)<\\/finn:price>/)?.[1] || '';
        const image = xml.match(/<link rel=\"image\" href=\"(.*?)\"/)?.[1] || '';
        const year = xml.match(/<finn:year>(.*?)<\\/finn:year>/)?.[1] || '';
        const km = xml.match(/<finn:mileage>(.*?)<\\/finn:mileage>/)?.[1] || '';

        return { id, title, price, image, year, km };

      } catch {
        return null;
      }
    }));

    res.status(200).json(cars.filter(Boolean));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'fail' });
  }
}
