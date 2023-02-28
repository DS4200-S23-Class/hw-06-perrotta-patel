// declaring variables
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left: 50,
                right: 50,
                top:50,
                bottom:50};

const FRAME1 = d3.select('#left')
                    .append('svg')
                        .attr('height', FRAME_HEIGHT)
                        .attr('width', FRAME_WIDTH)
                        .attr('class', 'frame');

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

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right

// Read data from csv file
d3.csv('data/iris.csv').then((data) => {

    // left visual 

    // declaring maximum x and y values for left visual
    const MAX_X_LEFT = d3.max(data, (d) => {
        return parseFloat(d.Sepal_Length)
    });
    

    const MAX_Y_LEFT = d3.max(data, (d) => {
        return parseFloat(d.Petal_Length)
    });

    // scaling functions for left visual 
    const X_SCALE_LEFT = d3.scaleLinear()
        .domain([0, MAX_X_LEFT + 1])
        .range([0, VIS_WIDTH]);

    const Y_SCALE_LEFT= d3.scaleLinear()
        .domain([0, MAX_Y_LEFT + 1])
        .range([VIS_HEIGHT, 0]);
    
    // colormap for visuals 
    const COLOR = d3.scaleOrdinal().domain(data)
        .range(["blue", "green", "orange"])

    // adding points from csv file 
    let leftscatter_points = FRAME1.selectAll('points')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => {
            return (MARGINS.left + X_SCALE_LEFT(d.Sepal_Length))
        })
        .attr('cy', (d) => {
            return (MARGINS.top + Y_SCALE_LEFT(d.Petal_Length))
        })
        .attr('r', 6)
        .attr('id', (d) => {
            return d.id
        })
        .attr('species', (d) => {
            return d.Species
        })
        .attr('fill', function(d){return COLOR(d.Species)})
        .attr('class', 'point');
    
    // add y axis
    FRAME1.append('g')
        .attr('transform', 'translate(' + MARGINS.top + ',' + MARGINS.left + ')')
        .call(d3.axisLeft(Y_SCALE_LEFT).ticks(10))
        .attr('font-size', '10px');

    // add x axis
    FRAME1.append('g')
        .attr('transform', 'translate(' + MARGINS.left + ',' + (VIS_HEIGHT + MARGINS.top) + ')')
        .call(d3.axisBottom(X_SCALE_LEFT).ticks(10))
        .attr('font-size', '10px');

    // middle visual 

    // declaring maximum x and y values for middle visual
    const MAX_X_MIDDLE = d3.max(data, (d) => {
        return parseFloat(d.Sepal_Width)
    });
    

    const MAX_Y_MIDDLE = d3.max(data, (d) => {
        return parseFloat(d.Petal_Width)
    });

    // scaling functions for middle visuals 
    const X_SCALE_MIDDLE = d3.scaleLinear()
        .domain([0, MAX_X_MIDDLE + 0.2])
        .range([0, VIS_WIDTH]);

    const Y_SCALE_MIDDLE = d3.scaleLinear()
        .domain([0, MAX_Y_MIDDLE + 0.5])
        .range([VIS_HEIGHT, 0]);

    // adding points from csv 
    let middlescatter_points = FRAME2.selectAll('points')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => {
            return (MARGINS.left + X_SCALE_MIDDLE(d.Sepal_Width))
        })
        .attr('cy', (d) => {
            return (MARGINS.top + Y_SCALE_MIDDLE(d.Petal_Width))
        })
        .attr('id', (d) => {
            return d.id
        })
        .attr('species', (d) => {
            return d.Species
        })
        .attr('r', 6)
        .attr('fill', function(d){return COLOR(d.Species)})
        .attr('class', 'point');
    
    // add y axis
    FRAME2.append('g')
        .attr('transform', 'translate(' + MARGINS.top + ',' + MARGINS.left + ')')
        .call(d3.axisLeft(Y_SCALE_MIDDLE).ticks(10))
        .attr('font-size', '10px');

    // add x axis
    FRAME2.append('g')
        .attr('transform', 'translate(' + MARGINS.left + ',' + (VIS_HEIGHT + MARGINS.top) + ')')
        .call(d3.axisBottom(X_SCALE_MIDDLE).ticks(10))
        .attr('font-size', '10px');

    // handles brush functioanality 
    FRAME2.call(d3.brush()
        .extent([[MARGINS.left, MARGINS.bottom], [VIS_WIDTH + MARGINS.left, VIS_HEIGHT+  MARGINS.top]])
            .on("start brush", changeChart)
      );

    //right visual  

    // hardcoded dataset 
    const dataset = [
        {label: "virginica", value: 50},
        {label: "versicolor", value: 50},
        {label: "setosa", value: 50}
      ];

    const VIS_PADDING = 0.25;
    
    // scaling functions for right visual
    const X_SCALE_RIGHT = d3.scaleBand()
      .domain(dataset.map((d) => {return d.label}))
      .range([0, VIS_WIDTH])
      .padding(VIS_PADDING);

    const Y_SCALE_RIGHT = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d.value)])
      .range([VIS_HEIGHT, 0]);

    // adding points from csv 
    let plot3_bars = FRAME3.selectAll('rects')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('x', d => X_SCALE_RIGHT(d.label) + MARGINS.left)
            .attr('width', X_SCALE_RIGHT.bandwidth())
            .attr('y', d => MARGINS.top + Y_SCALE_RIGHT(d.value))
            .attr('height', d => VIS_HEIGHT - Y_SCALE_RIGHT(d.value))
            .attr('class', 'rect')
            .attr('class', 'point')
            // colors based on species
            .attr("fill", d => {
                return COLOR(d.label)
            });

    // add y axis
    FRAME3.append('g')
            .attr('transform', 'translate(' + MARGINS.top + ',' + MARGINS.left + ')')
            .call(d3.axisLeft(Y_SCALE_RIGHT).ticks(10))
            .attr('font-size', '10px');

    // add x axis
    FRAME3.append('g')
            .attr('transform', 'translate(' + MARGINS.left + ',' + (VIS_HEIGHT + MARGINS.top) + ')')
            .call(d3.axisBottom(X_SCALE_RIGHT).ticks(3))
            .attr('font-size', '10px') 

    // function for when brush occurs
    function changeChart(event) {
        extent = event.selection;
        

        // adds points to brushed if boolean returns true 
        middlescatter_points.classed("brushed", (d) => { return isPointInBrush(extent, X_SCALE_MIDDLE(d.Sepal_Width) + MARGINS.left, Y_SCALE_MIDDLE(d.Petal_Width) + MARGINS.top )} );

        // obtains an array of brushed points 
        let brushed_points = FRAME2.selectAll(".brushed").nodes()


        // Get an array of point ids and their species
        let brushed_ids = []
        let brushed_species = []
        for (let i=0; i < brushed_points.length; i++){
            brushed_ids.push(brushed_points[i].id)
            brushed_species.push(brushed_points[i].getAttribute('species'))
        }

        // Select points in vis1 that have the same ID as the selected points
        leftscatter_points.classed("brushed", (d) => {return brushed_ids.includes(d.id)})

        // Convert species to a set to get unique species selected
        let unique = Array.from(new Set(brushed_species))

        // Select bars that have been selected during the brush 
        plot3_bars.classed('brushed', (d) => {
            return unique.includes(d.label)})

    };

    // checking if a point is in a selection
    function isPointInBrush(extent, cx, cy) {
        const x0 = extent[0][0];
        const x1 = extent[1][0];
        const y0 = extent[0][1];
        const y1 = extent[1][1];  

        return x0 <= cx && 
        cx <= x1 && 
        y0 <= cy && 
        cy <= y1;
    };
});