import { PlaceErrorMessages } from '../components/shapes/PlaceErrors.js'
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
    "materials":{
      "title":"Материалы",
      "DSPColor" : "Цвет ДСП",
    },
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
        "type":{
          "type": "Тип",
          "single": "Одинарный",
          "double": "Двойной",
        },
        "fasadeCount": "Кол-во фасадов"
      }
    },
    "info": {
      "title": "Общая информация",
      "wardrobe": {
        "title": "Габариты",
        "width": "Ширина",
        "depth": "Глубина",
        "height": "Высота",
      },
      "materials": {
        "title": "Материалы",
        "width": "Цвет ДСП",
        "depth": "Глубина",
        "height": "Высота",
      }

    },
    "instruments": {
      "title": "Детали",
      "dimensions": "Размеры",
      "createVertical": "Добавить вертикальную деталь",
      "createHorizontal": "Добавить горизонтальную деталь",
      "createDrawer": "Добавить ящик",
      "createDrawerBlock": "Добавить ящичный блок",
      "createTube": "Добавить трубу",
      "createSingleDimension": "Добавить размер для одной детали",
      "createTwoPanelDimensionInside": "Добавить размер между деталями изнутри",
      "createTwoPanelDimensionOutside": "Добавить размер между деталями снаружи",
      "divideFasadHor": "Разделить фасад по высоте",
      "divideFasadVert": "Разделить фасад по ширине",
    },
    "operations":{
      "title": "Операции",
      "moveLeft": "Двигать влево",
      "moveRight": "Двигать вправо",
      "moveUp": "Двигать вверх",
      "moveDown": "Двигать вниз",
      "resetView": "Центрировать вид",
      "distribute": "Расставить равномерно",
    },
    "property": {
      "title": "Свойства",
      "noselected": "Нет выделенных объектов",
      "selected": "Выделено объектов: ",
      "name": "Название",
      "length": "Длина",
      "drawerWidth": "Ширина проема",
      "depth": "Глубина",
      "width": "Ширина",
      "nodrill": "Не сверлить",
      "lock_move": "Блокировать перемещение",
      "unlock_move": "Разблокировать перемещение",
      "lock_minlength": "Сделать текущий размер минимальным",
      "unlock_minlength": "Убрать минимальный размер",
      "lock_maxlength": "Сделать текущий размер максимальным",
      "unlock_maxlength": "Убрать максимальный размер",
      "delete": "Удалить",
      "levelup": "Перейти на уровень выше",
    },
    "settings": {
      "title": "Настройки",
      "showModule": "отображать модуль на детали",
      "deleteConfirm": "спрашивать перед удалением"
    },
    "print": {
      "title": "Просмотр печати",
      "close": "Закрыть"
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
    },
    "workspace": {
      "corpus": "КОРПУС",
      "fasades": "ФАСАДЫ"
    }
  },
  "handlers": {
    "create": {
      [PlaceErrorMessages.OUTSIDE_AREA]: "выходит за границы",
      [PlaceErrorMessages.ON_PANEL]: "попадает на деталь",
      [PlaceErrorMessages.NO_JOINTS]: "нет соединения",
      [PlaceErrorMessages.DONT_FIT]: "не помещается в размер",
    }
  },
  "title": "Конструктор шкафов-купе",
  "messages": {
    "deleteJointedPanels": "Будут также удалены все сопряженные детали. Продолжить?",
    "deletePanels": "Удалить выбранные объекты?",
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
    "title": "Заказ",
    "dataTable": {
      "title" : "Спецификация",
      "gabarits" : "1.Габариты изделия (общий)",
      "width" : "1.ширина:",
      "depth" : "2.глубина:",
      "height" : "3.высота:",
      "single" : "(цельный)",
      "double" : "(сдвоеннный)",
      "DSPcolor" : "2.Цвет ДСП",
      "DSPcorpus" : "1.ДСП (корпус):",
      "DSPext" : "2.ДСП (дополн):",
    }
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
