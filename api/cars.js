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
      .slice(0, 8);

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

        // TITLE
        const title =
          (xmlAd.match(/<title>(.*?)<\/title>/) || [])[1] || 'Bil';

        // PRICE (fra category)
        const price =
          (xmlAd.match(/<category term=\"price\" label=\"(.*?)\"/) || [])[1] || '';

        // KM
        const km =
          (xmlAd.match(/<category term=\"mileage\" label=\"(.*?)\"/) || [])[1] || '';

        // YEAR
        const year =
          (xmlAd.match(/<category term=\"year\" label=\"(.*?)\"/) || [])[1] || '';

        // IMAGE (fra link)
        const image =
          (xmlAd.match(/<link rel=\"image\" href=\"(.*?)\"/) || [])[1] || '';

        cars.push({
          id,
          title,
          price,
          image,
          year,
          km
        });

      } catch (err) {
        console.log('Feil på bil:', id);
      }
    }

    res.status(200).json(cars);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'fail' });
  }
}
