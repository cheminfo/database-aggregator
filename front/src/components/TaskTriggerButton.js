import React from 'react';

export default function TaskTriggerButton(props) {
  const { description = 'Trigger task', triggerTask } = props;
  return (
    <button
      className="mb-2 bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded"
      type="button"
      onClick={triggerTask}
    >
      {description}
    </button>
  );
}
