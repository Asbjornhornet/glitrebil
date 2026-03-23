export default async function handler(req, res) {
  const { regnr } = req.query;

  if (!regnr) {
    return res.status(400).json({ error: "Missing regnr" });
  }

  // Fake fallback (så UI alltid funker)
  return res.status(200).json({
    brand: "BMW",
    model: "3-Serie",
    year: "2014",
    fuel: "Diesel",
  });
}
