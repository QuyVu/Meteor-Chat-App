import '../imports/startup/accounts-config.js';
import '../imports/ui/containers/body.js';

if (Meteor.isClient) {
  Meteor.startup(function () {

	  WebFontConfig = {
	    google: { families: [ 'Source+Sans+Pro:400,700:latin,vietnamese' ] }
	  };
	  (function() {
	    var wf = document.createElement('script');
	    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	    wf.type = 'text/javascript';
	    wf.async = 'true';
	    var s = document.getElementsByTagName('script')[0];
	    s.parentNode.insertBefore(wf, s);
	  })(); 
  });
}