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
//Calidad
video.videoJsResolutionSwitcher()

function temas(time){
  video.currentTime(time)
}

//AGREGA EL BOTON A LA BARRA DE CONTROLES DEL VIDEO PLAYER
var controlBar= video.getChild('controlBar');
var penultimoControl=controlBar.getChild("audioTrackButton");
var prueba=controlBar.addChild('myButton',{showTranscript:true});
controlBar.el().insertBefore(prueba.el(),penultimoControl.el());
console.log(controlBar.children());


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

  //OBTENER RESULTADOS VIA HTTP_REQUEST
/*
  var data_file = "produccion.json";
  var http_request = new XMLHttpRequest();
  try{
   // Opera 8.0+, Firefox, Chrome, Safari
   http_request = new XMLHttpRequest();
  }catch (e){
   // Internet Explorer Browsers
    try{
      http_request = new ActiveXObject("Msxml2.XMLHTTP");
    }catch (e) {
      try{
       http_request = new ActiveXObject("Microsoft.XMLHTTP");
      }catch (e){
      // Something went wrong
       alert("Your browser broke!");
       return false;
      }
    }
  };
  http_request.onreadystatechange = function(){
    if (http_request.readyState == 4  ){
      // Javascript function JSON.parse to parse JSON data
      var jsonObj = JSON.parse(http_request.responseText);
      // jsonObj variable now contains the data structure and can
      // be accessed as jsonObj.name and jsonObj.country.
      console.log(jsonObj);
    }
  }
  http_request.open("GET", data_file, true);
  http_request.send();*/
  $.getJSON( "data/produccion.json")
  .done(function( data)  {
    var items = [];
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
    //HABILITAR DESHABILITAR CONTROLES DEL PLAYER
    if(data.video.playButton===false)
      controlBar.removeChild("playToggle");
    if(data.video.volumen===false)
      controlBar.removeChild("volumeMenuButton");
    if(data.video.barraProgreso===false)
      controlBar.removeChild("progressControl");
    if(data.video.tiempo===false)
      controlBar.removeChild("remainingTimeDisplay");
    if(data.video.velocidad===false)
      controlBar.removeChild("playbackRateMenuButton");
    if(data.video.calidad===false)
      $(".vjs-resolution-button").hide()
    if(data.video.subtitulos===false)
      controlBar.removeChild("subtitlesButton");
    if(data.video.trasncripcion){
      // Initialize the plugin.
      var transcript = video.transcript(options);

      // Then attach the widget to the page.
      var transcriptContainer = document.querySelector('#transcript');
      transcriptContainer.appendChild(transcript.el());
    }
    if(data.video.fullScreen===false)
      controlBar.removeChild("fullscreenToggle");
  });
});
//PLugin Jquery para resaltar las palabras que se encuentren dentro de un texto
//Esta funcionalidad es util para resoltar las palabras que coincidad en el panel de trasncripcion
jQuery.fn.highlight = function (str, className) {
    var regex = new RegExp(str, "gi");
    return this.each(function () {
        $(this).contents().filter(function() {
            return this.nodeType == 3 && regex.test(this.nodeValue);
        }).replaceWith(function() {
            return (this.nodeValue || "").replace(regex, function(match) {
                return "<span class=\"" + className + "\">" + match + "</span>";
            });
        });
    });
};

function buscarPalabra() {
  //limpa los campos resaltados si exiten
  var seleccionadas=$(".highlight");
  seleccionadas.each(function () {
      $(this).contents().unwrap();
  }
  );
  var query=$("#query").val();
  $(".transcript-text").highlight(query,"highlight");
}
