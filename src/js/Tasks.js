export default class Tasks {
    constructor(areaid) {
        this.tasks = { '0': ['123', '321', 'fsdfsdfsd', 'sdsfsdfsdfdghtrt   '], '1': ['2345', '6778'], '2': ['22', 'nysfsdf', 'dfgdfhdhg hfghfg hfgjhjghjghj ghjghjghjghj'], };
        this.tasksElem = [];
        this.taskElemDel = [];
        this.init();
    }
    init() {
        if (!window.localStorage.tasks) {
            this.saveToLocalStorage();
        }
        this.tasks = JSON.parse(window.localStorage.tasks);
        this.render();
    }
    addTask(column, text) {
        this.tasks[column].push(text);
        this.saveToLocalStorage();
        this.render();
    }
    delTask(column, index) {
        this.tasks[column].splice(index, 1)
        this.saveToLocalStorage();
        this.render();
    }
    saveToLocalStorage() {
        window.localStorage.tasks = JSON.stringify(this.tasks);
    }
    loadFromLocalStorage() {

        return JSON.parse(window.localStorage.tasks);
    }
    generateTasksList() {

    }
    render() {
        this.tasksElem.splice(0, this.tasksElem.length);
        this.taskElemDel.splice(0, this.taskElemDel.length);
        this.areaTasks = document.querySelectorAll('.task_column');
        this.areaTasks.forEach((itemCol, index) => {
            while (itemCol.firstChild) {
                itemCol.removeChild(itemCol.firstChild);
            }
            this.loadFromLocalStorage()[index].forEach((text, number) => {
                this.tasksElem[index] = [];
                this.taskElemDel[index] = [];
                this.tasksElem[index][number] = document.createElement('li');
                this.tasksElem[index][number].classList.add('task_item');

                this.taskElemDel[index][number] = document.createElement('div');
                this.taskElemDel[index][number].classList.add('task_del');
                this.taskElemDel[index][number].innerText = '\u2716';
                this.taskElemDel[index][number].addEventListener('click', () => {
                    this.delTask(index, number);
                });

                this.tasksElem[index][number].dataset.column = index;
                this.tasksElem[index][number].dataset.row = number;
                this.tasksElem[index][number].innerText = text;
                this.tasksElem[index][number].append(this.taskElemDel[index][number]);
                this.tasksElem[index][number].addEventListener('mouseover', (evt) => {
                    evt.currentTarget.querySelector('.task_del').classList.add('active');
                });
                this.tasksElem[index][number].addEventListener('mouseout', (evt) => {
                    evt.currentTarget.querySelector('.task_del').classList.remove('active');
                });

                itemCol.append(this.tasksElem[index][number]);
            });

        });

        this.buttonAdd = document.querySelectorAll('.button');
        this.buttonAdd.forEach(item => {
            item.addEventListener('click', event => {
                event.preventDefault();
                let col = event.currentTarget.dataset.button;
                let textForAdd = event.currentTarget.previousElementSibling.value;
                this.tasks[col].push(textForAdd);
                this.saveToLocalStorage();
                this.render();
            });
        });

        let draggedEl = null;
        let tempEl = null;
        let ghostEl = null;
        let mouseDown = (evt) => {
            evt.preventDefault();
            if (!evt.target.classList.contains('task_item')) {
                return;
            }
            draggedEl = evt.target;
            console.dir(draggedEl)
            ghostEl = evt.target.cloneNode(true);
            tempEl = evt.target.cloneNode(true);
            ghostEl.style.width = evt.target.offsetWidth + 'px';
            ghostEl.classList.add('ghost');
            tempEl.classList.add('tempEl');
            draggedEl.classList.add('dragged');
            document.body.appendChild(ghostEl);
            document.body.style.cursor = 'grabbing';
            ghostEl.style.left = `${evt.pageX - 100}px`;
            ghostEl.style.top = `${evt.pageY - 20}px`;
        }
        let mouseMove = (evt) => {
            if (!draggedEl) {
                return;
            }
            if (document.elementFromPoint(evt.clientX, evt.clientY).classList.contains('task_item')) {
                let col = document.elementFromPoint(evt.clientX, evt.clientY).dataset.column;
                let row = document.elementFromPoint(evt.clientX, evt.clientY).dataset.row;
                let element = document.querySelector(`.task_item[data-column="${col}"][data-row="${row}"]`);
                element.parentNode.insertBefore(tempEl, element.nextSibling);
            } else if (document.elementFromPoint(evt.clientX, evt.clientY).querySelector('.task_column')) {
                let col = document.elementFromPoint(evt.clientX, evt.clientY).querySelector('.task_column').dataset.column;
                let element = document.querySelector(`.task_column[data-column="${col}"]`);;
                element.append(tempEl);
            };
            ghostEl.style.left = `${evt.pageX - 100}px`;
            ghostEl.style.top = `${evt.pageY - 20}px`;
        }
        let mouseLeave = () => {// при уходе курсора за границы контейнера - отменяем перенос
            document.body.style.cursor = 'default';
            if (!draggedEl) {
                return;
            }
            draggedEl.classList.remove('dragged');
            document.body.removeChild(ghostEl);
            ghostEl = null;
            draggedEl = null;
            tempEl = null;
            document.querySelector('.tempEl').remove();
        }
        let mouseUp = (evt) => {
            document.body.style.cursor = 'default';
            if (!draggedEl) {
                return;
            }
            draggedEl.classList.remove('dragged');
            if (document.elementFromPoint(evt.clientX, evt.clientY).classList.contains('task_item')) {
                let col = document.elementFromPoint(evt.clientX, evt.clientY).dataset.column;
                let row = document.elementFromPoint(evt.clientX, evt.clientY).dataset.row;
                let oldCol = draggedEl.dataset.column;
                let oldRow = draggedEl.dataset.row;
                let text = draggedEl.innerText;
                this.tasks[oldCol].splice(oldRow, 1);
                this.tasks[col].splice(row, 0, text);
                this.saveToLocalStorage();
                this.render();
            } else if (document.elementFromPoint(evt.clientX, evt.clientY).querySelector('.task_column')) {
                let col = document.elementFromPoint(evt.clientX, evt.clientY).querySelector('.task_column').dataset.column;
                let oldCol = draggedEl.dataset.column;
                let oldRow = draggedEl.dataset.row;
                let text = draggedEl.outerText;
                this.tasks[oldCol].splice(oldRow, 1);
                this.tasks[col].splice(0, 0, text);
                this.saveToLocalStorage();
                this.render();
            };
            document.body.removeChild(ghostEl);
            ghostEl = null;
            draggedEl = null;
            tempEl = null;
        }      

        if (itemsEl) {            
            itemsEl.removeEventListener('mousedown', mouseDown);
            itemsEl.removeEventListener('mousemove', mouseMove);
            itemsEl.removeEventListener('mouseleave', mouseLeave);
            itemsEl.removeEventListener('mouseup', mouseUp);
            itemsEl = null;
        };
        let itemsEl = document.querySelector('.task_columns');
        itemsEl.addEventListener('mousedown', mouseDown);
        itemsEl.addEventListener('mousemove', mouseMove);
        itemsEl.addEventListener('mouseleave', mouseLeave);
        itemsEl.addEventListener('mouseup', mouseUp);
        // itemsEl.addEventListener('mousedown', (evt) => {
        //     evt.preventDefault();

        //     if (!evt.target.classList.contains('task_item')) {
        //         return;
        //     }
        //     draggedEl = evt.target;
        //     console.dir(draggedEl);
        //     console.dir(evt)
        //     ghostEl = evt.target.cloneNode(true);
        //     ghostEl.style.width = evt.target.offsetWidth + 'px';
        //     ghostEl.classList.add('dragged');
        //     draggedEl.style.opacity = '0.3';
        //     document.body.appendChild(ghostEl);
        //     document.body.style.cursor = 'grabbing';
        //     console.log(evt.target.offsetLeft)
        //     console.log(evt.target.offsetLTop)

        //     ghostEl.style.left = `${evt.pageX - ghostEl.offsetWidth}px`;
        //     ghostEl.style.top = `${evt.pageY - ghostEl.offsetHeight}px`;
        // });

        // itemsEl.addEventListener('mousemove', (evt) => {
        //     evt.preventDefault();// не даём выделять элементы
        //     if (!draggedEl) {
        //         return;
        //     }
        //     if (document.elementFromPoint(evt.clientX, evt.clientY).classList.contains('task_item')) {
        //         let col = document.elementFromPoint(evt.clientX, evt.clientY).dataset.column;
        //         let row = document.elementFromPoint(evt.clientX, evt.clientY).dataset.row;
        //     };
        //     ghostEl.style.left = `${evt.pageX - ghostEl.offsetWidth}px`;
        //     ghostEl.style.top = `${evt.pageY - ghostEl.offsetHeight}px`;
        // });
        // itemsEl.addEventListener('mouseleave', (evt) => {// при уходе курсора за границы контейнера - отменяем перенос
        //     document.body.style.cursor = 'default';
        //     if (draggedEl) {

        //         draggedEl.style.opacity = '1';
        //     }
        //     if (!draggedEl) {
        //         return;
        //     } document.body.removeChild(ghostEl);
        //     ghostEl = null;
        //     draggedEl = null;

        // });
        // itemsEl.addEventListener('mouseup', (evt) => {
        //     document.body.style.cursor = 'default';
        //     draggedEl.style.opacity = '1';
        //     if (!draggedEl) {
        //         return;
        //     }

        //     if (document.elementFromPoint(evt.clientX, evt.clientY).classList.contains('task_item')) {
        //         let col = document.elementFromPoint(evt.clientX, evt.clientY).dataset.column;
        //         let row = document.elementFromPoint(evt.clientX, evt.clientY).dataset.row;
        //         let oldCol = draggedEl.dataset.column;
        //         let oldRow = draggedEl.dataset.row;
        //         if (col !== oldCol && row !== oldRow) {                    
        //             let text = draggedEl.innerText;
        //             this.tasks[oldCol].splice(oldRow, 1);
        //             this.tasks[col].splice(row, 0, text);
        //             this.saveToLocalStorage();
        //             this.render();
        //         }
        //     };
        //     document.body.removeChild(ghostEl);
        //     ghostEl = null;
        //     draggedEl = null;
        // });

    }

}