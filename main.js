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

let groupByState;

let key = (d) => `${d.year}`;

function rowConverter(d) {
    return {
        year: parseInt(d.Year),
        cause: d["Cause Name"],
        state: d.State,
        deaths: parseInt(d.Deaths)
    }
}

function handleMouseOver(d, i){  
    d3.select('#barInfo')
      .classed('hidden', false)
      .style('margin-left', xScale(d.year) + 'px')
      .style('margin-top',  yScale(d.deaths) -70+ 'px')
      .html(`<strong>Year:</strong> ${d.year}<br/> <strong>Deaths:</strong> ${d.deaths}`);
      
    d3.select(this).style('fill', 'green');
}

function handleMouseOut(d,i) {
    d3.select('#barInfo').classed('hidden', true);
    d3.select(this).style('fill', (d) => cScale(d.deaths));
}

function handleMouseClick(d,i) {
    d3.select('.toggleOn').classed('toggleOn', false);
    d3.select(this).classed('toggleOn', true);
}

function initGraph() {

        svg = d3.select('body').append('svg').attr('width', w).attr('height', h);

        //scales
        yScale = d3.scaleLinear()
            .domain([0,d3.max(groupByState[state][cause], (d)=> d.deaths)])
            .range([h-20, 20]);
        
            
        xScale = d3.scaleLinear()
            .domain([1999, 2016])
            .range([40, w-40]);


        cScale = d3.scaleLinear()
            .domain([d3.min(groupByState[state][cause], (d)=> d.deaths),d3.max(groupByState[state][cause], (d)=> d.deaths)])
            .range(['red', 'blue']);

        svg.selectAll('.bars')
            .data(groupByState[state][cause], key)
            .enter()
            .append('rect')
            .classed('bars', true)
            .attr('x', (d) => xScale(d.year))
            .attr('y', (d) => yScale(d.deaths))
            .attr('height', (d) =>  h-20-yScale(d.deaths))
            .attr('width', 20)
            .attr('fill', (d) => cScale(d.deaths))
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut)
            .on('click', handleMouseClick);


        //AXIS
        xAxis = d3.axisBottom(xScale);
        xAxisGroup = svg.append('g')
             .attr('transform', `translate(0, ${h - 20})`)
             .call(xAxis);

        yAxis = d3.axisLeft(yScale);
        yAxisGroup = svg.append('g')
             .attr('transform', `translate(40, 0)`)
             .call(yAxis);

}

function updateGraph() {
    yScale.domain([0, d3.max(groupByState[state][cause], (d)=> d.deaths)]);

    
    yAxisGroup.transition()
    .duration(1000)
    .call(yAxis);

    svg.selectAll('.bars')
    .data(groupByState[state][cause], key)
    .enter()
        .append('rect')
        .classed('bars', true)
        .attr('x', (d) => xScale(d.year))
        .attr('y', (d) => yScale(d.deaths))
        .attr('height', (d) =>  h-20-yScale(d.deaths))
        .attr('width', 20)
        .attr('fill', (d) => cScale(d.deaths))
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .on('click', handleMouseClick)
    .merge(svg.selectAll('.bars')
        .data(groupByState[state][cause], key))
        .transition()
        .duration(1000)
        .attr('width', 20)
        .attr('x', (d) => xScale(d.year))
        .attr('y', (d) => yScale(d.deaths))
        .attr('height', (d) =>  h-20-yScale(d.deaths));


    svg.selectAll('.bars')
    .data(groupByState[state][cause], key)
    .exit()
        .transition()
        .duration(1000)
        .attr('x', -20)
        .remove();


}

window.onload = function() {
    let causeDropDown = document.querySelector('#cause');
    let stateDropDown = document.querySelector('#state');

    d3.csv(dataUrl, rowConverter).then((data) => {

        console.log(data);

        dataset = data;
        
        groupByState = d3.nest()
            .key(function(d) { return d.state; })
            .key(function(d) {return d.cause})
            .object(dataset);

        for(let key in groupByState){
            let newSelect = document.createElement('option');
            newSelect.value = key;
            newSelect.innerText = key;
            stateDropDown.appendChild(newSelect);
        }

        for(let key in groupByState["Alabama"]){
            let newSelect = document.createElement('option');
            newSelect.value = key;
            newSelect.innerText = key;
            causeDropDown.appendChild(newSelect);
        }

        
        initGraph();

    })

    //add event listeners
    causeDropDown.addEventListener("change", (e) => {cause = e.target.value; updateGraph()})
    stateDropDown.addEventListener("change", (e) => {state=e.target.value; updateGraph()})
}