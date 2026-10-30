// Bar chart: mean energy consumption per screen technology
(function () {
  const W = 800, H = 450, m = CONFIG.margin;
  const iw = W - m.left - m.right, ih = H - m.top - m.bottom;
  const c = CONFIG.tvCols;

  d3.csv(CONFIG.tvData, d => ({ energy: +d[c.energy], tech: d[c.tech] }))
    .then(data => {
      data = data.filter(d => !isNaN(d.energy) && d.tech);
      // Group by technology and compute the mean -> [[tech, mean], ...]
      const means = d3.rollups(data, v => d3.mean(v, d => d.energy), d => d.tech)
        .map(([tech, mean]) => ({ tech, mean }));
      console.log("bar means:", means);

      const svg = createSvg("#bar-chart", W, H, "Bar chart of mean energy consumption by screen technology");
      const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

      const x = d3.scaleBand().domain(means.map(d => d.tech)).range([0, iw]).padding(0.3);
      const y = d3.scaleLinear().domain([0, d3.max(means, d => d.mean)]).nice().range([ih, 0]);

      g.append("g").attr("transform", `translate(0,${ih})`).call(d3.axisBottom(x));
      g.append("g").call(d3.axisLeft(y));

      g.append("text").attr("class", "axis-label").attr("x", iw / 2).attr("y", ih + 45).attr("text-anchor", "middle").text("Screen technology");
      g.append("text").attr("class", "axis-label").attr("transform", "rotate(-90)").attr("x", -ih / 2).attr("y", -55)
        .attr("text-anchor", "middle").text("Mean energy consumption (kWh/year)");

      g.selectAll("rect").data(means).join("rect")
        .attr("x", d => x(d.tech)).attr("y", d => y(d.mean))
        .attr("width", x.bandwidth()).attr("height", d => ih - y(d.mean))
        .attr("fill", d => CONFIG.techColor(d.tech));

      g.selectAll(".value").data(means).join("text").attr("class", "value")
        .attr("x", d => x(d.tech) + x.bandwidth() / 2).attr("y", d => y(d.mean) - 6)
        .attr("text-anchor", "middle").style("font-size", "13px").text(d => d3.format(".0f")(d.mean));
    })
    .catch(err => showError("#bar-chart", err));
})();
