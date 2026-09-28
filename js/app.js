function qs(s){return document.querySelector(s)}
function getWishlist(){return JSON.parse(localStorage.getItem("autoverseWishlist")||"[]")}
function setWishlist(list){localStorage.setItem("autoverseWishlist",JSON.stringify(list));updateWishlistCount()}
function updateWishlistCount(){document.querySelectorAll("#wishlistCount").forEach(e=>e.textContent=getWishlist().length)}
function isFav(id){return getWishlist().includes(id)}
function toggleWishlist(id){
 let list=getWishlist();
 if(list.includes(id)) list=list.filter(x=>x!==id); else list.push(id);
 setWishlist(list);
 renderCars(); renderWishlist(); renderFeatured();
}
function cardHTML(car){
 const fav=isFav(car.id);
 return `<article class="car-card"><div class="car-image"><img src="${car.image}" alt="${car.name}" onerror="this.parentElement.classList.add('image-fallback');this.style.display='none'"><span class="category-tag">${car.category}</span><button class="heart" onclick="toggleWishlist('${car.id}')" title="Wishlist">${fav?'❤️':'♡'}</button></div><div class="car-body"><p class="muted">${car.brand} • ${car.country}</p><h3>${car.name}</h3><p>${car.description}</p><div class="card-actions"><a class="btn small-btn" href="car-details.html?id=${car.id}">Details</a><button class="icon-btn" onclick="downloadWallpaper('${car.id}')">🖼️</button></div></div></article>`
}
function renderFeatured(){const el=qs("#featuredCars");if(el)el.innerHTML=cars.slice(0,3).map(cardHTML).join("")}
function renderCars(){
 const el=qs("#carGrid"); if(!el)return;
 const search=(qs("#searchInput")?.value||"").toLowerCase();
 const active=document.querySelector(".filter.active")?.dataset.category||new URLSearchParams(location.search).get("category")||"All";
 const result=cars.filter(c=>(active==="All"||c.category===active)&&(`${c.name} ${c.brand} ${c.category}`.toLowerCase().includes(search)));
 el.innerHTML=result.length?result.map(cardHTML).join(""):`<div class="empty"><h2>No cars found</h2><p>Try another search or category.</p></div>`;
}
function initCarsPage(){
 document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");renderCars()}));
 const cat=new URLSearchParams(location.search).get("category");
 if(cat){document.querySelectorAll(".filter").forEach(b=>{if(b.dataset.category===cat){document.querySelector(".filter.active")?.classList.remove("active");b.classList.add("active")}})}
 renderCars();
}
function renderCarDetails(){
 const el=qs("#carDetails"), id=new URLSearchParams(location.search).get("id"), car=cars.find(c=>c.id===id)||cars[0];
 el.innerHTML=`<div class="details-layout"><div class="details-image"><img src="${car.image}" alt="${car.name}" onerror="this.parentElement.classList.add('image-fallback');this.style.display='none'"></div><div class="details-content"><p class="eyebrow">${car.category} • ${car.country}</p><h1>${car.name}</h1><p class="lead">${car.description}</p><div class="spec-grid"><div><span>Brand</span><b>${car.brand}</b></div><div><span>Year</span><b>${car.year}</b></div><div><span>Engine</span><b>${car.engine}</b></div><div><span>Power</span><b>${car.power}</b></div><div><span>Top Speed</span><b>${car.speed}</b></div><div><span>0–100 km/h</span><b>${car.zero}</b></div></div><div class="hero-buttons"><button class="btn primary" onclick="toggleWishlist('${car.id}')">${isFav(car.id)?'❤️ Saved':'♡ Add to Wishlist'}</button><button class="btn secondary" onclick="downloadWallpaper('${car.id}')">🖼️ Download Wallpaper</button></div></div></div><div class="info-section"><h2>About this model</h2><p>${car.description} AutoVerse presents this information as a concise educational overview for automotive enthusiasts.</p><p class="small">*Specifications can vary by model year, trim and market.</p></div>`;
}
function downloadWallpaper(id){
 const car=cars.find(c=>c.id===id); if(!car)return;
 const img=new Image(); img.crossOrigin="anonymous"; img.src=car.image;
 img.onerror=()=>alert("Add the car image to "+car.image+" to enable wallpaper download.");
 img.onload=()=>{const a=document.createElement("a");a.href=car.image;a.download=car.name.replaceAll(" ","-").toLowerCase()+"-wallpaper.jpg";document.body.appendChild(a);a.click();a.remove()};
}
function renderWallpapers(){const el=qs("#wallpaperGrid");if(el)el.innerHTML=cars.map(c=>`<div class="wallpaper-card"><div class="wallpaper-image"><img src="${c.image}" alt="${c.name}" onerror="this.parentElement.classList.add('image-fallback');this.style.display='none'"><div><h3>${c.name}</h3><p>${c.category}</p></div></div><button class="btn primary full" onclick="downloadWallpaper('${c.id}')">🖼️ Download Wallpaper</button></div>`).join("")}
function renderWishlist(){const el=qs("#wishlistGrid");if(!el)return;const list=getWishlist().map(id=>cars.find(c=>c.id===id)).filter(Boolean);el.innerHTML=list.length?list.map(cardHTML).join(""):`<div class="empty"><div class="empty-icon">❤️</div><h2>Your wishlist is empty</h2><p>Explore the cars and save your favourites.</p><a class="btn primary" href="cars.html">Explore Cars</a></div>`}
function initRegister(){
 qs("#registerForm")?.addEventListener("submit",e=>{e.preventDefault();let valid=true;const name=qs("#fullName").value.trim(),email=qs("#email").value.trim(),user=qs("#username").value.trim(),pass=qs("#password").value,confirm=qs("#confirmPassword").value;
 [["#nameError",name.length>=2?"":"Name must contain at least 2 characters."],["#emailError",/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)?"":"Enter a valid email address."],["#usernameError",/^[A-Za-z0-9_]{3,20}$/.test(user)?"":"Username must be 3–20 letters, numbers or underscores."],["#passwordError",pass.length>=8?"":"Password must contain at least 8 characters."],["#confirmError",pass===confirm&&confirm!==""?"":"Passwords do not match."]].forEach(([s,msg])=>{qs(s).textContent=msg;if(msg)valid=false});
 if(!valid)return;localStorage.setItem("autoverseUser",JSON.stringify({name,email,username:user,password:pass}));qs("#registerMessage").className="form-message success";qs("#registerMessage").textContent="Account created successfully! Redirecting to login...";setTimeout(()=>location.href="login.html",900);
 })}
function initLogin(){
 qs("#loginForm")?.addEventListener("submit",e=>{e.preventDefault();const id=qs("#loginId").value.trim(),pass=qs("#loginPassword").value;let ok=true;qs("#loginIdError").textContent=id?"":"Username/email is required.";qs("#loginPasswordError").textContent=pass?"":"Password is required.";if(!id||!pass)ok=false;if(!ok)return;
 const user=JSON.parse(localStorage.getItem("autoverseUser")||"null");if(!user){qs("#loginMessage").className="form-message error";qs("#loginMessage").textContent="No account found. Please register first.";return}
 if((id===user.username||id.toLowerCase()===user.email.toLowerCase())&&pass===user.password){localStorage.setItem("autoverseLoggedIn","true");qs("#loginMessage").className="form-message success";qs("#loginMessage").textContent="Login successful!";setTimeout(()=>location.href="profile.html",600)}else{qs("#loginMessage").className="form-message error";qs("#loginMessage").textContent="Incorrect username/email or password."}
 })}
function renderProfile(){
 const el=qs("#profileBox"),user=JSON.parse(localStorage.getItem("autoverseUser")||"null"),logged=localStorage.getItem("autoverseLoggedIn")==="true";
 if(!user||!logged){el.innerHTML=`<div class="profile-card"><div class="avatar">👤</div><h1>Guest User</h1><p>Please login to view your profile.</p><a class="btn primary" href="login.html">Login</a></div>`;return}
 el.innerHTML=`<div class="profile-card"><div class="avatar">👤</div><p class="eyebrow">MY PROFILE</p><h1>${escapeHTML(user.name)}</h1><p class="lead">@${escapeHTML(user.username)}</p><div class="profile-stats"><div><b>${getWishlist().length}</b><span>Wishlist Cars</span></div><div><b>${user.email}</b><span>Email</span></div></div><button class="btn secondary" onclick="logout()">Logout</button></div>`;
}
function logout(){localStorage.removeItem("autoverseLoggedIn");location.href="index.html"}
function escapeHTML(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderBlog(){const el=qs("#blogArticle"),id=new URLSearchParams(location.search).get("id")||"gtr",b=blogs[id]||blogs.gtr;el.innerHTML=`<div class="blog-hero ${id==="ev"?"gradient-blue":id==="hyper"?"gradient-dark":"gradient-red"}">${b.art}</div><span>${b.category}</span><h1>${b.title}</h1><p class="muted">Published ${b.date} • AutoVerse Editorial</p>${b.text.map(p=>`<p>${p}</p>`).join("")}<a class="btn primary" href="blogs.html">← Back to Blogs</a>`}
function toggleTheme(){document.body.classList.toggle("light");localStorage.setItem("autoverseTheme",document.body.classList.contains("light")?"light":"dark")}
function toggleMenu(){qs("#navMenu")?.classList.toggle("show")}
document.addEventListener("DOMContentLoaded",()=>{if(localStorage.getItem("autoverseTheme")==="light")document.body.classList.add("light");updateWishlistCount();renderFeatured();const auth=qs("#authLink");if(auth&&localStorage.getItem("autoverseLoggedIn")==="true"){auth.textContent="Logout";auth.href="#";auth.onclick=e=>{e.preventDefault();logout()}}});
