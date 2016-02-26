/**	The objects of this class represent the slider for the Network Visualization.
*		The functionality provided for the Sliders is as follows:
*		1. Range for the values from which the user can select the values.
*		2. Ability to communicate with the other objects in the network regarding the current selected value.
*/
(function(){
	NETWORK.CONTROLS.Slider = function(range,DOMID) {
		this.DOMID = "#nodeAdmittance";
		this.slider = ($('<input></input>'));
		
		this.slider.attr({ id : "nodeAdmittance", type: "range", min:range.min, max:range.max, step:(range.max-range.min)/1000, value:(range.max-range.min)/2});
		
		$('#nodeAdmittanceWrapper').append(this.slider);
		$('#nodeAdmittanceWrapper').removeClass("hidden");
		/*this.ele = $(DOMID);
		this.ele.attr("min",range.min);
		this.ele.attr("max",range.max);
		this.ele.attr("step",(range.max-range.min)/1000);
		this.ele.attr("value",();*/
	};
	
	NETWORK.CONTROLS.Slider.prototype.attachEvents  = function () {
		var $document = $(document), that = this;
		
		var valueBubble = '<output class="rangeslider__value-bubble" />';

		function updateValueBubble(pos, value, context) {
		  pos = pos || context.position;
		  value = value || context.value;
		  //var $valueBubble = $('.rangeslider__value-bubble', context.$range);
		  var $valueBubble = $('.admRangeSliderOutput');
		  var tempPosition = pos + context.grabPos;
		  var position = (tempPosition <= context.handleDimension) ? context.handleDimension : (tempPosition >= context.maxHandlePos) ? context.maxHandlePos : tempPosition;

		  if ($valueBubble.length) {
			//$valueBubble[0].style.left = Math.ceil(position) + 'px';
			$valueBubble[0].innerHTML = 'Value Selected - ' + value;
		  }
		}

		$('input[type="range"]').rangeslider({
		  polyfill: false,
		  onInit: function() {
			this.$range.append($(valueBubble));
			updateValueBubble(null, null, this);
		  },
		  onSlide: function(pos, value) {
			updateValueBubble(pos, value, this);
		  },
		  // Callback function
            onSlideEnd: function(position, value) {
				reDrawGraphWithNewVal(value);
            }
		});
		
       
	};
})(NETWORK.CONTROLS || (NETWORK.CONTROLS = {}));