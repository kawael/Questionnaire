var crypto = require('crypto');

exports.algorithm ='aes-256-ctr';
exports.password = 'd6F3Efeq';

exports.encrypt = function(text) {
    var cipher = crypto.createCipher(exports.algorithm, exports.password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

exports.decrypt = function(text) {
    var decipher = crypto.createDecipher(exports.algorithm, exports.password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};