// Line chart: electricity price by year
(function () {
  const W = 800, H = 450, m = CONFIG.margin;
  const iw = W - m.left - m.right, ih = H - m.top - m.bottom;
  const c = CONFIG.priceCols;

  d3.csv(CONFIG.priceData, d => ({ year: +d[c.year], price: +d[c.price] }))
    .then(data => {
      data = data.filter(d => !isNaN(d.year) && !isNaN(d.price)).sort((a, b) => a.year - b.year);
      console.log("line rows:", data.length, data[0]);

      const svg = createSvg("#line-chart", W, H, "Line chart of electricity price per megawatt hour by year");
      const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

      const x = d3.scaleLinear().domain(d3.extent(data, d => d.year)).range([0, iw]);
      const y = d3.scaleLinear().domain([0, d3.max(data, d => d.price)]).nice().range([ih, 0]);

      g.append("g").attr("transform", `translate(0,${ih})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
      g.append("g").call(d3.axisLeft(y));

      g.append("text").attr("class", "axis-label").attr("x", iw / 2).attr("y", ih + 45).attr("text-anchor", "middle").text("Year");
      g.append("text").attr("class", "axis-label").attr("transform", "rotate(-90)").attr("x", -ih / 2).attr("y", -55)
        .attr("text-anchor", "middle").text("Price ($ per megawatt hour)");

      const line = d3.line().x(d => x(d.year)).y(d => y(d.price)).curve(d3.curveMonotoneX);
      g.append("path").datum(data).attr("fill", "none").attr("stroke", "#d6336c").attr("stroke-width", 2.5).attr("d", line);
    })
    .catch(err => showError("#line-chart", err));
})();
