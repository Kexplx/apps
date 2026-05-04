const encodedScrapeUrls_base64 = {
  clvtnkn: "aHR0cHM6Ly93d3cuY2xldmVyLXRhbmtlbi5kZS90YW5rc3RlbGxlX2RldGFpbHMv",
  czech: "aHR0cHM6Ly93d3cudGFuay1vbm8uY3ovZGUvaW5kZXgucGhwP3BhZ2U9Y2VuaWs=",
};

const stationsByUser = {
  oscar: [
    {
      id: "152131",
      name: "AVIA",
      city: "Regensburg",
      color: "#e7000b",
      initialFuelType: "e10",
      prices: { diesel: 0, e10: 9.999, e5: 0 },
      pricesUpdatedTime: "heute, 12:15 Uhr",
    },
    {
      id: "42298",
      name: "HEM",
      city: "Regensburg",
      color: "#00a63e",
      initialFuelType: "e10",
      prices: { diesel: 0, e10: 9.999, e5: 0 },
      pricesUpdatedTime: "heute, 12:15 Uhr",
    },
  ],
  juergen: [
    {
      id: "16209",
      name: "Aral",
      city: "Bad Kötzting",
      color: "#155dfc",
      initialFuelType: "diesel",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "heute, 12:15 Uhr",
    },
    {
      id: "13347",
      name: "Brey",
      city: "Chamerau",
      locationUrl: `${encodedScrapeUrls_base64.clvtnkn}13347`,
      color: "#f54900",
      initialFuelType: "diesel",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "heute, 12:15 Uhr",
    },
    {
      id: "54427",
      name: "Greil",
      city: "Bad Kötzting",
      color: "#00a63e",
      initialFuelType: "diesel",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "",
    },
    {
      id: "185645",
      name: "AGIP ENI",
      city: "Regensburg",
      color: "#d08700",
      initialFuelType: "diesel",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "",
    },
  ],
  magnus: [
    {
      id: "152131",
      name: "AVIA",
      city: "Regensburg, Landshuterstr.",
      color: "#e7000b",
      initialFuelType: "e10",
      prices: { diesel: 0, e10: 9.999, e5: 0 },
      pricesUpdatedTime: "heute, 12:15 Uhr",
    },
    {
      id: "26773",
      name: "JET",
      city: "Regensburg, Bajuwarenstr.",
      color: "#d08700",
      initialFuelType: "e10",
      prices: { diesel: 0, e10: 9.999, e5: 0 },
      pricesUpdatedTime: "heute, 12:15 Uhr",
    },
    {
      id: "26777",
      name: "HEM",
      city: "Regensburg, Friedenstr.",
      color: "#00a63e",
      initialFuelType: "e10",
      prices: { diesel: 0, e10: 9.999, e5: 0 },
      pricesUpdatedTime: "heute, 12:15 Uhr",
    },
    {
      id: "13222",
      name: "Aral",
      city: "Regensburg, Kirchmeierstr.",
      color: "#155dfc",
      initialFuelType: "e10",
      prices: { diesel: 0, e10: 9.999, e5: 0 },
      pricesUpdatedTime: "heute, 12:15 Uhr",
    },
  ],
  firat: [
    {
      id: "1859",
      name: "Aral",
      city: "Schwaig",
      color: "#155dfc",
      initialFuelType: "e10",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "",
    },
    {
      id: "2097",
      name: "Aral",
      city: "Erlangen (Büchenbach)",
      color: "#0084d1",
      initialFuelType: "e10",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "",
    },
    {
      id: "45669",
      name: "Aral",
      city: "Erlangen (Bruck)",
      color: "#598fff",
      initialFuelType: "e10",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "",
    },
    {
      id: "784",
      name: "Aral",
      city: "Fürth (Nordstadt)",
      color: "#4682ff",
      initialFuelType: "e10",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "",
    },
  ],
  martin: [
    {
      id: "3546",
      name: "Aumer (Aral)",
      city: "Kirchroth",
      color: "#155dfc",
      initialFuelType: "diesel",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "",
    },
  ],
};

const stationTemplate = (s, czechPrice, fuelType) => {
  const price = s.prices[fuelType];
  const formatted =
    price == null
      ? "x,xx<span class='text-4xl align-top'>x</span> €"
      : `${price
          .toFixed(3)
          .replace(".", ",")
          .slice(0, -1)}<span class="text-4xl align-top">${price
          .toFixed(3)
          .slice(-1)}</span> €`;

  return `
    <div class="w-full px-5">
      <div class="flex justify-start">
        <div class="text-left">
          <p class="text-6xl tracking-tight font-medium" style="color:${
            s.color
          }">
            <a target="_blank" href="${atob(encodedScrapeUrls_base64.clvtnkn)}${
              s.id
            }">
              ${s.name}
            </a>
          </p>
          <div class="text-xl -mt-1 text-start" style="color:${s.color}">
            ${s.city}
          </div>
        </div>
      </div>
      <div class="flex -mt-1 justify-between items-start">
        <div class="text-right">
          <p class="text-7xl tracking-tighter font-bold leading-none">
            ${formatted}
          </p>
          <div class="text-neutral-400 text-xl">
            pro Liter ${toTitleCase(fuelType)}
          </div>
          <div class="text-neutral-400 text-xl -mt-1">
            ${formatRelativeDate(s.pricesUpdatedTime) ?? "n/a"}
          </div>
          ${
            czechPrice && price != null
              ? `
                <div class="text-neutral-400 text-xl -mt-1">
                  Tschechienpreis: 
                  <a target="_blank"  href="${atob(encodedScrapeUrls_base64.czech)}">
                    ${czechPrice.toFixed(2).replace(".", ",")} €
                  </a>
                </div>
                <div class="text-green-500 font-medium text-lg -mt-1">
                  Ersparnis 50L: ${((price - czechPrice) * 50).toFixed(2).replace(".", ",")} €
                </div>
              `
              : czechPrice
                ? `
                <div class="text-neutral-400 text-xl -mt-1">
                  Tschechienpreis: 
                  <a target="_blank"  href="${atob(encodedScrapeUrls_base64.czech)}">
                    ${czechPrice.toFixed(2).replace(".", ",")} €
                  </a>
                </div>
              `
                : ""
          }
        </div>
      </div>
    </div>
  `;
};

(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const user = urlParams.get("u") || "juergen";
  const stations = stationsByUser[user] ?? stationsByUser.juergen;
  const fuelTypes = ["diesel", "e5", "e10"];
  const storageKey = `selectedFuelType:${user}`;
  const storedFuelType = localStorage.getItem(storageKey);
  let selectedFuelType = fuelTypes.includes(storedFuelType)
    ? storedFuelType
    : fuelTypes.includes(stations[0]?.initialFuelType)
      ? stations[0].initialFuelType
      : "diesel";

  localStorage.setItem(storageKey, selectedFuelType);

  // fetch prices
  await Promise.all(
    stations.map(async (station) => {
      const { prices, lastUpdated } = await fetchPrices(station.id);
      station.prices = prices;
      station.pricesUpdatedTime = lastUpdated;
    }),
  );

  const czechPrices = await fetchCzechPrices();

  async function fetchPrices(stationId) {
    const url = `https://europe-west3-crimeview.cloudfunctions.net/handleGet?url=${atob(encodedScrapeUrls_base64.clvtnkn)}${stationId}`;
    const response = await fetch(url);
    const html = await response.text();

    const r = {
      lastUpdated: extractLastUpdated(html),
      prices: extractPrices(html),
    };

    return r;
  }

  function extractPrices(rawHtml) {
    const doc = new DOMParser().parseFromString(rawHtml, "text/html");

    const read = (id) => {
      const main = doc
        .querySelector(`#current-price-${id}`)
        ?.textContent.trim();
      const sup = doc.querySelector(`#suffix-price-${id}`)?.textContent.trim();
      if (!main || !sup) return null;
      return parseFloat(main + sup);
    };

    return {
      diesel: read(1),
      e10: read(2),
      e5: read(3),
    };
  }

  function extractLastUpdated(rawHtml) {
    const match = rawHtml.match(
      /Letzte Aktualisierung:\s*([0-9]{2}\.[0-9]{2}\.[0-9]{4}\s+[0-9]{2}:[0-9]{2})/,
    );

    const result = match ? match[1] : null;
    return result;
  }

  async function fetchCzechPrices() {
    const url = `https://europe-west3-crimeview.cloudfunctions.net/handleGet?url=${atob(encodedScrapeUrls_base64.czech)}`;
    const response = await fetch(url);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const euroTables = doc.querySelectorAll("table.cenik");
    if (euroTables.length < 2) return null;
    const firstStationRow = euroTables[1].querySelectorAll("tr")[1];
    if (!firstStationRow) return null;

    const dieselCell = firstStationRow.querySelectorAll("td")[4];
    if (!dieselCell) return null;
    const textDiesel = dieselCell.textContent.trim().replace(",", ".");
    const valueDiesel = parseFloat(textDiesel);

    const gasolineCell = firstStationRow.querySelectorAll("td")[1];
    if (!gasolineCell) return null;
    const textGasoline = gasolineCell.textContent.trim().replace(",", ".");
    const valueGasoline = parseFloat(textGasoline);

    return {
      diesel: isNaN(valueDiesel) ? null : valueDiesel,
      e5: isNaN(valueGasoline) ? null : valueGasoline, // czech doesnt have e5 or e10
      e10: isNaN(valueGasoline) ? null : valueGasoline, // czech doesnt have e5 or e10
    };
  }

  const container = document.getElementById("stationContainer");
  const fuelTypeSwitcher = document.getElementById("fuelTypeSwitcher");

  function renderStations(fuelType) {
    const sortedStations = [...stations].sort((a, b) => {
      const pa = a.prices[fuelType];
      const pb = b.prices[fuelType];

      if (pa == null && pb == null) return 0;
      if (pa == null) return 1;
      if (pb == null) return -1;
      return pa - pb;
    });

    container.innerHTML = sortedStations
      .map((v, i) => {
        if (i === 0) {
          // first station with lowest selected fuel price, show czech price comparison
          return stationTemplate(v, czechPrices?.[fuelType], fuelType);
        }

        return stationTemplate(v, null, fuelType);
      })
      .join("");
  }

  function renderFuelTypeButtons(activeFuelType) {
    fuelTypeSwitcher.innerHTML = fuelTypes
      .map(
        (fuelType) => `
          <button
            class="w-20 py-1.5 border rounded-full text-base transition-colors ${fuelType === activeFuelType ? "border-blue-800 border-2 bg-blue-950 text-white font-semibold" : "border-transparent text-neutral-300 hover:text-neutral-100 "}"
            data-fuel-type="${fuelType}"
            type="button"
          >
            ${toTitleCase(fuelType)}
          </button>
        `,
      )
      .join("");

    fuelTypeSwitcher.querySelectorAll("[data-fuel-type]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextFuelType = button.getAttribute("data-fuel-type");
        if (!nextFuelType || nextFuelType === selectedFuelType) return;

        selectedFuelType = nextFuelType;
        localStorage.setItem(storageKey, selectedFuelType);
        renderFuelTypeButtons(selectedFuelType);
        renderStations(selectedFuelType);
      });
    });
  }

  renderFuelTypeButtons(selectedFuelType);
  renderStations(selectedFuelType);
})();
