export default async function handler(req, res) {
  const { regnr } = req.query;

  if (!regnr) {
    return res.status(400).json({ error: "Missing regnr" });
  }

  try {
    const response = await fetch(
      `https://data.brreg.no/kjoretoy/api/kjoretoy/${regnr}`
    );

    if (!response.ok) {
      return res.status(404).json({ error: "Not found" });
    }

    const data = await response.json();

    return res.status(200).json({
      brand: data.kjoretoydata?.tekniskGodkjenning?.tekniskeData?.generelt?.merke,
      model: data.kjoretoydata?.tekniskGodkjenning?.tekniskeData?.generelt?.handelsbetegnelse,
      year: data.kjoretoydata?.forstegangsregistrering?.registrertForstegangNorge,
      fuel: data.kjoretoydata?.tekniskGodkjenning?.tekniskeData?.motorOgDrivverk?.drivstoff?.kode,
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
