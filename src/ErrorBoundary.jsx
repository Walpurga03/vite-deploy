class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Aktualisiere den Zustand, damit die nächste Renderung die Fallback-UI zeigen wird.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // Du kannst den Fehler auch an ein Fehlerberichtssystem senden
      logErrorToMyService(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // Du kannst jede beliebige Fallback-UI rendern
        return <h1>Something went wrong.</h1>;
      }
  
      return this.props.children; 
    }
  }

export default ErrorBoundary