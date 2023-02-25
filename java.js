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


// Runs visualization functions
left_vis();