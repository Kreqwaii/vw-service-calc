(() => {
  'use strict';

  const MODELS = [
    { id: 'polo', name: 'Polo / Sedan', segment: 'Класс B', factor: 1.0, partsFactor: 1.0 },
    { id: 'tiguan', name: 'Tiguan', segment: 'Кроссовер', factor: 1.15, partsFactor: 1.18 },
    { id: 'touareg', name: 'Touareg', segment: 'Премиум SUV', factor: 1.4, partsFactor: 1.48 },
    { id: 'passat', name: 'Passat / CC', segment: 'Бизнес D', factor: 1.15, partsFactor: 1.16 },
    { id: 'golf', name: 'Golf / GTI', segment: 'Гольф-класс', factor: 1.05, partsFactor: 1.08 },
    { id: 'jetta', name: 'Jetta', segment: 'Седан C', factor: 1.05, partsFactor: 1.05 },
    { id: 'caravelle', name: 'Caravelle / Transporter', segment: 'Коммерческий T5/T6', factor: 1.3, partsFactor: 1.32 }
  ];

  const ENGINES = [
    {
      id: '1.6-mpi',
      label: '1.6 MPI',
      sub: 'CWVA / CFNA',
      grmType: 'Ремень ГРМ',
      grmBaseWork: 7050,
      grmBaseParts: 11800,
      oilVolume: '4.0 л · VW 502.00',
      factor: 1.0
    },
    {
      id: '1.4-tsi',
      label: '1.4 TSI',
      sub: 'CZDA / CAXA',
      grmType: 'Ремень / цепь ГРМ',
      grmBaseWork: 7050,
      grmBaseParts: 13900,
      oilVolume: '4.0 л · VW 504.00',
      factor: 1.08
    },
    {
      id: '2.0-tsi',
      label: '2.0 TSI',
      sub: 'EA888 Gen2/Gen3',
      grmType: 'Цепь ГРМ',
      grmBaseWork: 10560,
      grmBaseParts: 21400,
      oilVolume: '5.7 л · VW 504.00',
      factor: 1.2
    },
    {
      id: '2.0-tdi',
      label: '2.0 TDI',
      sub: 'Common Rail',
      grmType: 'Ремень ГРМ + помпа',
      grmBaseWork: 7050,
      grmBaseParts: 16200,
      oilVolume: '5.5 л · VW 507.00',
      factor: 1.18
    }
  ];

  const GEARBOXES = [
    { id: 'dsg', label: 'DSG', sub: 'DQ200 / DQ250 / DQ500', work: 3170, parts: 9800 },
    { id: 'akpp', label: 'АКПП', sub: 'Aisin / Tiptronic', work: 3170, parts: 11200 },
    { id: 'mkpp', label: 'МКПП', sub: 'Механика 5/6 ст.', work: 1240, parts: 2800 }
  ];

  const SERVICES = [
    {
      id: 'diag',
      name: 'Комплексная диагностика по 43 параметрам',
      desc: 'Чтение ошибок ЭБУ, проверка ходовой, тормозов и жидкостей (0 ₽ при ремонте)',
      baseNote: 'Акция: 490 ₽',
      fixedTotal: true,
      workBase: 490,
      partsBase: 0,
      hours: 0.8
    },
    {
      id: 'to',
      name: 'Плановое ТО',
      desc: 'Замена масла ДВС (от 1 240 ₽), масляного, воздушного и салонного фильтров',
      baseNote: 'Работы от 1 770 ₽',
      workBase: 2850,
      partsBase: 7600,
      hours: 1.2
    },
    {
      id: 'dsg-oil',
      name: 'Замена масла в DSG / АКПП',
      desc: 'Замена трансмиссионной жидкости и фильтра (частичная от 1 770 ₽, полная от 3 170 ₽)',
      baseNote: 'Работы от 1 770 ₽',
      isTransmission: true,
      workBase: 3170,
      partsBase: 9800,
      hours: 1.5
    },
    {
      id: 'grm',
      name: 'Замена ГРМ',
      desc: 'Комплект ремня (от 7 050 ₽) или цепи ГРМ (от 10 560 ₽) с роликами и натяжителем',
      baseNote: 'Работы от 7 050 ₽',
      isGrm: true,
      workBase: 7050,
      partsBase: 13900,
      hours: 3.5
    },
    {
      id: 'brakes',
      name: 'Тормозная система',
      desc: 'Замена передних/задних колодок (от 1 770 ₽), дисков и тормозной жидкости (от 2 120 ₽)',
      baseNote: 'Работы от 1 770 ₽',
      workBase: 3890,
      partsBase: 8900,
      hours: 1.5
    },
    {
      id: 'suspension',
      name: 'Подвеска и ходовая',
      desc: 'Диагностика ходовой (890 ₽), замена рычагов/сайлентблоков/стоек, сход-развал (3 530 ₽)',
      baseNote: 'Работы от 3 530 ₽',
      workBase: 4420,
      partsBase: 9400,
      hours: 2.0
    }
  ];

  const PARTS_TIERS = [
    {
      id: 'oem',
      title: 'Оригинал VAG',
      badge: 'Гарантия 2 года',
      desc: 'Оригинальные запчасти и масла Volkswagen Group с центрального склада',
      multiplier: 1.0
    },
    {
      id: 'analog',
      title: 'Проверенные аналоги',
      badge: 'Выгода до 35%',
      desc: 'OE-поставщики концерна: Bosch, Mann-Filter, Sachs, Brembo, Lemforder',
      multiplier: 0.68
    }
  ];

  const BRANCHES = [
    {
      id: 'sevastopolsky',
      name: 'Севастопольский',
      address: 'Севастопольский пр., 95Б, к.8',
      phone: '+7 (499) 460-69-84',
      tel: '+74994606984',
      hours: 'Ежедневно, 08:00 - 22:00'
    },
    {
      id: 'kaluzhskaya',
      name: 'Калужская',
      address: 'Научный проезд, д.14А, к.5',
      phone: '+7 (499) 460-63-34',
      tel: '+74994606334',
      hours: 'Ежедневно, 08:00 - 22:00'
    },
    {
      id: 'michurinsky',
      name: 'Мичуринский',
      address: 'ул. Удальцова, 60, к.7',
      phone: '+7 (499) 460-69-76',
      tel: '+74994606976',
      hours: 'Ежедневно, 08:00 - 22:00'
    },
    {
      id: 'dmitrovka',
      name: 'Дмитровка',
      address: 'ул. Лобненская, д.17, к.8',
      phone: '+7 (499) 450-63-77',
      tel: '+74994506377',
      hours: 'Ежедневно, 08:00 - 22:00'
    }
  ];

  const PRICE_MATRIX = [
    { cat: 'ТО и диагностика', name: 'Комплексная диагностика по 43 параметрам', price: '490 ₽ (0 ₽ при ремонте)', serviceId: 'diag' },
    { cat: 'ТО и диагностика', name: 'Плановое ТО (работы)', price: 'от 1 770 ₽', serviceId: 'to' },
    { cat: 'ТО и диагностика', name: 'Замена масла в двигателе (ДВС)', price: 'от 1 240 ₽', serviceId: 'to' },
    { cat: 'ТО и диагностика', name: 'Замена фильтров (масляный / воздушный / салонный)', price: 'от 530 - 890 ₽', serviceId: 'to' },
    { cat: 'ТО и диагностика', name: 'Замена свечей зажигания', price: 'от 1 410 ₽', serviceId: 'to' },
    { cat: 'Трансмиссия и DSG', name: 'Частичная замена масла в АКПП / DSG', price: 'от 1 770 ₽', serviceId: 'dsg-oil' },
    { cat: 'Трансмиссия и DSG', name: 'Полная замена масла в АКПП / DSG', price: 'от 3 170 ₽', serviceId: 'dsg-oil' },
    { cat: 'Трансмиссия и DSG', name: 'Замена фильтра АКПП / DSG', price: 'от 3 000 ₽', serviceId: 'dsg-oil' },
    { cat: 'Трансмиссия и DSG', name: 'Адаптация АКПП / DSG', price: 'от 1 240 ₽', serviceId: 'dsg-oil' },
    { cat: 'Трансмиссия и DSG', name: 'Замена сцепления / ремонт гидроблока', price: 'от 5 280 - 10 560 ₽', serviceId: 'dsg-oil' },
    { cat: 'Двигатель и ГРМ', name: 'Замена ремня ГРМ', price: 'от 7 050 ₽', serviceId: 'grm' },
    { cat: 'Двигатель и ГРМ', name: 'Замена цепи ГРМ', price: 'от 10 560 ₽', serviceId: 'grm' },
    { cat: 'Двигатель и ГРМ', name: 'Замена водяного насоса (помпы)', price: 'от 5 810 ₽', serviceId: 'grm' },
    { cat: 'Двигатель и ГРМ', name: 'Замена натяжителей и роликов ГРМ', price: 'от 3 530 ₽', serviceId: 'grm' },
    { cat: 'Тормоза и подвеска', name: 'Замена передних / задних тормозных колодок', price: 'от 1 770 ₽', serviceId: 'brakes' },
    { cat: 'Тормоза и подвеска', name: 'Замена передних тормозных дисков', price: 'от 1 410 ₽', serviceId: 'brakes' },
    { cat: 'Тормоза и подвеска', name: 'Замена тормозной жидкости', price: 'от 2 120 ₽', serviceId: 'brakes' },
    { cat: 'Тормоза и подвеска', name: 'Диагностика ходовой части', price: 'от 890 ₽', serviceId: 'suspension' },
    { cat: 'Тормоза и подвеска', name: 'Замена передних / задних амортизаторов', price: 'от 4 400 ₽', serviceId: 'suspension' },
    { cat: 'Тормоза и подвеска', name: 'Сход-развал', price: 'от 3 530 ₽', serviceId: 'suspension' }
  ];

  const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  const state = {
    modelId: 'tiguan',
    engineId: '2.0-tsi',
    gearboxId: 'dsg',
    mileage: 60000,
    services: new Set(['diag', 'to', 'dsg-oil']),
    partsTierId: 'oem',
    branchId: 'sevastopolsky',
    activePriceCat: 'Все категории'
  };

  const formatRub = (n) => `${Math.round(n).toLocaleString('ru-RU')} ₽`;
  const formatKm = (n) => `${n.toLocaleString('ru-RU')} км`;

  const el = {
    modelSelector: document.getElementById('model-selector'),
    engineSelector: document.getElementById('engine-selector'),
    gearboxSelector: document.getElementById('gearbox-selector'),
    mileageSlider: document.getElementById('mileage-slider'),
    mileageReadout: document.getElementById('mileage-readout'),
    mileageTicks: document.getElementById('mileage-ticks'),
    reglamentText: document.getElementById('reglament-text'),
    applyReglamentBtn: document.getElementById('apply-reglament-btn'),
    servicesSelector: document.getElementById('services-selector'),
    partsSelector: document.getElementById('parts-selector'),
    selectedModelMeta: document.getElementById('selected-model-meta'),
    selectedPowertrainMeta: document.getElementById('selected-powertrain-meta'),
    engineSpecBar: document.getElementById('engine-spec-bar'),
    servicesCountLabel: document.getElementById('services-count-label'),
    partsTierLabel: document.getElementById('parts-tier-label'),
    estDuration: document.getElementById('est-duration'),
    summaryConfigTags: document.getElementById('summary-config-tags'),
    summaryLines: document.getElementById('summary-lines'),
    totalWork: document.getElementById('total-work'),
    totalParts: document.getElementById('total-parts'),
    diagDiscountRow: document.getElementById('diag-discount-row'),
    totalGrand: document.getElementById('total-grand'),
    branchSelect: document.getElementById('branch-select'),
    bookingDate: document.getElementById('booking-date'),
    bookingTime: document.getElementById('booking-time'),
    bookingCallLink: document.getElementById('booking-call-link'),
    bookingCallText: document.getElementById('booking-call-text'),
    bookingForm: document.getElementById('booking-form'),
    formError: document.getElementById('form-error'),
    bookingConfirmation: document.getElementById('booking-confirmation'),
    confirmOrderId: document.getElementById('confirm-order-id'),
    confirmDetails: document.getElementById('confirm-details'),
    confirmMailto: document.getElementById('confirm-mailto'),
    copyEstimateBtn: document.getElementById('copy-estimate-btn'),
    newBookingBtn: document.getElementById('new-booking-btn'),
    resetCalcBtn: document.getElementById('reset-calc-btn'),
    quickDiagBtn: document.getElementById('quick-diag-btn'),
    priceTabs: document.getElementById('price-tabs'),
    priceTableBody: document.getElementById('price-table-body'),
    branchesGrid: document.getElementById('branches-grid')
  };

  function getReglamentForMileage(km) {
    if (km <= 30000) {
      return {
        text: `Пробег ${formatKm(km)}: регламентное плановое ТО, проверка ходовой части и диагностика по 43 параметрам.`,
        recommended: ['diag', 'to']
      };
    }
    if (km <= 75000) {
      return {
        text: `Пробег ${formatKm(km)}: регламентная замена масла в ${state.gearboxId === 'mkpp' ? 'МКПП' : state.gearboxId.toUpperCase()}, плановое ТО и проверка тормозной системы.`,
        recommended: ['diag', 'to', 'dsg-oil', 'brakes']
      };
    }
    if (km <= 105000) {
      return {
        text: `Пробег ${formatKm(km)}: рекомендуется замена комплекта ГРМ, плановое ТО, диагностика подвески и тормозных дисков.`,
        recommended: ['diag', 'to', 'grm', 'suspension']
      };
    }
    return {
      text: `Пробег ${formatKm(km)}: расширенная ревизия ГРМ, трансмиссии ${state.gearboxId.toUpperCase()}, подвески, тормозов и плановое ТО.`,
      recommended: ['diag', 'to', 'dsg-oil', 'grm', 'suspension']
    };
  }

  function calculateLinePrice(service) {
    const model = MODELS.find((m) => m.id === state.modelId);
    const engine = ENGINES.find((e) => e.id === state.engineId);
    const gearbox = GEARBOXES.find((g) => g.id === state.gearboxId);
    const partsTier = PARTS_TIERS.find((p) => p.id === state.partsTierId);

    if (service.fixedTotal) {
      return {
        work: service.workBase,
        parts: 0,
        total: service.workBase,
        hours: service.hours
      };
    }

    let workBase = service.workBase;
    let partsBase = service.partsBase;

    if (service.isGrm) {
      workBase = engine.grmBaseWork;
      partsBase = engine.grmBaseParts;
    } else if (service.isTransmission) {
      workBase = gearbox.work;
      partsBase = gearbox.parts;
    }

    const work = Math.round((workBase * model.factor * (service.isTransmission ? 1 : engine.factor)) / 10) * 10;
    const parts = Math.round((partsBase * model.partsFactor * (service.isGrm ? 1 : engine.factor) * partsTier.multiplier) / 10) * 10;

    return {
      work,
      parts,
      total: work + parts,
      hours: service.hours
    };
  }

  function computeTotals() {
    const selectedList = SERVICES.filter((s) => state.services.has(s.id));
    let workSum = 0;
    let partsSum = 0;
    let hoursSum = 0;

    const lines = selectedList.map((s) => {
      const calc = calculateLinePrice(s);
      workSum += calc.work;
      partsSum += calc.parts;
      hoursSum += calc.hours;
      return { service: s, ...calc };
    });

    const hasDiag = state.services.has('diag');
    const hasOtherWork = selectedList.some((s) => s.id !== 'diag');
    const diagDiscount = hasDiag && hasOtherWork ? 490 : 0;
    const grandTotal = workSum + partsSum - diagDiscount;

    return { lines, workSum, partsSum, diagDiscount, grandTotal, hoursSum };
  }

  function renderModels() {
    el.modelSelector.innerHTML = MODELS.map((m) => `
      <button type="button" class="option-pill ${m.id === state.modelId ? 'is-active' : ''}" data-model="${m.id}" role="radio" aria-checked="${m.id === state.modelId}">
        <span class="pill-title">${m.name}</span>
        <span class="pill-sub">${m.segment}</span>
      </button>
    `).join('');
  }

  function renderPowertrain() {
    el.engineSelector.innerHTML = ENGINES.map((e) => `
      <button type="button" class="option-pill ${e.id === state.engineId ? 'is-active' : ''}" data-engine="${e.id}" role="radio" aria-checked="${e.id === state.engineId}">
        <span class="pill-title mono">${e.label}</span>
        <span class="pill-sub">${e.sub}</span>
      </button>
    `).join('');

    el.gearboxSelector.innerHTML = GEARBOXES.map((g) => `
      <button type="button" class="option-pill ${g.id === state.gearboxId ? 'is-active' : ''}" data-gearbox="${g.id}" role="radio" aria-checked="${g.id === state.gearboxId}">
        <span class="pill-title">${g.label}</span>
        <span class="pill-sub">${g.sub}</span>
      </button>
    `).join('');

    const model = MODELS.find((m) => m.id === state.modelId);
    const engine = ENGINES.find((e) => e.id === state.engineId);
    const gearbox = GEARBOXES.find((g) => g.id === state.gearboxId);

    el.selectedModelMeta.textContent = `${model.name} · ${model.segment}`;
    el.selectedPowertrainMeta.textContent = `${engine.label} · ${gearbox.label}`;
    el.engineSpecBar.innerHTML = `
      <span>Привод ГРМ: <strong>${engine.grmType}</strong></span>
      <span>Допуск масла ДВС: <strong>${engine.oilVolume}</strong></span>
      <span>Трансмиссия: <strong>${gearbox.label} (${gearbox.sub})</strong></span>
    `;
  }

  function renderMileage() {
    const ticks = [15000, 30000, 60000, 90000, 120000];
    el.mileageSlider.value = String(state.mileage);
    el.mileageReadout.textContent = formatKm(state.mileage);

    el.mileageTicks.innerHTML = ticks.map((t) => `
      <button type="button" class="tick-btn mono ${state.mileage === t ? 'is-active' : ''}" data-tick="${t}">
        ${(t / 1000)} тыс. км
      </button>
    `).join('');

    const reg = getReglamentForMileage(state.mileage);
    el.reglamentText.textContent = reg.text;
  }

  function renderServices() {
    el.servicesCountLabel.textContent = `Выбрано: ${state.services.size}`;
    el.servicesSelector.innerHTML = SERVICES.map((s) => {
      const selected = state.services.has(s.id);
      const calc = calculateLinePrice(s);
      return `
        <button type="button" class="service-card ${selected ? 'is-selected' : ''}" data-service="${s.id}" aria-pressed="${selected}">
          <div class="service-card-top">
            <span class="service-name">${s.name}</span>
            <span class="service-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
          </div>
          <span class="service-desc">${s.desc}</span>
          <div class="service-price-row">
            <span class="service-base-note">${s.baseNote}</span>
            <span class="service-price-val mono">${formatRub(calc.total)}</span>
          </div>
        </button>
      `;
    }).join('');
  }

  function renderPartsTiers() {
    const activeTier = PARTS_TIERS.find((p) => p.id === state.partsTierId);
    el.partsTierLabel.textContent = activeTier.title;
    el.partsSelector.innerHTML = PARTS_TIERS.map((p) => `
      <button type="button" class="part-card ${p.id === state.partsTierId ? 'is-selected' : ''}" data-part-tier="${p.id}" role="radio" aria-checked="${p.id === state.partsTierId}">
        <div class="part-head">
          <span class="part-title">${p.title}</span>
          <span class="part-badge mono">${p.badge}</span>
        </div>
        <span class="part-desc">${p.desc}</span>
      </button>
    `).join('');
  }

  function renderSummary() {
    const model = MODELS.find((m) => m.id === state.modelId);
    const engine = ENGINES.find((e) => e.id === state.engineId);
    const gearbox = GEARBOXES.find((g) => g.id === state.gearboxId);
    const tier = PARTS_TIERS.find((p) => p.id === state.partsTierId);
    const totals = computeTotals();

    el.estDuration.textContent = totals.hoursSum > 0 ? `~ ${totals.hoursSum.toFixed(1)} ч` : '0 ч';
    el.summaryConfigTags.innerHTML = `
      <span class="config-tag">VW ${model.name}</span>
      <span class="config-tag mono">${engine.label}</span>
      <span class="config-tag">${gearbox.label}</span>
      <span class="config-tag mono">${formatKm(state.mileage)}</span>
      <span class="config-tag">${tier.title}</span>
    `;

    if (totals.lines.length === 0) {
      el.summaryLines.innerHTML = '<div class="summary-empty">Выберите хотя бы одну услугу в шаге 04 для расчета сметы.</div>';
    } else {
      el.summaryLines.innerHTML = totals.lines.map(({ service, work, parts, total }) => {
        const isFreeDiag = service.id === 'diag' && totals.diagDiscount > 0;
        const subText = service.fixedTotal
          ? (isFreeDiag ? 'Подарок при выполнении ремонта' : 'Фиксированная акция техцентра')
          : `Работа ${formatRub(work)} + детали ${formatRub(parts)}`;
        return `
          <div class="summary-line">
            <div>
              <span class="summary-line-name">${service.name}</span>
              <span class="summary-line-sub">${subText}</span>
            </div>
            <span class="summary-line-price mono">${isFreeDiag ? '0 ₽' : formatRub(total)}</span>
          </div>
        `;
      }).join('');
    }

    el.totalWork.textContent = formatRub(totals.workSum);
    el.totalParts.textContent = formatRub(totals.partsSum);
    el.diagDiscountRow.hidden = totals.diagDiscount === 0;
    el.totalGrand.textContent = formatRub(totals.grandTotal);
  }

  function renderBranchesAndBooking() {
    el.branchSelect.innerHTML = BRANCHES.map((b) => `
      <option value="${b.id}" ${b.id === state.branchId ? 'selected' : ''}>
        ${b.name} (${b.address})
      </option>
    `).join('');

    const activeBranch = BRANCHES.find((b) => b.id === state.branchId);
    el.bookingCallLink.href = `tel:${activeBranch.tel}`;
    el.bookingCallText.textContent = `Позвонить: ${activeBranch.phone}`;

    el.branchesGrid.innerHTML = BRANCHES.map((b) => `
      <article class="branch-card">
        <div class="branch-name">${b.name}</div>
        <div class="branch-address">${b.address}</div>
        <div class="branch-meta">${b.hours}</div>
        <a href="tel:${b.tel}" class="branch-phone mono">${b.phone}</a>
        <button type="button" class="btn btn-outline btn-sm select-branch-btn" data-branch="${b.id}">
          Выбрать для записи
        </button>
      </article>
    `).join('');
  }

  function renderPriceMatrix() {
    const categories = ['Все категории', ...new Set(PRICE_MATRIX.map((r) => r.cat))];
    el.priceTabs.innerHTML = categories.map((cat) => `
      <button type="button" class="price-tab-btn ${state.activePriceCat === cat ? 'is-active' : ''}" data-price-cat="${cat}" role="tab" aria-selected="${state.activePriceCat === cat}">
        ${cat}
      </button>
    `).join('');

    const filtered = state.activePriceCat === 'Все категории'
      ? PRICE_MATRIX
      : PRICE_MATRIX.filter((r) => r.cat === state.activePriceCat);

    el.priceTableBody.innerHTML = filtered.map((row) => {
      const added = state.services.has(row.serviceId);
      return `
        <tr>
          <td>${row.name}</td>
          <td>${row.cat}</td>
          <td class="col-price mono">${row.price}</td>
          <td class="col-action">
            <button type="button" class="btn-inline add-price-service-btn" data-service="${row.serviceId}">
              ${added ? 'В расчете' : 'Добавить в расчет'}
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function initBookingDefaults() {
    const tomorrow = new Date(Date.now() + 86400000);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    el.bookingDate.min = new Date().toISOString().split('T')[0];
    el.bookingDate.value = `${yyyy}-${mm}-${dd}`;

    el.bookingTime.innerHTML = TIME_SLOTS.map((t) => `
      <option value="${t}" ${t === '10:00' ? 'selected' : ''}>${t}</option>
    `).join('');
  }

  function renderAll() {
    renderModels();
    renderPowertrain();
    renderMileage();
    renderServices();
    renderPartsTiers();
    renderSummary();
    renderPriceMatrix();
  }

  function buildOrderPlainText(orderData) {
    const linesText = orderData.totals.lines
      .map((l) => `- ${l.service.name}: ${l.service.id === 'diag' && orderData.totals.diagDiscount > 0 ? '0 ₽ (подарок при ремонте)' : formatRub(l.total)}`)
      .join('\n');

    return [
      `Заявка № ${orderData.orderId} | Автосервис Volkswagen Москва`,
      `Модель: VW ${orderData.model.name} (${orderData.engine.label}, ${orderData.gearbox.label})`,
      `Пробег: ${formatKm(state.mileage)}`,
      `Запчасти: ${orderData.tier.title}`,
      `Техцентр: ${orderData.branch.name} (${orderData.branch.address})`,
      `Дата и время: ${orderData.date} в ${orderData.time}`,
      `Клиент: ${orderData.name}, тел. ${orderData.phone}`,
      orderData.vin ? `VIN / комментарий: ${orderData.vin}` : '',
      'Выбранные работы:',
      linesText,
      `Итого ориентировочно: ${formatRub(orderData.totals.grandTotal)}`
    ].filter(Boolean).join('\n');
  }

  function bindEvents() {
    el.modelSelector.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-model]');
      if (!btn) return;
      state.modelId = btn.dataset.model;
      renderAll();
    });

    el.engineSelector.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-engine]');
      if (!btn) return;
      state.engineId = btn.dataset.engine;
      renderAll();
    });

    el.gearboxSelector.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-gearbox]');
      if (!btn) return;
      state.gearboxId = btn.dataset.gearbox;
      renderAll();
    });

    el.mileageSlider.addEventListener('input', (e) => {
      state.mileage = Number(e.target.value);
      renderMileage();
      renderSummary();
    });

    el.mileageTicks.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-tick]');
      if (!btn) return;
      state.mileage = Number(btn.dataset.tick);
      renderMileage();
      renderSummary();
    });

    el.applyReglamentBtn.addEventListener('click', () => {
      const reg = getReglamentForMileage(state.mileage);
      state.services = new Set(reg.recommended);
      renderServices();
      renderSummary();
      renderPriceMatrix();
    });

    el.servicesSelector.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-service]');
      if (!btn) return;
      const id = btn.dataset.service;
      if (state.services.has(id)) {
        state.services.delete(id);
      } else {
        state.services.add(id);
      }
      renderServices();
      renderSummary();
      renderPriceMatrix();
    });

    el.partsSelector.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-part-tier]');
      if (!btn) return;
      state.partsTierId = btn.dataset.partTier;
      renderPartsTiers();
      renderServices();
      renderSummary();
    });

    el.branchSelect.addEventListener('change', (e) => {
      state.branchId = e.target.value;
      const b = BRANCHES.find((item) => item.id === state.branchId);
      el.bookingCallLink.href = `tel:${b.tel}`;
      el.bookingCallText.textContent = `Позвонить: ${b.phone}`;
    });

    el.branchesGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.select-branch-btn');
      if (!btn) return;
      state.branchId = btn.dataset.branch;
      renderBranchesAndBooking();
      document.getElementById('booking-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    el.priceTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-price-cat]');
      if (!btn) return;
      state.activePriceCat = btn.dataset.priceCat;
      renderPriceMatrix();
    });

    el.priceTableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('.add-price-service-btn');
      if (!btn) return;
      const serviceId = btn.dataset.service;
      state.services.add(serviceId);
      renderServices();
      renderSummary();
      renderPriceMatrix();
      document.getElementById('calculator').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    el.quickDiagBtn.addEventListener('click', () => {
      state.services = new Set(['diag']);
      renderServices();
      renderSummary();
      renderPriceMatrix();
      document.getElementById('booking-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('client-name').focus();
    });

    el.resetCalcBtn.addEventListener('click', () => {
      state.modelId = 'tiguan';
      state.engineId = '2.0-tsi';
      state.gearboxId = 'dsg';
      state.mileage = 60000;
      state.services = new Set(['diag', 'to', 'dsg-oil']);
      state.partsTierId = 'oem';
      renderAll();
    });

    let lastOrderText = '';

    el.bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      el.formError.hidden = true;

      if (state.services.size === 0) {
        el.formError.textContent = 'Выберите хотя бы одну услугу в калькуляторе перед отправкой заявки.';
        el.formError.hidden = false;
        return;
      }

      const name = document.getElementById('client-name').value.trim();
      const phone = document.getElementById('client-phone').value.trim();
      const vin = document.getElementById('client-vin').value.trim();
      const date = el.bookingDate.value;
      const time = el.bookingTime.value;

      if (!name || phone.replace(/\D/g, '').length < 10) {
        el.formError.textContent = 'Укажите имя и корректный номер телефона для связи с мастером-приемщиком.';
        el.formError.hidden = false;
        return;
      }

      const orderId = `VW-${Math.floor(1000 + Math.random() * 9000)}`;
      const model = MODELS.find((m) => m.id === state.modelId);
      const engine = ENGINES.find((item) => item.id === state.engineId);
      const gearbox = GEARBOXES.find((g) => g.id === state.gearboxId);
      const tier = PARTS_TIERS.find((p) => p.id === state.partsTierId);
      const branch = BRANCHES.find((b) => b.id === state.branchId);
      const totals = computeTotals();

      const orderData = { orderId, model, engine, gearbox, tier, branch, date, time, name, phone, vin, totals };
      lastOrderText = buildOrderPlainText(orderData);

      el.confirmOrderId.textContent = `ЗАЯВКА ${orderId}`;
      el.confirmDetails.innerHTML = `
        <strong>VW ${model.name}</strong> (${engine.label}, ${gearbox.label}, ${formatKm(state.mileage)})<br>
        Техцентр: <strong>${branch.name}</strong> (${branch.address})<br>
        Визит: <strong class="mono">${date} · ${time}</strong><br>
        Смета: <strong class="mono">${formatRub(totals.grandTotal)}</strong> (${tier.title})
      `;

      const subject = encodeURIComponent(`Заявка ${orderId}: ТО / ремонт VW ${model.name} (${branch.name})`);
      const body = encodeURIComponent(lastOrderText);
      el.confirmMailto.href = `mailto:director@remont-volkswagen.ru?subject=${subject}&body=${body}`;

      el.bookingForm.hidden = true;
      el.bookingConfirmation.hidden = false;
    });

    el.copyEstimateBtn.addEventListener('click', () => {
      if (!lastOrderText) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lastOrderText).then(() => {
          el.copyEstimateBtn.textContent = 'Смета скопирована';
          setTimeout(() => {
            el.copyEstimateBtn.textContent = 'Скопировать смету';
          }, 2200);
        });
      }
    });

    el.newBookingBtn.addEventListener('click', () => {
      el.bookingConfirmation.hidden = true;
      el.bookingForm.hidden = false;
    });
  }

  initBookingDefaults();
  renderBranchesAndBooking();
  renderAll();
  bindEvents();
})();
