import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const render = Component => {
    ReactDOM.render(<App/>, document.getElementById('root'));
};

registerServiceWorker();
render(App);
// Webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./App', () => {
        render(App);
    });
}
