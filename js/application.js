var CountdownTimer = {
  endTime:null,
  timerId:null,
  minutes:0,
  maxWidth:0,
  maxTime:(25 * 60 * 1000),
  isBreak:false,

  normalColors:["#e47a80", "#eb363b"],
  breakColors: ["#97c751", "#759f58"],

  start: function(minutes, isBreak) {
    if (this.maxWidth == 0)
      this.maxWidth = $('#timer-bar').width();

    if (this.timerId)
      this.cancel();

    this.minutes = minutes;
    this.isBreak = isBreak;

    this.setupTimer();
    this.flashBar();
  },

  setupTimer:function() {
    $('#timer-finished').fadeOut();

    var date     = new Date();
    this.endTime = date.getTime() + (this.minutes * 60 * 1000);
    this.timerId = setInterval(this.tick, 1000);

    this.setBarToTime(this.minutes * 60 * 1000);
    $('title').text("Started " +
      (this.isBreak ? this.minutes + " minute break." : "work session."));
  },

  flashBar:function() {
    var lightColor, darkColor;
    if (this.isBreak)
    {
      lightColor = this.breakColors[0];
      darkColor  = this.breakColors[1];
    } else {
      lightColor = this.normalColors[0];
      darkColor  = this.normalColors[1];
    }
    $('#timer-bar').animate({backgroundColor:lightColor})
      .animate({backgroundColor:darkColor})
      .css('background-color', darkColor);
  },

  setBarToTime:function(time) {
    $('#timer-bar').animate({width:(time/this.maxTime) * this.maxWidth});
  },

  cancel:function() {
    clearInterval(this.timerId);
  },

  tick:function() {
    // NOTE: Called externally, so must use "CountdownTimer"
    //       instead of "this".
    CountdownTimer.tock();
  },

  tock:function() {
    var date = new Date();
    var remainingTime = this.endTime - date.getTime();
    if (remainingTime <= 0) {
      this.cancel();
      this.setBarToTime(0);
      this.showCompletedInLog();
      this.showCompletedMessage();
    } else {
      this.setBarToTime(remainingTime);
    }
  },

  showCompletedInLog:function() {
    var logClass = "timer-log-" +
      this.minutes + (this.isBreak ? "-break" : "");
    $('#timer-log').append('<div class="' + logClass + '"></div>');
  },

  showCompletedMessage:function() {
    if ($('#timer-finished').length == 0)
      $('#timer').append('<div id="timer-finished"></div>');
    var message = "Finished " +
      (this.isBreak ? this.minutes + " minute break." : "one work session.");
    $('title').text(message);
    $('#timer-finished').text(message).fadeIn(1000);
  },
};

jQuery.fn.extend({
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
		this.resetTaskStateClassNames();
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

jQuery(function() {

	$('#button-25').click(function(e){
		e.preventDefault();
		CountdownTimer.start(25);
	});

	$('#button-5-break').click(function(e) {
	    e.preventDefault();
	    CountdownTimer.start(5, true);
  	});

  	$('#button-25-break').click(function(e) {
	    e.preventDefault();
	    CountdownTimer.start(25, true);
  	});


  	//For jQuery version 1.6+, on() replaces live()
	/*$('.completion a').on("click", function(e) {
		$(this).toggleTaskState();
		return false;
	});*/


  $('.completion a').live("click", function(e) {
    $(this).toggleTaskState();
    return false;
  });


	$('#add').click(function(){
		var taskItem = $('#tasks ul li:first').clone();
		taskItem
			.find('.completion a').resetTaskState()
		.end()
			.find('input[type="text"]').val("");
		$('#tasks ul').append(taskItem);
		taskItem.find('input[type="text"]:first').focus();
		return false;
	});

	$('#add').click().click();

	$('#tasks ul').sortable({handle: ".handle"}).disableSelection();

	$('input[type="text"]:first').focus();
});
