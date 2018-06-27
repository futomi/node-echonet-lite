The `EDT` object specification for the node-echonet-lite
===============

## Profile class group
* Class group code: `0x0E`

The node-echonet-lite module support the classes in this class group as follows:

* [Profile object super class (Class code: N/A)](#class-00)
* [Node profile class (Class code: `0xF0`)](#class-F0)

---------------------------------------
### <a name="class-00">Profile object super class</a>
* Class group code: `0x0E`
* Class code: N/A

#### Fault status
* EPC: `0x88`

Property      | Type    | Description
:-------------|:--------|:-----------
`fault`       | Boolean | This property indicates whether a fault has occurred or not. If a fault has occurred, this value is `true`, otherwise `false`.

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

---------------------------------------
### <a name="class-F0">Node profile class</a>
* Class group code: `0x0E`
* Class code: `0xF0`

#### Operation status
* EPC: `0x80`

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | This property indicates the node operating status. If the device is booting, this value is `true`, otherwise `false`.

#### Version information
* EPC: `0x82`

Property      | Type    | Description
:-------------|:--------|:-----------
`version`     | String  | This property indicates ECHONET Lite version used by communication middleware (e.g. "2.1").
`type`        | Number  | This property indicates message types supported by communication middleware as a code.

The value of `type` must be an integer 1 or 2. The code map is as follow. Each code is shown as decimal representation:

Code      | Type (English)           | Type (Japanese)
:---------|:-------------------------|:---------------
`1`       | Specified message format | 規定電文形式
`2`       | Arbitrary message format | 任意電文形式

#### <a id="EPC-0E-F0-83">Identification number</a>
* EPC: `0x83`

Property      | Type    | Description
:-------------|:--------|:-----------
`code`        | Number  | This property indicates the manufacturer code as an integer.
`uid`         | String  | This property indicates the unique ID defined by the manufacturer as hexadecimal representation.
`name`        | String  | This property indicates the manufacturer name corresponding to the manufacturer code. If the name corresponding to the code is not known, this value is set to an empty string.

The mapping of manufacturer code and name are not disclosed by [ECHONET CONSORTIUM](https://echonet.jp/english/). For now, the mapping is really poor because it depends on the devices I have personally.  If you try this EPC, please let me know the code and the web page that the device is introduced.

#### Fault content
* EPC: `0x89`

Property      | Type    | Description
:-------------|:--------|:-----------
`code1`       | Number  | Fault description code (Higher-order byte)
`code2`       | Number  | Fault description code (Lower-order byte)
`desc`        | String  | Fault description

The Fault content is expressed using 2 bytes (`code1` and `code2`).

#### Unique identifier data
* EPC: `0xBF`

Property      | Type    | Description
:-------------|:--------|:-----------
`uid`         | Number  | This property indicates the unique identifier data as 2 bytes hexadecimal representation (e.g. "FFFF").

#### Number of self-node instances
* EPC: `0xD3`

Property      | Type    | Description
:-------------|:--------|:-----------
`num`         | Number  | This property indicates the total number of instances held by self-node.

The value of the `num` property must be an integer in the range of 0 to `0xFFFFFF`.

#### Number of self-node classes
* EPC: `0xD4`

Property      | Type    | Description
:-------------|:--------|:-----------
`num`         | Number  | This property indicates the total number of classes held by self-node.

The value of the `num` property must be an integer in the range of 0 to `0xFFFF`.

#### Instance list notification
* EPC: `0xD5`

Property      | Type    | Description
:-------------|:--------|:-----------
`list`        | Array   | This property indicates the list of the EOJs (a set of class group code, class code, and instance code) when self-node instance configuration is changed.

Each EOJ must be an Array consisting of 3 codes (class group code, class code, and instance code). That is, the value of `list` is an Array consisting multiple Array. The structure of this `EDT` object looks like this:

```
{
  'list': [
    [0x01, 0x30, 0x01],
    [0x0E, 0xF0, 0x01]
  ]
}
```

#### Self-node instance list S
* EPC: `0xD6`

Property      | Type    | Description
:-------------|:--------|:-----------
`list`        | Array   | This property indicates the self-node instance list. The list consists of the EOJs (a set of class group code, class code, and instance code).

Each EOJ must be an Array consisting of 3 codes (class group code, class code, and instance code). That is, the value of `list` is an Array consisting multiple Array. The structure of this `EDT` object looks like this:

```
{
  'list': [
    [0x01, 0x30, 0x01],
    [0x0E, 0xF0, 0x01]
  ]
}
```

#### Self-node class list S
* EPC: `0xD7`

Property      | Type    | Description
:-------------|:--------|:-----------
`list`        | Array   | This property indicates the self-node class list. Each element in the list consists class group code and class code.

Each set must be an Array consisting of 2 codes (class group code and class code). That is, the value of `list` is an Array consisting multiple Array. The structure of this `EDT` object looks like this:

```
{
  'list': [
    [0x01, 0x30],
    [0x0E, 0xF0]
  ]
}
```
