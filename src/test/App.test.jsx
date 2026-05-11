import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import App from './App.jsx'

test('App mostra texto principal', () => {
  render(<App />)

  expect(screen.getByText(/teia/i)).toBeInTheDocument()
})