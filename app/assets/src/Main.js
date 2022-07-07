import Core from "./Core.js";

const client = ZAFClient.init();
let settings;

client.metadata().then((metadata) => {
  settings = metadata.settings;
});

const Main = async () => {
  // const App = document.getElementById("app");
  
  // let appBody = `<div id="main-content"></div>`;

  // // Write App
  // App.innerHTML = appBody;
  Core.updateCEP()
};

export default Main;
