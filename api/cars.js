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

    const ids = [...xml.matchAll(/urn:id:(\d+)/g)]
      .map(m => m[1])
      .slice(0, 8); // start med færre

    const cars = [];

    for (const id of ids) {
      try {
        const resAd = await fetch(
          `https://cache.api.finn.no/iad/ad/${id}`,
          {
            headers: {
              'X-FINN-apikey': process.env.FINN_API_KEY
            }
          }
        );

        const xmlAd = await resAd.text();

        // 🔥 safe parsing
        const title = (xmlAd.match(/<title>(.*?)<\/title>/) || [])[1] || '';
        const price = (xmlAd.match(/<finn:price[^>]*>(.*?)<\/finn:price>/) || [])[1] || '';
        const image = (xmlAd.match(/<link rel=\"image\" href=\"(.*?)\"/) || [])[1] || '';
        const year = (xmlAd.match(/<finn:year>(.*?)<\/finn:year>/) || [])[1] || '';
        const km = (xmlAd.match(/<finn:mileage>(.*?)<\/finn:mileage>/) || [])[1] || '';

        cars.push({ id, title, price, image, year, km });

      } catch (err) {
        console.log('FEIL PÅ BIL:', id);
      }
    }

    res.status(200).json(cars);

  } catch (err) {
    console.error('TOTAL ERROR:', err);
    res.status(500).json({ error: 'fail' });
  }
}
