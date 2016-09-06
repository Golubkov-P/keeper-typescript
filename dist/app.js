(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var date_1 = require('./components/date');
var Controller = (function () {
    function Controller(Model, View, Masonry) {
        var self = this;
        this.Model = Model;
        this.View = View;
        this.Masonry = Masonry;
        self.defaultLoad();
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
        var content = self.Model.get() || [];
        if (content.length === 0) {
            var template = self.View.default();
            var parent_1 = document.getElementById('root');
            self.View.addElement(parent_1, template);
            return;
        }
        content.map(function (item) {
            var template = self.View.note(item, self.deleteNote.bind(self));
            var parent = document.getElementById('root');
            self.View.addElement(parent, template);
        });
        self.Masonry.reloadItems();
        self.Masonry.layout();
    };
    Controller.prototype.createNote = function (item) {
        var self = this;
        var template = self.View.note(item, self.deleteNote.bind(self));
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
            var template = self.View.default();
            self.View.addElement(root, template);
        }
        self.Masonry.reloadItems();
        self.Masonry.layout();
    };
    Controller.prototype.searchNote = function (value) {
        var self = this;
        var root = document.getElementById('root');
        var allNotes = self.Model.get();
        var result = self.Model.sort(value);
        if (value.length !== 0) {
            result.map(function (item) {
                var template = self.View.note(item, self.deleteNote.bind(self));
                self.View.addElement(root, template);
            });
        }
        else {
            allNotes.map(function (item) {
                var template = self.View.note(item, self.deleteNote.bind(self));
                self.View.addElement(root, template);
            });
        }
    };
    Controller.prototype.renderDate = function () {
        var self = this;
        var root = document.getElementById('date-container');
        var date = new date_1.DateComponent();
        var template = date.renderDate();
        self.View.addElement(root, template);
    };
    return Controller;
}());
exports.Controller = Controller;
},{"./components/date":5}],2:[function(require,module,exports){
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
    View.prototype.default = function () {
        var helper = function (type, props, children) {
            return { type: type, props: props, children: children };
        };
        var t = (helper('div', { className: 'default-text' }, ['Note list is empty']));
        return t;
    };
    View.prototype.note = function (data, event) {
        var self = this;
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
/// <reference path="masonry-layout.d.ts" />
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
        this.masonry = new Masonry('#root', {
            itemSelector: '.note-grid',
            columnWidth: '.note-sizing',
            percentPosition: true
        });
        this.controller = new Controller_1.Controller(this.model, this.view, this.masonry);
    }
    return Keeper;
}());
var KeeperApp = new Keeper();
},{"./Controller":1,"./Model":2,"./View":3,"./store":6,"./template":7}],5:[function(require,module,exports){
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
    DateComponent.prototype.renderDate = function () {
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
},{}],7:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9Db250cm9sbGVyLnRzIiwianMvTW9kZWwudHMiLCJqcy9WaWV3LnRzIiwianMvYXBwLnRzIiwianMvY29tcG9uZW50cy9kYXRlLnRzIiwianMvc3RvcmUudHMiLCJqcy90ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSxxQkFBNEIsbUJBQW1CLENBQUMsQ0FBQTtBQUVoRDtJQU1DLG9CQUFZLEtBQVMsRUFBRSxJQUFTLEVBQUUsT0FBWTtRQUM3QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsVUFBUyxJQUFRO1lBQzlDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsVUFBUyxLQUFZO1lBQ2pELElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsZ0NBQVcsR0FBWDtRQUNDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLE9BQU8sR0FBVSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUM1QyxFQUFFLENB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LElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLFFBQVE7YUFDWixHQUFHLENBQUMsVUFBQyxJQUFRLElBQUssT0FBQSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUF4QixDQUF3QixDQUFDO2FBQzNDLE9BQU8sQ0FBQyxVQUFTLElBQVE7WUFDekIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDWixDQUFDO0lBRUQseUJBQU0sR0FBTixVQUFPLE1BQWtCLEVBQUUsUUFBb0I7UUFDOUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFDRixlQUFDO0FBQUQsQ0EvREEsQUErREMsSUFBQTtBQS9EWSxnQkFBUSxXQStEcEIsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge0RhdGVDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9kYXRlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDb250cm9sbGVyIHtcclxuXHRNb2RlbDogYW55O1xyXG5cdFZpZXc6IGFueTtcclxuXHRNYXNvbnJ5OiBhbnk7XHJcblx0ZW1taXRFdmVudDogYW55O1xyXG5cdGRlZmF1bHQ6IGFueTtcclxuXHRjb25zdHJ1Y3RvcihNb2RlbDphbnksIFZpZXc6IGFueSwgTWFzb25yeTogYW55KSB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHR0aGlzLk1vZGVsID0gTW9kZWw7XHJcblx0XHR0aGlzLlZpZXcgPSBWaWV3O1xyXG5cdFx0dGhpcy5NYXNvbnJ5ID0gTWFzb25yeTtcclxuXHRcdHNlbGYuZGVmYXVsdExvYWQoKTtcclxuXHRcdHNlbGYucmVuZGVyRGF0ZSgpO1xyXG5cdFx0c2VsZi5WaWV3LmFkZEV2ZW50KCdhZGROb3RlJywgZnVuY3Rpb24oaXRlbTphbnkpIHtcclxuXHRcdFx0c2VsZi5jcmVhdGVOb3RlKGl0ZW0pO1xyXG5cdFx0fSk7XHJcblx0XHRzZWxmLlZpZXcuYWRkRXZlbnQoJ21vZGFsLWFjdGl2ZScpO1xyXG5cdFx0c2VsZi5WaWV3LmFkZEV2ZW50KCdzZWFyY2gnLCBmdW5jdGlvbih2YWx1ZTpzdHJpbmcpIHtcclxuXHRcdFx0c2VsZi5zZWFyY2hOb3RlKHZhbHVlKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZGVmYXVsdExvYWQoKTogYW55IHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdHZhciBjb250ZW50OiBhbnlbXSA9IHNlbGYuTW9kZWwuZ2V0KCkgfHwgW107XHJcblx0XHRpZiAoY29udGVudC5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0bGV0IHRlbXBsYXRlID0gc2VsZi5WaWV3LmRlZmF1bHQoKTtcclxuXHRcdFx0bGV0IHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290Jyk7XHJcblx0XHRcdHNlbGYuVmlldy5hZGRFbGVtZW50KHBhcmVudCwgdGVtcGxhdGUpO1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHRcdGNvbnRlbnQubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0bGV0IHRlbXBsYXRlID0gc2VsZi5WaWV3Lm5vdGUoaXRlbSwgc2VsZi5kZWxldGVOb3RlLmJpbmQoc2VsZikpO1xyXG5cdFx0XHRsZXQgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcclxuXHRcdFx0c2VsZi5WaWV3LmFkZEVsZW1lbnQocGFyZW50LCB0ZW1wbGF0ZSk7XHJcblx0XHR9KTtcclxuXHRcdHNlbGYuTWFzb25yeS5yZWxvYWRJdGVtcygpO1xyXG5cdFx0c2VsZi5NYXNvbnJ5LmxheW91dCgpO1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlTm90ZShpdGVtOiBhbnkpOiB2b2lkIHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdFxyXG5cdFx0bGV0IHRlbXBsYXRlID0gc2VsZi5WaWV3Lm5vdGUoaXRlbSwgc2VsZi5kZWxldGVOb3RlLmJpbmQoc2VsZikpO1xyXG5cdFx0bGV0IHJvb3Q6SFRNTEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpO1xyXG5cdFx0bGV0IGRlZmF1bHRDb250YWluZXI6RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZWZhdWx0LXRleHQnKTtcclxuXHRcdGlmIChkZWZhdWx0Q29udGFpbmVyICkge1xyXG5cdFx0XHRyb290LnJlbW92ZUNoaWxkKGRlZmF1bHRDb250YWluZXIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYuVmlldy5hZGRFbGVtZW50KHJvb3QsIHRlbXBsYXRlKTtcclxuXHRcdHNlbGYuTW9kZWwuc2F2ZShpdGVtKTtcclxuXHJcblx0XHRzZWxmLk1hc29ucnkucmVsb2FkSXRlbXMoKTtcclxuXHRcdHNlbGYuTWFzb25yeS5sYXlvdXQoKTtcclxuXHR9XHJcblxyXG5cdGRlbGV0ZU5vdGUoaXRlbTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdGxldCByb290OkhUTUxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcclxuXHJcblx0XHRzZWxmLlZpZXcuZGVsZXRlRWxlbWVudChyb290LCBpdGVtKTtcclxuXHRcdHNlbGYuTW9kZWwuZGVsKGl0ZW0uZ2V0QXR0cmlidXRlKCdrZXknKSk7XHJcblxyXG5cdFx0bGV0IGNvbnRlbnQ6IGFueVtdID0gc2VsZi5Nb2RlbC5nZXQoKTtcclxuXHRcdGlmIChjb250ZW50Lmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRsZXQgdGVtcGxhdGUgPSBzZWxmLlZpZXcuZGVmYXVsdCgpO1xyXG5cdFx0XHRzZWxmLlZpZXcuYWRkRWxlbWVudChyb290LCB0ZW1wbGF0ZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi5NYXNvbnJ5LnJlbG9hZEl0ZW1zKCk7XHJcblx0XHRzZWxmLk1hc29ucnkubGF5b3V0KCk7XHJcblx0fVxyXG5cclxuXHRzZWFyY2hOb3RlKHZhbHVlOiBzdHJpbmcpIDp2b2lkIHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdGxldCByb290OkhUTUxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcclxuXHRcdGxldCBhbGxOb3RlczphbnlbXSA9IHNlbGYuTW9kZWwuZ2V0KCk7XHJcblx0XHRsZXQgcmVzdWx0ID0gc2VsZi5Nb2RlbC5zb3J0KHZhbHVlKTtcclxuXHRcdGlmICh2YWx1ZS5sZW5ndGggIT09IDApIHtcclxuXHRcdFx0cmVzdWx0Lm1hcCgoaXRlbTphbnkpID0+IHtcclxuXHRcdFx0XHRsZXQgdGVtcGxhdGUgPSBzZWxmLlZpZXcubm90ZShpdGVtLCBzZWxmLmRlbGV0ZU5vdGUuYmluZChzZWxmKSk7XHJcblx0XHRcdFx0c2VsZi5WaWV3LmFkZEVsZW1lbnQocm9vdCwgdGVtcGxhdGUpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGFsbE5vdGVzLm1hcCgoaXRlbTphbnkpID0+IHtcclxuXHRcdFx0XHRsZXQgdGVtcGxhdGUgPSBzZWxmLlZpZXcubm90ZShpdGVtLCBzZWxmLmRlbGV0ZU5vdGUuYmluZChzZWxmKSk7XHJcblx0XHRcdFx0c2VsZi5WaWV3LmFkZEVsZW1lbnQocm9vdCwgdGVtcGxhdGUpO1x0XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBcclxuXHR9XHJcblxyXG5cdHJlbmRlckRhdGUoKTp2b2lkIHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdGxldCByb290OkhUTUxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RhdGUtY29udGFpbmVyJyk7XHJcblx0XHRsZXQgZGF0ZSA9IG5ldyBEYXRlQ29tcG9uZW50KCk7XHJcblx0XHRsZXQgdGVtcGxhdGUgPSBkYXRlLnJlbmRlckRhdGUoKTtcclxuXHRcdHNlbGYuVmlldy5hZGRFbGVtZW50KHJvb3QsIHRlbXBsYXRlKTtcclxuXHR9XHJcbn0iLCJleHBvcnQgY2xhc3MgTW9kZWwge1xyXG5cdFN0b3JlOmFueTtcclxuXHRjb25zdHJ1Y3RvcihTdG9yZTphbnkpIHtcclxuXHRcdHRoaXMuU3RvcmUgPSBTdG9yZTtcclxuXHR9XHJcblx0c2F2ZShjb250ZW50OiBhbnkpOiB2b2lkIHtcclxuXHRcdHRoaXMuU3RvcmUuYWRkKGNvbnRlbnQpO1xyXG5cdH1cclxuXHRkZWwoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG5cdFx0dGhpcy5TdG9yZS5kZWwoaWQpO1xyXG5cdH1cclxuXHRnZXQoKTphbnkge1xyXG5cdFx0cmV0dXJuIHRoaXMuU3RvcmUuZ2V0KCk7XHJcblx0fVxyXG5cdHNvcnQodmFsdWU6c3RyaW5nKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5TdG9yZS5zb3J0KHZhbHVlKTtcclxuXHR9XHJcbn0iLCJleHBvcnQgY2xhc3MgVmlldyB7XHJcblx0dGVtcGxhdGU6IGFueTtcclxuXHRub3Rlc0Jsb2NrOiBIVE1MRWxlbWVudDtcclxuXHRpbnB1dFRpdGxlOiBIVE1MRWxlbWVudDtcclxuXHRpbnB1dFRleHQ6IEhUTUxFbGVtZW50O1xyXG5cdGJ1dHRvbjogSFRNTEVsZW1lbnQ7XHJcblx0bW9kYWw6IEhUTUxFbGVtZW50O1xyXG5cdG1vZGFsT3BlbjogSFRNTEVsZW1lbnQ7XHJcblx0bW9kYWxDbG9zZTogSFRNTEVsZW1lbnQ7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHRlbXBsYXRlOmFueSkge1xyXG5cdFx0dGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xyXG5cdFx0dGhpcy5ub3Rlc0Jsb2NrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcclxuXHRcdHRoaXMuaW5wdXRUaXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdub3RlLWlucHV0X190aXRsZScpO1xyXG5cdFx0dGhpcy5pbnB1dFRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbm90ZS1pbnB1dF9fdGV4dCcpO1xyXG5cdFx0dGhpcy5idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkLWJ1dHRvbicpO1xyXG5cdFx0dGhpcy5tb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbCcpO1xyXG5cdFx0dGhpcy5tb2RhbE9wZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtb3BlbicpO1xyXG5cdFx0dGhpcy5tb2RhbENsb3NlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWNsb3NlJyk7XHJcblx0fVxyXG5cclxuXHRkZWZhdWx0KCk6IGFueSB7XHJcblx0XHRsZXQgaGVscGVyOiBhbnkgPSBmdW5jdGlvbih0eXBlOiBzdHJpbmcsIHByb3BzOiBhbnksIGNoaWxkcmVuOiBhbnkpIHtcclxuXHRcdFx0cmV0dXJuIHsgdHlwZTogdHlwZSwgcHJvcHM6IHByb3BzLCBjaGlsZHJlbjogY2hpbGRyZW4gfVxyXG5cdFx0fVxyXG5cdFx0Y29uc3QgdCA9IChoZWxwZXIoJ2RpdicsIHtjbGFzc05hbWU6ICdkZWZhdWx0LXRleHQnfSwgWydOb3RlIGxpc3QgaXMgZW1wdHknXSkpO1xyXG5cdFx0cmV0dXJuIHRcclxuXHR9XHJcblxyXG5cdG5vdGUoZGF0YTogYW55LCBldmVudDphbnkpOiBhbnkge1xyXG5cdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cdFx0bGV0IGhlbHBlcjogYW55ID0gZnVuY3Rpb24odHlwZTogc3RyaW5nLCBwcm9wczogYW55LCBjaGlsZHJlbjogYW55KSB7XHJcblx0XHRcdHJldHVybiB7IHR5cGU6IHR5cGUsIHByb3BzOiBwcm9wcywgY2hpbGRyZW46IGNoaWxkcmVuIH1cclxuXHRcdH1cclxuXHRcdGNvbnN0IHQgPSAoXHJcblx0XHRcdGhlbHBlcignZGl2Jywge2NsYXNzTmFtZTogJ25vdGUtZ3JpZCcsIGtleTogZGF0YS5pZH0sIFtcclxuXHRcdFx0XHRoZWxwZXIoJ2RpdicsIHtjbGFzc05hbWU6ICdub3RlJ30sIFtcclxuXHRcdFx0XHRcdGhlbHBlcignZGl2JywgeyBjbGFzc05hbWU6ICdub3RlLWNsb3NlJywgb25DbGljazogKGU6YW55KSA9PiB7IGV2ZW50KGUucGF0aFszXSk7IH0gfSwgW1xyXG5cdFx0XHRcdFx0XHRoZWxwZXIoJ2knLCB7Y2xhc3NOYW1lOiAnZmEgZmEtY2xvc2UnfSwgWycnXSlcclxuXHRcdFx0XHRcdF0pLFxyXG5cdFx0XHRcdFx0aGVscGVyKCdkaXYnLCB7Y2xhc3NOYW1lOiAnbm90ZV9fdGl0bGUnfSwgW1xyXG5cdFx0XHRcdFx0XHRkYXRhLnRpdGxlXHJcblx0XHRcdFx0XHRdKSxcclxuXHRcdFx0XHRcdGhlbHBlcignZGl2Jywge2NsYXNzTmFtZTogJ25vdGVfX3RleHQnfSwgW1xyXG5cdFx0XHRcdFx0XHRkYXRhLnRleHRcclxuXHRcdFx0XHRcdF0pXHJcblx0XHRcdFx0XSlcclxuXHRcdFx0XSlcclxuXHRcdCk7XHJcblx0XHRyZXR1cm4gdFxyXG5cdH1cclxuXHJcblx0YWRkRWxlbWVudChwYXJlbnQ6SFRNTEVsZW1lbnQsIHRlbXBsYXRlOiBhbnkpOiB2b2lkIHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdGxldCBuZXdDaGlsZCA9IHNlbGYudGVtcGxhdGUuY3JlYXRlRWxlbWVudCh0ZW1wbGF0ZSk7XHJcblx0XHRzZWxmLnRlbXBsYXRlLnJlbmRlcihwYXJlbnQsIG5ld0NoaWxkKTtcclxuXHRcdHNlbGYubW9kYWwuY2xhc3NOYW1lID0gJ21vZGFsJztcclxuXHR9XHJcblxyXG5cdGRlbGV0ZUVsZW1lbnQocGFyZW50OkhUTUxFbGVtZW50LCBpdGVtOiBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG5cdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cdFx0cGFyZW50LnJlbW92ZUNoaWxkKGl0ZW0pO1xyXG5cdH1cclxuXHJcblx0YWRkRXZlbnQoZXZlbnQ6IHN0cmluZywgaGFuZGxlcjogYW55KTogdm9pZCB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHRpZiAoZXZlbnQgPT09ICdhZGROb3RlJykge1xyXG5cdFx0XHRzZWxmLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkgeyBcclxuXHRcdFx0XHRsZXQgaW5wdXRUZXh0VmFsdWUgPSBzZWxmLmlucHV0VGV4dC5pbm5lclRleHQ7XHJcblx0XHRcdFx0bGV0IGlucHV0VGl0bGVWYWx1ZSA9IHNlbGYuaW5wdXRUaXRsZS5pbm5lclRleHQ7XHJcblxyXG5cdFx0XHRcdGlmIChpbnB1dFRleHRWYWx1ZS5sZW5ndGggIT09IDAgJiYgaW5wdXRUaXRsZVZhbHVlLmxlbmd0aCAhPT0gMCkge1xyXG5cdFx0XHRcdFx0bGV0IHBoVGl0bGU6RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pbnB1dC10ZXh0X190aXRsZScpO1xyXG5cdFx0XHRcdFx0bGV0IHBoVGV4dDpFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmlucHV0LXRleHRfX3RleHQnKTtcclxuXHRcdFx0XHRcdGhhbmRsZXIoe1xyXG5cdFx0XHRcdFx0XHRpZDogRGF0ZS5ub3coKSxcclxuXHRcdFx0XHRcdFx0dGl0bGU6IGlucHV0VGl0bGVWYWx1ZSxcclxuXHRcdFx0XHRcdFx0dGV4dDogaW5wdXRUZXh0VmFsdWVcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdHNlbGYuaW5wdXRUZXh0LmlubmVyVGV4dCA9ICcnO1xyXG5cdFx0XHRcdFx0c2VsZi5pbnB1dFRpdGxlLmlubmVyVGV4dCA9ICcnO1xyXG5cdFx0XHRcdFx0cGhUaXRsZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpO1xyXG5cdFx0XHRcdFx0cGhUZXh0LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0c2VsZi5pbnB1dFRpdGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdFx0bGV0IHBsYWNlaG9sZGVyOkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW5wdXQtdGV4dF9fdGl0bGUnKTtcclxuXHRcdFx0XHRcdGlmIChzZWxmLmlucHV0VGl0bGUuaW5uZXJUZXh0Lmxlbmd0aCAhPT0gMCApIHtcclxuXHRcdFx0XHRcdFx0cGxhY2Vob2xkZXIuc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OiBub25lJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRwbGFjZWhvbGRlci5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0c2VsZi5pbnB1dFRpdGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0XHRpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcclxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHRzZWxmLmlucHV0VGV4dC5mb2N1cygpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0c2VsZi5pbnB1dFRleHQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0XHRsZXQgcGxhY2Vob2xkZXI6RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pbnB1dC10ZXh0X190ZXh0Jyk7XHJcblx0XHRcdFx0XHRpZiAoc2VsZi5pbnB1dFRleHQuaW5uZXJUZXh0Lmxlbmd0aCAhPT0gMCApIHtcclxuXHRcdFx0XHRcdFx0cGxhY2Vob2xkZXIuc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OiBub25lJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRwbGFjZWhvbGRlci5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9IGVsc2UgaWYgKGV2ZW50ID09PSAnbW9kYWwtYWN0aXZlJykge1xyXG5cdFx0XHRsZXQgbW9kYWxDbGFzcyA9IHNlbGYubW9kYWwuY2xhc3NOYW1lO1xyXG5cclxuXHRcdFx0c2VsZi5tb2RhbE9wZW4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHsgXHJcblx0XHRcdFx0c2VsZi5tb2RhbC5jbGFzc05hbWUgPSBtb2RhbENsYXNzICsgJyBhY3RpdmUnO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHNlbGYubW9kYWxDbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkgeyBcclxuXHRcdFx0XHRzZWxmLm1vZGFsLmNsYXNzTmFtZSA9IG1vZGFsQ2xhc3M7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIGlmIChldmVudCA9PT0gJ3NlYXJjaCcpIHtcclxuXHRcdFx0bGV0IHNlYXJjaElucHV0OkhUTUxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1pbnB1dCcpO1xyXG5cdFx0XHRzZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRoYW5kbGVyKCg8SFRNTFNlbGVjdEVsZW1lbnQ+ZS50YXJnZXQpLnZhbHVlKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm1hc29ucnktbGF5b3V0LmQudHNcIiAvPlxyXG5cclxuaW1wb3J0IHtDb250cm9sbGVyfSBmcm9tICcuL0NvbnRyb2xsZXInO1xyXG5pbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcclxuaW1wb3J0IHtTdG9yZX0gZnJvbSAnLi9zdG9yZSc7XHJcbmltcG9ydCB7VGVtcGxhdGV9IGZyb20gJy4vdGVtcGxhdGUnO1xyXG5pbXBvcnQge1ZpZXd9IGZyb20gJy4vVmlldyc7XHJcblxyXG5jbGFzcyBLZWVwZXIge1xyXG5cdHN0b3JlOiBhbnk7XHJcblx0bW9kZWw6IGFueTtcclxuXHR0ZW1wbGF0ZTogYW55O1xyXG5cdHZpZXc6IGFueTtcclxuXHRjb250cm9sbGVyOiBhbnk7XHJcblx0bWFzb25yeTogYW55O1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5zdG9yZSA9IG5ldyBTdG9yZSgnbm90ZS1hcHAtc3RvcmUnKTtcclxuXHRcdHRoaXMubW9kZWwgPSBuZXcgTW9kZWwodGhpcy5zdG9yZSk7XHJcblx0XHR0aGlzLnRlbXBsYXRlID0gbmV3IFRlbXBsYXRlKCk7XHJcblx0XHR0aGlzLnZpZXcgPSBuZXcgVmlldyh0aGlzLnRlbXBsYXRlKTtcclxuXHRcdHRoaXMubWFzb25yeSA9IG5ldyBNYXNvbnJ5KCcjcm9vdCcsIHtcclxuXHRcdFx0aXRlbVNlbGVjdG9yOiAnLm5vdGUtZ3JpZCcsXHJcblx0XHRcdGNvbHVtbldpZHRoOiAnLm5vdGUtc2l6aW5nJyxcclxuXHRcdFx0cGVyY2VudFBvc2l0aW9uOiB0cnVlXHJcblx0XHR9KTtcclxuXHRcdHRoaXMuY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyKHRoaXMubW9kZWwsIHRoaXMudmlldywgdGhpcy5tYXNvbnJ5KTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBLZWVwZXJBcHAgPSBuZXcgS2VlcGVyKCk7XHJcblxyXG5cclxuIiwiZXhwb3J0IGNsYXNzIERhdGVDb21wb25lbnQge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cclxuXHR9XHJcblxyXG5cdGNyZWF0ZURhdGUoKTphbnkge1xyXG5cdFx0bGV0IG5ld0RhdGUgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0cmV0dXJuIG5ld0RhdGU7XHJcblx0fVxyXG5cclxuXHRnZXREYXRlKCk6YW55IHtcclxuXHRcdHJldHVybiB0aGlzLmNyZWF0ZURhdGUoKS5nZXREYXRlKCk7XHJcblx0fVxyXG5cclxuXHRnZXRNb250aCgpOmFueSB7XHJcblx0XHRyZXR1cm4gdGhpcy5jcmVhdGVEYXRlKCkuZ2V0TW9udGgoKTtcclxuXHR9XHJcblxyXG5cdGdldFllYXIoKTphbnkge1xyXG5cdFx0cmV0dXJuIHRoaXMuY3JlYXRlRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XHRcdFxyXG5cdH1cclxuXHJcblx0Z2V0RGF5KCk6YW55IHtcclxuXHRcdHJldHVybiB0aGlzLmNyZWF0ZURhdGUoKS5nZXREYXkoKTtcclxuXHR9XHJcblxyXG5cdHJldHVybkZ1bGxEYXkoKTphbnkge1xyXG5cdFx0bGV0IGRheTpudW1iZXIgPSB0aGlzLmdldERheSgpO1xyXG5cdFx0bGV0IGRhdGU6bnVtYmVyID0gdGhpcy5nZXREYXRlKCk7XHJcblx0XHRsZXQgZGF5czphbnkgPSB7XHJcblx0XHRcdDA6ICdTdW5kYXknLFxyXG5cdFx0XHQxOiAnTW9uZGF5JyxcclxuXHRcdFx0MjogJ1R1ZXNkYXknLFxyXG5cdFx0XHQzOiAnV2VkbmVzZGF5JyxcclxuXHRcdFx0NDogJ1RodXJzZGF5JyxcclxuXHRcdFx0NTogJ0ZyaWRheScsXHJcblx0XHRcdDY6ICdTYXR1cmRheSdcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gZGF0ZSArICcgJyArIGRheXNbZGF5XTtcclxuXHR9XHJcblxyXG5cdHJldHVybk1vbnRoV2l0aFllYXIoKTphbnkge1xyXG5cdFx0bGV0IG1vbnRoOm51bWJlciA9IHRoaXMuZ2V0TW9udGgoKTtcclxuXHRcdGxldCB5ZWFyOm51bWJlciA9IHRoaXMuZ2V0WWVhcigpO1xyXG5cdFx0bGV0IG1vbnRoczphbnkgPSB7XHJcblx0XHRcdDA6ICdKYW51YXJ5JyxcclxuXHRcdFx0MTogJ0ZlYnJ1YXJ5JyxcclxuXHRcdFx0MjogJ01hcmNoJyxcclxuXHRcdFx0MzogJ0FwcmlsJyxcclxuXHRcdFx0NDogJ01heScsXHJcblx0XHRcdDU6ICdKdW5lJyxcclxuXHRcdFx0NjogJ0p1bHknLFxyXG5cdFx0XHQ3OiAnQXVndXN0JyxcclxuXHRcdFx0ODogJ1NlcHRlbWJlcicsXHJcblx0XHRcdDk6ICdPY3RvYmVyJyxcclxuXHRcdFx0MTA6ICdOb3ZlbWJlcicsXHJcblx0XHRcdDExOiAnRGVjZW1iZXInXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuIG1vbnRoc1ttb250aF0gKyAnICcgKyB5ZWFyO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyRGF0ZSgpOmFueSB7XHJcblx0XHRsZXQgaGVscGVyOiBhbnkgPSBmdW5jdGlvbih0eXBlOiBzdHJpbmcsIHByb3BzOiBhbnksIGNoaWxkcmVuOiBhbnkpIHtcclxuXHRcdFx0cmV0dXJuIHsgdHlwZTogdHlwZSwgcHJvcHM6IHByb3BzLCBjaGlsZHJlbjogY2hpbGRyZW4gfVxyXG5cdFx0fTtcclxuXHRcdGxldCBmdWxsRGF5ID0gdGhpcy5yZXR1cm5GdWxsRGF5KCk7XHJcblx0XHRsZXQgRGF0ZSA9IHRoaXMucmV0dXJuTW9udGhXaXRoWWVhcigpO1xyXG5cdFx0Y29uc3QgdGVtcGxhdGU6YW55ID0gKFxyXG5cdFx0XHRoZWxwZXIoJ2RpdicsIHtjbGFzc05hbWU6ICdkYXRlJ30sIFtcclxuXHRcdFx0XHRoZWxwZXIoJ2RpdicsIHtjbGFzc05hbWU6ICdkYXRlLWRheSd9LCBbZnVsbERheV0pLFxyXG5cdFx0XHRcdGhlbHBlcignZGl2Jywge2NsYXNzTmFtZTogJ2RhdGUtbW9udGgnfSwgW0RhdGVdKVxyXG5cdFx0XHRdKVxyXG5cdFx0KTtcclxuXHRcdHJldHVybiB0ZW1wbGF0ZTtcclxuXHR9XHJcbn0iLCJleHBvcnQgY2xhc3MgU3RvcmUge1xyXG5cdG5hbWU6IHN0cmluZ1xyXG5cdGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xyXG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcclxuXHR9XHJcblx0YWRkKGNvbnRlbnQ6YW55KTogdm9pZCB7XHJcblx0XHRpZiAoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubmFtZSkgKSB7XHJcblx0XHRcdGxldCBteVN0b3JlID0gKDxhbnk+SlNPTikucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5uYW1lKSk7XHJcblx0XHRcdG15U3RvcmUucHVzaChjb250ZW50KTtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5uYW1lLCAoPGFueT5KU09OKS5zdHJpbmdpZnkobXlTdG9yZSkpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGV0IG15U3RvcmU6YW55W10gPSBbXTtcclxuXHRcdFx0bXlTdG9yZS5wdXNoKGNvbnRlbnQpO1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLm5hbWUsICg8YW55PkpTT04pLnN0cmluZ2lmeShteVN0b3JlKSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRkZWwoaWQ6c3RyaW5nKTogdm9pZCB7XHJcblx0XHRsZXQgbXlTdG9yZSA9ICg8YW55PkpTT04pLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubmFtZSkpO1xyXG5cdFx0bGV0IG5ld1N0b3JlID0gbXlTdG9yZS5maWx0ZXIoKGl0ZW06IGFueSkgPT4gaXRlbS5pZCAhPT0gK2lkKTtcclxuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubmFtZSwgKDxhbnk+SlNPTikuc3RyaW5naWZ5KG5ld1N0b3JlKSk7XHJcblx0fVxyXG5cclxuXHRnZXQoKTogYW55IHtcclxuXHRcdGxldCBjb250ZW50ID0gKDxhbnk+SlNPTikucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5uYW1lKSk7XHJcblx0XHRyZXR1cm4gY29udGVudFxyXG5cdH1cclxuXHJcblx0c29ydCh2YWx1ZTogc3RyaW5nKSA6YW55IHtcclxuXHRcdGxldCBteVN0b3JlID0gKDxhbnk+SlNPTikucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5uYW1lKSk7XHJcblx0XHRsZXQgbmV3U3RvcmUgPSBteVN0b3JlLmZpbHRlcigoaXRlbTogYW55KSA9PiB7XHJcblx0XHRcdGlmIChpdGVtLnRpdGxlLmluZGV4T2YodmFsdWUpICE9PSAtMSB8fCBpdGVtLnRleHQuaW5kZXhPZih2YWx1ZSkgIT09IC0xKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld1N0b3JlXHJcblx0fVxyXG59IiwiZXhwb3J0IGNsYXNzIFRlbXBsYXRlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHJcblx0fVxyXG5cclxuXHRzZXRQcm9wKGVsZW06IEhUTUxFbGVtZW50LCBuYW1lOiBzdHJpbmcsIHByb3A6IHN0cmluZyk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuaXNDdXN0b21Qcm9wKG5hbWUpKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fSBlbHNlIGlmIChuYW1lID09PSAnY2xhc3NOYW1lJykge1xyXG5cdFx0XHRlbGVtLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBwcm9wKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGVsZW0uc2V0QXR0cmlidXRlKG5hbWUsIHByb3ApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2V0UHJvcHMoZWxlbTogSFRNTEVsZW1lbnQsIHByb3BzOiBhbnkpOiB2b2lkIHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdE9iamVjdC5rZXlzKHByb3BzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgIFx0c2VsZi5zZXRQcm9wKGVsZW0sIG5hbWUsIHByb3BzW25hbWVdKTtcclxuICBcdH0pO1xyXG5cdH1cclxuXHJcblx0aXNFdmVudFByb3AobmFtZTpzdHJpbmcpOiBhbnkge1xyXG4gICAgcmV0dXJuIC9eb24vLnRlc3QobmFtZSlcclxuXHR9XHJcblxyXG5cdGlzQ3VzdG9tUHJvcChuYW1lOnN0cmluZyk6YW55IHtcclxuXHRcdHJldHVybiB0aGlzLmlzRXZlbnRQcm9wKG5hbWUpXHJcblx0fVxyXG5cclxuXHRnZXRFdmVudE5hbWUocHJvcDogc3RyaW5nKTogYW55IHtcclxuXHRcdHJldHVybiBwcm9wLnNsaWNlKDIpLnRvTG93ZXJDYXNlKClcclxuXHR9XHJcblxyXG5cdGFkZEV2ZW50KGVsZW06SFRNTEVsZW1lbnQsIHByb3BzOiBhbnkpOiB2b2lkIHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdE9iamVjdC5rZXlzKHByb3BzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdFx0aWYgKHNlbGYuaXNFdmVudFByb3AobmFtZSkpIHtcclxuXHRcdFx0XHRlbGVtLmFkZEV2ZW50TGlzdGVuZXIoc2VsZi5nZXRFdmVudE5hbWUobmFtZSksIHByb3BzW25hbWVdKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRjcmVhdGVFbGVtZW50KG5vZGU6IGFueSk6IGFueSB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHRpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShub2RlKVxyXG5cdFx0fVxyXG5cdFx0bGV0IGVsZW06IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlLnR5cGUpO1xyXG5cdFx0c2VsZi5zZXRQcm9wcyhlbGVtLCBub2RlLnByb3BzKTtcclxuXHRcdHNlbGYuYWRkRXZlbnQoZWxlbSwgbm9kZS5wcm9wcyk7XHJcblx0XHRub2RlLmNoaWxkcmVuXHJcblx0XHQubWFwKChpdGVtOmFueSkgPT4gc2VsZi5jcmVhdGVFbGVtZW50KGl0ZW0pKVxyXG5cdFx0LmZvckVhY2goZnVuY3Rpb24oaXRlbTphbnkpIHtcclxuXHRcdFx0ZWxlbS5hcHBlbmRDaGlsZChpdGVtKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBlbGVtXHJcblx0fVxyXG5cclxuXHRyZW5kZXIocGFyZW50OkhUTUxFbGVtZW50LCBuZXdDaGlsZDpIVE1MRWxlbWVudCk6IHZvaWQge1xyXG5cdFx0cGFyZW50Lmluc2VydEJlZm9yZShuZXdDaGlsZCwgcGFyZW50LmZpcnN0Q2hpbGQpO1xyXG5cdH1cclxufSJdfQ==
