import { Component } from 'react'

// Class component is required here — React error boundaries only work
// with the componentDidCatch lifecycle method, no hook equivalent exists.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && this.props.resetKey !== prevProps.resetKey) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
          <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-ink-500 dark:text-ink-400 mb-6 max-w-sm">
            This part of the page failed to load. Try refreshing — if it keeps happening, let us know.
          </p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Refresh page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
