/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const hourHand = document.querySelector('.hour-hand');
    const minHand = document.querySelector('.min-hand');
    const secondHand = document.querySelector('.second-hand');
    const gregorianDateEl = document.getElementById('gregorian-date');
    const hijriDateEl = document.getElementById('hijri-date');
    const prayerCards = document.querySelectorAll('.prayer-card');
    const langEnBtn = document.getElementById('lang-en');
    const langArBtn = document.getElementById('lang-ar');
    const toneSelectorBtn = document.getElementById('tone-selector-btn');
    const toneFileInput = document.getElementById('tone-file-input');

    // --- Language Strings ---
    const translations = {
        en: {
            appTitle: "Prayer Times",
            fajr: "Fajr",
            dhuhr: "Dhuhr",
            asr: "Asr",
            maghrib: "Maghrib",
            isha: "Isha",
            alerts: "Adhan Alerts",
            chooseTone: "Choose Tone",
            adhkarAria: "Adhkar after {prayerName} prayer",
        },
        ar: {
            appTitle: "أوقات الأذان",
            fajr: "الفجر",
            dhuhr: "الظهر",
            asr: "العصر",
            maghrib: "المغرب",
            isha: "العشاء",
            alerts: "تنبيهات الأذان",
            chooseTone: "اختر نغمة",
            adhkarAria: "أذكار بعد صلاة {prayerName}",
        }
    };

    // --- Prayer Times (Placeholder Data) ---
    // In a real app, this would come from an API
    const prayerTimes = {
        Fajr: "04:30",
        Dhuhr: "12:30",
        Asr: "16:00",
        Maghrib: "18:45",
        Isha: "20:15"
    };

    // --- Functions ---
    
    function setClock() {
        const now = new Date();
        const seconds = now.getSeconds();
        const secondsDegrees = ((seconds / 60) * 360) + 90;
        if(secondHand) (secondHand as HTMLElement).style.transform = `translateY(-50%) rotate(${secondsDegrees}deg)`;

        const mins = now.getMinutes();
        const minsDegrees = ((mins / 60) * 360) + ((seconds/60)*6) + 90;
        if(minHand) (minHand as HTMLElement).style.transform = `translateY(-50%) rotate(${minsDegrees}deg)`;

        const hour = now.getHours();
        const hourDegrees = ((hour / 12) * 360) + ((mins/60)*30) + 90;
        if(hourHand) (hourHand as HTMLElement).style.transform = `translateY(-50%) rotate(${hourDegrees}deg)`;
    }

    function setDates(lang: 'ar' | 'en' = 'ar') {
        const now = new Date();
        const gregorianOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const hijriOptions: Intl.DateTimeFormatOptions = { calendar: 'islamic-umalqura', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        if (gregorianDateEl) gregorianDateEl.textContent = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', gregorianOptions).format(now);
        if (hijriDateEl) hijriDateEl.textContent = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA-u-ca-islamic' : 'en-US-u-ca-islamic', hijriOptions).format(now);
    }
    
    function updateNextPrayerHighlight() {
        const now = new Date();
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
        
        let nextPrayerName: string | null = null;
        let minDiff = Infinity;

        const prayerTimesInMinutes = Object.entries(prayerTimes).map(([name, time]) => {
            const [h, m] = time.split(':').map(Number);
            return { name, timeInMinutes: h * 60 + m };
        }).sort((a, b) => a.timeInMinutes - b.timeInMinutes);

        // Find the first prayer time that is after the current time
        const nextPrayer = prayerTimesInMinutes.find(p => p.timeInMinutes > currentTimeInMinutes);

        // If all prayers for today are done, the next one is Fajr of the next day
        nextPrayerName = nextPrayer ? nextPrayer.name : prayerTimesInMinutes[0].name;

        prayerCards.forEach(card => {
            if (card.getAttribute('data-prayer') === nextPrayerName) {
                card.classList.add('next-prayer');
            } else {
                card.classList.remove('next-prayer');
            }
        });
    }

    function setLanguage(lang: 'ar' | 'en') {
        const htmlEl = document.documentElement;
        htmlEl.lang = lang;
        htmlEl.dir = lang === 'ar' ? 'rtl' : 'ltr';

        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key') as keyof typeof translations.en;
            if (key) {
                element.textContent = translations[lang][key] || translations.en[key];
            }
        });
        
        document.querySelectorAll('[data-lang-key-aria]').forEach(element => {
            const key = element.getAttribute('data-lang-key-aria') as keyof typeof translations.en;
            const prayerNameKey = element.getAttribute('data-prayer-name') as keyof typeof translations.en;
            if (key && prayerNameKey) {
                const prayerName = translations[lang][prayerNameKey] || translations.en[prayerNameKey];
                const ariaLabel = (translations[lang][key] || translations.en[key]).replace('{prayerName}', prayerName);
                element.setAttribute('aria-label', ariaLabel);
            }
        });

        if (lang === 'ar') {
            langArBtn?.classList.add('active');
            langEnBtn?.classList.remove('active');
        } else {
            langEnBtn?.classList.add('active');
            langArBtn?.classList.remove('active');
        }

        // Also update dates to the new locale
        setDates(lang);
    }


    // --- Event Listeners ---
    langEnBtn?.addEventListener('click', () => setLanguage('en'));
    langArBtn?.addEventListener('click', () => setLanguage('ar'));
    
    toneSelectorBtn?.addEventListener('click', () => {
        toneFileInput?.click();
    });

    toneFileInput?.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            console.log("Selected file:", target.files[0].name);
            // Here you would handle the file, e.g., save its path or content
            // to be used for notifications via the Java interface.
        }
    });


    // --- Initial Setup & Interval ---
    function initializeApp() {
        setClock();
        setDates(document.documentElement.lang as 'ar' | 'en');
        updateNextPrayerHighlight();
    }
    
    initializeApp();
    setInterval(initializeApp, 1000); // Update every second for the clock
});
