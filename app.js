/* ServiceNow Studio — Toy Store prototype
   Interactivity: tab switching, preview view toggles, required-info pills,
   flow step details. */

(function () {
  'use strict';

  /* ---------- Tabs ---------- */
  const tabs = document.querySelectorAll('.tab');
  const panes = document.querySelectorAll('.pane');

  function activateTab(name) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    panes.forEach(p => p.classList.toggle('active', p.dataset.pane === name));
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      if (e.target.closest('.tab-close')) {
        e.stopPropagation();
        // Simulate close: if active, activate neighbor, then hide this tab
        const wasActive = tab.classList.contains('active');
        const visible = [...tabs].filter(t => !t.hidden);
        tab.hidden = true;
        tab.style.display = 'none';
        if (wasActive) {
          const fallback = visible.find(t => t !== tab);
          if (fallback) activateTab(fallback.dataset.tab);
        }
        return;
      }
      activateTab(tab.dataset.tab);
    });
  });

  /* Allow cards in Toy Store overview to open other tabs */
  document.querySelectorAll('.ov-card[data-open]').forEach(card => {
    card.addEventListener('click', () => activateTab(card.dataset.open));
  });

  /* ---------- Preview view-within toggles ---------- */
  function bindViewToggles(name) {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    radios.forEach(r => {
      r.addEventListener('change', (e) => {
        const pane = r.closest('.pane');
        const stage = pane.querySelector('.preview-stage');
        stage.classList.remove('view-portal', 'view-mobile', 'view-va');
        stage.classList.add(`view-${e.target.value}`);
      });
    });
  }
  bindViewToggles('view-nc');
  bindViewToggles('view-sb');

  /* ---------- Required-info reactivity ---------- */
  function bindRequiredFields(formId, reqListId, submitSelector) {
    const form = document.getElementById(formId);
    if (!form) return;
    const reqList = document.getElementById(reqListId);
    const submit = form.closest('.pane').querySelector(submitSelector);

    const update = () => {
      const fields = reqList.querySelectorAll('[data-req]');
      let allDone = true;
      fields.forEach(li => {
        const name = li.dataset.req;
        const el = form.querySelector(`[data-field="${name}"]`);
        if (!el) return;
        const done = (el.type === 'checkbox') ? el.checked : !!el.value.trim();
        li.classList.toggle('done', done);
        if (!done) allDone = false;
      });
      if (submit) {
        submit.classList.toggle('ready', allDone);
        submit.disabled = !allDone;
      }
    };

    form.querySelectorAll('[data-field]').forEach(input => {
      input.addEventListener('input', update);
      input.addEventListener('change', update);
    });

    /* Submit handler (demo only) */
    if (submit) {
      submit.addEventListener('click', (e) => {
        if (submit.disabled) return;
        e.preventDefault();
        const data = {};
        form.querySelectorAll('[data-field]').forEach(el => {
          data[el.name] = (el.type === 'checkbox') ? el.checked : el.value;
        });
        alert(`(Demo) Pedido recebido!\n\n${JSON.stringify(data, null, 2)}`);
      });
    }
  }
  bindRequiredFields('form-nc', 'nc-req-list', '.submit-btn');
  bindRequiredFields('form-sb', 'sb-req-list', '.submit-btn');

  /* ---------- Flow step details ---------- */
  const stepDetails = {
    'trigger': {
      title: 'Pedido Created — Trigger',
      content: `
        <p><strong>Tipo:</strong> Record Created</p>
        <dl>
          <dt>Tabela</dt><dd><code>u_pedido</code> (Pedido)</dd>
          <dt>Condição</dt><dd>— (dispara em qualquer novo pedido)</dd>
          <dt>Run as</dt><dd>System user</dd>
        </dl>
        <p class="muted" style="margin-top:12px;">Quando um novo registro é criado na tabela <code>u_pedido</code>
        (via o Record Producer <em>Solicitar Brinquedo</em>), este flow é executado.</p>
      `
    },
    '1': {
      title: '1 — If: Se prioridade é crítica',
      content: `
        <p><strong>Tipo:</strong> Flow Logic — If</p>
        <dl>
          <dt>Condição</dt><dd><code>Trigger ▸ Pedido Record ▸ Priority</code> <strong>is</strong> <code>1 - Critical</code></dd>
          <dt>Then</dt><dd>Executa a ação aninhada (Send Email)</dd>
        </dl>
      `
    },
    '2': {
      title: '2 — Send Email',
      content: `
        <p><strong>Ação:</strong> Send Email (aninhada dentro do <em>If</em>)</p>
        <dl>
          <dt>Para</dt><dd>Gerente da fábrica de brinquedos</dd>
          <dt>Assunto</dt><dd>🚨 Pedido CRÍTICO recebido — {Pedido.number}</dd>
          <dt>Corpo</dt><dd>Notifica que um pedido de prioridade crítica foi registrado e precisa de atenção imediata.</dd>
        </dl>
      `
    },
    '3': {
      title: '3 — Update Pedido Record',
      content: `
        <p><strong>Ação:</strong> Update Record</p>
        <dl>
          <dt>Registro</dt><dd><code>Trigger ▸ Pedido Record</code></dd>
          <dt>Campos</dt><dd>State → <strong>In Progress</strong></dd>
        </dl>
        <p class="muted" style="margin-top:8px;">Move o pedido para o estado "em andamento" para que seja atribuído a um atendente.</p>
      `
    },
    '4': {
      title: '4 — Wait For Pedido Condition',
      content: `
        <p><strong>Ação:</strong> Wait For Condition</p>
        <dl>
          <dt>Registro</dt><dd><code>Trigger ▸ Pedido Record</code></dd>
          <dt>Condição</dt><dd><code>Assigned to</code> <strong>is not empty</strong></dd>
        </dl>
        <p class="muted" style="margin-top:8px;">Pausa o flow até que o pedido seja atribuído a alguém da equipe.</p>
      `
    },
    '5': {
      title: '5 — Update Pedido Record',
      content: `
        <p><strong>Ação:</strong> Update Record</p>
        <dl>
          <dt>Registro</dt><dd><code>Trigger ▸ Pedido Record</code></dd>
          <dt>Campos</dt><dd>State → <strong>Assigned</strong></dd>
        </dl>
        <p class="muted" style="margin-top:8px;">Depois da atribuição, atualiza o estado para refletir que já tem responsável.</p>
      `
    }
  };

  const modal = document.getElementById('step-modal');
  const modalTitle = document.getElementById('step-modal-title');
  const modalBody = document.getElementById('step-modal-body');
  const modalClose = document.getElementById('step-modal-close');

  function openStepModal(stepKey) {
    const detail = stepDetails[stepKey];
    if (!detail) return;
    modalTitle.textContent = detail.title;
    modalBody.innerHTML = detail.content;
    modal.hidden = false;
  }
  function closeStepModal() { modal.hidden = true; }

  document.querySelectorAll('.flow-step').forEach(step => {
    const link = step.querySelector('.step-link');
    if (!link) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openStepModal(step.dataset.step);
    });
  });
  modalClose.addEventListener('click', closeStepModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeStepModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeStepModal();
  });

  /* ---------- Data panel collapse/expand ---------- */
  document.querySelectorAll('.dp-group-head').forEach(head => {
    head.addEventListener('click', () => {
      const group = head.parentElement;
      group.classList.toggle('open');
      const caret = head.querySelector('.caret');
      if (caret) caret.classList.toggle('caret-open');
    });
  });
  document.querySelector('.dp-collapse')?.addEventListener('click', () => {
    const anyOpen = document.querySelector('.dp-group.open');
    document.querySelectorAll('.dp-group').forEach(g => {
      g.classList.toggle('open', !anyOpen);
      const c = g.querySelector('.caret');
      if (c) c.classList.toggle('caret-open', !anyOpen);
    });
  });

  /* ---------- Close preview button = go back to overview ---------- */
  document.querySelectorAll('.close-preview').forEach(btn => {
    btn.addEventListener('click', () => activateTab('toy-store'));
  });

})();
