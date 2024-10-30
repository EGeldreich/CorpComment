/* HTML ELEMENTS */

const counterEl = document.querySelector('.counter');
const textAreaEl = document.querySelector('.form__textarea');

const formEl = document.querySelector('.form');
const feedbacksEl = document.querySelector('.feedbacks');
const submitBtnEl = document.querySelector('.submit-btn');

const spinnerEl = document.querySelector('.spinner');
/* VARIABLES */

const MAX_CHARS = 150;


/* COUNTER COMPONENT */

const inputHandler = () => {
    let formLength = textAreaEl.value.length;
    counterEl.textContent = MAX_CHARS - formLength;
};

textAreaEl.addEventListener('input', inputHandler);


/*  FORM COMPONENT */

// 
const visualIndicator = textCheck => {
    const className = textCheck === 'valid' ? 'form--valid' : 'form--invalid';
    formEl.classList.add(className);
        setTimeout(() => {
            formEl.classList.remove(className);
        }, 1500);
}

const submitHandler = (event) => {
    // prevent default browser action
    event.preventDefault();
    // get text from textarea
    const text = textAreaEl.value;
    //validate text
    if (text.includes(' #') && text.length >= 10) {
        visualIndicator('valid');
    } else {
        visualIndicator('invalid');
        textAreaEl.focus();
        // stop the fonction if the text is invalid
        return;
    }
    // extract relevant informations
    const hashtag = text.split(' ').find(word => word.includes('#'));
    const company = hashtag.substring(1); ;
    const badgeLetter = company.substring(0 , 1).toUpperCase();
    const upvoteCount = 0;
    const daysAgo = 0;

    // new feedback item
    const feedbackItemHTML = `
    <li class="feedback">
    <button class="upvote">
        <i class="fa-solid fa-caret-up upvote__icon"></i>
        <span class="upvote__count">${upvoteCount}</span>
    </button>
    <section class="feedback__badge">
        <p class="feedback__letter">${badgeLetter}</p>
    </section>
    <div class="feedback__content">
        <p class="feedback__company">${company}</p>
        <p class="feedback__text">${text}</p>
    </div>
    <p class="feedback__date">${daysAgo === 0 ? 'NEW' : `${daysAgo}d`}</p>
    </li>
    `;

    // add feedback
    feedbacksEl.insertAdjacentHTML('beforeend', feedbackItemHTML);

    // reset form
    textAreaEl.value = '';
    submitBtnEl.blur();
    counterEl.textContent = MAX_CHARS;
};

formEl.addEventListener('submit', submitHandler);


/* FEEDBACK LIST COMPONENT */

fetch('https://bytegrad.com/course-assets/js/1/api/feedbacks')
    .then(res => res.json())
    .then(data => {
        // remove waiting spinner
        spinnerEl.remove();

        data.feedbacks.forEach((element) => {
            const feedbackItemHTML = `
            <li class="feedback">
            <button class="upvote">
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${element.upvoteCount}</span>
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${element.badgeLetter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${element.company}</p>
                <p class="feedback__text">${element.text}</p>
            </div>
            <p class="feedback__date">${element.daysAgo === 0 ? 'NEW' : `${element.daysAgo}d`}</p>
            </li>
            `;
            feedbacksEl.insertAdjacentHTML('beforeend', feedbackItemHTML);
            });
        
    })
    .catch(error => {
        feedbacksEl.textContent = `Failed to fetch feedback items. Error message: ${error.message}`;
    });