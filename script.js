const $ = s => document.querySelector(s);
const money = n => n.toLocaleString("en-US").replace(/,/g, " ") + " so'm";
let cart = {};

const toast = text => {
  $("#toast").textContent = text;
  $("#toast").classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => $("#toast").classList.remove("show"), 2500);
};

const renderCart = () => {
  const items = Object.entries(cart);
  $("#cartCount").textContent = items.reduce((sum, [, it]) => sum + it.qty, 0);
  $("#cTotal").textContent = money(items.reduce((sum, [, it]) => sum + it.price * it.qty, 0));
  $("#cartList").innerHTML = items.length
    ? items.map(([name, it]) => `
      <div class="cart-item">
        <div><h4>${name}</h4><small>${money(it.price)} &times; ${it.qty}</small></div>
        <b>${money(it.price * it.qty)}</b>
        <button class="remove" type="button" data-name="${name}">&times;</button>
      </div>`).join("")
    : `<p class="cart-empty">Savatingiz hozircha bo'sh</p>`;
};

const toggleCart = open => {
  $("#cart").classList.toggle("open", open);
  $("#cartBackdrop").classList.toggle("show", open);
};

document.addEventListener("click", e => {
  const add = e.target.closest("[data-price]");
  const del = e.target.closest(".remove");
  if (add) {
    const name = add.dataset.name;
    cart[name] = cart[name] || { price: +add.dataset.price, qty: 0 };
    cart[name].qty++;
    renderCart();
    toast("✓ " + name + " savatga qo'shildi");
  }
  if (del) {
    delete cart[del.dataset.name];
    renderCart();
  }
});

$("#cartBtn").onclick = () => toggleCart(true);
$("#cartClose").onclick = () => toggleCart(false);
$("#cartBackdrop").onclick = () => toggleCart(false);

$("#checkoutBtn").onclick = () => {
  if (!Object.keys(cart).length) return toast("Savatingiz bo'sh");
  cart = {};
  renderCart();
  toggleCart(false);
  toast("✓ Buyurtma berildi!");
};

$("#burger").onclick = () => {
  $("#burger").classList.toggle("open");
  $("#nav").classList.toggle("open");
};
document.querySelectorAll(".nav a").forEach(a => a.onclick = () => {
  $("#burger").classList.remove("open");
  $("#nav").classList.remove("open");
});

document.querySelectorAll("form").forEach(form => form.onsubmit = e => {
  e.preventDefault();
  toast(form.dataset.msg);
  form.reset();
});

const start = Date.now();
const hideLoader = () => setTimeout(() => {
  $("#loader").classList.add("hide");
  document.body.classList.remove("loading");
}, Math.max(0, 1200 - (Date.now() - start)));
addEventListener("load", hideLoader);
setTimeout(hideLoader, 4000);

renderCart();
