let margin = { top: 20, right: 20, bottom: 50, left: 70 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

let parseTime = d3.timeParse("%d-%b-%Y");
let parseTime2 = d3.timeParse("%b-%Y");

// set the ranges
let x = d3.scaleTime().range([0, width]);
let y = d3.scaleLinear().range([height, 0]);

// define the line
let valueline = d3
  .line()
  .x(function(d) {
    return x(d.Dates);
  })
  .y(function(d) {
    return y(d.Prices);
  });

let svg = d3
  .select("#daily")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
let svg2 = d3
  .select("#monthly")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("../output/daily_prices.csv").then(function(data) {
  //   console.log(...data);

  data.forEach(function(d) {
    d.Dates = parseTime(d.Dates);
    d.Prices = Number(d.Prices);
  });

  x.domain(
    d3.extent(data, function(d) {
      return d.Dates;
    })
  );
  y.domain([
    0,
    d3.max(data, function(d) {
      return d.Prices;
    })
  ]);

  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  svg.append("g").call(d3.axisLeft(y));
});

d3.csv("../output/monthly_prices.csv").then(function(data) {
  // format the data
  data.forEach(function(d) {
    d.Dates = parseTime2(d.Dates);
    d.Prices = Number(d.Prices);
  });

  x.domain(
    d3.extent(data, function(d) {
      return d.Dates;
    })
  );
  y.domain([
    0,
    d3.max(data, function(d) {
      return d.Prices;
    })
  ]);

  svg2
    .append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline);

  svg2
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  svg2.append("g").call(d3.axisLeft(y));
});
