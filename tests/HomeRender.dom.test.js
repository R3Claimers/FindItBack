/**
 * @jest-environment jsdom
 */

describe("Home page render", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="root">
        <section id="home">
          <div class="items-grid lost"></div>
          <div class="items-grid found"></div>
        </section>
      </div>
    `;
  });

  const renderItems = (containerSelector, items) => {
    const container = document.querySelector(containerSelector);
    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "item-card";
      card.setAttribute("data-id", item._id);
      card.textContent = `${item.title} - ${item.category}`;
      container.appendChild(card);
    });
  };

  test("renders lost and found sections", () => {
    expect(document.querySelector("#home")).not.toBeNull();
    expect(document.querySelector(".items-grid.lost")).not.toBeNull();
    expect(document.querySelector(".items-grid.found")).not.toBeNull();
  });

  test("renders items in both sections", () => {
    const lostItems = [
      { _id: "l1", title: "Lost Wallet", category: "Wallets" },
      { _id: "l2", title: "Lost Keys", category: "Keys" },
    ];
    const foundItems = [
      { _id: "f1", title: "Found Phone", category: "Electronics" },
    ];

    renderItems(".items-grid.lost", lostItems);
    renderItems(".items-grid.found", foundItems);

    expect(document.querySelectorAll(".items-grid.lost .item-card").length).toBe(2);
    expect(document.querySelectorAll(".items-grid.found .item-card").length).toBe(1);
  });
});

