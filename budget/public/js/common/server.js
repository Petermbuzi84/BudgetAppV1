const axios_instance = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 5000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

function renderError(err) {
  console.log(err.message);
  // @TODO handle error
  //   removeSplashScreen(); //@TODO: Remove splash screen
  //   const root = document.getElementById("root");
  //   error_template.errorTemplate(root, err.message);
}

export function connectToServer(route, callbackResponse) {
  axios_instance
    .get(`/${route}`)
    .then(({ data }) => {
      callbackResponse(data);
    })
    .catch(renderError);
}

export function connectToServerWithArguments(route, content, callbackResponse) {
  axios_instance
    .post(`/${route}`, content)
    .then(({ data }) => {
      callbackResponse(data);
    })
    .catch(renderError);
}

export function getUser(callbackResponse) {
  connectToServer("@me", (res) => {
    callbackResponse(res);
  });
}
