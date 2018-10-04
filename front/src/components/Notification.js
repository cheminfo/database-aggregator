import React from 'react';

import SvgClose from './svg/Close';

const Notification = ({ id, title, description, onClose }) => {
  return (
    <div className="w-64 p-2 border border-t-4 border-green-light m-4 bg-green-lightest">
      <SvgClose
        className="w-4 h-4 fill-current inline-block cursor-pointer float-right"
        onClick={() => onClose(id)}
      />
      {/* <div className="float-right"><SvgClose /></div> */}
      <h3 className="text-green-light">{title}</h3>
      <div>{description}</div>
    </div>
  );
};

export default Notification;
