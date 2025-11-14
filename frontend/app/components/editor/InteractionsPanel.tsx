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
  const [newInteractionType, setNewInteractionType] = useState<'click'>('click');
  const [newActionType, setNewActionType] = useState<'link' | 'anchor' | 'scroll' | 'modal' | 'custom'>('link');
  const [newActionValue, setNewActionValue] = useState<string>('');


  const loadInteractions = () => {
    if (!editor || !selectedComponent) return;

    const component = selectedComponent;
    const css = editor.Css as any;
    const rules = css.getAll();
    const componentClasses = component.getClasses();
    const attrs = component.getAttributes() || {};
    
    const classesArray = Array.isArray(componentClasses) 
      ? componentClasses.map((cls: any) => typeof cls === 'string' ? cls : (cls?.getName?.() || cls?.get?.('name') || String(cls)))
      : [];
    
    const foundInteractions: Interaction[] = [];
    
    if (attrs.onclick || attrs.href) {
      let actionType: 'link' | 'anchor' | 'scroll' | 'modal' | 'custom' = 'custom';
      let actionValue = '';
      
      if (attrs.href) {
        if (attrs.href.startsWith('#')) {
          actionType = 'anchor';
          actionValue = attrs.href;
        } else {
          actionType = 'link';
          actionValue = attrs.href;
        }
      } else if (attrs.onclick) {
        const onclick = attrs.onclick;
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
    
    const existing = interactions.find(i => i.type === newInteractionType);
    if (existing) {
      alert('Такое взаимодействие уже существует');
      return;
    }

    if (newInteractionType === 'click') {
      if (newActionType !== 'custom' && !newActionValue.trim()) {
        alert('Пожалуйста, заполните поле значения');
        return;
      }
      
      const tagName = component.get('tagName')?.toLowerCase();
      
      if (tagName === 'a' && (newActionType === 'link' || newActionType === 'anchor') && newActionValue) {
        component.addAttributes({ href: newActionValue });
      } else if (newActionType === 'link' && newActionValue) {
        if (tagName !== 'a') {
          const newOnClick = `window.location.href='${newActionValue}';`;
          component.addAttributes({ onclick: newOnClick });
        } else {
          component.addAttributes({ href: newActionValue });
        }
      } else if (newActionType === 'anchor' && newActionValue) {
        const anchorValue = newActionValue.startsWith('#') ? newActionValue : `#${newActionValue}`;
        if (tagName === 'a') {
          component.addAttributes({ href: anchorValue });
        } else {
          const anchorScript = `const target = document.querySelector('${anchorValue}'); if (target) target.scrollIntoView({behavior: 'smooth', block: 'start'});`;
          component.addAttributes({ onclick: anchorScript });
        }
      } else if (newActionType === 'scroll' && newActionValue) {
        const scrollScript = `const target = document.querySelector('${newActionValue}'); if (target) target.scrollIntoView({behavior: 'smooth', block: 'start'});`;
        component.addAttributes({ onclick: scrollScript });
      } else if (newActionType === 'modal' && newActionValue) {
        const modalScript = `const modal = document.getElementById('${newActionValue}'); if (modal) { modal.showModal?.() || (modal.style.display = 'block'); }`;
        component.addAttributes({ onclick: modalScript });
      } else if (newActionType === 'custom') {
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
  };

  const removeInteraction = (interaction: Interaction) => {
    if (!editor || !selectedComponent) return;

    const component = selectedComponent;
    
    if (interaction.type === 'click') {
      const attrs = component.getAttributes() || {};
      if (attrs.onclick) {
        component.removeAttributes('onclick');
      }
      if (attrs.href && (interaction.action?.type === 'link' || interaction.action?.type === 'anchor')) {
        component.removeAttributes('href');
      }
    }

    setInteractions(interactions.filter(i => i.id !== interaction.id));
    editor.refresh();
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
                  ) : null}
                </div>
              </div>
              <div className="webflow-interaction-actions">
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

