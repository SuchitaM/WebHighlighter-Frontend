jQuery(function ($) {
	var date = new Date();
	var server = "https://webharvester.herokuapp.com";
	var requested_annotation_id = getParams("annotation_id");
	var currentURL = window.location.href.split("?")[0];
	var messaging_endpoint = requested_annotation_id ? server+"/api/store/annotations/annotation_id/"+requested_annotation_id : server+"/api/store/annotations?url="+currentURL
	var user_id,username;
	var annotator = $(document.body).annotator();
	var socket = io.connect(server);
	var socket_start = true;
	finishPreReqs();

	function finishPreReqs()
	{
		chrome.storage.sync.get("user_id", function(resp)
				{
					user_id = resp.user_id;
					chrome.storage.sync.get("username", function(resp)
					{
						username = resp.username;
						initiateAnnotator();
					});
				});

	}

	function initiateAnnotator(){

    annotator.annotator('addPlugin', 'Store', {
      // The endpoint of the store on your server.
      prefix: server + '/api/store',

      // Attach the uri of the current page to all annotations to allow search.
      annotationData: {
        'uri': currentURL,
        'date': date,
        'user_id' : user_id,
        "comment" : " - "+username
      }

    });

    Annotator.Plugin.StoreLogger = function (element) {
	  return {
	    pluginInit: function () {
	      this.annotator
	          .subscribe("annotationCreated", function (annotation) {
	            console.info("The annotation: %o has just been created!", annotation);
	             if(socket_start){
	            	console.log("sending anno");
	            	delete annotation.highlights;
	              socket.emit('share_annotaton', { annotation: JSON.stringify(annotation)});  
	            }

	          });
	    }
	  }
	}

 	annotator.annotator('addPlugin', 'StoreLogger', {});
    console.log(messaging_endpoint);
    sendRequestToServer(messaging_endpoint,"GET",null,onGetHighlights)
    }

    socket.on('share_annotaton', function(msg){
    	console.log("received anno");
    	var highlight = [JSON.parse(msg.annotation)];
	  	annotator.annotator('loadAnnotations',highlight);
	});


    function onGetHighlights(response){
    	    annotator.annotator('loadAnnotations',response.rows);
    }
    
    function getParams(name){
	   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
	      return decodeURIComponent(name[1]);
	}

    function sendRequestToServer(url,method,data,callback)
	{
	$.ajax({
        url:url,
		method : method,
		data :data,
        success:function(response) {
				callback(JSON.parse(response));
            }
     });	
	}	
	
});


