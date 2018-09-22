const SERVER_IP = 'ec2-52-14-37-216.us-east-2.compute.amazonaws.com';

document.getElementById("uploadbutton").onclick = uploadPDF;
document.getElementById("samplebutton").onclick = function() {
    loadJSON(SampleJSON);
};

let linesOfMusic = [];

let cancelProcessing = document.getElementById("cancelProcessing");

$("#pdfUpload").change(function() {
    let pdfView = document.getElementById("pdfView");
    if (pdfView.src != "")
        window.URL.revokeObjectURL(pdfView.src);
    let objectURL = window.URL.createObjectURL(this.files[0]);
    pdfView.src = objectURL;
});

function uploadPDF() {
    // obtain uploaded file
	let files = document.getElementById('pdfUpload').files;

	if (!files.length) {
  		return alert('Please choose a file to upload first.');
	}
	let file = files[0];
    let fileName = file.name;

    let formData = new FormData();
    formData.append(fileName,file)

    $('#modalUpload').modal('hide');
    $('#modalWait').modal('show');

    //request serverside processing
    let request = $.ajax({
        url: 'https://' + SERVER_IP + '/processPDF',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        timeout: 300000, //300 seconds
        success: function (data) {
            loadJSON(JSON.parse(data));
            stopWaiting();
        },
        error: function (data) {
            //ignore errors caused by the user cancelling the request
            if (data.statusText !='abort') {
                alert("Error processing file; Server may be offline :(");
            }
            stopWaiting();
        }
    });

    cancelProcessing.onclick = function() {request.abort();};
}

function loadJSON(image_data) {
    //remove the "nothing loaded message"
    document.getElementById("nothingLoaded").style.display = "none";

    //clear the previous lines of music
    for (line of linesOfMusic)
        line.destroy();

    //instantiate a LineOfMusic canvas for each processed image returned by server
    for (key in image_data) {
        img = "data:image/png;base64," + image_data[key]['image'];
        nodes = image_data[key]['notes'];
        linesOfMusic.push(new LineOfMusic(img,nodes));
    }
}

//remove the 'wait' modal and remove the ability to abort the ajax request
function stopWaiting() {
    $('#modalWait').modal('hide');
    cancelProcessing.onclick = null;
}
