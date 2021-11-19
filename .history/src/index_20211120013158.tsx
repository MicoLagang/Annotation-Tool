import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from "./configureStore";
import { Provider } from "react-redux";
import { AppInitializer } from "./logic/initializer/AppInitializer";
import "bootstrap/dist/css/bootstrap.css";
import "assets/css/paper-dashboard.css?v=1.3.0";
//import "assets/css/paper-dashboard.css.map?v=1.3.0";
//import "assets/css/paper-dashboard.min.css?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

export const store = configureStore();
AppInitializer.inti();

ReactDOM.render(
    (<Provider store={store}>
        <App />
    </Provider>),
    document.getElementById('root') || document.createElement('div') // fix for testing purposes
);

serviceWorker.register();
