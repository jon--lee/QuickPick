var keyState = 0;
var lastValue = $('#searchBox input').val();
$('#searchBox input').keydown(function(){
    keyState = 1;
});




$('#searchBox input').keyup(function(){
    var val = $(this).val();
    if(keyState == 1 && lastValue != val)
    {
        $.ajax({
            type:"post",
            url:"/ajax/autocomplete/",
            dataType:"json",
            data: JSON.stringify({"q": $(this).val()})
        }).done(function(data){
            //var lis = $('#autocomplete li');
            //console.log(lis[0].text());
            console.log("post response: " + data["status"]);
            $('#autoBox').html("");
            if(data["status"] === "OK")
            {
                console.log("go bro");
                for(var i = 0; i < data["predictions"].length; i++)
                {
                    var title = data["predictions"][i]["title"];
                    var location = data["predictions"][i]["location"];
                    html = "<li><b>" + title + "</b> " + location + "</li>";
                    $('#autoBox').append(html);
                }
            }
            else
            {
                console.log("no go bro");
            }
        });
    }
    lastValue = val;
    keyState = 0;
});

$('#searchBox button').click(function(){

});
