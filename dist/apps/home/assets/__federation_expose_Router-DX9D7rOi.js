import { importShared } from './__federation_fn_import-nAw5n7ep.js';
import { I as Icon, u as useAuth, B as Button, _ as _export_sfc } from './useAuth-Blxrb_ls.js';

const _imports_0$2 = "/home-graphs.png";

const {defineComponent:_defineComponent$3} = await importShared('vue');

const {unref:_unref$2,createVNode:_createVNode$3,createElementVNode:_createElementVNode$3,toDisplayString:_toDisplayString$2,openBlock:_openBlock$3,createElementBlock:_createElementBlock$3} = await importShared('vue');

const _hoisted_1$3 = { class: "flex flex-col items-center text-center px-6 py-8 rounded" };
const _hoisted_2$3 = { class: "text-green mb-2" };
const _hoisted_3$3 = { class: "text-xl font-bold text-green mb-2" };
const _hoisted_4$2 = { class: "text-base text-gray-medium max-w-xs" };
const _sfc_main$3 = /* @__PURE__ */ _defineComponent$3({
  __name: "FeatureCard",
  props: {
    icon: {},
    title: {},
    description: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return _openBlock$3(), _createElementBlock$3("div", _hoisted_1$3, [
        _createElementVNode$3("div", _hoisted_2$3, [
          _createVNode$3(_unref$2(Icon), {
            icon: _ctx.icon,
            class: "text-8xl"
          }, null, 8, ["icon"])
        ]),
        _createElementVNode$3("h3", _hoisted_3$3, _toDisplayString$2(_ctx.title), 1),
        _createElementVNode$3("p", _hoisted_4$2, _toDisplayString$2(_ctx.description), 1)
      ]);
    };
  }
});

const _imports_0$1 = "/modal-register.png";

const config = {
  // URL do Dashboard Next.js
  dashboardUrl: ("")};
function redirectToDashboard() {
  window.location.href = config.dashboardUrl;
}

const {defineComponent:_defineComponent$2} = await importShared('vue');

const {createElementVNode:_createElementVNode$2,toDisplayString:_toDisplayString$1,openBlock:_openBlock$2,createElementBlock:_createElementBlock$2,createCommentVNode:_createCommentVNode$1,normalizeClass:_normalizeClass$1,createTextVNode:_createTextVNode$2,unref:_unref$1,withCtx:_withCtx$2,createVNode:_createVNode$2} = await importShared('vue');
const _hoisted_1$2 = {
  key: 0,
  class: "absolute top-0 left-0 w-full h-full bg-black/75 flex items-center justify-center z-50 px-8 md:px-12",
  role: "dialog",
  "aria-modal": "true"
};
const _hoisted_2$2 = { class: "w-full" };
const _hoisted_3$2 = ["value"];
const _hoisted_4$1 = {
  key: 0,
  class: "text-red-500 text-sm mt-1"
};
const _hoisted_5$1 = { class: "w-full" };
const _hoisted_6$1 = ["value"];
const _hoisted_7$1 = {
  key: 0,
  class: "text-red-500 text-sm mt-1"
};
const _hoisted_8 = { class: "w-full" };
const _hoisted_9 = ["value"];
const _hoisted_10 = {
  key: 0,
  class: "text-red-500 text-sm mt-1"
};
const _hoisted_11 = {
  for: "consent-checkbox",
  class: "flex items-center gap-2 cursor-pointer select-none"
};
const _hoisted_12 = ["checked"];
const _hoisted_13 = {
  key: 0,
  class: "text-white icon-[material-symbols--close]"
};
const {ref: ref$2,reactive: reactive$1,computed,watch: watch$1} = await importShared('vue');
const _sfc_main$2 = /* @__PURE__ */ _defineComponent$2({
  __name: "ModalForm",
  props: {
    isOpen: { type: Boolean }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { register, loading: authLoading, error: authError } = useAuth();
    const accepted = ref$2(false);
    const visible = ref$2(true);
    const form = reactive$1({
      name: "",
      email: "",
      password: ""
    });
    const errors = reactive$1({
      name: "",
      email: "",
      password: ""
    });
    const formDefaultValue = {
      name: "",
      email: "",
      password: ""
    };
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    const isDisabled = computed(() => {
      return !accepted.value || Object.values(errors).some((error) => error !== "") || authLoading.value;
    });
    watch$1(() => props.isOpen, (newValue) => {
      if (newValue) {
        accepted.value = false;
        Object.assign(errors, formDefaultValue);
        visible.value = true;
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    });
    const handleAccepted = () => {
      accepted.value = !accepted.value;
    };
    const handleInputValue = (field, value) => {
      if (!visible.value) return;
      form[field] = value;
    };
    const validateInputValue = (field, value) => {
      if (!visible.value) return;
      errors[field] = value ? "" : "Preencha este campo corretamente.";
    };
    const validateEmailValue = (value) => {
      if (!visible.value) return;
      errors.email = isValidEmail(value) ? "" : "Preencha este campo corretamente.";
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      const newErrors = {
        name: form.name ? "" : "Preencha este campo corretamente.",
        email: isValidEmail(form.email) ? "" : "Preencha este campo corretamente.",
        password: form.password ? "" : "Preencha este campo corretamente."
      };
      Object.assign(errors, newErrors);
      const hasErrors = Object.values(newErrors).some(Boolean);
      if (hasErrors || !accepted.value) return;
      try {
        await register({
          name: form.name,
          email: form.email,
          password: form.password
        });
        alert("Conta criada com sucesso! Redirecionando para o dashboard...");
        handleClose();
        Object.assign(form, formDefaultValue);
        accepted.value = false;
        console.log("Sessão salva no localStorage:", localStorage.getItem("bank-app-session"));
        setTimeout(() => {
          console.log("Redirecionando para dashboard...");
          redirectToDashboard();
        }, 2e3);
      } catch (error) {
        console.error("Erro ao criar conta:", error);
        if (authError.value) {
          alert(authError.value);
        }
      }
    };
    const handleClose = () => {
      visible.value = false;
      setTimeout(() => {
        emit("close");
      }, 800);
    };
    return (_ctx, _cache) => {
      return _ctx.isOpen ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_1$2, [
        _createElementVNode$2("form", {
          onSubmit: handleSubmit,
          class: _normalizeClass$1([
            "w-full max-w-3xl bg-offwhite h-full px-12 md:px-24 py-12 flex flex-col items-center shadow-lg relative gap-8",
            visible.value ? "animate-fade-up animate-once animate-duration-[750ms]" : "animate-fade animate-once animate-reverse animate-duration-[750ms]"
          ])
        }, [
          _createElementVNode$2("button", {
            type: "button",
            class: "absolute p-1 rounded-full right-2 top-2 bg-gray-dark cursor-pointer",
            onClick: handleClose,
            "aria-label": "Fechar modal"
          }, _cache[6] || (_cache[6] = [
            _createElementVNode$2("i", { class: "text-white text-2xl icon-[material-symbols--close]" }, null, -1)
          ])),
          _cache[11] || (_cache[11] = _createElementVNode$2("img", {
            width: "355",
            height: "261",
            src: _imports_0$1,
            alt: "Pessoa ao lado de um smartphone exibindo uma interface com botão ativado, simbolizando a criação de conta.",
            class: "w-[355px] h-[261px]"
          }, null, -1)),
          _cache[12] || (_cache[12] = _createElementVNode$2("h2", { class: "text-xl font-bold" }, " Preencha os campos abaixo para criar sua conta corrente! ", -1)),
          _createElementVNode$2("div", _hoisted_2$2, [
            _cache[7] || (_cache[7] = _createElementVNode$2("label", {
              for: "name",
              class: "block text-sm font-medium text-gray-700 mb-1"
            }, "Nome", -1)),
            _createElementVNode$2("input", {
              id: "name",
              type: "text",
              value: form.name,
              onInput: _cache[0] || (_cache[0] = ($event) => handleInputValue("name", $event.target.value)),
              onBlur: _cache[1] || (_cache[1] = ($event) => validateInputValue("name", $event.target.value)),
              placeholder: "Digite seu nome completo",
              class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            }, null, 40, _hoisted_3$2),
            visible.value && errors.name ? (_openBlock$2(), _createElementBlock$2("p", _hoisted_4$1, _toDisplayString$1(errors.name), 1)) : _createCommentVNode$1("", true)
          ]),
          _createElementVNode$2("div", _hoisted_5$1, [
            _cache[8] || (_cache[8] = _createElementVNode$2("label", {
              for: "email",
              class: "block text-sm font-medium text-gray-700 mb-1"
            }, "E-mail", -1)),
            _createElementVNode$2("input", {
              id: "email",
              type: "email",
              value: form.email,
              onInput: _cache[2] || (_cache[2] = ($event) => handleInputValue("email", $event.target.value)),
              onBlur: _cache[3] || (_cache[3] = ($event) => validateEmailValue($event.target.value)),
              placeholder: "Digite seu email",
              class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            }, null, 40, _hoisted_6$1),
            visible.value && errors.email ? (_openBlock$2(), _createElementBlock$2("p", _hoisted_7$1, _toDisplayString$1(errors.email), 1)) : _createCommentVNode$1("", true)
          ]),
          _createElementVNode$2("div", _hoisted_8, [
            _cache[9] || (_cache[9] = _createElementVNode$2("label", {
              for: "password",
              class: "block text-sm font-medium text-gray-700 mb-1"
            }, "Senha", -1)),
            _createElementVNode$2("input", {
              id: "password",
              type: "password",
              value: form.password,
              onInput: _cache[4] || (_cache[4] = ($event) => handleInputValue("password", $event.target.value)),
              onBlur: _cache[5] || (_cache[5] = ($event) => validateInputValue("password", $event.target.value)),
              placeholder: "Digite sua senha",
              class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            }, null, 40, _hoisted_9),
            visible.value && errors.password ? (_openBlock$2(), _createElementBlock$2("p", _hoisted_10, _toDisplayString$1(errors.password), 1)) : _createCommentVNode$1("", true)
          ]),
          _createElementVNode$2("label", _hoisted_11, [
            _createElementVNode$2("input", {
              id: "consent-checkbox",
              type: "checkbox",
              checked: accepted.value,
              onChange: handleAccepted,
              class: "hidden"
            }, null, 40, _hoisted_12),
            _createElementVNode$2("div", {
              class: _normalizeClass$1([
                "w-5 h-5 transition-all cursor-pointer border-2 border-green rounded-md flex items-center justify-center",
                accepted.value ? "bg-green" : "bg-white"
              ])
            }, [
              accepted.value ? (_openBlock$2(), _createElementBlock$2("i", _hoisted_13)) : _createCommentVNode$1("", true)
            ], 2),
            _cache[10] || (_cache[10] = _createElementVNode$2("p", { class: "flex-1 text-sm text-black" }, [
              _createTextVNode$2(" Li e estou ciente quanto às condições de tratamento dos meus dados conforme descrito na "),
              _createElementVNode$2("span", { class: "underline" }, "Política de Privacidade do banco"),
              _createTextVNode$2(". ")
            ], -1))
          ]),
          _createVNode$2(Button, {
            variant: "red",
            type: "submit",
            disabled: isDisabled.value
          }, {
            default: _withCtx$2(() => [
              _createTextVNode$2(_toDisplayString$1(_unref$1(authLoading) ? "Criando conta..." : "Criar conta"), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 34)
      ])) : _createCommentVNode$1("", true);
    };
  }
});

const ModalForm = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-74392797"]]);

const _imports_0 = "/modal-login.png";

const {defineComponent:_defineComponent$1} = await importShared('vue');

const {createElementVNode:_createElementVNode$1,toDisplayString:_toDisplayString,openBlock:_openBlock$1,createElementBlock:_createElementBlock$1,createCommentVNode:_createCommentVNode,unref:_unref,createTextVNode:_createTextVNode$1,withCtx:_withCtx$1,createVNode:_createVNode$1,normalizeClass:_normalizeClass} = await importShared('vue');
const _hoisted_1$1 = {
  key: 0,
  class: "absolute top-0 left-0 w-full h-full bg-black/75 flex items-center justify-center z-50 px-8 md:px-12",
  role: "dialog",
  "aria-modal": "true"
};
const _hoisted_2$1 = { class: "w-full" };
const _hoisted_3$1 = ["value"];
const _hoisted_4 = {
  key: 0,
  class: "text-red-500 text-sm mt-1"
};
const _hoisted_5 = { class: "w-full" };
const _hoisted_6 = ["value"];
const _hoisted_7 = {
  key: 0,
  class: "text-red-500 text-sm mt-1"
};
const {ref: ref$1,reactive,watch} = await importShared('vue');
const _sfc_main$1 = /* @__PURE__ */ _defineComponent$1({
  __name: "LoginForm",
  props: {
    isOpen: { type: Boolean }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { login, loading: authLoading, error: authError } = useAuth();
    const visible = ref$1(true);
    const form = reactive({
      email: "",
      password: ""
    });
    const errors = reactive({
      email: "",
      password: ""
    });
    const formDefaultValue = {
      email: "",
      password: ""
    };
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    watch(() => props.isOpen, (newValue) => {
      if (newValue) {
        Object.assign(errors, formDefaultValue);
        visible.value = true;
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    });
    const handleInputValue = (field, value) => {
      form[field] = value;
    };
    const handleClose = () => {
      visible.value = false;
      setTimeout(() => {
        emit("close");
      }, 800);
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      const newErrors = {
        email: isValidEmail(form.email) ? "" : "Preencha este campo corretamente.",
        password: form.password ? "" : "Preencha este campo corretamente."
      };
      Object.assign(errors, newErrors);
      const hasErrors = Object.values(newErrors).some(Boolean);
      if (hasErrors) return;
      try {
        await login(form.email, form.password);
        alert("Login realizado com sucesso! Redirecionando para o dashboard...");
        console.log("Sessão salva no localStorage:", localStorage.getItem("bank-app-session"));
        setTimeout(() => {
          console.log("Redirecionando para dashboard...");
          redirectToDashboard();
        }, 2e3);
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        if (authError.value) {
          alert(authError.value);
        }
      }
    };
    return (_ctx, _cache) => {
      return _ctx.isOpen ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_1$1, [
        _createElementVNode$1("form", {
          onSubmit: handleSubmit,
          class: _normalizeClass([
            "w-full max-w-3xl bg-offwhite h-full px-12 md:px-24 py-12 flex flex-col items-center shadow-lg relative gap-8",
            visible.value ? "animate-fade-up animate-once animate-duration-[750ms]" : "animate-fade animate-once animate-reverse animate-duration-[750ms]"
          ])
        }, [
          _createElementVNode$1("button", {
            type: "button",
            class: "absolute p-1 rounded-full right-2 top-2 bg-gray-dark cursor-pointer",
            onClick: handleClose,
            "aria-label": "Fechar modal"
          }, _cache[2] || (_cache[2] = [
            _createElementVNode$1("i", { class: "text-white text-2xl icon-[material-symbols--close]" }, null, -1)
          ])),
          _cache[5] || (_cache[5] = _createElementVNode$1("img", {
            width: "355",
            height: "261",
            src: _imports_0,
            alt: "Pessoa ao lado de um notebook com símbolo de cadeado, representando acesso seguro à conta.",
            class: "w-[355px] h-[261px]"
          }, null, -1)),
          _cache[6] || (_cache[6] = _createElementVNode$1("h2", { class: "text-xl font-bold" }, "Login", -1)),
          _createElementVNode$1("div", _hoisted_2$1, [
            _cache[3] || (_cache[3] = _createElementVNode$1("label", {
              for: "email",
              class: "block text-sm font-medium text-gray-700 mb-1"
            }, "E-mail", -1)),
            _createElementVNode$1("input", {
              id: "email",
              type: "email",
              value: form.email,
              onInput: _cache[0] || (_cache[0] = ($event) => handleInputValue("email", $event.target.value)),
              placeholder: "Digite seu email",
              class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            }, null, 40, _hoisted_3$1),
            errors.email ? (_openBlock$1(), _createElementBlock$1("p", _hoisted_4, _toDisplayString(errors.email), 1)) : _createCommentVNode("", true)
          ]),
          _createElementVNode$1("div", _hoisted_5, [
            _cache[4] || (_cache[4] = _createElementVNode$1("label", {
              for: "password",
              class: "block text-sm font-medium text-gray-700 mb-1"
            }, "Senha", -1)),
            _createElementVNode$1("input", {
              id: "password",
              type: "password",
              value: form.password,
              onInput: _cache[1] || (_cache[1] = ($event) => handleInputValue("password", $event.target.value)),
              placeholder: "Digite sua senha",
              class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            }, null, 40, _hoisted_6),
            errors.password ? (_openBlock$1(), _createElementBlock$1("p", _hoisted_7, _toDisplayString(errors.password), 1)) : _createCommentVNode("", true)
          ]),
          _cache[7] || (_cache[7] = _createElementVNode$1("a", {
            href: "#",
            class: "underline text-green my-2"
          }, " Esqueci minha senha ", -1)),
          _createVNode$1(Button, {
            variant: "secondary",
            type: "submit",
            disabled: _unref(authLoading)
          }, {
            default: _withCtx$1(() => [
              _createTextVNode$1(_toDisplayString(_unref(authLoading) ? "Entrando..." : "Acessar"), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 34)
      ])) : _createCommentVNode("", true);
    };
  }
});

const {defineComponent:_defineComponent} = await importShared('vue');

const {createElementVNode:_createElementVNode,createTextVNode:_createTextVNode,withCtx:_withCtx,createVNode:_createVNode,openBlock:_openBlock,createElementBlock:_createElementBlock} = await importShared('vue');
const _hoisted_1 = { class: "bg-gradient-to-b from-green-from to-green-to px-4 py-8" };
const _hoisted_2 = { class: "flex md:hidden gap-4 items-center justify-center py-4" };
const _hoisted_3 = { class: "flex flex-wrap max-w-3xl mx-auto text-center justify-center" };
const {ref} = await importShared('vue');
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "HomeView",
  props: {
    showLoginModal: { type: Boolean },
    showRegisterModal: { type: Boolean }
  },
  emits: ["open-login", "open-register", "close-modals"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isFormModalOpen = ref(false);
    const isLoginModalOpen = ref(false);
    const handleFormModalOpen = () => {
      isFormModalOpen.value = true;
    };
    const handleLoginModalOpen = () => {
      isLoginModalOpen.value = true;
    };
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("div", null, [
        _createElementVNode("div", _hoisted_1, [
          _cache[5] || (_cache[5] = _createElementVNode("div", { class: "flex flex-col xl:flex-row items-center justify-center gap-8" }, [
            _createElementVNode("p", { class: "text-center xl:text-left text-black text-2xl font-bold w-full max-w-[446px]" }, [
              _createTextVNode(" Experimente mais liberdade no controle da sua vida financeira."),
              _createElementVNode("br"),
              _createTextVNode(" Crie sua conta com a gente! ")
            ]),
            _createElementVNode("img", {
              src: _imports_0$2,
              width: "661",
              height: "412",
              class: "my-8 w-full max-w-78 md:max-w-[600px] xl:max-w-[661px]",
              alt: "Pessoa segurando dinheiro ao lado de gráficos de barras em crescimento, simbolizando finanças ou controle de investimentos.",
              sizes: "(max-width: 767px) 312px, (max-width: 1279px) 600px, 661px"
            })
          ], -1)),
          _createElementVNode("div", _hoisted_2, [
            _createVNode(Button, {
              variant: "black",
              onClick: handleFormModalOpen
            }, {
              default: _withCtx(() => _cache[2] || (_cache[2] = [
                _createTextVNode(" Abrir Minha Conta ", -1)
              ])),
              _: 1,
              __: [2]
            }),
            _createVNode(Button, {
              variant: "blackGhost",
              onClick: handleLoginModalOpen
            }, {
              default: _withCtx(() => _cache[3] || (_cache[3] = [
                _createTextVNode(" Já tenho Conta ", -1)
              ])),
              _: 1,
              __: [3]
            })
          ]),
          _createElementVNode("div", _hoisted_3, [
            _cache[4] || (_cache[4] = _createElementVNode("h2", { class: "w-full font-bold text-2xl" }, " Vantagens do nosso banco: ", -1)),
            _createVNode(_sfc_main$3, {
              icon: "mynaui:gift",
              title: "Conta e cartão gratuitos",
              description: "Isso mesmo, nossa conta é digital, sem custo fixo e mais que isso: sem tarifa de manutenção."
            }),
            _createVNode(_sfc_main$3, {
              icon: "majesticons:money-hand",
              title: "Saques sem custo",
              description: "Você pode sacar gratuitamente 4x por mês de qualquer Banco 24h."
            }),
            _createVNode(_sfc_main$3, {
              icon: "meteor-icons:star",
              title: "Programa de pontos",
              description: "Você pode acumular pontos com suas compras no crédito sem pagar mensalidade!"
            }),
            _createVNode(_sfc_main$3, {
              icon: "tdesign:device",
              title: "Seguro Dispositivos",
              description: "Seus dispositivos móveis (computador e laptop) protegidos por uma mensalidade simbólica."
            })
          ])
        ]),
        _createVNode(ModalForm, {
          "is-open": props.showRegisterModal,
          onClose: _cache[0] || (_cache[0] = ($event) => emit("close-modals"))
        }, null, 8, ["is-open"]),
        _createVNode(_sfc_main$1, {
          "is-open": props.showLoginModal,
          onClose: _cache[1] || (_cache[1] = ($event) => emit("close-modals"))
        }, null, 8, ["is-open"])
      ]);
    };
  }
});

const HomeView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-110f12d5"]]);

const {createRouter,createWebHistory} = await importShared('vue-router');
const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    }
  ]
});

export { router as default };
