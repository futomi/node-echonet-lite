node-echonet-lite
===============

The node-echonet-lite is a Node.js module which allows you to communicate with home appliances supporting the ECHONET Lite protocol.

This module provides you with functions such as listening, parsing, creating, sending ECHONET Lite packets over LAN/IPv4 on LAN (Wi-Fi or Ehternet) and UDP/IPv6 on Wi-SUN.

The ECHONET Lite is a communications protocol for smart home devices, which is mainly used in Japan. This module is based on the ECHONET Lite specifications which are available at the web site of the ECHONET Consortium:

* English
	* [ECHONET Lite Specification, Version 1.12](http://echonet.jp/spec_v112_lite_en/)
	* [APPENDIX, Detailed Requirements for ECHONET Device Objects, Release F](http://echonet.jp/spec_object_rf_en/)
* Japanese
	* [ECHONET Lite規格書 Ver.1.12](http://echonet.jp/spec_v112_lite/)
	* [APPENDIX ECHONET機器オブジェクト詳細規定 Release H](http://echonet.jp/spec_object_rh/)

The node-echonet-lite mainly has functionalities as follows:

* Listens incoming ECHONET Lite packets
* Parses ECHONET Lite packets
* Creates ECHONET Lite packets
* Sends ECHONET Lite packets

The ECHONET Lite specification defines a lot of classes (profiles of devices), the node-echonet-lite currently supports some classes as follows:

* Sensor-related Device Class Group (Class Group code: `0x00`)
  * Temperature sensor class (Class code: `0x11`)
  * Humidity sensor class (Class code: `0x12`)
  * Electric energy sensor class (Class code: `0x22`)
  * Air pressure sensor class (Class code: `0x2D`)
* Air Conditioner-related Device Class Group (Class Group code: `0x01`)
  * Home air conditioner class (Class code: `0x30`)
  * Air cleaner class (Class code: `0x35`)
* Housing/Facilities-related Device Class Group (Class Group code: `0x02`)
  * Electrically operated blind/shade class (Class code: `0x60`)
  * Electrically operated rain sliding door/shutter class (Class code: `0x63`)
  * Electric lock class (Class code: `0x6F`)
  * Instantaneous water heater class (Class code: `0x72`)
  * Power distribution board metering class (Class code: `0x87`)
  * Low-voltage smart electric energy meter class (Class code: `0x88`)
  * General lighting class (Class code: `0x90`)
* Cooking/Household-related Device Class Group (Class Group code: `0x03`)
  * Combination microwave oven(Electronic oven) class (Class code: `0xB8`)
* Profile class Group (Class Group Code: `0x0E`)
  * Node Profile Class (Class code: `0x0F`)

Besides the Device Object Super Class is supported as well, which is a base class inherited by all other classes. See the section "[Supported EPCs](#Supported-EPCs)" for details.

The node-echonet-lite parses ECHONET Lite packets related to the classes above correctly, so you don't have to know the spec for the classes above in detail. But the node-echonet-lite is useful for unknown classes as well, because it is an ECHONET Lite handling framework. This module provides a `Buffer` objects representing information for each class in an ECHONET Lite packet. Though you have to know the spec for the class, you can handle any type of classes and you don't have to know the underlying network layers.

The node-echonet-lite supports the network layers as follows:

* UDP/IPv4 on LAN (Wi-Fi or Ethernet)
	* This protocol stack is used for most of smart home devices, such as home air conditioners.
* UDP/IPv6 on Wi-SUN
	* This protocol stack is used as a communication line between a low-voltage smart electric energy meter and a home gateway (a.k.a. "HEMS gateway") in Japan. The communication line is as known as "Route-B".
	* [NOTE] This module is unstable for this network protocol stack for now.

The node-echonet-lite supports the Wi-SUN USB dongles as a HEMS gateway for Wi-SUN Route-B as follows:

* BP35C2, ROHM Semiconductor. [[English](http://www.rohm.com/web/global/products/-/product/BP35C2)] [[Japanese](http://www.rohm.co.jp/web/japan/products/-/product/BP35C2)]
* BP35A1, ROHM Semiconductor. [[English](http://www.rohm.com/web/global/products/-/product/BP35A1)] [[Japanese](http://www.rohm.co.jp/web/japan/news-detail?news-title=2015-01-07_ad&defaultGroupId=false)]
* RL7023 Stick-D/DSS, TESSERA TECHNOLOGY INC. [[Japanese](http://www.tessera.co.jp/rl7023stick-d_dss.html)]

If you want to communicate with a smart electric energy meter, you have to get either of the Wi-SUN USB dongles above. Note that the Wi-SUN USB dongles are available only in Japan.

Before using the node-echonet-lite module, you have to know the basics of the ECHONET Lite specification. See the section "[ECHONET Lite Tutorial](#Tutorial)" for details.

## Dependencies

- [Node.js](https://nodejs.org/en/) 4.4 +
- [serialport](https://www.npmjs.com/package/serialport)
  - Required if a Wi-SUN USB dongle is used.

## Installation

```
$ cd ~
$ npm install serialport
$ npm install node-echonet-lite
```

## <a id="moekadenroom">ECHONET Lite Emulator</a>

The ECHONET Lite devices are mainly available in Japan. If you don't have any ECHONET devices, it is recommended to use the [MoekadenRoom](https://github.com/SonyCSL/MoekadenRoom) which is an ECHONET Lite Emulator. [MoekadenRoom](https://github.com/SonyCSL/MoekadenRoom) emulates 6 types of devices (classes): Home air conditioner class, General lighting class, Electrically operated blind/shade class, Electric lock class, Temperature sensor class, and Low-voltage smart electric energy meter class. The node-echonet-lite supports the classes.

---------------------------------------
## Table of Contents

* [ECHONET Lite Tutorial](#Tutorial)
* [Quick Start](#Quick-Start)
  * [Home Air Conditioner](#Quick-Start-1)
  * [Smart Electric Energy Meter](#Quick-Start-2)
* [Operating suggestions](#Operating-suggestions)
* [Constructor of the EchonetLite object](#Constructor)
* [Methods](#Methods)
	* [`init(callback)`](#init-method)
	* [`setLang(lang)`](#setLang-method)
	* [`getClassGroupName(group_code)`](#getClassGroupName-method)
	* [`getClassName(group_code, class_code)`](#getClassName-method)
	* [`getPropertyName(group_code, class_code, epc)`](#getPropertyName-method)
	* [`isSupportedEpc(group_code, class_code, epc)`](#isSupportedEpc-method)
	* [`setSelfEoj(eoj)`](#setSelfEoj-method)
	* [`startDiscovery([callback])`](#startDiscovery-method)
	* [`stopDiscovery()`](#stopDiscovery-method)
	* [`getPropertyMaps(address, eoj[, callback])`](#getPropertyMaps-method)
	* [`getPropertyValue(address, eoj, epc[, callback])`](#getPropertyValue-method)
	* [`setPropertyValue(address, eoj, epc, edt[, callback])`](#setPropertyValue-method)
	* [`send(address, data[, callback])`](#send-method)
	* [`close([callback])`](#close-method)
* [Events](#Events)
	* [`notify` event](#notify-event)
	* [`data` event](#data-event)
	* [`sent` event](#sent-event)
	* [`data-serial` event](#data-serial-event)
	* [`sent-serial` event](#sent-serial-event)
* [Objects](#Objects)
	* [`Response` object](#Response-object)
	* [`Device` object](#Device-object)
	* [`Message` object](#Message-object)
	* [`Prop` object](#Prop-object)
	* [`EDT` object](#EDT-object)
* [Supported EPCs](#Supported-EPCs)
* [Monitoring ECHONET Lite packets](#Monitoring-ECHONET-Lite-packets)
* [How to handle unknown EPCs](#How-to-handle-unknown-EPCs)
* [Release Note](#Release-Note)
* [License](#License)

---------------------------------------
## <a id="Tutorial">ECHONET Lite Tutorial</a>

The ECHONET Lite packet consists of several blocks as follows:

```
-------------------------------------------------------------------
|EHD1|EHD2|TID|SEOJ|DEOJ|ESV|OPC|EPC1|PDC1|EDT1|...|EPCn|PDCn|EDTn|
-------------------------------------------------------------------

- EHD1: ECHONET Lite message header 1 (1 Byte)
- EHD2: ECHONET Lite message header 2 (1 Byte)
- TID : Transaction ID (2 Bytes)
- SEOJ: Source ECHONET Lite object specification （3 Bytes)
- DEOJ: Destination ECHONET Lite object specification (3 Bytes)
- ESV : ECHONET Lite service (1 Byte)
- OPC : Number of processing properties (1 Byte)
- EPC : ECHONET Lite Property (1 Byte)
- PDC : Property data counter (1 Byte)
- EDT : Property value data (Specified by PDC)
```

Though you don't need to know all block, using the node-echonet-lite module, you have to know at least EOJ (SEOJ, DEOJ), ESV, EPC, and EDT block. This section describes the summary of them. If you want to know more, see [ECHONET Lite Specification, Version 1.12](http://echonet.jp/spec_v112_lite_en/) for details.

### EOJ (ECHONET Lite Object)

The EOJ represents an entity of a device which is called "object" in the ECHONET Lite specification. In a ECHONET Lite packet, you can see two EOJ blocks as the SEOJ and the DEOJ. The SEOJ block means the source object, the DEOJ means the destination object. When you receive an ECHONET Lite packet, the SEOJ in the packet represents the remote device, the DEOJ represents you. In the contrary case, the remote device and you switch places. That is, the DEOJ represents you and the SEOJ represents the remote device.

The EOJ consists of three parts: Class group code, Class code, and Instance code.

A pair of a class group code and a Class code represents a type of a device. For example, the pair of the class group code `0x01` and the class code `0x30` means the Home Air Conditioner Class. The pair of the class group code `0x0E` and the class code `0x0F` means the Node Profile Class which is mainly used for the discovery process. Basically all ECHONET Lite devices have the Node Profile Class.

The instance code is basically `0x01`. The node-echonet-lite module provide you with the EOJ including the Instance code as a result of the discovery process. So you don't need to care about instance codes.

An EOJ is expressed as an `Array` object in the node-echonet-lite module, such as `[0x01, 0x03, 0x01]`. Some method of the node-echonet-lite requires such an `Array` object as an argument.

This node-echonet-lite module uses the EOJ `[0x05, 0xFF, 0x01]` as itself (i.e. you) by default. This EOJ means the Controller class in the management, control-related device class group, and instance code 1. you can change the self-EOJ using the [`setSelfEoj()`](#setSelfEoj-method) method anytime.

### ESV (ECHONET Lite service)

The ESV represents a kind of a request/response code. It is similar to the HTTP status code. Though a lot of ESV are defined in the ECHONET Lite specification, it is enough to know 6 types of ESV as follows. If you know the 6 types of ESV, you could accomplish most of what you want to do:

ESV symbol | desctiption
:----------|:-----------
`Get`      | If you want to get something from the remote device, this ESV is used.
`SetC`     | If you want to set something to the remote device, this ESV is used.
`Get_Res`  | If the remote device accepts the `Get` request and meets the request, the remote device will use this ESV in the response packet.
`Set_Res`  | If the remote device accepts the `SetC` request and meets the requests, the remote device will use this ESV in the response packet.
`Get_SNA`  | If the remote device can not accept the `Get` request or can not meet the request, the remote device will use this ESV in the response packet.
`SetC_SNA` | If the remote device can not accept the `SetC` request or can not meet the request, the remote device will use this ESV in the response packet.

Actually, the ESV is an code consisting of 1 byte unsigned integer. But you don't need to know the codes specified in the ECHONET Lite specification because this module communicates with you using only the symbols above (`Get`, `SetC`, etc.).

### EPC (ECHONET Property Code)

The EPC represents a property code. Each device object (EOJ) has a lot of properties (EPCs) such as operation status (`0x80`), manufacturer code (`0x8A`), room temperature (`0xBB`), etc. However an EPC is meaningless by itself. An EPC has a meaning with a class group code and a class code. Note that two same EPCs with a different class group code or class code don't necessarily have the same meaning.

In this section, a set of the three codes described above is expressed like `03-01-80` for the purpose of explanation.

For example, `03-01-80` means the operation status of the Home Air Conditioner Class. `0E-0F-80` means the operation status of the Node Profile class as well. Though both of the two mean the operation status, the meanings are slightly different. `03-01-80` represents an intuitive operation to you. If you turn on your air conditioner, the status will be `ON`. If you turn off your air conditioner, the status will be `OFF`. But `0E-0F-80` is basically always `ON`, because it means the operation status of the network adapter equipped in your air conditioner.

### EDT (Property value data)

The EDT represents the data corresponding to the EPC. The data structure depends on the corresponding EPC (in addition to the class group code and the class code), which is specified in [the APPENDIX of the ECHONET Lite specification](http://echonet.jp/spec_object_rf_en/). When you request a certain information to the remote device, the EDT in the response packet is just what you want.

The node-echonet-lite module supports some types of EDT for EPCs which are called "supported EPC" in this document. Note that the remote device does not necessarily support the EPC event if this module supports it.

If the EPC is supported by this module (i.e. a supported EPC), you don't need to know the data structure of the EDT. The node-echonet-lite module parses the EDT of the supported EPC and provides you with the result as the [`EDT`](#EDT-object) object, you can access information which you want easily. See the section "[Supported EPCs](#Supported-EPCs)" for details.

Even if the EPC is not supported by this module, you can obtain the Buffer object representing the EDT. Though you need to know the data structure of the EDT, you can parse any EDT by yourself. See the section [How to handle unknown EPCs](#How-to-handle-unknown-EPCs) for details.

---------------------------------------
## <a id="Quick-Start">Quick Start</a>

This section shows how to discover a specific type of device, how to get a value of a specific property of the device, and how to set a value to the property of the device.

### <a id="Quick-Start-1">Home Air Conditioner</a>

The sample code below discovers a home air conditioner, then gets the current operation status (ON or OFF), finally turns on or off the home air conditioner.

```JavaScript
// Load the node-echonet-lite module
var EchonetLite = require('node-echonet-lite');

// Create an EchonetLite object
//   The type of network layer must be passed.
var el = new EchonetLite({'type': 'lan'});

// Initialize the EchonetLite object
el.init((err) => {
  if(err) { // An error was occurred
    showErrorExit(err);
  } else { // Start to discover devices
    discoverDevices();
  }
});

// Start to discover devices
function discoverDevices() {
  // Start to discover Echonet Lite devices
  el.startDiscovery((err, res) => {
    // Error handling
    if(err) {
      showErrorExit(err);
    }
    // Determine the type of the found device
    var device = res['device'];
    var address = device['address'];
    var eoj = device['eoj'][0];
    var group_code = eoj[0]; // Class group code
    var class_code = eoj[1]; // Class code
    if(group_code === 0x01 && class_code === 0x30) {
      // Stop to discovery process
      el.stopDiscovery();
      // This means that the found device belongs to the home air conditioner class
      console.log('Found an air conditioner (' + address + ').');
      // Get the operation status
      getOperationStatus(address, eoj);
    }
  });
}

// Get the operation status
function getOperationStatus(address, eoj) {
  var epc = 0x80; // An property code which means the operation status
  el.getPropertyValue(address, eoj, epc, (err, res) => {
    // this value is true if the air conditione is on
    var status = res['message']['data']['status'];
    var desc = (status ? 'on' : 'off');
    console.log('The air conditioner is ' + desc + '.');
    // Toggle the status of the operation status
    changePowerStatus(address, eoj, epc, !status);
  });
}

// Change the status of the operation status
function changePowerStatus(address, eoj, epc, status) {
  var edt = { 'status': status };
  el.setPropertyValue(address, eoj, epc, edt, (err, res) => {
    var desc = (status ? 'on' : 'off');
    console.log('The air conditionaer was turned ' + desc + '.');
    el.close(() => {
      console.log('Closed.');
      // This script terminates here.
    });
  });
}

// Print an error then terminate the process of this script
function showErrorExit(err) {
  console.log('[ERROR] '+ err.toString());
  process.exit();
}
```

This sample code will output the result like this:

```
Found an air conditioner (192.168.10.15).
The air conditioner is off.
The air conditionaer was turned on.
```

### <a id="Quick-Start-2">Smart Electric Energy Meter</a>

```JavaScript
// Load the node-echonet-lite module
var EchonetLite = require('node-echonet-lite');

// Create an EchonetLite object for Wi-SUN Route-B
var el = new EchonetLite({
  'type'   : 'wisunb',
  'adapter': 'bp35c2',
  'path'   : 'COM6',
  'id'     : 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  'pass'   : 'XXXXXXXXXXXX'
});

// Initialize the EchonetLite object
el.init((err) => {
  if(err) { // An error was occurred
    showErrorExit(err);
  } else { // Start to discover devices
    discoverDevices();
  }
});

// Start to discover devices
function discoverDevices() {
  // Start to discover a smart electric energy meter
  // on Wi-SUN B-route using a Wi-SUN USB dongle
  el.startDiscovery((err, res) => {
    // Error handling
    if(err) {
      showErrorExit(err);
    }
    // Determine the type of the found device
    var device = res['device'];
    var address = device['address'];
    var eoj = device['eoj'][0];
    var group_code = eoj[0]; // Class group code
    var class_code = eoj[1]; // Class code
    if(group_code === 0x02 && class_code === 0x88) {
      // Stop to discovery process
      el.stopDiscovery();
      // This means that the found device belongs to
      // the low voltage smart electric energy meter class
      console.log('Found a smart electric energy meter (' + address + ').');
      // Get the Measured instantaneous electric energy 
      getMeasuredValue(address, eoj);
    }
  });
}

// Get the measured values
function getMeasuredValue(address, eoj) {
  var epc = 0xE7; // An property code which means "Measured instantaneous electric energy"
  el.getPropertyValue(address, eoj, epc, (err, res) => {
    var energy = res['message']['data']['energy'];
    console.log('Measured instantaneous electric energy is ' + energy + ' W.');
    el.close(() => {
      console.log('Closed.');
      process.exit();
    });
  });
}

// Print an error then terminate the process of this script
function showErrorExit(err) {
  console.log('[ERROR] '+ err.toString());
  process.exit();
}
```

This sample code will output the result like this:

```
Found a smart electric energy meter (XXX0:0000:0000:0000:0XXX:XXXX:XXXX:XXXX).
Measured instantaneous electric energy is 402 W.
Closed.
```
---------------------------------------
## <a id="Operating-suggestions">Operating suggestions</a>

If you want to send multiple requests, never send them simultaneously. Be sure to send a request after the response for the previous request came. You should know the remote device is not a high-performance computer such as a personal computer or a smart phone. It is a poor-performance embedded device. Never put unnecessary pressure on such devices in order to avoid unexpected problems.

Never do this:
```JavaScript
// [CAUTION] NEVER DO THIS
[0xE0, 0xE1, 0xE2].forEach((epc) => {
  el.getPropertyValue(address, eoj, epc, (err, res) => {
    console.dir(res['message']['data']);
  });
});
```

Do this instead:
```JavaScript
var epc_list = [0xBA, 0xBB, 0xBE];
(function request() {
  var epc = epc_list.shift();
  if(epc) {
    el.getPropertyValue(address, eoj, epc, (err, res) => {
      console.dir(res['message']['data']);
      request();
    });
  } else {
    el.close();
  }
})();
```

Especially, You should be more careful to Wi-SUN devices because not only Wi-SUN-related devices perform really poorly but also the bit-rate of Wi-SUN is really poorer than Wi-Fi or Ethernet. If you send another request, it is strongly encouraged to wait at least in 1 second after the response for the previous request came using the `setTimeout()` method implemented in Node.js.

```JavaScript
var epc_list = [0xBA, 0xBB, 0xBE];
(function request() {
  var epc = epc_list.shift();
  if(epc) {
    el.getPropertyValue(address, eoj, epc, (err, res) => {
      console.dir(res['message']['data']);

      // HERE IS IMPORTANT!!!
      setTimeout(request, 1000);

    });
  } else {
    el.close();
  }
})();
```

How long you should wait, it depends on conditions. You might have to wait longer.

The suggestion described here is applied to the all methods sending a packet as well: [`getPropertyMaps()`](#getPropertyMaps-method), [`getPropertyValue()`](#getPropertyValue-method), [`setPropertyValue()`](#setPropertyValue-method), and [`send()`](#send-method).

---------------------------------------
## <a id="Constructor">Constructor of the EchonetLite object</a>

In order to use the node-echonet-lite, you have to load the node-echonet-lite module as follows:

```JavaScript
var EchonetLite = require('node-echonet-lite');
```

You can get an `EchonetLite` constructor using the code above. Then you have to create an `EchonetLite` object as an instance of the `EchonetLite` constructor as follows:

```JavaScript
var el = new EchonetLite({'type': 'lan'});
```

The `EchonetLite` constructor takes an argument. It must be a hash object having the properties as follows:

Property | Type   | Required | Description
:--------|:-------|:---------|:-----------
`type`   | String | required | The type of the network layer (protocol stack). The value must be either `lan` or `wisunb`. The value `lan` means UDP/IPv4 on LAN (Wi-Fi or Ethernet). The value `wisunb` means UDP/IPv6 on Wi-SUN.
`lang`   | String | optional | The language code. The value must be either `en` (English) or `ja` (Japanese). This module can report analysis results of incoming ECHONET Lite packets using the specified language. The default value is `en`

If you set `lan` to `type` property, the additional properties are required as follows:

Property     | Type    | Required | Description
:------------|:--------|:---------|:-----------
`netif`      | String  | optional | Specify the multicast interface as an IPv4 address.
`membership` | Boolean | optional | Joining the multicast group or not. The default value is `true`.

If the `netif` is not specified, all available network interfaces will be joined to a multicast group. If you want to use one network interface, set the `netif` parameter to the IPv4 address representing the network interface you want to use.

The `membership` indicates whether joining the multicast group (`true`) or not (`false`). Note that the [`notify` event](#notify-event) would not work if this parameter is set to `false`. Basically, it is strongly recommended not to specify this parameter unless you encounter an error related to multicast.

The `membership` was introduced for Windows WSL (Windows Subsystem for Linux). As far as I know, some [node.js methods related to udp multicast](https://nodejs.org/api/dgram.html#dgram_socket_dropmembership_multicastaddress_multicastinterface) throws an exception. For now, no complete solution for WSL is found.

If you set `wisunb` to `type` property, the additional properties are required as follows:

Property | Type   | Required | Description
:--------|:-------|:---------|:-----------
`adapter`| String | required | The product name of Wi-SUN USB dongle. The value must be either `bp35a1` or `rl7023`.
`path`   | String | required | The path of the serial port which the Wi-SUN USB dongle is inserted. If you use Windows OS, it should be like `COM3`. If you use Linux, it should be like `/dev/tty-usbserial1`.
`baud`   | Number | optional | The baud rate of the Wi-SUN USB dongle. The default value is 115200. If your Wi-SUN USB dongle supports the default baud rate, you don't need to specify this property.
`id`     | String | required | The Route-B ID.
`pass`   | String | required | The Route-B Password.

The sample code below shows how to create an `EchonetLite` object for the network layer "UDP/IPv6 on Wi-SUN".

```JavaScript
var EchonetLite = require('node-echonet-lite');
var el = new EchonetLite({
  'lang'   : 'ja',
  'type'   : 'wisunb',
  'adapter': 'bp35a1',
  'path'   : 'COM8',
  'id'     : '0123456789ABCDEF0123456789ABCDEF',
  'pass'   : 'ABCDEFGHIJKL',
  'baud'   : 115200
});
```

Technically, you can create multiple `EchonetLite` objects with the same type of network layer. However, that don't work well. Never do that.

```JavaScript
// [CAUTION] NEVER DO THIS. THIS NEVER WORKS.
var el1 = new EchonetLite({'type': 'lan'});
var el2 = new EchonetLite({'type': 'lan'});
```

The code below also don't work.

```JavaScript
// [CAUTION] NEVER DO THIS. THIS NEVER WORKS.
var el1 = new EchonetLite({'type': 'wisunb', ...});
var el2 = new EchonetLite({'type': 'wisunb', ...});
```

You can create two `EchonetLite` objects with different type of network layer. The code blow will work well.

```JavaScript
// This will work well.
var el1 = new EchonetLite({'type': 'lan'});
var el2 = new EchonetLite({'type': 'wisunb', ...});
```

---------------------------------------
## <a id="Methods">Methods</a>

This section describes the methods implemented in the `EchonetLite` object.

### <a id="init-method">init(*callback*)</a>

This method initializes the `EchonetLite` object. You have to initialize the `EchonetLite` object immediately after you create it.

The initialization is processed asynchronously. Therefore you have to specify a callback function as the 1st argument of this method.

```JavaScript
var EchonetLite = require('node-echonet-lite');
var el = new EchonetLite({'type': 'lan'});

// Initialize the EchonetLite object
el.init((err) => {
  if(err) { // An error was occurred
    // Do something for the error.
  } else { // The initialization process completed successfully
    // Do something using the EchonetLite object.
    // Generally, the discover process is started here.
  }
});
```

### <a id="setLang-method">setLang(*lang*)</a>

This method set the language for the packet analysis. Basically you don't need to call this method. If you want to get the results of the packet analysis, you can choose the language from English and Japanese.

If you want to set the language to English explicitly, pass an string `en` to this method as the 1st argument. Similarly, if you want to set the language to Japanese, pass an string `ja` to this method as the 1st argument.

```JavaScript
var EchonetLite = require('node-echonet-lite');
var el = new EchonetLite({'type': 'lan'});

// Set the language to Japanese
var lang = el.setLang('ja');

// Set the language to English
var lang = el.setLang('en');
```
This method can be called anytime after the `EchonetLite` object was created. You don't need to wait for the completion of the initialization process of the `EchonetLite` object.

### <a id="getClassGroupName-method">getClassGroupName(*group_code*)</a>
### <a id="getClassName-method">getClassName(*group_code, class_code*)</a>
### <a id="getPropertyName-method">getPropertyName(*group_code, class_code, epc*)</a>
### <a id="isSupportedEpc-method">isSupportedEpc(*group_code, class_code, epc*)</a>

The `getClassGroupName()` method, the `getClassName()` method, and the `getPropertyName()` method returns the class group name, the class name, and the property name respectively. These names are defined in the ECHONET Lite specification. The node-echonet-lite module knows all names specified in the spec.

The `isSupportedEpc()` method returns `true` or `false`. If the EDT of the set of codes passed to this method is supported to be parsed by the node-echonet-lite module, this method returns `true`, otherwise `false`.

The sample code below shows how to get the group name, the class name, and property name. Furthermore, it shows how to determine if the EDT of the specified EPC is supported to be parsed by this module.

```JavaScript
var EchonetLite = require('node-echonet-lite');
var el = new EchonetLite({'lang': 'en', 'type': 'lan'});

var group_code = 0x02;
var class_code = 0x64;
var epc = 0xD0;

var group_name = el.getClassGroupName(group_code);
var class_name = el.getClassName(group_code, class_code);
var prop_name = el.getPropertyName(group_code, class_code, epc);
var supported = el.isSupportedEpc(group_code, class_code, epc);

console.log('- Group name    : ' + group_name);
console.log('- Class name    : ' + class_name);
console.log('- Property name : ' + prop_name);
console.log('- Is supported  : ' + (supported ? 'Yes' : 'No'));
```

The sample code above will output the result like this:

```
- Group name    : Housing/facility-related device class group
- Class name    : Electrically operated gate class
- Property name : Opening speed setting
- Is supported  : No
```

if you want to see the result in Japanese, specify it to the `EchonetLite` constructor like this:

```JavaScript
var el = new EchonetLite({'lang': 'ja', 'type': 'lan'});
```

You can also use the `setLang()` method of the `EchonetLite` object:

```JavaScript
el.setLang('ja');
```

If the language setting is `ja`, the result will be as follows:

```
- Group name    : 住宅・設備関連機器クラスグループ
- Class name    : 電動ゲート
- Property name : 開速度設定
- Is supported  : No
```

### <a id="setSelfEoj-method">setSelfEoj(*eoj*)</a>

This method allows you to set the self-EOJ to arbitrary EOJ. The first argument `eoj` must be an `Array` object consisting three codes: the class group code, the class code, and the instance code. Each code must be an integer in the range of 0 (`0x00`) to 255 (`0xFF`).

```JavaScript
var el = new EchonetLite({'type': 'lan'});
el.setSelfEoj([0x06, 0x04, 0x01]);
```
Once you set the self-EOJ, this module uses it for the SEOJ of each ECHONET Lite packet to be sent even when the discovery process is executed. You can use this method at any time after the `EchonetLite` object was created.

If you don't call this method, this module uses the default self-EOJ `[0x05, 0xFF, 0x01]` as the SEOJ of each ECHONET Lite packet to be sent. This default self-EOJ means the Controller class in the management, control-related device class group, and instance code 1.

### <a id="startDiscovery-method">startDiscovery(*[callback]*)</a>

This method start the discovery process and tries to find ECHONET Lite devices. Whenever a ECHONET Lite device was found, the `callback` function specified to the 1st argument will be called. The `callback` is optional.
The `callback` will be passed two argument. The 1st argument is an `Error` object. If no error occurred, it will be `null`.

If a device was found successfully, the [`Response`](Response-object) object will be passed as the 2nd argument. See the section "[`Response` object](#Response-object)" in details.

```JavaScript
// Start to discover Echonet Lite devices
el.startDiscovery((err, res) => {
  if(err) { // An error was occurred
    // Do something for the error.
  } else { // An ECHONET Lite device was found.
    // Determine the type of the found device
    var device = res['device'];
    var address = device['address'];
    var eoj = device['eoj'][0];
    var group_code = eoj[0]; // Class group code
    var class_code = eoj[1]; // Class code
    if(group_code === 0x01 && class_code === 0x30) {
      // This means that the found device belongs to the home air conditioner class
      console.log('Found an air conditioner (' + address + ').');
      // Stop to discovery process
      el.stopDiscovery();
      // Do something to the device
      ...
    }
  }
});
```

If no ECHONET Lite device was found, more than one network adapter might exist on your host computer. When this method is called, the node-echonet-lite sends an UDP multicast packet to `224.0.23.0` in the LAN mode. If more than one network adapter exists on your host computer, the OS on your computer possibly would pass it to an unexpected network adapter. It is recommended to disable such network adapters.

Be sure to call `stopDiscovery()` method if the targeted device was found.

### <a id="stopDiscovery-method">stopDiscovery()</a>

This method stop the discovery process. After the `startDiscovery()` method was called and the targeted device was found, then be sure to call this method before controlling the targeted devices.

### <a id="getPropertyMaps-method">getPropertyMaps(*address, eoj[, callback]*)</a>

This method get the property maps from the specified device. The property maps let you know which EPCs the device supports. Therefore getting the property maps is essential in order to interact with ECHONET Lite devices.

This method takes three arguments. the 1st argument `addresss` is the IP address of the targeted device. The `addresss` is required. The IP address can be get from the discovery process.

The 2nd argument `eoj` is the EOJ of the targeted device. It must be passed as an `Array` object. The `Array` object can be get from the discovery process.

The 3rd argument `callback` is a callback function called when this method completes the process. Two arguments will be passed to the `callback`. The 1st argument is an `Error` object. If no error occurred, it will be `null`. If this method completes the process successfully, the [`Response`](#Response-object) object will be passed as the 2nd argument. The special property `data` is added to the the [`Response`](#Response-object) object for this method. The value of the `data` property is a hash object having the properties as follows:

Property | Type   | Description
:--------|:-------|:-----------
`inf`    | Array  | Status change announcement property map
`set`    | Array  | Set property map
`get`    | Array  | Get property map

Each property map contains the supported EPCs as a number.

``` JavaScript
el.startDiscovery((err, res) => {
  // Determine the type of the found device
  var device = res['device'];
  var address = device['address'];
  var eoj = device['eoj'][0];
  var group_code = eoj[0]; // Class group code
  var class_code = eoj[1]; // Class code
  if(group_code === 0x01 && class_code === 0x30) {
    // This means that the found device belongs to the home air conditioner class
    console.log('- IP address: ' + address);
    console.log('- EOJ: ' + JSON.stringify(eoj));
    // Stop to discovery process
    el.stopDiscovery();
    // Get the property maps
    el.getPropertyMaps(address, eoj, (err, res) => {
      console.log('- Property Maps:')
      console.dir(res['message']['data']);
      process.exit();
    });
  }
});
```

The sample code above will print the result as follows:

```
- IP address: 192.168.10.15
- EOJ: [1,48,1]
- Property Maps:
{ inf: [ 128, 129, 136, 143, 160, 176 ],
  set: [ 128, 129, 143, 147, 160, 163, 176, 179, 180, 193, 196 ],
  get: [ 176, 160, 128, 193, 129, 130, 179, 163, 147, 131, 196, 180, 132, 133, 136, 137, 186, 138, 187, 157, 190, 158, 159, 143 ] }
```

It is encouraged to check the property maps before interacting with the targeted device.

### <a id="getPropertyValue-method">getPropertyValue(*address, eoj, epc[, callback]*)</a>

This method get the property value of the specified EPC from the specified device.

This method takes four arguments. the 1st argument `addresss` is the IP address of the targeted device. This argument is required. The IP address can be get from the discovery process.

The 2nd argument `eoj` is the EOJ of the targeted device. This argument is required. It must be passed as an `Array` object. The `Array` object can be get from the discovery process.

The 3rd argument `epc` is the EPC you want to get. This argument is required. You have to know which EPC you want is in advance. you can find the meanings of EPCs in [the APPENDIX of the ECHONET Lite specification](http://echonet.jp/spec_object_rf_en/).

The 4th argument `callback` is a callback function called when this method completes the process. This argument is optional. Two arguments will be passed to the `callback`. The 1st argument is an `Error` object. If no error occurred, it will be `null`. If this method completes the process successfully, the [`Response`](#Response-object) object will be passed as the 2nd argument. The special property `data` is added to the [`Response`](#Response-object) object for this method. The value of the `data` property is a EDT object which is a hash object having some properties depending on the EPC. See the section "[EDT object](#EDT-object)" for details.

The sample code below shows how to use the `getPropertyValue()` method. In this code, the measured value of room temperature is got from the home air conditioner.

``` JavaScript
// Start to discover Echonet Lite devices
el.startDiscovery((err, res) => {
  // Determine the type of the found device
  var device = res['device'];
  var address = device['address'];
  var eoj = device['eoj'][0];
  var group_code = eoj[0]; // Class group code
  var class_code = eoj[1]; // Class code
  if(group_code === 0x01 && class_code === 0x30) {
    // This means that the found device belongs to the home air conditioner class
    console.log('- IP address: ' + address);
    console.log('- EOJ: ' + JSON.stringify(eoj));
    // Stop to discovery process
    el.stopDiscovery();
    // Get the property value (Measured value of room temperature)
    el.getPropertyValue(address, eoj, 0xBB, (err, res) => {
      console.log('- Property value:')
      console.dir(res['message']['data']);
      process.exit();
    });
  }
});
```

The sample code above will print the result as follows:

```
- IP address: 192.168.10.15
- EOJ: [1,48,1]
- Property value:
{ temperature: 26 }
```

### <a id="setPropertyValue-method">setPropertyValue(*address, eoj, epc, edt[, callback]*)</a>

This method sets the specified property value (`edt`) of the specified EPC (`epc`) to the specified device (`eoj` in `address`).

This method takes five arguments. the 1st argument `addresss` is the IP address of the targeted device. This argument is required. The IP address can be get from the discovery process.

The 2nd argument `eoj` is the EOJ of the targeted device. This argument is required. It must be passed as an `Array` object. The `Array` object can be get from the discovery process.

The 3rd argument `epc` is the EPC you want to set. This argument is required. You have to know the EPC you want to set in advance. you can find the meanings of EPCs in [the APPENDIX of the ECHONET Lite specification](http://echonet.jp/spec_object_rf_en/).

The 4th argument `edt` is the [`EDT`](#EDT-object) object which contains some values you want to convey to the targeted device. It is just a hash object. The structure depends on the EPC. See the section "[EDT object](#EDT-object)" for details.

You can specify the 4th argument `edt` as a `Buffer` object as well. Though you have to create a `Buffer` object representing the EDT by yourself, this allows you to send an arbitrary EDT.

The 5th argument `callback` is a callback function called when this method completes the process. This argument is optional. Two arguments will be passed to the `callback`. The 1st argument is an `Error` object. If no error occurred, it will be `null`. If this method completes the process successfully, the [`Response`](#Response-object) object will be passed as the 2nd argument.

The sample code below shows how to use the `setPropertyValue()` method. The home air conditioner is turned off by this code.

```JavaScript
// Start to discover Echonet Lite devices
el.startDiscovery((err, res) => {
  // Determine the type of the found device
  var device = res['device'];
  var address = device['address'];
  var eoj = device['eoj'][0];
  var group_code = eoj[0]; // Class group code
  var class_code = eoj[1]; // Class code
  if(group_code === 0x01 && class_code === 0x30) {
    // This means that the found device belongs to the home air conditioner class
    console.log('- IP address: ' + address);
    console.log('- EOJ: ' + JSON.stringify(eoj));
    // Stop to discovery process
    el.stopDiscovery();
    // Create an EDT object
    var edt = { 'status': true };
    // Turn off the home air conditioner
    el.setPropertyValue(address, eoj, 0x80, edt, (err, res) => {
      var esv = res['message']['esv'];
      if(esv === 'Set_Res') {
        console.log('- Result: Success');
      } else {
        console.log('- Result: Failed');
      }
      el.close();
    });
  }
});
```

You can specify a `Buffer` object as the part of EDT as follows:

``` JavaScript
// Create a Buffer object for the EDT
var edt = new Buffer([0x31]);
// Turn off the home air conditioner
el.setPropertyValue(address, eoj, 0x80, edt, (err, res) => {
  // If succeeded, the air conditioner should be turned off.
});
```

In order to determine the request was accepted by the targeted device, you have to check the value of the ESV in the response packet. You can get the value of the ESV from `esv` property in the [`Message`](#Message-object) object in the [`Response`](#Response-object) object passed to the callback function (i.e. `res['message']['esv']`). Note that the `Error` object passed to the callback function mainly represents an network error. It does not represents the fact that the targeted device didn't accept the request. Even if the targeted device denied the request, the `Error` object is `null` as long as the targeted device responded.

The sample code above will print the result as follows:

```
- IP address: 192.168.10.15
- EOJ: [1,48,1]
- Result: Success
```

### <a id="send-method">send(*address, eoj, esv, prop[, callback]*)</a>

This method sends an arbitrary ECHONET Lite packet to the specified device. It is most primitive method in this module. The `getPropertyValue()` and the `setPropertyValue()` method can tread only one EPC. But the ECHONET Lite specification allows us to treat multiple EPCs simultaneously in one ECHONET Lite packet. Using this method, you can send a request packet including multiple EPCs.

This method takes five arguments. the 1st argument `addresss` is the IP address of the targeted device. This argument is required. The IP address can be get from the discovery process.

The 2nd argument `eoj` is the EOJ of the targeted device. This argument is required. It must be passed as an `Array` object. The `Array` object can be get from the discovery process.

The 3rd argument `esv` is the ESV symbol. Note that the value of `esv` argument is not a ESV code. It must be specified as a symbol, such as "`Get`", "`SetC`", etc. "`Get`" is used to get a property value from the targeted device. "`SetC`" is used to set a property to the targeted device.

The 4th argument `prop` is an `Array` object consisting of hash objects containing an EPC and an [`EDT`](#EDT-object) object. This argument is required. If you want to send EDTs to the targeted device, you have to create [`EDT`](#EDT-object) objects by yourself.

```JavaScript
[{'epc': 0x80, 'edt': {'status': false}}]
```

You can set the value of `edt` property as an `Buffer` object as follows. Though you have to know the byte sequences specified in the ECHONET Lite specification, you can send an arbitrary EDT.

```JavaScript
[{'epc': 0x80, 'edt': new Buffer([0x31])}]
```

If you just want to get the values from the targeted devices, the [`EDT`](#EDT-object) object must be `null`.

```JavaScript
[{'epc': 0xBA, 'edt': null}, {'epc': 0xBB, 'edt': null}]
```

The 5th argument `callback` is a callback function called when this method completes the process. This argument is optional. Two arguments will be passed to the `callback`. The 1st argument is an `Error` object. If no error occurred, it will be `null`. If this method completes the process successfully, the [`Response`](#Response-object) object will be passed as the 2nd argument.

The sample code below shows how to use the `send()` method. In this code, three properties are requested to the targeted device simultaneously in one request.

```JavaScript
// Start to discover Echonet Lite devices
el.startDiscovery((err, res) => {
  // Determine the type of the found device
  var device = res['device'];
  var address = device['address'];
  var eoj = device['eoj'][0];
  var group_code = eoj[0]; // Class group code
  var class_code = eoj[1]; // Class code
  // This means that the found device belongs to the home air conditioner class
  if(group_code === 0x01 && class_code === 0x30) {
    // Stop to discovery process
    el.stopDiscovery();
    // Get the property values
    var esv = 'Get';
    var prop = [
      {'epc': 0xBA, 'edt': null}, // Room Humidity
      {'epc': 0xBB, 'edt': null}, // Room Temperature
      {'epc': 0xBE, 'edt': null}  // Outdoor Temperature
    ];
    el.send(address, eoj, esv, prop, (err, res) => {
      res['message']['prop'].forEach((p) => {
        var epc = p['epc'];
        var edt = p['edt'];
        if(epc === 0xBA) {
          console.log('- Room Humidity      : ' + edt['humidity'] + ' %');
        } else if(epc === 0xBB) {
          console.log('- Room Temperature   : ' + edt['temperature'] + ' Celsius');
        } else if(epc === 0xBE) {
          console.log('- Outdoor Temperature: ' + edt['temperature'] + ' Celsius');
        }
      });
      el.close();
    });
  }
});
```

The sample code above will print the result as follows:

```
- Room Humidity      : 60 %
- Room Temperature   : 26 Celsius
- Outdoor Temperature: 28 Celsius
```

### <a id="close-method">close(*[callback]*)</a>

This method closes the opening network port and restores the `EchonetLite` object to the state immediately after it was newly created. If your task has been completed, it is encouraged to call this method. If you don't call this method, your script will never terminates because the network port is still active.

Once this method is called, the `EchonetLite` object does not work anymore as it is. If you want to reuse the object, you have to call the [`init()`](#init-method) method again.

The process of this method is asynchronous. If you want to do something sequentially after the process of this method completes, you can pass a callback function to this method as the 1st argument.

```JavaScript
el.close(() => {
  // do something
});
```

---------------------------------------
## <a id="Events">Events</a>

Whenever an ECHONET Lite packet comes or is sent, several events are fired on the `EchonetLite` object. You can listen to events using `on()` method on the `EchonetLite` object. The event listeners must be set after the initialization process by the `init()` method has been completed.

### <a id="notify-event">`notify` event</a>

The `notify` event will be fired whenever any ECHONET Lite packets except the responses for `getPropertyValue()`, `setPropertyValue()`, `getPropertyMaps()`, and `send()` methods was received.

```JavaScript
var EchonetLite = require('node-echonet-lite');
var el = new EchonetLite({'lang': 'ja', 'type': 'lan'});

el.init((err) => {
  if(err) {
    console.log('[ERROR] '+ err.toString());
  } else {
     el.on('notify', (res) => {
       console.log('[NOTIFY] From: ' + res['device']['address'] + ' --------------------------');
       console.log(JSON.stringify(res['message'], null, '  '));
       console.log('');
     });
  }
});
```

When a notification packet is received, the code above will show the result as follows:

```JavaScript
[NOTIFY] From: 192.168.11.17 --------------------------
{
  "tid": 50,
  "seoj": [
    1,
    48,
    1
  ],
  "deoj": [
    14,
    240,
    1
  ],
  "esv": "INF",
  "prop": [
    {
      "epc": 128,
      "edt": {
        "status": false
      },
      "buffer": {
        "type": "Buffer",
        "data": [
          49
        ]
      }
    }
  ]
}
```

An [`Response`](#Response-object) object is passed to the callback function as the 1st argument.

### <a id="data-event">`data` event</a>

The `data` event will be fired whenever any ECHONET Lite packet was received.

```JavaScript
var EchonetLite = require('node-echonet-lite');
var el = new EchonetLite({'lang': 'ja', 'type': 'lan'});

el.init((err) => {
  if(err) {
    console.log('[ERROR] '+ err.toString());
  } else {
    el.startDiscovery((err, res) => {
      el.stopDiscovery();
      if(err) {
        console.log('[ERROR] '+ err.toString());
        process.exit();
      } else {
        getPropertyMaps(res['device']);
      }
    });
    el.on('data', (res) => {
      console.log('[RECEIVE] ---------------------------------------');
      console.log(JSON.stringify(res['message'], null, '  '));
      console.log('');
    });
  }
});
```
An [`Response`](#Response-object) object is passed to the callback function as the 1st argument.


### <a id="sent-event">`sent` event</a>

The `sent` event will be fired whenever any ECHONET Lite packet was sent.

```JavaScript
var EchonetLite = require('node-echonet-lite');
var el = new EchonetLite({'lang': 'ja', 'type': 'lan'});

el.init((err) => {
  if(err) {
    console.log('[ERROR] '+ err.toString());
  } else {
    el.startDiscovery((err, res) => {
      el.stopDiscovery();
      if(err) {
        console.log('[ERROR] '+ err.toString());
        process.exit();
      } else {
        getPropertyMaps(res['device']);
      }
    });
    el.on('sent', (res) => {
      console.log('[SENT] ---------------------------------------');
      console.log(JSON.stringify(res['message'], null, '  '));
      console.log('');
    });
  }
});
```

An [`Response`](#Response-object) object is passed to the callback function as the 1st argument.

### <a id="data-serial-event">`data-serial` event</a>

The `data-serial` event will be fired whenever any data was received from the Wi-SUN USB dongle. This event is mainly used for debugging.

```JavaScript
var EchonetLite = require('node-echonet-lite');
var el = new EchonetLite({
  'lang'   : 'ja',
  'type'   : 'wisunb',
  'adapter': 'bp35a1',
  'path'   : 'COM8',
  'id'     : '0123456789ABCDEF0123456789ABCDEF',
  'pass'   : 'ABCDEFGHIJKL',
  'baud'   : 115200
});

el.init((err) => {
  if(err) {
    console.log('[ERROR] '+ err.toString());
    process.exit();
  } else {
    el.startDiscovery((err, res) => {
      el.stopDiscovery();
      if(err) {
        console.log('[ERROR] '+ err.toString());
        process.exit();
      } else {
        // Do something
      }
    });
    el.on('data-serial', (res) => {
      console.log(res['data']);
    });
    el.on('sent-serial', (res) => {
      console.log('> ' + res['data']);
    });
  }
});
```
An [`Response`](#Response-object) object is passed to the callback function as the 1st argument. Besides, an extra property is added to the object. The message came from the Wi-SUN USB dongle is set to the `data` property in [`Response`](#Response-object) object. Though text data and binary data are mixed in a message between this module and the Wi-SUN USB dongle, the part of binary is converted to hexadecimal representation.

The sample code prints the results as follows:

```
> SKSENDTO 1 FE80:0000:0000:0000:0000:0000:0000:0000 0E1A 2 000E 1081001A05FF0102880162019E00

EVENT 21 FE80:0000:0000:0000:0000:0000:0000:0000 00
OK

ERXUDP FE80:0000:0000:0000:0000:0000:0000:0000 FE80:0000:0000:0000:0000:0000:0000:0001 0E1A 0E1A 001C64000334809F 1 0012 1081001A02880105FF0172019E040381E5ED

> SKSENDTO 1 FE80:0000:0000:0000:0000:0000:0000:0000 0E1A 2 000E 1081001B05FF0102880162019F00

EVENT 21 FE80:0000:0000:0000:0000:0000:0000:0000 00
OK
```

### <a id="sent-serial-event">`sent-serial` event</a>

The `send-serial` event will be fired whenever any data was sent to the Wi-SUN USB dongle. This event is mainly used for debugging.

See the previous section for details.

---------------------------------------
## <a id="Objects">Objects</a>

### <a id="Response-object">`Response` object</a>

The `Response` object represents an ECHONET Lite packet coming from an ECHONET Lite device. It is passed to the callback function for the [`getPropertyMaps()` method](#getPropertyMaps-method), the [`getPropertyValue()` method](#getPropertyValue-method), the [`setPropertyValue()` method](#setPropertyValue-method) as the 2nd argument. Besides, it is passed to the callback function for an [event](#Events) handler as the 1st argument.

This object consists of the properties as follows:

Property      | Type    | Description
:-------------|:--------|:-----------
`device`      | [`Device`](#Device-object)  | See the section "[`Device` object](#Device-object)".
`message`     | [`Message`](#Message-object) | See the section "[`Message` object](#Message-object)".
`buffer`      | Buffer  | This Buffer object represents a whole extent of the ECHONET Lite packet.
`hex`         | Array   | This array represents a whole extent of the telegram. Each element in the array is an hexadecimal representation of each byte.
`formatted`   | String  | This is a formatted text representing the analysis result of the ECHONET Lite packet. See the section "[Monitoring ECHONET Lite packets](#Monitoring-ECHONET-Lite-packets)" for details.
`lang`        | String  | The language of the formatted text provided by the `formatted` property. This value is either `en` (English) or `ja` (Japanese).
`structure`   | Array   | This array is used for debugging. You probably don't need this array. If you need to investigate ECHONET Lite packets, the `formatted` property would be more useful. If you are interested in this array, you can see the structure using `console.dir()`.

### <a id="Device-object">`Device` object</a>

The `Device` object represents the device relevant to the ECHONET Lite packet. If the packet is received one, this object represents the source device of the packet. If the packet is transmitted one, this object represents the destination device of the packet.

This object consists of the properties as follows:

Property      | Type    | Description
:-------------|:--------|:-----------
`address`     | String  | IP address of the device.
`eoj`         | Array   | A list of EOJ supported by the device. This property is available only in the discovery process.

### <a id="Message-object">`Message` object</a>

The `Message` object represents the summary of the ECHONET Lite packet. This object is the most useful in the [`Response`](#Response-object) object for you.

This object consists of the properties as follows:

Property      | Type    | Description
:-------------|:--------|:-----------
`tid`         | Number  | The Transaction ID in the ECHONET Lite packet.
`seoj`        | Array   | The SEOJ in the ECHONET Lite packet. The array consists of three numbers: Class Group code, Class code, and Instance code.
`deoj`        | Array   | The DEOJ in the ECHONET Lite packet. The array consists of three numbers: Class Group code, Class code, and Instance code.
`esv`         | String  | The ESV in the ECHONET Lite packet. This value is a symbol. Note that this value is not a ESV code.
`prop`        | Array   | A list of the [`Prop`](#Prop-object) object.
`data`        | Object  | This object includes information which this module converted the value of `prop` object for you so that you can handle the packet easily. This property exists only in the `Response` objects derived from the [`getPropertyMaps()`](#getPropertyMaps-method) method and [`getPropertyValue()`](#getPropertyValue-method) method. See the descriptions for the methods for details.

### <a id="Prop-object">`Prop` object</a>

The `Prop` object represents a set of the EPC and the EDT in the ECHONET Lite packet.

This object consists of the properties as follows:

Property      | Type    | Description
:-------------|:--------|:-----------
`epc`         | Number  | The EPC.
`edt`         | [`EDT`](#EDT-object)   | The EDT
`buffer`      | Buffer  | The Buffer object representing the EDT.

If the EPC is supported by this module, the EDT in the ECHONET Lite packet is parsed so that you can treat it easily, then the [`EDT`](#EDT-object) object is set as the value of the `edt` property. If the EPC is unknown to this module, the value of the `edt` property is null. In both cases, the `Prop` object has the `buffer` property, the value is a Buffer object representing the part of EDT in the ECHONET Lite packet. You can parse it by yourself even if the EPC is unknown to this module. See the section "[How to handle unknown EPCs](#How-to-handle-unknown-EPCs)" for details.

### <a id="EDT-object">`EDT` object</a>

The `EDT` object represents the answer for your query from the targeted device. Though this object is just a hash object, the structure depends on the EPC which you requested.

The `EDT` object has several properties dedicated for the EPC. For example, if the EPC is `0xBA` for the home air conditioner class (Class Group code: `0x01`, Class code: `0x03`), it means "Measured value of room relative humidity", then the structure of the `EDT` object will be as follows:

```
{ 'humidity': 55 }
```

If the EPC is `0xE7` for the low-voltage smart electric energy meter class (Class Group code: `0x02`, Class code: `0x88`), it means "Measured instantaneous electric energy", then the structure of the `EDT` object will be as follows:

```
{ 'energy': 794 }
```

See the section "[Supported EPCs](#Supported-EPCs)" for details.

---------------------------------------
## <a id="Supported-EPCs">Supported EPCs</a>

This module supports the Classes specified in the ECHONET Lite specification as follows:

* [Super Class Group (Class Group code: N/A)](EDT-FF.md)
  * [Device Object Super Class (Class code: N/A)](EDT-FF.md#class-00)
* [Sensor-related Device Class Group (Class Group code: `0x00`)](EDT-00.md)
  * [Temperature sensor class (Class code: `0x11`)](EDT-00.md#class-11)
  * [Humidity sensor class (Class code: `0x12`)](EDT-00.md#class-12)
  * [Electric energy sensor class (Class code: `0x22`)](EDT-00.md#class-22)
  * [Air pressure sensor class (Class code: `0x2D`)](EDT-00.md#class-2D)
* [Air Conditioner-related Device Class Group (Class Group code: `0x01`)](EDT-01.md)
  * [Home air conditioner class (Class code: `0x30`)](EDT-01.md#class-30)
  * [Air cleaner class (Class code: `0x35`)](EDT-01.md#class-35)
* [Housing/Facilities-related Device Class Group (Class Group code: `0x02`)](EDT-02.md)
  * [Electrically operated blind/shade class (Class code: `0x60`)](EDT-02.md#class-60)
  * [Electrically operated rain sliding door/shutter class (Class code: `0x63`)](EDT-02.md#class-63)
  * [Electric lock class (Class code: `0x6F`)](EDT-02.md#class-6F)
  * [Instantaneous water heater class (Class code: `0x72`)](EDT-02.md#class-72)
  * [Power distribution board metering class (Class code: `0x87`)](EDT-02.md#class-87)
  * [Low-voltage smart electric energy meter class (Class code: `0x88`)](EDT-02.md#class-88)
  * [General lighting class (Class code: `0x90`)](EDT-02.md#class-90)
* [Cooking/Household-related Device Class Group (Class Group code: `0x03`)](EDT-03.md)
  * [Combination microwave oven(Electronic oven) class (Class code: `0xB8`)](EDT-03.md#class-B8)
* [Profile class Group (Class Group Code: `0x0E`)](EDT-0E.md)
  * [Profile Object Super Class (Class code: N/A)](EDT-0E.md#class-00)
  * [Node Profile Class (Class code: `0xF0`)](EDT-0E.md#class-F0)

You can find the detailed information about each [`EDT`](#EDT-object) object in the document related to the class above.

---------------------------------------
## <a id="Monitoring-ECHONET-Lite-packets">Monitoring ECHONET Lite packets</a>

In order to debug you scripts, You would monitor ECHONET packets in detail. The node-echonet-lite module provides you with formatted text as a result of packet analysis.

As described above, the `formatted` property is implemented in the [`Response`](#Response-object). Using the value of the `formatted` property and the event listening mechanism, you can monitor results of packet analysis in real time.

The sample code below shows how to code a ECHONET packet analyzer. The [`data`](#data-event) event and the [`sent`](#sent-event) event fired on the `EchonetLite` object are listened, then the formatted text derived from the [`Response`](#Response-object) object is output.

```JavaScript
var EchonetLite = require('node-echonet-lite');
var el = new EchonetLite({'lang': 'en', 'type': 'lan'});

el.init((err) => {
  if(err) {
    console.log('[ERROR] '+ err.toString());
    process.exit();
  } else {
    el.startDiscovery((err, res) => {
      el.stopDiscovery();
      if(err) {
        console.log('[ERROR] '+ err.toString());
        process.exit();
      } else {
        // Do something
      }
    });
    el.on('data', (res) => {
      console.log(createLine('='));
      console.log('[RECV] from ' + res['device']['address']);
      console.log(createLine('-'));
      console.log(res['formatted']);
      console.log('');
    });
    el.on('sent', (res) => {
      console.log(createLine('='));
      console.log('[SENT] to ' + res['device']['address']);
      console.log(createLine('-'));
      console.log(res['formatted']);
      console.log('');
    });
  }
});

function createLine(char) {
  var len = process.stdout.columns - 1;
  var line = '';
  for(var i=0; i<len; i++) {
    line += char;
  }
  return line;
}
```

The sample code above will output the result like this if the language is set to `en` (default):

```
==================================================================================================
[SENT] to 224.0.23.0
--------------------------------------------------------------------------------------------------
- EHD1      |ECHONET Lite message header 1   |10   |Conventional ECHONET Lite Specification
- EHD2      |ECHONET Lite message header 2   |81   |Format 1 (specified message format)
- TID       |Transaction ID                  |00 01|1
- SEOJ      |Source ECHONET Lite object spe..|05 ..|05 FF 01
  - SEOJX1  |Source class group code         |05   |Management/control-related device class group
  - SEOJX2  |Source class code               |FF   |Controller class
  - SEOJX3  |Source instance code            |01   |1
- DEOJ      |Destination ECHONET Lite objec..|0E ..|0E F0 00
  - DEOJX1  |Destination class group code    |0E   |Profile class group
  - DEOJX2  |Destination class code          |F0   |Node profile class
  - DEOJX3  |Destination instance code       |00   |0
- DEOJX3    |Destination instance code       |00   |0
- ESV       |ECHONET Lite service            |62   |Property value read request (Get)
- OPC       |Number of processing properties |01   |1
- EPC0      |ECHONET Lite Property           |D6   |Self-node instance list S
- PDC0      |Property data counter           |00   |00

==================================================================================================
[RECV] from 192.168.10.11
--------------------------------------------------------------------------------------------------
- EHD1      |ECHONET Lite message header 1   |10   |Conventional ECHONET Lite Specification
- EHD2      |ECHONET Lite message header 2   |81   |Format 1 (specified message format)
- TID       |Transaction ID                  |00 01|1
- SEOJ      |Source ECHONET Lite object spe..|05 ..|05 FF 01
  - SEOJX1  |Source class group code         |05   |Management/control-related device class group
  - SEOJX2  |Source class code               |FF   |Controller class
  - SEOJX3  |Source instance code            |01   |1
- DEOJ      |Destination ECHONET Lite objec..|0E ..|0E F0 00
  - DEOJX1  |Destination class group code    |0E   |Profile class group
  - DEOJX2  |Destination class code          |F0   |Node profile class
  - DEOJX3  |Destination instance code       |00   |0
- DEOJX3    |Destination instance code       |00   |0
- ESV       |ECHONET Lite service            |62   |Property value read request (Get)
- OPC       |Number of processing properties |01   |1
- EPC0      |ECHONET Lite Property           |D6   |Self-node instance list S
- PDC0      |Property data counter           |00   |00

==================================================================================================
[RECV] from 192.168.10.15
--------------------------------------------------------------------------------------------------
- EHD1      |ECHONET Lite message header 1   |10   |Conventional ECHONET Lite Specification
- EHD2      |ECHONET Lite message header 2   |81   |Format 1 (specified message format)
- TID       |Transaction ID                  |00 01|1
- SEOJ      |Source ECHONET Lite object spe..|0E ..|0E F0 01
  - SEOJX1  |Source class group code         |0E   |Profile class group
  - SEOJX2  |Source class code               |F0   |Node profile class
  - SEOJX3  |Source instance code            |01   |1
- DEOJ      |Destination ECHONET Lite objec..|05 ..|05 FF 01
  - DEOJX1  |Destination class group code    |05   |Management/control-related device class group
  - DEOJX2  |Destination class code          |FF   |Controller class
  - DEOJX3  |Destination instance code       |01   |1
- DEOJX3    |Destination instance code       |01   |1
- ESV       |ECHONET Lite service            |72   |Property value read response (Get_Res)
- OPC       |Number of processing properties |01   |1
- EPC0      |ECHONET Lite Property           |D6   |Self-node instance list S
- PDC0      |Property data counter           |04   |04
- EDT0      |Property value data             |01 ..|01 01 30 01
  - NUM     |Total number of instances       |01   |1
  - EOJ     |ECHONET Lite object specificat..|01 ..|01 30 01
    - EOJX1 |Class group code                |01   |Air conditioner-related device class group
    - EOJX2 |Class code                      |30   |Home air conditioner class
    - EOJX3 |Instance code                   |01   |1
```

The sample code above will output the result like this if the language is set to `ja`:

```
==================================================================================================
[SENT] to 224.0.23.0
--------------------------------------------------------------------------------------------------
- EHD1      |ECHONET Lite電文ヘッダー1       |10   |ECHONET Lite規格
- EHD2      |ECHONET Lite電文ヘッダー2       |81   |形式 1（規定電文形式）
- TID       |トランザクションID              |00 01|1
- SEOJ      |送信元ECHONET Liteオブジェクト..|05 ..|05 FF 01
  - SEOJX1  |送信元クラスグループコード      |05   |管理・操作関連機器クラスグループ
  - SEOJX2  |送信元クラスコード              |FF   |コントローラ
  - SEOJX3  |送信元インスタンスコード        |01   |1
- DEOJ      |相手先ECHONET Liteオブジェクト..|0E ..|0E F0 00
  - DEOJX1  |相手先クラスグループコード      |0E   |プロファイルクラスグループ
  - DEOJX2  |相手先クラスコード              |F0   |ノードプロファイル
  - DEOJX3  |相手先インスタンスコード        |00   |0
- DEOJX3    |相手先インスタンスコード        |00   |0
- ESV       |ECHONET Liteサービス            |62   |プロパティ値読み出し要求(Get)
- OPC       |処理プロパティ数                |01   |1
- EPC0      |ECHONET Liteプロパティ          |D6   |自ノードインスタンスリスト S
- PDC0      |EDTのバイト数                   |00   |00

==================================================================================================
[RECV] from 192.168.10.11
--------------------------------------------------------------------------------------------------
- EHD1      |ECHONET Lite電文ヘッダー1       |10   |ECHONET Lite規格
- EHD2      |ECHONET Lite電文ヘッダー2       |81   |形式 1（規定電文形式）
- TID       |トランザクションID              |00 01|1
- SEOJ      |送信元ECHONET Liteオブジェクト..|05 ..|05 FF 01
  - SEOJX1  |送信元クラスグループコード      |05   |管理・操作関連機器クラスグループ
  - SEOJX2  |送信元クラスコード              |FF   |コントローラ
  - SEOJX3  |送信元インスタンスコード        |01   |1
- DEOJ      |相手先ECHONET Liteオブジェクト..|0E ..|0E F0 00
  - DEOJX1  |相手先クラスグループコード      |0E   |プロファイルクラスグループ
  - DEOJX2  |相手先クラスコード              |F0   |ノードプロファイル
  - DEOJX3  |相手先インスタンスコード        |00   |0
- DEOJX3    |相手先インスタンスコード        |00   |0
- ESV       |ECHONET Liteサービス            |62   |プロパティ値読み出し要求(Get)
- OPC       |処理プロパティ数                |01   |1
- EPC0      |ECHONET Liteプロパティ          |D6   |自ノードインスタンスリスト S
- PDC0      |EDTのバイト数                   |00   |00

==================================================================================================
[RECV] from 192.168.10.15
--------------------------------------------------------------------------------------------------
- EHD1      |ECHONET Lite電文ヘッダー1       |10   |ECHONET Lite規格
- EHD2      |ECHONET Lite電文ヘッダー2       |81   |形式 1（規定電文形式）
- TID       |トランザクションID              |00 01|1
- SEOJ      |送信元ECHONET Liteオブジェクト..|0E ..|0E F0 01
  - SEOJX1  |送信元クラスグループコード      |0E   |プロファイルクラスグループ
  - SEOJX2  |送信元クラスコード              |F0   |ノードプロファイル
  - SEOJX3  |送信元インスタンスコード        |01   |1
- DEOJ      |相手先ECHONET Liteオブジェクト..|05 ..|05 FF 01
  - DEOJX1  |相手先クラスグループコード      |05   |管理・操作関連機器クラスグループ
  - DEOJX2  |相手先クラスコード              |FF   |コントローラ
  - DEOJX3  |相手先インスタンスコード        |01   |1
- DEOJX3    |相手先インスタンスコード        |01   |1
- ESV       |ECHONET Liteサービス            |72   |プロパティ値読み出し応答(Get_Res)
- OPC       |処理プロパティ数                |01   |1
- EPC0      |ECHONET Liteプロパティ          |D6   |自ノードインスタンスリスト S
- PDC0      |EDTのバイト数                   |04   |04
- EDT0      |プロパティ値データ              |01 ..|01 01 30 01
  - NUM     |インスタンス総数                |01   |1
  - EOJ     |ECHONET Liteオブジェクト指定    |01 ..|01 30 01
    - EOJX1 |クラスグループコード            |01   |空調関連機器クラスグループ
    - EOJX2 |クラスコード                    |30   |家庭用エアコン
    - EOJX3 |インスタンスコード              |01   |1
```

---------------------------------------
## <a id="How-to-handle-unknown-EPCs">How to handle unknown EPCs</a>

Even if the EPC you want to treat is not supported by the node-echonet-lite module, you can get the `Buffer` object representing the relevant EDT. Once you get the `Buffer` object, you can parse it by yourself according to [the APPENDIX of the ECHONET Lite specification](http://echonet.jp/spec_object_rf_en/).

The sample code shows how to parse an Unknown EDT. In this code, the EDT for EPC `0xB0` of the home air conditioner class (Operation mode setting) is parsed. However it is actually supported by this module, so you don't need to parse it by yourself. Note that this sample code is just for explanation.

```JavaScript
var EchonetLite = require('node-echonet-lite');
var el = new EchonetLite({'type': 'lan'});

// Initialize the EchonetLite object
el.init((err) => {
  // Start to discover Echonet Lite devices
  el.startDiscovery((err, res) => {
    // Determine the type of the found device
    var device = res['device'];
    var address = device['address'];
    var eoj = device['eoj'][0];
    var group_code = eoj[0]; // Class group code
    var class_code = eoj[1]; // Class code
    // This means that the found device belongs to the home air conditioner class
    if(group_code === 0x01 && class_code === 0x30) {
      // Stop to discovery process
      el.stopDiscovery();
      // Get the property value (Operation mode setting)
      el.getPropertyValue(address, eoj, 0xB0, (err, res) => {
        var prop_list = res['message']['prop'];
        for(var i=0; i<prop_list.length; i++) {
          var prop = prop_list[i]; // The Prop object
          if(prop['epc'] === 0xB0) {
            // Parse the EDT for EPC 0xB0
            var mode = parseTempEdt(prop['buffer']);
            console.log(mode);
            break;
          }
        }
        process.exit();
      });
    }
  });
});

// Parse the EDT for EPC 0xB0 (Operation mode setting).
// You can find the specification for the EDT for EPC 0xB0
// in the APPENDIX of the ECHONET Lite specification P3-76
// (PDF page number: 96).
function parseTempEdt(buf) {
  // The data size of the EDT is 1 byte and the type is signed char.
  var v = buf.readUInt8(buf);
  // The meaning of each value is described in the spec.
  var mode = '';
  if(v === 0x41) {
    return 'Automatic';
  } else if(v === 0x42) {
    return 'Cooling';
  } else if(v === 0x43) {
    return 'Heating';
  } else if(v === 0x44) {
    return 'Dehumidification';
  } else if(v === 0x45) {
    return 'Air circulator';
  } else {
    return 'Unknown';
  }
}
```

---------------------------------------
## <a id="Release-Note">Release Note</a>

* v0.5.1 (2019-10-22)
  * Added a workaround for WSL (Windows Subsystem for Linux).
    * Added the `membership` parameter on the [`EchinetLite`](#Constructor) constructor.

* v0.5.0 (2019-10-06)
  * Added the EPC parsers as follows:
    * [Electrically operated rain sliding door/shutter class (Class code: 02-63)](EDT-02.md#class-63)
    * [Instantaneous water heater class (Class code: 02-72)](EDT-02.md#class-72)
    * [Power distribution board metering class (Class code: 02-87)](EDT-02.md#class-87)
    * [Combination microwave oven (Electronic oven) class (Class code: 03-B8)](EDT-03.md#class-B8)

* v0.4.0 (2018-06-27)
  * Added the `name` property in the response of [EPC 0E-F0-83](EDT-0E.md#EPC-0E-F0-83) (Super Class Group, Device Object Super Class, Identification number), which mean the manufacturer name.

* v0.3.0 (2018-06-24)
  * Added the EPC parsers as follows:
    * [Air cleaner class (Class code: 01-35)](EDT-01.md#class-35)
    * [Electrically operated blind/shade class (Class code: 02-60)](EDT-02.md#class-60)
    * [Electric lock class (Class code: 02-6F)](EDT-02.md#class-6F)

* v0.2.3 (2018-06-21)
  * Rewrote the deprecated old-fashioned codes related to the [`Buffer`](https://nodejs.org/api/buffer.html) to the new style. Now no warning message will be shown on the shell using node v10.

* v0.2.2 (2018-04-25)
  * Improved the device discovery. In this version, all available network interfaces are joined to a multicast group, so that all ECHONET Lite devices in the local network are sure to be discovered.
  * Implemented the parameter `netif` for specifying a network interface in the `EchonetLite` constructor.

* v0.2.1 (2018-04-01)
  * Improved the device discovery. The previous version could not discover some ECHONET Lite devices if the `startDiscovery()` method was called more than once.

* v0.2.0 (2017-12-15)
  * Added the EPC parsers as follows:
    * [Electric energy sensor class (Class code: 00-22)](EDT-00.md#class-22)
    * [General lighting class (Class code: 02-90)](EDT-02.md#class-90)
  * Improved the discovery processs

* v0.1.0 (2017-07-17)
  * The Wi-SUN USB dongle "ROHM BP35C2" ([English](http://www.rohm.com/web/global/products/-/product/BP35C2) / [Japanese](http://www.rohm.co.jp/web/japan/products/-/product/BP35C2)) is now supported.
  * Fixed a bug of the active scan in the Wi-SUN mode.
  * Fixed a bug of the packet parser for the Wi-SUN USB dongle "RL7023 Stick-D/DSS".
  * Fixed a bug of the `setTimeout()` handling in the Wi-SUN mode.

---------------------------------------
## <a id="License">License</a>

The MIT License (MIT)

Copyright (c) 2016 - 2019 Futomi Hatano

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
