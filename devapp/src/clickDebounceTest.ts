import { LitElement, html } from "lit"
import { customElement, state } from "lit/decorators.js"

import { fromEvent, debounceTime, Observable, merge, Subscription } from "rxjs"




@customElement('click-debounce')
export class ClickDebounce extends LitElement {

    events = ["click", "mousemove", "wheel", "scroll", "touchmove"]
    eventObs: Observable<Event>[] = []

    combo: Observable<Event> | null = null
    result: Observable<Event> | null = null

    subs: Subscription[] = []

    @state()
    show = false

    connectedCallback() {
        super.connectedCallback()

        this.eventObs = this.events.map(e => {
            const obs = fromEvent(this, e)
            return obs
        })
        
        this.combo = merge(...this.eventObs)
        const subCombo = this.combo.subscribe(x => {
            this.show = true
            console.log("start of debouce", x)
        })
        this.subs.push(subCombo)

        this.result = this.combo.pipe(debounceTime(1000))
        const subRes = this.result.subscribe(x => {
            this.show = false
            console.log("end of debouce", x)
        })
        this.subs.push(subRes)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.subs.map(s => s.unsubscribe())
        this.combo = null
        this.result = null
        this.eventObs = []
    }

    render() {
        return html`
            <p>
                Test capture clicks<br>
            ${this.show ? html`<span>show</span>` : html`<span></span>`}
        </p>
        `
    }
}