var svg = d3.select("svg"),
	width = +svg.attr("width"),
	height = +svg.attr("height");


var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
	.force("link", d3.forceLink().id(function(d) {return d.id}).distance(300))
	.force("charge", d3.forceManyBody().strength(-200))
	// .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("data.json", function(error,graph) {

	if(error) throw error;



	var groupOfLinksAndNodes = svg.append("g");

	var groupLinks = groupOfLinksAndNodes.append("g").attr("class","links");

	var groupOfNodes = groupOfLinksAndNodes.append("g").attr("class", "nodes");

	var groupOfNodeElements = groupOfNodes.selectAll("g").data(graph.nodes).enter().append("g")			
					.call(d3.drag()
					.on("start", dragstarted)
					.on("drag", dragged)
					.on("end", dragended)
					);

	groupOfNodeElements.append("circle")
		.attr("r", 30)
		.attr("fill", function(d) { return color(d.group); })
		

	groupOfNodeElements.append("text")
		.text(function(d) {return d.id;})


	var link = groupLinks
		.selectAll("line")
		.data(graph.links)
		.enter().append("line")
		.attr("stroke-width", function(d) {
			return Math.sqrt(d.value);
		});

		simulation
			.nodes(graph.nodes)
			.on("tick", ticked);

		simulation
			.force("link")
			.links(graph.links)

	var nodeLabels = groupOfNodes
		.selectAll("text")
		.data(graph.nodes)
		.enter().append("text")
		.text(function(d) { return d.value; })
		.attr("text-anchor","middle")


	var linkLabels = groupLinks
		.selectAll("text")
		.data(graph.links)
		.enter().append("text")
		.text(function(d) { return d.value })
		.attr("text-anchor","middle")


	svg.on('dblclick', function(d) {
		var newNode = {
			"id": "Nishant Jain",
			"group": 2
		};

		graph.nodes.push(newNode);

	});



	function ticked() {
			
		link
			.attr("x1", function(d) {return d.source.x;})
			.attr("y1", function(d) {return d.source.y;})
			.attr("x2", function(d) {return d.target.x;})
			.attr("y2", function(d) {return d.target.y;})

		groupOfNodes
			.selectAll("circle")
			.attr("cx", function(d) {return d.x;})
			.attr("cy", function(d) {return d.y;})

		groupOfNodes
			.selectAll("text")
			.attr("x", function(d) { return d.x; })
			.attr("y", function(d) { return d.y; });


		linkLabels
			.attr("x", function(d) { return (d.source.x + d.target.x) / 2; })
			.attr("y", function(d) { return (d.source.y + d.target.y) / 2; })

		nodeLabels
			.attr("x",function(d) {return d.x})
			.attr("y",function(d) {return d.y})			
		

	}


});

function dragstarted(d) {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	d.fx = d.x;
	d.fy = d.y;
}

function dragged(d) {
	d.fx = d3.event.x;
	d.fy = d3.event.y;
}

function dragended(d) {
	// if (!d3.event.active) simulation.alphaTarget(0);
	// d.fx = null;
	// d.fy = null;
	d.fixed = true;
	// simulation.restart();
}