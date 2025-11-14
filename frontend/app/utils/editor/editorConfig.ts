export const editorConfig = {
  height: "100%",
  width: "100%",
  storageManager: {
    type: "local",
    autosave: true,
    autoload: true,
    stepsBeforeSave: 1,
  },
  blockManager: {
    appendTo: ".blocks-container",
  },
  layerManager: {
    appendTo: ".layers-container",
    show: false,
  },
  canvas: {
    styles: [],
  },
  deviceManager: {
    devices: [
      {
        name: "Desktop",
        width: "",
      },
      {
        name: "Tablet",
        width: "768px",
        widthMedia: "992px",
      },
      {
        name: "Mobile",
        width: "320px",
        widthMedia: "768px",
      },
    ],
  },
  panels: {
    defaults: [],
  },
};

export const rowStyle = `
  .row {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: nowrap;
    padding: 10px;
  }
  .cell {
    min-height: 75px;
    flex-grow: 1;
    flex-basis: 100%;
    padding: 10px;
  }
`;
