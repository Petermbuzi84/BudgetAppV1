export default class ErrorTemplate {
  errorImage(error_container) {
    const error_image = document.createElement("div");
    error_image.classList = "error-image";
    const error_face = document.createElement("img");
    error_face.src = "img/error_face.png";
    error_face.alt = "";
    error_image.append(error_face);
    error_container.append(error_image);
  }

  errorContext(error_container, message) {
    const error_context = document.createElement("div");
    error_context.classList = "error-context";
    const error_title = document.createElement("div");
    error_title.classList = "error-title";
    error_title.textContent = "ERROR!";
    const error_message = document.createElement("div");
    error_message.classList = "error-message";
    error_message.textContent = message;
    error_context.append(error_title, error_message);
    error_container.append(error_context);
  }

  errorTemplate(root, message) {
    const error_container = document.createElement("div");
    error_container.classList = "error-container";
    this.errorImage(error_container);
    this.errorContext(error_container, message);
    root.append(error_container);
  }

  removeErrorTemplate() {
    const error_container = document.querySelector(".error-container");
    if (error_container) {
      error_container.remove();
    }
  }
}
