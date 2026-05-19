const countriesContainer = document.getElementById("countriesContainer");
const loadBtn = document.getElementById("loadBtn");
const searchInput = document.getElementById("searchInput");
const regionSelect = document.getElementById("regionSelect");
const loading = document.getElementById("loading");
const errorBlock = document.getElementById("error");

let countries = [];

async function fetchCountries() {
  try {
    showLoading();

    const response = await fetch(
      "https://restcountries.com/v3.1/all"
    );

    if (!response.ok) {
      throw new Error("Помилка завантаження країн");
    }

    const data = await response.json();

    countries = data;

    renderCountries(countries);

    hideLoading();

  } catch (error) {
    hideLoading();
    showError(error.message);
  }
}

function renderCountries(data) {
  countriesContainer.innerHTML = "";

  data.forEach(country => {

    const card = document.createElement("div");

    card.className = "country-card";

    const languages = country.languages
      ? Object.values(country.languages).join(", ")
      : "Немає даних";

    const currencies = country.currencies
      ? Object.values(country.currencies)
          .map(c => c.name)
          .join(", ")
      : "Немає даних";

    card.innerHTML = `
      <img src="${country.flags.svg}" alt="flag">

      <h2>${country.name.common}</h2>

      <p><strong>Столиця:</strong>
      ${country.capital?.[0] || "Немає"}</p>

      <p><strong>Регіон:</strong>
      ${country.region}</p>

      <p><strong>Населення:</strong>
      ${country.population.toLocaleString()}</p>

      <p><strong>Мови:</strong>
      ${languages}</p>

      <p><strong>Валюта:</strong>
      ${currencies}</p>
    `;

    countriesContainer.appendChild(card);
  });
}

function filterCountries() {
  const searchText =
    searchInput.value.toLowerCase();

  const selectedRegion =
    regionSelect.value;

  let filtered = countries.filter(country => {

    const matchesName =
      country.name.common
        .toLowerCase()
        .includes(searchText);

    const matchesRegion =
      selectedRegion === "" ||
      country.region === selectedRegion;

    return matchesName && matchesRegion;
  });

  renderCountries(filtered);
}

function showLoading() {
  loading.classList.remove("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}

function showError(message) {
  errorBlock.textContent = message;
  errorBlock.classList.remove("hidden");
}

searchInput.addEventListener(
  "input",
  filterCountries
);

regionSelect.addEventListener(
  "change",
  filterCountries
);

loadBtn.addEventListener(
  "click",
  fetchCountries
);