const loading = document.getElementById("loading");
const result = document.getElementById("result");

// REGNR LOOKUP
regnr.addEventListener("input", async (e) => {
  const value = e.target.value.toUpperCase();

  if (value.length >= 7) {
    loading.style.display = "block";

    try {
      const res = await fetch(`/api/regnr?regnr=${value}`);
      const data = await res.json();

      if (data.model) {
        bil.value = `${data.brand} ${data.model}`;
        result.innerText = `${data.brand} ${data.model} (${data.year})`;
      } else {
        result.innerText = "Fant ikke bil";
      }

    } catch {
      result.innerText = "Feil ved oppslag";
    }

    loading.style.display = "none";
  }
});


// SEND LEAD
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await fetch("/api/lead", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      regnr: regnr.value,
      bil: bil.value,
      navn: navn.value,
      telefon: telefon.value,
      epost: epost.value
    })
  });

  window.location.href = "/takk.html";
});
