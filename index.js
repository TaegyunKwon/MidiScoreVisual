class loadMIDI{

    loadJSON(callback) { 
        var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
        xobj.open('GET', 'align.json', true); // Replace 'my_data' with the path to your file
        xobj.onload = function () {
              if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
              }
        };
        xobj.send(null);  
     }

     loadJSONToMIDI(callback){
         this.loadJSON((response)=>{
             const midi = JSON.parse(response);
             const notes = midi.tracks[0].notes
             callback(notes)
            });
     }

}

midiLoader = new loadMIDI();

// Select the svg area
var svg = d3.select("#midi_roll")

// Create a scale: transform value in pixel
var x = d3.scaleLinear()
    .domain([0, 7.5])         // This is the min and the max of the data: 0 to 100 if percentages
    .range([200, 1500]);       // This is the corresponding value I want in Pixel
// Try console.log( x(25) ) to see what this x function does.

var wx = d3.scaleLinear()
.domain([0, 7.5])         // This is the min and the max of the data: 0 to 100 if percentages
.range([0, 1300]);   

var y = d3.scaleLinear()
    .domain([21, 108])         // This is the min and the max of the data: 0 to 100 if percentages
    .range([300, -100]);       // This is the corresponding value I want in Pixel

var myColor = d3.schemeSpectral[11]


drawNotes = (notes) => {
    for (let i = 0; i < notes.length; i++) {
        svg.append("rect")
        .attr("x", x(notes[i].time))
        .attr("y", y(notes[i].midi))
        .attr("width", wx(notes[i].duration))
        .attr("height", 3)
        .style("fill", myColor[(notes[i].midi % 12)])
        .style("stroke", "black");
        console.log(notes[i].time, notes[i].duration)

    }
}

midiLoader.loadJSONToMIDI(drawNotes);



// Add 3 dots for 0, 50 and 100%