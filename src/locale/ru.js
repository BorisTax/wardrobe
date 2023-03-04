import messages from '../messages.js'

export const captions = {
  "user": { "name": "Guest" },
  "about": {
    "name": "Автор: Тахмазов Борис",
    "email": "tboris1983@gmail.com"
  },
  "buttons": {
    "cancel": "Отмена",
    "logout": "Выход",
    "login": "Войти",
    "signup": "Создать аккаунт",
  },
  "serverMessages": {
    [messages.NO_ERROR]: "",
    [messages.ACTIVATION_SUCCEED]: "Активация прошла успешно",
    [messages.EMAIL_SEND_ERROR]: "Ошибка при отправке e-mail",
    [messages.INVALID_ACTIVATION_CODE]: "Неверный код активации",
    [messages.INVALID_EMAIL]: "E-mail неверного формата",
    [messages.INVALID_NAME]: "Имя содержит некорректные символы или слишком короткое",
    [messages.INVALID_PASSWORD]: "Пароль содержит некорректные символы или слишком короткий",
    [messages.INVALID_USER_DATA]: "Неправильные имя, e-mail или пароль",
    [messages.LOGIN_SUCCEED]: "Вход выполнен",
    [messages.NO_ACTIVATED]: "Пользователь не активирован",
    [messages.PASSWORDS_NOT_MATCH]: "Пароли не совпадают",
    [messages.REG_SUCCEED]: "Регистрация прошла успешно. Введите код активации из полученного e-mail",
    [messages.SERVER_ERROR]: "Ошибка сервера",
    [messages.USER_EMAIL_ALLOWED]: "E-mail свободен",
    [messages.USER_EMAIL_EXIST]: "E-mail уже зарегистрирован",
    [messages.USER_NAME_ALLOWED]: "Имя свободно",
    [messages.USER_NAME_EXIST]: "Имя уже зарегистрировано",
    [messages.USER_EMAIL_NOT_EXIST]: "E-mail не существует"
  },
  "registerForm": {
    "title": "Регистрация",
    "name": "Имя (мин. 4 символа)",
    "email": "E-Mail",
    "password": "Пароль (мин. 6 символов)",
    "passwordAgain": "Пароль повторно",
    "login": "Вход",
    "cancel": "Отмена",
    "showPass": "Показать пароль",
    "checkName": "Проверить имя",
    "checkEmail": "Проверить e-mail"
  },
  "loginForm": {
    "title": "Вход",
    "name": "Имя или E-mail",
    "password": "Пароль",
    "showPass": "Показать пароль",
    "cancel": "Отмена",
    "register": "Регистрация",
    "remember": "Запомнить"
  },
  "activation": {
    "title": "Активация",
    "placeholder": "Введите код активации"
  },
  "toolbars": {
    "hide": "Свернуть",
    "unhide": "Развернуть",
    "project": {
      "title": "Проект",
      "new": "Новый проект",
      "open": "Открыть проект",
      "save": "Сохранить проект",
      "preview": "Печать отчета",
      "savePdf": "Сохранить отчет",
      "disabled": "",
      "-disabled": " (недоступно для неавторизованных пользователей)",
      "wardrobe": {
        "width": "Ширина",
        "depth": "Глубина",
        "height": "Высота",
      }
    },
    "detailList": {
      "hide": "Скрыть панель",
      "unhide": "Показать панель",
      "primary": "Основной список",
      "secondary": "Дополнительный список",
      "add": "Добавить строку",
      "module": "Модуль",
      "length": "Длина",
      "width": "Ширина",
      "count": "Кол-во",
      "delete": "Удалить строку",
      "place": "Разместить деталь",
      "allCreated": "Все детали созданы",
      "allPlaced": "Все детали размещены",
      "placedCorrectly": "Кол-во размещенных деталей",
      "of": "из"
    },
    "info": {
      "title": "Общая информация",
      "order": "Заказ:",
      "plan": "План:",
      "date": "Дата:",

    },
    "material": {
      "title": "Материал",
      "gloss": "глянцевый",
      "texture": "структурный",
      "offset": "Минимальный отступ между деталями ",
      "rotate": "Детали можно поворачивать",
      "norotate": "Детали нельзя поворачивать",
    },
    "tables": {
      "title": "Раскладки",
      "add": "Добавить",
      "delete": "Удалить",
      "of": "из",
      "complect": "Кол-во комплектов",
      "goto": "Перейти к выбранной раскладке",
      "alignVert": "Центрировать по ширине",
      "alignHor": "Центрировать по длине"
    },
    "instruments": {
      "title": "Инструменты",
      "createVertical": "Добавить вертикальную деталь",
      "createHorizontal": "Добавить горизонтальную деталь",
      "createDrawer": "Добавить ящик",
      "createSingleDimension": "Добавить размер для одной детали",
      "createTwoPanelDimensionInside": "Добавить размер между деталями изнутри",
      "createTwoPanelDimensionOutside": "Добавить размер между деталями снаружи",

      "rotate": "Повернуть панель",
      "norotate": "Нельзя повернуть при структурном материале"
    },
    "operations":{
      "title": "Операции",
      "moveLeft": "Двигать влево",
      "moveRight": "Двигать вправо",
      "moveUp": "Двигать вверх",
      "moveDown": "Двигать вниз",
      "resetView": "Центрировать вид",
    },
    "property": {
      "title": "Свойства детали",
      "noselected": "Нет выделенных объектов",
      "selected": "Выделено объектов: ",
      "name": "Название",
      "length": "Длина",
      "width": "Ширина",
      "nodrill": "Не сверлить",
      "lock_move": "Блокировать перемещение",
      "unlock_move": "Разблокировать перемещение",
      "lock_minlength": "Блокировать минимальный размер",
      "unlock_minlength": "Разблокировать минимальный размер",
      "lock_maxlength": "Блокировать максимальный размер",
      "unlock_maxlength": "Разблокировать максимальный размер",
      "delete": "Удалить выбранные",
    },
    "settings": {
      "title": "Настройки",
      "showModule": "отображать модуль на детали",
      "deleteConfirm": "спрашивать перед удалением"
    },
    "print": {
      "title": "Просмотр печати"
    },
    "statusbar": {
      "move": "двигать рабочее поле",
      "scale": "масштаб",
      "rotate": "развернуть деталь",
      "snap": "привязка вкл/выкл",
      "stopmeasure": "выход из режима измерения",
      "pick1": "выберите 1-ю точку прямоугольника внутри раскладки",
      "pick2": "выберите 2-ю точку прямоугольника внутри раскладки"
    },
    "viewport": {
      "tableTitle": "Раскладка",
      "module": "Модуль",
      "length": "Длина",
      "width": "Ширина",
      "count": "Кол-во",
    }
  },
  "title": "Конструктор шкафов-купе",
  "messages": {
    "deleteJointedPanels": "Будут также удалены все сопряженные детали. Продолжить?",
    "deletePanels": "Удалить выбранные детали?",
    "deleteTable": "Удалить выбранную раскладку?",
    "deleteRow": "Удалить строку?",
    "changeTexture": "Некоторые детали повернуты против текстуры. Перевернуть обратно?",
    "newProject": "Создать новый проект?",
    "corruptedProject": "Файл не соответствующего формата",
    "corruptedDetailList": "Файл не соответствующего формата",
    "logout": "Вы хотите выйти?"
  },
  "selection": {
    "crossSelect": "Partial selection",
    "fullSelect": "Full selection",
    "selectedVertexes": {
      "of": "of",
      "selected": "Points selected"
    }
  },
  "showGrid": "Show grid",
  "propBar": "Properties",
  "noPanelsSelected": "Нет выделенных деталей",
  "NPanelsSelected": " panels selected",
  "deleteButton": "Delete",
  "print": {
    "reportTitle": "Накладная на передачу панелей на вакуумировку",
    "date": "Дата",
    "order": "Заказ",
    "plan": "План",
    "material": "Материал",
    "complectCount": "Кол-во раскладок",
    "complect": "Комплектов",
    "module": "Модуль",
    "length": "Длина",
    "width": "Ширина",
    "count": "Кол-во",
    "total": "Итого",
    "ext": "Дополнительно",
    "tableTitle": "Раскладка",
    "of": "из",
    "tableSize": "Размер стола",
    "offsetLength": "Мин. отступ от краев по длине",
    "offsetWidth": "Мин. отступ от краев по ширине",
    "offsetDetails": "Мин. отступ между деталями"
  },
  "help": {
    "title": "Справка",
    "hotKeys": [
      { "key": "ESC", "desc": "Отмена операции" },
      { "key": "Delete", "desc": "Удалить выбранные детали" },
      { "key": "Колесико мыши", "desc": "Масштаб +/-" },
      { "key": "Средняя кнопка мыши", "desc": "Двигать рабочее поле" },
    ]
  }
}
