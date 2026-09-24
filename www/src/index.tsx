import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "gena-app";
import reportWebVitals from "./reportWebVitals";
import { stores, initStores, StoreContext } from "./models";
import { routes } from "./routes";
import enUSIntl from "antd/lib/locale/en_US";
import { ConfigProvider } from "antd";
import { InitNonCriticalStores } from "./components/StoreInit";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

if (window.self !== window.top) {
  // This app is only ever meant to be the top-level page, embedding OTHER services
  // (dashboard, GeoChem HMI, ...) via <IFrame> -- nothing legitimately embeds it
  // inside a frame of its own domain. If something does load one of its routes in
  // a frame (e.g. an embedded app's own session check fails and it redirects to a
  // same-origin path like /login instead of breaking out via window.top), mounting
  // the full app here would recursively nest a whole extra copy of itself -- header,
  // nav, and another <IFrame> -- inside that frame, which nests again the next time
  // the embedded app's redirect fires. Refuse to mount at all instead.
  root.render(<div>This page cannot be displayed in a frame.</div>);
} else {
  initStores().then(() => {
    root.render(
      <StoreContext.Provider value={stores}>
        <ConfigProvider locale={enUSIntl}>
          <InitNonCriticalStores>
            <App enUSLocale={true} routes={routes} strict={false} />
          </InitNonCriticalStores>
        </ConfigProvider>
      </StoreContext.Provider>
    );
  });

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}
