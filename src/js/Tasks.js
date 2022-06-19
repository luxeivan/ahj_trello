export default class Tasks {
    constructor(areaid) {
        this.tasks = { '0': ['123', '321', 'fsdfsdfsd', 'sdsfsdfsdfdghtrt   '], '1': ['2345', '6778'], '2': ['22', 'nysfsdf', 'dfgdfhdhg hfghfg hfgjhjghjghj ghjghjghjghj'], };
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
        this.tasksElem = [];
        this.areaTasks = document.querySelectorAll('.task_column');
        this.areaTasks.forEach((itemCol,index)=>{
            itemCol.innerHTML='';
            this.loadFromLocalStorage()[index].forEach((text,number)=>{
                this.tasksElem[index] = [];
                    this.tasksElem[index][number] = document.createElement('li');
                    this.tasksElem[index][number].classList.add('task_item');
                    this.tasksElem[index][number].dataset.column = index;
                    this.tasksElem[index][number].dataset.row = number;
                    this.tasksElem[index][number].innerText = text;
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
                console.log(event.currentTarget.dataset.button);
            });
        });

        let draggedEl = null;
        let ghostEl = null;
        let itemsEl = document.querySelector('.task_columns');
        itemsEl.addEventListener('mousedown', (evt) => {
            evt.preventDefault();

            if (!evt.target.classList.contains('task_item')) {
                return;
            }
            draggedEl = evt.target;
            
            ghostEl = evt.target.cloneNode(true);
            ghostEl.style.width = evt.target.offsetWidth+'px';
            ghostEl.classList.add('dragged');
            draggedEl.style.opacity = '0.3';
            document.body.appendChild(ghostEl);
            document.body.style.cursor = 'grabbing';
            ghostEl.style.left = `${evt.pageX - ghostEl.offsetWidth}px`;
            ghostEl.style.top = `${evt.pageY - ghostEl.offsetHeight}px`;
        });

        itemsEl.addEventListener('mousemove', (evt) => {
            evt.preventDefault();// не даём выделять элементы
            if (!draggedEl) {
                return;
            }
            if(document.elementFromPoint(evt.clientX, evt.clientY).classList.contains('task_item')){
                let col = document.elementFromPoint(evt.clientX, evt.clientY).dataset.column;
                let row = document.elementFromPoint(evt.clientX, evt.clientY).dataset.row;
            };
            ghostEl.style.left = `${evt.pageX - ghostEl.offsetWidth}px`;
            ghostEl.style.top = `${evt.pageY - ghostEl.offsetHeight}px`;
        });
        itemsEl.addEventListener('mouseleave', (evt) => {// при уходе курсора за границы контейнера - отменяем перенос
            document.body.style.cursor = 'default';
            if (!draggedEl) {
                return;
            } document.body.removeChild(ghostEl);
            ghostEl = null;
            draggedEl = null;

        });
        itemsEl.addEventListener('mouseup', (evt) => {
            document.body.style.cursor = 'default';
            draggedEl.style.opacity = '1';
            if (!draggedEl) {
                return;
            }

            if(document.elementFromPoint(evt.clientX, evt.clientY).classList.contains('task_item')){
                let col = document.elementFromPoint(evt.clientX, evt.clientY).dataset.column;
                let row = document.elementFromPoint(evt.clientX, evt.clientY).dataset.row;
                let oldCol = draggedEl.dataset.column;
                let oldRow = draggedEl.dataset.row;
                let text = draggedEl.innerText;
                console.log(this.tasks[col]);
                this.tasks[oldCol].splice(oldRow,1);
                this.tasks[col].splice(row,0,text);
                this.saveToLocalStorage();
                this.render();           
            };
            document.body.removeChild(ghostEl);
            ghostEl = null;
            draggedEl = null;
        });
    }
}