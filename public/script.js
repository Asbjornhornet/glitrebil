const container = document.getElementById("cars");

/* LOADING */
function showSkeleton() {
  container.innerHTML = `
    <div class="skeleton"></div>
    <div class="skeleton"></div>
    <div class="skeleton"></div>
  `;
}

async function loadCars() {
  showSkeleton();

  const res = await fetch("/api/cars");
  const cars = await res.json();

  container.innerHTML = cars.map(car => `
    <div class="card">
      <img src="${car.image}" />
      <div class="card-content">
        <h3>${car.title}</h3>
        <div class="price">${car.price}</div>
      </div>
    </div>
  `).join("");

  revealCards();
}

/* SCROLL ANIMATION */
function revealCards() {
  const cards = document.querySelectorAll(".card");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
      }
    });
  });

  cards.forEach(card => observer.observe(card));
}

/* REGNR */
document.getElementById("regnr").addEventListener("input", async (e) => {
  const value = e.target.value.toUpperCase();

  if(value.length === 7){
    const res = await fetch(`/api/regnr?regnr=${value}`);
    const data = await res.json();

    if(data.model){
      document.getElementById("bil").value =
        `${data.brand} ${data.model} (${data.year})`;
    }
  }
});

/* LEAD */
document.getElementById("form").addEventListener("submit", async (e) => {
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

  alert("🔥 Vi kontakter deg straks!");
});

loadCars();
