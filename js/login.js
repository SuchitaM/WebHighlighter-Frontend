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

	// 	chrome.storage.local.get('user_id', function(resp){
	// 		sendRequestToServer(server+"/api/store/annotations?user_id="+resp.user_id,"GET","",onsuccessOne)	
	// })
	var resp = [
		{
		"_id": "5bf9e776c7e8a117ec009a8c","from": "5bea19e44a8e7a2ed08d9aad",
		"to": "5bf110e33343e7262cddd9c3","subject": "first highlight",
		"annotations": [{
			"_id": "5bf09448f9bfda3ac0d9c4a0",
			"ranges": [{ "start": "/div[3]/div[3]/div[4]/div[1]/p[12]", "startOffset": 0, "end": "/div[3]/div[3]/div[4]/div[1]/p[12]/a[3]", "endOffset": 7 }],
			"quote": "His first double century (204*) was for Mumbai while playing against the visiting Australian team at the Brabourne Stadium in 1998.[1][59] He is the only player to score a century on debut in all three of his domestic first-class tournaments (the Ranji, Irani, and Duleep Trophies).[60] Another double century was an innings of 233* against Tamil Nadu in the semi-finals of the 2000 Ranji T",
			"text": "vbvb",
			"uri": "https://en.wikipedia.org/wiki/Sachin_Tendulkar",
			"date": "2018-11-17T22:20:44.056Z",
			"user_id": "5bea07490cc7693ebc864c3a"
		}],
		"time_stamp": 11
		},
		 
		{
		"_id": "5bf9e7bcc7e8a117ec009a8d", "from": "5bea19e44a8e7a2ed08d9aad", 
		"to": "5bf110e33343e7262cddd9c3", "subject": "second highlight", 
		"annotations": [{
			"_id": "5bf1d7df9cebe742d8bebe61", 
			"ranges": [{ "start": "/div[3]/div[3]/div[4]/div[1]/p[4]", "startOffset": 507, "end": "/div[3]/div[3]/div[4]/div[1]/p[4]/a[12]", "endOffset": 16 }], 
			"quote": "In the final of the 2011 World Cup, Dhoni scored 91 not out off 79 balls handing India the victory  Australia in a Test series. In the Indian Premier L", 
			"text": "dhoni", 
			"uri": "https://en.wikipedia.org/wiki/MS_Dhoni",
			"date": "2018-11-18T21:21:23.838Z",
			"user_id": "5bea07490cc7693ebc864c3a"
		}],
		"time_stamp": 12
		},
];

	onBuildInboxSuccess(resp);
}

function onBuildInboxSuccess(resp)
{
	$(function () {
		
		var html = '<div class="container2">';
		for (var i = 0; i < resp.length; i++) {
			
			html += '<div class="container2">';
			html += '<img src="/arun.jpg" alt="Avatar" style="width:100%;">';
            html += '<input type="checkbox" id="mycheckbox"> name:' + resp[i].subject + '</input>';
			html += '<div id="hidden">';
			html += '<br/><br/>' + '<p>' + resp[i].annotations[0].quote +'</p>';
			html += '<label style= "position:right" for="mycheckbox">Show/hide</label>';
		
			html +='</div>';
		
			html += '<span class="time-right">' + resp[i].time_stamp + '</span>';
		
		html += '</div>';
	};
		$('#inbox_content').html(html);
	});
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







	
	
