$(document).ready(function() {
	(function($){
		$.fn.extend({
			taskStates:['task-empty', 'task-x','task-apostrophe','task-dash'],


			//Loop through taskStates, Remove from each element, return this
			resetTaskStateClassNames:function(){

				/*var elements = this;*/ //this context refers to list of DOM elements handed by a selector 
				/*jQuery.each(jQuery.fn.taskStates, function(){
					elements.removeClass(this); 
				})
				return this;*/
				return this.each(function(){
					$(this).removeClass();
				});
			},

			resetTaskState:function(){
				return this.each(function() {
					jQuery(this).data('taskStateIndex', 0)
					.addClass(jQuery.fn.taskStates[0]);
				});
			},

			//Reset class names, Set data to next state, Set CSS class to next state
			toggleTaskState:function(){
				this.resetTaskStateClassNames(); //this refers to array of jQuery page elements

				return this.each(function() {	//this is a jQuery and has its own each method
					var element = jQuery(this);
					var taskStateIndex = element.data('taskStateIndex') || 0;	//data() stores your custom data in a document element
					taskStateIndex = (taskStateIndex + 1) % jQuery.fn.taskStates.length;

					element.data('taskStateIndex', taskStateIndex)
					.addClass(jQuery.fn.taskStates[taskStateIndex]);
				});
			},

		});
	})(jQuery);

	$('.completion a').on("click", function() {
		$(this).toggleTaskState();
		return false;
	});

	$('#add').click(function(){
		var taskItem = $('#tasks ul li:first').clone();
		taskItem.find('form')[0].reset();
		$('#tasks ul').append(taskItem);
		taskItem.find('input[type="text"]:first').focus();
		return false;
	});

	$('#add').click().click();

	$('#tasks ul').sortable({handle: ".handle"});

	$('input[type="text"]:first').focus();
});