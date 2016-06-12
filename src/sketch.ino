#include <Arduino.h>

#define BITRATE 230400
#define PIN_COUNT 6

void setup() {
  Serial.begin(BITRATE);
}

void loop() {
  int pin, i, values[PIN_COUNT];
  // zero out values
  for (pin=0;pin<PIN_COUNT;pin++) {
    values[pin] = 0;
  }

  // collect once per ms, for 10ms
  for (i=0;i<10;i++) {
    for (pin=0;pin<PIN_COUNT;pin++) {
      values[pin] += analogRead(pin);
    }
    delay(1);
  }

  word val;
  byte buf;
  // send 0x00 start byte
  Serial.write((byte)0x00);
  for (pin=0;pin<PIN_COUNT;pin++) {
    // first and last bits are set to 1, thus only the start byte is zero
    // we only need 14 bits, 10 for ADC and 4 for the pin (up to 16 pins)
    val = ((values[pin]/10) << 5) + (pin<<1) + 32769;
    buf = val/256;
    Serial.write(buf);
    buf = val % 256;
    Serial.write(buf);
  }
}
