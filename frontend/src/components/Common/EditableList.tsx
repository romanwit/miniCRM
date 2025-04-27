import React, { useEffect, useRef, useState } from "react";

interface FixedValueItem {
  id: number;
  value: string;
}

interface EditableListProps {
  maxItemLength?: number;
  list: FixedValueItem[];
  onFixedListValuesEdited: (list: string[]) => void;
}

const EditableList: React.FC<EditableListProps> = ({ maxItemLength = 100, list, onFixedListValuesEdited }) => {
  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const doUpdateRef = useRef(false);

  useEffect(() => {
    doUpdateRef.current = false;
    console.log(list);
    setItems(list.map(item => item.value));
  }, [list]);

  useEffect(() => {
    console.log("items changed");
    console.log(doUpdateRef.current);
    if (doUpdateRef.current) {
      console.log("calling handler though");
      onFixedListValuesEdited(items);
    }
  }, [items]);

  const handleAdd = () => {

    doUpdateRef.current = true;
    const trimmed = input.trim();

    if (!trimmed) return;
    if (trimmed.length > maxItemLength) {
      setError(`Max length — ${maxItemLength} chars.`);
      return;
    }

    const duplicate = items.some(
      (item, i) => item === trimmed && i !== editingIndex
    );

    if (duplicate) {
      setError("Already exists in the list.");
      return;
    }

    if (editingIndex !== null) {
      const updated = [...items];
      updated[editingIndex] = trimmed;
      setItems(updated);
      setEditingIndex(null);
    } else {
      setItems([...items, trimmed]);
    }

    setInput("");
    setError(null);
  };

  const handleEdit = (index: number) => {
    doUpdateRef.current = true;
    setInput(items[index]);
    setEditingIndex(index);
    setError(null);
  };

  const handleDelete = (index: number) => {
    doUpdateRef.current = true;
    setItems(items.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setInput("");
      setEditingIndex(null);
      setError(null);
    }
  };

  return (
    <div className="p-6 border rounded-xl max-w-lg mx-auto bg-white shadow-md">
      <div className="mb-4">
        <input
          type="text"
          value={input}
          maxLength={maxItemLength}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder={`Enter string up to ${maxItemLength} chars`}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
      <button type="button"
        onClick={handleAdd}
        disabled={!input.trim()}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {editingIndex !== null ? "Save" : "Add"}
      </button>

      <ul className="mt-6 space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-3 bg-gray-50 border rounded-lg"
          >
            <span className="flex-1 mr-4 truncate">{item}</span>
            <div className="flex space-x-2">
              <button type="button"
                onClick={() => handleEdit(index)}
                className="text-blue-500 hover:text-blue-700"
                title="Edit"
              >
                ✎
              </button>
              <button type="button"
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-700"
                title="Delete"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditableList;

