//String literal used to define the beginning and ending of the objects in the input file stored as object.
NETWORK.RULES = {
	parser : {
		ObjectIdentifiers : {
			// The structure of the Beginning Data has been upated 
			BeginningData: {
				"AreaData" : ['%% area data','mpc.areas = \\[','mpc.areas= \\[','mpc.areas= \\['],
				"BusData" : ['%% bus data','mpc.bus = \\[','mpc.bus= \\[','mpc.bus =\\['],
				"genData" : ['%% gen data','mpc.gen = \\[','mpc.gen= \\[','mpc.gen =\\['],
				"genCostData" : ['mpc.gencost = \\[','mpc.gencost= \\[','mpc.gencost =\\['],
				"BranchData" : ['%% branch data','mpc.branch = \\[','mpc.branch= \\[','mpc.branch =\\['],
				"BusLocation" : ['%% bus location','%% bus location','mpc.buslocation = \\['],
				"BaseMVA" : ['mpc.baseMVA = ','mpc.baseMVA	= ']
			},
			EndingData: {
				"AreaData" : "];",
				"BusData" : "];",
				"genData" : "];",
				"genCostData" : "];",
				"BranchData" : "];",
				"BusLocation" : "];",
				"BaseMVA" : ";"
			}
		},
		//The following array is used to get the starting index of the content for data object.
		startIndexIdentifire : [
		'mpc.areas = [','mpc.areas= [','mpc.areas= [','mpc.bus = [','mpc.bus= [','mpc.bus =[','mpc.gen = [','mpc.gen= [','mpc.gen =[','mpc.gencost = [','mpc.gencost= [','mpc.gencost =[','mpc.branch = [','mpc.branch= [','mpc.branch =[','mpc.buslocation = ['
		],
		HardCodedDefaultProperties: {
			/*Similar to bus location data updates also need to be made for other elements. The property count starts at 1 thus the first element needs to be dummy for all the cases*/
			"BusLocation" : ['bus_i','x','y'],
			"AreaData" : ['AreaData'],
			"BusData" : ["bus_i","type","Pd","Qd","Gs","Bs","area","Vm","Va","baseKV","zone","Vmax","Vmin"],
			"genData" : ["bus","Pg","Qg","Qmax","Qmin","Vg","mBase","status","Pmax","Pmin","Pc1","Pc2","Qc1min","Qc1max","Qc2min","Qc2max","ramp_agc","ramp_10","ramp_30","ramp_q","apf"],
			"genCostData" : ["GenID", "startup", "shutdown", "n", "cost1", "cost2", "cost3"],
			"genCostDataLinear" : ["GenID", "startup", "shutdown", "n", "cost2", "cost3"],
			"BranchData" : ["fbus","tbus","r","x","b","rateA","rateB","rateC","ratio","angle","status","angmin","angmax"]			
		},
	},
	
	dataHeaders : {
		// The structure of the Beginning Data has been upated 
		BeginningData: {
			"AreaData" : ['%% area data','mpc.areas = \\[','mpc.areas= \\[','mpc.areas= \\['],
			"BusData" : ['%% bus data','mpc.bus = \\[','mpc.bus= \\[','mpc.bus =\\['],
			"genData" : ['%% gen data','mpc.gen = \\[','mpc.gen= \\[','mpc.gen =\\['],
			"genCostData" : ['%% gen cost data','mpc.gencost = \\[','mpc.gencost= \\[','mpc.gencost =\\['],
			"BranchData" : ['%% branch data','mpc.branch = \\[','mpc.branch= \\[','mpc.branch =\\['],
			"BusLocation" : ['%% bus location','%% bus location','mpc.buslocation = \\['],
			"BaseMVA" : ['mpc.baseMVA = ','mpc.baseMVA	= ']
		},
	},
	
	//Different colors for different voltage levels based on Diverging scheme, source - https://github.com/SebastianMittelstaedt/ColorCAT
	//suports upto 100 different voltages.
	colors : [0x0C3F14,0x08411B,0x064120,0x054324,0x03422A,0x03452B,0x03462E,0x024732,0x014736,0x01483A,0x00483E,0x004842,0x004846,0x004949,0x004A4B,0x004B4F,0x004A53,0x004B56,0x014A5A,0x014A5E,0x024962,0x024965,0x03476A,0x05466E,0x064373,0x064576,0x07477B,0x094582,0x0B4588,0x0F4190,0x133F96,0x183A9D,0x2034A4,0x2432A,0x2533AF,0x2D2DB4,0x3627B9,0x3C24BE,0x4420C2,0x4A1EC6,0x4D1ECA,0x511DCF,0x571BD3,0x5F18D6,0x6616D9,0x6D13DB,0x7411DE,0x7A10E2,0x820DE3,0x890CE6,0x8E0AE3,0x808DC,0x9106D4,0x9205CC,0x9104C6,0x8E04C2,0x8E03BB,0x9002B3,0x9001AC,0x9001A4,0x90009D,0x8F0096,0x8F008E,0x8F0087,0x8F007F,0x8B007B,0x880176,0x87016F,0x860267,0x850360,0x830459,0x810552,0x7F074B,0x7D0943,0x7A0B3C,0x770B3B,0x750A39,0x740C35,0x730F30,0x71112A,0x701425,0x6E1721,0x6C1A1C,0x691A1A,0x661B18,0x631E14,0x612011,0x5D220F,0x5A230C,0x57250B,0x532609,0x512508,0x4E2607,0x4B2606,0x472804,0x432903,0x3F2A02,0x3C2A02,0x382B01,0x332C00],

/*Tool-tip data - Features that the tool-tip supports i.e. by only giving the JSON input using these tricks will add different functionalities in the tool-tip data.
 Mandatory parameters :
	1. key - The name for the tool-tip (any entry in the rules for which the value of the key is 'Title' is displayed in the title.
	2. data - The relative JSON path for the tool-tip data (if the property value at a certain data path is null or undefined then that property is not displayed in the tool-tip for the element (at that instance).
 Optional Parameter :
	1. units - The units associated with the data (if value is set to -NA- then no unit is displayed).
	2. type - The type of the tool-tip element i.e. whether it is error, warning or normal tool-tip data.
	3. classed - Any specific CSS class name that is to be attached with the value displayed in the td of the table.
	4. nature - Currently supported values are Static/Dynamic. Static values are displayed in the first table and the dynamic values are displayed in second table.
 Intelligent keys in Tool-tips: Keys implemented for the solution data in the tool-tip have the following functionality:
	1. phVals - This represents an array of paths from which the data is to be picked up to fill the place holders in kt.
	2. kt - This is the key text which is used to make the dynamic key for the tool-tip data. The place holders in the kt are filled in the respective order of their path declaration in the phVals.
*/

	nodeToolTip : [
		{"key":"Title", "data":"bus_i","units":"-NA-","preTVT":"Bus ","postTitleValText":""},
		{"key":"Id", "data":"bus_i","units":"-NA-","nature":"static"},
		{"key":"V Max", "data":"Vmax","units":"Volts p.u.","nature":"static"},
		{"key":"V Min", "data":"Vmin","units":"Volts p.u.","nature":"static"},
		{"key":"Voltage", "data":"Vm","units":"Volts p.u.","nature":"dynamic"},
		{"key":"Phase Angle", "data":"Va","units":"Degrees","nature":"dynamic"},
		{"key":"Base KV", "data":"baseKV","units":"KV","nature":"static"},
		{"key":"gen Id(s) List", "data":"GenIdList","units":"-NA-","nature":"static"},
	],
	
	bottomDecoToolTipLoad : [
		{"key":"Title", "data":"bus_i","units":"-NA-","preTVT":"Loads on Bus ","postTitleValText":""},
		{"key":"P", "data":"Pd","units":"MW"},
		{"key":"Q", "data":"Qd","units":"MVAr"},
	],
	
	bottomDecoToolTipShunt : [
		{"key":"Title", "data":"bus_i","units":"-NA-","preTVT":"Loads on Bus ","postTitleValText":""},
		{"key":"G", "data":"Gs","units":"MW demanded at V = 1.0 p.u."},
		{"key":"B", "data":"Bs","units":"MVAr injected at V = 1.0 p.u."},
	],
	
	bottomDecoToolForValidation : [
		{"key":"Title", "data":"bus_i","units":"-NA-","preTVT":"Loads on Bus ","postTitleValText":""},
		{"key":"P", "data":"Pd","units":"MW"},
		{"key":"Q", "data":"Qd","units":"MVAr"},
		{"key":"G", "data":"Gs","units":"MW demanded at V = 1.0 p.u."},
		{"key":"B", "data":"Bs","units":"MVAr injected at V = 1.0 p.u."},
	],
	
	topDecoToolTip : [
		{"key":"Title", "data":"id","units":"-NA-","preTVT":"gen ","postTitleValText":""},
		{"key":"Bus Id", "data":"bus","units":"-NA-"},
		{"key":"P", "data":"Pg","units":"MW","nature":"dynamic"},
		{"key":"P Min Bounds", "data":"Pmin","units":"MW","nature":"static"},
		{"key":"P Max Bounds", "data":"Pmax","units":"MW","nature":"static"},
		{"key":"Q", "data":"Qg","units":"MVAr","nature":"dynamic"},
		{"key":"Voltage", "data":"Vg","units":"Volts p.u.","nature":"dynamic"},
		{"key":"Q Min Bounds", "data":"Qmin","units":"MVAr","nature":"static"},
		{"key":"Q Max Bounds", "data":"Qmax","units":"MVAr","nature":"static"},
		{"key":"Cost 1", "data":"costData.cost1","units":"$/MW hr squared"},
		{"key":"Cost 2", "data":"costData.cost2","units":"$/MW hr"},
		{"key":"Cost 3", "data":"costData.cost3","units":"$/MW hr"},
	],
	
	edgeToolTip : [
		{"key":"Title", "data":"edgeId","units":"-NA-","preTVT":"Line ","postTitleValText":""},
		{"key":"Id", "data":"index","units":"-NA-"},
		{"key":"r", "data":"edgeData.r","units":"Resistance p.u."},
		{"key":"x", "data":"edgeData.x","units":"Reactance p.u."},
		{"key":"charge", "data":"edgeData.b","units":"Susceptance p.u."},
		{"key":"Rate A", "data":"edgeData.rateAToolTip","units":"MVA"},
		{"key":"Rate B", "data":"edgeData.rateBToolTip","units":"MVA"},
		{"key":"Rate C", "data":"edgeData.rateCToolTip","units":"MVA"},
		{"key":"Min angle difference", "data":"edgeData.angmin","units":"Degrees"},
		{"key":"Max angle difference", "data":"edgeData.angmax","units":"Degrees"},
		
		/*For solution data*/
		/**Active power forward/ active power reverse**/
		{"key": "Active power forward",
				/* The following is the sample structure using which the keys can be made intelligent.
				{
					"phVals":["source.bus_i","target.bus_i"],These are the paths of the place holder values that need to be extracted from the data.
					"kt":"Active power from 'bus %1%' to 'bus %2%'"This is the key text (kt) used to make the dynamic key.
				},*/ 
			"data":"solutionData.p-s-t","units":"MW","nature":"dynamic"},
		{"key":"Reactive power forward",
			"data":"solutionData.q-s-t","units":"MVAr","nature":"dynamic"},
		{"key":"Active power reverse",				
			"data":"solutionData.p-t-s","units":"MW","nature":"dynamic"},
		{"key":"Reactive power reverse",
			"data":"solutionData.q-t-s","units":"MVAr","nature":"dynamic"},
		{"key":"Apparent power forward",
		"data":"solutionData.s-s-t","units":"MVA","nature":"dynamic"},
		{"key":"Apparent power reverse",
		"data":"solutionData.s-t-s","units":"MVA","nature":"dynamic"},
		/*Issue 10 - Added the angle difference value to the tool tip.*/
		{"key":"Angle Difference","data":"solutionData.angleDiffVal","units":"Degrees","nature":"dynamic"},
	],
	
	transformerEdgeToolTipExtra : [
		{"key":"Transformer Tap", "data":"edgeData.ratio","units":"Volts p.u."},
		{"key":"Phase Shift", "data":"edgeData.angle","units":"Degrees"},
	],
	
	/***** Region : ToolTip Rules for the Edges *****/
	edgeHelpToolTip : [
		{"key":["source.helpDesc", "target.helpDesc"], "data":"This is a power line connecting bus '%1%' and bus '%2%'."},
	],

	edgeLineChargeHelpToolTip : [
		{"key":["source.helpDesc", "target.helpDesc"], "data":"This is a power line with line charging connecting bus '%1%' and bus '%2%'."},
	],
	
	edgeTransformerHelpToolTip : [
		{"key":["source.helpDesc", "target.helpDesc"], "data":"This is a transformer connecting bus '%1%' and bus '%2%'. "},
	],
	
	busHelpToolTip : [
		{"key":["helpDesc"], "data":"This is a bus with ID '%1%'."},
	],
	
	topDecoHelpToolTip : [
		{"key":["helpDesc"], "data":"This is a %1%."},
	],
	
	bottomDecoHelpToolTip : [
		{"key":["bottomDecorators.0.helpDesc","helpDesc"], "data":"This is a '%1%' on the bus '%2%'."},
	],
	
	/*****Region Ends*****/
};




/*****Region Begins - Investigative piece of code....not functional*****/
NETWORK.ERRORS = {
};

NETWORK.WARNINGS = {
	lineWarnings : [
		{"wID":"LINE.WARNING.R", "template":"1","eleId":"","attrName":"","domEleID":""},
		/*{"key":"Bus Id", "data":"bus","units":"-NA-"},
		{"key":"P", "data":"Pd","units":"MW"},
		{"key":"P Min Bounds", "data":"Pmin","units":"MW"},
		{"key":"P Max Bounds", "data":"Pmax","units":"MW"},
		{"key":"Q", "data":"Qd","units":"MVAr"},
		{"key":"Q Min Bounds", "data":"Qmin","units":"MVAr"},
		{"key":"Q Max Bounds", "data":"Qmax","units":"MVAr"},
		{"key":"Cost 1", "data":"costData.cost1","units":"$/MW hr squared"},
		{"key":"Cost 2", "data":"costData.cost2","units":"$/MW hr"},
		{"key":"Cost 3", "data":"costData.cost3","units":"$/MW hr"},
		
		/*r value is negative
		x value is negative
		charge value is negative
		Thermal rating is 0
		Thermal rating is above UB
		charge value is very different from x value
		status is 1, while bus is 0*/
	],
};

NETWORK.LOGGING = {
	TEMPLATES : [
		{"id":"1","text":"The Value of '%attrName%', for the element '%eleId%' is 'less than zero'."},
		{"id":"2","text":"The Value of '%attrName%', for the element '%eleId%' is 'greater than zero'."},
	],
};
/*****Region Ends.*****/