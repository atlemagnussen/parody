
import "@appnest/web-router"
// import { LitElement, html } from "lit"
// import { customElement } from "lit/decorators.js"
import HomePage from "./pages/home"
import "./pages/about"
import "./my-element"
import "./test-hybrids"

customElements.whenDefined("router-slot").then(() => {
    const routerSlot = document.querySelector("router-slot")
    if (!routerSlot)
        return
    routerSlot.add([
        {
            path: "home",
            component: HomePage
        },
        {
            path: "about",
            component: document.createElement("about-page")
        },
        {
            path: "**",
            redirectTo: "home"
        }
    ])
})

// @customElement('my-app')
// class MyApp extends LitElement {

//     render() {
//         return html`
//             <my-element>
//                 <h1>Vite + Lit</h1>
//             </my-element>
//             <br>
//             <simple-counter></simple-counter>
//         `
//     }
// }