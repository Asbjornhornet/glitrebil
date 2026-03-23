const regnrInput = document.getElementById("regnr");
const carInput = document.getElementById("car");
const info = document.getElementById("carInfo");

// 🔥 PREMIUM LOADING UI
function setLoading(state) {
  if (state) {
    regnrInput.style.border = "2px solid #3b82f6";
    regnrInput.style.boxShadow = "0 0 20px rgba(59,130,246,0.5)";
  } else {
    regnrInput.style.border = "";
    regnrInput.style.boxShadow = "";
  }
}

// 🚗 LOOKUP
regnrInput.addEventListener("input", async (e) => {
  const value = e.target.value.toUpperCase();

  if (value.length === 7) {
    setLoading(true);

    try {
      const res = await fetch(`/api/regnr?regnr=${value}`);
      const data = await res.json();

      setLoading(false);

      if (data.error) {
        info.innerText = "Fant ikke bil";
        return;
      }

      // ✅ Autofyll
      const carText = `${data.brand} ${data.model}`;
      carInput.value = carText;

      // ✨ Premium animation
      carInput.style.transform = "scale(1.05)";
      setTimeout(() => {
        carInput.style.transform = "scale(1)";
      }, 200);

      info.innerText = `${carText} (${data.year})`;

    } catch (err) {
      setLoading(false);
      info.innerText = "Feil ved lookup";
    }
  }
});

// 📤 SEND LEAD
document.getElementById("submitBtn").addEventListener("click", async () => {
  const payload = {
    regnr: regnrInput.value,
    car: carInput.value,
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
  };

  const btn = document.getElementById("submitBtn");

  btn.innerText = "Sender...";
  btn.disabled = true;

  await fetch("/api/lead", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  btn.innerText = "Sendt ✅";
});
