import React, { useState, useEffect, useRef } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import CMSIconButton from '../common/CMSIconButton';
import EditableText from './EditableText';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';

const DynamicList = ({ contentKey, section, defaultItems, renderItem, className, maxItems, newItemTemplate }) => {
    const { user } = useAuth();
    const { isEditMode } = useCMS();
    const [items, setItems] = useState(defaultItems || []);
    const isAdmin = user?.role?.name === 'Admin';

    useEffect(() => {
        setItems(defaultItems || []);
    }, [defaultItems]);

    // Debounce Ref
    const debounceTimer = React.useRef(null);

    const persistList = async (newItems) => {
        try {
            await api.put('/admin/content', {
                key: contentKey,
                value: newItems,
                section: section
            });
        } catch (error) {
            console.error('Failed to save list', error);
            alert('Failed to save list');
            // Ideally revert state here if failure, but keeping simple
        }
    };

    const addItem = () => {
        if (maxItems && items.length >= maxItems) return;
        const newItem = {
            id: Date.now(),
            ...(newItemTemplate || { title: 'New Slide', desc: 'Description', image: 'https://via.placeholder.com/800x400' })
        };
        const newItems = [...items, newItem];
        setItems(newItems);
        persistList(newItems);
    };

    const deleteItem = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            const newItems = items.filter(item => item.id !== id);
            setItems(newItems);
            persistList(newItems);
        }
    };

    const updateItem = (id, field, value) => {
        setItems(prevItems => {
            let newItems;
            if (typeof field === 'object') {
                // Batch update
                newItems = prevItems.map(item => item.id === id ? { ...item, ...field } : item);
            } else {
                // Single field update
                newItems = prevItems.map(item => item.id === id ? { ...item, [field]: value } : item);
            }

            // Side effect: Persist after delay (Debounce)
            // Note: putting side effects in setter is risky but works for simple cases. 
            // Better to use useEffect but requires refactoring.
            // We'll reset the timer here.
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => {
                persistList(newItems);
            }, 1000);

            return newItems;
        });
    };

    return (
        <div className={className}>
            {items.map((item, index) => (
                <div key={item.id} className="relative group mb-4">
                    {/* Render Slot */}
                    {renderItem(item, (field, val) => updateItem(item.id, field, val))}

                    {isAdmin && isEditMode && (
                        <CMSIconButton 
                            icon={FaTrash}
                            onClick={() => deleteItem(item.id)}
                            title="Delete Item"
                            variant="danger"
                            className="absolute top-2 right-2 opacity-80 group-hover:opacity-100"
                            size={12}
                        />
                    )}
                </div>
            ))}
            {isAdmin && isEditMode && (
                <button onClick={addItem} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition-colors">
                    + Add Item
                </button>
            )}
        </div>
    );
};

export default DynamicList;
