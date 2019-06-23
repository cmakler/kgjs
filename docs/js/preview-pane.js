function createCodeMirror(def) {
    console.log(def);
    const parent = d3.select(this),
    filename = parent.attr('filename'),
    previewWidth = +parent.attr('width') || 800,
    height = +parent.attr('height') || 500

    parent.style("width", previewWidth + 500 + "px")
    .attr("class","enclosing");
    
    const destWindow = parent.append('div')
    .attr("class","kg-container")
    .attr("src","examples/"+filename+".json")
    .style("width", previewWidth + "px")
    .style("height", height + "px")
    .style("float", "right");

    const srcWindow = parent.append('div')
    .attr("class","author")
    .style("width", "500px")
    .style("height", height + "px");

    

    var newMirror = {
        src : srcWindow.node(),
        dest: destWindow.node()
    }
    srcCodeMirror = CodeMirror(newMirror.src, {
        mode: "javascript",
        lineNumbers: true,
        lineWrapping: true
    })

    console.log(srcCodeMirror);

    newMirror.mirror = srcCodeMirror;
    newMirror.update = function() {
        const authorJSON = JSON.parse(newMirror.mirror.getValue());
        new KG.View(newMirror.dest, authorJSON)
    }
    newMirror.load = function(filename) {
        d3.json('examples/' + filename + '.json', function (data) {
            newMirror.mirror.setValue(JSON.stringify(data, null, 2));
            new KG.View(newMirror.dest, data);
        });
    }
    newMirror.mirror.on("change", newMirror.update);
    newMirror.load(filename);
    return newMirror;
}

divs = d3.selectAll(".codePreview").each(createCodeMirror);