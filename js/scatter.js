// Scatter plot: star rating (x) vs energy consumption (y), coloured by screen technology
(function () {
  const W = 800, H = 450, m = CONFIG.margin;
  const iw = W - m.left - m.right, ih = H - m.top - m.bottom;
  const c = CONFIG.tvCols;

  d3.csv(CONFIG.tvData, d => ({ star: +d[c.star], energy: +d[c.energy], tech: d[c.tech] }))
    .then(data => {
      data = data.filter(d => !isNaN(d.star) && !isNaN(d.energy)); // drop unparseable rows
      console.log("scatter rows:", data.length, data[0]);

      const svg = createSvg("#scatter-chart", W, H, "Scatter plot of star rating against energy consumption");
      const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

      const x = d3.scaleLinear().domain(d3.extent(data, d => d.star)).nice().range([0, iw]);
      const y = d3.scaleLinear().domain([0, d3.max(data, d => d.energy)]).nice().range([ih, 0]);

      g.append("g").attr("transform", `translate(0,${ih})`).call(d3.axisBottom(x));
      g.append("g").call(d3.axisLeft(y));

      g.append("text").attr("class", "axis-label").attr("x", iw / 2).attr("y", ih + 45).attr("text-anchor", "middle")
        .text("Star rating (energy efficiency)");
      g.append("text").attr("class", "axis-label").attr("transform", "rotate(-90)").attr("x", -ih / 2).attr("y", -55)
        .attr("text-anchor", "middle").text("Energy consumption (kWh/year)");

      g.selectAll("circle").data(data).join("circle")
        .attr("cx", d => x(d.star)).attr("cy", d => y(d.energy)).attr("r", 4)
        .attr("fill", d => CONFIG.techColor(d.tech)).attr("opacity", 0.7);

      // Legend
      const techs = [...new Set(data.map(d => d.tech))];
      const legend = g.append("g").attr("transform", `translate(${iw - 90},0)`);
      techs.forEach((t, i) => {
        const row = legend.append("g").attr("transform", `translate(0,${i * 20})`);
        row.append("circle").attr("r", 5).attr("cx", 5).attr("cy", 5).attr("fill", CONFIG.techColor(t));
        row.append("text").attr("x", 16).attr("y", 9).style("font-size", "12px").text(t);
      });
    })
    .catch(err => showError("#scatter-chart", err));
})();
