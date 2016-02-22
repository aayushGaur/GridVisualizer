//No separate namespace has been  created for the validator class as the NETWORK OBJECT should know the validation rules.
(function(){
	NETWORK.Validator = function (netObj) {
		this.netObj = netObj;
		this.edgeDOs = this.netObj.branchDO;
		this.nodeDOs = this.netObj.busDO;
		
		
		//Method equivalent to Protected method of the class - Used to validate the Top decorators
		this.validateTopDecorator = function (crtNode) {
			var topDecorators = crtNode.topDecorators;
			for(var index = 0; index < topDecorators.length; index++)
			{
				var topDeco = topDecorators[index], warning = false;
				var data = topDeco.topDecoData;
				var warningList =[];
				//Deep Copy of the Array - JQuery method.
				//This array is used to record both the errors and the warnings for the bus.
				var validationWarning = jQuery.extend(true, [], NETWORK.RULES.topDecoToolTip);
				
				/*As advised by Dr. Carleton - In this case the warning is not added to the page. Only an alert (Added in the data objects) is displayed to show the message to the user.
				if(data.costData.bICDL === "true") {
					var reactivePowerCost = {"key":"ReactivePowerCost", "data":"This test case has cost values on reactive power generation </br>that are not displayed by this tool.","custom":"true","type":"warning"};
					warning = true;
					validationWarning.push(reactivePowerCost);
					//LOGGER.addWarningMessage("Cost for gen "+ data.id +"is Negative." ,data.DOMID,"topDeco");
				}*/
				
				
				//As advised by Dr. Carleton - The current implementation only supports quadratic cost functions in the mpc.gencost matrix, not PWL cost functions.
				//When reading mpc.gencost matrix it should check that the first value of each line is "2". If not, then it should print a warning that the cost data is being ignored. Cost 1, Cost 2, and Cost 3 
					if(data.costData.ignoreCostData === "false") {
						if(topDeco.type === "gen") {
							if(parseFloat(data.costData.cost1) < 0.0 || (parseFloat(data.costData.cost2) < 0) || (parseFloat(data.costData.cost3) < 0)) {
								var cost = {"key":"Cost", "data":"Cost for gen is Negative","custom":"true","type":"warning"};
								warning = true;
								validationWarning.push(cost);
								warningList.push("Cost 1");
								warningList.push("Cost 2");
								warningList.push("Cost 3");
								LOGGER.addWarningMessage("Cost for gen "+ data.id +"is Negative." ,data.DOMID,"topDeco");
							}						
							if(parseFloat(data.Pmin) < 0) {
								var pLB = {"key":"p LB", "data":"Value for P min is less than zero.","custom":"true","type":"warning"};
								warning = true;
								warningList.push("P Min Bounds");
								validationWarning.push(pLB);
								LOGGER.addWarningMessage("Value of P min is less than zero for gen "+ data.id + "." ,data.DOMID,"topDeco");
							}
						}
						else {
							if(parseFloat(data.costData.cost1) !== 0.0 || (parseFloat(data.costData.cost2) !== 0) || (parseFloat(data.costData.cost3) !== 0)) {
								var cost = {"key":"Cost", "data":"Synchronous Condenser has non zero cost(s).","custom":"true","type":"warning"};
								warning = true;
								warningList.push("Cost 1");
								warningList.push("Cost 2");
								warningList.push("Cost 3");
								validationWarning.push(cost);
								LOGGER.addWarningMessage("Cost for Synchronous gen "+ data.id + " is Negative." ,data.DOMID,"topDeco");
							}
						}
					}
					/*As advised by Dr. Carleton - The warning for ignoring the cost data is common for all gens and thus is only displayed only once to the user (in data objects file)
					else {
							var cost = {"key":"Cost", "data":"Cost data for gen is ignored.","custom":"true","type":"warning"};
							warning = true;
							validationWarning.push(cost);
							warningList.push("Cost 1");
							warningList.push("Cost 2");
							warningList.push("Cost 3");
							LOGGER.addWarningMessage("Cost for gen "+ data.id +" is ignored." ,data.DOMID,"topDeco");
					}*/
				
				
				
				
				if((parseInt(data.status) === 1) && (parseInt(crtNode.status) === 0)) {
					var statusWarning = {"key":"Status", "data":"Status is 1 where as Status for Node is 0.","custom":"true","type":"warning"};
					warning = true;
					validationWarning.push(statusWarning);
					LOGGER.addWarningMessage("Status of Bus "+ crtNode.bus_i + " is 0 where as status for gen " + data.id+ " is 1." ,data.DOMID,"topDeco");
				}
				
				if(parseFloat(data.Vg) !== parseFloat(crtNode.Vm)) {
					var VgWarning = {"key":"Vg", "data":"The voltage of gen "+ data.id + " is not equal to voltage of bus "+ crtNode.bus_i +".","custom":"true","type":"warning"};
					warning = true;
					warningList.push("Voltage");
					validationWarning.push(VgWarning);
					LOGGER.addWarningMessage("The voltage of gen "+ data.id + " is not equal to voltage of bus "+ crtNode.bus_i +"." ,data.DOMID,"topDeco");
				}
				
				for(var i = 0; i < validationWarning.length;i++) {
					if($.inArray(validationWarning[i].key, warningList) !== -1) {
						validationWarning[i]["classed"] = "warning";
					}
				}
				
				topDeco["validationWarning"] = validationWarning;
				topDeco["warning"] = warning;
				
				
				var error = false, errorList = [];
				if((parseFloat(data.Qmin) > parseFloat(data.Qmax)) || (parseFloat(data.Pmin) > parseFloat(data.Pmax))) {
					var pgBounds = {"key":"Error", "data":"Infeasible p, g bounds.","custom":"true","type":"error"};
					error = true;
					
					if(parseFloat(data.Qmin) > parseFloat(data.Qmax)) {
						errorList.push("Q Min Bounds");
						errorList.push("Q Max Bounds");
					}
					
					if(parseFloat(data.Pmin) > parseFloat(data.Pmax)) {
						errorList.push("P Min Bounds");
						errorList.push("P Max Bounds");
					}
					
					validationWarning.push(pgBounds);
					LOGGER.addErrorMessage("gen " + data.id+ " has infeasible bounds." ,data.DOMID,"topDeco");
				}
				
				if((parseFloat(data.Qg) < parseFloat(data.Qmin)) || (parseFloat(data.Qg)  > parseFloat(data.Qmax))) {
					var infeasibleQVal = {"key":"Error", "data":"Q value is out of bounds.","custom":"true","type":"error"};
					error = true;
					errorList.push("Q");
					validationWarning.push(infeasibleQVal);
					LOGGER.addErrorMessage("gen " + data.id+ " - Q value is out of bounds." ,data.DOMID,"topDeco");
				}
				
				if((parseFloat(data.Pg) < parseFloat(data.Pmin)) || (parseFloat(data.Pg)  > parseFloat(data.Pmax))) {
					var infeasiblePVal = {"key":"Error", "data":"P value is out of bounds.","custom":"true","type":"error"};
					error = true;
					errorList.push("P");
					validationWarning.push(infeasiblePVal);
					LOGGER.addErrorMessage("gen " + data.id+ "- P value is out of bounds." ,data.DOMID,"topDeco");
				}
				
				topDeco["validationError"] = validationWarning;
				topDeco["error"] = error;
				
				for(var i = 0; i < validationWarning.length;i++) {
					if($.inArray(validationWarning[i].key, errorList) !== -1) {
						validationWarning[i]["classed"] = "error";
					}
				}
				
				/*gen Validation:
				***For Warnings***
					cost terms are negative - cost1, cost2, cost3
					p LB, below 0 - ???
					Sync cond. has non-zero cost
					status is 1, while bus status is 0
					Vg of the gen should be equal to the Vm of the node.
				***For Errors***
						infeasible p, g bounds i.e. error if Qmin > Qmax Or Pmin > Pmax
				*/
			}
		};
		
		
		/*Method equivalent to Protected method of the class - Used to validate the Bottom decorators
			***Only Warning***
			***No errors***
		*/
		this.validateBottomDecorator = function (crtNode) {
			for(var index = 0; index < crtNode.bottomDecorators.length;index++) {
				
				var data = crtNode.bottomDecorators[index], warningList=[], warning = false;
				//Deep copy of the array - for generation of the tool-tip
				var validationWarning = jQuery.extend(true, [], NETWORK.RULES.bottomDecoToolForValidation);
				if(data.Pd < 0) { 
					warning = true; 
					warningList.push("P"); 
					validationWarning.push({"key":"Status", "data":"Negative P value on Bus load.","custom":"true","type":"warning"});
					LOGGER.addWarningMessage("Bus "+ crtNode.bus_i +" has Negative P value." ,data.DOMID,"bottomDeco");					
				}
				
				if(data.Qd < 0) { 
					warning = true;
					warningList.push("Q"); 
					validationWarning.push({"key":"Status", "data":"Negative Q value on Bus load.","custom":"true","type":"warning"});
					LOGGER.addWarningMessage("Bus "+ crtNode.bus_i +" has Negative Q value." ,data.DOMID,"bottomDeco");
				}
				if(data.Gs < 0) { warning = true; warningList.push("G"); validationWarning.push({"key":"Status", "data":"Negative G value on Bus shunt.","custom":"true","type":"warning"});
					LOGGER.addWarningMessage("Bus "+ crtNode.bus_i +" has Negative G value." ,data.DOMID,"bottomDeco");
				}
				if(data.Bs > 0) { warning = true; warningList.push("B"); validationWarning.push({"key":"Status", "data":"Positive B value on Bus load.","custom":"true","type":"warning"});
					LOGGER.addWarningMessage("Bus "+ crtNode.bus_i +" has Positive B value." ,data.DOMID,"bottomDeco");
				}
				
				for(var i = 0; i < validationWarning.length;i++) {
					if($.inArray(validationWarning[i].key, warningList) !== -1) {
						validationWarning[i]["classed"] = "warning";
					}
				}
				
				data["validationWarning"] = validationWarning;
				data["warning"] = warning;
			}
		};
	};
	
	NETWORK.Validator.prototype.validateEdges = function (edgesDO) {
		var edgesData;
		if(typeof edgesDO === 'undefined'){ 
			var edgesData = this.edgeDOs.dOL; 
		}
		else {
			edgesData = edgesDO;
		}
		
		for(var index = 0; index < edgesData.length;index++) {
			var data = edgesData[index];
			var warningList=[], warning = false, error = false;
			//Deep Copy of the Array - JQuery method.
			var validationErrorWarning = jQuery.extend(true, [], NETWORK.RULES.edgeToolTip);
			
			if(parseFloat(data.edgeData.r) < 0) { 
				warning = true; 
				warningList.push("r");
				validationErrorWarning.push({"key":"Status", "data":"Negative r value on Branch.","custom":"true","type":"warning"});
				LOGGER.addWarningMessage("Negative r value on Branch - "+ data.index + " (" +(data.edgeId) + ")",data.edgeData.DOMID,"edge");	
			}
			if(parseFloat(data.edgeData.x) < 0) {
				warning = true; 
				warningList.push("x"); 
				validationErrorWarning.push({"key":"Status", "data":"Negative x value on Branch.","custom":"true","type":"warning"});
				LOGGER.addWarningMessage("Negative x value on Branch - "+ data.index + " (" +(data.edgeId) + ")",data.edgeData.DOMID,"edge");	
			}
			if(parseFloat(data.edgeData.b) < 0) { 
				warning = true;
				warningList.push("b");
				validationErrorWarning.push({"key":"Status", "data":"Negative b value on Branch.","custom":"true","type":"warning"});
				LOGGER.addWarningMessage("Negative b value on Branch - "+ data.index + " (" +(data.edgeId) + ")",data.edgeData.DOMID,"edge");	
			}
			//as advised by Dr. Carleton - Removed the warning if the value of rateA is 0
			/*if(parseFloat(data.edgeData.rateA) === 0) { 
				warning = true; 
				warningList.push("Rate A"); 
				validationErrorWarning.push({"key":"Status", "data":"RateA zero for Branch.","custom":"true","type":"warning"});
				LOGGER.addWarningMessage("Value of 'RateA' is zero for Branch - "+ data.index + " (" +(data.edgeId) + ")",data.edgeData.DOMID,"edge");
			}*/
			
			if(parseFloat(data.edgeData.b) !== 0) {
				if(Math.abs(Math.log10(data.edgeData.x) - Math.log10(data.edgeData.b)) >= 1) {
					warning = true;
					warningList.push("charge"); 
					validationErrorWarning.push({"key":"charge", "data":"Charge is very different from x.","custom":"true","type":"warning"});
					LOGGER.addWarningMessage("Branch - "+ data.index + " (" +(data.edgeId) + ")" + " - charge is very different from x.",data.edgeData.DOMID,"edge");	
				}
			}
			//if the value of rateA is zero then the validation is to be ignored as zero value for rateA signifies a special case.
			if(parseFloat(data.edgeData.rateA) !== 0 ) {
				if(parseFloat(data.edgeData.rateA) > parseFloat(data.edgeData.UB)) { 
					warning = true;
					warningList.push("Rate A"); 
					validationErrorWarning.push({"key":"charge", "data":"Thermal Rating is greater than the implied Upper Bound ("+ parseFloat(data.edgeData.UB).toFixed(4) + ")","custom":"true","type":"warning"});
					LOGGER.addWarningMessage("Branch - "+ data.index + " (" +(data.edgeId) + ")" + " - Thermal Rating is greater than the implied Upper Bound ("+ parseFloat(data.edgeData.UB).toFixed(4) + ")",data.edgeData.DOMID,"edge");
				}
			}
			
			if((parseFloat(data.edgeData.status) === 1)  && (parseFloat(data.source.status) === 0 || parseFloat(data.target.status) === 0)) {
				warning = true;
				validationErrorWarning.push({"key":"Mismatch Status", "data":"Branch Status 1 where as Bus status is 0.","custom":"true","type":"warning"});
				if(parseFloat(data.source.status) === 0) {
					LOGGER.addWarningMessage("Status of Branch - "+ data.index + " (" +(data.edgeId) + ")  is 1 where as status for Bus " + data.source.bus_i + " is 0.",data.edgeData.DOMID,"edge");	
				}
				else {
					LOGGER.addErrorMessage("Status of Branch - "+ data.index + " (" +(data.edgeId) + ")  is 1 where as status for Bus " + data.target.bus_i + " is 0.",data.edgeData.DOMID,"edge");	
				}
			}
			
			if(data.edgeType==="Transformer") {
				if(parseFloat(data.edgeData.b) > 0) {
					warning = true;
					warningList.push("charge");
					validationErrorWarning.push({"key":"Transformer with a non zero charge value.", "data":"Charge value greater than 0 for transformer.","custom":"true","type":"warning"});
					LOGGER.addWarningMessage("Branch - "+ data.index + " (" +(data.edgeId) + ") is a transformer but the charge is greater than zero.",data.edgeData.DOMID,"edge");	
				}
			}
			
			this.edgeDOs.dOL[index]["validationWarning"] = validationErrorWarning;
			this.edgeDOs.dOL[index]["warning"] = warning;
	
			//errorList is not used for the  edge data
			var ValidationError=[], errorList = [];
			if(parseFloat(data.edgeData.rateA) < 0)  { 
				error = true; 
				errorList.push("Rate A");
				validationErrorWarning.push({"key":"Error", "data":"Thermal Limit is Negative.","custom":"true","type":"error"});
				LOGGER.addErrorMessage("Branch - "+ data.index + " (" +(data.edgeId) + ")" + " - Thermal Limit is Negative." ,data.edgeData.DOMID,"edge");
			}
			if(parseFloat(data.edgeData.angmin) > parseFloat(data.edgeData.angmax)) {
				error = true;
				errorList.push("Min angle difference");
				errorList.push("Max angle difference");
				validationErrorWarning.push({"key":"Error", "data":"Infeasible phase angle bounds.","custom":"true","type":"error"});
				LOGGER.addErrorMessage("Branch - "+ data.index + " (" +(data.edgeId) + ")" + " - Infeasible Voltage Bounds." ,data.edgeData.DOMID,"edge");
			}
			
			if((parseFloat(data.source.baseKV) !== parseFloat(data.target.baseKV)) && (data.edgeType!=="Transformer")) {
				error = true;
				validationErrorWarning.push({"key":"Error", "data":"Inconsistent KVbase values.","custom":"true","type":"error"});
				LOGGER.addErrorMessage("Branch - "+ data.index + " (" +(data.edgeId) + ")" + " - Inconsistent KVbase values." ,data.edgeData.DOMID,"edge");
			}
			
			
			//Ignore the validation if the value of rateA is zero as this signifies a special case.
			//Also updated the error message as per feedback.
			if(parseFloat(data.edgeData.rateA) !== 0) {
				//As advised by Dr. Carleton - removed the square root on the value.
				//if((Math.sqrt(parseFloat(data.solutionData["s-s-t"])) > parseFloat(data.edgeData.rateA)) || (Math.sqrt(parseFloat(data.solutionData["s-t-s"])) > parseFloat(data.edgeData.rateA))) {
				if((parseFloat(data.solutionData["s-s-t"]) > parseFloat(data.edgeData.rateA)) || (parseFloat(data.solutionData["s-t-s"]) > parseFloat(data.edgeData.rateA))) {
					error = true;
					errorList.push("Apparent power forward");
					errorList.push("Apparent power reverse");
					validationErrorWarning.push({"key":"Error", "data":"Rate A thermal limit violated.","custom":"true","type":"error"});
					LOGGER.addErrorMessage("Branch - "+ data.index + " (" +(data.edgeId) + ")" + " - Rate A thermal limit violated." ,data.edgeData.DOMID,"edge");
				}
			}
			
			//Checking the angle difference violations.
			if(parseFloat(data.solutionData.angleDiffVal) < parseFloat(data.edgeData.angmin) || parseFloat(data.solutionData.angleDiffVal) > parseFloat(data.edgeData.angmax)) {
				error = true;
				//errorList.push("Apparent power forward");
				validationErrorWarning.push({"key":"Error", "data":"Angle difference bound violated.","custom":"true","type":"error"});
				LOGGER.addErrorMessage("Branch - "+ data.index + " (" +(data.edgeId) + ")" + " - Angle difference bound violated." ,data.edgeData.DOMID,"edge");
			}
		
			
			this.edgeDOs.dOL[index]["validationError"] = validationErrorWarning;
			this.edgeDOs.dOL[index]["error"] = error;
			
			for(var i = 0; i < validationErrorWarning.length;i++) {
				if($.inArray(validationErrorWarning[i].key, warningList) !== -1) {
					validationErrorWarning[i]["classed"] = "warning";
				}
			}
			
			for(var i = 0; i < validationErrorWarning.length;i++) {
				if($.inArray(validationErrorWarning[i].key, errorList) !== -1) {
					validationErrorWarning[i]["classed"] = "error";
				}
			}
		/*Edge Validation:
			***For Warning***
			r value is negative
			x value is negative
			charge value is negative - b value is negative
			Thermal rating is 0 - rateA is zero
			Thermal rating is above UB - Added UB(as per equation) during data objects itself.
			charge value is very different from x value - log equation (Range of 1 is to be taken).
			status is 1, while bus is 0 - If the bus type is 4 then it is said to be 0.
			
			***For Error***
			Thermal limit is negative - rateA <0.
			Infeasible phase angle bounds - error if angmin > angmax.
			Inconsistent KVbase values - baseKV values for the source and target are not equal.
		*/
		}
	};
	
	NETWORK.Validator.prototype.validateNode = function(nodesDO) {
		var nodesData;
		if(typeof nodesDO === 'undefined'){ 
				var nodesData = this.nodeDOs.dOL; 
		}
		else {
			nodesData = nodesDO;
		}
		
		for(var index = 0; index < nodesData.length;index++) {
			var crtNode = nodesData[index];
			if(crtNode.topDecorators.length > 0) {
				this.validateTopDecorator(crtNode);
			}
			else {/*Do the logging here*/}
			
			if(crtNode.bottomDecorators.length > 0) {
				this.validateBottomDecorator(crtNode);
			}
			else {/*Do the logging here*/}
			
			var erroList=[], error = false;
			
			//Deep copy of the array - for generation of the tool-tip
			var validationError = jQuery.extend(true, [], NETWORK.RULES.nodeToolTip);
				
			if(parseFloat(crtNode.Vmin) > parseFloat(crtNode.Vmax)) {
				error = true;
				erroList.push("V Max");
				erroList.push("V Min");
				validationError.push({"key":"Error", "data":"Infeasible Voltage Bounds.","custom":"true","type":"error"});
				LOGGER.addErrorMessage("'" + crtNode.DOMID + "' - Infeasible Voltage Bounds.",crtNode.DOMID,"node");	
			}
			
			if((parseFloat(crtNode.Vm) < parseFloat(crtNode.Vmin)) || (parseFloat(crtNode.Vm)> parseFloat(crtNode.Vmax))) {
				error = true;
				erroList.push("Voltage");
				validationError.push({"key":"Error", "data":"Voltage value is out of bounds.","custom":"true","type":"error"});
				LOGGER.addErrorMessage("'" + crtNode.DOMID + "' - Voltage value is out of bounds.",crtNode.DOMID,"node");	
			}
			
			for(var i = 0; i < validationError.length;i++) {
				if($.inArray(validationError[i].key, erroList) !== -1) {
					validationError[i]["classed"] = "error";
				}
			}
				
			crtNode["validationError"] = validationError;
			crtNode["error"] = error;
			
			/*Node Validation
				***No warnings***
				***Errors  - Infeasible voltage bounds - error if Vmin > Vmax
								  - Infeasible voltage values.*/
		}
	};

})(NETWORK || (NETWORK = {}));