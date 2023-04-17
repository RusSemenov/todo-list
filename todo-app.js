(function () {
  let array = [];
  let keyName = null;
//Функция для создания заголовка приложения и возврата
  function createAppTitle (title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

//Функция для создания формы
  function createTodoItemForm () {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'md-3');
    input.classList.add('form-control');
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = "Добавить дело";
    //Изначально делает кнопку не активной
    button.setAttribute('disabled', 'disabled');
    //По событию проверяем есть ли в инпуте значение или нет, в зависимости от этого присваеваем кнопке активность или не активность
    input.addEventListener('input', function() {
      if(!input.value) {
        button.setAttribute('disabled', 'disabled')
      } else {
        button.removeAttribute('disabled')
      }
    })

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    }

  }

//Функция для создания списка элементов и их возврата
  function createTodoList () {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list
  }

//Функция для создания элемента(дела)
  function createTodoItem(obj) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', "d-flex", 'justify-content-between', 'align-items-center');
    item.textContent = obj.name;


    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", 'btn-danger');
    deleteButton.textContent = "Удалить";

    if (obj.done == true) item.classList.add('list-group-item-success');

    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');

      for (let i = 0; i < array.length; ++i) {
        if (array[i].id == obj.id) {
          obj.done = !obj.done
        }
      }

      saveArray(array, keyName);
    });

    deleteButton.addEventListener('click', function () {
      if (confirm("Вы уверены?")) {
        item.remove();
      };

      for (let i = 0; i < array.length; ++i) {
        if (array[i].id == obj.id) {
          array.splice(i, 1)
        }
      }

      saveArray(array, keyName);
    })

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

//Функция для вычисления максимального id и создания уникального id
  function getNewId(arr) {
    let max = 0;
    for (let list of arr) {
      if(list.id > max) max = list.id
    }
    return max + 1
  }

//Функция сохранения массива дел в localStorage
  function saveArray(array, listName) {
    localStorage.setItem(listName, JSON.stringify(array));
  }

//Функция, отвечающая за выполнение всего кода приложения
  function createTodoApp (container, title = "Список дел", listName, defArray = []) {
    let todoAppTitle = createAppTitle (title);
    let todoItemForm = createTodoItemForm ();
    let todoList = createTodoList ();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    keyName = listName;
    array = defArray;

    let localData = localStorage.getItem(keyName);

    if(localData !== null && localData !== '') array = JSON.parse(localData);

    for (let itemList of array) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    }

    todoItemForm.form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return
      }

      let newItem = {
        id: getNewId(array),
        name: todoItemForm.input.value,
        done: false,
      }

      let todoItem = createTodoItem(newItem);

      array.push(newItem);

      saveArray(array, keyName);

      todoList.append(todoItem.item);
      todoItemForm.input.value = '';
      //При отправке формы делает кнопку вновь не активной
      todoItemForm.button.disabled = true;
    })
  }
  //Регистрация функции createTodoApp в глобальном обьекте window, чтобы получить доступ к этой функции из других скриптов
  window.createTodoApp = createTodoApp;
})();
