initializeJournals() {
    JOURNALS.forEach(journal => {
        const existing = localStorage.getItem(`journal_${journal.id}`);
        if (!existing) {
            const welcomeMsg = [{
                id: Date.now(),
                     content: `Добро пожаловать в журнал: ${journal.title}. Летопись начата.`,
                     date: new Date().toISOString(),
                     author: 'Gemini 3'
            }];
            localStorage.setItem(`journal_${journal.id}`, JSON.stringify(welcomeMsg));
        }
    });
}
