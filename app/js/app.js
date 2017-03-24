var Button = videojs.getComponent('Button');
var MyButton =videojs.extend(Button,{

  constructor: function () {
    Button.apply(this, arguments);
    this.addClass("vsj-transcript");
  },
  handleClick: function () {
    this.options_.showTranscript=!this.options_.showTranscript
    if(this.options_.showTranscript){
      $('#transcript').show()
    }else{
      $('#transcript').hide()
    }
  }
});

videojs.registerComponent('MyButton', MyButton);

/*PLAYER*/
var video = videojs('my-player');

// Set up any options.
var options = {
  showTitle: false,
  showTrackSelector: true,
};
// Initialize the plugin.
var transcript = video.transcript(options);

// Then attach the widget to the page.
var transcriptContainer = document.querySelector('#transcript');
transcriptContainer.appendChild(transcript.el());

video.videoJsResolutionSwitcher();

function temas(time){
  video.currentTime(time)
}

//AGREGA EL BOTON A LA BARRA DE CONTROLES DEL VIDEO PLAYER
var controlBar= video.getChild('controlBar');
var penultimoControl=controlBar.getChild("audioTrackButton");
var prueba=controlBar.addChild('myButton',{showTranscript:true});
controlBar.el().insertBefore(prueba.el(),penultimoControl.el());



/*VISUALIZADOR*/


// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url = '../presentacion/identidades.pdf';

// The workerSrc property shall be specified.
PDFJS.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 0.8,
    canvas = document.getElementById('the-canvas'),
    ctx = canvas.getContext('2d');

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage(num) {
  pageNum=num;
  pageRendering = true;
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function(page) {
    var viewport = page.getViewport(scale);
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);

    // Wait for rendering to finish
    renderTask.promise.then(function() {
      pageRendering = false;
      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  });

  // Update page counters
  document.getElementById('page_num').value = pageNum;
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

/**
 * Displays previous page.
 */
function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}
document.getElementById('prev').addEventListener('click', onPrevPage);

/**
 * Displays next page.
 */
function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}
document.getElementById('next').addEventListener('click', onNextPage);

/**
 * Asynchronously downloads PDF.
 */
PDFJS.getDocument(url).then(function(pdfDoc_) {
  pdfDoc = pdfDoc_;
  document.getElementById('page_count').textContent = pdfDoc.numPages;

  // Initial/first page rendering
  renderPage(pageNum);
});

function runScript(e) {
  if (e.keyCode == 13) {
    var tb = document.getElementById("page_num");
    var a = parseInt(tb.value);
    renderPage(a);

  }
}

/* ARCHIVO DE CONFIGURACION*/

//Estilo dinamico Json

video.ready(function() {
  $.getJSON( "data/produccion.json", function( data)  {
    var items = [];
    console.log(data);
    $("div.vjs-control-bar").css("background-color",data.video.controlBarColor);
    $("ul.vjs-menu-content").css("background-color",data.video.controlBarColor);
    $(".vjs-control").css("color",data.video.controlBarElementColor);
    $("div.vjs-play-progress").css("background-color",data.video.progressBarColor);
    $("div.video-js").css({"height":data.video.height,"width":data.video.width});
    $("#titlebar").css("background-image","url(img/texture.png), -webkit-linear-gradient("+data.presentacion.frameColor +","+ data.presentacion.frameColor+")");
    $("#toolbarContainer").css("background-image","url(img/texture.png), -webkit-linear-gradient("+data.presentacion.frameColor +","+ data.presentacion.frameColor+")");
    $("#the-canvas").css("width",data.presentacion.width);
    $('#documentName').css("color",data.presentacion.colorLetra);
    $('.toolbarLabel').css("color",data.presentacion.colorLetra);
    $('#page_num').css("color",data.presentacion.colorLetra);
  });
});
