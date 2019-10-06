The `EDT` object specification for the node-echonet-lite
===============

## Super Class Group
* Class group code: N/A

The node-echonet-lite module support the classes in this class group as follows:

* [Device Object Super Class (Class code: N/A)](#class-00)

---------------------------------------
### <a id="class-00">Device Object Super Class</a>
* Class group code: N/A
* Class code: N/A

#### Operation status
* EPC: `0x80`

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | This property indicates the ON/OFF status. If the ON/OFF status is ON, this value is `true`, otherwise `false`.

#### Installation location
* EPC: `0x81`

Property      | Type    | Description
:-------------|:--------|:-----------
`code`        | Number  | This property indicates the installation location as a code. See the description below for details.
`desc`        | String  | The installation location.

The location code map is as follow. Each code is shown as binary representation:

Code      | Location (English)     | Location (Japanese)
:---------|:-----------------------|:-------------------
`0b00001` | Living room            | 居間、リビング
`0b00010` | Dining room            | 食堂、ダイニング
`0b00011` | Kitchen                | 台所、キッチン
`0b00100` | Bathroom               | 浴室、バス
`0b00101` | Lavatory               | トイレ
`0b00110` | Washroom/changing room | 洗面所、脱衣所
`0b00111` | Passageway             | 廊下
`0b01000` | Room                   | 部屋
`0b01001` | Stairway               | 階段
`0b01010` | Front door             | 玄関
`0b01011` | Storeroom              | 納戸
`0b01100` | Garden/perimeter       | 庭、外周
`0b01101` | Garage                 | 車庫
`0b01110` | Veranda/balcony        | ベランダ、バルコニー
`0b01111` | Others                 | その他

If you only read this `EDT` object, you don't need to know the code map above. It is enough to see the value of the `desc` property.

If you want to create an ECHONET Lite packet to send, the `desc` property is not required.

#### Standard version information
* EPC: `0x82`

Property      | Type    | Description
:-------------|:--------|:-----------
`release`     | String  | This property indicates the release number of the corresponding Appendix. This value will be an uppercase alphabet (e.g. "H").

The value of `release` must be an ASCII character.

#### Identification number
* EPC: `0x83`

Property      | Type    | Description
:-------------|:--------|:-----------
`code`        | Number  | This property indicates the manufacturer code as an integer.
`uid`         | String  | This property indicates the unique ID defined by the manufacturer as hexadecimal representation.

The value of the `code` property must be an integer in the range of `0x000000` to `0xFFFFFF`. The byte length of the value of the `uid` property must be equal to or less than 13 bytes.

```
{
  `code`: 0x000008,
  `uid` : '0102030405060708090A0B0C0D'
}
```

#### Measured instantaneous power consumption
* EPC: `0x84`

Property      | Type    | Description
:-------------|:--------|:-----------
`power`       | Number  | This property indicates the instantaneous power consumption of the device in watts (W).

The value of the `power` property must be an integer in the range of 0 to 65533 (W).

#### Measured cumulative power consumption
* EPC: `0x85`

Property      | Type    | Description
:-------------|:--------|:-----------
`power`       | Number  | This property indicates the cumulative power consumption of the device in units of kWh.

The value of the `power` property must be an float in the range of 0 to 999,999.999 (kWh).

#### Manufacturer's fault code
* EPC: `0x86`

Property      | Type    | Description
:-------------|:--------|:-----------
`manufacturer`| Number  | This property indicates the manufacturer code as an integer.
`fault`       | String  | This property indicates the manufacturer-defined fault code as hexadecimal representation.

The value of the `manufacturer` property must be an integer in the range of `0x000000` to `0xFFFFFF`. The byte length of the value of the `fault` property must be equal to or less than 221 bytes.

#### Current limit setting
* EPC: `0x87`

Property      | Type    | Description
:-------------|:--------|:-----------
`limit`       | Number  | This property indicates the current limit setting (0–100%).

The value of the `limit` property must be an integer in the range of 0 to 100 (%).

#### Fault status
* EPC: `0x88`

Property      | Type    | Description
:-------------|:--------|:-----------
`fault`       | Boolean | This property indicates whether a fault has occurred or not. If a fault has occurred, this value is `true`, otherwise `false`.

#### Fault content
* EPC: `0x89`

Property      | Type    | Description
:-------------|:--------|:-----------
`code1`       | Number  | Fault description code (Higher-order byte)
`code2`       | Number  | Fault description code (Lower-order byte)
`desc`        | String  | Fault description

The Fault content is expressed using 2 bytes (`code1` and `code2`).

#### Manufacturer code
* EPC: `0x8A`

Property      | Type    | Description
:-------------|:--------|:-----------
`code`        | Number  | This property indicates the manufacturer code as an integer.

The value of the `code` property must be an integer in the range of `0x000000` to `0xFFFFFF`.

#### Business facility code
* EPC: `0x8B`

Property      | Type    | Description
:-------------|:--------|:-----------
`code`        | Number  | This property indicates the 3-byte business facility code defined by each manufacturer.

The value of the `code` property must be an integer in the range of `0x000000` to `0xFFFFFF`.

#### Product code
* EPC: `0x8C`

Property      | Type    | Description
:-------------|:--------|:-----------
`code`        | String  | This property indicates the product code defined by each manufacturer.

The value of the `code` property must be an ASCII text. The number of characters is equal to or less than 12.

#### Production number
* EPC: `0x8D`

Property      | Type    | Description
:-------------|:--------|:-----------
`number`      | String  | This property indicates the production number defined by each manufacturer.

The value of the `code` property must be an ASCII text. The number of characters is equal to or less than 12.

#### Production date
* EPC: `0x8E`

Property      | Type    | Description
:-------------|:--------|:-----------
`date`        | String  | This property indicates the production date in the "YYYY-MM-DD" format.

#### Power-saving operation setting
* EPC: `0x8F`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Boolean | This property indicates whether the device is operating in power-saving mode. If in power-saving mode, this value is `true`, otherwise `false`.

#### Remote control setting
* EPC: `0x93`

Property      | Type    | Description
:-------------|:--------|:-----------
`code`        | Number  | This property indicates whether remote control is through a public network or not as a code.
`desc`        | String  | The description of the code.

The value of `code` must be either `0x41`, `0x42`, `0x61`, or `0x62`. The code map is as follow. Each code is shown as hexadecimal representation:

Code      | Description (English)                       | Description (Japanese)
:---------|:--------------------------------------------|:-------------------
`0x41`    | Remote control not through a public network | 公衆回線未経由操作
`0x42`    | Remote control through a public network     | 公衆回線経由操作
`0x61`    | Remote control is now allowed               | 公衆回線経由の操作不可
`0x62`    | Remote control is allowed                   | 公衆回線経由の操作可能

If you only read this `EDT` object, you don't need to know the code map above. It is enough to see the value of the `desc` property.

If you want to create an ECHONET Lite packet to send, the `desc` property is not required.

#### Current time setting
* EPC: `0x97`

Property      | Type    | Description
:-------------|:--------|:-----------
`hm`          | String  | This property indicates the current time ("HH:MM" format).

#### Current date setting
* EPC: `0x98`

Property      | Type    | Description
:-------------|:--------|:-----------
`ymd`         | String  | This property indicates the current date ("YYYY-MM-DD" format).

#### Power limit setting
* EPC: `0x99`

Property      | Type    | Description
:-------------|:--------|:-----------
`limit`       | Number  | This property indicates the power limit setting in watts (W).

The value of the `limit` property must be a integer in the range of 0 to 65535 (W).

#### Cumulative operating time
* EPC: `0x9A`

This property indicates the cumulative number of days, hours, minutes or seconds for which the device has operated, using 1 byte for the unit and 4 bytes for the time.

Property      | Type    | Description
:-------------|:--------|:-----------
`unit`        | Number  | This property indicates the unit code.
`elapsed`     | Number  | This property indicates the cumulative operating time.

The value of `unit` must be an integer 1, 2, 3, or 4. The code map is as follow. Each code is shown as decimal representation:

Code      | Unit (English) | Unit (Japanese)
:---------|:---------------|:---------------
`1`       | Second         | 秒
`2`       | Minute         | 分
`3`       | Hour           | 時
`4`       | Day            | 日

The value of `elapsed` must be an integer in the range of 0 to 4294967295 (`0xFFFFFFFF`).

If the value of the `unit` is 3 and the value of the `elapsed` is 23, the cumulative operating time is 23 hours.

#### SetM property map
* EPC: `0x9B`

Property      | Type    | Description
:-------------|:--------|:-----------
`list`        | Array   | This property indicates a list of EPCs which the device supports as SetM.

#### GetM property map
* EPC: `0x9C`

Property      | Type    | Description
:-------------|:--------|:-----------
`list`        | Array   | This property indicates a list of EPCs which the device supports as GetM.

#### Status change announcement property map
* EPC: `0x9D`

Property      | Type    | Description
:-------------|:--------|:-----------
`list`        | Array   | This property indicates a list of EPCs which the device supports as Status change announcement.

#### Set property map
* EPC: `0x9E`

Property      | Type    | Description
:-------------|:--------|:-----------
`list`        | Array   | This property indicates a list of EPCs which the device supports as Set.

#### Get property map
* EPC: `0x9F`

Property      | Type    | Description
:-------------|:--------|:-----------
`list`        | Array   | This property indicates a list of EPCs which the device supports as Get.
