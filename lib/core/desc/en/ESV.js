/* ------------------------------------------------------------------
* ESV
* ---------------------------------------------------------------- */
module.exports = {
	0x60: 'Property value write request (no response required) (SetI)',
	0x61: 'Property value write request (response required) (SetC)',
	0x62: 'Property value read request (Get)',
	0x63: 'Property value notification request (INF_REQ)',
	0x6E: 'Property value write & read request (SetGet)',
	0x71: 'Property value Property value write response (Set_Res)',
	0x72: 'Property value read response (Get_Res)',
	0x73: 'Property value notification (INF)',
	0x74: 'Property value notification (response required) (INFC)',
	0x7A: 'Property value notification response (INFC_Res)',
	0x7E: 'Property value write & read response (SetGet_Res)',
	0x50: 'Property value write request "response not possible" (SetI_SNA)',
	0x51: 'Property value write request "response not possible" (SetC_SNA)',
	0x52: 'Property value read "response not possible" (Get_SNA)',
	0x53: 'Property value notification "response not possible" (INF_SNA)',
	0x5E: 'Property value write & read "response not possible" (SetGet_SNA)'
};
