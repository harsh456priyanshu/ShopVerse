import React from 'react'

function TestComponent() {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
      <div className="shrink-0">
        <div className="h-12 w-12 bg-primary-500 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <div>
        <div className="text-xl font-medium text-black">Tailwind CSS v4</div>
        <p className="text-slate-500">Successfully integrated with Vite!</p>
        <button className="btn-primary mt-2">Test Button</button>
      </div>
    </div>
  )
}

export default TestComponent
