let dataset;
let w=600;
let h=500;
let svg;
let xScale, yScale;
let xAxis, yAxis;
let xAxisGroup, yAxisGroup;
let state = "Alabama";
let cause = "Cancer";
let maxDeath;

let dataUrl = "NCHS_-_Leading_Causes_of_Death__United_States.csv";

let groupByState;

let keyFunction = (d) => `${d.cause}${d.year}`;


let line = d3.line()
    .x((d) => {return xScale(d.year)})
    .y((d) => {return yScale(d.deaths)})
    //.curve(d3.curveMonotoneX)


let lineMatrix = {}

let colorMatrix = {
    "Unintentional injuries": "red",
    "Alzheimer's disease": "orange",
    "Cancer": "yellow",
    "CLRD": "green",
    "Diabetes": "blue",
    "Heart disease": "purple",
    "Influenza and pneumonia": "black",
    "Kidney disease": "brown",
    "Stroke": "pink",
    "Suicide": "lavendar"
}

function rowConverter(d) {
    return {
        year:  Date.parse(+d.Year),
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
      .html(`<strong>Year:</strong> ${d3.timeFormat('%Y')(d.year)}<br/> <strong>Deaths:</strong> ${d.deaths}`);
      
    d3.select(this).style('fill', 'green');

    console.log(d.year)
}

function handleMouseOut(d,i) {
    d3.select('#barInfo').classed('hidden', true);
    d3.select(this).style('fill', (d) => cScale(d.deaths));
}

function handleMouseClick(d,i) {
    d3.select('.toggleOn').classed('toggleOn', false);
    d3.select(this).classed('toggleOn', true);
}

function handleMouseClickLine(d){

}

function handleMouseOverLine(d){
    console.log(d)
    d3.select('#barInfo')
    .classed('hidden', false)
    .style('margin-left', xScale(d.year) + 'px')
    .style('margin-top',  yScale(d.deaths) -70+ 'px')
    .html(`<strong>Cause:</strong> ${d[0].cause}<br/> <strong>Deaths:</strong> ${d.deaths}`);
    

    d3.selectAll(".line").style('stroke', (d) => "grey");
    d3.select(this).style('stroke', (d) => "red");
}

function handleMouseOutLine(d) {
    d3.selectAll(".line").transition().duration(500).style('stroke', (d) => colorMatrix[d[0].cause]);
    d3.select('#barInfo').classed('hidden', true);
}

function initGraph() {

        svg = d3.select('#main').append('svg').attr('width', w).attr('height', h);

        //scales
        yScale = d3.scaleLinear()
            .domain([0,maxDeath[state]])
            .range([h-20, 20]);
        
            
        xScale = d3.scaleTime()
            .domain([d3.min(groupByState[state][cause], (d)=> d.year), d3.max(groupByState[state][cause], (d)=> d.year)])
            .range([40, w-40]);


        //AXIS
        xAxis = d3.axisBottom(xScale)
            .ticks(17)
            .tickFormat(d3.timeFormat('%Y'));
        xAxisGroup = svg.append('g')
             .attr('transform', `translate(0, ${h - 20})`)
             .call(xAxis);

        yAxis = d3.axisLeft(yScale);
        yAxisGroup = svg.append('g')
             .attr('transform', `translate(40, 0)`)
             .call(yAxis);


             ///////LINE
        for(let key in groupByState[state]){

            lineMatrix[key] = svg.append('path')
            .datum(groupByState[state][key], keyFunction)
            .attr("class", "line")
            .attr("d", line)
            .attr("id", key)
            .style("stroke", colorMatrix[key])
            .on('mouseover', handleMouseOverLine)
            .on('mouseout', handleMouseOutLine)
            .on('click', handleMouseClickLine);

        }

        let i =0;
        for(let key in groupByState[state]){
        svg.selectAll(`.dot-${i}`)
            .data(groupByState[state][key], keyFunction)
            .enter().append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", function(d, i) { return xScale(d.year) })
            .attr("cy", function(d) { return yScale(d.deaths) })
            .attr("r", 3)
            .style("fill", colorMatrix[key])
            i++;
        }
}

function updateGraph() {


    yScale.domain([0, maxDeath[state]]);
   
    yAxisGroup.transition()
    .duration(1000)
    .call(yAxis);

//////////////LINE TRANSITION//////////////////
    

for(let key in groupByState[state]){
    if(key==="All causes") continue;
    lineMatrix[key].datum(groupByState[state][key])
    .transition().duration(750)
    .attr("d", line)

 }



 let i =0;
 for(let key in groupByState[state]){
    svg.selectAll(`.dot-${i}`)
        .data(groupByState[state][key], keyFunction)
        .enter()
        .append('circle')
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d, i) { return xScale(d.year) })
        .attr("cy", function(d) { return yScale(d.deaths) })
        .attr("r", 3)
        .style("fill", colorMatrix[key])
        .merge(svg.selectAll(`.dot-${i}`))
        .transition()
        .duration(500)
        .attr("cx", function(d, i) { return xScale(d.year) })
        .attr("cy", function(d) { return yScale(d.deaths) })
        .style("fill", colorMatrix[key])
        i++;



        
    svg.selectAll(`.dot-${i}`)
    .data(groupByState[state][key], keyFunction).exit()
        .transition()
        .duration(1000)
        .remove();
 }
}

window.onload = function() {
    let causeDropDown = document.querySelector('#cause');
    let stateDropDown = document.querySelector('#state');

    d3.csv(dataUrl, rowConverter).then((data) => {

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
            delete groupByState[key]["All causes"]
        }

        for(let key in groupByState["Alabama"]){
            let newSelect = document.createElement('option');
            newSelect.value = key;
            newSelect.innerText = key;
            causeDropDown.appendChild(newSelect);
        }

        maxDeath = d3.nest()
        .key((d) => d.state)
        .rollup((v) => d3.max(v, (d) => {
            if(d.cause!=="All causes")return d.deaths;
            return 0;
        }))
        .object(dataset)
        
        initGraph();

    })

    //add event listeners
    causeDropDown.addEventListener("change", (e) => {cause = e.target.value; updateGraph()})
    stateDropDown.addEventListener("change", (e) => {state = e.target.value; updateGraph()})
}