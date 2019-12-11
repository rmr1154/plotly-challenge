var datafile = "data/samples.json"


function buildPlots(sampleId) {
  // Fetch the JSON data by sampleId
  d3.json(datafile).then(function (data) {

    // build sets from our filtered data
    var metadata = data.metadata.filter(metadata => metadata.id == sampleId)[0];
    var samples = data.samples.filter(sample => sample.id == sampleId)[0];

    // extract individual arrays from the samples set
    var otu_ids = samples.otu_ids.map(String);
    var otu_ids_top10 = samples.otu_ids.sort((a, b) => b - a).slice(0, 10).map(String);
    var otu_labels = samples.otu_labels;
    var otu_labels_top10 = samples.otu_labels.sort((a, b) => b - a).slice(0, 10);
    var sample_values = samples.sample_values;
    var sample_values_top10 = samples.sample_values.sort((a, b) => b - a).slice(0, 10);;
    // console log our sets and arrays for sanity check
    console.log(`metadata for ${sampleId}`, metadata);
    console.log(`samples for ${sampleId}`, samples);
    console.log(`otu_ids for ${sampleId}`, otu_ids);
    console.log(`otu_labels for ${sampleId}`, otu_labels);
    console.log(`sample_values for ${sampleId}`, sample_values);
    console.log(`top 10 otu_ids for ${sampleId}`, otu_ids_top10);
    console.log(`top 10 otu_labels for ${sampleId}`, otu_labels_top10);
    console.log(`top 10 sample_values for ${sampleId}`, sample_values_top10);

    // build our Demographic data (metadata)
    var pnl_metadata = d3.select("#demographics");
    // empty out any existing html
    pnl_metadata.html("");

    // loop thru the set and get the k,v pairs using the array indexs
    Object.entries(metadata).forEach(function (key) {
      pnl_metadata
        .append("div")
        .classed("metadata", true)
        .text(`${key[0]}: ${key[1]}`);
      console.log(`${key[0]}: ${key[1]}`);
    });

    // build bar chart
    var bar_trace = {
      x: sample_values_top10,
      //y: otu_ids_top10,
      text: otu_labels_top10,
      type: "bar",
      //width: 10,
      orientation: "h"

    };
    // set the data array from our trace
    var bar_data = [bar_trace];

    // set the bar layout options
    var bar_layout = {
      title: `Top 10 OTUs (Test Subject ${sampleId})`,
      xaxis: { title: "Sample Value" },
      yaxis: {
        tickvals: Array.from(Array(10).keys()),
        ticktext: otu_ids_top10.map(i => "OTU " + i)
      }
    };

    // render the plot in our div
    Plotly.newPlot('bar-plot', bar_data, bar_layout);


    // build bubble chart
    var bubble_trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids
      }

    };
    // set the data array from our trace
    var bubble_data = [bubble_trace];

    // set the bubble chart layout options
    var bubble_layout = {
      title: `Sample Values by OTU ID (Test Subject ${sampleId})`,
      xaxis: { title: "OTU ID " },
      yaxis: { title: "Sample Value" }
    };

    // render the plot in our div
    Plotly.newPlot('bubble-plot', bubble_data, bubble_layout);

  });
}

// function to handle the change in the dropdown for Subject ID (name)
function sampleChanged(sampleId) {
  // Fetch new data each time a new sample is selected
  console.log("changed id:", sampleId);
  buildPlots(sampleId);

}

// function to fire on load
function init() {
  // select our drop down
  var select_subject = d3.select("#testSubjectId");

  // populate our dropdown with the names
  d3.json(datafile).then(function (data) {
    var names = data.names;

    names.forEach((sampleId) => {
      select_subject
        .append("option")
        .text(sampleId)
        .property("value", sampleId);
    });

    // seed our default value from index[0] so we have something to load on start
    const defaultSampleId = names[0];

    // build the default plots
    buildPlots(defaultSampleId);
    console.log("default id:", defaultSampleId);

  });
}

// let's load this puppy!
init();