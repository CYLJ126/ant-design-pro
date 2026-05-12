import React from 'react';
import PageWrapper from '@/components/PageWrapper';

function HomePage() {
  return (
    <div>
      <h1>HomePage 页面</h1>
    </div>
  );
}

export default () => {
  return (
    <PageWrapper>
      <HomePage />
    </PageWrapper>
  );
};
