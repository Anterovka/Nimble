"use client";

import { useEffect, useState } from "react";
import type { Component, Editor } from "grapesjs";

interface InteractionsPanelProps {
  editor: Editor | null;
  selectedComponent: Component | null;
}

interface Interaction {
  id: string;
  type: 'hover' | 'focus' | 'active' | 'visited' | 'click';
  styles: Record<string, string>;
  action?: {
    type: 'link' | 'anchor' | 'scroll' | 'modal' | 'custom';
    value?: string;
  };
}

const INTERACTION_TYPES = [
  { value: 'visited', label: 'Посещенная ссылка' },
  { value: 'click', label: 'При клике' },
] as const;

const ACTION_TYPES = [
  { value: 'link', label: 'Переход по ссылке' },
  { value: 'anchor', label: 'Переход к блоку на сайте (якорь)' },
  { value: 'scroll', label: 'Прокрутка к элементу' },
  { value: 'modal', label: 'Открыть модальное окно' },
  { value: 'custom', label: 'Пользовательский код' },
] as const;

export function InteractionsPanel({ editor, selectedComponent }: InteractionsPanelProps) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInteractionType, setNewInteractionType] = useState<'hover' | 'focus' | 'active' | 'visited' | 'click'>('click');
  const [newActionType, setNewActionType] = useState<'link' | 'anchor' | 'scroll' | 'modal' | 'custom'>('link');
  const [newActionValue, setNewActionValue] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Функция для синхронизации CSS с canvas iframe
  const syncCssToCanvas = (selector: string, rule: any) => {
    if (!editor) return;
    
    setTimeout(() => {
      const canvas = editor.Canvas as any;
      if (canvas) {
        const frame = canvas.getFrameEl?.();
        if (frame && frame.contentDocument) {
          const frameDoc = frame.contentDocument;
          const styleId = `gjs-interaction-${selector.replace(/[^a-zA-Z0-9]/g, '-')}`;
          let styleEl = frameDoc.getElementById(styleId);
          
          if (!styleEl) {
            styleEl = frameDoc.createElement('style');
            styleEl.id = styleId;
            frameDoc.head.appendChild(styleEl);
          }
          
          const ruleStyles = rule.getStyle() || {};
          let cssText = `${selector} {\n`;
          Object.keys(ruleStyles).forEach(key => {
            const val = ruleStyles[key];
            if (val) {
              cssText += `  ${key}: ${val};\n`;
            }
          });
          cssText += '}';
          styleEl.textContent = cssText;
        }
      }
    }, 50);
  };

  const loadInteractions = () => {
    if (!editor || !selectedComponent) return;

    const component = selectedComponent;
    const css = editor.Css as any;
    const rules = css.getAll();
    const componentClasses = component.getClasses();
    const attrs = component.getAttributes() || {};
    
    // Нормализуем классы - получаем массив строк
    const classesArray = Array.isArray(componentClasses) 
      ? componentClasses.map((cls: any) => typeof cls === 'string' ? cls : (cls?.getName?.() || cls?.get?.('name') || String(cls)))
      : [];
    
    const foundInteractions: Interaction[] = [];
    
    // Проверяем наличие onclick или href для click взаимодействий
    if (attrs.onclick || attrs.href) {
      let actionType: 'link' | 'anchor' | 'scroll' | 'modal' | 'custom' = 'custom';
      let actionValue = '';
      
      if (attrs.href) {
        // Проверяем, является ли это якорем
        if (attrs.href.startsWith('#')) {
          actionType = 'anchor';
          actionValue = attrs.href;
        } else {
          actionType = 'link';
          actionValue = attrs.href;
        }
      } else if (attrs.onclick) {
        const onclick = attrs.onclick;
        // Определяем тип действия по содержимому
        if (onclick.includes('window.location.href')) {
          const match = onclick.match(/window\.location\.href=['"]([^'"]+)['"]/);
          const href = match ? match[1] : '';
          if (href.startsWith('#')) {
            actionType = 'anchor';
            actionValue = href;
          } else {
            actionType = 'link';
            actionValue = href;
          }
        } else if (onclick.includes('scrollIntoView')) {
          actionType = 'scroll';
          const match = onclick.match(/querySelector\(['"]([^'"]+)['"]/);
          actionValue = match ? match[1] : '';
        } else if (onclick.includes('getElementById') && (onclick.includes('showModal') || onclick.includes('display'))) {
          actionType = 'modal';
          const match = onclick.match(/getElementById\(['"]([^'"]+)['"]/);
          actionValue = match ? match[1] : '';
        } else {
          actionType = 'custom';
          actionValue = onclick;
        }
      }
      
      foundInteractions.push({
        id: `click-${Date.now()}`,
        type: 'click',
        styles: {},
        action: {
          type: actionType,
          value: actionValue,
        },
      });
    }
    
    // Проверяем CSS псевдоклассы только если есть классы
    if (classesArray.length > 0) {
      const className = classesArray[0];
      
      // Проверяем каждый тип CSS взаимодействия
      INTERACTION_TYPES.filter(t => t.value !== 'click').forEach(({ value: type }) => {
        const selector = `.${className}:${type}`;
        
        // Ищем правило с таким селектором
        const rule = rules.find((r: any) => {
          const selectors = r.getSelectors();
          return selectors && selectors.includes(selector);
        });

        if (rule) {
          const styles = rule.getStyle() || {};
          // Convert styles to Record<string, string> by converting all values to strings
          const stringStyles: Record<string, string> = {};
          Object.keys(styles).forEach(key => {
            const value = styles[key];
            stringStyles[key] = Array.isArray(value) ? value.join(' ') : String(value || '');
          });
          foundInteractions.push({
            id: `${type}-${className}`,
            type: type as any,
            styles: stringStyles,
          });
          
          // Синхронизируем CSS с canvas
          syncCssToCanvas(selector, rule);
        }
      });
    }

    setInteractions(foundInteractions);
  };

  useEffect(() => {
    if (!editor || !selectedComponent) {
      setInteractions([]);
      return;
    }

    loadInteractions();
  }, [editor, selectedComponent]);

  const addInteraction = () => {
    if (!editor || !selectedComponent) return;

    const component = selectedComponent;
    
    // Проверяем, не существует ли уже такое взаимодействие
    const existing = interactions.find(i => i.type === newInteractionType);
    if (existing) {
      alert('Такое взаимодействие уже существует');
      return;
    }

    // Для click взаимодействий добавляем JavaScript обработчик
    if (newInteractionType === 'click') {
      // Проверяем, что значение заполнено для всех типов действий кроме custom
      if (newActionType !== 'custom' && !newActionValue.trim()) {
        alert('Пожалуйста, заполните поле значения');
        return;
      }
      
      const tagName = component.get('tagName')?.toLowerCase();
      
      // Если это ссылка, добавляем href
      if (tagName === 'a' && (newActionType === 'link' || newActionType === 'anchor') && newActionValue) {
        component.addAttributes({ href: newActionValue });
      } else if (newActionType === 'link' && newActionValue) {
        // Для других элементов превращаем в ссылку или добавляем onclick
        if (tagName !== 'a') {
          // Добавляем обработчик клика через атрибут
          const newOnClick = `window.location.href='${newActionValue}';`;
          component.addAttributes({ onclick: newOnClick });
        } else {
          component.addAttributes({ href: newActionValue });
        }
      } else if (newActionType === 'anchor' && newActionValue) {
        // Переход к якорю (блоку на сайте)
        // Убеждаемся, что значение начинается с #
        const anchorValue = newActionValue.startsWith('#') ? newActionValue : `#${newActionValue}`;
        if (tagName === 'a') {
          component.addAttributes({ href: anchorValue });
        } else {
          // Для других элементов добавляем onclick
          const anchorScript = `const target = document.querySelector('${anchorValue}'); if (target) target.scrollIntoView({behavior: 'smooth', block: 'start'});`;
          component.addAttributes({ onclick: anchorScript });
        }
      } else if (newActionType === 'scroll' && newActionValue) {
        // Прокрутка к элементу
        const scrollScript = `const target = document.querySelector('${newActionValue}'); if (target) target.scrollIntoView({behavior: 'smooth', block: 'start'});`;
        component.addAttributes({ onclick: scrollScript });
      } else if (newActionType === 'modal' && newActionValue) {
        // Открытие модального окна
        const modalScript = `const modal = document.getElementById('${newActionValue}'); if (modal) { modal.showModal?.() || (modal.style.display = 'block'); }`;
        component.addAttributes({ onclick: modalScript });
      } else if (newActionType === 'custom') {
        // Пользовательский код (может быть пустым)
        if (newActionValue.trim()) {
          component.addAttributes({ onclick: newActionValue });
        }
      }
      
      const newInteraction: Interaction = {
        id: `click-${Date.now()}`,
        type: 'click',
        styles: {},
        action: {
          type: newActionType,
          value: newActionValue,
        },
      };
      
      setInteractions([...interactions, newInteraction]);
      setShowAddForm(false);
      setNewActionValue('');
      editor.refresh();
      return;
    }
    
    // Для CSS псевдоклассов нужен класс
    const classes = component.getClasses();
    const classesArray = Array.isArray(classes) 
      ? classes.map((cls: any) => typeof cls === 'string' ? cls : (cls?.getName?.() || cls?.get?.('name') || String(cls)))
      : [];
    
    let className: string;
    
    if (classesArray.length === 0) {
      // Автоматически добавляем класс, если его нет
      const defaultClass = `element-${Date.now()}`;
      component.addClass(defaultClass);
      className = defaultClass;
      editor.refresh();
    } else {
      className = classesArray[0];
    }

    const css = editor.Css as any;
    const selector = `.${className}:${newInteractionType}`;
    
    // Создаем CSS правило
    let rule = css.get(selector);
    if (!rule) {
      rule = css.add(selector, {});
    }
    
    // Устанавливаем начальный стиль
    rule.setStyle('background-color', 'rgba(255, 255, 255, 0.1)');
    
    // Принудительно обновляем canvas, чтобы применить CSS
    editor.refresh();
    
    // Синхронизируем CSS с canvas
    syncCssToCanvas(selector, rule);

    const ruleStyles = rule.getStyle() || {};
    // Convert styles to Record<string, string>
    const stringStyles: Record<string, string> = {};
    Object.keys(ruleStyles).forEach(key => {
      const value = ruleStyles[key];
      stringStyles[key] = Array.isArray(value) ? value.join(' ') : String(value || '');
    });

    const newInteraction: Interaction = {
      id: `${newInteractionType}-${className}-${Date.now()}`,
      type: newInteractionType,
      styles: stringStyles,
    };

    setInteractions([...interactions, newInteraction]);
    setShowAddForm(false);
    setNewActionValue('');
    editor.refresh();
  };

  const removeInteraction = (interaction: Interaction) => {
    if (!editor || !selectedComponent) return;

    const component = selectedComponent;
    
    if (interaction.type === 'click') {
      // Удаляем onclick и href атрибуты
      const attrs = component.getAttributes() || {};
      if (attrs.onclick) {
        component.removeAttributes('onclick');
      }
      if (attrs.href && (interaction.action?.type === 'link' || interaction.action?.type === 'anchor')) {
        component.removeAttributes('href');
      }
    } else {
      // Удаляем CSS правило
      const classes = component.getClasses();
      const classesArray = Array.isArray(classes) 
        ? classes.map((cls: any) => typeof cls === 'string' ? cls : (cls?.getName?.() || cls?.get?.('name') || String(cls)))
        : [];
      
      if (classesArray.length > 0) {
        const className = classesArray[0];
        const css = editor.Css as any;
        const selector = `.${className}:${interaction.type}`;
        
        const rules = css.getAll();
        const rule = rules.find((r: any) => {
          const selectors = r.getSelectors();
          return selectors && selectors.includes(selector);
        });

        if (rule) {
          rule.remove();
        }
        
        // Удаляем style элемент из canvas iframe
        const canvas = editor.Canvas as any;
        if (canvas) {
          const frame = canvas.getFrameEl?.();
          if (frame && frame.contentDocument) {
            const frameDoc = frame.contentDocument;
            const styleId = `gjs-interaction-${selector.replace(/[^a-zA-Z0-9]/g, '-')}`;
            const styleEl = frameDoc.getElementById(styleId);
            if (styleEl) {
              styleEl.remove();
            }
          }
        }
      }
    }

    setInteractions(interactions.filter(i => i.id !== interaction.id));
    editor.refresh();
  };

  const updateInteractionStyle = (interactionId: string, property: string, value: string) => {
    if (!editor || !selectedComponent) return;

    const interaction = interactions.find(i => i.id === interactionId);
    if (!interaction) return;

    const component = selectedComponent;
    const classes = component.getClasses();
    
    // Нормализуем классы - получаем массив строк
    const classesArray = Array.isArray(classes) 
      ? classes.map((cls: any) => typeof cls === 'string' ? cls : (cls?.getName?.() || cls?.get?.('name') || String(cls)))
      : [];
    
    if (classesArray.length === 0) return;

    const className = classesArray[0];
    const css = editor.Css as any;
    const selector = `.${className}:${interaction.type}`;
    
    const rules = css.getAll();
    let rule = rules.find((r: any) => {
      const selectors = r.getSelectors();
      return selectors && selectors.includes(selector);
    });

    if (!rule) {
      rule = css.add(selector, {});
    }

    if (value === '' || value === undefined) {
      rule.removeStyle(property);
    } else {
      rule.setStyle(property, value);
    }

    // Обновляем состояние
    const updatedStyles = { ...interaction.styles };
    if (value === '' || value === undefined) {
      delete updatedStyles[property];
    } else {
      updatedStyles[property] = value;
    }

    setInteractions(interactions.map(i => {
      if (i.id === interactionId) {
        return {
          ...i,
          styles: updatedStyles,
        };
      }
      return i;
    }));

    // Принудительно обновляем CSS в canvas
    editor.refresh();
    
    // Синхронизируем CSS с canvas
    syncCssToCanvas(selector, rule);
  };

  const getInteractionLabel = (type: string) => {
    const found = INTERACTION_TYPES.find(t => t.value === type);
    return found ? found.label : type;
  };

  if (!selectedComponent) {
    return (
      <div className="webflow-interactions-placeholder">
        <p className="text-white/50 text-sm">Выберите элемент для добавления взаимодействий</p>
      </div>
    );
  }

  return (
    <div className="webflow-interactions-panel">
      <div className="webflow-interactions-header">
        <h3 className="webflow-interactions-title">Взаимодействия</h3>
        {!showAddForm && (
          <button
            type="button"
            className="webflow-add-button"
            onClick={() => setShowAddForm(true)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Добавить
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="webflow-interaction-form">
          <div className="webflow-field">
            <label className="webflow-field-label">Тип взаимодействия</label>
            <select
              className="webflow-select"
              value={newInteractionType}
              onChange={(e) => setNewInteractionType(e.target.value as any)}
            >
              {INTERACTION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          {newInteractionType === 'click' && (
            <>
              <div className="webflow-field">
                <label className="webflow-field-label">Действие</label>
                <select
                  className="webflow-select"
                  value={newActionType}
                  onChange={(e) => setNewActionType(e.target.value as any)}
                >
                  {ACTION_TYPES.map((action) => (
                    <option key={action.value} value={action.value}>
                      {action.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="webflow-field">
                <label className="webflow-field-label">
                  {newActionType === 'link' ? 'URL ссылки' : 
                   newActionType === 'anchor' ? 'ID блока (например: section1 или #section1)' :
                   newActionType === 'scroll' ? 'Селектор элемента (например: #section1)' :
                   newActionType === 'modal' ? 'ID модального окна' :
                   'JavaScript код'}
                </label>
                <input
                  type="text"
                  className="webflow-input"
                  value={newActionValue}
                  onChange={(e) => setNewActionValue(e.target.value)}
                  placeholder={
                    newActionType === 'link' ? 'https://example.com' :
                    newActionType === 'anchor' ? 'section1 или #section1' :
                    newActionType === 'scroll' ? '#section1 или .class-name' :
                    newActionType === 'modal' ? 'modal-id' :
                    'alert("Hello");'
                  }
                />
              </div>
            </>
          )}
          
          <div className="webflow-form-actions">
            <button
              type="button"
              className="webflow-button webflow-button-primary"
              onClick={addInteraction}
            >
              Добавить
            </button>
            <button
              type="button"
              className="webflow-button"
              onClick={() => {
                setShowAddForm(false);
                setNewActionValue('');
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {interactions.length === 0 && !showAddForm ? (
        <div className="webflow-empty-state">
          <p>Нет взаимодействий. Нажмите "Добавить" для создания нового.</p>
        </div>
      ) : (
        <div className="webflow-interactions-list">
          {interactions.map((interaction) => (
            <div key={interaction.id} className="webflow-interaction-item">
              <div className="webflow-interaction-info">
                <div className="webflow-interaction-trigger">
                  {getInteractionLabel(interaction.type)}
                </div>
                {editingId === interaction.id ? (
                  <div className="webflow-interaction-editor">
                    <div className="webflow-field">
                      <label className="webflow-field-label">Цвет фона</label>
                      <div className="webflow-color-group">
                        <input
                          type="color"
                          className="webflow-color-picker"
                          value={interaction.styles['background-color'] || '#ffffff'}
                          onChange={(e) => updateInteractionStyle(interaction.id, 'background-color', e.target.value)}
                        />
                        <input
                          type="text"
                          className="webflow-color-text"
                          value={interaction.styles['background-color'] || ''}
                          onChange={(e) => updateInteractionStyle(interaction.id, 'background-color', e.target.value)}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                    <div className="webflow-field">
                      <label className="webflow-field-label">Цвет текста</label>
                      <div className="webflow-color-group">
                        <input
                          type="color"
                          className="webflow-color-picker"
                          value={interaction.styles.color || '#000000'}
                          onChange={(e) => updateInteractionStyle(interaction.id, 'color', e.target.value)}
                        />
                        <input
                          type="text"
                          className="webflow-color-text"
                          value={interaction.styles.color || ''}
                          onChange={(e) => updateInteractionStyle(interaction.id, 'color', e.target.value)}
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                    <div className="webflow-field">
                      <label className="webflow-field-label">Прозрачность</label>
                      <div className="webflow-slider-group">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          className="webflow-slider"
                          value={parseFloat(interaction.styles.opacity || '1')}
                          onChange={(e) => updateInteractionStyle(interaction.id, 'opacity', e.target.value)}
                        />
                        <span className="webflow-slider-value">
                          {parseFloat(interaction.styles.opacity || '1').toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="webflow-field">
                      <label className="webflow-field-label">Масштаб</label>
                      <div className="webflow-slider-group">
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          className="webflow-slider"
                          value={parseFloat(interaction.styles.transform?.match(/scale\(([^)]+)\)/)?.[1] || '1')}
                          onChange={(e) => updateInteractionStyle(interaction.id, 'transform', `scale(${e.target.value})`)}
                        />
                        <span className="webflow-slider-value">
                          {parseFloat(interaction.styles.transform?.match(/scale\(([^)]+)\)/)?.[1] || '1').toFixed(1)}x
                        </span>
                      </div>
                    </div>
                    {interaction.type === 'click' && interaction.action && (
                      <div className="webflow-field">
                        <label className="webflow-field-label">Действие</label>
                        <div className="text-sm text-white/70 mb-2">
                          {interaction.action.type === 'link' ? 'Переход по ссылке' :
                           interaction.action.type === 'anchor' ? 'Переход к блоку на сайте' :
                           interaction.action.type === 'scroll' ? 'Прокрутка к элементу' :
                           interaction.action.type === 'modal' ? 'Открыть модальное окно' :
                           'Пользовательский код'}
                        </div>
                        {interaction.action.value && (
                          <div className="text-xs text-white/50 bg-white/5 p-2 rounded border border-white/10">
                            {interaction.action.value}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="webflow-form-actions">
                      <button
                        type="button"
                        className="webflow-button"
                        onClick={() => setEditingId(null)}
                      >
                        Готово
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="webflow-interaction-action">
                    {interaction.type === 'click' && interaction.action ? (
                      <div>
                        <div className="text-xs text-white/60 mb-1">
                          {interaction.action.type === 'link' ? 'Переход по ссылке' :
                           interaction.action.type === 'anchor' ? 'Переход к блоку на сайте' :
                           interaction.action.type === 'scroll' ? 'Прокрутка к элементу' :
                           interaction.action.type === 'modal' ? 'Открыть модальное окно' :
                           'Пользовательский код'}
                        </div>
                        {interaction.action.value && (
                          <div className="text-xs text-white/40 truncate">
                            {interaction.action.value}
                          </div>
                        )}
                      </div>
                    ) : (
                      Object.keys(interaction.styles).length > 0
                        ? `${Object.keys(interaction.styles).length} свойств`
                        : 'Нет стилей'
                    )}
                  </div>
                )}
              </div>
              <div className="webflow-interaction-actions">
                {editingId !== interaction.id && (
                  <button
                    type="button"
                    className="webflow-button"
                    onClick={() => setEditingId(interaction.id)}
                  >
                    Редактировать
                  </button>
                )}
                <button
                  type="button"
                  className="webflow-remove-button"
                  onClick={() => removeInteraction(interaction)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

