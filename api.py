from threading import Thread

from flask import Flask, request, abort, jsonify, make_response
from flask.ext.cors import CORS

from cmdmessenger import CmdMessenger
import serial
from serial.tools import list_ports


app = Flask(__name__)
# allow Cross Origin Requests
CORS(app)

pin_data = {'0': 0, '1': 0, '2': 0, '13': 0}
baud = 115200
commands = ['acknowledge',
            'error',
            'set_digital_pin',
            'set_analog_pin',
            ]

# setup serial communication
try:
    # try to open the first available usb port
    ports = [port for port in list_ports.grep('usb')]
    port_name = ports[0][0]
    serial_port = serial.Serial(port_name, baud, timeout=0)
except (serial.SerialException, IndexError):
    raise SystemExit('Could not open serial port.')
else:
    messenger = CmdMessenger(serial_port)
    messenger.wait_for_ack(ackid=commands.index('acknowledge'))
    print 'Connected to Arduino'

def set_digital_pin(pin_id, value):
    print 'Setting digital pin:', pin_id, 'to value:', value
    messenger.send_cmd(commands.index('set_digital_pin'), pin_id, value)
    messenger.wait_for_ack(ackid=commands.index('acknowledge'))

def on_set_digital_pin(received_command, *args, **kwargs):
    pin_id = args[0][0]
    pin_value = args[0][1]
    pin_data[pin_id] = pin_value


@app.route('/arduino/digital/<int:pin_id>', methods=['PATCH'])
def update_digital_pin(pin_id):
    """ Update the value of the digital pin specified """
    if not request.json:
        abort(400)
    pin_value = request.json.get('value')
    set_digital_pin(pin_id, pin_value)
    return jsonify({'value': pin_data[str(pin_id)]}), 200


@app.route('/arduino/digital/<int:pin_id>', methods=['GET'])
def get_digital_pin_value(pin_id):
    """ Return the value of the digital pin specified. Either True or False"""
    return jsonify({'value': pin_data[str(pin_id)]}), 200


@app.route('/arduino/pwm/<int:pin_id>', methods=['PATCH'])
def update_pwm(pin_id):
    """ Update the value of the digital pin specified """
    if not request.json:
        abort(400)
    # pin_value = request.json.get('value')
    # set_digital_pin(pin_id, pin_value)
    return jsonify({'value': 0}), 200


if __name__ == '__main__':
    # attach callbacks
    messenger.attach(func=on_set_digital_pin,
                     msgid=commands.index('set_digital_pin'))
    # start the flask app
    app.run(debug=True, use_reloader=False)
