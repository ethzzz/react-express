import BaseRouter from './router/index.tsx';
import './App.css'
import { Suspense } from 'react';

function App() {
  return (
    <> 
      <Suspense fallback={<div>Loading...</div>}>
        <BaseRouter />   
      </Suspense>
    </>
  )
}

export default App
