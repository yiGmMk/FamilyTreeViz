'use client';

import { useState, useEffect } from 'react';
import { FamilyTree } from '@/types/family';

interface FamilySelectorProps {
  onSelect: (family: FamilyTree) => void;
  currentFamily: FamilyTree | null;
}

export default function FamilySelector({ onSelect, currentFamily }: FamilySelectorProps) {
  const [families, setFamilies] = useState<FamilyTree[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFamilies = async () => {
      try {
        const familyFiles = [
          'bai-family.json',
          'jia-family.json',
          'sample-family.json',
          'shi-family.json',
          'wang-family.json',
          'xue-family.json'
        ];

        const loadedFamilies = await Promise.all(
          familyFiles.map(async (file) => {
            const module = await import(`@/data/families/${file}`);
            return module.default;
          })
        );

        setFamilies(loadedFamilies);
      } catch (error) {
        console.error('加载族谱数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFamilies();
  }, []);

  if (loading) {
    return <div className="text-gray-600 dark:text-gray-400">加载中...</div>;
  }

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {families.map((family) => (
        <button
          key={family.id}
          onClick={() => onSelect(family)}
          className={`px-4 py-2 rounded-lg transition-colors ${currentFamily?.id === family.id
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {family.name}
        </button>
      ))}
    </div>
  );
}