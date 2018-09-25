import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function Button(props) {
  const className = classnames(
    'mb-2 mr-2 text-white font-bold py-2 px-4 rounded',
    `bg-${props.color}`,
    `hover:bg-${props.color}-dark`,
    { block: props.block }
  );
  return (
    <button type="button" className={className} onClick={props.onClick}>
      {props.description}
    </button>
  );
}

Button.propTypes = {
  color: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func
};
