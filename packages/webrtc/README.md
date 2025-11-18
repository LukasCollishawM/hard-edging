# @hard-edging/webrtc

WebRTC mesh management and signalling helpers for Hard-Edging. This package is responsible for wiring browsers directly together so that “the network” stops being an abstract cloud and starts being the other tabs you forgot you had open.

`@hard-edging/webrtc` handles:

- Signalling via the broker
- Peer connection lifecycle (`RTCPeerConnection` and data channels)
- Asset request/response routing over reliable data channels
- Simple metrics, so you can see who’s doing the sharing and who’s freeloading

It doesn’t try to be a video stack or a full SFU. It just wants to make sure that when one browser has already paid the cost for an asset, the others can politely ask for a copy.

