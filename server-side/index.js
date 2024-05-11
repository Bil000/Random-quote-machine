const h = 430;
const w = 950;
const svg  = d3.select("#barChartDiv")
              .append("svg")
              .attr("height", h + "px")
              .attr("width", w + "px");

const getDataFromApi = async () => {
    try {
    const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json");
    const data = await response.json();
    barChart(data);
    scales();
   } catch (err) {
      alert("There was an error: " + err);
      console.log("There was an error:  " + err);
      return;
   }
}

const barChart = (information) => {
   const {data} = information;
   const toolTip = d3.select("body")
                     .append("div")
                     .attr("class", "chart");
      svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("fill", "rgb(59, 135, 201)")
      .attr("height", d => d[1] / 44)
      .attr("width", 3 + "px")
      .attr("class", "bar")
      .attr("x", (_d, i) => i * 3.27)
      .attr("y", (d) => h - (d[1] / 44))
      .attr("transform", "translate(37, -17)")    
      .on("mouseenter", function(_d, i) {
         const rect = d3.select(this);
         const rectPos = rect.node().getBoundingClientRect();
         toolTip.html(`<p> Date ${i[0].replace(/-/gi, ".")}</p>
                       <p>$${i[1].toFixed(1)} billion</p>`)
                .style("display", "block")
                .style("left", (rectPos.x + rectPos.width) + "px")
                .style("top", rectPos.y + "px");

      })
      .on("mouseleave", () => {toolTip.style("display", "none")})     
} 

const additionalInformation = (information) => {
   const {description} = information
}

const scales = () => {
   const xScale = d3.scaleLinear().domain([1947, 2015]).range([0, w - 51.5]);
   const yScale = d3.scaleLinear().domain([0, 18000]).range([h - 17, 0]);
   const xAxis = d3.axisBottom(xScale).ticks(14).tickFormat(function (d) {
      // Remove commas from thousands place and keep the decimal part
      const formattedValue = d.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      // If the formatted value has a decimal part, remove trailing zeroes and the decimal point if it's followed by only zeroes
      formattedValue.replace(/\.0+$|(\.\d*?)0+$/, '$1');
      return formattedValue;
   });
   const yAxis = d3.axisLeft(yScale).ticks(10); 

   svg.append("g")
      .attr("transform", `translate(37, ${h - 17})`)
      .call(xAxis);
   svg.append("g")
     .attr("transform", `translate(37, 0)`)
     .call(yAxis);
}

document.addEventListener("DOMContentLoaded", getDataFromApi);