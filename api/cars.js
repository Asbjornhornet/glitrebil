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

        // 🔥 Tittel
        const rawTitle = (html.match(/<title>(.*?)<\/title>/) || [])[1] || '';
        const title = rawTitle
          .replace('Bruktbil til salgs:', '')
          .split('|')[0]
          .trim();

        // 🔥 Pris
const price =
  (html.match(/"amount":\s?(\d+)/) || [])[1]
    ? new Intl.NumberFormat('no-NO').format(
        (html.match(/"amount":\s?(\d+)/) || [])[1]
      ) + ' kr'
    : '';

        // 🔥 KM
const km =
  (html.match(/"mileage":\s?(\d+)/) || [])[1]
    ? new Intl.NumberFormat('no-NO').format(
        (html.match(/"mileage":\s?(\d+)/) || [])[1]
      ) + ' km'
    : '';

        // 🔥 År
const year =
  (html.match(/"modelYear":\s?(\d{4})/) || [])[1] || '';

        // 🔥 Bilde
        const image =
          (html.match(/property="og:image" content="(.*?)"/) || [])[1] || '';

        cars.push({
          id,
          title,
          price,
          image,
          year,
          km,
          url: `https://www.finn.no/mobility/item/${id}`
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
