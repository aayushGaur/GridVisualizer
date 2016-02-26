/**	The objects of this class represent a histogram graph for the network.
*	The histogram will be based on D3.
*/
(function(){
	NETWORK.CONTROLS.Histogram = function(values,intervals,parentID,xLabel) {
		this.values = values;
		if(intervals === undefined || intervals === null) {
			this.intervals = intervals;
		}
		else {
			this.intervals = 20;
		}
		
		// A formatter for counts.
		var formatCount = d3.format(",.0f");

		var margin = {top: 10, right: 30, bottom: 30, left: 30},
			width = 450 - margin.left - margin.right,
			height = 182 - margin.top - margin.bottom;

		var x = d3.scale.linear().domain([0, Math.max.apply(null, values)]).range([0, width]);

		// Generate a histogram using twenty uniformly-spaced bins.
		var data = d3.layout.histogram().bins(x.ticks(20))(values);

		var y = d3.scale.linear().domain([0, d3.max(data, function(d) { return d.y; })]).range([height, 0]);

		var xAxis = d3.svg.axis().scale(x).orient("bottom");

		var svg = d3.select(parentID).append("svg").attr("class" ,"histogramClass")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		  .append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var histoBar = svg.selectAll(".histoBar").data(data)
		  .enter().append("g").attr("class", "histoBar")
			.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

		histoBar.append("rect")
			.attr("x", 1).attr("width", x(data[0].dx) - 1)
			.attr("height", function(d) { return height - y(d.y); });

		histoBar.append("text").attr("dy", ".75em").attr("y", -8).attr("x", x(data[0].dx) / 2)
			.attr("text-anchor", "middle")
			.text(function(d) { 
			//return nothing if the value is 0 as the value will not show up on the graph.
				if(d.y === 0 ) {
					return "";
				}					
				else  {
					return formatCount(d.y);
				}
			});

		svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis)
		.append("text").attr("text-anchor", "middle").text(function(d) { return xLabel })
		.attr("y", 25).attr("x", (width/2));
	};
	
	NETWORK.CONTROLS.Histogram.prototype.attachEvents  = function () {
	};
})(NETWORK.CONTROLS || (NETWORK.CONTROLS = {}));