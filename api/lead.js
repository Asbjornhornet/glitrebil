export default async function handler(req, res) {
  const { regnr, name, phone, email, car } = req.body;

  console.log("NEW LEAD:", {
    regnr,
    name,
    phone,
    email,
    car,
  });

  // 🔥 HER KAN DU KOBLE CRM
  // Eksempel: Zapier / webhook / Airtable / HubSpot

  // await fetch("https://hooks.zapier.com/xxx", {
  //   method: "POST",
  //   body: JSON.stringify({ regnr, name, phone, email, car }),
  // });

  return res.status(200).json({ success: true });
}
