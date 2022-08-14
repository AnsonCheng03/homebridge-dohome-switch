# homebridge-dohome-switch

DoHome Power Switch - Control 'Doit' / 'Dohome' power switch devices

*


_________________________________________

## Switch Services

### Switch (standard on/off)

```
{
    "accessory": "DoHomeSwitch",
    "name": "65ff",
    "host": "192.168.0.255",
    "port": 6091,
    "deviceid": "955sga0g65ff_DT-PLUG_HOMEKIT"
}
```

## Configuration Params

|             Parameter            |                       Description                       | Required |
| -------------------------------- | ------------------------------------------------------- |:--------:|
| `name`                           | Usually Last 4 Character of Mac Address                 |          |
| `host`                           | Your Subnet                                             |     ✓    |
| `port`                           | 6091 (default)                                          |          |
| `deviceid`                       |                                                         |     ✓    |



## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install homebridge-http using: `npm install -g homebridge-dohome-switch`
3. Update your config file


## Referenced project
1. homebridge-udp-json-master
2. homebridge-udp-multiswitch-master
