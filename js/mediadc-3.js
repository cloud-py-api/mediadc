(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/views/Configuration.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Configuration.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mixins_Configure__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../mixins/Configure */ "./src/mixins/Configure.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'Configuration',
  mixins: [_mixins_Configure__WEBPACK_IMPORTED_MODULE_1__["default"]],
  props: {
    rootTitle: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  data: function data() {
    return {
      isAdmin: Object(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_0__["getCurrentUser"])() === null ? false : Object(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_0__["getCurrentUser"])().isAdmin
    };
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/views/Configuration.vue?vue&type=style&index=0&id=f6095ba8&scoped=true&lang=css&":
/*!***********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Configuration.vue?vue&type=style&index=0&id=f6095ba8&scoped=true&lang=css& ***!
  \***********************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.mediadc-configuration[data-v-f6095ba8] {\n\tpadding: 20px;\n\ttext-align: center;\n}\na[data-v-f6095ba8] {\n\ttext-decoration: underline;\n}\n.installed[data-v-f6095ba8] {\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n}\n.installed input[data-v-f6095ba8] {\n\tmargin: 0 10px;\n}\n.dependencies-table[data-v-f6095ba8] {\n\twidth: 100%;\n\toverflow-x: scroll;\n\tmargin: 20px auto;\n}\n.dependencies-table table[data-v-f6095ba8] {\n\tmargin: 0 auto;\n\tposition: relative;\n}\n.dependencies-table table caption[data-v-f6095ba8] {\n\tpadding: 5px 10px;\n\tborder-bottom: 1px solid #dadada;\n}\n.dependencies-table table th[data-v-f6095ba8], .dependencies-table table td[data-v-f6095ba8] {\n\tpadding: 5px 10px;\n\tborder-bottom: 1px solid #dadada;\n\tborder-right: 1px solid #dadada;\n}\n.dependencies-table table th[data-v-f6095ba8]:last-child, .dependencies-table table td[data-v-f6095ba8]:last-child {\n\tborder-right: none;\n}\n.package[data-v-f6095ba8] {\n\tposition: relative;\n}\n.package-tooltip[data-v-f6095ba8] {\n\tdisplay: none;\n\tpadding: 0 3px;\n\tborder-radius: 5px;\n\tbackground-color: #000;\n\tcolor: #fff;\n\tposition: absolute;\n\ttop: calc(-100% - 5px);\n\tleft: 50%;\n\ttransform: translateX(-50%);\n\tfont-size: 12px;\n\tbox-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);\n}\n.package-tooltip[data-v-f6095ba8]:before {\n\tcontent: '';\n\tposition: absolute;\n\tleft: 50%;\n\ttransform: translateX(-50%) rotateZ(45deg);\n\tbottom: -3px;\n\twidth: 10px;\n\theight: 10px;\n\tbackground-color: #000;\n\tz-index: -1;\n}\n.package:hover .package-tooltip[data-v-f6095ba8] {\n\tdisplay: block;\n}\n.action-blackout[data-v-f6095ba8] {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\tright: 0;\n\tbottom: 0;\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\tbackground-color: rgba(0, 0, 0, 0.3);\n\tz-index: 10;\n\tborder-radius: 10px;\n}\n.install-errors[data-v-f6095ba8] {\n\tmax-height: 50vh;\n\toverflow-y: scroll;\n\tborder: 1px solid #ff3333;\n\tborder-radius: 5px;\n\tpadding: 0 10px 10px;\n\tmargin: 10px auto;\n}\n.errors-list-item[data-v-f6095ba8] {\n\tborder-bottom: 1px solid #ffcccc;\n\tpadding: 5px;\n\ttext-align-last: left;\n}\n.install-warnings[data-v-f6095ba8] {\n\tmax-height: 50vh;\n\toverflow-y: scroll;\n\tborder: 1px solid #ffc629;\n\tborder-radius: 5px;\n\tpadding: 0 10px 10px;\n\tmargin: 10px auto;\n}\n.warnings-list-item[data-v-f6095ba8] {\n\tborder-bottom: 1px solid #f7ffcc;\n\tpadding: 5px;\n\ttext-align-last: left;\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/views/Configuration.vue?vue&type=style&index=0&id=f6095ba8&scoped=true&lang=css&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Configuration.vue?vue&type=style&index=0&id=f6095ba8&scoped=true&lang=css& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Configuration_vue_vue_type_style_index_0_id_f6095ba8_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/vue-loader/lib??vue-loader-options!./Configuration.vue?vue&type=style&index=0&id=f6095ba8&scoped=true&lang=css& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/views/Configuration.vue?vue&type=style&index=0&id=f6095ba8&scoped=true&lang=css&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Configuration_vue_vue_type_style_index_0_id_f6095ba8_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Configuration_vue_vue_type_style_index_0_id_f6095ba8_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/views/Configuration.vue?vue&type=template&id=f6095ba8&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Configuration.vue?vue&type=template&id=f6095ba8&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return !_vm.loading
    ? _c("div", { staticClass: "mediadc-configuration" }, [
        _c("h2", [_vm._v(_vm._s(_vm.rootTitle))]),
        _vm._v(" "),
        _vm.isAdmin
          ? _c("div", { staticClass: "configuration" }, [
              _c("p", [
                _vm._v(
                  "\n\t\t\t" +
                    _vm._s(
                      _vm.t(
                        "mediadc",
                        "Welcome to MediaDC. You almost there! The last setup step - installation of Python dependencies."
                      )
                    ) +
                    "\n\t\t\t"
                ),
                _c("br"),
                _vm._v(
                  "\n\t\t\t" +
                    _vm._s(
                      _vm.t(
                        "mediadc",
                        "Here you can run automatic installation of Python MediaDC dependencies."
                      )
                    ) +
                    "\n\t\t\t"
                ),
                _c("br"),
                _vm._v(
                  "\n\t\t\t" +
                    _vm._s(
                      _vm.t(
                        "mediadc",
                        "This may take a few minutes (regarding on your system config)."
                      )
                    ) +
                    "\n\t\t\t"
                ),
                _c("br"),
                _vm._v(
                  "\n\t\t\t" +
                    _vm._s(
                      _vm.t(
                        "mediadc",
                        "After checking or installing you can see the results below in a detailed table (installed packages, errors, requirements overview)."
                      )
                    ) +
                    "\n\t\t\t"
                ),
                _c("br"),
                _vm._v(
                  "\n\t\t\t" +
                    _vm._s(
                      _vm.t(
                        "mediadc",
                        "You can install all dependencies with hands, please refer documentation for your OS how to do this:"
                      )
                    ) +
                    "\n\t\t\t"
                ),
                _c(
                  "a",
                  {
                    attrs: {
                      href: "https://github.com/andrey18106/mediadc/wiki"
                    }
                  },
                  [_vm._v(_vm._s(_vm.t("mediadc", "wikis")))]
                ),
                _vm._v(".\n\t\t\t"),
                _c("br"),
                _vm._v(
                  "\n\t\t\t" +
                    _vm._s(
                      _vm.t(
                        "mediadc",
                        "If you have any additional questions contact us in"
                      )
                    ) +
                    " "
                ),
                _c("a", { attrs: { href: "https://t.me/mediadc_support" } }, [
                  _vm._v(_vm._s(_vm.t("mediadc", "Telegram chat")))
                ]),
                _vm._v(".\n\t\t")
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "installed" }, [
                _c("input", {
                  attrs: {
                    id: "installed",
                    type: "checkbox",
                    name: "installed",
                    "v-model": _vm.installed,
                    disabled: ""
                  },
                  domProps: { checked: _vm.installed }
                }),
                _vm._v(" "),
                _c("label", { attrs: { for: "installed" } }, [
                  _vm._v(
                    "\n\t\t\t\t" +
                      _vm._s(_vm.t("mediadc", "Installed:")) +
                      " " +
                      _vm._s(_vm.installed) +
                      "\n\t\t\t"
                  )
                ])
              ]),
              _vm._v(" "),
              !_vm.installing
                ? _c("button", { on: { click: _vm.install } }, [
                    _vm._v(
                      "\n\t\t\t" +
                        _vm._s(
                          !_vm.installed
                            ? _vm.t("mediadc", "Install")
                            : _vm.t("mediadc", "Reinstall")
                        ) +
                        "\n\t\t"
                    )
                  ])
                : _c("button", { attrs: { disabled: "" } }, [
                    _c("span", { staticClass: "icon-loading" })
                  ]),
              _vm._v(" "),
              !_vm.checking && !_vm.installing
                ? _c("button", { on: { click: _vm.check } }, [
                    _vm._v(
                      "\n\t\t\t" +
                        _vm._s(_vm.t("mediadc", "Check installation")) +
                        "\n\t\t"
                    )
                  ])
                : _c("button", { attrs: { disabled: "" } }, [
                    _c("span", { staticClass: "icon-loading" })
                  ]),
              _vm._v(" "),
              _vm.installed
                ? _c("button", { on: { click: _vm.finishConfiguration } }, [
                    _vm._v(
                      "\n\t\t\t" +
                        _vm._s(_vm.t("mediadc", "Install finished")) +
                        "\n\t\t"
                    )
                  ])
                : _vm._e()
            ])
          : !_vm.isAdmin && !_vm.installed && !_vm.loading
          ? _c("div", [
              _c("p", [
                _vm._v(
                  _vm._s(
                    _vm.t(
                      "mediadc",
                      "MediaDC application can be configured only by Administrator."
                    )
                  )
                )
              ]),
              _vm._v(" "),
              _c("p", [
                _vm._v(
                  _vm._s(
                    _vm.t(
                      "mediadc",
                      "Please, contact your cloud Administrator."
                    )
                  )
                )
              ])
            ])
          : _c("div", [
              _vm.installed
                ? _c("button", { on: { click: _vm.finishConfiguration } }, [
                    _vm._v(
                      "\n\t\t\t" +
                        _vm._s(_vm.t("mediadc", "Go to Collector")) +
                        "\n\t\t"
                    )
                  ])
                : _vm._e()
            ]),
        _vm._v(" "),
        _c("div", { staticClass: "install-details" }, [
          _vm.available_algorithms && _vm.installed
            ? _c(
                "div",
                {
                  staticClass: "available_algorithms",
                  staticStyle: { margin: "20px 0 10px" }
                },
                [
                  _vm._v(
                    "\n\t\t\t" +
                      _vm._s(_vm.t("mediadc", "Available algorithms: ")) +
                      " " +
                      _vm._s(_vm.available_algorithms.join(", ")) +
                      "\n\t\t"
                  )
                ]
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.installed && _vm.video_required.length > 0
            ? _c("div", [
                _c("strong", [
                  _vm._v(
                    _vm._s(
                      _vm.t(
                        "mediadc",
                        "Video processing won't work, video_required packages not installed."
                      )
                    )
                  )
                ]),
                _vm._v(" "),
                _c("p", [
                  _vm._v(
                    _vm._s(
                      _vm.t("mediadc", "Not installed video_required packages:")
                    ) +
                      " " +
                      _vm._s(_vm.video_required)
                  )
                ]),
                _vm._v(" "),
                _c("p", [
                  _vm._v(
                    _vm._s(
                      _vm.t(
                        "mediadc",
                        "video_required packages can't be installed automatically, this should be done by administrator manually and then recheck installation on this page."
                      )
                    )
                  )
                ])
              ])
            : _vm._e(),
          _vm._v(" "),
          Object.keys(_vm.packages_list).length > 0
            ? _c("div", { staticClass: "dependencies-table" }, [
                _c("table", [
                  _c(
                    "div",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.updating,
                          expression: "updating"
                        }
                      ],
                      staticClass: "action-blackout"
                    },
                    [_c("span", { staticClass: "icon-loading" })]
                  ),
                  _vm._v(" "),
                  _c("caption", [
                    _vm._v(_vm._s(_vm.t("mediadc", "Python dependecies list")))
                  ]),
                  _vm._v(" "),
                  _c("thead", [
                    _c("tr", [
                      _c("th", [
                        _c("b", [_vm._v(_vm._s(_vm.t("mediadc", "Type")))])
                      ]),
                      _vm._v(" "),
                      _c("th", [
                        _c("b", [_vm._v(_vm._s(_vm.t("mediadc", "Packages")))])
                      ]),
                      _vm._v(" "),
                      _c("th", [
                        _c("b", [_vm._v(_vm._s(_vm.t("mediadc", "Installed")))])
                      ]),
                      _vm._v(" "),
                      _c("th", [
                        _c("b", [_vm._v(_vm._s(_vm.t("mediadc", "Actions")))])
                      ])
                    ])
                  ]),
                  _vm._v(" "),
                  _c(
                    "tbody",
                    _vm._l(
                      Object.keys(_vm.packages_list).sort(function(
                        first,
                        second
                      ) {
                        return first > second
                      }),
                      function(listName) {
                        return _c("tr", { key: listName }, [
                          _c("td", [_vm._v(_vm._s(listName))]),
                          _vm._v(" "),
                          _c(
                            "td",
                            _vm._l(
                              Object.keys(_vm.packages_list[listName]),
                              function(packageName, index) {
                                return _c(
                                  "span",
                                  { key: packageName, staticClass: "package" },
                                  [
                                    _c(
                                      "span",
                                      { staticClass: "package-title" },
                                      [
                                        _vm._v(
                                          "\n\t\t\t\t\t\t\t\t\t" +
                                            _vm._s(
                                              _vm.packages_list[listName][
                                                packageName
                                              ].package
                                            ) +
                                            _vm._s(
                                              index !==
                                                Object.keys(
                                                  _vm.packages_list[listName]
                                                ).length -
                                                  1
                                                ? ", "
                                                : ""
                                            ) +
                                            "\n\t\t\t\t\t\t\t\t"
                                        )
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      { staticClass: "package-tooltip" },
                                      [
                                        _vm.packages_list[listName][packageName]
                                          .version !== "none"
                                          ? _c(
                                              "span",
                                              {
                                                staticClass: "tooltip-content"
                                              },
                                              [
                                                _vm._v(
                                                  "\n\t\t\t\t\t\t\t\t\t\t" +
                                                    _vm._s(
                                                      _vm.packages_list[
                                                        listName
                                                      ][packageName].location
                                                    ) +
                                                    ":\n\t\t\t\t\t\t\t\t\t\t" +
                                                    _vm._s(
                                                      _vm.packages_list[
                                                        listName
                                                      ][packageName].version
                                                    ) +
                                                    "\n\t\t\t\t\t\t\t\t\t"
                                                )
                                              ]
                                            )
                                          : _c(
                                              "span",
                                              {
                                                staticClass: "tooltip-content"
                                              },
                                              [
                                                _vm._v(
                                                  "\n\t\t\t\t\t\t\t\t\t\t" +
                                                    _vm._s(
                                                      _vm.t(
                                                        "mediadc",
                                                        "Not installed"
                                                      )
                                                    ) +
                                                    "\n\t\t\t\t\t\t\t\t\t"
                                                )
                                              ]
                                            )
                                      ]
                                    )
                                  ]
                                )
                              }
                            ),
                            0
                          ),
                          _vm._v(" "),
                          _c("td", [
                            _vm._v(
                              _vm._s(
                                _vm.installed_packages_list[listName].length ===
                                  0
                              )
                            )
                          ]),
                          _vm._v(" "),
                          _c("td", [
                            _c(
                              "button",
                              {
                                attrs: {
                                  disabled:
                                    _vm.installed_packages_list[listName]
                                      .length === 0
                                },
                                on: {
                                  click: function($event) {
                                    return _vm.installDepsList(listName)
                                  }
                                }
                              },
                              [
                                _vm._v(
                                  "\n\t\t\t\t\t\t\t\t" +
                                    _vm._s(_vm.t("mediadc", "Install")) +
                                    "\n\t\t\t\t\t\t\t"
                                )
                              ]
                            ),
                            _vm._v(" "),
                            _c(
                              "button",
                              {
                                attrs: {
                                  disabled:
                                    _vm.installed_packages_list[listName]
                                      .length !== 0
                                },
                                on: {
                                  click: function($event) {
                                    return _vm.updateDepsList(listName)
                                  }
                                }
                              },
                              [
                                _vm._v(
                                  "\n\t\t\t\t\t\t\t\t" +
                                    _vm._s(_vm.t("mediadc", "Update")) +
                                    "\n\t\t\t\t\t\t\t"
                                )
                              ]
                            ),
                            _vm._v(" "),
                            _c(
                              "button",
                              {
                                attrs: {
                                  disabled:
                                    _vm.installed_packages_list[listName]
                                      .length !== 0
                                },
                                on: {
                                  click: function($event) {
                                    return _vm.deleteDepsList(listName)
                                  }
                                }
                              },
                              [
                                _vm._v(
                                  "\n\t\t\t\t\t\t\t\t" +
                                    _vm._s(_vm.t("mediadc", "Delete")) +
                                    "\n\t\t\t\t\t\t\t"
                                )
                              ]
                            )
                          ])
                        ])
                      }
                    ),
                    0
                  )
                ])
              ])
            : _vm._e()
        ]),
        _vm._v(" "),
        _vm.errors.length > 0
          ? _c("div", { staticClass: "install-errors" }, [
              _c("h3", [
                _c("span", { staticClass: "icon-error" }),
                _vm._v(
                  "\n\t\t\t" +
                    _vm._s(_vm.t("mediadc", "Configuration errors")) +
                    "\n\t\t"
                )
              ]),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "errors-list" },
                _vm._l(_vm.errors, function(error) {
                  return _c(
                    "div",
                    { key: error, staticClass: "errors-list-item" },
                    [_c("pre", [_vm._v(_vm._s(error))])]
                  )
                }),
                0
              )
            ])
          : _vm._e(),
        _vm._v(" "),
        _vm.warnings.length > 0
          ? _c("div", { staticClass: "install-warnings" }, [
              _c("h3", [
                _c("span", { staticClass: "icon-alert-outline" }),
                _vm._v(
                  "\n\t\t\t" +
                    _vm._s(_vm.t("mediadc", "Configuration warnings")) +
                    "\n\t\t"
                )
              ]),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "warnings-list" },
                _vm._l(_vm.warnings, function(warning) {
                  return _c(
                    "div",
                    { key: warning, staticClass: "warnings-list-item" },
                    [_c("pre", [_vm._v(_vm._s(warning))])]
                  )
                }),
                0
              )
            ])
          : _vm._e()
      ])
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./src/views/Configuration.vue":
/*!*************************************!*\
  !*** ./src/views/Configuration.vue ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Configuration_vue_vue_type_template_id_f6095ba8_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Configuration.vue?vue&type=template&id=f6095ba8&scoped=true& */ "./src/views/Configuration.vue?vue&type=template&id=f6095ba8&scoped=true&");
/* harmony import */ var _Configuration_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Configuration.vue?vue&type=script&lang=js& */ "./src/views/Configuration.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _Configuration_vue_vue_type_style_index_0_id_f6095ba8_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Configuration.vue?vue&type=style&index=0&id=f6095ba8&scoped=true&lang=css& */ "./src/views/Configuration.vue?vue&type=style&index=0&id=f6095ba8&scoped=true&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Configuration_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Configuration_vue_vue_type_template_id_f6095ba8_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Configuration_vue_vue_type_template_id_f6095ba8_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "f6095ba8",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/Configuration.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/views/Configuration.vue?vue&type=script&lang=js&":
/*!**************************************************************!*\
  !*** ./src/views/Configuration.vue?vue&type=script&lang=js& ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Configuration_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib!../../node_modules/vue-loader/lib??vue-loader-options!./Configuration.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/views/Configuration.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Configuration_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/Configuration.vue?vue&type=style&index=0&id=f6095ba8&scoped=true&lang=css&":
/*!**********************************************************************************************!*\
  !*** ./src/views/Configuration.vue?vue&type=style&index=0&id=f6095ba8&scoped=true&lang=css& ***!
  \**********************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Configuration_vue_vue_type_style_index_0_id_f6095ba8_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/vue-loader/lib??vue-loader-options!./Configuration.vue?vue&type=style&index=0&id=f6095ba8&scoped=true&lang=css& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/views/Configuration.vue?vue&type=style&index=0&id=f6095ba8&scoped=true&lang=css&");
/* empty/unused harmony star reexport */

/***/ }),

/***/ "./src/views/Configuration.vue?vue&type=template&id=f6095ba8&scoped=true&":
/*!********************************************************************************!*\
  !*** ./src/views/Configuration.vue?vue&type=template&id=f6095ba8&scoped=true& ***!
  \********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Configuration_vue_vue_type_template_id_f6095ba8_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./Configuration.vue?vue&type=template&id=f6095ba8&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/views/Configuration.vue?vue&type=template&id=f6095ba8&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Configuration_vue_vue_type_template_id_f6095ba8_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Configuration_vue_vue_type_template_id_f6095ba8_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=mediadc-3.js.map?v=500d157937a45ddd4293