"use client";

import { useEffect, useRef, useState } from "react";

interface HTMLStructureProps {
  editor: any;
}

interface ComponentNode {
  id: string;
  type: string;
  tagName: string;
  name: string;
  children: ComponentNode[];
  component: any;
}

export function HTMLStructure({ editor }: HTMLStructureProps) {
  const [structure, setStructure] = useState<ComponentNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getDefaultName = (comp: any): string => {
    // Сначала проверяем сохраненное название
    const savedName = comp.getAttributes()?.["data-label"];
    if (savedName) return savedName;

    const tagName = comp.get("tagName") || "div";
    const type = comp.get("type") || "default";
    const content = comp.get("content") || "";
    
    // Получаем текст из содержимого (первые 30 символов)
    const textContent = typeof content === "string" 
      ? content.replace(/<[^>]*>/g, "").trim().substring(0, 30)
      : "";

    // Генерируем понятное название на основе типа и содержимого
    if (type === "text" || tagName === "p") {
      return textContent || "Текст";
    }
    if (tagName === "h1") return textContent || "Заголовок 1";
    if (tagName === "h2") return textContent || "Заголовок 2";
    if (tagName === "h3") return textContent || "Заголовок 3";
    if (tagName === "h4") return textContent || "Заголовок 4";
    if (tagName === "h5") return textContent || "Заголовок 5";
    if (tagName === "h6") return textContent || "Заголовок 6";
    if (tagName === "button") return textContent || "Кнопка";
    if (tagName === "img" || type === "image") {
      const src = comp.getAttributes()?.src || "";
      return src ? `Изображение: ${src.split("/").pop()}` : "Изображение";
    }
    if (tagName === "a") return textContent || "Ссылка";
    if (tagName === "ul" || tagName === "ol") return "Список";
    if (tagName === "li") return textContent || "Элемент списка";
    if (tagName === "form") return "Форма";
    if (tagName === "input") {
      const inputType = comp.getAttributes()?.type || "text";
      return `Поле ввода (${inputType})`;
    }
    if (tagName === "textarea") return "Текстовая область";
    if (tagName === "select") return "Выпадающий список";
    if (tagName === "table") return "Таблица";
    if (tagName === "section") return textContent || "Секция";
    if (tagName === "header") return "Шапка сайта";
    if (tagName === "footer") return "Подвал сайта";
    if (tagName === "nav") return "Навигация";
    if (type === "row") return "Строка";
    if (type === "cell") return "Ячейка";
    
    // Если есть текст, используем его
    if (textContent) return textContent;
    
    // Для div по умолчанию возвращаем "Контейнер"
    if (tagName === "div") return "Контейнер";
    
    // Иначе используем тип или тег
    return type !== "default" ? type : tagName;
  };

  const buildStructure = (components: any[]): ComponentNode[] => {
    if (!components || components.length === 0) return [];
    
    return components.map((comp) => {
      const comps = comp.get("components");
      const models = comps?.models || comps || [];
      
      const node: ComponentNode = {
        id: comp.getId(),
        type: comp.get("type") || "default",
        tagName: comp.get("tagName") || "div",
        name: getDefaultName(comp),
        children: buildStructure(Array.isArray(models) ? models : []),
        component: comp,
      };
      return node;
    });
  };

  const updateStructure = () => {
    if (!editor) return;
    
    // Проверяем, что редактор полностью инициализирован
    if (!editor.Components || typeof editor.getComponents !== 'function') {
      return;
    }
    
    try {
      const components = editor.getComponents();
      if (!components) return;
      
      const models = components?.models || components || [];
      const newStructure = buildStructure(Array.isArray(models) ? models : []);
      setStructure(newStructure);
      
      // Элементы по умолчанию закрыты (не разворачиваем автоматически)
      // При обновлении сохраняем текущее состояние
      setExpandedNodes((prev) => {
        // При обновлении сохраняем текущее состояние
        // Новые элементы остаются свернутыми по умолчанию
        return prev;
      });
    } catch (error) {
      console.error("Error updating structure:", error);
    }
  };

  const handleComponentSelect = (component: any) => {
    if (!editor) return;
    editor.select(component);
    setSelectedId(component.getId());
  };

  const toggleExpand = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleDoubleClick = (node: ComponentNode, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(node.id);
    setEditingValue(node.name);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleNameSave = (node: ComponentNode) => {
    if (!editor) return;
    
    const newName = editingValue.trim();
    if (newName) {
      // Сохраняем название в атрибуте компонента
      node.component.addAttributes({ "data-label": newName });
      updateStructure();
    }
    setEditingId(null);
    setEditingValue("");
  };

  const handleNameCancel = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, node: ComponentNode) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNameSave(node);
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleNameCancel();
    }
  };

  const renderNode = (node: ComponentNode, level: number = 0): JSX.Element => {
    const isSelected = selectedId === node.id;
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isEditing = editingId === node.id;
    const indent = level * 16;

    return (
      <div key={node.id} data-node-id={node.id}>
        <div
          className={`html-structure-item ${isSelected ? "selected" : ""}`}
          style={{ paddingLeft: `${indent + 8}px` }}
          onClick={() => !isEditing && handleComponentSelect(node.component)}
          onDoubleClick={(e) => handleDoubleClick(node, e)}
        >
          <div className="html-structure-item-content">
            {hasChildren ? (
              <button
                className="html-structure-toggle"
                onClick={(e) => toggleExpand(node.id, e)}
                aria-label={isExpanded ? "Свернуть" : "Развернуть"}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`html-structure-arrow ${isExpanded ? "expanded" : ""}`}
                >
                  <path
                    d="M4.5 3L7.5 6L4.5 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ) : (
              <span className="html-structure-toggle-spacer"></span>
            )}
            <span className="html-structure-tag">{node.tagName}</span>
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={() => handleNameSave(node)}
                onKeyDown={(e) => handleKeyDown(e, node)}
                className="html-structure-name-input"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="html-structure-name">
                {node.name}
              </span>
            )}
            {node.type !== "default" && !isEditing && (
              <span className="html-structure-type">({node.type})</span>
            )}
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="html-structure-children">
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (!editor) return;

    const loadHandler = () => {
      setTimeout(updateStructure, 200);
    };
    
    updateStructure();

    const updateHandler = () => {
      setTimeout(updateStructure, 100);
    };

    const selectHandler = (selected: any) => {
      if (!selected) {
        setSelectedId(null);
        return;
      }
      
      const id = selected.getId();
      const tagName = selected.get("tagName") || "";
      setSelectedId(id);
      
      if (tagName === "div") {
        const findPath = (nodes: ComponentNode[], targetId: string, path: string[] = []): string[] | null => {
          for (const node of nodes) {
            if (node.id === targetId) return path;
            if (node.children.length > 0) {
              const found = findPath(node.children, targetId, [...path, node.id]);
              if (found) return found;
            }
          }
          return null;
        };
        
        setTimeout(() => {
          const components = editor.getComponents();
          const models = components?.models || components || [];
          const currentStructure = buildStructure(Array.isArray(models) ? models : []);
          const path = findPath(currentStructure, id);
          
          if (path) {
            setExpandedNodes((prev) => {
              const newSet = new Set(prev);
              path.forEach((nodeId) => newSet.add(nodeId));
              return newSet;
            });
            
            setTimeout(() => {
              const element = containerRef.current?.querySelector(`[data-node-id="${id}"]`);
              element?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 100);
          }
        }, 100);
      }
    };

    editor.on("load", loadHandler);
    editor.on("component:add", updateHandler);
    editor.on("component:remove", updateHandler);
    editor.on("component:update", updateHandler);
    editor.on("component:update:style", updateHandler);
    editor.on("component:update:attributes", updateHandler);
    editor.on("component:update:content", updateHandler);
    editor.on("component:selected", selectHandler);
    editor.on("component:deselected", () => setSelectedId(null));

    return () => {
      editor.off("load", loadHandler);
      editor.off("component:add", updateHandler);
      editor.off("component:remove", updateHandler);
      editor.off("component:update", updateHandler);
      editor.off("component:update:style", updateHandler);
      editor.off("component:update:attributes", updateHandler);
      editor.off("component:update:content", updateHandler);
      editor.off("component:selected", selectHandler);
      editor.off("component:deselected");
    };
  }, [editor]);

  return (
    <div ref={containerRef} className="html-structure-container">
      <div className="html-structure-list">
        {structure.length === 0 ? (
          <div className="html-structure-empty">
            <p>Нет элементов</p>
            <span>Добавьте элементы на страницу</span>
          </div>
        ) : (
          structure.map((node) => renderNode(node))
        )}
      </div>
    </div>
  );
}

