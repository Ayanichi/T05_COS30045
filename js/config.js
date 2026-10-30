// Shared settings + helpers. Column names below match the four Ex5 CSV files in /data.
const CONFIG = {
  files: {
    tv: "data/Ex5_TV_energy.csv",                               // one row per brand / technology / size / star rating
    price: "data/Ex5_ARE_Spot_Prices.csv",                      // electricity spot prices by year and state
    meanAll: "data/Ex5_TV_energy_Allsizes_byScreenType.csv",    // mean energy by technology, all sizes
    mean55: "data/Ex5_TV_energy_55inchtv_byScreenType.csv"      // mean energy by technology, 55-inch TVs only
  },
  tvCols: { star: "star2", energy: "energy_consumpt", tech: "screen_tech", count: "count" },
  meanCols: { tech: "Screen_Tech", mean: "Mean(Labelled energy consumption (kWh/year))" },
  priceCols: {
    year: "Year",
    average: "Average Price (notTas-Snowy)",
    states: [
      { key: "Queensland ($ per megawatt hour)", label: "QLD" },
      { key: "New South Wales ($ per megawatt hour)", label: "NSW" },
      { key: "Victoria ($ per megawatt hour)", label: "VIC" },
      { key: "South Australia ($ per megawatt hour)", label: "SA" },
      { key: "Tasmania ($ per megawatt hour)", label: "TAS" }
    ]
  },
  margin: { top: 20, right: 30, bottom: 55, left: 70 },
  // One colour per technology, shared by the scatter, bar and donut charts
  techColor: d3.scaleOrdinal().domain(["LCD", "LED", "OLED"]).range(["#1f77b4", "#ff7f0e", "#2ca02c"])
};

// The TV file calls LED-backlit screens "LCD (LED)"; the other files call them "LED".
// Use the short name everywhere so the colours and labels match across all four charts.
const normTech = (t) => (t === "LCD (LED)" ? "LED" : t);

// Creates a responsive SVG: the viewBox fixes the coordinate system, CSS (width:100%) scales it.
function createSvg(selector, w, h, label) {
  return d3.select(selector)
    .append("svg")
    .attr("viewBox", `0 0 ${w} ${h}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("role", "img")
    .attr("aria-label", label);
}

function showError(selector, err) {
  console.error(selector, err);
  d3.select(selector).append("p").attr("class", "error")
    .text("Could not load data: " + err.message + " (check the file path and column names in js/config.js)");
}
