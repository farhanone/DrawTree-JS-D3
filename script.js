// set the dimensions and margins of the diagram
var margin = { top: 30, right: 90, bottom: 30, left: 90 },
    width = 1280  - margin.left - margin.right,
    height = 720 - margin.top - margin.bottom;
    scale_margin = 200;


// append the svg object to the body of the page
var svg = d3.select("#tree-container")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate("
        + margin.left + "," + margin.top + ")");

// console.log(d3.select("#tree-container").node().getBoundingClientRect().width )

// create the tree layout
var tree = d3.tree()
    .size([height, width]);


d3.json("treeData.json", function (error, data) {

    if (error) throw error;

    // compute the layout of the nodes based on the data
    root = d3.hierarchy(data);

    // Force value to canvas height
    var max_val = root.data.value
    invert_f = d3.scaleLinear()
        .domain([0, max_val])
        .range([max_val, 0])
    f2canvas = d3.scaleLinear()
        .domain([max_val, 0])
        .range([height,0])


    tree(root);

    var diagonal = d3.path();
    console.log(root.descendants().slice(1))
    // create the link elements
    var link = svg.selectAll(".link")
        .data(root.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", function (d, i) {
            if (i == 0) {
                diagonal.moveTo(d.parent.x, f2canvas(invert_f(d.parent.data.value)) - margin.top);
                diagonal.lineTo(d.parent.x, f2canvas(invert_f(d.parent.data.value)));
            }

            diagonal.moveTo(d.parent.x, f2canvas(invert_f(d.parent.data.value)));
            diagonal.lineTo(d.x, f2canvas(invert_f(d.parent.data.value)));
            diagonal.lineTo(d.x, f2canvas(invert_f(d.data.value)));
            if (d.height == 0) { diagonal.lineTo(d.x, f2canvas(invert_f(0))); }
            return diagonal.toString();
        });



    // // create the node elements
    var node = svg.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
        .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) { return "translate(" + d.x + "," + f2canvas(invert_f(d.data.value)) + ")"; });

        // add the circle to the node
        node.append("circle")
            .attr("r", 2);

        node.append("g")
        .attr("class","hover-text")
        .append("text")
        .attr("dy", "-1em")
        .style("opacity",0);
        node.on("mouseover", function(d) {
            // var numChildren = d.children ? d.children.length : 0;
            var force = d.data.value
            d3.select(this)
                .select(".node-circle")
                .style("fill", "red");
            d3.select(this)
                .select(".hover-text")
                .select("text")
                .text("Force "+force)
                .style("opacity",1)
                .style("stroke-width", 1);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .select(".node-circle")
                .style("fill", "black");
            d3.select(this)
                .select(".hover-text")
                .select("text")
                .style("opacity",0);
        });
    

    // add scale bar
    svg.append('line')
    .style("stroke", "lightgreen")
    .style("stroke-width", 2)
    .attr("x1", (width - scale_margin))
    .attr("y1", 0-margin.top)
    .attr("x2", (width - scale_margin))
    .attr("y2", height); 

    // add force points
    console.log(root.descendants())
    var scale_ = svg.selectAll(".scale_")
    .data(root.descendants())
    .enter().append("g")
        .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) { return "translate(" + (width - scale_margin) + "," + f2canvas(invert_f(d.data.value)) + ")"; });
    
            // add the circle to the node
            // scale_.append("circle")
            //     .attr("r", 2);

            scale_.append("path")
            .attr("d", function(d) {
                return "M" + (-10) + "," + d.data.value
                + "L" + (10) + "," + d.data.value;
            })
            .style("stroke", "lightgreen")
            .style("stroke-width", 2)

            // add the text to the node
            scale_.append("text")
            .attr("dy", ".35em")
            .attr("y", function(d) { return d.data.value })
            .attr("x", +50)
            .style("text-anchor", "middle")
            .text(function(d) { return d.data.value; })
            .style("stroke-width", 0.5);
            
            

// add the circle to the internal node
// node.filter(function(d){ return d.children; })
// .append("circle")
// .attr("r", 10);

// // add the circle to the leaf node
// node.filter(function(d){ return !d.children; })
// .append("circle")
// .attr("r", 5);



// add the text to the node
// node.append("text")
//     .attr("dy", ".35em")
//     .attr("y", function(d) { return d.children ? -20 : 20; })
//     .style("text-anchor", "middle")
//     .text(function(d) { return d.data.name; });
});