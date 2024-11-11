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

// Read the data from CSV file
d3.csv("cc_tree.csv").then(function(data) {
    // Use d3.stratify to transform CSV data to hierarchical data
    console.log(data)
    var root = d3.stratify()
        .id(d => d.name)
        .parentId(d => d.parent)
        (data);
    
        var values = [];
        root.each(function (d) { values.push(d.data.value); });
        const minValue = values.reduce((min, current) => Math.min(min, current), Infinity);
        console.log(minValue)
        data2Canvas = d3.scaleLinear()
            .domain([minValue, root.data.value])  // Min value to max value
            .range([height - margin.top - margin.bottom, 0]);
    
        canvas2Data = d3.scaleLinear()
            .domain([0, height - margin.top - margin.bottom])
            .range([root.data.value, minValue]);  // Min value to max value
            
    
        tree(root);
    
        var diagonal = d3.path();
        // create the link elements
    
        var link = svg.selectAll(".link")
            .data(root.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", function (d, i) {
                diagonal.moveTo(d.parent.x, data2Canvas(d.parent.data.value));
                diagonal.lineTo(d.x, data2Canvas(d.parent.data.value));
                diagonal.lineTo(d.x, data2Canvas(d.data.value));
                return diagonal.toString();
            });
    
    
        var Tooltip = d3.select("#tooltip").append("div")
            .attr("class", "tooltip")
    
    
        var mouseover = function (d) {
            Tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity",)
        }
        var mousemove = function (e, d) {
            Tooltip
                .html("CycleId: " + d.data.name + "<br/>" + "Force: "
                    + d.data.value)
                .style("left", (e.pageX + 10) + "px")
                .style("top", (e.pageY) + "px")
        }
        var mouseleave = function (d) {
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
            .attr("class", function (d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
            .attr("transform", function (d) { return "translate(" + d.x + "," + data2Canvas(d.data.value) + ")"; });
    
        // add the circle to the node
        svg.selectAll(".node--internal").append("circle")
            .attr("r", 5);
        svg.selectAll(".node--leaf").append("circle")
            .attr("r", 4);
    
        svg.selectAll(".node").on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
    
    
        // Add a vertical scale on the right side
        const scaleContainer = svg.append("g")
            .attr("transform", `translate(${width - margin.right}, 0)`);  // Position scale on the right
    
        // Draw the scale line
        scaleContainer.append("line")
            .attr("class", "scale-line")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", 0)
            .attr("y2", height - margin.top - margin.bottom);
    
        const scaleAxis = d3.axisRight(data2Canvas)
            .ticks(6)  // Number of ticks on the axis
            .tickSize(5);
    
        // Append the scale axis
        scaleContainer.call(scaleAxis);
    
        const threshold = document.getElementById("InputThreshold").value;
    
        // add horizontal cut line
        var cutLine = d3.select("svg")
        .append("line")
        .attr("id", "cut-threshold")
        .attr("x1", margin.left)
        .attr("y1", data2Canvas(threshold) + margin.top)
        .attr("x2", width)
        .attr("y2", data2Canvas(threshold) + margin.top)
        // .style("stroke", "red")
        // .style("stroke-width", "2")
        .style("cursor", "move")
        .call(drag);  // Add drag functionality if required
    
    });
    
    // Callback functions
    
    function thresholdChanged() {
        var threshold = document.getElementById("InputThreshold").value;
        var line = document.getElementById("cut-threshold");
        var y = data2Canvas(threshold) + margin.top
        line.setAttribute("y1", y)
        line.setAttribute("y2", y)
    }
    
    var drag = d3.drag()
        .on("drag", function (event) {
            var newY = Math.max(margin.top, Math.min(height - margin.bottom, event.y));
            d3.select(this)
                .attr("y1", newY)
                .attr("y2", newY);
            document.getElementById("InputThreshold").value = canvas2Data(newY-margin.top)
            
        });