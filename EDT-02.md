The `EDT` object specification for the node-echonet-lite
===============

## Housing/Facilities-related Device Class Group
* Class group code: `0x02`

The node-echonet-lite module support the classes in this class group as follows:

* [Electrically operated blind/shade class (Class code: `0x60`)](#class-60)
* [Electrically operated rain sliding door/shutter class (Class code: `0x63`)](#class-63)
* [Electric lock class (Class code: `0x6F`)](#class-6F)
* [Instantaneous water heater class (Class code: `0x72`)](#class-72)
* [Power distribution board metering class (Class code: `0x87`)](#class-87)
* [Low-voltage smart electric energy meter class (Class code: `0x88`)](#class-88)
* [General lighting class (Class code: `0x90`)](#class-90)

---------------------------------------
### <a id="class-60">Electrically operated blind/shade class</a>
* Class group code: `0x02`
* Class code: `0x60`

#### Operation status
* EPC: `0x80`

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | This property indicates the ON/OFF status. If the status is "ON", this value is `true`. Otherwise, if it is "OFF", this value is `false`.

#### Fault description (Recoverable faults)
* EPC: `0x89`

Property      | Type    | Description
:-------------|:--------|:-----------
`code`        | Integer | The code of a recoverable fault code.
`desc`        | String  | The description of the fault.

The `code` must be `0`, `4`, `5`, `6`, or `7`. The code map is as follows:

Code   | Description (English)   | Description (Japanese)
:------|:------------------------|:----------------------
`0`    | No fault                | 異常無し
`4`    | Obstacle caught         | 障害物挟込み
`5`    | Recovery from outage    | 停電復帰
`6`    | Time out                | タイムアウト
`7`    | Battery low             | 電池残量低下

#### Timer operation setting
* EPC: `0x90`

Property      | Type    | Description
:-------------|:--------|:-----------
`timer`       | Boolean | This property indicates the Timer operation setting. If the setting is "ON", this value is `true`. Otherwise, `false`.

#### Wind detection status
* EPC: `0xC2`

Property      | Type    | Description
:-------------|:--------|:-----------
`wind`        | Boolean | This property indicates whether wind is detected. If detected, this value is `true`. Otherwise, `false`.

#### Sunlight detection status
* EPC: `0xC3`

Property      | Type    | Description
:-------------|:--------|:-----------
`sunlight`    | Boolean | This property indicates whether sunlight is detected. If detected, this value is `true`. Otherwise, `false`.

#### Opening (extension) speed setting
* EPC: `0xD0`

Property      | Type    | Description
:-------------|:--------|:-----------
`speed`       | Integer | This property specifies the normal opening (extension) speed by levels.

The `speed` must be `1`, `2`, or `3`. The code map is as follows:

Code   | Description (English)   | Description (Japanese)
:------|:------------------------|:----------------------
`1`    | Low                     | 低
`2`    | Medium                  | 中
`3`    | High                    | 高

#### Closing (retraction) speed setting
* EPC: `0xD1`

Property      | Type    | Description
:-------------|:--------|:-----------
`speed`       | Integer | This property specifies the normal closing (retraction) speed by three levels.

The `speed` must be `1`, `2`, or `3`. The code map is as follows:

Code   | Description (English)   | Description (Japanese)
:------|:------------------------|:----------------------
`1`    | Low                     | 低
`2`    | Medium                  | 中
`3`    | High                    | 高

#### Operation time
* EPC: `0xD2`

Property      | Type    | Description
:-------------|:--------|:-----------
`time`        | Integer | This property specifies the operation time in seconds. The value must be an integer in the range of `0` to `253`.

#### Automatic operation setting
* EPC: `0xD4`

Property      | Type    | Description
:-------------|:--------|:-----------
`auto`        | Boolean | This property specifies automatic operation setting. If the status is "ON", this value is `true`. Otherwise, `false`.

#### Open/close (extension/retraction) setting
* EPC: `0xE0`

Property      | Type    | Description
:-------------|:--------|:-----------
`state`       | Integer | This property specifies the Open/close (extension/retraction) setting.

The `state` must be `1`, `2`, or `3`. The code map is as follows:

Code   | Description (English)   | Description (Japanese)
:------|:------------------------|:----------------------
`1`    | Open                    | 開
`2`    | Close                   | 閉
`3`    | Stop                    | 停止

#### Degree-of-opening level
* EPC: `0xE1`

Property      | Type    | Description
:-------------|:--------|:-----------
`level`       | Integer | This property specifies the degree-of-opening level in %, and to acquire the current setting. The value must be an integer in the range of `0` to `100`.

#### Shade angle setting
* EPC: `0xE2`

Property      | Type    | Description
:-------------|:--------|:-----------
`angle`       | Integer | This property specifies the shade angle value in deg, and to acquire the current setting. The value must be an integer in the range of `0` to `180`.

#### Open/close (extension/retraction) speed
* EPC: `0xE3`

Property      | Type    | Description
:-------------|:--------|:-----------
`speed`       | Integer | This property specifies the open/close (extension/retraction) speed, and to acquire the current setting.

The `speed` must be `1`, `2`, or `3`. The code map is as follows:

Code   | Description (English)   | Description (Japanese)
:------|:------------------------|:----------------------
`1`    | Low                     | 低
`2`    | Medium                  | 中
`3`    | High                    | 高

#### Electric lock setting
* EPC: `0xE5`

Property      | Type    | Description
:-------------|:--------|:-----------
`lock`        | Boolean | This property indicates lock or unlock of an electric lock. If locked, this value is `true`. Otherwise, `false`.

#### Operation status
* EPC: `0xE8`

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | This property indicates whether remote operation is permitted or prohibited. If permitted, this value is `true`. Otherwise, `false`.

#### Selective opening (extension) operation setting
* EPC: `0xE9`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Integer | This property sets a stop at a specified value.

The `mode` must be `1`, `2`, `3`, or `4`. The code map is as follows:

Code   | Description (English)               | Description (Japanese)
:------|:------------------------------------|:----------------------
`1`    | Degree-of-setting position: Open    | 開度レベル設定位置開
`2`    | Operation time setting value: Open  | 動作時間設定値開
`3`    | Operation time setting value: Close | 動作時間設定値閉
`4`    | Local setting position              | ローカル設定位置

#### Open/closed (extended/retracted) status
* EPC: `0xEA`

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Integer | This property indicates the open/closed status.

The `status` must be `1`, `2`, `3`, `4`, or `5`. The code map is as follows:

Code   | Description (English) | Description (Japanese)
:------|:----------------------|:----------------------
`1`    | Fully open            | 全開
`2`    | Fully closed          | 全閉
`3`    | Open                  | 開動作中
`4`    | Closed                | 閉動作中
`5`    | Stopped halfway       | 途中停止

#### One-time opening (extension) speed setting
* EPC: `0xEE`

Property      | Type    | Description
:-------------|:--------|:-----------
`speed`       | Integer | This property specifies the speed of single opening operation by three levels.

The `speed` must be `1`, `2`, `3`, or `4`. The code map is as follows:

Code   | Description (English) | Description (Japanese)
:------|:----------------------|:----------------------
`1`    | Low                   | 低
`2`    | Medium                | 中
`3`    | High                  | 高
`4`    | None                  | 無し

#### One-time closing (retraction) speed setting
* EPC: `0xEF`

Property      | Type    | Description
:-------------|:--------|:-----------
`speed`       | Integer | This property specifies the speed of single closing operation by three levels.

The `speed` must be `1`, `2`, `3`, or `4`. The code map is as follows:

Code   | Description (English) | Description (Japanese)
:------|:----------------------|:----------------------
`1`    | Low                   | 低
`2`    | Medium                | 中
`3`    | High                  | 高
`4`    | None                  | 無し


---------------------------------------
### <a id="class-63">Electrically operated rain sliding door/shutter class</a>
* Class group code: `0x02`
* Class code: `0x63`

#### Operation status
* EPC: `0x80`
* Access rule: Set/Get

This property indicates the ON/OFF status.

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | If the status is "ON", this value is `true`. Otherwise, if it is "OFF", this value is `false`.

#### Fault description (Recoverable faults)
* EPC: `0x89`
* Access rule: Get

This property indicates the fault.

Property      | Type    | Description
:-------------|:--------|:-----------
`code`        | Integer | The fault code.
`desc`        | String  | The description of the fault.

The `code` must be `0`, `4`, `5`, `6`, or `7`. The code map is as follows:

Code   | Description (English) | Description (Japanese)
:------|:----------------------|:----------------------
`0`    | No fault              | 異常無し
`4`    | Obstacle caught       | 障害物挟込み
`5`    | Recovery from outage  | 停電復帰
`6`    | Time out              | タイムアウト
`7`    | Battery low           | 電池残量低下

#### Timer operation setting
* EPC: `0x90`
* Access rule: Set/Get

This property turns the timer operation ON or OFF, and acquires the current status.

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | If ON, this value is `true`. Otherwise, `false`.

#### Opening speed setting
* EPC: `0xD0`
* Access rule: Set/Get

This property is used to specify the normal opening speed by three levels, and to acquire the current level.

Property      | Type    | Description
:-------------|:--------|:-----------
`speed`       | Integer | Speed level

The `speed` must be `1`, `2`, or `3`. The code map is as follows:

Code   | Description (English) | Description (Japanese)
:------|:----------------------|:----------------------
`1`    | Low                   | 低
`2`    | Medium                | 中
`3`    | High                  | 高

#### Closing speed setting
* EPC: `0xD1`
* Access rule: Set/Get

This property is used to specify the normal closing speed by three levels, and to acquire the current level.

Property      | Type    | Description
:-------------|:--------|:-----------
`speed`       | Integer | Speed level

The `speed` must be `1`, `2`, or `3`. The code map is as follows:

Code   | Description (English) | Description (Japanese)
:------|:----------------------|:----------------------
`1`    | Low                   | 低
`2`    | Medium                | 中
`3`    | High                  | 高

#### Operation time
* EPC: `0xD2`
* Access rule: Set/Get

This property is used to specify the operation time in seconds, and to acquire the current setting.

Property      | Type    | Description
:-------------|:--------|:-----------
`time`        | Integer | Seconds. The value must be an integer in the range of `0` to `253`.

#### Open/close operation setting
* EPC: `0xE0`
* Access rule: Set/Get

This property is used to specify the operation setting (open/close), and to acquire the current setting.

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Integer | Status code

The `status` must be `1`, `2`, or `3`. The code map is as follows:

Code   | Description (English)   | Description (Japanese)
:------|:------------------------|:----------------------
`1`    | Open                    | 開
`2`    | Close                   | 閉
`3`    | Stop                    | 停止

#### Degree-of-opening setting
* EPC: `0xE1`
* Access rule: Set/Get

This property is used to specify the degree-of-opening in %, and to acquire the current setting.

Property      | Type    | Description
:-------------|:--------|:-----------
`level`       | Integer | Degree-of-opening in %. The value must be an integer in the range of `0` to `100`.

#### Blind angle setting
* EPC: `0xE2`
* Access rule: Set/Get

This property is used to specify the blind angle value in deg, and to acquire the current angle.

Property      | Type    | Description
:-------------|:--------|:-----------
`angle`       | Integer | Blind angle value in deg. This value must be an integer in the range of `0` to `180`.

#### Opening/closing speed setting
* EPC: `0xE3`
* Access rule: Set/Get

This property is used to specify the open/close speed, and to acquire the current speed setting.

Property      | Type    | Description
:-------------|:--------|:-----------
`speed`       | Integer | Open/close speed in three levels

The `speed` must be `1`, `2`, or `3`. The code map is as follows:

Code   | Description (English)   | Description (Japanese)
:------|:------------------------|:----------------------
`1`    | Low                     | 低
`2`    | Medium                  | 中
`3`    | High                    | 高

#### Electric lock setting
* EPC: `0xE5`
* Access rule: Set/Get

This property is used to lock or unlock of an electric lock, and to acquire the current status.

Property      | Type    | Description
:-------------|:--------|:-----------
`lock`        | Boolean | Lock status. If locked, this value is `true`. Otherwise, `false`.

#### Remote operation setting status
* EPC: `0xE8`
* Access rule: Get

This property indicates whether remote operation is permitted or prohibited.

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | If permitted, this value is `true`. Otherwise, `false`.

#### Selective degreeof-opening setting
* EPC: `0xE9`
* Access rule: Set/Get

This property is used to set a stop at a specified value, and to acquire the current setting.

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Integer | Stop mode code

The `mode` must be `1`, `2`, `3`, `4`, or `5`. The code map is as follows:

Code   | Description (English)                    | Description (Japanese)
:------|:-----------------------------------------|:----------------------
`1`    | Degree-of-opening setting position: Open | 開度レベル設定位置開
`2`    | Operation time setting value: Open       | 動作時間設定値開
`3`    | Operation time setting value: Close      | 動作時間設定値閉
`4`    | Local setting position                   | ローカル設定位置
`5`    | Slit degree-of-opening setting           | スリット開度設定

#### Open/closed status
* EPC: `0xEA`
* Access rule: Get

This property indicates the open/closed status.

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Integer | Open/closed status.

The `status` must be `1`, `2`, `3`, `4`, or `5`. The code map is as follows:

Code   | Description (English) | Description (Japanese)
:------|:----------------------|:----------------------
`1`    | Fully open            | 全開
`2`    | Fully closed          | 全閉
`3`    | Open                  | 開動作中
`4`    | Closed                | 閉動作中
`5`    | Stopped halfway       | 途中停止

#### Slit degree-of-opening
* EPC: `0xED`
* Access rule: Set/Get

This property is used to specify the degree-of-opening by 8 levels, and to acquire the current level.

Property      | Type    | Description
:-------------|:--------|:-----------
`level`       | Integer | Level. This value must be an integer in the range of `1` to `8`.

#### One-time opening speed setting
* EPC: `0xEE`
* Access rule: Set/Get

This property is used to specify the speed of single opening operation by three levels, and to acquire the current setting.

Property      | Type    | Description
:-------------|:--------|:-----------
`speed`       | Integer | Speed level.

The `speed` must be `1`, `2`, `3`, or `4`. The code map is as follows:

Code   | Description (English) | Description (Japanese)
:------|:----------------------|:----------------------
`1`    | Low                   | 低
`2`    | Medium                | 中
`3`    | High                  | 高
`4`    | None                  | 無し

#### One-time closing speed setting
* EPC: `0xEF`
* Access rule: Set/Get

This property is used to specify the speed of single closing operation by three levels, and to acquire the current setting.

Property      | Type    | Description
:-------------|:--------|:-----------
`speed`       | Integer | Speed level.

The `speed` must be `1`, `2`, `3`, or `4`. The code map is as follows:

Code   | Description (English) | Description (Japanese)
:------|:----------------------|:----------------------
`1`    | Low                   | 低
`2`    | Medium                | 中
`3`    | High                  | 高
`4`    | None                  | 無し

---------------------------------------
### <a id="class-6F">Electric lock class</a>
* Class group code: `0x02`
* Class code: `0x6F`

#### Operation status
* EPC: `0x80`

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | This property indicates the ON/OFF status. If the status is "ON", this value is `true`. Otherwise, if it is "OFF", this value is `false`.

#### Lock setting 1
* EPC: `0xE0`

Property      | Type    | Description
:-------------|:--------|:-----------
`lock`        | Boolean | Lock/unlock of main electric lock. If locked, this value is `true`. Otherwise, `false`.

#### Lock setting 2
* EPC: `0xE1`

Property      | Type    | Description
:-------------|:--------|:-----------
`lock`        | Boolean | Lock/unlock of sub electric lock. If locked, this value is `true`. Otherwise, `false`.

#### Lock status of door guard
* EPC: `0xE2`

Property      | Type    | Description
:-------------|:--------|:-----------
`lock`        | Boolean | Lock/unlock of door guard. If locked, this value is `true`. Otherwise, `false`.

#### Door open/close status
* EPC: `0xE3`

Property      | Type    | Description
:-------------|:--------|:-----------
`open`        | Boolean | Open/close status of door. If opened, this value is `true`. Otherwise, `false`.

#### Occupant/non-occupant status
* EPC: `0xE4`

Property      | Type    | Description
:-------------|:--------|:-----------
`occupant`    | Boolean | Occupant/non-occupant status of persons. If occupant, this value is `true`. Otherwise, `false`.

#### Alarm status
* EPC: `0xE5`

Property      | Type    | Description
:-------------|:--------|:-----------
`alarm`       | Integer | Alarm status of electric lock.

The `alarm` must be `0`, `1`, `2`, `3`, or `4`. The code map is as follows:

Code   | Description (English)   | Description (Japanese)
:------|:------------------------|:----------------------
`0`    | Normal (no alarm)       | 通常状態（警報なし）
`1`    | Break open              | こじ開け
`2`    | Door open               | 扉開放
`3`    | Manual unlocked         | 手動解錠
`4`    | Tampered                | タンパ

#### Auto lock mode setting
* EPC: `0xE6`

Property      | Type    | Description
:-------------|:--------|:-----------
`autoLock`    | Boolean | ON/OFF of auto lock mode. `true` means ON, `false` means OFF.

#### Battery level
* EPC: `0xE7`

Property      | Type    | Description
:-------------|:--------|:-----------
`battery`     | Boolean | This property indicates the battery level to get the status of a battery level lower and in need of replacement. Note that this value does not mean the battery level itself. It just means whether the battery has to be replaced or not. If the battery has to be replaced, this value is `true`. Otherwise, `false`.

---------------------------------------
### <a id="class-72">Instantaneous water heater class</a>
* Class group code: `0x02`
* Class code: `0x72`

#### Operation status
* EPC: `0x80`
* Access rule: Set/Get

This property indicates the ON/OFF status.

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | If the status is "ON", this value is `true`. Otherwise, if it is "OFF", this value is `false`.

#### Hot water heating status
* EPC: `0xD0`
* Access rule: Get

This property indicates the hot water heating status.

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | If the status is "ON", this value is `true`. Otherwise, if it is "OFF", this value is `false`.

#### Set value of hot water temperature
* EPC: `0xD1`
* Access rule: Set/Get

This property is used to set the hot water temperature in degC, and acquires the current setting.

Property      | Type    | Description
:-------------|:--------|:-----------
`temperature` | Integer | Hot water temperature in degC. This value must be an integer in the range of `0` to `100`.

#### Hot water warmer setting
* EPC: `0xD2`
* Access rule: Set/Get

This property is used to set the hot water warmer setting, and to acquire the current setting.

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | Hot water warmer setting. If the setting is "ON", this value is `true`. Otherwise, if it is "OFF", this value is `false`.

#### Set value of bath temperature
* EPC: `0xE1`
* Access rule: Set/Get

This property is used to set the bath temperature in degC, and to acquire the current setting.

Property      | Type    | Description
:-------------|:--------|:-----------
`temperature` | Integer | Bath temperature in degC. This value must be an integer in the range of `0` to `100`.

#### Bath water heater status
* EPC: `0xE2`
* Access rule: Get

This property indicates whether or not the bath water heater is heating the bath water.

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | If the heater is "ON", this value is `true`. Otherwise, if it is "OFF", this value is `false`.

#### Bath auto mode setting
* EPC: `0xE3`
* Access rule: Set/Get

This property is used to set the bath auto mode ON/OFF, and to acquire the current setting.

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | Bath auto mode ON/OFF. If the bath auto mode is "ON", this value is `true`. Otherwise, if it is "OFF", this value is `false`.

---------------------------------------
### <a id="class-87">Power distribution board metering class</a>
* Class group code: `0x02`
* Class code: `0x87`

#### Operation status
* EPC: `0x80`
* Access rule: Set/Get

This property is used to set the ON/OFF status, and to acquire the current status.

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | If the status is "ON", this value is `true`. Otherwise, if it is "OFF", this value is `false`.

#### Number of measurement channels (simplex)
* EPC: `0xB1`
* Access rule: Get

This property indicates the number of simplex measurement channels.

Property      | Type    | Description
:-------------|:--------|:-----------
`number`      | Integer | Number of simplex measurement channels. The value is in the range of 1 to 252.

The value of the `number` could be `null`, which means that the number of channels is unknown.

#### Channel range specification for instantaneous current measurement (simplex)
* EPC: `0xB4`
* Access rule: Set/Get

This property is used to specify the range of acquisition by the measured instantaneous current list (simplex).

Property      | Type    | Description
:-------------|:--------|:-----------
`start`       | Integer | Acquisition start channel. This value must be an integer in the range of 1 to 252.
`range`       | Integer |Range from the acquisition start channel. This value must be an integer in the range of 1 to 60.

The values of the `start` and the `range` could be `null`, which means that both of the values are not set.

#### Measured instantaneous current list (simplex)
* EPC: `0xB5`
* Access rule: Get

This property indicates the measured instantaneous current of a measurement channel specified by the property of “Channel range specification for instantaneous current measurement (simplex).”

Property      | Type    | Description
:-------------|:--------|:-----------
`start`       | Integer | Acquisition start channel. This value is in the range of 1 to 252.
`range`       | Integer | Range from the acquisition start channel. This value is in the range of 1 to 60.
`list`        | Array   | List of the measured instantaneous current.

The values of the `start` and the `range` could be `null`, which means that both of the values are not set.

The value of the `list` is an `Array` object whose structure is as follows:

```json
[
  [1.3, 1.5],
  [3.9, 4.3],
  [null, null]
]
```

The `list` contains a list of value pairs (2 values). Each value in a pair is the measured instantaneous current. The unit is 1A. The first value indicates the R phase current, the second value indicates the T phorase current.

The type of the value is float. Each value could be `null`, which means no data.

#### Channel range specification for instantaneous power consumption measurement (simplex)
* EPC: `0xB6`
* Access rule: Set/Get

This property is used to specify the range of acquisition by the measured instantaneous power consumption list (simplex).

Property      | Type    | Description
:-------------|:--------|:-----------
`start`       | Integer | Acquisition start channel. This value is in the range of 1 to 252.
`range`       | Integer | Range from the acquisition start channel. This value is in the range of 1 to 60.

The values of the `start` and the `range` could be `null`, which means that both of the values are not set.

#### Measured instantaneous power consumption list (simplex)
* EPC: `0xB7`
* Access rule: Get

This property indicates the measured instantaneous power consumption of a measurement channel specified by the property of “Channel range specification for instantaneous power consumption measurement (simplex).”

Property      | Type    | Description
:-------------|:--------|:-----------
`start`       | Integer | Acquisition start channel. This value is in the range of 1 to 252.
`range`       | Integer | Range from the acquisition start channel. This value is in the range of 1 to 60.
`list`        | Array   | List of the measured instantaneous power consumption.

The values of the `start` and the `range` could be `null`, which means that both of the values are not set.

The value of the `list` is an `Array` object whose structure is as follows:

```json
[1, 2, null]
```

Each value in the `list` is the measured instantaneous power consumption. The unit is 1W. 

The type of the value is integer. Each value could be `null`, which means no data.

#### Measured instantaneous amount of electric energy
* EPC: `0xC6`
* Access rule: Get

This property indicates the measured effective instantaneous amount of electric energy in watts.

Property      | Type    | Description
:-------------|:--------|:-----------
`energy`      | Integer | Measured effective instantaneous amount of electric energy in watts.

---------------------------------------
### <a id="class-88">Low-voltage smart electric energy meter class</a>
* Class group code: `0x02`
* Class code: `0x88`

#### Operation status
* EPC: `0x80`

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | This property indicates the ON/OFF status. If the status is "ON", this value is `true`. Otherwise, if it is "OFF", this value is `false`.

#### Coefficient
* EPC: `0xD3`

Property      | Type    | Description
:-------------|:--------|:-----------
`coefficient` | Integer | This property indicates the coefficient for converting measured cumulative amount of electric energy and historical data to actual usage amount.

The value of the `coefficient` must be an integer in the range of 0 to 999999.

#### Number of effective digits for cumulative amounts of electric energy
* EPC: `0xD7`

Property      | Type    | Description
:-------------|:--------|:-----------
`digit`       | Integer | This property indicates the number of effective digits for measured cumulative amounts of electric energy.

The value of the `digit` must be an integer in the range of 1 to 8.

#### Measured cumulative amount of electric energy (normal direction)
* EPC: `0xE0`

Property      | Type    | Description
:-------------|:--------|:-----------
`energy`      | Integer | This property indicates the measured cumulative amount of electric energy in units of "kWh".

The value of the `energy` must be an integer in the range of 0 to 99999999.

#### Unit for cumulative amounts of electric energy (normal and reverse directions)
* EPC: `0xE1`

Property      | Type    | Description
:-------------|:--------|:-----------
`unit`        | Integer | This property indicates the unit (multiplying factor) used for the measured cumulative amount of electric energy and the historical data of measured cumulative amounts of electric energy. This value is a float number such as 1, 0.1, 0.01, 10, 100, etc.

The value of the `unit` must be an float which is either 1.0, 0.1, 0.01, 0.001, 0.0001, 10, 100, 1000, or 10000 (kWh).

#### Historical data of measured cumulative amounts of electric energy 1 (normal direction)
* EPC: `0xE2`

Property      | Type    | Description
:-------------|:--------|:-----------
`day`         | Integer | This property indicates the day for which the historical data of measured cumulative amounts of electric energy is to be retrieved.
`history`     | Array   | This property indicates the historical data of measured cumulative amounts of electric energy (normal direction), which consists of 48 items of half-hourly data for the preceding 24 hours (00:00 to 23:30) of the day by time series. This value is an Array object.

The value of the `day` property must be an integer in the range of 0 to 99.

The value of the `history` must be an Array object. The number of the elements in the Array object must be equal to or less than 48. Each element in the Array must be an integer in the range of 0 to 99999999.

Note that each element in the Array is meaningless by itself. In order to know the meaningful value, the coefficient (the EPC is `0xD3`) and the unit (the EPC is `0xE1`) are essential. If the targeted device doesn't support the unit (the EPC is `0xE1`), then the unit must be assumed to be 1 kWh.

#### Measured cumulative amounts of electric energy (reverse direction)
* EPC: `0xE3`

Property      | Type    | Description
:-------------|:--------|:-----------
`energy`      | Integer | This property indicates the measured cumulative amounts of electric energy in units of "kWh".

The value of the `energy` must be an integer in the range of 0 to 99999999.

#### Historical data of measured cumulative amounts of electric energy 1 (reverse direction)
* EPC: `0xE4`

Property      | Type    | Description
:-------------|:--------|:-----------
`day`         | Integer | This property indicates the day for which the historical data of measured cumulative amounts of electric energy is to be retrieved.
`history`     | Array   | This property indicates the historical data of measured cumulative amounts of electric energy ((reverse direction), which consists of 48 items of half-hourly data for the preceding 24 hours (00:00 to 23:30) of the day by time series. This value is an Array object.

The value of the `day` property must be an integer in the range of 0 to 99.

The value of the `history` must be an Array object. The number of the elements in the Array object must be equal to or less than 48. Each element in the Array must be an integer in the range of 0 to 99999999.

Note that each element in the Array is meaningless by itself. In order to know the meaningful value, the coefficient (the EPC is `0xD3`) and the unit (the EPC is `0xE1`) are essential. If the targeted device doesn't support the unit (the EPC is `0xE1`), then the unit must be assumed to be 1 kWh.

#### Day for which the historical data of measured cumulative amounts of electric energy is to be retrieved 1
* EPC: `0xE5`

Property      | Type    | Description
:-------------|:--------|:-----------
`day`         | Integer | This property indicates the day for which the historical data of measured cumulative amounts of electric energy (which consists of 48 items of half-hourly data for the preceding 24 hours) is to be retrieved.


The value of the `day` must be an integer in the range of 0 to 99.

#### Measured instantaneous electric energy
* EPC: `0xE7`

Property      | Type    | Description
:-------------|:--------|:-----------
`energy`      | Integer | This property indicates the measured effective instantaneous electric energy in 1W unit.

The value of the `energy` must be an integer in the range of -2147483647 to 2147483645.

#### Measured instantaneous currents
* EPC: `0xE8`

Property      | Type    | Description
:-------------|:--------|:-----------
`r`           | Integer | This property indicates the measured effective instantaneous R phase currents in 1A unit.
`t`           | Integer | This property indicates the measured effective instantaneous T phase currents in 1A unit.

The value of the `r` and `t` must be an integer in the range of -3276.7 to 3276.5. If the targeted smarter meter is a single-phase, two-wire system, the value of the `t` property will be 3276.6.

#### Cumulative amounts of electric energy measured at fixed time (normal direction)
* EPC: `0xEA`

This property indicates the most recent cumulative amount of electric energy (normal direction) measured at 30-minute intervals held by the meter. This EDT includes the date of measurement, time of measurement, and the cumulative electric energy (normal direction).

Property      | Type    | Description
:-------------|:--------|:-----------
`date`        | String  | This property indicates the date of measurement in form of "YYYY-MM-DD".
`time`        | String  | This property indicates the time of measurement in form of "HH:MM:SS".
`energy`      | Integer | This property indicates the cumulative electric energy (normal direction)

The value of the `energy` must be an integer in the range of 0 to 99999999.

Note that the value of the `energy` property is meaningless by itself. In order to know the meaningful value, the coefficient (the EPC is `0xD3`) and the unit (the EPC is `0xE1`) are essential. If the targeted device doesn't support the unit (the EPC is `0xE1`), then the unit must be assumed to be 1 kWh.

If the value of `energy` is 0xFFFFFFFE, it means there is no measurement value at the time.

#### Cumulative amounts of electric energy measured at fixed time (reverse direction)
* EPC: `0xEB`

This property indicates the most recent cumulative amount of electric energy (reverse direction) measured at 30-minute intervals held by the meter. This EDT includes the date of measurement, time of measurement, and the cumulative electric energy (reverse direction).

Property      | Type    | Description
:-------------|:--------|:-----------
`date`        | String  | This property indicates the date of measurement in form of "YYYY-MM-DD".
`time`        | String  | This property indicates the time of measurement in form of "HH:MM:SS".
`energy`      | Integer | This property indicates the cumulative electric energy (reverse direction)

The value of the `energy` must be an integer in the range of 0 to 99999999.

Note that the value of the `energy` property is meaningless by itself. In order to know the meaningful value, the coefficient (the EPC is `0xD3`) and the unit (the EPC is `0xE1`) are essential. If the targeted device doesn't support the unit (the EPC is `0xE1`), then the unit must be assumed to be 1 kWh.

If the value of `energy` is 0xFFFFFFFE, it means there is no measurement value at the time.

#### Historical data of measured cumulative amounts of electric energy 2 (normal and reverse directions)
* EPC: `0xEC`

This property indicates the historical data of measured cumulative amounts of electric energy every 30 minutes in the normal and reverse directions within the past six hours. This EDT includes the date and time for which the historical data of measured cumulative amounts of electric energy is to be retrieved, the number of the collection, and the cumulative amount of electric energy.

Property      | Type    | Description
:-------------|:--------|:-----------
`date`        | String  | This property indicates the date of measurement in form of "YYYY-MM-DD".
`time`        | String  | This property indicates the time of measurement in form of "HH:MM".
`number`      | Integer | This property indicates the number of the collection.
`normal`      | Array   | This property indicates the historical data of measured cumulative amounts of electric energy every 30 minutes in the normal direction within the past six hours as an Array object.
`reverse`     | Array   | This property indicates the historical data of measured cumulative amounts of electric energy every 30 minutes in the reverse direction within the past six hours as an Array object.

The value of the `number` property must be an integer in the range of 1 to 12.

The value of the `normal` and the `reverse` property must be an Array object. The number of the elements in the Array object must be equal to the value of the `number` property. Each element in the Array must be an integer in the range of 0 to 99999999.

Note that each element in the Array is meaningless by itself. In order to know the meaningful value, the coefficient (the EPC is `0xD3`) and the unit (the EPC is `0xE1`) are essential. If the targeted device doesn't support the unit (the EPC is `0xE1`), then the unit must be assumed to be 1 kWh.

#### Cumulative amounts of electric energy measured at fixed time (reverse direction)
* EPC: `0xED`

This property indicates the date and time of historical data of measurements (every 30 minutes) and the number of segments where measurement historical data is collected every 30 minutes.

Property      | Type    | Description
:-------------|:--------|:-----------
`date`        | String  | This property indicates the date of measurement in form of "YYYY-MM-DD".
`time`        | String  | This property indicates the time of measurement in form of "HH:MM".
`number`      | Integer | This property indicates the number of segments.

The value of the `number` property must be an integer in the range of 1 to 12.

When you read this EDT object, if both the `date` and the `time` is an empty string and the value of the `number` property is 1, it means that the date and time for this EDT have not been set yet. If you want to create such an EDT object, specify an empty hash object (i.e. `{}`) as an EDT object.

---------------------------------------
### <a id="class-90">General lighting class</a>
* Class group code: `0x02`
* Class code: `0x90`

#### Operation status
* EPC: `0x80`

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | This property indicates the ON/OFF status. If the status is "ON", this value is `true`. Otherwise, if it is "OFF", this value is `false`.

#### Illuminance level
* EPC: `0xB0`

Property      | Type    | Description
:-------------|:--------|:-----------
`level`       | Integer | This property indicates illuminance level in %. When setting, this value must be an integer between 0 and 100.

#### Light color setting
* EPC: `0xB1`

Property      | Type    | Description
:-------------|:--------|:-----------
`color`       | Integer | This property indicates the color setting. 

The `color` must be `0x40`, `0x41`, `0x42`, `0x43`, or `0x44`. The code map is as follows. Each code is shown as hexadecimal representation:

Code   | Description (English)   | Description (Japanese)
:------|:------------------------|:----------------------
`0x40` | Other                   | その他
`0x41` | Incandescent lamp color | 電球色
`0x42` | White                   | 白色
`0x43` | Daylight white          | 昼白色
`0x44` | Daylight color          | 昼光色

#### Illuminance level step setting
* EPC: `0xB2`

Property      | Type    | Description
:-------------|:--------|:-----------
`step`        | Integer | Used to specify the illuminance level in terms of steps and acquire the current setting. When settig, this value must be an integer between 0x01 and the maximum specifiable illuminance level value (dark to bright).

#### Light color step setting
* EPC: `0xB3`

Property      | Type    | Description
:-------------|:--------|:-----------
`step`        | Integer | Used to specify the light color in terms of steps and acquire the current setting. When settig, this value must be an integer between 0x01 and the maximum specifiable light color value (incandescent lamp color to white).

#### Maximum specifiable values
* EPC: `0xB4`

Property      | Type    | Description
:-------------|:--------|:-----------
`illuminance` | Integer | The maximum specifiable illuminance level value of main lighting.
`color`       | Integer | The maxinum specifiable light color value of main lighting.

#### Maximum value of settable level for night lighting
* EPC: `0xB5`

Property      | Type    | Description
:-------------|:--------|:-----------
`illuminance` | Integer | The maximum values of illuminance for night lighting.
`color`       | Integer | light color settable levels for night lighting.

#### Lighting mode setting
* EPC: `0xB6`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Integer | This property indicates the lighting mode setting. 

The `mode` must be `0x41`, `0x42`, `0x43`, or `0x45`. The code map is as follows. Each code is shown as hexadecimal representation:

Code   | Description (English)   | Description (Japanese)
:------|:------------------------|:----------------------
`0x41` | Auto                    | 自動
`0x42` | Main lighting           | 通常灯
`0x43` | Night lighting          | 常夜灯
`0x45` | Color lighting          | カラー灯

#### Illuminance level setting for main lighting
* EPC: `0xB7`

Property      | Type    | Description
:-------------|:--------|:-----------
`level`       | Integer | This property indicates the illuminance level of main lighting in %. When setting, this value must be an integer between 0 and 100.

#### Illuminance level step setting for main lighting
* EPC: `0xB8`

Property      | Type    | Description
:-------------|:--------|:-----------
`step`        | Integer | Used to set the illuminance level by the number of steps for main lighting and to acquire the current setting. When settig, this value must be an integer between 0x01 and the maximum value of settable illuminance level(dark to bright).

#### Illuminance level setting for night lighting
* EPC: `0xB9`

Property      | Type    | Description
:-------------|:--------|:-----------
`level`       | Integer | This property indicates the illuminance level of night lighting in %. When setting, this value must be an integer between 0 and 100.

#### Illuminance level step setting for night lighting
* EPC: `0xBA`

Property      | Type    | Description
:-------------|:--------|:-----------
`step`        | Integer | Used to set the illuminance level by the number of steps for night lighting and to acquire the current setting status. When settig, this value must be an integer between 0x01 and the maximum value of settable illuminance level (dark to bright).

#### Light color setting for main lighting
* EPC: `0xBB`

Property      | Type    | Description
:-------------|:--------|:-----------
`color`       | Integer | This property is used to set the light color for main lighting.

The `mode` must be `0x40`, `0x41`, `0x42`, `0x43`, or `0x44`. The code map is as follows. Each code is shown as hexadecimal representation:

Code   | Description (English)   | Description (Japanese)
:------|:------------------------|:----------------------
`0x40` | Other                   | その他
`0x41` | Incandescent lamp color | 電球色
`0x42` | White                   | 白色
`0x43` | Daylight white          | 昼白色
`0x44` | Daylight color          | 昼光色

#### Light color level step setting for main lighting 
* EPC: `0xBC`

Property      | Type    | Description
:-------------|:--------|:-----------
`step`        | Integer | Used to set the light color level by the number of steps for main lighting and to acquire the current setting. When settig, this value must be an integer between 0x01 and the maximum value of settable light color level (incandescent lamp color to white).

#### Light color setting for night lighting
* EPC: `0xBD`

Property      | Type    | Description
:-------------|:--------|:-----------
`color`       | Integer | This property is used to set the light color for night lighting.

The `mode` must be `0x40`, `0x41`, `0x42`, `0x43`, or `0x44`. The code map is as follows. Each code is shown as hexadecimal representation:

Code   | Description (English)   | Description (Japanese)
:------|:------------------------|:----------------------
`0x40` | Other                   | その他
`0x41` | Incandescent lamp color | 電球色
`0x42` | White                   | 白色
`0x43` | Daylight white          | 昼白色
`0x44` | Daylight color          | 昼光色

#### Light color level step setting for night lighting
* EPC: `0xBE`

Property      | Type    | Description
:-------------|:--------|:-----------
`step`        | Integer | Used to set the light color level by the number of steps for night lighting and to acquire the current setting.. When settig, this value must be an integer between 0x01 and the maximum value of settable light color level (incandescent lamp color to white).

#### Lighting mode status in auto mode
* EPC: `0xBF`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Integer | This property is Used to acquire the current lighting mode in auto mode.

The `mode` must be `0x42`, `0x43`, `0x44`, or `0x45`. The code map is as follows. Each code is shown as hexadecimal representation:

Code   | Description (English)   | Description (Japanese)
:------|:------------------------|:----------------------
`0x42` | Main lighting           | 通常灯
`0x43` | Night lighting          | 常夜灯
`0x44` | Off                     | 消灯
`0x45` | Color lighting          | カラー灯

#### RGB setting for color lighting
* EPC: `0xC0`

This property is used to set the RGB value for color lighting and to acquire the current setting.

Property      | Type    | Description
:-------------|:--------|:-----------
`r`           | Integer | R compornent. When setting, this value must be an integer between 0 and 255.
`g`           | Integer | G compornent. When setting, this value must be an integer between 0 and 255.
`b`           | Integer | B compornent. When setting, this value must be an integer between 0 and 255.

#### ON timer reservation setting
* EPC: `0x90`

Property      | Type    | Description
:-------------|:--------|:-----------
`set`         | Boolean | This property indicates the ON/OFF status of the ON timer reservation setting. If the status is "ON", this value is `true`. Otherwise, if it is "OFF", this value is `false`.

#### ON timer setting
* EPC: `0x91`

Property      | Type    | Description
:-------------|:--------|:-----------
`h`           | Integer | Hour. When setting, this value must be an integer between 0 and 23.
`m`           | Integer | Minute. When setting, this value must be an integer between 0 and 59.

#### OFF timer reservation setting
* EPC: `0x94`

Property      | Type    | Description
:-------------|:--------|:-----------
`set`         | Boolean | This property indicates the ON/OFF status of the OFF timer reservation setting. If the status is "ON", this value is `true`. Otherwise, if it is "OFF", this value is `false`.

#### OFF timer setting
* EPC: `0x95`

Property      | Type    | Description
:-------------|:--------|:-----------
`h`           | Integer | Hour. When setting, this value must be an integer between 0 and 23.
`m`           | Integer | Minute. When setting, this value must be an integer between 0 and 59.

