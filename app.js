function search(event) {
    if(event.keyCode === 13) {
        $("#imageContainer").empty().addClass("spinner");
        $("#loadButton").hide();
        getImage($("#searchBox").val());
    }
}

function getImage(searchKey) {

	// request from Flickr API
	$.ajax({
	    url: "https://api.flickr.com/services/feeds/photos_public.gne?tags="+searchKey+"&format=json",
	    dataType: 'JSONP',
	    type: 'GET',
	    jsonpCallback: 'jsonFlickrFeed',
	    contentType: "application/jsonp; charset=utf-8",
	    failure: function (obj) { showError(obj); }
    });

}

function jsonFlickrFeed(obj, start) {

	var path, 
		maxImages = 8,
		container = $("#imageContainer").removeClass("spinner"),
		button = $("#loadButton"),
		link,
		i = (typeof start === "undefined" ? 0 : start),
		currentPosition = i + maxImages,
		innerContainer;

	if (obj.items.length === 0) {
		container.append("No image found. Try searching something else.")
	}

	for(; i<currentPosition; i++) { 

		if (i < obj.items.length) {
			path = obj.items[i].media.m.replace("_m.jpg", "_z.jpg");
			link = obj.items[i].link;
			title = obj.items[i].title;

			innerContainer = $("<div>", {"class": "col-md-3 col-sm-4 col-xs-6"});
			
			innerContainer.append( $("<a>", {"href": link, "text": "See on Flickr"} ));			
			innerContainer.append( $("<img>", {"src": path, "class": "img-responsive", "title": title, alt: "Loading..."}) );

			container.append(innerContainer);
		}
	}

	if ( currentPosition < obj.items.length ) {
		button.show();
		button.unbind("click").click(function(){
			jsonFlickrFeed(obj, i);
		});
	} else {
		button.hide();
	}
}

function showError(obj) {
	alert("Failure");
}

