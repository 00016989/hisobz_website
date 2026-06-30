"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitContact, type ContactState } from "./actions";

/* ============================================================================
   Hisobz — ommaviy sayt (Uz / Ru / En). iOS uslubi, brend apelsin rangi.
   Bog'lanishga yo'naltirilgan. Narxlar "Bog'laning".
============================================================================ */

type Lang = "uz" | "ru" | "en";
const LANGS: { key: Lang; label: string }[] = [
  { key: "uz", label: "UZ" },
  { key: "ru", label: "RU" },
  { key: "en", label: "EN" },
];

// O'zingiznikiga moslang — bu yagona joy. Bo'sh qoldirsangiz, tugma yashirinadi.
const CONTACT = {
  phone: "+998 90 000 00 00",
  telegram: "hisobz_uz", // t.me/<bu>
  email: "info@hisobz.uz",
};

/* ----------------------------------- i18n ---------------------------------- */
const DICT = {
  uz: {
    nav: { features: "Imkoniyatlar", mobile: "Mobil ilova", compare: "Taqqoslash", pricing: "Tariflar", contact: "Bog'lanish", cta: "Bog'lanish" },
    hero: {
      badge: "O'zbekiston bizneslari uchun",
      title: "Savdo, ombor va kassa —",
      titleAccent: "bitta zamonaviy tizimda",
      subtitle:
        "Hisobz do'koningizni boshqaradi: kassa, ombor, mijozlar, marketing va moliya. Internetsiz ham ishlaydi, mahalliy to'lov va fiskal cheklar bilan.",
      ctaPrimary: "Bog'lanish",
      ctaSecondary: "Imkoniyatlarni ko'rish",
      note: "Demo va narxlar — bir suhbatda. Sizga moslab ko'rsatamiz.",
    },
    stats: [
      { v: "20+", l: "modul" },
      { v: "3", l: "til" },
      { v: "7+", l: "integratsiya" },
      { v: "100%", l: "oflayn kassa" },
    ],
    features: {
      title: "Do'kon uchun kerakli hamma narsa",
      subtitle: "Bir nechta dasturni ulamasdan — bitta tizimda.",
      items: [
        { t: "Tezkor kassa (POS)", d: "Shtrix-kod, chegirma, ball, naqd/karta/Payme/Click va chek — bir necha soniyada." },
        { t: "Ombor va qoldiq", d: "Ko'p ombor, kirim/chiqim, inventarizatsiya, IKPU va QQS bilan to'liq nazorat." },
        { t: "Mijozlar (CRM)", d: "Sodiqlik darajalari, ball va cashback, xaridlar tarixi — mijozni qaytaring." },
        { t: "Marketing va SMS", d: "Segment bo'yicha SMS kampaniyalar va aksiyalar — sotuvni o'stiring." },
        { t: "Moliya nazorati", d: "Daromad, xarajat, pul oqimi va ta'minotchi qarzlari — bir oynada." },
        { t: "Smenalar va xodimlar", d: "Smena ochish/yopish, kassa farqi, xodimlar KPI va maosh." },
        { t: "Tahlil va hisobotlar", d: "Tushum, foyda, ABC tahlil; Excel, CSV va 1C eksport." },
        { t: "Oflayn rejim", d: "Internet uzilsa ham savdo to'xtamaydi — qaytganda avtomatik sinxron." },
      ],
    },
    mobile: {
      badge: "iOS uchun — tez kunda",
      title: "Do'koningiz cho'ntagingizda",
      subtitle:
        "Hisobz mobil ilovasi bilan savdo, qoldiq va hisobotlarni istalgan joydan kuzating. iPhone uchun toza, tez va tanish dizayn.",
      bullets: ["Real vaqt savdo va qoldiq", "Push bildirishnomalar", "Tarozi va shtrix-kod skaneri", "Oflayn ishlash"],
      store: "App Store'da tez kunda",
    },
    integrations: { title: "Mahalliy xizmatlar bilan tayyor", subtitle: "Hujjatsiz ovora bo'lmaysiz — ulanib ishlaydi." },
    compare: {
      title: "Nega Hisobz?",
      subtitle: "Mahalliy bizneslar uchun muhim bo'lgan narsalarda kuchli.",
      cols: { feature: "Imkoniyat", us: "Hisobz", billz: "BILLZ", other: "Boshqa tizimlar" },
      rows: {
        uzbek: "To'liq o'zbek tilida",
        payments: "Payme / Click ichida",
        fiscal: "Fiskal (soliq.uz OFD)",
        offline: "To'liq oflayn kassa",
        platforms: "Desktop + Web + Mobil",
        selfstart: "O'zingiz ishga tushirasiz",
        sms: "SMS marketing (Eskiz)",
        multistore: "Ko'p ombor + transfer",
        pricing: "Mahalliy, shaffof narx",
        ownership: "Ma'lumot eksporti (1C/Excel)",
      },
      cells: { partial: "Qisman", extra: "Qo'shimcha", all: "Hammasi", web: "Faqat web", self: "1 daqiqada", manager: "Menejer orqali", som: "So'mda", deal: "Kelishuv" },
      note: "Taqqoslash umumiy ma'lumot uchun; imkoniyatlar tarifga qarab farq qilishi mumkin.",
    },
    pricing: {
      title: "Sizning biznesingizga mos tarif",
      subtitle: "Eng mosini birga tanlaymiz — narx biznes hajmingizga qarab belgilanadi.",
      perMonth: "/oy",
      priceHidden: "So'rov asosida",
      onRequest: "Narxlar so'rov asosida",
      cta: "Tanlash",
      tiers: [
        { name: "Boshlang'ich", for: "Kichik do'kon", feats: ["1 do'kon", "2 foydalanuvchi", "500 tovar", "Asosiy hisobotlar"] },
        { name: "Asosiy", for: "O'sayotgan biznes", feats: ["Cheksiz do'kon", "7 foydalanuvchi", "5 000 tovar", "AI yordamchi", "SMS marketing"] },
        { name: "Pro", for: "Tarmoq va katta hajm", feats: ["Hammasi cheksiz", "Ustuvor qo'llab-quvvatlash", "To'liq tahlil", "Barcha integratsiyalar"] },
      ],
      popularTag: "Ommabop",
    },
    contact: {
      title: "Keling, gaplashamiz",
      subtitle: "Biznesingizni eshitamiz va Hisobzni aynan sizga moslab ko'rsatamiz. Bir suhbat — to'liq tasavvur.",
      name: "Ismingiz",
      phone: "Telefon raqamingiz",
      business: "Biznesingiz (ixtiyoriy)",
      message: "Xabar (ixtiyoriy)",
      send: "Yuborish",
      sending: "Yuborilmoqda...",
      ok: "Rahmat! Tez orada bog'lanamiz.",
      err: "Iltimos, ism va telefonni to'g'ri kiriting.",
      or: "yoki to'g'ridan-to'g'ri",
      call: "Qo'ng'iroq qilish",
    },
    footer: { tagline: "Savdo, ombor va kassa tizimi", rights: "Barcha huquqlar himoyalangan", madeIn: "O'zbekistonda ishlab chiqilgan", blurb: "O'zbekiston bizneslari uchun zamonaviy savdo, ombor va kassa tizimi.", colProduct: "Mahsulot", colContact: "Bog'lanish" },
    onboard: {
      title: "Biz yordam beramiz — boshidan oxirigacha",
      subtitle: "Yolg'iz qolmaysiz. O'rnatish, ma'lumot ko'chirish va o'qitish — biz bilan.",
      items: [
        { t: "Bepul o'rnatish", d: "Tizimni siz uchun sozlab beramiz — tovar, narx va soliq bilan." },
        { t: "Ma'lumot ko'chirish", d: "Eski tizim yoki Excel'dan tovar va mijozlarni ko'chiramiz." },
        { t: "O'qitish va qo'llab-quvvatlash", d: "Jamoangizni o'rgatamiz va savollaringizga javob beramiz." },
      ],
    },
    hardware: {
      title: "Qurilmalaringiz bilan ishlaydi",
      subtitle: "Maxsus qurilma shart emas — bori bilan ishlaydi.",
      items: [
        { i: "📷", t: "Shtrix-kod skaneri" },
        { i: "🖨️", t: "Chek printeri" },
        { i: "⚖️", t: "Tarozi" },
        { i: "💵", t: "Pul yashigi" },
        { i: "💻", t: "Istalgan kompyuter" },
        { i: "📱", t: "Telefon / planshet" },
      ],
    },
    how: {
      title: "Uch qadamda boshlang",
      subtitle: "Murakkab o'rnatish yo'q — bugun ro'yxatdan o'ting va soting.",
      steps: [
        { t: "Ro'yxatdan o'ting", d: "Bir daqiqada biznesingizni oching — bank kartasi talab qilinmaydi." },
        { t: "Tovarlarni qo'shing", d: "Qo'lda yoki Excel'dan import qiling — shtrix-kod va narxlar bilan." },
        { t: "Sota boshlang", d: "Kassani oching va birinchi chekni chiqaring. Hammasi tayyor." },
      ],
    },
    useCases: {
      title: "Har qanday do'kon uchun",
      subtitle: "Hisobz biznesingiz turiga moslashadi.",
      items: ["Oziq-ovqat", "Kiyim-kechak", "Aksessuarlar", "Optom savdo", "Kafe va tez ovqat", "Maishiy texnika", "Go'zallik va parfyumeriya", "Qurilish mollari"],
    },
    gallery: {
      title: "Ilovani ichidan ko'ring",
      subtitle: "Har bir modul — sodda, tez va tushunarli.",
      shots: ["Boshqaruv paneli", "Ombor va qoldiq", "Tahlil va hisobotlar"],
    },
    trust: {
      title: "Ma'lumotlaringiz xavfsiz",
      subtitle: "Biznes ma'lumotlari — sizniki. Doim nazoratda va himoyada.",
      items: [
        { t: "Avtomatik zaxira", d: "Ma'lumotlar muntazam zaxiralanadi — hech narsa yo'qolmaydi." },
        { t: "Sizning egaligingiz", d: "Istalgan vaqt Excel yoki 1C formatida eksport qiling." },
        { t: "Fiskal muvofiqlik", d: "soliq.uz OFD, IKPU va QQS — qonunga to'liq mos." },
        { t: "Rollar va ruxsatlar", d: "Har bir xodimga kerakli darajada kirish bering." },
      ],
    },
    faq: {
      title: "Ko'p so'raladigan savollar",
      subtitle: "Savolingiz boshqami? Bizga yozing — javob beramiz.",
      items: [
        { q: "Internet bo'lmasa ishlaydimi?", a: "Ha. Kassa oflayn ishlashda davom etadi — internet qaytganda savdolar avtomatik sinxronlanadi." },
        { q: "Boshqa tizimdan ko'chib o'tsam bo'ladimi?", a: "Albatta. Tovarlar va mijozlarni Excel orqali import qilamiz va ko'chirishda yordam beramiz." },
        { q: "Qanday qurilma kerak?", a: "Oddiy kompyuter yoki telefon yetarli. Shtrix-kod skaneri, chek printeri va tarozi qo'llab-quvvatlanadi." },
        { q: "Ma'lumotlarim xavfsizmi?", a: "Ha — muntazam avtomatik zaxira, rollarga asoslangan kirish va istalgan vaqt eksport." },
        { q: "Payme va Click ulanganmi?", a: "Ha, to'g'ridan-to'g'ri kassada. Fiskal chek ham avtomatik chiqadi." },
        { q: "Qo'llab-quvvatlash bormi?", a: "Bor — mahalliy va o'zbek tilida. Sozlashdan kundalik ishgacha yordam beramiz." },
      ],
    },
    finalCta: {
      title: "Biznesingizni bugun raqamlashtiring",
      subtitle: "Bir suhbat — va Hisobz sizning do'koningizga moslab ishga tushadi.",
      button: "Bog'lanish",
    },
    sticky: "Bog'lanish",
  },

  ru: {
    nav: { features: "Возможности", mobile: "Моб. приложение", compare: "Сравнение", pricing: "Тарифы", contact: "Связаться", cta: "Связаться" },
    hero: {
      badge: "Для бизнеса в Узбекистане",
      title: "Продажи, склад и касса —",
      titleAccent: "в одной современной системе",
      subtitle:
        "Hisobz управляет вашим магазином: касса, склад, клиенты, маркетинг и финансы. Работает даже без интернета, с местными платежами и фискальными чеками.",
      ctaPrimary: "Связаться",
      ctaSecondary: "Смотреть возможности",
      note: "Демо и цены — за один разговор. Покажем под ваш бизнес.",
    },
    stats: [
      { v: "20+", l: "модулей" },
      { v: "3", l: "языка" },
      { v: "7+", l: "интеграций" },
      { v: "100%", l: "офлайн касса" },
    ],
    features: {
      title: "Всё, что нужно магазину",
      subtitle: "Без зоопарка программ — в одной системе.",
      items: [
        { t: "Быстрая касса (POS)", d: "Штрих-код, скидки, баллы, наличные/карта/Payme/Click и чек — за секунды." },
        { t: "Склад и остатки", d: "Много складов, приход/расход, инвентаризация, ИКПУ и НДС — полный контроль." },
        { t: "Клиенты (CRM)", d: "Уровни лояльности, баллы и кешбэк, история покупок — возвращайте клиентов." },
        { t: "Маркетинг и SMS", d: "SMS-кампании по сегментам и акции — растите продажи." },
        { t: "Финансы", d: "Доходы, расходы, денежный поток и долги поставщикам — в одном окне." },
        { t: "Смены и сотрудники", d: "Открытие/закрытие смены, расхождение кассы, KPI и зарплата." },
        { t: "Аналитика и отчёты", d: "Выручка, прибыль, ABC-анализ; экспорт в Excel, CSV и 1C." },
        { t: "Офлайн-режим", d: "Нет интернета — продажи не останавливаются, синхрон при возврате связи." },
      ],
    },
    mobile: {
      badge: "Для iOS — скоро",
      title: "Ваш магазин в кармане",
      subtitle:
        "С мобильным приложением Hisobz следите за продажами, остатками и отчётами из любого места. Чистый и быстрый дизайн для iPhone.",
      bullets: ["Продажи и остатки в реальном времени", "Push-уведомления", "Сканер штрих-кодов и весы", "Работа офлайн"],
      store: "Скоро в App Store",
    },
    integrations: { title: "Готов к местным сервисам", subtitle: "Никакой возни — подключается и работает." },
    compare: {
      title: "Почему Hisobz?",
      subtitle: "Силён в том, что важно для местного бизнеса.",
      cols: { feature: "Возможность", us: "Hisobz", billz: "BILLZ", other: "Другие системы" },
      rows: {
        uzbek: "Полностью на узбекском",
        payments: "Payme / Click внутри",
        fiscal: "Фискал (soliq.uz OFD)",
        offline: "Полноценная офлайн-касса",
        platforms: "Desktop + Web + Моб.",
        selfstart: "Запуск своими силами",
        sms: "SMS-маркетинг (Eskiz)",
        multistore: "Много складов + трансфер",
        pricing: "Местная, прозрачная цена",
        ownership: "Экспорт данных (1C/Excel)",
      },
      cells: { partial: "Частично", extra: "Доплата", all: "Все", web: "Только web", self: "За минуту", manager: "Через менеджера", som: "В сумах", deal: "По договору" },
      note: "Сравнение носит ознакомительный характер; возможности зависят от тарифа.",
    },
    pricing: {
      title: "Тариф под ваш бизнес",
      subtitle: "Подберём подходящий вместе — цена зависит от размера вашего бизнеса.",
      perMonth: "/мес",
      priceHidden: "По запросу",
      onRequest: "Цены по запросу",
      cta: "Выбрать",
      tiers: [
        { name: "Старт", for: "Небольшой магазин", feats: ["1 магазин", "2 пользователя", "500 товаров", "Базовые отчёты"] },
        { name: "Базовый", for: "Растущий бизнес", feats: ["Без лимита магазинов", "7 пользователей", "5 000 товаров", "AI-помощник", "SMS-маркетинг"] },
        { name: "Pro", for: "Сеть и большой объём", feats: ["Всё без лимитов", "Приоритетная поддержка", "Полная аналитика", "Все интеграции"] },
      ],
      popularTag: "Популярный",
    },
    contact: {
      title: "Давайте поговорим",
      subtitle: "Послушаем ваш бизнес и покажем Hisobz именно под вас. Один разговор — полная картина.",
      name: "Ваше имя",
      phone: "Номер телефона",
      business: "Ваш бизнес (необязательно)",
      message: "Сообщение (необязательно)",
      send: "Отправить",
      sending: "Отправка...",
      ok: "Спасибо! Скоро свяжемся.",
      err: "Укажите имя и телефон корректно.",
      or: "или напрямую",
      call: "Позвонить",
    },
    footer: { tagline: "Система продаж, склада и кассы", rights: "Все права защищены", madeIn: "Разработано в Узбекистане", blurb: "Современная система продаж, склада и кассы для бизнеса в Узбекистане.", colProduct: "Продукт", colContact: "Контакты" },
    onboard: {
      title: "Мы помогаем — от начала до конца",
      subtitle: "Вы не одни. Настройка, перенос данных и обучение — вместе с нами.",
      items: [
        { t: "Бесплатная настройка", d: "Настроим систему под вас — товары, цены и налоги." },
        { t: "Перенос данных", d: "Перенесём товары и клиентов из старой системы или Excel." },
        { t: "Обучение и поддержка", d: "Обучим команду и ответим на ваши вопросы." },
      ],
    },
    hardware: {
      title: "Работает с вашим оборудованием",
      subtitle: "Спецоборудование не нужно — работает с тем, что есть.",
      items: [
        { i: "📷", t: "Сканер штрих-кодов" },
        { i: "🖨️", t: "Чековый принтер" },
        { i: "⚖️", t: "Весы" },
        { i: "💵", t: "Денежный ящик" },
        { i: "💻", t: "Любой компьютер" },
        { i: "📱", t: "Телефон / планшет" },
      ],
    },
    how: {
      title: "Запуск за три шага",
      subtitle: "Без сложной настройки — зарегистрируйтесь сегодня и продавайте.",
      steps: [
        { t: "Зарегистрируйтесь", d: "Откройте бизнес за минуту — карта не требуется." },
        { t: "Добавьте товары", d: "Вручную или импортом из Excel — со штрих-кодами и ценами." },
        { t: "Начните продавать", d: "Откройте кассу и выбейте первый чек. Всё готово." },
      ],
    },
    useCases: {
      title: "Для любого магазина",
      subtitle: "Hisobz подстраивается под тип вашего бизнеса.",
      items: ["Продукты", "Одежда", "Аксессуары", "Оптовая торговля", "Кафе и фастфуд", "Бытовая техника", "Красота и парфюмерия", "Стройматериалы"],
    },
    gallery: {
      title: "Загляните внутрь приложения",
      subtitle: "Каждый модуль — простой, быстрый и понятный.",
      shots: ["Панель управления", "Склад и остатки", "Аналитика и отчёты"],
    },
    trust: {
      title: "Ваши данные в безопасности",
      subtitle: "Данные бизнеса — ваши. Всегда под контролем и защитой.",
      items: [
        { t: "Автоматический бэкап", d: "Данные регулярно резервируются — ничего не потеряется." },
        { t: "Ваша собственность", d: "Экспорт в Excel или 1C в любой момент." },
        { t: "Фискальное соответствие", d: "soliq.uz OFD, ИКПУ и НДС — полностью по закону." },
        { t: "Роли и доступы", d: "Каждому сотруднику — нужный уровень доступа." },
      ],
    },
    faq: {
      title: "Частые вопросы",
      subtitle: "Другой вопрос? Напишите нам — ответим.",
      items: [
        { q: "Работает ли без интернета?", a: "Да. Касса продолжает работать офлайн — при возврате связи продажи синхронизируются автоматически." },
        { q: "Можно перейти с другой системы?", a: "Конечно. Импортируем товары и клиентов через Excel и поможем с переносом." },
        { q: "Какое оборудование нужно?", a: "Достаточно обычного компьютера или телефона. Поддерживаются сканер штрих-кодов, чековый принтер и весы." },
        { q: "Мои данные в безопасности?", a: "Да — регулярный автобэкап, доступ по ролям и экспорт в любой момент." },
        { q: "Payme и Click подключены?", a: "Да, прямо в кассе. Фискальный чек тоже формируется автоматически." },
        { q: "Есть поддержка?", a: "Есть — локальная, на узбекском и русском. Поможем от настройки до ежедневной работы." },
      ],
    },
    finalCta: {
      title: "Оцифруйте бизнес уже сегодня",
      subtitle: "Один разговор — и Hisobz запустится под ваш магазин.",
      button: "Связаться",
    },
    sticky: "Связаться",
  },

  en: {
    nav: { features: "Features", mobile: "Mobile app", compare: "Compare", pricing: "Plans", contact: "Contact", cta: "Contact us" },
    hero: {
      badge: "Built for businesses in Uzbekistan",
      title: "Sales, inventory and POS —",
      titleAccent: "in one modern system",
      subtitle:
        "Hisobz runs your store: checkout, inventory, customers, marketing and finance. Works even offline, with local payments and fiscal receipts.",
      ctaPrimary: "Contact us",
      ctaSecondary: "See features",
      note: "Demo and pricing in one conversation. We tailor it to your business.",
    },
    stats: [
      { v: "20+", l: "modules" },
      { v: "3", l: "languages" },
      { v: "7+", l: "integrations" },
      { v: "100%", l: "offline POS" },
    ],
    features: {
      title: "Everything your store needs",
      subtitle: "No patchwork of apps — one system.",
      items: [
        { t: "Fast checkout (POS)", d: "Barcode, discounts, points, cash/card/Payme/Click and receipt — in seconds." },
        { t: "Inventory & stock", d: "Multi-warehouse, in/out, stocktake, IKPU and VAT — full control." },
        { t: "Customers (CRM)", d: "Loyalty tiers, points and cashback, purchase history — bring customers back." },
        { t: "Marketing & SMS", d: "Segmented SMS campaigns and promos — grow your sales." },
        { t: "Finance control", d: "Income, expense, cash flow and supplier debts — in one place." },
        { t: "Shifts & staff", d: "Open/close shifts, cash variance, staff KPI and payroll." },
        { t: "Analytics & reports", d: "Revenue, profit, ABC analysis; export to Excel, CSV and 1C." },
        { t: "Offline mode", d: "Internet drops — sales keep going, auto-sync when it's back." },
      ],
    },
    mobile: {
      badge: "For iOS — coming soon",
      title: "Your store in your pocket",
      subtitle:
        "With the Hisobz mobile app, track sales, stock and reports from anywhere. A clean, fast, familiar design for iPhone.",
      bullets: ["Real-time sales & stock", "Push notifications", "Barcode scanner & scale", "Works offline"],
      store: "Coming soon to the App Store",
    },
    integrations: { title: "Ready for local services", subtitle: "No paperwork hassle — it just connects." },
    compare: {
      title: "Why Hisobz?",
      subtitle: "Strong where it matters for local business.",
      cols: { feature: "Feature", us: "Hisobz", billz: "BILLZ", other: "Other systems" },
      rows: {
        uzbek: "Fully in Uzbek",
        payments: "Payme / Click built-in",
        fiscal: "Fiscal (soliq.uz OFD)",
        offline: "Full offline POS",
        platforms: "Desktop + Web + Mobile",
        selfstart: "Launch it yourself",
        sms: "SMS marketing (Eskiz)",
        multistore: "Multi-store + transfer",
        pricing: "Local, transparent pricing",
        ownership: "Data export (1C/Excel)",
      },
      cells: { partial: "Partial", extra: "Add-on", all: "All", web: "Web only", self: "In a minute", manager: "Via sales", som: "In so'm", deal: "On request" },
      note: "Comparison is for general guidance; capabilities vary by plan.",
    },
    pricing: {
      title: "A plan that fits your business",
      subtitle: "We'll pick the right one together — pricing scales to your business size.",
      perMonth: "/mo",
      priceHidden: "On request",
      onRequest: "Pricing on request",
      cta: "Choose",
      tiers: [
        { name: "Starter", for: "Small store", feats: ["1 store", "2 users", "500 products", "Core reports"] },
        { name: "Basic", for: "Growing business", feats: ["Unlimited stores", "7 users", "5,000 products", "AI assistant", "SMS marketing"] },
        { name: "Pro", for: "Chains & high volume", feats: ["Everything unlimited", "Priority support", "Full analytics", "All integrations"] },
      ],
      popularTag: "Popular",
    },
    contact: {
      title: "Let's talk",
      subtitle: "We'll listen to your business and show Hisobz tailored to you. One conversation — the full picture.",
      name: "Your name",
      phone: "Phone number",
      business: "Your business (optional)",
      message: "Message (optional)",
      send: "Send",
      sending: "Sending...",
      ok: "Thank you! We'll reach out soon.",
      err: "Please enter a valid name and phone.",
      or: "or reach us directly",
      call: "Call",
    },
    footer: { tagline: "Sales, inventory and POS system", rights: "All rights reserved", madeIn: "Made in Uzbekistan", blurb: "A modern sales, inventory and POS system for businesses in Uzbekistan.", colProduct: "Product", colContact: "Contact" },
    onboard: {
      title: "We help you — start to finish",
      subtitle: "You're not on your own. Setup, data migration and training — with us.",
      items: [
        { t: "Free setup", d: "We configure the system for you — products, prices and taxes." },
        { t: "Data migration", d: "We move products and customers from your old system or Excel." },
        { t: "Training & support", d: "We train your team and answer your questions." },
      ],
    },
    hardware: {
      title: "Works with your hardware",
      subtitle: "No special equipment needed — works with what you already have.",
      items: [
        { i: "📷", t: "Barcode scanner" },
        { i: "🖨️", t: "Receipt printer" },
        { i: "⚖️", t: "Scale" },
        { i: "💵", t: "Cash drawer" },
        { i: "💻", t: "Any computer" },
        { i: "📱", t: "Phone / tablet" },
      ],
    },
    how: {
      title: "Get started in three steps",
      subtitle: "No complex setup — sign up today and start selling.",
      steps: [
        { t: "Sign up", d: "Open your business in a minute — no card required." },
        { t: "Add products", d: "Manually or import from Excel — with barcodes and prices." },
        { t: "Start selling", d: "Open the register and print your first receipt. All set." },
      ],
    },
    useCases: {
      title: "For any kind of store",
      subtitle: "Hisobz adapts to your type of business.",
      items: ["Grocery", "Clothing", "Accessories", "Wholesale", "Cafe & fast food", "Electronics", "Beauty & perfume", "Building materials"],
    },
    gallery: {
      title: "See inside the app",
      subtitle: "Every module — simple, fast and clear.",
      shots: ["Dashboard", "Inventory & stock", "Analytics & reports"],
    },
    trust: {
      title: "Your data is safe",
      subtitle: "Your business data is yours — always in your control and protected.",
      items: [
        { t: "Automatic backups", d: "Data is backed up regularly — nothing gets lost." },
        { t: "You own it", d: "Export to Excel or 1C anytime." },
        { t: "Fiscal compliance", d: "soliq.uz OFD, IKPU and VAT — fully by the book." },
        { t: "Roles & permissions", d: "Give each employee the right level of access." },
      ],
    },
    faq: {
      title: "Frequently asked questions",
      subtitle: "Different question? Write to us — we'll answer.",
      items: [
        { q: "Does it work without internet?", a: "Yes. The register keeps working offline — when the connection returns, sales sync automatically." },
        { q: "Can I migrate from another system?", a: "Absolutely. We import products and customers via Excel and help you move over." },
        { q: "What hardware do I need?", a: "A regular computer or phone is enough. Barcode scanners, receipt printers and scales are supported." },
        { q: "Is my data safe?", a: "Yes — regular automatic backups, role-based access and export anytime." },
        { q: "Are Payme and Click connected?", a: "Yes, right at checkout. The fiscal receipt is generated automatically too." },
        { q: "Is there support?", a: "Yes — local, in Uzbek and Russian. We help from setup to day-to-day work." },
      ],
    },
    finalCta: {
      title: "Digitize your business today",
      subtitle: "One conversation — and Hisobz launches tailored to your store.",
      button: "Contact us",
    },
    sticky: "Contact us",
  },
} as const;

// Har uch til bir xil shaklга ega — union tip (literal'lar farqli bo'lsa ham mos keladi).
type Dict = (typeof DICT)[Lang];

/* ------------------------------- mini icons -------------------------------- */
const Ic = {
  pos: "M3 6h18M3 6l1.5 12.5A2 2 0 0 0 6.5 20h11a2 2 0 0 0 2-1.5L21 6M9 11v4m6-4v4",
  box: "M21 8l-9-5-9 5m18 0l-9 5m9-5v8l-9 5m0-8L3 8m9 5v8M3 8v8l9 5",
  crm: "M16 14a4 4 0 1 0-8 0M12 7a3 3 0 1 0 0 .01M4 20c0-2 3-3.5 8-3.5s8 1.5 8 3.5",
  sms: "M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12z",
  fin: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  shift: "M12 8v4l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  chart: "M4 20V10m6 10V4m6 16v-7M3 20h18",
  wifi: "M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0M12 20h.01M2 8.8a16 16 0 0 1 20 0",
  check: "M5 13l4 4L19 7",
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z",
  mail: "M3 5h18v14H3zM3 6l9 7 9-7",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3",
  pin: "M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12zM12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
};

// Use-case ikonkalari (emoji o'rniga toza chiziqli ikonka)
const USECASE_ICONS = [
  "M3 4h2l2.2 11.5a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 8H6M9 20h.01M17 20h.01", // grocery — cart
  "M8 3l4 3 4-3 4 3-2.5 3V21H6.5V9L4 6z", // clothing — shirt
  "M3 3h8l9.5 9.5a2 2 0 0 1 0 2.8l-5.2 5.2a2 2 0 0 1-2.8 0L3 11V3zm4 4h.01", // accessories — tag
  "M21 16V8l-9-5-9 5v8l9 5 9-5zM12 3v18M3 8l9 5 9-5", // wholesale — boxes
  "M5 8h12v4a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8zm12 1h2a2 2 0 1 1 0 4h-2M8 3v2M11 3v2M14 3v2", // cafe — cup
  "M13 2L4 14h6l-1 8 9-12h-6l1-8z", // electronics — bolt
  "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z", // beauty — sparkle
  "M21 4l-4 4-3-3 4-4M14.5 6.5L4 17v3h3L17.5 9.5", // building — wrench
];

// Hardware ikonkalari
const HARDWARE_ICONS = [
  "M4 6v12M7 6v12M10 6v12M13 6v12M16 6v12M20 6v12", // barcode scanner
  "M7 9V3h10v6M7 19H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2M7 15h10v6H7z", // receipt printer
  "M7 8h10l1.4 11a2 2 0 0 1-2 2.3H7.6a2 2 0 0 1-2-2.3L7 8zM9 8a3 3 0 1 1 6 0", // scale
  "M2 6h20v12H2zM6 12h.01M18 12h.01M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z", // cash drawer
  "M3 4h18v12H3zM8 20h8M12 16v4", // computer
  "M7 2h10v20H7zM10.5 18h3", // phone
];
function Icon({ d, className = "" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={d} />
    </svg>
  );
}
const FEATURE_ICONS = [Ic.pos, Ic.box, Ic.crm, Ic.sms, Ic.fin, Ic.shift, Ic.chart, Ic.wifi];

/* ------------------------------- components -------------------------------- */
/* Kirish animatsiyasi — SOF CSS (JS'ga bog'liq EMAS). Kontent har doim ko'rinadi;
   animatsiya faqat bezak. JS yiqilsa ham hech narsa yashirin qolmaydi. */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div className={`hz-reveal ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* Raqamni 0 dan maqsadgacha "sanab" chiqaradi (ko'rinishga kirganda). JS bo'lmasa — to'g'ri raqam ko'rinadi. */
function Counter({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : value;
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(target); // SSR/no-JS: darhol haqiqiy son
  useEffect(() => {
    const el = ref.current;
    if (!el || !match) return;
    const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const dur = 1100;
      let startT = 0;
      const tick = (now: number) => {
        if (!startT) startT = now;
        const p = Math.min(1, (now - startT) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      setN(0);
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [match, target]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function Logo({ size = 36 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-[28%] bg-gradient-to-br from-brand-400 to-brand-700 font-bold text-white shadow-sm"
      style={{ width: size, height: size, fontSize: size * 0.56 }}
    >
      H
    </span>
  );
}

/* iOS iPhone ramkasi — ichida ixtiyoriy ekran kontenti */
function PhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative rounded-[2.6rem] border-[6px] border-slate-900 bg-slate-900 shadow-[0_30px_70px_-20px_rgba(16,24,40,0.55)]">
        <div className="relative h-[520px] w-[252px] overflow-hidden rounded-[2.1rem] bg-[#f2f2f7]">
          {/* Dynamic island */}
          <div className="absolute left-1/2 top-2 z-20 h-[22px] w-[78px] -translate-x-1/2 rounded-full bg-slate-900" />
          {children}
        </div>
      </div>
    </div>
  );
}

function TelegramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}

/* macOS uslubidagi brauzer oynasi — ekran rasmlari (screenshot) uchun ramka */
function BrowserFrame({ url, children, className = "" }: { url: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_24px_60px_-18px_rgba(16,24,40,0.35)] ${className}`}>
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <div className="ml-2 flex-1">
          <div className="mx-auto flex max-w-[260px] items-center justify-center gap-1.5 rounded-md bg-white px-3 py-1 text-[11px] text-slate-400 ring-1 ring-slate-200">
            <svg viewBox="0 0 24 24" className="h-3 w-3 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2a7 7 0 0 0-7 7v3H4v8h16v-8h-1V9a7 7 0 0 0-7-7zM7 12V9a5 5 0 0 1 10 0v3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {url}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

/* Mock ekranlar uchun tilga moslangan yorliqlar */
const MOCK = {
  uz: { pos: "Kassa", shiftOpen: "Smena ochiq", search: "Shtrix-kod yoki nom…", total: "Jami", pay: "To'lov", som: "so'm", dash: "Boshqaruv", todayRev: "Bugungi tushum", vsYesterday: "kechagidan", receipts: "Cheklar", avgCheck: "O'rtacha chek", customers: "Mijozlar", lowStock: "Tugayotgan", profit: "Foyda", prod: "Tovar", stock: "Qoldiq", price: "Narx", low: "Kam", inventory: "Ombor", analytics: "Tahlil", byCategory: "Kategoriya bo'yicha", revenue: "Tushum" },
  ru: { pos: "Касса", shiftOpen: "Смена открыта", search: "Штрих-код или название…", total: "Итого", pay: "Оплата", som: "сум", dash: "Панель", todayRev: "Выручка сегодня", vsYesterday: "к вчера", receipts: "Чеки", avgCheck: "Средний чек", customers: "Клиенты", lowStock: "Заканчивается", profit: "Прибыль", prod: "Товар", stock: "Остаток", price: "Цена", low: "Мало", inventory: "Склад", analytics: "Аналитика", byCategory: "По категориям", revenue: "Выручка" },
  en: { pos: "Checkout", shiftOpen: "Shift open", search: "Barcode or name…", total: "Total", pay: "Pay", som: "so'm", dash: "Dashboard", todayRev: "Today's revenue", vsYesterday: "vs yesterday", receipts: "Receipts", avgCheck: "Avg. receipt", customers: "Customers", lowStock: "Low stock", profit: "Profit", prod: "Product", stock: "Stock", price: "Price", low: "Low", inventory: "Inventory", analytics: "Analytics", byCategory: "By category", revenue: "Revenue" },
} as const;

/* Telefon ichidagi POS ekrani mock'i */
function PosScreen({ lang }: { lang: Lang }) {
  const m = MOCK[lang];
  const rows = [
    { n: "Coca-Cola 0.5L", q: "×2", p: "12 000" },
    { n: "Nestle 1.5L", q: "×1", p: "5 500" },
    { n: "Snickers 50g", q: "×3", p: "9 000" },
    { n: "Lavazza 250g", q: "×1", p: "14 000" },
  ];
  return (
    <div className="flex h-full flex-col">
      <div className="bg-gradient-to-b from-brand-500 to-brand-600 px-4 pb-3 pt-9 text-white">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold">{m.pos}</span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium">{m.shiftOpen}</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-[11px]"><Icon d={Ic.search} className="h-3 w-3" /> {m.search}</div>
      </div>
      <div className="flex-1 space-y-1.5 overflow-hidden px-3 py-3">
        {rows.map((r) => (
          <div key={r.n} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm">
            <div className="min-w-0">
              <div className="truncate text-[11px] font-semibold text-slate-800">{r.n}</div>
              <div className="text-[10px] text-slate-400">{r.q}</div>
            </div>
            <div className="text-[11px] font-semibold text-slate-700">{r.p}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200/70 bg-white px-4 py-3">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>{m.total}</span>
          <span className="text-[15px] font-bold text-slate-900">40 500 {m.som}</span>
        </div>
        <div className="mt-2 rounded-xl bg-brand-600 py-2.5 text-center text-[12px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(234,88,12,0.5)]">
          {m.pay}
        </div>
      </div>
    </div>
  );
}

/* Telefon ichidagi Boshqaruv (dashboard) ekrani mock'i */
function DashScreen({ lang }: { lang: Lang }) {
  const m = MOCK[lang];
  const bars = [40, 62, 48, 80, 56, 92, 70];
  return (
    <div className="flex h-full flex-col bg-[#f2f2f7]">
      <div className="px-4 pb-2 pt-10">
        <div className="text-[11px] text-slate-400">{m.dash}</div>
        <div className="text-[17px] font-bold text-slate-900">{m.todayRev}</div>
      </div>
      <div className="px-4">
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <div className="text-[20px] font-bold text-slate-900">4 280 000 <span className="text-[11px] font-medium text-slate-400">{m.som}</span></div>
          <div className="mt-0.5 text-[10px] font-semibold text-emerald-500">▲ 12% {m.vsYesterday}</div>
          <div className="mt-3 flex h-20 items-end gap-1.5">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-brand-500 to-brand-300" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5 px-4 py-3">
        {[
          { l: m.receipts, v: "128" },
          { l: m.avgCheck, v: "33 400" },
          { l: m.customers, v: "+9" },
          { l: m.lowStock, v: "14" },
        ].map((c) => (
          <div key={c.l} className="rounded-xl bg-white p-2.5 shadow-sm">
            <div className="text-[10px] text-slate-400">{c.l}</div>
            <div className="text-[14px] font-bold text-slate-800">{c.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Galereya uchun brauzer ichidagi ekran kontenti (0=dashboard, 1=ombor, 2=tahlil) */
function GalleryScreen({ i, lang }: { i: number; lang: Lang }) {
  const m = MOCK[lang];
  if (i === 1) {
    const rows = [
      { n: "Coca-Cola 0.5L", s: "248", p: "6 000" },
      { n: "Nestle 1.5L", s: "9", p: "5 500", low: true },
      { n: "Snickers 50g", s: "132", p: "3 000" },
      { n: "Lavazza 250g", s: "41", p: "62 000" },
      { n: "Lays 90g", s: "76", p: "11 000" },
    ];
    return (
      <div className="bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900">{m.inventory}</span>
          <span className="rounded-lg bg-brand-100 px-2.5 py-1 text-[11px] font-semibold text-brand-700">+ {m.prod}</span>
        </div>
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 border-b border-slate-100 pb-1.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
          <span>{m.prod}</span><span className="text-right">{m.stock}</span><span className="text-right">{m.price}</span>
        </div>
        {rows.map((r) => (
          <div key={r.n} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-slate-50 py-2 text-[12px]">
            <span className="font-medium text-slate-700">{r.n}</span>
            <span className={`text-right font-semibold ${r.low ? "text-rose-500" : "text-slate-600"}`}>{r.s}{r.low ? ` · ${m.low}` : ""}</span>
            <span className="text-right text-slate-500">{r.p}</span>
          </div>
        ))}
      </div>
    );
  }
  if (i === 2) {
    const bars = [52, 70, 44, 88, 64, 96, 76, 60];
    return (
      <div className="bg-[#f2f2f7] p-4">
        <div className="mb-3 text-sm font-bold text-slate-900">{m.analytics}</div>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <div className="text-[10px] text-slate-400">{m.revenue}</div>
            <div className="text-base font-bold text-slate-900">128M</div>
            <div className="text-[10px] font-semibold text-emerald-500">▲ 18%</div>
          </div>
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <div className="text-[10px] text-slate-400">{m.profit}</div>
            <div className="text-base font-bold text-slate-900">31%</div>
            <div className="text-[10px] font-semibold text-emerald-500">▲ 4%</div>
          </div>
        </div>
        <div className="mt-2.5 rounded-xl bg-white p-3 shadow-sm">
          <div className="mb-2 text-[10px] text-slate-400">{m.byCategory}</div>
          <div className="flex h-16 items-end gap-1.5">
            {bars.map((h, k) => (
              <div key={k} className="flex-1 rounded-t bg-gradient-to-t from-brand-500 to-brand-300" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  // i === 0 — dashboard
  const bars = [44, 66, 52, 84, 60, 96, 74];
  return (
    <div className="bg-[#f2f2f7] p-4">
      <div className="mb-3 text-sm font-bold text-slate-900">{m.dash}</div>
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">{m.todayRev}</div>
            <div className="text-2xl font-bold text-slate-900">4 280 000 <span className="text-xs font-medium text-slate-400">{m.som}</span></div>
          </div>
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-600">▲ 12%</span>
        </div>
        <div className="mt-4 flex h-24 items-end gap-2">
          {bars.map((h, k) => (
            <div key={k} className="flex-1 rounded-t-lg bg-gradient-to-t from-brand-500 to-brand-300" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CompareCell({ token, t }: { token: string; t: Dict["compare"] }) {
  if (token === "yes")
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <Icon d={Ic.check} className="h-3.5 w-3.5" />
      </span>
    );
  if (token === "no") return <span className="text-slate-300">—</span>;
  const txt = (t.cells as Record<string, string>)[token] ?? token;
  return <span className="text-[13px] font-medium text-slate-500">{txt}</span>;
}

const COMPARE_ROWS: { f: keyof (typeof DICT)["uz"]["compare"]["rows"]; h: string; b: string; o: string }[] = [
  { f: "uzbek", h: "yes", b: "yes", o: "partial" },
  { f: "payments", h: "yes", b: "yes", o: "extra" },
  { f: "fiscal", h: "yes", b: "yes", o: "partial" },
  { f: "offline", h: "yes", b: "no", o: "no" },
  { f: "platforms", h: "all", b: "web", o: "web" },
  { f: "selfstart", h: "self", b: "manager", o: "manager" },
  { f: "sms", h: "yes", b: "yes", o: "extra" },
  { f: "multistore", h: "yes", b: "yes", o: "partial" },
  { f: "pricing", h: "som", b: "deal", o: "deal" },
  { f: "ownership", h: "yes", b: "partial", o: "no" },
];

/* --------------------------------- main ------------------------------------ */
export default function Landing() {
  const [lang, setLang] = useState<Lang>("uz");
  const [menuOpen, setMenuOpen] = useState(false);
  const t = DICT[lang];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hisobz_lang") as Lang | null;
      if (saved && (saved === "uz" || saved === "ru" || saved === "en")) setLang(saved);
    } catch {}
  }, []);
  function changeLang(l: Lang) {
    setLang(l);
    try { localStorage.setItem("hisobz_lang", l); } catch {}
  }

  // Yumshoq scroll — faqat shu sahifada (ilovaga ta'sir qilmasin)
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = prev; };
  }, []);

  const navLinks: { href: string; label: string }[] = [
    { href: "#features", label: t.nav.features },
    { href: "#mobile", label: t.nav.mobile },
    { href: "#compare", label: t.nav.compare },
    { href: "#pricing", label: t.nav.pricing },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-700">
      <style>{`
        @keyframes hz-rise { from { opacity: 0; transform: translateY(22px) } to { opacity: 1; transform: none } }
        @keyframes hz-floaty { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-16px) } }
        @keyframes hz-floaty2 { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-22px) } }
        @keyframes hz-marquee { from{ transform: translateX(0) } to{ transform: translateX(-50%) } }
        /* both = animatsiyadan oldin "from", keyin "to" (ko'rinadigan) holatda qoladi */
        .hz-reveal{ animation: hz-rise 0.7s cubic-bezier(0.22,1,0.36,1) both }
        .hz-floaty{ animation: hz-floaty 6s ease-in-out infinite }
        .hz-floaty2{ animation: hz-floaty2 7.5s ease-in-out infinite }
        .hz-marquee{ animation: hz-marquee 26s linear infinite }
        @media (prefers-reduced-motion: reduce){ .hz-reveal,.hz-floaty,.hz-floaty2,.hz-marquee{ animation: none } }
        /* CSS-only galereya tablari */
        .hz-tabinput{ position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
        .hz-tabpanel{ display: none; }
        #hz-g0:checked ~ .hz-tabpanels > .hz-tabpanel[data-i="0"],
        #hz-g1:checked ~ .hz-tabpanels > .hz-tabpanel[data-i="1"],
        #hz-g2:checked ~ .hz-tabpanels > .hz-tabpanel[data-i="2"]{ display: block; }
        #hz-g0:checked ~ .hz-tablabels label[for="hz-g0"],
        #hz-g1:checked ~ .hz-tablabels label[for="hz-g1"],
        #hz-g2:checked ~ .hz-tablabels label[for="hz-g2"]{ background:#fff; color:#0f172a; box-shadow: 0 1px 2px rgba(16,24,40,0.08); }
        .hz-tablabel:focus-visible{ outline: 2px solid #fb923c; outline-offset: 2px; }
      `}</style>
      {/* ============================ NAV ============================ */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5">
            <Logo size={34} />
            <span className="text-[19px] font-bold tracking-tight text-slate-900">Hisobz</span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            {/* iOS segmented til almashtirgich */}
            <div className="segmented hidden sm:inline-flex">
              {LANGS.map((l) => (
                <button
                  key={l.key}
                  onClick={() => changeLang(l.key)}
                  className={`segmented-item ${lang === l.key ? "segmented-item-active" : ""}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <a href="#contact" className="btn-primary px-4 py-2 text-sm">
              {t.nav.cta}
            </a>
            <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-700" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d={menuOpen ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
              </svg>
            </button>
          </div>
        </nav>

        {/* mobil menyu */}
        {menuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                  {l.label}
                </a>
              ))}
              <div className="segmented mt-2 self-start">
                {LANGS.map((l) => (
                  <button key={l.key} onClick={() => changeLang(l.key)} className={`segmented-item ${lang === l.key ? "segmented-item-active" : ""}`}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        {/* ============================ HERO ============================ */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-brand-200/50 blur-3xl" />
            <div className="absolute -right-40 top-20 h-[26rem] w-[26rem] rounded-full bg-brand-100/70 blur-3xl" />
          </div>
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> {t.hero.badge}
              </span>
              <h1 className="mt-5 text-[2.6rem] font-bold leading-[1.05] tracking-[-0.03em] text-slate-900 sm:text-6xl">
                {t.hero.title}{" "}
                <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-brand-700 bg-clip-text text-transparent">{t.hero.titleAccent}</span>
              </h1>
              <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-slate-500 sm:text-lg">{t.hero.subtitle}</p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a href="#contact" className="btn-primary px-6 py-3 text-[15px]">{t.hero.ctaPrimary}</a>
                <a href="#features" className="btn-ghost px-6 py-3 text-[15px]">{t.hero.ctaSecondary}</a>
              </div>
              <p className="mt-4 text-[13px] text-slate-400">{t.hero.note}</p>
            </div>

            {/* Web ilova "screenshot"i (brauzer ramkasida) + telefon */}
            <div className="relative flex justify-center md:justify-end">
              <BrowserFrame url={`hisobz.uz/${MOCK[lang].dash.toLowerCase()}`} className="w-full max-w-md">
                <div className="bg-[#f2f2f7] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{MOCK[lang].dash}</span>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">30 {lang === "ru" ? "дн." : lang === "en" ? "days" : "kun"}</span>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400">{MOCK[lang].todayRev}</div>
                        <div className="text-2xl font-bold text-slate-900">4 280 000 <span className="text-xs font-medium text-slate-400">{MOCK[lang].som}</span></div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-600">▲ 12%</span>
                    </div>
                    <div className="mt-4 flex h-28 items-end gap-2">
                      {[44, 66, 52, 84, 60, 96, 74].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-brand-500 to-brand-300" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[{ l: MOCK[lang].receipts, v: "128" }, { l: MOCK[lang].customers, v: "+9" }, { l: MOCK[lang].profit, v: "31%" }].map((c) => (
                      <div key={c.l} className="rounded-xl bg-white p-2.5 text-center shadow-sm">
                        <div className="text-[11px] text-slate-400">{c.l}</div>
                        <div className="text-sm font-bold text-slate-800">{c.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </BrowserFrame>
              <div className="hz-floaty absolute -bottom-12 -right-2 hidden scale-[0.6] sm:block lg:-right-8">
                <PhoneFrame><PosScreen lang={lang} /></PhoneFrame>
              </div>
            </div>
          </div>

          {/* stats strip */}
          <div className="relative mx-auto max-w-6xl px-4 pb-12 sm:px-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {t.stats.map((s) => (
                <div key={s.l} className="card p-5 text-center">
                  <div className="text-3xl font-bold text-slate-900"><Counter value={s.v} /></div>
                  <div className="mt-1 text-sm text-slate-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ HOW IT WORKS ============================ */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t.how.title}</h2>
              <p className="mt-3 text-[17px] text-slate-500">{t.how.subtitle}</p>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {t.how.steps.map((s, i) => (
                <Reveal key={s.t} delay={i * 90}>
                  <div className="relative h-full rounded-3xl border border-slate-200/70 bg-white p-7">
                    {i < t.how.steps.length - 1 && (
                      <span className="absolute right-6 top-9 hidden text-2xl text-brand-200 md:block">→</span>
                    )}
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-lg font-bold text-white shadow-[0_6px_16px_-4px_rgba(234,88,12,0.5)]">{i + 1}</div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.t}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{s.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ FEATURES ============================ */}
        <section id="features" className="bg-[#f2f2f7] py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t.features.title}</h2>
              <p className="mt-3 text-[17px] text-slate-500">{t.features.subtitle}</p>
            </Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {t.features.items.map((f, i) => (
                <Reveal key={f.t} delay={(i % 4) * 70}>
                  <div className="card group h-full p-6 transition-transform duration-200 hover:-translate-y-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                      <Icon d={FEATURE_ICONS[i]} className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-slate-900">{f.t}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{f.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ GALLERY (screenshots) ============================ */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t.gallery.title}</h2>
              <p className="mt-3 text-[17px] text-slate-500">{t.gallery.subtitle}</p>
            </Reveal>
            {/* SOF CSS tablar — radio + :checked. JS'siz ham bosiladi va almashadi. */}
            <div className="hz-tabs mt-9">
              {t.gallery.shots.map((cap, i) => (
                <input key={`r${i}`} type="radio" name="hz-gallery" id={`hz-g${i}`} defaultChecked={i === 0} className="hz-tabinput" aria-label={cap} />
              ))}
              <div className="hz-tablabels flex justify-center">
                <div className="segmented flex-wrap justify-center">
                  {t.gallery.shots.map((cap, i) => (
                    <label key={`l${i}`} htmlFor={`hz-g${i}`} className="segmented-item hz-tablabel">{cap}</label>
                  ))}
                </div>
              </div>
              <div className="hz-tabpanels mt-8">
                {t.gallery.shots.map((cap, i) => (
                  <div key={`p${i}`} className="hz-tabpanel" data-i={i}>
                    <BrowserFrame url={`hisobz.uz/${["boshqaruv", "ombor", "tahlil"][i]}`} className="mx-auto max-w-3xl">
                      <div className="min-h-[360px]">
                        <GalleryScreen i={i} lang={lang} />
                      </div>
                    </BrowserFrame>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================ MOBILE ============================ */}
        <section id="mobile" className="overflow-hidden py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 md:grid-cols-2">
            <div className="relative flex justify-center gap-4">
              <div className="hz-floaty translate-y-6">
                <PhoneFrame><DashScreen lang={lang} /></PhoneFrame>
              </div>
              <div className="hz-floaty2 hidden -translate-y-4 sm:block">
                <PhoneFrame><PosScreen lang={lang} /></PhoneFrame>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                {t.mobile.badge}
              </span>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t.mobile.title}</h2>
              <p className="mt-4 text-[17px] leading-relaxed text-slate-500">{t.mobile.subtitle}</p>
              <ul className="mt-6 space-y-3">
                {t.mobile.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-[15px] text-slate-700">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                      <Icon d={Ic.check} className="h-3.5 w-3.5" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-white">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor"><path d="M16.5 3c.1 1-.3 2-1 2.8-.7.8-1.7 1.4-2.7 1.3-.1-1 .4-2 1-2.7.7-.8 1.8-1.4 2.7-1.4zM19 17.3c-.5 1.1-.7 1.6-1.3 2.6-.9 1.4-2.1 3.1-3.6 3.1-1.3 0-1.7-.9-3.5-.8-1.8 0-2.2.8-3.5.8-1.5 0-2.7-1.6-3.6-3-2.5-3.9-2.8-8.5-1.2-11 1.1-1.7 2.8-2.7 4.4-2.7 1.7 0 2.7.9 4 .9 1.3 0 2-.9 4-.9 1.4 0 2.9.8 4 2.1-3.5 1.9-2.9 6.9.8 8.6z" /></svg>
                  <div className="text-left leading-tight">
                    <div className="text-[10px] text-slate-300">{lang === "en" ? "Soon on the" : lang === "ru" ? "Скоро в" : "Tez kunda"}</div>
                    <div className="text-[15px] font-semibold">App Store</div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-white">
                  <svg viewBox="0 0 24 24" className="h-7 w-7"><path fill="#34A853" d="M4.2 3.3 13 12l-8.8 8.7c-.4-.2-.7-.6-.7-1.1V4.4c0-.5.3-.9.7-1.1z" /><path fill="#FBBC04" d="M17.3 8.4 14.6 12l2.7 3.6 3.3-2c.8-.5.8-1.7 0-2.2l-3.3-1.9z" /><path fill="#EA4335" d="M4.2 3.3c.3-.2.7-.2 1.1 0L17.3 8.4 14.6 12 4.2 3.3z" /><path fill="#4285F4" d="M4.2 20.7 14.6 12l2.7 3.6L5.3 20.7c-.4.2-.8.2-1.1 0z" /></svg>
                  <div className="text-left leading-tight">
                    <div className="text-[10px] text-slate-300">{lang === "en" ? "Soon on" : lang === "ru" ? "Скоро в" : "Tez kunda"}</div>
                    <div className="text-[15px] font-semibold">Google Play</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ USE CASES ============================ */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t.useCases.title}</h2>
              <p className="mt-3 text-[17px] text-slate-500">{t.useCases.subtitle}</p>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {t.useCases.items.map((u, i) => (
                <Reveal key={u} delay={(i % 4) * 60}>
                  <div className="flex h-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-4 transition-colors hover:border-brand-200 hover:bg-brand-50/40">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                      <Icon d={USECASE_ICONS[i]} className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold text-slate-700">{u}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ INTEGRATIONS ============================ */}
        <section className="bg-[#f2f2f7] py-16">
          <div className="mx-auto mb-9 max-w-6xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{t.integrations.title}</h2>
            <p className="mt-2 text-slate-500">{t.integrations.subtitle}</p>
          </div>
          {/* Apple uslubidagi sekin oqadigan marquee — ikki nusxa (uzluksiz) */}
          <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
            <div className="hz-marquee flex w-max gap-3 pr-3">
              {[0, 1].map((dup) => (
                <div key={dup} className="flex shrink-0 gap-3" aria-hidden={dup === 1}>
                  {["Payme", "Click", "soliq.uz OFD", "Eskiz SMS", "Uzum Market", "Didox", "Telegram"].map((name) => (
                    <span key={name} className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm">
                      {name}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ COMPARE ============================ */}
        <section id="compare" className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t.compare.title}</h2>
              <p className="mt-3 text-[17px] text-slate-500">{t.compare.subtitle}</p>
            </Reveal>
            <div className="card mt-10 overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-sm">
                      <th className="px-5 py-4 text-left font-medium text-slate-400">{t.compare.cols.feature}</th>
                      <th className="px-4 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 font-bold text-brand-600"><Logo size={20} /> {t.compare.cols.us}</span>
                      </th>
                      <th className="px-4 py-4 text-center font-semibold text-slate-500">{t.compare.cols.billz}</th>
                      <th className="px-4 py-4 text-center font-semibold text-slate-500">{t.compare.cols.other}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE_ROWS.map((row, i) => (
                      <tr key={row.f} className={`text-sm ${i % 2 ? "bg-slate-50/40" : ""}`}>
                        <td className="px-5 py-3.5 font-medium text-slate-700">{t.compare.rows[row.f]}</td>
                        <td className="bg-brand-50/40 px-4 py-3.5 text-center">
                          <div className="flex justify-center"><CompareCell token={row.h} t={t.compare} /></div>
                        </td>
                        <td className="px-4 py-3.5 text-center"><div className="flex justify-center"><CompareCell token={row.b} t={t.compare} /></div></td>
                        <td className="px-4 py-3.5 text-center"><div className="flex justify-center"><CompareCell token={row.o} t={t.compare} /></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-slate-400">{t.compare.note}</p>
          </div>
        </section>

        {/* ============================ TRUST / DATA SAFETY ============================ */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t.trust.title}</h2>
              <p className="mt-3 text-[17px] text-slate-500">{t.trust.subtitle}</p>
            </Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {t.trust.items.map((it, i) => (
                <Reveal key={it.t} delay={(i % 4) * 70}>
                  <div className="h-full rounded-3xl bg-gradient-to-b from-slate-50 to-white p-6 ring-1 ring-slate-200/70">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                      <Icon d={Ic.check} className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-slate-900">{it.t}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{it.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ ONBOARDING ============================ */}
        <section className="bg-[#f2f2f7] py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t.onboard.title}</h2>
              <p className="mt-3 text-[17px] text-slate-500">{t.onboard.subtitle}</p>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {t.onboard.items.map((it, i) => (
                <Reveal key={it.t} delay={i * 90}>
                  <div className="h-full rounded-3xl bg-white p-7 shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
                      <Icon d={Ic.check} className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{it.t}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{it.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-8 text-center">
              <a href="#contact" className="btn-primary px-6 py-3 text-[15px]">{t.finalCta.button}</a>
            </div>
          </div>
        </section>

        {/* ============================ HARDWARE ============================ */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <Reveal>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{t.hardware.title}</h2>
              <p className="mt-2 text-slate-500">{t.hardware.subtitle}</p>
            </Reveal>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {t.hardware.items.map((h, i) => (
                <span key={h.t} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm">
                  <Icon d={HARDWARE_ICONS[i]} className="h-4 w-4 text-brand-600" /> {h.t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ FAQ ============================ */}
        <section className="bg-[#f2f2f7] py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t.faq.title}</h2>
              <p className="mt-3 text-[17px] text-slate-500">{t.faq.subtitle}</p>
            </Reveal>
            <div className="mt-10 space-y-3">
              {t.faq.items.map((qa, i) => (
                <Reveal key={qa.q} delay={Math.min(i, 3) * 50}>
                  {/* native <details> — JS'siz ham ochiladi */}
                  <details className="group card overflow-hidden px-5 py-1 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-semibold text-slate-800">
                      {qa.q}
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform group-open:rotate-45">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                      </span>
                    </summary>
                    <p className="pb-4 pr-10 text-sm leading-relaxed text-slate-500">{qa.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ PRICING (subtle) ============================ */}
        <section id="pricing" className="bg-[#f2f2f7] py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t.pricing.title}</h2>
              <p className="mt-3 text-[17px] text-slate-500">{t.pricing.subtitle}</p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> {t.pricing.onRequest}
              </span>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {t.pricing.tiers.map((tier, i) => {
                const featured = i === 1;
                return (
                  <Reveal key={tier.name} delay={i * 90} className={`relative flex ${featured ? "md:-mt-3" : ""}`}>
                  <div className={`card relative flex w-full flex-col p-7 ${featured ? "ring-2 ring-brand-500" : ""}`}>
                    {featured && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                        {t.pricing.popularTag}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">{tier.for}</p>
                    <ul className="mt-6 flex-1 space-y-2.5 border-t border-slate-100 pt-6">
                      {tier.feats.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                          <Icon d={Ic.check} className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a href="#contact" className={`mt-7 ${featured ? "btn-primary" : "btn-tinted"} w-full py-3`}>
                      {t.pricing.cta}
                    </a>
                  </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================ FINAL CTA ============================ */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-500 to-brand-700 px-6 py-14 text-center shadow-[0_24px_60px_-18px_rgba(234,88,12,0.5)] sm:px-12">
                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
                <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">{t.finalCta.title}</h2>
                <p className="relative mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-white/90">{t.finalCta.subtitle}</p>
                <a href="#contact" className="relative mt-8 inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-[15px] font-semibold text-brand-700 shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]">
                  {t.finalCta.button}
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============================ CONTACT ============================ */}
        <ContactSection t={t.contact} lang={lang} />
      </main>

      {/* ============================ FOOTER ============================ */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5">
                <Logo size={32} />
                <span className="text-lg font-bold text-slate-900">Hisobz</span>
              </div>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">{t.footer.blurb}</p>
              <div className="mt-4 flex gap-2.5">
                {CONTACT.telegram && (
                  <a href={`https://t.me/${CONTACT.telegram}`} target="_blank" rel="noreferrer" aria-label="Telegram" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-brand-100 hover:text-brand-600">
                    <TelegramIcon className="h-4 w-4" />
                  </a>
                )}
                {CONTACT.email && (
                  <a href={`mailto:${CONTACT.email}`} aria-label="Email" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-brand-100 hover:text-brand-600"><Icon d={Ic.mail} className="h-4 w-4" /></a>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.footer.colProduct}</div>
              <ul className="mt-3 space-y-2 text-sm">
                {navLinks.map((l) => (
                  <li key={l.href}><a href={l.href} className="text-slate-600 transition-colors hover:text-brand-600">{l.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.footer.colContact}</div>
              <ul className="mt-3 space-y-2 text-sm">
                {CONTACT.phone && <li><a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="text-slate-600 transition-colors hover:text-brand-600">{CONTACT.phone}</a></li>}
                {CONTACT.telegram && <li><a href={`https://t.me/${CONTACT.telegram}`} target="_blank" rel="noreferrer" className="text-slate-600 transition-colors hover:text-brand-600">@{CONTACT.telegram}</a></li>}
                {CONTACT.email && <li><a href={`mailto:${CONTACT.email}`} className="text-slate-600 transition-colors hover:text-brand-600">{CONTACT.email}</a></li>}
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row">
            <div>© 2026 Hisobz · {t.footer.rights}</div>
            <div className="flex items-center gap-1.5"><Icon d={Ic.pin} className="h-3.5 w-3.5" /> {t.footer.madeIn}</div>
          </div>
        </div>
      </footer>

      {/* Suzuvchi Telegram tugmasi — har doim qo'l ostida */}
      {CONTACT.telegram && (
        <a
          href={`https://t.me/${CONTACT.telegram}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Telegram"
          className="fixed bottom-24 right-5 z-40 flex items-center justify-center rounded-full bg-[#229ED9] text-white shadow-[0_10px_24px_-6px_rgba(34,158,217,0.6)] transition-transform hover:scale-105 active:scale-95 md:bottom-6"
          style={{ height: 52, width: 52 }}
        >
          <TelegramIcon className="h-6 w-6" />
        </a>
      )}

      {/* Mobil uchun doimiy "Bog'lanish" tugmasi (pastda yopishib turadi) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 p-3 backdrop-blur-xl md:hidden">
        <a href="#contact" className="btn-primary w-full py-3 text-[15px]">{t.sticky}</a>
      </div>
      <div className="h-20 md:hidden" />
    </div>
  );
}

/* ----------------------------- contact section ----------------------------- */
function ContactSection({ t, lang }: { t: Dict["contact"]; lang: Lang }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, null);
  const success = state?.ok && state.message === "ok";

  return (
    <section id="contact" className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-brand-100/60 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-5xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t.title}</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-slate-500">{t.subtitle}</p>

          <div className="mt-8 space-y-3 text-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t.or}</div>
            {CONTACT.phone && (
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 font-medium text-slate-700 hover:text-brand-600">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-600"><Icon d={Ic.phone} className="h-4 w-4" /></span>
                {CONTACT.phone}
              </a>
            )}
            {CONTACT.telegram && (
              <a href={`https://t.me/${CONTACT.telegram}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 font-medium text-slate-700 hover:text-brand-600">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-600"><TelegramIcon className="h-4 w-4" /></span>
                @{CONTACT.telegram}
              </a>
            )}
            {CONTACT.email && (
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 font-medium text-slate-700 hover:text-brand-600">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-600"><Icon d={Ic.mail} className="h-4 w-4" /></span>
                {CONTACT.email}
              </a>
            )}
          </div>
        </div>

        <div className="card p-7">
          {success ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Icon d={Ic.check} className="h-7 w-7" />
              </span>
              <p className="text-lg font-semibold text-slate-900">{t.ok}</p>
            </div>
          ) : (
            <form action={action} className="space-y-4">
              <input type="hidden" name="lang" value={lang} />
              {/* honeypot */}
              <input type="text" name="company_url" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <div>
                <label className="label">{t.name}</label>
                <input name="name" required minLength={2} className="input" placeholder={t.name} />
              </div>
              <div>
                <label className="label">{t.phone}</label>
                <input name="phone" required type="tel" className="input" placeholder="+998 ___ __ __" />
              </div>
              <div>
                <label className="label">{t.business}</label>
                <input name="business" className="input" placeholder={t.business} />
              </div>
              <div>
                <label className="label">{t.message}</label>
                <textarea name="message" rows={3} className="input resize-none" placeholder={t.message} />
              </div>
              {state && !state.ok && <p className="text-sm font-medium text-rose-500">{t.err}</p>}
              <button type="submit" disabled={pending} className="btn-primary w-full py-3 text-[15px]">
                {pending ? t.sending : t.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
