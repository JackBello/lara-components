import { LaraPagination } from "../lib/main";

const mainPagination = new LaraPagination("main-pagination", {
    stylePagination: "number",
    numberPages: 6,
    lastPage: 25,
    typePagination: "basic",
    behaviorBasicButton: "disabled",
    loadStylePagination: false
});

mainPagination.setInterface({
  button_prev: {
    label: "Prev Page",
    icon_left: "",
    icon_right: ""
  },
  button_next: {
    label: "Prev Page",
    icon_left: "",
    icon_right: ""
  }
})

mainPagination.selectPage(1);