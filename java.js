/* Things to do */
/* Add 50% opacity to all colors */
/* Add brushing and linking */

// Setting up constant variables 
const FRAME_HEIGHT = 550;
const FRAME_WIDTH = 500;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// Setting Frame for left column
const FRAME1 = d3.select('#left')
                    .append('svg')
                        .attr('height', FRAME_HEIGHT)
                        .attr('width', FRAME_WIDTH)
                        .attr('class', 'frame');

// Setting Frame for middle column
const FRAME2 = d3.select('#middle')
                    .append('svg')
                        .attr('height', FRAME_HEIGHT)
                        .attr('width', FRAME_WIDTH)
                        .attr('class', 'frame');

const FRAME3 = d3.select('#right')
                    .append('svg')
                        .attr('height', FRAME_HEIGHT)
                        .attr('width', FRAME_WIDTH)
                        .attr('class', 'frame');

// Setting vis constants given frame hight/width and margins					
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right


// Left Visualization Function
function left_vis() {
	
	// Read the csv file
    d3.csv('data/iris.csv').then((data) => {

        // Gets max x and max y values
        const MAX_X = d3.max(data, (d) => {
            return parseFloat(d.Sepal_Length)
        });
        const MAX_Y = d3.max(data, (d) => {
            return parseFloat(d.Petal_Length)
        });

        // Scale x and y values 
        const X_SCALE = d3.scaleLinear()
            .domain([0, MAX_X])
            .range([0, VIS_WIDTH]);
        const Y_SCALE = d3.scaleLinear()
            .domain([0, MAX_Y])
            .range([VIS_HEIGHT, 0]);
        
		// Colors for identification
        const colors = d3.scaleOrdinal().domain(data)
            .range(["purple", "green", "orange"])

        // Add points to the graph
        FRAME1.selectAll('points')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', (d) => {
                return (MARGINS.left + X_SCALE(d.Sepal_Length))
            })
            .attr('cy', (d) => {
                return (MARGINS.top + Y_SCALE(d.Petal_Length))
            })
            .attr('r', 5)
            .attr('fill', function(d){return colors(d.Species)})
            .attr('opacity', 0.5)
            .attr('class', 'point');
        
        // Y axis 
        FRAME1.append('g')
            .attr('transform', 'translate(' + MARGINS.top + ',' + MARGINS.left + ')')
            .call(d3.axisLeft(Y_SCALE).ticks(10))
            .attr('font-size', '10px');

        // X axis
        FRAME1.append('g')
            .attr('transform', 'translate(' + MARGINS.left + ',' + (VIS_HEIGHT + MARGINS.top) + ')')
            .call(d3.axisBottom(X_SCALE).ticks(10))
            .attr('font-size', '10px');
        
    });
};

// Middle Visualization Function
function middle_vis() {
    d3.csv('data/iris.csv').then((data) => {
        // Gets max x and max y values 
        const MAX_X = d3.max(data, (d) => {
            return parseFloat(d.Petal_Width)
        });

        const MAX_Y = d3.max(data, (d) => {
            return parseFloat(d.Sepal_Width)
        });

        // Scale x and y values
        const X_SCALE = d3.scaleLinear()
            .domain([0, MAX_X])
            .range([0, VIS_WIDTH]);

        const Y_SCALE = d3.scaleLinear()
            .domain([0, MAX_Y])
            .range([VIS_HEIGHT, 0]);

        // Colors for identification
        const colors = d3.scaleOrdinal().domain(data)
            .range(["purple", "green", "orange"])

        // adding points from the csv 
        const points = FRAME2.selectAll('points')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', (d) => {
                return (MARGINS.left + X_SCALE(d.Petal_Width))
            })
            .attr('cy', (d) => {
                return (MARGINS.top + Y_SCALE(d.Sepal_Width))
            })
            .attr('r', 5)
            .attr('fill', function(d){return colors(d.Species)})
            .attr('opacity', 0.5)
            .attr('class', 'point');

        // creating x-axis to visualization
        FRAME2.append('g')
            .attr('transform', 'translate(' + MARGINS.left + ',' + (VIS_HEIGHT + MARGINS.top) + ')')
            .call(d3.axisBottom(X_SCALE).ticks(10))
            .attr('font-size', '10px');
        
        // creating y-axis to visualization
        FRAME2.append('g')
            .attr('transform', 'translate(' + MARGINS.top + ',' + MARGINS.left + ')')
            .call(d3.axisLeft(Y_SCALE).ticks(10))
            .attr('font-size', '10px');

        FRAME2.call(d3.brush()
            .extent([[MARGINS.left, MARGINS.bottom], [VIS_WIDTH + MARGINS.left, VIS_HEIGHT+  MARGINS.top]])
                .on("begin brush", changeChart));
        
        // handles brush occurences 
        function changeChart(event) {
            extent = event.selection;
                    
            // adds class if boolean value returns true 
            points.classed("selected", function(d){ 
                return pointInSelection(extent, X_SCALE(d.Petal_Width) + MARGINS.left, Y_SCALE(d.Sepal_Width) + MARGINS.top )} );
        }
        
            // checking whether or not a point is within a selection
            function pointInSelection(extent, cx, cy) {
                const x0 = extent[0][0];
                const x1 = extent[1][0];
                const y0 = extent[0][1];
                const y1 = extent[1][1];  
        
                return x0 <= cx && 
                cx <= x1 && 
                y0 <= cy && 
                cy <= y1;
                }
        });
    };

    //third visualization function 
    function right_vis() {

        // hardcoding dataset as instructed
        const data = [
            {label: "setosa", value: 50},
            {label: "versicolor", value: 50},
            {label: "verginica", value: 50}
          ];
    
        const VIS_PADDING = 0.25;
        
        // Scale x and y values
        const X_SCALE = d3.scaleBand()
          .domain(data.map(d => d.label))
          .range([0, VIS_WIDTH])
          .padding(VIS_PADDING);
    
        const Y_SCALE = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.value)])
          .range([VIS_HEIGHT, 0]);
    
        // adding points from the csv
        FRAME3.selectAll('rect')
                .data(data)
                .enter()
                .append('rect')
                .attr('x', d => X_SCALE(d.label) + MARGINS.left)
                .attr('width', X_SCALE.bandwidth())
                .attr('y', d => MARGINS.top + Y_SCALE(d.value))
                .attr('height', d => VIS_HEIGHT - Y_SCALE(d.value))
                .attr('fill', 'blue')
                .attr('class', 'rect')

                // color assignment based on label values 
                .attr("fill", d => {
                    if (d.label === "setosa") {
                      return "green";
                    } else if (d.label === "versicolor") {
                      return "purple";
                    } else if (d.label === "verginica") {
                      return "orange";
                    }
                });

        // create x-axis to visualization
        FRAME3.append('g')
                .attr('transform', 'translate(' + MARGINS.left + ',' + (VIS_HEIGHT + MARGINS.top) + ')')
                .call(d3.axisBottom(X_SCALE).ticks(3))
                .attr('font-size', '10px');
    
        // create y-axis to visualization
        FRAME3.append('g')
                .attr('transform', 'translate(' + MARGINS.top + ',' + MARGINS.left + ')')
                .call(d3.axisLeft(Y_SCALE).ticks(10))
                .attr('font-size', '10px');
    };


// Runs visualization functions
left_vis();

middle_vis();

right_vis();