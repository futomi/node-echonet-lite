The `EDT` object specification for the node-echonet-lite
===============

## Housing/Facilities-related Device Class Group
* Class group code: `0x02`

The node-echonet-lite module support the classes in this class group as follows:

* [Low-voltage smart electric energy meter class (Class code: `0x88`)](#class-88)

---------------------------------------
### <a name="class-88">Low-voltage smart electric energy meter class</a>
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
`coefficient` | Number  | This property indicates the coefficient for converting measured cumulative amount of electric energy and historical data to actual usage amount.

The value of the `coefficient` must be an integer in the range of 0 to 999999.

#### Number of effective digits for cumulative amounts of electric energy
* EPC: `0xD7`

Property      | Type    | Description
:-------------|:--------|:-----------
`digit`       | Number  | This property indicates the number of effective digits for measured cumulative amounts of electric energy.

The value of the `digit` must be an integer in the range of 1 to 8.

#### Measured cumulative amount of electric energy (normal direction)
* EPC: `0xE0`

Property      | Type    | Description
:-------------|:--------|:-----------
`energy`      | Number  | This property indicates the measured cumulative amount of electric energy in units of "kWh".

The value of the `energy` must be an integer in the range of 0 to 99999999.

#### Unit for cumulative amounts of electric energy (normal and reverse directions)
* EPC: `0xE1`

Property      | Type    | Description
:-------------|:--------|:-----------
`unit`        | Number  | This property indicates the unit (multiplying factor) used for the measured cumulative amount of electric energy and the historical data of measured cumulative amounts of electric energy. This value is a float number such as 1, 0.1, 0.01, 10, 100, etc.

The value of the `unit` must be an float which is either 1.0, 0.1, 0.01, 0.001, 0.0001, 10, 100, 1000, or 10000 (kWh).

#### Historical data of measured cumulative amounts of electric energy 1 (normal direction)
* EPC: `0xE2`

Property      | Type    | Description
:-------------|:--------|:-----------
`day`         | Number  | This property indicates the day for which the historical data of measured cumulative amounts of electric energy is to be retrieved.
`history`     | Array   | This property indicates the historical data of measured cumulative amounts of electric energy (normal direction), which consists of 48 items of half-hourly data for the preceding 24 hours (00:00 to 23:30) of the day by time series. This value is an Array object.

The value of the `day` property must be an integer in the range of 0 to 99.

The value of the `history` must be an Array object. The number of the elements in the Array object must be equal to or less than 48. Each element in the Array must be an integer in the range of 0 to 99999999.

Note that each element in the Array is meaningless by itself. In order to know the meaningful value, the coefficient (the EPC is `0xD3`) and the unit (the EPC is `0xE1`) are essential. If the targeted device doesn't support the unit (the EPC is `0xE1`), then the unit must be assumed to be 1 kWh.

#### Measured cumulative amounts of electric energy (reverse direction)
* EPC: `0xE3`

Property      | Type    | Description
:-------------|:--------|:-----------
`energy`      | Number  | This property indicates the measured cumulative amounts of electric energy in units of "kWh".

The value of the `energy` must be an integer in the range of 0 to 99999999.

#### Historical data of measured cumulative amounts of electric energy 1 (reverse direction)
* EPC: `0xE4`

Property      | Type    | Description
:-------------|:--------|:-----------
`day`         | Number  | This property indicates the day for which the historical data of measured cumulative amounts of electric energy is to be retrieved.
`history`     | Array   | This property indicates the historical data of measured cumulative amounts of electric energy ((reverse direction), which consists of 48 items of half-hourly data for the preceding 24 hours (00:00 to 23:30) of the day by time series. This value is an Array object.

The value of the `day` property must be an integer in the range of 0 to 99.

The value of the `history` must be an Array object. The number of the elements in the Array object must be equal to or less than 48. Each element in the Array must be an integer in the range of 0 to 99999999.

Note that each element in the Array is meaningless by itself. In order to know the meaningful value, the coefficient (the EPC is `0xD3`) and the unit (the EPC is `0xE1`) are essential. If the targeted device doesn't support the unit (the EPC is `0xE1`), then the unit must be assumed to be 1 kWh.

#### Day for which the historical data of measured cumulative amounts of electric energy is to be retrieved 1
* EPC: `0xE5`

Property      | Type    | Description
:-------------|:--------|:-----------
`day`         | Number  | This property indicates the day for which the historical data of measured cumulative amounts of electric energy (which consists of 48 items of half-hourly data for the preceding 24 hours) is to be retrieved.


The value of the `day` must be an integer in the range of 0 to 99.

#### Measured instantaneous electric energy
* EPC: `0xE7`

Property      | Type    | Description
:-------------|:--------|:-----------
`energy`      | Number  | This property indicates the measured effective instantaneous electric energy in 1W unit.

The value of the `energy` must be an integer in the range of -2147483647 to 2147483645.

#### Measured instantaneous currents
* EPC: `0xE8`

Property      | Type    | Description
:-------------|:--------|:-----------
`r`           | Number  | This property indicates the measured effective instantaneous R phase currents in 1A unit.
`t`           | Number  | This property indicates the measured effective instantaneous T phase currents in 1A unit.

The value of the `r` and `t` must be an integer in the range of -3276.7 to 3276.5. If the targeted smarter meter is a single-phase, two-wire system, the value of the `t` property will be 3276.6.

#### Cumulative amounts of electric energy measured at fixed time (normal direction)
* EPC: `0xEA`

This property indicates the most recent cumulative amount of electric energy (normal direction) measured at 30-minute intervals held by the meter. This EDT includes the date of measurement, time of measurement, and the cumulative electric energy (normal direction).

Property      | Type    | Description
:-------------|:--------|:-----------
`date`        | String  | This property indicates the date of measurement in form of "YYYY-MM-DD".
`time`        | String  | This property indicates the time of measurement in form of "HH:MM:SS".
`energy`      | Number  | This property indicates the cumulative electric energy (normal direction)

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
`energy`      | Number  | This property indicates the cumulative electric energy (reverse direction)

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
`number`      | Number  | This property indicates the number of the collection.
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
`number`      | Number  | This property indicates the number of segments.

The value of the `number` property must be an integer in the range of 1 to 12.

When you read this EDT object, if both the `date` and the `time` is an empty string and the value of the `number` property is 1, it means that the date and time for this EDT have not been set yet. If you want to create such an EDT object, specify an empty hash object (i.e. `{}`) as an EDT object.
