/**
 * @jest-environment jsdom
 */

describe("Item list render", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="items-grid"></div>
    `;
  });

  const renderItemCards = (items) => {
    const container = document.querySelector(".items-grid");
    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "item-card";
      card.innerHTML = `
        <h2 class="title">${item.title}</h2>
        <span class="category">${item.category}</span>
        <span class="status">${item.status}</span>
      `;
      container.appendChild(card);
    });
  };

  test("renders item cards with title, category, status", () => {
    const items = [
      { title: "Lost Wallet", category: "Wallets", status: "open" },
      { title: "Found Keys", category: "Keys", status: "available" },
    ];

    renderItemCards(items);

    const cards = document.querySelectorAll(".item-card");
    expect(cards.length).toBe(2);

    expect(cards[0].querySelector(".title").textContent).toBe("Lost Wallet");
    expect(cards[0].querySelector(".category").textContent).toBe("Wallets");
    expect(cards[0].querySelector(".status").textContent).toBe("open");
  });
});

