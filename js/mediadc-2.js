(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[2],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksList.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/tasks/TasksList.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.js");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _mixins_Formats__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../mixins/Formats */ "./src/mixins/Formats.js");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  name: 'TasksList',
  mixins: [_mixins_Formats__WEBPACK_IMPORTED_MODULE_3__["default"]],
  data: function data() {
    return {
      tasksUpdater: null
    };
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_2__["mapGetters"])(['settings', 'tasks'])),
  beforeMount: function beforeMount() {
    this.tasksUpdater = setInterval(this.getTasks, 5000);
  },
  beforeDestroy: function beforeDestroy() {
    clearInterval(this.tasksUpdater);
  },
  methods: {
    getTasks: function getTasks() {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__["generateUrl"])('/apps/mediadc/api/v1/tasks')).then(function (res) {
                  _this.$store.dispatch('setTasks', res.data);
                });

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    deleteTask: function deleteTask(task) {
      var _this2 = this;

      _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default.a.delete(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__["generateUrl"])("/apps/mediadc/api/v1/tasks/".concat(task.id))).then(function (res) {
        _this2.getTasks();
      });
    },
    terminateTask: function terminateTask(taskId) {
      var _this3 = this;

      _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default.a.post(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__["generateUrl"])("/apps/mediadc/api/v1/tasks/".concat(taskId, "/terminate")), {
        taskId: taskId
      }).then(function (res) {
        _this3.getTasks();
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksNew.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/tasks/TasksNew.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.es.js");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.js");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_axios__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_files__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/files */ "./src/utils/files.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  name: 'TasksNew',
  data: function data() {
    return {
      targetDirectoriesPaths: {},
      targetDirectoriesIds: [],
      excludeDirectoriesPaths: [],
      excludeFileIds: {},
      targetMimeType: 0,
      similarity_threshold: 90,
      customExcludeList: [],
      customExcludeMask: '',
      addingCustomMask: false,
      runningTask: false
    };
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_4__["mapGetters"])(['settings', 'settingByName', 'tasks'])),
  beforeMount: function beforeMount() {
    this.similarity_threshold = this.settingByName('similarity_threshold') !== undefined ? this.settingByName('similarity_threshold').value : 90;
  },
  methods: {
    getDirectoriesPicker: function getDirectoriesPicker(title) {
      return Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__["getFilePickerBuilder"])(title).setMultiSelect(false).addMimeTypeFilter('httpd/unix-directory').setModal(true).setType(1).allowDirectories(true).build();
    },
    getFilesPicker: function getFilesPicker(title) {
      return Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__["getFilePickerBuilder"])(title).setMultiSelect(false).setModal(true).setType(1).allowDirectories(true).build();
    },
    openDirectoriesExplorer: function openDirectoriesExplorer() {
      var _this = this;

      this.getDirectoriesPicker(t('mediadc', 'Choose target directory')).pick().then(function (dir) {
        if (dir.startsWith('/')) {
          Object(_utils_files__WEBPACK_IMPORTED_MODULE_3__["requestFileInfo"])(dir).then(function (res) {
            var fileid = Object(_utils_files__WEBPACK_IMPORTED_MODULE_3__["getFileId"])(res.data);

            if (fileid !== -1) {
              if (!(fileid in _this.targetDirectoriesPaths)) {
                _this.targetDirectoriesIds.push(fileid);

                _this.targetDirectoriesPaths[fileid.toString()] = dir;
              } else {
                Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__["showWarning"])(t('mediadc', 'This directory already selected'));
              }
            }
          });
        } else {
          Object(_utils_files__WEBPACK_IMPORTED_MODULE_3__["requestFileInfo"])('/').then(function (res) {
            var fileid = Object(_utils_files__WEBPACK_IMPORTED_MODULE_3__["getFileId"])(res.data);

            if (fileid !== -1) {
              if (!(fileid in _this.targetDirectoriesPaths)) {
                _this.targetDirectoriesIds.push(fileid);

                _this.targetDirectoriesPaths[fileid.toString()] = '/';
              } else {
                Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__["showWarning"])(t('mediadc', 'This directory already selected'));
              }
            }
          });

          _this.targetDirectoriesPaths.push('/');
        }
      });
    },
    openExcludeExplorer: function openExcludeExplorer() {
      var _this2 = this;

      this.getDirectoriesPicker(t('mediadc', 'Choose directory to exclude')).pick().then(function (dir) {
        if (Object.values(_this2.excludeFileIds).findIndex(function (targetDir) {
          return targetDir === dir;
        }) === -1) {
          if (dir.startsWith('/')) {
            Object(_utils_files__WEBPACK_IMPORTED_MODULE_3__["requestFileInfo"])(dir).then(function (res) {
              var fileid = Object(_utils_files__WEBPACK_IMPORTED_MODULE_3__["getFileId"])(res.data);

              if (fileid !== -1) {
                _this2.excludeDirectoriesPaths.push(dir);

                _this2.excludeFileIds[fileid.toString()] = dir;
              }
            });
          } else {
            Object(_utils_files__WEBPACK_IMPORTED_MODULE_3__["requestFileInfo"])('/').then(function (res) {
              var fileid = Object(_utils_files__WEBPACK_IMPORTED_MODULE_3__["getFileId"])(res.data);

              if (fileid !== -1) {
                _this2.excludeDirectoriesPaths.push(dir);

                _this2.excludeFileIds[fileid.toString()] = '/';
              }
            });
          }
        } else {
          Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__["showWarning"])(t('mediadc', 'This directory already excluded'));
        }
      });
    },
    runCollectorTask: function runCollectorTask() {
      var _this3 = this;

      this.runningTask = true;
      _nextcloud_axios__WEBPACK_IMPORTED_MODULE_2___default.a.post(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__["generateUrl"])('/apps/mediadc/api/v1/tasks/run'), {
        targetDirectoryIds: JSON.stringify(this.targetDirectoriesIds),
        excludeList: {
          user: {
            mask: this.customExcludeList,
            fileid: Object.keys(this.excludeFileIds).map(function (item) {
              return Number(item);
            })
          },
          admin: JSON.parse(this.settingByName('exclude_list').value) || {
            mask: [],
            fileid: []
          }
        },
        collectorSettings: {
          hashing_algorithm: JSON.parse(this.settingByName('hashing_algorithm').value) || 'phash',
          similarity_threshold: this.similarity_threshold,
          hash_size: this.settingByName('hash_size').value || 64,
          target_mtype: this.targetMimeType
        }
      }).then(function (res) {
        _this3.runningTask = false;

        if (res.data.success) {
          _this3.$emit('update:loading', true);

          _this3.getTasks();

          _this3.resetForm();

          Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__["showSuccess"])(t('mediadc', 'New task successfully created!'));
        } else {
          Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__["showWarning"])('Some error occured while running Collector Task. Try again.');
        }
      });
    },
    removeTargetDirectory: function removeTargetDirectory(fileid) {
      delete this.targetDirectoriesPaths[fileid];
      var fileidIndex = this.targetDirectoriesIds.findIndex(function (id) {
        return id === fileid;
      });
      this.targetDirectoriesIds.splice(fileidIndex, 1);
    },
    removeExcludeDirectory: function removeExcludeDirectory(fileid) {
      var _this4 = this;

      if (fileid in this.excludeFileIds) {
        var dirIndex = this.excludeDirectoriesPaths.findIndex(function (dir) {
          return dir === _this4.excludeFileIds[fileid];
        });
        this.excludeDirectoriesPaths.splice(dirIndex, 1);
        delete this.excludeFileIds[fileid];
      }
    },
    removeExcludeFileid: function removeExcludeFileid(fileid) {
      delete this.excludeFileIds[fileid];
    },
    addNewMask: function addNewMask() {
      var _this5 = this;

      this.addingCustomMask = true;
      setTimeout(function () {
        _this5.$refs.customExcludeMask.focus();
      }, 100);
    },
    addCustomMask: function addCustomMask() {
      var _this6 = this;

      if (this.customExcludeMask.length > 0) {
        if (this.customExcludeList.findIndex(function (mask) {
          return mask === _this6.customExcludeMask;
        }) === -1) {
          this.customExcludeList.push(this.customExcludeMask);
          this.customExcludeMask = '';
          this.addingCustomMask = false;
        } else {
          Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__["showWarning"])(t('mediadc', 'This mask already exists!'));
        }
      } else {
        Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__["showWarning"])(t('mediadc', 'Enter custom mask!'));
      }
    },
    cancelAddingCustomMask: function cancelAddingCustomMask() {
      this.customExcludeMask = '';
      this.addingCustomMask = false;
    },
    deleteCustomMask: function deleteCustomMask(mask) {
      var maskIndex = this.customExcludeList.findIndex(function (m) {
        return m === mask;
      });
      this.customExcludeList.splice(maskIndex, 1);
    },
    getTasks: function getTasks() {
      var _this7 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _nextcloud_axios__WEBPACK_IMPORTED_MODULE_2___default.a.get(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__["generateUrl"])('/apps/mediadc/api/v1/tasks')).then(function (res) {
                  _this7.$store.dispatch('setTasks', res.data);

                  _this7.$emit('update:loading', false);
                });

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    resetForm: function resetForm() {
      this.targetDirectoriesPaths = {};
      this.targetDirectoriesIds = [];
      this.excludeDirectoriesPaths = [];
      this.excludeFileIds = {};
      this.targetMimeType = 0;
      this.similarity_threshold = this.settingByName('similarity_threshold') !== undefined ? this.settingByName('similarity_threshold').value : 90;
      this.customExcludeList = [];
      this.runningTask = false;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/views/Collector.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Collector.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.js");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _mixins_Configure__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../mixins/Configure */ "./src/mixins/Configure.js");
/* harmony import */ var _components_tasks_TasksNew__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/tasks/TasksNew */ "./src/components/tasks/TasksNew.vue");
/* harmony import */ var _components_tasks_TasksList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/tasks/TasksList */ "./src/components/tasks/TasksList.vue");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  name: 'Collector',
  components: {
    TasksNew: _components_tasks_TasksNew__WEBPACK_IMPORTED_MODULE_4__["default"],
    TasksList: _components_tasks_TasksList__WEBPACK_IMPORTED_MODULE_5__["default"]
  },
  mixins: [_mixins_Configure__WEBPACK_IMPORTED_MODULE_3__["default"]],
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
      updating: false
    };
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_2__["mapGetters"])(['settings', 'tasks'])),
  beforeMount: function beforeMount() {
    this.getContent();
  },
  methods: {
    getContent: function getContent() {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this.$emit('update:loading', true);

                _this.getTasks();

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    getTasks: function getTasks() {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__["generateUrl"])('/apps/mediadc/api/v1/tasks')).then(function (res) {
                  _this2.$store.dispatch('setTasks', res.data);

                  _this2.$emit('update:loading', false);
                });

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksList.vue?vue&type=style&index=0&id=68c8f6ea&scoped=true&lang=css&":
/*!******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/components/tasks/TasksList.vue?vue&type=style&index=0&id=68c8f6ea&scoped=true&lang=css& ***!
  \******************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.tasks-list[data-v-68c8f6ea] {\n\tpadding: 20px;\n\tbackground-color: #E6F3FA;\n\tborder-radius: 5px;\n\twidth: 100%;\n\tmargin: 10px;\n\tmax-width: 600px;\n\tmax-height: 480px;\n\tmin-height: 410px;\n\toverflow-y: scroll;\n}\n.task-row[data-v-68c8f6ea] {\n\tdisplay: flex;\n\talign-items: center;\n\tborder: 1px solid #dadada;\n\tbackground-color: #fff;\n\tborder-radius: 5px;\n\tmargin-bottom: 10px;\n\ttransition: box-shadow .3s;\n}\n.task-row[data-v-68c8f6ea]:hover {\n\tbox-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);\n}\n.task-row:hover .delete-task-button[data-v-68c8f6ea] {\n\tvisibility: visible;\n}\n.task-row a[data-v-68c8f6ea] {\n\tpadding: 10px 0 10px 20px;\n\twidth: 100%;\n\theight: 100%;\n\tdisplay: inline-flex;\n\talign-items: center;\n}\n.delete-task-button[data-v-68c8f6ea] {\n\tdisplay: inline-flex;\n\tvisibility: hidden;\n\twidth: 16px;\n\theight: 16px;\n\tmargin: 10px 20px;\n\tcursor: pointer;\n}\n.task-time[data-v-68c8f6ea] {\n\tcolor: #585858;\n}\n@media (max-width: 540px) {\n.task-row[data-v-68c8f6ea], .task-row a[data-v-68c8f6ea] {\n\t\tflex-direction: column;\n}\n.delete-task-button[data-v-68c8f6ea] {\n\t\tvisibility: visible;\n}\n.badge[data-v-68c8f6ea] {\n\t\tmargin-right: 0;\n\t\tmargin-bottom: 10px;\n}\n}\n.badge[data-v-68c8f6ea] {\n\tdisplay: inline-flex;\n\tpadding: 0 10px;\n\tbackground-color: #eee;\n\tborder-radius: 20px;\n\tmargin-right: 10px;\n}\n.badge.finished[data-v-68c8f6ea] {\n\tbackground-color: #49b382;\n\tcolor: #fff;\n}\n.badge.running[data-v-68c8f6ea] {\n\tbackground-color: #dadada;\n\tcolor: #000;\n}\n.badge.error[data-v-68c8f6ea] {\n\tbackground-color: #bd3f3f;\n\tcolor: #fff;\n}\n.badge.terminated[data-v-68c8f6ea] {\n\tbackground-color: #f17b1b;\n\tcolor: #fff;\n}\n.empty-tasks-list[data-v-68c8f6ea] {\n\tpadding: 20px;\n\twidth: 100%;\n\theight: 80%;\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\tbox-sizing: border-box;\n\tflex-direction: column;\n}\n.empty-tasks-list strong[data-v-68c8f6ea] {\n\tfont-size: 16px;\n\tcolor: #636363;\n}\n.empty-tasks-list img[data-v-68c8f6ea] {\n\tmargin: 20px 0;\n}\nbody.theme--dark .tasks-list[data-v-68c8f6ea] {\n\tbackground-color: #333333;\n}\nbody.theme--dark .task-row[data-v-68c8f6ea] {\n\tbackground-color: #353535;\n\tborder-color: #717171;\n}\nbody.theme--dark .task-owner[data-v-68c8f6ea] {\n\tcolor: #a9a8a8;\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksNew.vue?vue&type=style&index=0&id=34f9e57a&scoped=true&lang=css&":
/*!*****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/components/tasks/TasksNew.vue?vue&type=style&index=0&id=34f9e57a&scoped=true&lang=css& ***!
  \*****************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.new-task-block[data-v-34f9e57a] {\n\tborder: 1px solid #dadada;\n\tborder-radius: 5px;\n\tbox-shadow: 0 0 4px 0 rgba(0, 0, 0, .05);\n\tpadding: 20px;\n\tmargin: 10px;\n\twidth: 100%;\n\tmax-width: 600px;\n}\n.selection-container[data-v-34f9e57a] {\n\twidth: 100%;\n\tdisplay: flex;\n}\n@media (max-width: 767px) {\n.selection-container[data-v-34f9e57a] {\n\t\tflex-wrap: wrap;\n}\n}\n.block[data-v-34f9e57a] {\n\twidth: 100%;\n\theight: 100%;\n\tmax-height: 200px;\n\toverflow-y: scroll;\n\tpadding: 10px 15px;\n\tmargin: 5px 10px;\n\tborder: 1px solid #dadada;\n\tborder-radius: 5px;\n}\n.block[data-v-34f9e57a]:hover {\n\tbox-shadow: 0 0 10px 0 rgba(0, 0, 0, .05)\n}\n.target-directory[data-v-34f9e57a], .custom-mask[data-v-34f9e57a] {\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: space-between;\n\tpadding: 5px 0;\n\tborder-bottom: 1px solid #dadada;\n}\n.delete-button[data-v-34f9e57a] {\n\tdisplay: inline-flex;\n\twidth: 15px;\n\theight: 15px;\n\tcursor: pointer;\n\tmargin: 0 10px;\n}\nbody.theme--dark .new-task-block[data-v-34f9e57a], body.theme--dark .block[data-v-34f9e57a] {\n\tborder-color: #717171;\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/views/Collector.vue?vue&type=style&index=0&id=25cf8543&scoped=true&lang=css&":
/*!*******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Collector.vue?vue&type=style&index=0&id=25cf8543&scoped=true&lang=css& ***!
  \*******************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.container[data-v-25cf8543] {\n\tpadding: 0 20px;\n\twidth: 100%;\n\tmax-width: 1440px;\n\tmargin: 0 auto;\n}\nh1[data-v-25cf8543] {\n\tfont-size: 24px;\n\tfont-weight: bold;\n\ttext-align: center;\n\tmargin: 20px 0 10px;\n}\nbutton[data-v-25cf8543] {\n\tmargin: 20px 0;\n}\np[data-v-25cf8543] {\n\tpadding: 0 10px;\n\tmargin: 10px 0;\n\ttext-align: center;\n}\n.mediadc-row[data-v-25cf8543] {\n\tdisplay: flex;\n\tjustify-content: center;\n}\n@media (max-width: 960px) {\n.mediadc-row[data-v-25cf8543] {\n\t\tflex-wrap: wrap;\n\t\tjustify-content: center;\n}\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/moment/locale sync recursive ^\\.\\/.*$":
/*!**************************************************!*\
  !*** ./node_modules/moment/locale sync ^\.\/.*$ ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": "./node_modules/moment/locale/af.js",
	"./af.js": "./node_modules/moment/locale/af.js",
	"./ar": "./node_modules/moment/locale/ar.js",
	"./ar-dz": "./node_modules/moment/locale/ar-dz.js",
	"./ar-dz.js": "./node_modules/moment/locale/ar-dz.js",
	"./ar-kw": "./node_modules/moment/locale/ar-kw.js",
	"./ar-kw.js": "./node_modules/moment/locale/ar-kw.js",
	"./ar-ly": "./node_modules/moment/locale/ar-ly.js",
	"./ar-ly.js": "./node_modules/moment/locale/ar-ly.js",
	"./ar-ma": "./node_modules/moment/locale/ar-ma.js",
	"./ar-ma.js": "./node_modules/moment/locale/ar-ma.js",
	"./ar-sa": "./node_modules/moment/locale/ar-sa.js",
	"./ar-sa.js": "./node_modules/moment/locale/ar-sa.js",
	"./ar-tn": "./node_modules/moment/locale/ar-tn.js",
	"./ar-tn.js": "./node_modules/moment/locale/ar-tn.js",
	"./ar.js": "./node_modules/moment/locale/ar.js",
	"./az": "./node_modules/moment/locale/az.js",
	"./az.js": "./node_modules/moment/locale/az.js",
	"./be": "./node_modules/moment/locale/be.js",
	"./be.js": "./node_modules/moment/locale/be.js",
	"./bg": "./node_modules/moment/locale/bg.js",
	"./bg.js": "./node_modules/moment/locale/bg.js",
	"./bm": "./node_modules/moment/locale/bm.js",
	"./bm.js": "./node_modules/moment/locale/bm.js",
	"./bn": "./node_modules/moment/locale/bn.js",
	"./bn-bd": "./node_modules/moment/locale/bn-bd.js",
	"./bn-bd.js": "./node_modules/moment/locale/bn-bd.js",
	"./bn.js": "./node_modules/moment/locale/bn.js",
	"./bo": "./node_modules/moment/locale/bo.js",
	"./bo.js": "./node_modules/moment/locale/bo.js",
	"./br": "./node_modules/moment/locale/br.js",
	"./br.js": "./node_modules/moment/locale/br.js",
	"./bs": "./node_modules/moment/locale/bs.js",
	"./bs.js": "./node_modules/moment/locale/bs.js",
	"./ca": "./node_modules/moment/locale/ca.js",
	"./ca.js": "./node_modules/moment/locale/ca.js",
	"./cs": "./node_modules/moment/locale/cs.js",
	"./cs.js": "./node_modules/moment/locale/cs.js",
	"./cv": "./node_modules/moment/locale/cv.js",
	"./cv.js": "./node_modules/moment/locale/cv.js",
	"./cy": "./node_modules/moment/locale/cy.js",
	"./cy.js": "./node_modules/moment/locale/cy.js",
	"./da": "./node_modules/moment/locale/da.js",
	"./da.js": "./node_modules/moment/locale/da.js",
	"./de": "./node_modules/moment/locale/de.js",
	"./de-at": "./node_modules/moment/locale/de-at.js",
	"./de-at.js": "./node_modules/moment/locale/de-at.js",
	"./de-ch": "./node_modules/moment/locale/de-ch.js",
	"./de-ch.js": "./node_modules/moment/locale/de-ch.js",
	"./de.js": "./node_modules/moment/locale/de.js",
	"./dv": "./node_modules/moment/locale/dv.js",
	"./dv.js": "./node_modules/moment/locale/dv.js",
	"./el": "./node_modules/moment/locale/el.js",
	"./el.js": "./node_modules/moment/locale/el.js",
	"./en-au": "./node_modules/moment/locale/en-au.js",
	"./en-au.js": "./node_modules/moment/locale/en-au.js",
	"./en-ca": "./node_modules/moment/locale/en-ca.js",
	"./en-ca.js": "./node_modules/moment/locale/en-ca.js",
	"./en-gb": "./node_modules/moment/locale/en-gb.js",
	"./en-gb.js": "./node_modules/moment/locale/en-gb.js",
	"./en-ie": "./node_modules/moment/locale/en-ie.js",
	"./en-ie.js": "./node_modules/moment/locale/en-ie.js",
	"./en-il": "./node_modules/moment/locale/en-il.js",
	"./en-il.js": "./node_modules/moment/locale/en-il.js",
	"./en-in": "./node_modules/moment/locale/en-in.js",
	"./en-in.js": "./node_modules/moment/locale/en-in.js",
	"./en-nz": "./node_modules/moment/locale/en-nz.js",
	"./en-nz.js": "./node_modules/moment/locale/en-nz.js",
	"./en-sg": "./node_modules/moment/locale/en-sg.js",
	"./en-sg.js": "./node_modules/moment/locale/en-sg.js",
	"./eo": "./node_modules/moment/locale/eo.js",
	"./eo.js": "./node_modules/moment/locale/eo.js",
	"./es": "./node_modules/moment/locale/es.js",
	"./es-do": "./node_modules/moment/locale/es-do.js",
	"./es-do.js": "./node_modules/moment/locale/es-do.js",
	"./es-mx": "./node_modules/moment/locale/es-mx.js",
	"./es-mx.js": "./node_modules/moment/locale/es-mx.js",
	"./es-us": "./node_modules/moment/locale/es-us.js",
	"./es-us.js": "./node_modules/moment/locale/es-us.js",
	"./es.js": "./node_modules/moment/locale/es.js",
	"./et": "./node_modules/moment/locale/et.js",
	"./et.js": "./node_modules/moment/locale/et.js",
	"./eu": "./node_modules/moment/locale/eu.js",
	"./eu.js": "./node_modules/moment/locale/eu.js",
	"./fa": "./node_modules/moment/locale/fa.js",
	"./fa.js": "./node_modules/moment/locale/fa.js",
	"./fi": "./node_modules/moment/locale/fi.js",
	"./fi.js": "./node_modules/moment/locale/fi.js",
	"./fil": "./node_modules/moment/locale/fil.js",
	"./fil.js": "./node_modules/moment/locale/fil.js",
	"./fo": "./node_modules/moment/locale/fo.js",
	"./fo.js": "./node_modules/moment/locale/fo.js",
	"./fr": "./node_modules/moment/locale/fr.js",
	"./fr-ca": "./node_modules/moment/locale/fr-ca.js",
	"./fr-ca.js": "./node_modules/moment/locale/fr-ca.js",
	"./fr-ch": "./node_modules/moment/locale/fr-ch.js",
	"./fr-ch.js": "./node_modules/moment/locale/fr-ch.js",
	"./fr.js": "./node_modules/moment/locale/fr.js",
	"./fy": "./node_modules/moment/locale/fy.js",
	"./fy.js": "./node_modules/moment/locale/fy.js",
	"./ga": "./node_modules/moment/locale/ga.js",
	"./ga.js": "./node_modules/moment/locale/ga.js",
	"./gd": "./node_modules/moment/locale/gd.js",
	"./gd.js": "./node_modules/moment/locale/gd.js",
	"./gl": "./node_modules/moment/locale/gl.js",
	"./gl.js": "./node_modules/moment/locale/gl.js",
	"./gom-deva": "./node_modules/moment/locale/gom-deva.js",
	"./gom-deva.js": "./node_modules/moment/locale/gom-deva.js",
	"./gom-latn": "./node_modules/moment/locale/gom-latn.js",
	"./gom-latn.js": "./node_modules/moment/locale/gom-latn.js",
	"./gu": "./node_modules/moment/locale/gu.js",
	"./gu.js": "./node_modules/moment/locale/gu.js",
	"./he": "./node_modules/moment/locale/he.js",
	"./he.js": "./node_modules/moment/locale/he.js",
	"./hi": "./node_modules/moment/locale/hi.js",
	"./hi.js": "./node_modules/moment/locale/hi.js",
	"./hr": "./node_modules/moment/locale/hr.js",
	"./hr.js": "./node_modules/moment/locale/hr.js",
	"./hu": "./node_modules/moment/locale/hu.js",
	"./hu.js": "./node_modules/moment/locale/hu.js",
	"./hy-am": "./node_modules/moment/locale/hy-am.js",
	"./hy-am.js": "./node_modules/moment/locale/hy-am.js",
	"./id": "./node_modules/moment/locale/id.js",
	"./id.js": "./node_modules/moment/locale/id.js",
	"./is": "./node_modules/moment/locale/is.js",
	"./is.js": "./node_modules/moment/locale/is.js",
	"./it": "./node_modules/moment/locale/it.js",
	"./it-ch": "./node_modules/moment/locale/it-ch.js",
	"./it-ch.js": "./node_modules/moment/locale/it-ch.js",
	"./it.js": "./node_modules/moment/locale/it.js",
	"./ja": "./node_modules/moment/locale/ja.js",
	"./ja.js": "./node_modules/moment/locale/ja.js",
	"./jv": "./node_modules/moment/locale/jv.js",
	"./jv.js": "./node_modules/moment/locale/jv.js",
	"./ka": "./node_modules/moment/locale/ka.js",
	"./ka.js": "./node_modules/moment/locale/ka.js",
	"./kk": "./node_modules/moment/locale/kk.js",
	"./kk.js": "./node_modules/moment/locale/kk.js",
	"./km": "./node_modules/moment/locale/km.js",
	"./km.js": "./node_modules/moment/locale/km.js",
	"./kn": "./node_modules/moment/locale/kn.js",
	"./kn.js": "./node_modules/moment/locale/kn.js",
	"./ko": "./node_modules/moment/locale/ko.js",
	"./ko.js": "./node_modules/moment/locale/ko.js",
	"./ku": "./node_modules/moment/locale/ku.js",
	"./ku.js": "./node_modules/moment/locale/ku.js",
	"./ky": "./node_modules/moment/locale/ky.js",
	"./ky.js": "./node_modules/moment/locale/ky.js",
	"./lb": "./node_modules/moment/locale/lb.js",
	"./lb.js": "./node_modules/moment/locale/lb.js",
	"./lo": "./node_modules/moment/locale/lo.js",
	"./lo.js": "./node_modules/moment/locale/lo.js",
	"./lt": "./node_modules/moment/locale/lt.js",
	"./lt.js": "./node_modules/moment/locale/lt.js",
	"./lv": "./node_modules/moment/locale/lv.js",
	"./lv.js": "./node_modules/moment/locale/lv.js",
	"./me": "./node_modules/moment/locale/me.js",
	"./me.js": "./node_modules/moment/locale/me.js",
	"./mi": "./node_modules/moment/locale/mi.js",
	"./mi.js": "./node_modules/moment/locale/mi.js",
	"./mk": "./node_modules/moment/locale/mk.js",
	"./mk.js": "./node_modules/moment/locale/mk.js",
	"./ml": "./node_modules/moment/locale/ml.js",
	"./ml.js": "./node_modules/moment/locale/ml.js",
	"./mn": "./node_modules/moment/locale/mn.js",
	"./mn.js": "./node_modules/moment/locale/mn.js",
	"./mr": "./node_modules/moment/locale/mr.js",
	"./mr.js": "./node_modules/moment/locale/mr.js",
	"./ms": "./node_modules/moment/locale/ms.js",
	"./ms-my": "./node_modules/moment/locale/ms-my.js",
	"./ms-my.js": "./node_modules/moment/locale/ms-my.js",
	"./ms.js": "./node_modules/moment/locale/ms.js",
	"./mt": "./node_modules/moment/locale/mt.js",
	"./mt.js": "./node_modules/moment/locale/mt.js",
	"./my": "./node_modules/moment/locale/my.js",
	"./my.js": "./node_modules/moment/locale/my.js",
	"./nb": "./node_modules/moment/locale/nb.js",
	"./nb.js": "./node_modules/moment/locale/nb.js",
	"./ne": "./node_modules/moment/locale/ne.js",
	"./ne.js": "./node_modules/moment/locale/ne.js",
	"./nl": "./node_modules/moment/locale/nl.js",
	"./nl-be": "./node_modules/moment/locale/nl-be.js",
	"./nl-be.js": "./node_modules/moment/locale/nl-be.js",
	"./nl.js": "./node_modules/moment/locale/nl.js",
	"./nn": "./node_modules/moment/locale/nn.js",
	"./nn.js": "./node_modules/moment/locale/nn.js",
	"./oc-lnc": "./node_modules/moment/locale/oc-lnc.js",
	"./oc-lnc.js": "./node_modules/moment/locale/oc-lnc.js",
	"./pa-in": "./node_modules/moment/locale/pa-in.js",
	"./pa-in.js": "./node_modules/moment/locale/pa-in.js",
	"./pl": "./node_modules/moment/locale/pl.js",
	"./pl.js": "./node_modules/moment/locale/pl.js",
	"./pt": "./node_modules/moment/locale/pt.js",
	"./pt-br": "./node_modules/moment/locale/pt-br.js",
	"./pt-br.js": "./node_modules/moment/locale/pt-br.js",
	"./pt.js": "./node_modules/moment/locale/pt.js",
	"./ro": "./node_modules/moment/locale/ro.js",
	"./ro.js": "./node_modules/moment/locale/ro.js",
	"./ru": "./node_modules/moment/locale/ru.js",
	"./ru.js": "./node_modules/moment/locale/ru.js",
	"./sd": "./node_modules/moment/locale/sd.js",
	"./sd.js": "./node_modules/moment/locale/sd.js",
	"./se": "./node_modules/moment/locale/se.js",
	"./se.js": "./node_modules/moment/locale/se.js",
	"./si": "./node_modules/moment/locale/si.js",
	"./si.js": "./node_modules/moment/locale/si.js",
	"./sk": "./node_modules/moment/locale/sk.js",
	"./sk.js": "./node_modules/moment/locale/sk.js",
	"./sl": "./node_modules/moment/locale/sl.js",
	"./sl.js": "./node_modules/moment/locale/sl.js",
	"./sq": "./node_modules/moment/locale/sq.js",
	"./sq.js": "./node_modules/moment/locale/sq.js",
	"./sr": "./node_modules/moment/locale/sr.js",
	"./sr-cyrl": "./node_modules/moment/locale/sr-cyrl.js",
	"./sr-cyrl.js": "./node_modules/moment/locale/sr-cyrl.js",
	"./sr.js": "./node_modules/moment/locale/sr.js",
	"./ss": "./node_modules/moment/locale/ss.js",
	"./ss.js": "./node_modules/moment/locale/ss.js",
	"./sv": "./node_modules/moment/locale/sv.js",
	"./sv.js": "./node_modules/moment/locale/sv.js",
	"./sw": "./node_modules/moment/locale/sw.js",
	"./sw.js": "./node_modules/moment/locale/sw.js",
	"./ta": "./node_modules/moment/locale/ta.js",
	"./ta.js": "./node_modules/moment/locale/ta.js",
	"./te": "./node_modules/moment/locale/te.js",
	"./te.js": "./node_modules/moment/locale/te.js",
	"./tet": "./node_modules/moment/locale/tet.js",
	"./tet.js": "./node_modules/moment/locale/tet.js",
	"./tg": "./node_modules/moment/locale/tg.js",
	"./tg.js": "./node_modules/moment/locale/tg.js",
	"./th": "./node_modules/moment/locale/th.js",
	"./th.js": "./node_modules/moment/locale/th.js",
	"./tk": "./node_modules/moment/locale/tk.js",
	"./tk.js": "./node_modules/moment/locale/tk.js",
	"./tl-ph": "./node_modules/moment/locale/tl-ph.js",
	"./tl-ph.js": "./node_modules/moment/locale/tl-ph.js",
	"./tlh": "./node_modules/moment/locale/tlh.js",
	"./tlh.js": "./node_modules/moment/locale/tlh.js",
	"./tr": "./node_modules/moment/locale/tr.js",
	"./tr.js": "./node_modules/moment/locale/tr.js",
	"./tzl": "./node_modules/moment/locale/tzl.js",
	"./tzl.js": "./node_modules/moment/locale/tzl.js",
	"./tzm": "./node_modules/moment/locale/tzm.js",
	"./tzm-latn": "./node_modules/moment/locale/tzm-latn.js",
	"./tzm-latn.js": "./node_modules/moment/locale/tzm-latn.js",
	"./tzm.js": "./node_modules/moment/locale/tzm.js",
	"./ug-cn": "./node_modules/moment/locale/ug-cn.js",
	"./ug-cn.js": "./node_modules/moment/locale/ug-cn.js",
	"./uk": "./node_modules/moment/locale/uk.js",
	"./uk.js": "./node_modules/moment/locale/uk.js",
	"./ur": "./node_modules/moment/locale/ur.js",
	"./ur.js": "./node_modules/moment/locale/ur.js",
	"./uz": "./node_modules/moment/locale/uz.js",
	"./uz-latn": "./node_modules/moment/locale/uz-latn.js",
	"./uz-latn.js": "./node_modules/moment/locale/uz-latn.js",
	"./uz.js": "./node_modules/moment/locale/uz.js",
	"./vi": "./node_modules/moment/locale/vi.js",
	"./vi.js": "./node_modules/moment/locale/vi.js",
	"./x-pseudo": "./node_modules/moment/locale/x-pseudo.js",
	"./x-pseudo.js": "./node_modules/moment/locale/x-pseudo.js",
	"./yo": "./node_modules/moment/locale/yo.js",
	"./yo.js": "./node_modules/moment/locale/yo.js",
	"./zh-cn": "./node_modules/moment/locale/zh-cn.js",
	"./zh-cn.js": "./node_modules/moment/locale/zh-cn.js",
	"./zh-hk": "./node_modules/moment/locale/zh-hk.js",
	"./zh-hk.js": "./node_modules/moment/locale/zh-hk.js",
	"./zh-mo": "./node_modules/moment/locale/zh-mo.js",
	"./zh-mo.js": "./node_modules/moment/locale/zh-mo.js",
	"./zh-tw": "./node_modules/moment/locale/zh-tw.js",
	"./zh-tw.js": "./node_modules/moment/locale/zh-tw.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./node_modules/moment/locale sync recursive ^\\.\\/.*$";

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksList.vue?vue&type=style&index=0&id=68c8f6ea&scoped=true&lang=css&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/components/tasks/TasksList.vue?vue&type=style&index=0&id=68c8f6ea&scoped=true&lang=css& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksList_vue_vue_type_style_index_0_id_68c8f6ea_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/vue-loader/lib??vue-loader-options!./TasksList.vue?vue&type=style&index=0&id=68c8f6ea&scoped=true&lang=css& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksList.vue?vue&type=style&index=0&id=68c8f6ea&scoped=true&lang=css&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksList_vue_vue_type_style_index_0_id_68c8f6ea_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksList_vue_vue_type_style_index_0_id_68c8f6ea_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksNew.vue?vue&type=style&index=0&id=34f9e57a&scoped=true&lang=css&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/components/tasks/TasksNew.vue?vue&type=style&index=0&id=34f9e57a&scoped=true&lang=css& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksNew_vue_vue_type_style_index_0_id_34f9e57a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/vue-loader/lib??vue-loader-options!./TasksNew.vue?vue&type=style&index=0&id=34f9e57a&scoped=true&lang=css& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksNew.vue?vue&type=style&index=0&id=34f9e57a&scoped=true&lang=css&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksNew_vue_vue_type_style_index_0_id_34f9e57a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksNew_vue_vue_type_style_index_0_id_34f9e57a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/views/Collector.vue?vue&type=style&index=0&id=25cf8543&scoped=true&lang=css&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Collector.vue?vue&type=style&index=0&id=25cf8543&scoped=true&lang=css& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Collector_vue_vue_type_style_index_0_id_25cf8543_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/vue-loader/lib??vue-loader-options!./Collector.vue?vue&type=style&index=0&id=25cf8543&scoped=true&lang=css& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/views/Collector.vue?vue&type=style&index=0&id=25cf8543&scoped=true&lang=css&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Collector_vue_vue_type_style_index_0_id_25cf8543_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Collector_vue_vue_type_style_index_0_id_25cf8543_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksList.vue?vue&type=template&id=68c8f6ea&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/tasks/TasksList.vue?vue&type=template&id=68c8f6ea&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "tasks-list" }, [
    _c("h2", [_vm._v(_vm._s(_vm.t("mediadc", "Recent Tasks")))]),
    _vm._v(" "),
    _vm.tasks.length > 0
      ? _c(
          "div",
          _vm._l(_vm.tasks, function(task) {
            return _c(
              "div",
              { key: task.id, staticClass: "task-row" },
              [
                _c(
                  "router-link",
                  {
                    attrs: {
                      to: {
                        name: "collectorDetails",
                        params: { taskId: task.id }
                      }
                    }
                  },
                  [
                    _c("span", { class: "badge " + _vm.getStatusBadge(task) }, [
                      _vm._v(_vm._s(_vm.getStatusBadge(task)))
                    ]),
                    _vm._v(" "),
                    _c(
                      "div",
                      { staticStyle: { display: "flex", "flex-wrap": "wrap" } },
                      [
                        _c("span", { staticStyle: { width: "100%" } }, [
                          _c("b", [_vm._v(_vm._s(_vm.parseTargetMtype(task)))]),
                          _vm._v(
                            "\n\t\t\t\t\t\t" +
                              _vm._s(
                                task.files_scanned !== task.files_total
                                  ? task.files_scanned + "/"
                                  : ""
                              ) +
                              _vm._s(task.files_total) +
                              " file(s)\n\t\t\t\t\t\t(" +
                              _vm._s(
                                _vm.formatBytes(Number(task.files_total_size))
                              ) +
                              ")\n\t\t\t\t\t"
                          )
                        ]),
                        _vm._v(" "),
                        _c(
                          "span",
                          {
                            staticClass: "task-time",
                            staticStyle: { width: "100%" }
                          },
                          [
                            _vm._v(
                              "\n\t\t\t\t\t\t" +
                                _vm._s(
                                  _vm.parseUnixTimestamp(task.created_time)
                                ) +
                                "\n\t\t\t\t\t\t" +
                                _vm._s(
                                  Number(task.finished_time) > 0
                                    ? " - " +
                                        _vm.parseUnixTimestamp(
                                          task.finished_time
                                        )
                                    : ""
                                ) +
                                "\n\t\t\t\t\t"
                            )
                          ]
                        )
                      ]
                    )
                  ]
                ),
                _vm._v(" "),
                _c("span", {
                  staticClass: "delete-task-button icon-delete",
                  on: {
                    click: function($event) {
                      return _vm.deleteTask(task)
                    }
                  }
                })
              ],
              1
            )
          }),
          0
        )
      : _c("div", { staticClass: "empty-tasks-list" }, [
          _c("img", {
            attrs: {
              src:
                "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDM4Ljg5MSA0MzguODkxIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MzguODkxIDQzOC44OTE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGQ9Ik0zNDcuOTY4LDU3LjUwM2gtMzkuNzA2VjM5Ljc0YzAtNS43NDctNi4yNjktOC4zNTktMTIuMDE2LTguMzU5aC0zMC44MjRjLTcuMzE0LTIwLjg5OC0yNS42LTMxLjM0Ny00Ni40OTgtMzEuMzQ3DQoJCQkJYy0yMC42NjgtMC43NzctMzkuNDY3LDExLjg5Ni00Ni40OTgsMzEuMzQ3aC0zMC4zMDJjLTUuNzQ3LDAtMTEuNDk0LDIuNjEyLTExLjQ5NCw4LjM1OXYxNy43NjNIOTAuOTIzDQoJCQkJYy0yMy41MywwLjI1MS00Mi43OCwxOC44MTMtNDMuODg2LDQyLjMxOHYyOTkuMzYzYzAsMjIuOTg4LDIwLjg5OCwzOS43MDYsNDMuODg2LDM5LjcwNmgyNTcuMDQ1DQoJCQkJYzIyLjk4OCwwLDQzLjg4Ni0xNi43MTgsNDMuODg2LTM5LjcwNlY5OS44MjJDMzkwLjc0OCw3Ni4zMTYsMzcxLjQ5OCw1Ny43NTQsMzQ3Ljk2OCw1Ny41MDN6IE0xNTEuNTI3LDUyLjI3OWgyOC43MzUNCgkJCQljNS4wMTYtMC42MTIsOS4wNDUtNC40MjgsOS45MjctOS40MDRjMy4wOTQtMTMuNDc0LDE0LjkxNS0yMy4xNDYsMjguNzM1LTIzLjUxYzEzLjY5MiwwLjQxNSwyNS4zMzUsMTAuMTE3LDI4LjIxMiwyMy41MQ0KCQkJCWMwLjkzNyw1LjE0OCw1LjIzMiw5LjAxMywxMC40NDksOS40MDRoMjkuNzh2NDEuNzk2SDE1MS41MjdWNTIuMjc5eiBNMzcwLjk1NiwzOTkuMTg1YzAsMTEuNDk0LTExLjQ5NCwxOC44MDgtMjIuOTg4LDE4LjgwOA0KCQkJCUg5MC45MjNjLTExLjQ5NCwwLTIyLjk4OC03LjMxNC0yMi45ODgtMTguODA4Vjk5LjgyMmMxLjA2Ni0xMS45NjQsMTAuOTc4LTIxLjIwMSwyMi45ODgtMjEuNDJoMzkuNzA2djI2LjY0NQ0KCQkJCWMwLjU1Miw1Ljg1NCw1LjYyMiwxMC4yMzMsMTEuNDk0LDkuOTI3aDE1NC4xMjJjNS45OCwwLjMyNywxMS4yMDktMy45OTIsMTIuMDE2LTkuOTI3Vjc4LjQwMWgzOS43MDYNCgkJCQljMTIuMDA5LDAuMjIsMjEuOTIyLDkuNDU2LDIyLjk4OCwyMS40MlYzOTkuMTg1eiIvPg0KCQkJPHBhdGggZD0iTTE3OS4yMTcsMjMzLjU2OWMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzY0LTE0LjYyOS0wLjUyMmwtMzMuNDM3LDMxLjg2OWwtMTQuMTA2LTE0LjYyOQ0KCQkJCWMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzYzLTE0LjYyOS0wLjUyMmMtNC4wNDcsNC4yNC00LjA0NywxMC45MTEsMCwxNS4xNTFsMjEuNDIsMjEuOTQzYzEuODU0LDIuMDc2LDQuNTMyLDMuMjI0LDcuMzE0LDMuMTM1DQoJCQkJYzIuNzU2LTAuMDM5LDUuMzg1LTEuMTY2LDcuMzE0LTMuMTM1bDQwLjc1MS0zOC42NjFjNC4wNC0zLjcwNiw0LjMxLTkuOTg2LDAuNjAzLTE0LjAyNQ0KCQkJCUMxNzkuNjI4LDIzMy45NjIsMTc5LjQyNywyMzMuNzYxLDE3OS4yMTcsMjMzLjU2OXoiLz4NCgkJCTxwYXRoIGQ9Ik0zMjkuMTYsMjU2LjAzNEgyMDguOTk3Yy01Ljc3MSwwLTEwLjQ0OSw0LjY3OC0xMC40NDksMTAuNDQ5czQuNjc4LDEwLjQ0OSwxMC40NDksMTAuNDQ5SDMyOS4xNg0KCQkJCWM1Ljc3MSwwLDEwLjQ0OS00LjY3OCwxMC40NDktMTAuNDQ5UzMzNC45MzEsMjU2LjAzNCwzMjkuMTYsMjU2LjAzNHoiLz4NCgkJCTxwYXRoIGQ9Ik0xNzkuMjE3LDE0OS45NzdjLTMuOTE5LTQuMTMxLTEwLjQyNS00LjM2NC0xNC42MjktMC41MjJsLTMzLjQzNywzMS44NjlsLTE0LjEwNi0xNC42MjkNCgkJCQljLTMuOTE5LTQuMTMxLTEwLjQyNS00LjM2NC0xNC42MjktMC41MjJjLTQuMDQ3LDQuMjQtNC4wNDcsMTAuOTExLDAsMTUuMTUxbDIxLjQyLDIxLjk0M2MxLjg1NCwyLjA3Niw0LjUzMiwzLjIyNCw3LjMxNCwzLjEzNQ0KCQkJCWMyLjc1Ni0wLjAzOSw1LjM4NS0xLjE2Niw3LjMxNC0zLjEzNWw0MC43NTEtMzguNjYxYzQuMDQtMy43MDYsNC4zMS05Ljk4NiwwLjYwMy0xNC4wMjUNCgkJCQlDMTc5LjYyOCwxNTAuMzcsMTc5LjQyNywxNTAuMTY5LDE3OS4yMTcsMTQ5Ljk3N3oiLz4NCgkJCTxwYXRoIGQ9Ik0zMjkuMTYsMTcyLjQ0MkgyMDguOTk3Yy01Ljc3MSwwLTEwLjQ0OSw0LjY3OC0xMC40NDksMTAuNDQ5czQuNjc4LDEwLjQ0OSwxMC40NDksMTAuNDQ5SDMyOS4xNg0KCQkJCWM1Ljc3MSwwLDEwLjQ0OS00LjY3OCwxMC40NDktMTAuNDQ5UzMzNC45MzEsMTcyLjQ0MiwzMjkuMTYsMTcyLjQ0MnoiLz4NCgkJCTxwYXRoIGQ9Ik0xNzkuMjE3LDMxNy4xNmMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzYzLTE0LjYyOS0wLjUyMmwtMzMuNDM3LDMxLjg2OWwtMTQuMTA2LTE0LjYyOQ0KCQkJCWMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzYzLTE0LjYyOS0wLjUyMmMtNC4wNDcsNC4yNC00LjA0NywxMC45MTEsMCwxNS4xNTFsMjEuNDIsMjEuOTQzYzEuODU0LDIuMDc2LDQuNTMyLDMuMjI0LDcuMzE0LDMuMTM1DQoJCQkJYzIuNzU2LTAuMDM5LDUuMzg1LTEuMTY2LDcuMzE0LTMuMTM1bDQwLjc1MS0zOC42NjFjNC4wNC0zLjcwNiw0LjMxLTkuOTg2LDAuNjAzLTE0LjAyNQ0KCQkJCUMxNzkuNjI4LDMxNy41NTQsMTc5LjQyNywzMTcuMzUzLDE3OS4yMTcsMzE3LjE2eiIvPg0KCQkJPHBhdGggZD0iTTMyOS4xNiwzMzkuNjI2SDIwOC45OTdjLTUuNzcxLDAtMTAuNDQ5LDQuNjc4LTEwLjQ0OSwxMC40NDlzNC42NzgsMTAuNDQ5LDEwLjQ0OSwxMC40NDlIMzI5LjE2DQoJCQkJYzUuNzcxLDAsMTAuNDQ5LTQuNjc4LDEwLjQ0OS0xMC40NDlTMzM0LjkzMSwzMzkuNjI2LDMyOS4xNiwzMzkuNjI2eiIvPg0KCQk8L2c+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=",
              width: "96",
              height: "96"
            }
          }),
          _vm._v(" "),
          _c("strong", [
            _vm._v(_vm._s(_vm.t("mediadc", "No tasks yet. Create a new one!")))
          ])
        ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksNew.vue?vue&type=template&id=34f9e57a&scoped=true&":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/tasks/TasksNew.vue?vue&type=template&id=34f9e57a&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "new-task-block" }, [
    _c("h2", [_vm._v(_vm._s(_vm.t("mediadc", "Create a new Task")))]),
    _vm._v(" "),
    _c("div", { staticClass: "selection-container" }, [
      _c("div", { staticClass: "block target-directories-block" }, [
        _c("h3", [_vm._v(_vm._s(_vm.t("mediadc", "Target directories")))]),
        _vm._v(" "),
        _vm.targetDirectoriesIds.length > 0
          ? _c(
              "div",
              _vm._l(_vm.targetDirectoriesIds, function(fileid) {
                return _c(
                  "div",
                  {
                    key: fileid,
                    staticClass: "selected-target-directories-list"
                  },
                  [
                    _c("div", { staticClass: "target-directory" }, [
                      _c("span", { staticStyle: { "overflow-y": "scroll" } }, [
                        _vm._v(_vm._s(_vm.targetDirectoriesPaths[fileid]))
                      ]),
                      _vm._v(" "),
                      _c("span", {
                        staticClass: "delete-button icon-delete",
                        on: {
                          click: function($event) {
                            return _vm.removeTargetDirectory(fileid)
                          }
                        }
                      })
                    ])
                  ]
                )
              }),
              0
            )
          : _c("div", [
              _c("span", [_vm._v(_vm._s(_vm.t("mediadc", "Not selected")))])
            ]),
        _vm._v(" "),
        _c("br"),
        _vm._v(" "),
        _c("button", { on: { click: _vm.openDirectoriesExplorer } }, [
          _c("span", { staticClass: "icon-add" }),
          _vm._v("\n\t\t\t\t" + _vm._s(_vm.t("mediadc", "Select")) + "\n\t\t\t")
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "block" }, [
        _c("h3", [_vm._v(_vm._s(_vm.t("mediadc", "Exclude directories")))]),
        _vm._v(" "),
        _vm.excludeDirectoriesPaths.length > 0
          ? _c(
              "div",
              _vm._l(Object.keys(_vm.excludeFileIds), function(fileid) {
                return _c(
                  "div",
                  {
                    key: fileid,
                    staticClass: "selected-excluded-directories-list"
                  },
                  [
                    _c("div", { staticClass: "target-directory" }, [
                      _c("span", { staticStyle: { "overflow-y": "scroll" } }, [
                        _vm._v(_vm._s(_vm.excludeFileIds[fileid]))
                      ]),
                      _vm._v(" "),
                      _c("span", {
                        staticClass: "delete-button icon-delete",
                        on: {
                          click: function($event) {
                            return _vm.removeExcludeDirectory(fileid)
                          }
                        }
                      })
                    ])
                  ]
                )
              }),
              0
            )
          : _c("div", [
              _c("span", [_vm._v(_vm._s(_vm.t("mediadc", "Not selected")))])
            ]),
        _vm._v(" "),
        _c("br"),
        _vm._v(" "),
        _c("button", { on: { click: _vm.openExcludeExplorer } }, [
          _c("span", { staticClass: "icon-add" }),
          _vm._v("\n\t\t\t\t" + _vm._s(_vm.t("mediadc", "Select")) + "\n\t\t\t")
        ])
      ])
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "selection-container" }, [
      _c("div", { staticClass: "block" }, [
        _c("h3", [_vm._v(_vm._s(_vm.t("mediadc", "Custom exclude mask")))]),
        _vm._v(" "),
        _vm.customExcludeList.length > 0
          ? _c(
              "div",
              { staticClass: "custom-masks-list" },
              _vm._l(_vm.customExcludeList, function(mask, index) {
                return _c("div", { key: index, staticClass: "custom-mask" }, [
                  _c("span", [_vm._v(_vm._s(mask))]),
                  _vm._v(" "),
                  _c("span", {
                    staticClass: "icon-delete",
                    staticStyle: { cursor: "pointer" },
                    on: {
                      click: function($event) {
                        return _vm.deleteCustomMask(mask)
                      }
                    }
                  })
                ])
              }),
              0
            )
          : _c("div", [
              _c("span", [_vm._v(_vm._s(_vm.t("mediadc", "Not added")))])
            ]),
        _vm._v(" "),
        _vm.addingCustomMask
          ? _c(
              "div",
              { staticStyle: { display: "flex", "align-items": "center" } },
              [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.customExcludeMask,
                      expression: "customExcludeMask"
                    }
                  ],
                  ref: "customExcludeMask",
                  attrs: { id: "custom-exclude-mask", type: "text" },
                  domProps: { value: _vm.customExcludeMask },
                  on: {
                    keyup: [
                      function($event) {
                        if (
                          !$event.type.indexOf("key") &&
                          _vm._k(
                            $event.keyCode,
                            "enter",
                            13,
                            $event.key,
                            "Enter"
                          )
                        ) {
                          return null
                        }
                        return _vm.addCustomMask.apply(null, arguments)
                      },
                      function($event) {
                        if (
                          !$event.type.indexOf("key") &&
                          _vm._k($event.keyCode, "esc", 27, $event.key, [
                            "Esc",
                            "Escape"
                          ])
                        ) {
                          return null
                        }
                        return _vm.cancelAddingCustomMask.apply(null, arguments)
                      }
                    ],
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.customExcludeMask = $event.target.value
                    }
                  }
                }),
                _vm._v(" "),
                _c("span", {
                  staticClass: "icon-checkmark",
                  staticStyle: {
                    width: "18px",
                    height: "18px",
                    margin: "0 5px",
                    display: "inline-block",
                    cursor: "pointer"
                  },
                  on: { click: _vm.addCustomMask }
                }),
                _vm._v(" "),
                _c("span", {
                  staticClass: "icon-close",
                  staticStyle: {
                    width: "18px",
                    height: "18px",
                    margin: "0 5px",
                    display: "inline-block",
                    cursor: "pointer"
                  },
                  on: { click: _vm.cancelAddingCustomMask }
                })
              ]
            )
          : _vm._e(),
        _vm._v(" "),
        _c(
          "div",
          {
            staticStyle: {
              display: "flex",
              "align-items": "center",
              margin: "20px 0"
            }
          },
          [
            _c("button", { on: { click: _vm.addNewMask } }, [
              _c("span", { staticClass: "icon-add" }),
              _vm._v(" "),
              _c("span", [_vm._v(_vm._s(_vm.t("mediadc", "Add mask")))])
            ])
          ]
        )
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "block" }, [
        _c("h3", { staticStyle: { margin: "5px 0" } }, [
          _vm._v(
            "\n\t\t\t\t" +
              _vm._s(_vm.t("mediadc", "Target Mime Type")) +
              "\n\t\t\t"
          )
        ]),
        _vm._v(" "),
        _c(
          "select",
          {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.targetMimeType,
                expression: "targetMimeType"
              }
            ],
            attrs: { id: "target_mtype", name: "target_mtype" },
            on: {
              change: function($event) {
                var $$selectedVal = Array.prototype.filter
                  .call($event.target.options, function(o) {
                    return o.selected
                  })
                  .map(function(o) {
                    var val = "_value" in o ? o._value : o.value
                    return val
                  })
                _vm.targetMimeType = $event.target.multiple
                  ? $$selectedVal
                  : $$selectedVal[0]
              }
            }
          },
          [
            _c("option", { domProps: { value: 0 } }, [
              _vm._v(
                "\n\t\t\t\t\t" +
                  _vm._s(_vm.t("mediadc", "Photos")) +
                  "\n\t\t\t\t"
              )
            ]),
            _vm._v(" "),
            _c("option", { domProps: { value: 1 } }, [
              _vm._v(
                "\n\t\t\t\t\t" +
                  _vm._s(_vm.t("mediadc", "Videos")) +
                  "\n\t\t\t\t"
              )
            ]),
            _vm._v(" "),
            _c("option", { domProps: { value: 2 } }, [
              _vm._v(
                "\n\t\t\t\t\t" +
                  _vm._s(_vm.t("mediadc", "Photos and Videos")) +
                  "\n\t\t\t\t"
              )
            ])
          ]
        ),
        _vm._v(" "),
        _c("h3", { staticStyle: { margin: "5px 0" } }, [
          _vm._v(
            "\n\t\t\t\t" +
              _vm._s(_vm.t("mediadc", "Similarity threshold")) +
              "\n\t\t\t"
          )
        ]),
        _vm._v(" "),
        _c("input", {
          directives: [
            {
              name: "model",
              rawName: "v-model",
              value: _vm.similarity_threshold,
              expression: "similarity_threshold"
            }
          ],
          staticStyle: { margin: "0 0 10px" },
          attrs: { type: "number", min: "50", max: "100" },
          domProps: { value: _vm.similarity_threshold },
          on: {
            input: function($event) {
              if ($event.target.composing) {
                return
              }
              _vm.similarity_threshold = $event.target.value
            }
          }
        })
      ])
    ]),
    _vm._v(" "),
    !_vm.runningTask
      ? _c(
          "button",
          {
            staticStyle: { margin: "10px 5px 0" },
            attrs: {
              disabled: Object.keys(_vm.targetDirectoriesPaths).length === 0
            },
            on: { click: _vm.runCollectorTask }
          },
          [_vm._v("\n\t\t" + _vm._s(_vm.t("mediadc", "Run new Task")) + "\n\t")]
        )
      : _c("button", { attrs: { disabled: "" } }, [
          _c("span", { staticClass: "icon-loading" })
        ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/views/Collector.vue?vue&type=template&id=25cf8543&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Collector.vue?vue&type=template&id=25cf8543&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************/
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
    ? _c("div", { staticClass: "container" }, [
        _c("div", { staticClass: "heading" }, [
          _c("h1", [_vm._v(_vm._s(_vm.rootTitle))]),
          _vm._v(" "),
          _c("p", [
            _vm._v(
              "\n\t\t\t" +
                _vm._s(
                  _vm.t(
                    "mediadc_collector_welcome",
                    "Welcome to Media Duplicate Collector (MediaDC). " +
                      "Here you can manage your duplicate collection tasks and " +
                      "see the history of previous finished tasks."
                  )
                ) +
                "\n\t\t"
            )
          ])
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "mediadc-row" },
          [_c("TasksNew"), _vm._v(" "), _c("TasksList")],
          1
        )
      ])
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./src/components/tasks/TasksList.vue":
/*!********************************************!*\
  !*** ./src/components/tasks/TasksList.vue ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TasksList_vue_vue_type_template_id_68c8f6ea_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TasksList.vue?vue&type=template&id=68c8f6ea&scoped=true& */ "./src/components/tasks/TasksList.vue?vue&type=template&id=68c8f6ea&scoped=true&");
/* harmony import */ var _TasksList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TasksList.vue?vue&type=script&lang=js& */ "./src/components/tasks/TasksList.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _TasksList_vue_vue_type_style_index_0_id_68c8f6ea_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TasksList.vue?vue&type=style&index=0&id=68c8f6ea&scoped=true&lang=css& */ "./src/components/tasks/TasksList.vue?vue&type=style&index=0&id=68c8f6ea&scoped=true&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _TasksList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TasksList_vue_vue_type_template_id_68c8f6ea_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TasksList_vue_vue_type_template_id_68c8f6ea_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "68c8f6ea",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/tasks/TasksList.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/components/tasks/TasksList.vue?vue&type=script&lang=js&":
/*!*********************************************************************!*\
  !*** ./src/components/tasks/TasksList.vue?vue&type=script&lang=js& ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib!../../../node_modules/vue-loader/lib??vue-loader-options!./TasksList.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksList.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/tasks/TasksList.vue?vue&type=style&index=0&id=68c8f6ea&scoped=true&lang=css&":
/*!*****************************************************************************************************!*\
  !*** ./src/components/tasks/TasksList.vue?vue&type=style&index=0&id=68c8f6ea&scoped=true&lang=css& ***!
  \*****************************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksList_vue_vue_type_style_index_0_id_68c8f6ea_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/vue-loader/lib??vue-loader-options!./TasksList.vue?vue&type=style&index=0&id=68c8f6ea&scoped=true&lang=css& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksList.vue?vue&type=style&index=0&id=68c8f6ea&scoped=true&lang=css&");
/* empty/unused harmony star reexport */

/***/ }),

/***/ "./src/components/tasks/TasksList.vue?vue&type=template&id=68c8f6ea&scoped=true&":
/*!***************************************************************************************!*\
  !*** ./src/components/tasks/TasksList.vue?vue&type=template&id=68c8f6ea&scoped=true& ***!
  \***************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksList_vue_vue_type_template_id_68c8f6ea_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./TasksList.vue?vue&type=template&id=68c8f6ea&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksList.vue?vue&type=template&id=68c8f6ea&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksList_vue_vue_type_template_id_68c8f6ea_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksList_vue_vue_type_template_id_68c8f6ea_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/components/tasks/TasksNew.vue":
/*!*******************************************!*\
  !*** ./src/components/tasks/TasksNew.vue ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TasksNew_vue_vue_type_template_id_34f9e57a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TasksNew.vue?vue&type=template&id=34f9e57a&scoped=true& */ "./src/components/tasks/TasksNew.vue?vue&type=template&id=34f9e57a&scoped=true&");
/* harmony import */ var _TasksNew_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TasksNew.vue?vue&type=script&lang=js& */ "./src/components/tasks/TasksNew.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _TasksNew_vue_vue_type_style_index_0_id_34f9e57a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TasksNew.vue?vue&type=style&index=0&id=34f9e57a&scoped=true&lang=css& */ "./src/components/tasks/TasksNew.vue?vue&type=style&index=0&id=34f9e57a&scoped=true&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _TasksNew_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TasksNew_vue_vue_type_template_id_34f9e57a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TasksNew_vue_vue_type_template_id_34f9e57a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "34f9e57a",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/tasks/TasksNew.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/components/tasks/TasksNew.vue?vue&type=script&lang=js&":
/*!********************************************************************!*\
  !*** ./src/components/tasks/TasksNew.vue?vue&type=script&lang=js& ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksNew_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib!../../../node_modules/vue-loader/lib??vue-loader-options!./TasksNew.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksNew.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksNew_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/tasks/TasksNew.vue?vue&type=style&index=0&id=34f9e57a&scoped=true&lang=css&":
/*!****************************************************************************************************!*\
  !*** ./src/components/tasks/TasksNew.vue?vue&type=style&index=0&id=34f9e57a&scoped=true&lang=css& ***!
  \****************************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksNew_vue_vue_type_style_index_0_id_34f9e57a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/vue-loader/lib??vue-loader-options!./TasksNew.vue?vue&type=style&index=0&id=34f9e57a&scoped=true&lang=css& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksNew.vue?vue&type=style&index=0&id=34f9e57a&scoped=true&lang=css&");
/* empty/unused harmony star reexport */

/***/ }),

/***/ "./src/components/tasks/TasksNew.vue?vue&type=template&id=34f9e57a&scoped=true&":
/*!**************************************************************************************!*\
  !*** ./src/components/tasks/TasksNew.vue?vue&type=template&id=34f9e57a&scoped=true& ***!
  \**************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksNew_vue_vue_type_template_id_34f9e57a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./TasksNew.vue?vue&type=template&id=34f9e57a&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksNew.vue?vue&type=template&id=34f9e57a&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksNew_vue_vue_type_template_id_34f9e57a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksNew_vue_vue_type_template_id_34f9e57a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/mixins/Formats.js":
/*!*******************************!*\
  !*** ./src/mixins/Formats.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_files__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/files */ "./src/utils/files.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);
/**
 * @copyright 2021 Andrey Borysenko <andrey18106x@gmail.com>
 * @copyright 2021 Alexander Piskun <bigcat88@icloud.com>
 *
 * @author Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */


var keepAliveInterval = 8;
var targetMType = [t('mediadc', 'Photos'), t('mediadc', 'Videos'), t('mediadc', 'Photos&Videos')];
/* harmony default export */ __webpack_exports__["default"] = ({
  methods: {
    formatBytes: _utils_files__WEBPACK_IMPORTED_MODULE_0__["formatBytes"],
    parseUnixTimestamp: function parseUnixTimestamp(time) {
      return moment__WEBPACK_IMPORTED_MODULE_1___default.a.unix(Number(time)).format('YYYY-MM-DD HH:mm:ss');
    },
    getStatusBadge: function getStatusBadge(task) {
      if (task === null || task === undefined) {
        return '';
      }

      if (task.errors !== '') {
        return 'error';
      } else {
        if (Number(task.py_pid) === 0 && Number(task.finished_time) === 0 && Number(task.updated_time) > 0 && Number(task.files_scanned) > 0) {
          return 'terminated';
        }

        if (Number(task.py_pid) > 0) {
          if (moment__WEBPACK_IMPORTED_MODULE_1___default()().unix() > Number(task.updated_time) + keepAliveInterval * 3) {
            return 'error';
          } else {
            return 'running';
          }
        }

        if (Number(task.finished_time) > 0 && Number(task.py_pid) === 0) {
          return 'finished';
        }

        return 'pending';
      }
    },
    parseTargetMtype: function parseTargetMtype(task) {
      if (task) {
        try {
          return targetMType[Number(JSON.parse(task.collector_settings).target_mtype)];
        } catch (_unused) {
          return '';
        }
      }

      return '';
    }
  }
});

/***/ }),

/***/ "./src/utils/files.js":
/*!****************************!*\
  !*** ./src/utils/files.js ***!
  \****************************/
/*! exports provided: requestFileInfo, getFileId, getContentType, formatBytes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "requestFileInfo", function() { return requestFileInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFileId", function() { return getFileId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getContentType", function() { return getContentType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatBytes", function() { return formatBytes; });
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.js");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_axios__WEBPACK_IMPORTED_MODULE_2__);
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @copyright 2021 Andrey Borysenko <andrey18106x@gmail.com>
 * @copyright 2021 Alexander Piskun <bigcat88@icloud.com>
 *
 * @author Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */



var davRequest = "<?xml version=\"1.0\"?>\n\t<d:propfind xmlns:d=\"DAV:\" xmlns:oc=\"http://owncloud.org/ns\"\n\t\t\t\txmlns:nc=\"http://nextcloud.org/ns\"\n\t\t\t\txmlns:ocs=\"http://open-collaboration-services.org/ns\">\n\t\t<d:prop>\n\t\t\t<oc:fileid />\n\t\t\t<d:getcontenttype />\n\t\t</d:prop>\n\t</d:propfind>";

var getFileId = function getFileId(xml) {
  if (window.DOMParser) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xml, 'text/xml');
    var fileid = xmlDoc.getElementsByTagName('oc:fileid')[0].innerHTML;
    return fileid;
  } else {
    return -1;
  }
};

var getContentType = function getContentType(xml) {
  if (window.DOMParser) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xml, 'text/xml');
    var contentType = xmlDoc.getElementsByTagName('d:getcontenttype')[0].innerHTML;
    return contentType;
  } else {
    return null;
  }
};

var requestFileInfo = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(path) {
    var davPath;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            davPath = "".concat(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__["generateRemoteUrl"])('dav'), "/files/").concat(Object(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__["getCurrentUser"])().uid).concat(path);
            _context.next = 3;
            return _nextcloud_axios__WEBPACK_IMPORTED_MODULE_2___default()({
              method: 'PROPFIND',
              url: davPath,
              data: davRequest,
              headers: {
                details: true,
                depth: 0
              }
            });

          case 3:
            return _context.abrupt("return", _context.sent);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function requestFileInfo(_x) {
    return _ref.apply(this, arguments);
  };
}();

var formatBytes = function formatBytes(bytes) {
  var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  if (bytes === 0) return '0 B';
  var k = 1024;
  var dm = decimals < 0 ? 0 : decimals;
  var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};



/***/ }),

/***/ "./src/views/Collector.vue":
/*!*********************************!*\
  !*** ./src/views/Collector.vue ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Collector_vue_vue_type_template_id_25cf8543_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Collector.vue?vue&type=template&id=25cf8543&scoped=true& */ "./src/views/Collector.vue?vue&type=template&id=25cf8543&scoped=true&");
/* harmony import */ var _Collector_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Collector.vue?vue&type=script&lang=js& */ "./src/views/Collector.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _Collector_vue_vue_type_style_index_0_id_25cf8543_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Collector.vue?vue&type=style&index=0&id=25cf8543&scoped=true&lang=css& */ "./src/views/Collector.vue?vue&type=style&index=0&id=25cf8543&scoped=true&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Collector_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Collector_vue_vue_type_template_id_25cf8543_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Collector_vue_vue_type_template_id_25cf8543_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "25cf8543",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/Collector.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/views/Collector.vue?vue&type=script&lang=js&":
/*!**********************************************************!*\
  !*** ./src/views/Collector.vue?vue&type=script&lang=js& ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Collector_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib!../../node_modules/vue-loader/lib??vue-loader-options!./Collector.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/views/Collector.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Collector_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/Collector.vue?vue&type=style&index=0&id=25cf8543&scoped=true&lang=css&":
/*!******************************************************************************************!*\
  !*** ./src/views/Collector.vue?vue&type=style&index=0&id=25cf8543&scoped=true&lang=css& ***!
  \******************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Collector_vue_vue_type_style_index_0_id_25cf8543_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/vue-loader/lib??vue-loader-options!./Collector.vue?vue&type=style&index=0&id=25cf8543&scoped=true&lang=css& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/views/Collector.vue?vue&type=style&index=0&id=25cf8543&scoped=true&lang=css&");
/* empty/unused harmony star reexport */

/***/ }),

/***/ "./src/views/Collector.vue?vue&type=template&id=25cf8543&scoped=true&":
/*!****************************************************************************!*\
  !*** ./src/views/Collector.vue?vue&type=template&id=25cf8543&scoped=true& ***!
  \****************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Collector_vue_vue_type_template_id_25cf8543_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./Collector.vue?vue&type=template&id=25cf8543&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/views/Collector.vue?vue&type=template&id=25cf8543&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Collector_vue_vue_type_template_id_25cf8543_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Collector_vue_vue_type_template_id_25cf8543_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=mediadc-2.js.map?v=1328d4e4da9ed229c593