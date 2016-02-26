/***** Region Begins - Global Objects *****/
// Namespace for the Network - All the other namespaces except VIEWS are sub namespace of this.
var NETWORK = NETWORK || {
	baseKVColorMapping : {},
	distinctVoltages : [],
};

//Global object that holds the content of the FILE dropped.
var FILE;

//Global Object that holds all the meaningful Network data - parsed from the input file.
var NET_OBJ;

//Global Object to store the compressed network/graph(s). This object should Ideally store the all 
//the compressed network/graph objects that are created during the iterations.
var COMPRESSED_NET = [];

/*Global Object Responsible for performing all types of logging realted to
 1. Internal (parsing or code failure).
 2. Configuration view - Warnings.
 3. Configuration view - Errors.
 4. Console logs.*/
var LOGGER;

//global vraible used to control the graphics of the layout.
var pixiGraphics;

//Global variable representing the object of the graph.
var g;

//Global variable used to store the zoom functionality.
var zoomHanlder;

//Variable used to set to control the auto layout based on the user input.
var boolAutoLayout = true;
/***** Region ends - Global Objects *****/

(function(){
	//Global Variable to store the different BaseKV values in the current network.
	//This is an associative array used to store the value of the BaseKv and the related color.
	
	
})(NETWORK || (NETWORK = {}));

/***** Region - Class for Network Search Boxes *****/
/**	This Objects of this class represent the Search boxes for the Network Visualization.
*		The functionality provided for the Search boxes are a follows:
*		1. Auto complete with the relevant information that is to be associated with the search box.
*		2. Zoom in functionality over the element that has been selected in the search box.
*		This functionality needs to be discussed - Ability to store the user searches and use them as tagged information to show similar search options.???
*/
(function(){
	NETWORK.SearchBox = function(searchTags,sbDOMID) {
		this.searchTags = searchTags;
		this.DOMID = sbDOMID;
	};
	
	NETWORK.SearchBox.prototype.autoComplete  = function () {
		$(this.DOMID).autocomplete({
            source: this.searchTags,
			autoFocus: true,
			select: function (event,ui) {
				console.log(ui);
				VIEWS.SharedFunctionality.zoomOnElement(ui.item.value)
			}
        });
	};
})(NETWORK || (NETWORK = {}));
/***** Region Ends *****/