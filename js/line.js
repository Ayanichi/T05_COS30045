// Line chart: electricity spot price by year (state lines + the average)
(function () {
  const W = 800, H = 450, m = CONFIG.margin;
  const iw = W - m.left - m.right, ih = H - m.top - m.bottom;
  const c = CONFIG.priceCols;
  const stateColors = d3.schemeTableau10;

  // Blank cells (e.g. Tasmania before it joined the market) become NaN so the line skips them
  const num = v => (v === "" || v == null ? NaN : +v);

  d3.csv(CONFIG.files.price, d => {
    const row = { year: +d[c.year], Average: num(d[c.average]) };
    c.states.forEach(s => { row[s.label] = num(d[s.key]); });
    return row;
  })
    .then(data => {
      data = data.filter(d => !isNaN(d.year)).sort((a, b) => a.year - b.year);
      console.log("line rows:", data.length, data[0]);

      // One series per state, plus the average drawn on top
      const series = [...c.states.map((s, i) => ({ label: s.label, color: stateColors[i], width: 1.6, opacity: 0.85 })),
                      { label: "Average", color: "#222", width: 3.2, opacity: 1 }]
        .map(s => ({ ...s, values: data.map(d => ({ year: d.year, v: d[s.label] })) }));

      const svg = createSvg("#line-chart", W, H, "Line chart of electricity spot prices per megawatt hour by year and state");
      const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

      const x = d3.scaleLinear().domain(d3.extent(data, d => d.year)).range([0, iw]);
      const y = d3.scaleLinear()
        .domain([0, d3.max(series, s => d3.max(s.values, d => d.v))]).nice().range([ih, 0]);

      g.append("g").attr("transform", `translate(0,${ih})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
      g.append("g").call(d3.axisLeft(y));

      g.append("text").attr("class", "axis-label").attr("x", iw / 2).attr("y", ih + 45).attr("text-anchor", "middle").text("Year");
      g.append("text").attr("class", "axis-label").attr("transform", "rotate(-90)").attr("x", -ih / 2).attr("y", -55)
        .attr("text-anchor", "middle").text("Spot price ($ per megawatt hour)");

      const line = d3.line()
        .defined(d => !isNaN(d.v))
        .x(d => x(d.year)).y(d => y(d.v))
        .curve(d3.curveMonotoneX);

      g.selectAll(".series").data(series).join("path")
        .attr("class", "series").attr("fill", "none")
        .attr("stroke", d => d.color).attr("stroke-width", d => d.width).attr("opacity", d => d.opacity)
        .attr("d", d => line(d.values));

      // Legend (top-left, where the early low prices leave space)
      const legend = g.append("g").attr("transform", "translate(12,0)");
      series.forEach((s, i) => {
        const row = legend.append("g").attr("transform", `translate(0,${i * 18})`);
        row.append("line").attr("x1", 0).attr("x2", 22).attr("y1", 6).attr("y2", 6)
          .attr("stroke", s.color).attr("stroke-width", s.width);
        row.append("text").attr("x", 28).attr("y", 10).style("font-size", "12px").text(s.label);
      });
    })
    .catch(err => showError("#line-chart", err));
})();
