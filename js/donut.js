// Donut chart: share of TV models per screen technology
(function () {
  const W = 500, H = 450;
  const radius = Math.min(W, H) / 2 - 70;
  const c = CONFIG.tvCols;

  // Each row of the file stands for `count` models, so sum the counts per technology
  d3.csv(CONFIG.files.tv, d => ({ tech: normTech(d[c.tech]), n: +d[c.count] }))
    .then(data => {
      data = data.filter(d => d.tech && !isNaN(d.n));
      const counts = d3.rollups(data, v => d3.sum(v, d => d.n), d => d.tech).map(([tech, n]) => ({ tech, n }));
      const total = d3.sum(counts, d => d.n);
      console.log("donut counts:", counts);

      const svg = createSvg("#donut-chart", W, H, "Donut chart of the share of TV models by screen technology");
      const g = svg.append("g").attr("transform", `translate(${W / 2},${H / 2})`);

      const arcs = d3.pie().value(d => d.n).sort(null)(counts);
      const arc = d3.arc().innerRadius(radius * 0.58).outerRadius(radius);
      const labelArc = d3.arc().innerRadius(radius + 14).outerRadius(radius + 14); // labels sit just outside

      g.selectAll("path").data(arcs).join("path")
        .attr("d", arc).attr("fill", d => CONFIG.techColor(d.data.tech))
        .attr("stroke", "#fff").attr("stroke-width", 2);

      // Outside labels work for small slices too; anchor them away from the centre
      g.selectAll(".slice-label").data(arcs).join("text").attr("class", "slice-label")
        .attr("transform", d => `translate(${labelArc.centroid(d)})`)
        .attr("text-anchor", d => ((d.startAngle + d.endAngle) / 2 < Math.PI ? "start" : "end"))
        .style("font-size", "13px")
        .text(d => `${d.data.tech} ${d3.format(".1%")(d.data.n / total)}`);

      // Total in the middle of the donut
      g.append("text").attr("text-anchor", "middle").attr("y", -2).style("font-size", "26px").style("font-weight", "700")
        .text(d3.format(",")(total));
      g.append("text").attr("text-anchor", "middle").attr("y", 20).style("font-size", "13px").style("fill", "#555")
        .text("TV models");
    })
    .catch(err => showError("#donut-chart", err));
})();
