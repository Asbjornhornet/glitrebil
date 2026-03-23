export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://cache.api.finn.no/iad/search?orgId=898948523',
      {
        headers: {
          'X-FINN-apikey': process.env.FINN_API_KEY
        }
      }
    );

    const data = await response.json();
    console.log('FINN DATA:', data);

    const items = data._embedded?.items || [];

    const cars = items.map(car => ({
      title: car.heading || 'Bil',
      price: car.price?.amount || '',
      image: car.images?.[0]?.url || '',
      year: car.modelYear || '',
      km: car.mileage || ''
    }));

    res.status(200).json(cars);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch FINN data' });
  }
}
