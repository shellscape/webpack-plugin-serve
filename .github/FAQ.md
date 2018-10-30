## Frequently Asked Questions

#### The `[::]` URI is odd, what is that?

With Node v8+, servers which inherit from [`net.Server`](https://nodejs.org/api/net.html#net_class_net_server) will automatically choose an IPv6 hostname when one is not specified. This plugin chooses not to enforce IPv4 when a host is not provided, but rather lets the underlying system behave according to its defaults.

IPv6 can be unfamiliar territory for users, and the rules around IPv6 addresses are rather different than IPv4. According to [Wikipedia](https://en.wikipedia.org/wiki/IPv6_address#Representation):

> The localhost (loopback) address, 0:0:0:0:0:0:0:1, and the IPv6 unspecified address, 0:0:0:0:0:0:0:0, are reduced to ::1 and ::, respectively.

Since `net.Server` uses `0:0:0:0:0:0:0:0` (an unspecified address) by default, the resulting representation is `::`, which is the zero-compressed representation of the unspecified address. Since that's not at all valid in a browser's address bar, and `::` isn't a valid URI in that scope, `::` is represented as `[::]` in URI format. Hence, the URI you see from the server by default looks something like `http://[::]:55555`.

#### Why doesn't the server default to `localhost`?

This plugin is used by a plethora of different users with different needs. As soon as `localhost` is made the default, users will inevitably ask for `0.0.0.0`, `127.0.0.0`, etc. In order to avoid the debate entirely, we allow the Node subsystems and [`net.Server`](https://nodejs.org/api/net.html#net_class_net_server) to behave in their default manner.
