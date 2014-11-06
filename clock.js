
$(window).on('hashchange', function(e) {
    var hash = window.location.hash;
      
    $('.page').removeClass('show');
    $('.ft').removeClass('selected');
  
    if (hash == "#stopwatch") {
      $('#stopwatch').addClass('show');
      //make it red
      $('#sw').addClass('selected');
    }
    if (hash == "#worldclock") {
      $('#worldclock').addClass('show');
      $('#wc').addClass('selected');
    }
    if (hash == "#timer") {
      $('#timer').addClass('show');
      $('#tm').addClass('selected');
    }
});

function addPrefix(num) {
  if (num < 10) {
    num = '0' + num;
  }
  return num;
}

var _sec = 59;
 
 function countDownTimer() {
    var _hour = parseInt($('#hour').text());
    var _min = parseInt($('#minutes').text());

    $('#second').text(addPrefix(_sec));
    if (_hour > 0 || _min > 0 || _sec > 0) {
      _sec --;
      if (_sec < 0) {
        _sec = 59;
        _min --;
        if (_min < 0) {
          _min = 59;
          _hour --;
          $('#hour').text(addPrefix(_hour));
        }
        $('#minutes').text(addPrefix(_min));
      }
    } else {
      clearInterval(t);
    }
  }

  function resume() {
    t = setInterval('countDownTimer()', 1000);
  }

 var i = 0;

 $(".button-start.left-button").click(function() {
  var state = $(this).text(); //get the current state

  if (state === "Start") {
    //change the time display
    var hour = $('.hours').val();
    var min = $('.minutes').val();
    _sec = 59;
    if (hour != "0" || min != "0") { 
      $('.inputs').css('display', 'none');
      $('.count').css('display', 'block');
      //running state
      //change the two buttons
      $(this).css({"color": "red", "border-color": "red"});
      $(this).text("Cancel");
      //enable the button
      $(".button-pause.right-button").removeClass("disabled");
      $('#sym').show();
      if (hour != "0") $('#hour').text(addPrefix(hour));
      else {
        $('#sym').hide();
        $('#hour').empty();
      }
      $('#minutes').text(addPrefix(min-1));
      $('#second').text(_sec);
      t = setInterval('countDownTimer()', 1000);
    }
  } else {
    //cancel the clock
    clearInterval(t);
    $('.inputs').css('display', 'block');
    $('.count').css('display', 'none');
    $(this).css({"color": "green", "border-color": "green"});
    $(this).text("Start");
    $(".button-pause.right-button").text("Pause");
    $(".button-pause.right-button").addClass("disabled");
  } 
 })

 $(".button-pause.right-button").click(function() {
  //resume state
  var state = $(this).text();
  var disabled = $(this).hasClass("disabled");
  if (!disabled) {
    if (state === "Pause") {
      clearInterval(t);
      $(this).text("Resume");
    } else {
      $(this).text("Pause");
      resume();
    } 
  }
 })

 var worldClockData = [
  {
    cityName: 'Cupertino',
    timezoneOffset: -420
  },
  {
    cityName: 'Stockholm',
    timezoneOffset: 120
  },
  {
    cityName: 'São Paulo',
    timezoneOffset: -180
  },
  {
    cityName: 'Tokyo',
    timezoneOffset: 540
  },
  {
    cityName: 'New York',
    timezoneOffset: -240
  },
  {
    cityName: 'Bucharest',
    timezoneOffset: 180
  }
]

function setWorldClock() {
  $('.world-clock-list').empty();
  $.each(worldClockData, function(index, value) {
    var currTime = new Date();
    var n = currTime.getTimezoneOffset();
    var ahead = (value.timezoneOffset + n)/60;
    var gap = currTime.getHours() + ahead;
    currTime.setHours(gap);

    var today_tmr = '';
    var time_str = '';
    var ahead_time = '';


    if (gap > 24) {
      today_tmr = 'Tomorow';
    } else {
      today_tmr = 'Today';
    }
    
    if (ahead != 0) {
      ahead_time = ', ';
      if (ahead > 0) {
        ahead_time += ahead + ' hours ahead';
      } else {
        ahead_time += ahead + ' hours late';
      }
    }
    //change to 12 hour-format
    var hour = currTime.getHours();
    var min = currTime.getMinutes();
    if (hour >= 12) {
      time_str = 'PM';
    } else {
      time_str = 'AM';
    }

    hour = hour%12;
    if (hour == 0) hour += 12;

    time_str = addPrefix(hour) + ':' + addPrefix(min) + ' ' + time_str;

    $('.world-clock-list').append('<li><p class="city">'+ value.cityName + '</p><p class="time-details"><strong>'+ today_tmr + '</strong>'+ahead_time+'</p><p class="time">'+ time_str+ '</p></li>'
    );
  })
}
setWorldClock();
//run every 10 secs
var t = setInterval(function() {
  setWorldClock();
}, 10000);

var button1 = $('.button-stop.left-button');
var button2 = $('.button-lap.right-button');
var lap;
button1.click(function() {
  var state = $(this).text();
  if (state === "Start") {
    $(this).removeClass('start');
    $(this).text('Stop');
    $(this).addClass('stop');
    if (button2.hasClass('disabled')) {
      button2.removeClass('disabled');
    }
    button2.text('Lap');
    //start counting
    lap = setInterval('lapTimeCount()', 10);
  } else {
    //stop the timer count
    $(this).text('Start');
    $(this).removeClass('stop');
    $(this).addClass('start');
    button2.text('Reset');
    pause();
  }
});

var minid = $('#total-min');
var secid = $('#total-sec');
var ssid = $('#total-ss');

var minidlap = $('#lap-time-min');
var secidlap = $('#lap-time-sec');
var ssidlap = $('#lap-time-ss');

var ssLap = 0;
var ss=0;
var lapNum = 1;

button2.click(function() {
  var state = $(this).text();
  if (state === 'Reset') {
    $(this).text('Lap');
    $(this).addClass('disabled');
    clearInterval(lap);
    $('#total-min').text('00');
    $('#total-sec').text('00');
    $('#total-ss').text('00');
    $('#lap-time-min').text('00');
    $('#lap-time-sec').text('00');
    $('#lap-time-ss').text('00');
    lapNum = 1;
    $('.laps').empty();
    ssLap = 0;
    ss = 0;
  } else {
    //create new lap
    //reset
    var lapLen = $('#lap-time-min').text() + ':' + $('#lap-time-sec').text() + '.' + $('#lap-time-ss').text();
    //add laps:
    $('.laps').append('<li><p class="lap-label">Lap ' + lapNum + '</p><p class="lap-time">' + lapLen + '</p></li>');
    lapNum++;
    ssLap = 0;
    secidlap.text('00');
    minidlap.text('00');
  }
});

function lapTimeCount() {
  lapTimeTotal();
  lapTimeLap();
}

function lapTimeTotal() {
  var sec = parseInt(secid.text());
  var min = parseInt(minid.text());
  ssid.text(addPrefix(ss));
  ss++;
  if (ss > 100) {
    ss = 0;
    sec++;
    if (sec > 60) {
      min++;
      sec = 0;
      minid.text(addPrefix(min));
    }
    secid.text(addPrefix(sec));
  }
}

function lapTimeLap() {
  var sec = parseInt(secidlap.text());
  var min = parseInt(minidlap.text());
  ssidlap.text(addPrefix(ssLap));
  ssLap++;
  if (ssLap > 100) {
    ssLap = 0;
    sec++;
    if (sec > 60) {
      min++;
      sec = 0;
      minidlap.text(addPrefix(min));
    }
    secidlap.text(addPrefix(sec));
  }

}

function pause() {
  clearInterval(lap);
}

function lapReset() {
  minidlap.text('00');
  secidlap.text('00')
  ssidlap.text('00');
}
//run hundreds of second
























