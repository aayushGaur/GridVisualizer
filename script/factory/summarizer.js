(function(){
	NETWORK.Summarizer = function () {
	};

	/**
	*	This method compresses the graph. The logic for compression is as follows:
	*	1. Sort the nodes in ascending order of adm.
	*	2. Find the node with the lowest adm.
	*	3. Collapse the node with to its lowest neighbour.
	**	4. This step is not implemented as yet - Check for the thershold and other constraints.
	*	5. Use the node compress information to make the link data structure.
	**/
	NETWORK.Summarizer.prototype.summarizerGraph = function(networkObj,lvl) {
		/*// record start time
		var startTime = new Date();
		
		var nodes = (JSON.parse(JSON.stringify(networkObj.busDO.dOL)));
		
		// record start time
		var endTime = new Date();

		// time difference in ms
		var timeDiff = endTime - startTime;

		// strip the ms
		timeDiff /= 1000;

		// get seconds
		var seconds = Math.round(timeDiff % 60);
		console.log("Time taken to copy the object - " +  seconds);*/

		
		
		//Sort the input based on the adm.
		function sortLinksOnadm(a,b) {
			return a.adm - b.adm;
		}
		
		var compressedNodes = this.summarizerNodes(networkObj.busDO.dOL,lvl);
		var nodeList = compressedNodes.nodeList;
		//Compressing the nodes and getting the links of the compressed graph.
		var newLinks = [], newNodes = [], nl, newNodeIds = [];
			
		for(var e = 0; e < nodeList.length; e++) {
			if(nodeList[e].remove === false) {
				newNodes.push(nodeList[e]);
				newNodeIds.push(nodeList[e].bus_i);
			}
		}
		newNodes = newNodes.sort(sortLinksOnadm);
		newLinks = [];
		nl = newNodes.length;
		
		//Generating Neighbourlist from the neighbours of the nodes in the nodeList and the sortedMapping returned by Node Compressor.
		for(var i = nl-1; i >= 0; i--)  { 
			newNodes[i].neighbourList = [];
			for(var j = 0; j < newNodes[i].neighbours.length; j++) {
				var link = {};
				link["source"] = newNodes[i].bus_i; 
				if(newNodeIds.indexOf(newNodes[i].neighbours[j].id) !== -1) {
					link["target"] = newNodes[i].neighbours[j].id;	
					newLinks.push(link);
				}
			}
		}
		console.log(newLinks);
		//Making the bus_i and nodeDataMap
		var updatedNodes = {};
		var busDO = {};
		busDO.dOL = [];
		
		for(var x = 0; x < newNodes.length; x++) {
			updatedNodes[newNodes[x]["bus_i"]] = newNodes[x];
			busDO.dOL.push(newNodes[x]);
			if(isNaN(newNodes[x].adm)) {
				console.log(newNodes[x].bus_i);
			}
		}
		var crtLvl = {};
		crtLvl["level"] = lvl;
		crtLvl["nodes"] = updatedNodes;
		crtLvl["busDO"] = busDO;
		crtLvl["branchDO"] = newLinks;
		return crtLvl;
		
	};
	
	
	NETWORK.Summarizer.prototype.summarizerNodes = function(list, repeatTimes) {
		var maxAdm = 0, minAdm = 0;
		var admitanceValues = [];
		var returnObj = {};
		//Sort the input based on the adm.
		function sortLinksOnadm(a,b) {
			admitanceValues.push(a.adm);
			admitanceValues.push(b.adm);
			return a.adm - b.adm;
		}
		
		function sortLinksOnOriginaladm(a,b) {
			admitanceValues.push(a.adm);
			admitanceValues.push(b.adm);
			
			return a.originaladm - b.originaladm;
		}
		
		function sortarray(a,b) {
			return a - b;
		}
		function getMax(x) {
			var y = x.length;
			if(x.length >= 4) {
				if((x[y-1] * .9) > x[y-2]) {
					return x[y-2];
				}
				else if((x[y-1] * .9) > x[y-3]) {
					return x[y-3];
				}
				else if((x[y-1] * .9) > x[y-4]) {
					return x[y-4];
				}
				else {
					return x[y-1];
				}
			}
			
		}
		
		for(var repCount = 0; repCount < repeatTimes; repCount++) {
			//Sorting the list in ascending order based on adm.
			var nodeList = list.sort(sortLinksOnadm);			
			var max = getMax($.distinct(admitanceValues).sort(sortarray));
			
			//Creating the Map for the sorted and unsorted positions and sorting the neighbours of each node.
			var sortedMap = {};
			for(e = 0; e < nodeList.length; e++) {
				//Creating the sorted map.
				sortedMap[nodeList[e]["bus_i"]] = e;
				   
				//Sorting the neighbours based on adm.
				nodeList[e].neighbours.sort(sortLinksOnOriginaladm);
				
				/***** Region Begin - Investigation Code for removing the same node from being added twice *****/
				//This logic should be covered in the other for loops...but it is being checked here as a part of Investigative Code.
				var a = nodeList[e].neighbours.length;
				while(a--) {
					if(nodeList[e].bus_i === nodeList[e].neighbours[a].id) {
						nodeList[e].neighbours.splice(a, 1);
						if(repCount === 0) {
							alert("WHAT");	
						}
						
					}
				}
				/***** Region Ends -  Investigation Code for removing the same node from being added twice *****/
			}
			var len = nodeList.length;
			for(var i = 0; i < len; i++) {
				var n = nodeList[i];
				if((n.remove === undefined || n.remove === false) && n.neighbours.length > 0) {
					
					if(n.bus_i === "4728" || nodeList[sortedMap[n.neighbours[0].id]].bus_i === "4728") {
						console.log(i);
					}
				
				
					var firstNegh = nodeList[sortedMap[n.neighbours[0].id]];
					if(n.adm <= firstNegh.adm) {
						//Removing the item from the nodeList and adding its neighbours to the node in which it has been compressed.
						firstNegh.adm = firstNegh.adm + n.adm - n.neighbours[0].originaladm;

						//Adding all the neighbours of the node to the first neighbour
						var nN = n.neighbours;
						for(var j = 0; j < nN.length; j++) {
							//Adding all the neighbours of the node to the first neighbour if they are already not present in the list.
							var nodeFirstneighbourAllNeighbours = firstNegh.neighbours;
							var b = nodeFirstneighbourAllNeighbours.length;
							var neighbourAlreadyPresent = false;
							for(var h = 0; h < b; h++) {
								if(nodeFirstneighbourAllNeighbours[h].id === nN[j].id) {
									neighbourAlreadyPresent = true;
								}
								
								//Updating the adm of the first neighbour for all its neighbours.
								var firstneighbourCurrentNeighbourAllNeighbours = nodeList[sortedMap[nodeFirstneighbourAllNeighbours[h].id]].neighbours;
								var s = firstneighbourCurrentNeighbourAllNeighbours.length;
								for(var q = 0; q < s; q++) {
									if(firstneighbourCurrentNeighbourAllNeighbours[q].id === firstNegh.bus_i) {
										firstneighbourCurrentNeighbourAllNeighbours[q].adm = firstNegh.adm;
									}
								}
							}
							
							if(neighbourAlreadyPresent === false && firstNegh.bus_i !== nN[j].id) {
								var id = nN[j].id;
								var originaladm = nN[j].originaladm;
								var adm = nodeList[sortedMap[nN[j].id]].adm
								firstNegh.neighbours.push({"originaladm":originaladm,"id":id,"adm":adm});
							}
						}
						
						//Updating all the neighbours of the node to contain the first neighbour of the node as their neighbour now. Also the node will be marked as do not consider in the neighbour list.
						for(var d = 0; d < nN.length; d++) {
							var neighbourAlreadyPresent = false;
							var neighboursOfThisNeighbour = nodeList[sortedMap[nN[d].id]].neighbours;
							for(var c = 0; c < neighboursOfThisNeighbour.length; c++) {
								if(neighboursOfThisNeighbour[c].id === firstNegh.bus_i) {
									neighbourAlreadyPresent = true;
								}
							}
							if(neighbourAlreadyPresent === false) {
								var id = n.neighbours[0].id;
								var originaladm = n.neighbours[0].originaladm;
								var adm = nodeList[sortedMap[n["neighbours"][0]["id"]]].adm;
								neighboursOfThisNeighbour.push({ "adm":adm, "id":id, "originaladm":originaladm });
							}
						}
						
						//Removing the current node from all its neighbours as the adm of the current node will be always less than the adm of the other nodes.
						var nNeighbours = n.neighbours;
						for(var k = 0; k < nNeighbours.length; k++) {
							var m = nodeList[sortedMap[nNeighbours[k].id]].neighbours;
							for(var t = 0; t < m.length; t++) {
								if(m[t].id === n.bus_i) {
									m.splice(t, 1);
									break;
								}
							}
						}
						console.log(":");
						/*if(n.length > 0) {
							//firstNegh.neighbours = n;
							
							//Removing the common neighbours and the first neighbour from the node...The filtered neighbours will be added to the neighbour list of the first neighbour of the node.
							var m = n.neighbours;
							var firstNeighbourID = m[0].id;
							var z = nodeList[sortedMap[firstNeighbourID]].neighbours;
							var l = m.length - 1;
							while(l >= 0) {
								var decL = true;
								for(var k = 0; k < z.length; k++) {
									if(z[k].id.toString() === "1608") {
										console.log("123");
									}
									if(m.length > 0) {							
										if(m[l].id === z[k].id) {
											m.splice(l, 1);
											if(l > 0) {
												l = l - 1;
											}
											decL = false;
										}
									}
									if(m.length > 0) {							
										if(m[l].id === nodeList[sortedMap[firstNeighbourID]].bus_i) {
											m.splice(l, 1);
											if(l > 0) {
												l = l - 1;
											}
											decL = false;
										}
									}
								}
								if(decL) {
									l = l - 1;
								}
							}
						
							n.neighbours = m;
						
							if(n.neighbours.length > 0) {
								firstNegh.neighbours.push.apply(firstNegh.neighbours, n.neighbours);
							}
							else {
								//do nothing as the node had only one neighbour which has been removed.
							}
						}*/
						n.remove = true;
					}
					else {
						n.remove = false;
					}
				}
			}
		}
		returnObj.nodeList = nodeList;
		returnObj.sortedMap = sortedMap;
		return returnObj;
	};
})(NETWORK || (NETWORK = {}));