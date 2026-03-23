export default async function handler(req, res) {
  try {
    // 🔹 Hent liste fra FINN
    const listRes = await fetch(
      'https://cache.api.finn.no/iad/search/car-norway?orgId=898948523',
      {
        headers: {
          'X-FINN-apikey': process.env.FINN_API_KEY
        }
      }
    );

    const xml = await listRes.text();

    // 🔹 Hent ID’er
    const ids = [...xml.matchAll(/urn:id:(\d+)/g)]
      .map(m => m[1])
      .slice(0, 10);

    const cars = [];

    // 🔹 Hent detaljer per bil
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

        // 🔥 TITLE
        const title =
          (xmlAd.match(/<title>(.*?)<\/title>/) || [])[1] || 'Bil';

        // 🔥 CATEGORY PARSING (nøkkelen!)
        const categories = [...xmlAd.matchAll(/<category[^>]*term=\"(.*?)\"[^>]*label=\"(.*?)\"/g)];

        const map = {};
        categories.forEach(c => {
          map[c[1].toLowerCase()] = c[2];
        });

        // 🔥 PRICE
        const price =
          map.price ||
          map.totalprice ||
          map.pris ||
          '';

        // 🔥 KM
        const km =
          map.mileage ||
          map.kilometers ||
          '';

        // 🔥 YEAR
        const year =
          map.year ||
          map.modelyear ||
          '';

        // 🔥 IMAGE
        const image =
          (xmlAd.match(/<link rel=\"image\" href=\"(.*?)\"/) || [])[1] ||
          '';

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
    console.error('TOTAL ERROR:', err);
    res.status(500).json({ error: 'fail' });
  }
}
