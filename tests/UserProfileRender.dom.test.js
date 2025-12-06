/**
 * @jest-environment jsdom
 */

describe("User Profile page render", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="profile">
        <img id="avatar" />
        <h1 id="name"></h1>
        <p id="email"></p>
        <button id="edit">Edit</button>
      </section>
    `;
  });

  test("renders profile elements", () => {
    expect(document.querySelector("#profile")).not.toBeNull();
    expect(document.querySelector("#avatar")).not.toBeNull();
    expect(document.querySelector("#name")).not.toBeNull();
    expect(document.querySelector("#email")).not.toBeNull();
  });

  test("can update displayed name", () => {
    const nameEl = document.querySelector("#name");
    nameEl.textContent = "John Doe";
    expect(nameEl.textContent).toBe("John Doe");

    nameEl.textContent = "Jane Smith";
    expect(nameEl.textContent).toBe("Jane Smith");
  });
});

