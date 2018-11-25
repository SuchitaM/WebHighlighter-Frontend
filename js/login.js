document.getElementById("submit").addEventListener('click', login); 
document.getElementById("myshelf").addEventListener("click", showMyShelf)
document.getElementById("inbox").addEventListener("click", showInbox);

var username = "Guest";
//If already loggedin then show home page
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
	buildHomePage(resp);
}

function buildHomePage(resp)
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
	//TODO
	//give req to server to get my highlights
	//get response and parse and build UI
		// document.getElementById("myshelf_content").innerHTML = "My highlights";
	// document.getElementById("myhighlights").innerHTML = "resp";
	chrome.storage.sync.get('user_id', function(resp){
			sendRequestToServer(server+"/api/store/annotations/user_id/"+resp.user_id,"GET","",onBuildMyShelfSuccess)	
	})
}

function onBuildMyShelfSuccess(resp)
{
	var arrayquotes =[];
	var length = JSON.stringify(JSON.parse(resp).count);
	var rows = JSON.parse(resp).rows;
	
	for (i = 0; i < length; i++) 
	{
		  console.log(rows[i].quote);
		  arrayquotes.push(rows[i].quote);
	}

    $(function(){

			var html = '<div class="container2">';
            
			var html = '<div class="container2">' +'<table>';
			$.each(arrayquotes, function(key, value){
			
		    html += '<tr>';
			
		    html += '<td>' + JSON.stringify(value) + '</td>';
			html += '</tr>';
			});
			html += '</table>';
			html+='</div>';

			$('span1').html(html);
		});
}

function buildInbox()
{
	
	//TODO
	//give req to server to get my messages
	//get response and parse and build UI
	// chrome.storage.sync.get('user_id', function(resp){
	// 		sendRequestToServer(server+"/api/messages/"+resp.user_id,"GET","",onBuildInboxSuccess)	
	// })
}

function onBuildInboxSuccess(resp)
{
	console.log(resp);
}
//Swtich tabs in home page
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







	
	