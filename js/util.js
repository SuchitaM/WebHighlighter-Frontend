var server = "https://webharvester.herokuapp.com";
document.getElementById("logout").addEventListener("click", logout);


function logout()
{
	document.getElementById("logindiv").style.display = "block";
	document.getElementById("homepagediv").style.display = "none";
	chrome.storage.sync.set({'username': ""});
	chrome.storage.sync.set({'loggedin': false});
}

function printError()
{
	document.getElementById("loginfail").innerHTML = "Invalid login credentials!";
}

function sendRequestToServer(url,method,data,callback)
{
	$.ajax({
        url:url,
		method : method,
		data :data,
        success:function(response) {
				callback(response);
            }
     });	
}	

