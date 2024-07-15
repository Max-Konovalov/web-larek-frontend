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

### Основные классы (Базовый класс)
**Component<T>**
```typescript
class Component<T extends HTMLElement> {
     protected constructor(protected readonly container: HTMLElement) {
     }
}
```
   - Представляет базовый компонент с различными элементами HTML и методами для управления ими.
   - Методы:
     - `changeText()`: Установка текста элемента.
     - `toggleElement()`: Отключение элемента.
     - `render()`: Отображение данных.


### Классы

1. **WebLarekAPI**

```typescript
class WebLarekAPI implements IWebLarekAPI {
     readonly cdn: string;
     constructor(cdn: string, baseUrl: string, options?: RequestInit) {
          super(baseUrl, options);
          this.cdn = cdn;
     }
}
```

   - Класс для взаимодействия с WebLarek API, реализует интерфейс IWebLarekApi.
   - Свойства:
     - `cdn`: URL контентной сети доставки.

2. **EventEmitter**
   - Класс для управления событиями, реализует интерфейс IEvents.
   - Методы:
     - `onAll()`: Подписка на все события.
     - `offAll()`: Отписка от всех событий.
       
3. **AppData**
```typescript
class AppState {
     catalog: IProduct[] = [];
     cart: IProduct[] = [];
     order: IOrder = {
          address: '',
          payment: '',
          email: '',
          phone: '',
          total: 0,
          items: [],
     };
     orderFormErrors: OrderFormErrors = {};
     contactsFormErrors: ContactsFormErrors = {};

     constructor(data: Partial<IAppState>, protected events: IEvents) {
          super(data, events);
          this.catalog = [];
          this.cart = [];
          this.clearOrderForm();
     }
}
```
   - Класс для управления данными приложения.
   - Свойства:
     - `cart`: Корзина.
     - `order`: Заказ. Включает в себя свойства:
       - `address` : Адрес.
       - `payment`: Способ оплаты.
       - `email`: Электронная почта.
       - `phone`: Телефон.
       - `total`: Итоговая сумма заказа.
       - `items`: Товары в корзине.
     - `orderFormErrors`: Ошибки формы заказа.
     - `contactsFormErrors`: Ошибки формы контактов.
   - Методы:
     - `addToCart()`: Добавление товара в корзину.
     - `removeFromCart` : Удаление товара из корзины. 
     - `isInCart` : Проверка на наличие товара в корзине.
     - `getCartCount` : Кол-во товаров в корзине.
     - `getTotalCartPrice` : Получение итоговой суммы заказа
     - `clearOrderForm` : Очистка формы заказа
     - `clearCartState` : Очистка корзины. 

4. **Page**
```typescript
class Page extends View<HTMLDivElement> {
     protected _counter: HTMLElement;
     protected _catalog: HTMLElement;
     protected _wrapper: HTMLElement;
     protected _basket: HTMLButtonElement;
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
     protected _list: HTMLElement;
     protected _total: HTMLElement;
     protected _button: HTMLElement;
}
```
   - Представление корзины.
   - Свойства:
     - `_list`: Список элементов.
     - `_total`: Общая стоимость.
     - `_button`: Кнопка управления.
   - Методы:
     - `toggleButton()`: Переключение состояния кнопки.
     - `items()`: Установка элементов корзины.
     - `total()`: Расчет общей стоимости.

6. **Card**
```typescript
class Card extends View<HTMLDivElement> {
     protected _title: HTMLElement;
     protected _price: HTMLElement;
     protected _image?: HTMLImageElement;
     protected _category?: HTMLElement;
     protected _button?: HTMLButtonElement;
     protected _description?: HTMLElement;
     protected _index?: HTMLElement;
}
```
   - Представление карточки продукта.
   - Свойства:
     - `_title`: Заголовок.
     - `_image`: Изображение.
     - `_price`: Цена.
     - `_description`: Описание.
     - `_category`: Категория.
     - `_button`: Кнопка.
     - `_index` : Номер карточки товара.
   - Методы:
     - `inCart` : Изменение статуса кнопки "В корзину"

7. **Form**
```typescript
class Form extends View<HTMLFormElement> {
    protected _submitButton: HTMLButtonElement;
    protected _errorElement: HTMLElement;
}
```

   - Представление формы.
   - Свойства:
     - `_submitButton`: Кнопка отправки.
     - `_errorElement`: Ошибки формы.
   - Методы:
     - `onInputChangeValue()`: Обработка изменения ввода.
     - `errors()`: Обработка ошибок.

8. **OrderForm**

```typescript
class OrderForm extends Form {
    protected _buttons: HTMLButtonElement[] = [];
}
```

   - Форма заказа.
   - Свойства:
     - `buttons`: Список типов оплаты.
   - Методы:
     - `cleanFieldValues()`: Очистка полей ввода.
     - `payment()`: Выбор способа оплаты.
     - `address()`: Установка адреса.

9. **Success**
```typescript
class Success extends View<HTMLDivElement> {
    protected _button: HTMLButtonElement;
    protected _description: HTMLElement;
}
```
   - Представление успешного завершения операции.
   - Свойства:
     - `_button`: Кнопка закрытия.
     - `_description`: Общая сумма.
   - Методы:
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
     - `getItemList()`: Получение списка продуктов.
     - `postOrder()`: Создание заказа.
    
### События приложения

#### События изменения данных (генерируются из модели данных)

- items:change - изменение массива продуктов
- cart:changed - изменение изменение списка корзины
- orderFormErrors:change - изменение в списке ошибок валидации формы заказа
- contactsFormErrors:change - изменение в списке ошибок валидации формы контактов

#### События интерфейса (генерируются из классов представления)
- modal:open - открытие модального окна
- modal:close - закрытие модального окна
- cart:open - открытие модального окна корзины
- card:select - выбор карточки
- order:open - открытие окна оформления заказа
- order:submit - отправка формы заказа
- contacts:submit - отправка формы контактов

### Взаимодействие классов

- **EventEmitter** используется для управления событиями в различных компонентах.
- **Api** взаимодействует с **WebLarekApi** для выполнения запросов к серверу.
- **AppData** управляет состоянием приложения и взаимодействует с различными представлениями, такими как **Page**, **Basket**, и **Card**.
- **Forms** используются для обработки пользовательских данных и управления формами, такими как **OrderForm** и **ContactsForm**.

Эта архитектура предоставляет структурированный подход к разработке клиентской части веб-приложения, обеспечивая модульность, переиспользуемость и управляемость кода.


https://github.com/Max-Konovalov/web-larek-frontend/blob/main/README.md
