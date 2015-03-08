/* Cookie generating/reading/modifying code courtesy of Quirksmode.org at
http://www.quirksmode.org/js/cookies.html
*/

/*
	method: createCookie(name, value, (days))
	Creates a cookie with given key and then value.
	days are optional. Will set expiration date
	to nothing if no days are given.
	Cookie written to browser
*/
function createCookie(name,value,days) {			//days is optional
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

/**
	method: readCookie(name)
	reads a key-value of the cookie with the given name.
	Does this by splitting up all the key-values as an
	array of strings and then processing each string.
	First all white space is eliminated before each
	key-value definition, then searches for the key
	name (with the equals sign). If not found, it moves
	to the next key-value. If found, it returns everything
	after the key plus the equals sign.
*/
function readCookie(name) {

	var cookiesArray = document.cookie.split(';');		//array of all cookie key-values (originally a string)

	var nameEQ = name + "=";					//the prefix that we're looking for

	for(var i=0;i < cookiesArray.length;i++)
	{
		var cookie = cookiesArray[i];			//get this cookie in array
		while (cookie.charAt(0)==' ')			//clear out any whitespace
		{
			c = c.substring(1,c.length);
		}
		if (c.indexOf(nameEQ) == 0)
		{
			return c.substring(nameEQ.length,c.length);		//nameEq should be the first part of the string, split that
															//to find just the value of the key
		}
	}
	return null;											//return nothing if no cookie there
}

/**
	method: eraseCookie
	basically just overwrite the cookie with negative expiration date
*/
function eraseCookie(name) {
	createCookie(name,"",-1);
}
