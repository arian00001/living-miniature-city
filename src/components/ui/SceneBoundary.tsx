import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { failed: boolean; }

// If the GPU or a scene module gives up, keep the entry screen usable instead of
// collapsing the whole document.
export default class SceneBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="no-webgl">
          <div className="glass-card">
            <h1>The 3D scene could not start</h1>
            <p>
              Your device may be low on graphics memory. Reload the page to try again, or open it on a desktop
              browser for the full cinematic tour.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
