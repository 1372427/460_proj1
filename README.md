# 460_proj1

## Dataset description

The data set I chose is information about the number of deaths due to the top ten leading causes of death from the years 1999 to 2016. This data was found
at https://catalog.data.gov/dataset/age-adjusted-death-rates-for-the-top-10-leading-causes-of-death-united-states-2013 .

I opened the dataset in openrefine, but it was very clean. The numbers seemed reasonable overall, and there were no mispellings. I ended up not doing anything
to the data. There are two columns that I did consider removing so that the data was more consice and did not use any excess memory. These were a more detailed 
name for the cause of death, and a column named age-adjusted death rate. I did not clean these initially as I was not sure if I wanted to include these columns in the 
final product. I needed to find out what the age-adjusted death rate was, but I could not understand from the description given on the dataset website. In the end, I did
not use either of these columns. If I were to do this again, I would remove those columns of data. 

## Decisions on Visualization

Originally, I was thinking about using a bar chart. The user would be able to pick between both the states and the causes of death. However, I felt like the user would benefit from seeing the comparison between the different causes within a state. I then decided to change the graph to a line chart, where all the causes of death were their own line and the user could change between the states. When I completed this, I realized that the scale was too large for the differences and trends in the causes with fewer deaths. To combat this, I first got rid of one "cause" which was all causes combined. This made the scale change significantly, yet I still did not think this was enough. I decided to add back my original bar chart, but as an extra feature. If the user wished to take a closer look at a particular cause of death, they can click on the line and a new graph would be displayed with only that cause being shown. To be consistent, I made the bars the same color as the one used in the line chart.  

## Discoveries 

I tried to add several different features in the graph than we covered in class. One of these was snapping to dots or lines when moving the mouse. I ended up not incorporating this, but I found several interesting examples regarding this.

## Challenges

It was difficult to decide how to display the information so that the story was the fullest. Originally, there was a "all causes" row, which I ommited as it would skew the scale for the smaller of the causes of death. In the end, the top two causes had significantly higher numbers than the other causes, leading them to be crammed at the bottom of the graph. I also decided to use two graphs instead as I didn't think trends in one cause alone could be easily seen in the line chart. I do think this helped when analyzing the data.

Another challenge was the colors. Since I decided to display all causes at the same time, I needed to use 10 colors, though it is recommended not to use more than five or seven colors. In the end, I actually used 11 colors, as I also had a hover over color. I felt it was more important to have a unique color for this than to try and get rid of colors. Instead, I greyed out all other data which was not being hovered over, so the line in question would pop out. I also made the stroke width smaller for the lines not being hovered over. 

One thing which I could not solve, was a strange problem I only ran into under certain circumstances. Sometimes, the bar chart will not update colors of the rectangles. I could not find a connection or pattern for these bars, however. 

## Resources

I used the following resources: 

https://stackoverflow.com/questions/6623231/remove-all-white-spaces-from-text
http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae
http://bl.ocks.org/d3noob/38744a17f9c0141bcd04
http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
https://bl.ocks.org/pstuffa/26363646c478b2028d36e7274cedefa6
https://bl.ocks.org/alandunning/cfb7dcd7951826b9eacd54f0647f48d3
https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html
https://bl.ocks.org/jkeohan/b8a3a9510036e40d3a4e
Color Scheme: Office Room 2 from https://digitalsynopsis.com/design/beautiful-color-palettes-combinations-schemes/