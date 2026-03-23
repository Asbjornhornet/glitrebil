import { XMLParser } from 'fast-xml-parser';

export default async function handler(req, res) {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: ''
    });

    // 🔹 hent liste
    const listRes = await fetch(
      'https://cache.api.finn.no/iad/search/car-norway?orgId=898948523',
      {
        headers: {
          'X-FINN-apikey': process.env.FINN_API_KEY
        }
      }
    );

    const listXml = await listRes.text();
    const listJson = parser.parse(listXml);

    const entries = listJson.feed.entry || [];

    const ids = entries
      .map(e => e.id?.split(':').pop())
      .filter(Boolean)
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

        const xml = await resAd.text();
        const json = parser.parse(xml);

        const entry = json.entry;

        // 🔥 TITLE
        const title = entry.title || 'Bil';

        // 🔥 CATEGORY → key/value
        const categories = entry.category || [];
        const map = {};

        categories.forEach(c => {
          if (c.term && c.label) {
            map[c.term.toLowerCase()] = c.label;
          }
        });

        // 🔥 IMAGE
        const links = entry.link || [];
        const imageLink = links.find(l => l.rel === 'image');

        cars.push({
          id,
          title,
          price: map.price || map.totalprice || '',
          km: map.mileage || '',
          year: map.year || '',
          image: imageLink?.href || ''
        });

      } catch (e) {
        console.log('Feil på bil:', id);
      }
    }

    res.status(200).json(cars);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'fail' });
  }
}
