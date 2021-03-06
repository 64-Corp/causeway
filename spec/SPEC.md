Causeway #0.1.0
======

### Description
Causeway is secure method for one nodejs server to interface with another a Redis server with a client-API like relationship. Redis pub/sub is utilized for communication since it's reliable, fast and secure.

### Features
- Register multiple Redis servers
- Select a Redis server to communicate using
- Client and API handshake mechanism to register connection
- API listens to incoming messages from a certain registered client
- Send data from client to API, recieve results of message
- API recieves message from client, returns a response

### Security
Since the project leverages Redis for any network communication, security should be inherently secure. This is the main reason for using redis instead of messaging directly using websockets or http.

### Concerns
- Each client-api connection requires around 5 Redis clients, scaling with this may become an issue. Paid cloud redis servers usually tier their plans depending on how many clients your servers require, this could get expensive quickly.
- I am unsure of how this service will behave when using a cluster or redis or node servers.

### Dependancies
- [node-redis](https://github.com/mranney/node_redis) for redis communication
