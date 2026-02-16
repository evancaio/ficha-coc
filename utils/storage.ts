// Funções para salvar e carregar personagens do localStorage
import { Character } from '@/types/character';

const STORAGE_KEY = 'coc_characters';
const CURRENT_CHARACTER_KEY = 'coc_current_character';

export function saveCharacter(character: Character, id?: string): string {
    const characterId = id || generateId();
    const characters = getAllCharacters();

    characters[characterId] = {
        ...character,
        lastModified: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    localStorage.setItem(CURRENT_CHARACTER_KEY, characterId);

    return characterId;
}

export function loadCharacter(id: string): Character | null {
    const characters = getAllCharacters();
    return characters[id] || null;
}

export function getCurrentCharacter(): Character | null {
    const currentId = localStorage.getItem(CURRENT_CHARACTER_KEY);
    if (!currentId) return null;
    return loadCharacter(currentId);
}

export function getAllCharacters(): Record<string, any> {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
}

export function deleteCharacter(id: string): void {
    const characters = getAllCharacters();
    delete characters[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));

    const currentId = localStorage.getItem(CURRENT_CHARACTER_KEY);
    if (currentId === id) {
        localStorage.removeItem(CURRENT_CHARACTER_KEY);
    }
}

export function listCharacters(): Array<{ id: string; name: string; occupation: string; lastModified: string }> {
    const characters = getAllCharacters();
    return Object.entries(characters).map(([id, char]) => ({
        id,
        name: char.basicInfo?.name || 'Sem nome',
        occupation: char.basicInfo?.occupation || 'Sem ocupação',
        lastModified: char.lastModified || new Date().toISOString()
    }));
}

function generateId(): string {
    return `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
