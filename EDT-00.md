The `EDT` object specification for the node-echonet-lite
===============

## Sensor-related Device Class Group
* Class group code: `0x00`

The node-echonet-lite module support the classes in this class group as follows:

* [Temperature sensor class (Class code: `0x11`)](#class-11)
* [Humidity sensor class (Class code: `0x12`)](#class-12)
* [Electric energy sensor class (Class code: `0x22`)](#class-22)
* [Air pressure sensor class (Class code: `0x2D`)](#class-2D)

---------------------------------------
### <a id="class-11">Temperature sensor class</a>
* Class group code: `0x00`
* Class code: `0x11`

#### Operation status
* EPC: `0x80`

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | This property indicates the ON/OFF status. If the ON/OFF status is ON, this value is `true`, otherwise `false`.

#### Measured temperature value
* EPC: `0xE0`

Property      | Type    | Description
:-------------|:--------|:-----------
`temperature` | Number  | This property indicates the measured temperature value. The temperature in units of Celsius.

---------------------------------------
### <a id="class-12">Humidity sensor class</a>
* Class group code: `0x00`
* Class code: `0x12`

#### Operation status
* EPC: `0x80`

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | This property indicates the ON/OFF status. If the ON/OFF status is ON, this value is `true`, otherwise `false`.

#### Measured value of relative humidity
* EPC: `0xE0`

Property      | Type    | Description
:-------------|:--------|:-----------
`humidity`    | Number  | This property indicates measured value of relative humidity in %.

---------------------------------------
### <a id="class-22">Electric energy sensor class</a>
* Class group code: `0x00`
* Class code: `0x22`

#### Operation status
* EPC: `0x80`

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | This property indicates the ON/OFF status. If the ON/OFF status is ON, this value is `true`, otherwise `false`.

#### Cumulative amounts ofelectric energy
* EPC: `0xE0`

Property      | Type    | Description
:-------------|:--------|:-----------
`energy`      | Number  | This property indicates cumulative amounts of electric energy in 0.001kWh.

#### Medium-capacity sensor instantaneous electric energy
* EPC: `0xE1`

Property      | Type    | Description
:-------------|:--------|:-----------
`energy`      | Number  | This property indicates measured instantaneous electric energy in watts.

#### Small-capacity sensor instantaneous electric energy
* EPC: `0xE2`

Property      | Type    | Description
:-------------|:--------|:-----------
`energy`      | Number  | This property indicates instantaneous electric energy in units of 0.1 W.

#### Large-capacity sensor instantaneous electric energy
* EPC: `0xE3`

Property      | Type    | Description
:-------------|:--------|:-----------
`energy`      | Number  | This property indicates instantaneous electric energy in units of 0.1 kW.

#### Cumulative amounts of electric energy measurement log
* EPC: `0xE4`

Property      | Type    | Description
:-------------|:--------|:-----------
`log`         | Array   | This property indicates measurement result log of cumulative amounts of electric energy (0.001kWh) for the past 24 hours in 30-minute sections.

#### Effective voltage value
* EPC: `0xE5`

Property      | Type    | Description
:-------------|:--------|:-----------
`voltage`     | Number  | This property indicates effective voltage value in volts.

---------------------------------------
### <a id="class-2D">Air pressure sensor class</a>
* Class group code: `0x00`
* Class code: `0x2D`

#### Operation status
* EPC: `0x80`

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | This property indicates the ON/OFF status. If the ON/OFF status is ON, this value is `true`, otherwise `false`.

#### Air pressure measurement
* EPC: `0xE0`

Property      | Type    | Description
:-------------|:--------|:-----------
`pressure`    | Number  | This property indicates air pressure measurements in units of hPa.
