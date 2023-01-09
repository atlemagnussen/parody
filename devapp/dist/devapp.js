import { LitElement as nn, html as Lo, css as ic } from "lit";
import { customElement as rn, property as Yr } from "lit/decorators.js";
const oc = "**", sc = "\\.\\.\\/", nc = /:([^\\/]+)/g, Xr = "router-slot", wi = window, bs = "native";
function rc(i, e) {
  i.dispatchEvent(new CustomEvent("changestate", { detail: e }));
}
function Lt(i, e) {
  wi.dispatchEvent(new CustomEvent(i, { detail: e }));
}
function Gt(i, e, t, o) {
  const s = Array.isArray(e) ? e : [e];
  return s.forEach((n) => i.addEventListener(n, t, o)), () => s.forEach((n) => i.removeEventListener(n, t, o));
}
function Qr(i) {
  i.forEach((e) => e());
}
const ac = [
  ["pushState", ["pushstate", "changestate"]],
  ["replaceState", ["replacestate", "changestate"]],
  ["forward", ["pushstate", "changestate"]],
  ["go", ["pushstate", "changestate"]],
  ["back", ["popstate"]]
];
function lc() {
  for (const [i, e] of ac)
    for (const t of e)
      cc(history, i, () => Lt(t));
  window.addEventListener("popstate", (i) => {
    if (Zr()) {
      i.preventDefault(), i.stopPropagation();
      return;
    }
    setTimeout(() => Lt("changestate"), 0);
  });
}
function cc(i, e, t) {
  const o = i[e];
  dc(i, e, o), i[e] = (...s) => {
    Zr() || (o.apply(i, s), t(s));
  };
}
function dc(i, e, t) {
  i[bs] == null && (i[bs] = {}), i[bs][`${e}`] = t.bind(i);
}
function Zr() {
  return !wi.dispatchEvent(new CustomEvent("willchangestate", { cancelable: !0 }));
}
function Jr(i = {}) {
  return Ei(window.location.pathname, i);
}
function hc(i = {}) {
  return Ei(ea(Jr(), Kr()), i);
}
function Kr(i = {}) {
  return Ei((document.baseURI || "").substring(location.origin.length), i);
}
function ea(i, e) {
  return i.replace(new RegExp(`^${e}`), "");
}
function ta() {
  return window.location.search;
}
function Ui(i) {
  return Ei(i, { start: !1, end: !1 });
}
function Ei(i, { start: e = !0, end: t = !0 } = {}) {
  return i = e && !i.startsWith("/") ? `/${i}` : !e && i.startsWith("/") ? i.slice(1) : i, t && !i.endsWith("/") ? `${i}/` : !t && i.endsWith("/") ? i.slice(0, i.length - 1) : i;
}
function uc(i, e = Jr()) {
  return new RegExp(`^${Ui(i)}(/|$)`, "gm").test(Ui(e));
}
function pc(i, e) {
  const t = [], o = Ui(i.path.replace(nc, (r, ...l) => (t.push(l[0]), "([^\\/]+)"))), s = i.path === oc || i.path === "" ? /^/ : i.fuzzy ? new RegExp(`^.*?${o}(/|$)`) : new RegExp(`^[/]?${o}(/|$)`), n = e.match(s);
  if (n != null) {
    const r = t.reduce((u, p, f) => (u[p] = n[f + 1], u), {}), l = Ui(e.slice(0, n[0].length)), c = Ui(e.slice(n[0].length, e.length));
    return {
      route: i,
      match: n,
      params: r,
      fragments: {
        consumed: l,
        rest: c
      }
    };
  }
  return null;
}
function fc(i, e) {
  for (const t of i) {
    const o = pc(t, e);
    if (o != null)
      return o;
  }
  return null;
}
async function gc(i, e) {
  let t = i.component;
  if (t instanceof Function)
    try {
      t = t();
    } catch (n) {
      if (!(n instanceof TypeError))
        throw n;
    }
  const o = await Promise.resolve(t);
  let s;
  return o instanceof HTMLElement ? s = t : s = new (o.default ? o.default : o)(), i.setup != null && i.setup(s, e), s;
}
function mc(i) {
  return i.redirectTo != null;
}
function bc(i) {
  return i.resolve != null;
}
function vc(i) {
  let e = [i];
  for (; i.parent != null; )
    i = i.parent, e.push(i);
  const t = e.reduce((s, n) => ({ slot: n, child: s }), void 0), o = e.length;
  return { tree: t, depth: o };
}
function yc(i, e) {
  let t = i;
  const o = [];
  for (; t != null && t.slot.match != null && e > 0; )
    o.push(t.slot.match.fragments.consumed), t = t.child, e--;
  return o;
}
function ia(i, e = "") {
  const { tree: t, depth: o } = vc(i);
  if (!e.startsWith("/")) {
    let s = 0;
    e.startsWith("./") && (e = e.slice(2));
    const n = e.match(new RegExp(sc, "g"));
    if (n != null) {
      s = n.length;
      const l = n.reduce((c, u) => c + u.length, 0);
      e = e.slice(l);
    }
    const r = yc(t, o - 1 - s);
    e = `${Kr()}${r.join("/")}${r.length > 0 ? "/" : ""}${e}`;
  }
  return Ei(e, { end: !1 });
}
function xc(i, e) {
  history.replaceState(history.state, "", `${ia(i, e.redirectTo)}${e.preserveQuery ? ta() : ""}`);
}
function $c(i, e) {
  if (i == null)
    return !0;
  const { route: t, fragments: o } = i, { route: s, fragments: n } = e, r = t == s;
  return !(o.consumed == n.consumed) || !r;
}
function oa(i) {
  return sa(i, Xr);
}
function sa(i, e, t = 0, o = 0) {
  const s = i.getRootNode();
  if (o >= t) {
    const r = s.querySelector(e);
    if (r != null && r != i)
      return r;
  }
  const n = s.getRootNode();
  return n.host == null ? null : sa(n.host, e, t, ++o);
}
function wc() {
  window.addEventListener("click", (i) => {
    const e = "composedPath" in i ? i.composedPath()[0] : i.target;
    if (!(e instanceof HTMLAnchorElement))
      return;
    const t = e.href;
    if (!t.startsWith(location.origin) || e.target !== "" && e.target !== "_self")
      return;
    const o = ea(t, location.origin);
    i.preventDefault(), history.pushState(null, "", o);
  });
}
const na = document.createElement("template");
na.innerHTML = "<slot></slot>";
lc();
wc();
class kc extends HTMLElement {
  constructor() {
    super(), this.listeners = [], this._routes = [], this._routeMatch = null, this.idasd = Math.random(), this.render = this.render.bind(this), this.attachShadow({ mode: "open" }).appendChild(na.content.cloneNode(!0));
  }
  get routes() {
    return this._routes;
  }
  set routes(e) {
    this.clear(), this.add(e);
  }
  get parent() {
    return this._parent;
  }
  set parent(e) {
    this.detachListeners(), this._parent = e, this.attachListeners();
  }
  get route() {
    return this.match != null ? this.match.route : null;
  }
  get fragments() {
    return this.match != null ? this.match.fragments : null;
  }
  get match() {
    return this._routeMatch;
  }
  get isRoot() {
    return this.parent == null;
  }
  connectedCallback() {
    this.parent = this.queryParentRouterSlot();
  }
  disconnectedCallback() {
    this.detachListeners();
  }
  queryParentRouterSlot() {
    return oa(this);
  }
  constructAbsolutePath(e) {
    return ia(this, e);
  }
  add(e, t = this.isRoot && this.isConnected) {
    this._routes.push(...e), t && this.render().then();
  }
  clear() {
    this._routes.length = 0;
  }
  async render() {
    const e = this.parent != null && this.parent.fragments != null ? this.parent.fragments.rest : hc();
    await this.renderPath(e);
  }
  attachListeners() {
    this.listeners.push(this.parent != null ? Gt(this.parent, "changestate", this.render) : Gt(wi, "changestate", this.render));
  }
  detachListeners() {
    Qr(this.listeners);
  }
  async renderPath(e) {
    const t = fc(this._routes, e);
    if (t == null)
      return this._routeMatch = null, !1;
    const { route: o } = t, s = { match: t, slot: this };
    try {
      const n = $c(this.match, t);
      if (n) {
        let r = !1;
        const c = Gt(wi, "changestate", () => r = !0, { once: !0 }), u = () => (c(), Lt("navigationcancel", s), !1);
        if (Lt("navigationstart", s), o.guards != null) {
          for (const p of o.guards)
            if (!await p(s))
              return u();
        }
        if (mc(o))
          return c(), xc(this, o), !1;
        if (bc(o)) {
          if (await o.resolve(s) === !1)
            return u();
        } else {
          const p = await gc(o, s);
          if (r)
            return u();
          for (; this.firstChild != null; )
            this.firstChild.remove();
          this.appendChild(p);
        }
        c();
      }
      return this._routeMatch = t, requestAnimationFrame(() => {
        rc(this, s);
      }), n && (Lt("navigationsuccess", s), Lt("navigationend", s)), n;
    } catch (n) {
      throw Lt("navigationerror", s), Lt("navigationend", s), n;
    }
  }
}
window.customElements.define(Xr, kc);
const ra = document.createElement("template");
ra.innerHTML = "<slot></slot>";
class Cc extends HTMLElement {
  constructor() {
    super(), this.listeners = [], this._context = null, this.navigate = this.navigate.bind(this), this.updateActive = this.updateActive.bind(this), this.attachShadow({ mode: "open", delegatesFocus: this.delegateFocus }).appendChild(ra.content.cloneNode(!0));
  }
  static get observedAttributes() {
    return [
      "disabled"
    ];
  }
  set path(e) {
    this.setAttribute("path", e);
  }
  get path() {
    return this.getAttribute("path") || "/";
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  set disabled(e) {
    e ? this.setAttribute("disabled", "") : this.removeAttribute("disabled");
  }
  get active() {
    return this.hasAttribute("active");
  }
  set active(e) {
    e ? this.setAttribute("active", "") : this.removeAttribute("active");
  }
  get delegateFocus() {
    return this.hasAttribute("delegateFocus");
  }
  set delegateFocus(e) {
    e ? this.setAttribute("delegateFocus", "") : this.removeAttribute("delegateFocus");
  }
  get preserveQuery() {
    return this.hasAttribute("preservequery");
  }
  set preserveQuery(e) {
    e ? this.setAttribute("preservequery", "") : this.removeAttribute("preservequery");
  }
  get context() {
    return this._context;
  }
  set context(e) {
    this._context = e;
  }
  get absolutePath() {
    return this.constructAbsolutePath(this.path);
  }
  connectedCallback() {
    this.listeners.push(Gt(this, "click", (e) => this.navigate(this.path, e)), Gt(this, "keydown", (e) => e.code === "Enter" || e.code === "Space" ? this.navigate(this.path, e) : void 0), Gt(wi, "navigationend", this.updateActive), Gt(wi, "changestate", this.updateActive)), this.context = oa(this), this.setAttribute("role", "link"), this.hasAttribute("tabindex") || this.updateTabIndex();
  }
  disconnectedCallback() {
    Qr(this.listeners);
  }
  attributeChangedCallback(e, t, o) {
    e === "disabled" && this.updateTabIndex();
  }
  updateTabIndex() {
    this.tabIndex = this.disabled ? -1 : 0;
  }
  constructAbsolutePath(e) {
    return this.context != null ? this.context.constructAbsolutePath(e) : Ei(e, { end: !1 });
  }
  updateActive() {
    const e = uc(this.absolutePath);
    e !== this.active && (this.active = e);
  }
  navigate(e, t) {
    if (t != null && this.disabled) {
      t.preventDefault(), t.stopPropagation();
      return;
    }
    history.pushState(null, "", `${this.absolutePath}${this.preserveQuery ? ta() : ""}`);
  }
}
window.customElements.define("router-link", Cc);
const $t = function() {
  if (typeof globalThis < "u")
    return globalThis;
  if (typeof global < "u")
    return global;
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  try {
    return new Function("return this")();
  } catch {
    return {};
  }
}();
$t.trustedTypes === void 0 && ($t.trustedTypes = { createPolicy: (i, e) => e });
const aa = {
  configurable: !1,
  enumerable: !1,
  writable: !1
};
$t.FAST === void 0 && Reflect.defineProperty($t, "FAST", Object.assign({ value: /* @__PURE__ */ Object.create(null) }, aa));
const Xi = $t.FAST;
if (Xi.getById === void 0) {
  const i = /* @__PURE__ */ Object.create(null);
  Reflect.defineProperty(Xi, "getById", Object.assign({ value(e, t) {
    let o = i[e];
    return o === void 0 && (o = t ? i[e] = t() : null), o;
  } }, aa));
}
const Wt = Object.freeze([]);
function la() {
  const i = /* @__PURE__ */ new WeakMap();
  return function(e) {
    let t = i.get(e);
    if (t === void 0) {
      let o = Reflect.getPrototypeOf(e);
      for (; t === void 0 && o !== null; )
        t = i.get(o), o = Reflect.getPrototypeOf(o);
      t = t === void 0 ? [] : t.slice(0), i.set(e, t);
    }
    return t;
  };
}
const vs = $t.FAST.getById(1, () => {
  const i = [], e = [];
  function t() {
    if (e.length)
      throw e.shift();
  }
  function o(r) {
    try {
      r.call();
    } catch (l) {
      e.push(l), setTimeout(t, 0);
    }
  }
  function s() {
    let l = 0;
    for (; l < i.length; )
      if (o(i[l]), l++, l > 1024) {
        for (let c = 0, u = i.length - l; c < u; c++)
          i[c] = i[c + l];
        i.length -= l, l = 0;
      }
    i.length = 0;
  }
  function n(r) {
    i.length < 1 && $t.requestAnimationFrame(s), i.push(r);
  }
  return Object.freeze({
    enqueue: n,
    process: s
  });
}), ca = $t.trustedTypes.createPolicy("fast-html", {
  createHTML: (i) => i
});
let ys = ca;
const qi = `fast-${Math.random().toString(36).substring(2, 8)}`, da = `${qi}{`, an = `}${qi}`, R = Object.freeze({
  supportsAdoptedStyleSheets: Array.isArray(document.adoptedStyleSheets) && "replace" in CSSStyleSheet.prototype,
  setHTMLPolicy(i) {
    if (ys !== ca)
      throw new Error("The HTML policy can only be set once.");
    ys = i;
  },
  createHTML(i) {
    return ys.createHTML(i);
  },
  isMarker(i) {
    return i && i.nodeType === 8 && i.data.startsWith(qi);
  },
  extractDirectiveIndexFromMarker(i) {
    return parseInt(i.data.replace(`${qi}:`, ""));
  },
  createInterpolationPlaceholder(i) {
    return `${da}${i}${an}`;
  },
  createCustomAttributePlaceholder(i, e) {
    return `${i}="${this.createInterpolationPlaceholder(e)}"`;
  },
  createBlockPlaceholder(i) {
    return `<!--${qi}:${i}-->`;
  },
  queueUpdate: vs.enqueue,
  processUpdates: vs.process,
  nextUpdate() {
    return new Promise(vs.enqueue);
  },
  setAttribute(i, e, t) {
    t == null ? i.removeAttribute(e) : i.setAttribute(e, t);
  },
  setBooleanAttribute(i, e, t) {
    t ? i.setAttribute(e, "") : i.removeAttribute(e);
  },
  removeChildNodes(i) {
    for (let e = i.firstChild; e !== null; e = i.firstChild)
      i.removeChild(e);
  },
  createTemplateWalker(i) {
    return document.createTreeWalker(
      i,
      133,
      null,
      !1
    );
  }
});
class Ao {
  constructor(e, t) {
    this.sub1 = void 0, this.sub2 = void 0, this.spillover = void 0, this.source = e, this.sub1 = t;
  }
  has(e) {
    return this.spillover === void 0 ? this.sub1 === e || this.sub2 === e : this.spillover.indexOf(e) !== -1;
  }
  subscribe(e) {
    const t = this.spillover;
    if (t === void 0) {
      if (this.has(e))
        return;
      if (this.sub1 === void 0) {
        this.sub1 = e;
        return;
      }
      if (this.sub2 === void 0) {
        this.sub2 = e;
        return;
      }
      this.spillover = [this.sub1, this.sub2, e], this.sub1 = void 0, this.sub2 = void 0;
    } else
      t.indexOf(e) === -1 && t.push(e);
  }
  unsubscribe(e) {
    const t = this.spillover;
    if (t === void 0)
      this.sub1 === e ? this.sub1 = void 0 : this.sub2 === e && (this.sub2 = void 0);
    else {
      const o = t.indexOf(e);
      o !== -1 && t.splice(o, 1);
    }
  }
  notify(e) {
    const t = this.spillover, o = this.source;
    if (t === void 0) {
      const s = this.sub1, n = this.sub2;
      s !== void 0 && s.handleChange(o, e), n !== void 0 && n.handleChange(o, e);
    } else
      for (let s = 0, n = t.length; s < n; ++s)
        t[s].handleChange(o, e);
  }
}
class ha {
  constructor(e) {
    this.subscribers = {}, this.sourceSubscribers = null, this.source = e;
  }
  notify(e) {
    var t;
    const o = this.subscribers[e];
    o !== void 0 && o.notify(e), (t = this.sourceSubscribers) === null || t === void 0 || t.notify(e);
  }
  subscribe(e, t) {
    var o;
    if (t) {
      let s = this.subscribers[t];
      s === void 0 && (this.subscribers[t] = s = new Ao(this.source)), s.subscribe(e);
    } else
      this.sourceSubscribers = (o = this.sourceSubscribers) !== null && o !== void 0 ? o : new Ao(this.source), this.sourceSubscribers.subscribe(e);
  }
  unsubscribe(e, t) {
    var o;
    if (t) {
      const s = this.subscribers[t];
      s !== void 0 && s.unsubscribe(e);
    } else
      (o = this.sourceSubscribers) === null || o === void 0 || o.unsubscribe(e);
  }
}
const A = Xi.getById(2, () => {
  const i = /(:|&&|\|\||if)/, e = /* @__PURE__ */ new WeakMap(), t = R.queueUpdate;
  let o, s = (u) => {
    throw new Error("Must call enableArrayObservation before observing arrays.");
  };
  function n(u) {
    let p = u.$fastController || e.get(u);
    return p === void 0 && (Array.isArray(u) ? p = s(u) : e.set(u, p = new ha(u))), p;
  }
  const r = la();
  class l {
    constructor(p) {
      this.name = p, this.field = `_${p}`, this.callback = `${p}Changed`;
    }
    getValue(p) {
      return o !== void 0 && o.watch(p, this.name), p[this.field];
    }
    setValue(p, f) {
      const b = this.field, I = p[b];
      if (I !== f) {
        p[b] = f;
        const $ = p[this.callback];
        typeof $ == "function" && $.call(p, I, f), n(p).notify(this.name);
      }
    }
  }
  class c extends Ao {
    constructor(p, f, b = !1) {
      super(p, f), this.binding = p, this.isVolatileBinding = b, this.needsRefresh = !0, this.needsQueue = !0, this.first = this, this.last = null, this.propertySource = void 0, this.propertyName = void 0, this.notifier = void 0, this.next = void 0;
    }
    observe(p, f) {
      this.needsRefresh && this.last !== null && this.disconnect();
      const b = o;
      o = this.needsRefresh ? this : void 0, this.needsRefresh = this.isVolatileBinding;
      const I = this.binding(p, f);
      return o = b, I;
    }
    disconnect() {
      if (this.last !== null) {
        let p = this.first;
        for (; p !== void 0; )
          p.notifier.unsubscribe(this, p.propertyName), p = p.next;
        this.last = null, this.needsRefresh = this.needsQueue = !0;
      }
    }
    watch(p, f) {
      const b = this.last, I = n(p), $ = b === null ? this.first : {};
      if ($.propertySource = p, $.propertyName = f, $.notifier = I, I.subscribe(this, f), b !== null) {
        if (!this.needsRefresh) {
          let k;
          o = void 0, k = b.propertySource[b.propertyName], o = this, p === k && (this.needsRefresh = !0);
        }
        b.next = $;
      }
      this.last = $;
    }
    handleChange() {
      this.needsQueue && (this.needsQueue = !1, t(this));
    }
    call() {
      this.last !== null && (this.needsQueue = !0, this.notify(this));
    }
    records() {
      let p = this.first;
      return {
        next: () => {
          const f = p;
          return f === void 0 ? { value: void 0, done: !0 } : (p = p.next, {
            value: f,
            done: !1
          });
        },
        [Symbol.iterator]: function() {
          return this;
        }
      };
    }
  }
  return Object.freeze({
    setArrayObserverFactory(u) {
      s = u;
    },
    getNotifier: n,
    track(u, p) {
      o !== void 0 && o.watch(u, p);
    },
    trackVolatile() {
      o !== void 0 && (o.needsRefresh = !0);
    },
    notify(u, p) {
      n(u).notify(p);
    },
    defineProperty(u, p) {
      typeof p == "string" && (p = new l(p)), r(u).push(p), Reflect.defineProperty(u, p.name, {
        enumerable: !0,
        get: function() {
          return p.getValue(this);
        },
        set: function(f) {
          p.setValue(this, f);
        }
      });
    },
    getAccessors: r,
    binding(u, p, f = this.isVolatileBinding(u)) {
      return new c(u, p, f);
    },
    isVolatileBinding(u) {
      return i.test(u.toString());
    }
  });
});
function g(i, e) {
  A.defineProperty(i, e);
}
function Tc(i, e, t) {
  return Object.assign({}, t, {
    get: function() {
      return A.trackVolatile(), t.get.apply(this);
    }
  });
}
const Vn = Xi.getById(3, () => {
  let i = null;
  return {
    get() {
      return i;
    },
    set(e) {
      i = e;
    }
  };
});
class Qi {
  constructor() {
    this.index = 0, this.length = 0, this.parent = null, this.parentContext = null;
  }
  get event() {
    return Vn.get();
  }
  get isEven() {
    return this.index % 2 === 0;
  }
  get isOdd() {
    return this.index % 2 !== 0;
  }
  get isFirst() {
    return this.index === 0;
  }
  get isInMiddle() {
    return !this.isFirst && !this.isLast;
  }
  get isLast() {
    return this.index === this.length - 1;
  }
  static setEvent(e) {
    Vn.set(e);
  }
}
A.defineProperty(Qi.prototype, "index");
A.defineProperty(Qi.prototype, "length");
const Gi = Object.seal(new Qi());
class jo {
  constructor() {
    this.targetIndex = 0;
  }
}
class ua extends jo {
  constructor() {
    super(...arguments), this.createPlaceholder = R.createInterpolationPlaceholder;
  }
}
class ln extends jo {
  constructor(e, t, o) {
    super(), this.name = e, this.behavior = t, this.options = o;
  }
  createPlaceholder(e) {
    return R.createCustomAttributePlaceholder(this.name, e);
  }
  createBehavior(e) {
    return new this.behavior(e, this.options);
  }
}
function Ic(i, e) {
  this.source = i, this.context = e, this.bindingObserver === null && (this.bindingObserver = A.binding(this.binding, this, this.isBindingVolatile)), this.updateTarget(this.bindingObserver.observe(i, e));
}
function Sc(i, e) {
  this.source = i, this.context = e, this.target.addEventListener(this.targetName, this);
}
function Fc() {
  this.bindingObserver.disconnect(), this.source = null, this.context = null;
}
function Ec() {
  this.bindingObserver.disconnect(), this.source = null, this.context = null;
  const i = this.target.$fastView;
  i !== void 0 && i.isComposed && (i.unbind(), i.needsBindOnly = !0);
}
function Rc() {
  this.target.removeEventListener(this.targetName, this), this.source = null, this.context = null;
}
function Dc(i) {
  R.setAttribute(this.target, this.targetName, i);
}
function Oc(i) {
  R.setBooleanAttribute(this.target, this.targetName, i);
}
function Lc(i) {
  if (i == null && (i = ""), i.create) {
    this.target.textContent = "";
    let e = this.target.$fastView;
    e === void 0 ? e = i.create() : this.target.$fastTemplate !== i && (e.isComposed && (e.remove(), e.unbind()), e = i.create()), e.isComposed ? e.needsBindOnly && (e.needsBindOnly = !1, e.bind(this.source, this.context)) : (e.isComposed = !0, e.bind(this.source, this.context), e.insertBefore(this.target), this.target.$fastView = e, this.target.$fastTemplate = i);
  } else {
    const e = this.target.$fastView;
    e !== void 0 && e.isComposed && (e.isComposed = !1, e.remove(), e.needsBindOnly ? e.needsBindOnly = !1 : e.unbind()), this.target.textContent = i;
  }
}
function Ac(i) {
  this.target[this.targetName] = i;
}
function Pc(i) {
  const e = this.classVersions || /* @__PURE__ */ Object.create(null), t = this.target;
  let o = this.version || 0;
  if (i != null && i.length) {
    const s = i.split(/\s+/);
    for (let n = 0, r = s.length; n < r; ++n) {
      const l = s[n];
      l !== "" && (e[l] = o, t.classList.add(l));
    }
  }
  if (this.classVersions = e, this.version = o + 1, o !== 0) {
    o -= 1;
    for (const s in e)
      e[s] === o && t.classList.remove(s);
  }
}
class cn extends ua {
  constructor(e) {
    super(), this.binding = e, this.bind = Ic, this.unbind = Fc, this.updateTarget = Dc, this.isBindingVolatile = A.isVolatileBinding(this.binding);
  }
  get targetName() {
    return this.originalTargetName;
  }
  set targetName(e) {
    if (this.originalTargetName = e, e !== void 0)
      switch (e[0]) {
        case ":":
          if (this.cleanedTargetName = e.substr(1), this.updateTarget = Ac, this.cleanedTargetName === "innerHTML") {
            const t = this.binding;
            this.binding = (o, s) => R.createHTML(t(o, s));
          }
          break;
        case "?":
          this.cleanedTargetName = e.substr(1), this.updateTarget = Oc;
          break;
        case "@":
          this.cleanedTargetName = e.substr(1), this.bind = Sc, this.unbind = Rc;
          break;
        default:
          this.cleanedTargetName = e, e === "class" && (this.updateTarget = Pc);
          break;
      }
  }
  targetAtContent() {
    this.updateTarget = Lc, this.unbind = Ec;
  }
  createBehavior(e) {
    return new Mc(e, this.binding, this.isBindingVolatile, this.bind, this.unbind, this.updateTarget, this.cleanedTargetName);
  }
}
class Mc {
  constructor(e, t, o, s, n, r, l) {
    this.source = null, this.context = null, this.bindingObserver = null, this.target = e, this.binding = t, this.isBindingVolatile = o, this.bind = s, this.unbind = n, this.updateTarget = r, this.targetName = l;
  }
  handleChange() {
    this.updateTarget(this.bindingObserver.observe(this.source, this.context));
  }
  handleEvent(e) {
    Qi.setEvent(e);
    const t = this.binding(this.source, this.context);
    Qi.setEvent(null), t !== !0 && e.preventDefault();
  }
}
let xs = null;
class dn {
  addFactory(e) {
    e.targetIndex = this.targetIndex, this.behaviorFactories.push(e);
  }
  captureContentBinding(e) {
    e.targetAtContent(), this.addFactory(e);
  }
  reset() {
    this.behaviorFactories = [], this.targetIndex = -1;
  }
  release() {
    xs = this;
  }
  static borrow(e) {
    const t = xs || new dn();
    return t.directives = e, t.reset(), xs = null, t;
  }
}
function Vc(i) {
  if (i.length === 1)
    return i[0];
  let e;
  const t = i.length, o = i.map((r) => typeof r == "string" ? () => r : (e = r.targetName || e, r.binding)), s = (r, l) => {
    let c = "";
    for (let u = 0; u < t; ++u)
      c += o[u](r, l);
    return c;
  }, n = new cn(s);
  return n.targetName = e, n;
}
const Hc = an.length;
function pa(i, e) {
  const t = e.split(da);
  if (t.length === 1)
    return null;
  const o = [];
  for (let s = 0, n = t.length; s < n; ++s) {
    const r = t[s], l = r.indexOf(an);
    let c;
    if (l === -1)
      c = r;
    else {
      const u = parseInt(r.substring(0, l));
      o.push(i.directives[u]), c = r.substring(l + Hc);
    }
    c !== "" && o.push(c);
  }
  return o;
}
function Hn(i, e, t = !1) {
  const o = e.attributes;
  for (let s = 0, n = o.length; s < n; ++s) {
    const r = o[s], l = r.value, c = pa(i, l);
    let u = null;
    c === null ? t && (u = new cn(() => l), u.targetName = r.name) : u = Vc(c), u !== null && (e.removeAttributeNode(r), s--, n--, i.addFactory(u));
  }
}
function zc(i, e, t) {
  const o = pa(i, e.textContent);
  if (o !== null) {
    let s = e;
    for (let n = 0, r = o.length; n < r; ++n) {
      const l = o[n], c = n === 0 ? e : s.parentNode.insertBefore(document.createTextNode(""), s.nextSibling);
      typeof l == "string" ? c.textContent = l : (c.textContent = " ", i.captureContentBinding(l)), s = c, i.targetIndex++, c !== e && t.nextNode();
    }
    i.targetIndex--;
  }
}
function Nc(i, e) {
  const t = i.content;
  document.adoptNode(t);
  const o = dn.borrow(e);
  Hn(o, i, !0);
  const s = o.behaviorFactories;
  o.reset();
  const n = R.createTemplateWalker(t);
  let r;
  for (; r = n.nextNode(); )
    switch (o.targetIndex++, r.nodeType) {
      case 1:
        Hn(o, r);
        break;
      case 3:
        zc(o, r, n);
        break;
      case 8:
        R.isMarker(r) && o.addFactory(e[R.extractDirectiveIndexFromMarker(r)]);
    }
  let l = 0;
  (R.isMarker(t.firstChild) || t.childNodes.length === 1 && e.length) && (t.insertBefore(document.createComment(""), t.firstChild), l = -1);
  const c = o.behaviorFactories;
  return o.release(), {
    fragment: t,
    viewBehaviorFactories: c,
    hostBehaviorFactories: s,
    targetOffset: l
  };
}
const $s = document.createRange();
class fa {
  constructor(e, t) {
    this.fragment = e, this.behaviors = t, this.source = null, this.context = null, this.firstChild = e.firstChild, this.lastChild = e.lastChild;
  }
  appendTo(e) {
    e.appendChild(this.fragment);
  }
  insertBefore(e) {
    if (this.fragment.hasChildNodes())
      e.parentNode.insertBefore(this.fragment, e);
    else {
      const t = this.lastChild;
      if (e.previousSibling === t)
        return;
      const o = e.parentNode;
      let s = this.firstChild, n;
      for (; s !== t; )
        n = s.nextSibling, o.insertBefore(s, e), s = n;
      o.insertBefore(t, e);
    }
  }
  remove() {
    const e = this.fragment, t = this.lastChild;
    let o = this.firstChild, s;
    for (; o !== t; )
      s = o.nextSibling, e.appendChild(o), o = s;
    e.appendChild(t);
  }
  dispose() {
    const e = this.firstChild.parentNode, t = this.lastChild;
    let o = this.firstChild, s;
    for (; o !== t; )
      s = o.nextSibling, e.removeChild(o), o = s;
    e.removeChild(t);
    const n = this.behaviors, r = this.source;
    for (let l = 0, c = n.length; l < c; ++l)
      n[l].unbind(r);
  }
  bind(e, t) {
    const o = this.behaviors;
    if (this.source !== e)
      if (this.source !== null) {
        const s = this.source;
        this.source = e, this.context = t;
        for (let n = 0, r = o.length; n < r; ++n) {
          const l = o[n];
          l.unbind(s), l.bind(e, t);
        }
      } else {
        this.source = e, this.context = t;
        for (let s = 0, n = o.length; s < n; ++s)
          o[s].bind(e, t);
      }
  }
  unbind() {
    if (this.source === null)
      return;
    const e = this.behaviors, t = this.source;
    for (let o = 0, s = e.length; o < s; ++o)
      e[o].unbind(t);
    this.source = null;
  }
  static disposeContiguousBatch(e) {
    if (e.length !== 0) {
      $s.setStartBefore(e[0].firstChild), $s.setEndAfter(e[e.length - 1].lastChild), $s.deleteContents();
      for (let t = 0, o = e.length; t < o; ++t) {
        const s = e[t], n = s.behaviors, r = s.source;
        for (let l = 0, c = n.length; l < c; ++l)
          n[l].unbind(r);
      }
    }
  }
}
class zn {
  constructor(e, t) {
    this.behaviorCount = 0, this.hasHostBehaviors = !1, this.fragment = null, this.targetOffset = 0, this.viewBehaviorFactories = null, this.hostBehaviorFactories = null, this.html = e, this.directives = t;
  }
  create(e) {
    if (this.fragment === null) {
      let u;
      const p = this.html;
      if (typeof p == "string") {
        u = document.createElement("template"), u.innerHTML = R.createHTML(p);
        const b = u.content.firstElementChild;
        b !== null && b.tagName === "TEMPLATE" && (u = b);
      } else
        u = p;
      const f = Nc(u, this.directives);
      this.fragment = f.fragment, this.viewBehaviorFactories = f.viewBehaviorFactories, this.hostBehaviorFactories = f.hostBehaviorFactories, this.targetOffset = f.targetOffset, this.behaviorCount = this.viewBehaviorFactories.length + this.hostBehaviorFactories.length, this.hasHostBehaviors = this.hostBehaviorFactories.length > 0;
    }
    const t = this.fragment.cloneNode(!0), o = this.viewBehaviorFactories, s = new Array(this.behaviorCount), n = R.createTemplateWalker(t);
    let r = 0, l = this.targetOffset, c = n.nextNode();
    for (let u = o.length; r < u; ++r) {
      const p = o[r], f = p.targetIndex;
      for (; c !== null; )
        if (l === f) {
          s[r] = p.createBehavior(c);
          break;
        } else
          c = n.nextNode(), l++;
    }
    if (this.hasHostBehaviors) {
      const u = this.hostBehaviorFactories;
      for (let p = 0, f = u.length; p < f; ++p, ++r)
        s[r] = u[p].createBehavior(e);
    }
    return new fa(t, s);
  }
  render(e, t, o) {
    typeof t == "string" && (t = document.getElementById(t)), o === void 0 && (o = t);
    const s = this.create(o);
    return s.bind(e, Gi), s.appendTo(t), s;
  }
}
const Bc = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
function v(i, ...e) {
  const t = [];
  let o = "";
  for (let s = 0, n = i.length - 1; s < n; ++s) {
    const r = i[s];
    let l = e[s];
    if (o += r, l instanceof zn) {
      const c = l;
      l = () => c;
    }
    if (typeof l == "function" && (l = new cn(l)), l instanceof ua) {
      const c = Bc.exec(r);
      c !== null && (l.targetName = c[2]);
    }
    l instanceof jo ? (o += l.createPlaceholder(t.length), t.push(l)) : o += l;
  }
  return o += i[i.length - 1], new zn(o, t);
}
class Oe {
  constructor() {
    this.targets = /* @__PURE__ */ new WeakSet();
  }
  addStylesTo(e) {
    this.targets.add(e);
  }
  removeStylesFrom(e) {
    this.targets.delete(e);
  }
  isAttachedTo(e) {
    return this.targets.has(e);
  }
  withBehaviors(...e) {
    return this.behaviors = this.behaviors === null ? e : this.behaviors.concat(e), this;
  }
}
Oe.create = (() => {
  if (R.supportsAdoptedStyleSheets) {
    const i = /* @__PURE__ */ new Map();
    return (e) => new jc(e, i);
  }
  return (i) => new qc(i);
})();
function hn(i) {
  return i.map((e) => e instanceof Oe ? hn(e.styles) : [e]).reduce((e, t) => e.concat(t), []);
}
function ga(i) {
  return i.map((e) => e instanceof Oe ? e.behaviors : null).reduce((e, t) => t === null ? e : (e === null && (e = []), e.concat(t)), null);
}
class jc extends Oe {
  constructor(e, t) {
    super(), this.styles = e, this.styleSheetCache = t, this._styleSheets = void 0, this.behaviors = ga(e);
  }
  get styleSheets() {
    if (this._styleSheets === void 0) {
      const e = this.styles, t = this.styleSheetCache;
      this._styleSheets = hn(e).map((o) => {
        if (o instanceof CSSStyleSheet)
          return o;
        let s = t.get(o);
        return s === void 0 && (s = new CSSStyleSheet(), s.replaceSync(o), t.set(o, s)), s;
      });
    }
    return this._styleSheets;
  }
  addStylesTo(e) {
    e.adoptedStyleSheets = [...e.adoptedStyleSheets, ...this.styleSheets], super.addStylesTo(e);
  }
  removeStylesFrom(e) {
    const t = this.styleSheets;
    e.adoptedStyleSheets = e.adoptedStyleSheets.filter((o) => t.indexOf(o) === -1), super.removeStylesFrom(e);
  }
}
let _c = 0;
function Uc() {
  return `fast-style-class-${++_c}`;
}
class qc extends Oe {
  constructor(e) {
    super(), this.styles = e, this.behaviors = null, this.behaviors = ga(e), this.styleSheets = hn(e), this.styleClass = Uc();
  }
  addStylesTo(e) {
    const t = this.styleSheets, o = this.styleClass;
    e = this.normalizeTarget(e);
    for (let s = 0; s < t.length; s++) {
      const n = document.createElement("style");
      n.innerHTML = t[s], n.className = o, e.append(n);
    }
    super.addStylesTo(e);
  }
  removeStylesFrom(e) {
    e = this.normalizeTarget(e);
    const t = e.querySelectorAll(`.${this.styleClass}`);
    for (let o = 0, s = t.length; o < s; ++o)
      e.removeChild(t[o]);
    super.removeStylesFrom(e);
  }
  isAttachedTo(e) {
    return super.isAttachedTo(this.normalizeTarget(e));
  }
  normalizeTarget(e) {
    return e === document ? document.body : e;
  }
}
const Po = Object.freeze({
  locate: la()
}), _o = {
  toView(i) {
    return i ? "true" : "false";
  },
  fromView(i) {
    return !(i == null || i === "false" || i === !1 || i === 0);
  }
}, C = {
  toView(i) {
    if (i == null)
      return null;
    const e = i * 1;
    return isNaN(e) ? null : e.toString();
  },
  fromView(i) {
    if (i == null)
      return null;
    const e = i * 1;
    return isNaN(e) ? null : e;
  }
};
class Mo {
  constructor(e, t, o = t.toLowerCase(), s = "reflect", n) {
    this.guards = /* @__PURE__ */ new Set(), this.Owner = e, this.name = t, this.attribute = o, this.mode = s, this.converter = n, this.fieldName = `_${t}`, this.callbackName = `${t}Changed`, this.hasCallback = this.callbackName in e.prototype, s === "boolean" && n === void 0 && (this.converter = _o);
  }
  setValue(e, t) {
    const o = e[this.fieldName], s = this.converter;
    s !== void 0 && (t = s.fromView(t)), o !== t && (e[this.fieldName] = t, this.tryReflectToAttribute(e), this.hasCallback && e[this.callbackName](o, t), e.$fastController.notify(this.name));
  }
  getValue(e) {
    return A.track(e, this.name), e[this.fieldName];
  }
  onAttributeChangedCallback(e, t) {
    this.guards.has(e) || (this.guards.add(e), this.setValue(e, t), this.guards.delete(e));
  }
  tryReflectToAttribute(e) {
    const t = this.mode, o = this.guards;
    o.has(e) || t === "fromView" || R.queueUpdate(() => {
      o.add(e);
      const s = e[this.fieldName];
      switch (t) {
        case "reflect":
          const n = this.converter;
          R.setAttribute(e, this.attribute, n !== void 0 ? n.toView(s) : s);
          break;
        case "boolean":
          R.setBooleanAttribute(e, this.attribute, s);
          break;
      }
      o.delete(e);
    });
  }
  static collect(e, ...t) {
    const o = [];
    t.push(Po.locate(e));
    for (let s = 0, n = t.length; s < n; ++s) {
      const r = t[s];
      if (r !== void 0)
        for (let l = 0, c = r.length; l < c; ++l) {
          const u = r[l];
          typeof u == "string" ? o.push(new Mo(e, u)) : o.push(new Mo(e, u.property, u.attribute, u.mode, u.converter));
        }
    }
    return o;
  }
}
function h(i, e) {
  let t;
  function o(s, n) {
    arguments.length > 1 && (t.property = n), Po.locate(s.constructor).push(t);
  }
  if (arguments.length > 1) {
    t = {}, o(i, e);
    return;
  }
  return t = i === void 0 ? {} : i, o;
}
const Nn = { mode: "open" }, Bn = {}, Vs = Xi.getById(4, () => {
  const i = /* @__PURE__ */ new Map();
  return Object.freeze({
    register(e) {
      return i.has(e.type) ? !1 : (i.set(e.type, e), !0);
    },
    getByType(e) {
      return i.get(e);
    }
  });
});
class uo {
  constructor(e, t = e.definition) {
    typeof t == "string" && (t = { name: t }), this.type = e, this.name = t.name, this.template = t.template;
    const o = Mo.collect(e, t.attributes), s = new Array(o.length), n = {}, r = {};
    for (let l = 0, c = o.length; l < c; ++l) {
      const u = o[l];
      s[l] = u.attribute, n[u.name] = u, r[u.attribute] = u;
    }
    this.attributes = o, this.observedAttributes = s, this.propertyLookup = n, this.attributeLookup = r, this.shadowOptions = t.shadowOptions === void 0 ? Nn : t.shadowOptions === null ? void 0 : Object.assign(Object.assign({}, Nn), t.shadowOptions), this.elementOptions = t.elementOptions === void 0 ? Bn : Object.assign(Object.assign({}, Bn), t.elementOptions), this.styles = t.styles === void 0 ? void 0 : Array.isArray(t.styles) ? Oe.create(t.styles) : t.styles instanceof Oe ? t.styles : Oe.create([t.styles]);
  }
  get isDefined() {
    return !!Vs.getByType(this.type);
  }
  define(e = customElements) {
    const t = this.type;
    if (Vs.register(this)) {
      const o = this.attributes, s = t.prototype;
      for (let n = 0, r = o.length; n < r; ++n)
        A.defineProperty(s, o[n]);
      Reflect.defineProperty(t, "observedAttributes", {
        value: this.observedAttributes,
        enumerable: !0
      });
    }
    return e.get(this.name) || e.define(this.name, t, this.elementOptions), this;
  }
}
uo.forType = Vs.getByType;
const ma = /* @__PURE__ */ new WeakMap(), Gc = {
  bubbles: !0,
  composed: !0,
  cancelable: !0
};
function ws(i) {
  return i.shadowRoot || ma.get(i) || null;
}
class un extends ha {
  constructor(e, t) {
    super(e), this.boundObservables = null, this.behaviors = null, this.needsInitialization = !0, this._template = null, this._styles = null, this._isConnected = !1, this.$fastController = this, this.view = null, this.element = e, this.definition = t;
    const o = t.shadowOptions;
    if (o !== void 0) {
      const n = e.attachShadow(o);
      o.mode === "closed" && ma.set(e, n);
    }
    const s = A.getAccessors(e);
    if (s.length > 0) {
      const n = this.boundObservables = /* @__PURE__ */ Object.create(null);
      for (let r = 0, l = s.length; r < l; ++r) {
        const c = s[r].name, u = e[c];
        u !== void 0 && (delete e[c], n[c] = u);
      }
    }
  }
  get isConnected() {
    return A.track(this, "isConnected"), this._isConnected;
  }
  setIsConnected(e) {
    this._isConnected = e, A.notify(this, "isConnected");
  }
  get template() {
    return this._template;
  }
  set template(e) {
    this._template !== e && (this._template = e, this.needsInitialization || this.renderTemplate(e));
  }
  get styles() {
    return this._styles;
  }
  set styles(e) {
    this._styles !== e && (this._styles !== null && this.removeStyles(this._styles), this._styles = e, !this.needsInitialization && e !== null && this.addStyles(e));
  }
  addStyles(e) {
    const t = ws(this.element) || this.element.getRootNode();
    if (e instanceof HTMLStyleElement)
      t.append(e);
    else if (!e.isAttachedTo(t)) {
      const o = e.behaviors;
      e.addStylesTo(t), o !== null && this.addBehaviors(o);
    }
  }
  removeStyles(e) {
    const t = ws(this.element) || this.element.getRootNode();
    if (e instanceof HTMLStyleElement)
      t.removeChild(e);
    else if (e.isAttachedTo(t)) {
      const o = e.behaviors;
      e.removeStylesFrom(t), o !== null && this.removeBehaviors(o);
    }
  }
  addBehaviors(e) {
    const t = this.behaviors || (this.behaviors = /* @__PURE__ */ new Map()), o = e.length, s = [];
    for (let n = 0; n < o; ++n) {
      const r = e[n];
      t.has(r) ? t.set(r, t.get(r) + 1) : (t.set(r, 1), s.push(r));
    }
    if (this._isConnected) {
      const n = this.element;
      for (let r = 0; r < s.length; ++r)
        s[r].bind(n, Gi);
    }
  }
  removeBehaviors(e, t = !1) {
    const o = this.behaviors;
    if (o === null)
      return;
    const s = e.length, n = [];
    for (let r = 0; r < s; ++r) {
      const l = e[r];
      if (o.has(l)) {
        const c = o.get(l) - 1;
        c === 0 || t ? o.delete(l) && n.push(l) : o.set(l, c);
      }
    }
    if (this._isConnected) {
      const r = this.element;
      for (let l = 0; l < n.length; ++l)
        n[l].unbind(r);
    }
  }
  onConnectedCallback() {
    if (this._isConnected)
      return;
    const e = this.element;
    this.needsInitialization ? this.finishInitialization() : this.view !== null && this.view.bind(e, Gi);
    const t = this.behaviors;
    if (t !== null)
      for (const [o] of t)
        o.bind(e, Gi);
    this.setIsConnected(!0);
  }
  onDisconnectedCallback() {
    if (!this._isConnected)
      return;
    this.setIsConnected(!1);
    const e = this.view;
    e !== null && e.unbind();
    const t = this.behaviors;
    if (t !== null) {
      const o = this.element;
      for (const [s] of t)
        s.unbind(o);
    }
  }
  onAttributeChangedCallback(e, t, o) {
    const s = this.definition.attributeLookup[e];
    s !== void 0 && s.onAttributeChangedCallback(this.element, o);
  }
  emit(e, t, o) {
    return this._isConnected ? this.element.dispatchEvent(new CustomEvent(e, Object.assign(Object.assign({ detail: t }, Gc), o))) : !1;
  }
  finishInitialization() {
    const e = this.element, t = this.boundObservables;
    if (t !== null) {
      const s = Object.keys(t);
      for (let n = 0, r = s.length; n < r; ++n) {
        const l = s[n];
        e[l] = t[l];
      }
      this.boundObservables = null;
    }
    const o = this.definition;
    this._template === null && (this.element.resolveTemplate ? this._template = this.element.resolveTemplate() : o.template && (this._template = o.template || null)), this._template !== null && this.renderTemplate(this._template), this._styles === null && (this.element.resolveStyles ? this._styles = this.element.resolveStyles() : o.styles && (this._styles = o.styles || null)), this._styles !== null && this.addStyles(this._styles), this.needsInitialization = !1;
  }
  renderTemplate(e) {
    const t = this.element, o = ws(t) || t;
    this.view !== null ? (this.view.dispose(), this.view = null) : this.needsInitialization || R.removeChildNodes(o), e && (this.view = e.render(t, o, t));
  }
  static forCustomElement(e) {
    const t = e.$fastController;
    if (t !== void 0)
      return t;
    const o = uo.forType(e.constructor);
    if (o === void 0)
      throw new Error("Missing FASTElement definition.");
    return e.$fastController = new un(e, o);
  }
}
function jn(i) {
  return class extends i {
    constructor() {
      super(), un.forCustomElement(this);
    }
    $emit(e, t, o) {
      return this.$fastController.emit(e, t, o);
    }
    connectedCallback() {
      this.$fastController.onConnectedCallback();
    }
    disconnectedCallback() {
      this.$fastController.onDisconnectedCallback();
    }
    attributeChangedCallback(e, t, o) {
      this.$fastController.onAttributeChangedCallback(e, t, o);
    }
  };
}
const po = Object.assign(jn(HTMLElement), {
  from(i) {
    return jn(i);
  },
  define(i, e) {
    return new uo(i, e).define().type;
  }
});
function Wc(i) {
  return function(e) {
    new uo(e, i).define();
  };
}
class pn {
  createCSS() {
    return "";
  }
  createBehavior() {
  }
}
function ba(i, e) {
  const t = [];
  let o = "";
  const s = [];
  for (let n = 0, r = i.length - 1; n < r; ++n) {
    o += i[n];
    let l = e[n];
    if (l instanceof pn) {
      const c = l.createBehavior();
      l = l.createCSS(), c && s.push(c);
    }
    l instanceof Oe || l instanceof CSSStyleSheet ? (o.trim() !== "" && (t.push(o), o = ""), t.push(l)) : o += l;
  }
  return o += i[i.length - 1], o.trim() !== "" && t.push(o), {
    styles: t,
    behaviors: s
  };
}
function m(i, ...e) {
  const { styles: t, behaviors: o } = ba(i, e), s = Oe.create(t);
  return o.length && s.withBehaviors(...o), s;
}
class Yc extends pn {
  constructor(e, t) {
    super(), this.behaviors = t, this.css = "";
    const o = e.reduce((s, n) => (typeof n == "string" ? this.css += n : s.push(n), s), []);
    o.length && (this.styles = Oe.create(o));
  }
  createBehavior() {
    return this;
  }
  createCSS() {
    return this.css;
  }
  bind(e) {
    this.styles && e.$fastController.addStyles(this.styles), this.behaviors.length && e.$fastController.addBehaviors(this.behaviors);
  }
  unbind(e) {
    this.styles && e.$fastController.removeStyles(this.styles), this.behaviors.length && e.$fastController.removeBehaviors(this.behaviors);
  }
}
function va(i, ...e) {
  const { styles: t, behaviors: o } = ba(i, e);
  return new Yc(t, o);
}
function ot(i, e, t) {
  return {
    index: i,
    removed: e,
    addedCount: t
  };
}
const ya = 0, xa = 1, Hs = 2, zs = 3;
function Xc(i, e, t, o, s, n) {
  const r = n - s + 1, l = t - e + 1, c = new Array(r);
  let u, p;
  for (let f = 0; f < r; ++f)
    c[f] = new Array(l), c[f][0] = f;
  for (let f = 0; f < l; ++f)
    c[0][f] = f;
  for (let f = 1; f < r; ++f)
    for (let b = 1; b < l; ++b)
      i[e + b - 1] === o[s + f - 1] ? c[f][b] = c[f - 1][b - 1] : (u = c[f - 1][b] + 1, p = c[f][b - 1] + 1, c[f][b] = u < p ? u : p);
  return c;
}
function Qc(i) {
  let e = i.length - 1, t = i[0].length - 1, o = i[e][t];
  const s = [];
  for (; e > 0 || t > 0; ) {
    if (e === 0) {
      s.push(Hs), t--;
      continue;
    }
    if (t === 0) {
      s.push(zs), e--;
      continue;
    }
    const n = i[e - 1][t - 1], r = i[e - 1][t], l = i[e][t - 1];
    let c;
    r < l ? c = r < n ? r : n : c = l < n ? l : n, c === n ? (n === o ? s.push(ya) : (s.push(xa), o = n), e--, t--) : c === r ? (s.push(zs), e--, o = r) : (s.push(Hs), t--, o = l);
  }
  return s.reverse(), s;
}
function Zc(i, e, t) {
  for (let o = 0; o < t; ++o)
    if (i[o] !== e[o])
      return o;
  return t;
}
function Jc(i, e, t) {
  let o = i.length, s = e.length, n = 0;
  for (; n < t && i[--o] === e[--s]; )
    n++;
  return n;
}
function Kc(i, e, t, o) {
  return e < t || o < i ? -1 : e === t || o === i ? 0 : i < t ? e < o ? e - t : o - t : o < e ? o - i : e - i;
}
function $a(i, e, t, o, s, n) {
  let r = 0, l = 0;
  const c = Math.min(t - e, n - s);
  if (e === 0 && s === 0 && (r = Zc(i, o, c)), t === i.length && n === o.length && (l = Jc(i, o, c - r)), e += r, s += r, t -= l, n -= l, t - e === 0 && n - s === 0)
    return Wt;
  if (e === t) {
    const $ = ot(e, [], 0);
    for (; s < n; )
      $.removed.push(o[s++]);
    return [$];
  } else if (s === n)
    return [ot(e, [], t - e)];
  const u = Qc(Xc(i, e, t, o, s, n)), p = [];
  let f, b = e, I = s;
  for (let $ = 0; $ < u.length; ++$)
    switch (u[$]) {
      case ya:
        f !== void 0 && (p.push(f), f = void 0), b++, I++;
        break;
      case xa:
        f === void 0 && (f = ot(b, [], 0)), f.addedCount++, b++, f.removed.push(o[I]), I++;
        break;
      case Hs:
        f === void 0 && (f = ot(b, [], 0)), f.addedCount++, b++;
        break;
      case zs:
        f === void 0 && (f = ot(b, [], 0)), f.removed.push(o[I]), I++;
        break;
    }
  return f !== void 0 && p.push(f), p;
}
const _n = Array.prototype.push;
function ed(i, e, t, o) {
  const s = ot(e, t, o);
  let n = !1, r = 0;
  for (let l = 0; l < i.length; l++) {
    const c = i[l];
    if (c.index += r, n)
      continue;
    const u = Kc(s.index, s.index + s.removed.length, c.index, c.index + c.addedCount);
    if (u >= 0) {
      i.splice(l, 1), l--, r -= c.addedCount - c.removed.length, s.addedCount += c.addedCount - u;
      const p = s.removed.length + c.removed.length - u;
      if (!s.addedCount && !p)
        n = !0;
      else {
        let f = c.removed;
        if (s.index < c.index) {
          const b = s.removed.slice(0, c.index - s.index);
          _n.apply(b, f), f = b;
        }
        if (s.index + s.removed.length > c.index + c.addedCount) {
          const b = s.removed.slice(c.index + c.addedCount - s.index);
          _n.apply(f, b);
        }
        s.removed = f, c.index < s.index && (s.index = c.index);
      }
    } else if (s.index < c.index) {
      n = !0, i.splice(l, 0, s), l++;
      const p = s.addedCount - s.removed.length;
      c.index += p, r += p;
    }
  }
  n || i.push(s);
}
function td(i) {
  const e = [];
  for (let t = 0, o = i.length; t < o; t++) {
    const s = i[t];
    ed(e, s.index, s.removed, s.addedCount);
  }
  return e;
}
function id(i, e) {
  let t = [];
  const o = td(e);
  for (let s = 0, n = o.length; s < n; ++s) {
    const r = o[s];
    if (r.addedCount === 1 && r.removed.length === 1) {
      r.removed[0] !== i[r.index] && t.push(r);
      continue;
    }
    t = t.concat($a(i, r.index, r.index + r.addedCount, r.removed, 0, r.removed.length));
  }
  return t;
}
let Un = !1;
function ks(i, e) {
  let t = i.index;
  const o = e.length;
  return t > o ? t = o - i.addedCount : t < 0 && (t = o + i.removed.length + t - i.addedCount), t < 0 && (t = 0), i.index = t, i;
}
class od extends Ao {
  constructor(e) {
    super(e), this.oldCollection = void 0, this.splices = void 0, this.needsQueue = !0, this.call = this.flush, Reflect.defineProperty(e, "$fastController", {
      value: this,
      enumerable: !1
    });
  }
  subscribe(e) {
    this.flush(), super.subscribe(e);
  }
  addSplice(e) {
    this.splices === void 0 ? this.splices = [e] : this.splices.push(e), this.needsQueue && (this.needsQueue = !1, R.queueUpdate(this));
  }
  reset(e) {
    this.oldCollection = e, this.needsQueue && (this.needsQueue = !1, R.queueUpdate(this));
  }
  flush() {
    const e = this.splices, t = this.oldCollection;
    if (e === void 0 && t === void 0)
      return;
    this.needsQueue = !0, this.splices = void 0, this.oldCollection = void 0;
    const o = t === void 0 ? id(this.source, e) : $a(this.source, 0, this.source.length, t, 0, t.length);
    this.notify(o);
  }
}
function sd() {
  if (Un)
    return;
  Un = !0, A.setArrayObserverFactory((c) => new od(c));
  const i = Array.prototype;
  if (i.$fastPatch)
    return;
  Reflect.defineProperty(i, "$fastPatch", {
    value: 1,
    enumerable: !1
  });
  const e = i.pop, t = i.push, o = i.reverse, s = i.shift, n = i.sort, r = i.splice, l = i.unshift;
  i.pop = function() {
    const c = this.length > 0, u = e.apply(this, arguments), p = this.$fastController;
    return p !== void 0 && c && p.addSplice(ot(this.length, [u], 0)), u;
  }, i.push = function() {
    const c = t.apply(this, arguments), u = this.$fastController;
    return u !== void 0 && u.addSplice(ks(ot(this.length - arguments.length, [], arguments.length), this)), c;
  }, i.reverse = function() {
    let c;
    const u = this.$fastController;
    u !== void 0 && (u.flush(), c = this.slice());
    const p = o.apply(this, arguments);
    return u !== void 0 && u.reset(c), p;
  }, i.shift = function() {
    const c = this.length > 0, u = s.apply(this, arguments), p = this.$fastController;
    return p !== void 0 && c && p.addSplice(ot(0, [u], 0)), u;
  }, i.sort = function() {
    let c;
    const u = this.$fastController;
    u !== void 0 && (u.flush(), c = this.slice());
    const p = n.apply(this, arguments);
    return u !== void 0 && u.reset(c), p;
  }, i.splice = function() {
    const c = r.apply(this, arguments), u = this.$fastController;
    return u !== void 0 && u.addSplice(ks(ot(+arguments[0], c, arguments.length > 2 ? arguments.length - 2 : 0), this)), c;
  }, i.unshift = function() {
    const c = l.apply(this, arguments), u = this.$fastController;
    return u !== void 0 && u.addSplice(ks(ot(0, [], arguments.length), this)), c;
  };
}
class nd {
  constructor(e, t) {
    this.target = e, this.propertyName = t;
  }
  bind(e) {
    e[this.propertyName] = this.target;
  }
  unbind() {
  }
}
function U(i) {
  return new ln("fast-ref", nd, i);
}
function Q(i, e) {
  const t = typeof e == "function" ? e : () => e;
  return (o, s) => i(o, s) ? t(o, s) : null;
}
const qn = Object.freeze({
  positioning: !1,
  recycle: !0
});
function rd(i, e, t, o) {
  i.bind(e[t], o);
}
function ad(i, e, t, o) {
  const s = Object.create(o);
  s.index = t, s.length = e.length, i.bind(e[t], s);
}
class ld {
  constructor(e, t, o, s, n, r) {
    this.location = e, this.itemsBinding = t, this.templateBinding = s, this.options = r, this.source = null, this.views = [], this.items = null, this.itemsObserver = null, this.originalContext = void 0, this.childContext = void 0, this.bindView = rd, this.itemsBindingObserver = A.binding(t, this, o), this.templateBindingObserver = A.binding(s, this, n), r.positioning && (this.bindView = ad);
  }
  bind(e, t) {
    this.source = e, this.originalContext = t, this.childContext = Object.create(t), this.childContext.parent = e, this.childContext.parentContext = this.originalContext, this.items = this.itemsBindingObserver.observe(e, this.originalContext), this.template = this.templateBindingObserver.observe(e, this.originalContext), this.observeItems(!0), this.refreshAllViews();
  }
  unbind() {
    this.source = null, this.items = null, this.itemsObserver !== null && this.itemsObserver.unsubscribe(this), this.unbindAllViews(), this.itemsBindingObserver.disconnect(), this.templateBindingObserver.disconnect();
  }
  handleChange(e, t) {
    e === this.itemsBinding ? (this.items = this.itemsBindingObserver.observe(this.source, this.originalContext), this.observeItems(), this.refreshAllViews()) : e === this.templateBinding ? (this.template = this.templateBindingObserver.observe(this.source, this.originalContext), this.refreshAllViews(!0)) : this.updateViews(t);
  }
  observeItems(e = !1) {
    if (!this.items) {
      this.items = Wt;
      return;
    }
    const t = this.itemsObserver, o = this.itemsObserver = A.getNotifier(this.items), s = t !== o;
    s && t !== null && t.unsubscribe(this), (s || e) && o.subscribe(this);
  }
  updateViews(e) {
    const t = this.childContext, o = this.views, s = this.bindView, n = this.items, r = this.template, l = this.options.recycle, c = [];
    let u = 0, p = 0;
    for (let f = 0, b = e.length; f < b; ++f) {
      const I = e[f], $ = I.removed;
      let k = 0, L = I.index;
      const te = L + I.addedCount, G = o.splice(I.index, $.length), z = p = c.length + G.length;
      for (; L < te; ++L) {
        const q = o[L], ne = q ? q.firstChild : this.location;
        let re;
        l && p > 0 ? (k <= z && G.length > 0 ? (re = G[k], k++) : (re = c[u], u++), p--) : re = r.create(), o.splice(L, 0, re), s(re, n, L, t), re.insertBefore(ne);
      }
      G[k] && c.push(...G.slice(k));
    }
    for (let f = u, b = c.length; f < b; ++f)
      c[f].dispose();
    if (this.options.positioning)
      for (let f = 0, b = o.length; f < b; ++f) {
        const I = o[f].context;
        I.length = b, I.index = f;
      }
  }
  refreshAllViews(e = !1) {
    const t = this.items, o = this.childContext, s = this.template, n = this.location, r = this.bindView;
    let l = t.length, c = this.views, u = c.length;
    if ((l === 0 || e || !this.options.recycle) && (fa.disposeContiguousBatch(c), u = 0), u === 0) {
      this.views = c = new Array(l);
      for (let p = 0; p < l; ++p) {
        const f = s.create();
        r(f, t, p, o), c[p] = f, f.insertBefore(n);
      }
    } else {
      let p = 0;
      for (; p < l; ++p)
        if (p < u) {
          const b = c[p];
          r(b, t, p, o);
        } else {
          const b = s.create();
          r(b, t, p, o), c.push(b), b.insertBefore(n);
        }
      const f = c.splice(p, u - p);
      for (p = 0, l = f.length; p < l; ++p)
        f[p].dispose();
    }
  }
  unbindAllViews() {
    const e = this.views;
    for (let t = 0, o = e.length; t < o; ++t)
      e[t].unbind();
  }
}
class Zi extends jo {
  constructor(e, t, o) {
    super(), this.itemsBinding = e, this.templateBinding = t, this.options = o, this.createPlaceholder = R.createBlockPlaceholder, sd(), this.isItemsBindingVolatile = A.isVolatileBinding(e), this.isTemplateBindingVolatile = A.isVolatileBinding(t);
  }
  createBehavior(e) {
    return new ld(e, this.itemsBinding, this.isItemsBindingVolatile, this.templateBinding, this.isTemplateBindingVolatile, this.options);
  }
}
function yi(i, e, t = qn) {
  const o = typeof e == "function" ? e : () => e;
  return new Zi(i, o, Object.assign(Object.assign({}, qn), t));
}
function wt(i) {
  return i ? function(e, t, o) {
    return e.nodeType === 1 && e.matches(i);
  } : function(e, t, o) {
    return e.nodeType === 1;
  };
}
class wa {
  constructor(e, t) {
    this.target = e, this.options = t, this.source = null;
  }
  bind(e) {
    const t = this.options.property;
    this.shouldUpdate = A.getAccessors(e).some((o) => o.name === t), this.source = e, this.updateTarget(this.computeNodes()), this.shouldUpdate && this.observe();
  }
  unbind() {
    this.updateTarget(Wt), this.source = null, this.shouldUpdate && this.disconnect();
  }
  handleEvent() {
    this.updateTarget(this.computeNodes());
  }
  computeNodes() {
    let e = this.getNodes();
    return this.options.filter !== void 0 && (e = e.filter(this.options.filter)), e;
  }
  updateTarget(e) {
    this.source[this.options.property] = e;
  }
}
class cd extends wa {
  constructor(e, t) {
    super(e, t);
  }
  observe() {
    this.target.addEventListener("slotchange", this);
  }
  disconnect() {
    this.target.removeEventListener("slotchange", this);
  }
  getNodes() {
    return this.target.assignedNodes(this.options);
  }
}
function ee(i) {
  return typeof i == "string" && (i = { property: i }), new ln("fast-slotted", cd, i);
}
class dd extends wa {
  constructor(e, t) {
    super(e, t), this.observer = null, t.childList = !0;
  }
  observe() {
    this.observer === null && (this.observer = new MutationObserver(this.handleEvent.bind(this))), this.observer.observe(this.target, this.options);
  }
  disconnect() {
    this.observer.disconnect();
  }
  getNodes() {
    return "subtree" in this.options ? Array.from(this.target.querySelectorAll(this.options.selector)) : Array.from(this.target.childNodes);
  }
}
function Uo(i) {
  return typeof i == "string" && (i = {
    property: i
  }), new ln("fast-children", dd, i);
}
class He {
  handleStartContentChange() {
    this.startContainer.classList.toggle("start", this.start.assignedNodes().length > 0);
  }
  handleEndContentChange() {
    this.endContainer.classList.toggle("end", this.end.assignedNodes().length > 0);
  }
}
const Le = (i, e) => v`
    <span
        part="end"
        ${U("endContainer")}
        class=${(t) => e.end ? "end" : void 0}
    >
        <slot name="end" ${U("end")} @slotchange="${(t) => t.handleEndContentChange()}">
            ${e.end || ""}
        </slot>
    </span>
`, Ae = (i, e) => v`
    <span
        part="start"
        ${U("startContainer")}
        class="${(t) => e.start ? "start" : void 0}"
    >
        <slot
            name="start"
            ${U("start")}
            @slotchange="${(t) => t.handleStartContentChange()}"
        >
            ${e.start || ""}
        </slot>
    </span>
`, hd = v`
    <span part="end" ${U("endContainer")}>
        <slot
            name="end"
            ${U("end")}
            @slotchange="${(i) => i.handleEndContentChange()}"
        ></slot>
    </span>
`, ud = v`
    <span part="start" ${U("startContainer")}>
        <slot
            name="start"
            ${U("start")}
            @slotchange="${(i) => i.handleStartContentChange()}"
        ></slot>
    </span>
`, pd = (i, e) => v`
    <template class="${(t) => t.expanded ? "expanded" : ""}">
        <div
            class="heading"
            part="heading"
            role="heading"
            aria-level="${(t) => t.headinglevel}"
        >
            <button
                class="button"
                part="button"
                ${U("expandbutton")}
                aria-expanded="${(t) => t.expanded}"
                aria-controls="${(t) => t.id}-panel"
                id="${(t) => t.id}"
                @click="${(t, o) => t.clickHandler(o.event)}"
            >
                <span class="heading-content" part="heading-content">
                    <slot name="heading"></slot>
                </span>
            </button>
            ${Ae(i, e)}
            ${Le(i, e)}
            <span class="icon" part="icon" aria-hidden="true">
                <slot name="expanded-icon" part="expanded-icon">
                    ${e.expandedIcon || ""}
                </slot>
                <slot name="collapsed-icon" part="collapsed-icon">
                    ${e.collapsedIcon || ""}
                </slot>
            <span>
        </div>
        <div
            class="region"
            part="region"
            id="${(t) => t.id}-panel"
            role="region"
            aria-labelledby="${(t) => t.id}"
        >
            <slot></slot>
        </div>
    </template>
`;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function a(i, e, t, o) {
  var s = arguments.length, n = s < 3 ? e : o === null ? o = Object.getOwnPropertyDescriptor(e, t) : o, r;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    n = Reflect.decorate(i, e, t, o);
  else
    for (var l = i.length - 1; l >= 0; l--)
      (r = i[l]) && (n = (s < 3 ? r(n) : s > 3 ? r(e, t, n) : r(e, t)) || n);
  return s > 3 && n && Object.defineProperty(e, t, n), n;
}
const Cs = /* @__PURE__ */ new Map();
"metadata" in Reflect || (Reflect.metadata = function(i, e) {
  return function(t) {
    Reflect.defineMetadata(i, e, t);
  };
}, Reflect.defineMetadata = function(i, e, t) {
  let o = Cs.get(t);
  o === void 0 && Cs.set(t, o = /* @__PURE__ */ new Map()), o.set(i, e);
}, Reflect.getOwnMetadata = function(i, e) {
  const t = Cs.get(e);
  if (t !== void 0)
    return t.get(i);
});
class fd {
  constructor(e, t) {
    this.container = e, this.key = t;
  }
  instance(e) {
    return this.registerResolver(0, e);
  }
  singleton(e) {
    return this.registerResolver(1, e);
  }
  transient(e) {
    return this.registerResolver(2, e);
  }
  callback(e) {
    return this.registerResolver(3, e);
  }
  cachedCallback(e) {
    return this.registerResolver(3, Ca(e));
  }
  aliasTo(e) {
    return this.registerResolver(5, e);
  }
  registerResolver(e, t) {
    const { container: o, key: s } = this;
    return this.container = this.key = void 0, o.registerResolver(s, new Ye(s, e, t));
  }
}
function Pi(i) {
  const e = i.slice(), t = Object.keys(i), o = t.length;
  let s;
  for (let n = 0; n < o; ++n)
    s = t[n], Ta(s) || (e[s] = i[s]);
  return e;
}
const gd = Object.freeze({
  none(i) {
    throw Error(`${i.toString()} not registered, did you forget to add @singleton()?`);
  },
  singleton(i) {
    return new Ye(i, 1, i);
  },
  transient(i) {
    return new Ye(i, 2, i);
  }
}), Ts = Object.freeze({
  default: Object.freeze({
    parentLocator: () => null,
    responsibleForOwnerRequests: !1,
    defaultResolver: gd.singleton
  })
}), Gn = /* @__PURE__ */ new Map();
function Wn(i) {
  return (e) => Reflect.getOwnMetadata(i, e);
}
let Yn = null;
const le = Object.freeze({
  createContainer(i) {
    return new Wi(null, Object.assign({}, Ts.default, i));
  },
  findResponsibleContainer(i) {
    const e = i.$$container$$;
    return e && e.responsibleForOwnerRequests ? e : le.findParentContainer(i);
  },
  findParentContainer(i) {
    const e = new CustomEvent(ka, {
      bubbles: !0,
      composed: !0,
      cancelable: !0,
      detail: { container: void 0 }
    });
    return i.dispatchEvent(e), e.detail.container || le.getOrCreateDOMContainer();
  },
  getOrCreateDOMContainer(i, e) {
    return i ? i.$$container$$ || new Wi(i, Object.assign({}, Ts.default, e, {
      parentLocator: le.findParentContainer
    })) : Yn || (Yn = new Wi(null, Object.assign({}, Ts.default, e, {
      parentLocator: () => null
    })));
  },
  getDesignParamtypes: Wn("design:paramtypes"),
  getAnnotationParamtypes: Wn("di:paramtypes"),
  getOrCreateAnnotationParamTypes(i) {
    let e = this.getAnnotationParamtypes(i);
    return e === void 0 && Reflect.defineMetadata("di:paramtypes", e = [], i), e;
  },
  getDependencies(i) {
    let e = Gn.get(i);
    if (e === void 0) {
      const t = i.inject;
      if (t === void 0) {
        const o = le.getDesignParamtypes(i), s = le.getAnnotationParamtypes(i);
        if (o === void 0)
          if (s === void 0) {
            const n = Object.getPrototypeOf(i);
            typeof n == "function" && n !== Function.prototype ? e = Pi(le.getDependencies(n)) : e = [];
          } else
            e = Pi(s);
        else if (s === void 0)
          e = Pi(o);
        else {
          e = Pi(o);
          let n = s.length, r;
          for (let u = 0; u < n; ++u)
            r = s[u], r !== void 0 && (e[u] = r);
          const l = Object.keys(s);
          n = l.length;
          let c;
          for (let u = 0; u < n; ++u)
            c = l[u], Ta(c) || (e[c] = s[c]);
        }
      } else
        e = Pi(t);
      Gn.set(i, e);
    }
    return e;
  },
  defineProperty(i, e, t, o = !1) {
    const s = `$di_${e}`;
    Reflect.defineProperty(i, e, {
      get: function() {
        let n = this[s];
        if (n === void 0 && (n = (this instanceof HTMLElement ? le.findResponsibleContainer(this) : le.getOrCreateDOMContainer()).get(t), this[s] = n, o && this instanceof po)) {
          const l = this.$fastController, c = () => {
            const p = le.findResponsibleContainer(this).get(t), f = this[s];
            p !== f && (this[s] = n, l.notify(e));
          };
          l.subscribe({ handleChange: c }, "isConnected");
        }
        return n;
      }
    });
  },
  createInterface(i, e) {
    const t = typeof i == "function" ? i : e, o = typeof i == "string" ? i : i && "friendlyName" in i && i.friendlyName || Jn, s = typeof i == "string" ? !1 : i && "respectConnection" in i && i.respectConnection || !1, n = function(r, l, c) {
      if (r == null || new.target !== void 0)
        throw new Error(`No registration for interface: '${n.friendlyName}'`);
      if (l)
        le.defineProperty(r, l, n, s);
      else {
        const u = le.getOrCreateAnnotationParamTypes(r);
        u[c] = n;
      }
    };
    return n.$isInterface = !0, n.friendlyName = o ?? "(anonymous)", t != null && (n.register = function(r, l) {
      return t(new fd(r, l ?? n));
    }), n.toString = function() {
      return `InterfaceSymbol<${n.friendlyName}>`;
    }, n;
  },
  inject(...i) {
    return function(e, t, o) {
      if (typeof o == "number") {
        const s = le.getOrCreateAnnotationParamTypes(e), n = i[0];
        n !== void 0 && (s[o] = n);
      } else if (t)
        le.defineProperty(e, t, i[0]);
      else {
        const s = o ? le.getOrCreateAnnotationParamTypes(o.value) : le.getOrCreateAnnotationParamTypes(e);
        let n;
        for (let r = 0; r < i.length; ++r)
          n = i[r], n !== void 0 && (s[r] = n);
      }
    };
  },
  transient(i) {
    return i.register = function(t) {
      return Ji.transient(i, i).register(t);
    }, i.registerInRequestor = !1, i;
  },
  singleton(i, e = bd) {
    return i.register = function(o) {
      return Ji.singleton(i, i).register(o);
    }, i.registerInRequestor = e.scoped, i;
  }
}), md = le.createInterface("Container");
le.inject;
const bd = { scoped: !1 };
class Ye {
  constructor(e, t, o) {
    this.key = e, this.strategy = t, this.state = o, this.resolving = !1;
  }
  get $isResolver() {
    return !0;
  }
  register(e) {
    return e.registerResolver(this.key, this);
  }
  resolve(e, t) {
    switch (this.strategy) {
      case 0:
        return this.state;
      case 1: {
        if (this.resolving)
          throw new Error(`Cyclic dependency found: ${this.state.name}`);
        return this.resolving = !0, this.state = e.getFactory(this.state).construct(t), this.strategy = 0, this.resolving = !1, this.state;
      }
      case 2: {
        const o = e.getFactory(this.state);
        if (o === null)
          throw new Error(`Resolver for ${String(this.key)} returned a null factory`);
        return o.construct(t);
      }
      case 3:
        return this.state(e, t, this);
      case 4:
        return this.state[0].resolve(e, t);
      case 5:
        return t.get(this.state);
      default:
        throw new Error(`Invalid resolver strategy specified: ${this.strategy}.`);
    }
  }
  getFactory(e) {
    var t, o, s;
    switch (this.strategy) {
      case 1:
      case 2:
        return e.getFactory(this.state);
      case 5:
        return (s = (o = (t = e.getResolver(this.state)) === null || t === void 0 ? void 0 : t.getFactory) === null || o === void 0 ? void 0 : o.call(t, e)) !== null && s !== void 0 ? s : null;
      default:
        return null;
    }
  }
}
function Xn(i) {
  return this.get(i);
}
function vd(i, e) {
  return e(i);
}
class yd {
  constructor(e, t) {
    this.Type = e, this.dependencies = t, this.transformers = null;
  }
  construct(e, t) {
    let o;
    return t === void 0 ? o = new this.Type(...this.dependencies.map(Xn, e)) : o = new this.Type(...this.dependencies.map(Xn, e), ...t), this.transformers == null ? o : this.transformers.reduce(vd, o);
  }
  registerTransformer(e) {
    (this.transformers || (this.transformers = [])).push(e);
  }
}
const xd = {
  $isResolver: !0,
  resolve(i, e) {
    return e;
  }
};
function Eo(i) {
  return typeof i.register == "function";
}
function $d(i) {
  return Eo(i) && typeof i.registerInRequestor == "boolean";
}
function Qn(i) {
  return $d(i) && i.registerInRequestor;
}
function wd(i) {
  return i.prototype !== void 0;
}
const kd = /* @__PURE__ */ new Set([
  "Array",
  "ArrayBuffer",
  "Boolean",
  "DataView",
  "Date",
  "Error",
  "EvalError",
  "Float32Array",
  "Float64Array",
  "Function",
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Map",
  "Number",
  "Object",
  "Promise",
  "RangeError",
  "ReferenceError",
  "RegExp",
  "Set",
  "SharedArrayBuffer",
  "String",
  "SyntaxError",
  "TypeError",
  "Uint8Array",
  "Uint8ClampedArray",
  "Uint16Array",
  "Uint32Array",
  "URIError",
  "WeakMap",
  "WeakSet"
]), ka = "__DI_LOCATE_PARENT__", Is = /* @__PURE__ */ new Map();
class Wi {
  constructor(e, t) {
    this.owner = e, this.config = t, this._parent = void 0, this.registerDepth = 0, this.context = null, e !== null && (e.$$container$$ = this), this.resolvers = /* @__PURE__ */ new Map(), this.resolvers.set(md, xd), e instanceof Node && e.addEventListener(ka, (o) => {
      o.composedPath()[0] !== this.owner && (o.detail.container = this, o.stopImmediatePropagation());
    });
  }
  get parent() {
    return this._parent === void 0 && (this._parent = this.config.parentLocator(this.owner)), this._parent;
  }
  get depth() {
    return this.parent === null ? 0 : this.parent.depth + 1;
  }
  get responsibleForOwnerRequests() {
    return this.config.responsibleForOwnerRequests;
  }
  registerWithContext(e, ...t) {
    return this.context = e, this.register(...t), this.context = null, this;
  }
  register(...e) {
    if (++this.registerDepth === 100)
      throw new Error("Unable to autoregister dependency");
    let t, o, s, n, r;
    const l = this.context;
    for (let c = 0, u = e.length; c < u; ++c)
      if (t = e[c], !!Kn(t))
        if (Eo(t))
          t.register(this, l);
        else if (wd(t))
          Ji.singleton(t, t).register(this);
        else
          for (o = Object.keys(t), n = 0, r = o.length; n < r; ++n)
            s = t[o[n]], Kn(s) && (Eo(s) ? s.register(this, l) : this.register(s));
    return --this.registerDepth, this;
  }
  registerResolver(e, t) {
    xo(e);
    const o = this.resolvers, s = o.get(e);
    return s == null ? o.set(e, t) : s instanceof Ye && s.strategy === 4 ? s.state.push(t) : o.set(e, new Ye(e, 4, [s, t])), t;
  }
  registerTransformer(e, t) {
    const o = this.getResolver(e);
    if (o == null)
      return !1;
    if (o.getFactory) {
      const s = o.getFactory(this);
      return s == null ? !1 : (s.registerTransformer(t), !0);
    }
    return !1;
  }
  getResolver(e, t = !0) {
    if (xo(e), e.resolve !== void 0)
      return e;
    let o = this, s;
    for (; o != null; )
      if (s = o.resolvers.get(e), s == null) {
        if (o.parent == null) {
          const n = Qn(e) ? this : o;
          return t ? this.jitRegister(e, n) : null;
        }
        o = o.parent;
      } else
        return s;
    return null;
  }
  has(e, t = !1) {
    return this.resolvers.has(e) ? !0 : t && this.parent != null ? this.parent.has(e, !0) : !1;
  }
  get(e) {
    if (xo(e), e.$isResolver)
      return e.resolve(this, this);
    let t = this, o;
    for (; t != null; )
      if (o = t.resolvers.get(e), o == null) {
        if (t.parent == null) {
          const s = Qn(e) ? this : t;
          return o = this.jitRegister(e, s), o.resolve(t, this);
        }
        t = t.parent;
      } else
        return o.resolve(t, this);
    throw new Error(`Unable to resolve key: ${e}`);
  }
  getAll(e, t = !1) {
    xo(e);
    const o = this;
    let s = o, n;
    if (t) {
      let r = Wt;
      for (; s != null; )
        n = s.resolvers.get(e), n != null && (r = r.concat(
          Zn(n, s, o)
        )), s = s.parent;
      return r;
    } else
      for (; s != null; )
        if (n = s.resolvers.get(e), n == null) {
          if (s = s.parent, s == null)
            return Wt;
        } else
          return Zn(n, s, o);
    return Wt;
  }
  getFactory(e) {
    let t = Is.get(e);
    if (t === void 0) {
      if (Cd(e))
        throw new Error(`${e.name} is a native function and therefore cannot be safely constructed by DI. If this is intentional, please use a callback or cachedCallback resolver.`);
      Is.set(e, t = new yd(e, le.getDependencies(e)));
    }
    return t;
  }
  registerFactory(e, t) {
    Is.set(e, t);
  }
  createChild(e) {
    return new Wi(null, Object.assign({}, this.config, e, { parentLocator: () => this }));
  }
  jitRegister(e, t) {
    if (typeof e != "function")
      throw new Error(`Attempted to jitRegister something that is not a constructor: '${e}'. Did you forget to register this dependency?`);
    if (kd.has(e.name))
      throw new Error(`Attempted to jitRegister an intrinsic type: ${e.name}. Did you forget to add @inject(Key)`);
    if (Eo(e)) {
      const o = e.register(t);
      if (!(o instanceof Object) || o.resolve == null) {
        const s = t.resolvers.get(e);
        if (s != null)
          return s;
        throw new Error("A valid resolver was not returned from the static register method");
      }
      return o;
    } else {
      if (e.$isInterface)
        throw new Error(`Attempted to jitRegister an interface: ${e.friendlyName}`);
      {
        const o = this.config.defaultResolver(e, t);
        return t.resolvers.set(e, o), o;
      }
    }
  }
}
const Ss = /* @__PURE__ */ new WeakMap();
function Ca(i) {
  return function(e, t, o) {
    if (Ss.has(o))
      return Ss.get(o);
    const s = i(e, t, o);
    return Ss.set(o, s), s;
  };
}
const Ji = Object.freeze({
  instance(i, e) {
    return new Ye(i, 0, e);
  },
  singleton(i, e) {
    return new Ye(i, 1, e);
  },
  transient(i, e) {
    return new Ye(i, 2, e);
  },
  callback(i, e) {
    return new Ye(i, 3, e);
  },
  cachedCallback(i, e) {
    return new Ye(i, 3, Ca(e));
  },
  aliasTo(i, e) {
    return new Ye(e, 5, i);
  }
});
function xo(i) {
  if (i == null)
    throw new Error("key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?");
}
function Zn(i, e, t) {
  if (i instanceof Ye && i.strategy === 4) {
    const o = i.state;
    let s = o.length;
    const n = new Array(s);
    for (; s--; )
      n[s] = o[s].resolve(e, t);
    return n;
  }
  return [i.resolve(e, t)];
}
const Jn = "(anonymous)";
function Kn(i) {
  return typeof i == "object" && i !== null || typeof i == "function";
}
const Cd = function() {
  const i = /* @__PURE__ */ new WeakMap();
  let e = !1, t = "", o = 0;
  return function(s) {
    return e = i.get(s), e === void 0 && (t = s.toString(), o = t.length, e = o >= 29 && o <= 100 && t.charCodeAt(o - 1) === 125 && t.charCodeAt(o - 2) <= 32 && t.charCodeAt(o - 3) === 93 && t.charCodeAt(o - 4) === 101 && t.charCodeAt(o - 5) === 100 && t.charCodeAt(o - 6) === 111 && t.charCodeAt(o - 7) === 99 && t.charCodeAt(o - 8) === 32 && t.charCodeAt(o - 9) === 101 && t.charCodeAt(o - 10) === 118 && t.charCodeAt(o - 11) === 105 && t.charCodeAt(o - 12) === 116 && t.charCodeAt(o - 13) === 97 && t.charCodeAt(o - 14) === 110 && t.charCodeAt(o - 15) === 88, i.set(s, e)), e;
  };
}(), $o = {};
function Ta(i) {
  switch (typeof i) {
    case "number":
      return i >= 0 && (i | 0) === i;
    case "string": {
      const e = $o[i];
      if (e !== void 0)
        return e;
      const t = i.length;
      if (t === 0)
        return $o[i] = !1;
      let o = 0;
      for (let s = 0; s < t; ++s)
        if (o = i.charCodeAt(s), s === 0 && o === 48 && t > 1 || o < 48 || o > 57)
          return $o[i] = !1;
      return $o[i] = !0;
    }
    default:
      return !1;
  }
}
function er(i) {
  return `${i.toLowerCase()}:presentation`;
}
const wo = /* @__PURE__ */ new Map(), Ia = Object.freeze({
  define(i, e, t) {
    const o = er(i);
    wo.get(o) === void 0 ? wo.set(o, e) : wo.set(o, !1), t.register(Ji.instance(o, e));
  },
  forTag(i, e) {
    const t = er(i), o = wo.get(t);
    return o === !1 ? le.findResponsibleContainer(e).get(t) : o || null;
  }
});
class Td {
  constructor(e, t) {
    this.template = e || null, this.styles = t === void 0 ? null : Array.isArray(t) ? Oe.create(t) : t instanceof Oe ? t : Oe.create([t]);
  }
  applyTo(e) {
    const t = e.$fastController;
    t.template === null && (t.template = this.template), t.styles === null && (t.styles = this.styles);
  }
}
class O extends po {
  constructor() {
    super(...arguments), this._presentation = void 0;
  }
  get $presentation() {
    return this._presentation === void 0 && (this._presentation = Ia.forTag(this.tagName, this)), this._presentation;
  }
  templateChanged() {
    this.template !== void 0 && (this.$fastController.template = this.template);
  }
  stylesChanged() {
    this.styles !== void 0 && (this.$fastController.styles = this.styles);
  }
  connectedCallback() {
    this.$presentation !== null && this.$presentation.applyTo(this), super.connectedCallback();
  }
  static compose(e) {
    return (t = {}) => new Id(this === O ? class extends O {
    } : this, e, t);
  }
}
a([
  g
], O.prototype, "template", void 0);
a([
  g
], O.prototype, "styles", void 0);
function Mi(i, e, t) {
  return typeof i == "function" ? i(e, t) : i;
}
class Id {
  constructor(e, t, o) {
    this.type = e, this.elementDefinition = t, this.overrideDefinition = o, this.definition = Object.assign(Object.assign({}, this.elementDefinition), this.overrideDefinition);
  }
  register(e, t) {
    const o = this.definition, s = this.overrideDefinition, r = `${o.prefix || t.elementPrefix}-${o.baseName}`;
    t.tryDefineElement({
      name: r,
      type: this.type,
      baseClass: this.elementDefinition.baseClass,
      callback: (l) => {
        const c = new Td(Mi(o.template, l, o), Mi(o.styles, l, o));
        l.definePresentation(c);
        let u = Mi(o.shadowOptions, l, o);
        l.shadowRootMode && (u ? s.shadowOptions || (u.mode = l.shadowRootMode) : u !== null && (u = { mode: l.shadowRootMode })), l.defineElement({
          elementOptions: Mi(o.elementOptions, l, o),
          shadowOptions: u,
          attributes: Mi(o.attributes, l, o)
        });
      }
    });
  }
}
function ae(i, ...e) {
  const t = Po.locate(i);
  e.forEach((o) => {
    Object.getOwnPropertyNames(o.prototype).forEach((n) => {
      n !== "constructor" && Object.defineProperty(
        i.prototype,
        n,
        Object.getOwnPropertyDescriptor(o.prototype, n)
      );
    }), Po.locate(o).forEach((n) => t.push(n));
  });
}
class Yt extends O {
  constructor() {
    super(...arguments), this.headinglevel = 2, this.expanded = !1, this.clickHandler = (e) => {
      this.expanded = !this.expanded, this.change();
    }, this.change = () => {
      this.$emit("change");
    };
  }
}
a([
  h({
    attribute: "heading-level",
    mode: "fromView",
    converter: C
  })
], Yt.prototype, "headinglevel", void 0);
a([
  h({ mode: "boolean" })
], Yt.prototype, "expanded", void 0);
a([
  h
], Yt.prototype, "id", void 0);
ae(Yt, He);
const Sd = (i, e) => v`
    <template>
        <slot ${ee({ property: "accordionItems", filter: wt() })}></slot>
        <slot name="item" part="item" ${ee("accordionItems")}></slot>
    </template>
`, ce = {
  horizontal: "horizontal",
  vertical: "vertical"
};
function Fd(i, e) {
  let t = i.length;
  for (; t--; )
    if (e(i[t], t, i))
      return t;
  return -1;
}
function Ed() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function ki(...i) {
  return i.every((e) => e instanceof HTMLElement);
}
function Rd(i, e) {
  return !i || !e || !ki(i) ? void 0 : Array.from(i.querySelectorAll(e)).filter((o) => o.offsetParent !== null);
}
function Dd() {
  const i = document.querySelector('meta[property="csp-nonce"]');
  return i ? i.getAttribute("content") : null;
}
let Ut;
function Od() {
  if (typeof Ut == "boolean")
    return Ut;
  if (!Ed())
    return Ut = !1, Ut;
  const i = document.createElement("style"), e = Dd();
  e !== null && i.setAttribute("nonce", e), document.head.appendChild(i);
  try {
    i.sheet.insertRule("foo:focus-visible {color:inherit}", 0), Ut = !0;
  } catch {
    Ut = !1;
  } finally {
    document.head.removeChild(i);
  }
  return Ut;
}
const tr = "focus", ir = "focusin", Ci = "focusout", Ti = "keydown", or = "resize", sr = "scroll";
var nr;
(function(i) {
  i[i.alt = 18] = "alt", i[i.arrowDown = 40] = "arrowDown", i[i.arrowLeft = 37] = "arrowLeft", i[i.arrowRight = 39] = "arrowRight", i[i.arrowUp = 38] = "arrowUp", i[i.back = 8] = "back", i[i.backSlash = 220] = "backSlash", i[i.break = 19] = "break", i[i.capsLock = 20] = "capsLock", i[i.closeBracket = 221] = "closeBracket", i[i.colon = 186] = "colon", i[i.colon2 = 59] = "colon2", i[i.comma = 188] = "comma", i[i.ctrl = 17] = "ctrl", i[i.delete = 46] = "delete", i[i.end = 35] = "end", i[i.enter = 13] = "enter", i[i.equals = 187] = "equals", i[i.equals2 = 61] = "equals2", i[i.equals3 = 107] = "equals3", i[i.escape = 27] = "escape", i[i.forwardSlash = 191] = "forwardSlash", i[i.function1 = 112] = "function1", i[i.function10 = 121] = "function10", i[i.function11 = 122] = "function11", i[i.function12 = 123] = "function12", i[i.function2 = 113] = "function2", i[i.function3 = 114] = "function3", i[i.function4 = 115] = "function4", i[i.function5 = 116] = "function5", i[i.function6 = 117] = "function6", i[i.function7 = 118] = "function7", i[i.function8 = 119] = "function8", i[i.function9 = 120] = "function9", i[i.home = 36] = "home", i[i.insert = 45] = "insert", i[i.menu = 93] = "menu", i[i.minus = 189] = "minus", i[i.minus2 = 109] = "minus2", i[i.numLock = 144] = "numLock", i[i.numPad0 = 96] = "numPad0", i[i.numPad1 = 97] = "numPad1", i[i.numPad2 = 98] = "numPad2", i[i.numPad3 = 99] = "numPad3", i[i.numPad4 = 100] = "numPad4", i[i.numPad5 = 101] = "numPad5", i[i.numPad6 = 102] = "numPad6", i[i.numPad7 = 103] = "numPad7", i[i.numPad8 = 104] = "numPad8", i[i.numPad9 = 105] = "numPad9", i[i.numPadDivide = 111] = "numPadDivide", i[i.numPadDot = 110] = "numPadDot", i[i.numPadMinus = 109] = "numPadMinus", i[i.numPadMultiply = 106] = "numPadMultiply", i[i.numPadPlus = 107] = "numPadPlus", i[i.openBracket = 219] = "openBracket", i[i.pageDown = 34] = "pageDown", i[i.pageUp = 33] = "pageUp", i[i.period = 190] = "period", i[i.print = 44] = "print", i[i.quote = 222] = "quote", i[i.scrollLock = 145] = "scrollLock", i[i.shift = 16] = "shift", i[i.space = 32] = "space", i[i.tab = 9] = "tab", i[i.tilde = 192] = "tilde", i[i.windowsLeft = 91] = "windowsLeft", i[i.windowsOpera = 219] = "windowsOpera", i[i.windowsRight = 92] = "windowsRight";
})(nr || (nr = {}));
const _e = "ArrowDown", kt = "ArrowLeft", Ct = "ArrowRight", Ue = "ArrowUp", st = "Enter", Kt = "Escape", ut = "Home", pt = "End", Ld = "F2", Ad = "PageDown", Pd = "PageUp", ei = " ", qo = "Tab", Md = "Backspace", Vd = "Delete", bi = {
  ArrowDown: _e,
  ArrowLeft: kt,
  ArrowRight: Ct,
  ArrowUp: Ue
};
var oe;
(function(i) {
  i.ltr = "ltr", i.rtl = "rtl";
})(oe || (oe = {}));
function Sa(i, e, t) {
  return t < i ? e : t > e ? i : t;
}
function fn(i, e, t) {
  return Math.min(Math.max(t, i), e);
}
function ko(i, e, t = 0) {
  return [e, t] = [e, t].sort((o, s) => o - s), e <= i && i < t;
}
let Hd = 0;
function Xt(i = "") {
  return `${i}${Hd++}`;
}
var d;
(function(i) {
  i.Canvas = "Canvas", i.CanvasText = "CanvasText", i.LinkText = "LinkText", i.VisitedText = "VisitedText", i.ActiveText = "ActiveText", i.ButtonFace = "ButtonFace", i.ButtonText = "ButtonText", i.Field = "Field", i.FieldText = "FieldText", i.Highlight = "Highlight", i.HighlightText = "HighlightText", i.GrayText = "GrayText";
})(d || (d = {}));
const rr = {
  single: "single",
  multi: "multi"
};
class gn extends O {
  constructor() {
    super(...arguments), this.expandmode = rr.multi, this.activeItemIndex = 0, this.change = () => {
      this.$emit("change", this.activeid);
    }, this.setItems = () => {
      var e;
      this.accordionItems.length !== 0 && (this.accordionIds = this.getItemIds(), this.accordionItems.forEach((t, o) => {
        t instanceof Yt && (t.addEventListener("change", this.activeItemChange), this.isSingleExpandMode() && (this.activeItemIndex !== o ? t.expanded = !1 : t.expanded = !0));
        const s = this.accordionIds[o];
        t.setAttribute("id", typeof s != "string" ? `accordion-${o + 1}` : s), this.activeid = this.accordionIds[this.activeItemIndex], t.addEventListener("keydown", this.handleItemKeyDown), t.addEventListener("focus", this.handleItemFocus);
      }), this.isSingleExpandMode() && ((e = this.findExpandedItem()) !== null && e !== void 0 ? e : this.accordionItems[0]).setAttribute("aria-disabled", "true"));
    }, this.removeItemListeners = (e) => {
      e.forEach((t, o) => {
        t.removeEventListener("change", this.activeItemChange), t.removeEventListener("keydown", this.handleItemKeyDown), t.removeEventListener("focus", this.handleItemFocus);
      });
    }, this.activeItemChange = (e) => {
      if (e.defaultPrevented || e.target !== e.currentTarget)
        return;
      e.preventDefault();
      const t = e.target;
      this.activeid = t.getAttribute("id"), this.isSingleExpandMode() && (this.resetItems(), t.expanded = !0, t.setAttribute("aria-disabled", "true"), this.accordionItems.forEach((o) => {
        !o.hasAttribute("disabled") && o.id !== this.activeid && o.removeAttribute("aria-disabled");
      })), this.activeItemIndex = Array.from(this.accordionItems).indexOf(t), this.change();
    }, this.handleItemKeyDown = (e) => {
      if (e.target === e.currentTarget)
        switch (this.accordionIds = this.getItemIds(), e.key) {
          case Ue:
            e.preventDefault(), this.adjust(-1);
            break;
          case _e:
            e.preventDefault(), this.adjust(1);
            break;
          case ut:
            this.activeItemIndex = 0, this.focusItem();
            break;
          case pt:
            this.activeItemIndex = this.accordionItems.length - 1, this.focusItem();
            break;
        }
    }, this.handleItemFocus = (e) => {
      if (e.target === e.currentTarget) {
        const t = e.target, o = this.activeItemIndex = Array.from(this.accordionItems).indexOf(t);
        this.activeItemIndex !== o && o !== -1 && (this.activeItemIndex = o, this.activeid = this.accordionIds[this.activeItemIndex]);
      }
    };
  }
  accordionItemsChanged(e, t) {
    this.$fastController.isConnected && (this.removeItemListeners(e), this.setItems());
  }
  findExpandedItem() {
    for (let e = 0; e < this.accordionItems.length; e++)
      if (this.accordionItems[e].getAttribute("expanded") === "true")
        return this.accordionItems[e];
    return null;
  }
  resetItems() {
    this.accordionItems.forEach((e, t) => {
      e.expanded = !1;
    });
  }
  getItemIds() {
    return this.accordionItems.map((e) => e.getAttribute("id"));
  }
  isSingleExpandMode() {
    return this.expandmode === rr.single;
  }
  adjust(e) {
    this.activeItemIndex = Sa(0, this.accordionItems.length - 1, this.activeItemIndex + e), this.focusItem();
  }
  focusItem() {
    const e = this.accordionItems[this.activeItemIndex];
    e instanceof Yt && e.expandbutton.focus();
  }
}
a([
  h({ attribute: "expand-mode" })
], gn.prototype, "expandmode", void 0);
a([
  g
], gn.prototype, "accordionItems", void 0);
const Fa = (i, e) => v`
    <a
        class="control"
        part="control"
        download="${(t) => t.download}"
        href="${(t) => t.href}"
        hreflang="${(t) => t.hreflang}"
        ping="${(t) => t.ping}"
        referrerpolicy="${(t) => t.referrerpolicy}"
        rel="${(t) => t.rel}"
        target="${(t) => t.target}"
        type="${(t) => t.type}"
        aria-atomic="${(t) => t.ariaAtomic}"
        aria-busy="${(t) => t.ariaBusy}"
        aria-controls="${(t) => t.ariaControls}"
        aria-current="${(t) => t.ariaCurrent}"
        aria-describedby="${(t) => t.ariaDescribedby}"
        aria-details="${(t) => t.ariaDetails}"
        aria-disabled="${(t) => t.ariaDisabled}"
        aria-errormessage="${(t) => t.ariaErrormessage}"
        aria-expanded="${(t) => t.ariaExpanded}"
        aria-flowto="${(t) => t.ariaFlowto}"
        aria-haspopup="${(t) => t.ariaHaspopup}"
        aria-hidden="${(t) => t.ariaHidden}"
        aria-invalid="${(t) => t.ariaInvalid}"
        aria-keyshortcuts="${(t) => t.ariaKeyshortcuts}"
        aria-label="${(t) => t.ariaLabel}"
        aria-labelledby="${(t) => t.ariaLabelledby}"
        aria-live="${(t) => t.ariaLive}"
        aria-owns="${(t) => t.ariaOwns}"
        aria-relevant="${(t) => t.ariaRelevant}"
        aria-roledescription="${(t) => t.ariaRoledescription}"
        ${U("control")}
    >
        ${Ae(i, e)}
        <span class="content" part="content">
            <slot ${ee("defaultSlottedContent")}></slot>
        </span>
        ${Le(i, e)}
    </a>
`;
class se {
}
a([
  h({ attribute: "aria-atomic" })
], se.prototype, "ariaAtomic", void 0);
a([
  h({ attribute: "aria-busy" })
], se.prototype, "ariaBusy", void 0);
a([
  h({ attribute: "aria-controls" })
], se.prototype, "ariaControls", void 0);
a([
  h({ attribute: "aria-current" })
], se.prototype, "ariaCurrent", void 0);
a([
  h({ attribute: "aria-describedby" })
], se.prototype, "ariaDescribedby", void 0);
a([
  h({ attribute: "aria-details" })
], se.prototype, "ariaDetails", void 0);
a([
  h({ attribute: "aria-disabled" })
], se.prototype, "ariaDisabled", void 0);
a([
  h({ attribute: "aria-errormessage" })
], se.prototype, "ariaErrormessage", void 0);
a([
  h({ attribute: "aria-flowto" })
], se.prototype, "ariaFlowto", void 0);
a([
  h({ attribute: "aria-haspopup" })
], se.prototype, "ariaHaspopup", void 0);
a([
  h({ attribute: "aria-hidden" })
], se.prototype, "ariaHidden", void 0);
a([
  h({ attribute: "aria-invalid" })
], se.prototype, "ariaInvalid", void 0);
a([
  h({ attribute: "aria-keyshortcuts" })
], se.prototype, "ariaKeyshortcuts", void 0);
a([
  h({ attribute: "aria-label" })
], se.prototype, "ariaLabel", void 0);
a([
  h({ attribute: "aria-labelledby" })
], se.prototype, "ariaLabelledby", void 0);
a([
  h({ attribute: "aria-live" })
], se.prototype, "ariaLive", void 0);
a([
  h({ attribute: "aria-owns" })
], se.prototype, "ariaOwns", void 0);
a([
  h({ attribute: "aria-relevant" })
], se.prototype, "ariaRelevant", void 0);
a([
  h({ attribute: "aria-roledescription" })
], se.prototype, "ariaRoledescription", void 0);
let qe = class extends O {
  constructor() {
    super(...arguments), this.handleUnsupportedDelegatesFocus = () => {
      var e;
      window.ShadowRoot && !window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus") && (!((e = this.$fastController.definition.shadowOptions) === null || e === void 0) && e.delegatesFocus) && (this.focus = () => {
        this.control.focus();
      });
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.handleUnsupportedDelegatesFocus();
  }
};
a([
  h
], qe.prototype, "download", void 0);
a([
  h
], qe.prototype, "href", void 0);
a([
  h
], qe.prototype, "hreflang", void 0);
a([
  h
], qe.prototype, "ping", void 0);
a([
  h
], qe.prototype, "referrerpolicy", void 0);
a([
  h
], qe.prototype, "rel", void 0);
a([
  h
], qe.prototype, "target", void 0);
a([
  h
], qe.prototype, "type", void 0);
a([
  g
], qe.prototype, "defaultSlottedContent", void 0);
class Go {
}
a([
  h({ attribute: "aria-expanded" })
], Go.prototype, "ariaExpanded", void 0);
ae(Go, se);
ae(qe, He, Go);
const zd = (i, e) => v`
    <template class="${(t) => t.initialLayoutComplete ? "loaded" : ""}">
        ${Q((t) => t.initialLayoutComplete, v`
                <slot></slot>
            `)}
    </template>
`, Qt = (i) => {
  const e = i.closest("[dir]");
  return e !== null && e.dir === "rtl" ? oe.rtl : oe.ltr;
};
class Nd {
  constructor() {
    this.intersectionDetector = null, this.observedElements = /* @__PURE__ */ new Map(), this.requestPosition = (e, t) => {
      var o;
      if (this.intersectionDetector !== null) {
        if (this.observedElements.has(e)) {
          (o = this.observedElements.get(e)) === null || o === void 0 || o.push(t);
          return;
        }
        this.observedElements.set(e, [t]), this.intersectionDetector.observe(e);
      }
    }, this.cancelRequestPosition = (e, t) => {
      const o = this.observedElements.get(e);
      if (o !== void 0) {
        const s = o.indexOf(t);
        s !== -1 && o.splice(s, 1);
      }
    }, this.initializeIntersectionDetector = () => {
      $t.IntersectionObserver && (this.intersectionDetector = new IntersectionObserver(this.handleIntersection, {
        root: null,
        rootMargin: "0px",
        threshold: [0, 1]
      }));
    }, this.handleIntersection = (e) => {
      if (this.intersectionDetector === null)
        return;
      const t = [], o = [];
      e.forEach((s) => {
        var n;
        (n = this.intersectionDetector) === null || n === void 0 || n.unobserve(s.target);
        const r = this.observedElements.get(s.target);
        r !== void 0 && (r.forEach((l) => {
          let c = t.indexOf(l);
          c === -1 && (c = t.length, t.push(l), o.push([])), o[c].push(s);
        }), this.observedElements.delete(s.target));
      }), t.forEach((s, n) => {
        s(o[n]);
      });
    }, this.initializeIntersectionDetector();
  }
}
class W extends O {
  constructor() {
    super(...arguments), this.anchor = "", this.viewport = "", this.horizontalPositioningMode = "uncontrolled", this.horizontalDefaultPosition = "unset", this.horizontalViewportLock = !1, this.horizontalInset = !1, this.horizontalScaling = "content", this.verticalPositioningMode = "uncontrolled", this.verticalDefaultPosition = "unset", this.verticalViewportLock = !1, this.verticalInset = !1, this.verticalScaling = "content", this.fixedPlacement = !1, this.autoUpdateMode = "anchor", this.anchorElement = null, this.viewportElement = null, this.initialLayoutComplete = !1, this.resizeDetector = null, this.baseHorizontalOffset = 0, this.baseVerticalOffset = 0, this.pendingPositioningUpdate = !1, this.pendingReset = !1, this.currentDirection = oe.ltr, this.regionVisible = !1, this.forceUpdate = !1, this.updateThreshold = 0.5, this.update = () => {
      this.pendingPositioningUpdate || this.requestPositionUpdates();
    }, this.startObservers = () => {
      this.stopObservers(), this.anchorElement !== null && (this.requestPositionUpdates(), this.resizeDetector !== null && (this.resizeDetector.observe(this.anchorElement), this.resizeDetector.observe(this)));
    }, this.requestPositionUpdates = () => {
      this.anchorElement === null || this.pendingPositioningUpdate || (W.intersectionService.requestPosition(this, this.handleIntersection), W.intersectionService.requestPosition(this.anchorElement, this.handleIntersection), this.viewportElement !== null && W.intersectionService.requestPosition(this.viewportElement, this.handleIntersection), this.pendingPositioningUpdate = !0);
    }, this.stopObservers = () => {
      this.pendingPositioningUpdate && (this.pendingPositioningUpdate = !1, W.intersectionService.cancelRequestPosition(this, this.handleIntersection), this.anchorElement !== null && W.intersectionService.cancelRequestPosition(this.anchorElement, this.handleIntersection), this.viewportElement !== null && W.intersectionService.cancelRequestPosition(this.viewportElement, this.handleIntersection)), this.resizeDetector !== null && this.resizeDetector.disconnect();
    }, this.getViewport = () => typeof this.viewport != "string" || this.viewport === "" ? document.documentElement : document.getElementById(this.viewport), this.getAnchor = () => document.getElementById(this.anchor), this.handleIntersection = (e) => {
      this.pendingPositioningUpdate && (this.pendingPositioningUpdate = !1, this.applyIntersectionEntries(e) && this.updateLayout());
    }, this.applyIntersectionEntries = (e) => {
      const t = e.find((n) => n.target === this), o = e.find((n) => n.target === this.anchorElement), s = e.find((n) => n.target === this.viewportElement);
      return t === void 0 || s === void 0 || o === void 0 ? !1 : !this.regionVisible || this.forceUpdate || this.regionRect === void 0 || this.anchorRect === void 0 || this.viewportRect === void 0 || this.isRectDifferent(this.anchorRect, o.boundingClientRect) || this.isRectDifferent(this.viewportRect, s.boundingClientRect) || this.isRectDifferent(this.regionRect, t.boundingClientRect) ? (this.regionRect = t.boundingClientRect, this.anchorRect = o.boundingClientRect, this.viewportElement === document.documentElement ? this.viewportRect = new DOMRectReadOnly(s.boundingClientRect.x + document.documentElement.scrollLeft, s.boundingClientRect.y + document.documentElement.scrollTop, s.boundingClientRect.width, s.boundingClientRect.height) : this.viewportRect = s.boundingClientRect, this.updateRegionOffset(), this.forceUpdate = !1, !0) : !1;
    }, this.updateRegionOffset = () => {
      this.anchorRect && this.regionRect && (this.baseHorizontalOffset = this.baseHorizontalOffset + (this.anchorRect.left - this.regionRect.left) + (this.translateX - this.baseHorizontalOffset), this.baseVerticalOffset = this.baseVerticalOffset + (this.anchorRect.top - this.regionRect.top) + (this.translateY - this.baseVerticalOffset));
    }, this.isRectDifferent = (e, t) => Math.abs(e.top - t.top) > this.updateThreshold || Math.abs(e.right - t.right) > this.updateThreshold || Math.abs(e.bottom - t.bottom) > this.updateThreshold || Math.abs(e.left - t.left) > this.updateThreshold, this.handleResize = (e) => {
      this.update();
    }, this.reset = () => {
      this.pendingReset && (this.pendingReset = !1, this.anchorElement === null && (this.anchorElement = this.getAnchor()), this.viewportElement === null && (this.viewportElement = this.getViewport()), this.currentDirection = Qt(this), this.startObservers());
    }, this.updateLayout = () => {
      let e, t;
      if (this.horizontalPositioningMode !== "uncontrolled") {
        const n = this.getPositioningOptions(this.horizontalInset);
        if (this.horizontalDefaultPosition === "center")
          t = "center";
        else if (this.horizontalDefaultPosition !== "unset") {
          let b = this.horizontalDefaultPosition;
          if (b === "start" || b === "end") {
            const I = Qt(this);
            if (I !== this.currentDirection) {
              this.currentDirection = I, this.initialize();
              return;
            }
            this.currentDirection === oe.ltr ? b = b === "start" ? "left" : "right" : b = b === "start" ? "right" : "left";
          }
          switch (b) {
            case "left":
              t = this.horizontalInset ? "insetStart" : "start";
              break;
            case "right":
              t = this.horizontalInset ? "insetEnd" : "end";
              break;
          }
        }
        const r = this.horizontalThreshold !== void 0 ? this.horizontalThreshold : this.regionRect !== void 0 ? this.regionRect.width : 0, l = this.anchorRect !== void 0 ? this.anchorRect.left : 0, c = this.anchorRect !== void 0 ? this.anchorRect.right : 0, u = this.anchorRect !== void 0 ? this.anchorRect.width : 0, p = this.viewportRect !== void 0 ? this.viewportRect.left : 0, f = this.viewportRect !== void 0 ? this.viewportRect.right : 0;
        (t === void 0 || this.horizontalPositioningMode !== "locktodefault" && this.getAvailableSpace(t, l, c, u, p, f) < r) && (t = this.getAvailableSpace(n[0], l, c, u, p, f) > this.getAvailableSpace(n[1], l, c, u, p, f) ? n[0] : n[1]);
      }
      if (this.verticalPositioningMode !== "uncontrolled") {
        const n = this.getPositioningOptions(this.verticalInset);
        if (this.verticalDefaultPosition === "center")
          e = "center";
        else if (this.verticalDefaultPosition !== "unset")
          switch (this.verticalDefaultPosition) {
            case "top":
              e = this.verticalInset ? "insetStart" : "start";
              break;
            case "bottom":
              e = this.verticalInset ? "insetEnd" : "end";
              break;
          }
        const r = this.verticalThreshold !== void 0 ? this.verticalThreshold : this.regionRect !== void 0 ? this.regionRect.height : 0, l = this.anchorRect !== void 0 ? this.anchorRect.top : 0, c = this.anchorRect !== void 0 ? this.anchorRect.bottom : 0, u = this.anchorRect !== void 0 ? this.anchorRect.height : 0, p = this.viewportRect !== void 0 ? this.viewportRect.top : 0, f = this.viewportRect !== void 0 ? this.viewportRect.bottom : 0;
        (e === void 0 || this.verticalPositioningMode !== "locktodefault" && this.getAvailableSpace(e, l, c, u, p, f) < r) && (e = this.getAvailableSpace(n[0], l, c, u, p, f) > this.getAvailableSpace(n[1], l, c, u, p, f) ? n[0] : n[1]);
      }
      const o = this.getNextRegionDimension(t, e), s = this.horizontalPosition !== t || this.verticalPosition !== e;
      if (this.setHorizontalPosition(t, o), this.setVerticalPosition(e, o), this.updateRegionStyle(), !this.initialLayoutComplete) {
        this.initialLayoutComplete = !0, this.requestPositionUpdates();
        return;
      }
      this.regionVisible || (this.regionVisible = !0, this.style.removeProperty("pointer-events"), this.style.removeProperty("opacity"), this.classList.toggle("loaded", !0), this.$emit("loaded", this, { bubbles: !1 })), this.updatePositionClasses(), s && this.$emit("positionchange", this, { bubbles: !1 });
    }, this.updateRegionStyle = () => {
      this.style.width = this.regionWidth, this.style.height = this.regionHeight, this.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`;
    }, this.updatePositionClasses = () => {
      this.classList.toggle("top", this.verticalPosition === "start"), this.classList.toggle("bottom", this.verticalPosition === "end"), this.classList.toggle("inset-top", this.verticalPosition === "insetStart"), this.classList.toggle("inset-bottom", this.verticalPosition === "insetEnd"), this.classList.toggle("vertical-center", this.verticalPosition === "center"), this.classList.toggle("left", this.horizontalPosition === "start"), this.classList.toggle("right", this.horizontalPosition === "end"), this.classList.toggle("inset-left", this.horizontalPosition === "insetStart"), this.classList.toggle("inset-right", this.horizontalPosition === "insetEnd"), this.classList.toggle("horizontal-center", this.horizontalPosition === "center");
    }, this.setHorizontalPosition = (e, t) => {
      if (e === void 0 || this.regionRect === void 0 || this.anchorRect === void 0 || this.viewportRect === void 0)
        return;
      let o = 0;
      switch (this.horizontalScaling) {
        case "anchor":
        case "fill":
          o = this.horizontalViewportLock ? this.viewportRect.width : t.width, this.regionWidth = `${o}px`;
          break;
        case "content":
          o = this.regionRect.width, this.regionWidth = "unset";
          break;
      }
      let s = 0;
      switch (e) {
        case "start":
          this.translateX = this.baseHorizontalOffset - o, this.horizontalViewportLock && this.anchorRect.left > this.viewportRect.right && (this.translateX = this.translateX - (this.anchorRect.left - this.viewportRect.right));
          break;
        case "insetStart":
          this.translateX = this.baseHorizontalOffset - o + this.anchorRect.width, this.horizontalViewportLock && this.anchorRect.right > this.viewportRect.right && (this.translateX = this.translateX - (this.anchorRect.right - this.viewportRect.right));
          break;
        case "insetEnd":
          this.translateX = this.baseHorizontalOffset, this.horizontalViewportLock && this.anchorRect.left < this.viewportRect.left && (this.translateX = this.translateX - (this.anchorRect.left - this.viewportRect.left));
          break;
        case "end":
          this.translateX = this.baseHorizontalOffset + this.anchorRect.width, this.horizontalViewportLock && this.anchorRect.right < this.viewportRect.left && (this.translateX = this.translateX - (this.anchorRect.right - this.viewportRect.left));
          break;
        case "center":
          if (s = (this.anchorRect.width - o) / 2, this.translateX = this.baseHorizontalOffset + s, this.horizontalViewportLock) {
            const n = this.anchorRect.left + s, r = this.anchorRect.right - s;
            n < this.viewportRect.left && !(r > this.viewportRect.right) ? this.translateX = this.translateX - (n - this.viewportRect.left) : r > this.viewportRect.right && !(n < this.viewportRect.left) && (this.translateX = this.translateX - (r - this.viewportRect.right));
          }
          break;
      }
      this.horizontalPosition = e;
    }, this.setVerticalPosition = (e, t) => {
      if (e === void 0 || this.regionRect === void 0 || this.anchorRect === void 0 || this.viewportRect === void 0)
        return;
      let o = 0;
      switch (this.verticalScaling) {
        case "anchor":
        case "fill":
          o = this.verticalViewportLock ? this.viewportRect.height : t.height, this.regionHeight = `${o}px`;
          break;
        case "content":
          o = this.regionRect.height, this.regionHeight = "unset";
          break;
      }
      let s = 0;
      switch (e) {
        case "start":
          this.translateY = this.baseVerticalOffset - o, this.verticalViewportLock && this.anchorRect.top > this.viewportRect.bottom && (this.translateY = this.translateY - (this.anchorRect.top - this.viewportRect.bottom));
          break;
        case "insetStart":
          this.translateY = this.baseVerticalOffset - o + this.anchorRect.height, this.verticalViewportLock && this.anchorRect.bottom > this.viewportRect.bottom && (this.translateY = this.translateY - (this.anchorRect.bottom - this.viewportRect.bottom));
          break;
        case "insetEnd":
          this.translateY = this.baseVerticalOffset, this.verticalViewportLock && this.anchorRect.top < this.viewportRect.top && (this.translateY = this.translateY - (this.anchorRect.top - this.viewportRect.top));
          break;
        case "end":
          this.translateY = this.baseVerticalOffset + this.anchorRect.height, this.verticalViewportLock && this.anchorRect.bottom < this.viewportRect.top && (this.translateY = this.translateY - (this.anchorRect.bottom - this.viewportRect.top));
          break;
        case "center":
          if (s = (this.anchorRect.height - o) / 2, this.translateY = this.baseVerticalOffset + s, this.verticalViewportLock) {
            const n = this.anchorRect.top + s, r = this.anchorRect.bottom - s;
            n < this.viewportRect.top && !(r > this.viewportRect.bottom) ? this.translateY = this.translateY - (n - this.viewportRect.top) : r > this.viewportRect.bottom && !(n < this.viewportRect.top) && (this.translateY = this.translateY - (r - this.viewportRect.bottom));
          }
      }
      this.verticalPosition = e;
    }, this.getPositioningOptions = (e) => e ? ["insetStart", "insetEnd"] : ["start", "end"], this.getAvailableSpace = (e, t, o, s, n, r) => {
      const l = t - n, c = r - (t + s);
      switch (e) {
        case "start":
          return l;
        case "insetStart":
          return l + s;
        case "insetEnd":
          return c + s;
        case "end":
          return c;
        case "center":
          return Math.min(l, c) * 2 + s;
      }
    }, this.getNextRegionDimension = (e, t) => {
      const o = {
        height: this.regionRect !== void 0 ? this.regionRect.height : 0,
        width: this.regionRect !== void 0 ? this.regionRect.width : 0
      };
      return e !== void 0 && this.horizontalScaling === "fill" ? o.width = this.getAvailableSpace(e, this.anchorRect !== void 0 ? this.anchorRect.left : 0, this.anchorRect !== void 0 ? this.anchorRect.right : 0, this.anchorRect !== void 0 ? this.anchorRect.width : 0, this.viewportRect !== void 0 ? this.viewportRect.left : 0, this.viewportRect !== void 0 ? this.viewportRect.right : 0) : this.horizontalScaling === "anchor" && (o.width = this.anchorRect !== void 0 ? this.anchorRect.width : 0), t !== void 0 && this.verticalScaling === "fill" ? o.height = this.getAvailableSpace(t, this.anchorRect !== void 0 ? this.anchorRect.top : 0, this.anchorRect !== void 0 ? this.anchorRect.bottom : 0, this.anchorRect !== void 0 ? this.anchorRect.height : 0, this.viewportRect !== void 0 ? this.viewportRect.top : 0, this.viewportRect !== void 0 ? this.viewportRect.bottom : 0) : this.verticalScaling === "anchor" && (o.height = this.anchorRect !== void 0 ? this.anchorRect.height : 0), o;
    }, this.startAutoUpdateEventListeners = () => {
      window.addEventListener(or, this.update, { passive: !0 }), window.addEventListener(sr, this.update, {
        passive: !0,
        capture: !0
      }), this.resizeDetector !== null && this.viewportElement !== null && this.resizeDetector.observe(this.viewportElement);
    }, this.stopAutoUpdateEventListeners = () => {
      window.removeEventListener(or, this.update), window.removeEventListener(sr, this.update), this.resizeDetector !== null && this.viewportElement !== null && this.resizeDetector.unobserve(this.viewportElement);
    };
  }
  anchorChanged() {
    this.initialLayoutComplete && (this.anchorElement = this.getAnchor());
  }
  viewportChanged() {
    this.initialLayoutComplete && (this.viewportElement = this.getViewport());
  }
  horizontalPositioningModeChanged() {
    this.requestReset();
  }
  horizontalDefaultPositionChanged() {
    this.updateForAttributeChange();
  }
  horizontalViewportLockChanged() {
    this.updateForAttributeChange();
  }
  horizontalInsetChanged() {
    this.updateForAttributeChange();
  }
  horizontalThresholdChanged() {
    this.updateForAttributeChange();
  }
  horizontalScalingChanged() {
    this.updateForAttributeChange();
  }
  verticalPositioningModeChanged() {
    this.requestReset();
  }
  verticalDefaultPositionChanged() {
    this.updateForAttributeChange();
  }
  verticalViewportLockChanged() {
    this.updateForAttributeChange();
  }
  verticalInsetChanged() {
    this.updateForAttributeChange();
  }
  verticalThresholdChanged() {
    this.updateForAttributeChange();
  }
  verticalScalingChanged() {
    this.updateForAttributeChange();
  }
  fixedPlacementChanged() {
    this.$fastController.isConnected && this.initialLayoutComplete && this.initialize();
  }
  autoUpdateModeChanged(e, t) {
    this.$fastController.isConnected && this.initialLayoutComplete && (e === "auto" && this.stopAutoUpdateEventListeners(), t === "auto" && this.startAutoUpdateEventListeners());
  }
  anchorElementChanged() {
    this.requestReset();
  }
  viewportElementChanged() {
    this.$fastController.isConnected && this.initialLayoutComplete && this.initialize();
  }
  connectedCallback() {
    super.connectedCallback(), this.autoUpdateMode === "auto" && this.startAutoUpdateEventListeners(), this.initialize();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.autoUpdateMode === "auto" && this.stopAutoUpdateEventListeners(), this.stopObservers(), this.disconnectResizeDetector();
  }
  adoptedCallback() {
    this.initialize();
  }
  disconnectResizeDetector() {
    this.resizeDetector !== null && (this.resizeDetector.disconnect(), this.resizeDetector = null);
  }
  initializeResizeDetector() {
    this.disconnectResizeDetector(), this.resizeDetector = new window.ResizeObserver(this.handleResize);
  }
  updateForAttributeChange() {
    this.$fastController.isConnected && this.initialLayoutComplete && (this.forceUpdate = !0, this.update());
  }
  initialize() {
    this.initializeResizeDetector(), this.anchorElement === null && (this.anchorElement = this.getAnchor()), this.requestReset();
  }
  requestReset() {
    this.$fastController.isConnected && this.pendingReset === !1 && (this.setInitialState(), R.queueUpdate(() => this.reset()), this.pendingReset = !0);
  }
  setInitialState() {
    this.initialLayoutComplete = !1, this.regionVisible = !1, this.translateX = 0, this.translateY = 0, this.baseHorizontalOffset = 0, this.baseVerticalOffset = 0, this.viewportRect = void 0, this.regionRect = void 0, this.anchorRect = void 0, this.verticalPosition = void 0, this.horizontalPosition = void 0, this.style.opacity = "0", this.style.pointerEvents = "none", this.forceUpdate = !1, this.style.position = this.fixedPlacement ? "fixed" : "absolute", this.updatePositionClasses(), this.updateRegionStyle();
  }
}
W.intersectionService = new Nd();
a([
  h
], W.prototype, "anchor", void 0);
a([
  h
], W.prototype, "viewport", void 0);
a([
  h({ attribute: "horizontal-positioning-mode" })
], W.prototype, "horizontalPositioningMode", void 0);
a([
  h({ attribute: "horizontal-default-position" })
], W.prototype, "horizontalDefaultPosition", void 0);
a([
  h({ attribute: "horizontal-viewport-lock", mode: "boolean" })
], W.prototype, "horizontalViewportLock", void 0);
a([
  h({ attribute: "horizontal-inset", mode: "boolean" })
], W.prototype, "horizontalInset", void 0);
a([
  h({ attribute: "horizontal-threshold" })
], W.prototype, "horizontalThreshold", void 0);
a([
  h({ attribute: "horizontal-scaling" })
], W.prototype, "horizontalScaling", void 0);
a([
  h({ attribute: "vertical-positioning-mode" })
], W.prototype, "verticalPositioningMode", void 0);
a([
  h({ attribute: "vertical-default-position" })
], W.prototype, "verticalDefaultPosition", void 0);
a([
  h({ attribute: "vertical-viewport-lock", mode: "boolean" })
], W.prototype, "verticalViewportLock", void 0);
a([
  h({ attribute: "vertical-inset", mode: "boolean" })
], W.prototype, "verticalInset", void 0);
a([
  h({ attribute: "vertical-threshold" })
], W.prototype, "verticalThreshold", void 0);
a([
  h({ attribute: "vertical-scaling" })
], W.prototype, "verticalScaling", void 0);
a([
  h({ attribute: "fixed-placement", mode: "boolean" })
], W.prototype, "fixedPlacement", void 0);
a([
  h({ attribute: "auto-update-mode" })
], W.prototype, "autoUpdateMode", void 0);
a([
  g
], W.prototype, "anchorElement", void 0);
a([
  g
], W.prototype, "viewportElement", void 0);
a([
  g
], W.prototype, "initialLayoutComplete", void 0);
const mn = {
  horizontalDefaultPosition: "center",
  horizontalPositioningMode: "locktodefault",
  horizontalInset: !1,
  horizontalScaling: "anchor"
}, Ea = Object.assign(Object.assign({}, mn), { verticalDefaultPosition: "top", verticalPositioningMode: "locktodefault", verticalInset: !1, verticalScaling: "content" }), Ra = Object.assign(Object.assign({}, mn), { verticalDefaultPosition: "bottom", verticalPositioningMode: "locktodefault", verticalInset: !1, verticalScaling: "content" }), Da = Object.assign(Object.assign({}, mn), { verticalPositioningMode: "dynamic", verticalInset: !1, verticalScaling: "content" }), Bd = Object.assign(Object.assign({}, Ea), { verticalScaling: "fill" }), ar = Object.assign(Object.assign({}, Ra), { verticalScaling: "fill" }), jd = Object.assign(Object.assign({}, Da), { verticalScaling: "fill" }), _d = (i, e) => v`
    <div
        class="backplate ${(t) => t.shape}"
        part="backplate"
        style="${(t) => t.fill ? `background-color: var(--avatar-fill-${t.fill});` : void 0}"
    >
        <a
            class="link"
            part="link"
            href="${(t) => t.link ? t.link : void 0}"
            style="${(t) => t.color ? `color: var(--avatar-color-${t.color});` : void 0}"
        >
            <slot name="media" part="media">${e.media || ""}</slot>
            <slot class="content" part="content"><slot>
        </a>
    </div>
    <slot name="badge" part="badge"></slot>
`;
let Ri = class extends O {
  connectedCallback() {
    super.connectedCallback(), this.shape || (this.shape = "circle");
  }
};
a([
  h
], Ri.prototype, "fill", void 0);
a([
  h
], Ri.prototype, "color", void 0);
a([
  h
], Ri.prototype, "link", void 0);
a([
  h
], Ri.prototype, "shape", void 0);
const Ud = (i, e) => v`
    <template class="${(t) => t.circular ? "circular" : ""}">
        <div class="control" part="control" style="${(t) => t.generateBadgeStyle()}">
            <slot></slot>
        </div>
    </template>
`;
class ti extends O {
  constructor() {
    super(...arguments), this.generateBadgeStyle = () => {
      if (!this.fill && !this.color)
        return;
      const e = `background-color: var(--badge-fill-${this.fill});`, t = `color: var(--badge-color-${this.color});`;
      return this.fill && !this.color ? e : this.color && !this.fill ? t : `${t} ${e}`;
    };
  }
}
a([
  h({ attribute: "fill" })
], ti.prototype, "fill", void 0);
a([
  h({ attribute: "color" })
], ti.prototype, "color", void 0);
a([
  h({ mode: "boolean" })
], ti.prototype, "circular", void 0);
const qd = (i, e) => v`
    <div role="listitem" class="listitem" part="listitem">
        ${Q((t) => t.href && t.href.length > 0, v`
                ${Fa(i, e)}
            `)}
        ${Q((t) => !t.href, v`
                ${Ae(i, e)}
                <slot></slot>
                ${Le(i, e)}
            `)}
        ${Q((t) => t.separator, v`
                <span class="separator" part="separator" aria-hidden="true">
                    <slot name="separator">${e.separator || ""}</slot>
                </span>
            `)}
    </div>
`;
class Ki extends qe {
  constructor() {
    super(...arguments), this.separator = !0;
  }
}
a([
  g
], Ki.prototype, "separator", void 0);
ae(Ki, He, Go);
const Gd = (i, e) => v`
    <template role="navigation">
        <div role="list" class="list" part="list">
            <slot
                ${ee({ property: "slottedBreadcrumbItems", filter: wt() })}
            ></slot>
        </div>
    </template>
`;
class Oa extends O {
  slottedBreadcrumbItemsChanged() {
    if (this.$fastController.isConnected) {
      if (this.slottedBreadcrumbItems === void 0 || this.slottedBreadcrumbItems.length === 0)
        return;
      const e = this.slottedBreadcrumbItems[this.slottedBreadcrumbItems.length - 1];
      this.slottedBreadcrumbItems.forEach((t) => {
        const o = t === e;
        this.setItemSeparator(t, o), this.setAriaCurrent(t, o);
      });
    }
  }
  setItemSeparator(e, t) {
    e instanceof Ki && (e.separator = !t);
  }
  findChildWithHref(e) {
    var t, o;
    return e.childElementCount > 0 ? e.querySelector("a[href]") : !((t = e.shadowRoot) === null || t === void 0) && t.childElementCount ? (o = e.shadowRoot) === null || o === void 0 ? void 0 : o.querySelector("a[href]") : null;
  }
  setAriaCurrent(e, t) {
    const o = this.findChildWithHref(e);
    o === null && e.hasAttribute("href") && e instanceof Ki ? t ? e.setAttribute("aria-current", "page") : e.removeAttribute("aria-current") : o !== null && (t ? o.setAttribute("aria-current", "page") : o.removeAttribute("aria-current"));
  }
}
a([
  g
], Oa.prototype, "slottedBreadcrumbItems", void 0);
const Wd = (i, e) => v`
    <button
        class="control"
        part="control"
        ?autofocus="${(t) => t.autofocus}"
        ?disabled="${(t) => t.disabled}"
        form="${(t) => t.formId}"
        formaction="${(t) => t.formaction}"
        formenctype="${(t) => t.formenctype}"
        formmethod="${(t) => t.formmethod}"
        formnovalidate="${(t) => t.formnovalidate}"
        formtarget="${(t) => t.formtarget}"
        name="${(t) => t.name}"
        type="${(t) => t.type}"
        value="${(t) => t.value}"
        aria-atomic="${(t) => t.ariaAtomic}"
        aria-busy="${(t) => t.ariaBusy}"
        aria-controls="${(t) => t.ariaControls}"
        aria-current="${(t) => t.ariaCurrent}"
        aria-describedby="${(t) => t.ariaDescribedby}"
        aria-details="${(t) => t.ariaDetails}"
        aria-disabled="${(t) => t.ariaDisabled}"
        aria-errormessage="${(t) => t.ariaErrormessage}"
        aria-expanded="${(t) => t.ariaExpanded}"
        aria-flowto="${(t) => t.ariaFlowto}"
        aria-haspopup="${(t) => t.ariaHaspopup}"
        aria-hidden="${(t) => t.ariaHidden}"
        aria-invalid="${(t) => t.ariaInvalid}"
        aria-keyshortcuts="${(t) => t.ariaKeyshortcuts}"
        aria-label="${(t) => t.ariaLabel}"
        aria-labelledby="${(t) => t.ariaLabelledby}"
        aria-live="${(t) => t.ariaLive}"
        aria-owns="${(t) => t.ariaOwns}"
        aria-pressed="${(t) => t.ariaPressed}"
        aria-relevant="${(t) => t.ariaRelevant}"
        aria-roledescription="${(t) => t.ariaRoledescription}"
        ${U("control")}
    >
        ${Ae(i, e)}
        <span class="content" part="content">
            <slot ${ee("defaultSlottedContent")}></slot>
        </span>
        ${Le(i, e)}
    </button>
`, lr = "form-associated-proxy", cr = "ElementInternals", dr = cr in window && "setFormValue" in window[cr].prototype, hr = /* @__PURE__ */ new WeakMap();
function ft(i) {
  const e = class extends i {
    constructor(...t) {
      super(...t), this.dirtyValue = !1, this.disabled = !1, this.proxyEventsToBlock = ["change", "click"], this.proxyInitialized = !1, this.required = !1, this.initialValue = this.initialValue || "", this.elementInternals || (this.formResetCallback = this.formResetCallback.bind(this));
    }
    static get formAssociated() {
      return dr;
    }
    get validity() {
      return this.elementInternals ? this.elementInternals.validity : this.proxy.validity;
    }
    get form() {
      return this.elementInternals ? this.elementInternals.form : this.proxy.form;
    }
    get validationMessage() {
      return this.elementInternals ? this.elementInternals.validationMessage : this.proxy.validationMessage;
    }
    get willValidate() {
      return this.elementInternals ? this.elementInternals.willValidate : this.proxy.willValidate;
    }
    get labels() {
      if (this.elementInternals)
        return Object.freeze(Array.from(this.elementInternals.labels));
      if (this.proxy instanceof HTMLElement && this.proxy.ownerDocument && this.id) {
        const t = this.proxy.labels, o = Array.from(this.proxy.getRootNode().querySelectorAll(`[for='${this.id}']`)), s = t ? o.concat(Array.from(t)) : o;
        return Object.freeze(s);
      } else
        return Wt;
    }
    valueChanged(t, o) {
      this.dirtyValue = !0, this.proxy instanceof HTMLElement && (this.proxy.value = this.value), this.currentValue = this.value, this.setFormValue(this.value), this.validate();
    }
    currentValueChanged() {
      this.value = this.currentValue;
    }
    initialValueChanged(t, o) {
      this.dirtyValue || (this.value = this.initialValue, this.dirtyValue = !1);
    }
    disabledChanged(t, o) {
      this.proxy instanceof HTMLElement && (this.proxy.disabled = this.disabled), R.queueUpdate(() => this.classList.toggle("disabled", this.disabled));
    }
    nameChanged(t, o) {
      this.proxy instanceof HTMLElement && (this.proxy.name = this.name);
    }
    requiredChanged(t, o) {
      this.proxy instanceof HTMLElement && (this.proxy.required = this.required), R.queueUpdate(() => this.classList.toggle("required", this.required)), this.validate();
    }
    get elementInternals() {
      if (!dr)
        return null;
      let t = hr.get(this);
      return t || (t = this.attachInternals(), hr.set(this, t)), t;
    }
    connectedCallback() {
      super.connectedCallback(), this.addEventListener("keypress", this._keypressHandler), this.value || (this.value = this.initialValue, this.dirtyValue = !1), this.elementInternals || (this.attachProxy(), this.form && this.form.addEventListener("reset", this.formResetCallback));
    }
    disconnectedCallback() {
      this.proxyEventsToBlock.forEach((t) => this.proxy.removeEventListener(t, this.stopPropagation)), !this.elementInternals && this.form && this.form.removeEventListener("reset", this.formResetCallback);
    }
    checkValidity() {
      return this.elementInternals ? this.elementInternals.checkValidity() : this.proxy.checkValidity();
    }
    reportValidity() {
      return this.elementInternals ? this.elementInternals.reportValidity() : this.proxy.reportValidity();
    }
    setValidity(t, o, s) {
      this.elementInternals ? this.elementInternals.setValidity(t, o, s) : typeof o == "string" && this.proxy.setCustomValidity(o);
    }
    formDisabledCallback(t) {
      this.disabled = t;
    }
    formResetCallback() {
      this.value = this.initialValue, this.dirtyValue = !1;
    }
    attachProxy() {
      var t;
      this.proxyInitialized || (this.proxyInitialized = !0, this.proxy.style.display = "none", this.proxyEventsToBlock.forEach((o) => this.proxy.addEventListener(o, this.stopPropagation)), this.proxy.disabled = this.disabled, this.proxy.required = this.required, typeof this.name == "string" && (this.proxy.name = this.name), typeof this.value == "string" && (this.proxy.value = this.value), this.proxy.setAttribute("slot", lr), this.proxySlot = document.createElement("slot"), this.proxySlot.setAttribute("name", lr)), (t = this.shadowRoot) === null || t === void 0 || t.appendChild(this.proxySlot), this.appendChild(this.proxy);
    }
    detachProxy() {
      var t;
      this.removeChild(this.proxy), (t = this.shadowRoot) === null || t === void 0 || t.removeChild(this.proxySlot);
    }
    validate(t) {
      this.proxy instanceof HTMLElement && this.setValidity(this.proxy.validity, this.proxy.validationMessage, t);
    }
    setFormValue(t, o) {
      this.elementInternals && this.elementInternals.setFormValue(t, o || t);
    }
    _keypressHandler(t) {
      switch (t.key) {
        case st:
          if (this.form instanceof HTMLFormElement) {
            const o = this.form.querySelector("[type=submit]");
            o == null || o.click();
          }
          break;
      }
    }
    stopPropagation(t) {
      t.stopPropagation();
    }
  };
  return h({ mode: "boolean" })(e.prototype, "disabled"), h({ mode: "fromView", attribute: "value" })(e.prototype, "initialValue"), h({ attribute: "current-value" })(e.prototype, "currentValue"), h(e.prototype, "name"), h({ mode: "boolean" })(e.prototype, "required"), g(e.prototype, "value"), e;
}
function bn(i) {
  class e extends ft(i) {
  }
  class t extends e {
    constructor(...s) {
      super(s), this.dirtyChecked = !1, this.checkedAttribute = !1, this.checked = !1, this.dirtyChecked = !1;
    }
    checkedAttributeChanged() {
      this.defaultChecked = this.checkedAttribute;
    }
    defaultCheckedChanged() {
      this.dirtyChecked || (this.checked = this.defaultChecked, this.dirtyChecked = !1);
    }
    checkedChanged(s, n) {
      this.dirtyChecked || (this.dirtyChecked = !0), this.currentChecked = this.checked, this.updateForm(), this.proxy instanceof HTMLInputElement && (this.proxy.checked = this.checked), s !== void 0 && this.$emit("change"), this.validate();
    }
    currentCheckedChanged(s, n) {
      this.checked = this.currentChecked;
    }
    updateForm() {
      const s = this.checked ? this.value : null;
      this.setFormValue(s, s);
    }
    connectedCallback() {
      super.connectedCallback(), this.updateForm();
    }
    formResetCallback() {
      super.formResetCallback(), this.checked = !!this.checkedAttribute, this.dirtyChecked = !1;
    }
  }
  return h({ attribute: "checked", mode: "boolean" })(t.prototype, "checkedAttribute"), h({ attribute: "current-checked", converter: _o })(t.prototype, "currentChecked"), g(t.prototype, "defaultChecked"), g(t.prototype, "checked"), t;
}
class Yd extends O {
}
class Xd extends ft(Yd) {
  constructor() {
    super(...arguments), this.proxy = document.createElement("input");
  }
}
let et = class extends Xd {
  constructor() {
    super(...arguments), this.handleClick = (e) => {
      var t;
      this.disabled && ((t = this.defaultSlottedContent) === null || t === void 0 ? void 0 : t.length) <= 1 && e.stopPropagation();
    }, this.handleSubmission = () => {
      if (!this.form)
        return;
      const e = this.proxy.isConnected;
      e || this.attachProxy(), typeof this.form.requestSubmit == "function" ? this.form.requestSubmit(this.proxy) : this.proxy.click(), e || this.detachProxy();
    }, this.handleFormReset = () => {
      var e;
      (e = this.form) === null || e === void 0 || e.reset();
    }, this.handleUnsupportedDelegatesFocus = () => {
      var e;
      window.ShadowRoot && !window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus") && (!((e = this.$fastController.definition.shadowOptions) === null || e === void 0) && e.delegatesFocus) && (this.focus = () => {
        this.control.focus();
      });
    };
  }
  formactionChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.formAction = this.formaction);
  }
  formenctypeChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.formEnctype = this.formenctype);
  }
  formmethodChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.formMethod = this.formmethod);
  }
  formnovalidateChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.formNoValidate = this.formnovalidate);
  }
  formtargetChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.formTarget = this.formtarget);
  }
  typeChanged(e, t) {
    this.proxy instanceof HTMLInputElement && (this.proxy.type = this.type), t === "submit" && this.addEventListener("click", this.handleSubmission), e === "submit" && this.removeEventListener("click", this.handleSubmission), t === "reset" && this.addEventListener("click", this.handleFormReset), e === "reset" && this.removeEventListener("click", this.handleFormReset);
  }
  validate() {
    super.validate(this.control);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), this.proxy.setAttribute("type", this.type), this.handleUnsupportedDelegatesFocus();
    const t = Array.from((e = this.control) === null || e === void 0 ? void 0 : e.children);
    t && t.forEach((o) => {
      o.addEventListener("click", this.handleClick);
    });
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback();
    const t = Array.from((e = this.control) === null || e === void 0 ? void 0 : e.children);
    t && t.forEach((o) => {
      o.removeEventListener("click", this.handleClick);
    });
  }
};
a([
  h({ mode: "boolean" })
], et.prototype, "autofocus", void 0);
a([
  h({ attribute: "form" })
], et.prototype, "formId", void 0);
a([
  h
], et.prototype, "formaction", void 0);
a([
  h
], et.prototype, "formenctype", void 0);
a([
  h
], et.prototype, "formmethod", void 0);
a([
  h({ mode: "boolean" })
], et.prototype, "formnovalidate", void 0);
a([
  h
], et.prototype, "formtarget", void 0);
a([
  h
], et.prototype, "type", void 0);
a([
  g
], et.prototype, "defaultSlottedContent", void 0);
class Wo {
}
a([
  h({ attribute: "aria-expanded" })
], Wo.prototype, "ariaExpanded", void 0);
a([
  h({ attribute: "aria-pressed" })
], Wo.prototype, "ariaPressed", void 0);
ae(Wo, se);
ae(et, He, Wo);
class Qd {
  constructor(e) {
    if (this.dayFormat = "numeric", this.weekdayFormat = "long", this.monthFormat = "long", this.yearFormat = "numeric", this.date = new Date(), e)
      for (const t in e) {
        const o = e[t];
        t === "date" ? this.date = this.getDateObject(o) : this[t] = o;
      }
  }
  getDateObject(e) {
    if (typeof e == "string") {
      const t = e.split(/[/-]/);
      return t.length < 3 ? new Date() : new Date(parseInt(t[2], 10), parseInt(t[0], 10) - 1, parseInt(t[1], 10));
    } else if ("day" in e && "month" in e && "year" in e) {
      const { day: t, month: o, year: s } = e;
      return new Date(s, o - 1, t);
    }
    return e;
  }
  getDate(e = this.date, t = {
    weekday: this.weekdayFormat,
    month: this.monthFormat,
    day: this.dayFormat,
    year: this.yearFormat
  }, o = this.locale) {
    const s = this.getDateObject(e), n = Object.assign({ timeZone: "utc" }, t);
    return new Intl.DateTimeFormat(o, n).format(s);
  }
  getDay(e = this.date.getDate(), t = this.dayFormat, o = this.locale) {
    return this.getDate({ month: 1, day: e, year: 2020 }, { day: t }, o);
  }
  getMonth(e = this.date.getMonth() + 1, t = this.monthFormat, o = this.locale) {
    return this.getDate({ month: e, day: 2, year: 2020 }, { month: t }, o);
  }
  getYear(e = this.date.getFullYear(), t = this.yearFormat, o = this.locale) {
    return this.getDate({ month: 2, day: 2, year: e }, { year: t }, o);
  }
  getWeekday(e = 0, t = this.weekdayFormat, o = this.locale) {
    const s = `1-${e + 1}-2017`;
    return this.getDate(s, { weekday: t }, o);
  }
  getWeekdays(e = this.weekdayFormat, t = this.locale) {
    return Array(7).fill(null).map((o, s) => this.getWeekday(s, e, t));
  }
}
class tt extends O {
  constructor() {
    super(...arguments), this.dateFormatter = new Qd(), this.readonly = !1, this.locale = "en-US", this.month = new Date().getMonth() + 1, this.year = new Date().getFullYear(), this.dayFormat = "numeric", this.weekdayFormat = "short", this.monthFormat = "long", this.yearFormat = "numeric", this.minWeeks = 0, this.disabledDates = "", this.selectedDates = "", this.oneDayInMs = 864e5;
  }
  localeChanged() {
    this.dateFormatter.locale = this.locale;
  }
  dayFormatChanged() {
    this.dateFormatter.dayFormat = this.dayFormat;
  }
  weekdayFormatChanged() {
    this.dateFormatter.weekdayFormat = this.weekdayFormat;
  }
  monthFormatChanged() {
    this.dateFormatter.monthFormat = this.monthFormat;
  }
  yearFormatChanged() {
    this.dateFormatter.yearFormat = this.yearFormat;
  }
  getMonthInfo(e = this.month, t = this.year) {
    const o = (c) => new Date(c.getFullYear(), c.getMonth(), 1).getDay(), s = (c) => {
      const u = new Date(c.getFullYear(), c.getMonth() + 1, 1);
      return new Date(u.getTime() - this.oneDayInMs).getDate();
    }, n = new Date(t, e - 1), r = new Date(t, e), l = new Date(t, e - 2);
    return {
      length: s(n),
      month: e,
      start: o(n),
      year: t,
      previous: {
        length: s(l),
        month: l.getMonth() + 1,
        start: o(l),
        year: l.getFullYear()
      },
      next: {
        length: s(r),
        month: r.getMonth() + 1,
        start: o(r),
        year: r.getFullYear()
      }
    };
  }
  getDays(e = this.getMonthInfo(), t = this.minWeeks) {
    t = t > 10 ? 10 : t;
    const { start: o, length: s, previous: n, next: r } = e, l = [];
    let c = 1 - o;
    for (; c < s + 1 || l.length < t || l[l.length - 1].length % 7 !== 0; ) {
      const { month: u, year: p } = c < 1 ? n : c > s ? r : e, f = c < 1 ? n.length + c : c > s ? c - s : c, b = `${u}-${f}-${p}`, I = this.dateInString(b, this.disabledDates), $ = this.dateInString(b, this.selectedDates), k = {
        day: f,
        month: u,
        year: p,
        disabled: I,
        selected: $
      }, L = l[l.length - 1];
      l.length === 0 || L.length % 7 === 0 ? l.push([k]) : L.push(k), c++;
    }
    return l;
  }
  dateInString(e, t) {
    const o = t.split(",").map((s) => s.trim());
    return e = typeof e == "string" ? e : `${e.getMonth() + 1}-${e.getDate()}-${e.getFullYear()}`, o.some((s) => s === e);
  }
  getDayClassNames(e, t) {
    const { day: o, month: s, year: n, disabled: r, selected: l } = e, c = t === `${s}-${o}-${n}`, u = this.month !== s;
    return [
      "day",
      c && "today",
      u && "inactive",
      r && "disabled",
      l && "selected"
    ].filter(Boolean).join(" ");
  }
  getWeekdayText() {
    const e = this.dateFormatter.getWeekdays().map((t) => ({ text: t }));
    if (this.weekdayFormat !== "long") {
      const t = this.dateFormatter.getWeekdays("long");
      e.forEach((o, s) => {
        o.abbr = t[s];
      });
    }
    return e;
  }
  handleDateSelect(e, t) {
    e.preventDefault, this.$emit("dateselected", t);
  }
  handleKeydown(e, t) {
    return e.key === st && this.handleDateSelect(e, t), !0;
  }
}
a([
  h({ mode: "boolean" })
], tt.prototype, "readonly", void 0);
a([
  h
], tt.prototype, "locale", void 0);
a([
  h({ converter: C })
], tt.prototype, "month", void 0);
a([
  h({ converter: C })
], tt.prototype, "year", void 0);
a([
  h({ attribute: "day-format", mode: "fromView" })
], tt.prototype, "dayFormat", void 0);
a([
  h({ attribute: "weekday-format", mode: "fromView" })
], tt.prototype, "weekdayFormat", void 0);
a([
  h({ attribute: "month-format", mode: "fromView" })
], tt.prototype, "monthFormat", void 0);
a([
  h({ attribute: "year-format", mode: "fromView" })
], tt.prototype, "yearFormat", void 0);
a([
  h({ attribute: "min-weeks", converter: C })
], tt.prototype, "minWeeks", void 0);
a([
  h({ attribute: "disabled-dates" })
], tt.prototype, "disabledDates", void 0);
a([
  h({ attribute: "selected-dates" })
], tt.prototype, "selectedDates", void 0);
const Co = {
  none: "none",
  default: "default",
  sticky: "sticky"
}, Ot = {
  default: "default",
  columnHeader: "columnheader",
  rowHeader: "rowheader"
}, Yi = {
  default: "default",
  header: "header",
  stickyHeader: "sticky-header"
};
class Ce extends O {
  constructor() {
    super(...arguments), this.rowType = Yi.default, this.rowData = null, this.columnDefinitions = null, this.isActiveRow = !1, this.cellsRepeatBehavior = null, this.cellsPlaceholder = null, this.focusColumnIndex = 0, this.refocusOnLoad = !1, this.updateRowStyle = () => {
      this.style.gridTemplateColumns = this.gridTemplateColumns;
    };
  }
  gridTemplateColumnsChanged() {
    this.$fastController.isConnected && this.updateRowStyle();
  }
  rowTypeChanged() {
    this.$fastController.isConnected && this.updateItemTemplate();
  }
  rowDataChanged() {
    if (this.rowData !== null && this.isActiveRow) {
      this.refocusOnLoad = !0;
      return;
    }
  }
  cellItemTemplateChanged() {
    this.updateItemTemplate();
  }
  headerCellItemTemplateChanged() {
    this.updateItemTemplate();
  }
  connectedCallback() {
    super.connectedCallback(), this.cellsRepeatBehavior === null && (this.cellsPlaceholder = document.createComment(""), this.appendChild(this.cellsPlaceholder), this.updateItemTemplate(), this.cellsRepeatBehavior = new Zi((e) => e.columnDefinitions, (e) => e.activeCellItemTemplate, { positioning: !0 }).createBehavior(this.cellsPlaceholder), this.$fastController.addBehaviors([this.cellsRepeatBehavior])), this.addEventListener("cell-focused", this.handleCellFocus), this.addEventListener(Ci, this.handleFocusout), this.addEventListener(Ti, this.handleKeydown), this.updateRowStyle(), this.refocusOnLoad && (this.refocusOnLoad = !1, this.cellElements.length > this.focusColumnIndex && this.cellElements[this.focusColumnIndex].focus());
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("cell-focused", this.handleCellFocus), this.removeEventListener(Ci, this.handleFocusout), this.removeEventListener(Ti, this.handleKeydown);
  }
  handleFocusout(e) {
    this.contains(e.target) || (this.isActiveRow = !1, this.focusColumnIndex = 0);
  }
  handleCellFocus(e) {
    this.isActiveRow = !0, this.focusColumnIndex = this.cellElements.indexOf(e.target), this.$emit("row-focused", this);
  }
  handleKeydown(e) {
    if (e.defaultPrevented)
      return;
    let t = 0;
    switch (e.key) {
      case kt:
        t = Math.max(0, this.focusColumnIndex - 1), this.cellElements[t].focus(), e.preventDefault();
        break;
      case Ct:
        t = Math.min(this.cellElements.length - 1, this.focusColumnIndex + 1), this.cellElements[t].focus(), e.preventDefault();
        break;
      case ut:
        e.ctrlKey || (this.cellElements[0].focus(), e.preventDefault());
        break;
      case pt:
        e.ctrlKey || (this.cellElements[this.cellElements.length - 1].focus(), e.preventDefault());
        break;
    }
  }
  updateItemTemplate() {
    this.activeCellItemTemplate = this.rowType === Yi.default && this.cellItemTemplate !== void 0 ? this.cellItemTemplate : this.rowType === Yi.default && this.cellItemTemplate === void 0 ? this.defaultCellItemTemplate : this.headerCellItemTemplate !== void 0 ? this.headerCellItemTemplate : this.defaultHeaderCellItemTemplate;
  }
}
a([
  h({ attribute: "grid-template-columns" })
], Ce.prototype, "gridTemplateColumns", void 0);
a([
  h({ attribute: "row-type" })
], Ce.prototype, "rowType", void 0);
a([
  g
], Ce.prototype, "rowData", void 0);
a([
  g
], Ce.prototype, "columnDefinitions", void 0);
a([
  g
], Ce.prototype, "cellItemTemplate", void 0);
a([
  g
], Ce.prototype, "headerCellItemTemplate", void 0);
a([
  g
], Ce.prototype, "rowIndex", void 0);
a([
  g
], Ce.prototype, "isActiveRow", void 0);
a([
  g
], Ce.prototype, "activeCellItemTemplate", void 0);
a([
  g
], Ce.prototype, "defaultCellItemTemplate", void 0);
a([
  g
], Ce.prototype, "defaultHeaderCellItemTemplate", void 0);
a([
  g
], Ce.prototype, "cellElements", void 0);
function Zd(i) {
  const e = i.tagFor(Ce);
  return v`
    <${e}
        :rowData="${(t) => t}"
        :cellItemTemplate="${(t, o) => o.parent.cellItemTemplate}"
        :headerCellItemTemplate="${(t, o) => o.parent.headerCellItemTemplate}"
    ></${e}>
`;
}
const Jd = (i, e) => {
  const t = Zd(i), o = i.tagFor(Ce);
  return v`
        <template
            role="grid"
            tabindex="0"
            :rowElementTag="${() => o}"
            :defaultRowItemTemplate="${t}"
            ${Uo({
    property: "rowElements",
    filter: wt("[role=row]")
  })}
        >
            <slot></slot>
        </template>
    `;
};
class ye extends O {
  constructor() {
    super(), this.noTabbing = !1, this.generateHeader = Co.default, this.rowsData = [], this.columnDefinitions = null, this.focusRowIndex = 0, this.focusColumnIndex = 0, this.rowsPlaceholder = null, this.generatedHeader = null, this.isUpdatingFocus = !1, this.pendingFocusUpdate = !1, this.rowindexUpdateQueued = !1, this.columnDefinitionsStale = !0, this.generatedGridTemplateColumns = "", this.focusOnCell = (e, t, o) => {
      if (this.rowElements.length === 0) {
        this.focusRowIndex = 0, this.focusColumnIndex = 0;
        return;
      }
      const s = Math.max(0, Math.min(this.rowElements.length - 1, e)), r = this.rowElements[s].querySelectorAll('[role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"]'), l = Math.max(0, Math.min(r.length - 1, t)), c = r[l];
      o && this.scrollHeight !== this.clientHeight && (s < this.focusRowIndex && this.scrollTop > 0 || s > this.focusRowIndex && this.scrollTop < this.scrollHeight - this.clientHeight) && c.scrollIntoView({ block: "center", inline: "center" }), c.focus();
    }, this.onChildListChange = (e, t) => {
      e && e.length && (e.forEach((o) => {
        o.addedNodes.forEach((s) => {
          s.nodeType === 1 && s.getAttribute("role") === "row" && (s.columnDefinitions = this.columnDefinitions);
        });
      }), this.queueRowIndexUpdate());
    }, this.queueRowIndexUpdate = () => {
      this.rowindexUpdateQueued || (this.rowindexUpdateQueued = !0, R.queueUpdate(this.updateRowIndexes));
    }, this.updateRowIndexes = () => {
      let e = this.gridTemplateColumns;
      if (e === void 0) {
        if (this.generatedGridTemplateColumns === "" && this.rowElements.length > 0) {
          const t = this.rowElements[0];
          this.generatedGridTemplateColumns = new Array(t.cellElements.length).fill("1fr").join(" ");
        }
        e = this.generatedGridTemplateColumns;
      }
      this.rowElements.forEach((t, o) => {
        const s = t;
        s.rowIndex = o, s.gridTemplateColumns = e, this.columnDefinitionsStale && (s.columnDefinitions = this.columnDefinitions);
      }), this.rowindexUpdateQueued = !1, this.columnDefinitionsStale = !1;
    };
  }
  static generateTemplateColumns(e) {
    let t = "";
    return e.forEach((o) => {
      t = `${t}${t === "" ? "" : " "}1fr`;
    }), t;
  }
  noTabbingChanged() {
    this.$fastController.isConnected && (this.noTabbing ? this.setAttribute("tabIndex", "-1") : this.setAttribute("tabIndex", this.contains(document.activeElement) || this === document.activeElement ? "-1" : "0"));
  }
  generateHeaderChanged() {
    this.$fastController.isConnected && this.toggleGeneratedHeader();
  }
  gridTemplateColumnsChanged() {
    this.$fastController.isConnected && this.updateRowIndexes();
  }
  rowsDataChanged() {
    this.columnDefinitions === null && this.rowsData.length > 0 && (this.columnDefinitions = ye.generateColumns(this.rowsData[0])), this.$fastController.isConnected && this.toggleGeneratedHeader();
  }
  columnDefinitionsChanged() {
    if (this.columnDefinitions === null) {
      this.generatedGridTemplateColumns = "";
      return;
    }
    this.generatedGridTemplateColumns = ye.generateTemplateColumns(this.columnDefinitions), this.$fastController.isConnected && (this.columnDefinitionsStale = !0, this.queueRowIndexUpdate());
  }
  headerCellItemTemplateChanged() {
    this.$fastController.isConnected && this.generatedHeader !== null && (this.generatedHeader.headerCellItemTemplate = this.headerCellItemTemplate);
  }
  focusRowIndexChanged() {
    this.$fastController.isConnected && this.queueFocusUpdate();
  }
  focusColumnIndexChanged() {
    this.$fastController.isConnected && this.queueFocusUpdate();
  }
  connectedCallback() {
    super.connectedCallback(), this.rowItemTemplate === void 0 && (this.rowItemTemplate = this.defaultRowItemTemplate), this.rowsPlaceholder = document.createComment(""), this.appendChild(this.rowsPlaceholder), this.toggleGeneratedHeader(), this.rowsRepeatBehavior = new Zi((e) => e.rowsData, (e) => e.rowItemTemplate, { positioning: !0 }).createBehavior(this.rowsPlaceholder), this.$fastController.addBehaviors([this.rowsRepeatBehavior]), this.addEventListener("row-focused", this.handleRowFocus), this.addEventListener(tr, this.handleFocus), this.addEventListener(Ti, this.handleKeydown), this.addEventListener(Ci, this.handleFocusOut), this.observer = new MutationObserver(this.onChildListChange), this.observer.observe(this, { childList: !0 }), this.noTabbing && this.setAttribute("tabindex", "-1"), R.queueUpdate(this.queueRowIndexUpdate);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("row-focused", this.handleRowFocus), this.removeEventListener(tr, this.handleFocus), this.removeEventListener(Ti, this.handleKeydown), this.removeEventListener(Ci, this.handleFocusOut), this.observer.disconnect(), this.rowsPlaceholder = null, this.generatedHeader = null;
  }
  handleRowFocus(e) {
    this.isUpdatingFocus = !0;
    const t = e.target;
    this.focusRowIndex = this.rowElements.indexOf(t), this.focusColumnIndex = t.focusColumnIndex, this.setAttribute("tabIndex", "-1"), this.isUpdatingFocus = !1;
  }
  handleFocus(e) {
    this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, !0);
  }
  handleFocusOut(e) {
    (e.relatedTarget === null || !this.contains(e.relatedTarget)) && this.setAttribute("tabIndex", this.noTabbing ? "-1" : "0");
  }
  handleKeydown(e) {
    if (e.defaultPrevented)
      return;
    let t;
    const o = this.rowElements.length - 1, s = this.offsetHeight + this.scrollTop, n = this.rowElements[o];
    switch (e.key) {
      case Ue:
        e.preventDefault(), this.focusOnCell(this.focusRowIndex - 1, this.focusColumnIndex, !0);
        break;
      case _e:
        e.preventDefault(), this.focusOnCell(this.focusRowIndex + 1, this.focusColumnIndex, !0);
        break;
      case Pd:
        if (e.preventDefault(), this.rowElements.length === 0) {
          this.focusOnCell(0, 0, !1);
          break;
        }
        if (this.focusRowIndex === 0) {
          this.focusOnCell(0, this.focusColumnIndex, !1);
          return;
        }
        for (t = this.focusRowIndex - 1, t; t >= 0; t--) {
          const r = this.rowElements[t];
          if (r.offsetTop < this.scrollTop) {
            this.scrollTop = r.offsetTop + r.clientHeight - this.clientHeight;
            break;
          }
        }
        this.focusOnCell(t, this.focusColumnIndex, !1);
        break;
      case Ad:
        if (e.preventDefault(), this.rowElements.length === 0) {
          this.focusOnCell(0, 0, !1);
          break;
        }
        if (this.focusRowIndex >= o || n.offsetTop + n.offsetHeight <= s) {
          this.focusOnCell(o, this.focusColumnIndex, !1);
          return;
        }
        for (t = this.focusRowIndex + 1, t; t <= o; t++) {
          const r = this.rowElements[t];
          if (r.offsetTop + r.offsetHeight > s) {
            let l = 0;
            this.generateHeader === Co.sticky && this.generatedHeader !== null && (l = this.generatedHeader.clientHeight), this.scrollTop = r.offsetTop - l;
            break;
          }
        }
        this.focusOnCell(t, this.focusColumnIndex, !1);
        break;
      case ut:
        e.ctrlKey && (e.preventDefault(), this.focusOnCell(0, 0, !0));
        break;
      case pt:
        e.ctrlKey && this.columnDefinitions !== null && (e.preventDefault(), this.focusOnCell(this.rowElements.length - 1, this.columnDefinitions.length - 1, !0));
        break;
    }
  }
  queueFocusUpdate() {
    this.isUpdatingFocus && (this.contains(document.activeElement) || this === document.activeElement) || this.pendingFocusUpdate === !1 && (this.pendingFocusUpdate = !0, R.queueUpdate(() => this.updateFocus()));
  }
  updateFocus() {
    this.pendingFocusUpdate = !1, this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, !0);
  }
  toggleGeneratedHeader() {
    if (this.generatedHeader !== null && (this.removeChild(this.generatedHeader), this.generatedHeader = null), this.generateHeader !== Co.none && this.rowsData.length > 0) {
      const e = document.createElement(this.rowElementTag);
      this.generatedHeader = e, this.generatedHeader.columnDefinitions = this.columnDefinitions, this.generatedHeader.gridTemplateColumns = this.gridTemplateColumns, this.generatedHeader.rowType = this.generateHeader === Co.sticky ? Yi.stickyHeader : Yi.header, (this.firstChild !== null || this.rowsPlaceholder !== null) && this.insertBefore(e, this.firstChild !== null ? this.firstChild : this.rowsPlaceholder);
      return;
    }
  }
}
ye.generateColumns = (i) => Object.getOwnPropertyNames(i).map((e, t) => ({
  columnDataKey: e,
  gridColumn: `${t}`
}));
a([
  h({ attribute: "no-tabbing", mode: "boolean" })
], ye.prototype, "noTabbing", void 0);
a([
  h({ attribute: "generate-header" })
], ye.prototype, "generateHeader", void 0);
a([
  h({ attribute: "grid-template-columns" })
], ye.prototype, "gridTemplateColumns", void 0);
a([
  g
], ye.prototype, "rowsData", void 0);
a([
  g
], ye.prototype, "columnDefinitions", void 0);
a([
  g
], ye.prototype, "rowItemTemplate", void 0);
a([
  g
], ye.prototype, "cellItemTemplate", void 0);
a([
  g
], ye.prototype, "headerCellItemTemplate", void 0);
a([
  g
], ye.prototype, "focusRowIndex", void 0);
a([
  g
], ye.prototype, "focusColumnIndex", void 0);
a([
  g
], ye.prototype, "defaultRowItemTemplate", void 0);
a([
  g
], ye.prototype, "rowElementTag", void 0);
a([
  g
], ye.prototype, "rowElements", void 0);
const Kd = v`
    <template>
        ${(i) => i.rowData === null || i.columnDefinition === null || i.columnDefinition.columnDataKey === null ? null : i.rowData[i.columnDefinition.columnDataKey]}
    </template>
`, eh = v`
    <template>
        ${(i) => i.columnDefinition === null ? null : i.columnDefinition.title === void 0 ? i.columnDefinition.columnDataKey : i.columnDefinition.title}
    </template>
`;
class It extends O {
  constructor() {
    super(...arguments), this.cellType = Ot.default, this.rowData = null, this.columnDefinition = null, this.isActiveCell = !1, this.customCellView = null, this.updateCellStyle = () => {
      this.style.gridColumn = this.gridColumn;
    };
  }
  cellTypeChanged() {
    this.$fastController.isConnected && this.updateCellView();
  }
  gridColumnChanged() {
    this.$fastController.isConnected && this.updateCellStyle();
  }
  columnDefinitionChanged(e, t) {
    this.$fastController.isConnected && this.updateCellView();
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), this.addEventListener(ir, this.handleFocusin), this.addEventListener(Ci, this.handleFocusout), this.addEventListener(Ti, this.handleKeydown), this.style.gridColumn = `${((e = this.columnDefinition) === null || e === void 0 ? void 0 : e.gridColumn) === void 0 ? 0 : this.columnDefinition.gridColumn}`, this.updateCellView(), this.updateCellStyle();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener(ir, this.handleFocusin), this.removeEventListener(Ci, this.handleFocusout), this.removeEventListener(Ti, this.handleKeydown), this.disconnectCellView();
  }
  handleFocusin(e) {
    if (!this.isActiveCell) {
      switch (this.isActiveCell = !0, this.cellType) {
        case Ot.columnHeader:
          if (this.columnDefinition !== null && this.columnDefinition.headerCellInternalFocusQueue !== !0 && typeof this.columnDefinition.headerCellFocusTargetCallback == "function") {
            const t = this.columnDefinition.headerCellFocusTargetCallback(this);
            t !== null && t.focus();
          }
          break;
        default:
          if (this.columnDefinition !== null && this.columnDefinition.cellInternalFocusQueue !== !0 && typeof this.columnDefinition.cellFocusTargetCallback == "function") {
            const t = this.columnDefinition.cellFocusTargetCallback(this);
            t !== null && t.focus();
          }
          break;
      }
      this.$emit("cell-focused", this);
    }
  }
  handleFocusout(e) {
    this !== document.activeElement && !this.contains(document.activeElement) && (this.isActiveCell = !1);
  }
  handleKeydown(e) {
    if (!(e.defaultPrevented || this.columnDefinition === null || this.cellType === Ot.default && this.columnDefinition.cellInternalFocusQueue !== !0 || this.cellType === Ot.columnHeader && this.columnDefinition.headerCellInternalFocusQueue !== !0))
      switch (e.key) {
        case st:
        case Ld:
          if (this.contains(document.activeElement) && document.activeElement !== this)
            return;
          switch (this.cellType) {
            case Ot.columnHeader:
              if (this.columnDefinition.headerCellFocusTargetCallback !== void 0) {
                const t = this.columnDefinition.headerCellFocusTargetCallback(this);
                t !== null && t.focus(), e.preventDefault();
              }
              break;
            default:
              if (this.columnDefinition.cellFocusTargetCallback !== void 0) {
                const t = this.columnDefinition.cellFocusTargetCallback(this);
                t !== null && t.focus(), e.preventDefault();
              }
              break;
          }
          break;
        case Kt:
          this.contains(document.activeElement) && document.activeElement !== this && (this.focus(), e.preventDefault());
          break;
      }
  }
  updateCellView() {
    if (this.disconnectCellView(), this.columnDefinition !== null)
      switch (this.cellType) {
        case Ot.columnHeader:
          this.columnDefinition.headerCellTemplate !== void 0 ? this.customCellView = this.columnDefinition.headerCellTemplate.render(this, this) : this.customCellView = eh.render(this, this);
          break;
        case void 0:
        case Ot.rowHeader:
        case Ot.default:
          this.columnDefinition.cellTemplate !== void 0 ? this.customCellView = this.columnDefinition.cellTemplate.render(this, this) : this.customCellView = Kd.render(this, this);
          break;
      }
  }
  disconnectCellView() {
    this.customCellView !== null && (this.customCellView.dispose(), this.customCellView = null);
  }
}
a([
  h({ attribute: "cell-type" })
], It.prototype, "cellType", void 0);
a([
  h({ attribute: "grid-column" })
], It.prototype, "gridColumn", void 0);
a([
  g
], It.prototype, "rowData", void 0);
a([
  g
], It.prototype, "columnDefinition", void 0);
function th(i) {
  const e = i.tagFor(It);
  return v`
    <${e}
        cell-type="${(t) => t.isRowHeader ? "rowheader" : void 0}"
        grid-column="${(t, o) => o.index + 1}"
        :rowData="${(t, o) => o.parent.rowData}"
        :columnDefinition="${(t) => t}"
    ></${e}>
`;
}
function ih(i) {
  const e = i.tagFor(It);
  return v`
    <${e}
        cell-type="columnheader"
        grid-column="${(t, o) => o.index + 1}"
        :columnDefinition="${(t) => t}"
    ></${e}>
`;
}
const oh = (i, e) => {
  const t = th(i), o = ih(i);
  return v`
        <template
            role="row"
            class="${(s) => s.rowType !== "default" ? s.rowType : ""}"
            :defaultCellItemTemplate="${t}"
            :defaultHeaderCellItemTemplate="${o}"
            ${Uo({
    property: "cellElements",
    filter: wt('[role="cell"],[role="gridcell"],[role="columnheader"],[role="rowheader"]')
  })}
        >
            <slot ${ee("slottedCellElements")}></slot>
        </template>
    `;
}, sh = (i, e) => v`
        <template
            tabindex="-1"
            role="${(t) => !t.cellType || t.cellType === "default" ? "gridcell" : t.cellType}"
            class="
            ${(t) => t.cellType === "columnheader" ? "column-header" : t.cellType === "rowheader" ? "row-header" : ""}
            "
        >
            <slot></slot>
        </template>
    `, nh = v`
    <div
        class="title"
        part="title"
        aria-label="${(i) => i.dateFormatter.getDate(`${i.month}-2-${i.year}`, {
  month: "long",
  year: "numeric"
})}"
    >
        <span part="month">
            ${(i) => i.dateFormatter.getMonth(i.month)}
        </span>
        <span part="year">${(i) => i.dateFormatter.getYear(i.year)}</span>
    </div>
`, rh = (i) => {
  const e = i.tagFor(It);
  return v`
        <${e}
            class="week-day"
            part="week-day"
            tabindex="-1"
            grid-column="${(t, o) => o.index + 1}"
            abbr="${(t) => t.abbr}"
        >
            ${(t) => t.text}
        </${e}>
    `;
}, ah = (i, e) => {
  const t = i.tagFor(It);
  return v`
        <${t}
            class="${(o, s) => s.parentContext.parent.getDayClassNames(o, e)}"
            part="day"
            tabindex="-1"
            role="gridcell"
            grid-column="${(o, s) => s.index + 1}"
            @click="${(o, s) => s.parentContext.parent.handleDateSelect(s.event, o)}"
            @keydown="${(o, s) => s.parentContext.parent.handleKeydown(s.event, o)}"
            aria-label="${(o, s) => s.parentContext.parent.dateFormatter.getDate(`${o.month}-${o.day}-${o.year}`, { month: "long", day: "numeric" })}"
        >
            <div
                class="date"
                part="${(o) => e === `${o.month}-${o.day}-${o.year}` ? "today" : "date"}"
            >
                ${(o, s) => s.parentContext.parent.dateFormatter.getDay(o.day)}
            </div>
            <slot name="${(o) => o.month}-${(o) => o.day}-${(o) => o.year}"></slot>
        </${t}>
    `;
}, lh = (i, e) => {
  const t = i.tagFor(Ce);
  return v`
        <${t}
            class="week"
            part="week"
            role="row"
            role-type="default"
            grid-template-columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
        >
        ${yi((o) => o, ah(i, e), {
    positioning: !0
  })}
        </${t}>
    `;
}, ch = (i, e) => {
  const t = i.tagFor(ye), o = i.tagFor(Ce);
  return v`
    <${t} class="days interact" part="days" generate-header="none">
        <${o}
            class="week-days"
            part="week-days"
            role="row"
            row-type="header"
            grid-template-columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
        >
            ${yi((s) => s.getWeekdayText(), rh(i), {
    positioning: !0
  })}
        </${o}>
        ${yi((s) => s.getDays(), lh(i, e))}
    </${t}>
`;
}, dh = (i) => v`
        <div class="days" part="days">
            <div class="week-days" part="week-days">
                ${yi((e) => e.getWeekdayText(), v`
                        <div class="week-day" part="week-day" abbr="${(e) => e.abbr}">
                            ${(e) => e.text}
                        </div>
                    `)}
            </div>
            ${yi((e) => e.getDays(), v`
                    <div class="week">
                        ${yi((e) => e, v`
                                <div
                                    class="${(e, t) => t.parentContext.parent.getDayClassNames(e, i)}"
                                    part="day"
                                    aria-label="${(e, t) => t.parentContext.parent.dateFormatter.getDate(`${e.month}-${e.day}-${e.year}`, { month: "long", day: "numeric" })}"
                                >
                                    <div
                                        class="date"
                                        part="${(e) => i === `${e.month}-${e.day}-${e.year}` ? "today" : "date"}"
                                    >
                                        ${(e, t) => t.parentContext.parent.dateFormatter.getDay(e.day)}
                                    </div>
                                    <slot
                                        name="${(e) => e.month}-${(e) => e.day}-${(e) => e.year}"
                                    ></slot>
                                </div>
                            `)}
                    </div>
                `)}
        </div>
    `, hh = (i, e) => {
  var t;
  const o = new Date(), s = `${o.getMonth() + 1}-${o.getDate()}-${o.getFullYear()}`;
  return v`
        <template>
            ${ud}
            ${e.title instanceof Function ? e.title(i, e) : (t = e.title) !== null && t !== void 0 ? t : ""}
            <slot></slot>
            ${Q((n) => n.readonly === !1, ch(i, s))}
            ${Q((n) => n.readonly === !0, dh(s))}
            ${hd}
        </template>
    `;
}, uh = (i, e) => v`
    <slot></slot>
`;
let La = class extends O {
};
const ph = (i, e) => v`
    <template
        role="checkbox"
        aria-checked="${(t) => t.checked}"
        aria-required="${(t) => t.required}"
        aria-disabled="${(t) => t.disabled}"
        aria-readonly="${(t) => t.readOnly}"
        tabindex="${(t) => t.disabled ? null : 0}"
        @keypress="${(t, o) => t.keypressHandler(o.event)}"
        @click="${(t, o) => t.clickHandler(o.event)}"
        class="${(t) => t.readOnly ? "readonly" : ""} ${(t) => t.checked ? "checked" : ""} ${(t) => t.indeterminate ? "indeterminate" : ""}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                ${e.checkedIndicator || ""}
            </slot>
            <slot name="indeterminate-indicator">
                ${e.indeterminateIndicator || ""}
            </slot>
        </div>
        <label
            part="label"
            class="${(t) => t.defaultSlottedNodes && t.defaultSlottedNodes.length ? "label" : "label label__hidden"}"
        >
            <slot ${ee("defaultSlottedNodes")}></slot>
        </label>
    </template>
`;
class fh extends O {
}
class gh extends bn(fh) {
  constructor() {
    super(...arguments), this.proxy = document.createElement("input");
  }
}
class Yo extends gh {
  constructor() {
    super(), this.initialValue = "on", this.indeterminate = !1, this.keypressHandler = (e) => {
      if (!this.readOnly)
        switch (e.key) {
          case ei:
            this.indeterminate && (this.indeterminate = !1), this.checked = !this.checked;
            break;
        }
    }, this.clickHandler = (e) => {
      !this.disabled && !this.readOnly && (this.indeterminate && (this.indeterminate = !1), this.checked = !this.checked);
    }, this.proxy.setAttribute("type", "checkbox");
  }
  readOnlyChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.readOnly = this.readOnly);
  }
}
a([
  h({ attribute: "readonly", mode: "boolean" })
], Yo.prototype, "readOnly", void 0);
a([
  g
], Yo.prototype, "defaultSlottedNodes", void 0);
a([
  g
], Yo.prototype, "indeterminate", void 0);
function Aa(i) {
  return ki(i) && (i.getAttribute("role") === "option" || i instanceof HTMLOptionElement);
}
class nt extends O {
  constructor(e, t, o, s) {
    super(), this.defaultSelected = !1, this.dirtySelected = !1, this.selected = this.defaultSelected, this.dirtyValue = !1, e && (this.textContent = e), t && (this.initialValue = t), o && (this.defaultSelected = o), s && (this.selected = s), this.proxy = new Option(`${this.textContent}`, this.initialValue, this.defaultSelected, this.selected), this.proxy.disabled = this.disabled;
  }
  checkedChanged(e, t) {
    if (typeof t == "boolean") {
      this.ariaChecked = t ? "true" : "false";
      return;
    }
    this.ariaChecked = null;
  }
  contentChanged(e, t) {
    this.proxy instanceof HTMLOptionElement && (this.proxy.textContent = this.textContent), this.$emit("contentchange", null, { bubbles: !0 });
  }
  defaultSelectedChanged() {
    this.dirtySelected || (this.selected = this.defaultSelected, this.proxy instanceof HTMLOptionElement && (this.proxy.selected = this.defaultSelected));
  }
  disabledChanged(e, t) {
    this.ariaDisabled = this.disabled ? "true" : "false", this.proxy instanceof HTMLOptionElement && (this.proxy.disabled = this.disabled);
  }
  selectedAttributeChanged() {
    this.defaultSelected = this.selectedAttribute, this.proxy instanceof HTMLOptionElement && (this.proxy.defaultSelected = this.defaultSelected);
  }
  selectedChanged() {
    this.ariaSelected = this.selected ? "true" : "false", this.dirtySelected || (this.dirtySelected = !0), this.proxy instanceof HTMLOptionElement && (this.proxy.selected = this.selected);
  }
  initialValueChanged(e, t) {
    this.dirtyValue || (this.value = this.initialValue, this.dirtyValue = !1);
  }
  get label() {
    var e;
    return (e = this.value) !== null && e !== void 0 ? e : this.text;
  }
  get text() {
    var e, t;
    return (t = (e = this.textContent) === null || e === void 0 ? void 0 : e.replace(/\s+/g, " ").trim()) !== null && t !== void 0 ? t : "";
  }
  set value(e) {
    const t = `${e ?? ""}`;
    this._value = t, this.dirtyValue = !0, this.proxy instanceof HTMLOptionElement && (this.proxy.value = t), A.notify(this, "value");
  }
  get value() {
    var e;
    return A.track(this, "value"), (e = this._value) !== null && e !== void 0 ? e : this.text;
  }
  get form() {
    return this.proxy ? this.proxy.form : null;
  }
}
a([
  g
], nt.prototype, "checked", void 0);
a([
  g
], nt.prototype, "content", void 0);
a([
  g
], nt.prototype, "defaultSelected", void 0);
a([
  h({ mode: "boolean" })
], nt.prototype, "disabled", void 0);
a([
  h({ attribute: "selected", mode: "boolean" })
], nt.prototype, "selectedAttribute", void 0);
a([
  g
], nt.prototype, "selected", void 0);
a([
  h({ attribute: "value", mode: "fromView" })
], nt.prototype, "initialValue", void 0);
class Di {
}
a([
  g
], Di.prototype, "ariaChecked", void 0);
a([
  g
], Di.prototype, "ariaPosInSet", void 0);
a([
  g
], Di.prototype, "ariaSelected", void 0);
a([
  g
], Di.prototype, "ariaSetSize", void 0);
ae(Di, se);
ae(nt, He, Di);
let Se = class extends O {
  constructor() {
    super(...arguments), this._options = [], this.selectedIndex = -1, this.selectedOptions = [], this.shouldSkipFocus = !1, this.typeaheadBuffer = "", this.typeaheadExpired = !0, this.typeaheadTimeout = -1;
  }
  get firstSelectedOption() {
    var e;
    return (e = this.selectedOptions[0]) !== null && e !== void 0 ? e : null;
  }
  get hasSelectableOptions() {
    return this.options.length > 0 && !this.options.every((e) => e.disabled);
  }
  get length() {
    var e, t;
    return (t = (e = this.options) === null || e === void 0 ? void 0 : e.length) !== null && t !== void 0 ? t : 0;
  }
  get options() {
    return A.track(this, "options"), this._options;
  }
  set options(e) {
    this._options = e, A.notify(this, "options");
  }
  get typeAheadExpired() {
    return this.typeaheadExpired;
  }
  set typeAheadExpired(e) {
    this.typeaheadExpired = e;
  }
  clickHandler(e) {
    const t = e.target.closest("option,[role=option]");
    if (t && !t.disabled)
      return this.selectedIndex = this.options.indexOf(t), !0;
  }
  focusAndScrollOptionIntoView(e = this.firstSelectedOption) {
    this.contains(document.activeElement) && e !== null && (e.focus(), requestAnimationFrame(() => {
      e.scrollIntoView({ block: "nearest" });
    }));
  }
  focusinHandler(e) {
    !this.shouldSkipFocus && e.target === e.currentTarget && (this.setSelectedOptions(), this.focusAndScrollOptionIntoView()), this.shouldSkipFocus = !1;
  }
  getTypeaheadMatches() {
    const e = this.typeaheadBuffer.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"), t = new RegExp(`^${e}`, "gi");
    return this.options.filter((o) => o.text.trim().match(t));
  }
  getSelectableIndex(e = this.selectedIndex, t) {
    const o = e > t ? -1 : e < t ? 1 : 0, s = e + o;
    let n = null;
    switch (o) {
      case -1: {
        n = this.options.reduceRight((r, l, c) => !r && !l.disabled && c < s ? l : r, n);
        break;
      }
      case 1: {
        n = this.options.reduce((r, l, c) => !r && !l.disabled && c > s ? l : r, n);
        break;
      }
    }
    return this.options.indexOf(n);
  }
  handleChange(e, t) {
    switch (t) {
      case "selected": {
        Se.slottedOptionFilter(e) && (this.selectedIndex = this.options.indexOf(e)), this.setSelectedOptions();
        break;
      }
    }
  }
  handleTypeAhead(e) {
    this.typeaheadTimeout && window.clearTimeout(this.typeaheadTimeout), this.typeaheadTimeout = window.setTimeout(() => this.typeaheadExpired = !0, Se.TYPE_AHEAD_TIMEOUT_MS), !(e.length > 1) && (this.typeaheadBuffer = `${this.typeaheadExpired ? "" : this.typeaheadBuffer}${e}`);
  }
  keydownHandler(e) {
    if (this.disabled)
      return !0;
    this.shouldSkipFocus = !1;
    const t = e.key;
    switch (t) {
      case ut: {
        e.shiftKey || (e.preventDefault(), this.selectFirstOption());
        break;
      }
      case _e: {
        e.shiftKey || (e.preventDefault(), this.selectNextOption());
        break;
      }
      case Ue: {
        e.shiftKey || (e.preventDefault(), this.selectPreviousOption());
        break;
      }
      case pt: {
        e.preventDefault(), this.selectLastOption();
        break;
      }
      case qo:
        return this.focusAndScrollOptionIntoView(), !0;
      case st:
      case Kt:
        return !0;
      case ei:
        if (this.typeaheadExpired)
          return !0;
      default:
        return t.length === 1 && this.handleTypeAhead(`${t}`), !0;
    }
  }
  mousedownHandler(e) {
    return this.shouldSkipFocus = !this.contains(document.activeElement), !0;
  }
  multipleChanged(e, t) {
    this.ariaMultiSelectable = t ? "true" : null;
  }
  selectedIndexChanged(e, t) {
    var o;
    if (!this.hasSelectableOptions) {
      this.selectedIndex = -1;
      return;
    }
    if (!((o = this.options[this.selectedIndex]) === null || o === void 0) && o.disabled && typeof e == "number") {
      const s = this.getSelectableIndex(e, t), n = s > -1 ? s : e;
      this.selectedIndex = n, t === n && this.selectedIndexChanged(t, n);
      return;
    }
    this.setSelectedOptions();
  }
  selectedOptionsChanged(e, t) {
    var o;
    const s = t.filter(Se.slottedOptionFilter);
    (o = this.options) === null || o === void 0 || o.forEach((n) => {
      const r = A.getNotifier(n);
      r.unsubscribe(this, "selected"), n.selected = s.includes(n), r.subscribe(this, "selected");
    });
  }
  selectFirstOption() {
    var e, t;
    this.disabled || (this.selectedIndex = (t = (e = this.options) === null || e === void 0 ? void 0 : e.findIndex((o) => !o.disabled)) !== null && t !== void 0 ? t : -1);
  }
  selectLastOption() {
    this.disabled || (this.selectedIndex = Fd(this.options, (e) => !e.disabled));
  }
  selectNextOption() {
    !this.disabled && this.selectedIndex < this.options.length - 1 && (this.selectedIndex += 1);
  }
  selectPreviousOption() {
    !this.disabled && this.selectedIndex > 0 && (this.selectedIndex = this.selectedIndex - 1);
  }
  setDefaultSelectedOption() {
    var e, t;
    this.selectedIndex = (t = (e = this.options) === null || e === void 0 ? void 0 : e.findIndex((o) => o.defaultSelected)) !== null && t !== void 0 ? t : -1;
  }
  setSelectedOptions() {
    var e, t, o;
    !((e = this.options) === null || e === void 0) && e.length && (this.selectedOptions = [this.options[this.selectedIndex]], this.ariaActiveDescendant = (o = (t = this.firstSelectedOption) === null || t === void 0 ? void 0 : t.id) !== null && o !== void 0 ? o : "", this.focusAndScrollOptionIntoView());
  }
  slottedOptionsChanged(e, t) {
    this.options = t.reduce((s, n) => (Aa(n) && s.push(n), s), []);
    const o = `${this.options.length}`;
    this.options.forEach((s, n) => {
      s.id || (s.id = Xt("option-")), s.ariaPosInSet = `${n + 1}`, s.ariaSetSize = o;
    }), this.$fastController.isConnected && (this.setSelectedOptions(), this.setDefaultSelectedOption());
  }
  typeaheadBufferChanged(e, t) {
    if (this.$fastController.isConnected) {
      const o = this.getTypeaheadMatches();
      if (o.length) {
        const s = this.options.indexOf(o[0]);
        s > -1 && (this.selectedIndex = s);
      }
      this.typeaheadExpired = !1;
    }
  }
};
Se.slottedOptionFilter = (i) => Aa(i) && !i.hidden;
Se.TYPE_AHEAD_TIMEOUT_MS = 1e3;
a([
  h({ mode: "boolean" })
], Se.prototype, "disabled", void 0);
a([
  g
], Se.prototype, "selectedIndex", void 0);
a([
  g
], Se.prototype, "selectedOptions", void 0);
a([
  g
], Se.prototype, "slottedOptions", void 0);
a([
  g
], Se.prototype, "typeaheadBuffer", void 0);
class Vt {
}
a([
  g
], Vt.prototype, "ariaActiveDescendant", void 0);
a([
  g
], Vt.prototype, "ariaDisabled", void 0);
a([
  g
], Vt.prototype, "ariaExpanded", void 0);
a([
  g
], Vt.prototype, "ariaMultiSelectable", void 0);
ae(Vt, se);
ae(Se, Vt);
const xi = {
  above: "above",
  below: "below"
};
class mh extends Se {
}
class bh extends ft(mh) {
  constructor() {
    super(...arguments), this.proxy = document.createElement("input");
  }
}
const To = {
  inline: "inline",
  list: "list",
  both: "both",
  none: "none"
};
let St = class extends bh {
  constructor() {
    super(...arguments), this._value = "", this.filteredOptions = [], this.filter = "", this.forcedPosition = !1, this.listboxId = Xt("listbox-"), this.maxHeight = 0, this.open = !1;
  }
  formResetCallback() {
    super.formResetCallback(), this.setDefaultSelectedOption(), this.updateValue();
  }
  validate() {
    super.validate(this.control);
  }
  get isAutocompleteInline() {
    return this.autocomplete === To.inline || this.isAutocompleteBoth;
  }
  get isAutocompleteList() {
    return this.autocomplete === To.list || this.isAutocompleteBoth;
  }
  get isAutocompleteBoth() {
    return this.autocomplete === To.both;
  }
  openChanged() {
    if (this.open) {
      this.ariaControls = this.listboxId, this.ariaExpanded = "true", this.setPositioning(), this.focusAndScrollOptionIntoView(), R.queueUpdate(() => this.focus());
      return;
    }
    this.ariaControls = "", this.ariaExpanded = "false";
  }
  get options() {
    return A.track(this, "options"), this.filteredOptions.length ? this.filteredOptions : this._options;
  }
  set options(e) {
    this._options = e, A.notify(this, "options");
  }
  placeholderChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.placeholder = this.placeholder);
  }
  positionChanged(e, t) {
    this.positionAttribute = t, this.setPositioning();
  }
  get value() {
    return A.track(this, "value"), this._value;
  }
  set value(e) {
    var t, o, s;
    const n = `${this._value}`;
    if (this.$fastController.isConnected && this.options) {
      const r = this.options.findIndex((u) => u.text.toLowerCase() === e.toLowerCase()), l = (t = this.options[this.selectedIndex]) === null || t === void 0 ? void 0 : t.text, c = (o = this.options[r]) === null || o === void 0 ? void 0 : o.text;
      this.selectedIndex = l !== c ? r : this.selectedIndex, e = ((s = this.firstSelectedOption) === null || s === void 0 ? void 0 : s.text) || e;
    }
    n !== e && (this._value = e, super.valueChanged(n, e), A.notify(this, "value"));
  }
  clickHandler(e) {
    if (!this.disabled) {
      if (this.open) {
        const t = e.target.closest("option,[role=option]");
        if (!t || t.disabled)
          return;
        this.selectedOptions = [t], this.control.value = t.text, this.clearSelectionRange(), this.updateValue(!0);
      }
      return this.open = !this.open, this.open && this.control.focus(), !0;
    }
  }
  connectedCallback() {
    super.connectedCallback(), this.forcedPosition = !!this.positionAttribute, this.value && (this.initialValue = this.value);
  }
  disabledChanged(e, t) {
    super.disabledChanged && super.disabledChanged(e, t), this.ariaDisabled = this.disabled ? "true" : "false";
  }
  filterOptions() {
    (!this.autocomplete || this.autocomplete === To.none) && (this.filter = "");
    const e = this.filter.toLowerCase();
    this.filteredOptions = this._options.filter((t) => t.text.toLowerCase().startsWith(this.filter.toLowerCase())), this.isAutocompleteList && (!this.filteredOptions.length && !e && (this.filteredOptions = this._options), this._options.forEach((t) => {
      t.hidden = !this.filteredOptions.includes(t);
    }));
  }
  focusAndScrollOptionIntoView() {
    this.contains(document.activeElement) && (this.control.focus(), this.firstSelectedOption && requestAnimationFrame(() => {
      var e;
      (e = this.firstSelectedOption) === null || e === void 0 || e.scrollIntoView({ block: "nearest" });
    }));
  }
  focusoutHandler(e) {
    if (this.syncValue(), !this.open)
      return !0;
    const t = e.relatedTarget;
    if (this.isSameNode(t)) {
      this.focus();
      return;
    }
    (!this.options || !this.options.includes(t)) && (this.open = !1);
  }
  inputHandler(e) {
    if (this.filter = this.control.value, this.filterOptions(), this.isAutocompleteInline || (this.selectedIndex = this.options.map((t) => t.text).indexOf(this.control.value)), e.inputType.includes("deleteContent") || !this.filter.length)
      return !0;
    this.isAutocompleteList && !this.open && (this.open = !0), this.isAutocompleteInline && (this.filteredOptions.length ? (this.selectedOptions = [this.filteredOptions[0]], this.selectedIndex = this.options.indexOf(this.firstSelectedOption), this.setInlineSelection()) : this.selectedIndex = -1);
  }
  keydownHandler(e) {
    const t = e.key;
    if (e.ctrlKey || e.shiftKey)
      return !0;
    switch (t) {
      case "Enter": {
        this.syncValue(), this.isAutocompleteInline && (this.filter = this.value), this.open = !1, this.clearSelectionRange();
        break;
      }
      case "Escape": {
        if (this.isAutocompleteInline || (this.selectedIndex = -1), this.open) {
          this.open = !1;
          break;
        }
        this.value = "", this.control.value = "", this.filter = "", this.filterOptions();
        break;
      }
      case "Tab": {
        if (this.setInputToSelection(), !this.open)
          return !0;
        e.preventDefault(), this.open = !1;
        break;
      }
      case "ArrowUp":
      case "ArrowDown": {
        if (this.filterOptions(), !this.open) {
          this.open = !0;
          break;
        }
        this.filteredOptions.length > 0 && super.keydownHandler(e), this.isAutocompleteInline && this.setInlineSelection();
        break;
      }
      default:
        return !0;
    }
  }
  keyupHandler(e) {
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowRight":
      case "Backspace":
      case "Delete":
      case "Home":
      case "End": {
        this.filter = this.control.value, this.selectedIndex = -1, this.filterOptions();
        break;
      }
    }
  }
  selectedIndexChanged(e, t) {
    if (this.$fastController.isConnected) {
      if (t = fn(-1, this.options.length - 1, t), t !== this.selectedIndex) {
        this.selectedIndex = t;
        return;
      }
      super.selectedIndexChanged(e, t);
    }
  }
  selectPreviousOption() {
    !this.disabled && this.selectedIndex >= 0 && (this.selectedIndex = this.selectedIndex - 1);
  }
  setDefaultSelectedOption() {
    if (this.$fastController.isConnected && this.options) {
      const e = this.options.findIndex((t) => t.getAttribute("selected") !== null || t.selected);
      this.selectedIndex = e, !this.dirtyValue && this.firstSelectedOption && (this.value = this.firstSelectedOption.text), this.setSelectedOptions();
    }
  }
  setInputToSelection() {
    this.firstSelectedOption && (this.control.value = this.firstSelectedOption.text, this.control.focus());
  }
  setInlineSelection() {
    this.firstSelectedOption && (this.setInputToSelection(), this.control.setSelectionRange(this.filter.length, this.control.value.length, "backward"));
  }
  syncValue() {
    var e;
    const t = this.selectedIndex > -1 ? (e = this.firstSelectedOption) === null || e === void 0 ? void 0 : e.text : this.control.value;
    this.updateValue(this.value !== t);
  }
  setPositioning() {
    const e = this.getBoundingClientRect(), o = window.innerHeight - e.bottom;
    this.position = this.forcedPosition ? this.positionAttribute : e.top > o ? xi.above : xi.below, this.positionAttribute = this.forcedPosition ? this.positionAttribute : this.position, this.maxHeight = this.position === xi.above ? ~~e.top : ~~o;
  }
  selectedOptionsChanged(e, t) {
    this.$fastController.isConnected && this._options.forEach((o) => {
      o.selected = t.includes(o);
    });
  }
  slottedOptionsChanged(e, t) {
    super.slottedOptionsChanged(e, t), this.updateValue();
  }
  updateValue(e) {
    var t;
    this.$fastController.isConnected && (this.value = ((t = this.firstSelectedOption) === null || t === void 0 ? void 0 : t.text) || this.control.value, this.control.value = this.value), e && this.$emit("change");
  }
  clearSelectionRange() {
    const e = this.control.value.length;
    this.control.setSelectionRange(e, e);
  }
};
a([
  h({ attribute: "autocomplete", mode: "fromView" })
], St.prototype, "autocomplete", void 0);
a([
  g
], St.prototype, "maxHeight", void 0);
a([
  h({ attribute: "open", mode: "boolean" })
], St.prototype, "open", void 0);
a([
  h
], St.prototype, "placeholder", void 0);
a([
  h({ attribute: "position" })
], St.prototype, "positionAttribute", void 0);
a([
  g
], St.prototype, "position", void 0);
class Xo {
}
a([
  g
], Xo.prototype, "ariaAutoComplete", void 0);
a([
  g
], Xo.prototype, "ariaControls", void 0);
ae(Xo, Vt);
ae(St, He, Xo);
const vh = (i, e) => v`
    <template
        aria-disabled="${(t) => t.ariaDisabled}"
        autocomplete="${(t) => t.autocomplete}"
        class="${(t) => t.open ? "open" : ""} ${(t) => t.disabled ? "disabled" : ""} ${(t) => t.position}"
        ?open="${(t) => t.open}"
        tabindex="${(t) => t.disabled ? null : "0"}"
        @click="${(t, o) => t.clickHandler(o.event)}"
        @focusout="${(t, o) => t.focusoutHandler(o.event)}"
        @keydown="${(t, o) => t.keydownHandler(o.event)}"
    >
        <div class="control" part="control">
            ${Ae(i, e)}
            <slot name="control">
                <input
                    aria-activedescendant="${(t) => t.open ? t.ariaActiveDescendant : null}"
                    aria-autocomplete="${(t) => t.ariaAutoComplete}"
                    aria-controls="${(t) => t.ariaControls}"
                    aria-disabled="${(t) => t.ariaDisabled}"
                    aria-expanded="${(t) => t.ariaExpanded}"
                    aria-haspopup="listbox"
                    class="selected-value"
                    part="selected-value"
                    placeholder="${(t) => t.placeholder}"
                    role="combobox"
                    type="text"
                    ?disabled="${(t) => t.disabled}"
                    :value="${(t) => t.value}"
                    @input="${(t, o) => t.inputHandler(o.event)}"
                    @keyup="${(t, o) => t.keyupHandler(o.event)}"
                    ${U("control")}
                />
                <div class="indicator" part="indicator" aria-hidden="true">
                    <slot name="indicator">
                        ${e.indicator || ""}
                    </slot>
                </div>
            </slot>
            ${Le(i, e)}
        </div>
        <div
            class="listbox"
            id="${(t) => t.listboxId}"
            part="listbox"
            role="listbox"
            ?disabled="${(t) => t.disabled}"
            ?hidden="${(t) => !t.open}"
            ${U("listbox")}
        >
            <slot
                ${ee({
  filter: Se.slottedOptionFilter,
  flatten: !0,
  property: "slottedOptions"
})}
            ></slot>
        </div>
    </template>
`;
function eo(i) {
  const e = i.parentElement;
  if (e)
    return e;
  {
    const t = i.getRootNode();
    if (t.host instanceof HTMLElement)
      return t.host;
  }
  return null;
}
function yh(i, e) {
  let t = e;
  for (; t !== null; ) {
    if (t === i)
      return !0;
    t = eo(t);
  }
  return !1;
}
const yt = document.createElement("div");
function xh(i) {
  return i instanceof po;
}
class vn {
  setProperty(e, t) {
    R.queueUpdate(() => this.target.setProperty(e, t));
  }
  removeProperty(e) {
    R.queueUpdate(() => this.target.removeProperty(e));
  }
}
class $h extends vn {
  constructor(e) {
    super();
    const t = new CSSStyleSheet();
    this.target = t.cssRules[t.insertRule(":host{}")].style, e.$fastController.addStyles(Oe.create([t]));
  }
}
class wh extends vn {
  constructor() {
    super();
    const e = new CSSStyleSheet();
    this.target = e.cssRules[e.insertRule(":root{}")].style, document.adoptedStyleSheets = [
      ...document.adoptedStyleSheets,
      e
    ];
  }
}
class kh extends vn {
  constructor() {
    super(), this.style = document.createElement("style"), document.head.appendChild(this.style);
    const { sheet: e } = this.style;
    if (e) {
      const t = e.insertRule(":root{}", e.cssRules.length);
      this.target = e.cssRules[t].style;
    }
  }
}
class Pa {
  constructor(e) {
    this.store = /* @__PURE__ */ new Map(), this.target = null;
    const t = e.$fastController;
    this.style = document.createElement("style"), t.addStyles(this.style), A.getNotifier(t).subscribe(this, "isConnected"), this.handleChange(t, "isConnected");
  }
  targetChanged() {
    if (this.target !== null)
      for (const [e, t] of this.store.entries())
        this.target.setProperty(e, t);
  }
  setProperty(e, t) {
    this.store.set(e, t), R.queueUpdate(() => {
      this.target !== null && this.target.setProperty(e, t);
    });
  }
  removeProperty(e) {
    this.store.delete(e), R.queueUpdate(() => {
      this.target !== null && this.target.removeProperty(e);
    });
  }
  handleChange(e, t) {
    const { sheet: o } = this.style;
    if (o) {
      const s = o.insertRule(":host{}", o.cssRules.length);
      this.target = o.cssRules[s].style;
    } else
      this.target = null;
  }
}
a([
  g
], Pa.prototype, "target", void 0);
class Ch {
  constructor(e) {
    this.target = e.style;
  }
  setProperty(e, t) {
    R.queueUpdate(() => this.target.setProperty(e, t));
  }
  removeProperty(e) {
    R.queueUpdate(() => this.target.removeProperty(e));
  }
}
class xe {
  setProperty(e, t) {
    xe.properties[e] = t;
    for (const o of xe.roots.values())
      vi.getOrCreate(xe.normalizeRoot(o)).setProperty(e, t);
  }
  removeProperty(e) {
    delete xe.properties[e];
    for (const t of xe.roots.values())
      vi.getOrCreate(xe.normalizeRoot(t)).removeProperty(e);
  }
  static registerRoot(e) {
    const { roots: t } = xe;
    if (!t.has(e)) {
      t.add(e);
      const o = vi.getOrCreate(this.normalizeRoot(e));
      for (const s in xe.properties)
        o.setProperty(s, xe.properties[s]);
    }
  }
  static unregisterRoot(e) {
    const { roots: t } = xe;
    if (t.has(e)) {
      t.delete(e);
      const o = vi.getOrCreate(xe.normalizeRoot(e));
      for (const s in xe.properties)
        o.removeProperty(s);
    }
  }
  static normalizeRoot(e) {
    return e === yt ? document : e;
  }
}
xe.roots = /* @__PURE__ */ new Set();
xe.properties = {};
const Fs = /* @__PURE__ */ new WeakMap(), Th = R.supportsAdoptedStyleSheets ? $h : Pa, vi = Object.freeze({
  getOrCreate(i) {
    if (Fs.has(i))
      return Fs.get(i);
    let e;
    return i === yt ? e = new xe() : i instanceof Document ? e = R.supportsAdoptedStyleSheets ? new wh() : new kh() : xh(i) ? e = new Th(i) : e = new Ch(i), Fs.set(i, e), e;
  }
});
class Re extends pn {
  constructor(e) {
    super(), this.subscribers = /* @__PURE__ */ new WeakMap(), this._appliedTo = /* @__PURE__ */ new Set(), this.name = e.name, e.cssCustomPropertyName !== null && (this.cssCustomProperty = `--${e.cssCustomPropertyName}`, this.cssVar = `var(${this.cssCustomProperty})`), this.id = Re.uniqueId(), Re.tokensById.set(this.id, this);
  }
  get appliedTo() {
    return [...this._appliedTo];
  }
  static from(e) {
    return new Re({
      name: typeof e == "string" ? e : e.name,
      cssCustomPropertyName: typeof e == "string" ? e : e.cssCustomPropertyName === void 0 ? e.name : e.cssCustomPropertyName
    });
  }
  static isCSSDesignToken(e) {
    return typeof e.cssCustomProperty == "string";
  }
  static isDerivedDesignTokenValue(e) {
    return typeof e == "function";
  }
  static getTokenById(e) {
    return Re.tokensById.get(e);
  }
  getOrCreateSubscriberSet(e = this) {
    return this.subscribers.get(e) || this.subscribers.set(e, /* @__PURE__ */ new Set()) && this.subscribers.get(e);
  }
  createCSS() {
    return this.cssVar || "";
  }
  getValueFor(e) {
    const t = ue.getOrCreate(e).get(this);
    if (t !== void 0)
      return t;
    throw new Error(`Value could not be retrieved for token named "${this.name}". Ensure the value is set for ${e} or an ancestor of ${e}.`);
  }
  setValueFor(e, t) {
    return this._appliedTo.add(e), t instanceof Re && (t = this.alias(t)), ue.getOrCreate(e).set(this, t), this;
  }
  deleteValueFor(e) {
    return this._appliedTo.delete(e), ue.existsFor(e) && ue.getOrCreate(e).delete(this), this;
  }
  withDefault(e) {
    return this.setValueFor(yt, e), this;
  }
  subscribe(e, t) {
    const o = this.getOrCreateSubscriberSet(t);
    t && !ue.existsFor(t) && ue.getOrCreate(t), o.has(e) || o.add(e);
  }
  unsubscribe(e, t) {
    const o = this.subscribers.get(t || this);
    o && o.has(e) && o.delete(e);
  }
  notify(e) {
    const t = Object.freeze({ token: this, target: e });
    this.subscribers.has(this) && this.subscribers.get(this).forEach((o) => o.handleChange(t)), this.subscribers.has(e) && this.subscribers.get(e).forEach((o) => o.handleChange(t));
  }
  alias(e) {
    return (t) => e.getValueFor(t);
  }
}
Re.uniqueId = (() => {
  let i = 0;
  return () => (i++, i.toString(16));
})();
Re.tokensById = /* @__PURE__ */ new Map();
class Ih {
  startReflection(e, t) {
    e.subscribe(this, t), this.handleChange({ token: e, target: t });
  }
  stopReflection(e, t) {
    e.unsubscribe(this, t), this.remove(e, t);
  }
  handleChange(e) {
    const { token: t, target: o } = e;
    this.add(t, o);
  }
  add(e, t) {
    vi.getOrCreate(t).setProperty(e.cssCustomProperty, this.resolveCSSValue(ue.getOrCreate(t).get(e)));
  }
  remove(e, t) {
    vi.getOrCreate(t).removeProperty(e.cssCustomProperty);
  }
  resolveCSSValue(e) {
    return e && typeof e.createCSS == "function" ? e.createCSS() : e;
  }
}
class Sh {
  constructor(e, t, o) {
    this.source = e, this.token = t, this.node = o, this.dependencies = /* @__PURE__ */ new Set(), this.observer = A.binding(e, this, !1), this.observer.handleChange = this.observer.call, this.handleChange();
  }
  disconnect() {
    this.observer.disconnect();
  }
  handleChange() {
    this.node.store.set(this.token, this.observer.observe(this.node.target, Gi));
  }
}
class Fh {
  constructor() {
    this.values = /* @__PURE__ */ new Map();
  }
  set(e, t) {
    this.values.get(e) !== t && (this.values.set(e, t), A.getNotifier(this).notify(e.id));
  }
  get(e) {
    return A.track(this, e.id), this.values.get(e);
  }
  delete(e) {
    this.values.delete(e);
  }
  all() {
    return this.values.entries();
  }
}
const Vi = /* @__PURE__ */ new WeakMap(), Hi = /* @__PURE__ */ new WeakMap();
class ue {
  constructor(e) {
    this.target = e, this.store = new Fh(), this.children = [], this.assignedValues = /* @__PURE__ */ new Map(), this.reflecting = /* @__PURE__ */ new Set(), this.bindingObservers = /* @__PURE__ */ new Map(), this.tokenValueChangeHandler = {
      handleChange: (t, o) => {
        const s = Re.getTokenById(o);
        if (s && (s.notify(this.target), Re.isCSSDesignToken(s))) {
          const n = this.parent, r = this.isReflecting(s);
          if (n) {
            const l = n.get(s), c = t.get(s);
            l !== c && !r ? this.reflectToCSS(s) : l === c && r && this.stopReflectToCSS(s);
          } else
            r || this.reflectToCSS(s);
        }
      }
    }, Vi.set(e, this), A.getNotifier(this.store).subscribe(this.tokenValueChangeHandler), e instanceof po ? e.$fastController.addBehaviors([this]) : e.isConnected && this.bind();
  }
  static getOrCreate(e) {
    return Vi.get(e) || new ue(e);
  }
  static existsFor(e) {
    return Vi.has(e);
  }
  static findParent(e) {
    if (yt !== e.target) {
      let t = eo(e.target);
      for (; t !== null; ) {
        if (Vi.has(t))
          return Vi.get(t);
        t = eo(t);
      }
      return ue.getOrCreate(yt);
    }
    return null;
  }
  static findClosestAssignedNode(e, t) {
    let o = t;
    do {
      if (o.has(e))
        return o;
      o = o.parent ? o.parent : o.target !== yt ? ue.getOrCreate(yt) : null;
    } while (o !== null);
    return null;
  }
  get parent() {
    return Hi.get(this) || null;
  }
  has(e) {
    return this.assignedValues.has(e);
  }
  get(e) {
    const t = this.store.get(e);
    if (t !== void 0)
      return t;
    const o = this.getRaw(e);
    if (o !== void 0)
      return this.hydrate(e, o), this.get(e);
  }
  getRaw(e) {
    var t;
    return this.assignedValues.has(e) ? this.assignedValues.get(e) : (t = ue.findClosestAssignedNode(e, this)) === null || t === void 0 ? void 0 : t.getRaw(e);
  }
  set(e, t) {
    Re.isDerivedDesignTokenValue(this.assignedValues.get(e)) && this.tearDownBindingObserver(e), this.assignedValues.set(e, t), Re.isDerivedDesignTokenValue(t) ? this.setupBindingObserver(e, t) : this.store.set(e, t);
  }
  delete(e) {
    this.assignedValues.delete(e), this.tearDownBindingObserver(e);
    const t = this.getRaw(e);
    t ? this.hydrate(e, t) : this.store.delete(e);
  }
  bind() {
    const e = ue.findParent(this);
    e && e.appendChild(this);
    for (const t of this.assignedValues.keys())
      t.notify(this.target);
  }
  unbind() {
    this.parent && Hi.get(this).removeChild(this);
  }
  appendChild(e) {
    e.parent && Hi.get(e).removeChild(e);
    const t = this.children.filter((o) => e.contains(o));
    Hi.set(e, this), this.children.push(e), t.forEach((o) => e.appendChild(o)), A.getNotifier(this.store).subscribe(e);
    for (const [o, s] of this.store.all())
      e.hydrate(o, this.bindingObservers.has(o) ? this.getRaw(o) : s);
  }
  removeChild(e) {
    const t = this.children.indexOf(e);
    return t !== -1 && this.children.splice(t, 1), A.getNotifier(this.store).unsubscribe(e), e.parent === this ? Hi.delete(e) : !1;
  }
  contains(e) {
    return yh(this.target, e.target);
  }
  reflectToCSS(e) {
    this.isReflecting(e) || (this.reflecting.add(e), ue.cssCustomPropertyReflector.startReflection(e, this.target));
  }
  stopReflectToCSS(e) {
    this.isReflecting(e) && (this.reflecting.delete(e), ue.cssCustomPropertyReflector.stopReflection(e, this.target));
  }
  isReflecting(e) {
    return this.reflecting.has(e);
  }
  handleChange(e, t) {
    const o = Re.getTokenById(t);
    o && this.hydrate(o, this.getRaw(o));
  }
  hydrate(e, t) {
    if (!this.has(e)) {
      const o = this.bindingObservers.get(e);
      Re.isDerivedDesignTokenValue(t) ? o ? o.source !== t && (this.tearDownBindingObserver(e), this.setupBindingObserver(e, t)) : this.setupBindingObserver(e, t) : (o && this.tearDownBindingObserver(e), this.store.set(e, t));
    }
  }
  setupBindingObserver(e, t) {
    const o = new Sh(t, e, this);
    return this.bindingObservers.set(e, o), o;
  }
  tearDownBindingObserver(e) {
    return this.bindingObservers.has(e) ? (this.bindingObservers.get(e).disconnect(), this.bindingObservers.delete(e), !0) : !1;
  }
}
ue.cssCustomPropertyReflector = new Ih();
a([
  g
], ue.prototype, "children", void 0);
function Eh(i) {
  return Re.from(i);
}
const Ht = Object.freeze({
  create: Eh,
  notifyConnection(i) {
    return !i.isConnected || !ue.existsFor(i) ? !1 : (ue.getOrCreate(i).bind(), !0);
  },
  notifyDisconnection(i) {
    return i.isConnected || !ue.existsFor(i) ? !1 : (ue.getOrCreate(i).unbind(), !0);
  },
  registerRoot(i = yt) {
    xe.registerRoot(i);
  },
  unregisterRoot(i = yt) {
    xe.unregisterRoot(i);
  }
}), Es = Object.freeze({
  definitionCallbackOnly: null,
  ignoreDuplicate: Symbol()
}), Rs = /* @__PURE__ */ new Map(), Ro = /* @__PURE__ */ new Map();
let $i = null;
const zi = le.createInterface((i) => i.cachedCallback((e) => ($i === null && ($i = new Va(null, e)), $i))), Ma = Object.freeze({
  tagFor(i) {
    return Ro.get(i);
  },
  responsibleFor(i) {
    const e = i.$$designSystem$$;
    return e || le.findResponsibleContainer(i).get(zi);
  },
  getOrCreate(i) {
    if (!i)
      return $i === null && ($i = le.getOrCreateDOMContainer().get(zi)), $i;
    const e = i.$$designSystem$$;
    if (e)
      return e;
    const t = le.getOrCreateDOMContainer(i);
    if (t.has(zi, !1))
      return t.get(zi);
    {
      const o = new Va(i, t);
      return t.register(Ji.instance(zi, o)), o;
    }
  }
});
function Rh(i, e, t) {
  return typeof i == "string" ? {
    name: i,
    type: e,
    callback: t
  } : i;
}
class Va {
  constructor(e, t) {
    this.owner = e, this.container = t, this.designTokensInitialized = !1, this.prefix = "fast", this.shadowRootMode = void 0, this.disambiguate = () => Es.definitionCallbackOnly, e !== null && (e.$$designSystem$$ = this);
  }
  withPrefix(e) {
    return this.prefix = e, this;
  }
  withShadowRootMode(e) {
    return this.shadowRootMode = e, this;
  }
  withElementDisambiguation(e) {
    return this.disambiguate = e, this;
  }
  withDesignTokenRoot(e) {
    return this.designTokenRoot = e, this;
  }
  register(...e) {
    const t = this.container, o = [], s = this.disambiguate, n = this.shadowRootMode, r = {
      elementPrefix: this.prefix,
      tryDefineElement(l, c, u) {
        const p = Rh(l, c, u), { name: f, callback: b, baseClass: I } = p;
        let { type: $ } = p, k = f, L = Rs.get(k), te = !0;
        for (; L; ) {
          const G = s(k, $, L);
          switch (G) {
            case Es.ignoreDuplicate:
              return;
            case Es.definitionCallbackOnly:
              te = !1, L = void 0;
              break;
            default:
              k = G, L = Rs.get(k);
              break;
          }
        }
        te && ((Ro.has($) || $ === O) && ($ = class extends $ {
        }), Rs.set(k, $), Ro.set($, k), I && Ro.set(I, k)), o.push(new Dh(t, k, $, n, b, te));
      }
    };
    this.designTokensInitialized || (this.designTokensInitialized = !0, this.designTokenRoot !== null && Ht.registerRoot(this.designTokenRoot)), t.registerWithContext(r, ...e);
    for (const l of o)
      l.callback(l), l.willDefine && l.definition !== null && l.definition.define();
    return this;
  }
}
class Dh {
  constructor(e, t, o, s, n, r) {
    this.container = e, this.name = t, this.type = o, this.shadowRootMode = s, this.callback = n, this.willDefine = r, this.definition = null;
  }
  definePresentation(e) {
    Ia.define(this.name, e, this.container);
  }
  defineElement(e) {
    this.definition = new uo(this.type, Object.assign(Object.assign({}, e), { name: this.name }));
  }
  tagFor(e) {
    return Ma.tagFor(e);
  }
}
const Oh = (i, e) => v`
    <div class="positioning-region" part="positioning-region">
        ${Q((t) => t.modal, v`
                <div
                    class="overlay"
                    part="overlay"
                    role="presentation"
                    @click="${(t) => t.dismiss()}"
                ></div>
            `)}
        <div
            role="dialog"
            tabindex="-1"
            class="control"
            part="control"
            aria-modal="${(t) => t.modal}"
            aria-describedby="${(t) => t.ariaDescribedby}"
            aria-labelledby="${(t) => t.ariaLabelledby}"
            aria-label="${(t) => t.ariaLabel}"
            ${U("dialog")}
        >
            <slot></slot>
        </div>
    </div>
`;
/*!
* tabbable 5.3.3
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
var Ha = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], Lh = /* @__PURE__ */ Ha.join(","), za = typeof Element > "u", to = za ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, Ns = !za && Element.prototype.getRootNode ? function(i) {
  return i.getRootNode();
} : function(i) {
  return i.ownerDocument;
}, Ah = function(e, t) {
  return e.tabIndex < 0 && (t || /^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || e.isContentEditable) && isNaN(parseInt(e.getAttribute("tabindex"), 10)) ? 0 : e.tabIndex;
}, Na = function(e) {
  return e.tagName === "INPUT";
}, Ph = function(e) {
  return Na(e) && e.type === "hidden";
}, Mh = function(e) {
  var t = e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(o) {
    return o.tagName === "SUMMARY";
  });
  return t;
}, Vh = function(e, t) {
  for (var o = 0; o < e.length; o++)
    if (e[o].checked && e[o].form === t)
      return e[o];
}, Hh = function(e) {
  if (!e.name)
    return !0;
  var t = e.form || Ns(e), o = function(l) {
    return t.querySelectorAll('input[type="radio"][name="' + l + '"]');
  }, s;
  if (typeof window < "u" && typeof window.CSS < "u" && typeof window.CSS.escape == "function")
    s = o(window.CSS.escape(e.name));
  else
    try {
      s = o(e.name);
    } catch (r) {
      return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", r.message), !1;
    }
  var n = Vh(s, e.form);
  return !n || n === e;
}, zh = function(e) {
  return Na(e) && e.type === "radio";
}, Nh = function(e) {
  return zh(e) && !Hh(e);
}, ur = function(e) {
  var t = e.getBoundingClientRect(), o = t.width, s = t.height;
  return o === 0 && s === 0;
}, Bh = function(e, t) {
  var o = t.displayCheck, s = t.getShadowRoot;
  if (getComputedStyle(e).visibility === "hidden")
    return !0;
  var n = to.call(e, "details>summary:first-of-type"), r = n ? e.parentElement : e;
  if (to.call(r, "details:not([open]) *"))
    return !0;
  var l = Ns(e).host, c = (l == null ? void 0 : l.ownerDocument.contains(l)) || e.ownerDocument.contains(e);
  if (!o || o === "full") {
    if (typeof s == "function") {
      for (var u = e; e; ) {
        var p = e.parentElement, f = Ns(e);
        if (p && !p.shadowRoot && s(p) === !0)
          return ur(e);
        e.assignedSlot ? e = e.assignedSlot : !p && f !== e.ownerDocument ? e = f.host : e = p;
      }
      e = u;
    }
    if (c)
      return !e.getClientRects().length;
  } else if (o === "non-zero-area")
    return ur(e);
  return !1;
}, jh = function(e) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))
    for (var t = e.parentElement; t; ) {
      if (t.tagName === "FIELDSET" && t.disabled) {
        for (var o = 0; o < t.children.length; o++) {
          var s = t.children.item(o);
          if (s.tagName === "LEGEND")
            return to.call(t, "fieldset[disabled] *") ? !0 : !s.contains(e);
        }
        return !0;
      }
      t = t.parentElement;
    }
  return !1;
}, Ba = function(e, t) {
  return !(t.disabled || Ph(t) || Bh(t, e) || Mh(t) || jh(t));
}, _h = function(e, t) {
  return !(Nh(t) || Ah(t) < 0 || !Ba(e, t));
}, pr = function(e, t) {
  if (t = t || {}, !e)
    throw new Error("No node provided");
  return to.call(e, Lh) === !1 ? !1 : _h(t, e);
}, Uh = /* @__PURE__ */ Ha.concat("iframe").join(","), fr = function(e, t) {
  if (t = t || {}, !e)
    throw new Error("No node provided");
  return to.call(e, Uh) === !1 ? !1 : Ba(t, e);
};
class Qe extends O {
  constructor() {
    super(...arguments), this.modal = !0, this.hidden = !1, this.trapFocus = !0, this.trapFocusChanged = () => {
      this.$fastController.isConnected && this.updateTrapFocus();
    }, this.isTrappingFocus = !1, this.handleDocumentKeydown = (e) => {
      if (!e.defaultPrevented && !this.hidden)
        switch (e.key) {
          case Kt:
            this.dismiss(), e.preventDefault();
            break;
          case qo:
            this.handleTabKeyDown(e);
            break;
        }
    }, this.handleDocumentFocus = (e) => {
      !e.defaultPrevented && this.shouldForceFocus(e.target) && (this.focusFirstElement(), e.preventDefault());
    }, this.handleTabKeyDown = (e) => {
      if (!this.trapFocus || this.hidden)
        return;
      const t = this.getTabQueueBounds();
      if (t.length !== 0) {
        if (t.length === 1) {
          t[0].focus(), e.preventDefault();
          return;
        }
        e.shiftKey && e.target === t[0] ? (t[t.length - 1].focus(), e.preventDefault()) : !e.shiftKey && e.target === t[t.length - 1] && (t[0].focus(), e.preventDefault());
      }
    }, this.getTabQueueBounds = () => {
      const e = [];
      return Qe.reduceTabbableItems(e, this);
    }, this.focusFirstElement = () => {
      const e = this.getTabQueueBounds();
      e.length > 0 ? e[0].focus() : this.dialog instanceof HTMLElement && this.dialog.focus();
    }, this.shouldForceFocus = (e) => this.isTrappingFocus && !this.contains(e), this.shouldTrapFocus = () => this.trapFocus && !this.hidden, this.updateTrapFocus = (e) => {
      const t = e === void 0 ? this.shouldTrapFocus() : e;
      t && !this.isTrappingFocus ? (this.isTrappingFocus = !0, document.addEventListener("focusin", this.handleDocumentFocus), R.queueUpdate(() => {
        this.shouldForceFocus(document.activeElement) && this.focusFirstElement();
      })) : !t && this.isTrappingFocus && (this.isTrappingFocus = !1, document.removeEventListener("focusin", this.handleDocumentFocus));
    };
  }
  dismiss() {
    this.$emit("dismiss"), this.$emit("cancel");
  }
  show() {
    this.hidden = !1;
  }
  hide() {
    this.hidden = !0, this.$emit("close");
  }
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("keydown", this.handleDocumentKeydown), this.notifier = A.getNotifier(this), this.notifier.subscribe(this, "hidden"), this.updateTrapFocus();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), document.removeEventListener("keydown", this.handleDocumentKeydown), this.updateTrapFocus(!1), this.notifier.unsubscribe(this, "hidden");
  }
  handleChange(e, t) {
    switch (t) {
      case "hidden":
        this.updateTrapFocus();
        break;
    }
  }
  static reduceTabbableItems(e, t) {
    return t.getAttribute("tabindex") === "-1" ? e : pr(t) || Qe.isFocusableFastElement(t) && Qe.hasTabbableShadow(t) ? (e.push(t), e) : t.childElementCount ? e.concat(Array.from(t.children).reduce(Qe.reduceTabbableItems, [])) : e;
  }
  static isFocusableFastElement(e) {
    var t, o;
    return !!(!((o = (t = e.$fastController) === null || t === void 0 ? void 0 : t.definition.shadowOptions) === null || o === void 0) && o.delegatesFocus);
  }
  static hasTabbableShadow(e) {
    var t, o;
    return Array.from((o = (t = e.shadowRoot) === null || t === void 0 ? void 0 : t.querySelectorAll("*")) !== null && o !== void 0 ? o : []).some((s) => pr(s));
  }
}
a([
  h({ mode: "boolean" })
], Qe.prototype, "modal", void 0);
a([
  h({ mode: "boolean" })
], Qe.prototype, "hidden", void 0);
a([
  h({ attribute: "trap-focus", mode: "boolean" })
], Qe.prototype, "trapFocus", void 0);
a([
  h({ attribute: "aria-describedby" })
], Qe.prototype, "ariaDescribedby", void 0);
a([
  h({ attribute: "aria-labelledby" })
], Qe.prototype, "ariaLabelledby", void 0);
a([
  h({ attribute: "aria-label" })
], Qe.prototype, "ariaLabel", void 0);
const qh = (i, e) => v`
    <details class="disclosure" ${U("details")}>
        <summary
            class="invoker"
            role="button"
            aria-controls="disclosure-content"
            aria-expanded="${(t) => t.expanded}"
        >
            <slot name="start"></slot>
            <slot name="title">${(t) => t.title}</slot>
            <slot name="end"></slot>
        </summary>
        <div id="disclosure-content"><slot></slot></div>
    </details>
`;
let Qo = class extends O {
  connectedCallback() {
    super.connectedCallback(), this.setup();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.details.removeEventListener("toggle", this.onToggle);
  }
  show() {
    this.details.open = !0;
  }
  hide() {
    this.details.open = !1;
  }
  toggle() {
    this.details.open = !this.details.open;
  }
  setup() {
    this.onToggle = this.onToggle.bind(this), this.details.addEventListener("toggle", this.onToggle), this.expanded && this.show();
  }
  onToggle() {
    this.expanded = this.details.open, this.$emit("toggle");
  }
};
a([
  h({ mode: "boolean" })
], Qo.prototype, "expanded", void 0);
a([
  h
], Qo.prototype, "title", void 0);
const Gh = (i, e) => v`
    <template role="${(t) => t.role}" aria-orientation="${(t) => t.orientation}"></template>
`, Wh = {
  separator: "separator",
  presentation: "presentation"
};
class yn extends O {
  constructor() {
    super(...arguments), this.role = Wh.separator, this.orientation = ce.horizontal;
  }
}
a([
  h
], yn.prototype, "role", void 0);
a([
  h
], yn.prototype, "orientation", void 0);
const Bs = {
  next: "next",
  previous: "previous"
}, Yh = (i, e) => v`
    <template
        role="button"
        aria-disabled="${(t) => t.disabled ? !0 : void 0}"
        tabindex="${(t) => t.hiddenFromAT ? -1 : 0}"
        class="${(t) => t.direction} ${(t) => t.disabled ? "disabled" : ""}"
        @keyup="${(t, o) => t.keyupHandler(o.event)}"
    >
        ${Q((t) => t.direction === Bs.next, v`
                <span part="next" class="next">
                    <slot name="next">
                        ${e.next || ""}
                    </slot>
                </span>
            `)}
        ${Q((t) => t.direction === Bs.previous, v`
                <span part="previous" class="previous">
                    <slot name="previous">
                        ${e.previous || ""}
                    </slot>
                </span>
            `)}
    </template>
`;
class Pt extends O {
  constructor() {
    super(...arguments), this.hiddenFromAT = !0, this.direction = Bs.next;
  }
  keyupHandler(e) {
    if (!this.hiddenFromAT) {
      const t = e.key;
      (t === "Enter" || t === "Space") && this.$emit("click", e), t === "Escape" && this.blur();
    }
  }
}
a([
  h({ mode: "boolean" })
], Pt.prototype, "disabled", void 0);
a([
  h({ attribute: "aria-hidden", converter: _o })
], Pt.prototype, "hiddenFromAT", void 0);
a([
  h
], Pt.prototype, "direction", void 0);
const Xh = (i, e) => v`
    <template
        aria-checked="${(t) => t.ariaChecked}"
        aria-disabled="${(t) => t.ariaDisabled}"
        aria-posinset="${(t) => t.ariaPosInSet}"
        aria-selected="${(t) => t.ariaSelected}"
        aria-setsize="${(t) => t.ariaSetSize}"
        class="${(t) => [t.checked && "checked", t.selected && "selected", t.disabled && "disabled"].filter(Boolean).join(" ")}"
        role="option"
    >
        ${Ae(i, e)}
        <span class="content" part="content">
            <slot ${ee("content")}></slot>
        </span>
        ${Le(i, e)}
    </template>
`;
class zt extends Se {
  constructor() {
    super(...arguments), this.activeIndex = -1, this.rangeStartIndex = -1;
  }
  get activeOption() {
    return this.options[this.activeIndex];
  }
  get checkedOptions() {
    var e;
    return (e = this.options) === null || e === void 0 ? void 0 : e.filter((t) => t.checked);
  }
  get firstSelectedOptionIndex() {
    return this.options.indexOf(this.firstSelectedOption);
  }
  activeIndexChanged(e, t) {
    var o, s;
    this.ariaActiveDescendant = (s = (o = this.options[t]) === null || o === void 0 ? void 0 : o.id) !== null && s !== void 0 ? s : "", this.focusAndScrollOptionIntoView();
  }
  checkActiveIndex() {
    if (!this.multiple)
      return;
    const e = this.activeOption;
    e && (e.checked = !0);
  }
  checkFirstOption(e = !1) {
    e ? (this.rangeStartIndex === -1 && (this.rangeStartIndex = this.activeIndex + 1), this.options.forEach((t, o) => {
      t.checked = ko(o, this.rangeStartIndex);
    })) : this.uncheckAllOptions(), this.activeIndex = 0, this.checkActiveIndex();
  }
  checkLastOption(e = !1) {
    e ? (this.rangeStartIndex === -1 && (this.rangeStartIndex = this.activeIndex), this.options.forEach((t, o) => {
      t.checked = ko(o, this.rangeStartIndex, this.options.length);
    })) : this.uncheckAllOptions(), this.activeIndex = this.options.length - 1, this.checkActiveIndex();
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("focusout", this.focusoutHandler);
  }
  disconnectedCallback() {
    this.removeEventListener("focusout", this.focusoutHandler), super.disconnectedCallback();
  }
  checkNextOption(e = !1) {
    e ? (this.rangeStartIndex === -1 && (this.rangeStartIndex = this.activeIndex), this.options.forEach((t, o) => {
      t.checked = ko(o, this.rangeStartIndex, this.activeIndex + 1);
    })) : this.uncheckAllOptions(), this.activeIndex += this.activeIndex < this.options.length - 1 ? 1 : 0, this.checkActiveIndex();
  }
  checkPreviousOption(e = !1) {
    e ? (this.rangeStartIndex === -1 && (this.rangeStartIndex = this.activeIndex), this.checkedOptions.length === 1 && (this.rangeStartIndex += 1), this.options.forEach((t, o) => {
      t.checked = ko(o, this.activeIndex, this.rangeStartIndex);
    })) : this.uncheckAllOptions(), this.activeIndex -= this.activeIndex > 0 ? 1 : 0, this.checkActiveIndex();
  }
  clickHandler(e) {
    var t;
    if (!this.multiple)
      return super.clickHandler(e);
    const o = (t = e.target) === null || t === void 0 ? void 0 : t.closest("[role=option]");
    if (!(!o || o.disabled))
      return this.uncheckAllOptions(), this.activeIndex = this.options.indexOf(o), this.checkActiveIndex(), this.toggleSelectedForAllCheckedOptions(), !0;
  }
  focusAndScrollOptionIntoView() {
    super.focusAndScrollOptionIntoView(this.activeOption);
  }
  focusinHandler(e) {
    if (!this.multiple)
      return super.focusinHandler(e);
    !this.shouldSkipFocus && e.target === e.currentTarget && (this.uncheckAllOptions(), this.activeIndex === -1 && (this.activeIndex = this.firstSelectedOptionIndex !== -1 ? this.firstSelectedOptionIndex : 0), this.checkActiveIndex(), this.setSelectedOptions(), this.focusAndScrollOptionIntoView()), this.shouldSkipFocus = !1;
  }
  focusoutHandler(e) {
    this.multiple && this.uncheckAllOptions();
  }
  keydownHandler(e) {
    if (!this.multiple)
      return super.keydownHandler(e);
    if (this.disabled)
      return !0;
    const { key: t, shiftKey: o } = e;
    switch (this.shouldSkipFocus = !1, t) {
      case ut: {
        this.checkFirstOption(o);
        return;
      }
      case _e: {
        this.checkNextOption(o);
        return;
      }
      case Ue: {
        this.checkPreviousOption(o);
        return;
      }
      case pt: {
        this.checkLastOption(o);
        return;
      }
      case qo:
        return this.focusAndScrollOptionIntoView(), !0;
      case Kt:
        return this.uncheckAllOptions(), this.checkActiveIndex(), !0;
      case ei:
        if (e.preventDefault(), this.typeAheadExpired) {
          this.toggleSelectedForAllCheckedOptions();
          return;
        }
      default:
        return t.length === 1 && this.handleTypeAhead(`${t}`), !0;
    }
  }
  mousedownHandler(e) {
    if (e.offsetX >= 0 && e.offsetX <= this.scrollWidth)
      return super.mousedownHandler(e);
  }
  multipleChanged(e, t) {
    var o;
    this.ariaMultiSelectable = t ? "true" : null, (o = this.options) === null || o === void 0 || o.forEach((s) => {
      s.checked = t ? !1 : void 0;
    }), this.setSelectedOptions();
  }
  setSelectedOptions() {
    if (!this.multiple) {
      super.setSelectedOptions();
      return;
    }
    this.$fastController.isConnected && this.options && (this.selectedOptions = this.options.filter((e) => e.selected), this.focusAndScrollOptionIntoView());
  }
  sizeChanged(e, t) {
    var o;
    const s = Math.max(0, parseInt((o = t == null ? void 0 : t.toFixed()) !== null && o !== void 0 ? o : "", 10));
    s !== t && R.queueUpdate(() => {
      this.size = s;
    });
  }
  toggleSelectedForAllCheckedOptions() {
    const e = this.checkedOptions.filter((o) => !o.disabled), t = !e.every((o) => o.selected);
    e.forEach((o) => o.selected = t), this.selectedIndex = this.options.indexOf(e[e.length - 1]), this.setSelectedOptions();
  }
  typeaheadBufferChanged(e, t) {
    if (!this.multiple) {
      super.typeaheadBufferChanged(e, t);
      return;
    }
    if (this.$fastController.isConnected) {
      const o = this.getTypeaheadMatches(), s = this.options.indexOf(o[0]);
      s > -1 && (this.activeIndex = s, this.uncheckAllOptions(), this.checkActiveIndex()), this.typeAheadExpired = !1;
    }
  }
  uncheckAllOptions(e = !1) {
    this.options.forEach((t) => t.checked = this.multiple ? !1 : void 0), e || (this.rangeStartIndex = -1);
  }
}
a([
  g
], zt.prototype, "activeIndex", void 0);
a([
  h({ mode: "boolean" })
], zt.prototype, "multiple", void 0);
a([
  h({ converter: C })
], zt.prototype, "size", void 0);
const Qh = (i, e) => v`
    <template
        aria-activedescendant="${(t) => t.ariaActiveDescendant}"
        aria-multiselectable="${(t) => t.ariaMultiSelectable}"
        class="listbox"
        role="listbox"
        tabindex="${(t) => t.disabled ? null : "0"}"
        @click="${(t, o) => t.clickHandler(o.event)}"
        @focusin="${(t, o) => t.focusinHandler(o.event)}"
        @keydown="${(t, o) => t.keydownHandler(o.event)}"
        @mousedown="${(t, o) => t.mousedownHandler(o.event)}"
    >
        <slot
            ${ee({
  filter: zt.slottedOptionFilter,
  flatten: !0,
  property: "slottedOptions"
})}
        ></slot>
    </template>
`;
let ii = class extends O {
  constructor() {
    super(...arguments), this.optionElements = [];
  }
  menuElementsChanged() {
    this.updateOptions();
  }
  headerElementsChanged() {
    this.updateOptions();
  }
  footerElementsChanged() {
    this.updateOptions();
  }
  updateOptions() {
    this.optionElements.splice(0, this.optionElements.length), this.addSlottedListItems(this.headerElements), this.addSlottedListItems(this.menuElements), this.addSlottedListItems(this.footerElements), this.$emit("optionsupdated", { bubbles: !1 });
  }
  addSlottedListItems(e) {
    e !== void 0 && e.forEach((t) => {
      t.nodeType === 1 && t.getAttribute("role") === "listitem" && (t.id = t.id || Xt("option-"), this.optionElements.push(t));
    });
  }
};
a([
  g
], ii.prototype, "menuElements", void 0);
a([
  g
], ii.prototype, "headerElements", void 0);
a([
  g
], ii.prototype, "footerElements", void 0);
a([
  g
], ii.prototype, "suggestionsAvailableText", void 0);
const Zh = v`
    <template>
        ${(i) => i.value}
    </template>
`;
class fo extends O {
  contentsTemplateChanged() {
    this.$fastController.isConnected && this.updateView();
  }
  connectedCallback() {
    super.connectedCallback(), this.updateView();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.disconnectView();
  }
  handleClick(e) {
    return e.defaultPrevented || this.handleInvoked(), !1;
  }
  handleInvoked() {
    this.$emit("pickeroptioninvoked");
  }
  updateView() {
    var e, t;
    this.disconnectView(), this.customView = (t = (e = this.contentsTemplate) === null || e === void 0 ? void 0 : e.render(this, this)) !== null && t !== void 0 ? t : Zh.render(this, this);
  }
  disconnectView() {
    var e;
    (e = this.customView) === null || e === void 0 || e.dispose(), this.customView = void 0;
  }
}
a([
  h({ attribute: "value" })
], fo.prototype, "value", void 0);
a([
  g
], fo.prototype, "contentsTemplate", void 0);
class js extends O {
}
const Jh = v`
    <template>
        ${(i) => i.value}
    </template>
`;
class go extends O {
  contentsTemplateChanged() {
    this.$fastController.isConnected && this.updateView();
  }
  connectedCallback() {
    super.connectedCallback(), this.updateView();
  }
  disconnectedCallback() {
    this.disconnectView(), super.disconnectedCallback();
  }
  handleKeyDown(e) {
    return e.defaultPrevented ? !1 : e.key === st ? (this.handleInvoke(), !1) : !0;
  }
  handleClick(e) {
    return e.defaultPrevented || this.handleInvoke(), !1;
  }
  handleInvoke() {
    this.$emit("pickeriteminvoked");
  }
  updateView() {
    var e, t;
    this.disconnectView(), this.customView = (t = (e = this.contentsTemplate) === null || e === void 0 ? void 0 : e.render(this, this)) !== null && t !== void 0 ? t : Jh.render(this, this);
  }
  disconnectView() {
    var e;
    (e = this.customView) === null || e === void 0 || e.dispose(), this.customView = void 0;
  }
}
a([
  h({ attribute: "value" })
], go.prototype, "value", void 0);
a([
  g
], go.prototype, "contentsTemplate", void 0);
function Kh(i) {
  const e = i.tagFor(go);
  return v`
    <${e}
        value="${(t) => t}"
        :contentsTemplate="${(t, o) => o.parent.listItemContentsTemplate}"
    >
    </${e}>
    `;
}
function eu(i) {
  const e = i.tagFor(fo);
  return v`
    <${e}
        value="${(t) => t}"
        :contentsTemplate="${(t, o) => o.parent.menuOptionContentsTemplate}"
    >
    </${e}>
    `;
}
const tu = (i, e) => {
  const t = i.tagFor(W), o = i.tagFor(ii), s = i.tagFor(js), n = i.tagFor(js), r = Kh(i), l = eu(i);
  return v`
        <template
            :selectedListTag="${() => s}"
            :menuTag="${() => o}"
            :defaultListItemTemplate="${r}"
            :defaultMenuOptionTemplate="${l}"
            @focusin="${(c, u) => c.handleFocusIn(u.event)}"
            @focusout="${(c, u) => c.handleFocusOut(u.event)}"
            @keydown="${(c, u) => c.handleKeyDown(u.event)}"
            @pickeriteminvoked="${(c, u) => c.handleItemInvoke(u.event)}"
            @pickeroptioninvoked="${(c, u) => c.handleOptionInvoke(u.event)}"
        >
            <slot name="list-region"></slot>

            ${Q((c) => c.flyoutOpen, v`
                <${t}
                    class="region"
                    part="region"
                    auto-update-mode="${(c) => c.menuConfig.autoUpdateMode}"
                    fixed-placement="${(c) => c.menuConfig.fixedPlacement}"
                    vertical-positioning-mode="${(c) => c.menuConfig.verticalPositioningMode}"
                    vertical-default-position="${(c) => c.menuConfig.verticalDefaultPosition}"
                    vertical-scaling="${(c) => c.menuConfig.verticalScaling}"
                    vertical-inset="${(c) => c.menuConfig.verticalInset}"
                    vertical-viewport-lock="${(c) => c.menuConfig.verticalViewportLock}"
                    horizontal-positioning-mode="${(c) => c.menuConfig.horizontalPositioningMode}"
                    horizontal-default-position="${(c) => c.menuConfig.horizontalDefaultPosition}"
                    horizontal-scaling="${(c) => c.menuConfig.horizontalScaling}"
                    horizontal-inset="${(c) => c.menuConfig.horizontalInset}"
                    horizontal-viewport-lock="${(c) => c.menuConfig.horizontalViewportLock}"
                    @loaded="${(c, u) => c.handleRegionLoaded(u.event)}"
                    ${U("region")}
                >
                    ${Q((c) => !c.showNoOptions && !c.showLoading, v`
                            <slot name="menu-region"></slot>
                        `)}
                    ${Q((c) => c.showNoOptions && !c.showLoading, v`
                            <div class="no-options-display" part="no-options-display">
                                <slot name="no-options-region">
                                    ${(c) => c.noSuggestionsText}
                                </slot>
                            </div>
                        `)}
                    ${Q((c) => c.showLoading, v`
                            <div class="loading-display" part="loading-display">
                                <slot name="loading-region">
                                    <${n}
                                        part="loading-progress"
                                        class="loading-progress
                                        slot="loading-region"
                                    ></${n}>
                                        ${(c) => c.loadingText}
                                </slot>
                            </div>
                        `)}
                </${t}>
            `)}
        </template>
    `;
};
class iu extends O {
}
class ou extends ft(iu) {
  constructor() {
    super(...arguments), this.proxy = document.createElement("input");
  }
}
const su = v`
    <input
        slot="input-region"
        role="combobox"
        type="text"
        autocapitalize="off"
        autocomplete="off"
        haspopup="list"
        aria-label="${(i) => i.label}"
        aria-labelledby="${(i) => i.labelledBy}"
        placeholder="${(i) => i.placeholder}"
        ${U("inputElement")}
    ></input>
`;
class X extends ou {
  constructor() {
    super(...arguments), this.selection = "", this.filterSelected = !0, this.filterQuery = !0, this.noSuggestionsText = "No suggestions available", this.suggestionsAvailableText = "Suggestions available", this.loadingText = "Loading suggestions", this.menuPlacement = "bottom-fill", this.showLoading = !1, this.optionsList = [], this.filteredOptionsList = [], this.flyoutOpen = !1, this.menuFocusIndex = -1, this.showNoOptions = !1, this.selectedItems = [], this.inputElementView = null, this.handleTextInput = (e) => {
      this.query = this.inputElement.value;
    }, this.handleInputClick = (e) => {
      e.preventDefault(), this.toggleFlyout(!0);
    }, this.setRegionProps = () => {
      if (this.flyoutOpen) {
        if (this.region === null || this.region === void 0) {
          R.queueUpdate(this.setRegionProps);
          return;
        }
        this.region.anchorElement = this.inputElement;
      }
    }, this.configLookup = {
      top: Ea,
      bottom: Ra,
      tallest: Da,
      "top-fill": Bd,
      "bottom-fill": ar,
      "tallest-fill": jd
    };
  }
  selectionChanged() {
    this.$fastController.isConnected && (this.handleSelectionChange(), this.proxy instanceof HTMLInputElement && (this.proxy.value = this.selection, this.validate()));
  }
  optionsChanged() {
    this.optionsList = this.options.split(",").map((e) => e.trim()).filter((e) => e !== "");
  }
  menuPlacementChanged() {
    this.$fastController.isConnected && this.updateMenuConfig();
  }
  showLoadingChanged() {
    this.$fastController.isConnected && R.queueUpdate(() => {
      this.setFocusedOption(0);
    });
  }
  listItemTemplateChanged() {
    this.updateListItemTemplate();
  }
  defaultListItemTemplateChanged() {
    this.updateListItemTemplate();
  }
  menuOptionTemplateChanged() {
    this.updateOptionTemplate();
  }
  defaultMenuOptionTemplateChanged() {
    this.updateOptionTemplate();
  }
  optionsListChanged() {
    this.updateFilteredOptions();
  }
  queryChanged() {
    this.$fastController.isConnected && (this.inputElement.value !== this.query && (this.inputElement.value = this.query), this.updateFilteredOptions(), this.$emit("querychange", { bubbles: !1 }));
  }
  filteredOptionsListChanged() {
    this.$fastController.isConnected && (this.showNoOptions = this.filteredOptionsList.length === 0 && this.menuElement.querySelectorAll('[role="listitem"]').length === 0, this.setFocusedOption(this.showNoOptions ? -1 : 0));
  }
  flyoutOpenChanged() {
    this.flyoutOpen ? (R.queueUpdate(this.setRegionProps), this.$emit("menuopening", { bubbles: !1 })) : this.$emit("menuclosing", { bubbles: !1 });
  }
  showNoOptionsChanged() {
    this.$fastController.isConnected && R.queueUpdate(() => {
      this.setFocusedOption(0);
    });
  }
  connectedCallback() {
    super.connectedCallback(), this.listElement = document.createElement(this.selectedListTag), this.appendChild(this.listElement), this.itemsPlaceholderElement = document.createComment(""), this.listElement.append(this.itemsPlaceholderElement), this.inputElementView = su.render(this, this.listElement);
    const e = this.menuTag.toUpperCase();
    this.menuElement = Array.from(this.children).find((t) => t.tagName === e), this.menuElement === void 0 && (this.menuElement = document.createElement(this.menuTag), this.appendChild(this.menuElement)), this.menuElement.id === "" && (this.menuElement.id = Xt("listbox-")), this.menuId = this.menuElement.id, this.optionsPlaceholder = document.createComment(""), this.menuElement.append(this.optionsPlaceholder), this.updateMenuConfig(), R.queueUpdate(() => this.initialize());
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.toggleFlyout(!1), this.inputElement.removeEventListener("input", this.handleTextInput), this.inputElement.removeEventListener("click", this.handleInputClick), this.inputElementView !== null && (this.inputElementView.dispose(), this.inputElementView = null);
  }
  focus() {
    this.inputElement.focus();
  }
  initialize() {
    this.updateListItemTemplate(), this.updateOptionTemplate(), this.itemsRepeatBehavior = new Zi((e) => e.selectedItems, (e) => e.activeListItemTemplate, { positioning: !0 }).createBehavior(this.itemsPlaceholderElement), this.inputElement.addEventListener("input", this.handleTextInput), this.inputElement.addEventListener("click", this.handleInputClick), this.$fastController.addBehaviors([this.itemsRepeatBehavior]), this.menuElement.suggestionsAvailableText = this.suggestionsAvailableText, this.menuElement.addEventListener("optionsupdated", this.handleMenuOptionsUpdated), this.optionsRepeatBehavior = new Zi((e) => e.filteredOptionsList, (e) => e.activeMenuOptionTemplate, { positioning: !0 }).createBehavior(this.optionsPlaceholder), this.$fastController.addBehaviors([this.optionsRepeatBehavior]), this.handleSelectionChange();
  }
  toggleFlyout(e) {
    if (this.flyoutOpen !== e) {
      if (e && document.activeElement === this.inputElement) {
        this.flyoutOpen = e, R.queueUpdate(() => {
          this.menuElement !== void 0 ? this.setFocusedOption(0) : this.disableMenu();
        });
        return;
      }
      this.flyoutOpen = !1, this.disableMenu();
    }
  }
  handleMenuOptionsUpdated(e) {
    e.preventDefault(), this.flyoutOpen && this.setFocusedOption(0);
  }
  handleKeyDown(e) {
    if (e.defaultPrevented)
      return !1;
    switch (e.key) {
      case _e: {
        if (!this.flyoutOpen)
          this.toggleFlyout(!0);
        else {
          const t = this.flyoutOpen ? Math.min(this.menuFocusIndex + 1, this.menuElement.optionElements.length - 1) : 0;
          this.setFocusedOption(t);
        }
        return !1;
      }
      case Ue: {
        if (!this.flyoutOpen)
          this.toggleFlyout(!0);
        else {
          const t = this.flyoutOpen ? Math.max(this.menuFocusIndex - 1, 0) : 0;
          this.setFocusedOption(t);
        }
        return !1;
      }
      case Kt:
        return this.toggleFlyout(!1), !1;
      case st:
        return this.menuFocusIndex !== -1 && this.menuElement.optionElements.length > this.menuFocusIndex && this.menuElement.optionElements[this.menuFocusIndex].click(), !1;
      case Ct:
        return document.activeElement !== this.inputElement ? (this.incrementFocusedItem(1), !1) : !0;
      case kt:
        return this.inputElement.selectionStart === 0 ? (this.incrementFocusedItem(-1), !1) : !0;
      case Vd:
      case Md: {
        if (document.activeElement === null)
          return !0;
        if (document.activeElement === this.inputElement)
          return this.inputElement.selectionStart === 0 ? (this.selection = this.selectedItems.slice(0, this.selectedItems.length - 1).toString(), this.toggleFlyout(!1), !1) : !0;
        const t = Array.from(this.listElement.children), o = t.indexOf(document.activeElement);
        return o > -1 ? (this.selection = this.selectedItems.splice(o, 1).toString(), R.queueUpdate(() => {
          t[Math.min(t.length, o)].focus();
        }), !1) : !0;
      }
    }
    return this.toggleFlyout(!0), !0;
  }
  handleFocusIn(e) {
    return !1;
  }
  handleFocusOut(e) {
    return (this.menuElement === void 0 || !this.menuElement.contains(e.relatedTarget)) && this.toggleFlyout(!1), !1;
  }
  handleSelectionChange() {
    this.selectedItems.toString() !== this.selection && (this.selectedItems = this.selection === "" ? [] : this.selection.split(","), this.updateFilteredOptions(), R.queueUpdate(() => {
      this.checkMaxItems();
    }), this.$emit("selectionchange", { bubbles: !1 }));
  }
  handleRegionLoaded(e) {
    R.queueUpdate(() => {
      this.setFocusedOption(0), this.$emit("menuloaded", { bubbles: !1 });
    });
  }
  checkMaxItems() {
    if (this.inputElement !== void 0)
      if (this.maxSelected !== void 0 && this.selectedItems.length >= this.maxSelected) {
        if (document.activeElement === this.inputElement) {
          const e = Array.from(this.listElement.querySelectorAll("[role='listitem']"));
          e[e.length - 1].focus();
        }
        this.inputElement.hidden = !0;
      } else
        this.inputElement.hidden = !1;
  }
  handleItemInvoke(e) {
    if (e.defaultPrevented)
      return !1;
    if (e.target instanceof go) {
      const o = Array.from(this.listElement.querySelectorAll("[role='listitem']")).indexOf(e.target);
      if (o !== -1) {
        const s = this.selectedItems.slice();
        s.splice(o, 1), this.selection = s.toString(), R.queueUpdate(() => this.incrementFocusedItem(0));
      }
      return !1;
    }
    return !0;
  }
  handleOptionInvoke(e) {
    return e.defaultPrevented ? !1 : e.target instanceof fo ? (e.target.value !== void 0 && (this.selection = `${this.selection}${this.selection === "" ? "" : ","}${e.target.value}`), this.inputElement.value = "", this.query = "", this.inputElement.focus(), this.toggleFlyout(!1), !1) : !0;
  }
  incrementFocusedItem(e) {
    if (this.selectedItems.length === 0) {
      this.inputElement.focus();
      return;
    }
    const t = Array.from(this.listElement.querySelectorAll("[role='listitem']"));
    if (document.activeElement !== null) {
      let o = t.indexOf(document.activeElement);
      o === -1 && (o = t.length);
      const s = Math.min(t.length, Math.max(0, o + e));
      s === t.length ? this.maxSelected !== void 0 && this.selectedItems.length >= this.maxSelected ? t[s - 1].focus() : this.inputElement.focus() : t[s].focus();
    }
  }
  disableMenu() {
    var e, t, o;
    this.menuFocusIndex = -1, this.menuFocusOptionId = void 0, (e = this.inputElement) === null || e === void 0 || e.removeAttribute("aria-activedescendant"), (t = this.inputElement) === null || t === void 0 || t.removeAttribute("aria-owns"), (o = this.inputElement) === null || o === void 0 || o.removeAttribute("aria-expanded");
  }
  setFocusedOption(e) {
    if (!this.flyoutOpen || e === -1 || this.showNoOptions || this.showLoading) {
      this.disableMenu();
      return;
    }
    if (this.menuElement.optionElements.length === 0)
      return;
    this.menuElement.optionElements.forEach((o) => {
      o.setAttribute("aria-selected", "false");
    }), this.menuFocusIndex = e, this.menuFocusIndex > this.menuElement.optionElements.length - 1 && (this.menuFocusIndex = this.menuElement.optionElements.length - 1), this.menuFocusOptionId = this.menuElement.optionElements[this.menuFocusIndex].id, this.inputElement.setAttribute("aria-owns", this.menuId), this.inputElement.setAttribute("aria-expanded", "true"), this.inputElement.setAttribute("aria-activedescendant", this.menuFocusOptionId);
    const t = this.menuElement.optionElements[this.menuFocusIndex];
    t.setAttribute("aria-selected", "true"), this.menuElement.scrollTo(0, t.offsetTop);
  }
  updateListItemTemplate() {
    var e;
    this.activeListItemTemplate = (e = this.listItemTemplate) !== null && e !== void 0 ? e : this.defaultListItemTemplate;
  }
  updateOptionTemplate() {
    var e;
    this.activeMenuOptionTemplate = (e = this.menuOptionTemplate) !== null && e !== void 0 ? e : this.defaultMenuOptionTemplate;
  }
  updateFilteredOptions() {
    this.filteredOptionsList = this.optionsList.slice(0), this.filterSelected && (this.filteredOptionsList = this.filteredOptionsList.filter((e) => this.selectedItems.indexOf(e) === -1)), this.filterQuery && this.query !== "" && this.query !== void 0 && (this.filteredOptionsList = this.filteredOptionsList.filter((e) => e.indexOf(this.query) !== -1));
  }
  updateMenuConfig() {
    let e = this.configLookup[this.menuPlacement];
    e === null && (e = ar), this.menuConfig = Object.assign(Object.assign({}, e), { autoUpdateMode: "auto", fixedPlacement: !0, horizontalViewportLock: !1, verticalViewportLock: !1 });
  }
}
a([
  h({ attribute: "selection" })
], X.prototype, "selection", void 0);
a([
  h({ attribute: "options" })
], X.prototype, "options", void 0);
a([
  h({ attribute: "filter-selected", mode: "boolean" })
], X.prototype, "filterSelected", void 0);
a([
  h({ attribute: "filter-query", mode: "boolean" })
], X.prototype, "filterQuery", void 0);
a([
  h({ attribute: "max-selected" })
], X.prototype, "maxSelected", void 0);
a([
  h({ attribute: "no-suggestions-text" })
], X.prototype, "noSuggestionsText", void 0);
a([
  h({ attribute: "suggestions-available-text" })
], X.prototype, "suggestionsAvailableText", void 0);
a([
  h({ attribute: "loading-text" })
], X.prototype, "loadingText", void 0);
a([
  h({ attribute: "label" })
], X.prototype, "label", void 0);
a([
  h({ attribute: "labelledby" })
], X.prototype, "labelledBy", void 0);
a([
  h({ attribute: "placeholder" })
], X.prototype, "placeholder", void 0);
a([
  h({ attribute: "menu-placement" })
], X.prototype, "menuPlacement", void 0);
a([
  g
], X.prototype, "showLoading", void 0);
a([
  g
], X.prototype, "listItemTemplate", void 0);
a([
  g
], X.prototype, "defaultListItemTemplate", void 0);
a([
  g
], X.prototype, "activeListItemTemplate", void 0);
a([
  g
], X.prototype, "menuOptionTemplate", void 0);
a([
  g
], X.prototype, "defaultMenuOptionTemplate", void 0);
a([
  g
], X.prototype, "activeMenuOptionTemplate", void 0);
a([
  g
], X.prototype, "listItemContentsTemplate", void 0);
a([
  g
], X.prototype, "menuOptionContentsTemplate", void 0);
a([
  g
], X.prototype, "optionsList", void 0);
a([
  g
], X.prototype, "query", void 0);
a([
  g
], X.prototype, "filteredOptionsList", void 0);
a([
  g
], X.prototype, "flyoutOpen", void 0);
a([
  g
], X.prototype, "menuId", void 0);
a([
  g
], X.prototype, "selectedListTag", void 0);
a([
  g
], X.prototype, "menuTag", void 0);
a([
  g
], X.prototype, "menuFocusIndex", void 0);
a([
  g
], X.prototype, "menuFocusOptionId", void 0);
a([
  g
], X.prototype, "showNoOptions", void 0);
a([
  g
], X.prototype, "menuConfig", void 0);
a([
  g
], X.prototype, "selectedItems", void 0);
const nu = (i, e) => v`
        <template role="list" slot="menu-region">
            <div class="options-display" part="options-display">
                <div class="header-region" part="header-region">
                    <slot name="header-region" ${ee("headerElements")}></slot>
                </div>

                <slot ${ee("menuElements")}></slot>
                <div class="footer-region" part="footer-region">
                    <slot name="footer-region" ${ee("footerElements")}></slot>
                </div>
                <div
                    role="alert"
                    aria-live="polite"
                    part="suggestions-available-alert"
                    class="suggestions-available-alert"
                >
                    ${(t) => t.suggestionsAvailableText}
                </div>
            </div>
        </template>
    `, ru = (i, e) => v`
        <template
            role="listitem"
            tabindex="-1"
            @click="${(t, o) => t.handleClick(o.event)}"
        >
            <slot></slot>
        </template>
    `, au = (i, e) => v`
        <template slot="list-region" role="list" class="picker-list">
            <slot></slot>
            <slot name="input-region"></slot>
        </template>
    `, lu = (i, e) => v`
        <template
            role="listitem"
            tabindex="0"
            @click="${(t, o) => t.handleClick(o.event)}"
            @keydown="${(t, o) => t.handleKeyDown(o.event)}"
        >
            <slot></slot>
        </template>
    `, De = {
  menuitem: "menuitem",
  menuitemcheckbox: "menuitemcheckbox",
  menuitemradio: "menuitemradio"
}, cu = {
  [De.menuitem]: "menuitem",
  [De.menuitemcheckbox]: "menuitemcheckbox",
  [De.menuitemradio]: "menuitemradio"
};
class it extends O {
  constructor() {
    super(...arguments), this.role = De.menuitem, this.hasSubmenu = !1, this.currentDirection = oe.ltr, this.focusSubmenuOnLoad = !1, this.handleMenuItemKeyDown = (e) => {
      if (e.defaultPrevented)
        return !1;
      switch (e.key) {
        case st:
        case ei:
          return this.invoke(), !1;
        case Ct:
          return this.expandAndFocus(), !1;
        case kt:
          if (this.expanded)
            return this.expanded = !1, this.focus(), !1;
      }
      return !0;
    }, this.handleMenuItemClick = (e) => (e.defaultPrevented || this.disabled || this.invoke(), !1), this.submenuLoaded = () => {
      this.focusSubmenuOnLoad && (this.focusSubmenuOnLoad = !1, this.hasSubmenu && (this.submenu.focus(), this.setAttribute("tabindex", "-1")));
    }, this.handleMouseOver = (e) => (this.disabled || !this.hasSubmenu || this.expanded || (this.expanded = !0), !1), this.handleMouseOut = (e) => (!this.expanded || this.contains(document.activeElement) || (this.expanded = !1), !1), this.expandAndFocus = () => {
      this.hasSubmenu && (this.focusSubmenuOnLoad = !0, this.expanded = !0);
    }, this.invoke = () => {
      if (!this.disabled)
        switch (this.role) {
          case De.menuitemcheckbox:
            this.checked = !this.checked;
            break;
          case De.menuitem:
            this.updateSubmenu(), this.hasSubmenu ? this.expandAndFocus() : this.$emit("change");
            break;
          case De.menuitemradio:
            this.checked || (this.checked = !0);
            break;
        }
    }, this.updateSubmenu = () => {
      this.submenu = this.domChildren().find((e) => e.getAttribute("role") === "menu"), this.hasSubmenu = this.submenu !== void 0;
    };
  }
  expandedChanged(e) {
    if (this.$fastController.isConnected) {
      if (this.submenu === void 0)
        return;
      this.expanded === !1 ? this.submenu.collapseExpandedItem() : this.currentDirection = Qt(this), this.$emit("expanded-change", this, { bubbles: !1 });
    }
  }
  checkedChanged(e, t) {
    this.$fastController.isConnected && this.$emit("change");
  }
  connectedCallback() {
    super.connectedCallback(), R.queueUpdate(() => {
      this.updateSubmenu();
    }), this.startColumnCount || (this.startColumnCount = 1), this.observer = new MutationObserver(this.updateSubmenu);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.submenu = void 0, this.observer !== void 0 && (this.observer.disconnect(), this.observer = void 0);
  }
  domChildren() {
    return Array.from(this.children).filter((e) => !e.hasAttribute("hidden"));
  }
}
a([
  h({ mode: "boolean" })
], it.prototype, "disabled", void 0);
a([
  h({ mode: "boolean" })
], it.prototype, "expanded", void 0);
a([
  g
], it.prototype, "startColumnCount", void 0);
a([
  h
], it.prototype, "role", void 0);
a([
  h({ mode: "boolean" })
], it.prototype, "checked", void 0);
a([
  g
], it.prototype, "submenuRegion", void 0);
a([
  g
], it.prototype, "hasSubmenu", void 0);
a([
  g
], it.prototype, "currentDirection", void 0);
a([
  g
], it.prototype, "submenu", void 0);
ae(it, He);
const du = (i, e) => v`
    <template
        role="${(t) => t.role}"
        aria-haspopup="${(t) => t.hasSubmenu ? "menu" : void 0}"
        aria-checked="${(t) => t.role !== De.menuitem ? t.checked : void 0}"
        aria-disabled="${(t) => t.disabled}"
        aria-expanded="${(t) => t.expanded}"
        @keydown="${(t, o) => t.handleMenuItemKeyDown(o.event)}"
        @click="${(t, o) => t.handleMenuItemClick(o.event)}"
        @mouseover="${(t, o) => t.handleMouseOver(o.event)}"
        @mouseout="${(t, o) => t.handleMouseOut(o.event)}"
        class="${(t) => t.disabled ? "disabled" : ""} ${(t) => t.expanded ? "expanded" : ""} ${(t) => `indent-${t.startColumnCount}`}"
    >
            ${Q((t) => t.role === De.menuitemcheckbox, v`
                    <div part="input-container" class="input-container">
                        <span part="checkbox" class="checkbox">
                            <slot name="checkbox-indicator">
                                ${e.checkboxIndicator || ""}
                            </slot>
                        </span>
                    </div>
                `)}
            ${Q((t) => t.role === De.menuitemradio, v`
                    <div part="input-container" class="input-container">
                        <span part="radio" class="radio">
                            <slot name="radio-indicator">
                                ${e.radioIndicator || ""}
                            </slot>
                        </span>
                    </div>
                `)}
        </div>
        ${Ae(i, e)}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${Le(i, e)}
        ${Q((t) => t.hasSubmenu, v`
                <div
                    part="expand-collapse-glyph-container"
                    class="expand-collapse-glyph-container"
                >
                    <span part="expand-collapse" class="expand-collapse">
                        <slot name="expand-collapse-indicator">
                            ${e.expandCollapseGlyph || ""}
                        </slot>
                    </span>
                </div>
            `)}
        ${Q((t) => t.expanded, v`
                <${i.tagFor(W)}
                    :anchorElement="${(t) => t}"
                    vertical-positioning-mode="dynamic"
                    vertical-default-position="bottom"
                    vertical-inset="true"
                    horizontal-positioning-mode="dynamic"
                    horizontal-default-position="end"
                    class="submenu-region"
                    dir="${(t) => t.currentDirection}"
                    @loaded="${(t) => t.submenuLoaded()}"
                    ${U("submenuRegion")}
                    part="submenu-region"
                >
                    <slot name="submenu"></slot>
                </${i.tagFor(W)}>
            `)}
    </template>
`, hu = (i, e) => v`
    <template
        slot="${(t) => t.slot ? t.slot : t.isNestedMenu() ? "submenu" : void 0}"
        role="menu"
        @keydown="${(t, o) => t.handleMenuKeyDown(o.event)}"
        @focusout="${(t, o) => t.handleFocusOut(o.event)}"
    >
        <slot ${ee("items")}></slot>
    </template>
`;
let Zo = class extends O {
  constructor() {
    super(...arguments), this.expandedItem = null, this.focusIndex = -1, this.isNestedMenu = () => this.parentElement !== null && ki(this.parentElement) && this.parentElement.getAttribute("role") === "menuitem", this.handleFocusOut = (e) => {
      if (!this.contains(e.relatedTarget) && this.menuItems !== void 0) {
        this.collapseExpandedItem();
        const t = this.menuItems.findIndex(this.isFocusableElement);
        this.menuItems[this.focusIndex].setAttribute("tabindex", "-1"), this.menuItems[t].setAttribute("tabindex", "0"), this.focusIndex = t;
      }
    }, this.handleItemFocus = (e) => {
      const t = e.target;
      this.menuItems !== void 0 && t !== this.menuItems[this.focusIndex] && (this.menuItems[this.focusIndex].setAttribute("tabindex", "-1"), this.focusIndex = this.menuItems.indexOf(t), t.setAttribute("tabindex", "0"));
    }, this.handleExpandedChanged = (e) => {
      if (e.defaultPrevented || e.target === null || this.menuItems === void 0 || this.menuItems.indexOf(e.target) < 0)
        return;
      e.preventDefault();
      const t = e.target;
      if (this.expandedItem !== null && t === this.expandedItem && t.expanded === !1) {
        this.expandedItem = null;
        return;
      }
      t.expanded && (this.expandedItem !== null && this.expandedItem !== t && (this.expandedItem.expanded = !1), this.menuItems[this.focusIndex].setAttribute("tabindex", "-1"), this.expandedItem = t, this.focusIndex = this.menuItems.indexOf(t), t.setAttribute("tabindex", "0"));
    }, this.removeItemListeners = () => {
      this.menuItems !== void 0 && this.menuItems.forEach((e) => {
        e.removeEventListener("expanded-change", this.handleExpandedChanged), e.removeEventListener("focus", this.handleItemFocus);
      });
    }, this.setItems = () => {
      const e = this.domChildren();
      this.removeItemListeners(), this.menuItems = e;
      const t = this.menuItems.filter(this.isMenuItemElement);
      t.length && (this.focusIndex = 0);
      function o(n) {
        const r = n.getAttribute("role"), l = n.querySelector("[slot=start]");
        return r !== De.menuitem && l === null || r === De.menuitem && l !== null ? 1 : r !== De.menuitem && l !== null ? 2 : 0;
      }
      const s = t.reduce((n, r) => {
        const l = o(r);
        return n > l ? n : l;
      }, 0);
      t.forEach((n, r) => {
        n.setAttribute("tabindex", r === 0 ? "0" : "-1"), n.addEventListener("expanded-change", this.handleExpandedChanged), n.addEventListener("focus", this.handleItemFocus), n instanceof it && (n.startColumnCount = s);
      });
    }, this.changeHandler = (e) => {
      if (this.menuItems === void 0)
        return;
      const t = e.target, o = this.menuItems.indexOf(t);
      if (o !== -1 && t.role === "menuitemradio" && t.checked === !0) {
        for (let n = o - 1; n >= 0; --n) {
          const r = this.menuItems[n], l = r.getAttribute("role");
          if (l === De.menuitemradio && (r.checked = !1), l === "separator")
            break;
        }
        const s = this.menuItems.length - 1;
        for (let n = o + 1; n <= s; ++n) {
          const r = this.menuItems[n], l = r.getAttribute("role");
          if (l === De.menuitemradio && (r.checked = !1), l === "separator")
            break;
        }
      }
    }, this.isMenuItemElement = (e) => ki(e) && Zo.focusableElementRoles.hasOwnProperty(e.getAttribute("role")), this.isFocusableElement = (e) => this.isMenuItemElement(e);
  }
  itemsChanged(e, t) {
    this.$fastController.isConnected && this.menuItems !== void 0 && this.setItems();
  }
  connectedCallback() {
    super.connectedCallback(), R.queueUpdate(() => {
      this.setItems();
    }), this.addEventListener("change", this.changeHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeItemListeners(), this.menuItems = void 0, this.removeEventListener("change", this.changeHandler);
  }
  focus() {
    this.setFocus(0, 1);
  }
  collapseExpandedItem() {
    this.expandedItem !== null && (this.expandedItem.expanded = !1, this.expandedItem = null);
  }
  handleMenuKeyDown(e) {
    if (!(e.defaultPrevented || this.menuItems === void 0))
      switch (e.key) {
        case _e:
          this.setFocus(this.focusIndex + 1, 1);
          return;
        case Ue:
          this.setFocus(this.focusIndex - 1, -1);
          return;
        case pt:
          this.setFocus(this.menuItems.length - 1, -1);
          return;
        case ut:
          this.setFocus(0, 1);
          return;
        default:
          return !0;
      }
  }
  domChildren() {
    return Array.from(this.children).filter((e) => !e.hasAttribute("hidden"));
  }
  setFocus(e, t) {
    if (this.menuItems !== void 0)
      for (; e >= 0 && e < this.menuItems.length; ) {
        const o = this.menuItems[e];
        if (this.isFocusableElement(o)) {
          this.focusIndex > -1 && this.menuItems.length >= this.focusIndex - 1 && this.menuItems[this.focusIndex].setAttribute("tabindex", "-1"), this.focusIndex = e, o.setAttribute("tabindex", "0"), o.focus();
          break;
        }
        e += t;
      }
  }
};
Zo.focusableElementRoles = cu;
a([
  g
], Zo.prototype, "items", void 0);
const uu = (i, e) => v`
    <template class="${(t) => t.readOnly ? "readonly" : ""}">
        <label
            part="label"
            for="control"
            class="${(t) => t.defaultSlottedNodes && t.defaultSlottedNodes.length ? "label" : "label label__hidden"}"
        >
            <slot ${ee("defaultSlottedNodes")}></slot>
        </label>
        <div class="root" part="root">
            ${Ae(i, e)}
            <input
                class="control"
                part="control"
                id="control"
                @input="${(t) => t.handleTextInput()}"
                @change="${(t) => t.handleChange()}"
                @keydown="${(t, o) => t.handleKeyDown(o.event)}"
                @blur="${(t, o) => t.handleBlur()}"
                ?autofocus="${(t) => t.autofocus}"
                ?disabled="${(t) => t.disabled}"
                list="${(t) => t.list}"
                maxlength="${(t) => t.maxlength}"
                minlength="${(t) => t.minlength}"
                placeholder="${(t) => t.placeholder}"
                ?readonly="${(t) => t.readOnly}"
                ?required="${(t) => t.required}"
                size="${(t) => t.size}"
                type="text"
                inputmode="numeric"
                min="${(t) => t.min}"
                max="${(t) => t.max}"
                step="${(t) => t.step}"
                aria-atomic="${(t) => t.ariaAtomic}"
                aria-busy="${(t) => t.ariaBusy}"
                aria-controls="${(t) => t.ariaControls}"
                aria-current="${(t) => t.ariaCurrent}"
                aria-describedby="${(t) => t.ariaDescribedby}"
                aria-details="${(t) => t.ariaDetails}"
                aria-disabled="${(t) => t.ariaDisabled}"
                aria-errormessage="${(t) => t.ariaErrormessage}"
                aria-flowto="${(t) => t.ariaFlowto}"
                aria-haspopup="${(t) => t.ariaHaspopup}"
                aria-hidden="${(t) => t.ariaHidden}"
                aria-invalid="${(t) => t.ariaInvalid}"
                aria-keyshortcuts="${(t) => t.ariaKeyshortcuts}"
                aria-label="${(t) => t.ariaLabel}"
                aria-labelledby="${(t) => t.ariaLabelledby}"
                aria-live="${(t) => t.ariaLive}"
                aria-owns="${(t) => t.ariaOwns}"
                aria-relevant="${(t) => t.ariaRelevant}"
                aria-roledescription="${(t) => t.ariaRoledescription}"
                ${U("control")}
            />
            ${Q((t) => !t.hideStep && !t.readOnly && !t.disabled, v`
                    <div class="controls" part="controls">
                        <div class="step-up" part="step-up" @click="${(t) => t.stepUp()}">
                            <slot name="step-up-glyph">
                                ${e.stepUpGlyph || ""}
                            </slot>
                        </div>
                        <div
                            class="step-down"
                            part="step-down"
                            @click="${(t) => t.stepDown()}"
                        >
                            <slot name="step-down-glyph">
                                ${e.stepDownGlyph || ""}
                            </slot>
                        </div>
                    </div>
                `)}
            ${Le(i, e)}
        </div>
    </template>
`;
class pu extends O {
}
class fu extends ft(pu) {
  constructor() {
    super(...arguments), this.proxy = document.createElement("input");
  }
}
const gu = {
  email: "email",
  password: "password",
  tel: "tel",
  text: "text",
  url: "url"
};
let ze = class extends fu {
  constructor() {
    super(...arguments), this.type = gu.text;
  }
  readOnlyChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.readOnly = this.readOnly, this.validate());
  }
  autofocusChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.autofocus = this.autofocus, this.validate());
  }
  placeholderChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.placeholder = this.placeholder);
  }
  typeChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.type = this.type, this.validate());
  }
  listChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.setAttribute("list", this.list), this.validate());
  }
  maxlengthChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.maxLength = this.maxlength, this.validate());
  }
  minlengthChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.minLength = this.minlength, this.validate());
  }
  patternChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.pattern = this.pattern, this.validate());
  }
  sizeChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.size = this.size);
  }
  spellcheckChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.spellcheck = this.spellcheck);
  }
  connectedCallback() {
    super.connectedCallback(), this.proxy.setAttribute("type", this.type), this.validate(), this.autofocus && R.queueUpdate(() => {
      this.focus();
    });
  }
  select() {
    this.control.select(), this.$emit("select");
  }
  handleTextInput() {
    this.value = this.control.value;
  }
  handleChange() {
    this.$emit("change");
  }
  validate() {
    super.validate(this.control);
  }
};
a([
  h({ attribute: "readonly", mode: "boolean" })
], ze.prototype, "readOnly", void 0);
a([
  h({ mode: "boolean" })
], ze.prototype, "autofocus", void 0);
a([
  h
], ze.prototype, "placeholder", void 0);
a([
  h
], ze.prototype, "type", void 0);
a([
  h
], ze.prototype, "list", void 0);
a([
  h({ converter: C })
], ze.prototype, "maxlength", void 0);
a([
  h({ converter: C })
], ze.prototype, "minlength", void 0);
a([
  h
], ze.prototype, "pattern", void 0);
a([
  h({ converter: C })
], ze.prototype, "size", void 0);
a([
  h({ mode: "boolean" })
], ze.prototype, "spellcheck", void 0);
a([
  g
], ze.prototype, "defaultSlottedNodes", void 0);
class Jo {
}
ae(Jo, se);
ae(ze, He, Jo);
class mu extends O {
}
class bu extends ft(mu) {
  constructor() {
    super(...arguments), this.proxy = document.createElement("input");
  }
}
let Pe = class extends bu {
  constructor() {
    super(...arguments), this.hideStep = !1, this.step = 1, this.isUserInput = !1;
  }
  maxChanged(e, t) {
    var o;
    this.max = Math.max(t, (o = this.min) !== null && o !== void 0 ? o : t);
    const s = Math.min(this.min, this.max);
    this.min !== void 0 && this.min !== s && (this.min = s), this.value = this.getValidValue(this.value);
  }
  minChanged(e, t) {
    var o;
    this.min = Math.min(t, (o = this.max) !== null && o !== void 0 ? o : t);
    const s = Math.max(this.min, this.max);
    this.max !== void 0 && this.max !== s && (this.max = s), this.value = this.getValidValue(this.value);
  }
  get valueAsNumber() {
    return parseFloat(super.value);
  }
  set valueAsNumber(e) {
    this.value = e.toString();
  }
  valueChanged(e, t) {
    this.value = this.getValidValue(t), t === this.value && (this.control && !this.isUserInput && (this.control.value = this.value), super.valueChanged(e, this.value), e !== void 0 && !this.isUserInput && (this.$emit("input"), this.$emit("change")), this.isUserInput = !1);
  }
  validate() {
    super.validate(this.control);
  }
  getValidValue(e) {
    var t, o;
    let s = parseFloat(parseFloat(e).toPrecision(12));
    return isNaN(s) ? s = "" : (s = Math.min(s, (t = this.max) !== null && t !== void 0 ? t : s), s = Math.max(s, (o = this.min) !== null && o !== void 0 ? o : s).toString()), s;
  }
  stepUp() {
    const e = parseFloat(this.value), t = isNaN(e) ? this.min > 0 ? this.min : this.max < 0 ? this.max : this.min ? 0 : this.step : e + this.step;
    this.value = t.toString();
  }
  stepDown() {
    const e = parseFloat(this.value), t = isNaN(e) ? this.min > 0 ? this.min : this.max < 0 ? this.max : this.min ? 0 : 0 - this.step : e - this.step;
    this.value = t.toString();
  }
  connectedCallback() {
    super.connectedCallback(), this.proxy.setAttribute("type", "number"), this.validate(), this.control.value = this.value, this.autofocus && R.queueUpdate(() => {
      this.focus();
    });
  }
  select() {
    this.control.select(), this.$emit("select");
  }
  handleTextInput() {
    this.control.value = this.control.value.replace(/[^0-9\-+e.]/g, ""), this.isUserInput = !0, this.value = this.control.value;
  }
  handleChange() {
    this.$emit("change");
  }
  handleKeyDown(e) {
    switch (e.key) {
      case Ue:
        return this.stepUp(), !1;
      case _e:
        return this.stepDown(), !1;
    }
    return !0;
  }
  handleBlur() {
    this.control.value = this.value;
  }
};
a([
  h({ attribute: "readonly", mode: "boolean" })
], Pe.prototype, "readOnly", void 0);
a([
  h({ mode: "boolean" })
], Pe.prototype, "autofocus", void 0);
a([
  h({ attribute: "hide-step", mode: "boolean" })
], Pe.prototype, "hideStep", void 0);
a([
  h
], Pe.prototype, "placeholder", void 0);
a([
  h
], Pe.prototype, "list", void 0);
a([
  h({ converter: C })
], Pe.prototype, "maxlength", void 0);
a([
  h({ converter: C })
], Pe.prototype, "minlength", void 0);
a([
  h({ converter: C })
], Pe.prototype, "size", void 0);
a([
  h({ converter: C })
], Pe.prototype, "step", void 0);
a([
  h({ converter: C })
], Pe.prototype, "max", void 0);
a([
  h({ converter: C })
], Pe.prototype, "min", void 0);
a([
  g
], Pe.prototype, "defaultSlottedNodes", void 0);
ae(Pe, He, Jo);
const gr = 44, vu = (i, e) => v`
    <template
        role="progressbar"
        aria-valuenow="${(t) => t.value}"
        aria-valuemin="${(t) => t.min}"
        aria-valuemax="${(t) => t.max}"
        class="${(t) => t.paused ? "paused" : ""}"
    >
        ${Q((t) => typeof t.value == "number", v`
                <svg
                    class="progress"
                    part="progress"
                    viewBox="0 0 16 16"
                    slot="determinate"
                >
                    <circle
                        class="background"
                        part="background"
                        cx="8px"
                        cy="8px"
                        r="7px"
                    ></circle>
                    <circle
                        class="determinate"
                        part="determinate"
                        style="stroke-dasharray: ${(t) => gr * t.percentComplete / 100}px ${gr}px"
                        cx="8px"
                        cy="8px"
                        r="7px"
                    ></circle>
                </svg>
            `)}
        ${Q((t) => typeof t.value != "number", v`
                <slot name="indeterminate" slot="indeterminate">
                    ${e.indeterminateIndicator || ""}
                </slot>
            `)}
    </template>
`;
class oi extends O {
  constructor() {
    super(...arguments), this.percentComplete = 0;
  }
  valueChanged() {
    this.$fastController.isConnected && this.updatePercentComplete();
  }
  minChanged() {
    this.$fastController.isConnected && this.updatePercentComplete();
  }
  maxChanged() {
    this.$fastController.isConnected && this.updatePercentComplete();
  }
  connectedCallback() {
    super.connectedCallback(), this.updatePercentComplete();
  }
  updatePercentComplete() {
    const e = typeof this.min == "number" ? this.min : 0, t = typeof this.max == "number" ? this.max : 100, o = typeof this.value == "number" ? this.value : 0, s = t - e;
    this.percentComplete = s === 0 ? 0 : Math.fround((o - e) / s * 100);
  }
}
a([
  h({ converter: C })
], oi.prototype, "value", void 0);
a([
  h({ converter: C })
], oi.prototype, "min", void 0);
a([
  h({ converter: C })
], oi.prototype, "max", void 0);
a([
  h({ mode: "boolean" })
], oi.prototype, "paused", void 0);
a([
  g
], oi.prototype, "percentComplete", void 0);
const yu = (i, e) => v`
    <template
        role="progressbar"
        aria-valuenow="${(t) => t.value}"
        aria-valuemin="${(t) => t.min}"
        aria-valuemax="${(t) => t.max}"
        class="${(t) => t.paused ? "paused" : ""}"
    >
        ${Q((t) => typeof t.value == "number", v`
                <div class="progress" part="progress" slot="determinate">
                    <div
                        class="determinate"
                        part="determinate"
                        style="width: ${(t) => t.percentComplete}%"
                    ></div>
                </div>
            `)}
        ${Q((t) => typeof t.value != "number", v`
                <div class="progress" part="progress" slot="indeterminate">
                    <slot class="indeterminate" name="indeterminate">
                        ${e.indeterminateIndicator1 || ""}
                        ${e.indeterminateIndicator2 || ""}
                    </slot>
                </div>
            `)}
    </template>
`, xu = (i, e) => v`
    <template
        role="radiogroup"
        aria-disabled="${(t) => t.disabled}"
        aria-readonly="${(t) => t.readOnly}"
        @click="${(t, o) => t.clickHandler(o.event)}"
        @keydown="${(t, o) => t.keydownHandler(o.event)}"
        @focusout="${(t, o) => t.focusOutHandler(o.event)}"
    >
        <slot name="label"></slot>
        <div
            class="positioning-region ${(t) => t.orientation === ce.horizontal ? "horizontal" : "vertical"}"
            part="positioning-region"
        >
            <slot
                ${ee({
  property: "slottedRadioButtons",
  filter: wt("[role=radio]")
})}
            ></slot>
        </div>
    </template>
`;
class Nt extends O {
  constructor() {
    super(...arguments), this.orientation = ce.horizontal, this.radioChangeHandler = (e) => {
      const t = e.target;
      t.checked && (this.slottedRadioButtons.forEach((o) => {
        o !== t && (o.checked = !1, this.isInsideFoundationToolbar || o.setAttribute("tabindex", "-1"));
      }), this.selectedRadio = t, this.value = t.value, t.setAttribute("tabindex", "0"), this.focusedRadio = t), e.stopPropagation();
    }, this.moveToRadioByIndex = (e, t) => {
      const o = e[t];
      this.isInsideToolbar || (o.setAttribute("tabindex", "0"), o.readOnly ? this.slottedRadioButtons.forEach((s) => {
        s !== o && s.setAttribute("tabindex", "-1");
      }) : (o.checked = !0, this.selectedRadio = o)), this.focusedRadio = o, o.focus();
    }, this.moveRightOffGroup = () => {
      var e;
      (e = this.nextElementSibling) === null || e === void 0 || e.focus();
    }, this.moveLeftOffGroup = () => {
      var e;
      (e = this.previousElementSibling) === null || e === void 0 || e.focus();
    }, this.focusOutHandler = (e) => {
      const t = this.slottedRadioButtons, o = e.target, s = o !== null ? t.indexOf(o) : 0, n = this.focusedRadio ? t.indexOf(this.focusedRadio) : -1;
      return (n === 0 && s === n || n === t.length - 1 && n === s) && (this.selectedRadio ? (this.focusedRadio = this.selectedRadio, this.isInsideFoundationToolbar || (this.selectedRadio.setAttribute("tabindex", "0"), t.forEach((r) => {
        r !== this.selectedRadio && r.setAttribute("tabindex", "-1");
      }))) : (this.focusedRadio = t[0], this.focusedRadio.setAttribute("tabindex", "0"), t.forEach((r) => {
        r !== this.focusedRadio && r.setAttribute("tabindex", "-1");
      }))), !0;
    }, this.clickHandler = (e) => {
      const t = e.target;
      if (t) {
        const o = this.slottedRadioButtons;
        t.checked || o.indexOf(t) === 0 ? (t.setAttribute("tabindex", "0"), this.selectedRadio = t) : (t.setAttribute("tabindex", "-1"), this.selectedRadio = null), this.focusedRadio = t;
      }
      e.preventDefault();
    }, this.shouldMoveOffGroupToTheRight = (e, t, o) => e === t.length && this.isInsideToolbar && o === Ct, this.shouldMoveOffGroupToTheLeft = (e, t) => (this.focusedRadio ? e.indexOf(this.focusedRadio) - 1 : 0) < 0 && this.isInsideToolbar && t === kt, this.checkFocusedRadio = () => {
      this.focusedRadio !== null && !this.focusedRadio.readOnly && !this.focusedRadio.checked && (this.focusedRadio.checked = !0, this.focusedRadio.setAttribute("tabindex", "0"), this.focusedRadio.focus(), this.selectedRadio = this.focusedRadio);
    }, this.moveRight = (e) => {
      const t = this.slottedRadioButtons;
      let o = 0;
      if (o = this.focusedRadio ? t.indexOf(this.focusedRadio) + 1 : 1, this.shouldMoveOffGroupToTheRight(o, t, e.key)) {
        this.moveRightOffGroup();
        return;
      } else
        o === t.length && (o = 0);
      for (; o < t.length && t.length > 1; )
        if (t[o].disabled) {
          if (this.focusedRadio && o === t.indexOf(this.focusedRadio))
            break;
          if (o + 1 >= t.length) {
            if (this.isInsideToolbar)
              break;
            o = 0;
          } else
            o += 1;
        } else {
          this.moveToRadioByIndex(t, o);
          break;
        }
    }, this.moveLeft = (e) => {
      const t = this.slottedRadioButtons;
      let o = 0;
      if (o = this.focusedRadio ? t.indexOf(this.focusedRadio) - 1 : 0, o = o < 0 ? t.length - 1 : o, this.shouldMoveOffGroupToTheLeft(t, e.key)) {
        this.moveLeftOffGroup();
        return;
      }
      for (; o >= 0 && t.length > 1; )
        if (t[o].disabled) {
          if (this.focusedRadio && o === t.indexOf(this.focusedRadio))
            break;
          o - 1 < 0 ? o = t.length - 1 : o -= 1;
        } else {
          this.moveToRadioByIndex(t, o);
          break;
        }
    }, this.keydownHandler = (e) => {
      const t = e.key;
      if (t in bi && this.isInsideFoundationToolbar)
        return !0;
      switch (t) {
        case st: {
          this.checkFocusedRadio();
          break;
        }
        case Ct:
        case _e: {
          this.direction === oe.ltr ? this.moveRight(e) : this.moveLeft(e);
          break;
        }
        case kt:
        case Ue: {
          this.direction === oe.ltr ? this.moveLeft(e) : this.moveRight(e);
          break;
        }
        default:
          return !0;
      }
    };
  }
  readOnlyChanged() {
    this.slottedRadioButtons !== void 0 && this.slottedRadioButtons.forEach((e) => {
      this.readOnly ? e.readOnly = !0 : e.readOnly = !1;
    });
  }
  disabledChanged() {
    this.slottedRadioButtons !== void 0 && this.slottedRadioButtons.forEach((e) => {
      this.disabled ? e.disabled = !0 : e.disabled = !1;
    });
  }
  nameChanged() {
    this.slottedRadioButtons && this.slottedRadioButtons.forEach((e) => {
      e.setAttribute("name", this.name);
    });
  }
  valueChanged() {
    this.slottedRadioButtons && this.slottedRadioButtons.forEach((e) => {
      e.value === this.value && (e.checked = !0, this.selectedRadio = e);
    }), this.$emit("change");
  }
  slottedRadioButtonsChanged(e, t) {
    this.slottedRadioButtons && this.slottedRadioButtons.length > 0 && this.setupRadioButtons();
  }
  get parentToolbar() {
    return this.closest('[role="toolbar"]');
  }
  get isInsideToolbar() {
    var e;
    return (e = this.parentToolbar) !== null && e !== void 0 ? e : !1;
  }
  get isInsideFoundationToolbar() {
    var e;
    return !!(!((e = this.parentToolbar) === null || e === void 0) && e.$fastController);
  }
  connectedCallback() {
    super.connectedCallback(), this.direction = Qt(this), this.setupRadioButtons();
  }
  disconnectedCallback() {
    this.slottedRadioButtons.forEach((e) => {
      e.removeEventListener("change", this.radioChangeHandler);
    });
  }
  setupRadioButtons() {
    const e = this.slottedRadioButtons.filter((s) => s.hasAttribute("checked")), t = e ? e.length : 0;
    if (t > 1) {
      const s = e[t - 1];
      s.checked = !0;
    }
    let o = !1;
    if (this.slottedRadioButtons.forEach((s) => {
      this.name !== void 0 && s.setAttribute("name", this.name), this.disabled && (s.disabled = !0), this.readOnly && (s.readOnly = !0), this.value && this.value === s.value ? (this.selectedRadio = s, this.focusedRadio = s, s.checked = !0, s.setAttribute("tabindex", "0"), o = !0) : (this.isInsideFoundationToolbar || s.setAttribute("tabindex", "-1"), s.checked = !1), s.addEventListener("change", this.radioChangeHandler);
    }), this.value === void 0 && this.slottedRadioButtons.length > 0) {
      const s = this.slottedRadioButtons.filter((r) => r.hasAttribute("checked")), n = s !== null ? s.length : 0;
      if (n > 0 && !o) {
        const r = s[n - 1];
        r.checked = !0, this.focusedRadio = r, r.setAttribute("tabindex", "0");
      } else
        this.slottedRadioButtons[0].setAttribute("tabindex", "0"), this.focusedRadio = this.slottedRadioButtons[0];
    }
  }
}
a([
  h({ attribute: "readonly", mode: "boolean" })
], Nt.prototype, "readOnly", void 0);
a([
  h({ attribute: "disabled", mode: "boolean" })
], Nt.prototype, "disabled", void 0);
a([
  h
], Nt.prototype, "name", void 0);
a([
  h
], Nt.prototype, "value", void 0);
a([
  h
], Nt.prototype, "orientation", void 0);
a([
  g
], Nt.prototype, "childItems", void 0);
a([
  g
], Nt.prototype, "slottedRadioButtons", void 0);
const $u = (i, e) => v`
    <template
        role="radio"
        class="${(t) => t.checked ? "checked" : ""} ${(t) => t.readOnly ? "readonly" : ""}"
        aria-checked="${(t) => t.checked}"
        aria-required="${(t) => t.required}"
        aria-disabled="${(t) => t.disabled}"
        aria-readonly="${(t) => t.readOnly}"
        @keypress="${(t, o) => t.keypressHandler(o.event)}"
        @click="${(t, o) => t.clickHandler(o.event)}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                ${e.checkedIndicator || ""}
            </slot>
        </div>
        <label
            part="label"
            class="${(t) => t.defaultSlottedNodes && t.defaultSlottedNodes.length ? "label" : "label label__hidden"}"
        >
            <slot ${ee("defaultSlottedNodes")}></slot>
        </label>
    </template>
`;
class wu extends O {
}
class ku extends bn(wu) {
  constructor() {
    super(...arguments), this.proxy = document.createElement("input");
  }
}
class Ko extends ku {
  constructor() {
    super(), this.initialValue = "on", this.keypressHandler = (e) => {
      switch (e.key) {
        case ei:
          !this.checked && !this.readOnly && (this.checked = !0);
          return;
      }
      return !0;
    }, this.proxy.setAttribute("type", "radio");
  }
  readOnlyChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.readOnly = this.readOnly);
  }
  defaultCheckedChanged() {
    var e;
    this.$fastController.isConnected && !this.dirtyChecked && (this.isInsideRadioGroup() || (this.checked = (e = this.defaultChecked) !== null && e !== void 0 ? e : !1, this.dirtyChecked = !1));
  }
  connectedCallback() {
    var e, t;
    super.connectedCallback(), this.validate(), ((e = this.parentElement) === null || e === void 0 ? void 0 : e.getAttribute("role")) !== "radiogroup" && this.getAttribute("tabindex") === null && (this.disabled || this.setAttribute("tabindex", "0")), this.checkedAttribute && (this.dirtyChecked || this.isInsideRadioGroup() || (this.checked = (t = this.defaultChecked) !== null && t !== void 0 ? t : !1, this.dirtyChecked = !1));
  }
  isInsideRadioGroup() {
    return this.closest("[role=radiogroup]") !== null;
  }
  clickHandler(e) {
    !this.disabled && !this.readOnly && !this.checked && (this.checked = !0);
  }
}
a([
  h({ attribute: "readonly", mode: "boolean" })
], Ko.prototype, "readOnly", void 0);
a([
  g
], Ko.prototype, "name", void 0);
a([
  g
], Ko.prototype, "defaultSlottedNodes", void 0);
let Ft = class extends O {
  constructor() {
    super(...arguments), this.framesPerSecond = 60, this.updatingItems = !1, this.speed = 600, this.easing = "ease-in-out", this.flippersHiddenFromAT = !1, this.scrolling = !1, this.resizeDetector = null;
  }
  get frameTime() {
    return 1e3 / this.framesPerSecond;
  }
  scrollingChanged(e, t) {
    if (this.scrollContainer) {
      const o = this.scrolling == !0 ? "scrollstart" : "scrollend";
      this.$emit(o, this.scrollContainer.scrollLeft);
    }
  }
  get isRtl() {
    return this.scrollItems.length > 1 && this.scrollItems[0].offsetLeft > this.scrollItems[1].offsetLeft;
  }
  connectedCallback() {
    super.connectedCallback(), this.initializeResizeDetector();
  }
  disconnectedCallback() {
    this.disconnectResizeDetector(), super.disconnectedCallback();
  }
  scrollItemsChanged(e, t) {
    t && !this.updatingItems && R.queueUpdate(() => this.setStops());
  }
  disconnectResizeDetector() {
    this.resizeDetector && (this.resizeDetector.disconnect(), this.resizeDetector = null);
  }
  initializeResizeDetector() {
    this.disconnectResizeDetector(), this.resizeDetector = new window.ResizeObserver(this.resized.bind(this)), this.resizeDetector.observe(this);
  }
  updateScrollStops() {
    this.updatingItems = !0;
    const e = this.scrollItems.reduce((t, o) => o instanceof HTMLSlotElement ? t.concat(o.assignedElements()) : (t.push(o), t), []);
    this.scrollItems = e, this.updatingItems = !1;
  }
  setStops() {
    this.updateScrollStops();
    const { scrollContainer: e } = this, { scrollLeft: t } = e, { width: o, left: s } = e.getBoundingClientRect();
    this.width = o;
    let n = 0, r = this.scrollItems.map((l, c) => {
      const { left: u, width: p } = l.getBoundingClientRect(), f = Math.round(u + t - s), b = Math.round(f + p);
      return this.isRtl ? -b : (n = b, c === 0 ? 0 : f);
    }).concat(n);
    r = this.fixScrollMisalign(r), r.sort((l, c) => Math.abs(l) - Math.abs(c)), this.scrollStops = r, this.setFlippers();
  }
  fixScrollMisalign(e) {
    if (this.isRtl && e.some((t) => t > 0)) {
      e.sort((o, s) => s - o);
      const t = e[0];
      e = e.map((o) => o - t);
    }
    return e;
  }
  setFlippers() {
    var e, t;
    const o = this.scrollContainer.scrollLeft;
    if ((e = this.previousFlipperContainer) === null || e === void 0 || e.classList.toggle("disabled", o === 0), this.scrollStops) {
      const s = Math.abs(this.scrollStops[this.scrollStops.length - 1]);
      (t = this.nextFlipperContainer) === null || t === void 0 || t.classList.toggle("disabled", Math.abs(o) + this.width >= s);
    }
  }
  scrollInView(e, t = 0, o) {
    var s;
    if (typeof e != "number" && e && (e = this.scrollItems.findIndex((n) => n === e || n.contains(e))), e !== void 0) {
      o = o ?? t;
      const { scrollContainer: n, scrollStops: r, scrollItems: l } = this, { scrollLeft: c } = this.scrollContainer, { width: u } = n.getBoundingClientRect(), p = r[e], { width: f } = l[e].getBoundingClientRect(), b = p + f, I = c + t > p;
      if (I || c + u - o < b) {
        const k = (s = [...r].sort((L, te) => I ? te - L : L - te).find((L) => I ? L + t < p : L + u - (o ?? 0) > b)) !== null && s !== void 0 ? s : 0;
        this.scrollToPosition(k);
      }
    }
  }
  keyupHandler(e) {
    switch (e.key) {
      case "ArrowLeft":
        this.scrollToPrevious();
        break;
      case "ArrowRight":
        this.scrollToNext();
        break;
    }
  }
  scrollToPrevious() {
    const e = this.scrollContainer.scrollLeft, t = this.scrollStops.findIndex((n, r) => n >= e && (this.isRtl || r === this.scrollStops.length - 1 || this.scrollStops[r + 1] > e)), o = Math.abs(this.scrollStops[t + 1]);
    let s = this.scrollStops.findIndex((n) => Math.abs(n) + this.width > o);
    (s >= t || s === -1) && (s = t > 0 ? t - 1 : 0), this.scrollToPosition(this.scrollStops[s], e);
  }
  scrollToNext() {
    const e = this.scrollContainer.scrollLeft, t = this.scrollStops.findIndex((n) => Math.abs(n) >= Math.abs(e)), o = this.scrollStops.findIndex((n) => Math.abs(e) + this.width <= Math.abs(n));
    let s = t;
    o > t + 2 ? s = o - 2 : t < this.scrollStops.length - 2 && (s = t + 1), this.scrollToPosition(this.scrollStops[s], e);
  }
  scrollToPosition(e, t = this.scrollContainer.scrollLeft) {
    var o;
    if (this.scrolling)
      return;
    this.scrolling = !0;
    const s = (o = this.duration) !== null && o !== void 0 ? o : `${Math.abs(e - t) / this.speed}s`;
    this.content.style.setProperty("transition-duration", s);
    const n = parseFloat(getComputedStyle(this.content).getPropertyValue("transition-duration")), r = (u) => {
      u && u.target !== u.currentTarget || (this.content.style.setProperty("transition-duration", "0s"), this.content.style.removeProperty("transform"), this.scrollContainer.style.setProperty("scroll-behavior", "auto"), this.scrollContainer.scrollLeft = e, this.setFlippers(), this.content.removeEventListener("transitionend", r), this.scrolling = !1);
    };
    if (n === 0) {
      r();
      return;
    }
    this.content.addEventListener("transitionend", r);
    const l = this.scrollContainer.scrollWidth - this.scrollContainer.clientWidth;
    let c = this.scrollContainer.scrollLeft - Math.min(e, l);
    this.isRtl && (c = this.scrollContainer.scrollLeft + Math.min(Math.abs(e), l)), this.content.style.setProperty("transition-property", "transform"), this.content.style.setProperty("transition-timing-function", this.easing), this.content.style.setProperty("transform", `translateX(${c}px)`);
  }
  resized() {
    this.resizeTimeout && (this.resizeTimeout = clearTimeout(this.resizeTimeout)), this.resizeTimeout = setTimeout(() => {
      this.width = this.scrollContainer.offsetWidth, this.setFlippers();
    }, this.frameTime);
  }
  scrolled() {
    this.scrollTimeout && (this.scrollTimeout = clearTimeout(this.scrollTimeout)), this.scrollTimeout = setTimeout(() => {
      this.setFlippers();
    }, this.frameTime);
  }
};
a([
  h({ converter: C })
], Ft.prototype, "speed", void 0);
a([
  h
], Ft.prototype, "duration", void 0);
a([
  h
], Ft.prototype, "easing", void 0);
a([
  h({ attribute: "flippers-hidden-from-at", converter: _o })
], Ft.prototype, "flippersHiddenFromAT", void 0);
a([
  g
], Ft.prototype, "scrolling", void 0);
a([
  g
], Ft.prototype, "scrollItems", void 0);
a([
  h({ attribute: "view" })
], Ft.prototype, "view", void 0);
const Cu = (i, e) => {
  var t, o;
  return v`
    <template
        class="horizontal-scroll"
        @keyup="${(s, n) => s.keyupHandler(n.event)}"
    >
        ${Ae(i, e)}
        <div class="scroll-area" part="scroll-area">
            <div
                class="scroll-view"
                part="scroll-view"
                @scroll="${(s) => s.scrolled()}"
                ${U("scrollContainer")}
            >
                <div class="content-container" part="content-container" ${U("content")}>
                    <slot
                        ${ee({
    property: "scrollItems",
    filter: wt()
  })}
                    ></slot>
                </div>
            </div>
            ${Q((s) => s.view !== "mobile", v`
                    <div
                        class="scroll scroll-prev"
                        part="scroll-prev"
                        ${U("previousFlipperContainer")}
                    >
                        <div class="scroll-action" part="scroll-action-previous">
                            <slot name="previous-flipper">
                                ${e.previousFlipper instanceof Function ? e.previousFlipper(i, e) : (t = e.previousFlipper) !== null && t !== void 0 ? t : ""}
                            </slot>
                        </div>
                    </div>
                    <div
                        class="scroll scroll-next"
                        part="scroll-next"
                        ${U("nextFlipperContainer")}
                    >
                        <div class="scroll-action" part="scroll-action-next">
                            <slot name="next-flipper">
                                ${e.nextFlipper instanceof Function ? e.nextFlipper(i, e) : (o = e.nextFlipper) !== null && o !== void 0 ? o : ""}
                            </slot>
                        </div>
                    </div>
                `)}
        </div>
        ${Le(i, e)}
    </template>
`;
};
function ja(i, e, t) {
  return i.nodeType !== Node.TEXT_NODE ? !0 : typeof i.nodeValue == "string" && !!i.nodeValue.trim().length;
}
const Tu = (i, e) => v`
    <template
        class="
            ${(t) => t.readOnly ? "readonly" : ""}
        "
    >
        <label
            part="label"
            for="control"
            class="${(t) => t.defaultSlottedNodes && t.defaultSlottedNodes.length ? "label" : "label label__hidden"}"
        >
            <slot
                ${ee({ property: "defaultSlottedNodes", filter: ja })}
            ></slot>
        </label>
        <div class="root" part="root" ${U("root")}>
            ${Ae(i, e)}
            <div class="input-wrapper" part="input-wrapper">
                <input
                    class="control"
                    part="control"
                    id="control"
                    @input="${(t) => t.handleTextInput()}"
                    @change="${(t) => t.handleChange()}"
                    ?autofocus="${(t) => t.autofocus}"
                    ?disabled="${(t) => t.disabled}"
                    list="${(t) => t.list}"
                    maxlength="${(t) => t.maxlength}"
                    minlength="${(t) => t.minlength}"
                    pattern="${(t) => t.pattern}"
                    placeholder="${(t) => t.placeholder}"
                    ?readonly="${(t) => t.readOnly}"
                    ?required="${(t) => t.required}"
                    size="${(t) => t.size}"
                    ?spellcheck="${(t) => t.spellcheck}"
                    :value="${(t) => t.value}"
                    type="search"
                    aria-atomic="${(t) => t.ariaAtomic}"
                    aria-busy="${(t) => t.ariaBusy}"
                    aria-controls="${(t) => t.ariaControls}"
                    aria-current="${(t) => t.ariaCurrent}"
                    aria-describedby="${(t) => t.ariaDescribedby}"
                    aria-details="${(t) => t.ariaDetails}"
                    aria-disabled="${(t) => t.ariaDisabled}"
                    aria-errormessage="${(t) => t.ariaErrormessage}"
                    aria-flowto="${(t) => t.ariaFlowto}"
                    aria-haspopup="${(t) => t.ariaHaspopup}"
                    aria-hidden="${(t) => t.ariaHidden}"
                    aria-invalid="${(t) => t.ariaInvalid}"
                    aria-keyshortcuts="${(t) => t.ariaKeyshortcuts}"
                    aria-label="${(t) => t.ariaLabel}"
                    aria-labelledby="${(t) => t.ariaLabelledby}"
                    aria-live="${(t) => t.ariaLive}"
                    aria-owns="${(t) => t.ariaOwns}"
                    aria-relevant="${(t) => t.ariaRelevant}"
                    aria-roledescription="${(t) => t.ariaRoledescription}"
                    ${U("control")}
                />
                <slot name="close-button">
                    <button
                        class="clear-button ${(t) => t.value ? "" : "clear-button__hidden"}"
                        part="clear-button"
                        tabindex="-1"
                        @click=${(t) => t.handleClearInput()}
                    >
                        <slot name="close-glyph">
                            <svg
                                width="9"
                                height="9"
                                viewBox="0 0 9 9"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0.146447 0.146447C0.338683 -0.0478972 0.645911 -0.0270359 0.853553 0.146447L4.5 3.793L8.14645 0.146447C8.34171 -0.0488155 8.65829 -0.0488155 8.85355 0.146447C9.04882 0.341709 9.04882 0.658291 8.85355 0.853553L5.207 4.5L8.85355 8.14645C9.05934 8.35223 9.03129 8.67582 8.85355 8.85355C8.67582 9.03129 8.35409 9.02703 8.14645 8.85355L4.5 5.207L0.853553 8.85355C0.658291 9.04882 0.341709 9.04882 0.146447 8.85355C-0.0488155 8.65829 -0.0488155 8.34171 0.146447 8.14645L3.793 4.5L0.146447 0.853553C-0.0268697 0.680237 -0.0457894 0.34079 0.146447 0.146447Z"
                                />
                            </svg>
                        </slot>
                    </button>
                </slot>
            </div>
            ${Le(i, e)}
        </div>
    </template>
`;
class Iu extends O {
}
class Su extends ft(Iu) {
  constructor() {
    super(...arguments), this.proxy = document.createElement("input");
  }
}
let Ge = class extends Su {
  readOnlyChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.readOnly = this.readOnly, this.validate());
  }
  autofocusChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.autofocus = this.autofocus, this.validate());
  }
  placeholderChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.placeholder = this.placeholder);
  }
  listChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.setAttribute("list", this.list), this.validate());
  }
  maxlengthChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.maxLength = this.maxlength, this.validate());
  }
  minlengthChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.minLength = this.minlength, this.validate());
  }
  patternChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.pattern = this.pattern, this.validate());
  }
  sizeChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.size = this.size);
  }
  spellcheckChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.spellcheck = this.spellcheck);
  }
  connectedCallback() {
    super.connectedCallback(), this.validate(), this.autofocus && R.queueUpdate(() => {
      this.focus();
    });
  }
  validate() {
    super.validate(this.control);
  }
  handleTextInput() {
    this.value = this.control.value;
  }
  handleClearInput() {
    this.value = "", this.control.focus(), this.handleChange();
  }
  handleChange() {
    this.$emit("change");
  }
};
a([
  h({ attribute: "readonly", mode: "boolean" })
], Ge.prototype, "readOnly", void 0);
a([
  h({ mode: "boolean" })
], Ge.prototype, "autofocus", void 0);
a([
  h
], Ge.prototype, "placeholder", void 0);
a([
  h
], Ge.prototype, "list", void 0);
a([
  h({ converter: C })
], Ge.prototype, "maxlength", void 0);
a([
  h({ converter: C })
], Ge.prototype, "minlength", void 0);
a([
  h
], Ge.prototype, "pattern", void 0);
a([
  h({ converter: C })
], Ge.prototype, "size", void 0);
a([
  h({ mode: "boolean" })
], Ge.prototype, "spellcheck", void 0);
a([
  g
], Ge.prototype, "defaultSlottedNodes", void 0);
class _a {
}
ae(_a, se);
ae(Ge, He, _a);
class Fu extends zt {
}
class Eu extends ft(Fu) {
  constructor() {
    super(...arguments), this.proxy = document.createElement("select");
  }
}
let gt = class extends Eu {
  constructor() {
    super(...arguments), this.open = !1, this.forcedPosition = !1, this.listboxId = Xt("listbox-"), this.maxHeight = 0;
  }
  openChanged(e, t) {
    if (this.collapsible) {
      if (this.open) {
        this.ariaControls = this.listboxId, this.ariaExpanded = "true", this.setPositioning(), this.focusAndScrollOptionIntoView(), this.indexWhenOpened = this.selectedIndex, R.queueUpdate(() => this.focus());
        return;
      }
      this.ariaControls = "", this.ariaExpanded = "false";
    }
  }
  get collapsible() {
    return !(this.multiple || typeof this.size == "number");
  }
  get value() {
    return A.track(this, "value"), this._value;
  }
  set value(e) {
    var t, o, s, n, r, l, c;
    const u = `${this._value}`;
    if (!((t = this._options) === null || t === void 0) && t.length) {
      const p = this._options.findIndex((I) => I.value === e), f = (s = (o = this._options[this.selectedIndex]) === null || o === void 0 ? void 0 : o.value) !== null && s !== void 0 ? s : null, b = (r = (n = this._options[p]) === null || n === void 0 ? void 0 : n.value) !== null && r !== void 0 ? r : null;
      (p === -1 || f !== b) && (e = "", this.selectedIndex = p), e = (c = (l = this.firstSelectedOption) === null || l === void 0 ? void 0 : l.value) !== null && c !== void 0 ? c : e;
    }
    u !== e && (this._value = e, super.valueChanged(u, e), A.notify(this, "value"), this.updateDisplayValue());
  }
  updateValue(e) {
    var t, o;
    this.$fastController.isConnected && (this.value = (o = (t = this.firstSelectedOption) === null || t === void 0 ? void 0 : t.value) !== null && o !== void 0 ? o : ""), e && (this.$emit("input"), this.$emit("change", this, {
      bubbles: !0,
      composed: void 0
    }));
  }
  selectedIndexChanged(e, t) {
    super.selectedIndexChanged(e, t), this.updateValue();
  }
  positionChanged(e, t) {
    this.positionAttribute = t, this.setPositioning();
  }
  setPositioning() {
    const e = this.getBoundingClientRect(), o = window.innerHeight - e.bottom;
    this.position = this.forcedPosition ? this.positionAttribute : e.top > o ? xi.above : xi.below, this.positionAttribute = this.forcedPosition ? this.positionAttribute : this.position, this.maxHeight = this.position === xi.above ? ~~e.top : ~~o;
  }
  get displayValue() {
    var e, t;
    return A.track(this, "displayValue"), (t = (e = this.firstSelectedOption) === null || e === void 0 ? void 0 : e.text) !== null && t !== void 0 ? t : "";
  }
  disabledChanged(e, t) {
    super.disabledChanged && super.disabledChanged(e, t), this.ariaDisabled = this.disabled ? "true" : "false";
  }
  formResetCallback() {
    this.setProxyOptions(), super.setDefaultSelectedOption(), this.selectedIndex === -1 && (this.selectedIndex = 0);
  }
  clickHandler(e) {
    if (!this.disabled) {
      if (this.open) {
        const t = e.target.closest("option,[role=option]");
        if (t && t.disabled)
          return;
      }
      return super.clickHandler(e), this.open = this.collapsible && !this.open, !this.open && this.indexWhenOpened !== this.selectedIndex && this.updateValue(!0), !0;
    }
  }
  focusoutHandler(e) {
    var t;
    if (super.focusoutHandler(e), !this.open)
      return !0;
    const o = e.relatedTarget;
    if (this.isSameNode(o)) {
      this.focus();
      return;
    }
    !((t = this.options) === null || t === void 0) && t.includes(o) || (this.open = !1, this.indexWhenOpened !== this.selectedIndex && this.updateValue(!0));
  }
  handleChange(e, t) {
    super.handleChange(e, t), t === "value" && this.updateValue();
  }
  slottedOptionsChanged(e, t) {
    this.options.forEach((o) => {
      A.getNotifier(o).unsubscribe(this, "value");
    }), super.slottedOptionsChanged(e, t), this.options.forEach((o) => {
      A.getNotifier(o).subscribe(this, "value");
    }), this.setProxyOptions(), this.updateValue();
  }
  mousedownHandler(e) {
    var t;
    return e.offsetX >= 0 && e.offsetX <= ((t = this.listbox) === null || t === void 0 ? void 0 : t.scrollWidth) ? super.mousedownHandler(e) : this.collapsible;
  }
  multipleChanged(e, t) {
    super.multipleChanged(e, t), this.proxy && (this.proxy.multiple = t);
  }
  selectedOptionsChanged(e, t) {
    var o;
    super.selectedOptionsChanged(e, t), (o = this.options) === null || o === void 0 || o.forEach((s, n) => {
      var r;
      const l = (r = this.proxy) === null || r === void 0 ? void 0 : r.options.item(n);
      l && (l.selected = s.selected);
    });
  }
  setDefaultSelectedOption() {
    var e;
    const t = (e = this.options) !== null && e !== void 0 ? e : Array.from(this.children).filter(Se.slottedOptionFilter), o = t == null ? void 0 : t.findIndex((s) => s.hasAttribute("selected") || s.selected || s.value === this.value);
    if (o !== -1) {
      this.selectedIndex = o;
      return;
    }
    this.selectedIndex = 0;
  }
  setProxyOptions() {
    this.proxy instanceof HTMLSelectElement && this.options && (this.proxy.options.length = 0, this.options.forEach((e) => {
      const t = e.proxy || (e instanceof HTMLOptionElement ? e.cloneNode() : null);
      t && this.proxy.options.add(t);
    }));
  }
  keydownHandler(e) {
    super.keydownHandler(e);
    const t = e.key || e.key.charCodeAt(0);
    switch (t) {
      case ei: {
        e.preventDefault(), this.collapsible && this.typeAheadExpired && (this.open = !this.open);
        break;
      }
      case ut:
      case pt: {
        e.preventDefault();
        break;
      }
      case st: {
        e.preventDefault(), this.open = !this.open;
        break;
      }
      case Kt: {
        this.collapsible && this.open && (e.preventDefault(), this.open = !1);
        break;
      }
      case qo:
        return this.collapsible && this.open && (e.preventDefault(), this.open = !1), !0;
    }
    return !this.open && this.indexWhenOpened !== this.selectedIndex && (this.updateValue(!0), this.indexWhenOpened = this.selectedIndex), !(t === _e || t === Ue);
  }
  connectedCallback() {
    super.connectedCallback(), this.forcedPosition = !!this.positionAttribute, this.addEventListener("contentchange", this.updateDisplayValue);
  }
  disconnectedCallback() {
    this.removeEventListener("contentchange", this.updateDisplayValue), super.disconnectedCallback();
  }
  sizeChanged(e, t) {
    super.sizeChanged(e, t), this.proxy && (this.proxy.size = t);
  }
  updateDisplayValue() {
    this.collapsible && A.notify(this, "displayValue");
  }
};
a([
  h({ attribute: "open", mode: "boolean" })
], gt.prototype, "open", void 0);
a([
  Tc
], gt.prototype, "collapsible", null);
a([
  g
], gt.prototype, "control", void 0);
a([
  h({ attribute: "position" })
], gt.prototype, "positionAttribute", void 0);
a([
  g
], gt.prototype, "position", void 0);
a([
  g
], gt.prototype, "maxHeight", void 0);
class xn {
}
a([
  g
], xn.prototype, "ariaControls", void 0);
ae(xn, Vt);
ae(gt, He, xn);
const Ru = (i, e) => v`
    <template
        class="${(t) => [
  t.collapsible && "collapsible",
  t.collapsible && t.open && "open",
  t.disabled && "disabled",
  t.collapsible && t.position
].filter(Boolean).join(" ")}"
        aria-activedescendant="${(t) => t.ariaActiveDescendant}"
        aria-controls="${(t) => t.ariaControls}"
        aria-disabled="${(t) => t.ariaDisabled}"
        aria-expanded="${(t) => t.ariaExpanded}"
        aria-haspopup="${(t) => t.collapsible ? "listbox" : null}"
        aria-multiselectable="${(t) => t.ariaMultiSelectable}"
        ?open="${(t) => t.open}"
        role="combobox"
        tabindex="${(t) => t.disabled ? null : "0"}"
        @click="${(t, o) => t.clickHandler(o.event)}"
        @focusin="${(t, o) => t.focusinHandler(o.event)}"
        @focusout="${(t, o) => t.focusoutHandler(o.event)}"
        @keydown="${(t, o) => t.keydownHandler(o.event)}"
        @mousedown="${(t, o) => t.mousedownHandler(o.event)}"
    >
        ${Q((t) => t.collapsible, v`
                <div
                    class="control"
                    part="control"
                    ?disabled="${(t) => t.disabled}"
                    ${U("control")}
                >
                    ${Ae(i, e)}
                    <slot name="button-container">
                        <div class="selected-value" part="selected-value">
                            <slot name="selected-value">${(t) => t.displayValue}</slot>
                        </div>
                        <div aria-hidden="true" class="indicator" part="indicator">
                            <slot name="indicator">
                                ${e.indicator || ""}
                            </slot>
                        </div>
                    </slot>
                    ${Le(i, e)}
                </div>
            `)}
        <div
            class="listbox"
            id="${(t) => t.listboxId}"
            part="listbox"
            role="listbox"
            ?disabled="${(t) => t.disabled}"
            ?hidden="${(t) => t.collapsible ? !t.open : !1}"
            ${U("listbox")}
        >
            <slot
                ${ee({
  filter: Se.slottedOptionFilter,
  flatten: !0,
  property: "slottedOptions"
})}
            ></slot>
        </div>
    </template>
`, Du = (i, e) => v`
    <template
        class="${(t) => t.shape === "circle" ? "circle" : "rect"}"
        pattern="${(t) => t.pattern}"
        ?shimmer="${(t) => t.shimmer}"
    >
        ${Q((t) => t.shimmer === !0, v`
                <span class="shimmer"></span>
            `)}
        <object type="image/svg+xml" data="${(t) => t.pattern}" role="presentation">
            <img class="pattern" src="${(t) => t.pattern}" />
        </object>
        <slot></slot>
    </template>
`;
class mo extends O {
  constructor() {
    super(...arguments), this.shape = "rect";
  }
}
a([
  h
], mo.prototype, "fill", void 0);
a([
  h
], mo.prototype, "shape", void 0);
a([
  h
], mo.prototype, "pattern", void 0);
a([
  h({ mode: "boolean" })
], mo.prototype, "shimmer", void 0);
const Ou = (i, e) => v`
    <template
        aria-disabled="${(t) => t.disabled}"
        class="${(t) => t.sliderOrientation || ce.horizontal}
            ${(t) => t.disabled ? "disabled" : ""}"
    >
        <div ${U("root")} part="root" class="root" style="${(t) => t.positionStyle}">
            <div class="container">
                ${Q((t) => !t.hideMark, v`
                        <div class="mark"></div>
                    `)}
                <div class="label">
                    <slot></slot>
                </div>
            </div>
        </div>
    </template>
`;
function _s(i, e, t, o) {
  let s = fn(0, 1, (i - e) / (t - e));
  return o === oe.rtl && (s = 1 - s), s;
}
const Io = {
  min: 0,
  max: 0,
  direction: oe.ltr,
  orientation: ce.horizontal,
  disabled: !1
};
let mt = class extends O {
  constructor() {
    super(...arguments), this.hideMark = !1, this.sliderDirection = oe.ltr, this.getSliderConfiguration = () => {
      if (!this.isSliderConfig(this.parentNode))
        this.sliderDirection = Io.direction || oe.ltr, this.sliderOrientation = Io.orientation, this.sliderMaxPosition = Io.max, this.sliderMinPosition = Io.min;
      else {
        const e = this.parentNode, { min: t, max: o, direction: s, orientation: n, disabled: r } = e;
        r !== void 0 && (this.disabled = r), this.sliderDirection = s || oe.ltr, this.sliderOrientation = n || ce.horizontal, this.sliderMaxPosition = o, this.sliderMinPosition = t;
      }
    }, this.positionAsStyle = () => {
      const e = this.sliderDirection ? this.sliderDirection : oe.ltr, t = _s(Number(this.position), Number(this.sliderMinPosition), Number(this.sliderMaxPosition));
      let o = Math.round((1 - t) * 100), s = Math.round(t * 100);
      return Number.isNaN(s) && Number.isNaN(o) && (o = 50, s = 50), this.sliderOrientation === ce.horizontal ? e === oe.rtl ? `right: ${s}%; left: ${o}%;` : `left: ${s}%; right: ${o}%;` : `top: ${s}%; bottom: ${o}%;`;
    };
  }
  positionChanged() {
    this.positionStyle = this.positionAsStyle();
  }
  sliderOrientationChanged() {
  }
  connectedCallback() {
    super.connectedCallback(), this.getSliderConfiguration(), this.positionStyle = this.positionAsStyle(), this.notifier = A.getNotifier(this.parentNode), this.notifier.subscribe(this, "orientation"), this.notifier.subscribe(this, "direction"), this.notifier.subscribe(this, "max"), this.notifier.subscribe(this, "min");
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.notifier.unsubscribe(this, "orientation"), this.notifier.unsubscribe(this, "direction"), this.notifier.unsubscribe(this, "max"), this.notifier.unsubscribe(this, "min");
  }
  handleChange(e, t) {
    switch (t) {
      case "direction":
        this.sliderDirection = e.direction;
        break;
      case "orientation":
        this.sliderOrientation = e.orientation;
        break;
      case "max":
        this.sliderMaxPosition = e.max;
        break;
      case "min":
        this.sliderMinPosition = e.min;
        break;
    }
    this.positionStyle = this.positionAsStyle();
  }
  isSliderConfig(e) {
    return e.max !== void 0 && e.min !== void 0;
  }
};
a([
  g
], mt.prototype, "positionStyle", void 0);
a([
  h
], mt.prototype, "position", void 0);
a([
  h({ attribute: "hide-mark", mode: "boolean" })
], mt.prototype, "hideMark", void 0);
a([
  h({ attribute: "disabled", mode: "boolean" })
], mt.prototype, "disabled", void 0);
a([
  g
], mt.prototype, "sliderOrientation", void 0);
a([
  g
], mt.prototype, "sliderMinPosition", void 0);
a([
  g
], mt.prototype, "sliderMaxPosition", void 0);
a([
  g
], mt.prototype, "sliderDirection", void 0);
const Lu = (i, e) => v`
    <template
        role="slider"
        class="${(t) => t.readOnly ? "readonly" : ""}
        ${(t) => t.orientation || ce.horizontal}"
        tabindex="${(t) => t.disabled ? null : 0}"
        aria-valuetext="${(t) => t.valueTextFormatter(t.value)}"
        aria-valuenow="${(t) => t.value}"
        aria-valuemin="${(t) => t.min}"
        aria-valuemax="${(t) => t.max}"
        aria-disabled="${(t) => t.disabled ? !0 : void 0}"
        aria-readonly="${(t) => t.readOnly ? !0 : void 0}"
        aria-orientation="${(t) => t.orientation}"
        class="${(t) => t.orientation}"
    >
        <div part="positioning-region" class="positioning-region">
            <div ${U("track")} part="track-container" class="track">
                <slot name="track"></slot>
                <div part="track-start" class="track-start" style="${(t) => t.position}">
                    <slot name="track-start"></slot>
                </div>
            </div>
            <slot></slot>
            <div
                ${U("thumb")}
                part="thumb-container"
                class="thumb-container"
                style="${(t) => t.position}"
            >
                <slot name="thumb">${e.thumb || ""}</slot>
            </div>
        </div>
    </template>
`;
class Au extends O {
}
class Pu extends ft(Au) {
  constructor() {
    super(...arguments), this.proxy = document.createElement("input");
  }
}
const Mu = {
  singleValue: "single-value"
};
class Fe extends Pu {
  constructor() {
    super(...arguments), this.direction = oe.ltr, this.isDragging = !1, this.trackWidth = 0, this.trackMinWidth = 0, this.trackHeight = 0, this.trackLeft = 0, this.trackMinHeight = 0, this.valueTextFormatter = () => null, this.min = 0, this.max = 10, this.step = 1, this.orientation = ce.horizontal, this.mode = Mu.singleValue, this.keypressHandler = (e) => {
      if (!this.readOnly) {
        if (e.key === ut)
          e.preventDefault(), this.value = `${this.min}`;
        else if (e.key === pt)
          e.preventDefault(), this.value = `${this.max}`;
        else if (!e.shiftKey)
          switch (e.key) {
            case Ct:
            case Ue:
              e.preventDefault(), this.increment();
              break;
            case kt:
            case _e:
              e.preventDefault(), this.decrement();
              break;
          }
      }
    }, this.setupTrackConstraints = () => {
      const e = this.track.getBoundingClientRect();
      this.trackWidth = this.track.clientWidth, this.trackMinWidth = this.track.clientLeft, this.trackHeight = e.bottom, this.trackMinHeight = e.top, this.trackLeft = this.getBoundingClientRect().left, this.trackWidth === 0 && (this.trackWidth = 1);
    }, this.setupListeners = (e = !1) => {
      const t = `${e ? "remove" : "add"}EventListener`;
      this[t]("keydown", this.keypressHandler), this[t]("mousedown", this.handleMouseDown), this.thumb[t]("mousedown", this.handleThumbMouseDown, {
        passive: !0
      }), this.thumb[t]("touchstart", this.handleThumbMouseDown, {
        passive: !0
      }), e && (this.handleMouseDown(null), this.handleThumbMouseDown(null));
    }, this.initialValue = "", this.handleThumbMouseDown = (e) => {
      if (e) {
        if (this.readOnly || this.disabled || e.defaultPrevented)
          return;
        e.target.focus();
      }
      const t = `${e !== null ? "add" : "remove"}EventListener`;
      window[t]("mouseup", this.handleWindowMouseUp), window[t]("mousemove", this.handleMouseMove, { passive: !0 }), window[t]("touchmove", this.handleMouseMove, { passive: !0 }), window[t]("touchend", this.handleWindowMouseUp), this.isDragging = e !== null;
    }, this.handleMouseMove = (e) => {
      if (this.readOnly || this.disabled || e.defaultPrevented)
        return;
      const t = window.TouchEvent && e instanceof TouchEvent ? e.touches[0] : e, o = this.orientation === ce.horizontal ? t.pageX - document.documentElement.scrollLeft - this.trackLeft : t.pageY - document.documentElement.scrollTop;
      this.value = `${this.calculateNewValue(o)}`;
    }, this.calculateNewValue = (e) => {
      const t = _s(e, this.orientation === ce.horizontal ? this.trackMinWidth : this.trackMinHeight, this.orientation === ce.horizontal ? this.trackWidth : this.trackHeight, this.direction), o = (this.max - this.min) * t + this.min;
      return this.convertToConstrainedValue(o);
    }, this.handleWindowMouseUp = (e) => {
      this.stopDragging();
    }, this.stopDragging = () => {
      this.isDragging = !1, this.handleMouseDown(null), this.handleThumbMouseDown(null);
    }, this.handleMouseDown = (e) => {
      const t = `${e !== null ? "add" : "remove"}EventListener`;
      if ((e === null || !this.disabled && !this.readOnly) && (window[t]("mouseup", this.handleWindowMouseUp), window.document[t]("mouseleave", this.handleWindowMouseUp), window[t]("mousemove", this.handleMouseMove), e)) {
        e.preventDefault(), this.setupTrackConstraints(), e.target.focus();
        const o = this.orientation === ce.horizontal ? e.pageX - document.documentElement.scrollLeft - this.trackLeft : e.pageY - document.documentElement.scrollTop;
        this.value = `${this.calculateNewValue(o)}`;
      }
    }, this.convertToConstrainedValue = (e) => {
      isNaN(e) && (e = this.min);
      let t = e - this.min;
      const o = Math.round(t / this.step), s = t - o * (this.stepMultiplier * this.step) / this.stepMultiplier;
      return t = s >= Number(this.step) / 2 ? t - s + Number(this.step) : t - s, t + this.min;
    };
  }
  readOnlyChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.readOnly = this.readOnly);
  }
  get valueAsNumber() {
    return parseFloat(super.value);
  }
  set valueAsNumber(e) {
    this.value = e.toString();
  }
  valueChanged(e, t) {
    super.valueChanged(e, t), this.$fastController.isConnected && this.setThumbPositionForOrientation(this.direction), this.$emit("change");
  }
  minChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.min = `${this.min}`), this.validate();
  }
  maxChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.max = `${this.max}`), this.validate();
  }
  stepChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.step = `${this.step}`), this.updateStepMultiplier(), this.validate();
  }
  orientationChanged() {
    this.$fastController.isConnected && this.setThumbPositionForOrientation(this.direction);
  }
  connectedCallback() {
    super.connectedCallback(), this.proxy.setAttribute("type", "range"), this.direction = Qt(this), this.updateStepMultiplier(), this.setupTrackConstraints(), this.setupListeners(), this.setupDefaultValue(), this.setThumbPositionForOrientation(this.direction);
  }
  disconnectedCallback() {
    this.setupListeners(!0);
  }
  increment() {
    const e = this.direction !== oe.rtl && this.orientation !== ce.vertical ? Number(this.value) + Number(this.step) : Number(this.value) - Number(this.step), t = this.convertToConstrainedValue(e), o = t < Number(this.max) ? `${t}` : `${this.max}`;
    this.value = o;
  }
  decrement() {
    const e = this.direction !== oe.rtl && this.orientation !== ce.vertical ? Number(this.value) - Number(this.step) : Number(this.value) + Number(this.step), t = this.convertToConstrainedValue(e), o = t > Number(this.min) ? `${t}` : `${this.min}`;
    this.value = o;
  }
  setThumbPositionForOrientation(e) {
    const o = (1 - _s(Number(this.value), Number(this.min), Number(this.max), e)) * 100;
    this.orientation === ce.horizontal ? this.position = this.isDragging ? `right: ${o}%; transition: none;` : `right: ${o}%; transition: all 0.2s ease;` : this.position = this.isDragging ? `bottom: ${o}%; transition: none;` : `bottom: ${o}%; transition: all 0.2s ease;`;
  }
  updateStepMultiplier() {
    const e = this.step + "", t = this.step % 1 ? e.length - e.indexOf(".") - 1 : 0;
    this.stepMultiplier = Math.pow(10, t);
  }
  get midpoint() {
    return `${this.convertToConstrainedValue((this.max + this.min) / 2)}`;
  }
  setupDefaultValue() {
    if (typeof this.value == "string")
      if (this.value.length === 0)
        this.initialValue = this.midpoint;
      else {
        const e = parseFloat(this.value);
        !Number.isNaN(e) && (e < this.min || e > this.max) && (this.value = this.midpoint);
      }
  }
}
a([
  h({ attribute: "readonly", mode: "boolean" })
], Fe.prototype, "readOnly", void 0);
a([
  g
], Fe.prototype, "direction", void 0);
a([
  g
], Fe.prototype, "isDragging", void 0);
a([
  g
], Fe.prototype, "position", void 0);
a([
  g
], Fe.prototype, "trackWidth", void 0);
a([
  g
], Fe.prototype, "trackMinWidth", void 0);
a([
  g
], Fe.prototype, "trackHeight", void 0);
a([
  g
], Fe.prototype, "trackLeft", void 0);
a([
  g
], Fe.prototype, "trackMinHeight", void 0);
a([
  g
], Fe.prototype, "valueTextFormatter", void 0);
a([
  h({ converter: C })
], Fe.prototype, "min", void 0);
a([
  h({ converter: C })
], Fe.prototype, "max", void 0);
a([
  h({ converter: C })
], Fe.prototype, "step", void 0);
a([
  h
], Fe.prototype, "orientation", void 0);
a([
  h
], Fe.prototype, "mode", void 0);
const Vu = (i, e) => v`
    <template
        role="switch"
        aria-checked="${(t) => t.checked}"
        aria-disabled="${(t) => t.disabled}"
        aria-readonly="${(t) => t.readOnly}"
        tabindex="${(t) => t.disabled ? null : 0}"
        @keypress="${(t, o) => t.keypressHandler(o.event)}"
        @click="${(t, o) => t.clickHandler(o.event)}"
        class="${(t) => t.checked ? "checked" : ""}"
    >
        <label
            part="label"
            class="${(t) => t.defaultSlottedNodes && t.defaultSlottedNodes.length ? "label" : "label label__hidden"}"
        >
            <slot ${ee("defaultSlottedNodes")}></slot>
        </label>
        <div part="switch" class="switch">
            <slot name="switch">${e.switch || ""}</slot>
        </div>
        <span class="status-message" part="status-message">
            <span class="checked-message" part="checked-message">
                <slot name="checked-message"></slot>
            </span>
            <span class="unchecked-message" part="unchecked-message">
                <slot name="unchecked-message"></slot>
            </span>
        </span>
    </template>
`;
class Hu extends O {
}
class zu extends bn(Hu) {
  constructor() {
    super(...arguments), this.proxy = document.createElement("input");
  }
}
class $n extends zu {
  constructor() {
    super(), this.initialValue = "on", this.keypressHandler = (e) => {
      if (!this.readOnly)
        switch (e.key) {
          case st:
          case ei:
            this.checked = !this.checked;
            break;
        }
    }, this.clickHandler = (e) => {
      !this.disabled && !this.readOnly && (this.checked = !this.checked);
    }, this.proxy.setAttribute("type", "checkbox");
  }
  readOnlyChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.readOnly = this.readOnly), this.readOnly ? this.classList.add("readonly") : this.classList.remove("readonly");
  }
  checkedChanged(e, t) {
    super.checkedChanged(e, t), this.checked ? this.classList.add("checked") : this.classList.remove("checked");
  }
}
a([
  h({ attribute: "readonly", mode: "boolean" })
], $n.prototype, "readOnly", void 0);
a([
  g
], $n.prototype, "defaultSlottedNodes", void 0);
const Nu = (i, e) => v`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`;
class Bu extends O {
}
const ju = (i, e) => v`
    <template slot="tab" role="tab" aria-disabled="${(t) => t.disabled}">
        <slot></slot>
    </template>
`;
class Ua extends O {
}
a([
  h({ mode: "boolean" })
], Ua.prototype, "disabled", void 0);
const _u = (i, e) => v`
    <template class="${(t) => t.orientation}">
        ${Ae(i, e)}
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${ee("tabs")}></slot>

            ${Q((t) => t.showActiveIndicator, v`
                    <div
                        ${U("activeIndicatorRef")}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `)}
        </div>
        ${Le(i, e)}
        <div class="tabpanel">
            <slot name="tabpanel" part="tabpanel" ${ee("tabpanels")}></slot>
        </div>
    </template>
`, mr = {
  vertical: "vertical",
  horizontal: "horizontal"
};
class Et extends O {
  constructor() {
    super(...arguments), this.orientation = mr.horizontal, this.activeindicator = !0, this.showActiveIndicator = !0, this.prevActiveTabIndex = 0, this.activeTabIndex = 0, this.ticking = !1, this.change = () => {
      this.$emit("change", this.activetab);
    }, this.isDisabledElement = (e) => e.getAttribute("aria-disabled") === "true", this.isFocusableElement = (e) => !this.isDisabledElement(e), this.setTabs = () => {
      const e = "gridColumn", t = "gridRow", o = this.isHorizontal() ? e : t;
      this.activeTabIndex = this.getActiveIndex(), this.showActiveIndicator = !1, this.tabs.forEach((s, n) => {
        if (s.slot === "tab") {
          const r = this.activeTabIndex === n && this.isFocusableElement(s);
          this.activeindicator && this.isFocusableElement(s) && (this.showActiveIndicator = !0);
          const l = this.tabIds[n], c = this.tabpanelIds[n];
          s.setAttribute("id", l), s.setAttribute("aria-selected", r ? "true" : "false"), s.setAttribute("aria-controls", c), s.addEventListener("click", this.handleTabClick), s.addEventListener("keydown", this.handleTabKeyDown), s.setAttribute("tabindex", r ? "0" : "-1"), r && (this.activetab = s);
        }
        s.style[e] = "", s.style[t] = "", s.style[o] = `${n + 1}`, this.isHorizontal() ? s.classList.remove("vertical") : s.classList.add("vertical");
      });
    }, this.setTabPanels = () => {
      this.tabpanels.forEach((e, t) => {
        const o = this.tabIds[t], s = this.tabpanelIds[t];
        e.setAttribute("id", s), e.setAttribute("aria-labelledby", o), this.activeTabIndex !== t ? e.setAttribute("hidden", "") : e.removeAttribute("hidden");
      });
    }, this.handleTabClick = (e) => {
      const t = e.currentTarget;
      t.nodeType === 1 && this.isFocusableElement(t) && (this.prevActiveTabIndex = this.activeTabIndex, this.activeTabIndex = this.tabs.indexOf(t), this.setComponent());
    }, this.handleTabKeyDown = (e) => {
      if (this.isHorizontal())
        switch (e.key) {
          case kt:
            e.preventDefault(), this.adjustBackward(e);
            break;
          case Ct:
            e.preventDefault(), this.adjustForward(e);
            break;
        }
      else
        switch (e.key) {
          case Ue:
            e.preventDefault(), this.adjustBackward(e);
            break;
          case _e:
            e.preventDefault(), this.adjustForward(e);
            break;
        }
      switch (e.key) {
        case ut:
          e.preventDefault(), this.adjust(-this.activeTabIndex);
          break;
        case pt:
          e.preventDefault(), this.adjust(this.tabs.length - this.activeTabIndex - 1);
          break;
      }
    }, this.adjustForward = (e) => {
      const t = this.tabs;
      let o = 0;
      for (o = this.activetab ? t.indexOf(this.activetab) + 1 : 1, o === t.length && (o = 0); o < t.length && t.length > 1; )
        if (this.isFocusableElement(t[o])) {
          this.moveToTabByIndex(t, o);
          break;
        } else {
          if (this.activetab && o === t.indexOf(this.activetab))
            break;
          o + 1 >= t.length ? o = 0 : o += 1;
        }
    }, this.adjustBackward = (e) => {
      const t = this.tabs;
      let o = 0;
      for (o = this.activetab ? t.indexOf(this.activetab) - 1 : 0, o = o < 0 ? t.length - 1 : o; o >= 0 && t.length > 1; )
        if (this.isFocusableElement(t[o])) {
          this.moveToTabByIndex(t, o);
          break;
        } else
          o - 1 < 0 ? o = t.length - 1 : o -= 1;
    }, this.moveToTabByIndex = (e, t) => {
      const o = e[t];
      this.activetab = o, this.prevActiveTabIndex = this.activeTabIndex, this.activeTabIndex = t, o.focus(), this.setComponent();
    };
  }
  orientationChanged() {
    this.$fastController.isConnected && (this.setTabs(), this.setTabPanels(), this.handleActiveIndicatorPosition());
  }
  activeidChanged(e, t) {
    this.$fastController.isConnected && this.tabs.length <= this.tabpanels.length && (this.prevActiveTabIndex = this.tabs.findIndex((o) => o.id === e), this.setTabs(), this.setTabPanels(), this.handleActiveIndicatorPosition());
  }
  tabsChanged() {
    this.$fastController.isConnected && this.tabs.length <= this.tabpanels.length && (this.tabIds = this.getTabIds(), this.tabpanelIds = this.getTabPanelIds(), this.setTabs(), this.setTabPanels(), this.handleActiveIndicatorPosition());
  }
  tabpanelsChanged() {
    this.$fastController.isConnected && this.tabpanels.length <= this.tabs.length && (this.tabIds = this.getTabIds(), this.tabpanelIds = this.getTabPanelIds(), this.setTabs(), this.setTabPanels(), this.handleActiveIndicatorPosition());
  }
  getActiveIndex() {
    return this.activeid !== void 0 ? this.tabIds.indexOf(this.activeid) === -1 ? 0 : this.tabIds.indexOf(this.activeid) : 0;
  }
  getTabIds() {
    return this.tabs.map((e) => {
      var t;
      return (t = e.getAttribute("id")) !== null && t !== void 0 ? t : `tab-${Xt()}`;
    });
  }
  getTabPanelIds() {
    return this.tabpanels.map((e) => {
      var t;
      return (t = e.getAttribute("id")) !== null && t !== void 0 ? t : `panel-${Xt()}`;
    });
  }
  setComponent() {
    this.activeTabIndex !== this.prevActiveTabIndex && (this.activeid = this.tabIds[this.activeTabIndex], this.focusTab(), this.change());
  }
  isHorizontal() {
    return this.orientation === mr.horizontal;
  }
  handleActiveIndicatorPosition() {
    this.showActiveIndicator && this.activeindicator && this.activeTabIndex !== this.prevActiveTabIndex && (this.ticking ? this.ticking = !1 : (this.ticking = !0, this.animateActiveIndicator()));
  }
  animateActiveIndicator() {
    this.ticking = !0;
    const e = this.isHorizontal() ? "gridColumn" : "gridRow", t = this.isHorizontal() ? "translateX" : "translateY", o = this.isHorizontal() ? "offsetLeft" : "offsetTop", s = this.activeIndicatorRef[o];
    this.activeIndicatorRef.style[e] = `${this.activeTabIndex + 1}`;
    const n = this.activeIndicatorRef[o];
    this.activeIndicatorRef.style[e] = `${this.prevActiveTabIndex + 1}`;
    const r = n - s;
    this.activeIndicatorRef.style.transform = `${t}(${r}px)`, this.activeIndicatorRef.classList.add("activeIndicatorTransition"), this.activeIndicatorRef.addEventListener("transitionend", () => {
      this.ticking = !1, this.activeIndicatorRef.style[e] = `${this.activeTabIndex + 1}`, this.activeIndicatorRef.style.transform = `${t}(0px)`, this.activeIndicatorRef.classList.remove("activeIndicatorTransition");
    });
  }
  adjust(e) {
    this.prevActiveTabIndex = this.activeTabIndex, this.activeTabIndex = Sa(0, this.tabs.length - 1, this.activeTabIndex + e), this.setComponent();
  }
  focusTab() {
    this.tabs[this.activeTabIndex].focus();
  }
  connectedCallback() {
    super.connectedCallback(), this.tabIds = this.getTabIds(), this.tabpanelIds = this.getTabPanelIds(), this.activeTabIndex = this.getActiveIndex();
  }
}
a([
  h
], Et.prototype, "orientation", void 0);
a([
  h
], Et.prototype, "activeid", void 0);
a([
  g
], Et.prototype, "tabs", void 0);
a([
  g
], Et.prototype, "tabpanels", void 0);
a([
  h({ mode: "boolean" })
], Et.prototype, "activeindicator", void 0);
a([
  g
], Et.prototype, "activeIndicatorRef", void 0);
a([
  g
], Et.prototype, "showActiveIndicator", void 0);
ae(Et, He);
class Uu extends O {
}
class qu extends ft(Uu) {
  constructor() {
    super(...arguments), this.proxy = document.createElement("textarea");
  }
}
const qa = {
  none: "none",
  both: "both",
  horizontal: "horizontal",
  vertical: "vertical"
};
let Ee = class extends qu {
  constructor() {
    super(...arguments), this.resize = qa.none, this.cols = 20, this.handleTextInput = () => {
      this.value = this.control.value;
    };
  }
  readOnlyChanged() {
    this.proxy instanceof HTMLTextAreaElement && (this.proxy.readOnly = this.readOnly);
  }
  autofocusChanged() {
    this.proxy instanceof HTMLTextAreaElement && (this.proxy.autofocus = this.autofocus);
  }
  listChanged() {
    this.proxy instanceof HTMLTextAreaElement && this.proxy.setAttribute("list", this.list);
  }
  maxlengthChanged() {
    this.proxy instanceof HTMLTextAreaElement && (this.proxy.maxLength = this.maxlength);
  }
  minlengthChanged() {
    this.proxy instanceof HTMLTextAreaElement && (this.proxy.minLength = this.minlength);
  }
  spellcheckChanged() {
    this.proxy instanceof HTMLTextAreaElement && (this.proxy.spellcheck = this.spellcheck);
  }
  select() {
    this.control.select(), this.$emit("select");
  }
  handleChange() {
    this.$emit("change");
  }
  validate() {
    super.validate(this.control);
  }
};
a([
  h({ mode: "boolean" })
], Ee.prototype, "readOnly", void 0);
a([
  h
], Ee.prototype, "resize", void 0);
a([
  h({ mode: "boolean" })
], Ee.prototype, "autofocus", void 0);
a([
  h({ attribute: "form" })
], Ee.prototype, "formId", void 0);
a([
  h
], Ee.prototype, "list", void 0);
a([
  h({ converter: C })
], Ee.prototype, "maxlength", void 0);
a([
  h({ converter: C })
], Ee.prototype, "minlength", void 0);
a([
  h
], Ee.prototype, "name", void 0);
a([
  h
], Ee.prototype, "placeholder", void 0);
a([
  h({ converter: C, mode: "fromView" })
], Ee.prototype, "cols", void 0);
a([
  h({ converter: C, mode: "fromView" })
], Ee.prototype, "rows", void 0);
a([
  h({ mode: "boolean" })
], Ee.prototype, "spellcheck", void 0);
a([
  g
], Ee.prototype, "defaultSlottedNodes", void 0);
ae(Ee, Jo);
const Gu = (i, e) => v`
    <template
        class="
            ${(t) => t.readOnly ? "readonly" : ""}
            ${(t) => t.resize !== qa.none ? `resize-${t.resize}` : ""}"
    >
        <label
            part="label"
            for="control"
            class="${(t) => t.defaultSlottedNodes && t.defaultSlottedNodes.length ? "label" : "label label__hidden"}"
        >
            <slot ${ee("defaultSlottedNodes")}></slot>
        </label>
        <textarea
            part="control"
            class="control"
            id="control"
            ?autofocus="${(t) => t.autofocus}"
            cols="${(t) => t.cols}"
            ?disabled="${(t) => t.disabled}"
            form="${(t) => t.form}"
            list="${(t) => t.list}"
            maxlength="${(t) => t.maxlength}"
            minlength="${(t) => t.minlength}"
            name="${(t) => t.name}"
            placeholder="${(t) => t.placeholder}"
            ?readonly="${(t) => t.readOnly}"
            ?required="${(t) => t.required}"
            rows="${(t) => t.rows}"
            ?spellcheck="${(t) => t.spellcheck}"
            :value="${(t) => t.value}"
            aria-atomic="${(t) => t.ariaAtomic}"
            aria-busy="${(t) => t.ariaBusy}"
            aria-controls="${(t) => t.ariaControls}"
            aria-current="${(t) => t.ariaCurrent}"
            aria-describedby="${(t) => t.ariaDescribedby}"
            aria-details="${(t) => t.ariaDetails}"
            aria-disabled="${(t) => t.ariaDisabled}"
            aria-errormessage="${(t) => t.ariaErrormessage}"
            aria-flowto="${(t) => t.ariaFlowto}"
            aria-haspopup="${(t) => t.ariaHaspopup}"
            aria-hidden="${(t) => t.ariaHidden}"
            aria-invalid="${(t) => t.ariaInvalid}"
            aria-keyshortcuts="${(t) => t.ariaKeyshortcuts}"
            aria-label="${(t) => t.ariaLabel}"
            aria-labelledby="${(t) => t.ariaLabelledby}"
            aria-live="${(t) => t.ariaLive}"
            aria-owns="${(t) => t.ariaOwns}"
            aria-relevant="${(t) => t.ariaRelevant}"
            aria-roledescription="${(t) => t.ariaRoledescription}"
            @input="${(t, o) => t.handleTextInput()}"
            @change="${(t) => t.handleChange()}"
            ${U("control")}
        ></textarea>
    </template>
`, Wu = (i, e) => v`
    <template
        class="
            ${(t) => t.readOnly ? "readonly" : ""}
        "
    >
        <label
            part="label"
            for="control"
            class="${(t) => t.defaultSlottedNodes && t.defaultSlottedNodes.length ? "label" : "label label__hidden"}"
        >
            <slot
                ${ee({ property: "defaultSlottedNodes", filter: ja })}
            ></slot>
        </label>
        <div class="root" part="root">
            ${Ae(i, e)}
            <input
                class="control"
                part="control"
                id="control"
                @input="${(t) => t.handleTextInput()}"
                @change="${(t) => t.handleChange()}"
                ?autofocus="${(t) => t.autofocus}"
                ?disabled="${(t) => t.disabled}"
                list="${(t) => t.list}"
                maxlength="${(t) => t.maxlength}"
                minlength="${(t) => t.minlength}"
                pattern="${(t) => t.pattern}"
                placeholder="${(t) => t.placeholder}"
                ?readonly="${(t) => t.readOnly}"
                ?required="${(t) => t.required}"
                size="${(t) => t.size}"
                ?spellcheck="${(t) => t.spellcheck}"
                :value="${(t) => t.value}"
                type="${(t) => t.type}"
                aria-atomic="${(t) => t.ariaAtomic}"
                aria-busy="${(t) => t.ariaBusy}"
                aria-controls="${(t) => t.ariaControls}"
                aria-current="${(t) => t.ariaCurrent}"
                aria-describedby="${(t) => t.ariaDescribedby}"
                aria-details="${(t) => t.ariaDetails}"
                aria-disabled="${(t) => t.ariaDisabled}"
                aria-errormessage="${(t) => t.ariaErrormessage}"
                aria-flowto="${(t) => t.ariaFlowto}"
                aria-haspopup="${(t) => t.ariaHaspopup}"
                aria-hidden="${(t) => t.ariaHidden}"
                aria-invalid="${(t) => t.ariaInvalid}"
                aria-keyshortcuts="${(t) => t.ariaKeyshortcuts}"
                aria-label="${(t) => t.ariaLabel}"
                aria-labelledby="${(t) => t.ariaLabelledby}"
                aria-live="${(t) => t.ariaLive}"
                aria-owns="${(t) => t.ariaOwns}"
                aria-relevant="${(t) => t.ariaRelevant}"
                aria-roledescription="${(t) => t.ariaRoledescription}"
                ${U("control")}
            />
            ${Le(i, e)}
        </div>
    </template>
`, Yu = (i, e) => v`
    <template
        aria-label="${(t) => t.ariaLabel}"
        aria-labelledby="${(t) => t.ariaLabelledby}"
        aria-orientation="${(t) => t.orientation}"
        orientation="${(t) => t.orientation}"
        role="toolbar"
        @click="${(t, o) => t.clickHandler(o.event)}"
        @focusin="${(t, o) => t.focusinHandler(o.event)}"
        @keydown="${(t, o) => t.keydownHandler(o.event)}"
        ${Uo({
  property: "childItems",
  attributeFilter: ["disabled", "hidden"],
  filter: wt(),
  subtree: !0
})}
    >
        <slot name="label"></slot>
        <div class="positioning-region" part="positioning-region">
            ${Ae(i, e)}
            <slot
                ${ee({
  filter: wt(),
  property: "slottedItems"
})}
            ></slot>
            ${Le(i, e)}
        </div>
    </template>
`, br = Object.freeze({
  [bi.ArrowUp]: {
    [ce.vertical]: -1
  },
  [bi.ArrowDown]: {
    [ce.vertical]: 1
  },
  [bi.ArrowLeft]: {
    [ce.horizontal]: {
      [oe.ltr]: -1,
      [oe.rtl]: 1
    }
  },
  [bi.ArrowRight]: {
    [ce.horizontal]: {
      [oe.ltr]: 1,
      [oe.rtl]: -1
    }
  }
});
let ct = class extends O {
  constructor() {
    super(...arguments), this._activeIndex = 0, this.direction = oe.ltr, this.orientation = ce.horizontal;
  }
  get activeIndex() {
    return A.track(this, "activeIndex"), this._activeIndex;
  }
  set activeIndex(e) {
    this.$fastController.isConnected && (this._activeIndex = fn(0, this.focusableElements.length - 1, e), A.notify(this, "activeIndex"));
  }
  slottedItemsChanged() {
    this.$fastController.isConnected && this.reduceFocusableElements();
  }
  clickHandler(e) {
    var t;
    const o = (t = this.focusableElements) === null || t === void 0 ? void 0 : t.indexOf(e.target);
    return o > -1 && this.activeIndex !== o && this.setFocusedElement(o), !0;
  }
  childItemsChanged(e, t) {
    this.$fastController.isConnected && this.reduceFocusableElements();
  }
  connectedCallback() {
    super.connectedCallback(), this.direction = Qt(this);
  }
  focusinHandler(e) {
    const t = e.relatedTarget;
    !t || this.contains(t) || this.setFocusedElement();
  }
  getDirectionalIncrementer(e) {
    var t, o, s, n, r;
    return (r = (s = (o = (t = br[e]) === null || t === void 0 ? void 0 : t[this.orientation]) === null || o === void 0 ? void 0 : o[this.direction]) !== null && s !== void 0 ? s : (n = br[e]) === null || n === void 0 ? void 0 : n[this.orientation]) !== null && r !== void 0 ? r : 0;
  }
  keydownHandler(e) {
    const t = e.key;
    if (!(t in bi) || e.defaultPrevented || e.shiftKey)
      return !0;
    const o = this.getDirectionalIncrementer(t);
    if (!o)
      return !e.target.closest("[role=radiogroup]");
    const s = this.activeIndex + o;
    return this.focusableElements[s] && e.preventDefault(), this.setFocusedElement(s), !0;
  }
  get allSlottedItems() {
    return [
      ...this.start.assignedElements(),
      ...this.slottedItems,
      ...this.end.assignedElements()
    ];
  }
  reduceFocusableElements() {
    var e;
    const t = (e = this.focusableElements) === null || e === void 0 ? void 0 : e[this.activeIndex];
    this.focusableElements = this.allSlottedItems.reduce(ct.reduceFocusableItems, []);
    const o = this.focusableElements.indexOf(t);
    this.activeIndex = Math.max(0, o), this.setFocusableElements();
  }
  setFocusedElement(e = this.activeIndex) {
    var t;
    this.activeIndex = e, this.setFocusableElements(), (t = this.focusableElements[this.activeIndex]) === null || t === void 0 || t.focus();
  }
  static reduceFocusableItems(e, t) {
    var o, s, n, r;
    const l = t.getAttribute("role") === "radio", c = (s = (o = t.$fastController) === null || o === void 0 ? void 0 : o.definition.shadowOptions) === null || s === void 0 ? void 0 : s.delegatesFocus, u = Array.from((r = (n = t.shadowRoot) === null || n === void 0 ? void 0 : n.querySelectorAll("*")) !== null && r !== void 0 ? r : []).some((p) => fr(p));
    return !t.hasAttribute("disabled") && !t.hasAttribute("hidden") && (fr(t) || l || c || u) ? (e.push(t), e) : t.childElementCount ? e.concat(Array.from(t.children).reduce(ct.reduceFocusableItems, [])) : e;
  }
  setFocusableElements() {
    this.$fastController.isConnected && this.focusableElements.length > 0 && this.focusableElements.forEach((e, t) => {
      e.tabIndex = this.activeIndex === t ? 0 : -1;
    });
  }
};
a([
  g
], ct.prototype, "direction", void 0);
a([
  h
], ct.prototype, "orientation", void 0);
a([
  g
], ct.prototype, "slottedItems", void 0);
a([
  g
], ct.prototype, "slottedLabel", void 0);
a([
  g
], ct.prototype, "childItems", void 0);
class es {
}
a([
  h({ attribute: "aria-labelledby" })
], es.prototype, "ariaLabelledby", void 0);
a([
  h({ attribute: "aria-label" })
], es.prototype, "ariaLabel", void 0);
ae(es, se);
ae(ct, He, es);
const Xu = (i, e) => v`
        ${Q((t) => t.tooltipVisible, v`
            <${i.tagFor(W)}
                fixed-placement="true"
                auto-update-mode="${(t) => t.autoUpdateMode}"
                vertical-positioning-mode="${(t) => t.verticalPositioningMode}"
                vertical-default-position="${(t) => t.verticalDefaultPosition}"
                vertical-inset="${(t) => t.verticalInset}"
                vertical-scaling="${(t) => t.verticalScaling}"
                horizontal-positioning-mode="${(t) => t.horizontalPositioningMode}"
                horizontal-default-position="${(t) => t.horizontalDefaultPosition}"
                horizontal-scaling="${(t) => t.horizontalScaling}"
                horizontal-inset="${(t) => t.horizontalInset}"
                vertical-viewport-lock="${(t) => t.horizontalViewportLock}"
                horizontal-viewport-lock="${(t) => t.verticalViewportLock}"
                dir="${(t) => t.currentDirection}"
                ${U("region")}
            >
                <div class="tooltip" part="tooltip" role="tooltip">
                    <slot></slot>
                </div>
            </${i.tagFor(W)}>
        `)}
    `, Me = {
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left",
  start: "start",
  end: "end",
  topLeft: "top-left",
  topRight: "top-right",
  bottomLeft: "bottom-left",
  bottomRight: "bottom-right",
  topStart: "top-start",
  topEnd: "top-end",
  bottomStart: "bottom-start",
  bottomEnd: "bottom-end"
};
class be extends O {
  constructor() {
    super(...arguments), this.anchor = "", this.delay = 300, this.autoUpdateMode = "anchor", this.anchorElement = null, this.viewportElement = null, this.verticalPositioningMode = "dynamic", this.horizontalPositioningMode = "dynamic", this.horizontalInset = "false", this.verticalInset = "false", this.horizontalScaling = "content", this.verticalScaling = "content", this.verticalDefaultPosition = void 0, this.horizontalDefaultPosition = void 0, this.tooltipVisible = !1, this.currentDirection = oe.ltr, this.showDelayTimer = null, this.hideDelayTimer = null, this.isAnchorHoveredFocused = !1, this.isRegionHovered = !1, this.handlePositionChange = (e) => {
      this.classList.toggle("top", this.region.verticalPosition === "start"), this.classList.toggle("bottom", this.region.verticalPosition === "end"), this.classList.toggle("inset-top", this.region.verticalPosition === "insetStart"), this.classList.toggle("inset-bottom", this.region.verticalPosition === "insetEnd"), this.classList.toggle("center-vertical", this.region.verticalPosition === "center"), this.classList.toggle("left", this.region.horizontalPosition === "start"), this.classList.toggle("right", this.region.horizontalPosition === "end"), this.classList.toggle("inset-left", this.region.horizontalPosition === "insetStart"), this.classList.toggle("inset-right", this.region.horizontalPosition === "insetEnd"), this.classList.toggle("center-horizontal", this.region.horizontalPosition === "center");
    }, this.handleRegionMouseOver = (e) => {
      this.isRegionHovered = !0;
    }, this.handleRegionMouseOut = (e) => {
      this.isRegionHovered = !1, this.startHideDelayTimer();
    }, this.handleAnchorMouseOver = (e) => {
      if (this.tooltipVisible) {
        this.isAnchorHoveredFocused = !0;
        return;
      }
      this.startShowDelayTimer();
    }, this.handleAnchorMouseOut = (e) => {
      this.isAnchorHoveredFocused = !1, this.clearShowDelayTimer(), this.startHideDelayTimer();
    }, this.handleAnchorFocusIn = (e) => {
      this.startShowDelayTimer();
    }, this.handleAnchorFocusOut = (e) => {
      this.isAnchorHoveredFocused = !1, this.clearShowDelayTimer(), this.startHideDelayTimer();
    }, this.startHideDelayTimer = () => {
      this.clearHideDelayTimer(), this.tooltipVisible && (this.hideDelayTimer = window.setTimeout(() => {
        this.updateTooltipVisibility();
      }, 60));
    }, this.clearHideDelayTimer = () => {
      this.hideDelayTimer !== null && (clearTimeout(this.hideDelayTimer), this.hideDelayTimer = null);
    }, this.startShowDelayTimer = () => {
      if (!this.isAnchorHoveredFocused) {
        if (this.delay > 1) {
          this.showDelayTimer === null && (this.showDelayTimer = window.setTimeout(() => {
            this.startHover();
          }, this.delay));
          return;
        }
        this.startHover();
      }
    }, this.startHover = () => {
      this.isAnchorHoveredFocused = !0, this.updateTooltipVisibility();
    }, this.clearShowDelayTimer = () => {
      this.showDelayTimer !== null && (clearTimeout(this.showDelayTimer), this.showDelayTimer = null);
    }, this.getAnchor = () => {
      const e = this.getRootNode();
      return e instanceof ShadowRoot ? e.getElementById(this.anchor) : document.getElementById(this.anchor);
    }, this.handleDocumentKeydown = (e) => {
      if (!e.defaultPrevented && this.tooltipVisible)
        switch (e.key) {
          case Kt:
            this.isAnchorHoveredFocused = !1, this.updateTooltipVisibility(), this.$emit("dismiss");
            break;
        }
    }, this.updateTooltipVisibility = () => {
      if (this.visible === !1)
        this.hideTooltip();
      else if (this.visible === !0) {
        this.showTooltip();
        return;
      } else {
        if (this.isAnchorHoveredFocused || this.isRegionHovered) {
          this.showTooltip();
          return;
        }
        this.hideTooltip();
      }
    }, this.showTooltip = () => {
      this.tooltipVisible || (this.currentDirection = Qt(this), this.tooltipVisible = !0, document.addEventListener("keydown", this.handleDocumentKeydown), R.queueUpdate(this.setRegionProps));
    }, this.hideTooltip = () => {
      this.tooltipVisible && (this.clearHideDelayTimer(), this.region !== null && this.region !== void 0 && (this.region.removeEventListener("positionchange", this.handlePositionChange), this.region.viewportElement = null, this.region.anchorElement = null, this.region.removeEventListener("mouseover", this.handleRegionMouseOver), this.region.removeEventListener("mouseout", this.handleRegionMouseOut)), document.removeEventListener("keydown", this.handleDocumentKeydown), this.tooltipVisible = !1);
    }, this.setRegionProps = () => {
      this.tooltipVisible && (this.region.viewportElement = this.viewportElement, this.region.anchorElement = this.anchorElement, this.region.addEventListener("positionchange", this.handlePositionChange), this.region.addEventListener("mouseover", this.handleRegionMouseOver, {
        passive: !0
      }), this.region.addEventListener("mouseout", this.handleRegionMouseOut, {
        passive: !0
      }));
    };
  }
  visibleChanged() {
    this.$fastController.isConnected && (this.updateTooltipVisibility(), this.updateLayout());
  }
  anchorChanged() {
    this.$fastController.isConnected && (this.anchorElement = this.getAnchor());
  }
  positionChanged() {
    this.$fastController.isConnected && this.updateLayout();
  }
  anchorElementChanged(e) {
    if (this.$fastController.isConnected) {
      if (e != null && (e.removeEventListener("mouseover", this.handleAnchorMouseOver), e.removeEventListener("mouseout", this.handleAnchorMouseOut), e.removeEventListener("focusin", this.handleAnchorFocusIn), e.removeEventListener("focusout", this.handleAnchorFocusOut)), this.anchorElement !== null && this.anchorElement !== void 0) {
        this.anchorElement.addEventListener("mouseover", this.handleAnchorMouseOver, { passive: !0 }), this.anchorElement.addEventListener("mouseout", this.handleAnchorMouseOut, { passive: !0 }), this.anchorElement.addEventListener("focusin", this.handleAnchorFocusIn, {
          passive: !0
        }), this.anchorElement.addEventListener("focusout", this.handleAnchorFocusOut, { passive: !0 });
        const t = this.anchorElement.id;
        this.anchorElement.parentElement !== null && this.anchorElement.parentElement.querySelectorAll(":hover").forEach((o) => {
          o.id === t && this.startShowDelayTimer();
        });
      }
      this.region !== null && this.region !== void 0 && this.tooltipVisible && (this.region.anchorElement = this.anchorElement), this.updateLayout();
    }
  }
  viewportElementChanged() {
    this.region !== null && this.region !== void 0 && (this.region.viewportElement = this.viewportElement), this.updateLayout();
  }
  connectedCallback() {
    super.connectedCallback(), this.anchorElement = this.getAnchor(), this.updateTooltipVisibility();
  }
  disconnectedCallback() {
    this.hideTooltip(), this.clearShowDelayTimer(), this.clearHideDelayTimer(), super.disconnectedCallback();
  }
  updateLayout() {
    switch (this.verticalPositioningMode = "locktodefault", this.horizontalPositioningMode = "locktodefault", this.position) {
      case Me.top:
      case Me.bottom:
        this.verticalDefaultPosition = this.position, this.horizontalDefaultPosition = "center";
        break;
      case Me.right:
      case Me.left:
      case Me.start:
      case Me.end:
        this.verticalDefaultPosition = "center", this.horizontalDefaultPosition = this.position;
        break;
      case Me.topLeft:
        this.verticalDefaultPosition = "top", this.horizontalDefaultPosition = "left";
        break;
      case Me.topRight:
        this.verticalDefaultPosition = "top", this.horizontalDefaultPosition = "right";
        break;
      case Me.bottomLeft:
        this.verticalDefaultPosition = "bottom", this.horizontalDefaultPosition = "left";
        break;
      case Me.bottomRight:
        this.verticalDefaultPosition = "bottom", this.horizontalDefaultPosition = "right";
        break;
      case Me.topStart:
        this.verticalDefaultPosition = "top", this.horizontalDefaultPosition = "start";
        break;
      case Me.topEnd:
        this.verticalDefaultPosition = "top", this.horizontalDefaultPosition = "end";
        break;
      case Me.bottomStart:
        this.verticalDefaultPosition = "bottom", this.horizontalDefaultPosition = "start";
        break;
      case Me.bottomEnd:
        this.verticalDefaultPosition = "bottom", this.horizontalDefaultPosition = "end";
        break;
      default:
        this.verticalPositioningMode = "dynamic", this.horizontalPositioningMode = "dynamic", this.verticalDefaultPosition = void 0, this.horizontalDefaultPosition = "center";
        break;
    }
  }
}
a([
  h({ mode: "boolean" })
], be.prototype, "visible", void 0);
a([
  h
], be.prototype, "anchor", void 0);
a([
  h
], be.prototype, "delay", void 0);
a([
  h
], be.prototype, "position", void 0);
a([
  h({ attribute: "auto-update-mode" })
], be.prototype, "autoUpdateMode", void 0);
a([
  h({ attribute: "horizontal-viewport-lock" })
], be.prototype, "horizontalViewportLock", void 0);
a([
  h({ attribute: "vertical-viewport-lock" })
], be.prototype, "verticalViewportLock", void 0);
a([
  g
], be.prototype, "anchorElement", void 0);
a([
  g
], be.prototype, "viewportElement", void 0);
a([
  g
], be.prototype, "verticalPositioningMode", void 0);
a([
  g
], be.prototype, "horizontalPositioningMode", void 0);
a([
  g
], be.prototype, "horizontalInset", void 0);
a([
  g
], be.prototype, "verticalInset", void 0);
a([
  g
], be.prototype, "horizontalScaling", void 0);
a([
  g
], be.prototype, "verticalScaling", void 0);
a([
  g
], be.prototype, "verticalDefaultPosition", void 0);
a([
  g
], be.prototype, "horizontalDefaultPosition", void 0);
a([
  g
], be.prototype, "tooltipVisible", void 0);
a([
  g
], be.prototype, "currentDirection", void 0);
const Qu = (i, e) => v`
    <template
        role="treeitem"
        slot="${(t) => t.isNestedItem() ? "item" : void 0}"
        tabindex="-1"
        class="${(t) => t.expanded ? "expanded" : ""} ${(t) => t.selected ? "selected" : ""} ${(t) => t.nested ? "nested" : ""}
            ${(t) => t.disabled ? "disabled" : ""}"
        aria-expanded="${(t) => t.childItems && t.childItemLength() > 0 ? t.expanded : void 0}"
        aria-selected="${(t) => t.selected}"
        aria-disabled="${(t) => t.disabled}"
        @focusin="${(t, o) => t.handleFocus(o.event)}"
        @focusout="${(t, o) => t.handleBlur(o.event)}"
        ${Uo({
  property: "childItems",
  filter: wt()
})}
    >
        <div class="positioning-region" part="positioning-region">
            <div class="content-region" part="content-region">
                ${Q((t) => t.childItems && t.childItemLength() > 0, v`
                        <div
                            aria-hidden="true"
                            class="expand-collapse-button"
                            part="expand-collapse-button"
                            @click="${(t, o) => t.handleExpandCollapseButtonClick(o.event)}"
                            ${U("expandCollapseButton")}
                        >
                            <slot name="expand-collapse-glyph">
                                ${e.expandCollapseGlyph || ""}
                            </slot>
                        </div>
                    `)}
                ${Ae(i, e)}
                <slot></slot>
                ${Le(i, e)}
            </div>
        </div>
        ${Q((t) => t.childItems && t.childItemLength() > 0 && (t.expanded || t.renderCollapsedChildren), v`
                <div role="group" class="items" part="items">
                    <slot name="item" ${ee("items")}></slot>
                </div>
            `)}
    </template>
`;
function At(i) {
  return ki(i) && i.getAttribute("role") === "treeitem";
}
class he extends O {
  constructor() {
    super(...arguments), this.expanded = !1, this.focusable = !1, this.isNestedItem = () => At(this.parentElement), this.handleExpandCollapseButtonClick = (e) => {
      !this.disabled && !e.defaultPrevented && (this.expanded = !this.expanded);
    }, this.handleFocus = (e) => {
      this.setAttribute("tabindex", "0");
    }, this.handleBlur = (e) => {
      this.setAttribute("tabindex", "-1");
    };
  }
  expandedChanged() {
    this.$fastController.isConnected && this.$emit("expanded-change", this);
  }
  selectedChanged() {
    this.$fastController.isConnected && this.$emit("selected-change", this);
  }
  itemsChanged(e, t) {
    this.$fastController.isConnected && this.items.forEach((o) => {
      At(o) && (o.nested = !0);
    });
  }
  static focusItem(e) {
    e.focusable = !0, e.focus();
  }
  childItemLength() {
    const e = this.childItems.filter((t) => At(t));
    return e ? e.length : 0;
  }
}
a([
  h({ mode: "boolean" })
], he.prototype, "expanded", void 0);
a([
  h({ mode: "boolean" })
], he.prototype, "selected", void 0);
a([
  h({ mode: "boolean" })
], he.prototype, "disabled", void 0);
a([
  g
], he.prototype, "focusable", void 0);
a([
  g
], he.prototype, "childItems", void 0);
a([
  g
], he.prototype, "items", void 0);
a([
  g
], he.prototype, "nested", void 0);
a([
  g
], he.prototype, "renderCollapsedChildren", void 0);
ae(he, He);
const Zu = (i, e) => v`
    <template
        role="tree"
        ${U("treeView")}
        @keydown="${(t, o) => t.handleKeyDown(o.event)}"
        @focusin="${(t, o) => t.handleFocus(o.event)}"
        @focusout="${(t, o) => t.handleBlur(o.event)}"
        @click="${(t, o) => t.handleClick(o.event)}"
        @selected-change="${(t, o) => t.handleSelectedChange(o.event)}"
    >
        <slot ${ee("slottedTreeItems")}></slot>
    </template>
`;
class ts extends O {
  constructor() {
    super(...arguments), this.currentFocused = null, this.handleFocus = (e) => {
      if (!(this.slottedTreeItems.length < 1)) {
        if (e.target === this) {
          this.currentFocused === null && (this.currentFocused = this.getValidFocusableItem()), this.currentFocused !== null && he.focusItem(this.currentFocused);
          return;
        }
        this.contains(e.target) && (this.setAttribute("tabindex", "-1"), this.currentFocused = e.target);
      }
    }, this.handleBlur = (e) => {
      e.target instanceof HTMLElement && (e.relatedTarget === null || !this.contains(e.relatedTarget)) && this.setAttribute("tabindex", "0");
    }, this.handleKeyDown = (e) => {
      if (e.defaultPrevented)
        return;
      if (this.slottedTreeItems.length < 1)
        return !0;
      const t = this.getVisibleNodes();
      switch (e.key) {
        case ut:
          t.length && he.focusItem(t[0]);
          return;
        case pt:
          t.length && he.focusItem(t[t.length - 1]);
          return;
        case kt:
          if (e.target && this.isFocusableElement(e.target)) {
            const o = e.target;
            o instanceof he && o.childItemLength() > 0 && o.expanded ? o.expanded = !1 : o instanceof he && o.parentElement instanceof he && he.focusItem(o.parentElement);
          }
          return !1;
        case Ct:
          if (e.target && this.isFocusableElement(e.target)) {
            const o = e.target;
            o instanceof he && o.childItemLength() > 0 && !o.expanded ? o.expanded = !0 : o instanceof he && o.childItemLength() > 0 && this.focusNextNode(1, e.target);
          }
          return;
        case _e:
          e.target && this.isFocusableElement(e.target) && this.focusNextNode(1, e.target);
          return;
        case Ue:
          e.target && this.isFocusableElement(e.target) && this.focusNextNode(-1, e.target);
          return;
        case st:
          this.handleClick(e);
          return;
      }
      return !0;
    }, this.handleSelectedChange = (e) => {
      if (e.defaultPrevented)
        return;
      if (!(e.target instanceof Element) || !At(e.target))
        return !0;
      const t = e.target;
      t.selected ? (this.currentSelected && this.currentSelected !== t && (this.currentSelected.selected = !1), this.currentSelected = t) : !t.selected && this.currentSelected === t && (this.currentSelected = null);
    }, this.setItems = () => {
      const e = this.treeView.querySelector("[aria-selected='true']");
      this.currentSelected = e, (this.currentFocused === null || !this.contains(this.currentFocused)) && (this.currentFocused = this.getValidFocusableItem()), this.nested = this.checkForNestedItems(), this.getVisibleNodes().forEach((o) => {
        At(o) && (o.nested = this.nested);
      });
    }, this.isFocusableElement = (e) => At(e), this.isSelectedElement = (e) => e.selected;
  }
  slottedTreeItemsChanged() {
    this.$fastController.isConnected && this.setItems();
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("tabindex", "0"), R.queueUpdate(() => {
      this.setItems();
    });
  }
  handleClick(e) {
    if (e.defaultPrevented)
      return;
    if (!(e.target instanceof Element) || !At(e.target))
      return !0;
    const t = e.target;
    t.disabled || (t.selected = !t.selected);
  }
  focusNextNode(e, t) {
    const o = this.getVisibleNodes();
    if (!o)
      return;
    const s = o[o.indexOf(t) + e];
    ki(s) && he.focusItem(s);
  }
  getValidFocusableItem() {
    const e = this.getVisibleNodes();
    let t = e.findIndex(this.isSelectedElement);
    return t === -1 && (t = e.findIndex(this.isFocusableElement)), t !== -1 ? e[t] : null;
  }
  checkForNestedItems() {
    return this.slottedTreeItems.some((e) => At(e) && e.querySelector("[role='treeitem']"));
  }
  getVisibleNodes() {
    return Rd(this, "[role='treeitem']") || [];
  }
}
a([
  h({ attribute: "render-collapsed-nodes" })
], ts.prototype, "renderCollapsedNodes", void 0);
a([
  g
], ts.prototype, "currentSelected", void 0);
a([
  g
], ts.prototype, "slottedTreeItems", void 0);
class Ju {
  constructor(e) {
    this.listenerCache = /* @__PURE__ */ new WeakMap(), this.query = e;
  }
  bind(e) {
    const { query: t } = this, o = this.constructListener(e);
    o.bind(t)(), t.addListener(o), this.listenerCache.set(e, o);
  }
  unbind(e) {
    const t = this.listenerCache.get(e);
    t && (this.query.removeListener(t), this.listenerCache.delete(e));
  }
}
class bo extends Ju {
  constructor(e, t) {
    super(e), this.styles = t;
  }
  static with(e) {
    return (t) => new bo(e, t);
  }
  constructListener(e) {
    let t = !1;
    const o = this.styles;
    return function() {
      const { matches: n } = this;
      n && !t ? (e.$fastController.addStyles(o), t = n) : !n && t && (e.$fastController.removeStyles(o), t = n);
    };
  }
  unbind(e) {
    super.unbind(e), e.$fastController.removeStyles(this.styles);
  }
}
const M = bo.with(window.matchMedia("(forced-colors)"));
bo.with(window.matchMedia("(prefers-color-scheme: dark)"));
bo.with(window.matchMedia("(prefers-color-scheme: light)"));
class Ku {
  constructor(e, t, o) {
    this.propertyName = e, this.value = t, this.styles = o;
  }
  bind(e) {
    A.getNotifier(e).subscribe(this, this.propertyName), this.handleChange(e, this.propertyName);
  }
  unbind(e) {
    A.getNotifier(e).unsubscribe(this, this.propertyName), e.$fastController.removeStyles(this.styles);
  }
  handleChange(e, t) {
    e[t] === this.value ? e.$fastController.addStyles(this.styles) : e.$fastController.removeStyles(this.styles);
  }
}
const de = "not-allowed", ep = ":host([hidden]){display:none}";
function B(i) {
  return `${ep}:host{display:${i}}`;
}
const w = Od() ? "focus-visible" : "focus";
function bt(i, e, t) {
  return isNaN(i) || i <= e ? e : i >= t ? t : i;
}
function Ds(i, e, t) {
  return isNaN(i) || i <= e ? 0 : i >= t ? 1 : i / (t - e);
}
function qt(i, e, t) {
  return isNaN(i) ? e : e + i * (t - e);
}
function vr(i) {
  return i * (Math.PI / 180);
}
function tp(i) {
  return i * (180 / Math.PI);
}
function ip(i) {
  const e = Math.round(bt(i, 0, 255)).toString(16);
  return e.length === 1 ? "0" + e : e;
}
function Ie(i, e, t) {
  return isNaN(i) || i <= 0 ? e : i >= 1 ? t : e + i * (t - e);
}
function wn(i, e, t) {
  if (i <= 0)
    return e % 360;
  if (i >= 1)
    return t % 360;
  const o = (e - t + 360) % 360, s = (t - e + 360) % 360;
  return o <= s ? (e - o * i + 360) % 360 : (e + o * i + 360) % 360;
}
function ve(i, e) {
  const t = Math.pow(10, e);
  return Math.round(i * t) / t;
}
class Zt {
  constructor(e, t, o) {
    this.h = e, this.s = t, this.l = o;
  }
  static fromObject(e) {
    return e && !isNaN(e.h) && !isNaN(e.s) && !isNaN(e.l) ? new Zt(e.h, e.s, e.l) : null;
  }
  equalValue(e) {
    return this.h === e.h && this.s === e.s && this.l === e.l;
  }
  roundToPrecision(e) {
    return new Zt(ve(this.h, e), ve(this.s, e), ve(this.l, e));
  }
  toObject() {
    return { h: this.h, s: this.s, l: this.l };
  }
}
class io {
  constructor(e, t, o) {
    this.h = e, this.s = t, this.v = o;
  }
  static fromObject(e) {
    return e && !isNaN(e.h) && !isNaN(e.s) && !isNaN(e.v) ? new io(e.h, e.s, e.v) : null;
  }
  equalValue(e) {
    return this.h === e.h && this.s === e.s && this.v === e.v;
  }
  roundToPrecision(e) {
    return new io(ve(this.h, e), ve(this.s, e), ve(this.v, e));
  }
  toObject() {
    return { h: this.h, s: this.s, v: this.v };
  }
}
class $e {
  constructor(e, t, o) {
    this.l = e, this.a = t, this.b = o;
  }
  static fromObject(e) {
    return e && !isNaN(e.l) && !isNaN(e.a) && !isNaN(e.b) ? new $e(e.l, e.a, e.b) : null;
  }
  equalValue(e) {
    return this.l === e.l && this.a === e.a && this.b === e.b;
  }
  roundToPrecision(e) {
    return new $e(ve(this.l, e), ve(this.a, e), ve(this.b, e));
  }
  toObject() {
    return { l: this.l, a: this.a, b: this.b };
  }
}
$e.epsilon = 216 / 24389;
$e.kappa = 24389 / 27;
class Ii {
  constructor(e, t, o) {
    this.l = e, this.c = t, this.h = o;
  }
  static fromObject(e) {
    return e && !isNaN(e.l) && !isNaN(e.c) && !isNaN(e.h) ? new Ii(e.l, e.c, e.h) : null;
  }
  equalValue(e) {
    return this.l === e.l && this.c === e.c && this.h === e.h;
  }
  roundToPrecision(e) {
    return new Ii(ve(this.l, e), ve(this.c, e), ve(this.h, e));
  }
  toObject() {
    return { l: this.l, c: this.c, h: this.h };
  }
}
class pe {
  constructor(e, t, o, s) {
    this.r = e, this.g = t, this.b = o, this.a = typeof s == "number" && !isNaN(s) ? s : 1;
  }
  static fromObject(e) {
    return e && !isNaN(e.r) && !isNaN(e.g) && !isNaN(e.b) ? new pe(e.r, e.g, e.b, e.a) : null;
  }
  equalValue(e) {
    return this.r === e.r && this.g === e.g && this.b === e.b && this.a === e.a;
  }
  toStringHexRGB() {
    return "#" + [this.r, this.g, this.b].map(this.formatHexValue).join("");
  }
  toStringHexRGBA() {
    return this.toStringHexRGB() + this.formatHexValue(this.a);
  }
  toStringHexARGB() {
    return "#" + [this.a, this.r, this.g, this.b].map(this.formatHexValue).join("");
  }
  toStringWebRGB() {
    return `rgb(${Math.round(qt(this.r, 0, 255))},${Math.round(qt(this.g, 0, 255))},${Math.round(qt(this.b, 0, 255))})`;
  }
  toStringWebRGBA() {
    return `rgba(${Math.round(qt(this.r, 0, 255))},${Math.round(qt(this.g, 0, 255))},${Math.round(qt(this.b, 0, 255))},${bt(this.a, 0, 1)})`;
  }
  roundToPrecision(e) {
    return new pe(ve(this.r, e), ve(this.g, e), ve(this.b, e), ve(this.a, e));
  }
  clamp() {
    return new pe(bt(this.r, 0, 1), bt(this.g, 0, 1), bt(this.b, 0, 1), bt(this.a, 0, 1));
  }
  toObject() {
    return { r: this.r, g: this.g, b: this.b, a: this.a };
  }
  formatHexValue(e) {
    return ip(qt(e, 0, 255));
  }
}
class Ve {
  constructor(e, t, o) {
    this.x = e, this.y = t, this.z = o;
  }
  static fromObject(e) {
    return e && !isNaN(e.x) && !isNaN(e.y) && !isNaN(e.z) ? new Ve(e.x, e.y, e.z) : null;
  }
  equalValue(e) {
    return this.x === e.x && this.y === e.y && this.z === e.z;
  }
  roundToPrecision(e) {
    return new Ve(ve(this.x, e), ve(this.y, e), ve(this.z, e));
  }
  toObject() {
    return { x: this.x, y: this.y, z: this.z };
  }
}
Ve.whitePoint = new Ve(0.95047, 1, 1.08883);
function Us(i) {
  return i.r * 0.2126 + i.g * 0.7152 + i.b * 0.0722;
}
function qs(i) {
  function e(t) {
    return t <= 0.03928 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
  }
  return Us(new pe(e(i.r), e(i.g), e(i.b), 1));
}
const yr = (i, e) => (i + 0.05) / (e + 0.05);
function xr(i, e) {
  const t = qs(i), o = qs(e);
  return t > o ? yr(t, o) : yr(o, t);
}
function oo(i) {
  const e = Math.max(i.r, i.g, i.b), t = Math.min(i.r, i.g, i.b), o = e - t;
  let s = 0;
  o !== 0 && (e === i.r ? s = 60 * ((i.g - i.b) / o % 6) : e === i.g ? s = 60 * ((i.b - i.r) / o + 2) : s = 60 * ((i.r - i.g) / o + 4)), s < 0 && (s += 360);
  const n = (e + t) / 2;
  let r = 0;
  return o !== 0 && (r = o / (1 - Math.abs(2 * n - 1))), new Zt(s, r, n);
}
function Gs(i, e = 1) {
  const t = (1 - Math.abs(2 * i.l - 1)) * i.s, o = t * (1 - Math.abs(i.h / 60 % 2 - 1)), s = i.l - t / 2;
  let n = 0, r = 0, l = 0;
  return i.h < 60 ? (n = t, r = o, l = 0) : i.h < 120 ? (n = o, r = t, l = 0) : i.h < 180 ? (n = 0, r = t, l = o) : i.h < 240 ? (n = 0, r = o, l = t) : i.h < 300 ? (n = o, r = 0, l = t) : i.h < 360 && (n = t, r = 0, l = o), new pe(n + s, r + s, l + s, e);
}
function $r(i) {
  const e = Math.max(i.r, i.g, i.b), t = Math.min(i.r, i.g, i.b), o = e - t;
  let s = 0;
  o !== 0 && (e === i.r ? s = 60 * ((i.g - i.b) / o % 6) : e === i.g ? s = 60 * ((i.b - i.r) / o + 2) : s = 60 * ((i.r - i.g) / o + 4)), s < 0 && (s += 360);
  let n = 0;
  return e !== 0 && (n = o / e), new io(s, n, e);
}
function op(i, e = 1) {
  const t = i.s * i.v, o = t * (1 - Math.abs(i.h / 60 % 2 - 1)), s = i.v - t;
  let n = 0, r = 0, l = 0;
  return i.h < 60 ? (n = t, r = o, l = 0) : i.h < 120 ? (n = o, r = t, l = 0) : i.h < 180 ? (n = 0, r = t, l = o) : i.h < 240 ? (n = 0, r = o, l = t) : i.h < 300 ? (n = o, r = 0, l = t) : i.h < 360 && (n = t, r = 0, l = o), new pe(n + s, r + s, l + s, e);
}
function sp(i) {
  let e = 0, t = 0;
  return i.h !== 0 && (e = Math.cos(vr(i.h)) * i.c, t = Math.sin(vr(i.h)) * i.c), new $e(i.l, e, t);
}
function np(i) {
  let e = 0;
  (Math.abs(i.b) > 1e-3 || Math.abs(i.a) > 1e-3) && (e = tp(Math.atan2(i.b, i.a))), e < 0 && (e += 360);
  const t = Math.sqrt(i.a * i.a + i.b * i.b);
  return new Ii(i.l, t, e);
}
function rp(i) {
  const e = (i.l + 16) / 116, t = e + i.a / 500, o = e - i.b / 200, s = Math.pow(t, 3), n = Math.pow(e, 3), r = Math.pow(o, 3);
  let l = 0;
  s > $e.epsilon ? l = s : l = (116 * t - 16) / $e.kappa;
  let c = 0;
  i.l > $e.epsilon * $e.kappa ? c = n : c = i.l / $e.kappa;
  let u = 0;
  return r > $e.epsilon ? u = r : u = (116 * o - 16) / $e.kappa, l = Ve.whitePoint.x * l, c = Ve.whitePoint.y * c, u = Ve.whitePoint.z * u, new Ve(l, c, u);
}
function ap(i) {
  function e(c) {
    return c > $e.epsilon ? Math.pow(c, 1 / 3) : ($e.kappa * c + 16) / 116;
  }
  const t = e(i.x / Ve.whitePoint.x), o = e(i.y / Ve.whitePoint.y), s = e(i.z / Ve.whitePoint.z), n = 116 * o - 16, r = 500 * (t - o), l = 200 * (o - s);
  return new $e(n, r, l);
}
function Ws(i) {
  function e(c) {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  const t = e(i.r), o = e(i.g), s = e(i.b), n = t * 0.4124564 + o * 0.3575761 + s * 0.1804375, r = t * 0.2126729 + o * 0.7151522 + s * 0.072175, l = t * 0.0193339 + o * 0.119192 + s * 0.9503041;
  return new Ve(n, r, l);
}
function Ga(i, e = 1) {
  function t(r) {
    return r <= 31308e-7 ? r * 12.92 : 1.055 * Math.pow(r, 1 / 2.4) - 0.055;
  }
  const o = t(i.x * 3.2404542 - i.y * 1.5371385 - i.z * 0.4985314), s = t(i.x * -0.969266 + i.y * 1.8760108 + i.z * 0.041556), n = t(i.x * 0.0556434 - i.y * 0.2040259 + i.z * 1.0572252);
  return new pe(o, s, n, e);
}
function Ys(i) {
  return ap(Ws(i));
}
function Wa(i, e = 1) {
  return Ga(rp(i), e);
}
function Xs(i) {
  return np(Ys(i));
}
function Ya(i, e = 1) {
  return Wa(sp(i), e);
}
function wr(i, e, t = 18) {
  const o = Xs(i);
  let s = o.c + e * t;
  return s < 0 && (s = 0), Ya(new Ii(o.l, s, o.h));
}
function Os(i, e) {
  return i * e;
}
function kr(i, e) {
  return new pe(Os(i.r, e.r), Os(i.g, e.g), Os(i.b, e.b), 1);
}
function Ls(i, e) {
  return i < 0.5 ? bt(2 * e * i, 0, 1) : bt(1 - 2 * (1 - e) * (1 - i), 0, 1);
}
function Cr(i, e) {
  return new pe(Ls(i.r, e.r), Ls(i.g, e.g), Ls(i.b, e.b), 1);
}
var Tr;
(function(i) {
  i[i.Burn = 0] = "Burn", i[i.Color = 1] = "Color", i[i.Darken = 2] = "Darken", i[i.Dodge = 3] = "Dodge", i[i.Lighten = 4] = "Lighten", i[i.Multiply = 5] = "Multiply", i[i.Overlay = 6] = "Overlay", i[i.Screen = 7] = "Screen";
})(Tr || (Tr = {}));
function lp(i, e, t) {
  return isNaN(i) || i <= 0 ? e : i >= 1 ? t : new pe(Ie(i, e.r, t.r), Ie(i, e.g, t.g), Ie(i, e.b, t.b), Ie(i, e.a, t.a));
}
function cp(i, e, t) {
  return isNaN(i) || i <= 0 ? e : i >= 1 ? t : new Zt(wn(i, e.h, t.h), Ie(i, e.s, t.s), Ie(i, e.l, t.l));
}
function dp(i, e, t) {
  return isNaN(i) || i <= 0 ? e : i >= 1 ? t : new io(wn(i, e.h, t.h), Ie(i, e.s, t.s), Ie(i, e.v, t.v));
}
function hp(i, e, t) {
  return isNaN(i) || i <= 0 ? e : i >= 1 ? t : new Ve(Ie(i, e.x, t.x), Ie(i, e.y, t.y), Ie(i, e.z, t.z));
}
function up(i, e, t) {
  return isNaN(i) || i <= 0 ? e : i >= 1 ? t : new $e(Ie(i, e.l, t.l), Ie(i, e.a, t.a), Ie(i, e.b, t.b));
}
function pp(i, e, t) {
  return isNaN(i) || i <= 0 ? e : i >= 1 ? t : new Ii(Ie(i, e.l, t.l), Ie(i, e.c, t.c), wn(i, e.h, t.h));
}
var Be;
(function(i) {
  i[i.RGB = 0] = "RGB", i[i.HSL = 1] = "HSL", i[i.HSV = 2] = "HSV", i[i.XYZ = 3] = "XYZ", i[i.LAB = 4] = "LAB", i[i.LCH = 5] = "LCH";
})(Be || (Be = {}));
function ji(i, e, t, o) {
  if (isNaN(i) || i <= 0)
    return t;
  if (i >= 1)
    return o;
  switch (e) {
    case Be.HSL:
      return Gs(cp(i, oo(t), oo(o)));
    case Be.HSV:
      return op(dp(i, $r(t), $r(o)));
    case Be.XYZ:
      return Ga(hp(i, Ws(t), Ws(o)));
    case Be.LAB:
      return Wa(up(i, Ys(t), Ys(o)));
    case Be.LCH:
      return Ya(pp(i, Xs(t), Xs(o)));
    default:
      return lp(i, t, o);
  }
}
class Xe {
  constructor(e) {
    if (e == null || e.length === 0)
      throw new Error("The stops argument must be non-empty");
    this.stops = this.sortColorScaleStops(e);
  }
  static createBalancedColorScale(e) {
    if (e == null || e.length === 0)
      throw new Error("The colors argument must be non-empty");
    const t = new Array(e.length);
    for (let o = 0; o < e.length; o++)
      o === 0 ? t[o] = { color: e[o], position: 0 } : o === e.length - 1 ? t[o] = { color: e[o], position: 1 } : t[o] = {
        color: e[o],
        position: o * (1 / (e.length - 1))
      };
    return new Xe(t);
  }
  getColor(e, t = Be.RGB) {
    if (this.stops.length === 1)
      return this.stops[0].color;
    if (e <= 0)
      return this.stops[0].color;
    if (e >= 1)
      return this.stops[this.stops.length - 1].color;
    let o = 0;
    for (let r = 0; r < this.stops.length; r++)
      this.stops[r].position <= e && (o = r);
    let s = o + 1;
    s >= this.stops.length && (s = this.stops.length - 1);
    const n = (e - this.stops[o].position) * (1 / (this.stops[s].position - this.stops[o].position));
    return ji(n, t, this.stops[o].color, this.stops[s].color);
  }
  trim(e, t, o = Be.RGB) {
    if (e < 0 || t > 1 || t < e)
      throw new Error("Invalid bounds");
    if (e === t)
      return new Xe([
        { color: this.getColor(e, o), position: 0 }
      ]);
    const s = [];
    for (let l = 0; l < this.stops.length; l++)
      this.stops[l].position >= e && this.stops[l].position <= t && s.push(this.stops[l]);
    if (s.length === 0)
      return new Xe([
        { color: this.getColor(e), position: e },
        { color: this.getColor(t), position: t }
      ]);
    s[0].position !== e && s.unshift({
      color: this.getColor(e),
      position: e
    }), s[s.length - 1].position !== t && s.push({
      color: this.getColor(t),
      position: t
    });
    const n = t - e, r = new Array(s.length);
    for (let l = 0; l < s.length; l++)
      r[l] = {
        color: s[l].color,
        position: (s[l].position - e) / n
      };
    return new Xe(r);
  }
  findNextColor(e, t, o = !1, s = Be.RGB, n = 5e-3, r = 32) {
    isNaN(e) || e <= 0 ? e = 0 : e >= 1 && (e = 1);
    const l = this.getColor(e, s), c = o ? 0 : 1, u = this.getColor(c, s);
    if (xr(l, u) <= t)
      return c;
    let f = o ? 0 : e, b = o ? e : 0, I = c, $ = 0;
    for (; $ <= r; ) {
      I = Math.abs(b - f) / 2 + f;
      const k = this.getColor(I, s), L = xr(l, k);
      if (Math.abs(L - t) <= n)
        return I;
      L > t ? o ? f = I : b = I : o ? b = I : f = I, $++;
    }
    return I;
  }
  clone() {
    const e = new Array(this.stops.length);
    for (let t = 0; t < e.length; t++)
      e[t] = {
        color: this.stops[t].color,
        position: this.stops[t].position
      };
    return new Xe(e);
  }
  sortColorScaleStops(e) {
    return e.sort((t, o) => {
      const s = t.position, n = o.position;
      return s < n ? -1 : s > n ? 1 : 0;
    });
  }
}
const fp = /^#((?:[0-9a-f]{6}|[0-9a-f]{3}))$/i;
function si(i) {
  const e = fp.exec(i);
  if (e === null)
    return null;
  let t = e[1];
  if (t.length === 3) {
    const s = t.charAt(0), n = t.charAt(1), r = t.charAt(2);
    t = s.concat(s, n, n, r, r);
  }
  const o = parseInt(t, 16);
  return isNaN(o) ? null : new pe(Ds((o & 16711680) >>> 16, 0, 255), Ds((o & 65280) >>> 8, 0, 255), Ds(o & 255, 0, 255), 1);
}
class Mt {
  constructor(e) {
    this.config = Object.assign({}, Mt.defaultPaletteConfig, e), this.palette = [], this.updatePaletteColors();
  }
  updatePaletteGenerationValues(e) {
    let t = !1;
    for (const o in e)
      this.config[o] && (this.config[o].equalValue ? this.config[o].equalValue(e[o]) || (this.config[o] = e[o], t = !0) : e[o] !== this.config[o] && (this.config[o] = e[o], t = !0));
    return t && this.updatePaletteColors(), t;
  }
  updatePaletteColors() {
    const e = this.generatePaletteColorScale();
    for (let t = 0; t < this.config.steps; t++)
      this.palette[t] = e.getColor(t / (this.config.steps - 1), this.config.interpolationMode);
  }
  generatePaletteColorScale() {
    const e = oo(this.config.baseColor), o = new Xe([
      { position: 0, color: this.config.scaleColorLight },
      { position: 0.5, color: this.config.baseColor },
      { position: 1, color: this.config.scaleColorDark }
    ]).trim(this.config.clipLight, 1 - this.config.clipDark), s = o.getColor(0), n = o.getColor(1);
    let r = s, l = n;
    if (e.s >= this.config.saturationAdjustmentCutoff && (r = wr(r, this.config.saturationLight), l = wr(l, this.config.saturationDark)), this.config.multiplyLight !== 0) {
      const c = kr(this.config.baseColor, r);
      r = ji(this.config.multiplyLight, this.config.interpolationMode, r, c);
    }
    if (this.config.multiplyDark !== 0) {
      const c = kr(this.config.baseColor, l);
      l = ji(this.config.multiplyDark, this.config.interpolationMode, l, c);
    }
    if (this.config.overlayLight !== 0) {
      const c = Cr(this.config.baseColor, r);
      r = ji(this.config.overlayLight, this.config.interpolationMode, r, c);
    }
    if (this.config.overlayDark !== 0) {
      const c = Cr(this.config.baseColor, l);
      l = ji(this.config.overlayDark, this.config.interpolationMode, l, c);
    }
    return this.config.baseScalePosition ? this.config.baseScalePosition <= 0 ? new Xe([
      { position: 0, color: this.config.baseColor },
      { position: 1, color: l.clamp() }
    ]) : this.config.baseScalePosition >= 1 ? new Xe([
      { position: 0, color: r.clamp() },
      { position: 1, color: this.config.baseColor }
    ]) : new Xe([
      { position: 0, color: r.clamp() },
      {
        position: this.config.baseScalePosition,
        color: this.config.baseColor
      },
      { position: 1, color: l.clamp() }
    ]) : new Xe([
      { position: 0, color: r.clamp() },
      { position: 0.5, color: this.config.baseColor },
      { position: 1, color: l.clamp() }
    ]);
  }
}
Mt.defaultPaletteConfig = {
  baseColor: si("#808080"),
  steps: 11,
  interpolationMode: Be.RGB,
  scaleColorLight: new pe(1, 1, 1, 1),
  scaleColorDark: new pe(0, 0, 0, 1),
  clipLight: 0.185,
  clipDark: 0.16,
  saturationAdjustmentCutoff: 0.05,
  saturationLight: 0.35,
  saturationDark: 1.25,
  overlayLight: 0,
  overlayDark: 0.25,
  multiplyLight: 0,
  multiplyDark: 0,
  baseScalePosition: 0.5
};
Mt.greyscalePaletteConfig = {
  baseColor: si("#808080"),
  steps: 11,
  interpolationMode: Be.RGB,
  scaleColorLight: new pe(1, 1, 1, 1),
  scaleColorDark: new pe(0, 0, 0, 1),
  clipLight: 0,
  clipDark: 0,
  saturationAdjustmentCutoff: 0,
  saturationLight: 0,
  saturationDark: 0,
  overlayLight: 0,
  overlayDark: 0,
  multiplyLight: 0,
  multiplyDark: 0,
  baseScalePosition: 0.5
};
Mt.defaultPaletteConfig.scaleColorLight, Mt.defaultPaletteConfig.scaleColorDark;
class is {
  constructor(e) {
    this.palette = [], this.config = Object.assign({}, is.defaultPaletteConfig, e), this.regenPalettes();
  }
  regenPalettes() {
    let e = this.config.steps;
    (isNaN(e) || e < 3) && (e = 3);
    const t = 0.14, o = 0.06, s = new pe(t, t, t, 1), n = 94, l = new Mt(Object.assign(Object.assign({}, Mt.greyscalePaletteConfig), { baseColor: s, baseScalePosition: (1 - t) * 100 / n, steps: e })).palette, c = Us(this.config.baseColor), u = oo(this.config.baseColor).l, p = (c + u) / 2, b = this.matchRelativeLuminanceIndex(p, l) / (e - 1), $ = this.matchRelativeLuminanceIndex(t, l) / (e - 1), k = oo(this.config.baseColor), L = Gs(Zt.fromObject({
      h: k.h,
      s: k.s,
      l: t
    })), te = Gs(Zt.fromObject({
      h: k.h,
      s: k.s,
      l: o
    })), G = new Array(5);
    G[0] = {
      position: 0,
      color: new pe(1, 1, 1, 1)
    }, G[1] = {
      position: b,
      color: this.config.baseColor
    }, G[2] = {
      position: $,
      color: L
    }, G[3] = {
      position: 0.99,
      color: te
    }, G[4] = {
      position: 1,
      color: new pe(0, 0, 0, 1)
    };
    const z = new Xe(G);
    this.palette = new Array(e);
    for (let q = 0; q < e; q++) {
      const ne = z.getColor(q / (e - 1), Be.RGB);
      this.palette[q] = ne;
    }
  }
  matchRelativeLuminanceIndex(e, t) {
    let o = Number.MAX_VALUE, s = 0, n = 0;
    const r = t.length;
    for (; n < r; n++) {
      const l = Math.abs(Us(t[n]) - e);
      l < o && (o = l, s = n);
    }
    return s;
  }
}
is.defaultPaletteConfig = {
  baseColor: si("#808080"),
  steps: 94
};
function Xa(i, e) {
  const t = i.relativeLuminance > e.relativeLuminance ? i : e, o = i.relativeLuminance > e.relativeLuminance ? e : i;
  return (t.relativeLuminance + 0.05) / (o.relativeLuminance + 0.05);
}
const Rt = Object.freeze({
  create(i, e, t) {
    return new Vo(i, e, t);
  },
  from(i) {
    return new Vo(i.r, i.g, i.b);
  }
});
function gp(i) {
  const e = {
    r: 0,
    g: 0,
    b: 0,
    toColorString: () => "",
    contrast: () => 0,
    relativeLuminance: 0
  };
  for (const t in e)
    if (typeof e[t] != typeof i[t])
      return !1;
  return !0;
}
class Vo extends pe {
  constructor(e, t, o) {
    super(e, t, o, 1), this.toColorString = this.toStringHexRGB, this.contrast = Xa.bind(null, this), this.createCSS = this.toColorString, this.relativeLuminance = qs(this);
  }
  static fromObject(e) {
    return new Vo(e.r, e.g, e.b);
  }
}
function Qs(i, e, t = 0, o = i.length - 1) {
  if (o === t)
    return i[t];
  const s = Math.floor((o - t) / 2) + t;
  return e(i[s]) ? Qs(
    i,
    e,
    t,
    s
  ) : Qs(
    i,
    e,
    s + 1,
    o
  );
}
const mp = (-0.1 + Math.sqrt(0.21)) / 2;
function bp(i) {
  return i.relativeLuminance <= mp;
}
function ni(i) {
  return bp(i) ? -1 : 1;
}
function vp(i, e, t) {
  return typeof i == "number" ? Ho.from(Rt.create(i, e, t)) : Ho.from(i);
}
function yp(i) {
  return gp(i) ? zo.from(i) : zo.from(Rt.create(i.r, i.g, i.b));
}
const Ho = Object.freeze({
  create: vp,
  from: yp
});
class zo {
  constructor(e, t) {
    this.closestIndexCache = /* @__PURE__ */ new Map(), this.source = e, this.swatches = t, this.reversedSwatches = Object.freeze([...this.swatches].reverse()), this.lastIndex = this.swatches.length - 1;
  }
  colorContrast(e, t, o, s) {
    o === void 0 && (o = this.closestIndexOf(e));
    let n = this.swatches;
    const r = this.lastIndex;
    let l = o;
    s === void 0 && (s = ni(e));
    const c = (u) => Xa(e, u) >= t;
    return s === -1 && (n = this.reversedSwatches, l = r - l), Qs(n, c, l, r);
  }
  get(e) {
    return this.swatches[e] || this.swatches[bt(e, 0, this.lastIndex)];
  }
  closestIndexOf(e) {
    if (this.closestIndexCache.has(e.relativeLuminance))
      return this.closestIndexCache.get(e.relativeLuminance);
    let t = this.swatches.indexOf(e);
    if (t !== -1)
      return this.closestIndexCache.set(e.relativeLuminance, t), t;
    const o = this.swatches.reduce((s, n) => Math.abs(n.relativeLuminance - e.relativeLuminance) < Math.abs(s.relativeLuminance - e.relativeLuminance) ? n : s);
    return t = this.swatches.indexOf(o), this.closestIndexCache.set(e.relativeLuminance, t), t;
  }
  static from(e) {
    return new zo(e, Object.freeze(new is({
      baseColor: pe.fromObject(e)
    }).palette.map((t) => {
      const o = si(t.toStringHexRGB());
      return Rt.create(o.r, o.g, o.b);
    })));
  }
}
function xp(i, e, t, o, s, n, r, l, c) {
  const u = i.source, p = e.closestIndexOf(t), f = Math.max(r, l, c), b = p >= f ? -1 : 1, $ = i.closestIndexOf(u), k = $ + b * -1 * o, L = k + b * s, te = k + b * n;
  return {
    rest: i.get(k),
    hover: i.get($),
    active: i.get(L),
    focus: i.get(te)
  };
}
function $p(i, e, t, o, s, n, r) {
  const l = i.source, c = i.closestIndexOf(l), u = ni(e), p = c + (u === 1 ? Math.min(o, s) : Math.max(u * o, u * s)), f = i.colorContrast(e, t, p, u), b = i.closestIndexOf(f), I = b + u * Math.abs(o - s), $ = u === 1 ? o < s : u * o > u * s;
  let k, L;
  return $ ? (k = b, L = I) : (k = I, L = b), {
    rest: i.get(k),
    hover: i.get(L),
    active: i.get(k + u * n),
    focus: i.get(k + u * r)
  };
}
const Ir = Rt.create(1, 1, 1), wp = Rt.create(0, 0, 0), kp = Rt.from(si("#808080")), Cp = Rt.from(si("#DA1A5F"));
function Tp(i, e) {
  return i.contrast(Ir) >= e ? Ir : wp;
}
function Ip(i, e, t, o, s, n) {
  const r = i.closestIndexOf(e), l = Math.max(t, o, s, n), c = r >= l ? -1 : 1;
  return {
    rest: i.get(r + c * t),
    hover: i.get(r + c * o),
    active: i.get(r + c * s),
    focus: i.get(r + c * n)
  };
}
function Sp(i, e, t, o, s, n) {
  const r = ni(e), l = i.closestIndexOf(e);
  return {
    rest: i.get(l - r * t),
    hover: i.get(l - r * o),
    active: i.get(l - r * s),
    focus: i.get(l - r * n)
  };
}
function Fp(i, e, t) {
  const o = i.closestIndexOf(e);
  return i.get(o - (o < t ? t * -1 : t));
}
function Ep(i, e, t, o, s, n, r, l, c, u) {
  const p = Math.max(t, o, s, n, r, l, c, u), f = i.closestIndexOf(e), b = f >= p ? -1 : 1;
  return {
    rest: i.get(f + b * t),
    hover: i.get(f + b * o),
    active: i.get(f + b * s),
    focus: i.get(f + b * n)
  };
}
function Rp(i, e, t, o, s, n) {
  const r = ni(e), l = i.closestIndexOf(i.colorContrast(e, 4.5)), c = l + r * Math.abs(t - o), u = r === 1 ? t < o : r * t > r * o;
  let p, f;
  return u ? (p = l, f = c) : (p = c, f = l), {
    rest: i.get(p),
    hover: i.get(f),
    active: i.get(p + r * s),
    focus: i.get(p + r * n)
  };
}
function Dp(i, e) {
  return i.colorContrast(e, 3.5);
}
function Op(i, e, t) {
  return i.colorContrast(t, 3.5, i.closestIndexOf(i.source), ni(e) * -1);
}
function Lp(i, e) {
  return i.colorContrast(e, 14);
}
function Ap(i, e) {
  return i.colorContrast(e, 4.5);
}
function os(i) {
  return Rt.create(i, i, i);
}
const Pp = {
  LightMode: 1,
  DarkMode: 0.23
};
function Mp(i, e, t) {
  return i.get(i.closestIndexOf(os(e)) + t);
}
function Vp(i, e, t) {
  const o = i.closestIndexOf(os(e)) - t;
  return i.get(o - t);
}
function Hp(i, e) {
  return i.get(i.closestIndexOf(os(e)));
}
function kn(i, e, t, o, s, n) {
  return Math.max(i.closestIndexOf(os(e)) + t, o, s, n);
}
function zp(i, e, t, o, s, n) {
  return i.get(kn(i, e, t, o, s, n));
}
function Np(i, e, t, o, s, n) {
  return i.get(kn(i, e, t, o, s, n) + t);
}
function Bp(i, e, t, o, s, n) {
  return i.get(kn(i, e, t, o, s, n) + t * 2);
}
function jp(i, e, t, o, s, n) {
  const r = i.closestIndexOf(e), l = ni(e), c = r + l * t, u = c + l * (o - t), p = c + l * (s - t), f = c + l * (n - t);
  return {
    rest: i.get(c),
    hover: i.get(u),
    active: i.get(p),
    focus: i.get(f)
  };
}
function _p(i, e, t) {
  return i.get(i.closestIndexOf(e) + ni(e) * t);
}
const { create: x } = Ht;
function P(i) {
  return Ht.create({ name: i, cssCustomPropertyName: null });
}
const J = x("body-font").withDefault('aktiv-grotesk, "Segoe UI", Arial, Helvetica, sans-serif'), vo = x("base-height-multiplier").withDefault(10), Up = x("base-horizontal-spacing-multiplier").withDefault(3), ri = x("base-layer-luminance").withDefault(Pp.DarkMode), V = x("control-corner-radius").withDefault(4), dt = x("density").withDefault(0), y = x("design-unit").withDefault(4), Do = x("direction").withDefault(oe.ltr), ge = x("disabled-opacity").withDefault(0.3), E = x("stroke-width").withDefault(1), j = x("focus-stroke-width").withDefault(2), Y = x("type-ramp-base-font-size").withDefault("14px"), Z = x("type-ramp-base-line-height").withDefault("20px"), ss = x("type-ramp-minus-1-font-size").withDefault("12px"), ns = x("type-ramp-minus-1-line-height").withDefault("16px"), qp = x("type-ramp-minus-2-font-size").withDefault("10px"), Gp = x("type-ramp-minus-2-line-height").withDefault("16px"), Wp = x("type-ramp-plus-1-font-size").withDefault("16px"), Yp = x("type-ramp-plus-1-line-height").withDefault("24px"), Xp = x("type-ramp-plus-2-font-size").withDefault("20px"), Qp = x("type-ramp-plus-2-line-height").withDefault("28px"), Qa = x("type-ramp-plus-3-font-size").withDefault("28px"), Za = x("type-ramp-plus-3-line-height").withDefault("36px"), Zp = x("type-ramp-plus-4-font-size").withDefault("34px"), Jp = x("type-ramp-plus-4-line-height").withDefault("44px"), Kp = x("type-ramp-plus-5-font-size").withDefault("46px"), ef = x("type-ramp-plus-5-line-height").withDefault("56px"), tf = x("type-ramp-plus-6-font-size").withDefault("60px"), of = x("type-ramp-plus-6-line-height").withDefault("72px"), sf = P("accent-fill-rest-delta").withDefault(0), Ja = P("accent-fill-hover-delta").withDefault(4), Ka = P("accent-fill-active-delta").withDefault(-5), el = P("accent-fill-focus-delta").withDefault(0), tl = P("accent-foreground-rest-delta").withDefault(0), il = P("accent-foreground-hover-delta").withDefault(6), ol = P("accent-foreground-active-delta").withDefault(-4), sl = P("accent-foreground-focus-delta").withDefault(0), ai = P("neutral-fill-rest-delta").withDefault(7), li = P("neutral-fill-hover-delta").withDefault(10), ci = P("neutral-fill-active-delta").withDefault(5), Cn = P("neutral-fill-focus-delta").withDefault(0), nl = P("neutral-fill-input-rest-delta").withDefault(0), rl = P("neutral-fill-input-hover-delta").withDefault(0), al = P("neutral-fill-input-active-delta").withDefault(0), ll = P("neutral-fill-input-focus-delta").withDefault(0), cl = P("neutral-fill-stealth-rest-delta").withDefault(0), dl = P("neutral-fill-stealth-hover-delta").withDefault(5), hl = P("neutral-fill-stealth-active-delta").withDefault(3), ul = P("neutral-fill-stealth-focus-delta").withDefault(0), nf = P("neutral-fill-strong-rest-delta").withDefault(0), pl = P("neutral-fill-strong-hover-delta").withDefault(8), fl = P("neutral-fill-strong-active-delta").withDefault(-5), gl = P("neutral-fill-strong-focus-delta").withDefault(0), di = P("neutral-fill-layer-rest-delta").withDefault(3), ml = P("neutral-stroke-rest-delta").withDefault(25), bl = P("neutral-stroke-hover-delta").withDefault(40), vl = P("neutral-stroke-active-delta").withDefault(16), yl = P("neutral-stroke-focus-delta").withDefault(25), xl = P("neutral-stroke-divider-rest-delta").withDefault(8), $l = x("neutral-color").withDefault(kp), Te = P("neutral-palette").withDefault((i) => Ho.from($l.getValueFor(i))), wl = x("accent-color").withDefault(Cp), Tn = P("accent-palette").withDefault((i) => Ho.from(wl.getValueFor(i))), rf = P("neutral-layer-card-container-recipe").withDefault({
  evaluate: (i) => Mp(Te.getValueFor(i), ri.getValueFor(i), di.getValueFor(i))
});
x("neutral-layer-card-container").withDefault((i) => rf.getValueFor(i).evaluate(i));
const af = P("neutral-layer-floating-recipe").withDefault({
  evaluate: (i) => Vp(Te.getValueFor(i), ri.getValueFor(i), di.getValueFor(i))
}), In = x("neutral-layer-floating").withDefault((i) => af.getValueFor(i).evaluate(i)), lf = P("neutral-layer-1-recipe").withDefault({
  evaluate: (i) => Hp(Te.getValueFor(i), ri.getValueFor(i))
}), cf = x("neutral-layer-1").withDefault((i) => lf.getValueFor(i).evaluate(i)), df = P("neutral-layer-2-recipe").withDefault({
  evaluate: (i) => zp(Te.getValueFor(i), ri.getValueFor(i), di.getValueFor(i), ai.getValueFor(i), li.getValueFor(i), ci.getValueFor(i))
});
x("neutral-layer-2").withDefault((i) => df.getValueFor(i).evaluate(i));
const hf = P("neutral-layer-3-recipe").withDefault({
  evaluate: (i) => Np(Te.getValueFor(i), ri.getValueFor(i), di.getValueFor(i), ai.getValueFor(i), li.getValueFor(i), ci.getValueFor(i))
});
x("neutral-layer-3").withDefault((i) => hf.getValueFor(i).evaluate(i));
const uf = P("neutral-layer-4-recipe").withDefault({
  evaluate: (i) => Bp(Te.getValueFor(i), ri.getValueFor(i), di.getValueFor(i), ai.getValueFor(i), li.getValueFor(i), ci.getValueFor(i))
});
x("neutral-layer-4").withDefault((i) => uf.getValueFor(i).evaluate(i));
const _ = x("fill-color").withDefault((i) => cf.getValueFor(i));
var so;
(function(i) {
  i[i.normal = 4.5] = "normal", i[i.large = 7] = "large";
})(so || (so = {}));
const rs = x({
  name: "accent-fill-recipe",
  cssCustomPropertyName: null
}).withDefault({
  evaluate: (i, e) => xp(Tn.getValueFor(i), Te.getValueFor(i), e || _.getValueFor(i), Ja.getValueFor(i), Ka.getValueFor(i), el.getValueFor(i), ai.getValueFor(i), li.getValueFor(i), ci.getValueFor(i))
}), K = x("accent-fill-rest").withDefault((i) => rs.getValueFor(i).evaluate(i).rest), me = x("accent-fill-hover").withDefault((i) => rs.getValueFor(i).evaluate(i).hover), fe = x("accent-fill-active").withDefault((i) => rs.getValueFor(i).evaluate(i).active), Sn = x("accent-fill-focus").withDefault((i) => rs.getValueFor(i).evaluate(i).focus), kl = (i) => (e, t) => Tp(t || K.getValueFor(e), i), as = P("foreground-on-accent-recipe").withDefault({
  evaluate: (i, e) => kl(so.normal)(i, e)
}), Ze = x("foreground-on-accent-rest").withDefault((i) => as.getValueFor(i).evaluate(i, K.getValueFor(i))), ht = x("foreground-on-accent-hover").withDefault((i) => as.getValueFor(i).evaluate(i, me.getValueFor(i))), Je = x("foreground-on-accent-active").withDefault((i) => as.getValueFor(i).evaluate(i, fe.getValueFor(i))), pf = x("foreground-on-accent-focus").withDefault((i) => as.getValueFor(i).evaluate(i, Sn.getValueFor(i))), ls = P("foreground-on-accent-large-recipe").withDefault({
  evaluate: (i, e) => kl(so.large)(i, e)
});
x("foreground-on-accent-rest-large").withDefault((i) => ls.getValueFor(i).evaluate(i, K.getValueFor(i)));
x("foreground-on-accent-hover-large").withDefault((i) => ls.getValueFor(i).evaluate(i, me.getValueFor(i)));
x("foreground-on-accent-active-large").withDefault((i) => ls.getValueFor(i).evaluate(i, fe.getValueFor(i)));
x("foreground-on-accent-focus-large").withDefault((i) => ls.getValueFor(i).evaluate(i, Sn.getValueFor(i)));
const ff = (i) => (e, t) => $p(Tn.getValueFor(e), t || _.getValueFor(e), i, tl.getValueFor(e), il.getValueFor(e), ol.getValueFor(e), sl.getValueFor(e)), cs = x({
  name: "accent-foreground-recipe",
  cssCustomPropertyName: null
}).withDefault({
  evaluate: (i, e) => ff(so.normal)(i, e)
}), we = x("accent-foreground-rest").withDefault((i) => cs.getValueFor(i).evaluate(i).rest), Jt = x("accent-foreground-hover").withDefault((i) => cs.getValueFor(i).evaluate(i).hover), lt = x("accent-foreground-active").withDefault((i) => cs.getValueFor(i).evaluate(i).active);
x("accent-foreground-focus").withDefault((i) => cs.getValueFor(i).evaluate(i).focus);
const hi = x({
  name: "neutral-fill-recipe",
  cssCustomPropertyName: null
}).withDefault({
  evaluate: (i, e) => Ip(Te.getValueFor(i), e || _.getValueFor(i), ai.getValueFor(i), li.getValueFor(i), ci.getValueFor(i), Cn.getValueFor(i))
}), ke = x("neutral-fill-rest").withDefault((i) => hi.getValueFor(i).evaluate(i).rest), ui = x("neutral-fill-hover").withDefault((i) => hi.getValueFor(i).evaluate(i).hover), Fn = x("neutral-fill-active").withDefault((i) => hi.getValueFor(i).evaluate(i).active);
x("neutral-fill-focus").withDefault((i) => hi.getValueFor(i).evaluate(i).focus);
const ds = x({
  name: "neutral-fill-input-recipe",
  cssCustomPropertyName: null
}).withDefault({
  evaluate: (i, e) => Sp(Te.getValueFor(i), e || _.getValueFor(i), nl.getValueFor(i), rl.getValueFor(i), al.getValueFor(i), ll.getValueFor(i))
}), Dt = x("neutral-fill-input-rest").withDefault((i) => ds.getValueFor(i).evaluate(i).rest), je = x("neutral-fill-input-hover").withDefault((i) => ds.getValueFor(i).evaluate(i).hover), yo = x("neutral-fill-input-active").withDefault((i) => ds.getValueFor(i).evaluate(i).active);
x("neutral-fill-input-focus").withDefault((i) => ds.getValueFor(i).evaluate(i).focus);
const Bt = x({
  name: "neutral-fill-stealth-recipe",
  cssCustomPropertyName: null
}).withDefault({
  evaluate: (i, e) => Ep(Te.getValueFor(i), e || _.getValueFor(i), cl.getValueFor(i), dl.getValueFor(i), hl.getValueFor(i), ul.getValueFor(i), ai.getValueFor(i), li.getValueFor(i), ci.getValueFor(i), Cn.getValueFor(i))
}), Ke = x("neutral-fill-stealth-rest").withDefault((i) => Bt.getValueFor(i).evaluate(i).rest), pi = x("neutral-fill-stealth-hover").withDefault((i) => Bt.getValueFor(i).evaluate(i).hover), fi = x("neutral-fill-stealth-active").withDefault((i) => Bt.getValueFor(i).evaluate(i).active), En = x("neutral-fill-stealth-focus").withDefault((i) => Bt.getValueFor(i).evaluate(i).focus), hs = x({
  name: "neutral-fill-strong-recipe",
  cssCustomPropertyName: null
}).withDefault({
  evaluate: (i, e) => Rp(Te.getValueFor(i), e || _.getValueFor(i), nf.getValueFor(i), pl.getValueFor(i), fl.getValueFor(i), gl.getValueFor(i))
});
x("neutral-fill-strong-rest").withDefault((i) => hs.getValueFor(i).evaluate(i).rest);
x("neutral-fill-strong-hover").withDefault((i) => hs.getValueFor(i).evaluate(i).hover);
x("neutral-fill-strong-active").withDefault((i) => hs.getValueFor(i).evaluate(i).active);
x("neutral-fill-strong-focus").withDefault((i) => hs.getValueFor(i).evaluate(i).focus);
const Rn = P("neutral-fill-layer-recipe").withDefault({
  evaluate: (i, e) => Fp(Te.getValueFor(i), e || _.getValueFor(i), di.getValueFor(i))
});
x("neutral-fill-layer-rest").withDefault((i) => Rn.getValueFor(i).evaluate(i));
const gf = P("focus-stroke-outer-recipe").withDefault({
  evaluate: (i) => Dp(Te.getValueFor(i), _.getValueFor(i))
}), H = x("focus-stroke-outer").withDefault((i) => gf.getValueFor(i).evaluate(i)), mf = P("focus-stroke-inner-recipe").withDefault({
  evaluate: (i) => Op(Tn.getValueFor(i), _.getValueFor(i), H.getValueFor(i))
}), us = x("focus-stroke-inner").withDefault((i) => mf.getValueFor(i).evaluate(i)), bf = P("neutral-foreground-hint-recipe").withDefault({
  evaluate: (i) => Ap(Te.getValueFor(i), _.getValueFor(i))
}), no = x("neutral-foreground-hint").withDefault((i) => bf.getValueFor(i).evaluate(i)), vf = P("neutral-foreground-recipe").withDefault({
  evaluate: (i) => Lp(Te.getValueFor(i), _.getValueFor(i))
}), F = x("neutral-foreground-rest").withDefault((i) => vf.getValueFor(i).evaluate(i)), ps = x({
  name: "neutral-stroke-recipe",
  cssCustomPropertyName: null
}).withDefault({
  evaluate: (i) => jp(Te.getValueFor(i), _.getValueFor(i), ml.getValueFor(i), bl.getValueFor(i), vl.getValueFor(i), yl.getValueFor(i))
}), rt = x("neutral-stroke-rest").withDefault((i) => ps.getValueFor(i).evaluate(i).rest), ro = x("neutral-stroke-hover").withDefault((i) => ps.getValueFor(i).evaluate(i).hover), Dn = x("neutral-stroke-active").withDefault((i) => ps.getValueFor(i).evaluate(i).active), yf = x("neutral-stroke-focus").withDefault((i) => ps.getValueFor(i).evaluate(i).focus), xf = P("neutral-stroke-divider-recipe").withDefault({
  evaluate: (i, e) => _p(Te.getValueFor(i), e || _.getValueFor(i), xl.getValueFor(i))
}), Si = x("neutral-stroke-divider-rest").withDefault((i) => xf.getValueFor(i).evaluate(i)), Cl = Ht.create({
  name: "height-number",
  cssCustomPropertyName: null
}).withDefault((i) => (vo.getValueFor(i) + dt.getValueFor(i)) * y.getValueFor(i)), $f = (i, e) => m`
        ${B("flex")} :host {
            box-sizing: border-box;
            flex-direction: column;
            font-family: ${J};
            font-size: ${ss};
            line-height: ${ns};
            color: ${F};
            border-top: calc(${E} * 1px) solid ${Si};
        }
    `, D = va`(${vo} + ${dt}) * ${y}`, wf = (i, e) => m`
        ${B("flex")} :host {
            box-sizing: border-box;
            font-family: ${J};
            flex-direction: column;
            font-size: ${ss};
            line-height: ${ns};
            border-bottom: calc(${E} * 1px) solid ${Si};
        }

        .region {
            display: none;
            padding: calc((6 + (${y} * 2 * ${dt})) * 1px);
        }

        .heading {
            display: grid;
            position: relative;
            grid-template-columns: auto 1fr auto calc(${D} * 1px);
        }

        .button {
            appearance: none;
            border: none;
            background: none;
            grid-column: 2;
            grid-row: 1;
            outline: none;
            padding: 0 calc((6 + (${y} * 2 * ${dt})) * 1px);
            text-align: left;
            height: calc(${D} * 1px);
            color: ${F};
            cursor: pointer;
            font-family: inherit;
        }

        .button:hover {
            color: ${F};
        }

        .button:active {
            color: ${F};
        }

        .button::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            cursor: pointer;
        }

        .button:${w}::before {
            outline: none;
            border: calc(${j} * 1px) solid ${H};
            border-radius: calc(${V} * 1px);
        }

        :host([expanded]) .region {
            display: block;
        }

        .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            grid-column: 4;
            pointer-events: none;
            position: relative;
        }

        slot[name="expanded-icon"],
        slot[name="collapsed-icon"] {
            fill: ${we};
        }

        slot[name="collapsed-icon"] {
            display: flex;
        }

        :host([expanded]) slot[name="collapsed-icon"] {
            display: none;
        }

        slot[name="expanded-icon"] {
            display: none;
        }

        :host([expanded]) slot[name="expanded-icon"] {
            display: flex;
        }

        .start {
            display: flex;
            align-items: center;
            padding-inline-start: calc(${y} * 1px);
            justify-content: center;
            grid-column: 1;
            position: relative;
        }

        .end {
            display: flex;
            align-items: center;
            justify-content: center;
            grid-column: 3;
            position: relative;
        }
    `.withBehaviors(M(m`
            .button:${w}::before {
                border-color: ${d.Highlight};
            }
            :host slot[name="collapsed-icon"],
            :host([expanded]) slot[name="expanded-icon"] {
                fill: ${d.ButtonText};
            }
        `)), bb = Yt.compose({
  baseName: "accordion-item",
  template: pd,
  styles: wf,
  collapsedIcon: `
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.22 3H3.78a.78.78 0 00-.78.78v12.44c0 .43.35.78.78.78h12.44c.43 0 .78-.35.78-.78V3.78a.78.78 0 00-.78-.78zM3.78 2h12.44C17.2 2 18 2.8 18 3.78v12.44c0 .98-.8 1.78-1.78 1.78H3.78C2.8 18 2 17.2 2 16.22V3.78C2 2.8 2.8 2 3.78 2zM11 9h3v2h-3v3H9v-3H6V9h3V6h2v3z"
            />
        </svg>
    `,
  expandedIcon: `
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.78 3h12.44c.43 0 .78.35.78.78v12.44c0 .43-.35.78-.78.78H3.78a.78.78 0 01-.78-.78V3.78c0-.43.35-.78.78-.78zm12.44-1H3.78C2.8 2 2 2.8 2 3.78v12.44C2 17.2 2.8 18 3.78 18h12.44c.98 0 1.78-.8 1.78-1.78V3.78C18 2.8 17.2 2 16.22 2zM14 9H6v2h8V9z"
            />
        </svg>
    `
}), vb = gn.compose({
  baseName: "accordion",
  template: Sd,
  styles: $f
}), kf = "0 0 calc((var(--elevation) * 0.225px) + 2px) rgba(0, 0, 0, calc(.11 * (2 - var(--background-luminance, 1))))", Cf = "0 calc(var(--elevation) * 0.4px) calc((var(--elevation) * 0.9px)) rgba(0, 0, 0, calc(.13 * (2 - var(--background-luminance, 1))))", Fi = `box-shadow: ${kf}, ${Cf};`, Tl = m`
    ${B("inline-flex")} :host {
        font-family: ${J};
        outline: none;
        font-size: ${Y};
        line-height: ${Z};
        height: calc(${D} * 1px);
        min-width: calc(${D} * 1px);
        background-color: ${ke};
        color: ${F};
        border-radius: calc(${V} * 1px);
        fill: currentcolor;
        cursor: pointer;
    }

    .control {
        background: transparent;
        height: inherit;
        flex-grow: 1;
        box-sizing: border-box;
        display: inline-flex;
        justify-content: center;
        align-items: baseline;
        padding: 0 calc((10 + (${y} * 2 * ${dt})) * 1px);
        white-space: nowrap;
        outline: none;
        text-decoration: none;
        border: calc(${E} * 1px) solid transparent;
        color: inherit;
        border-radius: inherit;
        fill: inherit;
        cursor: inherit;
        font-weight: inherit;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }

    :host(:hover) {
        background-color: ${ui};
    }

    :host(:active) {
        background-color: ${Fn};
    }

    .control:${w} {
        border-color: ${H};
        box-shadow: 0 0 0 calc((${j} - ${E}) * 1px) ${H} inset;
    }

    .control::-moz-focus-inner {
        border: 0;
    }

    .start,
    .content,
    .end {
        align-self: center;
    }

    .start,
    .end {
        display: flex;
    }

    .control.icon-only {
        padding: 0;
        line-height: 0;
    }

    ::slotted(svg) {
        ${""} width: 16px;
        height: 16px;
        pointer-events: none;
    }

    .start {
        margin-inline-end: 11px;
    }

    .end {
        margin-inline-start: 11px;
    }
`.withBehaviors(M(m`
            :host .control {
              background-color: ${d.ButtonFace};
              border-color: ${d.ButtonText};
              color: ${d.ButtonText};
              fill: currentColor;
            }

            :host(:hover) .control {
              forced-color-adjust: none;
              background-color: ${d.Highlight};
              color: ${d.HighlightText};
            }

            .control:${w} {
              forced-color-adjust: none;
              background-color: ${d.Highlight};
              border-color: ${d.ButtonText};
              box-shadow: 0 0 0 calc((${j} - ${E}) * 1px) ${d.ButtonText} inset;
              color: ${d.HighlightText};
            }

            .control:hover,
            :host([appearance="outline"]) .control:hover {
              border-color: ${d.ButtonText};
            }

            :host([href]) .control {
                border-color: ${d.LinkText};
                color: ${d.LinkText};
            }

            :host([href]) .control:hover,
            :host([href]) .control:${w}{
              forced-color-adjust: none;
              background: ${d.ButtonFace};
              border-color: ${d.LinkText};
              box-shadow: 0 0 0 1px ${d.LinkText} inset;
              color: ${d.LinkText};
              fill: currentColor;
            }
        `)), Il = m`
    :host([appearance="accent"]) {
        background: ${K};
        color: ${Ze};
    }

    :host([appearance="accent"]:hover) {
        background: ${me};
        color: ${ht};
    }

    :host([appearance="accent"]:active) .control:active {
        background: ${fe};
        color: ${Je};
    }

    :host([appearance="accent"]) .control:${w} {
        box-shadow: 0 0 0 calc((${j} - ${E}) * 1px) ${H} inset,
            0 0 0 calc((${j} + ${E}) * 1px) ${us} inset;
    }
`.withBehaviors(M(m`
            :host([appearance="accent"]) .control {
                forced-color-adjust: none;
                background: ${d.Highlight};
                color: ${d.HighlightText};
            }

            :host([appearance="accent"]) .control:hover,
            :host([appearance="accent"]:active) .control:active {
                background: ${d.HighlightText};
                border-color: ${d.Highlight};
                color: ${d.Highlight};
            }

            :host([appearance="accent"]) .control:${w} {
                border-color: ${d.Highlight};
                box-shadow: 0 0 0 calc(${j} * 1px) ${d.HighlightText} inset;
            }

            :host([appearance="accent"][href]) .control{
                background: ${d.LinkText};
                color: ${d.HighlightText};
            }

            :host([appearance="accent"][href]) .control:hover {
                background: ${d.ButtonFace};
                border-color: ${d.LinkText};
                box-shadow: none;
                color: ${d.LinkText};
                fill: currentColor;
            }

            :host([appearance="accent"][href]) .control:${w} {
                border-color: ${d.LinkText};
                box-shadow: 0 0 0 calc(${j} * 1px) ${d.HighlightText} inset;
            }
        `)), Tf = m`
    :host([appearance="hypertext"]) {
        font-size: inherit;
        line-height: inherit;
        height: auto;
        min-width: 0;
        background: transparent;
    }

    :host([appearance="hypertext"]) .control {
        display: inline;
        padding: 0;
        border: none;
        box-shadow: none;
        border-radius: 0;
        line-height: 1;
    }

    :host a.control:not(:link) {
        background-color: transparent;
        cursor: default;
    }
    :host([appearance="hypertext"]) .control:link,
    :host([appearance="hypertext"]) .control:visited {
        background: transparent;
        color: ${we};
        border-bottom: calc(${E} * 1px) solid ${we};
    }

    :host([appearance="hypertext"]:hover),
    :host([appearance="hypertext"]) .control:hover {
        background: transparent;
        border-bottom-color: ${Jt};
    }

    :host([appearance="hypertext"]:active),
    :host([appearance="hypertext"]) .control:active {
        background: transparent;
        border-bottom-color: ${lt};
    }

    :host([appearance="hypertext"]) .control:${w} {
        border-bottom: calc(${j} * 1px) solid ${H};
        margin-bottom: calc(calc(${E} - ${j}) * 1px);
    }
`.withBehaviors(M(m`
            :host([appearance="hypertext"]:hover) {
                background-color: ${d.ButtonFace};
                color: ${d.ButtonText};
            }
            :host([appearance="hypertext"][href]) .control:hover,
            :host([appearance="hypertext"][href]) .control:active,
            :host([appearance="hypertext"][href]) .control:${w} {
                color: ${d.LinkText};
                border-bottom-color: ${d.LinkText};
                box-shadow: none;
            }
        `)), Sl = m`
    :host([appearance="lightweight"]) {
        background: transparent;
        color: ${we};
    }

    :host([appearance="lightweight"]) .control {
        padding: 0;
        height: initial;
        border: none;
        box-shadow: none;
        border-radius: 0;
    }

    :host([appearance="lightweight"]:hover) {
        background: transparent;
        color: ${Jt};
    }

    :host([appearance="lightweight"]:active) {
        background: transparent;
        color: ${lt};
    }

    :host([appearance="lightweight"]) .content {
        position: relative;
    }

    :host([appearance="lightweight"]) .content::before {
        content: "";
        display: block;
        height: calc(${E} * 1px);
        position: absolute;
        top: calc(1em + 4px);
        width: 100%;
    }

    :host([appearance="lightweight"]:hover) .content::before {
        background: ${Jt};
    }

    :host([appearance="lightweight"]:active) .content::before {
        background: ${lt};
    }

    :host([appearance="lightweight"]) .control:${w} .content::before {
        background: ${F};
        height: calc(${j} * 1px);
    }
`.withBehaviors(M(m`
            :host([appearance="lightweight"]) .control:hover,
            :host([appearance="lightweight"]) .control:${w} {
                forced-color-adjust: none;
                background: ${d.ButtonFace};
                color: ${d.Highlight};
            }
            :host([appearance="lightweight"]) .control:hover .content::before,
            :host([appearance="lightweight"]) .control:${w} .content::before {
                background: ${d.Highlight};
            }

            :host([appearance="lightweight"][href]) .control:hover,
            :host([appearance="lightweight"][href]) .control:${w} {
                background: ${d.ButtonFace};
                box-shadow: none;
                color: ${d.LinkText};
            }

            :host([appearance="lightweight"][href]) .control:hover .content::before,
            :host([appearance="lightweight"][href]) .control:${w} .content::before {
                background: ${d.LinkText};
            }
        `)), Fl = m`
    :host([appearance="outline"]) {
        background: transparent;
        border-color: ${K};
    }

    :host([appearance="outline"]:hover) {
        border-color: ${me};
    }

    :host([appearance="outline"]:active) {
        border-color: ${fe};
    }

    :host([appearance="outline"]) .control {
        border-color: inherit;
    }

    :host([appearance="outline"]) .control:${w} {
        box-shadow: 0 0 0 calc((${j} - ${E}) * 1px) ${H} inset;
        border-color: ${H};
    }
`.withBehaviors(M(m`
            :host([appearance="outline"]) .control {
                border-color: ${d.ButtonText};
            }
            :host([appearance="outline"]) .control:${w} {
              forced-color-adjust: none;
              background-color: ${d.Highlight};
              border-color: ${d.ButtonText};
              box-shadow: 0 0 0 calc((${j} - ${E}) * 1px) ${d.ButtonText} inset;
              color: ${d.HighlightText};
              fill: currentColor;
            }
            :host([appearance="outline"][href]) .control {
                background: ${d.ButtonFace};
                border-color: ${d.LinkText};
                color: ${d.LinkText};
                fill: currentColor;
            }
            :host([appearance="outline"][href]) .control:hover,
            :host([appearance="outline"][href]) .control:${w} {
              forced-color-adjust: none;
              border-color: ${d.LinkText};
              box-shadow: 0 0 0 1px ${d.LinkText} inset;
            }
        `)), El = m`
    :host([appearance="stealth"]) {
        background: ${Ke};
    }

    :host([appearance="stealth"]:hover) {
        background: ${pi};
    }

    :host([appearance="stealth"]:active) {
        background: ${fi};
    }
`.withBehaviors(M(m`
            :host([appearance="stealth"]),
            :host([appearance="stealth"]) .control {
                forced-color-adjust: none;
                background: ${d.ButtonFace};
                border-color: transparent;
                color: ${d.ButtonText};
                fill: currentColor;
            }

            :host([appearance="stealth"]:hover) .control {
                background: ${d.Highlight};
                border-color: ${d.Highlight};
                color: ${d.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"]:${w}) .control {
                background: ${d.Highlight};
                box-shadow: 0 0 0 1px ${d.Highlight};
                color: ${d.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"][href]) .control {
                color: ${d.LinkText};
            }

            :host([appearance="stealth"][href]:hover) .control,
            :host([appearance="stealth"][href]:${w}) .control {
                background: ${d.LinkText};
                border-color: ${d.LinkText};
                color: ${d.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"][href]:${w}) .control {
                forced-color-adjust: none;
                box-shadow: 0 0 0 1px ${d.LinkText};
            }
        `));
class Oi {
  constructor(e, t) {
    this.cache = /* @__PURE__ */ new WeakMap(), this.ltr = e, this.rtl = t;
  }
  bind(e) {
    this.attach(e);
  }
  unbind(e) {
    const t = this.cache.get(e);
    t && Do.unsubscribe(t);
  }
  attach(e) {
    const t = this.cache.get(e) || new If(this.ltr, this.rtl, e), o = Do.getValueFor(e);
    Do.subscribe(t), t.attach(o), this.cache.set(e, t);
  }
}
class If {
  constructor(e, t, o) {
    this.ltr = e, this.rtl = t, this.source = o, this.attached = null;
  }
  handleChange({ target: e, token: t }) {
    this.attach(t.getValueFor(e));
  }
  attach(e) {
    this.attached !== this[e] && (this.attached !== null && this.source.$fastController.removeStyles(this.attached), this.attached = this[e], this.attached !== null && this.source.$fastController.addStyles(this.attached));
  }
}
function vt(i, e) {
  return new Ku("appearance", i, e);
}
const Sf = (i, e) => m`
        ${Tl}
    `.withBehaviors(vt("accent", Il), vt("hypertext", Tf), vt("lightweight", Sl), vt("outline", Fl), vt("stealth", El));
class Rl extends qe {
  appearanceChanged(e, t) {
    this.$fastController.isConnected && (this.classList.remove(e), this.classList.add(t));
  }
  connectedCallback() {
    super.connectedCallback(), this.appearance || (this.appearance = "neutral");
  }
  defaultSlottedContentChanged(e, t) {
    const o = this.defaultSlottedContent.filter((s) => s.nodeType === Node.ELEMENT_NODE);
    o.length === 1 && o[0] instanceof SVGElement ? this.control.classList.add("icon-only") : this.control.classList.remove("icon-only");
  }
}
a([
  h
], Rl.prototype, "appearance", void 0);
const yb = Rl.compose({
  baseName: "anchor",
  baseClass: qe,
  template: Fa,
  styles: Sf,
  shadowOptions: {
    delegatesFocus: !0
  }
}), Ff = (i, e) => m`
    :host {
        contain: layout;
        display: block;
    }
`, xb = W.compose({
  baseName: "anchored-region",
  template: zd,
  styles: Ff
}), Ef = (i, e) => m`
    ::slotted(${i.tagFor(ti)}) {
        left: 0;
    }
`, Rf = (i, e) => m`
    ::slotted(${i.tagFor(ti)}) {
        right: 0;
    }
`, Df = (i, e) => m`
        ${B("flex")} :host {
            position: relative;
            height: var(--avatar-size, var(--avatar-size-default));
            max-width: var(--avatar-size, var(--avatar-size-default));
            --avatar-size-default: calc(
                (
                        (${vo} + ${dt}) * ${y} +
                            ((${y} * 8) - 40)
                    ) * 1px
            );
            --avatar-text-size: ${Y};
            --avatar-text-ratio: ${y};
        }

        .link {
            text-decoration: none;
            color: ${F};
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            min-width: 100%;
        }

        .square {
            border-radius: calc(${V} * 1px);
            min-width: 100%;
            overflow: hidden;
        }

        .circle {
            border-radius: 100%;
            min-width: 100%;
            overflow: hidden;
        }

        .backplate {
            position: relative;
            display: flex;
        }

        .media,
        ::slotted(img) {
            max-width: 100%;
            position: absolute;
            display: block;
        }

        .content {
            font-size: calc(
                (var(--avatar-text-size) + var(--avatar-size, var(--avatar-size-default))) /
                    var(--avatar-text-ratio)
            );
            line-height: var(--avatar-size, var(--avatar-size-default));
            display: block;
            min-height: var(--avatar-size, var(--avatar-size-default));
        }

        ::slotted(${i.tagFor(ti)}) {
            position: absolute;
            display: block;
        }
    `.withBehaviors(new Oi(Rf(i), Ef(i)));
class On extends Ri {
}
a([
  h({ attribute: "src" })
], On.prototype, "imgSrc", void 0);
a([
  h
], On.prototype, "alt", void 0);
const Of = v`
    ${Q((i) => i.imgSrc, v`
            <img
                src="${(i) => i.imgSrc}"
                alt="${(i) => i.alt}"
                slot="media"
                class="media"
                part="media"
            />
        `)}
`, $b = On.compose({
  baseName: "avatar",
  baseClass: Ri,
  template: _d,
  styles: Df,
  media: Of,
  shadowOptions: {
    delegatesFocus: !0
  }
}), Lf = (i, e) => m`
        ${B("inline-block")} :host {
            box-sizing: border-box;
            font-family: ${J};
            font-size: ${ss};
            line-height: ${ns};
        }

        .control {
            border-radius: calc(${V} * 1px);
            padding: calc(((${y} * 0.5) - ${E}) * 1px)
                calc((${y} - ${E}) * 1px);
            color: ${we};
            font-weight: 600;
            border: calc(${E} * 1px) solid transparent;
        }

        .control[style] {
            font-weight: 400;
        }

        :host([circular]) .control {
            border-radius: 100px;
            padding: 0 calc(${y} * 1px);
            height: calc((${D} - (${y} * 3)) * 1px);
            min-width: calc((${D} - (${y} * 3)) * 1px);
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
        }
    `, wb = ti.compose({
  baseName: "badge",
  template: Ud,
  styles: Lf
}), Af = (i, e) => m`
    ${B("inline-flex")} :host {
        background: transparent;
        box-sizing: border-box;
        font-family: ${J};
        font-size: ${Y};
        fill: currentColor;
        line-height: ${Z};
        min-width: calc(${D} * 1px);
        outline: none;
        color: ${F}
    }

    .listitem {
        display: flex;
        align-items: center;
        width: max-content;
    }

    .separator {
        margin: 0 6px;
        display: flex;
    }

    .control {
        align-items: center;
        box-sizing: border-box;
        color: ${we};
        cursor: pointer;
        display: flex;
        fill: inherit;
        outline: none;
        text-decoration: none;
        white-space: nowrap;
    }

    .control:hover {
        color: ${Jt};
    }

    .control:active {
        color: ${lt};
    }

    .control .content {
        position: relative;
    }

    .control .content::before {
        content: "";
        display: block;
        height: calc(${E} * 1px);
        left: 0;
        position: absolute;
        right: 0;
        top: calc(1em + 4px);
        width: 100%;
    }

    .control:hover .content::before {
        background: ${Jt};
    }

    .control:active .content::before {
        background: ${lt};
    }

    .control:${w} .content::before {
        background: ${F};
        height: calc(${j} * 1px);
    }

    .control:not([href]) {
        color: ${F};
        cursor: default;
    }

    .control:not([href]) .content::before {
        background: none;
    }

    .start,
    .end {
        display: flex;
    }

    ::slotted(svg) {
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        width: 16px;
        height: 16px;
    }

    .start {
        margin-inline-end: 6px;
    }

    .end {
        margin-inline-start: 6px;
    }
`.withBehaviors(M(m`
                .control:hover .content::before,
                .control:${w} .content::before {
                    background: ${d.LinkText};
                }
                .start,
                .end {
                    fill: ${d.ButtonText};
                }
            `)), kb = Ki.compose({
  baseName: "breadcrumb-item",
  template: qd,
  styles: Af,
  separator: "/",
  shadowOptions: {
    delegatesFocus: !0
  }
}), Pf = (i, e) => m`
    ${B("inline-block")} :host {
        box-sizing: border-box;
        font-family: ${J};
        font-size: ${Y};
        line-height: ${Z};
    }

    .list {
        display: flex;
        flex-wrap: wrap;
    }
`, Cb = Oa.compose({
  baseName: "breadcrumb",
  template: Gd,
  styles: Pf
}), Mf = (i, e) => m`
        :host([disabled]),
        :host([disabled]:hover),
        :host([disabled]:active) {
            opacity: ${ge};
            background-color: ${ke};
            cursor: ${de};
        }

        ${Tl}
    `.withBehaviors(M(m`
                :host([disabled]),
                :host([disabled]) .control,
                :host([disabled]:hover),
                :host([disabled]:active) {
                    forced-color-adjust: none;
                    background-color: ${d.ButtonFace};
                    border-color: ${d.GrayText};
                    color: ${d.GrayText};
                    cursor: ${de};
                    opacity: 1;
                }
            `), vt("accent", m`
                :host([appearance="accent"][disabled]),
                :host([appearance="accent"][disabled]:hover),
                :host([appearance="accent"][disabled]:active) {
                    background: ${K};
                }

                ${Il}
            `.withBehaviors(M(m`
                        :host([appearance="accent"][disabled]) .control,
                        :host([appearance="accent"][disabled]) .control:hover {
                            background: ${d.ButtonFace};
                            border-color: ${d.GrayText};
                            color: ${d.GrayText};
                        }
                    `))), vt("lightweight", m`
                :host([appearance="lightweight"][disabled]:hover),
                :host([appearance="lightweight"][disabled]:active) {
                    background-color: transparent;
                    color: ${we};
                }

                :host([appearance="lightweight"][disabled]) .content::before,
                :host([appearance="lightweight"][disabled]:hover) .content::before,
                :host([appearance="lightweight"][disabled]:active) .content::before {
                    background: transparent;
                }

                ${Sl}
            `.withBehaviors(M(m`
                        :host([appearance="lightweight"].disabled) .control {
                            forced-color-adjust: none;
                            color: ${d.GrayText};
                        }

                        :host([appearance="lightweight"].disabled)
                            .control:hover
                            .content::before {
                            background: none;
                        }
                    `))), vt("outline", m`
                :host([appearance="outline"][disabled]),
                :host([appearance="outline"][disabled]:hover),
                :host([appearance="outline"][disabled]:active) {
                    background: transparent;
                    border-color: ${K};
                }

                ${Fl}
            `.withBehaviors(M(m`
                        :host([appearance="outline"][disabled]) .control {
                            border-color: ${d.GrayText};
                        }
                    `))), vt("stealth", m`
                :host([appearance="stealth"][disabled]),
                :host([appearance="stealth"][disabled]:hover),
                :host([appearance="stealth"][disabled]:active) {
                    background: ${Ke};
                }

                ${El}
            `.withBehaviors(M(m`
                        :host([appearance="stealth"][disabled]) {
                            background: ${d.ButtonFace};
                        }

                        :host([appearance="stealth"][disabled]) .control {
                            background: ${d.ButtonFace};
                            border-color: transparent;
                            color: ${d.GrayText};
                        }
                    `))));
class Dl extends et {
  constructor() {
    super(...arguments), this.appearance = "neutral";
  }
  defaultSlottedContentChanged(e, t) {
    const o = this.defaultSlottedContent.filter((s) => s.nodeType === Node.ELEMENT_NODE);
    o.length === 1 && o[0] instanceof SVGElement ? this.control.classList.add("icon-only") : this.control.classList.remove("icon-only");
  }
}
a([
  h
], Dl.prototype, "appearance", void 0);
const Tb = Dl.compose({
  baseName: "button",
  baseClass: et,
  template: Wd,
  styles: Mf,
  shadowOptions: {
    delegatesFocus: !0
  }
}), Vf = m`
    ${B("block")} :host {
        --cell-border: none;
        --cell-height: calc(${D} * 1px);
        --selected-day-outline: 1px solid ${lt};
        --selected-day-color: ${lt};
        --selected-day-background: ${ke};
        --cell-padding: calc(${y} * 1px);
        --disabled-day-opacity: ${ge};
        --inactive-day-opacity: ${ge};
        font-family: ${J};
        font-size: ${Y};
        line-height: ${Z};
        color: ${F};
    }

    .title {
        font-size: ${Qa};
        line-height: ${Za};
        padding: var(--cell-padding);
        text-align: center;
    }

    .week-days,
    .week {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        border-left: var(--cell-border, none);
        border-bottom: none;
        padding: 0;
    }

    .interact .week {
        grid-gap: calc(${y} * 1px);
        margin-top: calc(${y} * 1px);
    }

    .day,
    .week-day {
        border-bottom: var(--cell-border);
        border-right: var(--cell-border);
        padding: var(--cell-padding);
    }

    .week-day {
        text-align: center;
        border-radius: 0;
        border-top: var(--cell-border);
    }

    .day {
        box-sizing: border-box;
        vertical-align: top;
        outline-offset: -1px;
        line-height: var(--cell-line-height);
        white-space: normal;
    }

    .interact .day {
        background: ${ke};
        cursor: pointer;
    }

    .day.inactive {
        background: var(--inactive-day-background);
        color: var(--inactive-day-color);
        opacity: var(--inactive-day-opacity);
        outline: var(--inactive-day-outline);
    }

    .day.disabled {
        background: var(--disabled-day-background);
        color: var(--disabled-day-color);
        cursor: ${de};
        opacity: var(--disabled-day-opacity);
        outline: var(--disabled-day-outline);
    }

    .day.selected {
        color: var(--selected-day-color);
        background: var(--selected-day-background);
        outline: var(--selected-day-outline);
    }

    .date {
        padding: var(--cell-padding);
        text-align: center;
    }

    .interact .today,
    .today {
        color: ${Je};
        background: ${lt};
    }

    .today.inactive .date {
        background: transparent;
        color: inherit;
        width: auto;
    }
`.withBehaviors(M(m`
            :host {
                --selected-day-outline: 1px solid ${d.Highlight};
            }

            .day,
            .week-day {
                background: ${d.Canvas};
                color: ${d.CanvasText};
                fill: currentcolor;
            }

            .day.selected {
                color: ${d.Highlight};
            }

            .today .date {
                background: ${d.Highlight};
                color: ${d.HighlightText};
            }
        `)), Ib = tt.compose({
  baseName: "calendar",
  template: hh,
  styles: Vf,
  title: nh
}), Hf = (i, e) => m`
        ${B("block")} :host {
            --elevation: 4;
            display: block;
            contain: content;
            height: var(--card-height, 100%);
            width: var(--card-width, 100%);
            box-sizing: border-box;
            background: ${_};
            border-radius: calc(${V} * 1px);
            ${Fi}
        }
    `.withBehaviors(M(m`
                :host {
                    forced-color-adjust: none;
                    background: ${d.Canvas};
                    box-shadow: 0 0 0 1px ${d.CanvasText};
                }
            `));
class zf extends La {
  connectedCallback() {
    super.connectedCallback();
    const e = eo(this);
    e && _.setValueFor(this, (t) => Rn.getValueFor(t).evaluate(t, _.getValueFor(e)));
  }
}
const Sb = zf.compose({
  baseName: "card",
  baseClass: La,
  template: uh,
  styles: Hf
}), Nf = (i, e) => m`
        ${B("inline-flex")} :host {
            align-items: center;
            outline: none;
            margin: calc(${y} * 1px) 0;
            /* Chromium likes to select label text or the default slot when the checkbox is
                clicked. Maybe there is a better solution here? */
            user-select: none;
        }

        .control {
            position: relative;
            width: calc((${D} / 2 + ${y}) * 1px);
            height: calc((${D} / 2 + ${y}) * 1px);
            box-sizing: border-box;
            border-radius: calc(${V} * 1px);
            border: calc(${E} * 1px) solid ${rt};
            background: ${Dt};
            outline: none;
            cursor: pointer;
        }

        .label {
            font-family: ${J};
            color: ${F};
            padding-inline-start: calc(${y} * 2px + 2px);
            margin-inline-end: calc(${y} * 2px + 2px);
            cursor: pointer;
            font-size: ${Y};
            line-height: ${Z};
        }

        .label__hidden {
            display: none;
            visibility: hidden;
        }

        .checked-indicator {
            width: 100%;
            height: 100%;
            display: block;
            fill: ${Ze};
            opacity: 0;
            pointer-events: none;
        }

        .indeterminate-indicator {
            border-radius: calc(${V} * 1px);
            background: ${Ze};
            position: absolute;
            top: 50%;
            left: 50%;
            width: 50%;
            height: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
        }

        :host(:not([disabled])) .control:hover {
            background: ${je};
            border-color: ${ro};
        }

        :host(:not([disabled])) .control:active {
            background: ${yo};
            border-color: ${Dn};
        }

        :host(:${w}) .control {
            box-shadow: 0 0 0 2px ${_}, 0 0 0 4px ${H};
        }

        :host([aria-checked="true"]) .control {
            background: ${K};
            border: calc(${E} * 1px) solid ${K};
        }

        :host([aria-checked="true"]:not([disabled])) .control:hover {
            background: ${me};
            border: calc(${E} * 1px) solid ${me};
        }

        :host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator {
            fill: ${ht};
        }

        :host([aria-checked="true"]:not([disabled])) .control:hover .indeterminate-indicator {
            background: ${ht};
        }

        :host([aria-checked="true"]:not([disabled])) .control:active {
            background: ${fe};
            border: calc(${E} * 1px) solid ${fe};
        }

        :host([aria-checked="true"]:not([disabled])) .control:active .checked-indicator {
            fill: ${Je};
        }

        :host([aria-checked="true"]:not([disabled])) .control:active .indeterminate-indicator {
            background: ${Je};
        }

        :host([aria-checked="true"]:${w}:not([disabled])) .control {
            box-shadow: 0 0 0 2px ${_}, 0 0 0 4px ${H};
        }


        :host([disabled]) .label,
        :host([readonly]) .label,
        :host([readonly]) .control,
        :host([disabled]) .control {
            cursor: ${de};
        }

        :host([aria-checked="true"]:not(.indeterminate)) .checked-indicator,
        :host(.indeterminate) .indeterminate-indicator {
            opacity: 1;
        }

        :host([disabled]) {
            opacity: ${ge};
        }
    `.withBehaviors(M(m`
            .control {
                forced-color-adjust: none;
                border-color: ${d.FieldText};
                background: ${d.Field};
            }
            .checked-indicator {
                fill: ${d.FieldText};
            }
            .indeterminate-indicator {
                background: ${d.FieldText};
            }
            :host(:not([disabled])) .control:hover, .control:active {
                border-color: ${d.Highlight};
                background: ${d.Field};
            }
            :host(:${w}) .control {
                box-shadow: 0 0 0 2px ${d.Field}, 0 0 0 4px ${d.FieldText};
            }
            :host([aria-checked="true"]:${w}:not([disabled])) .control {
                box-shadow: 0 0 0 2px ${d.Field}, 0 0 0 4px ${d.FieldText};
            }
            :host([aria-checked="true"]) .control {
                background: ${d.Highlight};
                border-color: ${d.Highlight};
            }
            :host([aria-checked="true"]:not([disabled])) .control:hover, .control:active {
                border-color: ${d.Highlight};
                background: ${d.HighlightText};
            }
            :host([aria-checked="true"]) .checked-indicator {
                fill: ${d.HighlightText};
            }
            :host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator {
                fill: ${d.Highlight}
            }
            :host([aria-checked="true"]) .indeterminate-indicator {
                background: ${d.HighlightText};
            }
            :host([aria-checked="true"]) .control:hover .indeterminate-indicator {
                background: ${d.Highlight}
            }
            :host([disabled]) {
                opacity: 1;
            }
            :host([disabled]) .control {
                forced-color-adjust: none;
                border-color: ${d.GrayText};
                background: ${d.Field};
            }
            :host([disabled]) .indeterminate-indicator,
            :host([aria-checked="true"][disabled]) .control:hover .indeterminate-indicator {
                forced-color-adjust: none;
                background: ${d.GrayText};
            }
            :host([disabled]) .checked-indicator,
            :host([aria-checked="true"][disabled]) .control:hover .checked-indicator {
                forced-color-adjust: none;
                fill: ${d.GrayText};
            }
        `)), Fb = Yo.compose({
  baseName: "checkbox",
  template: ph,
  styles: Nf,
  checkedIndicator: `
        <svg
            part="checked-indicator"
            class="checked-indicator"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.143 12.6697L15.235 4.5L16.8 5.90363L8.23812 15.7667L3.80005 11.2556L5.27591 9.7555L8.143 12.6697Z"
            />
        </svg>
    `,
  indeterminateIndicator: `
        <div part="indeterminate-indicator" class="indeterminate-indicator"></div>
    `
}), Ol = (i, e) => {
  const t = i.tagFor(nt), o = i.name === i.tagFor(zt) ? "" : ".listbox";
  return m`
        ${o ? "" : B("inline-flex")}

        :host ${o} {
            background: ${_};
            border: calc(${E} * 1px) solid ${rt};
            border-radius: calc(${V} * 1px);
            box-sizing: border-box;
            flex-direction: column;
            padding: calc(${y} * 1px) 0;
        }

        ${o ? "" : m`
            :host(:focus-within:not([disabled])) {
                border-color: ${H};
                box-shadow: 0 0 0
                    calc((${j} - ${E}) * 1px)
                    ${H} inset;
            }

            :host([disabled]) ::slotted(*) {
                cursor: ${de};
                opacity: ${ge};
                pointer-events: none;
            }
        `}

        ${o || ":host([size])"} {
            max-height: calc(
                (var(--size) * ${D} + (${y} * ${E} * 2)) * 1px
            );
            overflow-y: auto;
        }

        :host([size="0"]) ${o} {
            max-height: none;
        }
    `.withBehaviors(M(m`
                :host(:not([multiple]):${w}) ::slotted(${t}[aria-selected="true"]),
                :host([multiple]:${w}) ::slotted(${t}[aria-checked="true"]) {
                    border-color: ${d.ButtonText};
                    box-shadow: 0 0 0 calc(${j} * 1px) inset ${d.HighlightText};
                }

                :host(:not([multiple]):${w}) ::slotted(${t}[aria-selected="true"]) {
                    background: ${d.Highlight};
                    color: ${d.HighlightText};
                    fill: currentcolor;
                }

                ::slotted(${t}[aria-selected="true"]:not([aria-checked="true"])) {
                    background: ${d.Highlight};
                    border-color: ${d.HighlightText};
                    color: ${d.HighlightText};
                }
            `));
}, Ll = (i, e) => {
  const t = i.name === i.tagFor(gt);
  return m`
        ${B("inline-flex")}

        :host {
            --elevation: 14;
            background: ${Dt};
            border-radius: calc(${V} * 1px);
            border: calc(${E} * 1px) solid ${K};
            box-sizing: border-box;
            color: ${F};
            font-family: ${J};
            height: calc(${D} * 1px);
            position: relative;
            user-select: none;
            min-width: 250px;
            outline: none;
            vertical-align: top;
        }

        ${t ? m`
            :host(:not([aria-haspopup])) {
                --elevation: 0;
                border: 0;
                height: auto;
                min-width: 0;
            }
        ` : ""}

        ${Ol(i)}

        :host .listbox {
            ${Fi}
            border: none;
            display: flex;
            left: 0;
            position: absolute;
            width: 100%;
            z-index: 1;
        }

        .control + .listbox {
            --stroke-size: calc(${y} * ${E} * 2);
            max-height: calc(
                (var(--listbox-max-height) * ${D} + var(--stroke-size)) * 1px
            );
        }

        ${t ? m`
            :host(:not([aria-haspopup])) .listbox {
                left: auto;
                position: static;
                z-index: auto;
            }
        ` : ""}

        .listbox[hidden] {
            display: none;
        }

        .control {
            align-items: center;
            box-sizing: border-box;
            cursor: pointer;
            display: flex;
            font-size: ${Y};
            font-family: inherit;
            line-height: ${Z};
            min-height: 100%;
            padding: 0 calc(${y} * 2.25px);
            width: 100%;
        }

        :host(:not([disabled]):hover) {
            background: ${je};
            border-color: ${me};
        }

        :host(:${w}) {
            border-color: ${H};
        }

        :host(:not([size]):not([multiple]):not([open]):${w}),
        :host([multiple]:${w}),
        :host([size]:${w}) {
            box-shadow: 0 0 0 calc(${j} * 1px) ${H};
        }

        :host(:not([multiple]):not([size]):${w}) ::slotted(${i.tagFor(nt)}[aria-selected="true"]:not([disabled])) {
            box-shadow: 0 0 0 calc(${j} * 1px) inset ${us};
            border-color: ${H};
            background: ${Sn};
            color: ${pf};
        }

        :host([disabled]) {
            cursor: ${de};
            opacity: ${ge};
        }

        :host([disabled]) .control {
            cursor: ${de};
            user-select: none;
        }

        :host([disabled]:hover) {
            background: ${Ke};
            color: ${F};
            fill: currentcolor;
        }

        :host(:not([disabled])) .control:active {
            background: ${yo};
            border-color: ${fe};
            border-radius: calc(${V} * 1px);
        }

        :host([open][position="above"]) .listbox {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            border-bottom: 0;
            bottom: calc(${D} * 1px);
        }

        :host([open][position="below"]) .listbox {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            border-top: 0;
            top: calc(${D} * 1px);
        }

        .selected-value {
            flex: 1 1 auto;
            font-family: inherit;
            min-width: calc(var(--listbox-scroll-width, 0) - (${y} * 4) * 1px);
            overflow: hidden;
            text-align: start;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .indicator {
            flex: 0 0 auto;
            margin-inline-start: 1em;
        }

        slot[name="listbox"] {
            display: none;
            width: 100%;
        }

        :host([open]) slot[name="listbox"] {
            display: flex;
            position: absolute;
            ${Fi}
        }

        .end {
            margin-inline-start: auto;
        }

        .start,
        .end,
        .indicator,
        .select-indicator,
        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            fill: currentcolor;
            height: 1em;
            min-height: calc(${y} * 4px);
            min-width: calc(${y} * 4px);
            width: 1em;
        }

        ::slotted([role="option"]),
        ::slotted(option) {
            flex: 0 0 auto;
        }
    `.withBehaviors(M(m`
                :host(:not([disabled]):hover),
                :host(:not([disabled]):active) {
                    border-color: ${d.Highlight};
                }

                :host(:not([disabled]):${w}) {
                    background-color: ${d.ButtonFace};
                    box-shadow: 0 0 0 calc(${j} * 1px) ${d.Highlight};
                    color: ${d.ButtonText};
                    fill: currentcolor;
                    forced-color-adjust: none;
                }

                :host(:not([disabled]):${w}) .listbox {
                    background: ${d.ButtonFace};
                }

                :host([disabled]) {
                    border-color: ${d.GrayText};
                    background-color: ${d.ButtonFace};
                    color: ${d.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                    forced-color-adjust: none;
                }

                :host([disabled]:hover) {
                    background: ${d.ButtonFace};
                }

                :host([disabled]) .control {
                    color: ${d.GrayText};
                    border-color: ${d.GrayText};
                }

                :host([disabled]) .control .select-indicator {
                    fill: ${d.GrayText};
                }

                :host(:${w}) ::slotted([aria-selected="true"][role="option"]),
                :host(:${w}) ::slotted(option[aria-selected="true"]),
                :host(:${w}) ::slotted([aria-selected="true"][role="option"]:not([disabled])) {
                    background: ${d.Highlight};
                    border-color: ${d.ButtonText};
                    box-shadow: 0 0 0 calc(${j} * 1px) inset ${d.HighlightText};
                    color: ${d.HighlightText};
                    fill: currentcolor;
                }

                .start,
                .end,
                .indicator,
                .select-indicator,
                ::slotted(svg) {
                    color: ${d.ButtonText};
                    fill: currentcolor;
                }
            `));
}, Bf = (i, e) => m`
    ${Ll(i)}

    :host(:empty) .listbox {
        display: none;
    }

    :host([disabled]) *,
    :host([disabled]) {
        cursor: ${de};
        user-select: none;
    }

    .selected-value {
        -webkit-appearance: none;
        background: transparent;
        border: none;
        color: inherit;
        font-size: ${Y};
        line-height: ${Z};
        height: calc(100% - (${E} * 1px));
        margin: auto 0;
        width: 100%;
    }

    .selected-value:hover,
    .selected-value:${w},
    .selected-value:disabled,
    .selected-value:active {
        outline: none;
    }
`;
class jf extends St {
  maxHeightChanged(e, t) {
    this.updateComputedStylesheet();
  }
  updateComputedStylesheet() {
    this.computedStylesheet && this.$fastController.removeStyles(this.computedStylesheet);
    const e = Math.floor(this.maxHeight / Cl.getValueFor(this)).toString();
    this.computedStylesheet = m`
            :host {
                --listbox-max-height: ${e};
            }
        `, this.$fastController.addStyles(this.computedStylesheet);
  }
}
const Eb = jf.compose({
  baseName: "combobox",
  baseClass: St,
  template: vh,
  styles: Bf,
  shadowOptions: {
    delegatesFocus: !0
  },
  indicator: `
        <svg
            class="select-indicator"
            part="select-indicator"
            viewBox="0 0 12 7"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M11.85.65c.2.2.2.5 0 .7L6.4 6.84a.55.55 0 01-.78 0L.14 1.35a.5.5 0 11.71-.7L6 5.8 11.15.65c.2-.2.5-.2.7 0z"
            />
        </svg>
    `
}), _f = (i, e) => m`
    :host {
        display: flex;
        position: relative;
        flex-direction: column;
    }
`, Uf = (i, e) => m`
    :host {
        display: grid;
        padding: 1px 0;
        box-sizing: border-box;
        width: 100%;
        border-bottom: calc(${E} * 1px) solid ${Si};
    }

    :host(.header) {
    }

    :host(.sticky-header) {
        background: ${ke};
        position: sticky;
        top: 0;
    }
`, qf = (i, e) => m`
        :host {
            padding: calc(${y} * 1px) calc(${y} * 3px);
            color: ${F};
            box-sizing: border-box;
            font-family: ${J};
            font-size: ${Y};
            line-height: ${Z};
            font-weight: 400;
            border: transparent calc(${j} * 1px) solid;
            overflow: hidden;
            white-space: nowrap;
            border-radius: calc(${V} * 1px);
        }

        :host(.column-header) {
            font-weight: 600;
        }

        :host(:${w}) {
            border: ${H} calc(${j} * 1px) solid;
            outline: none;
            color: ${F};
        }
    `.withBehaviors(M(m`
        :host {
            forced-color-adjust: none;
            border-color: transparent;
            background: ${d.Field};
            color: ${d.FieldText};
        }

        :host(:${w}) {
            border-color: ${d.FieldText};
            box-shadow: 0 0 0 2px inset ${d.Field};
            color: ${d.FieldText};
        }
        `)), Rb = It.compose({
  baseName: "data-grid-cell",
  template: sh,
  styles: qf
}), Db = Ce.compose({
  baseName: "data-grid-row",
  template: oh,
  styles: Uf
}), Ob = ye.compose({
  baseName: "data-grid",
  template: Jd,
  styles: _f
}), Ln = {
  toView(i) {
    return i == null ? null : i == null ? void 0 : i.toColorString();
  },
  fromView(i) {
    if (i == null)
      return null;
    const e = si(i);
    return e ? Rt.create(e.r, e.g, e.b) : null;
  }
}, Sr = m`
    :host {
        background-color: ${_};
        color: ${F};
    }
`.withBehaviors(M(m`
            :host {
                background-color: ${d.ButtonFace};
                box-shadow: 0 0 0 1px ${d.CanvasText};
                color: ${d.ButtonText};
            }
        `));
function S(i) {
  return (e, t) => {
    e[t + "Changed"] = function(o, s) {
      s != null ? i.setValueFor(this, s) : i.deleteValueFor(this);
    };
  };
}
class T extends O {
  constructor() {
    super(), this.noPaint = !1;
    const e = {
      handleChange: this.noPaintChanged.bind(this)
    };
    A.getNotifier(this).subscribe(e, "fillColor"), A.getNotifier(this).subscribe(e, "baseLayerLuminance");
  }
  noPaintChanged() {
    !this.noPaint && (this.fillColor !== void 0 || this.baseLayerLuminance) ? this.$fastController.addStyles(Sr) : this.$fastController.removeStyles(Sr);
  }
}
a([
  h({ attribute: "no-paint", mode: "boolean" })
], T.prototype, "noPaint", void 0);
a([
  h({
    attribute: "fill-color",
    converter: Ln
  }),
  S(_)
], T.prototype, "fillColor", void 0);
a([
  h({
    attribute: "accent-color",
    converter: Ln,
    mode: "fromView"
  }),
  S(wl)
], T.prototype, "accentColor", void 0);
a([
  h({
    attribute: "neutral-color",
    converter: Ln,
    mode: "fromView"
  }),
  S($l)
], T.prototype, "neutralColor", void 0);
a([
  h({
    converter: C
  }),
  S(dt)
], T.prototype, "density", void 0);
a([
  h({
    attribute: "design-unit",
    converter: C
  }),
  S(y)
], T.prototype, "designUnit", void 0);
a([
  h({
    attribute: "direction"
  }),
  S(Do)
], T.prototype, "direction", void 0);
a([
  h({
    attribute: "base-height-multiplier",
    converter: C
  }),
  S(vo)
], T.prototype, "baseHeightMultiplier", void 0);
a([
  h({
    attribute: "base-horizontal-spacing-multiplier",
    converter: C
  }),
  S(Up)
], T.prototype, "baseHorizontalSpacingMultiplier", void 0);
a([
  h({
    attribute: "control-corner-radius",
    converter: C
  }),
  S(V)
], T.prototype, "controlCornerRadius", void 0);
a([
  h({
    attribute: "stroke-width",
    converter: C
  }),
  S(E)
], T.prototype, "strokeWidth", void 0);
a([
  h({
    attribute: "focus-stroke-width",
    converter: C
  }),
  S(j)
], T.prototype, "focusStrokeWidth", void 0);
a([
  h({
    attribute: "disabled-opacity",
    converter: C
  }),
  S(ge)
], T.prototype, "disabledOpacity", void 0);
a([
  h({
    attribute: "type-ramp-minus-2-font-size"
  }),
  S(qp)
], T.prototype, "typeRampMinus2FontSize", void 0);
a([
  h({
    attribute: "type-ramp-minus-2-line-height"
  }),
  S(Gp)
], T.prototype, "typeRampMinus2LineHeight", void 0);
a([
  h({
    attribute: "type-ramp-minus-1-font-size"
  }),
  S(ss)
], T.prototype, "typeRampMinus1FontSize", void 0);
a([
  h({
    attribute: "type-ramp-minus-1-line-height"
  }),
  S(ns)
], T.prototype, "typeRampMinus1LineHeight", void 0);
a([
  h({
    attribute: "type-ramp-base-font-size"
  }),
  S(Y)
], T.prototype, "typeRampBaseFontSize", void 0);
a([
  h({
    attribute: "type-ramp-base-line-height"
  }),
  S(Z)
], T.prototype, "typeRampBaseLineHeight", void 0);
a([
  h({
    attribute: "type-ramp-plus-1-font-size"
  }),
  S(Wp)
], T.prototype, "typeRampPlus1FontSize", void 0);
a([
  h({
    attribute: "type-ramp-plus-1-line-height"
  }),
  S(Yp)
], T.prototype, "typeRampPlus1LineHeight", void 0);
a([
  h({
    attribute: "type-ramp-plus-2-font-size"
  }),
  S(Xp)
], T.prototype, "typeRampPlus2FontSize", void 0);
a([
  h({
    attribute: "type-ramp-plus-2-line-height"
  }),
  S(Qp)
], T.prototype, "typeRampPlus2LineHeight", void 0);
a([
  h({
    attribute: "type-ramp-plus-3-font-size"
  }),
  S(Qa)
], T.prototype, "typeRampPlus3FontSize", void 0);
a([
  h({
    attribute: "type-ramp-plus-3-line-height"
  }),
  S(Za)
], T.prototype, "typeRampPlus3LineHeight", void 0);
a([
  h({
    attribute: "type-ramp-plus-4-font-size"
  }),
  S(Zp)
], T.prototype, "typeRampPlus4FontSize", void 0);
a([
  h({
    attribute: "type-ramp-plus-4-line-height"
  }),
  S(Jp)
], T.prototype, "typeRampPlus4LineHeight", void 0);
a([
  h({
    attribute: "type-ramp-plus-5-font-size"
  }),
  S(Kp)
], T.prototype, "typeRampPlus5FontSize", void 0);
a([
  h({
    attribute: "type-ramp-plus-5-line-height"
  }),
  S(ef)
], T.prototype, "typeRampPlus5LineHeight", void 0);
a([
  h({
    attribute: "type-ramp-plus-6-font-size"
  }),
  S(tf)
], T.prototype, "typeRampPlus6FontSize", void 0);
a([
  h({
    attribute: "type-ramp-plus-6-line-height"
  }),
  S(of)
], T.prototype, "typeRampPlus6LineHeight", void 0);
a([
  h({
    attribute: "accent-fill-rest-delta",
    converter: C
  }),
  S(sf)
], T.prototype, "accentFillRestDelta", void 0);
a([
  h({
    attribute: "accent-fill-hover-delta",
    converter: C
  }),
  S(Ja)
], T.prototype, "accentFillHoverDelta", void 0);
a([
  h({
    attribute: "accent-fill-active-delta",
    converter: C
  }),
  S(Ka)
], T.prototype, "accentFillActiveDelta", void 0);
a([
  h({
    attribute: "accent-fill-focus-delta",
    converter: C
  }),
  S(el)
], T.prototype, "accentFillFocusDelta", void 0);
a([
  h({
    attribute: "accent-foreground-rest-delta",
    converter: C
  }),
  S(tl)
], T.prototype, "accentForegroundRestDelta", void 0);
a([
  h({
    attribute: "accent-foreground-hover-delta",
    converter: C
  }),
  S(il)
], T.prototype, "accentForegroundHoverDelta", void 0);
a([
  h({
    attribute: "accent-foreground-active-delta",
    converter: C
  }),
  S(ol)
], T.prototype, "accentForegroundActiveDelta", void 0);
a([
  h({
    attribute: "accent-foreground-focus-delta",
    converter: C
  }),
  S(sl)
], T.prototype, "accentForegroundFocusDelta", void 0);
a([
  h({
    attribute: "neutral-fill-rest-delta",
    converter: C
  }),
  S(ai)
], T.prototype, "neutralFillRestDelta", void 0);
a([
  h({
    attribute: "neutral-fill-hover-delta",
    converter: C
  }),
  S(li)
], T.prototype, "neutralFillHoverDelta", void 0);
a([
  h({
    attribute: "neutral-fill-active-delta",
    converter: C
  }),
  S(ci)
], T.prototype, "neutralFillActiveDelta", void 0);
a([
  h({
    attribute: "neutral-fill-focus-delta",
    converter: C
  }),
  S(Cn)
], T.prototype, "neutralFillFocusDelta", void 0);
a([
  h({
    attribute: "neutral-fill-input-rest-delta",
    converter: C
  }),
  S(nl)
], T.prototype, "neutralFillInputRestDelta", void 0);
a([
  h({
    attribute: "neutral-fill-input-hover-delta",
    converter: C
  }),
  S(rl)
], T.prototype, "neutralFillInputHoverDelta", void 0);
a([
  h({
    attribute: "neutral-fill-input-active-delta",
    converter: C
  }),
  S(al)
], T.prototype, "neutralFillInputActiveDelta", void 0);
a([
  h({
    attribute: "neutral-fill-input-focus-delta",
    converter: C
  }),
  S(ll)
], T.prototype, "neutralFillInputFocusDelta", void 0);
a([
  h({
    attribute: "neutral-fill-stealth-rest-delta",
    converter: C
  }),
  S(cl)
], T.prototype, "neutralFillStealthRestDelta", void 0);
a([
  h({
    attribute: "neutral-fill-stealth-hover-delta",
    converter: C
  }),
  S(dl)
], T.prototype, "neutralFillStealthHoverDelta", void 0);
a([
  h({
    attribute: "neutral-fill-stealth-active-delta",
    converter: C
  }),
  S(hl)
], T.prototype, "neutralFillStealthActiveDelta", void 0);
a([
  h({
    attribute: "neutral-fill-stealth-focus-delta",
    converter: C
  }),
  S(ul)
], T.prototype, "neutralFillStealthFocusDelta", void 0);
a([
  h({
    attribute: "neutral-fill-strong-hover-delta",
    converter: C
  }),
  S(pl)
], T.prototype, "neutralFillStrongHoverDelta", void 0);
a([
  h({
    attribute: "neutral-fill-strong-active-delta",
    converter: C
  }),
  S(fl)
], T.prototype, "neutralFillStrongActiveDelta", void 0);
a([
  h({
    attribute: "neutral-fill-strong-focus-delta",
    converter: C
  }),
  S(gl)
], T.prototype, "neutralFillStrongFocusDelta", void 0);
a([
  h({
    attribute: "base-layer-luminance",
    converter: C
  }),
  S(ri)
], T.prototype, "baseLayerLuminance", void 0);
a([
  h({
    attribute: "neutral-fill-layer-rest-delta",
    converter: C
  }),
  S(di)
], T.prototype, "neutralFillLayerRestDelta", void 0);
a([
  h({
    attribute: "neutral-stroke-divider-rest-delta",
    converter: C
  }),
  S(xl)
], T.prototype, "neutralStrokeDividerRestDelta", void 0);
a([
  h({
    attribute: "neutral-stroke-rest-delta",
    converter: C
  }),
  S(ml)
], T.prototype, "neutralStrokeRestDelta", void 0);
a([
  h({
    attribute: "neutral-stroke-hover-delta",
    converter: C
  }),
  S(bl)
], T.prototype, "neutralStrokeHoverDelta", void 0);
a([
  h({
    attribute: "neutral-stroke-active-delta",
    converter: C
  }),
  S(vl)
], T.prototype, "neutralStrokeActiveDelta", void 0);
a([
  h({
    attribute: "neutral-stroke-focus-delta",
    converter: C
  }),
  S(yl)
], T.prototype, "neutralStrokeFocusDelta", void 0);
const Gf = (i, e) => v`
    <slot></slot>
`, Wf = (i, e) => m`
    ${B("block")}
`, Lb = T.compose({
  baseName: "design-system-provider",
  template: Gf,
  styles: Wf
}), Yf = (i, e) => m`
    :host([hidden]) {
        display: none;
    }

    :host {
        --elevation: 14;
        --dialog-height: 480px;
        --dialog-width: 640px;
        display: block;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        touch-action: none;
    }

    .positioning-region {
        display: flex;
        justify-content: center;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: auto;
    }

    .control {
        ${Fi}
        margin-top: auto;
        margin-bottom: auto;
        width: var(--dialog-width);
        height: var(--dialog-height);
        background-color: ${_};
        z-index: 1;
        border-radius: calc(${V} * 1px);
        border: calc(${E} * 1px) solid transparent;
    }
`, Ab = Qe.compose({
  baseName: "dialog",
  template: Oh,
  styles: Yf
}), Xf = (i, e) => m`
    .disclosure {
        transition: height 0.35s;
    }

    .disclosure .invoker::-webkit-details-marker {
        display: none;
    }

    .disclosure .invoker {
        list-style-type: none;
    }

    :host([appearance="accent"]) .invoker {
        background: ${K};
        color: ${Ze};
        font-family: ${J};
        font-size: ${Y};
        border-radius: calc(${V} * 1px);
        outline: none;
        cursor: pointer;
        margin: 16px 0;
        padding: 12px;
        max-width: max-content;
    }

    :host([appearance="accent"]) .invoker:active {
        background: ${fe};
        color: ${Je};
    }

    :host([appearance="accent"]) .invoker:hover {
        background: ${me};
        color: ${ht};
    }

    :host([appearance="lightweight"]) .invoker {
        background: transparent;
        color: ${we};
        border-bottom: calc(${E} * 1px) solid ${we};
        cursor: pointer;
        width: max-content;
        margin: 16px 0;
    }

    :host([appearance="lightweight"]) .invoker:active {
        border-bottom-color: ${lt};
    }

    :host([appearance="lightweight"]) .invoker:hover {
        border-bottom-color: ${Jt};
    }

    .disclosure[open] .invoker ~ * {
        animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
`;
class Al extends Qo {
  constructor() {
    super(...arguments), this.height = 0, this.totalHeight = 0;
  }
  connectedCallback() {
    super.connectedCallback(), this.appearance || (this.appearance = "accent");
  }
  appearanceChanged(e, t) {
    e !== t && (this.classList.add(t), this.classList.remove(e));
  }
  onToggle() {
    super.onToggle(), this.details.style.setProperty("height", `${this.disclosureHeight}px`);
  }
  setup() {
    super.setup();
    const e = () => this.details.getBoundingClientRect().height;
    this.show(), this.totalHeight = e(), this.hide(), this.height = e(), this.expanded && this.show();
  }
  get disclosureHeight() {
    return this.expanded ? this.totalHeight : this.height;
  }
}
a([
  h
], Al.prototype, "appearance", void 0);
const Pb = Al.compose({
  baseName: "disclosure",
  baseClass: Qo,
  template: qh,
  styles: Xf
}), Qf = (i, e) => m`
        ${B("block")} :host {
            box-sizing: content-box;
            height: 0;
            margin: calc(${y} * 1px) 0;
            border-top: calc(${E} * 1px) solid ${Si};
            border-left: none;
        }

        :host([orientation="vertical"]) {
            height: 100%;
            margin: 0 calc(${y} * 1px);
            border-top: none;
            border-left: calc(${E} * 1px) solid ${Si};
        }
    `, Mb = yn.compose({
  baseName: "divider",
  template: Gh,
  styles: Qf
}), Zf = (i, e) => m`
    ${B("inline-flex")} :host {
        width: calc(${D} * 1px);
        height: calc(${D} * 1px);
        justify-content: center;
        align-items: center;
        margin: 0;
        position: relative;
        fill: currentcolor;
        color: ${Ze};
        background: transparent;
        outline: none;
        border: none;
        padding: 0;
    }

    :host::before {
        content: "";
        background: ${K};
        border: calc(${E} * 1px) solid ${K};
        border-radius: 50%;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        transition: all 0.1s ease-in-out;
    }

    .next,
    .previous {
        position: relative;
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        width: 16px;
        height: 16px;
        display: grid;
    }

    :host([disabled]) {
        opacity: ${ge};
        cursor: ${de};
        fill: currentcolor;
        color: ${F};
        pointer-events: none;
    }

    :host([disabled])::before,
    :host([disabled]:hover)::before,
    :host([disabled]:active)::before {
        background: ${Ke};
        border-color: ${rt};
    }

    :host(:hover) {
        color: ${ht};
    }

    :host(:hover)::before {
        background: ${me};
        border-color: ${me};
    }

    :host(:active) {
        color: ${Je};
    }

    :host(:active)::before {
        background: ${fe};
        border-color: ${fe};
    }

    :host(:${w}) {
        outline: none;
    }

    :host(:${w})::before {
        box-shadow: 0 0 0 calc((${j} - ${E}) * 1px) ${H} inset,
            0 0 0 calc((${j} + ${E}) * 1px) ${us} inset;
        border-color: ${H};
    }

    :host::-moz-focus-inner {
        border: 0;
    }
`.withBehaviors(M(m`
            :host {
                background: ${d.Canvas};
            }
            :host .next,
            :host .previous {
                color: ${d.ButtonText};
                fill: currentcolor;
            }
            :host::before {
                background: ${d.Canvas};
                border-color: ${d.ButtonText};
            }
            :host(:hover)::before {
                forced-color-adjust: none;
                background: ${d.Highlight};
                border-color: ${d.ButtonText};
                opacity: 1;
            }
            :host(:hover) .next,
            :host(:hover) .previous  {
                forced-color-adjust: none;
                color: ${d.HighlightText};
                fill: currentcolor;
            }
            :host([disabled]) {
                opacity: 1;
            }
            :host([disabled])::before,
            :host([disabled]:hover)::before,
            :host([disabled]) .next,
            :host([disabled]) .previous {
                forced-color-adjust: none;
                background: ${d.Canvas};
                border-color: ${d.GrayText};
                color: ${d.GrayText};
                fill: ${d.GrayText};
            }
            :host(:${w})::before {
                forced-color-adjust: none;
                border-color: ${d.Highlight};
                box-shadow: 0 0 0 calc((${j} - ${E}) * 1px) ${d.Highlight} inset;
            }
        `)), Vb = Pt.compose({
  baseName: "flipper",
  template: Yh,
  styles: Zf,
  next: `
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M4.023 15.273L11.29 8 4.023.727l.704-.704L12.71 8l-7.984 7.977-.704-.704z"
            />
        </svg>
    `,
  previous: `
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M11.273 15.977L3.29 8 11.273.023l.704.704L4.71 8l7.266 7.273-.704.704z"
            />
        </svg>
    `
}), Jf = m`
    .scroll-prev {
        right: auto;
        left: 0;
    }

    .scroll.scroll-next::before,
    .scroll-next .scroll-action {
        left: auto;
        right: 0;
    }

    .scroll.scroll-next::before {
        background: linear-gradient(to right, transparent, var(--scroll-fade-next));
    }

    .scroll-next .scroll-action {
        transform: translate(50%, -50%);
    }
`, Kf = m`
    .scroll.scroll-next {
        right: auto;
        left: 0;
    }

    .scroll.scroll-next::before {
        background: linear-gradient(to right, var(--scroll-fade-next), transparent);
        left: auto;
        right: 0;
    }

    .scroll.scroll-prev::before {
        background: linear-gradient(to right, transparent, var(--scroll-fade-previous));
    }

    .scroll-prev .scroll-action {
        left: auto;
        right: 0;
        transform: translate(50%, -50%);
    }
`, eg = m`
    .scroll-area {
        position: relative;
    }

    div.scroll-view {
        overflow-x: hidden;
    }

    .scroll {
        bottom: 0;
        pointer-events: none;
        position: absolute;
        right: 0;
        top: 0;
        user-select: none;
        width: 100px;
    }

    .scroll.disabled {
        display: none;
    }

    .scroll::before,
    .scroll-action {
        left: 0;
        position: absolute;
    }

    .scroll::before {
        background: linear-gradient(to right, var(--scroll-fade-previous), transparent);
        content: "";
        display: block;
        height: 100%;
        width: 100%;
    }

    .scroll-action {
        pointer-events: auto;
        right: auto;
        top: 50%;
        transform: translate(-50%, -50%);
    }
`.withBehaviors(new Oi(Jf, Kf)), tg = (i, e) => m`
    ${B("block")} :host {
        --scroll-align: center;
        --scroll-item-spacing: 5px;
        contain: layout;
        position: relative;
    }

    .scroll-view {
        overflow-x: auto;
        scrollbar-width: none;
    }

    ::-webkit-scrollbar {
        display: none;
    }

    .content-container {
        align-items: var(--scroll-align);
        display: inline-flex;
        flex-wrap: nowrap;
        position: relative;
    }

    .content-container ::slotted(*) {
        margin-right: var(--scroll-item-spacing);
    }

    .content-container ::slotted(*:last-child) {
        margin-right: 0;
    }
`;
class ig extends Ft {
  connectedCallback() {
    super.connectedCallback(), this.view !== "mobile" && this.$fastController.addStyles(eg);
  }
}
const Hb = ig.compose({
  baseName: "horizontal-scroll",
  baseClass: Ft,
  template: Cu,
  styles: tg,
  nextFlipper: (i) => v`
        <${i.tagFor(Pt)}
            @click="${(e) => e.scrollToNext()}"
            aria-hidden="${(e) => e.flippersHiddenFromAT}"
        ></${i.tagFor(Pt)}>
    `,
  previousFlipper: (i) => v`
        <${i.tagFor(Pt)}
            @click="${(e) => e.scrollToPrevious()}"
            direction="previous"
            aria-hidden="${(e) => e.flippersHiddenFromAT}"
        ></${i.tagFor(Pt)}>
    `
}), og = (i, e) => m`
        ${B("inline-flex")} :host {
            align-items: center;
            font-family: ${J};
            border-radius: calc(${V} * 1px);
            border: calc(${j} * 1px) solid transparent;
            box-sizing: border-box;
            background: ${Ke};
            color: ${F};
            cursor: pointer;
            flex: 0 0 auto;
            fill: currentcolor;
            font-size: ${Y};
            height: calc(${D} * 1px);
            line-height: ${Z};
            margin: 0 calc((${y} - ${j}) * 1px);
            outline: none;
            overflow: hidden;
            padding: 0 1ch;
            user-select: none;
            white-space: nowrap;
        }

        :host(:not([disabled]):not([aria-selected="true"]):hover) {
            background: ${pi};
        }

        :host(:not([disabled]):not([aria-selected="true"]):active) {
            background: ${fi};
        }

        :host([aria-selected="true"]) {
            background: ${K};
            color: ${Ze};
        }

        :host(:not([disabled])[aria-selected="true"]:hover) {
            background: ${me};
            color: ${ht};
        }

        :host(:not([disabled])[aria-selected="true"]:active) {
            background: ${fe};
            color: ${Je};
        }

        :host([disabled]) {
            cursor: ${de};
            opacity: ${ge};
        }

        .content {
            grid-column-start: 2;
            justify-self: start;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .start,
        .end,
        ::slotted(svg) {
            display: flex;
        }

        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            height: calc(${y} * 4px);
            width: calc(${y} * 4px);
        }

        ::slotted([slot="end"]) {
            margin-inline-start: 1ch;
        }

        ::slotted([slot="start"]) {
            margin-inline-end: 1ch;
        }

        :host([aria-checked="true"][aria-selected="false"]) {
            border-color: ${H};
        }

        :host([aria-checked="true"][aria-selected="true"]) {
            border-color: ${H};
            box-shadow: 0 0 0 calc(${j} * 2 * 1px) inset
                ${us};
        }
    `.withBehaviors(M(m`
                :host {
                    border-color: transparent;
                    forced-color-adjust: none;
                    color: ${d.ButtonText};
                    fill: currentcolor;
                }

                :host(:not([aria-selected="true"]):hover),
                :host([aria-selected="true"]) {
                    background: ${d.Highlight};
                    color: ${d.HighlightText};
                }

                :host([disabled]),
                :host([disabled][aria-selected="false"]:hover) {
                    background: ${d.Canvas};
                    color: ${d.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                }

                :host([aria-checked="true"][aria-selected="false"]) {
                    background: ${d.ButtonFace};
                    color: ${d.ButtonText};
                    border-color: ${d.ButtonText};
                }

                :host([aria-checked="true"][aria-selected="true"]),
                :host([aria-checked="true"][aria-selected="true"]:hover) {
                    background: ${d.Highlight};
                    color: ${d.HighlightText};
                    border-color: ${d.ButtonText};
                }
            `)), zb = nt.compose({
  baseName: "option",
  template: Xh,
  styles: og
});
class sg extends zt {
  sizeChanged(e, t) {
    super.sizeChanged(e, t), this.updateComputedStylesheet();
  }
  updateComputedStylesheet() {
    this.computedStylesheet && this.$fastController.removeStyles(this.computedStylesheet);
    const e = `${this.size}`;
    this.computedStylesheet = m`
            :host {
                --size: ${e};
            }
        `, this.$fastController.addStyles(this.computedStylesheet);
  }
}
const Nb = sg.compose({
  baseName: "listbox",
  baseClass: zt,
  template: Qh,
  styles: Ol
}), ng = (i, e) => m`
        ${B("grid")} :host {
            contain: layout;
            overflow: visible;
            font-family: ${J};
            outline: none;
            box-sizing: border-box;
            height: calc(${D} * 1px);
            grid-template-columns: minmax(42px, auto) 1fr minmax(42px, auto);
            grid-template-rows: auto;
            justify-items: center;
            align-items: center;
            padding: 0;
            margin: 0 calc(${y} * 1px);
            white-space: nowrap;
            background: ${Ke};
            color: ${F};
            fill: currentcolor;
            cursor: pointer;
            font-size: ${Y};
            line-height: ${Z};
            border-radius: calc(${V} * 1px);
            border: calc(${j} * 1px) solid transparent;
        }

        :host(:hover) {
            position: relative;
            z-index: 1;
        }

        :host(.indent-0) {
            grid-template-columns: auto 1fr minmax(42px, auto);
        }
        :host(.indent-0) .content {
            grid-column: 1;
            grid-row: 1;
            margin-inline-start: 10px;
        }
        :host(.indent-0) .expand-collapse-glyph-container {
            grid-column: 5;
            grid-row: 1;
        }
        :host(.indent-2) {
            grid-template-columns: minmax(42px, auto) minmax(42px, auto) 1fr minmax(42px, auto) minmax(42px, auto);
        }
        :host(.indent-2) .content {
            grid-column: 3;
            grid-row: 1;
            margin-inline-start: 10px;
        }
        :host(.indent-2) .expand-collapse-glyph-container {
            grid-column: 5;
            grid-row: 1;
        }
        :host(.indent-2) .start {
            grid-column: 2;
        }
        :host(.indent-2) .end {
            grid-column: 4;
        }

        :host(:${w}) {
            border-color: ${H};
            background: ${En};
            color: ${F};
        }

        :host(:hover) {
            background: ${pi};
            color: ${F};
        }

        :host(:active) {
            background: ${fi};
        }

        :host([aria-checked="true"]),
        :host(.expanded) {
            background: ${ke};
            color: ${F};
        }

        :host([disabled]) {
            cursor: ${de};
            opacity: ${ge};
        }

        :host([disabled]:hover) {
            color: ${F};
            fill: currentcolor;
            background: ${Ke};
        }

        :host([disabled]:hover) .start,
        :host([disabled]:hover) .end,
        :host([disabled]:hover)::slotted(svg) {
            fill: ${F};
        }

        .expand-collapse-glyph {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: 16px;
            height: 16px;
            fill: currentcolor;
        }

        .content {
            grid-column-start: 2;
            justify-self: start;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .start,
        .end {
            display: flex;
            justify-content: center;
        }

        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: 16px;
            height: 16px;
        }

        :host(:hover) .start,
        :host(:hover) .end,
        :host(:hover)::slotted(svg),
        :host(:active) .start,
        :host(:active) .end,
        :host(:active)::slotted(svg) {
            fill: ${F};
        }

        :host(.indent-0[aria-haspopup="menu"]) {
            display: grid;
            grid-template-columns: minmax(42px, auto) auto 1fr minmax(42px, auto) minmax(42px, auto);
            align-items: center;
            min-height: 32px;
        }

        :host(.indent-1[aria-haspopup="menu"]),
        :host(.indent-1[role="menuitemcheckbox"]),
        :host(.indent-1[role="menuitemradio"]) {
            display: grid;
            grid-template-columns: minmax(42px, auto) auto 1fr minmax(42px, auto) minmax(42px, auto);
            align-items: center;
            min-height: 32px;
        }

        :host(.indent-2:not([aria-haspopup="menu"])) .end {
            grid-column: 5;
        }

        :host .input-container,
        :host .expand-collapse-glyph-container {
            display: none;
        }

        :host([aria-haspopup="menu"]) .expand-collapse-glyph-container,
        :host([role="menuitemcheckbox"]) .input-container,
        :host([role="menuitemradio"]) .input-container {
            display: grid;
            margin-inline-end: 10px;
        }

        :host([aria-haspopup="menu"]) .content,
        :host([role="menuitemcheckbox"]) .content,
        :host([role="menuitemradio"]) .content {
            grid-column-start: 3;
        }

        :host([aria-haspopup="menu"].indent-0) .content {
            grid-column-start: 1;
        }

        :host([aria-haspopup="menu"]) .end,
        :host([role="menuitemcheckbox"]) .end,
        :host([role="menuitemradio"]) .end {
            grid-column-start: 4;
        }

        :host .expand-collapse,
        :host .checkbox,
        :host .radio {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            width: 20px;
            height: 20px;
            box-sizing: border-box;
            outline: none;
            margin-inline-start: 10px;
        }

        :host .checkbox,
        :host .radio {
            border: calc(${E} * 1px) solid ${F};
        }

        :host([aria-checked="true"]) .checkbox,
        :host([aria-checked="true"]) .radio {
            background: ${K};
            border-color: ${K};
        }

        :host .checkbox {
            border-radius: calc(${V} * 1px);
        }

        :host .radio {
            border-radius: 999px;
        }

        :host .checkbox-indicator,
        :host .radio-indicator,
        :host .expand-collapse-indicator,
        ::slotted([slot="checkbox-indicator"]),
        ::slotted([slot="radio-indicator"]),
        ::slotted([slot="expand-collapse-indicator"]) {
            display: none;
        }

        ::slotted([slot="end"]:not(svg)) {
            margin-inline-end: 10px;
            color: ${no}
        }

        :host([aria-checked="true"]) .checkbox-indicator,
        :host([aria-checked="true"]) ::slotted([slot="checkbox-indicator"]) {
            width: 100%;
            height: 100%;
            display: block;
            fill: ${Ze};
            pointer-events: none;
        }

        :host([aria-checked="true"]) .radio-indicator {
            position: absolute;
            top: 4px;
            left: 4px;
            right: 4px;
            bottom: 4px;
            border-radius: 999px;
            display: block;
            background: ${Ze};
            pointer-events: none;
        }

        :host([aria-checked="true"]) ::slotted([slot="radio-indicator"]) {
            display: block;
            pointer-events: none;
        }
    `.withBehaviors(M(m`
            :host {
                border-color: transparent;
                color: ${d.ButtonText};
                forced-color-adjust: none;
            }

            :host(:hover) {
                background: ${d.Highlight};
                color: ${d.HighlightText};
            }

            :host(:hover) .start,
            :host(:hover) .end,
            :host(:hover)::slotted(svg),
            :host(:active) .start,
            :host(:active) .end,
            :host(:active)::slotted(svg) {
                fill: ${d.HighlightText};
            }

            :host(.expanded) {
                background: ${d.Highlight};
                border-color: ${d.Highlight};
                color: ${d.HighlightText};
            }

            :host(:${w}) {
                background: ${d.Highlight};
                border-color: ${d.ButtonText};
                box-shadow: 0 0 0 calc(${j} * 1px) inset ${d.HighlightText};
                color: ${d.HighlightText};
                fill: currentcolor;
            }

            :host([disabled]),
            :host([disabled]:hover),
            :host([disabled]:hover) .start,
            :host([disabled]:hover) .end,
            :host([disabled]:hover)::slotted(svg) {
                background: ${d.Canvas};
                color: ${d.GrayText};
                fill: currentcolor;
                opacity: 1;
            }

            :host .expanded-toggle,
            :host .checkbox,
            :host .radio{
                border-color: ${d.ButtonText};
                background: ${d.HighlightText};
            }

            :host([checked="true"]) .checkbox,
            :host([checked="true"]) .radio {
                background: ${d.HighlightText};
                border-color: ${d.HighlightText};
            }

            :host(:hover) .expanded-toggle,
            :host(:hover) .checkbox,
            :host(:hover) .radio,
            :host(:${w}) .expanded-toggle,
            :host(:${w}) .checkbox,
            :host(:${w}) .radio,
            :host([checked="true"]:hover) .checkbox,
            :host([checked="true"]:hover) .radio,
            :host([checked="true"]:${w}) .checkbox,
            :host([checked="true"]:${w}) .radio {
                border-color: ${d.HighlightText};
            }

            :host([aria-checked="true"]) {
                background: ${d.Highlight};
                color: ${d.HighlightText};
            }

            :host([aria-checked="true"]) .checkbox-indicator,
            :host([aria-checked="true"]) ::slotted([slot="checkbox-indicator"]),
            :host([aria-checked="true"]) ::slotted([slot="radio-indicator"]) {
                fill: ${d.Highlight};
            }

            :host([aria-checked="true"]) .radio-indicator {
                background: ${d.Highlight};
            }

            ::slotted([slot="end"]:not(svg)) {
                color: ${d.ButtonText};
            }

            :host(:hover) ::slotted([slot="end"]:not(svg)),
            :host(:${w}) ::slotted([slot="end"]:not(svg)) {
                color: ${d.HighlightText};
            }
        `), new Oi(m`
                .expand-collapse-glyph {
                    transform: rotate(0deg);
                }
            `, m`
                .expand-collapse-glyph {
                    transform: rotate(180deg);
                }
            `)), Bb = it.compose({
  baseName: "menu-item",
  template: du,
  styles: ng,
  checkboxIndicator: `
        <svg
            part="checkbox-indicator"
            class="checkbox-indicator"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.143 12.6697L15.235 4.5L16.8 5.90363L8.23812 15.7667L3.80005 11.2556L5.27591 9.7555L8.143 12.6697Z"
            />
        </svg>
    `,
  expandCollapseGlyph: `
        <svg
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            class="expand-collapse-glyph"
            part="expand-collapse-glyph"
        >
            <path
                d="M5.00001 12.3263C5.00124 12.5147 5.05566 12.699 5.15699 12.8578C5.25831 13.0167 5.40243 13.1437 5.57273 13.2242C5.74304 13.3047 5.9326 13.3354 6.11959 13.3128C6.30659 13.2902 6.4834 13.2152 6.62967 13.0965L10.8988 8.83532C11.0739 8.69473 11.2153 8.51658 11.3124 8.31402C11.4096 8.11146 11.46 7.88966 11.46 7.66499C11.46 7.44033 11.4096 7.21853 11.3124 7.01597C11.2153 6.81341 11.0739 6.63526 10.8988 6.49467L6.62967 2.22347C6.48274 2.10422 6.30501 2.02912 6.11712 2.00691C5.92923 1.9847 5.73889 2.01628 5.56823 2.09799C5.39757 2.17969 5.25358 2.30817 5.153 2.46849C5.05241 2.62882 4.99936 2.8144 5.00001 3.00369V12.3263Z"
            />
        </svg>
    `,
  radioIndicator: `
        <span part="radio-indicator" class="radio-indicator"></span>
    `
}), rg = (i, e) => m`
        ${B("block")} :host {
            --elevation: 11;
            background: ${_};
            border: calc(${E} * 1px) solid transparent;
            ${Fi}
            margin: 0;
            border-radius: calc(${V} * 1px);
            padding: calc(${y} * 1px) 0;
            max-width: 368px;
            min-width: 64px;
        }

        :host([slot="submenu"]) {
            width: max-content;
            margin: 0 calc(${y} * 1px);
        }

        ::slotted(hr) {
            box-sizing: content-box;
            height: 0;
            margin: 0;
            border: none;
            border-top: calc(${E} * 1px) solid ${Si};
        }
    `.withBehaviors(M(m`
                :host {
                    background: ${d.Canvas};
                    border-color: ${d.CanvasText};
                }
            `));
class ag extends Zo {
  connectedCallback() {
    super.connectedCallback(), _.setValueFor(this, In);
  }
}
const jb = ag.compose({
  baseName: "menu",
  template: hu,
  styles: rg
}), lg = (i, e) => m`
    ${B("inline-block")} :host {
        font-family: ${J};
        outline: none;
        user-select: none;
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        color: ${F};
        background: ${Dt};
        border-radius: calc(${V} * 1px);
        border: calc(${E} * 1px) solid ${K};
        height: calc(${D} * 1px);
        align-items: baseline;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        border: 0;
        color: inherit;
        height: calc(100% - 4px);
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 0 calc(${y} * 2px + 1px);
        font-size: ${Y};
        line-height: ${Z};
    }

    .control:hover,
    .control:${w},
    .control:disabled,
    .control:active {
        outline: none;
    }

    .controls {
        opacity: 0;
    }

    .label {
        display: block;
        color: ${F};
        cursor: pointer;
        font-size: ${Y};
        line-height: ${Z};
        margin-bottom: 4px;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .start,
    .control,
    .controls,
    .end {
        align-self: center;
    }

    .start,
    .end {
        margin: auto;
        fill: currentcolor;
    }

    .step-up-glyph,
    .step-down-glyph {
        display: block;
        padding: 4px 10px;
        cursor: pointer;
    }

    .step-up-glyph:before,
    .step-down-glyph:before {
        content: '';
        display: block;
        border: solid transparent 6px;
    }

    .step-up-glyph:before {
        border-bottom-color: ${F};
    }

    .step-down-glyph:before {
        border-top-color: ${F};
    }

    ::slotted(svg) {
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        width: 16px;
        height: 16px;
    }

    .start {
        margin-inline-start: 11px;
    }

    .end {
        margin-inline-end: 11px;
    }

    :host(:hover:not([disabled])) .root {
        background: ${je};
        border-color: ${me};
    }

    :host(:active:not([disabled])) .root {
        background: ${je};
        border-color: ${fe};
    }

    :host(:focus-within:not([disabled])) .root {
        border-color: ${H};
        box-shadow: 0 0 0 calc(${j} * 1px) ${H} inset;
    }

    :host(:hover:not([disabled])) .controls,
    :host(:focus-within:not([disabled])) .controls {
        opacity: 1;
    }

    :host([appearance="filled"]) .root {
        background: ${ke};
    }

    :host([appearance="filled"]:hover:not([disabled])) .root {
        background: ${ui};
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: ${de};
    }

    :host([disabled]) {
        opacity: ${ge};
    }

    :host([disabled]) .control {
        border-color: ${rt};
    }
`.withBehaviors(M(m`
                .root,
                :host([appearance="filled"]) .root {
                    forced-color-adjust: none;
                    background: ${d.Field};
                    border-color: ${d.FieldText};
                }
                :host(:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover) .root {
                    background: ${d.Field};
                    border-color: ${d.Highlight};
                }
                .start,
                .end {
                    fill: currentcolor;
                }
                :host([disabled]) {
                    opacity: 1;
                }
                :host([disabled]) .root,
                :host([appearance="filled"]:hover[disabled]) .root {
                    border-color: ${d.GrayText};
                    background: ${d.Field};
                }
                :host(:focus-within:enabled) .root {
                    border-color: ${d.Highlight};
                    box-shadow: 0 0 0 1px ${d.Highlight} inset;
                }
                input::placeholder {
                    color: ${d.GrayText};
                }
            `));
class Pl extends Pe {
  constructor() {
    super(...arguments), this.appearance = "outline";
  }
}
a([
  h
], Pl.prototype, "appearance", void 0);
const _b = Pl.compose({
  baseName: "number-field",
  baseClass: Pe,
  styles: lg,
  template: uu,
  shadowOptions: {
    delegatesFocus: !0
  },
  stepDownGlyph: `
        <span class="step-down-glyph" part="step-down-glyph"></span>
    `,
  stepUpGlyph: `
        <span class="step-up-glyph" part="step-up-glyph"></span>
    `
}), cg = (i, e) => m`
        .region {
            z-index: 1000;
            overflow: hidden;
            display: flex;
            font-family: ${J};
            font-size: ${Y};
        }

        .loaded {
            opacity: 1;
            pointer-events: none;
        }

        .loading-display,
        .no-options-display {
            background: ${_};
            width: 100%;
            min-height: calc(${D} * 1px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-items: center;
            padding: calc(${y} * 1px);
        }

        .loading-progress {
            width: 42px;
            height: 42px;
        }

        .bottom {
            flex-direction: column;
        }

        .top {
            flex-direction: column-reverse;
        }
    `, dg = (i, e) => m`
        :host {
            background: ${_};
            --elevation: 11;
            /* TODO: a mechanism to manage z-index across components
            https://github.com/microsoft/fast/issues/3813 */
            z-index: 1000;
            display: flex;
            width: 100%;
            max-height: 100%;
            min-height: 58px;
            box-sizing: border-box;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
            pointer-events: auto;
            border-radius: calc(${V} * 1px);
            padding: calc(${y} * 1px) 0;
            border: calc(${E} * 1px) solid transparent;
            ${Fi}
        }

        .suggestions-available-alert {
            height: 0;
            opacity: 0;
            overflow: hidden;
        }
    `.withBehaviors(M(m`
                :host {
                    background: ${d.Canvas};
                    border-color: ${d.CanvasText};
                }
            `)), hg = (i, e) => m`
        :host {
            display: flex;
            align-items: center;
            justify-items: center;
            font-family: ${J};
            border-radius: calc(${V} * 1px);
            border: calc(${j} * 1px) solid transparent;
            box-sizing: border-box;
            background: ${Ke};
            color: ${F};
            cursor: pointer;
            fill: currentcolor;
            font-size: ${Y};
            min-height: calc(${D} * 1px);
            line-height: ${Z};
            margin: 0 calc(${y} * 1px);
            outline: none;
            overflow: hidden;
            padding: 0 calc(${y} * 2.25px);
            user-select: none;
            white-space: nowrap;
        }

        :host(:${w}[role="listitem"]) {
            border-color: ${H};
            background: ${En};
        }

        :host(:hover) {
            background: ${pi};
        }

        :host(:active) {
            background: ${fi};
        }

        :host([aria-selected="true"]) {
            background: ${K};
            color: ${Ze};
        }

        :host([aria-selected="true"]:hover) {
            background: ${me};
            color: ${ht};
        }

        :host([aria-selected="true"]:active) {
            background: ${fe};
            color: ${Je};
        }
    `.withBehaviors(M(m`
                :host {
                    border-color: transparent;
                    forced-color-adjust: none;
                    color: ${d.ButtonText};
                    fill: currentcolor;
                }

                :host(:not([aria-selected="true"]):hover),
                :host([aria-selected="true"]) {
                    background: ${d.Highlight};
                    color: ${d.HighlightText};
                }

                :host([disabled]),
                :host([disabled]:not([aria-selected="true"]):hover) {
                    background: ${d.Canvas};
                    color: ${d.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                }
            `)), ug = (i, e) => m`
        :host {
            display: flex;
            flex-direction: row;
            column-gap: calc(${y} * 1px);
            row-gap: calc(${y} * 1px);
            flex-wrap: wrap;
        }

        ::slotted([role="combobox"]) {
            min-width: 260px;
            width: auto;
            box-sizing: border-box;
            color: ${F};
            background: ${Dt};
            border-radius: calc(${V} * 1px);
            border: calc(${E} * 1px) solid ${K};
            height: calc(${D} * 1px);
            font-family: ${J};
            outline: none;
            user-select: none;
            font-size: ${Y};
            line-height: ${Z};
            padding: 0 calc(${y} * 2px + 1px);
        }

        ::slotted([role="combobox"]:active) { {
            background: ${je};
            border-color: ${fe};
        }

        ::slotted([role="combobox"]:focus-within) {
            border-color: ${H};
            box-shadow: 0 0 0 1px ${H} inset;
        }
    `.withBehaviors(M(m`
                ::slotted([role="combobox"]:active) {
                    background: ${d.Field};
                    border-color: ${d.Highlight};
                }
                ::slotted([role="combobox"]:focus-within) {
                    border-color: ${d.Highlight};
                    box-shadow: 0 0 0 1px ${d.Highlight} inset;
                }
                ::slotted(input:placeholder) {
                    color: ${d.GrayText};
                }
            `)), pg = (i, e) => m`
        :host {
            display: flex;
            align-items: center;
            justify-items: center;
            font-family: ${J};
            border-radius: calc(${V} * 1px);
            border: calc(${j} * 1px) solid transparent;
            box-sizing: border-box;
            background: ${Ke};
            color: ${F};
            cursor: pointer;
            fill: currentcolor;
            font-size: ${Y};
            height: calc(${D} * 1px);
            line-height: ${Z};
            outline: none;
            overflow: hidden;
            padding: 0 calc(${y} * 2.25px);
            user-select: none;
            white-space: nowrap;
        }

        :host(:hover) {
            background: ${pi};
        }

        :host(:active) {
            background: ${fi};
        }

        :host(:${w}) {
            background: ${En};
            border-color: ${H};
        }

        :host([aria-selected="true"]) {
            background: ${K};
            color: ${Je};
        }
    `.withBehaviors(M(m`
                :host {
                    border-color: transparent;
                    forced-color-adjust: none;
                    color: ${d.ButtonText};
                    fill: currentcolor;
                }

                :host(:not([aria-selected="true"]):hover),
                :host([aria-selected="true"]) {
                    background: ${d.Highlight};
                    color: ${d.HighlightText};
                }

                :host([disabled]),
                :host([disabled]:not([aria-selected="true"]):hover) {
                    background: ${d.Canvas};
                    color: ${d.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                }
            `)), Ub = X.compose({
  baseName: "picker",
  template: tu,
  styles: cg,
  shadowOptions: {}
});
class fg extends ii {
  connectedCallback() {
    _.setValueFor(this, In), super.connectedCallback();
  }
}
const qb = fg.compose({
  baseName: "picker-menu",
  baseClass: ii,
  template: nu,
  styles: dg
}), Gb = fo.compose({
  baseName: "picker-menu-option",
  template: ru,
  styles: hg
}), Wb = js.compose({
  baseName: "picker-list",
  template: au,
  styles: ug
}), Yb = go.compose({
  baseName: "picker-list-item",
  template: lu,
  styles: pg
}), gg = (i, e) => m`
        ${B("flex")} :host {
            align-items: center;
            outline: none;
            height: calc(${D} * 1px);
            width: calc(${D} * 1px);
            margin: calc(${D} * 1px) 0;
        }

        .progress {
            height: 100%;
            width: 100%;
        }

        .background {
            stroke: ${ke};
            fill: none;
            stroke-width: 2px;
        }

        .determinate {
            stroke: ${we};
            fill: none;
            stroke-width: 2px;
            stroke-linecap: round;
            transform-origin: 50% 50%;
            transform: rotate(-90deg);
            transition: all 0.2s ease-in-out;
        }

        .indeterminate-indicator-1 {
            stroke: ${we};
            fill: none;
            stroke-width: 2px;
            stroke-linecap: round;
            transform-origin: 50% 50%;
            transform: rotate(-90deg);
            transition: all 0.2s ease-in-out;
            animation: spin-infinite 2s linear infinite;
        }

        :host([paused]) .indeterminate-indicator-1 {
            animation-play-state: paused;
            stroke: ${ke};
        }

        :host([paused]) .determinate {
            stroke: ${no};
        }

        @keyframes spin-infinite {
            0% {
                stroke-dasharray: 0.01px 43.97px;
                transform: rotate(0deg);
            }
            50% {
                stroke-dasharray: 21.99px 21.99px;
                transform: rotate(450deg);
            }
            100% {
                stroke-dasharray: 0.01px 43.97px;
                transform: rotate(1080deg);
            }
        }
    `.withBehaviors(M(m`
                .indeterminate-indicator-1,
                .determinate {
                    stroke: ${d.FieldText};
                }
                .background {
                    stroke: ${d.Field};
                }
                :host([paused]) .indeterminate-indicator-1 {
                    stroke: ${d.Field};
                }
                :host([paused]) .determinate {
                    stroke: ${d.GrayText};
                }
            `)), Xb = oi.compose({
  baseName: "progress-ring",
  template: vu,
  styles: gg,
  indeterminateIndicator: `
        <svg class="progress" part="progress" viewBox="0 0 16 16">
            <circle
                class="background"
                part="background"
                cx="8px"
                cy="8px"
                r="7px"
            ></circle>
            <circle
                class="indeterminate-indicator-1"
                part="indeterminate-indicator-1"
                cx="8px"
                cy="8px"
                r="7px"
            ></circle>
        </svg>
    `
}), mg = (i, e) => m`
        ${B("flex")} :host {
            align-items: center;
            outline: none;
            height: calc(${y} * 1px);
            margin: calc(${y} * 1px) 0;
        }

        .progress {
            background-color: ${ke};
            border-radius: calc(${y} * 1px);
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            position: relative;
        }

        .determinate {
            background-color: ${we};
            border-radius: calc(${y} * 1px);
            height: 100%;
            transition: all 0.2s ease-in-out;
            display: flex;
        }

        .indeterminate {
            height: 100%;
            border-radius: calc(${y} * 1px);
            display: flex;
            width: 100%;
            position: relative;
            overflow: hidden;
        }

        .indeterminate-indicator-1 {
            position: absolute;
            opacity: 0;
            height: 100%;
            background-color: ${we};
            border-radius: calc(${y} * 1px);
            animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
            width: 40%;
            animation: indeterminate-1 2s infinite;
        }

        .indeterminate-indicator-2 {
            position: absolute;
            opacity: 0;
            height: 100%;
            background-color: ${we};
            border-radius: calc(${y} * 1px);
            animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
            width: 60%;
            animation: indeterminate-2 2s infinite;
        }

        :host([paused]) .indeterminate-indicator-1,
        :host([paused]) .indeterminate-indicator-2 {
            animation-play-state: paused;
            background-color: ${ke};
        }

        :host([paused]) .determinate {
            background-color: ${no};
        }

        @keyframes indeterminate-1 {
            0% {
                opacity: 1;
                transform: translateX(-100%);
            }
            70% {
                opacity: 1;
                transform: translateX(300%);
            }
            70.01% {
                opacity: 0;
            }
            100% {
                opacity: 0;
                transform: translateX(300%);
            }
        }

        @keyframes indeterminate-2 {
            0% {
                opacity: 0;
                transform: translateX(-150%);
            }
            29.99% {
                opacity: 0;
            }
            30% {
                opacity: 1;
                transform: translateX(-150%);
            }
            100% {
                transform: translateX(166.66%);
                opacity: 1;
            }
        }
    `.withBehaviors(M(m`
                .progress {
                    forced-color-adjust: none;
                    background-color: ${d.Field};
                    box-shadow: 0 0 0 1px inset ${d.FieldText};
                }
                .determinate,
                .indeterminate-indicator-1,
                .indeterminate-indicator-2 {
                    forced-color-adjust: none;
                    background-color: ${d.FieldText};
                }
                :host([paused]) .determinate,
                :host([paused]) .indeterminate-indicator-1,
                :host([paused]) .indeterminate-indicator-2 {
                    background-color: ${d.GrayText};
                }
            `)), Qb = oi.compose({
  baseName: "progress",
  template: yu,
  styles: mg,
  indeterminateIndicator1: `
        <span class="indeterminate-indicator-1" part="indeterminate-indicator-1"></span>
    `,
  indeterminateIndicator2: `
        <span class="indeterminate-indicator-1" part="indeterminate-indicator-1"></span>
    `
}), bg = (i, e) => m`
    ${B("flex")} :host {
        align-items: flex-start;
        margin: calc(${y} * 1px) 0;
        flex-direction: column;
    }
    .positioning-region {
        display: flex;
        flex-wrap: wrap;
    }
    :host([orientation="vertical"]) .positioning-region {
        flex-direction: column;
    }
    :host([orientation="horizontal"]) .positioning-region {
        flex-direction: row;
    }
`, Zb = Nt.compose({
  baseName: "radio-group",
  template: xu,
  styles: bg
}), vg = (i, e) => m`
        ${B("inline-flex")} :host {
            --input-size: calc((${D} / 2) + ${y});
            align-items: center;
            outline: none;
            margin: calc(${y} * 1px) 0;
            /* Chromium likes to select label text or the default slot when
                the radio is clicked. Maybe there is a better solution here? */
            user-select: none;
            position: relative;
            flex-direction: row;
            transition: all 0.2s ease-in-out;
        }

        .control {
            position: relative;
            width: calc((${D} / 2 + ${y}) * 1px);
            height: calc((${D} / 2 + ${y}) * 1px);
            box-sizing: border-box;
            border-radius: 999px;
            border: calc(${E} * 1px) solid ${rt};
            background: ${Dt};
            outline: none;
            cursor: pointer;
        }

        .label {
            font-family: ${J};
            color: ${F};
            padding-inline-start: calc(${y} * 2px + 2px);
            margin-inline-end: calc(${y} * 2px + 2px);
            cursor: pointer;
            font-size: ${Y};
            line-height: ${Z};
        }

        .label__hidden {
            display: none;
            visibility: hidden;
        }

        .control, .checked-indicator {
            flex-shrink: 0;
        }

        .checked-indicator {
            position: absolute;
            top: 5px;
            left: 5px;
            right: 5px;
            bottom: 5px;
            border-radius: 999px;
            display: inline-block;
            background: ${Ze};
            fill: ${Ze};
            opacity: 0;
            pointer-events: none;
        }

        :host(:not([disabled])) .control:hover{
            background: ${je};
            border-color: ${ro};
        }

        :host(:not([disabled])) .control:active {
            background: ${yo};
            border-color: ${Dn};
        }

        :host(:${w}) .control {
            box-shadow: 0 0 0 2px ${_}, 0 0 0 4px ${H};
        }

        :host([aria-checked="true"]) .control {
            background: ${K};
            border: calc(${E} * 1px) solid ${K};
        }

        :host([aria-checked="true"]:not([disabled])) .control:hover {
            background: ${me};
            border: calc(${E} * 1px) solid ${me};
        }

        :host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator {
            background: ${ht};
            fill: ${ht};
        }

        :host([aria-checked="true"]:not([disabled])) .control:active {
            background: ${fe};
            border: calc(${E} * 1px) solid ${fe};
        }

        :host([aria-checked="true"]:not([disabled])) .control:active .checked-indicator {
            background: ${Je};
            fill: ${Je};
        }

        :host([aria-checked="true"]:${w}:not([disabled])) .control {
            box-shadow: 0 0 0 2px ${_}, 0 0 0 4px ${H};
        }

        :host([disabled]) .label,
        :host([readonly]) .label,
        :host([readonly]) .control,
        :host([disabled]) .control {
            cursor: ${de};
        }

        :host([aria-checked="true"]) .checked-indicator {
            opacity: 1;
        }

        :host([disabled]) {
            opacity: ${ge};
        }
    `.withBehaviors(M(m`
            .control,
            :host([aria-checked="true"]:not([disabled])) .control {
                forced-color-adjust: none;
                border-color: ${d.FieldText};
                background: ${d.Field};
            }
            :host(:not([disabled])) .control:hover {
                border-color: ${d.Highlight};
                background: ${d.Field};
            }
            :host([aria-checked="true"]:not([disabled])) .control:hover,
            :host([aria-checked="true"]:not([disabled])) .control:active {
                border-color: ${d.Highlight};
                background: ${d.Highlight};
            }
            :host([aria-checked="true"]) .checked-indicator {
                background: ${d.Highlight};
                fill: ${d.Highlight};
            }
            :host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator,
            :host([aria-checked="true"]:not([disabled])) .control:active .checked-indicator {
                background: ${d.HighlightText};
                fill: ${d.HighlightText};
            }
            :host(:${w}) .control {
                border-color: ${d.Highlight};
                box-shadow: 0 0 0 2px ${d.Field}, 0 0 0 4px ${d.FieldText};
            }
            :host([aria-checked="true"]:${w}:not([disabled])) .control {
                border-color: ${d.Highlight};
                box-shadow: 0 0 0 2px ${d.Field}, 0 0 0 4px ${d.FieldText};
            }
            :host([disabled]) {
                forced-color-adjust: none;
                opacity: 1;
            }
            :host([disabled]) .label {
                color: ${d.GrayText};
            }
            :host([disabled]) .control,
            :host([aria-checked="true"][disabled]) .control:hover, .control:active {
                background: ${d.Field};
                border-color: ${d.GrayText};
            }
            :host([disabled]) .checked-indicator,
            :host([aria-checked="true"][disabled]) .control:hover .checked-indicator {
                fill: ${d.GrayText};
                background: ${d.GrayText};
            }
        `)), Jb = Ko.compose({
  baseName: "radio",
  template: $u,
  styles: vg,
  checkedIndicator: `
        <div part="checked-indicator" class="checked-indicator"></div>
    `
}), yg = Ht.create("clear-button-hover").withDefault((i) => {
  const e = Bt.getValueFor(i), t = hi.getValueFor(i);
  return e.evaluate(i, t.evaluate(i).hover).hover;
}), xg = Ht.create("clear-button-active").withDefault((i) => {
  const e = Bt.getValueFor(i), t = hi.getValueFor(i);
  return e.evaluate(i, t.evaluate(i).hover).active;
}), $g = (i, e) => m`
    ${B("inline-block")} :host {
        font-family: ${J};
        outline: none;
        user-select: none;
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        color: ${F};
        background: ${Dt};
        border-radius: calc(${V} * 1px);
        border: calc(${E} * 1px) solid ${K};
        height: calc(${D} * 1px);
        align-items: baseline;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        border: 0;
        color: inherit;
        height: calc(100% - 4px);
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 0 calc(${y} * 2px + 1px);
        font-size: ${Y};
        line-height: ${Z};
    }

    .control::-webkit-search-cancel-button {
        -webkit-appearance: none;
    }

    .control:hover,
    .control:${w},
    .control:disabled,
    .control:active {
        outline: none;
    }

    .clear-button {
        height: calc(100% - 2px);
        opacity: 0;
        margin: 1px;
        background: transparent;
        color: ${F};
        fill: currentcolor;
        border: none;
        border-radius: calc(${V} * 1px);
        min-width: calc(${D} * 1px);
        font-size: ${Y};
        line-height: ${Z};
        outline: none;
        font-family: ${J};
        padding: 0 calc((10 + (${y} * 2 * ${dt})) * 1px);
    }

    .clear-button:hover {
        background: ${pi};
    }

    .clear-button:active {
        background: ${fi};
    }

    :host([appearance="filled"]) .clear-button:hover {
        background: ${yg};
    }

    :host([appearance="filled"]) .clear-button:active {
        background: ${xg};
    }

    .input-wrapper {
        display: flex;
        position: relative;
        width: 100%;
        height: 100%;
    }

    .label {
        display: block;
        color: ${F};
        cursor: pointer;
        font-size: ${Y};
        line-height: ${Z};
        margin-bottom: 4px;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .input-wrapper,
    .start,
    .end {
        align-self: center;
    }

    .start,
    .end {
        display: flex;
        margin: 1px;
        fill: currentcolor;
    }

    ::slotted([slot="end"]) {
        height: 100%
    }

    .end {
        margin-inline-end: 1px;
        height: calc(100% - 2px);
    }

    ::slotted(svg) {
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        width: 16px;
        height: 16px;
        margin-inline-end: 11px;
        margin-inline-start: 11px;
        margin-top: auto;
        margin-bottom: auto;
    }

    :host(:hover:not([disabled])) .root {
        background: ${je};
        border-color: ${me};
    }

    :host(:active:not([disabled])) .root {
        background: ${je};
        border-color: ${fe};
    }

    :host(:focus-within:not([disabled])) .root {
        border-color: ${H};
        box-shadow: 0 0 0 1px ${H} inset;
    }

    .clear-button__hidden {
        opacity: 0;
    }

    :host(:hover:not([disabled], [readOnly])) .clear-button,
    :host(:active:not([disabled], [readOnly])) .clear-button,
    :host(:focus-within:not([disabled], [readOnly])) .clear-button {
        opacity: 1;
    }

    :host(:hover:not([disabled], [readOnly])) .clear-button__hidden,
    :host(:active:not([disabled], [readOnly])) .clear-button__hidden,
    :host(:focus-within:not([disabled], [readOnly])) .clear-button__hidden {
        opacity: 0;
    }

    :host([appearance="filled"]) .root {
        background: ${_};
    }

    :host([appearance="filled"]:hover:not([disabled])) .root {
        background: ${ui};
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: ${de};
    }

    :host([disabled]) {
        opacity: ${ge};
    }

    :host([disabled]) .control {
        border-color: ${rt};
    }
`.withBehaviors(M(m`
                .root,
                :host([appearance="filled"]) .root {
                    forced-color-adjust: none;
                    background: ${d.Field};
                    border-color: ${d.FieldText};
                }
                :host(:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover) .root {
                    background: ${d.Field};
                    border-color: ${d.Highlight};
                }
                .start,
                .end {
                    fill: currentcolor;
                }
                :host([disabled]) {
                    opacity: 1;
                }
                :host([disabled]) .root,
                :host([appearance="filled"]:hover[disabled]) .root {
                    border-color: ${d.GrayText};
                    background: ${d.Field};
                }
                :host(:focus-within:enabled) .root {
                    border-color: ${d.Highlight};
                    box-shadow: 0 0 0 1px ${d.Highlight} inset;
                }
                input::placeholder {
                    color: ${d.GrayText};
                }
            `));
class Ml extends Ge {
  constructor() {
    super(...arguments), this.appearance = "outline";
  }
}
a([
  h
], Ml.prototype, "appearance", void 0);
const Kb = Ml.compose({
  baseName: "search",
  baseClass: Ge,
  template: Tu,
  styles: $g,
  shadowOptions: {
    delegatesFocus: !0
  }
});
class Vl extends gt {
  constructor() {
    super(...arguments), this.listboxScrollWidth = "";
  }
  connectedCallback() {
    super.connectedCallback(), this.listbox && _.setValueFor(this.listbox, In);
  }
  get listboxMaxHeight() {
    return Math.floor(this.maxHeight / Cl.getValueFor(this)).toString();
  }
  listboxScrollWidthChanged() {
    this.updateComputedStylesheet();
  }
  get selectSize() {
    var e;
    return `${(e = this.size) !== null && e !== void 0 ? e : this.multiple ? 4 : 0}`;
  }
  multipleChanged(e, t) {
    super.multipleChanged(e, t), this.updateComputedStylesheet();
  }
  maxHeightChanged(e, t) {
    this.collapsible && this.updateComputedStylesheet();
  }
  setPositioning() {
    super.setPositioning(), this.updateComputedStylesheet();
  }
  sizeChanged(e, t) {
    if (super.sizeChanged(e, t), this.updateComputedStylesheet(), this.collapsible) {
      requestAnimationFrame(() => {
        this.listbox.style.setProperty("display", "flex"), this.listbox.style.setProperty("overflow", "visible"), this.listbox.style.setProperty("visibility", "hidden"), this.listbox.style.setProperty("width", "auto"), this.listbox.hidden = !1, this.listboxScrollWidth = `${this.listbox.scrollWidth}`, this.listbox.hidden = !0, this.listbox.style.removeProperty("display"), this.listbox.style.removeProperty("overflow"), this.listbox.style.removeProperty("visibility"), this.listbox.style.removeProperty("width");
      });
      return;
    }
    this.listboxScrollWidth = "";
  }
  updateComputedStylesheet() {
    this.computedStylesheet && this.$fastController.removeStyles(this.computedStylesheet), this.computedStylesheet = m`
            :host {
                --listbox-max-height: ${this.listboxMaxHeight};
                --listbox-scroll-width: ${this.listboxScrollWidth};
                --size: ${this.selectSize};
            }
        `, this.$fastController.addStyles(this.computedStylesheet);
  }
}
a([
  g
], Vl.prototype, "listboxScrollWidth", void 0);
const ev = Vl.compose({
  baseName: "select",
  baseClass: gt,
  template: Ru,
  styles: Ll,
  indicator: `
        <svg
            class="select-indicator"
            part="select-indicator"
            viewBox="0 0 12 7"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M11.85.65c.2.2.2.5 0 .7L6.4 6.84a.55.55 0 01-.78 0L.14 1.35a.5.5 0 11.71-.7L6 5.8 11.15.65c.2-.2.5-.2.7 0z"
            />
        </svg>
    `
}), wg = (i, e) => m`
        ${B("block")} :host {
            --skeleton-fill-default: #e1dfdd;
            overflow: hidden;
            width: 100%;
            position: relative;
            background-color: var(--skeleton-fill, var(--skeleton-fill-default));
            --skeleton-animation-gradient-default: linear-gradient(
                270deg,
                var(--skeleton-fill, var(--skeleton-fill-default)) 0%,
                #f3f2f1 51.13%,
                var(--skeleton-fill, var(--skeleton-fill-default)) 100%
            );
            --skeleton-animation-timing-default: ease-in-out;
        }

        :host([shape="rect"]) {
            border-radius: calc(${V} * 1px);
        }

        :host([shape="circle"]) {
            border-radius: 100%;
            overflow: hidden;
        }

        object {
            position: absolute;
            width: 100%;
            height: auto;
            z-index: 2;
        }

        object img {
            width: 100%;
            height: auto;
        }

        ${B("block")} span.shimmer {
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: var(
                --skeleton-animation-gradient,
                var(--skeleton-animation-gradient-default)
            );
            background-size: 0px 0px / 90% 100%;
            background-repeat: no-repeat;
            background-color: var(--skeleton-animation-fill, ${ke});
            animation: shimmer 2s infinite;
            animation-timing-function: var(
                --skeleton-animation-timing,
                var(--skeleton-timing-default)
            );
            animation-direction: normal;
            z-index: 1;
        }

        ::slotted(svg) {
            z-index: 2;
        }

        ::slotted(.pattern) {
            width: 100%;
            height: 100%;
        }

        @keyframes shimmer {
            0% {
                transform: translateX(-100%);
            }
            100% {
                transform: translateX(100%);
            }
        }
    `.withBehaviors(M(m`
                :host {
                    forced-color-adjust: none;
                    background-color: ${d.ButtonFace};
                    box-shadow: 0 0 0 1px ${d.ButtonText};
                }

                ${B("block")} span.shimmer {
                    display: none;
                }
            `)), tv = mo.compose({
  baseName: "skeleton",
  template: Du,
  styles: wg
}), Fr = m`
    :host {
        align-self: start;
        grid-row: 2;
        margin-top: -2px;
        height: calc((${D} / 2 + ${y}) * 1px);
        width: auto;
    }
    .container {
        grid-template-rows: auto auto;
        grid-template-columns: 0;
    }
    .label {
        margin: 2px 0;
    }
`, Er = m`
    :host {
        justify-self: start;
        grid-column: 2;
        margin-left: 2px;
        height: auto;
        width: calc((${D} / 2 + ${y}) * 1px);
    }
    .container {
        grid-template-columns: auto auto;
        grid-template-rows: 0;
        min-width: calc(var(--thumb-size) * 1px);
        height: calc(var(--thumb-size) * 1px);
    }
    .mark {
        transform: rotate(90deg);
        align-self: center;
    }
    .label {
        margin-left: calc((${y} / 2) * 3px);
        align-self: center;
    }
`, kg = (i, e) => m`
        ${B("block")} :host {
            font-family: ${J};
            color: ${F};
            fill: currentcolor;
        }
        .root {
            position: absolute;
            display: grid;
        }
        .container {
            display: grid;
            justify-self: center;
        }
        .label {
            justify-self: center;
            align-self: center;
            white-space: nowrap;
            max-width: 30px;
        }
        .mark {
            width: calc((${y} / 4) * 1px);
            height: calc(${D} * 0.25 * 1px);
            background: ${rt};
            justify-self: center;
        }
        :host(.disabled) {
            opacity: ${ge};
        }
    `.withBehaviors(M(m`
                .mark {
                    forced-color-adjust: none;
                    background: ${d.FieldText};
                }
                :host(.disabled) {
                    forced-color-adjust: none;
                    opacity: 1;
                }
                :host(.disabled) .label {
                    color: ${d.GrayText};
                }
                :host(.disabled) .mark {
                    background: ${d.GrayText};
                }
            `));
class Cg extends mt {
  sliderOrientationChanged() {
    this.sliderOrientation === ce.horizontal ? (this.$fastController.addStyles(Fr), this.$fastController.removeStyles(Er)) : (this.$fastController.addStyles(Er), this.$fastController.removeStyles(Fr));
  }
}
const iv = Cg.compose({
  baseName: "slider-label",
  baseClass: mt,
  template: Ou,
  styles: kg
}), Tg = m`
    .track-start {
        left: 0;
    }
`, Ig = m`
    .track-start {
        right: 0;
    }
`, Sg = (i, e) => m`
        :host([hidden]) {
            display: none;
        }

        ${B("inline-grid")} :host {
            --thumb-size: calc(${D} * 0.5 - ${y});
            --thumb-translate: calc(var(--thumb-size) * -0.5 + var(--track-width) / 2);
            --track-overhang: calc((${y} / 2) * -1);
            --track-width: ${y};
            --fast-slider-height: calc(var(--thumb-size) * 10);
            align-items: center;
            width: 100%;
            margin: calc(${y} * 1px) 0;
            user-select: none;
            box-sizing: border-box;
            border-radius: calc(${V} * 1px);
            outline: none;
            cursor: pointer;
        }
        :host([orientation="horizontal"]) .positioning-region {
            position: relative;
            margin: 0 8px;
            display: grid;
            grid-template-rows: calc(var(--thumb-size) * 1px) 1fr;
        }
        :host([orientation="vertical"]) .positioning-region {
            position: relative;
            margin: 0 8px;
            display: grid;
            height: 100%;
            grid-template-columns: calc(var(--thumb-size) * 1px) 1fr;
        }

        :host(:${w}) .thumb-cursor {
            box-shadow: 0 0 0 2px ${_}, 0 0 0 4px ${H};
        }

        .thumb-container {
            position: absolute;
            height: calc(var(--thumb-size) * 1px);
            width: calc(var(--thumb-size) * 1px);
            transition: all 0.2s ease;
            color: ${F};
            fill: currentcolor;
        }
        .thumb-cursor {
            border: none;
            width: calc(var(--thumb-size) * 1px);
            height: calc(var(--thumb-size) * 1px);
            background: ${F};
            border-radius: calc(${V} * 1px);
        }
        .thumb-cursor:hover {
            background: ${F};
            border-color: ${ro};
        }
        .thumb-cursor:active {
            background: ${F};
        }
        .track-start {
            background: ${we};
            position: absolute;
            height: 100%;
            left: 0;
            border-radius: calc(${V} * 1px);
        }
        :host([orientation="horizontal"]) .thumb-container {
            transform: translateX(calc(var(--thumb-size) * 0.5px)) translateY(calc(var(--thumb-translate) * 1px));
        }
        :host([orientation="vertical"]) .thumb-container {
            transform: translateX(calc(var(--thumb-translate) * 1px)) translateY(calc(var(--thumb-size) * 0.5px));
        }
        :host([orientation="horizontal"]) {
            min-width: calc(var(--thumb-size) * 1px);
        }
        :host([orientation="horizontal"]) .track {
            right: calc(var(--track-overhang) * 1px);
            left: calc(var(--track-overhang) * 1px);
            align-self: start;
            height: calc(var(--track-width) * 1px);
        }
        :host([orientation="vertical"]) .track {
            top: calc(var(--track-overhang) * 1px);
            bottom: calc(var(--track-overhang) * 1px);
            width: calc(var(--track-width) * 1px);
            height: 100%;
        }
        .track {
            background: ${rt};
            position: absolute;
            border-radius: calc(${V} * 1px);
        }
        :host([orientation="vertical"]) {
            height: calc(var(--fast-slider-height) * 1px);
            min-height: calc(var(--thumb-size) * 1px);
            min-width: calc(${y} * 20px);
        }
        :host([orientation="vertical"]) .track-start {
            height: auto;
            width: 100%;
            top: 0;
        }
        :host([disabled]), :host([readonly]) {
            cursor: ${de};
        }
        :host([disabled]) {
            opacity: ${ge};
        }
    `.withBehaviors(new Oi(Tg, Ig), M(m`
                .thumb-cursor {
                    forced-color-adjust: none;
                    border-color: ${d.FieldText};
                    background: ${d.FieldText};
                }
                .thumb-cursor:hover,
                .thumb-cursor:active {
                    background: ${d.Highlight};
                }
                .track {
                    forced-color-adjust: none;
                    background: ${d.FieldText};
                }
                :host(:${w}) .thumb-cursor {
                    border-color: ${d.Highlight};
                }
                :host([disabled]) {
                    opacity: 1;
                }
                :host([disabled]) .track,
                :host([disabled]) .thumb-cursor {
                    forced-color-adjust: none;
                    background: ${d.GrayText};
                }

                :host(:${w}) .thumb-cursor {
                    background: ${d.Highlight};
                    border-color: ${d.Highlight};
                    box-shadow: 0 0 0 2px ${d.Field}, 0 0 0 4px ${d.FieldText};
                }
            `)), ov = Fe.compose({
  baseName: "slider",
  template: Lu,
  styles: Sg,
  thumb: `
        <div class="thumb-cursor"></div>
    `
}), Fg = (i, e) => m`
        :host([hidden]) {
            display: none;
        }

        ${B("inline-flex")} :host {
            align-items: center;
            outline: none;
            font-family: ${J};
            margin: calc(${y} * 1px) 0;
            ${""} user-select: none;
        }

        :host([disabled]) {
            opacity: ${ge};
        }

        :host([disabled]) .label,
        :host([readonly]) .label,
        :host([readonly]) .switch,
        :host([disabled]) .switch {
            cursor: ${de};
        }

        .switch {
            position: relative;
            outline: none;
            box-sizing: border-box;
            width: calc(${D} * 1px);
            height: calc((${D} / 2 + ${y}) * 1px);
            background: ${Dt};
            border-radius: calc(${V} * 1px);
            border: calc(${E} * 1px) solid ${rt};
        }

        .switch:hover {
            background: ${je};
            border-color: ${ro};
            cursor: pointer;
        }

        host([disabled]) .switch:hover,
        host([readonly]) .switch:hover {
            background: ${je};
            border-color: ${ro};
            cursor: ${de};
        }

        :host(:not([disabled])) .switch:active {
            background: ${yo};
            border-color: ${Dn};
        }

        :host(:${w}) .switch {
            box-shadow: 0 0 0 2px ${_}, 0 0 0 4px ${H};
        }

        .checked-indicator {
            position: absolute;
            top: 5px;
            bottom: 5px;
            background: ${F};
            border-radius: calc(${V} * 1px);
            transition: all 0.2s ease-in-out;
        }

        .status-message {
            color: ${F};
            cursor: pointer;
            font-size: ${Y};
            line-height: ${Z};
        }

        :host([disabled]) .status-message,
        :host([readonly]) .status-message {
            cursor: ${de};
        }

        .label {
            color: ${F};
            margin-inline-end: calc(${y} * 2px + 2px);
            font-size: ${Y};
            line-height: ${Z};
            cursor: pointer;
        }

        .label__hidden {
            display: none;
            visibility: hidden;
        }

        ::slotted([slot="checked-message"]),
        ::slotted([slot="unchecked-message"]) {
            margin-inline-start: calc(${y} * 2px + 2px);
        }

        :host([aria-checked="true"]) .checked-indicator {
            background: ${Ze};
        }

        :host([aria-checked="true"]) .switch {
            background: ${K};
            border-color: ${K};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:hover {
            background: ${me};
            border-color: ${me};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:hover .checked-indicator {
            background: ${ht};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:active {
            background: ${fe};
            border-color: ${fe};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:active .checked-indicator {
            background: ${Je};
        }

        :host([aria-checked="true"]:${w}:not([disabled])) .switch {
            box-shadow: 0 0 0 2px ${_}, 0 0 0 4px ${H};
        }

        .unchecked-message {
            display: block;
        }

        .checked-message {
            display: none;
        }

        :host([aria-checked="true"]) .unchecked-message {
            display: none;
        }

        :host([aria-checked="true"]) .checked-message {
            display: block;
        }
    `.withBehaviors(M(m`
            .checked-indicator,
            :host(:not([disabled])) .switch:active .checked-indicator {
                forced-color-adjust: none;
                background: ${d.FieldText};
            }
            .switch {
                forced-color-adjust: none;
                background: ${d.Field};
                border-color: ${d.FieldText};
            }
            :host(:not([disabled])) .switch:hover {
                background: ${d.HighlightText};
                border-color: ${d.Highlight};
            }
            :host([aria-checked="true"]) .switch {
                background: ${d.Highlight};
                border-color: ${d.Highlight};
            }
            :host([aria-checked="true"]:not([disabled])) .switch:hover,
            :host(:not([disabled])) .switch:active {
                background: ${d.HighlightText};
                border-color: ${d.Highlight};
            }
            :host([aria-checked="true"]) .checked-indicator {
                background: ${d.HighlightText};
            }
            :host([aria-checked="true"]:not([disabled])) .switch:hover .checked-indicator {
                background: ${d.Highlight};
            }
            :host([disabled]) {
                opacity: 1;
            }
            :host(:${w}) .switch {
                border-color: ${d.Highlight};
                box-shadow: 0 0 0 2px ${d.Field}, 0 0 0 4px ${d.FieldText};
            }
            :host([aria-checked="true"]:${w}:not([disabled])) .switch {
                box-shadow: 0 0 0 2px ${d.Field}, 0 0 0 4px ${d.FieldText};
            }
            :host([disabled]) .checked-indicator {
                background: ${d.GrayText};
            }
            :host([disabled]) .switch {
                background: ${d.Field};
                border-color: ${d.GrayText};
            }
        `), new Oi(m`
                .checked-indicator {
                    left: 5px;
                    right: calc(((${D} / 2) + 1) * 1px);
                }

                :host([aria-checked="true"]) .checked-indicator {
                    left: calc(((${D} / 2) + 1) * 1px);
                    right: 5px;
                }
            `, m`
                .checked-indicator {
                    right: 5px;
                    left: calc(((${D} / 2) + 1) * 1px);
                }

                :host([aria-checked="true"]) .checked-indicator {
                    right: calc(((${D} / 2) + 1) * 1px);
                    left: 5px;
                }
            `)), sv = $n.compose({
  baseName: "switch",
  template: Vu,
  styles: Fg,
  switch: `
        <span class="checked-indicator" part="checked-indicator"></span>
    `
}), Eg = (i, e) => m`
        ${B("grid")} :host {
            box-sizing: border-box;
            font-family: ${J};
            font-size: ${Y};
            line-height: ${Z};
            color: ${F};
            grid-template-columns: auto 1fr auto;
            grid-template-rows: auto 1fr;
        }

        .tablist {
            display: grid;
            grid-template-rows: auto auto;
            grid-template-columns: auto;
            position: relative;
            width: max-content;
            align-self: end;
            padding: calc(${y} * 4px) calc(${y} * 4px) 0;
            box-sizing: border-box;
        }

        .start,
        .end {
            align-self: center;
        }

        .activeIndicator {
            grid-row: 2;
            grid-column: 1;
            width: 100%;
            height: 5px;
            justify-self: center;
            background: ${K};
            margin-top: 10px;
            border-radius: calc(${V} * 1px)
                calc(${V} * 1px) 0 0;
        }

        .activeIndicatorTransition {
            transition: transform 0.2s ease-in-out;
        }

        .tabpanel {
            grid-row: 2;
            grid-column-start: 1;
            grid-column-end: 4;
            position: relative;
        }

        :host([orientation="vertical"]) {
            grid-template-rows: auto 1fr auto;
            grid-template-columns: auto 1fr;
        }

        :host([orientation="vertical"]) .tablist {
            grid-row-start: 2;
            grid-row-end: 2;
            display: grid;
            grid-template-rows: auto;
            grid-template-columns: auto 1fr;
            position: relative;
            width: max-content;
            justify-self: end;
            align-self: flex-start;
            width: 100%;
            padding: 0 calc(${y} * 4px)
                calc((${D} - ${y}) * 1px) 0;
        }

        :host([orientation="vertical"]) .tabpanel {
            grid-column: 2;
            grid-row-start: 1;
            grid-row-end: 4;
        }

        :host([orientation="vertical"]) .end {
            grid-row: 3;
        }

        :host([orientation="vertical"]) .activeIndicator {
            grid-column: 1;
            grid-row: 1;
            width: 5px;
            height: 100%;
            margin-inline-end: 10px;
            align-self: center;
            background: ${K};
            margin-top: 0;
            border-radius: 0 calc(${V} * 1px)
                calc(${V} * 1px) 0;
        }

        :host([orientation="vertical"]) .activeIndicatorTransition {
            transition: transform 0.2s linear;
        }
    `.withBehaviors(M(m`
                .activeIndicator,
                :host([orientation="vertical"]) .activeIndicator {
                    forced-color-adjust: none;
                    background: ${d.Highlight};
                }
            `)), Rg = (i, e) => m`
    ${B("inline-flex")} :host {
        box-sizing: border-box;
        font-family: ${J};
        font-size: ${Y};
        line-height: ${Z};
        height: calc(${D} * 1px);
        padding: calc(${y} * 5px) calc(${y} * 4px);
        color: ${no};
        fill: currentcolor;
        border-radius: calc(${V} * 1px);
        border: calc(${E} * 1px) solid transparent;
        align-items: center;
        justify-content: center;
        grid-row: 1;
        cursor: pointer;
    }

    :host(:hover) {
        color: ${F};
        fill: currentcolor;
    }

    :host(:active) {
        color: ${F};
        fill: currentcolor;
    }

    :host([disabled]) {
        cursor: ${de};
        opacity: ${ge};
    }

    :host([disabled]:hover) {
        color: ${no};
        background: ${Ke};
    }

    :host([aria-selected="true"]) {
        background: ${ke};
        color: ${we};
        fill: currentcolor;
    }

    :host([aria-selected="true"]:hover) {
        background: ${ui};
        color: ${Jt};
        fill: currentcolor;
    }

    :host([aria-selected="true"]:active) {
        background: ${Fn};
        color: ${lt};
        fill: currentcolor;
    }

    :host(:${w}) {
        outline: none;
        border: calc(${E} * 1px) solid ${H};
        box-shadow: 0 0 0 calc((${j} - ${E}) * 1px)
            ${H};
    }

    :host(:focus) {
        outline: none;
    }

    :host(.vertical) {
        justify-content: end;
        grid-column: 2;
    }

    :host(.vertical[aria-selected="true"]) {
        z-index: 2;
    }

    :host(.vertical:hover) {
        color: ${F};
    }

    :host(.vertical:active) {
        color: ${F};
    }

    :host(.vertical:hover[aria-selected="true"]) {
    }
`.withBehaviors(M(m`
            :host {
                forced-color-adjust: none;
                border-color: transparent;
                color: ${d.ButtonText};
                fill: currentcolor;
            }
            :host(:hover),
            :host(.vertical:hover),
            :host([aria-selected="true"]:hover) {
                background: ${d.Highlight};
                color: ${d.HighlightText};
                fill: currentcolor;
            }
            :host([aria-selected="true"]) {
                background: ${d.HighlightText};
                color: ${d.Highlight};
                fill: currentcolor;
            }
            :host(:${w}) {
                border-color: ${d.ButtonText};
                box-shadow: none;
            }
            :host([disabled]),
            :host([disabled]:hover) {
                opacity: 1;
                color: ${d.GrayText};
                background: ${d.ButtonFace};
            }
        `)), Hl = Ua.compose({
  baseName: "tab",
  template: ju,
  styles: Rg
}), Dg = (i, e) => m`
    ${B("block")} :host {
        box-sizing: border-box;
        font-size: ${Y};
        line-height: ${Z};
        padding: 0 calc((6 + (${y} * 2 * ${dt})) * 1px);
    }
`, zl = Bu.compose({
  baseName: "tab-panel",
  template: Nu,
  styles: Dg
}), Nl = Et.compose({
  baseName: "tabs",
  template: _u,
  styles: Eg
}), Og = (i, e) => m`
    ${B("inline-block")} :host {
        font-family: ${J};
        outline: none;
        user-select: none;
    }

    .control {
        box-sizing: border-box;
        position: relative;
        color: ${F};
        background: ${Dt};
        border-radius: calc(${V} * 1px);
        border: calc(${E} * 1px) solid ${K};
        height: calc(${D} * 2px);
        font: inherit;
        font-size: ${Y};
        line-height: ${Z};
        padding: calc(${y} * 2px + 1px);
        width: 100%;
        resize: none;
    }

    .control:hover:enabled {
        background: ${je};
        border-color: ${me};
    }

    .control:active:enabled {
        background: ${yo};
        border-color: ${fe};
    }

    .control:hover,
    .control:${w},
    .control:disabled,
    .control:active {
        outline: none;
    }

    :host(:focus-within) .control {
        border-color: ${H};
        box-shadow: 0 0 0 1px ${H} inset;
    }

    :host([appearance="filled"]) .control {
        background: ${ke};
    }

    :host([appearance="filled"]:hover:not([disabled])) .control {
        background: ${ui};
    }

    :host([resize="both"]) .control {
        resize: both;
    }

    :host([resize="horizontal"]) .control {
        resize: horizontal;
    }

    :host([resize="vertical"]) .control {
        resize: vertical;
    }

    .label {
        display: block;
        color: ${F};
        cursor: pointer;
        font-size: ${Y};
        line-height: ${Z};
        margin-bottom: 4px;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: ${de};
    }
    :host([disabled]) {
        opacity: ${ge};
    }
    :host([disabled]) .control {
        border-color: ${rt};
    }

    :host([cols]){
        width: initial;
    }

    :host([rows]) .control {
        height: initial;
    }
 `.withBehaviors(M(m`
                :host([disabled]) {
                    opacity: 1;
                }
            `));
class Bl extends Ee {
  constructor() {
    super(...arguments), this.appearance = "outline";
  }
}
a([
  h
], Bl.prototype, "appearance", void 0);
const nv = Bl.compose({
  baseName: "text-area",
  baseClass: Ee,
  template: Gu,
  styles: Og,
  shadowOptions: {
    delegatesFocus: !0
  }
}), Lg = (i, e) => m`
    ${B("inline-block")} :host {
        font-family: ${J};
        outline: none;
        user-select: none;
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        color: ${F};
        background: ${Dt};
        border-radius: calc(${V} * 1px);
        border: calc(${E} * 1px) solid ${K};
        height: calc(${D} * 1px);
        align-items: baseline;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        border: 0;
        color: inherit;
        height: calc(100% - 4px);
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 0 calc(${y} * 2px + 1px);
        font-size: ${Y};
        line-height: ${Z};
    }

    .control:hover,
    .control:${w},
    .control:disabled,
    .control:active {
        outline: none;
    }

    .label {
        display: block;
        color: ${F};
        cursor: pointer;
        font-size: ${Y};
        line-height: ${Z};
        margin-bottom: 4px;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .start,
    .control,
    .end {
        align-self: center;
    }

    .start,
    .end {
        display: flex;
        margin: auto;
        fill: currentcolor;
    }

    ::slotted(svg) {
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        width: 16px;
        height: 16px;
    }

    .start {
        margin-inline-start: 11px;
    }

    .end {
        margin-inline-end: 11px;
    }

    :host(:hover:not([disabled])) .root {
        background: ${je};
        border-color: ${me};
    }

    :host(:active:not([disabled])) .root {
        background: ${je};
        border-color: ${fe};
    }

    :host(:focus-within:not([disabled])) .root {
        border-color: ${H};
        box-shadow: 0 0 0 calc(${j} * 1px) ${H} inset;
    }

    :host([appearance="filled"]) .root {
        background: ${ke};
    }

    :host([appearance="filled"]:hover:not([disabled])) .root {
        background: ${ui};
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: ${de};
    }

    :host([disabled]) {
        opacity: ${ge};
    }

    :host([disabled]) .control {
        border-color: ${rt};
    }
`.withBehaviors(M(m`
                .root,
                :host([appearance="filled"]) .root {
                    forced-color-adjust: none;
                    background: ${d.Field};
                    border-color: ${d.FieldText};
                }
                :host(:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover) .root {
                    background: ${d.Field};
                    border-color: ${d.Highlight};
                }
                .start,
                .end {
                    fill: currentcolor;
                }
                :host([disabled]) {
                    opacity: 1;
                }
                :host([disabled]) .root,
                :host([appearance="filled"]:hover[disabled]) .root {
                    border-color: ${d.GrayText};
                    background: ${d.Field};
                }
                :host(:focus-within:enabled) .root {
                    border-color: ${d.Highlight};
                    box-shadow: 0 0 0 1px ${d.Highlight} inset;
                }
                input::placeholder {
                    color: ${d.GrayText};
                }
            `));
class jl extends ze {
  constructor() {
    super(...arguments), this.appearance = "outline";
  }
}
a([
  h
], jl.prototype, "appearance", void 0);
const rv = jl.compose({
  baseName: "text-field",
  baseClass: ze,
  template: Wu,
  styles: Lg,
  shadowOptions: {
    delegatesFocus: !0
  }
}), Ag = (i, e) => m`
        ${B("inline-flex")} :host {
            --toolbar-item-gap: calc(
                (var(--design-unit) + calc(var(--density) + 2)) * 1px
            );
            background-color: ${_};
            border-radius: calc(${V} * 1px);
            fill: currentcolor;
            padding: var(--toolbar-item-gap);
        }

        :host(${w}) {
            outline: calc(${E} * 1px) solid ${yf};
        }

        .positioning-region {
            align-items: flex-start;
            display: inline-flex;
            flex-flow: row wrap;
            justify-content: flex-start;
        }

        :host([orientation="vertical"]) .positioning-region {
            flex-direction: column;
        }

        ::slotted(:not([slot])) {
            flex: 0 0 auto;
            margin: 0 var(--toolbar-item-gap);
        }

        :host([orientation="vertical"]) ::slotted(:not([slot])) {
            margin: var(--toolbar-item-gap) 0;
        }

        .start,
        .end {
            display: flex;
            margin: auto;
            margin-inline: 0;
        }

        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: 16px;
            height: 16px;
        }
    `.withBehaviors(M(m`
            :host(:${w}) {
                box-shadow: 0 0 0 calc(${j} * 1px) ${d.Highlight};
                color: ${d.ButtonText};
                forced-color-adjust: none;
            }
        `));
class Pg extends ct {
  connectedCallback() {
    super.connectedCallback();
    const e = eo(this);
    e && _.setValueFor(this, (t) => Rn.getValueFor(t).evaluate(t, _.getValueFor(e)));
  }
}
const av = Pg.compose({
  baseName: "toolbar",
  baseClass: ct,
  template: Yu,
  styles: Ag,
  shadowOptions: {
    delegatesFocus: !0
  }
}), Mg = (i, e) => {
  const t = i.tagFor(W);
  return m`
            :host {
                contain: size;
                overflow: visible;
                height: 0;
                width: 0;
            }

            .tooltip {
                box-sizing: border-box;
                border-radius: calc(${V} * 1px);
                border: calc(${E} * 1px) solid ${H};
                box-shadow: 0 0 0 1px ${H} inset;
                background: ${ke};
                color: ${F};
                padding: 4px;
                height: fit-content;
                width: fit-content;
                font-family: ${J};
                font-size: ${Y};
                line-height: ${Z};
                white-space: nowrap;
                /* TODO: a mechanism to manage z-index across components
                    https://github.com/microsoft/fast/issues/3813 */
                z-index: 10000;
            }

            ${t} {
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: visible;
                flex-direction: row;
            }

            ${t}.right,
            ${t}.left {
                flex-direction: column;
            }

            ${t}.top .tooltip {
                margin-bottom: 4px;
            }

            ${t}.bottom .tooltip {
                margin-top: 4px;
            }

            ${t}.left .tooltip {
                margin-right: 4px;
            }

            ${t}.right .tooltip {
                margin-left: 4px;
            }

            ${t}.top.left .tooltip,
            ${t}.top.right .tooltip {
                margin-bottom: 0px;
            }

            ${t}.bottom.left .tooltip,
            ${t}.bottom.right .tooltip {
                margin-top: 0px;
            }

            ${t}.top.left .tooltip,
            ${t}.bottom.left .tooltip {
                margin-right: 0px;
            }

            ${t}.top.right .tooltip,
            ${t}.bottom.right .tooltip {
                margin-left: 0px;
            }

        `.withBehaviors(M(m`
                :host([disabled]) {
                    opacity: 1;
                }
            `));
}, lv = be.compose({
  baseName: "tooltip",
  template: Xu,
  styles: Mg
}), Vg = m`
    .expand-collapse-glyph {
        transform: rotate(0deg);
    }
    :host(.nested) .expand-collapse-button {
        left: var(--expand-collapse-button-nested-width, calc(${D} * -1px));
    }
    :host([selected])::after {
        left: calc(${j} * 1px);
    }
    :host([expanded]) > .positioning-region .expand-collapse-glyph {
        transform: rotate(45deg);
    }
`, Hg = m`
    .expand-collapse-glyph {
        transform: rotate(180deg);
    }
    :host(.nested) .expand-collapse-button {
        right: var(--expand-collapse-button-nested-width, calc(${D} * -1px));
    }
    :host([selected])::after {
        right: calc(${j} * 1px);
    }
    :host([expanded]) > .positioning-region .expand-collapse-glyph {
        transform: rotate(135deg);
    }
`, Rr = va`((${vo} / 2) * ${y}) + ((${y} * ${dt}) / 2)`, zg = Ht.create("tree-item-expand-collapse-hover").withDefault((i) => {
  const e = Bt.getValueFor(i);
  return e.evaluate(i, e.evaluate(i).hover).hover;
}), Ng = Ht.create("tree-item-expand-collapse-selected-hover").withDefault((i) => {
  const e = hi.getValueFor(i);
  return Bt.getValueFor(i).evaluate(i, e.evaluate(i).rest).hover;
}), Bg = (i, e) => m`
    /**
     * This animation exists because when tree item children are conditionally loaded
     * there is a visual bug where the DOM exists but styles have not yet been applied (essentially FOUC).
     * This subtle animation provides a ever so slight timing adjustment for loading that solves the issue.
     */
    @keyframes treeItemLoading {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
         }
    }

    ${B("block")} :host {
        contain: content;
        position: relative;
        outline: none;
        color: ${F};
        background: ${Ke};
        cursor: pointer;
        font-family: ${J};
        --expand-collapse-button-size: calc(${D} * 1px);
        --tree-item-nested-width: 0;
    }

        :host(:focus) > .positioning-region {
            outline: none;
        }

        :host(:focus) .content-region {
            outline: none;
        }

        :host(:${w}) .positioning-region {
            border: ${H} calc(${E} * 1px) solid;
            border-radius: calc(${V} * 1px);
            color: ${F};
        }

        .positioning-region {
            display: flex;
            position: relative;
            box-sizing: border-box;
            background: ${Ke};
            border: transparent calc(${E} * 1px) solid;
            height: calc((${D} + 1) * 1px);
        }

        .positioning-region::before {
            content: "";
            display: block;
            width: var(--tree-item-nested-width);
            flex-shrink: 0;
        }

        :host(:not([disabled])) .positioning-region:hover {
            background: ${pi};
        }

        :host(:not([disabled])) .positioning-region:active {
            background: ${fi};
        }

        .content-region {
            display: inline-flex;
            align-items: center;
            white-space: nowrap;
            width: 100%;
            height: calc(${D} * 1px);
            margin-inline-start: calc(${y} * 2px + 8px);
            font-size: ${Y};
            line-height: ${Z};
            font-weight: 400;
        }

        .items {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            font-size: calc(1em + (${y} + 16) * 1px);
        }

        .expand-collapse-button {
            background: none;
            border: none;
            outline: none;
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: calc((${Rr} + (${y} * 2)) * 1px);
            height: calc((${Rr} + (${y} * 2)) * 1px);
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            margin-left: 6px;
            margin-right: 6px;
        }

        .expand-collapse-glyph {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: 16px;
            height: 16px;
            transition: transform 0.1s linear;

            pointer-events: none;
            fill: currentcolor;
        }

        .start,
        .end {
            display: flex;
            fill: currentcolor;
        }

        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: 16px;
            height: 16px;
        }

        .start {
            /* TODO: horizontalSpacing https://github.com/microsoft/fast/issues/2766 */
            margin-inline-end: calc(${y} * 2px + 2px);
        }

        .end {
            /* TODO: horizontalSpacing https://github.com/microsoft/fast/issues/2766 */
            margin-inline-start: calc(${y} * 2px + 2px);
        }

        :host([expanded]) > .items {
            animation: treeItemLoading ease-in 10ms;
            animation-iteration-count: 1;
            animation-fill-mode: forwards;
        }

        :host([disabled]) .content-region {
            opacity: ${ge};
            cursor: ${de};
        }

        :host(.nested) .content-region {
            position: relative;
            margin-inline-start: var(--expand-collapse-button-size);
        }

        :host(.nested) .expand-collapse-button {
            position: absolute;
        }

        :host(.nested:not([disabled])) .expand-collapse-button:hover {
            background: ${zg};
        }

        :host([selected]) .positioning-region {
            background: ${ke};
        }

        :host([selected]:not([disabled])) .positioning-region:hover {
            background: ${ui};
        }

        :host([selected]:not([disabled])) .positioning-region:active {
            background: ${Fn};
        }

        :host([selected]:not([disabled])) .expand-collapse-button:hover {
            background: ${Ng};
        }

        :host([selected])::after {
            /* The background needs to be calculated based on the selected background state
                for this control. We currently have no way of changing that, so setting to
                accent-foreground-rest for the time being */
            background: ${we};
            border-radius: calc(${V} * 1px);
            content: "";
            display: block;
            position: absolute;
            top: calc((${D} / 4) * 1px);
            width: 3px;
            height: calc((${D} / 2) * 1px);
        }

        ::slotted(${i.tagFor(he)}) {
            --tree-item-nested-width: 1em;
            --expand-collapse-button-nested-width: calc(${D} * -1px);
        }
    `.withBehaviors(new Oi(Vg, Hg), M(m`
            :host {
                forced-color-adjust: none;
                border-color: transparent;
                background: ${d.Field};
                color: ${d.FieldText};
            }
            :host .content-region .expand-collapse-glyph {
                fill: ${d.FieldText};
            }
            :host .positioning-region:hover,
            :host([selected]) .positioning-region {
                background: ${d.Highlight};
            }
            :host .positioning-region:hover .content-region,
            :host([selected]) .positioning-region .content-region {
                color: ${d.HighlightText};
            }
            :host .positioning-region:hover .content-region .expand-collapse-glyph,
            :host .positioning-region:hover .content-region .start,
            :host .positioning-region:hover .content-region .end,
            :host([selected]) .content-region .expand-collapse-glyph,
            :host([selected]) .content-region .start,
            :host([selected]) .content-region .end {
                fill: ${d.HighlightText};
            }
            :host([selected])::after {
                background: ${d.Field};
            }
            :host(:${w}) .positioning-region {
                border-color: ${d.FieldText};
                box-shadow: 0 0 0 2px inset ${d.Field};
                color: ${d.FieldText};
            }
            :host([disabled]) .content-region,
            :host([disabled]) .positioning-region:hover .content-region {
                opacity: 1;
                color: ${d.GrayText};
            }
            :host([disabled]) .content-region .expand-collapse-glyph,
            :host([disabled]) .content-region .start,
            :host([disabled]) .content-region .end,
            :host([disabled]) .positioning-region:hover .content-region .expand-collapse-glyph,
            :host([disabled]) .positioning-region:hover .content-region .start,
            :host([disabled]) .positioning-region:hover .content-region .end {
                fill: ${d.GrayText};
            }
            :host([disabled]) .positioning-region:hover {
                background: ${d.Field};
            }
            .expand-collapse-glyph,
            .start,
            .end {
                fill: ${d.FieldText};
            }
            :host(.nested) .expand-collapse-button:hover {
                background: ${d.Field};
            }
            :host(.nested) .expand-collapse-button:hover .expand-collapse-glyph {
                fill: ${d.FieldText};
            }
        `)), cv = he.compose({
  baseName: "tree-item",
  template: Qu,
  styles: Bg,
  expandCollapseGlyph: `
        <svg
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            class="expand-collapse-glyph"
        >
            <path
                d="M5.00001 12.3263C5.00124 12.5147 5.05566 12.699 5.15699 12.8578C5.25831 13.0167 5.40243 13.1437 5.57273 13.2242C5.74304 13.3047 5.9326 13.3354 6.11959 13.3128C6.30659 13.2902 6.4834 13.2152 6.62967 13.0965L10.8988 8.83532C11.0739 8.69473 11.2153 8.51658 11.3124 8.31402C11.4096 8.11146 11.46 7.88966 11.46 7.66499C11.46 7.44033 11.4096 7.21853 11.3124 7.01597C11.2153 6.81341 11.0739 6.63526 10.8988 6.49467L6.62967 2.22347C6.48274 2.10422 6.30501 2.02912 6.11712 2.00691C5.92923 1.9847 5.73889 2.01628 5.56823 2.09799C5.39757 2.17969 5.25358 2.30817 5.153 2.46849C5.05241 2.62882 4.99936 2.8144 5.00001 3.00369V12.3263Z"
            />
        </svg>
    `
}), jg = (i, e) => m`
    ${B("flex")} :host {
        flex-direction: column;
        align-items: stretch;
        min-width: fit-content;
        font-size: 0;
    }

    :host:focus-visible {
        outline: none;
    }
`, dv = ts.compose({
  baseName: "tree-view",
  template: Zu,
  styles: jg
});
function _l(i) {
  return Ma.getOrCreate(i).withPrefix("fast");
}
var _g = Object.defineProperty, Ug = Object.getOwnPropertyDescriptor, qg = (i, e, t, o) => {
  for (var s = o > 1 ? void 0 : o ? Ug(e, t) : e, n = i.length - 1, r; n >= 0; n--)
    (r = i[n]) && (s = (o ? r(e, t, s) : r(s)) || s);
  return o && s && _g(e, t, s), s;
};
_l().register(Hl(), zl(), Nl());
let Zs = class extends nn {
  render() {
    return Lo`
            <fast-tabs activeid="entrees">
                <fast-tab id="lit">
                    Lit
                </fast-tab>
                <fast-tab id="hybrids">
                    Hybrids
                </fast-tab>
                <fast-tab id="fast">
                    Fast
                </fast-tab>

                <fast-tab-panel id="litPan">
                    <my-element>
                        <h1>Vite + Lit</h1>
                    </my-element>
                </fast-tab-panel>
                <fast-tab-panel id="hybridsPanel">
                    <simple-counter count="42" text="HybridJS"></simple-counter>
                </fast-tab-panel>
                <fast-tab-panel id="fastPanel">
                    <name-tag></name-tag>
                </fast-tab-panel>
            </fast-tabs>
            
            <br>
        `;
  }
};
Zs = qg([
  rn("home-view")
], Zs);
const Gg = Zs;
var Wg = Object.defineProperty, Yg = Object.getOwnPropertyDescriptor, Xg = (i, e, t, o) => {
  for (var s = o > 1 ? void 0 : o ? Yg(e, t) : e, n = i.length - 1, r; n >= 0; n--)
    (r = i[n]) && (s = (o ? r(e, t, s) : r(s)) || s);
  return o && s && Wg(e, t, s), s;
};
let Dr = class extends nn {
  constructor() {
    super(), this.arr = [];
    for (let i = 0; i < 100; i++)
      this.arr.push(1);
  }
  render() {
    return Lo`
            <h2>About</h2>
            ${this.arr.map((i) => Lo`<p>fasdfkhlsakjfhlkasjdfhlkasjfdhlkajsfhlkjsdf${i}</p>`)}
        `;
  }
};
Dr = Xg([
  rn("about-page")
], Dr);
const Qg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBhcmlhLWhpZGRlbj0idHJ1ZSIgcm9sZT0iaW1nIiBjbGFzcz0iaWNvbmlmeSBpY29uaWZ5LS1sb2dvcyIgd2lkdGg9IjI1LjYiIGhlaWdodD0iMzIiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiIHZpZXdCb3g9IjAgMCAyNTYgMzIwIj48cGF0aCBmaWxsPSIjMDBFOEZGIiBkPSJtNjQgMTkybDI1LjkyNi00NC43MjdsMzguMjMzLTE5LjExNGw2My45NzQgNjMuOTc0bDEwLjgzMyA2MS43NTRMMTkyIDMyMGwtNjQtNjRsLTM4LjA3NC0yNS42MTV6Ij48L3BhdGg+PHBhdGggZmlsbD0iIzI4MzE5OCIgZD0iTTEyOCAyNTZWMTI4bDY0LTY0djEyOGwtNjQgNjRaTTAgMjU2bDY0IDY0bDkuMjAyLTYwLjYwMkw2NCAxOTJsLTM3LjU0MiAyMy43MUwwIDI1NloiPjwvcGF0aD48cGF0aCBmaWxsPSIjMzI0RkZGIiBkPSJNNjQgMTkyVjY0bDY0LTY0djEyOGwtNjQgNjRabTEyOCAxMjhWMTkybDY0LTY0djEyOGwtNjQgNjRaTTAgMjU2VjEyOGw2NCA2NGwtNjQgNjRaIj48L3BhdGg+PHBhdGggZmlsbD0iIzBGRiIgZD0iTTY0IDMyMFYxOTJsNjQgNjR6Ij48L3BhdGg+PC9zdmc+";
var Zg = Object.defineProperty, Jg = Object.getOwnPropertyDescriptor, An = (i, e, t, o) => {
  for (var s = o > 1 ? void 0 : o ? Jg(e, t) : e, n = i.length - 1, r; n >= 0; n--)
    (r = i[n]) && (s = (o ? r(e, t, s) : r(s)) || s);
  return o && s && Zg(e, t, s), s;
};
let ao = class extends nn {
  constructor() {
    super(...arguments), this.docsHint = "Click on the Vite and Lit logos to learn more", this.count = 0;
  }
  render() {
    return Lo`
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src="/vite.svg" class="logo" alt="Vite logo" />
                </a>
                <a href="https://lit.dev" target="_blank">
                    <img src=${Qg} class="logo lit" alt="Lit logo" />
                </a>
            </div>
            <slot></slot>
            <div class="card">
                <button @click=${this._onClick} part="button">
                    count is ${this.count}
                </button>
            </div>
            <p class="read-the-docs">${this.docsHint}</p>
        `;
  }
  _onClick() {
    this.count++;
  }
};
ao.styles = ic`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    h1 {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `;
An([
  Yr()
], ao.prototype, "docsHint", 2);
An([
  Yr({ type: Number })
], ao.prototype, "count", 2);
ao = An([
  rn("my-element")
], ao);
function Kg(i) {
  return i = Object.create(i), "HTMLElement" in i || Object.defineProperty(i, "HTMLElement", {
    value: class {
      constructor() {
        throw Error(
          "Current context does not support defining custom elements"
        );
      }
    }
  }), "document" in i || Object.defineProperty(i, "document", {
    value: {
      importNode: () => {
        throw Error("Current context does not support importing nodes");
      }
    }
  }), i;
}
const N = typeof window == "object" ? window : Kg(globalThis), Or = /* @__PURE__ */ new Map();
function fs(i) {
  let e = Or.get(i);
  return e === void 0 && (e = i.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), Or.set(i, e)), e;
}
function Ul(i) {
  return `<${String(i.tagName).toLowerCase()}>`;
}
function No(i, e) {
  i.nodeType === N.Node.ELEMENT_NODE && (e(i), i.shadowRoot && No(i.shadowRoot, e));
  const t = N.document.createTreeWalker(
    i,
    N.NodeFilter.SHOW_ELEMENT,
    null,
    !1
  );
  for (; t.nextNode(); ) {
    const o = t.currentNode;
    e(o), o.shadowRoot && No(o.shadowRoot, e);
  }
}
const ql = Promise.resolve(), em = /* @__PURE__ */ new WeakMap(), Js = No.name === "walkInShadow", lo = /* @__PURE__ */ new Set();
function Pn(i) {
  lo.size || ql.then(im), lo.add(i);
}
function tm(i) {
  lo.delete(i);
}
function im() {
  for (const i of lo)
    try {
      i();
    } catch (e) {
      console.error(e);
    }
  lo.clear();
}
const Bo = /* @__PURE__ */ new WeakMap(), _i = /* @__PURE__ */ new Set();
function Gl(i) {
  const e = /* @__PURE__ */ new Set(), t = e.values();
  for (; i; ) {
    if (i.resolved = !1, i.deps) {
      for (const o of i.deps)
        o.contexts.delete(i);
      i.deps.clear();
    }
    if (i.contexts)
      for (const o of i.contexts)
        _i.has(o) || (e.add(o), i.contexts.delete(o));
    i.observe && Pn(i.observe), i = t.next().value;
  }
}
function gs(i, e) {
  let t = Bo.get(i);
  t || (t = /* @__PURE__ */ new Map(), Bo.set(i, t));
  let o = t.get(e);
  return o || (o = {
    key: e,
    target: i,
    value: void 0,
    lastValue: void 0,
    resolved: !1,
    contexts: void 0,
    deps: void 0,
    observe: void 0
  }, t.set(e, o)), o;
}
let We = null;
function Wl(i, e, t) {
  const o = gs(i, e);
  if (We && (o.contexts || (o.contexts = /* @__PURE__ */ new Set()), We.deps || (We.deps = /* @__PURE__ */ new Set()), o.contexts.add(We), We.deps.add(o)), o.resolved)
    return o.value;
  const s = We;
  try {
    if (_i.has(o))
      throw Error(`Circular get invocation is forbidden: '${e}'`);
    We = o, _i.add(o), o.value = t(i, o.value), o.resolved = !0, We = s, _i.delete(o);
  } catch (n) {
    throw We = s, _i.delete(o), We && (We.deps.delete(o), o.contexts.delete(We)), n;
  }
  return o.value;
}
function om(i, e, t, o) {
  const s = gs(i, e), n = t(i, o, s.value);
  n !== s.value && (s.value = n, Gl(s));
}
function sm(i, e, t, o) {
  const s = gs(i, e);
  return s.observe = () => {
    const n = Wl(i, e, t);
    n !== s.lastValue && (o(i, n, s.lastValue), s.lastValue = n);
  }, Pn(s.observe), () => {
    tm(s.observe), s.observe = void 0, s.lastValue = void 0;
  };
}
const So = /* @__PURE__ */ new Set();
function nm(i) {
  So.size || setTimeout(() => {
    for (const e of So)
      if (!e.contexts || e.contexts.size === 0) {
        if (e.deps)
          for (const o of e.deps)
            o.contexts.delete(e);
        Bo.get(e.target).delete(e.key);
      }
    So.clear();
  }), So.add(i);
}
function Yl(i, e) {
  Gl(i), e.clearValue && (i.value = void 0, i.lastValue = void 0), e.deleteEntry && nm(i);
}
function Xl(i, e, t = {}) {
  const o = gs(i, e);
  Yl(o, t);
}
function rm(i, e = {}) {
  const t = Bo.get(i);
  if (t)
    for (const o of t.values())
      Yl(o, e);
}
function Lr(i, e) {
  return {
    get: e ? (t) => {
      const o = i(t), s = t.shadowRoot || t.attachShadow({
        mode: "open",
        delegatesFocus: i.delegatesFocus || !1
      });
      return () => (o(t, s), s);
    } : (t) => {
      const o = i(t);
      return () => (o(t, t), t);
    },
    observe(t, o) {
      o();
    }
  };
}
function am(i, e) {
  const t = i.value;
  return {
    get: (o, s) => s === void 0 ? o.getAttribute(e) || t : s,
    set: (o, s) => (s = String(s), s ? o.setAttribute(e, s) : o.removeAttribute(e), s),
    connect: t !== "" ? (o, s, n) => (!o.hasAttribute(e) && o[s] === t && o.setAttribute(e, t), i.connect && i.connect(o, s, n)) : i.connect,
    observe: i.observe
  };
}
function lm(i, e) {
  const t = i.value;
  return {
    get: (o, s) => s === void 0 ? Number(o.getAttribute(e) || t) : s,
    set: (o, s) => (s = Number(s), o.setAttribute(e, s), s),
    connect: (o, s, n) => (!o.hasAttribute(e) && o[s] === t && o.setAttribute(e, t), i.connect && i.connect(o, s, n)),
    observe: i.observe
  };
}
function cm(i, e) {
  const t = i.value;
  return {
    get: (o, s) => s === void 0 ? o.hasAttribute(e) || t : s,
    set: (o, s) => (s = Boolean(s), s ? o.setAttribute(e, "") : o.removeAttribute(e), s),
    connect: t === !0 ? (o, s, n) => (!o.hasAttribute(e) && o[s] === t && o.setAttribute(e, ""), i.connect && i.connect(o, s, n)) : i.connect,
    observe: i.observe
  };
}
function dm(i, e) {
  const t = i.value;
  return {
    get: (o, s) => s === void 0 ? o.getAttribute(e) || t : s,
    set: (o, s) => s,
    connect: i.connect,
    observe: i.observe
  };
}
function hm(i, e) {
  const t = typeof e.value, o = fs(i);
  switch (t) {
    case "string":
      return am(e, o);
    case "number":
      return lm(e, o);
    case "boolean":
      return cm(e, o);
    case "undefined":
      return dm(e, o);
    default:
      throw TypeError(
        `Invalid default value for '${i}' property - it must be a string, number, boolean or undefined: ${t}`
      );
  }
}
const Fo = /* @__PURE__ */ new WeakMap();
function Ks(i, e) {
  if (e) {
    if (i === e.hybrids)
      return e;
    for (const s of Object.keys(e.hybrids))
      delete e.prototype[s];
  } else
    e = class extends N.HTMLElement {
      connectedCallback() {
        for (const n of Object.keys(this)) {
          const r = this[n];
          delete this[n], this[n] = r;
        }
        const s = /* @__PURE__ */ new Set();
        Fo.set(this, s), Pn(() => {
          if (s === Fo.get(this)) {
            for (const n of this.constructor.connects)
              s.add(n(this));
            for (const n of this.constructor.observers)
              s.add(n(this));
          }
        });
      }
      disconnectedCallback() {
        const s = Fo.get(this);
        for (const n of s)
          n && n();
        Fo.delete(this), rm(this);
      }
    };
  e.hybrids = i;
  const t = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const s of Object.keys(i)) {
    if (s === "tag")
      continue;
    let n = i[s];
    const r = typeof n;
    if (r === "function")
      s === "render" ? n = Lr(n, !0) : s === "content" ? n = Lr(n) : n = { get: n };
    else if (r !== "object" || n === null)
      n = { value: n };
    else if (n.set) {
      if (hasOwnProperty.call(n, "value"))
        throw TypeError(
          `Invalid property descriptor for '${s}' property - it must not have 'value' and 'set' properties at the same time.`
        );
      const l = fs(s), c = n.get || ((u, p) => p);
      n.get = (u, p) => (p === void 0 && (p = n.set(u, u.getAttribute(l) || p)), c(u, p));
    }
    if (hasOwnProperty.call(n, "value"))
      n = hm(s, n);
    else if (!n.get)
      throw TypeError(
        `Invalid descriptor for '${s}' property - it must contain 'value' or 'get' option`
      );
    Object.defineProperty(e.prototype, s, {
      get: function() {
        return Wl(this, s, n.get);
      },
      set: n.set && function(c) {
        om(this, s, n.set, c);
      },
      enumerable: !0,
      configurable: !0
    }), n.connect && t.add(
      (l) => n.connect(l, s, () => {
        Xl(l, s);
      })
    ), n.observe && o.add((l) => sm(l, s, n.get, n.observe));
  }
  return e.connects = t, e.observers = o, e;
}
const Ni = /* @__PURE__ */ new Map();
function um(i) {
  Ni.size || ql.then(() => {
    No(N.document.body, (e) => {
      if (Ni.has(e.constructor)) {
        const t = Ni.get(e.constructor), o = e.constructor.hybrids;
        e.disconnectedCallback();
        for (const s of Object.keys(o)) {
          const n = typeof o[s], r = n !== "object" && n !== "function" && o[s] !== t[s];
          Xl(e, s, { clearValue: r });
        }
        e.connectedCallback();
      }
    }), Ni.clear();
  }), Ni.set(i, i.hybrids);
}
function Ql(i) {
  if (!i.tag)
    throw TypeError(
      "Error while defining hybrids: 'tag' property with dashed tag name is required"
    );
  const e = N.customElements.get(i.tag);
  if (e) {
    if (e.hybrids)
      return um(e), Ks(i, e), Object.freeze(i);
    throw TypeError(
      `Custom element with '${i.tag}' tag name already defined outside of the hybrids context`
    );
  }
  return N.customElements.define(i.tag, Ks(i)), Object.freeze(i);
}
function pm(i, e = {}) {
  const { root: t = "", prefix: o } = e, s = Object.keys(i);
  if (s.length === 0)
    return i;
  for (const n of s) {
    const r = i[n];
    if (!r.tag) {
      const l = fs(
        [].concat(t).reduce((c, u) => c.replace(u, ""), n).replace(/^[./]+/, "").replace(/\//g, "-").replace(/\.[a-zA-Z]+$/, "")
      );
      r.tag = o ? `${o}-${l}` : l;
    }
    Ql(r);
  }
  return i;
}
const fm = Object.freeze(
  Object.assign(Ql, {
    compile: (i) => Ks(i),
    from: pm
  })
), en = /* @__PURE__ */ new WeakMap();
function xt(i) {
  let e = en.get(i);
  return e || (en.set(i, e = {}), e);
}
function ms(i) {
  let e;
  for (; i && (e = xt(i)) && e.endNode; )
    i = e.endNode;
  return i;
}
function co(i) {
  const e = xt(i);
  if (e.styles && e.styles(), i.nodeType === N.Node.TEXT_NODE) {
    if (e.startNode) {
      const t = ms(e.endNode);
      let o = e.startNode;
      const s = t.nextSibling;
      for (; o; ) {
        const n = o.nextSibling;
        o.parentNode.removeChild(o), o = n !== s && n;
      }
    }
  } else {
    let t = i.childNodes[0];
    for (; t; )
      i.removeChild(t), t = i.childNodes[0];
  }
  en.delete(i);
}
const gm = Date.now(), Tt = (i = 0) => `H-${gm}-${i}`, Mn = !!N.document.adoptedStyleSheets, As = /^\d+$/, mm = {
  block: (i, e) => ({
    display: "block",
    "text-align": e
  }),
  inline: ({ display: i }) => ({
    display: `inline${i ? `-${i}` : ""}`
  }),
  contents: { display: "contents" },
  hidden: { display: "none" },
  ...["row", "row-reverse", "column", "column-reverse"].reduce((i, e) => (i[e] = (t, o = "nowrap") => ({
    display: "flex",
    "flex-flow": `${e} ${o}`
  }), i), {}),
  grow: (i, e = 1) => ({ "flex-grow": e }),
  shrink: (i, e = 1) => ({ "flex-shrink": e }),
  basis: (i, e) => ({ "flex-basis": ie(e) }),
  order: (i, e = 0) => ({ order: e }),
  grid: (i, e = "1", t = "", o = "", s = "") => ({
    display: "grid",
    ...["columns", "rows"].reduce((n, r) => {
      const l = r === "columns" ? e : t;
      return n[`grid-template-${r}`] = l && l.split("|").map(
        (c) => c.match(As) ? `repeat(${c}, minmax(0, 1fr))` : ie(c)
      ).join(" "), n;
    }, {}),
    "grid-auto-flow": `${o} ${s && "dense"}`
  }),
  area: (i, e = "", t = "") => ({
    "grid-column": e.match(As) ? `span ${e}` : e,
    "grid-row": t.match(As) ? `span ${t}` : t
  }),
  gap: (i, e = 1, t = "") => ({
    "column-gap": ie(e),
    "row-gap": ie(t || e)
  }),
  items: (i, e = "start", t = "") => ({
    "place-items": `${e} ${t}`
  }),
  content: (i, e = "start", t = "") => ({
    "place-content": `${e} ${t}`
  }),
  self: (i, e = "start", t = "") => ({
    "place-self": `${e} ${t}`
  }),
  center: { "place-items": "center", "place-content": "center" },
  size: (i, e, t = e) => ({
    width: ie(e),
    height: ie(t),
    "box-sizing": "border-box"
  }),
  width: (i, e, t, o) => ({
    width: ie(e),
    "min-width": ie(t),
    "max-width": ie(o),
    "box-sizing": "border-box"
  }),
  height: (i, e, t, o) => ({
    height: ie(e),
    "min-height": ie(t),
    "max-height": ie(o),
    "box-sizing": "border-box"
  }),
  ratio: (i, e) => ({ "aspect-ratio": e }),
  overflow: (i, e = "hidden", t = "") => {
    const o = t ? `-${e}` : "", s = t || e;
    return {
      [`overflow${o}`]: s,
      ...s === "scroll" ? {
        "flex-grow": i["flex-grow"] || 1,
        "flex-basis": 0,
        "overscroll-behavior": "contain",
        "--webkit-overflow-scrolling": "touch"
      } : {}
    };
  },
  margin: (i, e = "1", t, o, s) => e.match(/top|bottom|left|right/) ? {
    [`margin-${e}`]: ie(t || "1")
  } : {
    margin: `${ie(e)} ${ie(t)} ${ie(o)} ${ie(
      s
    )}`
  },
  padding: (i, e = "1", t, o, s) => e.match(/top|bottom|left|right/) ? {
    [`padding-${e}`]: ie(t || "1")
  } : {
    padding: `${ie(e)} ${ie(t)} ${ie(o)} ${ie(
      s
    )}`
  },
  absolute: { position: "absolute" },
  relative: { position: "relative" },
  fixed: { position: "fixed" },
  sticky: { position: "sticky" },
  static: { position: "static" },
  inset: (i, e = 0) => {
    const t = ie(e);
    return { top: t, right: t, bottom: t, left: t };
  },
  top: (i, e = 0) => ({ top: ie(e) }),
  bottom: (i, e = 0) => ({ bottom: ie(e) }),
  left: (i, e = 0) => ({ left: ie(e) }),
  right: (i, e = 0) => ({ right: ie(e) }),
  layer: (i, e = 1) => ({ "z-index": e })
}, bm = {
  min: "min-content",
  max: "max-content",
  fit: "fit-content",
  full: "100%"
}, vm = {
  portrait: "orientation: portrait",
  landscape: "orientation: landscape"
};
function ie(i) {
  return i = bm[i] || i, /^-?\d+(\.\d+)*$/.test(String(i)) ? `${i * 8}px` : i || "";
}
let gi;
function Zl() {
  if (gi)
    return gi;
  if (Mn)
    gi = new N.CSSStyleSheet();
  else {
    const i = N.document.createElement("style");
    i.appendChild(N.document.createTextNode("")), N.document.head.appendChild(i), gi = i.sheet;
  }
  return gi.insertRule(":host([hidden]) { display: none; }"), gi;
}
const Ar = /* @__PURE__ */ new WeakMap();
let tn = /* @__PURE__ */ new WeakSet();
function ym(i) {
  const e = i.getRootNode();
  if (tn.has(e))
    return;
  const t = Zl();
  if (Mn)
    e.adoptedStyleSheets = [...e.adoptedStyleSheets, t];
  else {
    if (e === N.document)
      return;
    let o = Ar.get(e);
    o || (o = N.document.createElement("style"), e.appendChild(o), Ar.set(e, o));
    let s = "";
    for (let n = 0; n < t.cssRules.length; n++)
      s += t.cssRules[n].cssText;
    o.textContent = s;
  }
  tn.add(e);
}
const Pr = /* @__PURE__ */ new Map();
function Mr(i, e, t, o) {
  let s = Pr.get(i);
  s || (s = `l-${Math.random().toString(36).substr(2, 5)}`, Pr.set(i, s)), Mn || (tn = /* @__PURE__ */ new WeakSet());
  const n = Zl(), [r, l = ""] = e.split("@"), c = Object.entries(
    t.replace(/\s+/g, " ").trim().split(" ").reduce((p, f) => {
      const [b, ...I] = f.split(":"), $ = mm[b];
      if (!$)
        throw TypeError(`Unsupported layout rule: '${b}'`);
      return Object.assign(
        p,
        typeof $ == "function" ? $(p, ...I.map((k) => k.match(/--.*/) ? `var(${k})` : k)) : $
      );
    }, {})
  ).reduce(
    (p, [f, b]) => b !== void 0 && b !== "" ? p + `${f}: ${b};` : p,
    ""
  ), u = l.split(":").reduce((p, f) => f === "" ? p : p + ` and (${vm[f] || `min-width: ${f}`})`, "@media screen");
  if (o) {
    const p = `:host(.${s}-s${r})`, f = `:where(.${s}-c${r})`;
    [p, f].forEach((b) => {
      n.insertRule(
        l ? `${u} { ${b} { ${c} } }` : `${b} { ${c} }`,
        n.cssRules.length
      );
    });
  } else {
    const p = `.${s}${r}`;
    n.insertRule(
      l ? `${u} { ${p} { ${c} } }` : `${p} { ${c} }`,
      n.cssRules.length
    );
  }
  return s;
}
const on = /* @__PURE__ */ new WeakMap();
function xm(i, e) {
  const t = xt(i), o = t.startNode, s = ms(t.endNode);
  e.parentNode.insertBefore(i, e.nextSibling);
  let n = i, r = o;
  for (; r; ) {
    const l = r.nextSibling;
    n.parentNode.insertBefore(r, n.nextSibling), n = r, r = l !== s.nextSibling && l;
  }
}
function $m(i, e, t, o, s) {
  let n = on.get(e);
  const r = t.map((p, f) => ({
    id: hasOwnProperty.call(p, "id") ? p.id : f,
    value: p,
    placeholder: null,
    available: !0
  }));
  if (on.set(e, r), n) {
    const p = /* @__PURE__ */ new Set();
    for (const f of r)
      p.add(f.id);
    n = n.filter((f) => p.has(f.id) ? !0 : (co(f.placeholder), f.placeholder.parentNode.removeChild(f.placeholder), !1));
  }
  let l = e;
  const c = t.length - 1, u = xt(e);
  for (let p = 0; p < r.length; p += 1) {
    const f = r[p];
    let b;
    if (n) {
      for (let I = 0; I < n.length; I += 1)
        if (n[I].available && n[I].id === f.id) {
          b = n[I];
          break;
        }
    }
    b ? (b.available = !1, f.placeholder = b.placeholder, f.placeholder.previousSibling !== l && xm(f.placeholder, l), b.value !== f.value && o(
      i,
      f.placeholder,
      f.value,
      b.value,
      s
    )) : (f.placeholder = N.document.createTextNode(""), l.parentNode.insertBefore(
      f.placeholder,
      l.nextSibling
    ), o(i, f.placeholder, f.value, void 0, s)), l = ms(
      xt(f.placeholder).endNode || f.placeholder
    ), p === 0 && (u.startNode = f.placeholder), p === c && (u.endNode = l);
  }
  if (n)
    for (const p of n)
      p.available && (co(p.placeholder), p.placeholder.parentNode.removeChild(p.placeholder));
}
function wm(i, e, t) {
  co(e);
  const o = xt(e);
  o.startNode = o.endNode = t, e.parentNode.insertBefore(t, e.nextSibling);
}
function Vr(i) {
  const e = typeof i;
  if (e === "object") {
    if (Array.isArray(i))
      return "array";
    if (i instanceof N.Node)
      return "node";
  }
  return e;
}
function ho(i, e, t, o, s) {
  const n = Vr(t), r = Vr(o);
  switch (r !== "undefined" && n !== r && (n !== "function" && co(e), r === "array" ? on.delete(e) : r !== "node" && r !== "function" && (e.textContent = "")), n) {
    case "array":
      $m(i, e, t, ho, s);
      break;
    case "node":
      wm(i, e, t);
      break;
    case "function":
      s && (t.useLayout = !0), t(i, e);
      break;
    default:
      e.textContent = n === "number" || t ? t : "";
  }
}
const Ps = /* @__PURE__ */ new WeakMap();
function km(i) {
  return (e, t, o, s) => {
    if (s) {
      const n = Ps.get(t);
      n && t.removeEventListener(
        i,
        n.get(s),
        s.options !== void 0 ? s.options : !1
      );
    }
    if (o) {
      if (typeof o != "function")
        throw Error(`Event listener must be a function: ${typeof o}`);
      let n = Ps.get(t);
      n || (n = /* @__PURE__ */ new WeakMap(), Ps.set(t, n));
      const r = o.bind(null, e);
      n.set(o, r), t.addEventListener(
        i,
        r,
        o.options !== void 0 ? o.options : !1
      );
    }
  };
}
function Cm(i, e = /* @__PURE__ */ new Set()) {
  if (Array.isArray(i))
    for (const t of i)
      t && e.add(t);
  else if (i !== null && typeof i == "object")
    for (const [t, o] of Object.entries(i))
      t && o && e.add(t);
  else
    i && e.add(i);
  return e;
}
const Hr = /* @__PURE__ */ new WeakMap();
function Tm(i, e, t) {
  const o = Hr.get(e) || /* @__PURE__ */ new Set(), s = Cm(t);
  Hr.set(e, s);
  for (const n of s)
    e.classList.add(n), o.delete(n);
  for (const n of o)
    e.classList.remove(n);
}
const zr = /* @__PURE__ */ new WeakMap();
function Im(i, e, t) {
  if (t === null || typeof t != "object")
    throw TypeError(
      `Style value must be an object in ${Ul(e)}:`,
      t
    );
  const o = zr.get(e) || /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (const n of Object.keys(t)) {
    const r = fs(n), l = t[n];
    !l && l !== 0 ? e.style.removeProperty(r) : e.style.setProperty(r, l), s.set(r, l), o.delete(r);
  }
  for (const n of o.keys())
    e.style[n] = "";
  zr.set(e, s);
}
function Sm(i, e, t) {
  if (e.substr(0, 2) === "on") {
    const o = e.substr(2);
    return km(o);
  }
  switch (i) {
    case "class":
      return Tm;
    case "style":
      return Im;
    default: {
      let o = !1;
      return (s, n, r) => {
        if (o = o || !t && !(n instanceof N.SVGElement) && e in n, o)
          n[e] = r;
        else if (r === !1 || r === void 0 || r === null)
          n.removeAttribute(i);
        else {
          const l = r === !0 ? "" : String(r);
          n.setAttribute(i, l);
        }
      };
    }
  }
}
const Jl = Tt("(\\d+)"), Bi = new RegExp(`^${Jl}$`), mi = new RegExp(Jl, "g"), Fm = /^[^A-Za-z]+$/;
function Em(i) {
  let e = i[0], t = !1;
  for (let o = 1; o < i.length; o += 1)
    t = t || i[o - 1].match(
      /<\s*(table|tr|thead|tbody|tfoot|colgroup)([^<>]|"[^"]*"|'[^']*')*>\s*$/
    ), e += (t ? `<!--${Tt(o - 1)}-->` : Tt(o - 1)) + i[o], t = t && !i[o].match(/<\/\s*(table|tr|thead|tbody|tfoot|colgroup)\s*>/);
  return e;
}
function Rm(i) {
  return i.replace(/\s*=\s*['"]*$/g, "").split(/\s+/).pop();
}
function Nr(i) {
  return N.document.createTreeWalker(
    i,
    N.NodeFilter.SHOW_ELEMENT | N.NodeFilter.SHOW_TEXT | N.NodeFilter.SHOW_COMMENT,
    null,
    !1
  );
}
function Dm(i, e = 0) {
  i = i.replace(/(^[\n\s\t ]+)|([\n\s\t ]+$)+/g, "");
  let t = i.indexOf(`
`);
  if (t > -1) {
    let o = 0 - e - 2;
    for (t += 1; i[t] === " " && t < i.length; t += 1)
      o += 1;
    return i.replace(
      /\n +/g,
      (s) => s.substr(0, Math.max(s.length - o, 1))
    );
  }
  return i;
}
function Br(i, e) {
  const t = Tt(e);
  return `${Dm(i).split(`
`).filter((s) => s).map((s) => {
    const n = s.indexOf(t);
    return n > -1 ? `| ${s}
--${"-".repeat(n)}${"^".repeat(6)}` : `| ${s}`;
  }).join(`
`).replace(mi, "${...}")}`;
}
const jr = /* @__PURE__ */ new Map();
function Om(i) {
  if (i.adoptedStyleSheets) {
    let t;
    return (o) => {
      const s = i.adoptedStyleSheets;
      o ? (o = o.map((n) => {
        let r = n;
        return r instanceof N.CSSStyleSheet || (r = jr.get(n), r || (r = new N.CSSStyleSheet(), r.replaceSync(n), jr.set(n, r))), r;
      }), (!t || t.some((n, r) => n !== o[r])) && (i.adoptedStyleSheets = (t ? s.filter(
        (n) => !t.includes(n)
      ) : s).concat(o))) : t && (i.adoptedStyleSheets = s.filter(
        (n) => !t.includes(n)
      )), t = o;
    };
  }
  let e;
  return (t) => {
    if (t) {
      e || (e = N.document.createElement("style"), i = ms(i), i.nodeType === N.Node.TEXT_NODE ? i.parentNode.insertBefore(e, i.nextSibling) : i.appendChild(e));
      const o = [...t].join(`
/*------*/
`);
      e.textContent !== o && (e.textContent = o);
    } else
      e && (e.parentNode.removeChild(e), e = null);
  };
}
function Lm(i, e, t, o) {
  let s = N.document.createElement("template");
  const n = {}, r = t ? i : Em(i);
  if (s.innerHTML = e ? `<svg>${r}</svg>` : r, e) {
    const $ = s.content.firstChild;
    s.content.removeChild($);
    for (const k of Array.from($.childNodes))
      s.content.appendChild(k);
  }
  let l;
  const c = s.content.children[0];
  if (c instanceof N.HTMLTemplateElement) {
    for (const $ of Array.from(c.attributes)) {
      const k = $.value.trim();
      if ($.name.startsWith("layout") && k) {
        if (k.match(mi))
          throw Error("Layout attribute cannot contain expressions");
        l = Mr(
          c,
          $.name.substr(6),
          k,
          !0
        );
      }
    }
    if (l !== void 0 && s.content.children.length > 1)
      throw Error(
        "Template, which uses layout system must have only the '<template>' root element"
      );
    o = !0, s = c;
  }
  const u = Nr(s.content), p = [];
  let f = 0, b = null;
  for (; u.nextNode(); ) {
    let $ = u.currentNode;
    if (b && !b.contains($) && (b = null), $.nodeType === N.Node.COMMENT_NODE && Bi.test($.textContent) && ($.parentNode.insertBefore(
      N.document.createTextNode($.textContent),
      $.nextSibling
    ), u.nextNode(), $.parentNode.removeChild($), $ = u.currentNode), $.nodeType === N.Node.TEXT_NODE) {
      let k = $.textContent;
      const L = k.match(Bi);
      if (L)
        $.textContent = "", n[L[1]] = [f, ho];
      else {
        if (qm() && !t && !b && !k.match(/^\s*$/)) {
          let G;
          const z = k.trim(), q = z.replace(/\s+/g, " ").replace(mi, (ne, re) => (re = Number(re), G === void 0 && (G = re), `\${${re - G}}`));
          if (!q.match(Fm)) {
            let ne = $.previousSibling && $.previousSibling.nodeType === N.Node.COMMENT_NODE ? $.previousSibling : "";
            ne && (ne.parentNode.removeChild(ne), f -= 1, ne = (ne.textContent.split("|")[1] || "").trim().replace(/\s+/g, " "));
            const re = Gm(q, ne).replace(
              /\${(\d+)}/g,
              (jt, at) => Tt(Number(at) + G)
            );
            k = k.replace(z, re), $.textContent = k;
          }
        }
        const te = k.match(mi);
        if (te) {
          let G = $;
          te.reduce(
            (z, q) => {
              const [ne, re] = z.pop().split(q);
              return ne && z.push(ne), z.push(q), re && z.push(re), z;
            },
            [k]
          ).forEach((z, q) => {
            q === 0 ? G.textContent = z : (G = G.parentNode.insertBefore(
              N.document.createTextNode(z),
              G.nextSibling
            ), u.currentNode = G, f += 1);
            const ne = G.textContent.match(
              Bi
            );
            ne && (G.textContent = "", n[ne[1]] = [f, ho]);
          });
        }
      }
    } else if ($.nodeType === N.Node.ELEMENT_NODE) {
      if (!b && ($.getAttribute("translate") === "no" || $.tagName.toLowerCase() === "script" || $.tagName.toLowerCase() === "style") && (b = $), Js) {
        const k = $.tagName.toLowerCase();
        k.match(/.+-.+/) && !N.customElements.get(k) && !p.includes(k) && p.push(k);
      }
      for (const k of Array.from($.attributes)) {
        const L = k.value.trim(), te = k.name;
        if (o && te.startsWith("layout") && L) {
          if (L.match(mi))
            throw Error("Layout attribute cannot contain expressions");
          const z = Mr($, te.substr(6), L);
          $.removeAttribute(te), $.classList.add(z);
          continue;
        }
        const G = L.match(Bi);
        if (G) {
          const z = Rm(i[G[1]]);
          n[G[1]] = [
            f,
            Sm(te, z, e)
          ], $.removeAttribute(k.name);
        } else {
          const z = L.match(mi);
          if (z) {
            const q = `attr__${te}`;
            for (const [ne, re] of z.entries()) {
              const [, jt] = re.match(Bi);
              let at = !1;
              n[jt] = [
                f,
                (Li, Ne, _t) => {
                  const Ai = xt(Ne);
                  Ai[q] = (Ai[q] || L).replace(
                    re,
                    _t ?? ""
                  ), (z.length === 1 || ne + 1 === z.length) && (at = at || !e && !(Ne instanceof N.SVGElement) && te in Ne, at ? Ne[te] = Ai[q] : Ne.setAttribute(te, Ai[q]), Ai[q] = void 0);
                }
              ];
            }
            k.value = "";
          }
        }
      }
    }
    f += 1;
  }
  Js && p.length && console.warn(
    `Not defined ${p.map(($) => `<${$}>`).join(", ")} element${p.length > 1 ? "s" : ""} found in the template:
${Br(r, -1)}`
  );
  const I = Object.keys(n);
  return function(k, L, te, G) {
    let z = xt(L);
    if (s !== z.template) {
      const q = N.document.importNode(s.content, !0), ne = Nr(q), re = [];
      let jt = 0, at = 0, Li = n[I[at]];
      for (; ne.nextNode(); ) {
        const Ne = ne.currentNode;
        for (; Li && Li[0] === jt; )
          re.push({
            index: I[at],
            node: Ne,
            fn: Li[1]
          }), at += 1, Li = n[I[at]];
        jt += 1;
      }
      if (z.hostLayout && k.classList.remove(z.hostLayout), co(L), z = xt(L), z.template = s, z.markers = re, z.styles = Om(L), L.nodeType === N.Node.TEXT_NODE) {
        z.startNode = q.childNodes[0], z.endNode = q.childNodes[q.childNodes.length - 1];
        let Ne = L, _t = q.childNodes[0];
        for (; _t; )
          L.parentNode.insertBefore(_t, Ne.nextSibling), Ne = _t, _t = q.childNodes[0];
      } else {
        if (o) {
          const Ne = `${l}-${k === L ? "c" : "s"}`;
          k.classList.add(Ne), z.hostLayout = Ne;
        }
        L.appendChild(q);
      }
      o && ym(L);
    }
    z.styles(G);
    for (const q of z.markers) {
      const ne = te[q.index], re = z.prevArgs && z.prevArgs[q.index];
      if (!(z.prevArgs && ne === re))
        try {
          q.fn(k, q.node, ne, re, o);
        } catch (jt) {
          throw console.error(
            `Following error was thrown when updating a template expression in ${Ul(
              k
            )}
${Br(r, q.index)}`
          ), jt;
        }
    }
    z.prevArgs = te;
  };
}
function _r({ target: i, detail: e }, t) {
  let o;
  switch (i.type) {
    case "radio":
    case "checkbox":
      o = i.checked && i.value;
      break;
    case "file":
      o = i.files;
      break;
    default:
      o = e && hasOwnProperty.call(e, "value") ? e.value : i.value;
  }
  t(o);
}
function Am(i, e) {
  return i.split(".").reverse().reduce((t, o) => t ? { [o]: t } : { [o]: e }, null);
}
const Ur = /* @__PURE__ */ new Map();
function Pm(i, e) {
  if (!i)
    throw Error(
      `The first argument must be a property name or an object instance: ${i}`
    );
  if (typeof i == "object") {
    if (e === void 0)
      throw Error(
        "For model instance property the second argument must be defined"
      );
    const o = em.get(i);
    if (!o)
      throw Error("Provided object must be a model instance of the store");
    return e === null ? () => {
      o.set(i, null);
    } : (s, n) => {
      _r(n, (r) => {
        o.set(i, Am(e, r));
      });
    };
  }
  if (arguments.length === 2)
    return (o) => {
      o[i] = e;
    };
  let t = Ur.get(i);
  return t || (t = (o, s) => {
    _r(s, (n) => {
      o[i] = n;
    });
  }, Ur.set(i, t)), t;
}
const Ms = /* @__PURE__ */ new WeakMap();
function Mm(i, e, t = 200) {
  return function o(s, n) {
    const r = o.useLayout;
    let l;
    e && (l = setTimeout(() => {
      l = void 0, ho(s, n, e, void 0, r);
    }, t)), Ms.set(n, i), i.then((c) => {
      l && clearTimeout(l), Ms.get(n) === i && (ho(
        s,
        n,
        c,
        e && !l ? e : void 0,
        r
      ), Ms.set(n, null));
    });
  };
}
const Vm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  set: Pm,
  resolve: Mm
}, Symbol.toStringTag, { value: "Module" })), Hm = Tt(), zm = Tt("svg"), Nm = Tt("msg"), Bm = Tt("layout"), jm = {
  key(i) {
    return this.id = i, this;
  },
  style(...i) {
    return this.styleSheets = this.styleSheets || [], this.styleSheets.push(...i), this;
  },
  css(i, ...e) {
    this.styleSheets = this.styleSheets || [];
    let t = i[0];
    for (let o = 1; o < i.length; o++)
      t += (e[o - 1] !== void 0 ? e[o - 1] : "") + i[o];
    return this.styleSheets.push(t), this;
  }
}, qr = /* @__PURE__ */ new Map();
function _m(i, e, t, o) {
  function s(n, r = n) {
    let l = o ? i + Nm : i.join(Hm);
    t && (l += zm);
    const c = s.useLayout;
    c && (l += Bm);
    let u = qr.get(l);
    u || (u = Lm(i, t, o, c), qr.set(l, u)), u(n, r, e, s.styleSheets);
  }
  return Object.assign(s, jm);
}
function Kl(i, ...e) {
  return _m(i, e, !1, !1);
}
Object.freeze(Object.assign(Kl, Vm));
const Oo = /* @__PURE__ */ new Map(), Gr = /* @__PURE__ */ new Map();
let ec = null;
const Um = (() => {
  let i;
  try {
    i = N.navigator.languages || [N.navigator.language];
  } catch {
    i = [];
  }
  return i.reduce((e, t) => {
    const o = t.split("-")[0];
    return e.add(t), t !== o && e.add(o), e;
  }, /* @__PURE__ */ new Set());
})();
function qm() {
  return ec !== null || Oo.size;
}
const Wr = /* @__PURE__ */ new Map();
function Gm(i, e, t = []) {
  i = i.trim().replace(/\s+/g, " "), e = e.trim();
  const o = `${i} | ${e}`;
  let s = Gr.get(o);
  if (!s) {
    if (Oo.size)
      for (const n of Um) {
        const r = Oo.get(n);
        if (r && (s = r[o] || r[i], s)) {
          if (s = s.message, typeof s == "object") {
            let l = Wr.get(n);
            l || (l = new Intl.PluralRules(n), Wr.set(n, l));
            const c = s;
            s = (u) => u === 0 && c.zero || c[l.select(u)] || c.other || "";
          }
          break;
        }
      }
    s || s || (s = i, (Oo.size || ec) && Js && console.warn(
      `Missing translation: "${i}"${e ? ` [${e}]` : ""}`
    )), Gr.set(o, s);
  }
  return typeof s == "function" ? s(t[0]) : s;
}
function Wm(i) {
  i.count += 1;
}
fm({
  tag: "simple-counter",
  count: 0,
  text: "",
  content: (i) => Kl`
        <p>${i.text}</p>
        <button onclick="${Wm}">
            Count: ${i.count}
        </button>
    `.css`
        button {
            color: red;
        }
    `
});
var Ym = Object.defineProperty, Xm = Object.getOwnPropertyDescriptor, tc = (i, e, t, o) => {
  for (var s = o > 1 ? void 0 : o ? Xm(e, t) : e, n = i.length - 1, r; n >= 0; n--)
    (r = i[n]) && (s = (o ? r(e, t, s) : r(s)) || s);
  return o && s && Ym(e, t, s), s;
};
const Qm = v`
  <div class="header">
    <h3>${(i) => i.greeting.toUpperCase()}</h3>
    <h4>my name is</h4>
  </div>

  <div class="body">${(i) => i.name}</div>

  <div class="footer"></div>
`, Zm = m`
  :host {
    display: inline-block;
    contain: content;
    color: white;
    background: var(--fill-color);
    border-radius: var(--border-radius);
    min-width: 325px;
    text-align: center;
    box-shadow: 0 0 calc(var(--depth) * 1px) rgba(0,0,0,.5);
  }

  :host([hidden]) { 
    display: none;
  }

  .header {
    margin: 16px 0;
    position: relative;
  }

  h3 {
    font-weight: bold;
    font-family: 'Source Sans Pro';
    letter-spacing: 4px;
    font-size: 32px;
    margin: 0;
    padding: 0;
  }

  h4 {
    font-family: sans-serif;
    font-size: 18px;
    margin: 0;
    padding: 0;
  }

  .body {
    background: white;
    color: black;
    padding: 32px 8px;
    font-size: 42px;
    font-family: cursive;
  }

  .footer {
    height: 16px;
    background: var(--fill-color);
    border-radius: 0 0 var(--border-radius) var(--border-radius);
  }
`;
let sn = class extends po {
  constructor() {
    super(...arguments), this.greeting = "Hello", this.name = "atle";
  }
};
tc([
  h
], sn.prototype, "greeting", 2);
sn = tc([
  Wc({
    name: "name-tag",
    template: Qm,
    styles: Zm
  })
], sn);
_l().register(Hl(), zl(), Nl());
customElements.whenDefined("router-slot").then(() => {
  const i = document.querySelector("router-slot");
  i && i.add([
    {
      path: "home",
      component: Gg
    },
    {
      path: "about",
      component: document.createElement("about-page")
    },
    {
      path: "**",
      redirectTo: "home"
    }
  ]);
});
