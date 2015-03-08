
var REFERENCE_ATTRIBUTE = "data-reference";
var YOUR_PICKS_ID = "#yourPicks";
var SEARCH_BOX_ID = "#searchBox";

var AUTOCOMPLETE_PATH = "/ajax/autocomplete";
var AUTOBOX_ID = "#autoBox";


//up(1) and down(0) states of keys
var keyState = 0;

/*
If a value is put into the searchBox,
we want to commmit a search. However,
we don't want to commit searches each time
a down is registered or when a down does
not alter in the input.
*/
var lastValue = $('#searchBox input').val();
$('#searchBox input').keydown(function(){
    keyState = 1;
});

var map;
var markers = [];
/*
initialization options for google maps
api for jquery.
*/
function initialize()
{
    var chicago = new google.maps.LatLng(41.850033, -87.6500523);
    mapOptions =
    {
        zoom:3,
        center: chicago,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

//initialize the map
google.maps.event.addDomListener(window, 'load', initialize);


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
            $('#autoBox').html("");
            if(data["status"] === "OK")
            {
                var html = "";
                for(var i = 0; i < data["predictions"].length; i++)
                {
                    var title = data["predictions"][i]["title"];
                    var location = data["predictions"][i]["location"];
                    var reference = data["predictions"][i]["reference"];
                    html += "<li data-reference=\"" + reference + "\" data-title=\"" + title + "\"><b>" + title + "</b> " + location + "</li>";
                }
                $('#autoBox').html(html);


                $('#autoBox li').click(function()
                {
                    createNewSelection($(this).clone());
                });


            }
            else
            {
            }
        });
    }
    lastValue = val;
    keyState = 0;
});


/*
    method: createNewSelection(listElement)
    when the user picks something from the search list,
    we are creating a new selection in the selection box.

    We also want to update the user's recommendations now
    that a new establishment has been added.

    Buf first we have to check to see if this is a unique
    establishement that the user selected. We do this by looping
    through all the current selections and seeing if any of
    their "data-reference" is equal to the new "data-reference"

    Update recommendations method will handle the display of recs
    to the map
*/
function createNewSelection(listElement)
{
    // add selection to list of selections
    $('#yourPicks ul').append(listElement);

    //get information about the selection
    var reference = listElement.attr("data-reference");

    updateRecommendations();
    //center the map on lat and long

    //put marker with details in
}


var currentWindow = null;
/*
    method: updateRecommedations()
    updates the recommendations by sending a request
    to recommend.py with an array of the user's likes
    as arguments.
    The request will return a list containing
    in order from most recommended to least recommended
    recommendations. recommendations will then be queried
    with google to determine lat and long and details
    This google information will be used to plot points
    on the map and populate the information markers.
*/
function updateRecommendations()
{
    references = [];
    $('#yourPicks ul li').each(function(index, element){
        reference = $(this).attr("data-reference");
        references.push(reference);
    });
    $.ajax({
        type:"post",
        url:"/ajax/recommend/",
        dataType:"json",
        data: JSON.stringify({"references": references})
    }).done(function(data){
        setAllMap(null);
        for (var i = 0; i < data.length; i++)
        {
            var place = data[i];
            var title = place['title'];
            var location = new google.maps.LatLng(place['lat'], place['long']);
            var number = place['number'];
            var address = place['address'];
            var rating = place['rating'];

            var content = "";
            content += "<h4>" + title
            content += "<br><span>" + rating + " / 5</span></h4>";
            content += "<b>Phone number </b>" + number;
            content += "<br />";
            content += "<b>Address </b>" + address;

            var infowindow = new google.maps.InfoWindow({
                content: "Holding..."
            });
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                title: title
            });
            google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){
                return function() {

                    if(currentWindow != null)
                    {
                        currentWindow.close();
                    }
                    infowindow.setContent(content);
                    infowindow.open(map,marker);
                    currentWindow = infowindow;

                };

            })(marker,content,infowindow));
            markers.push(marker);



        }

        autoCenter();
    });
}

function autoCenter()
{
    var bounds = new google.maps.LatLngBounds();
    $.each(markers, function (index, marker) {
        bounds.extend(marker.position);
    });
    map.fitBounds(bounds);
}


function setAllMap(map)
{
    for(var i = 0; i < markers.length;i++)
    {
        markers[i].setMap(map);
    }
}

/*
    method: requestDataAboutPlace(reference)
    This method uses a given reference
    to send an ajax call to the search module
    which refers to Google's api to find
    general information about the establishment
*/
function requestDataAboutPlace(reference)
{
    var resultingData;
    $.ajax({
        type:"post",
        url:"/ajax/search/",
        dataType:"json",
        data: JSON.stringify({"reference": reference})
    }).done(function(data){
        resultingData = data;
    });

    return reusltingData;
}


$('#yourPicks').click(function(){
    //FB464C    soft red color

});



$('#searchBox button').click(function(){

});
