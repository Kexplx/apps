const stationsByUser = {
  oscar: [
    {
      id: "152131",
      name: "AVIA",
      city: "Regensburg",
      color: "#e7000b",
      priceToShow: "e10",
      prices: { diesel: 0, e10: 9.999, e5: 0 },
      pricesUpdatedTime: "heute, 12:15 Uhr",
    },
    {
      id: "42298",
      name: "HEM",
      city: "Regensburg",
      color: "#00a63e",
      priceToShow: "e10",
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
      priceToShow: "diesel",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "heute, 12:15 Uhr",
    },
    {
      id: "13347",
      name: "Brey",
      city: "Chamerau",
      locationUrl: "https://www.clever-tanken.de/tankstelle_details/13347",
      color: "#f54900",
      priceToShow: "diesel",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "heute, 12:15 Uhr",
    },
    {
      id: "54427",
      name: "Greil",
      city: "Bad Kötzting",
      color: "#00a63e",
      priceToShow: "diesel",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "",
    },
    {
      id: "185645",
      name: "AGIP ENI",
      city: "Regensburg",
      color: "#d08700",
      priceToShow: "diesel",
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
      priceToShow: "e10",
      prices: { diesel: 0, e10: 9.999, e5: 0 },
      pricesUpdatedTime: "heute, 12:15 Uhr",
    },
    {
      id: "26773",
      name: "JET",
      city: "Regensburg, Bajuwarenstr.",
      color: "#d08700",
      priceToShow: "e10",
      prices: { diesel: 0, e10: 9.999, e5: 0 },
      pricesUpdatedTime: "heute, 12:15 Uhr",
    },
    {
      id: "26777",
      name: "HEM",
      city: "Regensburg, Friedenstr.",
      color: "#00a63e",
      priceToShow: "e10",
      prices: { diesel: 0, e10: 9.999, e5: 0 },
      pricesUpdatedTime: "heute, 12:15 Uhr",
    },
    {
      id: "13222",
      name: "Aral",
      city: "Regensburg, Kirchmeierstr.",
      color: "#155dfc",
      priceToShow: "e10",
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
      priceToShow: "e10",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "",
    },
    {
      id: "2097",
      name: "Aral",
      city: "Erlangen (Büchenbach)",
      color: "#0084d1",
      priceToShow: "e10",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "",
    },
  ],
};

const stationTemplate = (s, czechPrice) => {
  const price = s.prices[s.priceToShow];
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
    <div class="w-full px-10">
      <div class="flex justify-start">
        <div class="text-left">
          <p class="text-6xl tracking-tight font-medium" style="color:${
            s.color
          }">
            <a target="_blank" href="https://www.clever-tanken.de/tankstelle_details/${
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
            pro Liter ${toTitleCase(s.priceToShow)}
          </div>
          <div class="text-neutral-400 text-xl -mt-1">
            ${s.pricesUpdatedTime ?? "n/a"}
          </div>
          ${
            czechPrice
              ? `
                <div class="text-neutral-400 text-xl -mt-1">
                  Tschechienpreis: 
                  <a target="_blank" class="underline" href="https://www.tank-ono.cz/de/index.php?page=cenik">
                    ${czechPrice.toFixed(3).replace(".", ",")} €
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

  stations = stationsByUser[user];

  // fetch prices
  await Promise.all(
    stationsByUser[user].map(async (station) => {
      const { prices, lastUpdated } = await fetchPrices(station.id);
      station.prices = prices;
      station.pricesUpdatedTime = lastUpdated;
    })
  );

  const czechPrices = await fetchCzechPrices();

  async function fetchPrices(stationId) {
    const url = `https://europe-west3-crimeview.cloudfunctions.net/handleGet?url=https://clever-tanken.de/tankstelle_details/${stationId}`;
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
      /Letzte Aktualisierung:\s*([0-9]{2}\.[0-9]{2}\.[0-9]{4}\s+[0-9]{2}:[0-9]{2})/
    );

    const result = match ? match[1] : null;
    return result;
  }

  async function fetchCzechPrices() {
    const url = `https://europe-west3-crimeview.cloudfunctions.net/handleGet?url=https://www.tank-ono.cz/de/index.php?page=cenik`;
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

  // sort stations by price to show
  stations.sort((a, b) => {
    const pa = a.prices[a.priceToShow];
    const pb = b.prices[b.priceToShow];

    if (pa == null && pb == null) return 0;
    if (pa == null) return 1;
    if (pb == null) return -1;
    return pa - pb;
  });

  // render stations into html container
  const container = document.getElementById("stationContainer");
  container.innerHTML = stations
    .map((v, i) => {
      if (i === 0) {
        // first station with lowest price, show czech price comparison
        return stationTemplate(v, czechPrices?.[v.priceToShow]);
      } else {
        return stationTemplate(v);
      }
    })
    .join("");
})();
