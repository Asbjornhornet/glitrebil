export default async function handler(req, res) {
  const regnr = req.query.regnr;

  try {
    const r = await fetch(
      `https://api.vegvesen.no/vehicles/v1/vehicles?registrationNumber=${regnr}`,
      {
        headers: {
          "SVV-Authorization": process.env.VEGVESEN_KEY
        }
      }
    );

    const data = await r.json();
    const car = data[0];

    res.json({
      brand: car.make,
      model: car.model,
      year: car.modelYear
    });

  } catch {
    res.status(500).json({error:true});
  }
}
