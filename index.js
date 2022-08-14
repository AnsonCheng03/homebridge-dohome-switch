'use strict';

let Service;
let Characteristic;
const udp = require('./udp');

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory('homebridge-dohome-switch', 'DoHomeSwitch', DoHomeSwitch);
};

function DoHomeSwitch(log, config) {
    this.log = log;
    this.name = config.name || 'DoHome Switch';
    this.host = config.host || '192.168.1.255';
    this.port = config.port || 6091;
    this.deviceid = config.deviceid || this.name + "_DT-PLUG_HOMEKIT"
}

DoHomeSwitch.prototype = {

    udpRequest: function (host, port, message, callback) {
        udp(host, port, message, function (err, returnmsg) {
            callback(err, returnmsg);
        });
    },

    setPowerState: function (targetService, powerState, callback, context) {

        // Callback safety
        if (context == 'fromSetPowerState') {
            if (callback) callback();
            return;
        }

        if (!this.name) {
            this.log.warn('No device specified');
            return;
        }

        const message =
            [
                powerState ?
                    "cmd=ctrl&devices={[" + this.name + "]}&op={\"cmd\":5, \"op\":1}" :
                    "cmd=ctrl&devices={[" + this.name + "]}&op={\"cmd\":5, \"op\":0}",
                this.deviceid
            ];

        this.udpRequest(this.host, this.port, message, function (error, returnmsg) {
            if (error) {
                this.log.error('setPowerState failed: ' + error.message);
                this.log('response: ' + response + '\nbody: ' + responseBody);
                callback(error);
            } else {
                this.log.info(returnmsg);
                if (returnmsg == "timeout") {
                    callback("timeout");
                } else {
                    this.log.info('==> ' + (powerState ? "On" : "Off"));
                }
            }
            callback();
        }.bind(this));

    },

    identify: function (callback) {
        callback();
    },

    getServices: function () {
        this.services = [];
        const informationService = new Service.AccessoryInformation();
        informationService
            .setCharacteristic(Characteristic.Manufacturer, 'www.doiting.com')
            .setCharacteristic(Characteristic.Model, 'DoHome-PA')
            .setCharacteristic(Characteristic.SerialNumber, this.deviceid);
        this.services.push(informationService);

        const switchService = new Service.Switch(this.name);

        //Get current state
        let loopcount = 0;
        function loopuntilsuccess(wrapper, message) {
            wrapper.udpRequest(wrapper.host, wrapper.port, message, function (error, returnmsg) {
                if (error) {
                    wrapper.log.error('setPowerState failed: ' + error.message);
                    wrapper.log('response: ' + response + '\nbody: ' + responseBody);
                    callback(error);
                } else {
                    if (returnmsg == "timeout") {
                        loopcount++;
                        if (loopcount < 10)
                            loopuntilsuccess(wrapper, message)
                        else 
                        switchService.setCharacteristic(Characteristic.On,false)

                    } else {
                        switchService.setCharacteristic(Characteristic.On,returnmsg)
                    }
                }
                callback();
            }.bind(this));
        }
        
        loopuntilsuccess(this, [
            "cmd=ctrl&devices={[" + this.name + "]}&op={\"cmd\":25}",
            this.deviceid,
            "getServices"
        ])

        //Append State
        switchService
            .getCharacteristic(Characteristic.On)
            .on('set', this.setPowerState.bind(this, switchService))
        this.services.push(switchService);
        return this.services;
    }
};
