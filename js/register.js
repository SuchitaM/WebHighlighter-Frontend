document.getElementById("register").addEventListener('click', register); 

function register(){

	var username = document.getElementById("user").value;
	var password = document.getElementById("pass").value;
	var email = document.getElementById("email").value;
	var data = {
			username : username,
			password : password,
            email : email
		}
	sendRequestToServer(server+"/api/users/register","POST",data,onRegister)
}

function onRegister(resp)
{
	if (resp.success)
		{
		document.getElementById("registerdiv").style.display = "block";
		document.getElementById("loginfail").innerHTML = "Hi "+resp.username+", You have registered successfully! Please login.";	
		}

	else
		{
		document.getElementById("registerdiv").style.display = "block";
		document.getElementById("loginfail").innerHTML = "Username already exists.Please try again.";		
		}
}
		
