
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import EditableText from './EditableText';

const DynamicList = ({ contentKey, section, defaultItems, renderItem, className, maxItems }) => {
    const { user } = useAuth();
    const [items, setItems] = useState(defaultItems || []);
    const isAdmin = user?.role?.name === 'Admin';

    useEffect(() => {
        setItems(defaultItems || []);
    }, [defaultItems]);

    // Debounce Ref
    const debounceTimer = React.useRef(null);

    const persistList = async (newItems) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/admin/content', {
                key: contentKey,
                value: newItems,
                section: section
            }, {
                headers: { Authorization: `Bearer ${token} ` }
            });
        } catch (error) {
            console.error('Failed to save list', error);
            alert('Failed to save list');
            // Ideally revert state here if failure, but keeping simple
        }
    };

    const addItem = () => {
        if (maxItems && items.length >= maxItems) return;
        const newItem = { id: Date.now(), title: 'New Slide', desc: 'Description', image: 'https://via.placeholder.com/800x400' };
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
        const newItems = items.map(item => item.id === id ? { ...item, [field]: value } : item);
        setItems(newItems); // Immediate update

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            persistList(newItems);
        }, 1000);
    };

    return (
        <div className={className}>
            {items.map((item, index) => (
                <div key={item.id} className="relative group mb-4">
                    {/* Render Slot */}
                    {renderItem(item, (field, val) => updateItem(item.id, field, val))}

                    {isAdmin && (
                        <button
                            onClick={() => deleteItem(item.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            X
                        </button>
                    )}
                </div>
            ))}
            {isAdmin && (
                <button onClick={addItem} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                    + Add Item
                </button>
            )}
        </div>
    );
};

export default DynamicList;
