//variables

let dataset;
const w=700;
const h=500;
let svg, svg2, exitButton;
let xScale, yScale;
let xScale2, yScale2;
let xAxis, yAxis;
let xAxis2, yAxis2;
let xAxisGroup, yAxisGroup;
let xAxisGroup2, yAxisGroup2;
let state = "Alabama";
let cause = "Cancer";
let maxDeath;
const dataUrl = "NCHS_-_Leading_Causes_of_Death__United_States.csv";
let groupByState;
let lineMatrix = {};

let line = d3.line()
    .x((d) => {return xScale(d.year)})
    .y((d) => {return yScale(d.deaths)});


let colorMatrix = {
    "Unintentional injuries": "teal",
    "Alzheimer's disease": "orange",
    "Cancer": "brown",
    "CLRD": "magenta",
    "Diabetes": "blue",
    "Heart disease": "purple",
    "Influenza and pneumonia": "black",
    "Kidney disease": "yellow",
    "Stroke": "pink",
    "Suicide": "green"
};

function rowConverter(d) {
    return {
        year:  d3.timeParse('%Y')(+d.Year),
        cause: d["Cause Name"],
        state: d.State,
        deaths: parseInt(d.Deaths)
    }
}

//mouse over the circles or over bars in the second graph
function handleMouseOver(d, i){ 
    //update and reveal extra div 
    d3.select('#barInfo')
      .classed('hidden', false)
      .style('margin-left', d3.event.pageX + 'px')
      .style('margin-top',  d3.event.pageY -140+ 'px')
      .html(`<strong>Location:</strong> ${d.state}</br><strong>Cause:</strong> ${d.cause}</br><strong>Year:</strong> ${d3.timeFormat('%Y')(d.year)}<br/> <strong>Deaths:</strong> ${d.deaths}`);
    
    //change color for extra pop
    d3.select(this).style('fill', 'red');

}

//mouse moves out of the circles or bars in second graph
function handleMouseOut(d,i) {
    //hide extra div
    d3.select('#barInfo').classed('hidden', true);
    
    //reset color
    d3.select(this).style('fill', (d) => colorMatrix[d.cause]);
}

//mouse clicks on a line
function handleMouseClickLine(d1){
    cause = d1[0].cause;
    //check if the second graph already exists
   if(!svg2){ 
       //if not, create a button to hide the graph
       exitButton = document.createElement('button');
       exitButton.innerText = "Hide Second Graph";
       document.querySelector('#main2').appendChild(exitButton);
       
       //create the graph
       svg2 = d3.select('#main2').append('svg').attr('width', w).attr('height', h);
       
       //event listener to hide the graph and button
       exitButton.addEventListener('click', (e) => {
           document.querySelectorAll('svg')[1].classList.add('hidden')
           document.querySelector('button').classList.add('hidden');
       })

        //scales
        yScale2 = d3.scaleLinear()
            .domain([0,d3.max(groupByState[state][d1[0].cause], (d)=> d.deaths)])
            .range([h-50, 20]);


        xScale2 = d3.scaleTime()
            .domain([d3.min(groupByState[state][d1[0].cause], (d)=> d.year), d3.timeYear.offset(d3.max(groupByState[state][d1[0].cause], (d)=> d.year),1)])
            .range([70, w-40]);


        //bars
        svg2.selectAll('.bars')
            .data(groupByState[state][d1[0].cause])
            .enter()
            .append('rect')
            .classed('bars', true)
            .attr('x', (d) => xScale2(d.year))
            .attr('y', (d) => yScale2(d.deaths))
            .attr('height', (d) =>  h-50-yScale2(d.deaths))
            .attr('width', 20)
            .style('fill', (d) => colorMatrix[d.cause])
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

        
        //axis
        //could actually re use this...
        xAxis2 = d3.axisBottom(xScale2)
            .ticks(17)
            .tickFormat(d3.timeFormat('%Y'));
        xAxisGroup2 = svg2.append('g')
             .attr('transform', `translate(0, ${h - 50})`)
             .call(xAxis2);
        //text label for x axis
        svg2.append("text")             
             .attr("transform",`translate(${w/2}, ${h-10})`)
             .style("text-anchor", "middle")
             .text("Year");

        yAxis2 = d3.axisLeft(yScale2)
            .tickFormat(d3.format(".3s"));
        yAxisGroup2 = svg2.append('g')
             .attr('transform', `translate(70, 0)`)
             .call(yAxis2);
        // text label for y axis
        svg2.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 5)
            .attr("x",0 - (h / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Number of Deaths");  
    }else {
        //un-hide the graph if hidden
        document.querySelectorAll('svg')[1].classList.remove('hidden')
        document.querySelector('button').classList.remove('hidden');
        updateSecondGraph();
    }

}

function updateSecondGraph(){

        //update y scale
        yScale2.domain([0,d3.max(groupByState[state][cause], (d)=> d.deaths)]);
        yAxisGroup2.transition()
            .duration(1000)
            .call(yAxis2);

        //update bars
        svg2.selectAll(`.bars`)
            .data(groupByState[state][cause])
            .transition()
            .duration(1000)
            .attr('y', (d) => yScale2(d.deaths))
            .attr('height', (d) =>  h-50-yScale2(d.deaths))
            .style('fill', (d) => colorMatrix[cause])
}

//for mouse over the lines
function handleMouseOverLine(d){
    //update and show extra div
    d3.select('#barInfo')
    .classed('hidden', false)
    .style('margin-left', d3.event.pageX + 'px')
    .style('margin-top',  d3.event.pageY -140+ 'px')
    .html(`<strong>Cause:</strong> ${d[0].cause}<br/>`);
    
    //grey everything out
    d3.selectAll(".line").style('stroke', (d) => "grey").style('stroke-width', 2);
    d3.selectAll(".dot").style('fill', (d) => "grey");
    
    //color selected line and respective circles red
    d3.select(this).style('stroke', (d) => "red").style('stroke-width', 3);
    d3.selectAll(`.dot-${d[0].cause.replace(/ /g,'').replace('\'','')}`).style('fill', (d) => "red");
}

//for mouse moving out of line
function handleMouseOutLine(d) {
    //set line colors to normal
    d3.selectAll(".line").transition().duration(500).style('stroke', (d) => colorMatrix[d[0].cause]).style('stroke-width', 3);
    //set circle colors to normal
    d3.selectAll(".dot").transition().duration(500).style('fill', (d) => colorMatrix[d.cause]);
   //hide the extra div
    d3.select('#barInfo').classed('hidden', true);
}


function initGraph() {

        svg = d3.select('#main2').append('svg').attr('width', w).attr('height', h);

        //scales
        yScale = d3.scaleLinear()
            .domain([0,maxDeath[state]])
            .range([h-50, 20]);
        
            
        xScale = d3.scaleTime()
            .domain([d3.min(groupByState[state][cause], (d)=> d.year), d3.max(groupByState[state][cause], (d)=> d.year)])
            .range([70, w-20]);


        //AXIS
        xAxis = d3.axisBottom(xScale)
            .ticks(17)
            .tickFormat(d3.timeFormat('%Y'));
        xAxisGroup = svg.append('g')
             .attr('transform', `translate(0, ${h - 50})`)
             .call(xAxis);
        svg.append("text")             
             .attr("transform",`translate(${w/2}, ${h-10})`)
             .style("text-anchor", "middle")
             .text("Year");

        yAxis = d3.axisLeft(yScale)
            .tickFormat(d3.format(".3s"));
        yAxisGroup = svg.append('g')
             .attr('transform', `translate(70, 0)`)
             .call(yAxis);
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 5)
            .attr("x",0 - (h / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Number of Deaths");  

        //lines
        for(let key in groupByState[state]){
            lineMatrix[key] = svg.append('path')
            .datum(groupByState[state][key])
            .attr("class", "line")
            .attr("d", line)
            .attr("id", key)
            .style("stroke", colorMatrix[key])
            .on('mouseover', handleMouseOverLine)
            .on('mouseout', handleMouseOutLine)
            .on('click', handleMouseClickLine);
        }

        //circles on the lines
        let i =0;
        for(let key in groupByState[state]){
        svg.selectAll(`.dot-${i}`)
            .data(groupByState[state][key])
            .enter().append("circle") // Uses the enter().append() method
            .classed(`dot-${key.replace(/ /g,'').replace('\'','')}`, true)
            .classed('dot', true)
            .attr("cx", function(d, i) { return xScale(d.year) })
            .attr("cy", function(d) { return yScale(d.deaths) })
            .attr("r", 4)
            .style("fill", colorMatrix[key])
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);
            i++;
        }
}

function updateGraph() {
    //update scale
    yScale.domain([0, maxDeath[state]]);
   
    yAxisGroup.transition()
        .duration(1000)
        .call(yAxis);
    
    //update lines
    for(let key in groupByState[state]){
        if(key==="All causes") continue;
        lineMatrix[key].datum(groupByState[state][key])
        .transition().duration(750)
        .attr("d", line)

    }

    //update circles
    let i =0;
    for(let key in groupByState[state]){
        svg.selectAll(`.dot-${key.replace(/ /g,'').replace('\'','')}`)
            .data(groupByState[state][key])
            .transition()
            .duration(750)
            .attr("cy", function(d) { return yScale(d.deaths) })
            i++;
    }
}

window.onload = function() {
    let stateDropDown = document.querySelector('#state');

    d3.csv(dataUrl, rowConverter).then((data) => {

        dataset = data;
        
        groupByState = d3.nest()
            .key(function(d) { return d.state; })
            .key(function(d) {return d.cause})
            .object(dataset);

        //fill the states selector
        for(let key in groupByState){
            let newSelect = document.createElement('option');
            newSelect.value = key;
            newSelect.innerText = key;
            stateDropDown.appendChild(newSelect);
            delete groupByState[key]["All causes"]
        }

        //find info on max number of deaths per state
        maxDeath = d3.nest()
            .key((d) => d.state)
            .rollup((v) => d3.max(v, (d) => {
                if(d.cause!=="All causes")return d.deaths;
                return 0;
            }))
            .object(dataset)
        
        initGraph();

        //make the legend
        let main = document.querySelector('#main2');
        let container = document.createElement('div');
        for(let key in groupByState["Alabama"]){
            let newSpan = document.createElement('span');
            let newLedgeSpan = document.createElement('span');
            let newLedgeText = document.createElement('span');

            newLedgeSpan.classList.add('legend-rect');
            newLedgeSpan.style.backgroundColor = colorMatrix[key];
            newSpan.appendChild(newLedgeSpan)

            newLedgeText.innerText = `${key}`;
            newLedgeSpan.style.marginLeft = '5px';
            newSpan.appendChild(newLedgeText)

            newSpan.style.marginLeft = '20px'

            container.appendChild(newSpan);
        }
        
        container.style.display = 'block';
        container.style.margin = 'auto';
        main.appendChild(container);
    })

    //add event listeners
    stateDropDown.addEventListener("change", (e) => {
        state = e.target.value; 
        updateGraph();
        if(svg2 && !document.querySelectorAll('svg')[1].classList.contains('hidden')){
           updateSecondGraph();
        }
    })
}