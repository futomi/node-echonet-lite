The `EDT` object specification for the node-echonet-lite
===============

## Air Conditioner-related Device Class Group
* Class group code: `0x01`

The node-echonet-lite module support the classes in this class group as follows:

* [Home air conditioner class (Class code: `0x30`)](#class-30)

---------------------------------------
### <a name="class-30">Home air conditioner class</a>
* Class group code: `0x01`
* Class code: `0x30`

#### Operation status
* EPC: `0x80`

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | This property indicates the ON/OFF status. If the ON/OFF status is ON, this value is `true`, otherwise `false`.

#### Operation power-saving
* EPC: `0x8F`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Boolean | This property indicates the power-saving operation mode. If in power-saving mode, this value is `true`, otherwise `false`.

#### Operation mode setting
* EPC: `0xB0`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Number  | This property indicates the operation mode as a code.
`desc`        | String  | The description of the code.

The code map is as follows. Each code is shown as decimal representation:

Code      | Description (English) | Description (Japanese)
:---------|:----------------------|:----------------------
1         | Automatic             | 自動
2         | Cooling               | 冷房
3         | Heating               | 暖房
4         | Dehumidification      | 除湿
5         | Air circulator        | 送風
0         | Other                 | その他

If you only read this `EDT` object, you don't need to know the code map above. It is enough to see the value of the `desc` property.

If you want to create an ECHONET Lite packet to send, the `desc` property is not required.

#### Automatic temperature control setting
* EPC: `0xB1`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Boolean | This property indicates the power-saving operation mode. If in power-saving mode, this value is `true`, otherwise `false`.

#### Normal/highspeed/silent operation setting
* EPC: `0xB2`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Number  | This property indicates the type of operation as a code.
`desc`        | String  | The description of the code.

The code map is as follows. Each code is shown as decimal representation:

Code      | Description (English) | Description (Japanese)
:---------|:----------------------|:----------------------
1         | Normal operation      | 通常運転
2         | High-speed operation  | 急速
3         | Silent operation      | 静音

If you only read this `EDT` object, you don't need to know the code map above. It is enough to see the value of the `desc` property.

If you want to create an ECHONET Lite packet to send, the `desc` property is not required.

#### Set temperature value
* EPC: `0xB3`

Property      | Type    | Description
:-------------|:--------|:-----------
`temperature` | Number  | This property indicates the current temperature setting in the units of Celsius.

The value of the `temperature` must be an integer in the range of 0 to 50 (Celsius).

#### Set value of relative humidity in dehumidifying mode
* EPC: `0xB4`

Property      | Type    | Description
:-------------|:--------|:-----------
`humidity`    | Number  | This property indicates the relative humidity setting for the "dehumidification" mode in the units of %.

The value of the `humidity` must be an integer in the range of 0 to 100 (%).

#### Set temperature value in cooling mode
* EPC: `0xB5`

Property      | Type    | Description
:-------------|:--------|:-----------
`temperature` | Number  | This property indicates the temperature setting for the "cooling" mode in the units of Celsius.

The value of the `temperature` must be an integer in the range of 0 to 50 (Celsius).

#### Set temperature value in heating mode
* EPC: `0xB6`

Property      | Type    | Description
:-------------|:--------|:-----------
`temperature` | Number  | This property indicates the temperature setting for the "heating" mode in the units of Celsius.

The value of the `temperature` must be an integer in the range of 0 to 50 (Celsius).

#### Set temperature value in dehumidifying mode
* EPC: `0xB7`

Property      | Type    | Description
:-------------|:--------|:-----------
`temperature` | Number  | This property indicates the temperature setting for the "dehumidification" mode in the units of Celsius.

The value of the `temperature` must be an integer in the range of 0 to 50 (Celsius).

#### Rated power consumption
* EPC: `0xB8`

Property        | Type    | Description
:---------------|:--------|:-----------
`cooling`       | Number  | This property indicates the rated power consumption in operation mode of "cooling" in the units of Watt (W).
`heating`       | Number  | This property indicates the rated power consumption in operation mode of "heating" in the units of Watt (W).
`dehumidifying` | Number  | This property indicates the rated power consumption in operation mode of "dehumidifying" in the units of Watt (W).
`blast`         | Number  | This property indicates the rated power consumption in operation mode of "blast" in the units of Watt (W).

The value of each property must be an integer in the range of 0 to 65533 (W).

#### Measured value of current consumption
* EPC: `0xB9`

Property      | Type    | Description
:-------------|:--------|:-----------
`current`     | Number  | This property indicates the measured value of current consumption in the units of A.

The value of the `current` must be an float in the range of 0 to 6553.3 (A).

#### Measured value of room relative humidity
* EPC: `0xBA`

Property      | Type    | Description
:-------------|:--------|:-----------
`humidity`    | Number  | This property indicates the measured value of room relative humidity in the units of %.

The value of the `humidity` must be an integer in the range of 0 to 100 (%).

#### Measured value of room temperature
* EPC: `0xBB`

Property      | Type    | Description
:-------------|:--------|:-----------
`temperature` | Number  | This property indicates the measured value of room temperature in the units of Celsius.

The value of the `temperature` must be an integer in the range of -127 to 125 (Celsius).

#### Set temperature value of user remote control
* EPC: `0xBC`

Property      | Type    | Description
:-------------|:--------|:-----------
`temperature` | Number  | This property indicates the set temperature value of user remote control in the units of Celsius.

The value of the `temperature` must be an integer in the range of 0 to 50 (Celsius).

#### Measured cooled air temperature
* EPC: `0xBD`

Property      | Type    | Description
:-------------|:--------|:-----------
`temperature` | Number  | This property indicates the measured cooled air temperature at the outlet in the units of Celsius.

The value of the `temperature` must be an integer in the range of -127 to 125 (Celsius).

#### Measured cooled air temperature
* EPC: `0xBE`

Property      | Type    | Description
:-------------|:--------|:-----------
`temperature` | Number  | This property indicates  the measured outdoor air temperature in the units of Celsius.

The value of the `temperature` must be an integer in the range of -127 to 125 (Celsius).

#### Relative temperature setting
* EPC: `0xBF`

Property      | Type    | Description
:-------------|:--------|:-----------
`temperature` | Number  | This property indicates the relative temperature relative to the target temperature for an air conditioner operation mode in the units of Celsius.

The value of the `temperature` must be an float in the range of -12.7 to 12.5 (Celsius).

#### Air flow rate setting
* EPC: `0xA0`

Property      | Type    | Description
:-------------|:--------|:-----------
`level`       | Number  | This property indicates  the air flow rate as a number in the range of 1 to 8. If this value is 0, it means that the function to automatically control the air flow rate is used.

The value of the `level` must be an integer in the range of 0 to 8.

#### Automatic control of air flow direction setting
* EPC: `0xA1`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Number  | This property indicates whether or not to use
the automatic air flow direction control and the plane(s) (vertical and/or horizontal) in which the automatic air flow direction control function is to be used function as a code.
`desc`        | String  | The description of the code.

The code map is as follows. Each code is shown as decimal representation:

Code      | Description (English)  | Description (Japanese)
:---------|:-----------------------|:----------------------
1         | Automatic              | AUTO
2         | Non-automatic          | 非AUTO
3         | Automatic (vertical)   | 上下AUTO
4         | Automatic (horizontal) | 左右AUTO

If you only read this `EDT` object, you don't need to know the code map above. It is enough to see the value of the `desc` property.

If you want to create an ECHONET Lite packet to send, the `desc` property is not required.

#### Automatic swing of air flow setting
* EPC: `0xA3`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Number  | This property indicates whether or not to use the automatic air flow swing function and the plane(s) (vertical and/or horizontal) in which the automatic air flow swing function is to be used as a code.
`desc`        | String  | The description of the code.

The code map is as follows. Each code is shown as decimal representation:

Code      | Description (English)   | Description (Japanese)
:---------|:------------------------|:----------------------
0         | OFF                     | OFF
1         | Vertical                | 上下
2         | Horizontal              | 左右
3         | Vertical and horizontal | 上下左右

If you only read this `EDT` object, you don't need to know the code map above. It is enough to see the value of the `desc` property.

If you want to create an ECHONET Lite packet to send, the `desc` property is not required.

#### Air flow direction (vertical) setting
* EPC: `0xA4`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Number  | This property indicates the air flow direction in the vertical plane by selecting a pattern from among the 5 predefined patterns as a code.
`desc`        | String  | The description of the code.

The code map is as follows. Each code is shown as decimal representation:

Code      | Description (English)                  | Description (Japanese)
:---------|:---------------------------------------|:----------------------
1         | Uppermost                              | 上
2         | Lowermost                              | 下
3         | Central                                | 中央
4         | Midpoint between uppermost and central | 上中
5         | Midpoint between lowermost and central | 下中

If you only read this `EDT` object, you don't need to know the code map above. It is enough to see the value of the `desc` property.

If you want to create an ECHONET Lite packet to send, the `desc` property is not required.

#### Air flow direction (horizontal) setting
* EPC: `0xA5`

Property      | Type    | Description
:-------------|:--------|:-----------
`directions`  | Array   | This property indicates the air flow direction(s) in the horizontal plane by selecting a pattern from among the 31 predefined patterns.
`desc`        | String  | See the description below.

The ECHONET Lite specification defines 5 directions for this EPC: "left", "middle between left and center", "center", "middle between center and right", and "right". The value of the `directions` is an Array consisting of 5 boolean values (`true` or `false`) corresponding to each direction.

```JavaScript
[true, true, false, false, false]
```

If the `value` is an Array described above, the air flow directions are 2 directions: "left" and "middle between left and center".

The value of the `desc` is a text representation of the `directions` property. The value of the `value` above is expressed as "`||---`".

If you want to create an ECHONET Lite packet to send, the `desc` property is not required.

#### Special state
* EPC: `0xAA`

Property      | Type    | Description
:-------------|:--------|:-----------
`state`       | Number  | This property indicates if the air conditioner is in a "special" state (i.e. the "defrosting", "preheating" or "heat removal" state) as a code.
`desc`        | String  | The description of the code.

The code map is as follows. Each code is shown as decimal representation:

Code      | Description (English)   | Description (Japanese)
:---------|:------------------------|:----------------------
0         | Normal operation        | 通常状態
1         | Defrosting              | 除霜状態
2         | Preheating              | 予熱状態
3         | Heat removal            | 排熱状態

If you only read this `EDT` object, you don't need to know the code map above. It is enough to see the value of the `desc` property.

If you want to create an ECHONET Lite packet to send, the `desc` property is not required.

#### Non-priority state
* EPC: `0xAB`

Property      | Type    | Description
:-------------|:--------|:-----------
`state`       | Boolean | This property indicates whether the air conditioner is in a "non-priority" state or not. If the air conditioner is in "non-priority" stat, this value is `true`. Otherwise, it is `false`.

#### Ventilation function setting
* EPC: `0xC0`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Number  | This property indicates whether or not to use the ventilation function as a code.
`desc`        | String  | The description of the code.

The code map is as follows. Each code is shown as decimal representation:

Code      | Description (English)   | Description (Japanese)
:---------|:------------------------|:----------------------
1         | ON (outlet direction)   | ON（排気方向）
2         | OFF                     | OFF
3         | ON (intake direction)   | ON（吸気方向）

If you only read this `EDT` object, you don't need to know the code map above. It is enough to see the value of the `desc` property.

If you want to create an ECHONET Lite packet to send, the `desc` property is not required.

#### Humidifier function setting
* EPC: `0xC1`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Boolean | This property indicates whether or not to use
the humidifier function. If the humidifier function is used, this value is `true`. Otherwise, it is `false`.

#### Ventilation air flow rate setting
* EPC: `0xC2`

Property      | Type    | Description
:-------------|:--------|:-----------
`level`       | Number  | This property indicates the ventilation air flow rate by selecting a level from among the predefined levels in the range of 1 to 8. If this value is 0, it means that the automatic control of ventilation air flow rate is used.

The value of the `level` must be an integer in the range of 0 to 8.

#### Ventilation air flow rate setting
* EPC: `0xC4`

Property      | Type    | Description
:-------------|:--------|:-----------
`level`       | Number  | This property indicates the degree of humidification to achieve by selecting a level from among the predefined levels in the range of 1 to 8. If this value is 0, it means that the automatic control of the degree of humidification is used.

The value of the `level` must be an integer in the range of 0 to 8.

#### Mounted air cleaning method
* EPC: `0xC6`

Property      | Type    | Description
:-------------|:--------|:-----------
`dust`        | Boolean | This property indicates whether the electrical dust collection method is mounted or not as an air cleaning method. If it is mounted, this value is `true`. Otherwise, this value is `false`.
`ion`         | Boolean | This property indicates whether the cluster ion method is mounted or not as an air cleaning method. If it is mounted, this value is `true`. Otherwise, this value is `false`.

#### Air purifier function setting
* EPC: `0xC7`

Property      | Type    | Description
:-------------|:--------|:-----------
`dust_mode`   | Boolean | This property indicates whether or not to use the electrical dust collection-based air purifier function. If it is used, this value is `true`. Otherwise, this value is `false`.
`dust_state`  | Boolean | This property indicates whether or not to use the function to
automatically control the degree of the electrical dust collection-based air purification. If it is automatic, this value is `true`. If it is non-automatic, this value is `false`.
`dust_level`  | Number  | This property indicates the electrical dust collection-based air purification level as an integer in the range of 0 to 7.
`ion_mode`    | Boolean | This property indicates whether or not to use the cluster ion-based air purifier function. If it is used, this value is `true`. Otherwise, this value is `false`.
`ion_state`   | Boolean | This property indicates whether or not to use the function to
automatically control the degree of the cluster ion-based air purification. If it is automatic, this value is `true`. If it is non-automatic, this value is `false`.
`ion_level`   | Number  | This property indicates the cluster ion-based air purification level as an integer in the range of 0 to 7.

#### Mounted air refresh method
* EPC: `0xC8`

Property      | Type    | Description
:-------------|:--------|:-----------
`minus`       | Boolean | This property indicates whether the minus ion method is mounted or not as an air refresh method. If it is mounted, this value is `true`. Otherwise, this value is `false`.
`cluster`     | Boolean | This property indicates whether the cluster ion method is mounted or not as an air cleaning method. If it is mounted, this value is `true`. Otherwise, this value is `false`.

#### Air refresher function setting
* EPC: `0xC9`

Property        | Type    | Description
:---------------|:--------|:-----------
`minus_mode`    | Boolean | This property indicates whether or not to use the minus ion-based air refresher function. If it is used, this value is `true`. Otherwise, this value is `false`.
`minus_state`   | Boolean | This property indicates whether or not to use the function to
automatically control the degree of the minus ion-based air refresher. If it is automatic, this value is `true`. If it is non-automatic, this value is `false`.
`minus_level`   | Number  | This property indicates the minus ion-based air refreshing level as an integer in the range of 0 to 7.
`cluster_mode`  | Boolean | This property indicates whether or not to use the cluster ion-based air refresher function. If it is used, this value is `true`. Otherwise, this value is `false`.
`cluster_state` | Boolean | This property indicates whether or not to use the function to
automatically control the degree of the cluster ion-based air refresher. If it is automatic, this value is `true`. If it is non-automatic, this value is `false`.
`cluster_level` | Number  | This property indicates the cluster ion-based air refreshing level as an integer in the range of 0 to 7.

#### Mounted self-cleaning method
* EPC: `0xCA`

Property      | Type    | Description
:-------------|:--------|:-----------
`ozone`       | Boolean | This property indicates whether the ozone cleaning method is mounted or not as an self-cleaning method. If it is mounted, this value is `true`. Otherwise, this value is `false`.
`drying`     | Boolean | This property indicates whether the drying cleaning method is mounted or not as an self-cleaning method. If it is mounted, this value is `true`. Otherwise, this value is `false`.

#### Air refresher function setting
* EPC: `0xCB`

Property        | Type    | Description
:---------------|:--------|:-----------
`ozone_mode`    | Boolean | This property indicates whether or not to use the ozone-based self-cleaning function. If it is used, this value is `true`. Otherwise, this value is `false`.
`ozone_state`   | Boolean | This property indicates whether or not to use the function to
automatically control the degree of the ozone-based self-cleaning. If it is automatic, this value is `true`. If it is non-automatic, this value is `false`.
`ozone_level`   | Number  | This property indicates the ozone-based self-cleaning level as an integer in the range of 0 to 7.
`drying_mode`   | Boolean | This property indicates whether or not to use the ozone-based self-cleaning function. If it is used, this value is `true`. Otherwise, this value is `false`.
`drying_state`  | Boolean | This property indicates whether or not to use the function to
automatically control the degree of the drying-based self-cleaning. If it is automatic, this value is `true`. If it is non-automatic, this value is `false`.
`drying_level`  | Number  | This property indicates the drying-based self-cleaning level as an integer in the range of 0 to 7.

#### Special function setting
* EPC: `0xCC`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Number  | This property indicates whether or not to use the "special function" as a code.
`desc`        | String  | The description of the code.

The code map is as follows. Each code is shown as decimal representation:

Code      | Description (English)            | Description (Japanese)
:---------|:---------------------------------|:----------------------
0         | No setting                       | 設定なし
1         | Clothes dryer function           | 衣類乾燥
2         | Condensation suppressor function | 結露抑制
3         | Mite and mold control function   | ダニカビ抑制
4         | Active defrosting function       | 強制除霜

If you only read this `EDT` object, you don't need to know the code map above. It is enough to see the value of the `desc` property.

If you want to create an ECHONET Lite packet to send, the `desc` property is not required.

#### Operation status of components
* EPC: `0xCD`

This property indicates the operation status of components of the air conditioner in a bitmap format.

Property      | Type    | Description
:-------------|:--------|:-----------
`compressor`  | Boolean | This property indicates whether the compressor is operating or not. If it is operating, this value is `true`. Otherwise, this value is `false`.
`thermostat`  | Boolean | This property indicates whether the thermostat is in the state of "ON" or not ("OFF"). If it is in the state of "ON", this value is `true`. If it is in the state of "OFF", this value is `false`.

#### Thermostat setting override function
* EPC: `0xCE`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Number  | This property indicates whether or not to allow the air conditioner to operate ignoring its thermostat setting as a code.
`desc`        | String  | The description of the code.

The code map is as follows. Each code is shown as decimal representation:

Code      | Description (English) | Description (Japanese)
:---------|:----------------------|:----------------------
0         | Normal setting        | 通常設定
1         | ON                    | ON
2         | OFF                   | OFF

If you only read this `EDT` object, you don't need to know the code map above. It is enough to see the value of the `desc` property.

If you want to create an ECHONET Lite packet to send, the `desc` property is not required.

#### Air purification mode setting
* EPC: `0xCF`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Boolean | This property indicates the air purification mode setting (ON or OFF). If it is set to "ON", this value is `true`. If it is set to "OFF", this value is `false`.

#### Buzzer
* EPC: `0xD0`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Boolean | This property is used to make the buzzer sound. If this property is set to `true`, the buzzer will sound. This property is allowed only `true` for the value.

#### ON timer-based reservation setting
* EPC: `0x90`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Number  | This property indicates whether or not to use the ON timer (time-based reservation function, relative time-based reservation function or both) as a code.
`desc`        | String  | The description of the code.

The code map is as follows. Each code is shown as decimal representation:

Code      | Description (English) | Description (Japanese)
:---------|:----------------------|:----------------------
1         | Both the time- and relative time-based reservation functions are ON | 時刻予約,相対時間予約共に入
2         | Both reservation functions are OFF | 予約切
3         | Time-based reservation function is ON | 時刻予約のみ入り
4         | Relative time-based reservation function is ON | 相対時刻予約のみ入り

If you only read this `EDT` object, you don't need to know the code map above. It is enough to see the value of the `desc` property.

If you want to create an ECHONET Lite packet to send, the `desc` property is not required.

#### ON timer setting (time)
* EPC: `0x91`

Property      | Type    | Description
:-------------|:--------|:-----------
`time`        | String  | This property indicates the time for the time-based reservation function in the "HH:MM" format in the range of "00:00" to "23:59".

#### ON timer setting (relative time)
* EPC: `0x92`

Property      | Type    | Description
:-------------|:--------|:-----------
`time`        | String  | This property indicates the relative time for the relative time-based reservation function in the "HHH:MM" format in the range of "00:00" to 255:59".

#### OFF timer-based reservation setting
* EPC: `0x94`

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Number  | This property indicates whether or not to use the OFF timer (time-based reservation function, relative time-based reservation function or both) as a code.
`desc`        | String  | The description of the code.

The code map is as follows. Each code is shown as decimal representation:

Code      | Description (English) | Description (Japanese)
:---------|:----------------------|:----------------------
1         | Both the time- and relative time-based reservation functions are ON | 時刻予約,相対時間予約共に入
2         | Both reservation functions are OFF | 予約切
3         | Time-based reservation function is ON | 時刻予約のみ入り
4         | Relative time-based reservation function is ON | 相対時刻予約のみ入り

If you only read this `EDT` object, you don't need to know the code map above. It is enough to see the value of the `desc` property.

If you want to create an ECHONET Lite packet to send, the `desc` property is not required.

#### OFF timer setting (time)
* EPC: `0x95`

Property      | Type    | Description
:-------------|:--------|:-----------
`time`        | String  | This property indicates the time for the time-based reservation function in the "HH:MM" format in the range of "00:00" to "23:59".

#### OFF timer setting (relative time)
* EPC: `0x96`

Property      | Type    | Description
:-------------|:--------|:-----------
`time`        | String  | This property indicates the relative time for the relative time-based reservation function in the "HHH:MM" format in the range of "00:00" to 255:59".
