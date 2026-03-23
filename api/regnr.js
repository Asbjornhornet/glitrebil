export default async function handler(req, res) {
  const { regnr } = req.query;

  if (!regnr) {
    return res.status(400).json({ error: "Missing regnr" });
  }

  try {
    const response = await fetch(
      `https://api.vegvesen.no/kjoretoy/kjoretoydata?kjennemerke=${regnr}`,
      {
        headers: {
          "SVV-Authorization": process.env.VEGVESEN_API_KEY
        }
      }
    );

    if (!response.ok) {
      return res.status(404).json({ error: "Not found" });
    }

    const data = await response.json();

    const vehicle = data.kjoretoydataListe?.[0];

    return res.status(200).json({
      brand: vehicle?.tekniskGodkjenning?.tekniskeData?.generelt?.merke,
      model: vehicle?.tekniskGodkjenning?.tekniskeData?.generelt?.handelsbetegnelse,
      year: vehicle?.forstegangsregistrering?.registrertForstegangNorge
    });

  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
