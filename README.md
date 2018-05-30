First Prototype of Smart Textile Design Software.
Designed Spring 2018 - uploaded May 2018
By: Laura Devendorf, Unstable Design Lab (http://unstable.design)

This uses images represenenting various functional sections of a weave. Each image, or layer, reprsents a different thread in the weave. The images are not dynamically loaded (yet) just read from the directory. Merging the image is akin to using a scan-line approach to adding all the weaves togehter. Each line in the image pattern is then translated to a text pattern describing the number of yarns the pattern travels over and under. This pattern was designed for weaving something rather complex on a rigid heddle loom. It also does not allow the design to be modified in the browser (only through the images). 

FILES: 
index.hml - the framework for the page
renderer.js - the functions responsible for rendering the weave as an SVG within a div. 
ui.js - the functions responsible for updating and controlling the weave on the right side of the page. 

TO DO:
 
(1) convert the SVG rendering of the weave to a canvas image element to allow for easier pixel picking and manipulation

(2) create a way of describing what patterns correspond to black and white regions of an image. 


