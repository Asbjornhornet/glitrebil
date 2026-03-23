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
      .slice(0, 6);

    const cars = [];

    for (const id of ids) {
      try {
        const pageRes = await fetch(`https://www.finn.no/mobility/item/${id}`);
        const html = await pageRes.text();

        const title =
          (html.match(/<title>(.*?)<\/title>/) || [])[1]?.split('|')[0] || 'Bil';

        const price =
          (html.match(/(\d[\d\s]+kr)/) || [])[1] || '';

        const km =
          (html.match(/(\d[\d\s]+km)/) || [])[1] || '';

        const year =
          (html.match(/\b(20\d{2}|19\d{2})\b/) || [])[1] || '';

        const image =
          (html.match(/property=\"og:image\" content=\"(.*?)\"/) || [])[1] || '';

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
