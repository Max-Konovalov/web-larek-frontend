# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


## Проектирование 
Давайте рассмотрим основные компоненты и их взаимодействие.

### Основные классы (Базовые классы)

1. **Component<T>**
```typescript
class Component<T extends HTMLElement> {
    container: T;

    constructor(container: T) {
        this.container = container;
    }
}
```
   - Представляет базовый компонент с различными элементами HTML и методами для управления ими.
   - Методы:
     - `toggleClass()`: Переключение класса элемента.
     - `setText()`: Установка текста элемента.
     - `setDisable()`: Отключение элемента.
     - `setHidden()`: Скрытие элемента.
     - `setVisible()`: Отображение элемента.
     - `setImage()`: Установка изображения элемента.
     - `render()`: Отображение данных.

2. **View<T>**
```typescript
class View<T extends HTMLElement> extends Component<T> {
    events: IEvents;

    constructor(container: T, events: IEvents) {
        super(container);
        this.events = events;
    }
}
```
   - Базовый класс для всех представлений, наследует Component.
   - Содержит контейнер и события.
    
### Классы

1. **WebLarekAPI**

```typescript
class WebLarekAPI implements IWebLarekAPI {
    cdn: string;
    baseUrl: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        this.cdn = cdn;
        this.baseUrl = baseUrl;
    }
}
```

   - Класс для взаимодействия с WebLarek API, реализует интерфейс IWebLarekAPI.
   - Свойства:
     - `cdn`: URL контентной сети доставки.

2. **EventEmitter**
   - Класс для управления событиями, реализует интерфейс IEvents.
   - Методы:
     - `onAll()`: Подписка на все события.
     - `offAll()`: Отписка от всех событий.
       
3. **AppData**
```typescript
class AppData {
    items: IProduct[] = [];
    preview: IProduct | null = null;
    basket: IBasket = { items: [], total: 0 };
    order: IOrder | null = null;
    formErrors: Partial<Record<string, string>> = {};
    events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }
}
```
   - Класс для управления данными приложения.
   - Свойства:
     - `items`: Список продуктов.
     - `preview`: Предпросмотр продукта.
     - `basket`: Корзина.
     - `order`: Заказ.
     - `formErrors`: Ошибки формы.
     - `events`: События.
   - Методы:
     - `setItems()`: Установка списка продуктов.
     - `setPreviewItem()`: Установка продукта для предпросмотра.
     - `isInBasket()`: Проверка наличия продукта в корзине.
     - `addToBasket()`: Добавление продукта в корзину.
     - `removeFromBasket()`: Удаление продукта из корзины.
     - `clearBasket()`: Очистка корзины.
     - `setPaymentMethod()`: Установка метода оплаты.
     - `setOrderField()`: Установка поля заказа.
     - `validateOrder()`: Валидация заказа.
     - `clearOrder()`: Очистка заказа.

4. **Page**
```typescript
class Page extends View<HTMLDivElement> {
    counter: HTMLElement;
    catalog: HTMLElement;
    wrapper: HTMLElement;
    basket: HTMLElement;
}
```
   - Представление страницы.
   - Свойства:
     - `counter`: Счетчик.
     - `catalog`: Каталог.
     - `wrapper`: Обертка.
     - `basket`: Корзина.
   - Методы:
     - `counter()`: Управление счетчиком.
     - `catalog()`: Управление каталогом.
     - `locked()`: Управление блокировкой.

5. **Basket**
```typescript
class Basket extends View<HTMLDivElement> {
    items: string{};
    list: string[];
    total: number;
    button: HTMLElement;
}
```
   - Представление корзины.
   - Свойства:
     - `items`: Элементы корзины.
     - `list`: Список элементов.
     - `total`: Общая стоимость.
     - `button`: Кнопка управления.
   - Методы:
     - `toggleButton()`: Переключение состояния кнопки.
     - `setItems()`: Установка элементов корзины.
     - `total()`: Расчет общей стоимости.

6. **Card**
```typescript
class Card extends View<HTMLDivElement> {
    title: string;
    image: string;
    price: number;
    description: string;
    category: string;
    button: HTMLButtonElement;
}
```
   - Представление карточки продукта.
   - Свойства:
     - `title`: Заголовок.
     - `image`: Изображение.
     - `price`: Цена.
     - `description`: Описание.
     - `category`: Категория.
     - `button`: Кнопка.
   - Методы:
     - `toggle()`: Переключение состояния.
     - `setTitle()`: Установка заголовка.
     - `setPrice()`: Установка цены.
     - `setDescription()`: Установка описания.
     - `setImage()`: Установка изображения.
     - `button()`: Управление кнопкой.

7. **Form**
```typescript
class Form extends View<HTMLFormElement> {
    submit: HTMLButtonElement;
    errors: HTMLElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        ...
    }
}
```

   - Представление формы.
   - Свойства:
     - `submit`: Кнопка отправки.
     - `errors`: Ошибки формы.
   - Методы:
     - `inputChange()`: Обработка изменения ввода.
     - `submit()`: Отправка формы.
     - `setVisible()`: Установка видимости.
     - `errors()`: Обработка ошибок.

8. **OrderForm**

```typescript
class OrderForm extends Form {
    _paymentCard: HTMLButtonElement;
    _paymentCash: HTMLButtonElement;
    address: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        ...
    }
}
```

   - Форма заказа.
   - Свойства:
     - `_paymentCard`: Кнопка оплаты картой.
     - `_paymentCash`: Кнопка оплаты наличными.
     - `address`: Адрес доставки.
   - Методы:
     - `OrderForm()`: Конструктор.
     - `setPaymentValue()`: Установка значения оплаты.
     - `address()`: Установка адреса.

9. **Success**
```typescript
class Success extends View<HTMLDivElement> {
    close: HTMLButtonElement;
    total: HTMLElement;

    constructor(container: HTMLDivElement, events: IEvents) {
        super(container, events);
        ...
    }
}
```
   - Представление успешного завершения операции.
   - Свойства:
     - `close`: Кнопка закрытия.
     - `total`: Общая сумма.
   - Методы:
     - `Success()`: Конструктор.
     - `total()`: Расчет общей суммы.

10. **Modal**
```typescript
class Modal extends View<HTMLDivElement> {
    closeButton: HTMLButtonElement;
    content: HTMLElement;

    constructor(container: HTMLDivElement, events: IEvents) {
        super(container, events);
        ...
    }
}
```
   - Модальное окно.
   - Свойства:
     - `closeButton`: Кнопка закрытия.
     - `content`: Содержимое модального окна.
   - Методы:
     - `open()`: Открытие модального окна.
     - `close()`: Закрытие модального окна.
     - `render()`: Отображение данных.

11. **ContactsForm**
```typescript
class ContactsForm extends Form {
    name: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        ...
    }
}
```
   - Форма контактов.
   - Свойства:
     - `submit`: Кнопка отправки.
     - `name`: Поле ввода имени.
   - Методы:
     - `ContactsForm()`: Конструктор.

### Интерфейсы
1. **Api**
```typescript
interface Api {
    baseUrl: string;
    options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = options;
    }
}
```
   - Интерфейс для взаимодействия с API.
   - Методы:
     - `get()`: Выполнение GET-запроса.
     - `post()`: Выполнение POST-запроса.
     - `handleResponse()`: Обработка ответа от сервера.

2. **IEvents** (Интерфейс)
   - Интерфейс для работы с событиями.
   - Методы:
     - `on()`: Подписка на событие.
     - `emit()`: Испускание события.
     - `trigger()`: Вызов события.

3. **IWebLarekAPI** (Интерфейс)
   - Интерфейс для взаимодействия с WebLarek API.
   - Методы:
     - `getProductList()`: Получение списка продуктов.
     - `getProduct()`: Получение продукта по ID.
     - `createOrder()`: Создание заказа.
    
### События приложения

#### События изменения данных (генерируются из модели данных)

- items:change - изменение массива продуктов
- preview:change - изменение продукта, который открыт в модальном окне
- basket:change - изменение изменение списка корзины
- formErrors:change - изменение в списке ошибок валидации формы

#### События интерфейса (генерируются из классов представления)
- modal:open - открытие модального окна
- modal:close - закрытие модального окна
- basket:open - открытие модального окна корзины
- card:select - выбор карточки
- order:open - открытие окна оформления заказа
- форма:submit - отправка формы с кастомным названием
- форма.поле:change - изменение поля с кастомным названием в форме с кастомным названием

### Взаимодействие классов

- **EventEmitter** используется для управления событиями в различных компонентах.
- **Api** взаимодействует с **WebLarekAPI** для выполнения запросов к серверу.
- **AppData** управляет состоянием приложения и взаимодействует с различными представлениями, такими как **Page**, **Basket**, и **Card**.
- **Forms** используются для обработки пользовательских данных и управления формами, такими как **OrderForm** и **ContactsForm**.

Эта архитектура предоставляет структурированный подход к разработке клиентской части веб-приложения, обеспечивая модульность, переиспользуемость и управляемость кода.


https://github.com/Max-Konovalov/web-larek-frontend/blob/main/README.md
