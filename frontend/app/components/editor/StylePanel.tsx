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
  borderWidth: string;
  borderStyle: string;
  borderColor: string;
  borderRadius: string;
}

type StyleKey = keyof StyleValues;

const defaultStyles: StyleValues = {
  width: "", height: "", minHeight: "",
  fontFamily: "", fontSize: "", fontWeight: "", color: "", textAlign: "left", lineHeight: "",
  marginTop: "", marginRight: "", marginBottom: "", marginLeft: "",
  paddingTop: "", paddingRight: "", paddingBottom: "", paddingLeft: "",
  backgroundColor: "", backgroundImage: "",
  borderWidth: "", borderStyle: "solid", borderColor: "", borderRadius: "",
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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    if (!rawValue.trim()) {
      onChange(property, "");
      return;
    }

    const trimmed = rawValue.trim();
    const numericPattern = /^-?\d+(?:\.\d+)?$/;
    const numericWithUnitPattern = /^-?\d+(?:\.\d+)?[a-z%]+$/i;

    if (numericPattern.test(trimmed)) {
      onChange(property, `${trimmed}${currentUnit}`);
    } else if (numericWithUnitPattern.test(trimmed)) {
      onChange(property, trimmed);
    } else {
      onChange(property, trimmed);
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
          value={value}
          onChange={handleInputChange}
          placeholder="auto"
        />
        <select
          value={currentUnit}
          onChange={(e) => {
            const nextUnit = e.target.value;
            onChange(property, numericPart ? `${numericPart}${nextUnit}` : "");
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

const SpacingGrid = ({
  label,
  properties,
  styles,
  onChange,
}: {
  label: string;
  properties: StyleKey[];
  styles: StyleValues;
  onChange: (property: StyleKey, value: string) => void;
}) => (
  <div className="styles-field">
    <label>{label}</label>
    <div className="styles-spacing-grid">
      {properties.map((property) => (
        <input
          key={property}
          type="text"
          value={styles[property]}
          onChange={(e) => onChange(property, e.target.value)}
          placeholder="0"
          className="styles-spacing-input"
        />
      ))}
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
  });
  const selectedComponentRef = useRef<Component | null>(null);
  const panelContentRef = useRef<HTMLDivElement>(null);

  const updateStyles = (component: Component | null) => {
    if (!component) {
      setStyles(defaultStyles);
      return;
    }

    const compStyles = (component.getStyle?.() ?? {}) as Record<string, unknown>;

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
      borderWidth: getStyleValue(compStyles, "border-width"),
      borderStyle: getStyleValue(compStyles, "border-style") || "solid",
      borderColor: getStyleValue(compStyles, "border-color"),
      borderRadius: getStyleValue(compStyles, "border-radius"),
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

  // Обработка прокрутки колесиком мыши
  useEffect(() => {
    const panelContent = panelContentRef.current;
    if (!panelContent) return;

    const handleWheel = (e: WheelEvent) => {
      const target = panelContent;
      const canScroll = target.scrollHeight > target.clientHeight;
      
      if (canScroll) {
        // Проверяем, не находимся ли мы на интерактивном элементе
        const targetElement = e.target as HTMLElement;
        if (targetElement.tagName === 'INPUT' || targetElement.tagName === 'SELECT' || targetElement.tagName === 'BUTTON') {
          return; // Не перехватываем событие на интерактивных элементах
        }
        
        target.scrollTop += e.deltaY / 2;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Используем capture фазу для перехвата события раньше
    panelContent.addEventListener("wheel", handleWheel, { passive: false, capture: true });

    return () => {
      panelContent.removeEventListener("wheel", handleWheel, { capture: true } as EventListenerOptions);
    };
  }, [selectedComponent]);

  const applyStyle = (property: StyleKey, value: string) => {
    const component = selectedComponentRef.current;
    if (!component || !editor) return;

    const cssProperty = property.replace(/([A-Z])/g, "-$1").toLowerCase();

    if (value === "") {
      component.removeStyle(cssProperty);
    } else {
      component.addStyle({ [cssProperty]: value });
      
      // Если изменяем border-width, убеждаемся, что border-style установлен
      if (cssProperty === "border-width" && value) {
        const currentBorderStyle = component.getStyle()["border-style"];
        if (!currentBorderStyle || currentBorderStyle === "none") {
          component.addStyle({ "border-style": styles.borderStyle || "solid" });
        }
      }
    }

    editor.trigger("component:update", component);
  };

  const handleChange = (property: StyleKey, value: string) => {
    setStyles((prev) => ({
      ...prev,
      [property]: value,
    }));
    applyStyle(property, value);
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
            <SpacingGrid
              label="Внешние отступы (Margin)"
              properties={["marginTop", "marginRight", "marginBottom", "marginLeft"]}
              styles={styles}
              onChange={handleChange}
            />
            <SpacingGrid
              label="Внутренние отступы (Padding)"
              properties={["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]}
              styles={styles}
              onChange={handleChange}
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
    </div>
  );
}