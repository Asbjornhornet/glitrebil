export default async function handler(req, res) {
  console.log("NY LEAD:", req.body);
  res.json({ok:true});
}
