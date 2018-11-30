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
				"comment" : " - "+username,
				"votes" : 0
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
    sendRequestToServer(messaging_endpoint,"GET",null,onGetHighlights);
    sendRequestToServer("https://nim5kyzfd6.execute-api.us-west-1.amazonaws.com/Prod","POST",JSON.stringify({"url":currentURL}),onGetPredictions);
    
    }

    socket.on('share_annotaton', function(msg){
    	console.log("received anno");
    	var highlight = [JSON.parse(msg.annotation)];
	  	annotator.annotator('loadAnnotations',highlight);
	});


    function onGetHighlights(response){
    	    annotator.annotator('loadAnnotations',JSON.parse(response).rows);
    }
    
    function getParams(name){
	   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
	      return decodeURIComponent(name[1]);
	}

  function sendRequestToServer(url,method,data,callback)
	{
	console.log(url);
	console.log(data);
	$.ajax({
        url:url,
		method : method,
		data :data,
        success:function(response) {
				callback(response);
            },
        timeout: 120000 // sets timeout to 120 seconds
     });	
	}

	function findDomElementsWithContent(rootNode,content)
	{
    var elementList = []


    function parseDom(currentNode)
    {
        if(currentNode.nodeType == 1)
        {
            
            if(currentNode.textContent.indexOf(content)!=-1)
            	elementList.push(currentNode);
            
            for(let i=0;i<currentNode.children.length;i++)
            {
                parseDom(currentNode.children[i]);
            }
        }
    }

    parseDom(rootNode);

    return elementList;
	}

	function highlightDomByContent(content)
	{
			var elementList = findDomElementsWithContent(document.body,content);
			if(elementList.length)
			{
				try
				{
					var parent = elementList[elementList.length-1];
					var html = parent.innerHTML;
					var parentContents = content.split(" ");
					var firstWord = parentContents[0];
					var lastWord = parentContents[parentContents.length-1];
					if(html.indexOf(firstWord)!=-1)
					{
							html = html.replace(firstWord,"<span class='predicted_highlight'>"+firstWord);
					}
					else
					{
						    html = "<span class='predicted_highlight'>" + html;
					}
					if(html.indexOf(lastWord)!=-1)
					{
							html = html.replace(lastWord,lastWord+"</span>");
					}
					else
					{
							html = html + "</span>";
					}
					parent.innerHTML = html;
				}
				catch(ex)
				{

				}
			}
	}

	function onGetPredictions(predictions)
	{
		for(let i=0;i<predictions.length;i++)
			highlightDomByContent(predictions[i]);
	}	

	//predictions = ["Daenerys is a young woman in her early teens living","She subsequently appeared in A Clash of Kings (1998) and A Storm of Swords (2000).  Daenerys was one of a few prominent characters not included in 2005's A Feast for Crows, but returned in the next novel A Dance with Dragons (2011).[4][5]"];
	// predictions = [
 //    ": San Jos State University Ranked First in Private Giving to CSU During ",
 //    ", the SJSU main campus is situated on ",
 //    ") provides housing for domestic as well as international students of the university",
 //    "'s first public library occupied the same site from ",
 //    "'s Wahlquist Library occupied the site from ",
 //    ", enrollment at SJSU has become impacted in all undergraduate majors",
 //    ", which means the university no longer has the enrollment capacity to accept all CSU",
 //    ", including some from local high schools and community colleges",
 //    "-story residence facility located on the SJSU campus near the intersection of ",
 //    "9th Street and Paseo de San Carlos"
	// ];		
	//onGetPredictions(predictions);	
});
 

