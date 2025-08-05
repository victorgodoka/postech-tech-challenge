import { importShared } from './__federation_fn_import-nAw5n7ep.js';
import { I as Icon, _ as _export_sfc, u as useAuth, B as Button } from './useAuth-Blxrb_ls.js';

const {defineComponent:_defineComponent$2} = await importShared('vue');

const {createElementVNode:_createElementVNode$2,openBlock:_openBlock$2,createElementBlock:_createElementBlock$2,createCommentVNode:_createCommentVNode,toDisplayString:_toDisplayString$1,renderList:_renderList$1,Fragment:_Fragment$1,renderSlot:_renderSlot,unref:_unref$1,createVNode:_createVNode$1,normalizeClass:_normalizeClass} = await importShared('vue');

const _hoisted_1$2 = { class: "hidden max-w-7xl mx-auto md:flex items-center justify-between w-full" };
const _hoisted_2$1 = { class: "flex items-center gap-4" };
const _hoisted_3$1 = {
  key: 0,
  class: ""
};
const _hoisted_4$1 = ["src"];
const _hoisted_5$1 = {
  key: 1,
  class: "text-lg font-bold"
};
const _hoisted_6 = {
  key: 2,
  class: "flex gap-4 ml-6"
};
const _hoisted_7 = ["href"];
const _hoisted_8 = { class: "flex gap-2" };
const _hoisted_9 = { class: "items-center justify-between w-full flex md:hidden" };
const _hoisted_10 = {
  key: 0,
  class: ""
};
const _hoisted_11 = ["src"];
const {computed} = await importShared('vue');
const _sfc_main$2 = /* @__PURE__ */ _defineComponent$2({
  __name: "TopBar",
  props: {
    title: { default: "" },
    variant: { default: "home" },
    logo: { default: "" },
    links: { default: () => [] }
  },
  emits: ["action-primary", "action-secondary"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const topbarVariants = {
      home: "bg-black text-green-500",
      app: "bg-primary text-white"
    };
    const headerClass = computed(() => {
      return `w-full px-6 py-4 ${topbarVariants[props.variant]}`;
    });
    const handlePrimaryAction = () => {
      emit("action-primary");
    };
    const handleSecondaryAction = () => {
      emit("action-secondary");
    };
    return (_ctx, _cache) => {
      return _openBlock$2(), _createElementBlock$2("header", {
        class: _normalizeClass(headerClass.value)
      }, [
        _createElementVNode$2("div", _hoisted_1$2, [
          _createElementVNode$2("div", _hoisted_2$1, [
            _ctx.logo ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_3$1, [
              _createElementVNode$2("img", {
                src: _ctx.logo,
                width: "146",
                height: "32",
                alt: "Logo",
                class: "h-8"
              }, null, 8, _hoisted_4$1)
            ])) : _createCommentVNode("", true),
            _ctx.title ? (_openBlock$2(), _createElementBlock$2("span", _hoisted_5$1, _toDisplayString$1(_ctx.title), 1)) : _createCommentVNode("", true),
            _ctx.links.length > 0 ? (_openBlock$2(), _createElementBlock$2("nav", _hoisted_6, [
              (_openBlock$2(true), _createElementBlock$2(_Fragment$1, null, _renderList$1(_ctx.links, (link, i) => {
                return _openBlock$2(), _createElementBlock$2("a", {
                  key: i,
                  href: link.href,
                  class: "text-lg hover:underline font-semibold"
                }, _toDisplayString$1(link.label), 9, _hoisted_7);
              }), 128))
            ])) : _createCommentVNode("", true)
          ]),
          _createElementVNode$2("div", _hoisted_8, [
            _renderSlot(_ctx.$slots, "actions", {}, () => [
              _ctx.variant === "home" ? (_openBlock$2(), _createElementBlock$2(_Fragment$1, { key: 0 }, [
                _createElementVNode$2("button", {
                  onClick: handlePrimaryAction,
                  class: "bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                }, " Abrir Minha Conta "),
                _createElementVNode$2("button", {
                  onClick: handleSecondaryAction,
                  class: "text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-gray-300 hover:border-gray-400"
                }, " Já tenho Conta ")
              ], 64)) : _createCommentVNode("", true)
            ], true)
          ])
        ]),
        _createElementVNode$2("div", _hoisted_9, [
          _createVNode$1(_unref$1(Icon), {
            class: "text-3xl",
            icon: "material-symbols:menu"
          }),
          _ctx.logo ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_10, [
            _createElementVNode$2("img", {
              src: _ctx.logo,
              width: "146",
              height: "32",
              alt: "Logo",
              class: "h-8"
            }, null, 8, _hoisted_11)
          ])) : _createCommentVNode("", true)
        ])
      ], 2);
    };
  }
});

const TopBar = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-3246561a"]]);

const _imports_0 = "/logo.png";

const {defineComponent:_defineComponent$1} = await importShared('vue');

const {renderList:_renderList,Fragment:_Fragment,openBlock:_openBlock$1,createElementBlock:_createElementBlock$1,toDisplayString:_toDisplayString,createElementVNode:_createElementVNode$1,createStaticVNode:_createStaticVNode} = await importShared('vue');
const _hoisted_1$1 = { class: "bg-black px-8 py-12 text-base text-white" };
const _hoisted_2 = { class: "flex flex-wrap flex-col md:flex-row gap-8 mx-auto max-w-1/2 md:max-w-2/3 xl:max-w-7xl xl:justify-between" };
const _hoisted_3 = { class: "font-bold mb-2" };
const _hoisted_4 = { class: "space-y-1" };
const _hoisted_5 = ["href"];
const _sfc_main$1 = /* @__PURE__ */ _defineComponent$1({
  __name: "Footer",
  props: {
    columns: { default: () => [
      {
        title: "Produtos",
        links: [
          { label: "Conta corrente", href: "#" },
          { label: "Conta PJ", href: "#" },
          { label: "Cartão de crédito", href: "#" }
        ]
      },
      {
        title: "Conta digital",
        links: [
          { label: "Pix", href: "#" },
          { label: "Pagamentos", href: "#" },
          { label: "Transferências", href: "#" }
        ]
      },
      {
        title: "Institucional",
        links: [
          { label: "Sobre nós", href: "#" },
          { label: "Carreiras", href: "#" },
          { label: "Ajuda", href: "#" }
        ]
      }
    ] }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return _openBlock$1(), _createElementBlock$1("footer", _hoisted_1$1, [
        _createElementVNode$1("div", _hoisted_2, [
          (_openBlock$1(true), _createElementBlock$1(_Fragment, null, _renderList(_ctx.columns, (col) => {
            return _openBlock$1(), _createElementBlock$1("div", {
              key: col.title
            }, [
              _createElementVNode$1("h4", _hoisted_3, _toDisplayString(col.title), 1),
              _createElementVNode$1("ul", _hoisted_4, [
                (_openBlock$1(true), _createElementBlock$1(_Fragment, null, _renderList(col.links, (link, i) => {
                  return _openBlock$1(), _createElementBlock$1("li", { key: i }, [
                    _createElementVNode$1("a", {
                      href: link.href,
                      class: "hover:underline"
                    }, _toDisplayString(link.label), 9, _hoisted_5)
                  ]);
                }), 128))
              ])
            ]);
          }), 128)),
          _cache[0] || (_cache[0] = _createStaticVNode('<div data-v-821e9507><h4 class="font-bold mb-2" data-v-821e9507>Desenvolvido por Alura</h4><div class="flex flex-col gap-4" data-v-821e9507><img width="146" height="32" alt="Logo" src="' + _imports_0 + '" class="w-[146px] h-[32px]" data-v-821e9507><div class="grid grid-cols-3" data-v-821e9507><a href="#" aria-label="Instagram" data-v-821e9507><i class="text-4xl icon-[mdi--instagram]" data-v-821e9507></i></a><a href="#" aria-label="WhatsApp" data-v-821e9507><i class="text-4xl icon-[mdi--whatsapp]" data-v-821e9507></i></a><a href="#" aria-label="YouTube" data-v-821e9507><i class="text-4xl icon-[mdi--youtube]" data-v-821e9507></i></a></div></div></div>', 1))
        ])
      ]);
    };
  }
});

const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-821e9507"]]);

const {defineComponent:_defineComponent} = await importShared('vue');

const {createTextVNode:_createTextVNode,withCtx:_withCtx,createVNode:_createVNode,unref:_unref,createElementVNode:_createElementVNode,openBlock:_openBlock,createElementBlock:_createElementBlock} = await importShared('vue');

const _hoisted_1 = {
  id: "app",
  class: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
};
const {RouterView} = await importShared('vue-router');

const {ref,onMounted} = await importShared('vue');
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "App",
  setup(__props, { expose: __expose }) {
    const showLoginModal = ref(false);
    const showRegisterModal = ref(false);
    const { initializeAuth} = useAuth();
    onMounted(() => {
      initializeAuth();
    });
    const openLoginModal = () => {
      showLoginModal.value = true;
      showRegisterModal.value = false;
    };
    const openRegisterModal = () => {
      showRegisterModal.value = true;
      showLoginModal.value = false;
    };
    const closeModals = () => {
      showLoginModal.value = false;
      showRegisterModal.value = false;
    };
    __expose({
      openLoginModal,
      openRegisterModal,
      closeModals
    });
    const navigationLinks = [
      { label: "Home", href: "#" },
      { label: "Sobre", href: "/oijio" }
    ];
    const handleFormModalOpen = () => {
      openRegisterModal();
    };
    const handleLoginModalOpen = () => {
      openLoginModal();
    };
    const footerColumns = [
      {
        title: "Serviços",
        links: [
          { label: "Conta corrente", href: "#conta" },
          { label: "Conta PJ", href: "#conta-pj" },
          { label: "Cartão de crédito", href: "#cartao" },
          { label: "Empréstimo", href: "#emprestimo" },
          { label: "Investimentos", href: "#investimentos" }
        ]
      },
      {
        title: "Contato",
        links: [
          { label: "Fale conosco", href: "#contato" },
          { label: "Ouvidoria", href: "#ouvidoria" },
          { label: "Central de ajuda", href: "#ajuda" },
          { label: "Trabalhe conosco", href: "#carreiras" }
        ]
      },
      {
        title: "Sobre",
        links: [
          { label: "Nossa história", href: "#historia" },
          { label: "Sustentabilidade", href: "#sustentabilidade" },
          { label: "Imprensa", href: "#imprensa" },
          { label: "Política de privacidade", href: "#privacidade" }
        ]
      }
    ];
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("div", _hoisted_1, [
        _createVNode(TopBar, {
          variant: "home",
          logo: "/logo-green.png",
          links: navigationLinks,
          onActionPrimary: handleFormModalOpen,
          onActionSecondary: handleLoginModalOpen
        }, {
          actions: _withCtx(() => [
            _createVNode(Button, {
              variant: "secondary",
              onClick: handleFormModalOpen
            }, {
              default: _withCtx(() => _cache[0] || (_cache[0] = [
                _createTextVNode(" Abrir Minha Conta ", -1)
              ])),
              _: 1,
              __: [0]
            }),
            _createVNode(Button, {
              variant: "secondaryGhost",
              onClick: handleLoginModalOpen
            }, {
              default: _withCtx(() => _cache[1] || (_cache[1] = [
                _createTextVNode(" Já tenho Conta ", -1)
              ])),
              _: 1,
              __: [1]
            })
          ]),
          _: 1
        }),
        _createElementVNode("main", null, [
          _createVNode(_unref(RouterView), {
            "show-login-modal": showLoginModal.value,
            "show-register-modal": showRegisterModal.value,
            onOpenLogin: openLoginModal,
            onOpenRegister: openRegisterModal,
            onCloseModals: closeModals
          }, null, 8, ["show-login-modal", "show-register-modal"])
        ]),
        _createVNode(Footer, { columns: footerColumns })
      ]);
    };
  }
});

export { _sfc_main as _ };
