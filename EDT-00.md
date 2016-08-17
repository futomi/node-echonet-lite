The `EDT` object specification for the node-echonet-lite
===============

## Sensor-related Device Class Group
* Class group code: `0x00`

The node-echonet-lite module support the classes in this class group as follows:

* [Temperature sensor class (Class code: `0x11`)](#class-11)
* [Humidity sensor class (Class code: `0x12`)](#class-12)
* [Air pressure sensor class (Class code: `0x2D`)](#class-2D)

---------------------------------------
### <a name="class-11">Temperature sensor class</a>
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
### <a name="class-12">Humidity sensor class</a>
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
### <a name="class-2D">Air pressure sensor class</a>
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
