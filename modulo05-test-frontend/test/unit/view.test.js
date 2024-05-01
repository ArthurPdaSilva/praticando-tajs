import { describe, expect, it, jest } from "@jest/globals";
import View from "../../public/src/view.js";

describe("View test suite", () => {
  it("#updateList should append content to card-list innerHTML", () => {
    const innerHTMLSpy = jest.fn();

    // Sempre que o innerHTML for modificado, eu quero ser notificado, to interceptando sempre que alguém passar um valor para o innerhtml
    const baseHTML = "<div><div/>";
    const querySelectorProxy = new Proxy(
      {
        innerHTML: baseHTML,
      },
      {
        set(obj, key, value) {
          obj[key] = value;
          innerHTMLSpy(obj[key]);
          return true;
        },
      }
    );

    jest
      .spyOn(document, document.querySelector.name)
      .mockImplementation((key) => {
        // Se não for o card list, não quero pegar
        if (key !== "#card-list") return;
        return querySelectorProxy;
      });

    const view = new View();
    const data = {
      title: "Title",
      imageUrl: "https://img.com/img.png",
    };
    const generatedContent = `
        <article class="col-md-12 col-lg-4 col-sm-3 top-30">
                <div class="card">
                    <figure>
                        <img class="card-img-top card-img"
                            src="${data.imageUrl}"
                            alt="Image of an ${data.title}">
                        <figcaption>
                            <h4 class="card-title">${data.title}</h4>
                        </figcaption>
                    </figure>
                </div>
            </article>
        `;

    view.updateList([data]);

    expect(innerHTMLSpy).toHaveBeenNthCalledWith(
      1,
      baseHTML + generatedContent
    );

    view.updateList([data]);

    expect(innerHTMLSpy).toHaveBeenNthCalledWith(
      2,
      baseHTML + generatedContent + generatedContent
    );
  });
  it("#initialize forms should add onSubmit event listener to form", () => {
    const addEventListenerSpy = jest.fn();
    const querySelectorProxy = new Proxy(
      {
        addEventListener: addEventListenerSpy,
      },
      {
        get: function (target, prop) {
          if (prop === "querySelector") {
            return function (query) {
              const submitEvent = new Event("submit", { bubbles: true });
              formElement.dispatchEvent(submitEvent);
              const formElement = document.createElement("form");
              formElement.id = "needs-validation";
              return formElement;
            };
          }
          return target[prop];
        },
      }
    );

    jest.spyOn(document, "querySelector").mockImplementation((key) => {
      if (key !== "#needs-validation") return;
      return querySelectorProxy;
    });

    const view = new View();
    view.initialize();

    // Expect the addEventListener to have been called with "submit" event and false (for bubbling)
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "submit",
      expect.any(Function),
      false
    );
  });
});
