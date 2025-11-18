# @hard-edging/privacy

Privacy annotations, schemas, and leak detection for Hard-Edging. It exists to make sure that when you say “share this”, you really mean it — and when you don’t, the mesh respects that boundary.

This package gives you tools to describe **what data is allowed to escape the current browser**, and in which direction:

- Mark data as `shareable`, `private`, or `room-local`
- Enforce those policies at runtime before anything leaves the tab
- Log suspicious flows so you can debug “why did this ever leave my machine?”

Where the rest of Hard‑Edging is about moving bytes freely, `@hard-edging/privacy` is about deciding which bytes deserve a quieter life.

