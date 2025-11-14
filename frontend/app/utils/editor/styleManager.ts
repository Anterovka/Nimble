export const styleManagerSectors = [
  {
    name: "Размеры",
    open: false,
    buildProps: ["width", "min-height", "padding"],
    properties: [
      {
        type: "integer",
        name: "Ширина",
        property: "width",
        units: ["px", "%"],
        defaults: "auto",
        min: 0,
      },
    ],
  },
  {
    name: "Типографика",
    open: false,
    buildProps: ["font-family", "font-size", "font-weight", "letter-spacing", "color", "line-height", "text-align", "text-decoration", "text-shadow"],
    properties: [
      { name: "Шрифт", property: "font-family" },
      { name: "Размер", property: "font-size" },
      { name: "Толщина", property: "font-weight" },
      { name: "Цвет", property: "color" },
    ],
  },
  {
    name: "Отступы",
    open: false,
    buildProps: ["margin", "padding"],
    properties: [
      {
        name: "Внешние отступы",
        property: "margin",
        type: "composite",
        properties: [
          { name: "Верх", type: "integer", property: "margin-top", units: ["px", "em", "%"], defaults: "0" },
          { name: "Право", type: "integer", property: "margin-right", units: ["px", "em", "%"], defaults: "0" },
          { name: "Низ", type: "integer", property: "margin-bottom", units: ["px", "em", "%"], defaults: "0" },
          { name: "Лево", type: "integer", property: "margin-left", units: ["px", "em", "%"], defaults: "0" },
        ],
      },
    ],
  },
  {
    name: "Фон",
    open: false,
    buildProps: ["background-color", "background-image", "background-repeat", "background-position", "background-attachment", "background-size"],
    properties: [
      {
        name: "Цвет фона",
        property: "background-color",
        type: "color",
      },
    ],
  },
  {
    name: "Границы",
    open: false,
    buildProps: ["border", "border-radius"],
    properties: [
      {
        name: "Радиус",
        property: "border-radius",
        type: "integer",
        units: ["px", "%"],
        defaults: "0",
      },
    ],
  },
];

