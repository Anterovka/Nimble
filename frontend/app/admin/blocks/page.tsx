"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { getBlocks, getBlock, createBlock, updateBlock, deleteBlock, type CustomBlock, type CustomBlockList } from "@/app/lib/blocks";
import { apiClient } from "@/app/lib/api";
import { AppHeader } from "@/app/components/AppHeader";
import { StaticStarField } from "@/app/components/StaticStarField";

const CATEGORIES = ['Базовые', 'Структура', 'Формы', 'Медиа', 'Навигация', 'Другое'];

export default function BlocksAdminPage() {
  const { user } = useAuth();
  const [blocks, setBlocks] = useState<CustomBlockList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<CustomBlock | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Проверка прав суперпользователя
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    checkSuperuser();
    loadBlocks();
  }, []);

  const checkSuperuser = async () => {
    try {
      const profile = await apiClient.get<any>('/auth/profile/');
      setIsSuperuser(profile.is_superuser || false);
    } catch (err) {
      console.error('Ошибка проверки прав:', err);
      setIsSuperuser(false);
    }
  };

  const loadBlocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBlocks(selectedCategory || undefined, isSuperuser ? undefined : true);
      // Убеждаемся, что data - это массив
      if (Array.isArray(data)) {
        setBlocks(data);
      } else {
        console.error('Ожидался массив, получено:', data);
        setBlocks([]);
        setError('Неверный формат данных от сервера');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки блоков');
      setBlocks([]); // Устанавливаем пустой массив при ошибке
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlocks();
  }, [selectedCategory, isSuperuser]);

  const handleCreate = () => {
    setEditingBlock({
      id: 0,
      name: '',
      block_id: '',
      category: 'Другое',
      description: '',
      preview: '',
      content: '',
      label: '',
      media: '',
      is_active: true,
      order: 0,
      attributes: {},
      traits: [],
      component_type: '',
      created_at: '',
      updated_at: '',
    });
    setIsCreating(true);
  };

  const handleEdit = async (id: number) => {
    try {
      const block = await getBlock(id);
      setEditingBlock(block);
      setIsCreating(false);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки блока');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот блок?')) return;
    
    try {
      await deleteBlock(id);
      await loadBlocks();
    } catch (err: any) {
      setError(err.message || 'Ошибка удаления блока');
    }
  };

  const handleSave = async (blockData: CustomBlock) => {
    try {
      setError(null);
      if (isCreating) {
        await createBlock(blockData);
      } else {
        await updateBlock(blockData.id, blockData);
      }
      setEditingBlock(null);
      setIsCreating(false);
      await loadBlocks();
    } catch (err: any) {
      setError(err.message || 'Ошибка сохранения блока');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#050505] to-[#000000] text-white flex items-center justify-center relative overflow-hidden">
        <StaticStarField starCount={120} />
        <div className="text-center relative z-10">
          <h1 className="text-2xl font-bold mb-4">Требуется авторизация</h1>
          <p className="text-white/70">Пожалуйста, войдите в систему</p>
        </div>
      </div>
    );
  }

  if (!isSuperuser) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#050505] to-[#000000] text-white flex items-center justify-center relative overflow-hidden">
        <StaticStarField starCount={120} />
        <div className="text-center relative z-10">
          <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
          <p className="text-white/70">Требуются права суперпользователя</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#050505] to-[#000000] text-white relative overflow-hidden">
      <StaticStarField starCount={120} />
      <AppHeader />
      <div className="relative z-10 pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">
                Управление блоками
              </h1>
              <p className="text-white/60">Создавайте и редактируйте кастомные блоки для редактора</p>
            </div>
            <button
              onClick={handleCreate}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl font-semibold transition-all"
            >
              + Создать блок
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-white/80">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-white/80">Фильтр по категории:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white backdrop-blur-sm hover:border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="">Все категории</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

        {loading ? (
          <div className="text-center py-12 text-white/60">Загрузка...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(blocks) && blocks.length > 0 ? (
              blocks.map(block => (
              <div
                key={block.id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {block.preview && <span className="text-2xl">{block.preview}</span>}
                      <h3 className="text-xl font-semibold text-white">{block.name}</h3>
                    </div>
                    <p className="text-sm text-white/50 font-mono mb-1">{block.block_id}</p>
                    <span className="inline-block px-2 py-1 text-xs bg-white/5 text-white/70 rounded-lg border border-white/10">
                      {block.category}
                    </span>
                  </div>

                </div>
                {block.description && (
                  <p className="text-sm text-white/70 mb-4 line-clamp-2">{block.description}</p>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-xs text-white/50">Порядок: {block.order}</span>
                  <span className={`px-2 py-1 text-xs rounded-lg font-medium border ${
                    block.is_active 
                      ? 'bg-white/5 text-white/70 border-white/10' 
                      : 'bg-white/5 text-white/50 border-white/10'
                  }`}>
                    {block.is_active ? 'Активен' : 'Неактивен'}
                  </span>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(block.id)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-sm font-medium transition-colors text-white"
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => handleDelete(block.id)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-sm font-medium transition-colors text-white"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
                
              </div>
            ))
            ) : (
              <div className="col-span-full text-center py-12 text-white/60">
                {Array.isArray(blocks) ? 'Блоки не найдены' : 'Ошибка загрузки блоков'}
              </div>
            )}
          </div>
        )}
        </div>
      </div>
      
      {editingBlock && (
        <BlockEditModal
          block={editingBlock}
          isCreating={isCreating}
          onSave={handleSave}
          onClose={() => {
            setEditingBlock(null);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
}

function BlockEditModal({
  block,
  isCreating,
  onSave,
  onClose,
}: {
  block: CustomBlock;
  isCreating: boolean;
  onSave: (block: CustomBlock) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<CustomBlock>(block);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
      <div className="bg-white/5 border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl backdrop-blur-xl">
        <div className="p-6 border-b border-white/10 shrink-0">
          <h2 className="text-2xl font-bold text-white">
            {isCreating ? 'Создание блока' : 'Редактирование блока'}
          </h2>
        </div>
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Название *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white backdrop-blur-sm hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">ID блока *</label>
              <input
                type="text"
                value={formData.block_id}
                onChange={(e) => setFormData({ ...formData, block_id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white backdrop-blur-sm hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={!isCreating}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Категория *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white backdrop-blur-sm hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors"
                required
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Порядок</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white backdrop-blur-sm hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Описание</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white backdrop-blur-sm hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors resize-none"
              rows={2}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Превью (эмодзи)</label>
            <input
              type="text"
              value={formData.preview || ''}
              onChange={(e) => setFormData({ ...formData, preview: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white backdrop-blur-sm hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors"
              maxLength={10}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">HTML содержимое *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm backdrop-blur-sm hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors resize-none"
              rows={8}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Label с превью (HTML, опционально)</label>
            <textarea
              value={formData.label || ''}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm backdrop-blur-sm hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors resize-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">SVG иконка (опционально)</label>
            <textarea
              value={formData.media || ''}
              onChange={(e) => setFormData({ ...formData, media: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm backdrop-blur-sm hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors resize-none"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Активен</span>
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-colors font-medium text-white"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl font-semibold transition-all text-white"
            >
              Сохранить
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}

