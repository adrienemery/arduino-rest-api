#include <CmdMessenger.h>  // CmdMessenger

// Attach a new CmdMessenger object to the default Serial port
CmdMessenger cmdMessenger = CmdMessenger(Serial);

// This is the list of recognized commands. These can be commands that can either be sent or received. 
// In order to receive, attach a callback function to these events
enum
{
  // Commands
  kAcknowledge         , // Command to acknowledge that cmd was received
  kError               , // Command to report errors
  kDigitalPinSet       , // Command to request add two floats
  kAnalogPinSet , // Command to report addition result
};

// Commands we send from the PC and want to receive on the Arduino.
// We must define a callback function in our Arduino program for each entry in the list below.

void attachCommandCallbacks()
{
  // Attach callback methods
  cmdMessenger.attach(OnUnknownCommand);
  cmdMessenger.attach(kDigitalPinSet, OnSetDigitalPin);
}

// ------------------  C A L L B A C K S -----------------------

// Called when a received command has no attached function
void OnUnknownCommand()
{
  cmdMessenger.sendCmd(kError,"Command without attached callback");
}

// Callback function that responds that Arduino is ready (has booted up)
void OnArduinoReady()
{
  cmdMessenger.sendCmd(kAcknowledge,"Arduino ready");
}

// Callback function calculates the sum of the two received float values
void OnSetDigitalPin()
{
  // Retreive first parameter as int
  int pin_num = cmdMessenger.readInt16Arg();
  
  // Retreive second parameter as bool
  bool pin_value = cmdMessenger.readBoolArg();

  // Ensure the pinMode is set to OUTPUT
  pinMode(pin_num, OUTPUT);
  
  // Set the value of the pin number passed in
  digitalWrite(pin_num, pin_value?HIGH:LOW);
  // Send confirmation that command has been processed
  cmdMessenger.sendCmd(kAcknowledge);
}

// ------------------ M A I N  ----------------------

// Setup function
void setup() 
{
  // Listen on serial connection for messages from the pc
  Serial.begin(115200); 

  // Adds newline to every command
  cmdMessenger.printLfCr();   

  // Attach my application's user-defined callback methods
  attachCommandCallbacks();

  // Send the status to the PC that says the Arduino has booted
  cmdMessenger.sendCmd(kAcknowledge,"Arduino has started!");
}

// Loop function
void loop() 
{
  // Process incoming serial data, and perform callbacks
  cmdMessenger.feedinSerialData();
}


