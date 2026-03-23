export default async function handler(req, res) {
  const { regnr } = req.query;

  try {
    const response = await fetch(
      `https://cache.api.finn.no/iad/search/car-norway?registration=${regnr}`
    );

    const text = await response.text();

    // 🔥 DEBUG
    console.log("RAW:", text.slice(0, 300));

    // ❌ Hvis FINN blocker / feil
    if (text.includes("403") || text.includes("Forbidden")) {
      return res.status(200).json({
        error: "FINN blokkerer request (403)"
      });
    }

    // ❌ Hvis XML (ikke JSON)
    if (text.startsWith("<?xml")) {
      return res.status(200).json({
        error: "Fikk XML fra FINN – ikke JSON"
      });
    }

    const data = JSON.parse(text);

    return res.status(200).json(data);

  } catch (err) {
    console.error("REGNR ERROR:", err);

    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}
