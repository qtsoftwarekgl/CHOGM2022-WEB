import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MyProps {};
interface MyState {
	isDisconnected: boolean;
}

export default function(ComposedComponent: any) {
	class NetworkDetector extends React.Component<MyProps, MyState> {
		constructor(props: any) {
			super(props);
			this.state = {
				isDisconnected: false
			};
		}

    override componentDidMount() {
      this.handleConnectionChange();
      window.addEventListener("online", this.handleConnectionChange);
      window.addEventListener("offline", this.handleConnectionChange);
    }

    override componentWillUnmount() {
      window.removeEventListener("online", this.handleConnectionChange);
      window.removeEventListener("offline", this.handleConnectionChange);
		}

    handleConnectionChange = () => {
      const condition = navigator.onLine ? "online" : "offline";
      if (condition === "online") {
        const webPing = setInterval(() => {
          fetch("https://www.google.com", {
            mode: "no-cors"
          })
            .then(() => {
              this.setState({ isDisconnected: false }, () => {
                return clearInterval(webPing);
							});
            })
						.catch(() => {
							this.setState({ isDisconnected: true });
						});
        }, 10000);
        return;
      }

      return this.setState({ isDisconnected: true });
    };

    override render() {
      const { isDisconnected } = this.state;
      return (
				<div>
					{isDisconnected && (
						<div className="py-3 text-center text-gray-900 bg-yellow-500">
              <p className="text-sm">You've lost internet connection...</p>
            </div>
          )}
          <ComposedComponent {...this.props} />
        </div>
      );
    }
  }

  return NetworkDetector;
}