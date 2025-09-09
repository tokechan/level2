// src/App.tsx を簡単に修正して確認
import './App.css'
import { CommonButton, InputForm } from './components/atoms'

function App() {
  return (
    <div>
      <h1>Todo App Development Started!</h1>
      <p>Atomic Design Pattern</p>

      {/* <div className="input-form"> */}
        <InputForm 
          placeholder="Todoを入力してください"
          onChange={() => {}}
          onKeyDown={() => {}}
        />

      <section>
        <h2>Buttons area</h2>
        <CommonButton>Primary</CommonButton>
        <CommonButton disabled>Disabled</CommonButton>
      </section>
        <CommonButton>ボタン</CommonButton>
      {/* </div> */}
    </div>
  )
}

export default App