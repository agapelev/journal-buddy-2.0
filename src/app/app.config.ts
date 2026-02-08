// Copyright 2026 - Конфигурация "Бортового журнала" Льва
// Официальная документация Angular по ApplicationConfig:
// https://angular.dev/api/core/ApplicationConfig

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

/**
 * Конфигурация приложения.
 * Здесь мы будем регистрировать провайдеры для HTTP, анимаций и маршрутизации.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Оптимизация производительности: уменьшаем количество циклов проверки изменений
    provideZoneChangeDetection({ eventCoalescing: true })

    /**
     * НАЗИДАНИЕ:
     * "Всякое здание, слагаемое стройно, возрастает в святый храм в Господе" (Еф. 2:21).
     * Хорошая конфигурация — это залог того, что здание твоего кода не рухнет
     * под тяжестью новых функций. Мы заложили прочное основание.
     */
  ]
};
