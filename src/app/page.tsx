'use client';

import { useState } from 'react';
import { FamilyTree } from '@/types/family';
import FamilySelector from '@/components/FamilySelector';
import FamilyTreeComponent from '@/components/FamilyTree';

export default function Home() {
  const [currentFamily, setCurrentFamily] = useState<FamilyTree | null>(null);

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">家族谱树展示</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {currentFamily ? (
            <>
              <FamilySelector onSelect={setCurrentFamily} currentFamily={currentFamily} />
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{currentFamily.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">{currentFamily.description}</p>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <FamilyTreeComponent data={currentFamily} />
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <FamilySelector onSelect={setCurrentFamily} currentFamily={null} />
              <p className="text-gray-600 dark:text-gray-400">请选择要查看的族谱</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
