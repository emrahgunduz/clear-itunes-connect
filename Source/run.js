String.prototype.contains = function ( string ) {
  return this.toLowerCase().indexOf( string.toLowerCase() ) >= 0;
};

HTMLElement.prototype.removeFromParent = function () {
  if ( this !== null && this.parentNode !== null )
    this.parentNode.removeChild( this );
};

HTMLElement.prototype.findClosestParentByTag = function ( tagName ) {
  var el = this;
  while ( (el = el.parentElement) && el.tagName.toLowerCase() !== tagName.toLowerCase() );
  return el;
};

function r ( fn ) {
  var done = false;
  var top = true;

  var doc = window.document;
  var root = doc.documentElement;
  var modern = doc.addEventListener;

  var add = modern ? "addEventListener" : "attachEvent";
  var rem = modern ? "removeEventListener" : "detachEvent";
  var pre = modern ? "" : "on";

  var init = function ( e ) {
    if ( e.type === "readystatechange" && doc.readyState !== "complete" ) return;
    (e.type === "load" ? window : doc)[ rem ]( pre + e.type, init, false );
    if ( !done && (done = true) ) fn.call( window, e.type || e );
  };

  var poll = function () {
    try {
      root.doScroll( "left" );
    } catch ( e ) {
      setTimeout( poll, 50 );
      return;
    }
    init( "poll" );
  };

  if ( doc.readyState === "complete" ) fn.call( window, "lazy" );
  else {
    if ( !modern && root.doScroll ) {
      try {
        top = !window.frameElement;
      } catch ( e ) {
      }
      if ( top ) poll();
    }
    doc[ add ]( pre + "DOMContentLoaded", init, false );
    doc[ add ]( pre + "readystatechange", init, false );
    window[ add ]( pre + "load", init, false );
  }
}

var removeDeletedOnes = function(elements){
	for(var e in elements) {
		if(!elements.hasOwnProperty(e)) continue;
		var a = elements[e];
		var parent = a.findClosestParentByTag("tr");
		if (!!parent) parent.removeFromParent();
	}
};

var asyncCheckForExistence = function(){
	var elements = document.getElementsByClassName(".status.attn");
	if(elements.length) removeDeletedOnes(elements);

	setTimeout(function(){
		asyncCheckForExistence();
	}, 1000);
};

r(function(){

	var url = window.location.href;

  var isItunes = url.contains("itunesconnect.apple.com");
  var isIAP = url.contains("addons");
  var isSecure = url.contains("https://");
  var control = isItunes && isIAP && isSecure;
  
  if(!control) 
    return;
  else
    asyncCheckForExistence();

});