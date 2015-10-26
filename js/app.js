pwm_pins = [3, 5, 6, 9, 10, 11];
base_digital_url = "http://localhost:5000/arduino/digital/";
base_pwm_url = "http://localhost:5000/arduino/pwm/";
base_analog_url = "http://localhost:5000/arduino/analog/";

function check_if_pwm() {
  pin_num = parseInt($('#pin_select').val());
  // If the selected pin is a pwm pin show the pwm input
  if(pwm_pins.indexOf(pin_num) >= 0) {
    $('#pwm').show();
  }
  // otherwise hide the pwm input
  else {
    $('#pwm').hide();
  }
}

$('#pwm_form').submit(function () {
 set_pwm();
 return false;
});

function set_pwm() {
  pin_num = $('#pin_select').val();
  url = base_pwm_url + pin_num
  $.ajax({
      url: url,
      type: "PATCH",
      data : JSON.stringify({value: true}),
      contentType: "application/json",
      dataType: "json",
  }).then(function(data) {
     console.log(data)
  });
}

function set_pin_high() {
  pin_num = $('#pin_select').val();
  url = base_digital_url + pin_num
  $.ajax({
      url: url,
      type: "PATCH",
      data : JSON.stringify({value: true}),
      contentType: "application/json",
      dataType: "json",
  }).then(function(data) {
     console.log(data)
  });
}

function set_pin_low() {
  pin_num = $('#pin_select').val();
  url = base_digital_url + pin_num;
  $.ajax({
      url: url,
      type: "PATCH",
      data : JSON.stringify({value: false}),
      contentType: "application/json",
      dataType: "json",
  }).then(function(data) {
     console.log(data)
  });
}
