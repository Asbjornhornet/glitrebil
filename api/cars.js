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
        // 👉 Hent FINN annonse HTML
        const pageRes = await fetch(`https://www.finn.no/mobility/item/${id}`);
        const html = await pageRes.text();

        // 🔥 TITLE
        const title =
          (html.match(/<title>(.*?)<\/title>/) || [])[1]?.split('|')[0] || 'Bil';

        // 🔥 PRICE
        const price =
          (html.match(/(\d[\d\s]+kr)/) || [])[1] || '';

        // 🔥 KM
        const km =
          (html.match(/(\d[\d\s]+km)/) || [])[1] || '';

        // 🔥 YEAR
        const year =
          (html.match(/\b(20\d{2}|19\d{2})\b/) || [])[1] || '';

        // 🔥 IMAGE
        const image =
          (html.match(/property=\"og:image\" content=\"(.*?)\"/) || [])[
