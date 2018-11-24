jQuery(function ($) {
	var currentURL = window.location.href;
	var date = new Date();
	var server = "https://webharvester.herokuapp.com";
	var user_id,username;
	var annotator = $(document.body).annotator();
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
        "comment" : "by "+username
      }

    });

    sendRequestToServer(server+"/api/store/annotations?url="+currentURL,"GET",null,onGetHighlights)
    }

    function onGetHighlights(response){
    	    annotator.annotator('loadAnnotations',response.rows);
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


