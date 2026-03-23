export default async function handler(req, res) {
  const { regnr } = req.query;

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

    const vehicle = data.kjoretoydataListe?.[0];

    if (!vehicle) {
      return res.status(200).json({ error: "Ikke funnet" });
    }

    return res.status(200).json({
      brand:
        vehicle.kjoretoyId?.tekniskGodkjenning?.tekniskeData?.generelt?.merke,
      model:
        vehicle.kjoretoyId?.tekniskGodkjenning?.tekniskeData?.generelt?.handelsbetegnelse,
      year:
        vehicle.kjoretoyId?.forstegangsregistrering?.registrertFørsteGangNorge,
      fuel:
        vehicle.kjoretoyId?.tekniskGodkjenning?.tekniskeData?.motorOgDrivverk?.drivstoff?.drivstoffKode,
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
