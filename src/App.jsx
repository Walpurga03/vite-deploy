import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import GameBoard from './components/GameBoard';
import InfoPopup from './components/InfoPopup';

const App = () => {

  return (
    <Provider store={store}>
      <div className="App">
        <InfoPopup />
        <GameBoard />
      </div>
    </Provider>
  );
};

export default App;
