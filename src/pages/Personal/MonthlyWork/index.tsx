import KeepAlive from 'react-activation';
import React from 'react';

export function MonthlyWork() {
  return (
    <div>
      <h1>MonthlyWork</h1>
    </div>
  );
}

export default () => {
  return (
    <KeepAlive name="monthlyWork">
      <MonthlyWork />
    </KeepAlive>
  );
};
