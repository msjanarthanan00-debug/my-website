import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight, Bot, CalendarDays, Check, ChevronDown, Compass, Heart,
  MapPin, Menu, Moon, Search, Send, Sparkles, Star, Sun, Users, X,
  Zap, Globe2, ShieldCheck, Plane, Hotel, WalletCards
} from "lucide-react";
import "./styles.css";

const destinations = [
  { id:"bali", name:"Bali", country:"Indonesia", tagline:"Island of the Gods", category:"Beach", rating:4.9, price:499, image:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85", accent:"cyan" },
  { id:"dubai", name:"Dubai", country:"UAE", tagline:"City of Superlatives", category:"Luxury", rating:4.8, price:899, image:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85", accent:"amber" },
  { id:"paris", name:"Paris", country:"France", tagline:"The City of Light", category:"Couples", rating:4.7, price:750, image:"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85", accent:"coral" },
  { id:"kerala", name:"Kerala", country:"India", tagline:"God's Own Country", category:"Nature", rating:4.9, price:299, image:"https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85", accent:"blue" }
];

const experiences = [
  ["Desert Safari", "Dubai", "$120", "https://images.unsplash.com/photo-1470214304380-aadaedcfff1b?auto=format&fit=crop&w=900&q=80"],
  ["Ubud Rice Trails", "Bali", "$68", "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=900&q=80"],
  ["Seine Sunset Cruise", "Paris", "$95", "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80"]
];

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("wanderx-theme") !== "light");
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("wanderx-favs") || "[]"));
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [chat, setChat] = useState(false);
  const [messages, setMessages] = useState([{from:"ai", text:"Hey explorer ✨ Tell me a destination, vibe, or budget and I'll shape a trip around it."}]);
  const [chatInput, setChatInput] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("wanderx-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => localStorage.setItem("wanderx-favs", JSON.stringify(favorites)), [favorites]);

  // Scroll reveal + subtle 3D tilt interactions
  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -50px 0px" });

    const tiltItems = document.querySelectorAll(".tilt-card");
    const onMove = (event) => {
      const el = event.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      el.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
    };
    const onLeave = (event) => {
      const el = event.currentTarget;
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "50%");
    };

    document.querySelectorAll(".scroll-reveal").forEach((el) => revealObserver.observe(el));
    tiltItems.forEach((el) => { el.addEventListener("pointermove", onMove); el.addEventListener("pointerleave", onLeave); });
    return () => {
      revealObserver.disconnect();
      tiltItems.forEach((el) => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); });
    };
  });

  useEffect(() => {
    const hero = document.querySelector(".hero-image");
    const onScroll = () => {
      if (!hero) return;
      hero.style.setProperty("--parallax", `${Math.min(window.scrollY * 0.16, 110)}px`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return destinations.filter(d => !q || `${d.name} ${d.country} ${d.category}`.toLowerCase().includes(q));
  }, [query]);

  const toggleFav = (id) => {
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
    setToast(favorites.includes(id) ? "Removed from favorites" : "Saved to your travel list");
    setTimeout(() => setToast(""), 1800);
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setMessages(m => [...m, {from:"user", text}]);
    setChatInput("");
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = "Love that idea. Try our Trip Planner and I'll help turn it into a day-by-day adventure.";
      if (lower.includes("dubai")) reply = "Dubai pick: sunset at Burj Khalifa, a desert safari after dark, then a late-night food stop. 🌙";
      else if (lower.includes("bali")) reply = "Bali pick: Ubud for slow mornings, a rice-terrace walk, then finish with a beach sunset in Seminyak. 🌴";
      else if (lower.includes("budget")) reply = "For a lighter budget, Kerala and Bali are great starting points in this demo itinerary.";
      setMessages(m => [...m, {from:"ai", text:reply}]);
    }, 650);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
    setMobile(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7fbff] text-slate-900 transition-colors duration-500 dark:bg-ink dark:text-white">
      <div className="aurora aurora-one" /><div className="aurora aurora-two" />
      <header className="fixed top-0 z-40 w-full px-4 pt-4 md:px-7">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 shadow-2xl backdrop-blur-2xl">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2">
            <span className="logo-orbit"><Compass size={22}/></span>
            <span className="text-xl font-black tracking-tight text-white">Wander<span className="text-cyanx">X</span></span>
          </button>
          <div className="hidden items-center gap-7 text-sm font-semibold text-white/75 md:flex">
            {["Explore","Destinations","Experiences","Planner"].map(x => <button key={x} onClick={() => scrollTo(x.toLowerCase())} className="navlink">{x}</button>)}
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Search" onClick={() => setSearchOpen(true)} className="icon-btn"><Search size={18}/></button>
            <button aria-label="Theme" onClick={() => setDark(!dark)} className="icon-btn">{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
            <button onClick={() => setMobile(!mobile)} className="icon-btn md:hidden">{mobile ? <X/> : <Menu/>}</button>
            <button onClick={() => setChat(true)} className="hidden rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 md:block">Ask AI</button>
          </div>
        </nav>
        {mobile && <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-white/10 bg-slate-950/95 p-4 text-white shadow-xl md:hidden">
          {["Explore","Destinations","Experiences","Planner"].map(x => <button key={x} onClick={() => scrollTo(x.toLowerCase())} className="block w-full rounded-xl p-3 text-left hover:bg-white/10">{x}</button>)}
        </div>}
      </header>

      <main id="home">
        <section className="relative min-h-[820px] overflow-hidden pt-36">
          <div className="hero-image" />
          <div className="hero-overlay" />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="max-w-4xl pt-16 md:pt-24">
              <div className="reveal inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-white backdrop-blur-xl">
                <Sparkles size={14} className="text-cyanx"/> Next-gen travel engine
              </div>
              <h1 className="reveal delay-1 mt-7 text-6xl font-black leading-[.92] tracking-[-.055em] text-white md:text-8xl">
                Go beyond<br/><span className="gradient-text">the ordinary.</span>
              </h1>
              <p className="reveal delay-2 mt-7 max-w-2xl text-lg leading-8 text-white/75 md:text-xl">Discover extraordinary places, cinematic stays and intelligent itineraries — designed around the way you actually want to travel.</p>
              <div id="explore" className="reveal delay-3 mt-9 max-w-4xl rounded-3xl border border-white/15 bg-slate-950/60 p-2 shadow-glow backdrop-blur-2xl">
                <div className="grid gap-2 md:grid-cols-[1.2fr_1fr_1fr_auto]">
                  <div className="field"><MapPin size={18}/><div><small>Destination</small><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Where to?" /></div></div>
                  <div className="field"><CalendarDays size={18}/><div><small>When</small><input type="date"/></div></div>
                  <div className="field"><Users size={18}/><div><small>Travelers</small><select defaultValue="2"><option>2 Guests</option><option>1 Guest</option><option>4+ Guests</option></select></div></div>
                  <button onClick={() => scrollTo("destinations")} className="search-btn"><Search size={19}/><span>Explore</span></button>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
                {["Bali","Dubai","Paris","Kerala"].map(x => <button key={x} onClick={()=>{setQuery(x);scrollTo("destinations")}} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur hover:bg-white/15">{x}</button>)}
              </div>
            </div>
            <div className="mt-16 grid max-w-3xl grid-cols-2 gap-5 border-t border-white/10 pt-8 md:grid-cols-4">
              {[["10K+","Destinations"],["50K+","Experiences"],["150+","Countries"],["1M+","Explorers"]].map(([n,l]) => <div key={l}><strong className="counter">{n}</strong><span className="block text-xs uppercase tracking-widest text-white/45">{l}</span></div>)}
            </div>
          </div>
          <div className="scroll-cue"><span>SCROLL</span><div/></div>
        </section>

        <section id="destinations" className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="section-head scroll-reveal"><div><p className="eyebrow">01 / DISCOVER</p><h2>Trending <span>escapes.</span></h2></div><p className="max-w-md text-sm leading-6 text-slate-500 dark:text-white/50">Hand-picked destinations for people who'd rather collect stories than souvenirs.</p></div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {filtered.map((d,i) => <article key={d.id} className={`destination-card tilt-card scroll-reveal delay-${i+1}`}>
              <img src={d.image} alt={d.name}/>
              <div className="card-shade"/>
              <button onClick={()=>toggleFav(d.id)} className="fav-btn">{favorites.includes(d.id) ? <Heart fill="currentColor"/> : <Heart/>}</button>
              <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-bold text-white backdrop-blur">{d.category}</div>
              <div className="absolute inset-x-5 bottom-5 text-white">
                <div className="flex items-end justify-between"><div><p className="text-xs text-white/60">{d.country}</p><h3 className="mt-1 text-3xl font-black">{d.name}</h3></div><span className="flex items-center gap-1 text-sm font-bold"><Star size={14} fill="currentColor"/>{d.rating}</span></div>
                <p className="mt-1 text-sm text-white/65">{d.tagline}</p>
                <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3"><span className="text-xs text-white/55">from <b className="text-white">${d.price}</b></span><button onClick={()=>setSelected(d)} className="flex items-center gap-1 text-sm font-bold hover:text-cyanx">View trip <ArrowRight size={15}/></button></div>
              </div>
            </article>)}
          </div>
        </section>

        <section id="experiences" className="mx-auto max-w-7xl px-6 pb-24">
          <div className="section-head scroll-reveal"><div><p className="eyebrow">02 / EXPERIENCES</p><h2>Moments worth <span>chasing.</span></h2></div></div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {experiences.map(([name,place,price,img]) => <div key={name} className="experience-card tilt-card scroll-reveal"><img src={img} alt={name}/><div className="experience-copy"><span>{place}</span><h3>{name}</h3><div className="flex items-center justify-between"><b>{price}</b><button onClick={()=>setToast(`${name} added to your plan`)} className="round-arrow"><ArrowRight size={17}/></button></div></div></div>)}
          </div>
        </section>

        <section id="planner" className="planner-section">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2">
            <div className="scroll-reveal"><p className="eyebrow">03 / SMART PLANNER</p><h2 className="mt-3 text-5xl font-black tracking-tight md:text-6xl">Your trip.<br/><span className="gradient-text">Your rules.</span></h2><p className="mt-6 max-w-xl text-slate-600 dark:text-white/55">Tell WanderX your mood, budget and pace. Build a flexible itinerary instead of following a generic checklist.</p><button onClick={()=>setChat(true)} className="mt-8 flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 font-bold text-white shadow-xl transition hover:-translate-y-1 dark:bg-white dark:text-slate-950">Build with AI <Sparkles size={17}/></button></div>
            <div className="planner-orbit scroll-reveal">
              <div className="orbit-ring ring-one"/><div className="orbit-ring ring-two"/>
              <div className="planner-core"><Sparkles size={30}/><b>AI</b><small>TRAVEL<br/>ENGINE</small></div>
              {[[12,8,"🌴"],[78,17,"✈️"],[76,70,"🏔️"],[10,72,"🌊"]].map(([x,y,icon])=><span key={icon} className="orbit-chip" style={{left:`${x}%`,top:`${y}%`}}>{icon}</span>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-4 md:grid-cols-3">
            {[[Globe2,"Global discovery","Explore 150+ countries from one beautiful place."],[ShieldCheck,"Smart & secure","Your favorites and preferences stay on your device."],[WalletCards,"Plan your spend","Compare destinations and build around your budget."]].map(([Icon,title,desc])=><div key={title} className="glass-card tilt-card scroll-reveal"><Icon className="text-cyanx"/><h3>{title}</h3><p>{desc}</p></div>)}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/70 px-6 py-10 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center"><div className="flex items-center gap-2 font-black"><span className="logo-orbit"><Compass size={18}/></span>Wander<span className="text-cyanx">X</span></div><p className="text-xs text-slate-500">Explore the world. Create memories.</p></div>
      </footer>

      <button onClick={()=>setChat(true)} className="ai-fab"><Bot size={21}/><span>Ask AI</span></button>

      {searchOpen && <div className="modal-backdrop" onClick={()=>setSearchOpen(false)}><div className="search-modal" onClick={e=>e.stopPropagation()}><div className="flex items-center gap-3 border-b border-slate-200 p-4 dark:border-white/10"><Search/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search destinations..." /><button onClick={()=>setSearchOpen(false)}><X/></button></div><div className="p-4">{filtered.map(d=><button key={d.id} onClick={()=>{setSelected(d);setSearchOpen(false)}} className="flex w-full items-center gap-4 rounded-2xl p-3 text-left hover:bg-slate-100 dark:hover:bg-white/10"><img className="h-14 w-20 rounded-xl object-cover" src={d.image}/><div><b>{d.name}</b><p className="text-xs opacity-50">{d.country} · {d.category}</p></div></button>)}</div></div></div>}

      {selected && <div className="modal-backdrop" onClick={()=>setSelected(null)}><div className="trip-modal" onClick={e=>e.stopPropagation()}><img src={selected.image} alt={selected.name}/><button className="modal-close" onClick={()=>setSelected(null)}><X/></button><div className="p-7"><p className="eyebrow">{selected.category}</p><h3 className="mt-2 text-4xl font-black">{selected.name}</h3><p className="mt-2 opacity-60">{selected.tagline} · {selected.country}</p><div className="mt-6 grid grid-cols-3 gap-3"><div className="mini-stat"><Star size={14}/><b>{selected.rating}</b><small>rating</small></div><div className="mini-stat"><Plane size={14}/><b>${selected.price}</b><small>from</small></div><div className="mini-stat"><Hotel size={14}/><b>4.8</b><small>stays</small></div></div><button onClick={()=>{setSelected(null);setChat(true)}} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 font-bold text-white dark:bg-white dark:text-slate-950">Plan this trip <ArrowRight size={17}/></button></div></div></div>}

      {chat && <div className="chat-window"><div className="chat-head"><div className="flex items-center gap-2"><span className="chat-icon"><Bot size={18}/></span><div><b>WanderX Concierge</b><small>Online · ready to plan</small></div></div><button onClick={()=>setChat(false)}><X/></button></div><div className="chat-body">{messages.map((m,i)=><div key={i} className={m.from==="user" ? "msg user-msg":"msg ai-msg"}>{m.text}</div>)}</div><form onSubmit={sendChat} className="chat-input"><input value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Ask about a destination..."/><button><Send size={16}/></button></form></div>}

      {toast && <div className="toast"><Check size={16}/>{toast}</div>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
