function createCodeMirror(def) {
    const parent = d3.select(this),
        filename = parent.attr('filename'),
        previewWidth = +parent.attr('width') || 800,
        height = +parent.attr('height') || 500,
        initialCode = parent.node().innerHTML.trim().replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');

    parent.node().innerHTML = '';


    parent.style("width", previewWidth + 500 + "px")
        .attr("class", "enclosing");

    const destWindow = parent.append('div')
        .attr("class", "kg-container")
        .style("width", previewWidth + "px")
        .style("height", height + "px")
        .style("float", "right");

    const srcWindow = parent.append('div')
        .attr("class", "author")
        .style("width", "500px")
        .style("height", height + "px");


    var newMirror = {
        src: srcWindow.node(),
        dest: destWindow.node()
    }
    srcCodeMirror = CodeMirror(newMirror.src, {
        mode: "text/x-yaml",
        lineNumbers: true,
        lineWrapping: true,
        value: initialCode
    })

    newMirror.mirror = srcCodeMirror;
    newMirror.update = function () {
        let authorYAML;
        try {
            authorYAML = jsyaml.safeLoad(newMirror.mirror.getValue());
        } catch (e) {
            console.log('Error reading YAML: ', e.message)
        } finally {
            new KG.View(newMirror.dest, authorYAML);
        }
        return newMirror;
    }
    newMirror.mirror.on("change", newMirror.update);
    return newMirror.update();
}

divs = d3.selectAll(".codePreview").each(createCodeMirror);