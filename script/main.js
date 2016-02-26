/**
*	Performs the function of reading the dropped file and create the Data Objects after parsing of the file.
*	Updated to call the drawDisconnectedGraph function - as no special user input is required once the input file has been dropped on the page.
*	- Stores the file in the Global Object FILE.
*	- Stores the Data Objects in the Global Object NET_OBJ
*	@ param		The event that is triggered when the file is dropped (The default functionality has already been suppressed).
**/
function drawGraph(event) {
	preProcessNetworkUI();	
	NET_OBJ = null;
	FILE = null;
	var parserError = false;
	/*Capture the FILE from the target or the dataTransfer prop.
	var files = event.target.files || event.dataTransfer.files || event.originalEvent.dataTransfer.files;*/
	var files;
	var reader = new FileReader();
	
	if(typeof event.dataTransfer === 'undefined') {
		files = event.originalEvent.dataTransfer.files;
	}
	else {	
		files = event.dataTransfer.files;
	}	
	
	/*Checks if the file can be loaded and then event.target.result is used to capture file data as 
	the reader.result can contain either the file or error.*/
	reader.onload = function(event) { 
		FILE = event.target.result;
		//try {
			var Summarizer = new NETWORK.Summarizer();
			var ObjectFactory = new NETWORK.ObjectFactory();
			NET_OBJ = ObjectFactory.getDO();
			
			//Creating the range control
			var nodeAdmittanceRangeSlider = new NETWORK.CONTROLS.Slider(NET_OBJ.nodeAdmittanceRange);
			var initailVal = (NET_OBJ.nodeAdmittanceRange.max - NET_OBJ.nodeAdmittanceRange.min)/2
			nodeAdmittanceRangeSlider.attachEvents();
			
			//shadow factory and shadow objects - this approach was used because the deep copy was talking too much time and the other ways were not fool proof.
			var shadowObjectFactory = new NETWORK.ObjectFactory();
			var shadowNetworkObjects = shadowObjectFactory.getDO();
			var compressedGraph = Summarizer.summarizerGraph(NET_OBJ,initailVal);
			
			//Adding the compressed graph to the compressed network object.
			COMPRESSED_NET.push(compressedGraph);
			
			//Adding the histogram to the right panel.
			var histogramVoltage = new NETWORK.CONTROLS.Histogram(NET_OBJ.allVoltages,20,'#panelright',"Voltage Distribution in the network");
			
			var Solution = new NETWORK.Solution(NET_OBJ);
			//Method to extract the different levels of KV along with tne number of nodes and their IDs;
			populateKVBasedGrouping();
			
		//}
/*		catch(error) {
				console.log(error);
				parserError = true;
		}*/
		/*Logging NET_OBJ for reference purpose.*/
		if(!parserError) {
			setTimeout(function() {
				//Making the panel triggers visible.
				$('.triggers').removeClass('hidden');
				
				
				
				ngraph.main();
				
				
				
				$("#LoadSnippet").hide();
				$(".standardNetworkGroup, #developedInfo").css("display","none");
			},1500);
		}
		else {
			$("#LoadSnippet").hide();
			$("#dropInput").html("Load Matpower case");
			//alert("Unable to parse the input file.");
		}
	}
	
	/*Custom message in case of error while reading the file.*/
	reader.onerror = function(event) {
		console.log("The reader failed to read the input file.");
		console.log("Please check the file again....The simulation will not work if this step does not happen correctly.");
		//alert("Failed to load the input file!!!");
	}
	reader.readAsText(files[0]);
}

/***** Region Begins - Investigative Code for redrawing the graph for the new admittance value. *****/
function reDrawGraphWithNewVal(newVal) {
	var Summarizer = new NETWORK.Summarizer();
	var ObjectFactory = new NETWORK.ObjectFactory();
	NET_OBJ = ObjectFactory.getDO();
	var compressedGraph = Summarizer.summarizerGraph(NET_OBJ,newVal);
	COMPRESSED_NET= null;
	COMPRESSED_NET = [];
	COMPRESSED_NET.push(compressedGraph);
	ngraph.main();
	//Adding the compressed graph to the compressed network object.
	//COMPRESSED_NET.push(compressedGraph);
}
/***** Region Ends - Investigative Code for redrawing the graph for the new admittance value. *****/

/**
*	Draws the Network Graph for the demo.
*	Creates the NET_OBJ and then calls the standard functions to create the demo graphs.
* @param	file	The file object that is read from the server.
**/
function drawDemoGraph(file) {
	preProcessNetworkUI();
	FILE = file;
	var ObjectFactory = new NETWORK.ObjectFactory();
	NET_OBJ = ObjectFactory.getDO();
	var Solution = new NETWORK.Solution(NET_OBJ);
	
	setTimeout(function() {
		$("#d3div").css("display","block");
		VIEWS.SharedFunctionality.autoLayout = true;
		$(".standardNetworkGroup, #developedInfo").css("display","none");
		DisconnectedGraph();
		/**Region Begins  - Validate the NET_OBJ and add the warning and errors 
			Validation is done after the graph is drawn so as to avoid lag for larger networks .
			Also the NETWORK Object get updated i.e. the source and the target of the edge data are populated as objects and not just numbers.
			NEEDS TO BE INVESTIGATED - HOW THIS HAPPENS.**/
		var dataValidator = new NETWORK.Validator(NET_OBJ);
		dataValidator.validateEdges();
		dataValidator.validateNode();
		
		//Show the graph as soon as the graph starts rendering.
		LOGGER.toggleErrorsAndWarnings(true);
		
		var ewMessages = LOGGER.errorMessages.concat(LOGGER.warningMessages);
		var searchBox2 = new NETWORK.SearchBox(ewMessages,"#ewSearch");
		searchBox2.autoComplete();
		
		var availableBusID = [];
		NET_OBJ.busDO.dOL.forEach(function(entry) {
			var busData = {value:entry.bus_i, eleID:entry.DOMID,eleType:"node"};
			availableBusID.push(busData);
		});
		var searchBox1 = new NETWORK.SearchBox(availableBusID,"#tags");
		searchBox1.autoComplete();
		/*****Region Ends*****/
	},1500);
}

//Performs stop propagation and prevents the browser from bubbling up the event.
function stopPropagationAndPreventDefault(e) {
	e.stopPropagation();
	e.preventDefault();
	return false;
}

//Prepares the page for interaction with the user.
function preparePageForInteraction() {
	var collection =document.getElementsByClassName('dropEnabled');
	/*** Investigative Region to check the overlay on the whole page***/
	$(window).bind('dragover', dragover);
	$(window).bind('drop', drop);
	$('.overlay').bind('dragleave', dragleave);
	var tid;

	function dragover(event) {
		clearTimeout(tid);
		event.stopPropagation();
		event.preventDefault();
		$('.overlay').show();
		return false;
	}

	function dragleave(event) {
		tid = setTimeout(function(){
		event.stopPropagation();
		event.preventDefault();
		$('.overlay').hide();
		}, 300);
		return false;
		
	}

	function drop(event) {
		event.stopPropagation();
		event.preventDefault();
		drawGraph(event);
		$('.overlay').hide();
		return false;
	}
	/***Investigative Region ends***/
	
	for (var i = 0; i < collection.length; i++) {
		//Prevents all the default drag and drop events from executing.
		addEventHandler(collection[i], 'dragstart', stopPropagationAndPreventDefault);
		addEventHandler(collection[i], 'dragenter', stopPropagationAndPreventDefault);
		addEventHandler(collection[i], 'dragleave', stopPropagationAndPreventDefault);
		addEventHandler(collection[i], 'dragover', stopPropagationAndPreventDefault);
		addEventHandler(collection[i], 'dragenter', stopPropagationAndPreventDefault);
		addEventHandler(collection[i], 'dragend', stopPropagationAndPreventDefault);
		addEventHandler(collection[i], 'drop', stopPropagationAndPreventDefault);
	}
	
	/***** Region Begins - Making Panels *****/
	//This Code needs to be moved to the Panel.js file and needs to be made more generic.
	$('#panelleft').slideReveal({
		trigger: $("#triggerleft"),
		push : false,
		overlay: true,
		position: "left",
		width: 250,
		speed: 700,
		shown: function(panel, trigger){
			console.log("panel opened!");
		},
		hidden: function(panel, trigger){
			$("#triggerleft").removeClass('hidden');
		},
		show: function(panel, trigger){
			$("#triggerleft").addClass('hidden');
		},
		hide: function(panel, trigger){
			console.log("panel before close!");
		}
	});
	
	$('#panelright').slideReveal({
		trigger: $("#triggerright"),
		push : false,
		overlay: true,
		position: "right",
		width: 500,
		speed: 700,
		shown: function(panel, trigger){
			console.log("panel opened!");
		},
		hidden: function(panel, trigger){
			$("#triggerright").removeClass('hidden');
		},
		show: function(panel, trigger){
			$("#triggerright").addClass('hidden');
		},
		hide: function(panel, trigger){
			console.log("panel before close!");
		}
	});
	
	
	/***** Region Ends - Making Panels *****/
}
	
function addEventHandler(obj, evt, handler) {
    if(obj.addEventListener) {
        obj.addEventListener(evt, handler, false); // Standard Method
    } 
	else if(obj.attachEvent) {
        obj.attachEvent('on'+evt, handler); // For IE
    }
	else {
        obj['on'+evt] = handler; // For older browsers
    }
}

function preProcessNetworkUI() {
	//Performs the garbage collection on the Logger and clears the stored messages.
	LOGGER.collectGarbage();
	
	//Added to clear the search boxes when a new graph loads.
	$("#ewSearch").val("");
	$("#tags").val("");
	
	
	if($("#d3div").css("display") !== 'block') {
		$("#dropInput").html("");
		$("#LoadSnippet").show();
		var p = $("#dropInput").position();
		var marginLeft = parseFloat($("#dropInput").css('marginLeft'));
		
		var h = $("#dropInput").height();
		var w = $("#dropInput").width();
		var top = (p.top + h/2)-22;
		var left = (p.left + w/2) + marginLeft-18; 
		$("#LoadSnippet").css({'top': top, 'left': left, 'position':'absolute', 'z-index':'100'});
	}
	else {
		var h = $("#parentSvgNode").height();
		var w = $("#parentSvgNode").width();
		d3.select("svg").remove();
		
		//Commented as the dropInput box is hidden once the file has been loaded for the first time on the page.
		//Also with the new functionality the user will be able to drag drop the file anywhere on the page.
		/*$("#dropInput").removeClass("dropAlongWithGraphConfig");
		$("#dropInput").addClass("dropAlongWithGraphTopology");
		$("#dropInput").html("Load matpower file");*/
		$("#dropInput").hide();
		
		$("#LoadSnippet").show();
		var top = (h/2);
		var left = (w/2)+100;
		$("#LoadSnippet").css({'top': top, 'left': left, 'position':'absolute', 'z-index':'100'});
	}
}
//Functions to be called at the time of loading - facilitates the handling of the events.
//Ability to support multiple formatting of the inputs - to be added.
preparePageForInteraction();


/***** Region begins Investigative Code - This code works!!!*****/
//Global Variable for storing the KV-Node mapping.
var NodeKVMapping = {};
/**
	Gives the number of nodes for each distinct baseKV in the network. 
	(Uncommenting the code in the method will also generate the node Ids for each voltage).
**/
function populateKVBasedGrouping() {
	var busObjs = NET_OBJ.busDO.dOL;
	for(var i = 0; i < busObjs.length; i++) {
		var kv = busObjs[i].baseKV;
	
		if(kv in NodeKVMapping) {
			//Commented as the node Ids are not yet required.
			//NodeKVMapping[kv.toString()].bus_ids.push(busObjs[i].bus_i);
			//NodeKVMapping[kv.toString()].count = NodeKVMapping[kv.toString()].count + 1;
			
			NodeKVMapping[kv.toString()] = NodeKVMapping[kv.toString()] + 1;
		}	
		else {
			NodeKVMapping[kv.toString()] = {};
			NodeKVMapping[kv.toString()].count = 1;
			NodeKVMapping[kv.toString()] = 1;
			
			//Commented as the node Ids are not required as yet.
			//var kvNodeList = [];
			//kvNodeList.push(busObjs[i].bus_i);
			//NodeKVMapping[kv.toString()].bus_ids = [];
			//NodeKVMapping[kv.toString()].bus_ids.push(busObjs[i].bus_i);
		}

    }
	
	var json = JSON.stringify(NodeKVMapping);
	var blob = new Blob([json], {type: "application/json"});
	var url  = URL.createObjectURL(blob);

	var a = document.createElement('a');
	a.download = "BusCountForDistinctKV.json";
	a.href = url;
	a.textContent = "BusCountForDistinctKV.json";
	
	//Uncomment this line to allow the file download.
	//a.click();
}
/***** Region ends - Investigative code *****/