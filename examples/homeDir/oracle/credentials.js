'use strict';

/*
  Common credentials for Oracle connections
*/

exports.mydb = {
    user: 'superuser',
    password: 'mysecretpass',
    connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=myhost.com)(PORT=1522))(CONNECT_DATA=(SERVER=DEDICATED)(SID=mysid)))'
};
