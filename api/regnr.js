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
          "SVV-Authorization": "Apikey DEMO",
        },
      }
    );

    const data = await response.json();

    if (!data.kjoretoydataListe || data.kjoretoydataListe.length === 0) {
      return res.status(200).json({ error: "Fant ikke kjøretøy" });
    }

    const vehicle = data.kjoretoydataListe[0];

    const info = {
      brand: vehicle.kjoretoyId?.tekniskGodkjenning?.tekniskeData?.generelt?.merke || "",
      model: vehicle.kjoretoyId?.tekniskGodkjenning?.tekniskeData?.generelt?.handelsbetegnelse || "",
      year: vehicle.kjoretoyId?.forstegangsregistrering?.registrertFørsteGangNorge || "",
      fuel: vehicle.kjoretoyId?.tekniskGodkjenning?.tekniskeData?.motorOgDrivverk?.drivstoff?.drivstoffKode || "",
    };

    return res.status(200).json(info);

  } catch (err) {
    console.error("VEGVESEN ERROR:", err);

    return res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
}
