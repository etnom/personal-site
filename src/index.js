import React from 'react';
import ReactDOM from 'react-dom';

import App from './Components/App';

import * as serviceWorker from './serviceWorker';

import './index.css';

import './styles/flex-containers.css';
import './styles/text.scss';
import './styles/misc.css';
import './styles/animations.css';
import './styles/section.css';
import './styles/colors.scss';



ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
