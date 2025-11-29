import React from "react";
import EmblaCarousel from "./EmblaCarousel";
import Header from "./Header";
import Footer from "./Footer";

const OPTIONS = { dragFree: true, loop: true };

// Define an array of slide objects with iframe content
const SLIDES = [
  {
    image:
      "https://img07.shop-pro.jp/PA01372/068/product/181372975_th.jpg?cmsp_timestamp=20240615191102",
    title: "",
    description: "Description for the fourth slide.",
  },
  {
    image:
      "https://img07.shop-pro.jp/PA01372/068/product/176737726_th.jpg?cmsp_timestamp=20230823174801",
    title: "",
    description: "Description for the third slide.",
  },
  {
    image:
      "https://img07.shop-pro.jp/PA01372/068/product/187449536_th.jpg?cmsp_timestamp=20250704153601",
    title: "",
    description: "Description for the third slide.",
  },
  {
    image:
      "https://img07.shop-pro.jp/PA01372/068/product/181538555_th.jpg?cmsp_timestamp=20240627145631",
    title: "",
    description: "Description for the fourth slide.",
  },
  {
    image:
      "https://img07.shop-pro.jp/PA01372/068/product/167868112_th.jpg?cmsp_timestamp=20230425171145",
    title: "",
    description: "Description for the fifth slide.",
  },
  {
    image:
      "https://img07.shop-pro.jp/PA01372/068/product/181372975_th.jpg?cmsp_timestamp=20240615191102",
    title: "",
    description: "Description for the fourth slide.",
  },
  {
    image:
      "https://img07.shop-pro.jp/PA01372/068/product/176737726_th.jpg?cmsp_timestamp=20230823174801",
    title: "",
    description: "Description for the third slide.",
  },
  {
    image:
      "https://img07.shop-pro.jp/PA01372/068/product/187449536_th.jpg?cmsp_timestamp=20250704153601",
    title: "",
    description: "Description for the third slide.",
  },
  {
    image:
      "https://img07.shop-pro.jp/PA01372/068/product/181538555_th.jpg?cmsp_timestamp=20240627145631",
    title: "",
    description: "Description for the fourth slide.",
  },
  {
    image:
      "https://img07.shop-pro.jp/PA01372/068/product/167868112_th.jpg?cmsp_timestamp=20230425171145",
    title: "",
    description: "Description for the fifth slide.",
  },
];

const App = () => (
  <>
    {/* Uncomment the lines below if you have header and footer components */}
    {/* <Header /> */}
    <EmblaCarousel slides={SLIDES} options={OPTIONS} />
    {/* <Footer /> */}
  </>
);

export default App;
