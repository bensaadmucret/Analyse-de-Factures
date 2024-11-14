import React from 'react';

interface TextEditorProps {
  text: string;
  onTextChange: (text: string) => void;
}

export default function TextEditor({ text, onTextChange }: TextEditorProps) {
  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Texte extrait et corrigé
      </label>
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Le texte extrait apparaîtra ici..."
      />
    </div>
  );
}