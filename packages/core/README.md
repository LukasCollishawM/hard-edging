# @hard-edging/core

Hard-Edging core runtime: shared types, CRDT-backed documents, and the basic wiring needed to let your users' browsers do the hard work while your servers stay suspiciously idle.

Think of this package as the **grammar of the mesh**: IDs, configs, asset descriptors, and the logic that decides whether a byte should take the long way (origin) or the short way (some other tab that already suffered for it).

Instead of assuming “there will be a CDN”, `@hard-edging/core` assumes there will be **other people**: other peers, other event loops, other machines willing to cache and forward your assets because they happened to be there first.

