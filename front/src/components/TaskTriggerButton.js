import React from 'react';
import Button from './Button';

export default function TaskTriggerButton(props) {
  const { description = 'Trigger task', triggerTask } = props;
  return (
    <Button
      color="blue"
      onClick={triggerTask}
      description={description}
      block
    />
  );
}
