import {svgVk, svgPhone, svgMail, svgFb, svgElse} from "./icons.js"
import { createContactItem } from "./createContact.js";

//Общение с сервером
async function getClients() {
    try {
        const response = await fetch('http://localhost:3000/api/clients', {
        method: 'GET'
    });
    const data = await response.json();
    return data;
    } catch (err) {
        console.log(err)
    } 
}

  const createClient = async (client) => {
    try {
        const response = await fetch(`http://localhost:3000/api/clients`, {
        method: 'POST',
        body: JSON.stringify(client)
    });
    const data = await response.json();
    return data;
    } catch (err) {
        console.log(err)
    }
} 

async function deleteClient(id) {
    try {
        await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'DELETE',
    });
    } catch (err) {
        console.log(err)
    }
}

async function getClientsForId(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'GET'
    });
    const data = await response.json();
    return data;
    } catch (er) {
        console.log(err)
    }
}

async function changeClient(id, client) {
    try {
        const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(client)
    });
    const data = await response.json();
    return data;
    } catch (err) {
        console.log(err)
    }  
}

async function findClient (value) {
    try {
        const response = await fetch(`http://localhost:3000/api/clients?search=${value}`, {
            method: 'GET'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

// Создание тултипов контактов
function contactTooltip (type, value) {
    const tooltip = document.createElement('div');
    const tooltipType = document.createElement('span');
    const tooltipValue = document.createElement('a');

    tooltip.classList.add('contact-tooltip', 'site-tooltip');
    tooltipType.classList.add('contact-tooltip__type');
    tooltipValue.classList.add('contact-tooltip__value');

    tooltipType.textContent = type + ': ';
    tooltipValue.textContent = value;

    tooltip.append(tooltipType, tooltipValue);

    return {
        tooltip,
        tooltipType,
        tooltipValue
    }
};

//Создание элементов таблицы
 function createClientItem(data) {
    const $clientTr = document.createElement('tr'),
        $clientIdTd = document.createElement('td'),
        $clientId = document.createElement('span'),
        $clientFullName = document.createElement('td'),
        $clientCreated = document.createElement('td'),
        $createDate = document.createElement('span'),
        $createdTime = document.createElement('span'),
        $clientChanged = document.createElement('td'),
        $changedDate = document.createElement('span'),
        $changedTime = document.createElement('span'),
        $clientContacts = document.createElement('td'),
        $clientActions = document.createElement('td'),
        $clientEdit = document.createElement('button'),
        $clientDelete = document.createElement('button')

    
    $clientTr.classList.add('clients__item');
    $clientIdTd.classList.add('clients__id');
    $clientFullName.classList.add('clients__full-name');
    $clientCreated.classList.add('clients__created');
    $createDate.classList.add('created__date');
    $createdTime.classList.add('created__time');
    $clientChanged.classList.add('clients__changed');
    $changedDate.classList.add('changed__date');
    $changedTime.classList.add('changed__time');
    $clientContacts.classList.add('clients__contacts');
    $clientActions.classList.add('clients__actions');
    $clientContacts.classList.add('clients__contacts');
    $clientDelete.classList.add('clients__delete', 'btn');
    $clientEdit.classList.add('clients__edit', 'btn');

    $clientEdit.id = data.id;
    $clientDelete.id = data.id;
    $clientTr.id = data.id;

    //Форматирование данных
    function getFio(data) {
        return (data.surname + ' ' + data.name + ' ' + data.lastName)
    }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('.');
    }

    function checkTime(i) {
        if (i < 10)  i = "0" + i;
        return i;
    }
      
    function formatTime(date) {
        const today = new Date(date);
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();
        m = checkTime(m);
        h = checkTime(h);
        return (h + ":" + m);
    }

     function createContactLink(type, value, element, svg, item) {
        const setTooltip = contactTooltip(type, value)
        element = document.createElement('a');
        element.classList.add('contacts__link');
        element.innerHTML = svg;
    
        if (type === 'Email') {
            element.href = `mailto:${value.trim()}`;
        } else if (type === 'Телефон') {
            element.href = `tel:${value.trim()}`;
            setTooltip.tooltipValue.style.color = 'var(--white)'
            setTooltip.tooltipValue.style.textDecoration = 'none'
        } else {
            element.href = value.trim();
        }
    
        element.append(setTooltip.tooltip)
        item.append(element);
    };
    
    function createContactItemByType(type, value, item) {
        switch (type) {
            case 'Телефон':
                let phone;
                createContactLink(type, value, phone, svgPhone, item);
                break;
            case 'Facebook':
                let fb;
                createContactLink(type, value, fb, svgFb, item);
                break;
            case 'VK':
                let vk;
                createContactLink(type, value, vk, svgVk, item); 
                break;
            case 'Email':
                let email;
                createContactLink(type, value, email, svgMail, item); 
                break;
            case 'Другое':
                let other;
                createContactLink(type, value, other, svgElse, item);  
                break;      
                        
            default:
                break;
        }
    }

    //Добавление контактов
    for (const contact of data.contacts) {
        createContactItemByType(contact.type, contact.value, $clientContacts);
    }

const id = String(data.id)

    $clientId.textContent = id.slice(0, 6);
    $clientFullName.textContent = getFio(data);
    $clientEdit.textContent = 'Изменить';
    $clientDelete.textContent = 'Удалить';
    $createDate.textContent = formatDate(data.createdAt);
    $createdTime.textContent = formatTime(data.createdAt);
    $changedDate.textContent = formatDate(data.updatedAt);
    $changedTime.textContent = formatTime(data.updatedAt);

    $clientIdTd.append($clientId);
    $clientCreated.append($createDate, $createdTime);
    $clientChanged.append($changedDate, $changedTime);
    $clientActions.append($clientEdit, $clientDelete);
    $clientTr.append(
        $clientIdTd,
        $clientFullName,
        $clientCreated,
        $clientChanged,
        $clientContacts,
        $clientActions
    );
    return $clientTr;
}

const clientsList = document.getElementById('clients-list')

let column = 'id';
let columnDirection = true;

//Отрисовка таблицы
async function createApp() {
    const data = await getClients();
    let  copyData = [...data]
    copyData = sortClients(copyData, column, columnDirection)

    clientsList.innerHTML=''
    for (const client of copyData) {
        clientsList.append(createClientItem(client)) ;
    }
}

createApp()

function openModal(id) {
    const element = document.getElementById(id);
    element.classList.add('modal-active')
    element.classList.remove('modal-disabled')
}

function closeModal(id) {
    const element = document.getElementById(id);
    element.classList.remove('modal-active')
    element.classList.add('modal-disabled')
    const contacts = document.querySelectorAll('.contact'),
        inputs = document.querySelectorAll('.modal__input'),
        errors = document.querySelectorAll('.err')
    for (const contact of contacts) {
        contact.remove()
    }
    for (const input of inputs) {
        input.value = ''
        input.style.borderColor = 'var(--light-grey)'
    }
    for (const err of errors) {
        err.textContent = ''
    }
    history.pushState("", document.title, window.location.pathname);
}


//Открытие/закрытие модальных окон 
document.getElementById('btn-add-client').addEventListener('click', () => {
    openModal('add-modal')
})

document.getElementById('close-add-modal').addEventListener('click', () => {
    closeModal('add-modal')
})

document.getElementById('btn-back').addEventListener('click', () => {
    closeModal('add-modal')
})

document.getElementById('close-edit-modal').addEventListener('click', () => {
    closeModal('edit-modal')
})

document.getElementById('close-delete-modal').addEventListener('click', () => {
    closeModal('delete-modal')
})

document.getElementById('delete-btn-back').addEventListener('click', () => {
    closeModal('delete-modal')
})

document.addEventListener('click', (event) => {
    if ((event.target == document.getElementById('edit-modal')) || (event.target == document.getElementById('add-modal')) || (event.target == document.getElementById('delete-modal'))){
        closeModal('edit-modal')
        closeModal('add-modal')
        closeModal('delete-modal')
    }
})

//Создание контактов
function createContacts(containerId, btnId) {
    const contactsItems = document.getElementsByClassName('contact'),
        modalContactContainer = document.getElementById(containerId)

        modalContactContainer.style.backgroundColor = 'rgba(200, 197, 209, .2)'

    if (contactsItems.length < 9) {
        const contactItem = createContactItem();
        modalContactContainer.prepend(contactItem.$contact);
        if (contactsItems.length >= 5) {
            const positions = document.querySelectorAll('.back-modal__content')
            for (const position of positions) {
                position.style.top = '70%';
            }
        } else {
            const positions = document.querySelectorAll('.back-modal__content')
            for (const position of positions) {
                position.style.top = '50%';
            }
        }
    } else {
        const contactItem = createContactItem();
        modalContactContainer.prepend(contactItem.$contact);
        document.getElementById(btnId).classList.add('add-contact-btn-disabled');
    }
}

//Добавление контактов клиента в модальном окне нового клиента 
document.getElementById('btn-add-contact-modal').addEventListener('click', (e) => {
    e.preventDefault();
    createContacts('modal-contact-container', 'btn-add-contact-modal')
});

//Добавление контактов клиента в модальном окне изменения клиента
document.getElementById('btn-edit-contact-modal').addEventListener('click', (e) => {
    e.preventDefault();
    createContacts('edit-contact-container', 'btn-edit-contact-modal')
});

//Добавление нового клиента в базу
document.getElementById('add-client').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateClientForm(document.getElementById('add-err-span'), document.getElementById('add-name'), document.getElementById('add-surname'), document.getElementById('add-last-name'))) return

    const contactType = document.querySelectorAll('.contact__name'),
        contactValue = document.querySelectorAll('.contact__input')
    let client = {},
        contacts = []

    for (let i = 0; i < contactType.length; i++) {
        if (!validateClientContact(contactType[i], contactValue[i], document.getElementById('add-err-span'))) return
        contacts.push({
            type: contactType[i].innerHTML,
            value: contactValue[i].value
        })
    }

    client.name = document.getElementById('add-name').value;
    client.surname = document.getElementById('add-surname').value;
    client.lastName = document.getElementById('add-last-name').value;
    client.contacts = contacts;
    client.createdAt = new Date().toISOString();
    client.updatedAt = new Date().toISOString();

    await createClient(client);

    const data = await getClients()
    const id = data[(data.length - 1)].id
    client.id = id

    closeModal('add-modal')
    clientsList.append(createClientItem(client))
});

//Открытие модальных окон Изменить и Удалить
clientsList.onclick = async function(event) {
    if (event.target.classList[0] === 'clients__edit') {
        window.location.hash = event.target.id
        openModal('edit-modal');
        document.getElementById('edit-id-visible').innerHTML ='ID: ' + event.target.id.substr(0, 6)
        document.getElementById('modal-id').innerHTML = event.target.id
        pullEditmodal(event.target.id)
    };

    if (event.target.classList[0] === 'clients__delete') {
        openModal('delete-modal')
        document.getElementById('delete-id').innerHTML = event.target.id
    }
}

//Удаление клиента
document.getElementById('modal-delete-btn').addEventListener('click', async () => {
    const id = Number(document.getElementById('delete-id').innerHTML) 
    await deleteClient(id);
    document.getElementById(id).remove()
    closeModal('delete-modal')
})

//Открытие модального окна удаления из изменения 
document.getElementById('edit-btn-delete').addEventListener('click', () => {
    const id = Number(document.getElementById('modal-id').innerHTML) 
    closeModal('edit-modal')
    openModal('delete-modal')
    document.getElementById('delete-id').innerHTML = id
})

//Заполнение данных модалки изменение клиента
async function pullEditmodal(id) {
    const data = await getClientsForId(id),
        contactsArr = data.contacts,
        contactsContainer = document.getElementById('edit-contact-container')

    document.getElementById('edit-name').value = data.name
    document.getElementById('edit-surname').value = data.surname
    document.getElementById('edit-lastname').value = data.lastName

    const oldContacts = contactsContainer.querySelectorAll('.contact')
        for (const element of oldContacts) element.remove()
        

    const positions = document.querySelectorAll('.back-modal__content')
    for (const position of positions) {
        if (contactsArr.length >= 5) {
            position.style.top = '70%';
        }else {

            for (const position of positions) {
                position.style.top = '50%';
            }
        }
    }

    if (contactsArr.length !== 0) {
        contactsContainer.style.backgroundColor = 'rgba(200, 197, 209, .2)'
        for (const contact of contactsArr) {
            const contactItem = createContactItem();

            contactItem.$contactName.textContent = contact.type
            contactItem.$contactInput.value = contact.value
            contactsContainer.prepend(contactItem.$contact)
        }
    }

    //Изменение данных клиента
    document.getElementById('edit-client').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateClientForm(document.getElementById('edit-err-span'), document.getElementById('edit-name'), document.getElementById('edit-surname'), document.getElementById('edit-lastname'))) return

        const contactType = document.querySelectorAll('.contact__name'),
            contactValue = document.querySelectorAll('.contact__input')
        let client = {},
            contacts = []
    
        for (let i = 0; i < contactType.length; i++) {
            if (!validateClientContact(contactType[i], contactValue[i], document.getElementById('edit-err-span'))) return
            console.log(contactType[i].innerHTML)
            contacts.push({
                type: contactType[i].innerHTML,
                value: contactValue[i].value
            })
        }

        id = Number(document.getElementById('modal-id').innerHTML)
    
        client.name = document.getElementById('edit-name').value;
        client.surname = document.getElementById('edit-surname').value;
        client.lastName = document.getElementById('edit-lastname').value;
        client.contacts = contacts;
        client.id =  id
        await changeClient(client.id , client);
        closeModal('edit-modal')
        document.getElementById(id).replaceWith(createClientItem(client))
    });
}

//Прелоадер
window.onload = function() {
    document.getElementById('preloader').classList.add('preloader-remove')
}

// Валидация формы
 function validateClientForm (validateErrSpan, nameId, surnameId, lastNameId) {
    const userName = nameId;
    const userSurname = surnameId;
    const userLastName = lastNameId;
    const validateText = validateErrSpan;
    const regexp = /[^а-яА-ЯёЁ]+$/g;

    const onInputValue = input => {
        input.addEventListener('input', () => {
            input.style.borderColor = 'var(--light-grey)';
                validateText.textContent = '';
        });

        input.oncut = input.oncopy = input.onpaste = () => {
            input.style.borderColor = 'var(--light-grey)';
            validateText.textContent = '';
        };

        input.onchange = () => {
            input.style.borderColor = 'var(--light-grey)';
            if (userSurname.value && userName.value && userLastName.value) validateText.textContent = '';  
        }
    };

    onInputValue(userName);
    onInputValue(userSurname);
    onInputValue(userLastName);

    function checkRequiredName (input, message, name) {
        if (!input.value) {
            input.style.borderColor = 'var(--red)';
            message.textContent = `Введите ${name} клиента!`;
            return false;
        } else {
            message.textContent = '';
        }

        return true;
    };

    function checkByRegexp(input, regexp) {
        if (regexp.test(input.value)) {
            input.style.borderColor = 'var(--red)';
            validateText.textContent = 'Недопустимые символы!';
            return false;
        }

        return true;
    };

    if (!checkRequiredName(userName, validateText, 'Имя'))  return false ;
    if (!checkRequiredName(userSurname, validateText, 'Фамилию'))  return false ;
    if (!checkRequiredName(userLastName, validateText, 'Отчество'))  return false ;
    if (!checkByRegexp(userName, regexp))  return false ;
    if (!checkByRegexp(userSurname, regexp))  return false ;
    if (!checkByRegexp(userLastName, regexp))  return false ;

    return true;
}

//Валидация контактов 
export const validateClientContact = (contactType, contactInput, validateErrSpan) => {
    const writeValue = validateErrSpan;
    const onlyNumbers = /[^0-9]+$/g;
    const onlyTrueLanguageEmail = /[^a-zA-Z|@|.]+$/g;

    const onInputValue = input => {
        input.addEventListener('input', () => {
            input.style.borderColor = 'var(--light-grey)';
            writeValue.textContent = '';
        });

        input.oncut = input.oncopy = input.onpaste = () => {
            input.style.borderColor = 'var(--light-grey)';
            writeValue.textContent = '';
        };
    };

    const showErrorMessage = (message, block, input) => {
        block.textContent = message;
        input.style.borderColor = 'var(--red)';
    };

    onInputValue(contactInput);

    if (!contactInput.value) {
        showErrorMessage('Заполните все поля контактов!', writeValue, contactInput);
        return false;
    }

    switch (contactType.innerHTML) {
        case 'Телефон':
            if (onlyNumbers.test(contactInput.value)) {
                showErrorMessage('Допустимы только цифры!', writeValue, contactInput);
                return false;
            } else if (contactInput.value.length !== 11) {
                showErrorMessage('Номер должен состоять из 11 цифр!', writeValue, contactInput);
                return false;
            }

            return true;
        case 'Email':
            if (onlyTrueLanguageEmail.test(contactInput.value)) {
                showErrorMessage('Непарвильный Email!', writeValue, contactInput);
                return false;
            }

            return true;
        default:
            return true;
    }
};

//Сортировка клиентов 
const sortClients = function(arr, columnProp, direction) {
    const copyData = [...arr];
    return copyData.sort(function(clientA, clientB) {
        if ((!direction == false ? clientA[columnProp] < clientB[columnProp] : clientA[columnProp] > clientB[columnProp]))
        return -1;
    })
}   

//Сортировка по клику на заголовки таблицы
const headerBtns = document.querySelectorAll('.th-sort')

for (const element of headerBtns) {
    element.addEventListener('click', async () => {
        headerBtns.forEach (el => {
            el.classList.remove('th-active')
        })
        element.classList.add('th-active')
        element.classList.toggle('arrow-dir')
        column = element.dataset.column
        columnDirection = !columnDirection
        createApp()
    })
}

//Поииск по таблице
let time;
let input = document.getElementById('header-input');

input.addEventListener('input', async function() {
    clearTimeout(time);
    time = setTimeout( async function() {
       const value = input.value
       const data = await findClient(value);
       let  copyData = [...data]
       copyData = sortClients(copyData, column, columnDirection)

       clientsList.innerHTML=''
       for (const client of copyData) {
           clientsList.append(createClientItem(client)) ;
       }
    }, 300)
})

//Открытие мадального окна по hash
if (window.location.hash) {
    const hashId = window.location.hash.slice(1)
    openModal('edit-modal');
    document.getElementById('edit-id-visible').innerHTML ='ID: ' + hashId.substr(0, 6)
    document.getElementById('modal-id').innerHTML = hashId.id
    pullEditmodal(hashId)
}

