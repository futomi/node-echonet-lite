The `EDT` object specification for the node-echonet-lite
===============

## Cooking/Household-related Device Class Group
* Class group code: `0x03`

The node-echonet-lite module support the classes in this class group as follows:

* [Combination microwave oven (Electronic oven) class (Class code: `0xB8`)](#class-B8)

---------------------------------------
### <a id="class-B8">Combination microwave oven (Electronic oven) class</a>
* Class group code: `0x03`
* Class code: `0xB8`

#### Operation status
* EPC: `0x80`
* Access rule: Set/Get

This property indicates the ON/OFF status.

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean |  If the ON/OFF status is ON, this value is `true`, otherwise `false`.

#### Door open/close status
* EPC: `0xB0`
* Access rule: Get

This property is used to acquire the status (i.e. open or closed) of the door of the combination microwave oven.

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | if the door is open, this value is `true`, otherwise `false`.

#### Heating status
* EPC: `0xB1`
* Access rule: Get

This property is used to acquire the status of the combination microwave oven.

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Integer | Status code (See below for details)
`desc`        | String  | Description of the status.

The values of the `status` and the corresponding descriptions are as follows:

Code   | Description (English)                                 | Description (Japanese)
:------|:------------------------------------------------------|:----------------------
`0`    | Initial state                                         | 初期状態
`1`    | Heating                                               | 運転中
`2`    | Heating suspended                                     | 一時停止中
`3`    | Reporting completion of heating cycle                 | 完了報知中
`4`    | Setting                                               | 設定中
`5`    | Preheating                                            | 予熱中
`6`    | Preheat temperature maintenance                       | 予熱完了保温中
`7`    | Heating temporarily stopped for manual cooking action | 加熱途中報知一時停止中

#### Heating setting
* EPC: `0xB2`
* Access rule: Set/Get

This property is used to specify whether to start, stop or suspend heating, and to acquire the current setting (i.e. current heating status).

Property      | Type    | Description
:-------------|:--------|:-----------
`action`      | Integer | Action code (See below for details)
`desc`        | String  | Description of the status. (only when acquiring data)

The values of the `action` and the corresponding descriptions are as follows:

Code   | Description (English)                             | Description (Japanese)
:------|:--------------------------------------------------|:----------------------
`1`    | Start/restart heating (heating started/restarted) | 加熱開始・再開
`2`    | Suspend heating (heating suspended)               | 加熱一時停止
`3`    | Stop heating (heating stopped)                    | 加熱停止

#### Heating mode setting
* EPC: `0xE0`
* Access rule: Set/Get

This property is used to specify the heating mode of the combination microwave oven, and to acquire the current setting (i.e. current mode).

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Integer | Mode code (See below for details)
`desc`        | String  | Description of the status. (only when acquiring data)

The values of the `mode` and the corresponding descriptions are as follows:

Code   | Description (English)       | Description (Japanese)
:------|:----------------------------|:----------------------
`1`    | Microwave heating           | 電子レンジ加熱
`2`    | Defrosting                  | 解凍
`3`    | Oven                        | オーブン
`4`    | Grill                       | グリル
`5`    | Toaster                     | トースト
`6`    | Fermenting                  | 発酵
`7`    | Stewing                     | 煮込み
`8`    | Steaming                    | スチーム加熱
`17`   | Two-stage microwave heating | 電子レンジ２段加熱

The value of the `mode` could be `null`, which means that the mode is not specified.

#### Automatic heating setting
* EPC: `0xE1`
* Access rule: Set/Get

This property is used to specify whether or not to use the combination microwave oven’s automatic heating mode, and to acquire the current setting.

Property      | Type    | Description
:-------------|:--------|:-----------
`mode`        | Integer | Mode code (See below for details)
`desc`        | String  | Description of the status. (only when acquiring data)

The values of the `mode` and the corresponding descriptions are as follows:

Code   | Description (English) | Description (Japanese)
:------|:----------------------|:----------------------
`1`    | Automatic             | 自動
`2`    | Manual                | マニュアル

The value of the `mode` could be `null`, which means that the mode is not specified.

#### Automatic heating setting
* EPC: `0xE2`
* Access rule: Set/Get

This property is used to specify, by selecting a level from among the five predefined levels, the level of automatic heating for the option specified by the “automatic heating menu setting” property, and to acquire the current setting.

Property      | Type    | Description
:-------------|:--------|:-----------
`level`       | Integer | 1 - 5 (lowest to highest)

The value of the `level` could be `null`, which means that the mode is not specified.