// Bar chart: mean energy consumption per screen technology, with an All sizes / 55-inch toggle
(function () {
  const W = 800, H = 450, m = CONFIG.margin;
  const iw = W - m.left - m.right, ih = H - m.top - m.bottom;
  const c = CONFIG.meanCols;
  const parse = d => ({ tech: normTech(d[c.tech]), mean: +d[c.mean] });

  Promise.all([d3.csv(CONFIG.files.meanAll, parse), d3.csv(CONFIG.files.mean55, parse)])
    .then(([all, only55]) => {
      const sets = { all, only55 };
      console.log("bar data:", sets);

      const svg = createSvg("#bar-chart", W, H, "Bar chart of mean energy consumption by screen technology");
      const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

      // Both views share one y-scale so the bar heights can be compared fairly
      const x = d3.scaleBand().domain(all.map(d => d.tech)).range([0, iw]).padding(0.3);
      const y = d3.scaleLinear().domain([0, d3.max([...all, ...only55], d => d.mean)]).nice().range([ih, 0]);

      g.append("g").attr("transform", `translate(0,${ih})`).call(d3.axisBottom(x));
      g.append("g").call(d3.axisLeft(y));
      g.append("text").attr("class", "axis-label").attr("x", iw / 2).attr("y", ih + 45).attr("text-anchor", "middle").text("Screen technology");
      g.append("text").attr("class", "axis-label").attr("transform", "rotate(-90)").attr("x", -ih / 2).attr("y", -55)
        .attr("text-anchor", "middle").text("Mean energy consumption (kWh/year)");

      const draw = (key) => {
        const rows = sets[key];
        g.selectAll("rect").data(rows, d => d.tech).join("rect")
          .attr("x", d => x(d.tech)).attr("width", x.bandwidth())
          .attr("fill", d => CONFIG.techColor(d.tech))
          .transition().duration(500)
          .attr("y", d => y(d.mean)).attr("height", d => ih - y(d.mean));

        g.selectAll(".value").data(rows, d => d.tech).join("text").attr("class", "value")
          .attr("x", d => x(d.tech) + x.bandwidth() / 2).attr("text-anchor", "middle").style("font-size", "13px")
          .text(d => d3.format(".0f")(d.mean))
          .transition().duration(500)
          .attr("y", d => y(d.mean) - 6);
      };

      // Start from zero-height bars so the first draw animates up
      g.selectAll("rect").data(all, d => d.tech).join("rect")
        .attr("y", ih).attr("height", 0);
      draw("all");

      // Toggle buttons
      const buttons = [{ key: "all", label: "All sizes" }, { key: "only55", label: '55" TVs' }];
      d3.select("#bar-toggle").selectAll("button").data(buttons).join("button")
        .attr("class", (d, i) => "toggle-btn" + (i === 0 ? " active" : ""))
        .text(d => d.label)
        .on("click", (e, d) => {
          d3.selectAll("#bar-toggle .toggle-btn").classed("active", b => b.key === d.key);
          draw(d.key);
        });
    })
    .catch(err => showError("#bar-chart", err));
})();
