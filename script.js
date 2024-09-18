// set the dimensions and margins of the diagram
const width = 960;
const height = 600;
const margin = { top: 20, right: 150, bottom: 20, left: 120 };



// append the svg object to the body of the page
var svg = d3.select("#tree-container")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate("
        + margin.left + "," + margin.top + ")");


// create the tree layout
var tree = d3.cluster()
    .size([height - margin.top - margin.bottom, width - margin.left - margin.right])  // Swap x and y for vertical layout
    .separation((a, b) => a.parent === b.parent ? 1 : 2);


d3.json("treeData.json").then(function(data){

    // compute the layout of the nodes based on the data
    root = d3.hierarchy(data);
    console.log(root)
    var values = [];

    root.each(function(d) {values.push(d.data.value);});


    heightScale = d3.scaleLinear()
        .domain([0, root.data.value])  // Min value to max value
        .range([height - margin.top - margin.bottom, 0]);
        
    tree(root);

    var diagonal = d3.path();
    // create the link elements
    
    var link = svg.selectAll(".link")
        .data(root.descendants().slice(1))
        .enter().append("path")
        .style("stroke-width", 1)
        .attr("class", "link")
        .style("stroke", function (d) {
            return "#535353"})
        .attr("d", function (d, i) {
            diagonal.moveTo(d.parent.x, heightScale(d.parent.data.value));
            diagonal.lineTo(d.x, heightScale(d.parent.data.value));
            diagonal.lineTo(d.x, heightScale(d.data.value));
            return diagonal.toString();
        });

        
        var Tooltip  = d3.select("#tooltip").append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        // .style("visibility", "hidden")
        // .style("font-size", "20px")
        // .style('font-family', 'Helvetica')
        // .style("background-color", "white")
        // .style("border", "solid")
        // .style("border-width", "2px")
        // .style("border-radius", "5px")
        // .style("padding", "5px")
        // .style("stroke", "black")

        var mouseover = function(d) {
            Tooltip
              .style("opacity", 1)
            d3.select(this)
              .style("stroke", "black")
              .style("opacity", )
          }
          var mousemove = function(e,d) {
            Tooltip
              .html("CycleId: " + d.data.name +"<br/>" + "Force: "
                + d.data.value)
              .style("left", (e.pageX +10) + "px")
              .style("top", (e.pageY) + "px")              
          }
          var mouseleave = function(d) {
            Tooltip
              .style("opacity", 0)
            d3.select(this)
              .style("stroke", "none")
              .style("opacity", 1)
          }

    // // create the node elements
    var node = svg.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
        .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) { return "translate(" + d.x + "," + heightScale(d.data.value) + ")"; });

        // add the circle to the node
        svg.selectAll(".node--internal").append("circle")
        .attr("r", 5)
        .style("fill", function(d){ 
            return "#A52A2Acc"})
        svg.selectAll(".node--leaf").append("circle")
        .attr("r", 4)
        .style("fill", function(d){ 
            return "#A52A2Acc"})

        svg.selectAll(".node").on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);


        // Add a vertical scale on the right side
        const scaleContainer = svg.append("g")
            .attr("transform", `translate(${width - margin.right + 10}, 0)`);  // Position scale on the right

        // Draw the scale line
        scaleContainer.append("line")
            .attr("class", "scale-line")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", 0)
            .attr("y2", height - margin.top - margin.bottom);

        const scaleAxis = d3.axisRight(heightScale)
            .ticks(6)  // Number of ticks on the axis
            .tickSize(5);

        // Append the scale axis
        scaleContainer.call(scaleAxis);
        
        threshold = 0.05
        var line = d3.select("svg")
            .append("line")
            .attr("id", "threshold")
            .attr("x1", 0)
            .attr("y1", heightScale(threshold) + margin.top)
            .attr("x2", width)
            .attr("y2", heightScale(threshold) + margin.top)
            .style("stroke", "red")      // Set the color of the line
            .style("stroke-width", "2");
            // .style("cursor", "move");
            // .call(drag);



        });