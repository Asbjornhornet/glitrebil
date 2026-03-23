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

        // TITLE
        const rawTitle = (html.match(/<title>(.*?)<\/title>/) || [])[1] || '';
        const title = rawTitle
          .replace('Bruktbil til salgs:', '')
          .split('|')[0]
          .trim() || 'Bil';

        // PRICE (safe)
        let price = '';
        const priceJson = html.match(/"amount":\s?(\d+)/);
        const priceRegex = html.match(/(\d[\d\s]{4,})\s?kr/);

        if (priceJson && priceJson[1]) {
          price = new Intl.NumberFormat('no-NO').format(priceJson[1]) + ' kr';
        } else if (priceRegex && priceRegex[1]) {
          price = priceRegex[1] + ' kr';
        }

        // KM (safe)
        let km = '';
        const kmJson = html.match(/"mileage":\s?(\d+)/);
        const kmRegex = html.match(/(\d[\d\s]+)\s?km/);

        if (kmJson && kmJson[1]) {
          km = new Intl.NumberFormat('no-NO').format(kmJson[1]) + ' km';
        } else if (kmRegex && kmRegex[1]) {
          km = kmRegex[1] + ' km';
        }

        // YEAR (safe)
        let year = '';
        const yearJson = html.match(/"modelYear":\s?(\d{4})/);
        const yearRegex = html.match(/\b(20\d{2}|19\d{2})\b/);

        if (yearJson && yearJson[1]) {
          year = yearJson[1];
        } else if (yearRegex && yearRegex[1]) {
          year = yearRegex[1];
        }

        // IMAGE (safe)
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

      } catch (e) {
        console.log('Feil på bil:', id);
      }
    }

    res.status(200).json(cars);

  } catch (err) {
    console.error('MAIN ERROR:', err);
    res.status(200).json([]); // 👈 viktig: aldri crash frontend
  }
}
