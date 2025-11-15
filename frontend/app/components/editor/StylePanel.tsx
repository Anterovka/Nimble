// Панель редактирования стилей выбранного элемента
"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import type { Component, Editor } from "grapesjs";

interface StylePanelProps {
  editor: Editor | null;
}

interface StyleValues {
  width: string;
  height: string;
  minHeight: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  textAlign: string;
  lineHeight: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  backgroundColor: string;
  backgroundImage: string;
  gradientType: string;
  gradientColor1: string;
  gradientColor2: string;
  gradientDirection: string;
  borderWidth: string;
  borderStyle: string;
  borderColor: string;
  borderRadius: string;
  boxShadow: string;
  boxShadowX: string;
  boxShadowY: string;
  boxShadowBlur: string;
  boxShadowSpread: string;
  boxShadowColor: string;
  textShadow: string;
  opacity: string;
  transform: string;
}

type StyleKey = keyof StyleValues;

const defaultStyles: StyleValues = {
  width: "", height: "", minHeight: "",
  fontFamily: "", fontSize: "", fontWeight: "", color: "", textAlign: "left", lineHeight: "",
  marginTop: "", marginRight: "", marginBottom: "", marginLeft: "",
  paddingTop: "", paddingRight: "", paddingBottom: "", paddingLeft: "",
  backgroundColor: "", backgroundImage: "",
  gradientType: "", gradientColor1: "#6366f1", gradientColor2: "#8b5cf6", gradientDirection: "to right",
  borderWidth: "", borderStyle: "solid", borderColor: "", borderRadius: "",
  boxShadow: "", boxShadowX: "0", boxShadowY: "0", boxShadowBlur: "0", boxShadowSpread: "0", boxShadowColor: "#000000",
  textShadow: "", opacity: "1",
  transform: "",
};

const getStyleValue = (styles: Record<string, unknown>, property: string, fallback = ""): string => {
  const value = styles[property];
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  return fallback;
};

const SectionHeader = ({
  id,
  title,
  expanded,
  onToggle,
}: {
  id: string;
  title: string;
  expanded: boolean;
  onToggle: (id: string) => void;
}) => (
  <div className="styles-section-header" onClick={() => onToggle(id)}>
    <span className="styles-section-title">{title}</span>
    <svg
      className={`styles-section-arrow ${expanded ? "expanded" : ""}`}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
    >
      <path
        d="M4.5 3L7.5 6L4.5 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const InputWithUnit = ({
  label,
  value,
  property,
  units = ["px", "%"],
  onChange,
  showSlider = false,
  sliderMin = 0,
  sliderMax = 1000,
  sliderStep = 1,
}: {
  label: string;
  value: string;
  property: StyleKey;
  units?: string[];
  onChange: (property: StyleKey, value: string) => void;
  showSlider?: boolean;
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
}) => {
  const currentUnit = units.find((unit) => value.endsWith(unit)) || units[0];
  const numericPart = value.replace(/[^0-9.\-]/g, "");
  const numericValue = numericPart ? parseFloat(numericPart) : (showSlider ? sliderMin : 0);
  const isValidNumber = !isNaN(numericValue) && isFinite(numericValue);

  const [inputValue, setInputValue] = useState(numericPart);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      const newNumericPart = value.replace(/[^0-9.\-]/g, "");
      setInputValue(newNumericPart);
    }
  }, [value, isEditing]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const cleanedValue = rawValue.replace(/[^0-9.\-]/g, "");
    setInputValue(cleanedValue);
    setIsEditing(true);
    
    if (!cleanedValue.trim()) {
      onChange(property, "");
      return;
    }
    const valueWithUnit = `${cleanedValue}${currentUnit}`;
    onChange(property, valueWithUnit);
  };

  const handleInputFocus = () => {
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    if (inputValue.trim() && !isNaN(parseFloat(inputValue))) {
      onChange(property, `${inputValue}${currentUnit}`);
    } else if (!inputValue.trim()) {
      onChange(property, "");
    }
  };

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sliderValue = parseFloat(event.target.value);
    if (!isNaN(sliderValue) && isFinite(sliderValue)) {
      onChange(property, `${sliderValue}${currentUnit}`);
    }
  };

  return (
    <div className="styles-field">
      <label>{label}</label>
      {showSlider && (
        <div className="styles-slider-group">
          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            step={sliderStep}
            value={isValidNumber ? Math.max(sliderMin, Math.min(sliderMax, numericValue)) : sliderMin}
            onChange={handleSliderChange}
            className="styles-slider"
          />
          <span className="styles-slider-value">
            {isValidNumber ? Math.max(sliderMin, Math.min(sliderMax, numericValue)) : sliderMin}{currentUnit}
          </span>
        </div>
      )}
      <div className="styles-input-group">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="auto"
        />
        <select
          value={currentUnit}
          onChange={(e) => {
            const nextUnit = e.target.value;
            const numValue = inputValue.trim() || numericPart;
            if (numValue && !isNaN(parseFloat(numValue))) {
              const newValue = `${numValue}${nextUnit}`;
              onChange(property, newValue);
              setInputValue(numValue);
            } else {
              onChange(property, "");
              setInputValue("");
            }
          }}
        >
          {units.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const ColorInput = ({
  label,
  value,
  property,
  onChange,
}: {
  label: string;
  value: string;
  property: StyleKey;
  onChange: (property: StyleKey, value: string) => void;
}) => (
  <div className="styles-field">
    <label>{label}</label>
    <div className="styles-color-group">
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(property, e.target.value)}
        className="styles-color-input"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(property, e.target.value)}
        placeholder="#000000"
        className="styles-color-text"
      />
    </div>
  </div>
);


export function StylePanel({ editor }: StylePanelProps) {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [styles, setStyles] = useState<StyleValues>(defaultStyles);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    dimensions: true,
    typography: false,
    spacing: false,
    background: false,
    borders: false,
    shadows: false,
    effects: false,
  });
  const selectedComponentRef = useRef<Component | null>(null);
  const panelContentRef = useRef<HTMLDivElement>(null);

  const updateStyles = (component: Component | null) => {
    if (!component) {
      setStyles(defaultStyles);
      return;
    }

    const compStyles = (component.getStyle?.() ?? {}) as Record<string, unknown>;

    const boxShadowValue = getStyleValue(compStyles, "box-shadow");
    let boxShadowX = "0px", boxShadowY = "0px", boxShadowBlur = "0px", boxShadowSpread = "0px", boxShadowColor = "#000000";
    if (boxShadowValue && boxShadowValue !== "none") {
      const shadowMatch = boxShadowValue.match(/(-?\d+(?:\.\d+)?)(px|em|rem)?\s+(-?\d+(?:\.\d+)?)(px|em|rem)?\s+(-?\d+(?:\.\d+)?)(px|em|rem)?\s+(-?\d+(?:\.\d+)?)(px|em|rem)?\s*(.+)?/);
      if (shadowMatch) {
        const unit = shadowMatch[2] || shadowMatch[4] || shadowMatch[6] || shadowMatch[8] || "px";
        boxShadowX = `${shadowMatch[1] || "0"}${unit}`;
        boxShadowY = `${shadowMatch[3] || "0"}${unit}`;
        boxShadowBlur = `${shadowMatch[5] || "0"}${unit}`;
        boxShadowSpread = `${shadowMatch[7] || "0"}${unit}`;
        boxShadowColor = shadowMatch[9]?.trim() || "#000000";
      }
    }

    const textShadowValue = getStyleValue(compStyles, "text-shadow");

    setStyles({
      width: getStyleValue(compStyles, "width"),
      height: getStyleValue(compStyles, "height"),
      minHeight: getStyleValue(compStyles, "min-height"),
      fontFamily: getStyleValue(compStyles, "font-family"),
      fontSize: getStyleValue(compStyles, "font-size"),
      fontWeight: getStyleValue(compStyles, "font-weight"),
      color: getStyleValue(compStyles, "color"),
      textAlign: getStyleValue(compStyles, "text-align", "left"),
      lineHeight: getStyleValue(compStyles, "line-height"),
      marginTop: getStyleValue(compStyles, "margin-top"),
      marginRight: getStyleValue(compStyles, "margin-right"),
      marginBottom: getStyleValue(compStyles, "margin-bottom"),
      marginLeft: getStyleValue(compStyles, "margin-left"),
      paddingTop: getStyleValue(compStyles, "padding-top"),
      paddingRight: getStyleValue(compStyles, "padding-right"),
      paddingBottom: getStyleValue(compStyles, "padding-bottom"),
      paddingLeft: getStyleValue(compStyles, "padding-left"),
      backgroundColor: getStyleValue(compStyles, "background-color"),
      backgroundImage: getStyleValue(compStyles, "background-image"),
      ...(() => {
        const bgImage = getStyleValue(compStyles, "background-image", "");
        if (bgImage && bgImage.includes("gradient")) {
          const linearMatch = bgImage.match(/linear-gradient\(([^)]+)\)/);
          const radialMatch = bgImage.match(/radial-gradient\(([^)]+)\)/);
          if (linearMatch) {
            const content = linearMatch[1];
            const parts = content.split(",").map(s => s.trim());
            let direction = "to right";
            let color1 = "#6366f1";
            let color2 = "#8b5cf6";
            
            if (parts.length >= 3) {
              direction = parts[0];
              color1 = parts[1];
              color2 = parts[2];
            } else if (parts.length === 2) {
              color1 = parts[0];
              color2 = parts[1];
            }
            
            const dirMatch = direction.match(/to\s+(right|left|top|bottom|top\s+right|top\s+left|bottom\s+right|bottom\s+left)/);
            const angleMatch = direction.match(/(\d+)deg/);
            let dir = "to right";
            
            if (dirMatch) {
              dir = dirMatch[0];
            } else if (angleMatch) {
              const angle = parseInt(angleMatch[1]);
              if (angle === 0 || angle === 360) dir = "to top";
              else if (angle === 90) dir = "to right";
              else if (angle === 180) dir = "to bottom";
              else if (angle === 270) dir = "to left";
              else dir = direction;
            } else {
              dir = direction;
            }
            
            return {
              gradientType: "linear",
              gradientColor1: color1,
              gradientColor2: color2,
              gradientDirection: dir,
            };
          } else if (radialMatch) {
            const content = radialMatch[1];
            const parts = content.split(",").map(s => s.trim());
            let color1 = "#6366f1";
            let color2 = "#8b5cf6";
            
            if (parts.length >= 2) {
              color1 = parts[parts.length - 2];
              color2 = parts[parts.length - 1];
            }
            
            return {
              gradientType: "radial",
              gradientColor1: color1,
              gradientColor2: color2,
              gradientDirection: "center",
            };
          }
        }
        return {
          gradientType: "",
          gradientColor1: "#6366f1",
          gradientColor2: "#8b5cf6",
          gradientDirection: "to right",
        };
      })(),
      borderWidth: getStyleValue(compStyles, "border-width"),
      borderStyle: getStyleValue(compStyles, "border-style") || "solid",
      borderColor: getStyleValue(compStyles, "border-color"),
      borderRadius: getStyleValue(compStyles, "border-radius"),
      boxShadow: boxShadowValue,
      boxShadowX,
      boxShadowY,
      boxShadowBlur,
      boxShadowSpread,
      boxShadowColor,
      textShadow: textShadowValue,
      opacity: getStyleValue(compStyles, "opacity", "1"),
      transform: getStyleValue(compStyles, "transform"),
    });
  };

  useEffect(() => {
    if (!editor) return;

    const setSelection = (component: Component | null) => {
      selectedComponentRef.current = component;
      setSelectedComponent(component);
      updateStyles(component);
    };

    const handleSelected = (component: Component) => {
      setSelection(component);
    };

    const handleUpdate = (component: Component) => {
      if (component === selectedComponentRef.current) {
        updateStyles(component);
      }
    };

    const handleDeselected = () => {
      setSelection(null);
    };

    editor.on("component:selected", handleSelected);
    editor.on("component:update", handleUpdate);
    editor.on("component:deselected", handleDeselected);

    const initialSelected = editor.getSelected() as Component | null;
    setSelection(initialSelected || null);

    return () => {
      editor.off("component:selected", handleSelected);
      editor.off("component:update", handleUpdate);
      editor.off("component:deselected", handleDeselected);
    };
  }, [editor]);

  useEffect(() => {
    const panelContent = panelContentRef.current;
    if (!panelContent) return;

    const handleWheel = (e: WheelEvent) => {
      const target = panelContent;
      const canScroll = target.scrollHeight > target.clientHeight;
      
      if (canScroll) {
        const targetElement = e.target as HTMLElement;
        if (targetElement.tagName === 'INPUT' || targetElement.tagName === 'SELECT' || targetElement.tagName === 'BUTTON') {
          return;
        }
        
        target.scrollTop += e.deltaY / 2;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    panelContent.addEventListener("wheel", handleWheel, { passive: false, capture: true });

    return () => {
      panelContent.removeEventListener("wheel", handleWheel, { capture: true } as EventListenerOptions);
    };
  }, [selectedComponent]);

  const applyStyle = (property: StyleKey, value: string, currentStyles?: StyleValues) => {
    const component = selectedComponentRef.current;
    if (!component || !editor) return;

    const activeStyles = currentStyles || styles;

    if (property.startsWith("boxShadow") && property !== "boxShadow") {
      const extractNumeric = (val: string): string => {
        if (!val) return "0";
        const num = val.replace(/[^0-9.\-]/g, "");
        return num || "0";
      };

      let x = "0", y = "0", blur = "0", spread = "0", color = "#000000";

      if (property === "boxShadowX") {
        x = extractNumeric(value);
        y = extractNumeric(activeStyles.boxShadowY);
        blur = extractNumeric(activeStyles.boxShadowBlur);
        spread = extractNumeric(activeStyles.boxShadowSpread);
        color = activeStyles.boxShadowColor || "#000000";
      } else if (property === "boxShadowY") {
        x = extractNumeric(activeStyles.boxShadowX);
        y = extractNumeric(value);
        blur = extractNumeric(activeStyles.boxShadowBlur);
        spread = extractNumeric(activeStyles.boxShadowSpread);
        color = activeStyles.boxShadowColor || "#000000";
      } else if (property === "boxShadowBlur") {
        x = extractNumeric(activeStyles.boxShadowX);
        y = extractNumeric(activeStyles.boxShadowY);
        blur = extractNumeric(value);
        spread = extractNumeric(activeStyles.boxShadowSpread);
        color = activeStyles.boxShadowColor || "#000000";
      } else if (property === "boxShadowSpread") {
        x = extractNumeric(activeStyles.boxShadowX);
        y = extractNumeric(activeStyles.boxShadowY);
        blur = extractNumeric(activeStyles.boxShadowBlur);
        spread = extractNumeric(value);
        color = activeStyles.boxShadowColor || "#000000";
      } else if (property === "boxShadowColor") {
        x = extractNumeric(activeStyles.boxShadowX);
        y = extractNumeric(activeStyles.boxShadowY);
        blur = extractNumeric(activeStyles.boxShadowBlur);
        spread = extractNumeric(activeStyles.boxShadowSpread);
        color = value || "#000000";
      }

      const boxShadowValue = `${x}px ${y}px ${blur}px ${spread}px ${color}`;
      component.addStyle({ "box-shadow": boxShadowValue });
      
      if (currentStyles) {
        setStyles(prev => ({
          ...prev,
          boxShadow: boxShadowValue,
          boxShadowX: `${x}px`,
          boxShadowY: `${y}px`,
          boxShadowBlur: `${blur}px`,
          boxShadowSpread: `${spread}px`,
          boxShadowColor: color,
        }));
      }
      
      editor.trigger("component:update", component);
      return;
    }

    const cssProperty = property.replace(/([A-Z])/g, "-$1").toLowerCase();

    const propertiesRequiringUnits = [
      "width", "height", "min-height", "max-width", "max-height",
      "font-size", "line-height",
      "margin-top", "margin-right", "margin-bottom", "margin-left",
      "padding-top", "padding-right", "padding-bottom", "padding-left",
      "border-width", "border-radius",
      "top", "right", "bottom", "left"
    ];

    let finalValue = value;

    if (value && value.trim() !== "" && propertiesRequiringUnits.includes(cssProperty)) {
      const numericValue = value.replace(/[^0-9.\-]/g, "");
      if (numericValue && !isNaN(parseFloat(numericValue))) {
        const hasUnit = /(px|em|rem|%|vh|vw|pt|cm|mm|in)$/i.test(value);
        if (!hasUnit) {
          let defaultUnit = "px";
          if (cssProperty === "font-size" || cssProperty === "line-height") {
            defaultUnit = "px";
          }
          finalValue = `${numericValue}${defaultUnit}`;
        }
      }
    }

    if (property === "gradientType" || property === "gradientColor1" || property === "gradientColor2" || 
        property === "gradientDirection") {
      const type = property === "gradientType" ? value : (activeStyles.gradientType || "");
      const color1 = property === "gradientColor1" ? value : (activeStyles.gradientColor1 || "#6366f1");
      const color2 = property === "gradientColor2" ? value : (activeStyles.gradientColor2 || "#8b5cf6");
      const direction = property === "gradientDirection" ? value : (activeStyles.gradientDirection || "to right");
      
      if (type === "linear") {
        const gradientValue = `linear-gradient(${direction}, ${color1}, ${color2})`;
        component.addStyle({ "background-image": gradientValue });
        component.removeStyle("background-color");
      } else if (type === "radial") {
        const gradientValue = `radial-gradient(circle, ${color1}, ${color2})`;
        component.addStyle({ "background-image": gradientValue });
        component.removeStyle("background-color");
      } else {
        component.removeStyle("background-image");
      }
      
      editor.trigger("component:update", component);
      return;
    }
    
    if (property === "backgroundColor" && value) {
      const bgImage = component.getStyle()["background-image"];
      const bgImageStr = typeof bgImage === "string" ? bgImage : "";
      if (bgImageStr.includes("gradient")) {
        component.removeStyle("background-image");
      }
    }

    if (finalValue === "" || finalValue.trim() === "") {
      component.removeStyle(cssProperty);
    } else {
      component.addStyle({ [cssProperty]: finalValue });
      
      if (cssProperty === "border-width" && finalValue) {
        const currentBorderStyle = component.getStyle()["border-style"];
        if (!currentBorderStyle || currentBorderStyle === "none") {
          component.addStyle({ "border-style": activeStyles.borderStyle || "solid" });
        }
      }
    }

    editor.trigger("component:update", component);
  };

  const handleChange = (property: StyleKey, value: string) => {
    setStyles((prev) => {
      const newStyles = {
        ...prev,
        [property]: value,
      };
      applyStyle(property, value, newStyles);
      return newStyles;
    });
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!selectedComponent) {
    return (
      <div className="styles-panel-empty">
        <p>Выберите элемент для редактирования стилей</p>
      </div>
    );
  }

  return (
    <div ref={panelContentRef} className="styles-panel-content">
      {/* Размеры */}
      <div className="styles-section">
        <SectionHeader
          id="dimensions"
          title="Размеры"
          expanded={expandedSections.dimensions}
          onToggle={toggleSection}
        />
        {expandedSections.dimensions && (
          <div className="styles-section-body">
            <InputWithUnit
              label="Ширина"
              value={styles.width}
              property="width"
              onChange={handleChange}
              showSlider={true}
              sliderMin={0}
              sliderMax={2000}
              sliderStep={1}
            />
            <InputWithUnit
              label="Высота"
              value={styles.height}
              property="height"
              onChange={handleChange}
              showSlider={true}
              sliderMin={0}
              sliderMax={2000}
              sliderStep={1}
            />
            <InputWithUnit
              label="Мин. высота"
              value={styles.minHeight}
              property="minHeight"
              onChange={handleChange}
              showSlider={true}
              sliderMin={0}
              sliderMax={2000}
              sliderStep={1}
            />
          </div>
        )}
      </div>

      {/* Типографика */}
      <div className="styles-section">
        <SectionHeader
          id="typography"
          title="Типографика"
          expanded={expandedSections.typography}
          onToggle={toggleSection}
        />
        {expandedSections.typography && (
          <div className="styles-section-body">
            <div className="styles-field">
              <label>Шрифт</label>
              <select
                value={styles.fontFamily}
                onChange={(e) => handleChange("fontFamily", e.target.value)}
              >
                <option value="">По умолчанию</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="Verdana, sans-serif">Verdana</option>
                <option value="'Helvetica Neue', sans-serif">Helvetica</option>
              </select>
            </div>
            <InputWithUnit
              label="Размер"
              value={styles.fontSize}
              property="fontSize"
              units={["px", "em", "rem"]}
              onChange={handleChange}
              showSlider={true}
              sliderMin={8}
              sliderMax={120}
              sliderStep={1}
            />
            <div className="styles-field">
              <label>Толщина</label>
              <select
                value={styles.fontWeight}
                onChange={(e) => handleChange("fontWeight", e.target.value)}
              >
                <option value="">Обычный</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="600">600</option>
                <option value="700">700</option>
                <option value="800">800</option>
                <option value="900">900</option>
                <option value="bold">Жирный</option>
                <option value="lighter">Тонкий</option>
              </select>
            </div>
            <ColorInput label="Цвет" value={styles.color} property="color" onChange={handleChange} />
            <div className="styles-field">
              <label>Выравнивание</label>
              <div className="styles-align-buttons">
                {["left", "center", "right", "justify"].map((align) => (
                  <button key={align} className={`styles-align-btn ${styles.textAlign === align ? "active" : ""}`} onClick={() => handleChange("textAlign", align)} title={align === "left" ? "Слева" : align === "center" ? "По центру" : align === "right" ? "Справа" : "По ширине"}>
                    {align === "left" && "⬅"}
                    {align === "center" && "⬌"}
                    {align === "right" && "➡"}
                    {align === "justify" && "⬌⬌"}
                  </button>
                ))}
              </div>
            </div>
            <div className="styles-field">
              <label>Межстрочный интервал</label>
              <input type="text" value={styles.lineHeight} onChange={(e) => handleChange("lineHeight", e.target.value)} placeholder="1.5" />
            </div>
          </div>
        )}
      </div>

      {/* Отступы */}
      <div className="styles-section">
        <SectionHeader
          id="spacing"
          title="Отступы"
          expanded={expandedSections.spacing}
          onToggle={toggleSection}
        />
        {expandedSections.spacing && (
          <div className="styles-section-body">
            <div className="styles-field">
              <label>Внешние отступы (Margin)</label>
            </div>
            <InputWithUnit
              label="Сверху"
              value={styles.marginTop}
              property="marginTop"
              onChange={handleChange}
              showSlider={true}
              sliderMin={0}
              sliderMax={200}
              sliderStep={1}
            />
            <InputWithUnit
              label="Справа"
              value={styles.marginRight}
              property="marginRight"
              onChange={handleChange}
              showSlider={true}
              sliderMin={0}
              sliderMax={200}
              sliderStep={1}
            />
            <InputWithUnit
              label="Снизу"
              value={styles.marginBottom}
              property="marginBottom"
              onChange={handleChange}
              showSlider={true}
              sliderMin={0}
              sliderMax={200}
              sliderStep={1}
            />
            <InputWithUnit
              label="Слева"
              value={styles.marginLeft}
              property="marginLeft"
              onChange={handleChange}
              showSlider={true}
              sliderMin={0}
              sliderMax={200}
              sliderStep={1}
            />
            <div className="styles-field" style={{ marginTop: "16px" }}>
              <label>Внутренние отступы (Padding)</label>
            </div>
            <InputWithUnit
              label="Сверху"
              value={styles.paddingTop}
              property="paddingTop"
              onChange={handleChange}
              showSlider={true}
              sliderMin={0}
              sliderMax={200}
              sliderStep={1}
            />
            <InputWithUnit
              label="Справа"
              value={styles.paddingRight}
              property="paddingRight"
              onChange={handleChange}
              showSlider={true}
              sliderMin={0}
              sliderMax={200}
              sliderStep={1}
            />
            <InputWithUnit
              label="Снизу"
              value={styles.paddingBottom}
              property="paddingBottom"
              onChange={handleChange}
              showSlider={true}
              sliderMin={0}
              sliderMax={200}
              sliderStep={1}
            />
            <InputWithUnit
              label="Слева"
              value={styles.paddingLeft}
              property="paddingLeft"
              onChange={handleChange}
              showSlider={true}
              sliderMin={0}
              sliderMax={200}
              sliderStep={1}
            />
          </div>
        )}
      </div>

      {/* Фон */}
      <div className="styles-section">
        <SectionHeader
          id="background"
          title="Фон"
          expanded={expandedSections.background}
          onToggle={toggleSection}
        />
        {expandedSections.background && (
          <div className="styles-section-body">
            <ColorInput
              label="Цвет фона"
              value={styles.backgroundColor}
              property="backgroundColor"
              onChange={handleChange}
            />
            <div className="styles-field">
              <label>Градиент</label>
              <select
                value={styles.gradientType}
                onChange={(e) => handleChange("gradientType", e.target.value)}
              >
                <option value="">Нет</option>
                <option value="linear">Линейный</option>
                <option value="radial">Радиальный</option>
              </select>
            </div>
            {styles.gradientType && (
              <>
                <ColorInput
                  label="Цвет 1"
                  value={styles.gradientColor1}
                  property="gradientColor1"
                  onChange={handleChange}
                />
                <ColorInput
                  label="Цвет 2"
                  value={styles.gradientColor2}
                  property="gradientColor2"
                  onChange={handleChange}
                />
                {styles.gradientType === "linear" && (
                  <div className="styles-field">
                    <label>Направление</label>
                    <select
                      value={styles.gradientDirection}
                      onChange={(e) => handleChange("gradientDirection", e.target.value)}
                    >
                      <option value="to right">Вправо</option>
                      <option value="to left">Влево</option>
                      <option value="to top">Вверх</option>
                      <option value="to bottom">Вниз</option>
                      <option value="to top right">Вправо-вверх</option>
                      <option value="to top left">Влево-вверх</option>
                      <option value="to bottom right">Вправо-вниз</option>
                      <option value="to bottom left">Влево-вниз</option>
                    </select>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleChange("gradientType", "")}
                  className="styles-remove-button"
                >
                  Убрать градиент
                </button>
              </>
            )}
            <div className="styles-field">
              <label>Изображение (URL)</label>
              <input type="text" value={styles.backgroundImage.replace(/url\(|\)|"/g, "")} onChange={(e) => handleChange("backgroundImage", e.target.value ? `url("${e.target.value}")` : "")} placeholder="https://example.com/image.jpg" />
            </div>
          </div>
        )}
      </div>

      {/* Границы */}
      <div className="styles-section">
        <SectionHeader
          id="borders"
          title="Границы"
          expanded={expandedSections.borders}
          onToggle={toggleSection}
        />
        {expandedSections.borders && (
          <div className="styles-section-body">
            <InputWithUnit
              label="Ширина"
              value={styles.borderWidth}
              property="borderWidth"
              units={["px"]}
              onChange={handleChange}
              showSlider={true}
              sliderMin={0}
              sliderMax={50}
              sliderStep={1}
            />
            <div className="styles-field">
              <label>Стиль</label>
              <select value={styles.borderStyle} onChange={(e) => handleChange("borderStyle", e.target.value)}>
                <option value="solid">Сплошная</option>
                <option value="dashed">Пунктир</option>
                <option value="dotted">Точки</option>
                <option value="double">Двойная</option>
                <option value="none">Нет</option>
              </select>
            </div>
            <ColorInput label="Цвет" value={styles.borderColor} property="borderColor" onChange={handleChange} />
            <InputWithUnit 
              label="Радиус скругления" 
              value={styles.borderRadius} 
              property="borderRadius" 
              units={["px", "%", "em", "rem"]}
              onChange={handleChange}
              showSlider={true}
              sliderMin={0}
              sliderMax={100}
              sliderStep={1}
            />
          </div>
        )}
      </div>

      {/* Тени */}
      <div className="styles-section">
        <SectionHeader
          id="shadows"
          title="Тени"
          expanded={expandedSections.shadows}
          onToggle={toggleSection}
        />
        {expandedSections.shadows && (
          <div className="styles-section-body">
            <div className="styles-field">
              <label>Тень элемента (Box Shadow)</label>
              <div className="styles-shadow-controls">
                <InputWithUnit
                  label="Смещение X"
                  value={styles.boxShadowX.replace(/[^0-9.\-]/g, "")}
                  property="boxShadowX"
                  units={["px"]}
                  onChange={handleChange}
                  showSlider={true}
                  sliderMin={-50}
                  sliderMax={50}
                  sliderStep={1}
                />
                <InputWithUnit
                  label="Смещение Y"
                  value={styles.boxShadowY.replace(/[^0-9.\-]/g, "")}
                  property="boxShadowY"
                  units={["px"]}
                  onChange={handleChange}
                  showSlider={true}
                  sliderMin={-50}
                  sliderMax={50}
                  sliderStep={1}
                />
                <InputWithUnit
                  label="Размытие"
                  value={styles.boxShadowBlur.replace(/[^0-9.\-]/g, "")}
                  property="boxShadowBlur"
                  units={["px"]}
                  onChange={handleChange}
                  showSlider={true}
                  sliderMin={0}
                  sliderMax={100}
                  sliderStep={1}
                />
                <InputWithUnit
                  label="Растяжение"
                  value={styles.boxShadowSpread.replace(/[^0-9.\-]/g, "")}
                  property="boxShadowSpread"
                  units={["px"]}
                  onChange={handleChange}
                  showSlider={true}
                  sliderMin={-50}
                  sliderMax={50}
                  sliderStep={1}
                />
                <ColorInput
                  label="Цвет тени"
                  value={styles.boxShadowColor}
                  property="boxShadowColor"
                  onChange={handleChange}
                />
                <div className="styles-field">
                  <button
                    type="button"
                    onClick={() => {
                      const component = selectedComponentRef.current;
                      if (component && editor) {
                        component.removeStyle("box-shadow");
                        setStyles(prev => ({
                          ...prev,
                          boxShadow: "",
                          boxShadowX: "0px",
                          boxShadowY: "0px",
                          boxShadowBlur: "0px",
                          boxShadowSpread: "0px",
                          boxShadowColor: "#000000",
                        }));
                        editor.trigger("component:update", component);
                      }
                    }}
                    className="styles-remove-button"
                  >
                    Убрать тень
                  </button>
                </div>
              </div>
            </div>
            <div className="styles-field">
              <label>Тень текста (Text Shadow)</label>
              <input
                type="text"
                value={styles.textShadow}
                onChange={(e) => handleChange("textShadow", e.target.value)}
                placeholder="0px 2px 4px rgba(0,0,0,0.3)"
                className="styles-text-input"
              />
              <div className="styles-field">
                <button
                  type="button"
                  onClick={() => {
                    const component = selectedComponentRef.current;
                    if (component && editor) {
                      component.removeStyle("text-shadow");
                      setStyles(prev => ({ ...prev, textShadow: "" }));
                      editor.trigger("component:update", component);
                    }
                  }}
                  className="styles-remove-button"
                >
                  Убрать тень текста
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Эффекты */}
      <div className="styles-section">
        <SectionHeader
          id="effects"
          title="Эффекты"
          expanded={expandedSections.effects}
          onToggle={toggleSection}
        />
        {expandedSections.effects && (
          <div className="styles-section-body">
            <div className="styles-field">
              <label>Прозрачность</label>
              <div className="styles-slider-group">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={parseFloat(styles.opacity) || 1}
                  onChange={(e) => handleChange("opacity", e.target.value)}
                  className="styles-slider"
                />
                <span className="styles-slider-value">
                  {((parseFloat(styles.opacity) || 1) * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="text"
                value={styles.opacity}
                onChange={(e) => handleChange("opacity", e.target.value)}
                placeholder="1"
                className="styles-text-input"
              />
            </div>
            <div className="styles-field">
              <label>Трансформация</label>
              <input
                type="text"
                value={styles.transform}
                onChange={(e) => handleChange("transform", e.target.value)}
                placeholder="rotate(45deg) scale(1.2)"
                className="styles-text-input"
              />
              <div className="styles-field" style={{ marginTop: "8px" }}>
                <div className="styles-align-buttons">
                  <button
                    type="button"
                    onClick={() => handleChange("transform", "rotate(5deg)")}
                    className="styles-align-btn"
                    title="Поворот 5°"
                  >
                    ↻ 5°
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("transform", "scale(1.1)")}
                    className="styles-align-btn"
                    title="Увеличить 10%"
                  >
                    ⬍ 1.1x
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("transform", "scale(0.9)")}
                    className="styles-align-btn"
                    title="Уменьшить 10%"
                  >
                    ⬌ 0.9x
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const component = selectedComponentRef.current;
                      if (component && editor) {
                        component.removeStyle("transform");
                        setStyles(prev => ({ ...prev, transform: "" }));
                        editor.trigger("component:update", component);
                      }
                    }}
                    className="styles-align-btn"
                    title="Сбросить"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}