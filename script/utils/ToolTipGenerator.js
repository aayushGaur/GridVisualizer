/** Tool-T
ip gen Class : 
*	1. This class has been implemented as a static class under the sub namespace TOOLTIP
*	2. The method showToolTip and hideToolTip are called by the Network objects to display there relevant tool-tips.
*	3. It uses the rules for each object to display the custom tool tip on the object.	
*
**/
NETWORK.TOOLTIP = (function(){
	/**
	*	Internal mehtod of the Static class - Used to get the HTML for the tool-tip. 
	*	@param	d			The data element from which all the information is to be read.
	* 	@param	r		The rules based on which the parsing is done.
	* 	Returns the HTML used to display the tool-Tip data.
	**/
	var getToolTipHtml = function(d,r) {
		
		var wH="", eH="", tTHS, tTHD, bDP = false;
		tTHS = "<table border='1' style='margin:0 auto; font-size:.74em;border-spacing:0;width:100%;'><tr><th>Property</th><th>Value</th><th>Units</th></tr><tr><th colspan='3'>Static</th></tr>";
		tTHD = "<tr><th colspan='3'>Power Flow</th></tr>";
		for(var i = 0; i < r.length; i++) {
			var z, u, t, c ,p = null, n;
			z = r[i].key;
			//Does the manipulation of the key...This has been added to support the dynamic keys for the solution data in the branch
			//The code for getting path based values of the place holder needs to be moved in a separate function.
			if(typeof z !== "string"){
				for(var a = 0; a < z.phVals.length; a++) {
					var j = z.phVals[a].split(".");
					var k = null;
					for(var x = 0; x < j.length; x++) {
						if (k === null) { k = d[j[x]]; }
						else { k = k[j[x]];}
					}
					z.kt = z.kt.replace(("%" + (a + 1) + "%"),K);
				}
				//Setting the value of the key object to the string obtained so as to use the key in the tool-tip.
				z = z.kt;
			}
			
			u = r[i].units;
			t = r[i].type;
			c = r[i].classed;
			n = r[i].nature;
			//Custom tool-tip has been defined for properties for which a custom message is to be displayed to the user.
			if(typeof r[i].custom === 'undefined' || (r[i].custom).toLowerCase() === "false") {			
				var y = r[i].data.split(".");
				for(var l = 0; l < y.length; l++) {
					if (p === null) {	p = d[y[l]];	}
					else {	p = p[y[l]];	}
				}
			}
			else {
				var p = r[i].data.toString();
			}
			
			if(typeof c === 'undefined' || c === null) { c = ""; }
			if(typeof u === 'undefined' || u === null || u ==="-NA-") { u = ""; }
				
			if(typeof p === 'undefined' || p === null || p === "") {
					//Log here that the value of a tool-tip attr is undefined.
			}
			else {			
				if(z === "Title") {
					var T = "<div style='text-align:center'>"+ r[i].preTVT + p + r[i].postTitleValText + u + "</div>";
					tTHS = T + tTHS;
				}
				else if(typeof t !== 'undefined') {
					if(t === "error") { eH = eH +"<div>" + p + "</div>"; }
					else if (t === "warning") { wH = wH +"<div>" + p + "</div>"; }
				}
				else {
					if(typeof n !== 'undefined') {
						if(n === "static") {
							tTHS = tTHS +"<tr> <td align='left'>" + z + "</td> <td align='right' class='"+ c +"'>" + p + "</td> <td>" + u+ "</td> </tr>";
						}
						else if (n === "dynamic"){
							bDP = true;
							tTHD = tTHD +"<tr> <td align='left'>" + z + "</td> <td align='right' class='"+ c +"'>" + p + "</td> <td>" + u + "</td> </tr>";
						}
					}
					else {
						tTHS = tTHS +"<tr> <td align='left'>" + z + "</td> <td align='right' class='"+ c +"'>" + p + "</td> <td>" + u+ "</td> </tr>";
					}
				}
			}
		}
		
		//Add dynamic table only if the dynamic data is present.
		if(bDP) {
			tTHS = tTHS + tTHD;
		}
		tTHS = tTHS +"</table>";
		
		if(eH !== "") { eH = "<div class='toolTipError'><label style='text-decoration: underline;font-weight: bold;'>Errors:</label>" + eH + "</div>"; }
		if(wH !== "") { wH = "<div class='toolTipWarning'><label style='text-decoration: underline;font-weight: bold;'>Warnings:</label>" + wH + "</div>"; }		
		tTHS = tTHS + wH +eH;
		return tTHS;
	};	
		
	//Generic method - to be used to generate the tooltip for the help view.
	//The Complete functionality needs to be implemented after discussion with Dr. Carleton.
	var getHelpToolTipHtml = function(d,r) {
		var t = "<div>";
		for(var a = 0; a < r.length; a++) {
			var x = "<p style='margin:0'>";
			x += r[a].data;
			for(var i = 0; i < r[a].key.length;i++) {
				var path = r[a].key[i].split(".");
				var p = null;
				
				for(var j = 0; j < path.length; j++) {
					if (p === null)	{ p = d[path[j]];	}
					else { p = p[path[j]];	}
				}
				x = x.replace(("%"+ (i + 1) + "%"),p);
			}
			x += "</p>";
			t += x;
		}
		t += "</div>";
		return t;
	};
	
	//The Methods mentioned in the return are exposed as public methods for the Class (Implemented as pure Static).
	return {
		/**
		*	Used to display the relevant tool-tip HTML for the elements.
		*	@param	d		The element from which the information is to be read.
		*	@param	pos		The position object where the tooltip needs to be shown.
		*	@param	rule	The Element based on which the Network Rules are decided.
		*	@param	bHelp	Parameter used to define if the tooltip is being called for an element of the help graph (This parameter is honoured only if the value of passed is true (boolean).
		**/
		showToolTip : function (d,pos,rule,bHelp) {
			var t;
			if(typeof bHelp !== "undefined") {
				if(bHelp === true) {
					t = getHelpToolTipHtml(d,rule);
				}
				else {
					console.log("Default tool-tip is being displayed. Please pass the correct value for the bHelp parameter.");
					t = getToolTipHtml(d,rule);
				}
			}
			else {
				t = getToolTipHtml(d,rule);
			}
			
			$("#tooltip").offset({ top: pos.y, left: pos.x}).html(t).removeClass("hidden");
		},
		
		/**
		*	Hides the tool-tip (is used for all the tool-tips of Network Elements).
		*	@param	d		The element on which the tool-tip is currently applied (passed to cater to future data needs).
		**/
		hideToolTip : function(d) {
			$("#tooltip").addClass("hidden");
		},
	}
})();