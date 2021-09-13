(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsFile.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/details/DetailsFile.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__);
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



/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'DetailsFile',
  props: {
    file: {
      type: Object,
      required: true
    },
    files: {
      type: Array,
      required: true
    }
  },
  data: function data() {
    return {
      loaded: false
    };
  },
  computed: _objectSpread({
    imageUrl: function imageUrl() {
      return Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__["generateRemoteUrl"])("dav/files".concat(this.file.filepath.replace('files/', '')));
    }
  }, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])(['detailsGridSize'])),
  methods: {
    openFile: function openFile(file) {
      var filesList = this.files.map(function (file) {
        return {
          basename: file.filename,
          fileid: file.fileid,
          filename: file.filepath.replace("/".concat(Object(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__["getCurrentUser"])().uid, "/files"), ''),
          getcontentlength: file.filesize,
          getcontenttype: file.filemtype,
          mime: file.filemtype,
          size: file.filesize
        };
      });
      OCA.Viewer.open({
        path: file.filepath.replace("/".concat(Object(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__["getCurrentUser"])().uid, "/files"), ''),
        list: filesList.map(function (file) {
          return _objectSpread(_objectSpread({}, file), {}, {
            list: filesList
          });
        })
      });
    },
    onLoad: function onLoad() {
      console.debug('[DetailsFile] loaded');
      this.loaded = true;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsGroupList.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/details/DetailsGroupList.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.js");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mixins_Formats__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../mixins/Formats */ "./src/mixins/Formats.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _DetailsFile__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DetailsFile */ "./src/components/details/DetailsFile.vue");
/* harmony import */ var _nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/event-bus */ "./node_modules/@nextcloud/event-bus/dist/index.es.js");
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






/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'DetailsGroupList',
  components: {
    DetailsFile: _DetailsFile__WEBPACK_IMPORTED_MODULE_4__["default"]
  },
  mixins: [_mixins_Formats__WEBPACK_IMPORTED_MODULE_2__["default"]],
  props: {
    files: {
      type: Array,
      required: true
    },
    loadingFiles: {
      type: Boolean,
      required: true
    }
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_3__["mapGetters"])(['detailsGridSize'])),
  methods: {
    deleteGroupFile: function deleteGroupFile(file) {
      var _this = this;

      if (confirm(t('mediadc', 'Are you sure, you want delete this file?'))) {
        _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default.a.delete(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__["generateUrl"])("/apps/mediadc/api/v1/tasks/".concat(file.taskId, "/files/").concat(file.detailId, "/").concat(file.fileid))).then(function (res) {
          var files = _this.files;
          var fileidIndex = files.findIndex(function (f) {
            return f.fileid === file.fileid;
          });
          files.splice(fileidIndex, 1);

          _this.$emit('update:files', files);

          Object(_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_5__["emit"])('updateTaskInfo');

          _this.$store.dispatch('setTask', res.data.task);
        });
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsList.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/details/DetailsList.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.es.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _mixins_Formats__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../mixins/Formats */ "./src/mixins/Formats.js");
/* harmony import */ var _DetailsListItem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DetailsListItem */ "./src/components/details/DetailsListItem.vue");
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




/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'DetailsList',
  components: {
    DetailsListItem: _DetailsListItem__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  mixins: [_mixins_Formats__WEBPACK_IMPORTED_MODULE_2__["default"]],
  props: {
    filessize: {
      type: Number,
      required: true
    },
    filestotal: {
      type: Number,
      required: true
    }
  },
  data: function data() {
    return {
      page: 0
    };
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])(['task', 'details', 'sorted', 'paginatedDetails', 'itemsPerPage'])),
  beforeMount: function beforeMount() {
    this.$emit('update:loading', false);
  },
  methods: {
    prevGroupsPage: function prevGroupsPage() {
      if (this.page > 0) {
        this.page -= 1;
      } else {
        Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_0__["showWarning"])(t('mediadc', 'First page reached!'));
      }
    },
    nextGroupsPage: function nextGroupsPage() {
      if (this.page < Math.ceil(this.details.length / this.itemsPerPage) - 1) {
        this.page += 1;
      } else {
        Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_0__["showWarning"])(t('mediadc', 'Last page reached!'));
      }
    },
    toggleSorting: function toggleSorting() {
      this.$store.dispatch('setSorted', !this.sorted);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsListItem.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/details/DetailsListItem.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.js");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _DetailsGroupList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DetailsGroupList */ "./src/components/details/DetailsGroupList.vue");
/* harmony import */ var _mixins_Formats__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../mixins/Formats */ "./src/mixins/Formats.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.es.js");
/* harmony import */ var _nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nextcloud/event-bus */ "./node_modules/@nextcloud/event-bus/dist/index.es.js");
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







/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'DetailsListItem',
  components: {
    DetailsGroupList: _DetailsGroupList__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  mixins: [_mixins_Formats__WEBPACK_IMPORTED_MODULE_3__["default"]],
  props: {
    detail: {
      type: Object,
      required: true
    }
  },
  data: function data() {
    return {
      opened: false,
      page: 0,
      totalPages: 0,
      itemsPerPage: 10,
      loadingFiles: false,
      files: [],
      paginatedFiles: {}
    };
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_4__["mapGetters"])(['task', 'details'])),
  methods: {
    openDetailFiles: function openDetailFiles(detail) {
      if (!this.opened) {
        if (this.files.length === 0) {
          var taskId = detail.task_id;
          var detailId = detail.id;
          this.loadingFiles = true;
          this.opened = true;

          if (!(this.page in this.paginatedFiles)) {
            this.loadFilesInfo(taskId, detailId);
          } else {
            this.files = this.paginatedFiles[this.page];
            this.loadingFiles = false;
          }
        } else {
          this.opened = true;
        }
      } else {
        this.opened = false;
      }
    },
    openNextDetailFiles: function openNextDetailFiles(detail) {
      if (this.page < Math.ceil(JSON.parse(detail.group_files_ids).length / this.itemsPerPage) - 1) {
        this.page += 1;
        var taskId = detail.task_id;
        var detailId = detail.id;
        this.loadingFiles = true;

        if (!(this.page in this.paginatedFiles)) {
          this.loadFilesInfo(taskId, detailId);
        } else {
          this.files = this.paginatedFiles[this.page];
          this.loadingFiles = false;
        }
      } else {
        Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_5__["showWarning"])(t('mediadc', 'Last page reached!'));
      }
    },
    openPrevDetailFiles: function openPrevDetailFiles(detail) {
      if (this.page > 0) {
        this.page -= 1;
        var taskId = detail.task_id;
        var detailId = detail.id;
        this.loadingFiles = true;

        if (!(this.page in this.paginatedFiles)) {
          this.loadFilesInfo(taskId, detailId);
        } else {
          this.files = this.paginatedFiles[this.page];
          this.loadingFiles = false;
        }
      } else {
        Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_5__["showWarning"])(t('mediadc', 'First page reached!'));
      }
    },
    loadFilesInfo: function loadFilesInfo(taskId, detailId) {
      var _this = this;

      _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__["generateUrl"])("/apps/mediadc/api/v1/tasks/".concat(taskId, "/files/").concat(detailId, "?limit=").concat(this.itemsPerPage, "&page=").concat(this.page))).then(function (res) {
        _this.paginatedFiles[_this.page] = res.data.map(function (file) {
          return _objectSpread(_objectSpread({}, file), {}, {
            taskId: taskId,
            detailId: detailId
          });
        });
        _this.files = _this.paginatedFiles[_this.page];
        _this.loadingFiles = false;
      });
    },
    getGroupFilesSize: function getGroupFilesSize(groupFiles) {
      return groupFiles.reduce(function (sum, file) {
        return sum + file.filesize;
      }, 0);
    },
    deleteTaskDetail: function deleteTaskDetail(detail) {
      var _this2 = this;

      if (confirm(t('mediadc', 'Are you sure, you want remove this group without deleting files?'))) {
        _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default.a.delete(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__["generateUrl"])("/apps/mediadc/api/v1/tasks/".concat(detail.task_id, "/detail/").concat(detail.id))).then(function (res) {
          if (res.data.success) {
            _this2.$store.dispatch('deleteDetail', detail);

            Object(_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_6__["emit"])('updateTaskInfo');
            Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_5__["showSuccess"])(t('mediadc', 'Duplicate group succesffully removed'));
          } else {
            Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_5__["showError"])(t('mediadc', 'Some error occured while deleting duplicate group'));
          }
        });
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksEdit.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/tasks/TasksEdit.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************/
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
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nextcloud/event-bus */ "./node_modules/@nextcloud/event-bus/dist/index.es.js");
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
//
//
//







/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'TasksEdit',
  props: {
    opened: {
      type: Boolean,
      required: true
    }
  },
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
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_4__["mapGetters"])(['settings', 'settingByName', 'tasks', 'task', 'taskInfo'])),
  beforeMount: function beforeMount() {
    this.similarity_threshold = this.settingByName('similarity_threshold') !== undefined ? this.settingByName('similarity_threshold').value : 90;
    this.targetMimeType = JSON.parse(this.task.collector_settings).target_mtype;
    this.similarity_threshold = JSON.parse(this.task.collector_settings).similarity_threshold;
    this.parseTaskSettings();
  },
  methods: {
    parseTaskSettings: function parseTaskSettings() {
      var _this = this;

      if (this.taskInfo !== null && 'target_directories' in this.taskInfo) {
        this.taskInfo.target_directories.forEach(function (dir) {
          _this.targetDirectoriesIds.push(dir.fileid.toString());

          _this.targetDirectoriesPaths[dir.fileid.toString()] = dir.filepath.replace("/".concat(Object(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_5__["getCurrentUser"])().uid, "/files"), '');
        });
      }

      if (this.taskInfo !== null && 'exclude_directories' in this.taskInfo) {
        this.taskInfo.exclude_directories.forEach(function (dir) {
          _this.excludeDirectoriesPaths.push(dir.filepath.replace());

          _this.excludeFileIds[dir.fileid.toString()] = dir.filepath.replace("/".concat(Object(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_5__["getCurrentUser"])().uid, "/files"), '');
        });
        this.customExcludeList = JSON.parse(this.task.exclude_list).user.mask;
      }
    },
    getDirectoriesPicker: function getDirectoriesPicker(title) {
      return Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__["getFilePickerBuilder"])(title).setMultiSelect(false).addMimeTypeFilter('httpd/unix-directory').setModal(true).setType(1).allowDirectories(true).build();
    },
    getFilesPicker: function getFilesPicker(title) {
      return Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__["getFilePickerBuilder"])(title).setMultiSelect(false).setModal(true).setType(1).allowDirectories(true).build();
    },
    openDirectoriesExplorer: function openDirectoriesExplorer() {
      var _this2 = this;

      this.getDirectoriesPicker(t('mediadc', 'Choose target directory')).pick().then(function (dir) {
        if (dir.startsWith('/')) {
          Object(_utils_files__WEBPACK_IMPORTED_MODULE_3__["requestFileInfo"])(dir).then(function (res) {
            var fileid = Object(_utils_files__WEBPACK_IMPORTED_MODULE_3__["getFileId"])(res.data);

            if (fileid !== -1) {
              if (!(fileid in _this2.targetDirectoriesPaths)) {
                _this2.targetDirectoriesIds.push(fileid);

                _this2.targetDirectoriesPaths[fileid.toString()] = dir;
              } else {
                Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__["showWarning"])(t('mediadc', 'This directory already selected'));
              }
            }
          });
        } else {
          Object(_utils_files__WEBPACK_IMPORTED_MODULE_3__["requestFileInfo"])('/').then(function (res) {
            var fileid = Object(_utils_files__WEBPACK_IMPORTED_MODULE_3__["getFileId"])(res.data);

            if (fileid !== -1) {
              if (!(fileid in _this2.targetDirectoriesPaths)) {
                _this2.targetDirectoriesIds.push(fileid);

                _this2.targetDirectoriesPaths[fileid.toString()] = '/';
              } else {
                Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__["showWarning"])(t('mediadc', 'This directory already selected'));
              }
            }
          });

          _this2.targetDirectoriesPaths.push('/');
        }
      });
    },
    openExcludeExplorer: function openExcludeExplorer() {
      var _this3 = this;

      this.getDirectoriesPicker(t('mediadc', 'Choose directory to exclude')).pick().then(function (dir) {
        if (Object.values(_this3.excludeFileIds).findIndex(function (targetDir) {
          return targetDir === dir;
        }) === -1) {
          if (dir.startsWith('/')) {
            Object(_utils_files__WEBPACK_IMPORTED_MODULE_3__["requestFileInfo"])(dir).then(function (res) {
              var fileid = Object(_utils_files__WEBPACK_IMPORTED_MODULE_3__["getFileId"])(res.data);

              if (fileid !== -1) {
                _this3.excludeDirectoriesPaths.push(dir);

                _this3.excludeFileIds[fileid.toString()] = dir;
              }
            });
          } else {
            Object(_utils_files__WEBPACK_IMPORTED_MODULE_3__["requestFileInfo"])('/').then(function (res) {
              var fileid = Object(_utils_files__WEBPACK_IMPORTED_MODULE_3__["getFileId"])(res.data);

              if (fileid !== -1) {
                _this3.excludeDirectoriesPaths.push(dir);

                _this3.excludeFileIds[fileid.toString()] = '/';
              }
            });
          }
        } else {
          Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__["showWarning"])(t('mediadc', 'This directory already excluded'));
        }
      });
    },
    restartTask: function restartTask() {
      var _this4 = this;

      this.runningTask = true;
      this.getSettings().then(function (res) {
        _this4.$store.dispatch('setSettings', res.data);

        _nextcloud_axios__WEBPACK_IMPORTED_MODULE_2___default.a.post(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__["generateUrl"])('/apps/mediadc/api/v1/tasks/restart'), {
          taskId: _this4.task.id,
          targetDirectoryIds: JSON.stringify(_this4.targetDirectoriesIds),
          excludeList: {
            user: {
              mask: _this4.customExcludeList,
              fileid: Object.keys(_this4.excludeFileIds).map(function (item) {
                return Number(item);
              })
            },
            admin: JSON.parse(_this4.settingByName('exclude_list').value) || {
              mask: [],
              fileid: []
            }
          },
          collectorSettings: {
            hashing_algorithm: JSON.parse(_this4.settingByName('hashing_algorithm').value) || 'dhash',
            similarity_threshold: Number(_this4.similarity_threshold),
            hash_size: Number(_this4.settingByName('hash_size').value) || 64,
            target_mtype: _this4.targetMimeType
          }
        }).then(function (res) {
          _this4.runningTask = false;

          if (res.data.success) {
            _this4.runningTask = false;

            _this4.closeEditTaskDialog();

            Object(_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_6__["emit"])('restartTask');
            Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__["showSuccess"])(t('mediadc', 'Task successfully restarted!'));
          } else {
            Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__["showWarning"])('Some error occured while running Collector Task. Try again.');
          }
        });
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
      var _this5 = this;

      if (fileid in this.excludeFileIds) {
        var dirIndex = this.excludeDirectoriesPaths.findIndex(function (dir) {
          return dir === _this5.excludeFileIds[fileid];
        });
        this.excludeDirectoriesPaths.splice(dirIndex, 1);
        delete this.excludeFileIds[fileid];
      }
    },
    removeExcludeFileid: function removeExcludeFileid(fileid) {
      delete this.excludeFileIds[fileid];
    },
    addNewMask: function addNewMask() {
      var _this6 = this;

      this.addingCustomMask = true;
      setTimeout(function () {
        _this6.$refs.customExcludeMask.focus();
      }, 100);
    },
    addCustomMask: function addCustomMask() {
      var _this7 = this;

      if (this.customExcludeMask.length > 0) {
        if (this.customExcludeList.findIndex(function (mask) {
          return mask === _this7.customExcludeMask;
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
      var _this8 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _nextcloud_axios__WEBPACK_IMPORTED_MODULE_2___default.a.get(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__["generateUrl"])('/apps/mediadc/api/v1/tasks')).then(function (res) {
                  _this8.$store.dispatch('setTasks', res.data);

                  _this8.$emit('update:loading', false);
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
      this.excludeDirectoriesNames = [];
      this.excludeFileIds = {};
      this.targetMimeType = 0;
      this.similarity_threshold = this.settingByName('similarity_threshold') !== undefined ? this.settingByName('similarity_threshold').value : 90;
      this.customExcludeList = [];
      this.runningTask = false;
    },
    closeEditTaskDialog: function closeEditTaskDialog() {
      this.$emit('update:opened', false);
    },
    getSettings: function getSettings() {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", _nextcloud_axios__WEBPACK_IMPORTED_MODULE_2___default.a.get(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__["generateUrl"])('/apps/mediadc/api/v1/settings')));

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

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/views/CollectorDetails.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/views/CollectorDetails.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.js");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _mixins_Formats__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../mixins/Formats */ "./src/mixins/Formats.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_router__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_details_DetailsList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/details/DetailsList */ "./src/components/details/DetailsList.vue");
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.es.js");
/* harmony import */ var _mixins_Configure__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../mixins/Configure */ "./src/mixins/Configure.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @nextcloud/event-bus */ "./node_modules/@nextcloud/event-bus/dist/index.es.js");
/* harmony import */ var _components_tasks_TasksEdit__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../components/tasks/TasksEdit */ "./src/components/tasks/TasksEdit.vue");
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










/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'CollectorDetails',
  components: {
    DetailsList: _components_details_DetailsList__WEBPACK_IMPORTED_MODULE_4__["default"],
    TasksEdit: _components_tasks_TasksEdit__WEBPACK_IMPORTED_MODULE_9__["default"]
  },
  mixins: [_mixins_Formats__WEBPACK_IMPORTED_MODULE_2__["default"], _mixins_Configure__WEBPACK_IMPORTED_MODULE_6__["default"]],
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
      updater: null,
      statsUpdater: null,
      filessize: 0,
      filestotal: 0,
      actionsOpened: false,
      collapsedStatus: false,
      editingTask: false
    };
  },
  computed: _objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])(['task', 'taskInfo', 'details', 'settingByName'])), {}, {
    isValidUser: function isValidUser() {
      return Object(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_7__["getCurrentUser"])().uid === this.task.owner;
    }
  }),
  beforeMount: function beforeMount() {
    var _this = this;

    this.$emit('update:loading', true);
    this.getTaskDetails();
    this.getTaskInfo();
    Object(_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_8__["subscribe"])('restartTask', function () {
      _this.getTaskInfo();

      _this.getTaskDetails();

      _this.filessize = 0;
      _this.filestotal = 0;
    });
    Object(_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_8__["subscribe"])('updateTaskInfo', this.getDetailFilesTotalSize);
    this.updater = setInterval(this.getTaskDetails, 5000);
  },
  beforeDestroy: function beforeDestroy() {
    clearInterval(this.updater);
    Object(_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_8__["unsubscribe"])('updateTaskInfo', this.getTaskInfo);
    Object(_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_8__["unsubscribe"])('restartTask');
  },
  methods: {
    terminateTask: function terminateTask(task) {
      var _this2 = this;

      this.toggleActionsPopup();

      if (this.isValidUser) {
        this.terminating = true;
        _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default.a.post(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_3__["generateUrl"])("/apps/mediadc/api/v1/tasks/".concat(task.id, "/terminate"))).then(function (res) {
          Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_5__["showSuccess"])(t('mediadc', 'Task terminated'));
          _this2.terminating = false;

          _this2.getTaskDetails();
        });
      } else {
        Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_5__["showWarning"])(t('mediadc', 'You are not allowed to terminate this task'));
      }
    },
    restartTask: function restartTask(task) {
      var _this3 = this;

      this.toggleActionsPopup();

      if (this.isValidUser) {
        this.restarting = true;
        this.getSettings().then(function () {
          _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default.a.post(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_3__["generateUrl"])('/apps/mediadc/api/v1/tasks/restart'), {
            taskId: task.id,
            targetDirectoryIds: task.target_directory_ids,
            excludeList: {
              user: JSON.parse(task.exclude_list).user,
              admin: JSON.parse(_this3.settingByName('exclude_list').value)
            },
            collectorSettings: {
              hashing_algorithm: JSON.parse(_this3.settingByName('hashing_algorithm').value) || 'dhash',
              similarity_threshold: Number(JSON.parse(_this3.task.collector_settings).similarity_threshold),
              hash_size: Number(_this3.settingByName('hash_size').value) || 64,
              target_mtype: Number(JSON.parse(_this3.task.collector_settings).target_mtype)
            }
          }).then(function (res) {
            _this3.restarting = false;

            if (res.data.success) {
              Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_5__["showSuccess"])(t('mediadc', 'Task successfully restarted with previous settings!'));

              _this3.getTaskDetails();

              _this3.filessize = 0;
              _this3.filestotal = 0;
            } else {
              Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_5__["showError"])('Some error occured while restarting Collector Task. Try again.');
            }
          }).catch(function (err) {
            _this3.restarting = false;
            console.debug(err);
            Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_5__["showError"])('Some error occured while running Collector Task. Try again.');
          });
        });
      } else {
        Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_5__["showWarning"])(t('mediadc', 'You are not allowed to restart this task'));
      }
    },
    deleteTask: function deleteTask(task) {
      var _this4 = this;

      this.toggleActionsPopup();

      if (this.isValidUser) {
        if (confirm(t('mediadc', 'Are sure, you want delete this task?'))) {
          this.deleting = true;
          _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default.a.delete(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_3__["generateUrl"])("/apps/mediadc/api/v1/tasks/".concat(task.id))).then(function (res) {
            _this4.$router.push({
              name: 'collector'
            });

            Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_5__["showSuccess"])(t('mediadc', 'Task successfully deleted'));
            _this4.deleting = false;
          });
        }
      } else {
        Object(_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_5__["showWarning"])(t('mediadc', 'You are not allowed to delete this task'));
      }
    },
    getTaskDetails: function getTaskDetails() {
      var _this5 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_3__["generateUrl"])("/apps/mediadc/api/v1/tasks/".concat(_this5.$route.params.taskId))).then(function (res) {
                  if ('success' in res.data && res.data.success) {
                    _this5.$store.dispatch('setTask', res.data.collectorTask);

                    _this5.$store.dispatch('setDetails', res.data.collectorTaskDetails);

                    if (_this5.getStatusBadge(_this5.task) === 'finished' && _this5.filestotal === 0 && _this5.filessize === 0) {
                      _this5.getDetailFilesTotalSize();
                    }
                  }

                  _this5.$emit('update:loading', false);
                });

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    getTaskInfo: function getTaskInfo() {
      var _this6 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_3__["generateUrl"])("/apps/mediadc/api/v1/tasks/".concat(_this6.$route.params.taskId, "/info"))).then(function (res) {
                  _this6.$store.dispatch('setTaskInfo', res.data.collectorTaskInfo);
                });

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    getDetailFilesTotalSize: function getDetailFilesTotalSize() {
      var _this7 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_3__["generateUrl"])("/apps/mediadc/api/v1/tasks/".concat(_this7.$route.params.taskId, "/filestotal"))).then(function (res) {
                  _this7.filessize = res.data.filessize;
                  _this7.filestotal = res.data.filestotal;
                });

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    openActionsPopup: function openActionsPopup() {
      document.addEventListener('click', this.toggleActionsPopup);
    },
    toggleActionsPopup: function toggleActionsPopup() {
      if (this.actionsOpened) {
        document.removeEventListener('click', this.toggleActionsPopup);
      }

      this.actionsOpened = !this.actionsOpened;
    },
    collapseTaskStatus: function collapseTaskStatus() {
      this.collapsedStatus = !this.collapsedStatus;
    },
    openEditTaskDialog: function openEditTaskDialog() {
      this.editingTask = true;
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsFile.vue?vue&type=style&index=0&id=4ecdec11&scoped=true&lang=css&":
/*!**********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/components/details/DetailsFile.vue?vue&type=style&index=0&id=4ecdec11&scoped=true&lang=css& ***!
  \**********************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.file-thumb[data-v-4ecdec11] {\n\tdisplay: flex;\n\tborder-top-left-radius: 5px;\n\tborder-top-right-radius: 5px;\n}\nimg[data-v-4ecdec11] {\n\twidth: 100%;\n\theight: auto;\n\tborder-top-left-radius: 5px;\n\tborder-top-right-radius: 5px;\n\tcursor: pointer;\n}\n.placeholder[data-v-4ecdec11] {\n\twidth: 100%;\n\theight: 100%;\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\tcursor: pointer;\n\tborder-top-left-radius: 5px;\n\tborder-top-right-radius: 5px;\n}\nbody.theme--dark .placeholder[data-v-4ecdec11] {\n\tbackground-color: #fff;\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsGroupList.vue?vue&type=style&index=0&id=7156b810&scoped=true&lang=css&":
/*!***************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/components/details/DetailsGroupList.vue?vue&type=style&index=0&id=7156b810&scoped=true&lang=css& ***!
  \***************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.details-group[data-v-7156b810] {\n\tborder-top: 1px solid #dadada;\n\tborder-bottom: 1px solid #dadada;\n\tmargin: 10px 0;\n}\nbody.theme--dark .details-group[data-v-7156b810] {\n\tborder-color: #717171;\n}\n.details-group-files[data-v-7156b810] {\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\tjustify-content: center;\n\tmax-height: 90vh;\n\toverflow-y: scroll;\n}\n.file[data-v-7156b810] {\n\tdisplay: flex;\n\theight: 100%;\n\tflex-direction: column;\n\tjustify-content: space-between;\n\twidth: 192px;\n\tborder-radius: 5px;\n\tborder: 1px solid #dadada;\n\ttransition: box-shadow .3s;\n\tmargin: 10px;\n}\nbody.theme--dark .file[data-v-7156b810] {\n\tborder-color: #717171;\n}\n@media (max-width: 540px) {\n.file[data-v-7156b810] {\n\t\tmax-width: 192px;\n}\n.pagination[data-v-7156b810] {\n\t\ttext-align: center;\n}\n}\n.file[data-v-7156b810]:hover {\n\tbox-shadow: 0 0 10px 0 rgba(0, 0, 0, .25);\n}\n.file-info[data-v-7156b810] {\n\twidth: 100%;\n\tpadding: 5px 10px;\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tbackground-color: #000;\n\ttext-align: center;\n\tborder-bottom-left-radius: 5px;\n\tborder-bottom-right-radius: 5px;\n\tcolor: #fff;\n}\n.filename[data-v-7156b810] {\n\twidth: 100%;\n\toverflow-x: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n}\n.delete-file-btn[data-v-7156b810] {\n\tpadding: 20px;\n\tborder-radius: 50%;\n\twidth: 16px;\n\theight: 16px;\n\tcursor: pointer;\n\tbackground-image: var(--icon-delete-fff);\n}\n.delete-file-btn[data-v-7156b810]:hover {\n\tbackground-color: #eee;\n}\n.delete-file-btn[data-v-7156b810]:active {\n\tbackground-color: #ddd;\n}\nbody.theme--dark .delete-file-btn[data-v-7156b810] {\n\tbackground-image: var(--icon-delete-000);\n}\n.delete-file-btn[data-v-7156b810]:hover, body.theme--dark .delete-file-btn[data-v-7156b810]:hover {\n\tbackground-image: var(--icon-delete-e9322d);\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsList.vue?vue&type=style&index=0&id=6a4b739a&scoped=true&lang=css&":
/*!**********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/components/details/DetailsList.vue?vue&type=style&index=0&id=6a4b739a&scoped=true&lang=css& ***!
  \**********************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.task-details[data-v-6a4b739a] {\n\twidth: 100%;\n\tpadding: 10px 20px 20px;\n\tborder: 1px solid #dadada;\n\tborder-radius: 5px;\n\tmax-height: 100vh;\n\toverflow-y: scroll;\n\tmargin: 0 auto;\n}\n.task-details-heading[data-v-6a4b739a] {\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: space-between;\n}\n@media (max-width: 540px) {\n.task-details-heading[data-v-6a4b739a] {\n\t\tflex-direction: column;\n\t\ttext-align: center;\n}\n}\n.pagination[data-v-6a4b739a] {\n\tdisplay: flex;\n\talign-items: center;\n\tmargin: 10px 0;\n}\n.pagination-button[data-v-6a4b739a] {\n\tpadding: 20px;\n\tmargin: 0 5px;\n\twidth: 16px;\n\theight: 16px;\n\tcursor: pointer;\n\tborder-radius: 50%;\n\tuser-select: none;\n}\n.sorting[data-v-6a4b739a] {\n\tdisplay: flex;\n}\n.toggle-sorting-button[data-v-6a4b739a] {\n\tpadding: 20px;\n\tborder-radius: 50%;\n\tuser-select: none;\n\tcursor: pointer;\n}\n.pagination-button[data-v-6a4b739a]:hover, .toggle-sorting-button[data-v-6a4b739a]:hover {\n\tbackground-color: #eee;\n}\n.pagination-button[data-v-6a4b739a]:active, .toggle-sorting-button[data-v-6a4b739a]:active {\n\tbackground-color: #ddd;\n}\nbody.theme--dark .pagination-button[data-v-6a4b739a]:hover, body.theme--dark .toggle-sorting-button[data-v-6a4b739a]:hover {\n\tbackground-color: #727272;\n}\nbody.theme--dark .pagination-button[data-v-6a4b739a]:active, body.theme--dark .toggle-sorting-button[data-v-6a4b739a]:active {\n\tbackground-color: #5b5b5b;\n}\nbody.theme--dark .task-details[data-v-6a4b739a] {\n\tborder-color: #717171;\n}\n.task-details-row[data-v-6a4b739a] {\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: space-between;\n\tborder: 1px solid #dedede;\n\tborder-radius: 5px;\n\tmargin-bottom: 5px;\n\ttransition: height .3s;\n}\nbody.theme--dark .task-details-row[data-v-6a4b739a] {\n\tborder-color: #717171;\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsListItem.vue?vue&type=style&index=0&id=1b431e66&scoped=true&lang=css&":
/*!**************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/components/details/DetailsListItem.vue?vue&type=style&index=0&id=1b431e66&scoped=true&lang=css& ***!
  \**************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.details-list-item[data-v-1b431e66] {\n\twidth: 100%;\n\tpadding: 10px;\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: space-between;\n\tflex-direction: column;\n}\n.details-list-item-title[data-v-1b431e66] {\n\tdisplay: flex;\n\talign-items: center;\n}\n.details-list-item-title .group-info[data-v-1b431e66] {\n\tcursor: pointer;\n}\n.details-list-item-title .group-info[data-v-1b431e66]:hover {\n\ttext-decoration: underline;\n}\n.pagination[data-v-1b431e66] {\n\tdisplay: flex;\n\talign-items: center;\n\tmargin: 10px 0;\n}\n.pagination-button[data-v-1b431e66] {\n\tpadding: 20px;\n\tmargin: 0 5px;\n\twidth: 16px;\n\theight: 16px;\n\tcursor: pointer;\n\tborder-radius: 50%;\n\tuser-select: none;\n}\n.pagination-button[data-v-1b431e66]:hover {\n\tbackground-color: #eee;\n}\n.pagination-button[data-v-1b431e66]:active {\n\tbackground-color: #ddd;\n}\nbody.theme--dark .pagination-button[data-v-1b431e66]:hover {\n\tbackground-color: #727272;\n}\nbody.theme--dark .pagination-button[data-v-1b431e66]:active {\n\tbackground-color: #5b5b5b;\n}\n.open-details-btn[data-v-1b431e66] {\n\tdisplay: inline-flex;\n\twidth: 16px;\n\theight: 16px;\n\tmargin: 0 10px;\n}\n.delete-group-btn[data-v-1b431e66] {\n\tvisibility: hidden;\n\tcursor: pointer;\n\tmargin: 0 10px;\n}\n@media (max-width: 540px) {\n.delete-group-btn[data-v-1b431e66] {\n\t\tvisibility: visible;\n}\n}\n.details-list-item:hover .delete-group-btn[data-v-1b431e66] {\n\tvisibility: visible;\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksEdit.vue?vue&type=style&index=0&id=4a38a812&scoped=true&lang=css&":
/*!******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/components/tasks/TasksEdit.vue?vue&type=style&index=0&id=4a38a812&scoped=true&lang=css& ***!
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
___CSS_LOADER_EXPORT___.push([module.i, "\n.blackout[data-v-4a38a812] {\n\tposition: fixed;\n\ttop: 0;\n\tleft: 0;\n\tright: 0;\n\tbottom: 0;\n\tbackground-color: rgba(0, 0, 0, 0.3);\n\tz-index: 999;\n}\n.edit-task-block[data-v-4a38a812] {\n\tborder: 1px solid #dadada;\n\tborder-radius: 5px;\n\tbox-shadow: 0 0 4px 0 rgba(0, 0, 0, .05);\n\tpadding: 20px;\n\twidth: 100%;\n\tmax-width: 600px;\n\tposition: absolute;\n\tbackground-color: #fff;\n\ttop: 50%;\n\tleft: 50%;\n\ttransform: translate(-50%, -50%);\n}\n.selection-container[data-v-4a38a812] {\n\twidth: 100%;\n\tdisplay: flex;\n}\n@media (max-width: 767px) {\n.selection-container[data-v-4a38a812] {\n\t\tflex-wrap: wrap;\n}\n}\n@media (max-width: 540px) {\n.edit-task-block[data-v-4a38a812] {\n\t\twidth: 90vw;\n\t\theight: 80vh;\n\t\toverflow-y: scroll;\n\t\ttop: calc(50% + calc(100% - 96vh));\n}\n}\n.block[data-v-4a38a812] {\n\twidth: 100%;\n\theight: 100%;\n\tmax-height: 200px;\n\toverflow-y: scroll;\n\tpadding: 10px 15px;\n\tmargin: 5px 10px;\n\tborder: 1px solid #dadada;\n\tborder-radius: 5px;\n}\n.block[data-v-4a38a812]:hover {\n\tbox-shadow: 0 0 10px 0 rgba(0, 0, 0, .05)\n}\n.target-directory[data-v-4a38a812], .custom-mask[data-v-4a38a812] {\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: space-between;\n\tpadding: 5px 0;\n\tborder-bottom: 1px solid #dadada;\n}\n.delete-button[data-v-4a38a812] {\n\tdisplay: inline-flex;\n\twidth: 15px;\n\theight: 15px;\n\tcursor: pointer;\n\tmargin: 0 10px;\n}\n.close-edit-button[data-v-4a38a812] {\n\tposition: absolute;\n\ttop: 15px;\n\tright: 15px;\n\tpadding: 20px;\n\tborder-radius: 50%;\n\tcursor: pointer;\n\topacity: 0.5;\n}\n.close-edit-button[data-v-4a38a812]:hover, .close-edit-button[data-v-4a38a812]:active {\n\topacity: 1;\n}\nbody.theme--dark .actions-menu-button[data-v-4a38a812]:hover {\n\tbackground-color: #727272;\n}\nbody.theme--dark .close-edit-button[data-v-4a38a812]:active {\n\tbackground-color: #5b5b5b;\n}\nbody.theme--dark .edit-task-block[data-v-4a38a812], body.theme--dark .block[data-v-4a38a812] {\n\tborder-color: #717171;\n}\nbody.theme--dark .edit-task-block[data-v-4a38a812] {\n\tbackground-color: #111;\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/views/CollectorDetails.vue?vue&type=style&index=0&id=7fb242af&scoped=true&lang=css&":
/*!**************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/views/CollectorDetails.vue?vue&type=style&index=0&id=7fb242af&scoped=true&lang=css& ***!
  \**************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.container[data-v-7fb242af] {\n\tpadding: 0 20px;\n\twidth: 100%;\n\tmax-width: 1440px;\n\tmargin: 0 auto;\n\tmax-height: 100%;\n}\n@media (min-width: 1920px) {\n.container[data-v-7fb242af] {\n\t\tmax-width: 80vw;\n}\n}\nh2[data-v-7fb242af] {\n\tdisplay: inline-flex;\n\talign-items: center;\n\tjustify-content: center;\n\twidth: 100%;\n\tmargin: 20px auto;\n\ttext-align: center;\n}\n.collapse-task-status-btn[data-v-7fb242af] {\n\tdisplay: inline-flex;\n\tcursor: pointer;\n\twidth: 16px;\n\theight: 16px;\n\tmargin: 0 10px;\n\tpadding: 20px;\n\tborder-radius: 50%;\n\tuser-select: none;\n}\n.task-details-heading p[data-v-7fb242af] {\n\ttext-align: center;\n}\n.details-row[data-v-7fb242af] {\n\tdisplay: flex;\n\tmargin: 0 10px 20px;\n}\n@media (max-width: 767px) {\n.details-row[data-v-7fb242af] {\n\t\tflex-wrap: wrap;\n}\n.task-details-heading[data-v-7fb242af] {\n\t\tflex-direction: column;\n}\n}\n.task-status-row[data-v-7fb242af] {\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\tflex-wrap: wrap;\n}\n.task-status[data-v-7fb242af] {\n\tdisplay: inline-flex;\n\talign-items: center;\n\tborder: 1px solid #dadada;\n\tborder-radius: 5px;\n\tmargin: 20px;\n\tpadding: 10px;\n}\n.actions-menu-button[data-v-7fb242af] {\n\tpadding: 20px;\n\tborder-radius: 50%;\n\tcursor: pointer;\n\tuser-select: none;\n}\n.actions-menu-button[data-v-7fb242af]:hover, .collapse-task-status-btn[data-v-7fb242af]:hover {\n\tbackground-color: #eee;\n}\n.actions-menu-button[data-v-7fb242af]:active, .collapse-task-status-btn[data-v-7fb242af]:active {\n\tbackground-color: #ddd;\n}\nbody.theme--dark .actions-menu-button[data-v-7fb242af]:hover, body.theme--dark .collapse-task-status-btn[data-v-7fb242af]:hover {\n\tbackground-color: #727272;\n}\nbody.theme--dark .actions-menu-button[data-v-7fb242af]:active, body.theme--dark .collapse-task-status-btn[data-v-7fb242af]:active {\n\tbackground-color: #5b5b5b;\n}\nbody.theme--dark .task-status[data-v-7fb242af], body.theme--dark .task-info[data-v-7fb242af] {\n\tborder-color: #717171;\n}\n.task-info[data-v-7fb242af] {\n\tmargin: 20px 0;\n\tborder: 1px solid #dadada;\n\tborder-radius: 5px;\n\tpadding: 10px 20px;\n\theight: 100%;\n\tmax-height: 94px;\n\tmax-width: 50%;\n\toverflow-y: scroll;\n}\n@media (max-width: 767px) {\n.details-row[data-v-7fb242af] {\n\t\tmargin: 0 0 20px;\n}\n.task-status[data-v-7fb242af] {\n\t\tflex-direction: column;\n\t\tmargin: 0 0 20px;\n\t\twidth: 100%;\n}\n.task-info[data-v-7fb242af] {\n\t\tmax-width: 100%;\n\t\tmargin: 0;\n}\n}\n.task-info h3[data-v-7fb242af] {\n\tmargin: 0 0 5px 0;\n}\n.target-directory-row[data-v-7fb242af] {\n\toverflow-x: scroll;\n\twhite-space: nowrap;\n}\n.badge[data-v-7fb242af] {\n\tdisplay: inline-flex;\n\tpadding: 0 10px;\n\tbackground-color: #eee;\n\tborder-radius: 20px;\n\tmargin-right: 20px;\n}\n@media (max-width: 540px) {\n.task-status-row[data-v-7fb242af] {\n\t\tflex-direction: column;\n\t\tmargin: 20px 0;\n}\n.badge[data-v-7fb242af] {\n\t\tmargin-right: 0;\n\t\tmargin-top: 10px;\n\t\tmargin-bottom: 10px;\n}\n}\n.badge.finished[data-v-7fb242af] {\n\tbackground-color: #49b382;\n\tcolor: #fff;\n}\n.badge.running[data-v-7fb242af], .badge.pending[data-v-7fb242af] {\n\tbackground-color: #dadada;\n\tcolor: #000;\n}\n.badge.error[data-v-7fb242af] {\n\tbackground-color: #bd3f3f;\n\tcolor: #fff;\n}\n.badge.terminated[data-v-7fb242af] {\n\tbackground-color: #f17b1b;\n\tcolor: #fff;\n}\n.errors[data-v-7fb242af] {\n\tmargin: 20px;\n\tborder: 1px solid #bd3f3f;\n\tborder-radius: 5px;\n\tpadding: 10px;\n\tmax-height: 100vh;\n\toverflow-y: scroll;\n}\n.error-row[data-v-7fb242af] {\n\tborder-bottom: 1px solid #bd3f3f;\n\tpadding: 5px 0;\n\tmax-height: 100%;\n\toverflow-y: scroll;\n}\n", ""]);
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

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsFile.vue?vue&type=style&index=0&id=4ecdec11&scoped=true&lang=css&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/components/details/DetailsFile.vue?vue&type=style&index=0&id=4ecdec11&scoped=true&lang=css& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsFile_vue_vue_type_style_index_0_id_4ecdec11_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/vue-loader/lib??vue-loader-options!./DetailsFile.vue?vue&type=style&index=0&id=4ecdec11&scoped=true&lang=css& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsFile.vue?vue&type=style&index=0&id=4ecdec11&scoped=true&lang=css&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsFile_vue_vue_type_style_index_0_id_4ecdec11_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsFile_vue_vue_type_style_index_0_id_4ecdec11_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsGroupList.vue?vue&type=style&index=0&id=7156b810&scoped=true&lang=css&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/components/details/DetailsGroupList.vue?vue&type=style&index=0&id=7156b810&scoped=true&lang=css& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsGroupList_vue_vue_type_style_index_0_id_7156b810_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/vue-loader/lib??vue-loader-options!./DetailsGroupList.vue?vue&type=style&index=0&id=7156b810&scoped=true&lang=css& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsGroupList.vue?vue&type=style&index=0&id=7156b810&scoped=true&lang=css&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsGroupList_vue_vue_type_style_index_0_id_7156b810_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsGroupList_vue_vue_type_style_index_0_id_7156b810_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsList.vue?vue&type=style&index=0&id=6a4b739a&scoped=true&lang=css&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/components/details/DetailsList.vue?vue&type=style&index=0&id=6a4b739a&scoped=true&lang=css& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsList_vue_vue_type_style_index_0_id_6a4b739a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/vue-loader/lib??vue-loader-options!./DetailsList.vue?vue&type=style&index=0&id=6a4b739a&scoped=true&lang=css& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsList.vue?vue&type=style&index=0&id=6a4b739a&scoped=true&lang=css&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsList_vue_vue_type_style_index_0_id_6a4b739a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsList_vue_vue_type_style_index_0_id_6a4b739a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsListItem.vue?vue&type=style&index=0&id=1b431e66&scoped=true&lang=css&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/components/details/DetailsListItem.vue?vue&type=style&index=0&id=1b431e66&scoped=true&lang=css& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsListItem_vue_vue_type_style_index_0_id_1b431e66_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/vue-loader/lib??vue-loader-options!./DetailsListItem.vue?vue&type=style&index=0&id=1b431e66&scoped=true&lang=css& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsListItem.vue?vue&type=style&index=0&id=1b431e66&scoped=true&lang=css&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsListItem_vue_vue_type_style_index_0_id_1b431e66_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsListItem_vue_vue_type_style_index_0_id_1b431e66_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksEdit.vue?vue&type=style&index=0&id=4a38a812&scoped=true&lang=css&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/components/tasks/TasksEdit.vue?vue&type=style&index=0&id=4a38a812&scoped=true&lang=css& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksEdit_vue_vue_type_style_index_0_id_4a38a812_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/vue-loader/lib??vue-loader-options!./TasksEdit.vue?vue&type=style&index=0&id=4a38a812&scoped=true&lang=css& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksEdit.vue?vue&type=style&index=0&id=4a38a812&scoped=true&lang=css&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksEdit_vue_vue_type_style_index_0_id_4a38a812_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksEdit_vue_vue_type_style_index_0_id_4a38a812_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/views/CollectorDetails.vue?vue&type=style&index=0&id=7fb242af&scoped=true&lang=css&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/views/CollectorDetails.vue?vue&type=style&index=0&id=7fb242af&scoped=true&lang=css& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectorDetails_vue_vue_type_style_index_0_id_7fb242af_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/vue-loader/lib??vue-loader-options!./CollectorDetails.vue?vue&type=style&index=0&id=7fb242af&scoped=true&lang=css& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/views/CollectorDetails.vue?vue&type=style&index=0&id=7fb242af&scoped=true&lang=css&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectorDetails_vue_vue_type_style_index_0_id_7fb242af_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectorDetails_vue_vue_type_style_index_0_id_7fb242af_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsFile.vue?vue&type=template&id=4ecdec11&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/details/DetailsFile.vue?vue&type=template&id=4ecdec11&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************/
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
  return _c(
    "div",
    {
      staticClass: "file-thumb",
      on: {
        click: function($event) {
          return _vm.openFile(_vm.file)
        }
      }
    },
    [
      _vm.file.filempart === "image"
        ? _c("div", { staticStyle: { display: "flex" } }, [
            _c("img", {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.loaded,
                  expression: "loaded"
                }
              ],
              key: _vm.file.filepath,
              attrs: {
                src: _vm.imageUrl,
                alt: _vm.file.filename,
                title: _vm.file.filepath
              },
              on: { load: _vm.onLoad }
            })
          ])
        : _vm._e(),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: !_vm.loaded && _vm.file.filempart === "video",
              expression: "!loaded && file.filempart === 'video'"
            }
          ],
          staticClass: "placeholder",
          style: "min-height: " + _vm.detailsGridSize + "px",
          attrs: { title: _vm.file.filepath }
        },
        [
          _c(
            "svg",
            {
              attrs: {
                width: "50%",
                height: "50%",
                version: "1.1",
                viewBox: "-31 0 512 512",
                xmlns: "http://www.w3.org/2000/svg"
              }
            },
            [
              _c("path", {
                attrs: {
                  d:
                    "m440.59 206.68h-341.17l327.7-94.93c2.5469-0.73828 4.6953-2.4609 5.9766-4.7812 1.2812-2.3242 1.5859-5.0586 0.84766-7.6055l-17.148-59.199c-6.8516-23.645-28.867-40.16-53.539-40.16-5.1992 0-10.379 0.73828-15.402 2.1914l-307.68 89.129c-14.23 4.1211-26.023 13.582-33.215 26.633-7.1875 13.051-8.875 28.078-4.7539 42.305l16.754 57.836v238.25c0 30.688 24.965 55.652 55.648 55.652h120.16c5.5234 0 10-4.4766 10-10s-4.4766-10-10-10h-120.16c-19.66 0-35.652-15.992-35.652-35.652v-136.09h391.63v136.09c2.1e-4 19.66-15.992 35.652-35.652 35.652h-120.16c-5.5195 0-10 4.4766-10 10s4.4805 10 10 10h120.16c30.688 0 55.652-24.965 55.652-55.652v-239.67c0-5.5234-4.4766-10-10-10zm-176.33 93.586 42.488-73.586h55.262l-42.484 73.586zm-78.359 0 42.488-73.586h55.262l-42.484 73.586zm-78.355 0 42.484-73.586h55.266l-42.488 73.586zm37.18-129.46-71.148-68.336 53.309-15.441c0.375 0.54688 0.8125 1.0625 1.3125 1.543l71.148 68.336-53.309 15.441c-0.375-0.54688-0.81641-1.0664-1.3125-1.543zm134-125.84 71.148 68.336-53.309 15.441c-0.375-0.54688-0.8125-1.0664-1.3125-1.543l-71.148-68.336 53.309-15.441c0.375 0.54688 0.8125 1.0625 1.3125 1.543zm-75.266 21.805 71.148 68.332-53.309 15.445c-0.375-0.54687-0.8125-1.0664-1.3125-1.543l-71.148-68.336 53.309-15.441c0.37891 0.54297 0.81641 1.0625 1.3125 1.543zm149.96-45.367c3.2109-0.92969 6.5195-1.4023 9.8359-1.4023 15.824 0 29.938 10.578 34.328 25.727l14.367 49.59-40.121 11.621c-0.3789-0.54688-0.8164-1.0625-1.3164-1.543l-71.145-68.332zm-328.94 106.2c4.6094-8.3711 12.16-14.434 21.262-17.07l5.875-1.7031c0.37891 0.54688 0.81641 1.0664 1.3125 1.543l71.148 68.336-88.293 25.578-14.367-49.59c-2.6367-9.0976-1.5469-18.719 3.0625-27.094zm14.48 99.074h87.973l-42.484 73.586h-45.488zm303.66 73.586 42.484-73.586h45.488v73.586z"
                }
              }),
              _vm._v(" "),
              _c("path", {
                attrs: {
                  d:
                    "m303.92 405.11c0-3.5742-1.9062-6.875-5-8.6602l-87.855-50.723c-3.0938-1.7852-6.9062-1.7852-10 0-3.0938 1.7852-5 5.0859-5 8.6602v101.45c0 3.5703 1.9062 6.8711 5 8.6562 1.5469 0.89453 3.2734 1.3438 5 1.3438 1.7266 0 3.4531-0.44922 5-1.3438l87.855-50.719c3.0938-1.7852 5-5.0859 5-8.6602zm-87.855 33.402v-66.805l57.855 33.402z"
                }
              }),
              _vm._v(" "),
              _c("path", {
                attrs: {
                  d:
                    "m234.77 492c-5.5078 0-10 4.4922-10 10s4.4922 10 10 10c5.5117 0 10-4.4922 10-10s-4.4883-10-10-10z"
                }
              })
            ]
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: !_vm.loaded && _vm.file.filempart === "image",
              expression: "!loaded && file.filempart === 'image'"
            }
          ],
          staticClass: "placeholder",
          style: "min-height: " + _vm.detailsGridSize + "px"
        },
        [
          _c(
            "svg",
            {
              attrs: {
                width: "50%",
                "enable-background": "new 0 0 512 512",
                version: "1.1",
                viewBox: "0 0 512 512",
                "xml:space": "preserve",
                xmlns: "http://www.w3.org/2000/svg"
              }
            },
            [
              _c("path", {
                attrs: {
                  d:
                    "m446.58 0h-381.15c-36.076 0-65.425 29.35-65.425 65.426v381.15c0 36.075 29.349 65.425 65.425 65.425h381.15c36.076 0 65.425-29.35 65.425-65.426v-381.15c0-36.076-29.349-65.426-65.425-65.426zm35.267 446.58c0 19.447-15.821 35.267-35.267 35.267h-381.15c-19.447 0-35.268-15.821-35.268-35.267v-55.007l99.255-84.451c3.622-3.082 8.906-3.111 12.562-0.075l62.174 51.628c5.995 4.977 14.795 4.569 20.304-0.946l147.73-147.95c2.67-2.675 5.783-2.935 7.408-2.852 1.62 0.083 4.695 0.661 7.078 3.596l95.176 117.19v118.87zm0-166.71-71.766-88.366c-7.117-8.764-17.666-14.122-28.942-14.701-11.268-0.57-22.317 3.672-30.294 11.662l-138.01 138.22-51.59-42.839c-14.959-12.422-36.563-12.293-51.373 0.308l-79.712 67.822v-286.55c0-19.447 15.821-35.268 35.268-35.268h381.15c19.447 0 35.267 15.821 35.267 35.268v214.44z"
                }
              }),
              _vm._v(" "),
              _c("path", {
                attrs: {
                  d:
                    "m161.17 62.995c-40.095 0-72.713 32.62-72.713 72.713 0 40.094 32.619 72.713 72.713 72.713s72.713-32.619 72.713-72.713-32.618-72.713-72.713-72.713zm0 115.27c-23.466 0-42.556-19.091-42.556-42.556 0-23.466 19.09-42.556 42.556-42.556s42.556 19.091 42.556 42.556-19.09 42.556-42.556 42.556z"
                }
              })
            ]
          )
        ]
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsGroupList.vue?vue&type=template&id=7156b810&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/details/DetailsGroupList.vue?vue&type=template&id=7156b810&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************/
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
  return !_vm.loadingFiles
    ? _c("div", { staticClass: "details-group" }, [
        _c(
          "div",
          { staticClass: "details-group-files" },
          _vm._l(_vm.files, function(file) {
            return _c(
              "div",
              {
                key: file.fileid,
                staticClass: "file",
                style: "width: " + _vm.detailsGridSize + "px;"
              },
              [
                _c("DetailsFile", { attrs: { file: file, files: _vm.files } }),
                _vm._v(" "),
                _c("div", { staticClass: "file-info" }, [
                  _c("span", { staticClass: "filename" }, [
                    _vm._v(_vm._s(file.filename))
                  ]),
                  _vm._v(" "),
                  _c("span", { staticClass: "owner" }, [
                    _vm._v(_vm._s(file.fileowner))
                  ]),
                  _vm._v(" "),
                  _c("span", { staticClass: "size" }, [
                    _vm._v(_vm._s(_vm.formatBytes(Number(file.filesize))))
                  ]),
                  _vm._v(" "),
                  _c("span", {
                    staticClass: "delete-file-btn icon-delete-white",
                    on: {
                      click: function($event) {
                        return _vm.deleteGroupFile(file)
                      }
                    }
                  })
                ])
              ],
              1
            )
          }),
          0
        )
      ])
    : _c("div", [
        _c("span", {
          staticClass: "icon-loading",
          staticStyle: {
            width: "20px",
            height: "20px",
            display: "flex",
            margin: "20px auto"
          }
        })
      ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsList.vue?vue&type=template&id=6a4b739a&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/details/DetailsList.vue?vue&type=template&id=6a4b739a&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "task-details" }, [
    _c("div", { staticClass: "task-details-heading" }, [
      _c("h3", [
        _vm._v(
          "\n\t\t\t" + _vm._s(_vm.t("mediadc", "Duplicates list")) + "\n\t\t\t"
        ),
        _vm.getStatusBadge(_vm.task) === "finished"
          ? _c("span", [
              _vm._v(
                "\n\t\t\t\t- " +
                  _vm._s(_vm.details.length) +
                  " " +
                  _vm._s(_vm.t("mediadc", "group(s)")) +
                  "\n\t\t\t\t(" +
                  _vm._s(_vm.filestotal) +
                  " " +
                  _vm._s(_vm.t("mediadc", "file(s)")) +
                  " - " +
                  _vm._s(_vm.formatBytes(_vm.filessize)) +
                  ")\n\t\t\t"
              )
            ])
          : _vm._e()
      ]),
      _vm._v(" "),
      _vm.details.length > _vm.itemsPerPage
        ? _c("div", { staticClass: "pagination" }, [
            _c("span", {
              class: !_vm.sorted
                ? "icon-triangle-s toggle-sorting-button"
                : "icon-triangle-n toggle-sorting-button",
              on: { click: _vm.toggleSorting }
            }),
            _vm._v(" "),
            _c("span", {
              staticClass: "icon-view-previous pagination-button",
              on: {
                click: function($event) {
                  return _vm.prevGroupsPage()
                }
              }
            }),
            _vm._v(" "),
            _c("span", [_vm._v(_vm._s(_vm.t("mediadc", "Page:")) + " ")]),
            _vm._v(" "),
            _c("span", [
              _vm._v(
                _vm._s(_vm.page + 1) +
                  "/" +
                  _vm._s(Math.ceil(_vm.details.length / _vm.itemsPerPage))
              )
            ]),
            _vm._v(" "),
            _c("span", {
              staticClass: "icon-view-next pagination-button",
              on: {
                click: function($event) {
                  return _vm.nextGroupsPage()
                }
              }
            })
          ])
        : _vm._e()
    ]),
    _vm._v(" "),
    _vm.details.length > 0
      ? _c(
          "div",
          _vm._l(_vm.paginatedDetails[_vm.page], function(detail) {
            return _c(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: JSON.parse(detail.group_files_ids).length > 1,
                    expression: "JSON.parse(detail.group_files_ids).length > 1"
                  }
                ],
                key: detail.id,
                staticClass: "task-details-row"
              },
              [_c("DetailsListItem", { attrs: { detail: detail } })],
              1
            )
          }),
          0
        )
      : _c("div", [
          _c("strong", [
            _vm._v(_vm._s(_vm.t("mediadc", "No duplicates found.")))
          ])
        ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsListItem.vue?vue&type=template&id=1b431e66&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/details/DetailsListItem.vue?vue&type=template&id=1b431e66&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************/
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
  return _c(
    "div",
    { staticClass: "details-list-item" },
    [
      _c("div", { staticClass: "details-list-item-title" }, [
        _c("span", {
          staticClass: "icon-projects",
          staticStyle: { margin: "0 10px 0 0" }
        }),
        _vm._v(" "),
        _c(
          "span",
          {
            staticClass: "group-info",
            on: {
              click: function($event) {
                return _vm.openDetailFiles(_vm.detail)
              }
            }
          },
          [
            _vm._v(
              "\n\t\t\t" +
                _vm._s(_vm.t("mediadc", "Duplicate group")) +
                " #" +
                _vm._s(_vm.detail.id) +
                " (" +
                _vm._s(JSON.parse(_vm.detail.group_files_ids).length) +
                "\n\t\t\t" +
                _vm._s(_vm.t("mediadc", "file(s)")) +
                _vm._s(
                  _vm.files.length > 0
                    ? " - " + _vm.formatBytes(_vm.getGroupFilesSize(_vm.files))
                    : ""
                ) +
                ")\n\t\t"
            )
          ]
        ),
        _vm._v(" "),
        _c("span", {
          class: !_vm.opened
            ? "icon-triangle-s open-details-btn"
            : "icon-triangle-n open-details-btn"
        }),
        _vm._v(" "),
        _c("span", {
          staticClass: "icon-delete delete-group-btn",
          on: {
            click: function($event) {
              return _vm.deleteTaskDetail(_vm.detail)
            }
          }
        })
      ]),
      _vm._v(" "),
      _vm.opened &&
      JSON.parse(_vm.detail.group_files_ids).length > _vm.itemsPerPage
        ? _c("div", { staticClass: "pagination" }, [
            _c("span", {
              staticClass: "icon-view-previous pagination-button",
              on: {
                click: function($event) {
                  return _vm.openPrevDetailFiles(_vm.detail)
                }
              }
            }),
            _vm._v(" "),
            _c("span", [_vm._v(_vm._s(_vm.t("mediadc", "Page:")) + " ")]),
            _vm._v(" "),
            _c("span", [
              _vm._v(
                _vm._s(_vm.page + 1) +
                  "/" +
                  _vm._s(
                    Math.ceil(
                      JSON.parse(_vm.detail.group_files_ids).length /
                        _vm.itemsPerPage
                    )
                  )
              )
            ]),
            _vm._v(" "),
            _c("span", {
              staticClass: "icon-view-next pagination-button",
              on: {
                click: function($event) {
                  return _vm.openNextDetailFiles(_vm.detail)
                }
              }
            })
          ])
        : _vm._e(),
      _vm._v(" "),
      _c("DetailsGroupList", {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.opened,
            expression: "opened"
          }
        ],
        attrs: { files: _vm.files, "loading-files": _vm.loadingFiles }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksEdit.vue?vue&type=template&id=4a38a812&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/tasks/TasksEdit.vue?vue&type=template&id=4a38a812&scoped=true& ***!
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
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.opened,
          expression: "opened"
        }
      ],
      staticClass: "blackout"
    },
    [
      _c("div", { staticClass: "edit-task-block" }, [
        _c("span", {
          staticClass: "icon-close close-edit-button",
          on: { click: _vm.closeEditTaskDialog }
        }),
        _vm._v(" "),
        _c("h2", [_vm._v(_vm._s(_vm.t("mediadc", "Edit task")))]),
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
                          _c(
                            "span",
                            {
                              staticStyle: {
                                "overflow-y": "scroll",
                                "white-space": "nowrap"
                              }
                            },
                            [_vm._v(_vm._s(_vm.targetDirectoriesPaths[fileid]))]
                          ),
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
              _vm._v(
                "\n\t\t\t\t\t" +
                  _vm._s(_vm.t("mediadc", "Select")) +
                  "\n\t\t\t\t"
              )
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
                          _c(
                            "span",
                            { staticStyle: { "overflow-y": "scroll" } },
                            [_vm._v(_vm._s(_vm.excludeFileIds[fileid]))]
                          ),
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
              _vm._v(
                "\n\t\t\t\t\t" +
                  _vm._s(_vm.t("mediadc", "Select")) +
                  "\n\t\t\t\t"
              )
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
                    return _c(
                      "div",
                      { key: index, staticClass: "custom-mask" },
                      [
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
                      ]
                    )
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
                            return _vm.cancelAddingCustomMask.apply(
                              null,
                              arguments
                            )
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
                "\n\t\t\t\t\t" +
                  _vm._s(_vm.t("mediadc", "Target Mime Type")) +
                  "\n\t\t\t\t"
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
                    "\n\t\t\t\t\t\t" +
                      _vm._s(_vm.t("mediadc", "Photos")) +
                      "\n\t\t\t\t\t"
                  )
                ]),
                _vm._v(" "),
                _c("option", { domProps: { value: 1 } }, [
                  _vm._v(
                    "\n\t\t\t\t\t\t" +
                      _vm._s(_vm.t("mediadc", "Videos")) +
                      "\n\t\t\t\t\t"
                  )
                ]),
                _vm._v(" "),
                _c("option", { domProps: { value: 2 } }, [
                  _vm._v(
                    "\n\t\t\t\t\t\t" +
                      _vm._s(_vm.t("mediadc", "Photos and Videos")) +
                      "\n\t\t\t\t\t"
                  )
                ])
              ]
            ),
            _vm._v(" "),
            _c("h3", { staticStyle: { margin: "5px 0" } }, [
              _vm._v(
                "\n\t\t\t\t\t" +
                  _vm._s(_vm.t("mediadc", "Similarity threshold")) +
                  "\n\t\t\t\t"
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
                on: { click: _vm.restartTask }
              },
              [
                _vm._v(
                  "\n\t\t\t" +
                    _vm._s(_vm.t("mediadc", "Restart task")) +
                    "\n\t\t"
                )
              ]
            )
          : _c("button", { attrs: { disabled: "" } }, [
              _c("span", { staticClass: "icon-loading" })
            ])
      ])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/views/CollectorDetails.vue?vue&type=template&id=7fb242af&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/views/CollectorDetails.vue?vue&type=template&id=7fb242af&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************/
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
    ? _c(
        "div",
        { staticClass: "container" },
        [
          _vm.editingTask
            ? _c("TasksEdit", {
                attrs: { opened: _vm.editingTask },
                on: {
                  "update:opened": function($event) {
                    _vm.editingTask = $event
                  }
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _c("div", { staticClass: "task-details" }, [
            _c("div", { staticClass: "task-details-heading" }, [
              _c("h2", [
                _vm._v("\n\t\t\t\t" + _vm._s(_vm.rootTitle) + "\n\t\t\t\t"),
                _c("span", {
                  class: !_vm.collapsedStatus
                    ? "icon-triangle-n collapse-task-status-btn"
                    : "icon-triangle-s collapse-task-status-btn",
                  on: { click: _vm.collapseTaskStatus }
                })
              ]),
              _vm._v(" "),
              _c(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: !_vm.collapsedStatus,
                      expression: "!collapsedStatus"
                    }
                  ],
                  staticClass: "task-details-description"
                },
                [
                  _c("p", [
                    _vm._v(
                      "\n\t\t\t\t\t" +
                        _vm._s(
                          _vm.t(
                            "mediadc",
                            "Here you can view task details, manage task (stop or restart), " +
                              "delete found duplicated photos and videos."
                          )
                        ) +
                        "\n\t\t\t\t"
                    )
                  ]),
                  _vm._v(" "),
                  _c("p", [
                    _vm._v(
                      "\n\t\t\t\t\t" +
                        _vm._s(
                          _vm.t(
                            "mediadc",
                            "Deleted files are placed in the trash, so that they can be restored in case of need."
                          )
                        ) +
                        "\n\t\t\t\t"
                    )
                  ])
                ]
              )
            ]),
            _vm._v(" "),
            _c(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: !_vm.collapsedStatus,
                    expression: "!collapsedStatus"
                  }
                ],
                staticClass: "task-status-row"
              },
              [
                _c("div", { staticClass: "task-status" }, [
                  _c(
                    "span",
                    { class: "badge " + _vm.getStatusBadge(_vm.task) },
                    [_vm._v(_vm._s(_vm.getStatusBadge(_vm.task)))]
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticStyle: {
                        display: "flex",
                        "flex-direction": "column"
                      }
                    },
                    [
                      _c("span", [
                        _c("b", [
                          _vm._v(_vm._s(_vm.parseTargetMtype(_vm.task)))
                        ]),
                        _vm._v(
                          " " +
                            _vm._s(
                              _vm.task.files_scanned !== _vm.task.files_total
                                ? _vm.task.files_scanned + "/"
                                : ""
                            ) +
                            _vm._s(_vm.task.files_total) +
                            " file(s)\n\t\t\t\t\t\t(" +
                            _vm._s(
                              _vm.formatBytes(Number(_vm.task.files_total_size))
                            ) +
                            ")\n\t\t\t\t\t\t(" +
                            _vm._s(
                              _vm.task !== null &&
                                "collector_settings" in _vm.task
                                ? _vm.t("mediadc", "precision: ") +
                                    JSON.parse(_vm.task.collector_settings)
                                      .similarity_threshold +
                                    "%"
                                : ""
                            ) +
                            ")\n\t\t\t\t\t\t"
                        ),
                        _c("br"),
                        _vm._v(" "),
                        _c("b", [
                          _vm._v(_vm._s(_vm.t("mediadc", "Deleted: ")) + " ")
                        ]),
                        _vm._v(
                          "\n\t\t\t\t\t\t" +
                            _vm._s(_vm.task.deleted_files_count) +
                            " " +
                            _vm._s(_vm.t("mediadc", "file(s)")) +
                            "\n\t\t\t\t\t\t(" +
                            _vm._s(
                              _vm.formatBytes(
                                Number(_vm.task.deleted_files_size)
                              )
                            ) +
                            ")\n\t\t\t\t\t"
                        )
                      ]),
                      _vm._v(" "),
                      _c("span", [
                        _vm._v(
                          "\n\t\t\t\t\t\t" +
                            _vm._s(
                              _vm.parseUnixTimestamp(_vm.task.created_time)
                            ) +
                            "\n\t\t\t\t\t\t" +
                            _vm._s(
                              Number(_vm.task.finished_time) > 0
                                ? " - " +
                                    _vm.parseUnixTimestamp(
                                      _vm.task.finished_time
                                    )
                                : ""
                            ) +
                            "\n\t\t\t\t\t"
                        )
                      ])
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticClass: "app-content-list-menu",
                      staticStyle: {
                        margin: "0 0 0 10px",
                        position: "relative"
                      }
                    },
                    [
                      _c("div", {
                        staticClass: "icon-more actions-menu-button",
                        on: { click: _vm.openActionsPopup }
                      }),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          class: _vm.actionsOpened
                            ? "popovermenu open"
                            : "popovermenu",
                          staticStyle: { right: "-1px" }
                        },
                        [
                          _c("ul", [
                            _c("li", [
                              _c(
                                "a",
                                {
                                  staticClass: "icon-history",
                                  on: {
                                    click: function($event) {
                                      return _vm.restartTask(_vm.task)
                                    }
                                  }
                                },
                                [
                                  _c("span", [
                                    _vm._v(_vm._s(_vm.t("mediadc", "Restart")))
                                  ])
                                ]
                              )
                            ]),
                            _vm._v(" "),
                            _c("li", [
                              _c(
                                "a",
                                {
                                  staticClass: "icon-rename",
                                  on: {
                                    click: function($event) {
                                      return _vm.openEditTaskDialog(_vm.task)
                                    }
                                  }
                                },
                                [
                                  _c("span", [
                                    _vm._v(_vm._s(_vm.t("mediadc", "Edit")))
                                  ])
                                ]
                              )
                            ]),
                            _vm._v(" "),
                            _c("li", [
                              _c(
                                "a",
                                {
                                  staticClass: "icon-pause",
                                  on: {
                                    click: function($event) {
                                      return _vm.terminateTask(_vm.task)
                                    }
                                  }
                                },
                                [
                                  _c("span", [
                                    _vm._v(_vm._s(_vm.t("mediadc", "Stop")))
                                  ])
                                ]
                              )
                            ]),
                            _vm._v(" "),
                            _c("li", [
                              _c(
                                "a",
                                {
                                  staticClass: "icon-delete",
                                  on: {
                                    click: function($event) {
                                      return _vm.deleteTask(_vm.task)
                                    }
                                  }
                                },
                                [
                                  _c("span", [
                                    _vm._v(_vm._s(_vm.t("mediadc", "Delete")))
                                  ])
                                ]
                              )
                            ])
                          ])
                        ]
                      )
                    ]
                  )
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "task-info" }, [
                  _c("h3", [
                    _vm._v(_vm._s(_vm.t("mediadc", "Target directories")))
                  ]),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "target-directories-list" },
                    _vm._l(_vm.taskInfo.target_directories, function(dir) {
                      return _c(
                        "div",
                        {
                          key: dir.fileid,
                          staticClass: "target-directory-row"
                        },
                        [
                          _c("b", [
                            _vm._v(
                              "[" +
                                _vm._s(dir.fileowner) +
                                "] " +
                                _vm._s(
                                  dir.filepath.replace(
                                    "/" + dir.fileowner + "/files",
                                    ""
                                  )
                                )
                            )
                          ]),
                          _vm._v(
                            " (" +
                              _vm._s(_vm.formatBytes(dir.filesize)) +
                              ")\n\t\t\t\t\t"
                          )
                        ]
                      )
                    }),
                    0
                  )
                ])
              ]
            ),
            _vm._v(" "),
            _vm.isValidUser
              ? _c(
                  "div",
                  { staticClass: "details-row" },
                  [
                    _c("DetailsList", {
                      attrs: {
                        filessize: _vm.filessize,
                        filestotal: _vm.filestotal
                      }
                    })
                  ],
                  1
                )
              : _c("div", [
                  _c("p", { staticStyle: { "text-align": "center" } }, [
                    _c("b", [
                      _vm._v(
                        _vm._s(
                          _vm.t(
                            "mediadc",
                            "You are not allowed to manage other user's tasks."
                          )
                        )
                      )
                    ])
                  ])
                ]),
            _vm._v(" "),
            _vm.task.errors !== undefined && _vm.task.errors.length > 0
              ? _c(
                  "div",
                  { staticClass: "errors" },
                  [
                    _c("h3", [_vm._v(_vm._s(_vm.t("mediadc", "Task errors")))]),
                    _vm._v(" "),
                    _vm._l(_vm.task.errors.split("\\n"), function(error) {
                      return _c(
                        "div",
                        { key: error, staticClass: "error-row" },
                        [_vm._v("\n\t\t\t\t" + _vm._s(error) + "\n\t\t\t")]
                      )
                    })
                  ],
                  2
                )
              : _vm._e()
          ])
        ],
        1
      )
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./src/components/details/DetailsFile.vue":
/*!************************************************!*\
  !*** ./src/components/details/DetailsFile.vue ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DetailsFile_vue_vue_type_template_id_4ecdec11_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DetailsFile.vue?vue&type=template&id=4ecdec11&scoped=true& */ "./src/components/details/DetailsFile.vue?vue&type=template&id=4ecdec11&scoped=true&");
/* harmony import */ var _DetailsFile_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DetailsFile.vue?vue&type=script&lang=js& */ "./src/components/details/DetailsFile.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _DetailsFile_vue_vue_type_style_index_0_id_4ecdec11_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DetailsFile.vue?vue&type=style&index=0&id=4ecdec11&scoped=true&lang=css& */ "./src/components/details/DetailsFile.vue?vue&type=style&index=0&id=4ecdec11&scoped=true&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _DetailsFile_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _DetailsFile_vue_vue_type_template_id_4ecdec11_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _DetailsFile_vue_vue_type_template_id_4ecdec11_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "4ecdec11",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/details/DetailsFile.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/components/details/DetailsFile.vue?vue&type=script&lang=js&":
/*!*************************************************************************!*\
  !*** ./src/components/details/DetailsFile.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsFile_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib!../../../node_modules/vue-loader/lib??vue-loader-options!./DetailsFile.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsFile.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsFile_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/details/DetailsFile.vue?vue&type=style&index=0&id=4ecdec11&scoped=true&lang=css&":
/*!*********************************************************************************************************!*\
  !*** ./src/components/details/DetailsFile.vue?vue&type=style&index=0&id=4ecdec11&scoped=true&lang=css& ***!
  \*********************************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsFile_vue_vue_type_style_index_0_id_4ecdec11_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/vue-loader/lib??vue-loader-options!./DetailsFile.vue?vue&type=style&index=0&id=4ecdec11&scoped=true&lang=css& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsFile.vue?vue&type=style&index=0&id=4ecdec11&scoped=true&lang=css&");
/* empty/unused harmony star reexport */

/***/ }),

/***/ "./src/components/details/DetailsFile.vue?vue&type=template&id=4ecdec11&scoped=true&":
/*!*******************************************************************************************!*\
  !*** ./src/components/details/DetailsFile.vue?vue&type=template&id=4ecdec11&scoped=true& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsFile_vue_vue_type_template_id_4ecdec11_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./DetailsFile.vue?vue&type=template&id=4ecdec11&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsFile.vue?vue&type=template&id=4ecdec11&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsFile_vue_vue_type_template_id_4ecdec11_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsFile_vue_vue_type_template_id_4ecdec11_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/components/details/DetailsGroupList.vue":
/*!*****************************************************!*\
  !*** ./src/components/details/DetailsGroupList.vue ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DetailsGroupList_vue_vue_type_template_id_7156b810_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DetailsGroupList.vue?vue&type=template&id=7156b810&scoped=true& */ "./src/components/details/DetailsGroupList.vue?vue&type=template&id=7156b810&scoped=true&");
/* harmony import */ var _DetailsGroupList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DetailsGroupList.vue?vue&type=script&lang=js& */ "./src/components/details/DetailsGroupList.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _DetailsGroupList_vue_vue_type_style_index_0_id_7156b810_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DetailsGroupList.vue?vue&type=style&index=0&id=7156b810&scoped=true&lang=css& */ "./src/components/details/DetailsGroupList.vue?vue&type=style&index=0&id=7156b810&scoped=true&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _DetailsGroupList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _DetailsGroupList_vue_vue_type_template_id_7156b810_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _DetailsGroupList_vue_vue_type_template_id_7156b810_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "7156b810",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/details/DetailsGroupList.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/components/details/DetailsGroupList.vue?vue&type=script&lang=js&":
/*!******************************************************************************!*\
  !*** ./src/components/details/DetailsGroupList.vue?vue&type=script&lang=js& ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsGroupList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib!../../../node_modules/vue-loader/lib??vue-loader-options!./DetailsGroupList.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsGroupList.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsGroupList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/details/DetailsGroupList.vue?vue&type=style&index=0&id=7156b810&scoped=true&lang=css&":
/*!**************************************************************************************************************!*\
  !*** ./src/components/details/DetailsGroupList.vue?vue&type=style&index=0&id=7156b810&scoped=true&lang=css& ***!
  \**************************************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsGroupList_vue_vue_type_style_index_0_id_7156b810_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/vue-loader/lib??vue-loader-options!./DetailsGroupList.vue?vue&type=style&index=0&id=7156b810&scoped=true&lang=css& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsGroupList.vue?vue&type=style&index=0&id=7156b810&scoped=true&lang=css&");
/* empty/unused harmony star reexport */

/***/ }),

/***/ "./src/components/details/DetailsGroupList.vue?vue&type=template&id=7156b810&scoped=true&":
/*!************************************************************************************************!*\
  !*** ./src/components/details/DetailsGroupList.vue?vue&type=template&id=7156b810&scoped=true& ***!
  \************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsGroupList_vue_vue_type_template_id_7156b810_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./DetailsGroupList.vue?vue&type=template&id=7156b810&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsGroupList.vue?vue&type=template&id=7156b810&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsGroupList_vue_vue_type_template_id_7156b810_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsGroupList_vue_vue_type_template_id_7156b810_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/components/details/DetailsList.vue":
/*!************************************************!*\
  !*** ./src/components/details/DetailsList.vue ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DetailsList_vue_vue_type_template_id_6a4b739a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DetailsList.vue?vue&type=template&id=6a4b739a&scoped=true& */ "./src/components/details/DetailsList.vue?vue&type=template&id=6a4b739a&scoped=true&");
/* harmony import */ var _DetailsList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DetailsList.vue?vue&type=script&lang=js& */ "./src/components/details/DetailsList.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _DetailsList_vue_vue_type_style_index_0_id_6a4b739a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DetailsList.vue?vue&type=style&index=0&id=6a4b739a&scoped=true&lang=css& */ "./src/components/details/DetailsList.vue?vue&type=style&index=0&id=6a4b739a&scoped=true&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _DetailsList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _DetailsList_vue_vue_type_template_id_6a4b739a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _DetailsList_vue_vue_type_template_id_6a4b739a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "6a4b739a",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/details/DetailsList.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/components/details/DetailsList.vue?vue&type=script&lang=js&":
/*!*************************************************************************!*\
  !*** ./src/components/details/DetailsList.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib!../../../node_modules/vue-loader/lib??vue-loader-options!./DetailsList.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsList.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/details/DetailsList.vue?vue&type=style&index=0&id=6a4b739a&scoped=true&lang=css&":
/*!*********************************************************************************************************!*\
  !*** ./src/components/details/DetailsList.vue?vue&type=style&index=0&id=6a4b739a&scoped=true&lang=css& ***!
  \*********************************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsList_vue_vue_type_style_index_0_id_6a4b739a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/vue-loader/lib??vue-loader-options!./DetailsList.vue?vue&type=style&index=0&id=6a4b739a&scoped=true&lang=css& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsList.vue?vue&type=style&index=0&id=6a4b739a&scoped=true&lang=css&");
/* empty/unused harmony star reexport */

/***/ }),

/***/ "./src/components/details/DetailsList.vue?vue&type=template&id=6a4b739a&scoped=true&":
/*!*******************************************************************************************!*\
  !*** ./src/components/details/DetailsList.vue?vue&type=template&id=6a4b739a&scoped=true& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsList_vue_vue_type_template_id_6a4b739a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./DetailsList.vue?vue&type=template&id=6a4b739a&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsList.vue?vue&type=template&id=6a4b739a&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsList_vue_vue_type_template_id_6a4b739a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsList_vue_vue_type_template_id_6a4b739a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/components/details/DetailsListItem.vue":
/*!****************************************************!*\
  !*** ./src/components/details/DetailsListItem.vue ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DetailsListItem_vue_vue_type_template_id_1b431e66_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DetailsListItem.vue?vue&type=template&id=1b431e66&scoped=true& */ "./src/components/details/DetailsListItem.vue?vue&type=template&id=1b431e66&scoped=true&");
/* harmony import */ var _DetailsListItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DetailsListItem.vue?vue&type=script&lang=js& */ "./src/components/details/DetailsListItem.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _DetailsListItem_vue_vue_type_style_index_0_id_1b431e66_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DetailsListItem.vue?vue&type=style&index=0&id=1b431e66&scoped=true&lang=css& */ "./src/components/details/DetailsListItem.vue?vue&type=style&index=0&id=1b431e66&scoped=true&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _DetailsListItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _DetailsListItem_vue_vue_type_template_id_1b431e66_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _DetailsListItem_vue_vue_type_template_id_1b431e66_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "1b431e66",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/details/DetailsListItem.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/components/details/DetailsListItem.vue?vue&type=script&lang=js&":
/*!*****************************************************************************!*\
  !*** ./src/components/details/DetailsListItem.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsListItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib!../../../node_modules/vue-loader/lib??vue-loader-options!./DetailsListItem.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsListItem.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsListItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/details/DetailsListItem.vue?vue&type=style&index=0&id=1b431e66&scoped=true&lang=css&":
/*!*************************************************************************************************************!*\
  !*** ./src/components/details/DetailsListItem.vue?vue&type=style&index=0&id=1b431e66&scoped=true&lang=css& ***!
  \*************************************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsListItem_vue_vue_type_style_index_0_id_1b431e66_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/vue-loader/lib??vue-loader-options!./DetailsListItem.vue?vue&type=style&index=0&id=1b431e66&scoped=true&lang=css& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsListItem.vue?vue&type=style&index=0&id=1b431e66&scoped=true&lang=css&");
/* empty/unused harmony star reexport */

/***/ }),

/***/ "./src/components/details/DetailsListItem.vue?vue&type=template&id=1b431e66&scoped=true&":
/*!***********************************************************************************************!*\
  !*** ./src/components/details/DetailsListItem.vue?vue&type=template&id=1b431e66&scoped=true& ***!
  \***********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsListItem_vue_vue_type_template_id_1b431e66_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./DetailsListItem.vue?vue&type=template&id=1b431e66&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/details/DetailsListItem.vue?vue&type=template&id=1b431e66&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsListItem_vue_vue_type_template_id_1b431e66_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DetailsListItem_vue_vue_type_template_id_1b431e66_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/components/tasks/TasksEdit.vue":
/*!********************************************!*\
  !*** ./src/components/tasks/TasksEdit.vue ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TasksEdit_vue_vue_type_template_id_4a38a812_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TasksEdit.vue?vue&type=template&id=4a38a812&scoped=true& */ "./src/components/tasks/TasksEdit.vue?vue&type=template&id=4a38a812&scoped=true&");
/* harmony import */ var _TasksEdit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TasksEdit.vue?vue&type=script&lang=js& */ "./src/components/tasks/TasksEdit.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _TasksEdit_vue_vue_type_style_index_0_id_4a38a812_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TasksEdit.vue?vue&type=style&index=0&id=4a38a812&scoped=true&lang=css& */ "./src/components/tasks/TasksEdit.vue?vue&type=style&index=0&id=4a38a812&scoped=true&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _TasksEdit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TasksEdit_vue_vue_type_template_id_4a38a812_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TasksEdit_vue_vue_type_template_id_4a38a812_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "4a38a812",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/tasks/TasksEdit.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/components/tasks/TasksEdit.vue?vue&type=script&lang=js&":
/*!*********************************************************************!*\
  !*** ./src/components/tasks/TasksEdit.vue?vue&type=script&lang=js& ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksEdit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib!../../../node_modules/vue-loader/lib??vue-loader-options!./TasksEdit.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksEdit.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksEdit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/tasks/TasksEdit.vue?vue&type=style&index=0&id=4a38a812&scoped=true&lang=css&":
/*!*****************************************************************************************************!*\
  !*** ./src/components/tasks/TasksEdit.vue?vue&type=style&index=0&id=4a38a812&scoped=true&lang=css& ***!
  \*****************************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksEdit_vue_vue_type_style_index_0_id_4a38a812_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/vue-loader/lib??vue-loader-options!./TasksEdit.vue?vue&type=style&index=0&id=4a38a812&scoped=true&lang=css& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksEdit.vue?vue&type=style&index=0&id=4a38a812&scoped=true&lang=css&");
/* empty/unused harmony star reexport */

/***/ }),

/***/ "./src/components/tasks/TasksEdit.vue?vue&type=template&id=4a38a812&scoped=true&":
/*!***************************************************************************************!*\
  !*** ./src/components/tasks/TasksEdit.vue?vue&type=template&id=4a38a812&scoped=true& ***!
  \***************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksEdit_vue_vue_type_template_id_4a38a812_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./TasksEdit.vue?vue&type=template&id=4a38a812&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/tasks/TasksEdit.vue?vue&type=template&id=4a38a812&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksEdit_vue_vue_type_template_id_4a38a812_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TasksEdit_vue_vue_type_template_id_4a38a812_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



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

/***/ "./src/views/CollectorDetails.vue":
/*!****************************************!*\
  !*** ./src/views/CollectorDetails.vue ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CollectorDetails_vue_vue_type_template_id_7fb242af_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CollectorDetails.vue?vue&type=template&id=7fb242af&scoped=true& */ "./src/views/CollectorDetails.vue?vue&type=template&id=7fb242af&scoped=true&");
/* harmony import */ var _CollectorDetails_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CollectorDetails.vue?vue&type=script&lang=js& */ "./src/views/CollectorDetails.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _CollectorDetails_vue_vue_type_style_index_0_id_7fb242af_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CollectorDetails.vue?vue&type=style&index=0&id=7fb242af&scoped=true&lang=css& */ "./src/views/CollectorDetails.vue?vue&type=style&index=0&id=7fb242af&scoped=true&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _CollectorDetails_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _CollectorDetails_vue_vue_type_template_id_7fb242af_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _CollectorDetails_vue_vue_type_template_id_7fb242af_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "7fb242af",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/CollectorDetails.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/views/CollectorDetails.vue?vue&type=script&lang=js&":
/*!*****************************************************************!*\
  !*** ./src/views/CollectorDetails.vue?vue&type=script&lang=js& ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectorDetails_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib!../../node_modules/vue-loader/lib??vue-loader-options!./CollectorDetails.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/views/CollectorDetails.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectorDetails_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/CollectorDetails.vue?vue&type=style&index=0&id=7fb242af&scoped=true&lang=css&":
/*!*************************************************************************************************!*\
  !*** ./src/views/CollectorDetails.vue?vue&type=style&index=0&id=7fb242af&scoped=true&lang=css& ***!
  \*************************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectorDetails_vue_vue_type_style_index_0_id_7fb242af_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/vue-loader/lib??vue-loader-options!./CollectorDetails.vue?vue&type=style&index=0&id=7fb242af&scoped=true&lang=css& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/views/CollectorDetails.vue?vue&type=style&index=0&id=7fb242af&scoped=true&lang=css&");
/* empty/unused harmony star reexport */

/***/ }),

/***/ "./src/views/CollectorDetails.vue?vue&type=template&id=7fb242af&scoped=true&":
/*!***********************************************************************************!*\
  !*** ./src/views/CollectorDetails.vue?vue&type=template&id=7fb242af&scoped=true& ***!
  \***********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectorDetails_vue_vue_type_template_id_7fb242af_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./CollectorDetails.vue?vue&type=template&id=7fb242af&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/views/CollectorDetails.vue?vue&type=template&id=7fb242af&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectorDetails_vue_vue_type_template_id_7fb242af_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectorDetails_vue_vue_type_template_id_7fb242af_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=mediadc-1.js.map?v=1503c5f6a720df07b684