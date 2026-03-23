const carsContainer = document.getElementById("cars");

async function loadCars() {
  const res = await fetch("/api/cars");
  const cars = await res.json();

  renderCars(cars);
}

function renderCars(cars) {
  carsContainer.innerHTML = cars.map(car => `
    <div class="card" onclick="window.open('${car.url}')">
      <img src="${car.image}" />
      <div class="card-content">
        <h4>${car.title}</h4>
        <p>${car.price}</p>
      </div>
    </div>
  `).join("");
}

async function lookupRegnr(value) {
  const res = await fetch(`/api/regnr?regnr=${value}`);
  const data = await res.json();

  if(data.model){
    document.getElementById("bil").value =
      `${data.brand} ${data.model} (${data.year})`;
  }
}

document.getElementById("regnr").addEventListener("input", (e)=>{
  if(e.target.value.length >= 7){
    lookupRegnr(e.target.value);
  }
});

document.getElementById("form").addEventListener("submit", async (e)=>{
  e.preventDefault();

  await fetch("/api/lead", {
    method:"POST",
    body: JSON.stringify({
      name: navn.value,
      phone: telefon.value,
      email: epost.value,
      car: bil.value
    })
  });

  alert("Lead sendt 🚀");
});

loadCars();
