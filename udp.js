module.exports = function (host, port, msg, callback) {
  const message = new Buffer(msg[0], 'ascii');
  const dgram = require('dgram');
  const client = dgram.createSocket('udp4');
  client.bind(() => {
    client.setBroadcast(true);
  });


  client.on('listening', () => {
    const address = client.address();
  });

  client.on('message', function (message, remote) {

    let deviceidsame = false;
    let operation = {};

    message.toString().split("&").forEach((elem) => {
      const index = elem.split("=")[0]
      const data = elem.split("=")[1]

      if (index == "dev")
        if (data == msg[1]) deviceidsame = true
      if (index == "op") operation = JSON.parse(data)
    })

    if (deviceidsame) {

      try {
        client.close();
        if (msg[2] == "getServices") {
          callback(null, (operation["soft_poweroff"] == 0 ? true : false));
        } else {
          callback(null, remote.address + ':' + remote.port + ' - ' + message);
        }
      } catch (e) { }
    }
  }
  );


  client.send(message, 0, message.length, port, host, function (err, bytes) {
    if (err) throw err;

    setTimeout(() => { try { client.send(message, 0, message.length, port, host, function (err, bytes) { if (err) throw err; }); } catch (e) { } }, 250);
    setTimeout(() => { try { client.send(message, 0, message.length, port, host, function (err, bytes) { if (err) throw err; }); } catch (e) { } }, 500);
    setTimeout(() => { try { client.send(message, 0, message.length, port, host, function (err, bytes) { if (err) throw err; }); } catch (e) { } }, 750);
    setTimeout(() => { try { client.send(message, 0, message.length, port, host, function (err, bytes) { if (err) throw err; }); } catch (e) { } }, 1000);
    
    setTimeout(() => {
      try {
        client.close();
        callback(err, "timeout");
      } catch (e) { }
    }, 1250);

  })
}
