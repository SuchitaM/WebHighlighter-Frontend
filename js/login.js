document.getElementById("submit").addEventListener('click', login); 
document.getElementById("myshelf").addEventListener("click", showMyShelf)
document.getElementById("inbox").addEventListener("click", showInbox);

var username = "Guest";
var msg_annotation_id = "";
var elem = "";
//If already loggedin then show home page
buildUiIfUserLoggedIn();


function buildUiIfUserLoggedIn(){
	chrome.storage.sync.get("loggedin", function(resp)
	{
		if (resp.loggedin == true)
		{
			chrome.storage.sync.get("username", function(resp)
				{		
					username = resp.username;
					buildHomePage();	
				});	
		}
	});
}

function login(){
	var username = document.getElementById("user").value;
	var password = document.getElementById("pass").value;
	var data = {
			username : username,
			password : password
		}
	sendRequestToServer(server+"/api/users/login","POST",data,onLogin)
}


function onLogin(resp)
{
	if(!resp || resp.login != true)
	{
		printError()
		return
	}
	chrome.storage.sync.set({'username': resp.username});
	chrome.storage.sync.set({'loggedin': resp.login});
	chrome.storage.sync.set({'user_id': resp.user_id});
	buildUiIfUserLoggedIn();
}

function buildHomePage()
{
	//Hide login and show homepage
	document.getElementById("logindiv").style.display = "none";
	document.getElementById("homepagediv").style.display = "block";
	document.getElementById("welcomemsg").innerHTML = "Welcome " + username;
	buildMyShelf();
	buildInbox();
}

function buildMyShelf()
{
	chrome.storage.sync.get('user_id', function(resp){
			sendRequestToServer(server+"/api/store/annotations/user_id/"+resp.user_id,"GET","",onBuildMyShelfSuccess)	
	})
}

function onBuildMyShelfSuccess(resp)
{
	var arrayquotes =[];
	var length = JSON.stringify(JSON.parse(resp).count);
	var rows = JSON.parse(resp).rows;
	console.log(rows);
	
    $(function(){

   		var html = '';
        for (var i = rows.length-1; i >= 0; i--) {
            //console.log(resp[i]);
            
            html += '<div class="container2">';
            
            html += '<input type="checkbox" id="myshelf_item'+i+'">'+ rows[i].uri + '</input>';
            
            html += '<div id="hidden"></br></br>';
            html += '<div style="float:left"><a href="#" class="redirect" data-href = "'+rows[i].uri+'?annotation_id='+rows[i]._id+'">' + JSON.stringify(rows[i].quote)+'</a></div>';
            html += '<div class="right"><a href="#modalScreen" class="button modal_annotation" data-ann_id = "'+rows[i]._id+'"><img src="img/forward.png" class="forward" height="130px" data-ann_id = "'+rows[i]._id+'"/></a></div></td>';
            html += '</div>';
            html += '<label for="myshelf_item'+i+'">Show/hide</label>';
             
            html += '</div>';
    	};
			

		html +='<div id="modalScreen">'+'<fieldset class="group">' +'<legend>'+'Select names to forward'+'</legend>'+'</fieldset>'+'</br>';

		html += '<ul class="checkbox">'+'<li>'+'<input type="checkbox" id="c_b" />'+'<label for="c_b">Renu</label><input data-to-id=\"5bf9c428e8c62a1f94300414\" type="button" class="send" value="send"/></li>';
		html += '<li>'+'<input type="checkbox" id="c$b" value="5bf9c409e8c62a1f94300413"/>'+'<label for="c$b">'+'Arun'+'</label>'+'<input type="button" data-to-id=\"5bf9c409e8c62a1f94300413\"  class="send" value="send"/>'+'</li>'; 
		html += '<li>'+ '<input type="checkbox" id="c@b" value="5bf9c43de8c62a1f94300415" />'+'<label for="c@b">'+'Pranav'+'</label>'+'<input type="button" data-to-id=\"5bf9c43de8c62a1f94300415\"  class="send" value="send"/>'+'</li>'; 

		html += '<li>'+'<input type="checkbox" id="c%b" value="5bf9c44fe8c62a1f94300416" />'+'<label for="c%b">'+'Suchita'+'</label>'+'<input type="button" data-to-id=\"5bf9c44fe8c62a1f94300416\"  class="send" value="send"/>'+'</li> '+'</ul>';
		html += '<br/>'+ '<div style="padding-left: 10px">'+'</div>'+'</fieldset>';
		html += '<a href="#" class="cancel">'+'&times;'+'</a>'+'</div>';
		html += '<input type="button"="cover" >'+'</div>';


		$('span1').html(html).promise().done(function(){
			var modal_annotation = document.getElementsByClassName("modal_annotation");
		    data = modal_annotation;
		    for (var i = 0; i < data.length; i++) {
			    data[i].addEventListener('click', setModalValue);
			}

			var send_annotation = document.getElementsByClassName("send");
		    data = send_annotation;
		    for (var i = 0; i < data.length; i++) {
			    data[i].addEventListener('click', postmessage);
			}
			});
		});

}

function buildInbox()
{
	chrome.storage.sync.get('user_id', function(resp){
        sendRequestToServer(server+"/api/messages/"+resp.user_id,"GET","",onBuildInboxSuccess)  
	})
}

function onBuildInboxSuccess(response)
{
    console.log(response);
    resp = response.rows;
    
    $(function () {

        var html = '';
        for (var i = resp.length-1; i >= 0; i--) {
            
            html += '<div class="container2">';
            
            html += '<img src="img/jon-snow.jpg" alt="Avatar" style="width:60px;height:60px"/>';          

            html += '<input type="checkbox" id="mycheckbox'+i+'">'+ resp[i].username + ':-  ' + resp[i].annotations[0].uri + '</input>';
            
            html += '<div id="hidden"></br></br>';
            html += '<div style="float:left"><a href="#" class="redirect" data-href = "'+resp[i].annotations[0].uri+'?annotation_id='+resp[i].annotation_id+'">'+ resp[i].annotations[0].quote + '</a></div>';
            html += '</div>';
            html += '<label for="mycheckbox'+i+'">Show/hide</label>';
            
            html += '<div class="time-right">' + resp[i].timestamp + '</div>';
            
            html += '</div>';
    	};
        
        $('#inbox_content').html(html).promise().done(function(){
        	var redirect = document.getElementsByClassName("redirect");
		    for (var i = 0; i < redirect.length; i++) {
			    redirect[i].addEventListener('click', redirect_to_link);
			}

        });
    });
}

//Switch tabs in home page
function showMyShelf()
{
	document.getElementById("myshelf_content").style.display = "block";
	document.getElementById("inbox_content").style.display = "none";	
}

function showInbox()
{
	document.getElementById("myshelf_content").style.display = "none";
	document.getElementById("inbox_content").style.display = "block";
}

function postmessage()
{
	console.log("posting msg");
	var to = event.target.getAttribute("data-to-id");
	//var to_name = event.target.getAttribute("data-to-name");
	var subject = "Sample message";
	chrome.storage.sync.get('user_id', function(resp){
			var data = {};
			data.from = resp.user_id;
			data.to = to;
			data.subject = subject;
			data.username = username;
			data.timestamp = new Date();
			data.annotation_id = msg_annotation_id;
			console.log(data);
			sendRequestToServer(server+"/api/messages/","POST",data,onPostMessageSuccess)	
	})
}

function onPostMessageSuccess(resp)
{
	console.log(resp);
}

function setModalValue(event)
{
	console.log("modal");
	msg_annotation_id = event.target.getAttribute("data-ann_id");
}

function redirect_to_link()
{
	url = event.target.getAttribute("data-href");
	chrome.tabs.create({url: url});
}