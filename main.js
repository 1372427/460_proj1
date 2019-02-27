let dataset;
let w=600;
let h=500;
let svg;
let xScale, yScale, cScale;
let xAxis, yAxis;
let xAxisGroup, yAxisGroup;
let state = "Alabama";
let cause = "Cancer";

let dataUrl = "NCHS_-_Leading_Causes_of_Death__United_States.csv";

let key = (d) => `${d.state}-${d.year}-${d.cause}`;

function rowConverter(d) {
    return {
        year: parseInt(d.Year),
        cause: d["Cause Name"],
        state: d.State,
        deaths: parseInt(d.Deaths)
    }
}

function initGraph() {
    d3.csv(dataUrl, rowConverter).then((data) => {

        console.log(data);

        dataset = data;

        let groupByState = d3.nest()
        .key(function(d) { return d.state; })
		.key(function(d) {return d.cause})
        .object(dataset);

        svg = d3.select('body').append('svg').attr('width', w).attr('height', h);

        //scales
        yScale = d3.scaleLinear()
            .domain([0,d3.max(groupByState[state][cause], (d)=> d.deaths)])
            .range([h-20, 20]);
        
            
        xScale = d3.scaleLinear()
            .domain([1999, 2016])
            .range([40, w-40]);

        svg.selectAll('.bars')
            .data(groupByState[state][cause], key)
            .enter()
            .append('rect')
            .classed('bars', true)
            .attr('x', (d) => xScale(d.year))
            .attr('y', (d) => yScale(d.deaths))
            .attr('height', (d) =>  h-20-yScale(d.deaths))
            .attr('width', 20)


        //AXIS
        xAxis = d3.axisBottom(xScale);
        xAxisGroup = svg.append('g')
             .attr('transform', `translate(0, ${h - 20})`)
             .call(xAxis);

        yAxis = d3.axisLeft(yScale);
        yAxisGroup = svg.append('g')
             .attr('transform', `translate(40, 0)`)
             .call(yAxis);
    })
}

function updateGraph() {

}

window.onload = function() {
    initGraph();
    //add event listeners
    document.querySelector('#cause').addEventListener("change", (e) => console.log(e))
}