'use client';

import { useState, useEffect } from 'react';
import SectionWrapper from '@/components/SectionWrapper';

interface ShoppingItem {
  id: number;
  name: string;
  amount: number;
  unit: string;
  recipeTitle: string;
  checked: boolean;
}

export default function ShoppingListPage() {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [customItem, setCustomItem] = useState({
    name: '',
    amount: 1,
    unit: 'item'
  });
  const [errors, setErrors] = useState({
    name: ''
  });

  useEffect(() => {
    const loadShoppingList = () => {
      try {
        const savedList = localStorage.getItem('cookmate-shopping-list');
        if (savedList) {
          const items = JSON.parse(savedList);
          setShoppingList(items.map((item: any) => ({ ...item, checked: item.checked || false })));
        }
      } catch (error) {
        console.error('Error loading shopping list:', error);
      } finally {
        setLoading(false);
      }
    };

    loadShoppingList();
  }, []);

  const updateShoppingList = (updatedList: ShoppingItem[]) => {
    setShoppingList(updatedList);
    localStorage.setItem('cookmate-shopping-list', JSON.stringify(updatedList));
  };

  const toggleItem = (itemId: number) => {
    const updatedList = shoppingList.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    updateShoppingList(updatedList);
  };

  const removeItem = (itemId: number) => {
    const updatedList = shoppingList.filter(item => item.id !== itemId);
    updateShoppingList(updatedList);
  };

  const clearCompleted = () => {
    const updatedList = shoppingList.filter(item => !item.checked);
    updateShoppingList(updatedList);
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear the entire shopping list?')) {
      setShoppingList([]);
      localStorage.removeItem('cookmate-shopping-list');
    }
  };

  const addCustomItem = () => {
    setShowAddItemModal(true);
    setCustomItem({ name: '', amount: 1, unit: 'item' });
    setErrors({ name: '' });
  };

  const handleAddItem = () => {
    // Validation
    const newErrors = { name: '' };
    let hasError = false;

    if (!customItem.name.trim()) {
      newErrors.name = 'Item name is required';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const newItem: ShoppingItem = {
      id: Date.now(),
      name: customItem.name.trim(),
      amount: customItem.amount,
      unit: customItem.unit,
      recipeTitle: 'Custom',
      checked: false
    };
    updateShoppingList([...shoppingList, newItem]);
    setShowAddItemModal(false);
  };

  const handleCancelAdd = () => {
    setShowAddItemModal(false);
    setCustomItem({ name: '', amount: 1, unit: 'item' });
    setErrors({ name: '' });
  };

  const groupedItems = shoppingList.reduce((groups, item) => {
    const key = item.recipeTitle;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as { [key: string]: ShoppingItem[] });

  const completedCount = shoppingList.filter(item => item.checked).length;
  const totalCount = shoppingList.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-gray-600 dark:text-gray-400">Loading shopping list...</p>
        </div>
      </div>
    );
  }

  return (
    <SectionWrapper>
      <div className="min-h-screen py-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#A39BDE] to-[#5A4A8B] rounded-lg p-8 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Shopping List
                </h1>
                {totalCount > 0 && (
                  <p className="text-white opacity-90 mt-2">
                    {completedCount} of {totalCount} items completed
                  </p>
                )}
              </div>
            
              <div className="flex gap-2">
                <button
                  onClick={addCustomItem}
                  className="bg-white text-blue-600 hover:bg-gray-100 py-2 px-4 rounded-lg transition-colors font-semibold"
                >
                  Add Item
                </button>
                {shoppingList.some(item => item.checked) && (
                  <button
                    onClick={clearCompleted}
                    className="bg-white text-green-600 hover:bg-gray-100 py-2 px-4 rounded-lg transition-colors font-semibold"
                  >
                    Clear Completed
                  </button>
                )}
                {totalCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="bg-white text-red-600 hover:bg-gray-100 py-2 px-4 rounded-lg transition-colors font-semibold"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>

          {totalCount === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🛒</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your shopping list is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Add ingredients from recipes or create custom items to get started!
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => window.location.href = '/search'}
                  className="bg-gradient-to-r from-[#8F84C8] to-[#5A4A8B] hover:from-[#A39BDE] hover:to-[#5A4A8B] text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Find Recipes
                </button>
                <button
                  onClick={addCustomItem}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Add Custom Item
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Progress Bar */}
              {totalCount > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">
                      {Math.round((completedCount / totalCount) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#8F84C8] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(completedCount / totalCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Shopping List Items */}
              {Object.entries(groupedItems).map(([recipeTitle, items]) => (
                <div key={recipeTitle} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#A39BDE] to-[#5A4A8B] rounded-t-lg">
                    <h3 className="text-lg font-semibold text-white">
                      {recipeTitle}
                    </h3>
                  </div>
                  
                  <div className="p-4">
                    <ul className="space-y-3">
                      {items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center flex-1">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => toggleItem(item.id)}
                              className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-3"
                            />
                            <span className={`flex-1 ${item.checked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                              {item.amount} {item.unit} {item.name}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 ml-4"
                            title="Remove item"
                          >
                            🗑️
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          <div className="mt-8 bg-gradient-to-r from-[#A39BDE] to-[#5A4A8B] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Shopping Tips
            </h3>
            <ul className="text-white space-y-2">
              <li>• Check off items as you shop to track your progress</li>
              <li>• Items are grouped by recipe for easy organization</li>
              <li>• Add custom items for non-recipe ingredients</li>
              <li>• Clear completed items to keep your list clean</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add Custom Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Add Custom Item</h3>
                <button
                  onClick={handleCancelAdd}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={customItem.name}
                    onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8F84C8] text-black ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter item name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={customItem.amount}
                      onChange={(e) => setCustomItem({ ...customItem, amount: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8F84C8] text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={customItem.unit}
                      onChange={(e) => setCustomItem({ ...customItem, unit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8F84C8] text-black"
                    >
                      <option value="item">item(s)</option>
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="lb">lb</option>
                      <option value="oz">oz</option>
                      <option value="L">L</option>
                      <option value="mL">mL</option>
                      <option value="cup">cup(s)</option>
                      <option value="tbsp">tbsp</option>
                      <option value="tsp">tsp</option>
                      <option value="package">package(s)</option>
                      <option value="box">box(es)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCancelAdd}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#8F84C8] to-[#5A4A8B] text-white rounded-lg hover:from-[#A39BDE] hover:to-[#5A4A8B] font-medium transition-colors"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}
