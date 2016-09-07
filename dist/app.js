(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="masonry-layout.d.ts" />
"use strict";
var date_1 = require('./components/date');
var note_1 = require('./components/note');
var note_list_1 = require('./components/note-list');
var default_1 = require('./components/default');
var Controller = (function () {
    function Controller(Model, View) {
        var self = this;
        this.Model = Model;
        this.View = View;
        self.defaultLoad();
        this.Masonry = new Masonry('#root', {
            itemSelector: '.note-grid',
            columnWidth: '.note-sizing',
            percentPosition: true
        });
        self.layout();
        self.renderDate();
        self.View.addEvent('addNote', function (item) {
            self.createNote(item);
        });
        self.View.addEvent('modal-active');
        self.View.addEvent('search', function (value) {
            self.searchNote(value);
        });
    }
    Controller.prototype.defaultLoad = function () {
        var self = this;
        var app = document.getElementById('app');
        var noteList = new note_list_1.NoteList();
        var content = self.Model.get() || [];
        self.View.addElement(app, noteList.render());
        if (content.length === 0) {
            var defaultItem = new default_1.DefaultItem();
            var template = defaultItem.render();
            var parent_1 = document.getElementById('root');
            self.View.addElement(parent_1, template);
            return;
        }
        content.map(function (item) {
            var note = new note_1.Note();
            var template = note.render(item, self.deleteNote.bind(self));
            var parent = document.getElementById('root');
            self.View.addElement(parent, template);
        });
    };
    Controller.prototype.layout = function () {
        var self = this;
        self.Masonry.reloadItems();
        self.Masonry.layout();
    };
    Controller.prototype.createNote = function (item) {
        var self = this;
        var note = new note_1.Note();
        var template = note.render(item, self.deleteNote.bind(self));
        var root = document.getElementById('root');
        var defaultContainer = document.querySelector('.default-text');
        if (defaultContainer) {
            root.removeChild(defaultContainer);
        }
        self.View.addElement(root, template);
        self.Model.save(item);
        self.Masonry.reloadItems();
        self.Masonry.layout();
    };
    Controller.prototype.deleteNote = function (item) {
        var self = this;
        var root = document.getElementById('root');
        self.View.deleteElement(root, item);
        self.Model.del(item.getAttribute('key'));
        var content = self.Model.get();
        if (content.length === 0) {
            var defaultItem = new default_1.DefaultItem();
            var template = defaultItem.render();
            self.View.addElement(root, template);
        }
        self.Masonry.reloadItems();
        self.Masonry.layout();
    };
    Controller.prototype.hideNote = function (item) {
        var self = this;
        var root = document.getElementById('root');
        self.View.deleteElement(root, item);
    };
    Controller.prototype.searchNote = function (value) {
        var self = this;
        var root = document.getElementById('root');
        var allNotes = self.Model.get();
        var result = self.Model.sort(value);
        var noteList = new note_list_1.NoteList();
        var note = new note_1.Note();
        noteList.clearNoteList(self.hideNote.bind(self));
        if (value.length !== 0) {
            result.map(function (item) {
                var template = note.render(item, self.deleteNote.bind(self));
                self.View.addElement(root, template);
            });
        }
        else {
            allNotes.map(function (item) {
                var template = note.render(item, self.deleteNote.bind(self));
                self.View.addElement(root, template);
            });
        }
        self.layout();
    };
    Controller.prototype.renderDate = function () {
        var self = this;
        var root = document.getElementById('date-container');
        var date = new date_1.DateComponent();
        var template = date.render();
        self.View.addElement(root, template);
    };
    return Controller;
}());
exports.Controller = Controller;
},{"./components/date":5,"./components/default":6,"./components/note":8,"./components/note-list":7}],2:[function(require,module,exports){
"use strict";
var Model = (function () {
    function Model(Store) {
        this.Store = Store;
    }
    Model.prototype.save = function (content) {
        this.Store.add(content);
    };
    Model.prototype.del = function (id) {
        this.Store.del(id);
    };
    Model.prototype.get = function () {
        return this.Store.get();
    };
    Model.prototype.sort = function (value) {
        return this.Store.sort(value);
    };
    return Model;
}());
exports.Model = Model;
},{}],3:[function(require,module,exports){
"use strict";
var View = (function () {
    function View(template) {
        this.template = template;
        this.notesBlock = document.getElementById('root');
        this.inputTitle = document.getElementById('note-input__title');
        this.inputText = document.getElementById('note-input__text');
        this.button = document.getElementById('add-button');
        this.modal = document.getElementById('modal');
        this.modalOpen = document.getElementById('modal-open');
        this.modalClose = document.getElementById('modal-close');
    }
    View.prototype.addElement = function (parent, template) {
        var self = this;
        var newChild = self.template.createElement(template);
        self.template.render(parent, newChild);
        self.modal.className = 'modal';
    };
    View.prototype.deleteElement = function (parent, item) {
        var self = this;
        parent.removeChild(item);
    };
    View.prototype.addEvent = function (event, handler) {
        var self = this;
        if (event === 'addNote') {
            self.button.addEventListener('click', function () {
                var inputTextValue = self.inputText.innerText;
                var inputTitleValue = self.inputTitle.innerText;
                if (inputTextValue.length !== 0 && inputTitleValue.length !== 0) {
                    var phTitle = document.querySelector('.input-text__title');
                    var phText = document.querySelector('.input-text__text');
                    handler({
                        id: Date.now(),
                        title: inputTitleValue,
                        text: inputTextValue
                    });
                    self.inputText.innerText = '';
                    self.inputTitle.innerText = '';
                    phTitle.setAttribute('style', '');
                    phText.setAttribute('style', '');
                }
            });
            self.inputTitle.addEventListener('input', function (e) {
                var placeholder = document.querySelector('.input-text__title');
                if (self.inputTitle.innerText.length !== 0) {
                    placeholder.setAttribute('style', 'display: none');
                }
                else {
                    placeholder.setAttribute('style', '');
                }
            });
            self.inputTitle.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    self.inputText.focus();
                }
            });
            self.inputText.addEventListener('input', function (e) {
                var placeholder = document.querySelector('.input-text__text');
                if (self.inputText.innerText.length !== 0) {
                    placeholder.setAttribute('style', 'display: none');
                }
                else {
                    placeholder.setAttribute('style', '');
                }
            });
        }
        else if (event === 'modal-active') {
            var modalClass_1 = self.modal.className;
            self.modalOpen.addEventListener('click', function () {
                self.modal.className = modalClass_1 + ' active';
            });
            self.modalClose.addEventListener('click', function () {
                self.modal.className = modalClass_1;
            });
        }
        else if (event === 'search') {
            var searchInput = document.getElementById('search-input');
            searchInput.addEventListener('input', function (e) {
                handler(e.target.value);
            });
        }
    };
    return View;
}());
exports.View = View;
},{}],4:[function(require,module,exports){
"use strict";
var Controller_1 = require('./Controller');
var Model_1 = require('./Model');
var store_1 = require('./store');
var template_1 = require('./template');
var View_1 = require('./View');
var Keeper = (function () {
    function Keeper() {
        this.store = new store_1.Store('note-app-store');
        this.model = new Model_1.Model(this.store);
        this.template = new template_1.Template();
        this.view = new View_1.View(this.template);
        this.controller = new Controller_1.Controller(this.model, this.view);
    }
    return Keeper;
}());
var KeeperApp = new Keeper();
},{"./Controller":1,"./Model":2,"./View":3,"./store":9,"./template":10}],5:[function(require,module,exports){
"use strict";
var DateComponent = (function () {
    function DateComponent() {
    }
    DateComponent.prototype.createDate = function () {
        var newDate = new Date();
        return newDate;
    };
    DateComponent.prototype.getDate = function () {
        return this.createDate().getDate();
    };
    DateComponent.prototype.getMonth = function () {
        return this.createDate().getMonth();
    };
    DateComponent.prototype.getYear = function () {
        return this.createDate().getFullYear();
    };
    DateComponent.prototype.getDay = function () {
        return this.createDate().getDay();
    };
    DateComponent.prototype.returnFullDay = function () {
        var day = this.getDay();
        var date = this.getDate();
        var days = {
            0: 'Sunday',
            1: 'Monday',
            2: 'Tuesday',
            3: 'Wednesday',
            4: 'Thursday',
            5: 'Friday',
            6: 'Saturday'
        };
        return date + ' ' + days[day];
    };
    DateComponent.prototype.returnMonthWithYear = function () {
        var month = this.getMonth();
        var year = this.getYear();
        var months = {
            0: 'January',
            1: 'February',
            2: 'March',
            3: 'April',
            4: 'May',
            5: 'June',
            6: 'July',
            7: 'August',
            8: 'September',
            9: 'October',
            10: 'November',
            11: 'December'
        };
        return months[month] + ' ' + year;
    };
    DateComponent.prototype.render = function () {
        var helper = function (type, props, children) {
            return { type: type, props: props, children: children };
        };
        var fullDay = this.returnFullDay();
        var Date = this.returnMonthWithYear();
        var template = (helper('div', { className: 'date' }, [
            helper('div', { className: 'date-day' }, [fullDay]),
            helper('div', { className: 'date-month' }, [Date])
        ]));
        return template;
    };
    return DateComponent;
}());
exports.DateComponent = DateComponent;
},{}],6:[function(require,module,exports){
"use strict";
var DefaultItem = (function () {
    function DefaultItem() {
    }
    DefaultItem.prototype.render = function () {
        var helper = function (type, props, children) {
            return { type: type, props: props, children: children };
        };
        var t = (helper('div', { className: 'default-text' }, ['Note list is empty']));
        return t;
    };
    return DefaultItem;
}());
exports.DefaultItem = DefaultItem;
},{}],7:[function(require,module,exports){
"use strict";
var NoteList = (function () {
    function NoteList() {
    }
    NoteList.prototype.clearNoteList = function (event) {
        var root = document.getElementById('root');
        var childs = root.childNodes;
        var ch = Array.prototype.slice.call(childs);
        ch.map(function (elem) {
            if (elem.getAttribute('class') === 'note-grid') {
                event(elem);
            }
        });
    };
    NoteList.prototype.render = function () {
        var helper = function (type, props, children) {
            return { type: type, props: props, children: children };
        };
        var t = (helper('div', { id: 'root' }, [
            helper('div', { className: 'note-sizing' }, [''])
        ]));
        return t;
    };
    return NoteList;
}());
exports.NoteList = NoteList;
},{}],8:[function(require,module,exports){
"use strict";
var Note = (function () {
    function Note() {
    }
    Note.prototype.render = function (data, event) {
        var helper = function (type, props, children) {
            return { type: type, props: props, children: children };
        };
        var t = (helper('div', { className: 'note-grid', key: data.id }, [
            helper('div', { className: 'note' }, [
                helper('div', { className: 'note-close', onClick: function (e) { event(e.path[3]); } }, [
                    helper('i', { className: 'fa fa-close' }, [''])
                ]),
                helper('div', { className: 'note__title' }, [
                    data.title
                ]),
                helper('div', { className: 'note__text' }, [
                    data.text
                ])
            ])
        ]));
        return t;
    };
    return Note;
}());
exports.Note = Note;
},{}],9:[function(require,module,exports){
"use strict";
var Store = (function () {
    function Store(name) {
        this.name = name;
    }
    Store.prototype.add = function (content) {
        if (localStorage.getItem(this.name)) {
            var myStore = JSON.parse(localStorage.getItem(this.name));
            myStore.push(content);
            localStorage.setItem(this.name, JSON.stringify(myStore));
        }
        else {
            var myStore = [];
            myStore.push(content);
            localStorage.setItem(this.name, JSON.stringify(myStore));
        }
    };
    Store.prototype.del = function (id) {
        var myStore = JSON.parse(localStorage.getItem(this.name));
        var newStore = myStore.filter(function (item) { return item.id !== +id; });
        localStorage.setItem(this.name, JSON.stringify(newStore));
    };
    Store.prototype.get = function () {
        var content = JSON.parse(localStorage.getItem(this.name));
        return content;
    };
    Store.prototype.sort = function (value) {
        var myStore = JSON.parse(localStorage.getItem(this.name));
        var newStore = myStore.filter(function (item) {
            if (item.title.indexOf(value) !== -1 || item.text.indexOf(value) !== -1) {
                return true;
            }
            return false;
        });
        return newStore;
    };
    return Store;
}());
exports.Store = Store;
},{}],10:[function(require,module,exports){
"use strict";
var Template = (function () {
    function Template() {
    }
    Template.prototype.setProp = function (elem, name, prop) {
        if (this.isCustomProp(name)) {
            return;
        }
        else if (name === 'className') {
            elem.setAttribute('class', prop);
        }
        else {
            elem.setAttribute(name, prop);
        }
    };
    Template.prototype.setProps = function (elem, props) {
        var self = this;
        Object.keys(props).forEach(function (name) {
            self.setProp(elem, name, props[name]);
        });
    };
    Template.prototype.isEventProp = function (name) {
        return /^on/.test(name);
    };
    Template.prototype.isCustomProp = function (name) {
        return this.isEventProp(name);
    };
    Template.prototype.getEventName = function (prop) {
        return prop.slice(2).toLowerCase();
    };
    Template.prototype.addEvent = function (elem, props) {
        var self = this;
        Object.keys(props).forEach(function (name) {
            if (self.isEventProp(name)) {
                elem.addEventListener(self.getEventName(name), props[name]);
            }
        });
    };
    Template.prototype.createElement = function (node) {
        var self = this;
        if (typeof node === 'string') {
            return document.createTextNode(node);
        }
        var elem = document.createElement(node.type);
        self.setProps(elem, node.props);
        self.addEvent(elem, node.props);
        node.children
            .map(function (item) { return self.createElement(item); })
            .forEach(function (item) {
            elem.appendChild(item);
        });
        return elem;
    };
    Template.prototype.render = function (parent, newChild) {
        parent.insertBefore(newChild, parent.firstChild);
    };
    return Template;
}());
exports.Template = Template;
},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9Db250cm9sbGVyLnRzIiwianMvTW9kZWwudHMiLCJqcy9WaWV3LnRzIiwianMvYXBwLnRzIiwianMvY29tcG9uZW50cy9kYXRlLnRzIiwianMvY29tcG9uZW50cy9kZWZhdWx0LnRzIiwianMvY29tcG9uZW50cy9ub3RlLWxpc3QudHMiLCJqcy9jb21wb25lbnRzL25vdGUudHMiLCJqcy9zdG9yZS50cyIsImpzL3RlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsNENBQTRDOztBQUU1QyxxQkFBNEIsbUJBQW1CLENBQUMsQ0FBQTtBQUNoRCxxQkFBbUIsbUJBQW1CLENBQUMsQ0FBQTtBQUN2QywwQkFBdUIsd0JBQXdCLENBQUMsQ0FBQTtBQUNoRCx3QkFBMEIsc0JBQXNCLENBQUMsQ0FBQTtBQUVqRDtJQU1DLG9CQUFZLEtBQVMsRUFBRSxJQUFTO1FBQy9CLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDbkMsWUFBWSxFQUFFLFlBQVk7WUFDMUIsV0FBVyxFQUFFLGNBQWM7WUFDM0IsZUFBZSxFQUFFLElBQUk7U0FDckIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxVQUFTLElBQVE7WUFDOUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztRQUNILElB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QUMxRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxRQUFRO2FBQ1osR0FBRyxDQUFDLFVBQUMsSUFBUSxJQUFLLE9BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQzthQUMzQyxPQUFPLENBQUMsVUFBUyxJQUFRO1lBQ3pCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsSUFBSSxDQUFBO0lBQ1osQ0FBQztJQUVELHlCQUFNLEdBQU4sVUFBTyxNQUFrQixFQUFFLFFBQW9CO1FBQzlDLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ0YsZUFBQztBQUFELENBL0RBLEFBK0RDLElBQUE7QUEvRFksZ0JBQVEsV0ErRHBCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm1hc29ucnktbGF5b3V0LmQudHNcIiAvPlxyXG5cclxuaW1wb3J0IHtEYXRlQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZGF0ZSc7XHJcbmltcG9ydCB7Tm90ZX0gZnJvbSAnLi9jb21wb25lbnRzL25vdGUnO1xyXG5pbXBvcnQge05vdGVMaXN0fSBmcm9tICcuL2NvbXBvbmVudHMvbm90ZS1saXN0JztcclxuaW1wb3J0IHtEZWZhdWx0SXRlbX0gZnJvbSAnLi9jb21wb25lbnRzL2RlZmF1bHQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbnRyb2xsZXIge1xyXG5cdE1vZGVsOiBhbnk7XHJcblx0VmlldzogYW55O1xyXG5cdE1hc29ucnk6IGFueTtcclxuXHRlbW1pdEV2ZW50OiBhbnk7XHJcblx0ZGVmYXVsdDogYW55O1xyXG5cdGNvbnN0cnVjdG9yKE1vZGVsOmFueSwgVmlldzogYW55KSB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHR0aGlzLk1vZGVsID0gTW9kZWw7XHJcblx0XHR0aGlzLlZpZXcgPSBWaWV3O1xyXG5cdFx0c2VsZi5kZWZhdWx0TG9hZCgpO1xyXG5cdFx0dGhpcy5NYXNvbnJ5ID0gbmV3IE1hc29ucnkoJyNyb290Jywge1xyXG5cdFx0XHRpdGVtU2VsZWN0b3I6ICcubm90ZS1ncmlkJyxcclxuXHRcdFx0Y29sdW1uV2lkdGg6ICcubm90ZS1zaXppbmcnLFxyXG5cdFx0XHRwZXJjZW50UG9zaXRpb246IHRydWVcclxuXHRcdH0pO1xyXG5cdFx0c2VsZi5sYXlvdXQoKTtcclxuXHRcdHNlbGYucmVuZGVyRGF0ZSgpO1xyXG5cdFx0c2VsZi5WaWV3LmFkZEV2ZW50KCdhZGROb3RlJywgZnVuY3Rpb24oaXRlbTphbnkpIHtcclxuXHRcdFx0c2VsZi5jcmVhdGVOb3RlKGl0ZW0pO1xyXG5cdFx0fSk7XHJcblx0XHRzZWxmLlZpZXcuYWRkRXZlbnQoJ21vZGFsLWFjdGl2ZScpO1xyXG5cdFx0c2VsZi5WaWV3LmFkZEV2ZW50KCdzZWFyY2gnLCBmdW5jdGlvbih2YWx1ZTpzdHJpbmcpIHtcclxuXHRcdFx0c2VsZi5zZWFyY2hOb3RlKHZhbHVlKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZGVmYXVsdExvYWQoKTogYW55IHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdGxldCBhcHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyk7XHJcblx0XHRsZXQgbm90ZUxpc3QgPSBuZXcgTm90ZUxpc3QoKTtcclxuXHRcdGxldCBjb250ZW50OiBhbnlbXSA9IHNlbGYuTW9kZWwuZ2V0KCkgfHwgW107XHJcblx0XHRzZWxmLlZpZXcuYWRkRWxlbWVudChhcHAsIG5vdGVMaXN0LnJlbmRlcigpKTtcclxuXHJcblx0XHRpZiAoY29udGVudC5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0bGV0IGRlZmF1bHRJdGVtID0gbmV3IERlZmF1bHRJdGVtKCk7XHJcblx0XHRcdGxldCB0ZW1wbGF0ZSA9IGRlZmF1bHRJdGVtLnJlbmRlcigpO1xyXG5cdFx0XHRsZXQgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcclxuXHJcblx0XHRcdHNlbGYuVmlldy5hZGRFbGVtZW50KHBhcmVudCwgdGVtcGxhdGUpO1xyXG5cclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblx0XHRjb250ZW50Lm1hcChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdGxldCBub3RlID0gbmV3IE5vdGUoKTtcclxuXHRcdFx0bGV0IHRlbXBsYXRlID0gbm90ZS5yZW5kZXIoaXRlbSwgc2VsZi5kZWxldGVOb3RlLmJpbmQoc2VsZikpO1xyXG5cdFx0XHRsZXQgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcclxuXHJcblx0XHRcdHNlbGYuVmlldy5hZGRFbGVtZW50KHBhcmVudCwgdGVtcGxhdGUpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRsYXlvdXQoKTp2b2lkIHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdHNlbGYuTWFzb25yeS5yZWxvYWRJdGVtcygpO1xyXG5cdFx0c2VsZi5NYXNvbnJ5LmxheW91dCgpO1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlTm90ZShpdGVtOiBhbnkpOiB2b2lkIHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdGxldCBub3RlID0gbmV3IE5vdGUoKTtcclxuXHRcdGxldCB0ZW1wbGF0ZSA9IG5vdGUucmVuZGVyKGl0ZW0sIHNlbGYuZGVsZXRlTm90ZS5iaW5kKHNlbGYpKTtcclxuXHRcdGxldCByb290OkhUTUxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcclxuXHRcdGxldCBkZWZhdWx0Q29udGFpbmVyOkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVmYXVsdC10ZXh0Jyk7XHJcblx0XHRpZiAoZGVmYXVsdENvbnRhaW5lciApIHtcclxuXHRcdFx0cm9vdC5yZW1vdmVDaGlsZChkZWZhdWx0Q29udGFpbmVyKTtcclxuXHRcdH1cclxuXHJcblx0XHRzZWxmLlZpZXcuYWRkRWxlbWVudChyb290LCB0ZW1wbGF0ZSk7XHJcblx0XHRzZWxmLk1vZGVsLnNhdmUoaXRlbSk7XHJcblxyXG5cdFx0c2VsZi5NYXNvbnJ5LnJlbG9hZEl0ZW1zKCk7XHJcblx0XHRzZWxmLk1hc29ucnkubGF5b3V0KCk7XHJcblx0fVxyXG5cclxuXHRkZWxldGVOb3RlKGl0ZW06IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHRsZXQgcm9vdDpIVE1MRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290Jyk7XHJcblxyXG5cdFx0c2VsZi5WaWV3LmRlbGV0ZUVsZW1lbnQocm9vdCwgaXRlbSk7XHJcblx0XHRzZWxmLk1vZGVsLmRlbChpdGVtLmdldEF0dHJpYnV0ZSgna2V5JykpO1xyXG5cclxuXHRcdGxldCBjb250ZW50OiBhbnlbXSA9IHNlbGYuTW9kZWwuZ2V0KCk7XHJcblx0XHRpZiAoY29udGVudC5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0bGV0IGRlZmF1bHRJdGVtID0gbmV3IERlZmF1bHRJdGVtKCk7XHJcblx0XHRcdGxldCB0ZW1wbGF0ZSA9IGRlZmF1bHRJdGVtLnJlbmRlcigpO1xyXG5cdFx0XHRzZWxmLlZpZXcuYWRkRWxlbWVudChyb290LCB0ZW1wbGF0ZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi5NYXNvbnJ5LnJlbG9hZEl0ZW1zKCk7XHJcblx0XHRzZWxmLk1hc29ucnkubGF5b3V0KCk7XHJcblx0fVxyXG5cclxuXHRoaWRlTm90ZShpdGVtOiBIVE1MRWxlbWVudCkge1xyXG5cdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cdFx0bGV0IHJvb3Q6SFRNTEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpO1xyXG5cdFx0c2VsZi5WaWV3LmRlbGV0ZUVsZW1lbnQocm9vdCwgaXRlbSk7XHJcblx0fVxyXG5cclxuXHRzZWFyY2hOb3RlKHZhbHVlOiBzdHJpbmcpIDp2b2lkIHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdGxldCByb290OkhUTUxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcclxuXHRcdGxldCBhbGxOb3RlczphbnlbXSA9IHNlbGYuTW9kZWwuZ2V0KCk7XHJcblx0XHRsZXQgcmVzdWx0ID0gc2VsZi5Nb2RlbC5zb3J0KHZhbHVlKTtcclxuXHRcdGxldCBub3RlTGlzdCA9IG5ldyBOb3RlTGlzdCgpO1xyXG5cdFx0bGV0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG5cclxuXHRcdG5vdGVMaXN0LmNsZWFyTm90ZUxpc3Qoc2VsZi5oaWRlTm90ZS5iaW5kKHNlbGYpKTtcclxuXHRcdFxyXG5cdFx0aWYgKHZhbHVlLmxlbmd0aCAhPT0gMCkge1xyXG5cdFx0XHRyZXN1bHQubWFwKChpdGVtOmFueSkgPT4ge1xyXG5cdFx0XHRcdGxldCB0ZW1wbGF0ZSA9IG5vdGUucmVuZGVyKGl0ZW0sIHNlbGYuZGVsZXRlTm90ZS5iaW5kKHNlbGYpKTtcclxuXHRcdFx0XHRzZWxmLlZpZXcuYWRkRWxlbWVudChyb290LCB0ZW1wbGF0ZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0YWxsTm90ZXMubWFwKChpdGVtOmFueSkgPT4ge1xyXG5cdFx0XHRcdGxldCB0ZW1wbGF0ZSA9IG5vdGUucmVuZGVyKGl0ZW0sIHNlbGYuZGVsZXRlTm90ZS5iaW5kKHNlbGYpKTtcclxuXHRcdFx0XHRzZWxmLlZpZXcuYWRkRWxlbWVudChyb290LCB0ZW1wbGF0ZSk7XHRcclxuXHRcdFx0fSk7XHJcblx0XHR9IFxyXG5cdFx0c2VsZi5sYXlvdXQoKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlckRhdGUoKTp2b2lkIHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdGxldCByb290OkhUTUxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RhdGUtY29udGFpbmVyJyk7XHJcblx0XHRsZXQgZGF0ZSA9IG5ldyBEYXRlQ29tcG9uZW50KCk7XHJcblx0XHRsZXQgdGVtcGxhdGUgPSBkYXRlLnJlbmRlcigpO1xyXG5cdFx0c2VsZi5WaWV3LmFkZEVsZW1lbnQocm9vdCwgdGVtcGxhdGUpO1xyXG5cdH1cclxufSIsImV4cG9ydCBjbGFzcyBNb2RlbCB7XHJcblx0U3RvcmU6YW55O1xyXG5cdGNvbnN0cnVjdG9yKFN0b3JlOmFueSkge1xyXG5cdFx0dGhpcy5TdG9yZSA9IFN0b3JlO1xyXG5cdH1cclxuXHRzYXZlKGNvbnRlbnQ6IGFueSk6IHZvaWQge1xyXG5cdFx0dGhpcy5TdG9yZS5hZGQoY29udGVudCk7XHJcblx0fVxyXG5cdGRlbChpZDogc3RyaW5nKTogdm9pZCB7XHJcblx0XHR0aGlzLlN0b3JlLmRlbChpZCk7XHJcblx0fVxyXG5cdGdldCgpOmFueSB7XHJcblx0XHRyZXR1cm4gdGhpcy5TdG9yZS5nZXQoKTtcclxuXHR9XHJcblx0c29ydCh2YWx1ZTpzdHJpbmcpIHtcclxuXHRcdHJldHVybiB0aGlzLlN0b3JlLnNvcnQodmFsdWUpO1xyXG5cdH1cclxufSIsImV4cG9ydCBjbGFzcyBWaWV3IHtcclxuXHR0ZW1wbGF0ZTogYW55O1xyXG5cdG5vdGVzQmxvY2s6IEhUTUxFbGVtZW50O1xyXG5cdGlucHV0VGl0bGU6IEhUTUxFbGVtZW50O1xyXG5cdGlucHV0VGV4dDogSFRNTEVsZW1lbnQ7XHJcblx0YnV0dG9uOiBIVE1MRWxlbWVudDtcclxuXHRtb2RhbDogSFRNTEVsZW1lbnQ7XHJcblx0bW9kYWxPcGVuOiBIVE1MRWxlbWVudDtcclxuXHRtb2RhbENsb3NlOiBIVE1MRWxlbWVudDtcclxuXHJcblx0Y29uc3RydWN0b3IodGVtcGxhdGU6YW55KSB7XHJcblx0XHR0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGU7XHJcblx0XHR0aGlzLm5vdGVzQmxvY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpO1xyXG5cdFx0dGhpcy5pbnB1dFRpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25vdGUtaW5wdXRfX3RpdGxlJyk7XHJcblx0XHR0aGlzLmlucHV0VGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdub3RlLWlucHV0X190ZXh0Jyk7XHJcblx0XHR0aGlzLmJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGQtYnV0dG9uJyk7XHJcblx0XHR0aGlzLm1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsJyk7XHJcblx0XHR0aGlzLm1vZGFsT3BlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1vcGVuJyk7XHJcblx0XHR0aGlzLm1vZGFsQ2xvc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtY2xvc2UnKTtcclxuXHR9XHJcblxyXG5cdGFkZEVsZW1lbnQocGFyZW50OkhUTUxFbGVtZW50LCB0ZW1wbGF0ZTogYW55KTogdm9pZCB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHRsZXQgbmV3Q2hpbGQgPSBzZWxmLnRlbXBsYXRlLmNyZWF0ZUVsZW1lbnQodGVtcGxhdGUpO1xyXG5cdFx0c2VsZi50ZW1wbGF0ZS5yZW5kZXIocGFyZW50LCBuZXdDaGlsZCk7XHJcblx0XHRzZWxmLm1vZGFsLmNsYXNzTmFtZSA9ICdtb2RhbCc7XHJcblx0fVxyXG5cclxuXHRkZWxldGVFbGVtZW50KHBhcmVudDpIVE1MRWxlbWVudCwgaXRlbTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdHBhcmVudC5yZW1vdmVDaGlsZChpdGVtKTtcclxuXHR9XHJcblxyXG5cdGFkZEV2ZW50KGV2ZW50OiBzdHJpbmcsIGhhbmRsZXI6IGFueSk6IHZvaWQge1xyXG5cdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cdFx0aWYgKGV2ZW50ID09PSAnYWRkTm90ZScpIHtcclxuXHRcdFx0c2VsZi5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHsgXHJcblx0XHRcdFx0bGV0IGlucHV0VGV4dFZhbHVlID0gc2VsZi5pbnB1dFRleHQuaW5uZXJUZXh0O1xyXG5cdFx0XHRcdGxldCBpbnB1dFRpdGxlVmFsdWUgPSBzZWxmLmlucHV0VGl0bGUuaW5uZXJUZXh0O1xyXG5cclxuXHRcdFx0XHRpZiAoaW5wdXRUZXh0VmFsdWUubGVuZ3RoICE9PSAwICYmIGlucHV0VGl0bGVWYWx1ZS5sZW5ndGggIT09IDApIHtcclxuXHRcdFx0XHRcdGxldCBwaFRpdGxlOkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW5wdXQtdGV4dF9fdGl0bGUnKTtcclxuXHRcdFx0XHRcdGxldCBwaFRleHQ6RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pbnB1dC10ZXh0X190ZXh0Jyk7XHJcblx0XHRcdFx0XHRoYW5kbGVyKHtcclxuXHRcdFx0XHRcdFx0aWQ6IERhdGUubm93KCksXHJcblx0XHRcdFx0XHRcdHRpdGxlOiBpbnB1dFRpdGxlVmFsdWUsXHJcblx0XHRcdFx0XHRcdHRleHQ6IGlucHV0VGV4dFZhbHVlXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRzZWxmLmlucHV0VGV4dC5pbm5lclRleHQgPSAnJztcclxuXHRcdFx0XHRcdHNlbGYuaW5wdXRUaXRsZS5pbm5lclRleHQgPSAnJztcclxuXHRcdFx0XHRcdHBoVGl0bGUuc2V0QXR0cmlidXRlKCdzdHlsZScsICcnKTtcclxuXHRcdFx0XHRcdHBoVGV4dC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHNlbGYuaW5wdXRUaXRsZS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRcdGxldCBwbGFjZWhvbGRlcjpFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmlucHV0LXRleHRfX3RpdGxlJyk7XHJcblx0XHRcdFx0XHRpZiAoc2VsZi5pbnB1dFRpdGxlLmlubmVyVGV4dC5sZW5ndGggIT09IDAgKSB7XHJcblx0XHRcdFx0XHRcdHBsYWNlaG9sZGVyLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTogbm9uZScpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cGxhY2Vob2xkZXIuc2V0QXR0cmlidXRlKCdzdHlsZScsICcnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHNlbGYuaW5wdXRUaXRsZS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdFx0aWYgKGUua2V5ID09PSAnRW50ZXInKSB7XHJcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdFx0c2VsZi5pbnB1dFRleHQuZm9jdXMoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHNlbGYuaW5wdXRUZXh0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdFx0bGV0IHBsYWNlaG9sZGVyOkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW5wdXQtdGV4dF9fdGV4dCcpO1xyXG5cdFx0XHRcdFx0aWYgKHNlbGYuaW5wdXRUZXh0LmlubmVyVGV4dC5sZW5ndGggIT09IDAgKSB7XHJcblx0XHRcdFx0XHRcdHBsYWNlaG9sZGVyLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTogbm9uZScpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cGxhY2Vob2xkZXIuc2V0QXR0cmlidXRlKCdzdHlsZScsICcnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fSBlbHNlIGlmIChldmVudCA9PT0gJ21vZGFsLWFjdGl2ZScpIHtcclxuXHRcdFx0bGV0IG1vZGFsQ2xhc3MgPSBzZWxmLm1vZGFsLmNsYXNzTmFtZTtcclxuXHJcblx0XHRcdHNlbGYubW9kYWxPcGVuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7IFxyXG5cdFx0XHRcdHNlbGYubW9kYWwuY2xhc3NOYW1lID0gbW9kYWxDbGFzcyArICcgYWN0aXZlJztcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRzZWxmLm1vZGFsQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHsgXHJcblx0XHRcdFx0c2VsZi5tb2RhbC5jbGFzc05hbWUgPSBtb2RhbENsYXNzO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSBpZiAoZXZlbnQgPT09ICdzZWFyY2gnKSB7XHJcblx0XHRcdGxldCBzZWFyY2hJbnB1dDpIVE1MRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtaW5wdXQnKTtcclxuXHRcdFx0c2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0aGFuZGxlcigoPEhUTUxTZWxlY3RFbGVtZW50PmUudGFyZ2V0KS52YWx1ZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxufSIsImltcG9ydCB7Q29udHJvbGxlcn0gZnJvbSAnLi9Db250cm9sbGVyJztcclxuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XHJcbmltcG9ydCB7U3RvcmV9IGZyb20gJy4vc3RvcmUnO1xyXG5pbXBvcnQge1RlbXBsYXRlfSBmcm9tICcuL3RlbXBsYXRlJztcclxuaW1wb3J0IHtWaWV3fSBmcm9tICcuL1ZpZXcnO1xyXG5cclxuY2xhc3MgS2VlcGVyIHtcclxuXHRzdG9yZTogYW55O1xyXG5cdG1vZGVsOiBhbnk7XHJcblx0dGVtcGxhdGU6IGFueTtcclxuXHR2aWV3OiBhbnk7XHJcblx0Y29udHJvbGxlcjogYW55O1xyXG5cdG1hc29ucnk6IGFueTtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuc3RvcmUgPSBuZXcgU3RvcmUoJ25vdGUtYXBwLXN0b3JlJyk7XHJcblx0XHR0aGlzLm1vZGVsID0gbmV3IE1vZGVsKHRoaXMuc3RvcmUpO1xyXG5cdFx0dGhpcy50ZW1wbGF0ZSA9IG5ldyBUZW1wbGF0ZSgpO1xyXG5cdFx0dGhpcy52aWV3ID0gbmV3IFZpZXcodGhpcy50ZW1wbGF0ZSk7XHJcblx0XHR0aGlzLmNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlcih0aGlzLm1vZGVsLCB0aGlzLnZpZXcpO1xyXG5cdH1cclxufVxyXG5sZXQgS2VlcGVyQXBwID0gbmV3IEtlZXBlcigpO1xyXG5cclxuXHJcbiIsImV4cG9ydCBjbGFzcyBEYXRlQ29tcG9uZW50IHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHJcblx0fVxyXG5cclxuXHRjcmVhdGVEYXRlKCk6YW55IHtcclxuXHRcdGxldCBuZXdEYXRlID0gbmV3IERhdGUoKTtcclxuXHRcdHJldHVybiBuZXdEYXRlO1xyXG5cdH1cclxuXHJcblx0Z2V0RGF0ZSgpOmFueSB7XHJcblx0XHRyZXR1cm4gdGhpcy5jcmVhdGVEYXRlKCkuZ2V0RGF0ZSgpO1xyXG5cdH1cclxuXHJcblx0Z2V0TW9udGgoKTphbnkge1xyXG5cdFx0cmV0dXJuIHRoaXMuY3JlYXRlRGF0ZSgpLmdldE1vbnRoKCk7XHJcblx0fVxyXG5cclxuXHRnZXRZZWFyKCk6YW55IHtcclxuXHRcdHJldHVybiB0aGlzLmNyZWF0ZURhdGUoKS5nZXRGdWxsWWVhcigpO1x0XHRcclxuXHR9XHJcblxyXG5cdGdldERheSgpOmFueSB7XHJcblx0XHRyZXR1cm4gdGhpcy5jcmVhdGVEYXRlKCkuZ2V0RGF5KCk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm5GdWxsRGF5KCk6YW55IHtcclxuXHRcdGxldCBkYXk6bnVtYmVyID0gdGhpcy5nZXREYXkoKTtcclxuXHRcdGxldCBkYXRlOm51bWJlciA9IHRoaXMuZ2V0RGF0ZSgpO1xyXG5cdFx0bGV0IGRheXM6YW55ID0ge1xyXG5cdFx0XHQwOiAnU3VuZGF5JyxcclxuXHRcdFx0MTogJ01vbmRheScsXHJcblx0XHRcdDI6ICdUdWVzZGF5JyxcclxuXHRcdFx0MzogJ1dlZG5lc2RheScsXHJcblx0XHRcdDQ6ICdUaHVyc2RheScsXHJcblx0XHRcdDU6ICdGcmlkYXknLFxyXG5cdFx0XHQ2OiAnU2F0dXJkYXknXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuIGRhdGUgKyAnICcgKyBkYXlzW2RheV07XHJcblx0fVxyXG5cclxuXHRyZXR1cm5Nb250aFdpdGhZZWFyKCk6YW55IHtcclxuXHRcdGxldCBtb250aDpudW1iZXIgPSB0aGlzLmdldE1vbnRoKCk7XHJcblx0XHRsZXQgeWVhcjpudW1iZXIgPSB0aGlzLmdldFllYXIoKTtcclxuXHRcdGxldCBtb250aHM6YW55ID0ge1xyXG5cdFx0XHQwOiAnSmFudWFyeScsXHJcblx0XHRcdDE6ICdGZWJydWFyeScsXHJcblx0XHRcdDI6ICdNYXJjaCcsXHJcblx0XHRcdDM6ICdBcHJpbCcsXHJcblx0XHRcdDQ6ICdNYXknLFxyXG5cdFx0XHQ1OiAnSnVuZScsXHJcblx0XHRcdDY6ICdKdWx5JyxcclxuXHRcdFx0NzogJ0F1Z3VzdCcsXHJcblx0XHRcdDg6ICdTZXB0ZW1iZXInLFxyXG5cdFx0XHQ5OiAnT2N0b2JlcicsXHJcblx0XHRcdDEwOiAnTm92ZW1iZXInLFxyXG5cdFx0XHQxMTogJ0RlY2VtYmVyJ1xyXG5cdFx0fTtcclxuXHRcdHJldHVybiBtb250aHNbbW9udGhdICsgJyAnICsgeWVhcjtcclxuXHR9XHJcblxyXG5cdHJlbmRlcigpOmFueSB7XHJcblx0XHRsZXQgaGVscGVyOiBhbnkgPSBmdW5jdGlvbih0eXBlOiBzdHJpbmcsIHByb3BzOiBhbnksIGNoaWxkcmVuOiBhbnkpIHtcclxuXHRcdFx0cmV0dXJuIHsgdHlwZTogdHlwZSwgcHJvcHM6IHByb3BzLCBjaGlsZHJlbjogY2hpbGRyZW4gfVxyXG5cdFx0fTtcclxuXHRcdGxldCBmdWxsRGF5ID0gdGhpcy5yZXR1cm5GdWxsRGF5KCk7XHJcblx0XHRsZXQgRGF0ZSA9IHRoaXMucmV0dXJuTW9udGhXaXRoWWVhcigpO1xyXG5cdFx0Y29uc3QgdGVtcGxhdGU6YW55ID0gKFxyXG5cdFx0XHRoZWxwZXIoJ2RpdicsIHtjbGFzc05hbWU6ICdkYXRlJ30sIFtcclxuXHRcdFx0XHRoZWxwZXIoJ2RpdicsIHtjbGFzc05hbWU6ICdkYXRlLWRheSd9LCBbZnVsbERheV0pLFxyXG5cdFx0XHRcdGhlbHBlcignZGl2Jywge2NsYXNzTmFtZTogJ2RhdGUtbW9udGgnfSwgW0RhdGVdKVxyXG5cdFx0XHRdKVxyXG5cdFx0KTtcclxuXHRcdHJldHVybiB0ZW1wbGF0ZTtcclxuXHR9XHJcbn0iLCJleHBvcnQgY2xhc3MgRGVmYXVsdEl0ZW0ge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cclxuXHR9XHJcblxyXG5cdHJlbmRlcigpOiBhbnkge1xyXG5cdFx0bGV0IGhlbHBlcjogYW55ID0gZnVuY3Rpb24odHlwZTogc3RyaW5nLCBwcm9wczogYW55LCBjaGlsZHJlbjogYW55KSB7XHJcblx0XHRcdHJldHVybiB7IHR5cGU6IHR5cGUsIHByb3BzOiBwcm9wcywgY2hpbGRyZW46IGNoaWxkcmVuIH1cclxuXHRcdH1cclxuXHRcdGNvbnN0IHQgPSAoaGVscGVyKCdkaXYnLCB7Y2xhc3NOYW1lOiAnZGVmYXVsdC10ZXh0J30sIFsnTm90ZSBsaXN0IGlzIGVtcHR5J10pKTtcclxuXHRcdHJldHVybiB0XHJcblx0fVxyXG59IiwiZXhwb3J0IGNsYXNzIE5vdGVMaXN0IHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdFxyXG5cdH1cclxuXHJcblx0Y2xlYXJOb3RlTGlzdChldmVudDphbnkpOmFueSB7XHJcblx0XHRsZXQgcm9vdDpIVE1MRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290Jyk7XHJcblx0XHRsZXQgY2hpbGRzID0gcm9vdC5jaGlsZE5vZGVzO1xyXG5cdFx0bGV0IGNoID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoY2hpbGRzKTtcclxuXHRcdGNoLm1hcChmdW5jdGlvbihlbGVtOkhUTUxFbGVtZW50KSB7XHJcblx0XHRcdGlmKCBlbGVtLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSA9PT0gJ25vdGUtZ3JpZCcpIHtcclxuICBcdFx0XHRldmVudChlbGVtKTtcclxuICBcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIoKTphbnkge1xyXG5cdFx0bGV0IGhlbHBlcjogYW55ID0gZnVuY3Rpb24odHlwZTogc3RyaW5nLCBwcm9wczogYW55LCBjaGlsZHJlbjogYW55KSB7XHJcblx0XHRcdHJldHVybiB7IHR5cGU6IHR5cGUsIHByb3BzOiBwcm9wcywgY2hpbGRyZW46IGNoaWxkcmVuIH1cclxuXHRcdH07XHJcblx0XHRjb25zdCB0ID0gKFxyXG5cdFx0XHRoZWxwZXIoJ2RpdicsIHtpZDogJ3Jvb3QnfSwgW1xyXG5cdFx0XHRcdGhlbHBlcignZGl2Jywge2NsYXNzTmFtZTogJ25vdGUtc2l6aW5nJ30sIFsnJ10pXHJcblx0XHRcdF0pXHJcblx0XHQpO1xyXG5cdFx0cmV0dXJuIHRcclxuXHR9XHJcbn0iLCJleHBvcnQgY2xhc3MgTm90ZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblxyXG5cdH1cclxuXHJcblx0cmVuZGVyKGRhdGE6YW55LCBldmVudDphbnkpOmFueSB7XHJcblx0XHRsZXQgaGVscGVyOiBhbnkgPSBmdW5jdGlvbih0eXBlOiBzdHJpbmcsIHByb3BzOiBhbnksIGNoaWxkcmVuOiBhbnkpIHtcclxuXHRcdFx0cmV0dXJuIHsgdHlwZTogdHlwZSwgcHJvcHM6IHByb3BzLCBjaGlsZHJlbjogY2hpbGRyZW4gfVxyXG5cdFx0fTtcclxuXHRcdGNvbnN0IHQgPSAoXHJcblx0XHRcdGhlbHBlcignZGl2Jywge2NsYXNzTmFtZTogJ25vdGUtZ3JpZCcsIGtleTogZGF0YS5pZH0sIFtcclxuXHRcdFx0XHRoZWxwZXIoJ2RpdicsIHtjbGFzc05hbWU6ICdub3RlJ30sIFtcclxuXHRcdFx0XHRcdGhlbHBlcignZGl2JywgeyBjbGFzc05hbWU6ICdub3RlLWNsb3NlJywgb25DbGljazogKGU6YW55KSA9PiB7IGV2ZW50KGUucGF0aFszXSk7IH0gfSwgW1xyXG5cdFx0XHRcdFx0XHRoZWxwZXIoJ2knLCB7Y2xhc3NOYW1lOiAnZmEgZmEtY2xvc2UnfSwgWycnXSlcclxuXHRcdFx0XHRcdF0pLFxyXG5cdFx0XHRcdFx0aGVscGVyKCdkaXYnLCB7Y2xhc3NOYW1lOiAnbm90ZV9fdGl0bGUnfSwgW1xyXG5cdFx0XHRcdFx0XHRkYXRhLnRpdGxlXHJcblx0XHRcdFx0XHRdKSxcclxuXHRcdFx0XHRcdGhlbHBlcignZGl2Jywge2NsYXNzTmFtZTogJ25vdGVfX3RleHQnfSwgW1xyXG5cdFx0XHRcdFx0XHRkYXRhLnRleHRcclxuXHRcdFx0XHRcdF0pXHJcblx0XHRcdFx0XSlcclxuXHRcdFx0XSlcclxuXHRcdCk7XHJcblx0XHRyZXR1cm4gdFxyXG5cdH1cclxufSIsImV4cG9ydCBjbGFzcyBTdG9yZSB7XHJcblx0bmFtZTogc3RyaW5nXHJcblx0Y29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XHJcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xyXG5cdH1cclxuXHRhZGQoY29udGVudDphbnkpOiB2b2lkIHtcclxuXHRcdGlmICggbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5uYW1lKSApIHtcclxuXHRcdFx0bGV0IG15U3RvcmUgPSAoPGFueT5KU09OKS5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLm5hbWUpKTtcclxuXHRcdFx0bXlTdG9yZS5wdXNoKGNvbnRlbnQpO1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLm5hbWUsICg8YW55PkpTT04pLnN0cmluZ2lmeShteVN0b3JlKSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgbXlTdG9yZTphbnlbXSA9IFtdO1xyXG5cdFx0XHRteVN0b3JlLnB1c2goY29udGVudCk7XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubmFtZSwgKDxhbnk+SlNPTikuc3RyaW5naWZ5KG15U3RvcmUpKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRlbChpZDpzdHJpbmcpOiB2b2lkIHtcclxuXHRcdGxldCBteVN0b3JlID0gKDxhbnk+SlNPTikucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5uYW1lKSk7XHJcblx0XHRsZXQgbmV3U3RvcmUgPSBteVN0b3JlLmZpbHRlcigoaXRlbTogYW55KSA9PiBpdGVtLmlkICE9PSAraWQpO1xyXG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5uYW1lLCAoPGFueT5KU09OKS5zdHJpbmdpZnkobmV3U3RvcmUpKTtcclxuXHR9XHJcblxyXG5cdGdldCgpOiBhbnkge1xyXG5cdFx0bGV0IGNvbnRlbnQgPSAoPGFueT5KU09OKS5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLm5hbWUpKTtcclxuXHRcdHJldHVybiBjb250ZW50XHJcblx0fVxyXG5cclxuXHRzb3J0KHZhbHVlOiBzdHJpbmcpIDphbnkge1xyXG5cdFx0bGV0IG15U3RvcmUgPSAoPGFueT5KU09OKS5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLm5hbWUpKTtcclxuXHRcdGxldCBuZXdTdG9yZSA9IG15U3RvcmUuZmlsdGVyKChpdGVtOiBhbnkpID0+IHtcclxuXHRcdFx0aWYgKGl0ZW0udGl0bGUuaW5kZXhPZih2YWx1ZSkgIT09IC0xIHx8IGl0ZW0udGV4dC5pbmRleE9mKHZhbHVlKSAhPT0gLTEpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3U3RvcmU7XHJcblx0fVxyXG59IiwiZXhwb3J0IGNsYXNzIFRlbXBsYXRlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHJcblx0fVxyXG5cclxuXHRzZXRQcm9wKGVsZW06IEhUTUxFbGVtZW50LCBuYW1lOiBzdHJpbmcsIHByb3A6IHN0cmluZyk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuaXNDdXN0b21Qcm9wKG5hbWUpKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fSBlbHNlIGlmIChuYW1lID09PSAnY2xhc3NOYW1lJykge1xyXG5cdFx0XHRlbGVtLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBwcm9wKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGVsZW0uc2V0QXR0cmlidXRlKG5hbWUsIHByb3ApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2V0UHJvcHMoZWxlbTogSFRNTEVsZW1lbnQsIHByb3BzOiBhbnkpOiB2b2lkIHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdE9iamVjdC5rZXlzKHByb3BzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgIFx0c2VsZi5zZXRQcm9wKGVsZW0sIG5hbWUsIHByb3BzW25hbWVdKTtcclxuICBcdH0pO1xyXG5cdH1cclxuXHJcblx0aXNFdmVudFByb3AobmFtZTpzdHJpbmcpOiBhbnkge1xyXG4gICAgcmV0dXJuIC9eb24vLnRlc3QobmFtZSlcclxuXHR9XHJcblxyXG5cdGlzQ3VzdG9tUHJvcChuYW1lOnN0cmluZyk6YW55IHtcclxuXHRcdHJldHVybiB0aGlzLmlzRXZlbnRQcm9wKG5hbWUpXHJcblx0fVxyXG5cclxuXHRnZXRFdmVudE5hbWUocHJvcDogc3RyaW5nKTogYW55IHtcclxuXHRcdHJldHVybiBwcm9wLnNsaWNlKDIpLnRvTG93ZXJDYXNlKClcclxuXHR9XHJcblxyXG5cdGFkZEV2ZW50KGVsZW06SFRNTEVsZW1lbnQsIHByb3BzOiBhbnkpOiB2b2lkIHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdE9iamVjdC5rZXlzKHByb3BzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdFx0aWYgKHNlbGYuaXNFdmVudFByb3AobmFtZSkpIHtcclxuXHRcdFx0XHRlbGVtLmFkZEV2ZW50TGlzdGVuZXIoc2VsZi5nZXRFdmVudE5hbWUobmFtZSksIHByb3BzW25hbWVdKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRjcmVhdGVFbGVtZW50KG5vZGU6IGFueSk6IGFueSB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHRpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShub2RlKVxyXG5cdFx0fVxyXG5cdFx0bGV0IGVsZW06IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlLnR5cGUpO1xyXG5cdFx0c2VsZi5zZXRQcm9wcyhlbGVtLCBub2RlLnByb3BzKTtcclxuXHRcdHNlbGYuYWRkRXZlbnQoZWxlbSwgbm9kZS5wcm9wcyk7XHJcblx0XHRub2RlLmNoaWxkcmVuXHJcblx0XHQubWFwKChpdGVtOmFueSkgPT4gc2VsZi5jcmVhdGVFbGVtZW50KGl0ZW0pKVxyXG5cdFx0LmZvckVhY2goZnVuY3Rpb24oaXRlbTphbnkpIHtcclxuXHRcdFx0ZWxlbS5hcHBlbmRDaGlsZChpdGVtKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBlbGVtXHJcblx0fVxyXG5cclxuXHRyZW5kZXIocGFyZW50OkhUTUxFbGVtZW50LCBuZXdDaGlsZDpIVE1MRWxlbWVudCk6IHZvaWQge1xyXG5cdFx0cGFyZW50Lmluc2VydEJlZm9yZShuZXdDaGlsZCwgcGFyZW50LmZpcnN0Q2hpbGQpO1xyXG5cdH1cclxufSJdfQ==
