import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Main from '../Main/Main';
import Box from '../Box/Box';

const MyComponent = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/box/:id" component={Box} />
        <Redirect from="*" to="/" />
      </Switch>
    </BrowserRouter>
  );
};

export default MyComponent;
