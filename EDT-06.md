The `EDT` object specification for the node-echonet-lite
===============

## Audiovisual-related Device Class Group
* Class group code: `0x06`

The node-echonet-lite module support the classes in this class group as follows:

* [Display class (Class code: `0x01`)](#class-01)

---------------------------------------
### <a id="class-01">Display class</a>
* Class group code: `0x06`
* Class code: `0x01`

#### Operation status
* EPC: `0x80`
* Access rule: Set/Get

This property indicates the ON/OFF status.

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean |  If the ON/OFF status is ON, this value is `true`, otherwise `false`.

#### Display control setting
* EPC: `0xB0`
* Access rule: Set/Get

This property is used to set the status as to whether the displaying of characters is enabled or disabled and acquires the current setting.

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Boolean | if displaying enabled, this value is `true`, otherwise `false`.

#### Character string setting acceptance status
* EPC: `0xB1`
* Access rule: Get

This property indicates whether or not the device is ready to accept the character string to present to the user

Property      | Type    | Description
:-------------|:--------|:-----------
`status`      | Integer | If redy, this value is `true`, otherwise `false`.


#### Supported character codes
* EPC: `0xB2`
* Access rule: Get

This property indicates the implemented character codes that can be used to present character strings.

Property      | Type    | Description
:-------------|:--------|:-----------
`list`        | Array   | List of character set names.

```json
{
  "list": [
    "ascii",
    "shift_jis",
    "jis",
    "euc-jp",
    "ucs-4",
    "ucs-2",
    "latin-1",
    "utf-8"
  ]
}
```

#### Character string to present to the user
* EPC: `0xB3`
* Access rule: Set/Get

This property is used to sets the character string to present to the user.

Property      | Type    | Description
:-------------|:--------|:-----------
`string`      | String  | Character string

This module supports only UTF-8.

#### Length of character string accepted
* EPC: `0xB4`
* Access rule: Get

This property indicates the total number of bytes of the newest character string to present to the user which has been set and is being held.

Property      | Type    | Description
:-------------|:--------|:-----------
`length`      | Integer | Total number of bytes

