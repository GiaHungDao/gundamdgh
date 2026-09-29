const products=[
{id:1,cat:"RG",series:"REAL GRADE · 1/144",name:"RX-93 NU GUNDAM",price:1250000,code:"NU",accent:"#00e5ff"},
{id:2,cat:"MG",series:"MASTER GRADE · 1/100",name:"GUNDAM BARBATOS",price:1450000,code:"BARBATOS",accent:"#ff573f"},
{id:3,cat:"MGEX",series:"MASTER GRADE EX · 1/100",name:"STRIKE FREEDOM",price:3200000,code:"FREEDOM",accent:"#ffc83d"},
{id:4,cat:"HG",series:"HIGH GRADE · 1/144",name:"GUNDAM AERIAL",price:650000,code:"AERIAL",accent:"#6ee7ff"},
{id:5,cat:"RG",series:"REAL GRADE · 1/144",name:"SAZABI",price:1350000,code:"SAZABI",accent:"#ff4d35"},
{id:6,cat:"MG",series:"MASTER GRADE · 1/100",name:"RX-78-2 GUNDAM",price:1150000,code:"RX-78",accent:"#00e5ff"},
{id:7,cat:"HG",series:"HIGH GRADE · 1/144",name:"CALIBARN",price:720000,code:"CALIBARN",accent:"#ff6c5c"},
{id:8,cat:"MGEX",series:"MASTER GRADE EX · 1/100",name:"UNICORN GUNDAM",price:2850000,code:"UNICORN",accent:"#d8e7ff"}
];
let cart=JSON.parse(localStorage.getItem("gundamCart")||"[]"), activeCat="all";
const money=n=>n.toLocaleString("vi-VN")+"₫";
const $=s=>document.querySelector(s);
const productsEl=$("#products");

function render(){
 let list=products.filter(p=>(activeCat==="all"||p.cat===activeCat));
 const q=$("#searchInput").value.trim().toLowerCase();
 if(q) list=list.filter(p=>(p.name+" "+p.cat+" "+p.series).toLowerCase().includes(q));
 const sort=$("#sort").value;
 if(sort==="low") list.sort((a,b)=>a.price-b.price);
 if(sort==="high") list.sort((a,b)=>b.price-a.price);
 productsEl.innerHTML=list.map(p=>`
 <article class="card">
  <div class="card-visual" style="--glow:${p.accent}">
   <span class="grade">${p.cat}</span><button class="heart" data-heart="${p.id}">♡</button>
   <div class="model">${p.code}<small>GUNDAM</small></div>
  </div>
  <div class="card-info"><div class="series">${p.series}</div><h3>${p.name}</h3>
   <div class="price-row"><span class="price">${money(p.price)}</span><button class="add" data-add="${p.id}">+</button></div>
  </div>
 </article>`).join("")||`<div style="grid-column:1/-1;padding:70px;text-align:center;color:#718090">Không tìm thấy sản phẩm.</div>`;
 document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>add(+b.dataset.add));
 document.querySelectorAll("[data-heart]").forEach(b=>b.onclick=()=>{b.classList.toggle("liked");b.textContent=b.classList.contains("liked")?"♥":"♡"});
 document.querySelectorAll(".card").forEach((c,i)=>c.querySelector(".card-visual").onclick=()=>detail(list[i]));
 updateCount();
}
function add(id){const x=cart.find(i=>i.id===id);x?x.qty++:cart.push({id,qty:1});save();toast("Đã thêm vào giỏ hàng");}
function save(){localStorage.setItem("gundamCart",JSON.stringify(cart));renderCart();updateCount()}
function updateCount(){$("#cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0)}
function renderCart(){
 const box=$("#cartItems"); if(!cart.length){box.innerHTML='<div class="empty">GIỎ HÀNG ĐANG TRỐNG<br>Chọn một kit để bắt đầu build.</div>';$("#cartTotal").textContent="0₫";return}
 box.innerHTML=cart.map(x=>{let p=products.find(p=>p.id===x.id);return `<div class="cart-item"><div class="mini">${p.code}</div><div><h4>${p.name}</h4><small>${p.cat} · ${money(p.price)}</small><div class="qty"><button data-dec="${p.id}">−</button><b>${x.qty}</b><button data-inc="${p.id}">+</button></div></div><div><strong>${money(p.price*x.qty)}</strong><button class="remove" data-remove="${p.id}">×</button></div></div>`}).join("");
 document.querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>change(+b.dataset.inc,1));
 document.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>change(+b.dataset.dec,-1));
 document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.id!==+b.dataset.remove);save()});
 $("#cartTotal").textContent=money(cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0));
}
function change(id,d){let x=cart.find(x=>x.id===id);x.qty+=d;if(x.qty<1)cart=cart.filter(y=>y.id!==id);save()}
function detail(p){$("#detailContent").innerHTML=`<div class="detail"><div class="detail-art" style="--glow:${p.accent}"><div class="model">${p.code}<small>GUNDAM</small></div></div><div class="detail-copy"><span class="grade">${p.cat}</span><h2>${p.name}</h2><p>${p.series}. Một lựa chọn nổi bật cho bộ sưu tập Gunpla, với thiết kế cơ khí đặc trưng và nhiều chi tiết để trưng bày.</p><div class="detail-price">${money(p.price)}</div><button class="btn primary full" onclick="add(${p.id});$('#detailOverlay').classList.remove('show')">THÊM VÀO GIỎ <b>→</b></button></div></div>`;$("#detailOverlay").classList.add("show")}
function toast(t){$("#toast").textContent=t;$("#toast").classList.add("show");setTimeout(()=>$("#toast").classList.remove("show"),1800)}
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{activeCat=b.dataset.cat;document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");render();$("#shop").scrollIntoView({behavior:"smooth"})});
document.querySelectorAll(".grade-grid button").forEach(b=>b.onclick=()=>{activeCat=b.dataset.cat;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.cat===activeCat));render();$("#shop").scrollIntoView({behavior:"smooth"})});
$("#sort").onchange=render;$("#searchInput").oninput=render;
$("#searchToggle").onclick=()=>{$("#searchbar").classList.toggle("open");if($("#searchbar").classList.contains("open"))$("#searchInput").focus()};
$("#clearSearch").onclick=()=>{$("#searchInput").value="";render()};
$("#openCart").onclick=()=>{$("#cartOverlay").classList.add("show");renderCart()};
$("#closeCart").onclick=()=>$("#cartOverlay").classList.remove("show");
$("#cartOverlay").onclick=e=>{if(e.target.id==="cartOverlay")e.currentTarget.classList.remove("show")};
$("#closeDetail").onclick=()=>$("#detailOverlay").classList.remove("show");
$("#detailOverlay").onclick=e=>{if(e.target.id==="detailOverlay")e.currentTarget.classList.remove("show")};
$("#checkout").onclick=()=>{if(!cart.length){toast("Giỏ hàng đang trống");return}toast("Đơn hàng mô phỏng đã được ghi nhận");cart=[];save();setTimeout(()=>$("#cartOverlay").classList.remove("show"),700)};
render();renderCart();
