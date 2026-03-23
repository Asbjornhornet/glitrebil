document.getElementById('regnr').addEventListener('input', async (e) => {
  const value = e.target.value.toUpperCase();
  const box = document.getElementById('carInfo');

  if (value.length === 7) {
    try {
      const res = await fetch(`/api/regnr?regnr=${value}`);
      const data = await res.json();

      if (data.model) {
        box.style.display = 'block';
        box.innerHTML = `
          <strong>${data.brand} ${data.model}</strong><br>
          ${data.year} • ${data.fuel} • ${data.power}
        `;
      } else {
        box.style.display = 'none';
      }

    } catch (err) {
      box.style.display = 'none';
    }
  } else {
    box.style.display = 'none';
  }
});
