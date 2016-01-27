'use strict';

module.exports = {
    sources: {
        miscelaneous(values, result) {
            if (values && values[0]) {
                var value=values[0];
                result.mf={};
                result.mf.value=value.mf;
                result.mf.exactMass=value.exactMass;
                result.mf.mw=value.mw;
                result.info={};
                result.info.rn=value.rn;
                result.molfile=value.molfile;
            }
        },
        prices(values, result) {
            result.prices=values;
        },
        names(values, result) {
            result.names=values.map(
                value => value.name
            );
        }
    }
};
