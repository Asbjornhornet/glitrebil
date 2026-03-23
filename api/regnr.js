export default async function handler(req, res) {
  const { regnr } = req.query;

  try {
    const response = await fetch(
      `https://api.vegvesen.no/kjoretoy/kjoretoydata?kjennemerke=${regnr}`,
      {
        headers: {
          "SVV-Authorization": process.env.VEGVESEN_API_KEY
        }
      }
    );

    const data = await response.json();
    const v = data.kjoretoydataListe?.[0];

    res.status(200).json({
      brand: v?.tekniskGodkjenning?.tekniskeData?.generelt?.merke,
      model: v?.tekniskGodkjenning?.tekniskeData?.generelt?.handelsbetegnelse,
      year: v?.forstegangsregistrering?.registrertForstegangNorge
    });

  } catch {
    res.status(500).json({ error: "feil" });
  }
}
