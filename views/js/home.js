
var REFERENCE_ATTRIBUTE = "data-reference";
var YOUR_PICKS_ID = "#yourPicks";
var SEARCH_BOX_ID = "#searchBox";

var AUTOCOMPLETE_PATH = "/ajax/autocomplete";
var AUTOBOX_ID = "#autoBox";

var KEY_STRING_COOKIE_NAME = "ks";

var MAX_WIDTH = 300;

var highlightColor = "#fafafa";

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
var points = [];
/*
initialization options for google maps
api for jquery.
*/
function initialize()
{
    var bayArea = new google.maps.LatLng(37.580298,-122.182079);
    mapOptions =
    {
        zoom:8,
        center: bayArea,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        }
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

//initialize the map
google.maps.event.addDomListener(window, 'load', initialize);

var highlightedIndex = -1;
var maxHighlightedIndex = -1;

$('#searchBox input').keyup(function(e){
    var val = $(this).val();
    if(keyState == 1 && lastValue != val)       //don't want to search if nothing changed
    {
        lastValue = val;
        $.ajax({
            type:"post",
            url:"/ajax/autocomplete/",
            dataType:"json",
            data: JSON.stringify({"q": $(this).val()})
        }).done(function(data){
            clearAutocomplete();
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

                if(data['predictions'].length > 0)
                {
                    highlightedIndex = 0;
                    clearAutoCompleteHighlights();
                    highlight();
                    maxHighlightedIndex = data['predictions'].length - 1;
                }


                $('#autoBox li').click(function()
                {
                    createNewSelection($(this).clone());
                });
                $('#autoBox li').hover(function(){
                    highlightedIndex = $(this).index();
                    clearAutoCompleteHighlights();
                    highlight();
                });

            }
            else
            {
            }
        });
    }
    else
    {
        switch(e.keyCode)
        {
            case 13:                        //enter key
                if(highlightedIndex >= 0)
                {

                    element = $('#autoBox li').eq(highlightedIndex);
                    createNewSelection(element.clone());
                }
            break;
            case 27:                        //escape key
                clearAutocomplete();
            break;
            case 38:                        //up arrow key
                if(highlightedIndex > 0)
                    highlightedIndex--;
                clearAutoCompleteHighlights();
                highlight();
            break;
            case 40:                        //down arrow key
                if(highlightedIndex < maxHighlightedIndex)
                    highlightedIndex++;
                clearAutoCompleteHighlights();
                highlight();
            break;
        }
    }
});

/*
    method: mouseUp
    In the event that the user clicks outside of the searchBox
    or the autoBox then we want to hide the autoBox so that it is out
    of view and does not interfere with the selection process.
*/
$(document).mouseup(function(e){

    var searchBox = $('#searchBox');
    var autoBox = $('#autoBox');

    if((!searchBox.is(e.target)
        && searchBox.has(e.target).length === 0)
        && (!autoBox.is(e.target)
        && autoBox.has(e.target).length === 0))
    {
        clearAutocomplete();
    }

});


function clearAutoCompleteHighlights()
{
    $('#autoBox li').each(function(index, element){
        var element = $('#autoBox li').eq(index);
        element.css("background-color", "#FFFFFF");
    });
}

function highlight()
{
    var element = $('#autoBox li').eq(highlightedIndex);
    element.css('background-color', "#EEEEEE");
}

function clearAutocomplete()
{
    $('#autoBox').html("");
    highlightedIndex = -1;
}


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
    listElement.css("background", "white");

    // add selection to list of selections
    $('#yourPicks ul').append(listElement);

    //add hover functions to li with x to close
    $('#yourPicks ul li').hover(function(){
    },
    function(){
    });

    //get information about the selection
    var reference = listElement.attr("data-reference");
    clearAutocomplete();
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
    var references = [];
    $('#yourPicks ul li').each(function(index, element){
        reference = $(this).attr("data-reference");
        references.push(reference);
    });

    var keyString = readCookie(KEY_STRING_COOKIE_NAME);
    if(keyString == null)
    {
        keyString = "";
    }

    $.ajax({
        type:"post",
        url:"/ajax/recommend/",
        dataType:"json",
        data: JSON.stringify({"references": references, "keyString": keyString})
    }).done(function(response){
        setAllMap(null);
        //var points = [];

        var keyString = response['keyString'];
        createCookie(KEY_STRING_COOKIE_NAME, keyString);
        console.log(keyString);

        var data = response['data'];

        for (var i = 0; i < data.length; i++)
        {
            console.log("going through data");
            var place = data[i];
            var title = place['title'];
            var location = new google.maps.LatLng(place['lat'], place['long']);
            var number = place['number'];
            var address = place['address'];
            var rating = place['rating'];
            var imageUrl = place['imageUrl'];

            var content = "";
            if(imageUrl != null)
            {
                content += "<img src='" + imageUrl + "' style='float:left;margin-top:10px;height:50px;width:50px' />";
            }

            content += "<h2><span style='font-weight:normal'>" + (i+1) + ".</span> " + title;

            if(rating != null)
            {
                content += "<br><span style='font-weight:lighter; font-size:12px'>" + rating + " / 5</span></h4>";
            }
            else
            {
                content += "<br><br></h4>";
            }

            if(number != null)
            {
                content += "<b>Phone number </b>" + number + "<br />";
            }
            content += "<br />";
            content += "<b>Address </b>" + address;



            var infowindow = new google.maps.InfoWindow({
                content: "Holding...",
                maxWidth: MAX_WIDTH
            });
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                title: title
            });
            infowindow.setContent(content);
            google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){
                return function() {

                    if(currentWindow != null)
                    {
                        currentWindow.close();
                    }

                    infowindow.open(map,marker);
                    currentWindow = infowindow;

                };

            })(marker,content,infowindow));

            point = {
                'marker': marker,
                'infowindow': infowindow
            }

            points.push(point);



        }

        if(points.length > 0)
        {
            topPoint = points[0];
            currentWindow = topPoint['infowindow'];
            currentWindow.open(map,topPoint['marker']);
            autoCenter(points);
        }
    });
}

function autoCenter(pointList)
{
    var bounds = new google.maps.LatLngBounds();
    $.each(pointList, function (index, point) {
        bounds.extend(point['marker'].position);
    });
    map.fitBounds(bounds);
}


function setAllMap(map)
{
    for(var i = 0; i < points.length;i++)
    {
        points[i]['marker'].setMap(map);
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
