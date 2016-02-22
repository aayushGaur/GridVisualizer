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
/***** Region ends - Global Objects *****/

(function(){
	//Global Variable to store the different BaseKV values in the current network.
	//This is an associative array used to store the value of the BaseKv and the related color.
	//This is also used to show the legend along with the graph.	
})(NETWORK || (NETWORK = {}));