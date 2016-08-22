(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var Controller = (function () {
    function Controller(Model, View, Masonry) {
        var self = this;
        this.Model = Model;
        this.View = View;
        this.Masonry = Masonry;
        self.defaultLoad();
        self.View.addEvent('addNote', function (item) {
            self.createNote(item);
        });
        self.View.addEvent('modal-active');
        self.View.addEvent('delete-note', function (item) {
            self.deleteNote(item);
        });
    }
    Controller.prototype.defaultLoad = function () {
        var self = this;
        var content = self.Model.get();
        if (content == undefined) {
            return;
        }
        content.map(function (item) {
            self.View.addNote(item);
        });
        self.Masonry.reloadItems();
        self.Masonry.layout();
    };
    Controller.prototype.createNote = function (item) {
        var self = this;
        self.Model.save(item);
        self.View.addNote(item);
        self.Masonry.reloadItems();
        self.Masonry.layout();
    };
    Controller.prototype.deleteNote = function (item) {
        var self = this;
        self.Model.del(item.getAttribute('data-id'));
        self.View.deleteNote(item.parentNode);
        self.Masonry.reloadItems();
        self.Masonry.layout();
    };
    return Controller;
}());
exports.Controller = Controller;
},{}],2:[function(require,module,exports){
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
    View.prototype.addNote = function (item) {
        var self = this;
        var Note = document.createElement('div');
        Note.className = 'note-grid';
        Note.innerHTML = self.template.createNote(item);
        self.notesBlock.insertBefore(Note, self.notesBlock.firstChild);
    };
    View.prototype.deleteNote = function (item) {
        var self = this;
        var element = item.parentNode;
        self.notesBlock.removeChild(element);
    };
    View.prototype.addEvent = function (event, handler) {
        var self = this;
        if (event === 'addNote') {
            var button = self.button;
            button.addEventListener('click', function () {
                var inputTextValue = self.inputText.innerText;
                var inputTitleValue = self.inputTitle.innerText;
                if (inputTextValue !== '' && inputTitleValue !== '') {
                    handler({
                        id: Date.now(),
                        title: inputTitleValue,
                        text: inputTextValue
                    });
                    self.inputText.innerText = '';
                    self.inputTitle.innerText = '';
                }
            });
        }
        else if (event === 'modal-active') {
            var modalClass_1 = self.modal.className;
            self.modalOpen.addEventListener('click', function () {
                var modal = self.modal;
                modal.className = modalClass_1 + ' active';
            });
            self.modalClose.addEventListener('click', function () {
                var modal = self.modal;
                modal.className = modalClass_1;
            });
        }
        else if (event === 'delete-note') {
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
},{"./Controller":1,"./Model":2,"./View":3,"./store":5,"./template":6}],5:[function(require,module,exports){
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
        var deletedId = id;
        var newStore = myStore.filter(function (item) {
            return item.id !== deletedId;
        });
        localStorage.setItem(this.name, JSON.stringify(newStore));
    };
    Store.prototype.get = function () {
        var content = JSON.parse(localStorage.getItem(this.name));
        return content;
    };
    return Store;
}());
exports.Store = Store;
},{}],6:[function(require,module,exports){
"use strict";
var Template = (function () {
    function Template() {
        this.noteTemplate = '<div class="note" data-id="{{id}}">'
            + '<div class="note-close">'
            + '<i class="fa fa-close" aria-hidden="true"></i>'
            + '</div> '
            + '<div class="note__title">'
            + '{{title}}'
            + '</div>'
            + '<div class="note__text">'
            + '{{text}}'
            + '</div>'
            + '</div>';
    }
    Template.prototype.createNote = function (data) {
        var template = this.noteTemplate;
        template = template.replace("{{id}}", data.id);
        template = template.replace("{{title}}", data.title);
        template = template.replace("{{text}}", data.text);
        return template;
    };
    return Template;
}());
exports.Template = Template;
},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9Db250cm9sbGVyLnRzIiwianMvTW9kZWwudHMiLCJqcy9WaWV3LnRzIiwianMvYXBwLnRzIiwianMvc3RvcmUudHMiLCJqcy90ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtJQU1DLG9CQUFZLEtBQVMsRUFBRSxJQUFTLEVBQUUsT0FBWTtRQUM3QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxVQUFTLElBQVE7WUFDOUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxVQUFTLElBQWdCO1lBQzFELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsZ0NBQVcsR0FBWDtRQUNDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLE9BQU8sR0FBVSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sQ0FBQTtRQUNQLENBQUM7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVMs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QUMsWUFBWSxDQUFDO1FBRWpDLFFBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0MsUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyRCxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRW5ELE1BQU0sQ0FBQyxRQUFRLENBQUE7SUFDaEIsQ0FBQztJQUNGLGVBQUM7QUFBRCxDQXpCQSxBQXlCQyxJQUFBO0FBekJZLGdCQUFRLFdBeUJwQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBjbGFzcyBDb250cm9sbGVyIHtcclxuXHRNb2RlbDogYW55O1xyXG5cdFZpZXc6IGFueTtcclxuXHRNYXNvbnJ5OiBhbnk7XHJcblx0ZW1taXRFdmVudDogYW55O1xyXG5cdGRlZmF1bHQ6IGFueTtcclxuXHRjb25zdHJ1Y3RvcihNb2RlbDphbnksIFZpZXc6IGFueSwgTWFzb25yeTogYW55KSB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHR0aGlzLk1vZGVsID0gTW9kZWw7XHJcblx0XHR0aGlzLlZpZXcgPSBWaWV3O1xyXG5cdFx0dGhpcy5NYXNvbnJ5ID0gTWFzb25yeTtcclxuXHRcdHNlbGYuZGVmYXVsdExvYWQoKTtcclxuXHRcdHNlbGYuVmlldy5hZGRFdmVudCgnYWRkTm90ZScsIGZ1bmN0aW9uKGl0ZW06YW55KSB7XHJcblx0XHRcdHNlbGYuY3JlYXRlTm90ZShpdGVtKTtcclxuXHRcdH0pO1xyXG5cdFx0c2VsZi5WaWV3LmFkZEV2ZW50KCdtb2RhbC1hY3RpdmUnKTtcclxuXHRcdHNlbGYuVmlldy5hZGRFdmVudCgnZGVsZXRlLW5vdGUnLCBmdW5jdGlvbihpdGVtOkhUTUxFbGVtZW50KSB7XHJcblx0XHRcdHNlbGYuZGVsZXRlTm90ZShpdGVtKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZGVmYXVsdExvYWQoKTogYW55IHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdHZhciBjb250ZW50OiBhbnlbXSA9IHNlbGYuTW9kZWwuZ2V0KCk7XHJcblx0XHRpZiAoY29udGVudCA9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblx0XHRjb250ZW50Lm1hcChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdHNlbGYuVmlldy5hZGROb3RlKGl0ZW0pO1xyXG5cdFx0fSk7XHJcblx0XHRzZWxmLk1hc29ucnkucmVsb2FkSXRlbXMoKTtcclxuXHRcdHNlbGYuTWFzb25yeS5sYXlvdXQoKTtcclxuXHR9XHJcblxyXG5cdGNyZWF0ZU5vdGUoaXRlbTogYW55KTogdm9pZCB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHRzZWxmLk1vZGVsLnNhdmUoaXRlbSk7XHJcblx0XHRzZWxmLlZpZXcuYWRkTm90ZShpdGVtKTtcclxuXHRcdHNlbGYuTWFzb25yeS5yZWxvYWRJdGVtcygpO1xyXG5cdFx0c2VsZi5NYXNvbnJ5LmxheW91dCgpO1xyXG5cdH1cclxuXHJcblx0ZGVsZXRlTm90ZShpdGVtOiBIVE1MRWxlbWVudCk6IGFueSB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHRzZWxmLk1vZGVsLmRlbChpdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpKTtcclxuXHRcdHNlbGYuVmlldy5kZWxldGVOb3RlKGl0ZW0ucGFyZW50Tm9kZSk7XHJcblx0XHRzZWxmLk1hc29ucnkucmVsb2FkSXRlbXMoKTtcclxuXHRcdHNlbGYuTWFzb25yeS5sYXlvdXQoKTtcclxuXHR9XHJcblxyXG59IiwiZXhwb3J0IGNsYXNzIE1vZGVsIHtcclxuXHRTdG9yZTphbnk7XHJcblx0Y29uc3RydWN0b3IoU3RvcmU6YW55KSB7XHJcblx0XHR0aGlzLlN0b3JlID0gU3RvcmU7XHJcblx0fVxyXG5cdHNhdmUoY29udGVudDogYW55KTogdm9pZCB7XHJcblx0XHR0aGlzLlN0b3JlLmFkZChjb250ZW50KTtcclxuXHR9XHJcblx0ZGVsKGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuXHRcdHRoaXMuU3RvcmUuZGVsKGlkKTtcclxuXHR9XHJcblx0Z2V0KCk6YW55IHtcclxuXHRcdHJldHVybiB0aGlzLlN0b3JlLmdldCgpO1xyXG5cdH1cclxufSIsImV4cG9ydCBjbGFzcyBWaWV3IHtcclxuXHR0ZW1wbGF0ZTogYW55O1xyXG5cdG5vdGVzQmxvY2s6IEhUTUxFbGVtZW50O1xyXG5cdGlucHV0VGl0bGU6IEhUTUxFbGVtZW50O1xyXG5cdGlucHV0VGV4dDogSFRNTEVsZW1lbnQ7XHJcblx0YnV0dG9uOiBIVE1MRWxlbWVudDtcclxuXHRtb2RhbDogSFRNTEVsZW1lbnQ7XHJcblx0bW9kYWxPcGVuOiBIVE1MRWxlbWVudDtcclxuXHRtb2RhbENsb3NlOiBIVE1MRWxlbWVudDtcclxuXHJcblx0Y29uc3RydWN0b3IodGVtcGxhdGU6YW55KSB7XHJcblx0XHR0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGU7XHJcblx0XHR0aGlzLm5vdGVzQmxvY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpO1xyXG5cdFx0dGhpcy5pbnB1dFRpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25vdGUtaW5wdXRfX3RpdGxlJyk7XHJcblx0XHR0aGlzLmlucHV0VGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdub3RlLWlucHV0X190ZXh0Jyk7XHJcblx0XHR0aGlzLmJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGQtYnV0dG9uJyk7XHJcblx0XHR0aGlzLm1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsJyk7XHJcblx0XHR0aGlzLm1vZGFsT3BlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1vcGVuJyk7XHJcblx0XHR0aGlzLm1vZGFsQ2xvc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtY2xvc2UnKTtcclxuXHR9XHJcblxyXG5cdGFkZE5vdGUoaXRlbTphbnkpOiBhbnkge1xyXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHRcdGxldCBOb3RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblxyXG5cdFx0XHROb3RlLmNsYXNzTmFtZSA9ICdub3RlLWdyaWQnO1xyXG5cdFx0XHROb3RlLmlubmVySFRNTCA9IHNlbGYudGVtcGxhdGUuY3JlYXRlTm90ZShpdGVtKTtcclxuXHRcdFx0c2VsZi5ub3Rlc0Jsb2NrLmluc2VydEJlZm9yZShOb3RlLCBzZWxmLm5vdGVzQmxvY2suZmlyc3RDaGlsZCk7XHJcblx0fVxyXG5cclxuXHRkZWxldGVOb3RlKGl0ZW06IEhUTUxFbGVtZW50KTphbnkge1xyXG5cdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cdFx0bGV0IGVsZW1lbnQgPSBpdGVtLnBhcmVudE5vZGU7XHJcblx0XHRzZWxmLm5vdGVzQmxvY2sucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XHJcblx0fVxyXG5cclxuXHRhZGRFdmVudChldmVudDogc3RyaW5nLCBoYW5kbGVyOiBhbnkpOiBhbnkge1xyXG5cdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdGlmIChldmVudCA9PT0gJ2FkZE5vdGUnKSB7XHJcblx0XHRcdGxldCBidXR0b24gPSBzZWxmLmJ1dHRvbjtcclxuXHJcblx0XHRcdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkgeyBcclxuXHRcdFx0XHRsZXQgaW5wdXRUZXh0VmFsdWUgPSBzZWxmLmlucHV0VGV4dC5pbm5lclRleHQ7XHJcblx0XHRcdFx0bGV0IGlucHV0VGl0bGVWYWx1ZSA9IHNlbGYuaW5wdXRUaXRsZS5pbm5lclRleHQ7XHJcblxyXG5cdFx0XHRcdGlmIChpbnB1dFRleHRWYWx1ZSAhPT0gJycgJiYgaW5wdXRUaXRsZVZhbHVlICE9PSAnJykge1xyXG5cclxuXHRcdFx0XHRcdGhhbmRsZXIoe1xyXG5cdFx0XHRcdFx0XHRpZDogRGF0ZS5ub3coKSxcclxuXHRcdFx0XHRcdFx0dGl0bGU6IGlucHV0VGl0bGVWYWx1ZSxcclxuXHRcdFx0XHRcdFx0dGV4dDogaW5wdXRUZXh0VmFsdWVcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdHNlbGYuaW5wdXRUZXh0LmlubmVyVGV4dCA9ICcnO1xyXG5cdFx0XHRcdFx0c2VsZi5pbnB1dFRpdGxlLmlubmVyVGV4dCA9ICcnO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH0gZWxzZSBpZiAoZXZlbnQgPT09ICdtb2RhbC1hY3RpdmUnKSB7XHJcblx0XHRcdGxldCBtb2RhbENsYXNzID0gc2VsZi5tb2RhbC5jbGFzc05hbWU7XHJcblxyXG5cdFx0XHRzZWxmLm1vZGFsT3Blbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkgeyBcclxuXHRcdFx0XHRsZXQgbW9kYWwgPSBzZWxmLm1vZGFsO1xyXG5cdFx0XHRcdG1vZGFsLmNsYXNzTmFtZSA9IG1vZGFsQ2xhc3MgKyAnIGFjdGl2ZSc7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0c2VsZi5tb2RhbENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7IFxyXG5cdFx0XHRcdGxldCBtb2RhbCA9IHNlbGYubW9kYWw7XHJcblx0XHRcdFx0bW9kYWwuY2xhc3NOYW1lID0gbW9kYWxDbGFzcztcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fSBlbHNlIGlmIChldmVudCA9PT0gJ2RlbGV0ZS1ub3RlJykge1xyXG5cdFx0XHRcclxuXHRcdH1cclxuXHR9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwibWFzb25yeS1sYXlvdXQuZC50c1wiIC8+XHJcblxyXG5pbXBvcnQge0NvbnRyb2xsZXJ9IGZyb20gJy4vQ29udHJvbGxlcic7XHJcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xyXG5pbXBvcnQge1N0b3JlfSBmcm9tICcuL3N0b3JlJztcclxuaW1wb3J0IHtUZW1wbGF0ZX0gZnJvbSAnLi90ZW1wbGF0ZSc7XHJcbmltcG9ydCB7Vmlld30gZnJvbSAnLi9WaWV3JztcclxuXHJcbmNsYXNzIEtlZXBlciB7XHJcblx0c3RvcmU6IGFueTtcclxuXHRtb2RlbDogYW55O1xyXG5cdHRlbXBsYXRlOiBhbnk7XHJcblx0dmlldzogYW55O1xyXG5cdGNvbnRyb2xsZXI6IGFueTtcclxuXHRtYXNvbnJ5OiBhbnk7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLnN0b3JlID0gbmV3IFN0b3JlKCdub3RlLWFwcC1zdG9yZScpO1xyXG5cdFx0dGhpcy5tb2RlbCA9IG5ldyBNb2RlbCh0aGlzLnN0b3JlKTtcclxuXHRcdHRoaXMudGVtcGxhdGUgPSBuZXcgVGVtcGxhdGUoKTtcclxuXHRcdHRoaXMudmlldyA9IG5ldyBWaWV3KHRoaXMudGVtcGxhdGUpO1xyXG5cdFx0dGhpcy5tYXNvbnJ5ID0gbmV3IE1hc29ucnkoJyNyb290Jywge1xyXG5cdFx0XHRpdGVtU2VsZWN0b3I6ICcubm90ZS1ncmlkJyxcclxuXHRcdFx0Y29sdW1uV2lkdGg6ICcubm90ZS1zaXppbmcnLFxyXG5cdFx0XHRwZXJjZW50UG9zaXRpb246IHRydWVcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5jb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXIodGhpcy5tb2RlbCwgdGhpcy52aWV3LCB0aGlzLm1hc29ucnkpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IEtlZXBlckFwcCA9IG5ldyBLZWVwZXIoKTtcclxuXHJcblxyXG4iLCJleHBvcnQgY2xhc3MgU3RvcmUge1xyXG5cdG5hbWU6IHN0cmluZ1xyXG5cdGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xyXG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcclxuXHR9XHJcblx0YWRkKGNvbnRlbnQ6YW55KTogdm9pZCB7XHJcblx0XHRpZiAoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubmFtZSkgKSB7XHJcblx0XHRcdGxldCBteVN0b3JlID0gKDxhbnk+SlNPTikucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5uYW1lKSk7XHJcblx0XHRcdG15U3RvcmUucHVzaChjb250ZW50KTtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5uYW1lLCAoPGFueT5KU09OKS5zdHJpbmdpZnkobXlTdG9yZSkpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGV0IG15U3RvcmU6YW55W10gPSBbXTtcclxuXHRcdFx0bXlTdG9yZS5wdXNoKGNvbnRlbnQpO1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLm5hbWUsICg8YW55PkpTT04pLnN0cmluZ2lmeShteVN0b3JlKSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRkZWwoaWQ6c3RyaW5nKTogdm9pZCB7XHJcblx0XHRsZXQgbXlTdG9yZSA9ICg8YW55PkpTT04pLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubmFtZSkpO1xyXG5cdFx0bGV0IGRlbGV0ZWRJZCA9IGlkO1xyXG5cdFx0bGV0IG5ld1N0b3JlID0gbXlTdG9yZS5maWx0ZXIoKGl0ZW06IGFueSkgPT4ge1xyXG5cdFx0XHRyZXR1cm4gaXRlbS5pZCAhPT0gZGVsZXRlZElkXHJcblx0XHR9KTtcclxuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubmFtZSwgKDxhbnk+SlNPTikuc3RyaW5naWZ5KG5ld1N0b3JlKSk7XHJcblx0fVxyXG5cdGdldCgpOiBhbnkge1xyXG5cdFx0bGV0IGNvbnRlbnQgPSAoPGFueT5KU09OKS5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLm5hbWUpKTtcclxuXHRcdHJldHVybiBjb250ZW50XHJcblx0fVxyXG59IiwiZXhwb3J0IGNsYXNzIFRlbXBsYXRlIHtcclxuXHRub3RlVGVtcGxhdGU6IHN0cmluZztcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMubm90ZVRlbXBsYXRlID0gJzxkaXYgY2xhc3M9XCJub3RlXCIgZGF0YS1pZD1cInt7aWR9fVwiPidcclxuXHRcdCtcdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJub3RlLWNsb3NlXCI+J1xyXG5cdFx0K1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCc8aSBjbGFzcz1cImZhIGZhLWNsb3NlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPidcclxuXHRcdCtcdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzwvZGl2PiAnXHJcblx0XHQrXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwibm90ZV9fdGl0bGVcIj4nXHJcblx0XHQrXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICd7e3RpdGxlfX0nXHJcblx0XHQrXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCc8L2Rpdj4nXHJcblx0XHQrXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwibm90ZV9fdGV4dFwiPidcclxuXHRcdCtcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgJ3t7dGV4dH19J1xyXG5cdFx0K1x0XHRcdFx0XHRcdFx0XHRcdFx0XHQnPC9kaXY+J1xyXG5cdFx0K1x0XHRcdFx0XHRcdFx0XHRcdFx0JzwvZGl2Pic7XHJcblx0fVxyXG5cclxuXHRjcmVhdGVOb3RlKGRhdGE6IGFueSk6IGFueSB7XHJcblx0XHRsZXQgdGVtcGxhdGUgPSB0aGlzLm5vdGVUZW1wbGF0ZTtcclxuXHRcdFxyXG5cdFx0dGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKFwie3tpZH19XCIsIGRhdGEuaWQpO1xyXG5cdFx0dGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKFwie3t0aXRsZX19XCIsIGRhdGEudGl0bGUpO1xyXG5cdFx0dGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKFwie3t0ZXh0fX1cIiwgZGF0YS50ZXh0KTtcclxuXHJcblx0XHRyZXR1cm4gdGVtcGxhdGVcclxuXHR9XHJcbn0iXX0=
