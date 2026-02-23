import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    // Сигнал для хранения текста уведомления
    message = signal<string | null>(null);

    show(msg: string) {
        this.message.set(msg);
        console.log(`[Notification]: ${msg}`);

        // Автоматически скрываем через 3 секунды
        setTimeout(() => {
            this.message.set(null);
        }, 3000);
    }
}
