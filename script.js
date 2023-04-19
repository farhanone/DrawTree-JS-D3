// set the dimensions and margins of the diagram
var margin = { top: 30, right: 90, bottom: 30, left: 90 },
    width = 1280   - margin.left - margin.right,
    height = 1020  - margin.top - margin.bottom;
    scale_margin = 10;


// append the svg object to the body of the page
var svg = d3.select("#tree-container")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate("
        + margin.left + "," + margin.top + ")");


function range(start, end, step = 1) {
    const len = Math.floor((end - start) / step) + 1
    return Array(len).fill().map((_, idx) => start + (idx * step))
    }
var scaleticks = range(0, height, height/10);

// scaleticks.reverse()
// var temp = d3.scaleLinear()
//     .domain([0,1])
//     .range([0, 10])
//     // cc = spectral[temp(colors(2))]

// var spectral = colorbrewer.Spectral[11]
// console.log(temp(0))

// console.log(colorbrewer.YlGnBu[9])

// qz = d3.scaleQuantize()
//   .domain([0, 1])
//   .range(colorbrewer.YlGnBu[9])

// create the tree layout
var tree = d3.cluster()
    .size([height, width]).separation(function(a, b) {
        return 1; 
     });

d3.json("treeDataCC.json").then(function(data){
// d3.json("treeData.json", function (error, data) {

    // if (error) throw error;

    // compute the layout of the nodes based on the data
    root = d3.hierarchy(data);
    
    // Force value to canvas height
    var max_val = root.data.value
    console.log(max_val)

    invert_f = d3.scaleLinear()
        .domain([0, max_val])
        .range([max_val, 0])
    f2canvas = d3.scaleLinear()
        .domain([max_val, 0])
        .range([height,0])

    canvas2f = d3.scaleLinear()
        .domain([height, 0])
        .range([0, max_val])

    var n_color = 10
    var total_leaves = root.sum(function(d) { return d.value ? 1 : 0; });
    // var total_leaves = root.descendants().count()
    console.log(total_leaves.value)
    d_colormap = d3.schemeSpectral[n_color]
    // d_colormap =colorbrewer.[n_color]
    cid2cs = d3.scaleLinear()
        .domain([0, total_leaves.value + 1])
        .range([0, n_color-1]);


    var colors = function(cid) {var abs_ = cid2cs(cid), c_1= Math.floor(abs_), t= abs_- Math.floor(abs_)
        
        // console.log(d_colormap[c_1], d_colormap[c_1 + 1],abs_)
        // if (cid == 5) {
        //     // return '#cea6a6'
        //     return '#c3b2b2'
        //   }
        // else{
        // return d3.interpolate(d_colormap[c_1], d_colormap[c_1 + 1])(t);}
        return d3.interpolate(d_colormap[c_1], d_colormap[c_1 + 1])(t);
        }
        // var abs_ = cid2cs(81)
        

    tree(root);

    var diagonal = d3.path();
    // create the link elements
    var link = svg.selectAll(".link")
        .data(root.descendants().slice(1))
        .enter().append("path")
        // .style("stroke-width", 0.9)
        .attr("class", "link")
        // .style("stroke", function (d) {console.log(colors(d.data.name))
            // return colors(d.data.name) })
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
        .attr("transform", function(d) { return "translate(" + d.x + "," + f2canvas(invert_f(d.data.value)) + ")"; });

        // add the circle to the node
        svg.selectAll(".node--internal").append("circle")
        .attr("r", 10)
        .style("fill", function(d){ 
            return colors(d.data.name)})
        svg.selectAll(".node--leaf").append("circle")
        .attr("r", 10)
        .style("fill", function(d){ 
            return colors(d.data.name)})

        svg.selectAll(".node").on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

        

    // add scale bar
    var scale = svg.selectAll(".scale")
        .data(scaleticks)
        .enter().append("g")
            .attr("class", "scale")
            .attr("transform", function(d) { return "translate(" + (width - 10*scale_margin) + "," + 0 + ")"; });

        scale.append("path")
            .attr("class", "scale")
            .attr("d", function(d) {
                return "M" + (-10) + "," + d
                + "L" + (+10) + "," + d;
            });
        scale.append("text")
            .attr("dy", ".35em")
            .attr("y", function(d) {
                    return  d })
            .attr("x", (+50))
            .text(function(d) {
                return canvas2f(d).toFixed(2)})
            .style("text-anchor", "middle")
            .style("stroke-width", 0.5)
            .style("font-size", "2em");

        scale.append('line')
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", height);


    // add force points
    // console.log(root.descendants())
    // var scale_ = svg.selectAll(".scale_")
    // .data(root.descendants())
    // .enter().append("g")
    //     .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
    //     .attr("transform", function(d) { return "translate(" + (width - scale_margin) + "," + f2canvas(invert_f(d.data.value)) + ")"; });
    
    //         // add the circle to the node
    //         // scale_.append("circle")
    //         //     .attr("r", 2);

    //         scale_.append("path")
    //         .attr("d", function(d) {
    //             return "M" + (-10) + "," + d.data.value
    //             + "L" + (10) + "," + d.data.value;
    //         })
    //         .style("stroke", "lightgreen")
    //         .style("stroke-width", 2)

    //         // add the text to the node
    //         scale_.append("text")
    //         .attr("dy", ".35em")
    //         .attr("y", function(d) { return d.data.value })
    //         .attr("x", + 50)
    //         .text(function(d) { return d.data.value; })
    //         .style("text-anchor", "middle")
    //         .style("stroke-width", 0.5);
            
            

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