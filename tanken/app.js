const stationsByUser = {
  oscar: [
    {
      id: "f4a1abbdf69eaa207904e85eaac63d11",
      name: "AVIA",
      city: "Regensburg",
      locationUrl:
        "https://ich-tanke.de/tankstelle/f4a1abbdf69eaa207904e85eaac63d11/",
      color: "#e7000b",
      priceToShow: "e10",
      prices: { diesel: 0, e10: 9.999, e5: 0 },
      pricesUpdatedTime: "heute, 12:15 Uhr",
    },
    {
      id: "750e8832869ee147412cd7bb275ed869",
      name: "HEM",
      city: "Regensburg",
      locationUrl:
        "https://ich-tanke.de/tankstelle/750e8832869ee147412cd7bb275ed869/",
      color: "#00a63e",
      priceToShow: "e10",
      prices: { diesel: 0, e10: 9.999, e5: 0 },
      pricesUpdatedTime: "heute, 12:15 Uhr",
    },
  ],
  juergen: [
    {
      id: "8a2221b0afa9576f7639724e33add16d",
      name: "Aral",
      city: "Bad Kötzting",
      locationUrl:
        "https://ich-tanke.de/tankstelle/8a2221b0afa9576f7639724e33add16d/",
      color: "#155dfc",
      priceToShow: "diesel",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "heute, 12:15 Uhr",
    },
    {
      id: "b30d446620e320068a14010b14833e5d",
      name: "Greil",
      city: "Bad Kötzting",
      locationUrl:
        "https://ich-tanke.de/tankstelle/b30d446620e320068a14010b14833e5d/",
      color: "#00a63e",
      priceToShow: "diesel",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "",
    },
    {
      id: "f0f4fcbf00b1a4cc9011037581e6a292",
      name: "AGIP ENI",
      city: "Regensburg",
      locationUrl:
        "https://ich-tanke.de/tankstelle/f0f4fcbf00b1a4cc9011037581e6a292/",
      color: "#d08700",
      priceToShow: "diesel",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "",
    },
  ],
  firat: [
    {
      id: "04696bc174c2b52c98f680b44b9a871a",
      name: "Aral",
      city: "Schwaig",
      locationUrl:
        "https://ich-tanke.de/tankstelle/04696bc174c2b52c98f680b44b9a871a/",
      color: "#155dfc",
      priceToShow: "e10",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "",
    },
    {
      id: "233a4b8bb1b908f34aae52770aa56da8",
      name: "Aral",
      city: "Erlangen (Büchenbach)",
      locationUrl:
        "https://ich-tanke.de/tankstelle/233a4b8bb1b908f34aae52770aa56da8/",
      color: "#0084d1",
      priceToShow: "e10",
      prices: { diesel: 0, e10: 0, e5: 0 },
      pricesUpdatedTime: "",
    },
  ],
};

const stationTemplate = (s) => {
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

  return `<div class="w-full px-10">
    <div class="flex justify-start">
      <div class="text-left">
        <p class="text-6xl tracking-tight font-medium" style="color:${s.color}">
          <a target="_blank" href="${s.locationUrl}">${s.name}</a>
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
      </div>
    </div>
  </div>
`;
};

(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const user = urlParams.get("u") || "oscar";

  stations = stationsByUser[user];

  // fetch prices
  await Promise.all(
    stationsByUser[user].map(async (station) => {
      const { prices, lastUpdated } = await fetchPrices(station.id);
      station.prices = prices;
      station.pricesUpdatedTime = lastUpdated;
    })
  );

  async function fetchPrices(stationId) {
    const url = `https://europe-west3-crimeview.cloudfunctions.net/handleGet?url=https://ich-tanke.de/tankstelle/${stationId}/`;
    const response = await fetch(url);
    const html = await response.text();

    const blocks = [
      ...html.matchAll(/<div class="preis">([\s\S]*?)<\/div>/g),
    ].map((m) => m[1]);

    const priceInBlock = (block) => {
      const m = block.match(
        /<span class="zahl">\s*([0-9],[0-9]{2})<sup>([0-9])<\/sup>/
      );
      return m ? toNum(m[1] + m[2]) : null; // "1,66" + "9" -> toNum("1,669")
    };

    const byLabel = (re) => {
      const b = blocks.find((bl) => re.test(bl));
      return b ? priceInBlock(b) : null;
    };

    // Extracts the visible timestamp text like: "heute, 11:41 Uhr"
    const getTimeText = (block) => {
      const m = block.match(/<\/span>\s*([^<]+)\s*<div class="clear">/);
      return m ? m[1].trim() : null;
    };
    const timeText = getTimeText(html);

    const r = {
      lastUpdated: timeText,
      prices: {
        e5: byLabel(/<strong>\s*Super\s+Benzin\s*<\/strong>/),
        e10: byLabel(/<strong>\s*Super\s*\(E10\)\s*Benzin\s*<\/strong>/),
        diesel: byLabel(/<strong>\s*Diesel\s*<\/strong>/),
      },
    };

    return r;
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
  container.innerHTML = stations.map(stationTemplate).join("");
})();
