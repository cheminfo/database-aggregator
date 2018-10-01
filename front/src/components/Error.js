import React from 'react';
import propTypes from 'prop-types';

export default function Error(props) {
  const { message } = props;
  return (
    <div className="text-center m-6 p-4 bg-red-lighter rounded font-bold">
      Error: {message}
    </div>
  );
}

Error.propTypes = {
  message: propTypes.string.isRequired
};
