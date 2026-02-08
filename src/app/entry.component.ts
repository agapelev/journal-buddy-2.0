// Copyright 2026 - Визуальный компонент записи Льва
import { Component, input, computed } from '@angular/core';

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
    styles: `
    :host { display: block; max-width: 800px; margin: 0 auto; }

    .entry_card {
        padding: 25px;
        margin: 15px 20px;
        background: #ffffff;
        border-left: 4px solid #1a73e8;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        border-radius: 0 12px 12px 0;
        transition: transform 0.2s;
    }

    .entry_card:hover {
        transform: translateX(5px);
        background: #fafafa;
    }

    .date_badge {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 800;
        color: #1a73e8;
        margin-bottom: 12px;
        font-family: 'Monaco', 'Consolas', monospace;
    }

    .content_text {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        font-size: 15px;
    }

    .metadata_line {
        font-family: 'Monaco', 'Consolas', monospace;
        background: #f1f3f4;
        color: #5f6368;
        padding: 2px 8px;
        font-size: 12px;
        border-radius: 4px;
        display: inline-block;
        margin-bottom: 10px;
        border: 1px dashed #dadce0;
    }

    p { margin: 8px 0; }
    `
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
