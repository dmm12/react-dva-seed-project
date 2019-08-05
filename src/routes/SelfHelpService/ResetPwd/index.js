import React from 'react';
import { Button } from 'hzero-ui';

function IndexPage() {
  return (
    <div>
      <h1 >Yay! Welcome to dva!</h1>
      <div />
      <ul>
        <li>To get started, edit <code>src/index.js</code> and save to reload.</li>
        <li><a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">Getting Started</a></li>
      </ul>
      <Button type="primary">test</Button>
    </div>
  );
}

IndexPage.propTypes = {
};

export default IndexPage;
