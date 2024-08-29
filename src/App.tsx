import React from 'react';

import placeholder2 from './images/grr-2.webp';
import placeholder3 from './images/grr-3.webp';
import placeholder4 from './images/grr-4.webp';
import placeholder5 from './images/grr-5.webp';
import placeholder6 from './images/grr-6.webp';
import placeholder7 from './images/grr-7.webp';
import './App.css';

function App() {
  const n = getRandomInt(7);

  return (
    <div data-testid="grr-app-root" className="App">
      <header className="App-header">
      </header>
        <img src={getPlaceholderImage(n)} className="App-logo" alt="logo" />
    </div>
  );
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function getPlaceholderImage(n: number) {
  switch(n) {
    case 0:
    case 1:
    case 2:
      return placeholder2;
    case 3:
      return placeholder3;
    case 4:
      return placeholder4;
    case 5:
      return placeholder5;
    case 6:
      return placeholder6;
    case 7:
      return placeholder7;
  }
}

export default App;
