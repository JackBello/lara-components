export class LaraPagination {
    private STRUCTURE = {
        base: `<ul class="lara-pagination">%PAGINATION%</ul>`,
        page_fraction: `<li class="lara-pagination-fraction" data-page-fraction> <span>%PAGE%</span> <span>/</span> <span>%LAST_PAGE%</span> </li>`,
        page_value: `<li class="lara-pagination-items" data-page-value="%VALUE%" data-page-item><a href="%LINK%"><span>%LABEL%</span></a></li>`,
        page_first: `<li class="lara-pagination-items" data-page-value="first"><a href="%LINK%"><span>%LABEL%</span></a></li>`,
        page_last: `<li class="lara-pagination-items" data-page-value="last"><a href="%LINK%"><span>%LABEL%</span></a></li>`,
        before_separator: `<li class="lara-pagination-separator" data-page-separator="before">%SEPARATOR%</li>`,
        after_separator: `<li class="lara-pagination-separator" data-page-separator="after">%SEPARATOR%</li>`,
        button_page_next: `<li class="lara-pagination-button" data-page-button="next"><a href="#">%ICON_LEFT% <span>%BUTTON_LABEL%</span> %ICON_RIGHT%</a></li>`,
        button_page_prev: `<li class="lara-pagination-button" data-page-button="prev"><a href="#">%ICON_LEFT% <span>%BUTTON_LABEL%</span> %ICON_RIGHT%</a></li>`,
        button_page_first: `<li class="lara-pagination-button" data-page-button="first"><a href="#">%ICON_LEFT% <span>%BUTTON_LABEL%</span> %ICON_RIGHT%</a></li>`,
        button_page_last: `<li class="lara-pagination-button" data-page-button="last"><a href="#">%ICON_LEFT% <span>%BUTTON_LABEL%</span> %ICON_RIGHT%</a></li>`,
    };

    private INTERFACE = {
        button_next: {
            label: "Next",
            icon_left: "",
            icon_right: "",
        },
        button_prev: {
            label: "Previous",
            icon_left: "",
            icon_right: "",
        },
        button_first: {
            label: "First",
            icon_left: "",
            icon_right: "",
        },
        button_last: {
            label: "Last",
            icon_left: "",
            icon_right: "",
        },
        separator: "...",
    } as {
        button_next: {
            label: string;
            icon_left: string;
            icon_right: string;
        };
        button_prev: {
            label: string;
            icon_left: string;
            icon_right: string;
        };
        button_first: {
            label: string;
            icon_left: string;
            icon_right: string;
        };
        button_last: {
            label: string;
            icon_left: string;
            icon_right: string;
        };
        separator: string;
    };

    private SETTINGS = {
        loadStylePagination: true,
        stylePagination: "number",
        typePagination: "single",
        numberPages: 0,
        breakPage: 0,
        lastPage: 0,
        behaviorBasicButton: "disabled",
        behaviorMaximumButton: "disabled",
        disable: false,
    } as {
        loadStylePagination: boolean;
        stylePagination: "number" | "letter" | "romano";
        typePagination:
        | "separator"
        | "fraction" // list
        | "single" // list
        | "basic" // list
        | "fraction-basic" // list
        | "maximum" // list
        | "fraction-maximum" // list
        | "full" // list
        | "fraction-full" //list
        | "full-reverse" // list
        | "fraction-full-reverse"; // list
        // | "separator-basic"
        // | "separator-full";
        numberPages: number;
        breakPage: number;
        lastPage: number;
        behaviorBasicButton: "hidden" | "disabled";
        behaviorMaximumButton: "hidden" | "disabled";
        disable: boolean;
    };

    private STATE = {
        page: 1,
        pages: [],
    } as {
        page: number;
        pages: number[];
    };

    private reference = {
        container: undefined,
        pagination: undefined,
    } as {
        container: undefined | HTMLElement;
        pagination: undefined | HTMLElement;
    };

    private LISTENERS = {
        prev: () => {},
        next: () => {},
        first: () => {},
        last: () => {},
        change: () => {}
    } as {
        [key: string]: (...args:any[]) => void
        prev: (...args:any[]) => void
        next: (...args:any[]) => void
        first: (...args:any[]) => void
        last: (...args:any[]) => void
        change: (...args:any[]) => void
    }

    public set onPrev(listen: (event: any) => void) {
        this.LISTENERS.prev = listen;
    }

    public set onNext(listen: (event: any) => void) {
        this.LISTENERS.next = listen;
    }

    public set onFirst(listen: (event: any) => void) {
        this.LISTENERS.first = listen;
    }

    public set onLast(listen: (event: any) => void) {
        this.LISTENERS.last = listen;
    }

    public set onChange(listen: (event: any) => void) {
        this.LISTENERS.change = listen;
    }

    constructor(
        selector: string,
        options?: {
            loadStylePagination?: boolean;
            stylePagination?: "number" | "letter" | "romano";
            typePagination?:
            | "separator"
            | "fraction"
            | "single"
            | "basic"
            | "fraction-basic"
            | "maximum"
            | "fraction-maximum"
            | "full"
            | "fraction-full"
            | "full-reverse"
            | "fraction-full-reverse";
            // | "separator-basic"
            // | "separator-full";
            numberPages?: number;
            breakPage?: number;
            lastPage?: number;
            behaviorBasicButton?: "hidden" | "disabled";
            behaviorMaximumButton?: "hidden" | "disabled";
            disable?: boolean;
        }
    ) {
        this.SETTINGS = {
            ...{
                behaviorBasicButton: "disabled",
                behaviorMaximumButton: "disabled",
                breakPage: 3,
                lastPage: 30,
                loadStylePagination: true,
                numberPages: 5,
                stylePagination: "number",
                typePagination: "single",
                disable: false,
            },
            ...options,
        };

        this.reference.container = document.querySelector(
            `[data-lara-id="${selector}"]`
        ) as HTMLElement;

        this.STATE.pages = Array.from(
            { length: this.SETTINGS.numberPages },
            (_, index) => index + 1
        );

        if (this.SETTINGS.loadStylePagination) {
            this.loadStylePagination();
        }

        this.initPagination();
        this.render();
        if (!this.SETTINGS.typePagination.includes("fraction")) {
            this.handleClickItems();
        }
        if (
            this.SETTINGS.typePagination === "basic" ||
            this.SETTINGS.typePagination === "fraction-basic"
        ) {
            this.handleClickBasicButton();
        }
        if (
            this.SETTINGS.typePagination === "maximum" ||
            this.SETTINGS.typePagination === "fraction-maximum"
        ) {
            this.handleClickMaximumButton();
        }
        if (
            this.SETTINGS.typePagination === "full" ||
            this.SETTINGS.typePagination === "fraction-full" ||
            this.SETTINGS.typePagination === "full-reverse" ||
            this.SETTINGS.typePagination === "fraction-full-reverse"
        ) {
            this.handleClickBasicButton();
            this.handleClickMaximumButton();
        }
    }

    public setInterface(options?: {
        button_next?: {
            label: string;
            icon_left: string;
            icon_right: string;
        };
        button_prev?: {
            label: string;
            icon_left: string;
            icon_right: string;
        };
        button_first?: {
            label: string;
            icon_left: string;
            icon_right: string;
        };
        button_last?: {
            label: string;
            icon_left: string;
            icon_right: string;
        };
        separator?: string;
    }) {
        if (!this.reference.container) return;

        this.INTERFACE = {
            ...{
                button_next: {
                    label: "Prev",
                    icon_left: "",
                    icon_right: "",
                },
                button_prev: {
                    label: "Next",
                    icon_left: "",
                    icon_right: "",
                },
                button_first: {
                    label: "First",
                    icon_left: "",
                    icon_right: "",
                },
                button_last: {
                    label: "Last",
                    icon_left: "",
                    icon_right: "",
                },
                separator: "...",
            },
            ...options,
        };

        // const buttonPrev = this.reference.container.querySelector(
        //     `[data-page-button="prev"]`
        // ) as HTMLElement;
        // const buttonNext = this.reference.container.querySelector(
        //     `[data-page-button="next"]`
        // ) as HTMLElement;
        // const buttonFirst = this.reference.container.querySelector(
        //     `[data-page-button="first"]`
        // ) as HTMLElement;
        // const buttonLast = this.reference.container.querySelector(
        //     `[data-page-button="last"]`
        // ) as HTMLElement;
    }

    public getPage() {
        return this.STATE.page;
    }

    public getLastPage() {
        return this.SETTINGS.lastPage;
    }

    public selectPage(page: number) {
        if (!this.reference.container) return;

        if (!this.SETTINGS.typePagination.includes("fraction")) {
            const paginationItems =
                this.reference.container.querySelectorAll(`[data-page-item]`);

            paginationItems.forEach((element) => {
                element.classList.remove("lara-pagination-item-active");
                element.removeAttribute("data-page-selected");
            });

            const pageSelect = this.transformArrayPages(page);

            if (pageSelect !== undefined) {
                paginationItems[pageSelect].classList.add(
                    "lara-pagination-item-active"
                );
                paginationItems[pageSelect].setAttribute("data-page-selected", "true");
            }

            this.changeNumberPagination();
            this.changeStateInterface();

            return;
        }

        const paginationFraction = this.reference.container.querySelector(
            `[data-page-fraction]`
        ) as HTMLElement;
        const child = paginationFraction.children[0] as HTMLElement;

        const pageSelect = this.transformArrayPages(page);

        if (pageSelect !== undefined) {
            child.innerText = `${this.convertLabel(this.STATE.pages[pageSelect])}`;
        }

        this.changeStateInterface();
    }

    public prevPage() {
        if (this.STATE.page === 1) return;

        this.LISTENERS.prev({
            old_page: this.STATE.page,
            current_page: this.STATE.page-1,
            action: "prev",
            total: this.SETTINGS.lastPage 
        });

        this.STATE.page--;
        this.selectPage(this.STATE.page);
    }

    public nextPage() {
        if (this.STATE.page === this.SETTINGS.lastPage) return;

        this.LISTENERS.next({
            old_page: this.STATE.page,
            current_page: this.STATE.page+1,
            action: "next",
            total: this.SETTINGS.lastPage 
        });

        this.STATE.page++;
        this.selectPage(this.STATE.page);
    }

    public firstPage() {
        if (this.STATE.page === 1) return;

        this.LISTENERS.first({
            old_page: this.STATE.page,
            action: "first",
            total: this.SETTINGS.lastPage 
        });

        this.STATE.page = 1;
        this.selectPage(this.STATE.page);
    }

    public lastPage() {
        if (this.STATE.page === this.SETTINGS.lastPage) return;

        this.LISTENERS.next({
            old_page: this.STATE.page,
            action: "last",
            total: this.SETTINGS.lastPage 
        });

        this.STATE.page = this.SETTINGS.lastPage;
        this.selectPage(this.STATE.page);
    }

    private initPagination() {
        const virtualDOM = document.createElement("div");

        let pagination = [];

        if (this.SETTINGS.typePagination.includes("fraction")) {
            pagination = [
                `${this.STRUCTURE.page_fraction}`
                    .replace("%PAGE%", `${this.convertLabel(this.STATE.page)}`)
                    .replace(
                        "%LAST_PAGE%",
                        `${this.convertLabel(this.SETTINGS.lastPage)}`
                    ),
            ];
        } else {
            pagination = this.STATE.pages.map((page) =>
                `${this.STRUCTURE.page_value}`
                    .replace("%LABEL%", `${this.convertLabel(page)}`)
                    .replace("%VALUE%", `${page}`)
                    .replace("%LINK%", "#")
            );
        }

        if (
            this.SETTINGS.typePagination === "basic" ||
            this.SETTINGS.typePagination === "fraction-basic"
        ) {
            pagination = this.initBasicButton(pagination);
        } else if (
            this.SETTINGS.typePagination === "maximum" ||
            this.SETTINGS.typePagination === "fraction-maximum"
        ) {
            pagination = this.initMaximumButton(pagination);
        } else if (
            this.SETTINGS.typePagination === "full" ||
            this.SETTINGS.typePagination === "fraction-full" ||
            this.SETTINGS.typePagination === "full-reverse" ||
            this.SETTINGS.typePagination === "fraction-full-reverse"
        ) {
            pagination = this.initFullButton(pagination);
        }

        virtualDOM.innerHTML = `${this.STRUCTURE.base}`.replace(
            "%PAGINATION%",
            pagination.join("")
        );

        this.reference.pagination = virtualDOM.children[0] as HTMLElement;
    }

    private makeBasicButton() {
        let buttonPrev = `${this.STRUCTURE.button_page_prev}`.replace(
            "%BUTTON_LABEL%",
            this.INTERFACE.button_prev.label
        );
        let buttonNext = `${this.STRUCTURE.button_page_next}`.replace(
            "%BUTTON_LABEL%",
            this.INTERFACE.button_next.label
        );

        if (this.INTERFACE.button_prev.icon_left) {
            buttonPrev = buttonPrev.replace(
                "%ICON_LEFT%",
                `<i class="${this.INTERFACE.button_prev.icon_left}"></i>`
            );
        } else buttonPrev = buttonPrev.replace("%ICON_LEFT%", "");

        if (this.INTERFACE.button_prev.icon_right) {
            buttonPrev = buttonPrev.replace(
                "%ICON_RIGHT%",
                `<i class="${this.INTERFACE.button_prev.icon_right}"></i>`
            );
        } else buttonPrev = buttonPrev.replace("%ICON_RIGHT%", "");

        if (this.INTERFACE.button_next.icon_left) {
            buttonNext = buttonNext.replace(
                "%ICON_LEFT%",
                `<i class="${this.INTERFACE.button_next.icon_left}"></i>`
            );
        } else buttonNext = buttonNext.replace("%ICON_LEFT%", "");

        if (this.INTERFACE.button_prev.icon_right) {
            buttonNext = buttonNext.replace(
                "%ICON_RIGHT%",
                `<i class="${this.INTERFACE.button_next.icon_right}"></i>`
            );
        } else buttonNext = buttonNext.replace("%ICON_RIGHT%", "");

        return {
            buttonPrev,
            buttonNext,
        };
    }

    private makeMaximumButton() {
        let buttonFirst = `${this.STRUCTURE.button_page_first}`.replace(
            "%BUTTON_LABEL%",
            this.INTERFACE.button_first.label
        );
        let buttonLast = `${this.STRUCTURE.button_page_last}`.replace(
            "%BUTTON_LABEL%",
            this.INTERFACE.button_last.label
        );

        if (this.INTERFACE.button_first.icon_left) {
            buttonFirst = buttonFirst.replace(
                "%ICON_LEFT%",
                `<i class="${this.INTERFACE.button_first.icon_left}"></i>`
            );
        } else buttonFirst = buttonFirst.replace("%ICON_LEFT%", "");

        if (this.INTERFACE.button_first.icon_right) {
            buttonFirst = buttonFirst.replace(
                "%ICON_RIGHT%",
                `<i class="${this.INTERFACE.button_first.icon_right}"></i>`
            );
        } else buttonFirst = buttonFirst.replace("%ICON_RIGHT%", "");

        if (this.INTERFACE.button_last.icon_left) {
            buttonLast = buttonLast.replace(
                "%ICON_LEFT%",
                `<i class="${this.INTERFACE.button_last.icon_left}"></i>`
            );
        } else buttonLast = buttonLast.replace("%ICON_LEFT%", "");

        if (this.INTERFACE.button_last.icon_right) {
            buttonLast = buttonLast.replace(
                "%ICON_RIGHT%",
                `<i class="${this.INTERFACE.button_last.icon_right}"></i>`
            );
        } else buttonLast = buttonLast.replace("%ICON_RIGHT%", "");

        return {
            buttonFirst,
            buttonLast,
        };
    }

    private initBasicButton(pagination: string[]) {
        const { buttonPrev, buttonNext } = this.makeBasicButton();

        pagination.unshift(buttonPrev);
        pagination.push(buttonNext);

        return pagination;
    }

    private initMaximumButton(pagination: string[]) {
        const { buttonFirst, buttonLast } = this.makeMaximumButton();

        pagination.unshift(buttonFirst);
        pagination.push(buttonLast);

        return pagination;
    }

    private initFullButton(pagination: string[]) {
        const { buttonPrev, buttonNext } = this.makeBasicButton();
        const { buttonFirst, buttonLast } = this.makeMaximumButton();

        if (this.SETTINGS.typePagination.includes("reverse")) {
            pagination.unshift(buttonPrev, buttonFirst);
            pagination.push(buttonLast, buttonNext);
        } else {
            pagination.unshift(buttonFirst, buttonPrev);
            pagination.push(buttonNext, buttonLast);
        }

        return pagination;
    }

    // private initSeparator(pagination: string[]) {

    // }

    private render() {
        if (!this.reference.container) return;
        if (!this.reference.pagination) return;

        this.reference.container.classList.add("lara-pagination-container");

        this.reference.container.appendChild(this.reference.pagination);

        this.selectPage(this.STATE.page);
    }

    private behaviorBasicButton() {
        if (!this.reference.container) return;

        const buttonPrev = this.reference.container.querySelector(
            `[data-page-button="prev"]`
        ) as HTMLElement;
        const buttonNext = this.reference.container.querySelector(
            `[data-page-button="next"]`
        ) as HTMLElement;

        if (this.SETTINGS.behaviorBasicButton === "hidden") {
            if (this.STATE.page !== 1) buttonPrev.removeAttribute("hidden");
            else buttonPrev.setAttribute("hidden", "");

            if (this.STATE.page !== this.SETTINGS.lastPage) {
                buttonNext.removeAttribute("hidden");
            } else buttonNext.setAttribute("hidden", "");
        }

        if (this.SETTINGS.behaviorBasicButton === "disabled") {
            if (this.STATE.page === 1) {
                buttonPrev.classList.add("lara-pagination-disabled");
            } else if (buttonPrev.classList.contains("lara-pagination-disabled")) {
                buttonPrev.classList.remove("lara-pagination-disabled");
            }

            if (this.STATE.page === this.SETTINGS.lastPage) {
                buttonNext.classList.add("lara-pagination-disabled");
            } else if (buttonNext.classList.contains("lara-pagination-disabled")) {
                buttonNext.classList.remove("lara-pagination-disabled");
            }
        }
    }

    private behaviorMaximumButton() {
        if (!this.reference.container) return;

        const buttonFirst = this.reference.container.querySelector(
            `[data-page-button="first"]`
        ) as HTMLElement;
        const buttonLast = this.reference.container.querySelector(
            `[data-page-button="last"]`
        ) as HTMLElement;

        if (this.SETTINGS.behaviorMaximumButton === "hidden") {
            if (this.STATE.page !== 1) buttonFirst.removeAttribute("hidden");
            else buttonFirst.setAttribute("hidden", "");

            if (this.STATE.page !== this.SETTINGS.lastPage) {
                buttonLast.removeAttribute("hidden");
            } else buttonLast.setAttribute("hidden", "");
        }

        if (this.SETTINGS.behaviorMaximumButton === "disabled") {
            if (this.STATE.page === 1) {
                buttonFirst.classList.add("lara-pagination-disabled");
            } else if (buttonFirst.classList.contains("lara-pagination-disabled")) {
                buttonFirst.classList.remove("lara-pagination-disabled");
            }

            if (this.STATE.page === this.SETTINGS.lastPage) {
                buttonLast.classList.add("lara-pagination-disabled");
            } else if (buttonLast.classList.contains("lara-pagination-disabled")) {
                buttonLast.classList.remove("lara-pagination-disabled");
            }
        }
    }

    private handleClickItems() {
        if (!this.reference.container) return;

        const paginationItems =
            this.reference.container.querySelectorAll(`[data-page-item]`);

        paginationItems.forEach((element) => {
            element.addEventListener("click", (event) => {
                event.preventDefault();

                if (element.getAttribute("data-page-selected")) return;

                if (element instanceof HTMLElement) {
                    this.selectPage(Number(element.dataset.pageValue));
                }

                this.LISTENERS.change({
                    page: this.STATE.page,
                    action: "change",
                    total: this.SETTINGS.lastPage 
                });
            });
        });
    }

    private handleClickBasicButton() {
        if (!this.reference.container) return;

        const buttonPrev = this.reference.container.querySelector(
            `[data-page-button="prev"]`
        ) as HTMLElement;
        const buttonNext = this.reference.container.querySelector(
            `[data-page-button="next"]`
        ) as HTMLElement;

        buttonPrev.addEventListener("click", (event) => {
            event.preventDefault();

            this.prevPage();
        });

        buttonNext.addEventListener("click", (event) => {
            event.preventDefault();

            this.nextPage();
        });
    }

    private handleClickMaximumButton() {
        if (!this.reference.container) return;

        const buttonFirst = this.reference.container.querySelector(
            `[data-page-button="first"]`
        ) as HTMLElement;
        const buttonLast = this.reference.container.querySelector(
            `[data-page-button="last"]`
        ) as HTMLElement;

        buttonFirst.addEventListener("click", (event) => {
            event.preventDefault();

            this.firstPage();
        });

        buttonLast.addEventListener("click", (event) => {
            event.preventDefault();

            this.lastPage();
        });
    }

    // private handleClickSeparator() {

    // }

    private changeNumberPagination() {
        if (!this.reference.container) return;

        const paginationItems =
            this.reference.container.querySelectorAll(`[data-page-item]`);

        paginationItems.forEach((element, index) => {
            const child = element.children[0].children[0];

            if (child instanceof HTMLElement) {
                child.innerText = `${this.convertLabel(this.STATE.pages[index])}`;
            }
            element.setAttribute("data-page-value", `${this.STATE.pages[index]}`);
        });
    }

    private changeStateInterface() {
        if (
            this.SETTINGS.typePagination === "basic" ||
            this.SETTINGS.typePagination === "fraction-basic"
        ) {
            this.behaviorBasicButton();
        }
        if (
            this.SETTINGS.typePagination === "maximum" ||
            this.SETTINGS.typePagination === "fraction-maximum"
        ) {
            this.behaviorMaximumButton();
        }
        if (
            this.SETTINGS.typePagination === "full" ||
            this.SETTINGS.typePagination === "fraction-full" ||
            this.SETTINGS.typePagination === "full-reverse" ||
            this.SETTINGS.typePagination === "fraction-full-reverse"
        ) {
            this.behaviorBasicButton();
            this.behaviorMaximumButton();
        }
    }

    private loadStylePagination() {
        const stylePagination = document.createElement("style");
        const headDom = document.querySelector("head");

        stylePagination.innerHTML = `
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
      `;

        if (headDom) headDom.appendChild(stylePagination);
    }

    private getPositionPage(page: number) {
        return this.STATE.pages
            .map((page, position) => ({ page, position }))
            .find((object) => object.page === page)?.position;
    }

    private transformArrayPages(page: number) {
        this.STATE.page = page;

        const positionPage = page - 1;

        const stepPoint = this.STATE.pages[this.SETTINGS.breakPage - 1];

        if (page === stepPoint) return this.getPositionPage(page);

        let stepBack = positionPage + 1 - stepPoint;

        stepBack = stepBack === 0 ? stepBack + 1 : stepBack;

        if (positionPage > stepPoint - 1) {
            for (let index = 1; index <= stepBack; ++index) {
                if (this.STATE.pages.at(-1) === this.SETTINGS.lastPage) break;
                this.STATE.pages.shift();
                this.STATE.pages.push(
                    this.STATE.pages[this.STATE.pages.length - 2] + 2
                );
            }
        } else {
            for (let index = stepBack; index < 0; ++index) {
                if (this.STATE.pages[0] === 1) break;
                this.STATE.pages.pop();
                this.STATE.pages.unshift(this.STATE.pages[0] - 1);
            }
        }

        if (page > (this.STATE.pages.at(-1) as number)) {
            return this.STATE.pages.length - 1;
        }

        return this.getPositionPage(page);
    }

    private convertLabel(value: number) {
        if (this.SETTINGS.stylePagination === "number") return value;
        if (this.SETTINGS.stylePagination === "letter") {
            return this.convertNumberToAlphabet(value);
        }
        if (this.SETTINGS.stylePagination === "romano") {
            return this.convertNumberToRoman(value);
        }
    }

    private convertNumberToRoman(value: number) {
        if (isNaN(value)) return NaN;

        const digits = String(+value).split("");
        const key = [
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
            "IX",
        ];
        let roman = "";
        let index = 3;

        while (index--) {
            roman = (key[+(digits.pop() as string) + index * 10] || "") + roman;
        }

        return Array(+digits.join("") + 1).join("M") + roman;
    }

    private convertNumberToAlphabet(value: number) {
        return (value + 9).toString(36).toUpperCase();
    }
}
