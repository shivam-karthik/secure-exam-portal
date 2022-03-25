


$(document).ready(function () {

    $("#sidebar").mCustomScrollbar({
         theme: "minimal"
    });

    $('#sidebarCollapse').on('click', function () {
        // open or close navbar
        $('#sidebar, #content').toggleClass('active');
        // close dropdowns
        $('.collapse.in').toggleClass('in');
        // and also adjust aria-expanded attributes we use for the open/closed arrows
        // in our CSS
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });


    // setinterval used to create a timer for the testgiver
    // this timer should be dynamic in nature

    var timer2 = "60:00";

    var interval = setInterval(function() {

      var timer = timer2.split(':');
      //by parsing integer, I avoid all extra string processing
      // parseInt allows us to make variables a string hence allowing string contenation.
      var minutes = parseInt(timer[0], 10);
      var seconds = parseInt(timer[1], 10);
      --seconds;
      minutes = (seconds < 0) ? --minutes : minutes;
      if (minutes < 0) clearInterval(interval);
      seconds = (seconds < 0) ? 59 : seconds;
      seconds = (seconds < 10) ? '0' + seconds : seconds;
      //minutes = (minutes < 10) ?  minutes : minutes;
    // document.getElementById('timer').innerHTML ="Time -" + " " + minutes + ':' + seconds;
   // jquery equivalent of above syntax
    $('#timer').html("Time -" + " " + minutes + ':' + seconds);
      timer2 = minutes + ':' + seconds;
    }, 1000);


});
