// Donut chart: share of TV models per screen technology
(function () {
  const W = 500, H = 450;
  const radius = Math.min(W, H) / 2 - 20;
  const c = CONFIG.tvCols;

  d3.csv(CONFIG.tvData, d => ({ tech: d[c.tech] }))
    .then(data => {
      data = data.filter(d => d.tech);
      const counts = d3.rollups(data, v => v.length, d => d.tech).map(([tech, n]) => ({ tech, n }));
      const total = d3.sum(counts, d => d.n);
      console.log("donut counts:", counts);

      const svg = createSvg("#donut-chart", W, H, "Donut chart of the share of TVs by screen technology");
      const g = svg.append("g").attr("transform", `translate(${W / 2},${H / 2})`);

      const arcs = d3.pie().value(d => d.n).sort(null)(counts);
      const arc = d3.arc().innerRadius(radius * 0.55).outerRadius(radius);

      g.selectAll("path").data(arcs).join("path")
        .attr("d", arc).attr("fill", d => CONFIG.techColor(d.data.tech))
        .attr("stroke", "#fff").attr("stroke-width", 2);

      // Label each slice with technology and percentage
      g.selectAll("text").data(arcs).join("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`).attr("text-anchor", "middle")
        .style("font-size", "13px").style("fill", "#fff").style("font-weight", "600")
        .text(d => `${d.data.tech} ${d3.format(".0%")(d.data.n / total)}`);
    })
    .catch(err => showError("#donut-chart", err));
})();
