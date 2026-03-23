export default async function handler(req, res) {
  const { regnr } = req.query;

  if (!regnr) {
    return res.status(400).json({ error: 'missing regnr' });
  }

  try {
    const response = await fetch(`https://regnr.info/${regnr}`);
    const html = await response.text();

    const get = (label) => {
      const match = html.match(new RegExp(label + '.*?<td>(.*?)</td>', 'i'));
      return match ? match[1].replace(/<.*?>/g, '').trim() : '';
    };

    const data = {
      brand: get('Merke'),
      model: get('Modell'),
      year: get('Årsmodell'),
      fuel: get('Drivstoff'),
      power: get('Effekt')
    };

    res.status(200).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'fail' });
  }
}
