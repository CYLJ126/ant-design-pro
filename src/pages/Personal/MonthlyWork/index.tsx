import Tags from '../Tags/index';
import KeepAlive from 'react-activation';
import React from 'react';

function MonthlyWork() {
  return (
    <div>
      <Tags />
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
