import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import GameBoard from './components/GameBoard';
import './App.css';

const App = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <GameBoard />
      </div>
    </Provider>
  );
};

export default App;
