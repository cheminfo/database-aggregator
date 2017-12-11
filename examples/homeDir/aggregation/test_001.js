'use strict';
module.exports = {
    disabled: false,
    sources: {
        test_001: function (data, result, pid, id) {
            if (data.length > 1) {
                throw new Error('Expecting only one element here');
            }
            if (data.length === 0) {
                return result;
            }
            data = data[0];
            if (!result.header) result.header = {};
            if (data.value2) {
                result.header.description = data.value2;
            }
            if (data.value1) {
                result.header.name = data.value1;
            }
            return result;
        }
    }
};
