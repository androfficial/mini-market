const rangeSlider = document.getElementById('range-slider');

if (rangeSlider) {
	noUiSlider.create(rangeSlider, {
      start: [500, 999999],
		connect: true,
		step: 1,
      range: {
			'min': [500],
			'max': [999999]
      }
	});

	const input0 = document.getElementById('input-0');
	const input1 = document.getElementById('input-1');
	const inputs = [input0, input1];

	rangeSlider.noUiSlider.on('update', function(values, handle){
		inputs[handle].value = Math.round(values[handle]);
	});

	const setRangeSlider = (i, value) => {
		let arr = [null, null];
		arr[i] = value;

		rangeSlider.noUiSlider.set(arr);
	};

	inputs.forEach((el, index) => {
		el.addEventListener('change', (e) => {
			setRangeSlider(index, e.currentTarget.value);
		});
	});
}
const quizData = [{
   number: 1,
   title: "Какой тип кроссовок рассматриваете?",
   answer_alias: "type",
   answers: [{
         answer_title: "кеды",
         type: "checkbox"
      },
      {
         answer_title: "кеды",
         type: "checkbox"
      },
      {
         answer_title: "кеды",
         type: "checkbox"
      },
   {
         answer_title: "кеды",
         type: "checkbox"
      },
   {
         answer_title: "кеды",
         type: "checkbox"
      },
   {
         answer_title: "кеды",
         type: "checkbox"
      }
   ]
},
{
   number: 2,
   title: "Какой размер вам подойдет?",
   answer_alias: "size",
   answers: [{
         answer_title: "Менее 36",
         type: "checkbox"
      },
      {
         answer_title: "36-38",
         type: "checkbox"
      },
   {
         answer_title: "39-41",
         type: "checkbox"
      },
   {
         answer_title: "42-44",
         type: "checkbox"
      },
   {
         answer_title: "45 и больше",
         type: "checkbox"
      }
   ]
},
{
   number: 3,
   title: "Уточните какие-либо моменты",
   answer_alias: "message",
   answers: [{
      answer_title: "Введите сообщение",
      type: "textarea"
   },
   ]
}
];

const quizTemplate = (data = [], dataLength = 0, options) => {
const {number, title} = data;
const {nextBtnText} = options;
const answers = data.answers.map(item => {

 if (item.type === 'checkbox') {
   return `
     <li class="quiz-question__item">
      <div class="quiz-question__picture">
       <img src="img/quiz/01.jpg" alt="">
      </div>

      <label class="quiz-question__label custom-label">
         <input type="${item.type}" class="custom-input custom-checkbox__field" data-valid="false" name="${data.answer_alias}" ${item.type == 'text' ? 'placeholder="Введите ваш вариант"' : ''} value="${item.type !== 'text' ? item.answer_title : ''}">
         <span class="custom-content">${item.answer_title}</span>
      </label>
     </li>
   `;
 } else if (item.type === 'textarea') {
   return `
     <label class="quiz-question__label">
       <textarea placeholder="${item.answer_title}" class="quiz-question__message"></textarea>
     </label>
   `;
 } else {
   return `
     <label class="quiz-question__label">
       <input type="${item.type}" data-valid="false" class="quiz-question__answer" name="${data.answer_alias}" ${item.type == 'text' ? 'placeholder="Введите ваш вариант"' : ''} value="${item.type !== 'text' ? item.answer_title : ''}">
       <span>${item.answer_title}</span>
     </label>
   `;
 }

});

return `
 <div class="quiz-question">
   <h3 class="quiz-question__title">${title}</h3>
   <ul class="quiz-question__answers">
     ${answers.join('')}
   </ul>
   <div class="quiz-bottom">
     <div class="quiz-question__count">${number} из ${dataLength}</div>
     <button type="button" class="quiz-question__btn btn" data-next-btn>${nextBtnText}</button>
   </div>
 </div>
`
};

class Quiz {
constructor(selector, data, options) {
   this.$el = document.querySelector(selector);
   this.options = options;
   this.data = data;
   this.counter = 0;
   this.dataLength = this.data.length;
   this.resultArray = [];
   this.tmp = {};
   this.init()
   this.events()
}

init() {
   this.$el.innerHTML = quizTemplate(this.data[this.counter], this.dataLength, this.options);
}

nextQuestion() {

   if (this.valid()) {
      if (this.counter + 1 < this.dataLength) {
         this.counter++;
         this.$el.innerHTML = quizTemplate(this.data[this.counter], this.dataLength, this.options);

         if ((this.counter + 1 == this.dataLength)) {
            document.querySelector('.quiz-question__answers').style.display = 'block';
         }
      } else {
         document.querySelector('.quiz-questions').style.display = 'none';
         document.querySelector('.last-questions').style.display = 'block';
         document.querySelector('.quiz__title').textContent = 'Ваша подборка готова!';
         document.querySelector('.quiz__descr').textContent = 'Оставьте свои контактные данные, чтобы бы мы могли отправить  подготовленный для вас каталог';
      }
   } else {
      console.log('Не валидно!')
   }
}

events() {
   this.$el.addEventListener('click', (e) => {
      if (e.target == document.querySelector('[data-next-btn]')) {
         this.addToSend();
         this.nextQuestion();
      }

      if (e.target == document.querySelector('[data-send]')) {
         this.send();
      }
   });

   this.$el.addEventListener('change', (e) => {
      if (e.target.tagName == 'INPUT') {
         if (e.target.type !== 'checkbox' && e.target.type !== 'radio') {
            let elements = this.$el.querySelectorAll('input')

            elements.forEach(el => {
               el.checked = false;
            });
         }
         this.tmp = this.serialize(this.$el);
      }
   });
}

valid() {
   let isValid = false;

   let textarea = this.$el.querySelector('textarea');

 if (textarea) {
   if (textarea.value.length > 0) {
     isValid = true;
     return isValid;
   }
 }


   let elements = this.$el.querySelectorAll('input');
   elements.forEach(el => {
      switch(el.nodeName) {
         case 'INPUT':
            switch (el.type) {
               case 'text':
                  if (el.value) {
                     isValid = true;
                  } else {
                     el.classList.add('error')
                  }
               case 'checkbox':
                  if (el.checked) {
                     isValid = true;
                  } else {
                     el.classList.add('error')
                  }
               case 'radio':
                  if (el.checked) {
                     isValid = true;
                  } else {
                     el.classList.add('error')
                  }
            }
      }
   });

   return isValid;
}

addToSend() {
   this.resultArray.push(this.tmp)
}

send() {
   if (this.valid()) {
      const formData = new FormData();

      for (let item of this.resultArray) {
         for (let obj in item) {
            formData.append(obj, item[obj].substring(0, item[obj].length - 1));
         }
      }

      const response = fetch("mail.php", {
         method: 'POST',
         body: formData
      });
   }
}

serialize(form) {
   let field, s = {};
   let valueString = '';
   if (typeof form == 'object' && form.nodeName == "FORM") {
      let len = form.elements.length;
      for (let i = 0; i < len; i++) {
         field = form.elements[i];

         if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
            if (field.type == 'select-multiple') {
               for (j = form.elements[i].options.length - 1; j >= 0; j--) {
                  if (field.options[j].selected)
                     s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
               }
            } else if ((field.type != 'checkbox' && field.type != 'radio' && field.value) || field.checked) {
               valueString += field.value + ',';

               s[field.name] = valueString;


            }
         }
      }
   }
   return s
}
}

window.quiz = new Quiz('.quiz-form .quiz-questions', quizData, {
nextBtnText: "Следующий шаг",
sendBtnText: "Отправить",
});
const accordions = document.querySelectorAll('.faq-accordion');

accordions.forEach(el => {
   el.addEventListener('click', (e) => {
      const self = e.currentTarget;
      const control = self.querySelector('.faq-accordion__control');
      const content = self.querySelector('.faq-accordion__content');

      self.classList.toggle('_open');

      // если открыт аккордеон
      if (self.classList.contains('_open')) {
         control.setAttribute('aria-expanded', true);
         content.setAttribute('aria-hidden', false);
         content.style.maxHeight = content.scrollHeight + 'px';
      } else {
         control.setAttribute('aria-expanded', false);
         content.setAttribute('aria-hidden', true);
         content.style.maxHeight = null;
      }
   });
});
const catalogList       = document.querySelector('.catalog__products');
const catalogMore       = document.querySelector('.catalog__items-btn-more');
const prodModal         = document.querySelector('[data-graph-target="prod-modal"] .modal-content');
const prodModalSlider   = prodModal.querySelector('.modal-slider .swiper-wrapper');
const prodModalPreview  = prodModal.querySelector('.modal-slider .modal-preview');
const prodModalInfo     = prodModal.querySelector('.modal-info__wrapper');
const prodModalDescr    = prodModal.querySelector('.modal-descr');
const prodModalChars    = prodModal.querySelector('.prod-chars');
const prodModalVideo    = prodModal.querySelector('.video-modal');
let   modal             = null;
let   prodQuantity = 6;
let   dataLength = null;

const normalPrice = (str) => {
   return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
};

const modalSlider = new Swiper('.modal-slider__container', {
   slidesPerView: 1,
   spaceBetween: 20,
});

if (catalogList) {
   const loadProducts = (quantity = 5) => {
      fetch('/mini-market/data/data.json')
         .then((response) => {
            return response.json();
         })
         .then((data) => {
            dataLength = data.length;

            catalogList.innerHTML = '';

            for (let i = 0; i < dataLength; i++) {
               if (i < quantity) {
                  let item = data[i];

                  catalogList.innerHTML += `
                  <div class="catalog__column">
                     <article class="catalog__item item-catalog">
                        <div class="item-catalog__product">
                           <img src="${item.mainImage}" alt="${item.title}" class="item-catalog__product-image">
                           <div class="catalog__btns">
                              <button class="catalog__btn catalog__btn--info btn" data-graph-path="prod-modal" data-id="${item.id}" aria-label="Показать информацию о товаре">
                                 <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.9518 15.0664C18.9518 17.2489 17.1818 19.0176 14.9993 19.0176C12.8168 19.0176 11.0481 17.2489 11.0481 15.0664C11.0481 12.8826 12.8168 11.1139 14.9993 11.1139C17.1818 11.1139 18.9518 12.8826 18.9518 15.0664Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.9975 24.1936C19.7575 24.1936 24.1113 20.7711 26.5625 15.0661C24.1113 9.3611 19.7575 5.9386 14.9975 5.9386H15.0025C10.2425 5.9386 5.88875 9.3611 3.4375 15.0661C5.88875 20.7711 10.2425 24.1936 15.0025 24.1936H14.9975Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                 </svg>												
                              </button>
                              <button class="catalog__btn catalog__btn--basket btn add-to-cart-btn" data-id="${item.id}" aria-label="Добавить товар в корзину">
                                 <svg viewBox="0 0 28 26" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M27.9999 9.28571H23.2454L18.2502 0.450683C18.0025 0.0118078 17.465 -0.131483 17.0497 0.132405C16.6353 0.396293 16.5011 0.966644 16.7498 1.40646L21.2046 9.28571H6.79543L11.2502 1.40639C11.4989 0.966581 11.3647 0.39623 10.9503 0.132342C10.5342 -0.131546 9.99842 0.0117453 9.74975 0.450621L4.75464 9.28565H0V11.1428H1.89911L4.12206 23.7266C4.35446 25.0442 5.43966 26 6.70265 26H21.2974C22.5603 26 23.6455 25.0442 23.8771 23.7275L26.1008 11.1428H28L27.9999 9.28571ZM22.1569 23.3857C22.08 23.8246 21.7186 24.1429 21.2973 24.1429H6.70265C6.28138 24.1429 5.91996 23.8246 5.84219 23.3848L3.67904 11.1428H24.321L22.1569 23.3857Z"/>
                                 </svg>												
                              </button>
                           </div>
                        </div>
                        <h3 class="item-catalog__title">
                           <a href="#" class="item-catalog__title-link">${item.title}</a>
                        </h3>
                        <span class="item-catalog__price">${normalPrice(item.price)} ₽</span>
                     </article>
                  </div>
                  `;
               }
            }
         })

         .then(() => {
            
            cartLogic();

            modal = new GraphModal({
               isOpen: (modal) => {
                  if (modal.modalContainer.classList.contains('prod-modal')) {
                     const openBtnId = modal.previousActiveElement.dataset.id;
                     loadModalData(openBtnId);
                     modalSlider.update();
                  }
               },
            });

         })

   };

   loadProducts(prodQuantity);

   const loadModalData = (id = 1) => (
      fetch('/mini-market/data/data.json')
         .then((response) => {
            return response.json();
         })
         .then((data) => {
            prodModalSlider.innerHTML  = '';
            prodModalPreview.innerHTML = '';
            prodModalInfo.innerHTML    = '';
            prodModalDescr.textContent = '';
            prodModalChars.innerHTML   = '';
            prodModalVideo.innerHTML   = '';

            for (let dataItem of data) {
              if (dataItem.id == id) {

               const slides = dataItem.gallery.map((image, idx) => {
                  return `
                     <div class="swiper-slide" data-index="${idx}">
                        <img src="${image}" alt="">
                     </div>
                  `;
               });                 

               const preview = dataItem.gallery.map((image, idx) => {
                  return `
                     <div class="modal-preview__item item-preview ${idx === 0 ? 'modal-preview__item--active' : ''}" tabindex="0" data-index="${idx}">
                        <img src="${image}" alt="">
                     </div>
                   `;
               });

               const sizes = dataItem.sizes.map((size, idx) => {
                  return `
                     <li class="modal-sizes__item">
                        <button class="modal-sizes__btn">${size}</button>
                     </li>
                   `;
               });

               prodModalSlider.innerHTML  = slides.join('');
               prodModalPreview.innerHTML = preview.join('');

               prodModalInfo.innerHTML    = `
                  <h3 class="modal-info__title">${dataItem.title}</h3>
                  <div class="modal-info__rate">
                     <img src="img/modal1/star-1.svg" alt="Рейтинг 5 из 5">
                     <img src="img/modal1/star-1.svg" alt="">
                     <img src="img/modal1/star-1.svg" alt="">
                     <img src="img/modal1/star-1.svg" alt="">
                     <img src="img/modal1/star-1.svg" alt="">
                  </div>
                  <div class="modal-info__sizes">
                     <span class="modal-info__subtitle">Выберите размер</span>
                     <ul class="modal-info__sizes-list modal-sizes">
                        ${sizes.join('')}
                     </ul>
                  </div>
                  <div class="modal-info__price">
                     <span class="modal-info__current-price">${dataItem.price} р</span>
                     <span class="modal-info__old-price">${dataItem.oldPrice ? dataItem.oldPrice + 'р' : ''}</span>
                  </div>
               `;


               prodModalDescr.textContent = dataItem.description;

               let charsItems = '';

               Object.keys(dataItem.chars).forEach(function eachKey(key) {
                  charsItems += `<p class="bottom-modal__descr modal-descr">${key}: ${dataItem.chars[key]}</p>`
               });

               prodModalChars.innerHTML   = charsItems;

               if (dataItem.video) {
                  prodModalVideo.style.display = 'block';
                  prodModalVideo.innerHTML   = `
                     <iframe class="modal__video-play" src="${dataItem.video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  `;
               } else {
                  prodModalVideo.style.display = 'none';
               }
              } 
            }
         })
         .then(() => {
            modalSlider.update();

            modalSlider.on('slideChangeTransitionEnd', function() {
               let idx = document.querySelector('.swiper-slide-active').dataset.index;
               document.querySelectorAll('.modal-preview__item').forEach(el => {el.classList.remove('modal-preview__item--active');});
               document.querySelector(`.modal-preview__item[data-index="${idx}"]`).classList.add('modal-preview__item--active');
            });

            document.querySelectorAll('.modal-preview__item').forEach(el => {
               el.addEventListener('click', (e) => {
                  const idx = parseInt(e.currentTarget.dataset.index);
                  document.querySelectorAll('.modal-preview__item').forEach(el => {el.classList.remove('modal-preview__item--active');});
                  e.currentTarget.classList.add('modal-preview__item--active');

                  modalSlider.slideTo(idx);
               }); 
            });
         })
   );

    catalogMore.addEventListener('click', (e) => {
       prodQuantity = prodQuantity + 3;

       loadProducts(prodQuantity);

       if (prodQuantity >= dataLength) {
          catalogMore.style.display = 'none';
       } else {
          catalogMore.style.display = 'block';
       }
    });
}


//Работа корзины
let price = 0;
const miniCartList = document.querySelector('.mini-cart__list');
const fullPrice    = document.querySelector('.mini-cart__summ');
const cartCount    = document.querySelector('.cart__count');

const priceWithoutSpaces = (str) => {
   return str.replace(/\s/g, '');
};

const plusFullPrice = (currentPrice) => {
   return price += currentPrice;
};

const minusFullPrice = (currentPrice) => {
   return price -= currentPrice;
};

const printFullPrice = () => {
   fullPrice.textContent = `${normalPrice(price)} ₽`;
};

const printQuantity = (num) => {
   cartCount.textContent = num;
};

const loadCartData = (id = 1) => (
   fetch('/mini-market/data/data.json')
      .then((response) => {
         return response.json();
      })
      .then((data) => {
         for (let dataItem of data) {
            if (dataItem.id == id) {
               miniCartList.insertAdjacentHTML('afterbegin', `
                  <li class="mini-cart__item" data-id="${dataItem.id}">
                     <article class="mini-cart__product mini-product">
                        <div class="mini-product__imginside">
                           <div class="mini-product__picture">
                              <img src="${dataItem.mainImage}" alt="${dataItem.title}">
                           </div>
                        </div>
                        <div class="mini-product__content">
                           <div class="mini-product__text">
                              <h3 class="mini-product__title">${dataItem.title}</h3>
                              <span class="mini-product__price">${normalPrice(dataItem.price)} <span>₽</span></span>
                           </div>
                           <button class="mini-product__delete btn" aria-label="Удалить товар">
                              Удалить
                              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M18.5715 2.85715H13.5715V2.14285C13.5715 0.959387 12.6121 0 11.4287 0H8.57152C7.38805 0 6.42867 0.959387 6.42867 2.14285V2.85715H1.42865C1.03415 2.85715 0.714355 3.17695 0.714355 3.57145C0.714355 3.96595 1.03419 4.28571 1.42865 4.28571H2.20506L3.57151 19.3507C3.6052 19.7196 3.91537 20.0015 4.28581 20H15.7144C16.0848 20.0015 16.395 19.7196 16.4287 19.3507L17.7951 4.28571H18.5715C18.966 4.28571 19.2858 3.96591 19.2858 3.57141C19.2858 3.17691 18.966 2.85715 18.5715 2.85715ZM7.85722 2.14285C7.85722 1.74835 8.17702 1.42856 8.57152 1.42856H11.4287C11.8232 1.42856 12.143 1.74835 12.143 2.14285V2.85715H7.85726V2.14285H7.85722ZM15.0622 18.5714H4.93796L3.64295 4.28571H7.14296H16.3608L15.0622 18.5714Z" fill="#4D4D4D" fill-opacity="0.3"/>
                                 <path d="M7.8573 16.381C7.85722 16.38 7.85717 16.379 7.85709 16.378L7.14279 6.37805C7.11479 5.98355 6.77227 5.68647 6.3778 5.71447C5.9833 5.74247 5.68623 6.085 5.71423 6.47946L6.42853 16.4794C6.45519 16.854 6.76733 17.144 7.14283 17.143H7.19427C7.58781 17.1157 7.88467 16.7745 7.8573 16.381Z" fill="#4D4D4D" fill-opacity="0.3"/>
                                 <path d="M9.99994 5.71436C9.60544 5.71436 9.28564 6.03415 9.28564 6.42865V16.4286C9.28564 16.8231 9.60544 17.1429 9.99994 17.1429C10.3944 17.1429 10.7142 16.8231 10.7142 16.4286V6.42865C10.7142 6.03415 10.3944 5.71436 9.99994 5.71436Z" fill="#4D4D4D" fill-opacity="0.3"/>
                                 <path d="M13.6219 5.71423C13.2274 5.68623 12.8849 5.9833 12.8569 6.3778L12.1426 16.3778C12.1137 16.7712 12.4091 17.1136 12.8026 17.1425C12.8038 17.1426 12.8049 17.1427 12.8062 17.1428H12.8569C13.2324 17.1437 13.5445 16.8537 13.5712 16.4792L14.2855 6.47921C14.3135 6.08475 14.0164 5.74227 13.6219 5.71423Z" fill="#4D4D4D" fill-opacity="0.3"/>
                              </svg>												
                           </button>
                        </div>
                     </article>
                   </li>
               `);

               return dataItem;
            }
         }
      })
      .then((item) => {
         plusFullPrice(item.price);
         printFullPrice();

         let num = document.querySelectorAll('.mini-cart__list .mini-cart__item').length;

         if (num > 0) {
            cartCount.classList.add('cart__count--visible');
         }

         printQuantity(num);
      })
);


const cartLogic = () => {
   const catalogBtn = document.querySelectorAll('.catalog__btn--basket');

   catalogBtn.forEach(el => {

      el.addEventListener('click', (e) => {
         const id = e.currentTarget.dataset.id;
         loadCartData(id);

         document.querySelector('.cart__btn').classList.remove('cart__btn--inactive');

         e.currentTarget.classList.add('catalog__btn--disabled');
      });
   });

   miniCartList.addEventListener('click', (e) => {
      if (e.target.classList.contains('mini-product__delete')) {
         const self   = e.target;
         const parent = self.closest('.mini-cart__item');
         const price  = parseInt(priceWithoutSpaces(parent.querySelector('.mini-product__price').textContent));
         const id     = parent.dataset.id;

         document.querySelector(`.add-to-cart-btn[data-id="${id}"]`).classList.remove('catalog__btn--disabled');

         parent.remove();
         
         minusFullPrice(price);
         printFullPrice();

         let num = document.querySelectorAll('.mini-cart__list .mini-cart__item').length;

         if (num == 0) {
            cartCount.classList.remove('cart__count--visible');
            miniCart.classList.remove('mini-cart--show');
            document.querySelector('.cart__btn').classList.add('cart__btn--inactive');
         }

         printQuantity(num);
      }
   });
};

const openOrderModal     = document.querySelector('.mini-cart__btn');
const orderModalList     = document.querySelector('.content-details__list');
const orderModalQuantity = document.querySelector('.top-details__quantity span');
const orderModalSumm     = document.querySelector('.top-details__summ span');
const orderModalShow     = document.querySelector('.content-details__btn');

openOrderModal.addEventListener('click', () => {
   const productsHtml = document.querySelector('.mini-cart__list').innerHTML;
   orderModalList.innerHTML = productsHtml;

   orderModalQuantity.textContent = `${document.querySelectorAll('.mini-cart__list .mini-cart__item').length} шт`;
   orderModalSumm.textContent     = fullPrice.textContent;
});

orderModalShow.addEventListener('click', () => {
   if (orderModalList.classList.contains('content-details__list--show')) {
      orderModalList.classList.remove('content-details__list--show');
      orderModalShow.classList.remove('content-details__btn--active');
   } else {
      orderModalList.classList.add('content-details__list--show');
      orderModalShow.classList.add('content-details__btn--active');
   }
});

orderModalList.addEventListener('click', (e) => {
   if (e.target.classList.contains('mini-product__delete')) {
      const self   = e.target;
      const parent = self.closest('.mini-cart__item');
      const price  = parseInt(priceWithoutSpaces(parent.querySelector('.mini-product__price').textContent));
      const id     = parent.dataset.id;

      document.querySelector(`.add-to-cart-btn[data-id="${id}"]`).classList.remove('catalog__btn--disabled');

      parent.style.display = 'none';

      setTimeout(() => {
         parent.remove();
         document.querySelector(`.mini-cart__item[data-id="${id}"]`).remove();
      }, 100);
      
      minusFullPrice(price);
      printFullPrice();

      setTimeout(() => {
         let num = document.querySelectorAll('.content-details__list .mini-cart__item').length;

         if (num == 0) {
            cartCount.classList.remove('cart__count--visible');
            miniCart.classList.remove('mini-cart--show');
            document.querySelector('.cart__btn').classList.remove('cart__btn--inactive');

            modal.close();
         }

         printQuantity(num);
      }, 100);

   }
});
const cartBtn  = document.querySelector('.cart__btn');
const miniCart = document.querySelector('.mini-cart');

cartBtn.addEventListener('click', () => {
   miniCart.classList.toggle('mini-cart--show');
});

document.addEventListener('click', (e) => {
   if (!e.target.classList.contains('mini-cart') && !e.target.closest('.mini-cart') && !e.target.classList.contains('cart__btn')) {
      miniCart.classList.remove('mini-cart--show');
   }
});
const body   = document.querySelector('body');
const burger = document.querySelector('.menu__icon');
const menu   = document.querySelector('.menu__body');

burger.addEventListener('click', () => {
   body.classList.toggle('_lock');
   burger.classList.toggle('_active');
   menu.classList.toggle('_active');
});
