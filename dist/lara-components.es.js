var c = Object.defineProperty;
var T = (r, t, e) => t in r ? c(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var s = (r, t, e) => (T(r, typeof t != "symbol" ? t + "" : t, e), e);
class p {
  constructor(t, e) {
    s(this, "STRUCTURE", {
      base: '<ul class="lara-pagination">%PAGINATION%</ul>',
      page_fraction: '<li class="lara-pagination-fraction" data-page-fraction> <span>%PAGE%</span> <span>/</span> <span>%LAST_PAGE%</span> </li>',
      page_value: '<li class="lara-pagination-items" data-page-value="%VALUE%" data-page-item><a href="%LINK%"><span>%LABEL%</span></a></li>',
      page_first: '<li class="lara-pagination-items" data-page-value="first"><a href="%LINK%"><span>%LABEL%</span></a></li>',
      page_last: '<li class="lara-pagination-items" data-page-value="last"><a href="%LINK%"><span>%LABEL%</span></a></li>',
      before_separator: '<li class="lara-pagination-separator" data-page-separator="before">%SEPARATOR%</li>',
      after_separator: '<li class="lara-pagination-separator" data-page-separator="after">%SEPARATOR%</li>',
      button_page_next: '<li class="lara-pagination-button" data-page-button="next"><a href="#">%ICON_LEFT% <span>%BUTTON_LABEL%</span> %ICON_RIGHT%</a></li>',
      button_page_prev: '<li class="lara-pagination-button" data-page-button="prev"><a href="#">%ICON_LEFT% <span>%BUTTON_LABEL%</span> %ICON_RIGHT%</a></li>',
      button_page_first: '<li class="lara-pagination-button" data-page-button="first"><a href="#">%ICON_LEFT% <span>%BUTTON_LABEL%</span> %ICON_RIGHT%</a></li>',
      button_page_last: '<li class="lara-pagination-button" data-page-button="last"><a href="#">%ICON_LEFT% <span>%BUTTON_LABEL%</span> %ICON_RIGHT%</a></li>'
    });
    s(this, "INTERFACE", {
      button_next: {
        label: "Next",
        icon_left: "",
        icon_right: ""
      },
      button_prev: {
        label: "Previous",
        icon_left: "",
        icon_right: ""
      },
      button_first: {
        label: "First",
        icon_left: "",
        icon_right: ""
      },
      button_last: {
        label: "Last",
        icon_left: "",
        icon_right: ""
      },
      separator: "..."
    });
    s(this, "SETTINGS", {
      loadStylePagination: !0,
      stylePagination: "number",
      typePagination: "single",
      numberPages: 0,
      breakPage: 0,
      lastPage: 0,
      behaviorBasicButton: "disabled",
      behaviorMaximumButton: "disabled",
      disable: !1
    });
    s(this, "STATE", {
      page: 1,
      pages: []
    });
    s(this, "reference", {
      container: void 0,
      pagination: void 0
    });
    s(this, "LISTENERS", {
      prev: () => {
      },
      next: () => {
      },
      first: () => {
      },
      last: () => {
      },
      change: () => {
      }
    });
    this.SETTINGS = {
      behaviorBasicButton: "disabled",
      behaviorMaximumButton: "disabled",
      breakPage: 3,
      lastPage: 30,
      loadStylePagination: !0,
      numberPages: 5,
      stylePagination: "number",
      typePagination: "single",
      disable: !1,
      ...e
    }, this.reference.container = document.querySelector(
      `[data-lara-id="${t}"]`
    ), this.STATE.pages = Array.from(
      { length: this.SETTINGS.numberPages },
      (a, i) => i + 1
    ), this.SETTINGS.loadStylePagination && this.loadStylePagination(), this.initPagination(), this.render(), this.SETTINGS.typePagination.includes("fraction") || this.handleClickItems(), (this.SETTINGS.typePagination === "basic" || this.SETTINGS.typePagination === "fraction-basic") && this.handleClickBasicButton(), (this.SETTINGS.typePagination === "maximum" || this.SETTINGS.typePagination === "fraction-maximum") && this.handleClickMaximumButton(), (this.SETTINGS.typePagination === "full" || this.SETTINGS.typePagination === "fraction-full" || this.SETTINGS.typePagination === "full-reverse" || this.SETTINGS.typePagination === "fraction-full-reverse") && (this.handleClickBasicButton(), this.handleClickMaximumButton());
  }
  set onPrev(t) {
    this.LISTENERS.prev = t;
  }
  set onNext(t) {
    this.LISTENERS.next = t;
  }
  set onFirst(t) {
    this.LISTENERS.first = t;
  }
  set onLast(t) {
    this.LISTENERS.last = t;
  }
  set onChange(t) {
    this.LISTENERS.change = t;
  }
  setInterface(t) {
    this.reference.container && (this.INTERFACE = {
      button_next: {
        label: "Prev",
        icon_left: "",
        icon_right: ""
      },
      button_prev: {
        label: "Next",
        icon_left: "",
        icon_right: ""
      },
      button_first: {
        label: "First",
        icon_left: "",
        icon_right: ""
      },
      button_last: {
        label: "Last",
        icon_left: "",
        icon_right: ""
      },
      separator: "...",
      ...t
    });
  }
  getPage() {
    return this.STATE.page;
  }
  getLastPage() {
    return this.SETTINGS.lastPage;
  }
  selectPage(t) {
    if (!this.reference.container)
      return;
    if (!this.SETTINGS.typePagination.includes("fraction")) {
      const n = this.reference.container.querySelectorAll("[data-page-item]");
      n.forEach((l) => {
        l.classList.remove("lara-pagination-item-active"), l.removeAttribute("data-page-selected");
      });
      const o = this.transformArrayPages(t);
      o !== void 0 && (n[o].classList.add(
        "lara-pagination-item-active"
      ), n[o].setAttribute("data-page-selected", "true")), this.changeNumberPagination(), this.changeStateInterface();
      return;
    }
    const a = this.reference.container.querySelector(
      "[data-page-fraction]"
    ).children[0], i = this.transformArrayPages(t);
    i !== void 0 && (a.innerText = `${this.convertLabel(this.STATE.pages[i])}`), this.changeStateInterface();
  }
  prevPage() {
    this.STATE.page !== 1 && (this.LISTENERS.prev({
      old_page: this.STATE.page,
      current_page: this.STATE.page - 1,
      action: "prev",
      total: this.SETTINGS.lastPage
    }), this.STATE.page--, this.selectPage(this.STATE.page));
  }
  nextPage() {
    this.STATE.page !== this.SETTINGS.lastPage && (this.LISTENERS.next({
      old_page: this.STATE.page,
      current_page: this.STATE.page + 1,
      action: "next",
      total: this.SETTINGS.lastPage
    }), this.STATE.page++, this.selectPage(this.STATE.page));
  }
  firstPage() {
    this.STATE.page !== 1 && (this.LISTENERS.first({
      old_page: this.STATE.page,
      action: "first",
      total: this.SETTINGS.lastPage
    }), this.STATE.page = 1, this.selectPage(this.STATE.page));
  }
  lastPage() {
    this.STATE.page !== this.SETTINGS.lastPage && (this.LISTENERS.next({
      old_page: this.STATE.page,
      action: "last",
      total: this.SETTINGS.lastPage
    }), this.STATE.page = this.SETTINGS.lastPage, this.selectPage(this.STATE.page));
  }
  initPagination() {
    const t = document.createElement("div");
    let e = [];
    this.SETTINGS.typePagination.includes("fraction") ? e = [
      `${this.STRUCTURE.page_fraction}`.replace("%PAGE%", `${this.convertLabel(this.STATE.page)}`).replace(
        "%LAST_PAGE%",
        `${this.convertLabel(this.SETTINGS.lastPage)}`
      )
    ] : e = this.STATE.pages.map(
      (a) => `${this.STRUCTURE.page_value}`.replace("%LABEL%", `${this.convertLabel(a)}`).replace("%VALUE%", `${a}`).replace("%LINK%", "#")
    ), this.SETTINGS.typePagination === "basic" || this.SETTINGS.typePagination === "fraction-basic" ? e = this.initBasicButton(e) : this.SETTINGS.typePagination === "maximum" || this.SETTINGS.typePagination === "fraction-maximum" ? e = this.initMaximumButton(e) : (this.SETTINGS.typePagination === "full" || this.SETTINGS.typePagination === "fraction-full" || this.SETTINGS.typePagination === "full-reverse" || this.SETTINGS.typePagination === "fraction-full-reverse") && (e = this.initFullButton(e)), t.innerHTML = `${this.STRUCTURE.base}`.replace(
      "%PAGINATION%",
      e.join("")
    ), this.reference.pagination = t.children[0];
  }
  makeBasicButton() {
    let t = `${this.STRUCTURE.button_page_prev}`.replace(
      "%BUTTON_LABEL%",
      this.INTERFACE.button_prev.label
    ), e = `${this.STRUCTURE.button_page_next}`.replace(
      "%BUTTON_LABEL%",
      this.INTERFACE.button_next.label
    );
    return this.INTERFACE.button_prev.icon_left ? t = t.replace(
      "%ICON_LEFT%",
      `<i class="${this.INTERFACE.button_prev.icon_left}"></i>`
    ) : t = t.replace("%ICON_LEFT%", ""), this.INTERFACE.button_prev.icon_right ? t = t.replace(
      "%ICON_RIGHT%",
      `<i class="${this.INTERFACE.button_prev.icon_right}"></i>`
    ) : t = t.replace("%ICON_RIGHT%", ""), this.INTERFACE.button_next.icon_left ? e = e.replace(
      "%ICON_LEFT%",
      `<i class="${this.INTERFACE.button_next.icon_left}"></i>`
    ) : e = e.replace("%ICON_LEFT%", ""), this.INTERFACE.button_prev.icon_right ? e = e.replace(
      "%ICON_RIGHT%",
      `<i class="${this.INTERFACE.button_next.icon_right}"></i>`
    ) : e = e.replace("%ICON_RIGHT%", ""), {
      buttonPrev: t,
      buttonNext: e
    };
  }
  makeMaximumButton() {
    let t = `${this.STRUCTURE.button_page_first}`.replace(
      "%BUTTON_LABEL%",
      this.INTERFACE.button_first.label
    ), e = `${this.STRUCTURE.button_page_last}`.replace(
      "%BUTTON_LABEL%",
      this.INTERFACE.button_last.label
    );
    return this.INTERFACE.button_first.icon_left ? t = t.replace(
      "%ICON_LEFT%",
      `<i class="${this.INTERFACE.button_first.icon_left}"></i>`
    ) : t = t.replace("%ICON_LEFT%", ""), this.INTERFACE.button_first.icon_right ? t = t.replace(
      "%ICON_RIGHT%",
      `<i class="${this.INTERFACE.button_first.icon_right}"></i>`
    ) : t = t.replace("%ICON_RIGHT%", ""), this.INTERFACE.button_last.icon_left ? e = e.replace(
      "%ICON_LEFT%",
      `<i class="${this.INTERFACE.button_last.icon_left}"></i>`
    ) : e = e.replace("%ICON_LEFT%", ""), this.INTERFACE.button_last.icon_right ? e = e.replace(
      "%ICON_RIGHT%",
      `<i class="${this.INTERFACE.button_last.icon_right}"></i>`
    ) : e = e.replace("%ICON_RIGHT%", ""), {
      buttonFirst: t,
      buttonLast: e
    };
  }
  initBasicButton(t) {
    const { buttonPrev: e, buttonNext: a } = this.makeBasicButton();
    return t.unshift(e), t.push(a), t;
  }
  initMaximumButton(t) {
    const { buttonFirst: e, buttonLast: a } = this.makeMaximumButton();
    return t.unshift(e), t.push(a), t;
  }
  initFullButton(t) {
    const { buttonPrev: e, buttonNext: a } = this.makeBasicButton(), { buttonFirst: i, buttonLast: n } = this.makeMaximumButton();
    return this.SETTINGS.typePagination.includes("reverse") ? (t.unshift(e, i), t.push(n, a)) : (t.unshift(i, e), t.push(a, n)), t;
  }
  // private initSeparator(pagination: string[]) {
  // }
  render() {
    this.reference.container && this.reference.pagination && (this.reference.container.classList.add("lara-pagination-container"), this.reference.container.appendChild(this.reference.pagination), this.selectPage(this.STATE.page));
  }
  behaviorBasicButton() {
    if (!this.reference.container)
      return;
    const t = this.reference.container.querySelector(
      '[data-page-button="prev"]'
    ), e = this.reference.container.querySelector(
      '[data-page-button="next"]'
    );
    this.SETTINGS.behaviorBasicButton === "hidden" && (this.STATE.page !== 1 ? t.removeAttribute("hidden") : t.setAttribute("hidden", ""), this.STATE.page !== this.SETTINGS.lastPage ? e.removeAttribute("hidden") : e.setAttribute("hidden", "")), this.SETTINGS.behaviorBasicButton === "disabled" && (this.STATE.page === 1 ? t.classList.add("lara-pagination-disabled") : t.classList.contains("lara-pagination-disabled") && t.classList.remove("lara-pagination-disabled"), this.STATE.page === this.SETTINGS.lastPage ? e.classList.add("lara-pagination-disabled") : e.classList.contains("lara-pagination-disabled") && e.classList.remove("lara-pagination-disabled"));
  }
  behaviorMaximumButton() {
    if (!this.reference.container)
      return;
    const t = this.reference.container.querySelector(
      '[data-page-button="first"]'
    ), e = this.reference.container.querySelector(
      '[data-page-button="last"]'
    );
    this.SETTINGS.behaviorMaximumButton === "hidden" && (this.STATE.page !== 1 ? t.removeAttribute("hidden") : t.setAttribute("hidden", ""), this.STATE.page !== this.SETTINGS.lastPage ? e.removeAttribute("hidden") : e.setAttribute("hidden", "")), this.SETTINGS.behaviorMaximumButton === "disabled" && (this.STATE.page === 1 ? t.classList.add("lara-pagination-disabled") : t.classList.contains("lara-pagination-disabled") && t.classList.remove("lara-pagination-disabled"), this.STATE.page === this.SETTINGS.lastPage ? e.classList.add("lara-pagination-disabled") : e.classList.contains("lara-pagination-disabled") && e.classList.remove("lara-pagination-disabled"));
  }
  handleClickItems() {
    if (!this.reference.container)
      return;
    this.reference.container.querySelectorAll("[data-page-item]").forEach((e) => {
      e.addEventListener("click", (a) => {
        a.preventDefault(), !e.getAttribute("data-page-selected") && (e instanceof HTMLElement && this.selectPage(Number(e.dataset.pageValue)), this.LISTENERS.change({
          page: this.STATE.page,
          action: "change",
          total: this.SETTINGS.lastPage
        }));
      });
    });
  }
  handleClickBasicButton() {
    if (!this.reference.container)
      return;
    const t = this.reference.container.querySelector(
      '[data-page-button="prev"]'
    ), e = this.reference.container.querySelector(
      '[data-page-button="next"]'
    );
    t.addEventListener("click", (a) => {
      a.preventDefault(), this.prevPage();
    }), e.addEventListener("click", (a) => {
      a.preventDefault(), this.nextPage();
    });
  }
  handleClickMaximumButton() {
    if (!this.reference.container)
      return;
    const t = this.reference.container.querySelector(
      '[data-page-button="first"]'
    ), e = this.reference.container.querySelector(
      '[data-page-button="last"]'
    );
    t.addEventListener("click", (a) => {
      a.preventDefault(), this.firstPage();
    }), e.addEventListener("click", (a) => {
      a.preventDefault(), this.lastPage();
    });
  }
  // private handleClickSeparator() {
  // }
  changeNumberPagination() {
    if (!this.reference.container)
      return;
    this.reference.container.querySelectorAll("[data-page-item]").forEach((e, a) => {
      const i = e.children[0].children[0];
      i instanceof HTMLElement && (i.innerText = `${this.convertLabel(this.STATE.pages[a])}`), e.setAttribute("data-page-value", `${this.STATE.pages[a]}`);
    });
  }
  changeStateInterface() {
    (this.SETTINGS.typePagination === "basic" || this.SETTINGS.typePagination === "fraction-basic") && this.behaviorBasicButton(), (this.SETTINGS.typePagination === "maximum" || this.SETTINGS.typePagination === "fraction-maximum") && this.behaviorMaximumButton(), (this.SETTINGS.typePagination === "full" || this.SETTINGS.typePagination === "fraction-full" || this.SETTINGS.typePagination === "full-reverse" || this.SETTINGS.typePagination === "fraction-full-reverse") && (this.behaviorBasicButton(), this.behaviorMaximumButton());
  }
  loadStylePagination() {
    const t = document.createElement("style"), e = document.querySelector("head");
    t.innerHTML = `
      .lara-pagination-container {
          display: flex;
      }
      .lara-pagination {
          background: #eee;
          justify-content: space-between;
          align-items: center;
          border-radius: 10px;
          display: flex;
          box-sizing: border-box;
          padding: 10px;
          gap: 8px;
      }
      .lara-pagination li {
          list-style: none;
      }
  
      .lara-pagination-items a{
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fefefe;
          border-radius: 8px;
          color: #000;
          text-decoration: none;
          min-width: 30px;
          min-height: 30px;
          padding: 6px;
          box-sizing: border-box;
      }
  
      .lara-pagination-item-active a {
          background: lightblue !important;
      }
  
      .lara-pagination-disabled {
          opacity: .5;
          cursor: not-allowed !important;
      }
  
      .lara-pagination-disabled a{
          cursor: not-allowed !important;
      }
  
      .lara-pagination-button a{
          text-decoration: none;
      }
      `, e && e.appendChild(t);
  }
  getPositionPage(t) {
    var e;
    return (e = this.STATE.pages.map((a, i) => ({ page: a, position: i })).find((a) => a.page === t)) == null ? void 0 : e.position;
  }
  transformArrayPages(t) {
    this.STATE.page = t;
    const e = t - 1, a = this.STATE.pages[this.SETTINGS.breakPage - 1];
    if (t === a)
      return this.getPositionPage(t);
    let i = e + 1 - a;
    if (i = i === 0 ? i + 1 : i, e > a - 1)
      for (let n = 1; n <= i && this.STATE.pages.at(-1) !== this.SETTINGS.lastPage; ++n)
        this.STATE.pages.shift(), this.STATE.pages.push(
          this.STATE.pages[this.STATE.pages.length - 2] + 2
        );
    else
      for (let n = i; n < 0 && this.STATE.pages[0] !== 1; ++n)
        this.STATE.pages.pop(), this.STATE.pages.unshift(this.STATE.pages[0] - 1);
    return t > this.STATE.pages.at(-1) ? this.STATE.pages.length - 1 : this.getPositionPage(t);
  }
  convertLabel(t) {
    if (this.SETTINGS.stylePagination === "number")
      return t;
    if (this.SETTINGS.stylePagination === "letter")
      return this.convertNumberToAlphabet(t);
    if (this.SETTINGS.stylePagination === "romano")
      return this.convertNumberToRoman(t);
  }
  convertNumberToRoman(t) {
    if (isNaN(t))
      return NaN;
    const e = String(+t).split(""), a = [
      "",
      "C",
      "CC",
      "CCC",
      "CD",
      "D",
      "DC",
      "DCC",
      "DCCC",
      "CM",
      "",
      "X",
      "XX",
      "XXX",
      "XL",
      "L",
      "LX",
      "LXX",
      "LXXX",
      "XC",
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX"
    ];
    let i = "", n = 3;
    for (; n--; )
      i = (a[+e.pop() + n * 10] || "") + i;
    return Array(+e.join("") + 1).join("M") + i;
  }
  convertNumberToAlphabet(t) {
    return (t + 9).toString(36).toUpperCase();
  }
}
export {
  p as LaraPagination
};
