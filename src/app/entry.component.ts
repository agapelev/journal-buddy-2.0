// Copyright 2026 - Визуальный компонент записи Льва
import { Component, input, computed, ViewEncapsulation } from '@angular/core';

// Расширяем интерфейс, чтобы он соответствовал нашим новым целям
interface Entry {
    date: string;
    entry: string;
}

@Component({
    selector: 'app-entry',
    standalone: true,
    template: `
    <div class="entry_card">
    <div class="date_badge">{{ entry().date }}</div>

    <div class="content_text">
    @for(line of processedLines(); track line) {
        @if(line.isMetadata) {
            <div class="metadata_line">{{ line.text }}</div>
        } @else {
            <p>{{ line.text }}</p>
        }
    }
    </div>
    </div>
    `,
    styles: [],
    encapsulation: ViewEncapsulation.None
})
export class EntryComponent {
    // Входные данные записи
    entry = input.required<Entry>();

    /**
     * Логика обработки текста: отделяем наши метаданные (между ---)
     * от основного текста, чтобы разукрасить их по-разному.
     */
    processedLines = computed(() => {
        const lines = this.entry().entry.split('\n');
        let inMetadata = false;

        return lines.map(line => {
            const trimmed = line.trim();
            if (trimmed === '---') {
                inMetadata = !inMetadata;
                return { text: '⚙️ CONFIG', isMetadata: true };
            }
            return { text: line, isMetadata: inMetadata };
        });
    });
}
