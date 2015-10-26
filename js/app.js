base_digital_url = "http://localhost:5000/arduino/digital/"

function set_pin_high() {
  pin_num = $('#pin_select').val();
  console.log(pin_num);
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

// $(document).ready(function() {
//     $.ajax({
//         url: "http://localhost:5000/led",
//         type: "GET",
//         contentType: "application/json",
//     }).then(function(data) {
//        console.log(data)
//        $('.status').html("Status: " + String(data.status));
//     });
// });
