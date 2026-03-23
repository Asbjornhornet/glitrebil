export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://cache.api.finn.no/iad/search/car-norway?orgId=898948523',
      {
        headers: {
          'X-FINN-apikey': process.env.FINN_API_KEY,
          'Accept': 'application/json'
        }
      }
    );

    const data = await response.json();

    const items = data._embedded?.items || [];

    const cars = items.slice(0, 10).map(item => ({
      id: item.id,
      title: item.heading,
      price: item.price?.amount || '',
      image: item.image?.url || item.images?.[0]?.url || '',
      year: item.modelYear || '',
      km: item.mileage || ''
    }));

    res.status(200).json(cars);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'fail' });
  }
}
