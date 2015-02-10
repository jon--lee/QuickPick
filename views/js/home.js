$('#searchBox input').keypress(function(){
    $.ajax({
        type:"post",
        url:"/ajax/autocomplete/",
        dataType:"text",
        data: JSON.stringify({"q": $(this).val()})
    }).done(function(data){
	    //var lis = $('#autocomplete li');
	    //console.log(lis[0].text());
        console.log("post response: " + data)
    });
});

$('#searchBox button').click(function(){

});
