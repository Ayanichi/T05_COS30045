// Shared settings + helpers. EDIT the column names here to match your CSV files.
const CONFIG = {
  tvData: "data/tv.csv",
  priceData: "data/price.csv",
  tvCols: { star: "Star2", energy: "LabelledEnergy", tech: "tech" }, // star rating, kWh/year, screen technology
  priceCols: { year: "year", price: "price" },                        // year, $ per MWh
  margin: { top: 20, right: 30, bottom: 55, left: 70 },
  // One colour per technology, shared by the scatter, bar and donut charts
  techColor: d3.scaleOrdinal().domain(["LCD", "LED", "OLED"]).range(["#1f77b4", "#ff7f0e", "#2ca02c"])
};

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
