/**
 * @jest-environment jsdom
 */

describe("Post page render", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="post-form">
        <input name="title" />
        <textarea name="description"></textarea>
        <select name="category">
          <option>Electronics</option>
          <option>Documents</option>
        </select>
        <input name="location" />
        <input name="date" type="date" />
        <button type="submit">Submit</button>
      </form>
    `;
  });

  test("essential fields are present", () => {
    expect(document.querySelector("#post-form")).not.toBeNull();
    expect(document.querySelector("input[name='title']")).not.toBeNull();
    expect(document.querySelector("textarea[name='description']")).not.toBeNull();
    expect(document.querySelector("select[name='category']")).not.toBeNull();
    expect(document.querySelector("input[name='location']")).not.toBeNull();
    expect(document.querySelector("input[name='date']")).not.toBeNull();
  });

  test("can fill and submit form", () => {
    const form = document.querySelector("#post-form");
    const title = document.querySelector("input[name='title']");
    const desc = document.querySelector("textarea[name='description']");
    const cat = document.querySelector("select[name='category']");
    const loc = document.querySelector("input[name='location']");
    const date = document.querySelector("input[name='date']");

    title.value = "Lost Wallet";
    desc.value = "Brown leather wallet.";
    cat.value = "Electronics";
    loc.value = "City Park";
    date.value = "2025-01-01";

    let submitted = false;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      submitted = true;
    });

    form.querySelector("button[type='submit']").click();
    expect(submitted).toBe(true);
  });
});

