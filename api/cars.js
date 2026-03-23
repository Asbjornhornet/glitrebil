const rawTitle = (html.match(/<title>(.*?)<\/title>/) || [])[1] || '';
const title = rawTitle
  .replace('Bruktbil til salgs:', '')
  .split('|')[0]
  .trim();

// 🔥 PRICE (JSON + fallback)
let price =
  (html.match(/"amount":\s?(\d+)/) || [])[1];

if (!price) {
  price = (html.match(/(\d[\d\s]{3,})\s?kr/) || [])[1];
}

price = price
  ? new Intl.NumberFormat('no-NO').format(price) + ' kr'
  : '';

// 🔥 KM
let km =
  (html.match(/"mileage":\s?(\d+)/) || [])[1];

if (!km) {
  km = (html.match(/(\d[\d\s]+)\s?km/) || [])[1];
}

km = km
  ? new Intl.NumberFormat('no-NO').format(km) + ' km'
  : '';

// 🔥 YEAR
let year =
  (html.match(/"modelYear":\s?(\d{4})/) || [])[1];

if (!year) {
  year = (html.match(/\b(20\d{2}|19\d{2})\b/) || [])[1];
}

// 🔥 IMAGE
const image =
  (html.match(/property="og:image" content="(.*?)"/) || [])[1] || '';

cars.push({
  id,
  title,
  price,
  image,
  year,
  km,
  url: `https://www.finn.no/mobility/item/${id}`
});
