
const theForm = document.querySelector('#checkoutForm');


function displayError(msg) {
	document.querySelector('.errors').textContent = msg
}

function isCardNumberValid(number) {
	return number === '1234123412341234'
}

function submitHandler(event) {
	event.preventDefault();
  let errorMsg = '';
	displayError('');

  let cardNumber = document.querySelector('#creditCardNumber');
  const cardNum = cardNumber.value.trim();
    
    if (!/^\d{16}$/.test(cardNum)) {
      errorMsg += 'Card number must be 16 digits\n';
    } else if (!isCardNumberValid(cardNum)) {
      errorMsg += 'Card number is not valid\n';
    }
    
    const expYear = Number(document.querySelector('#year').value);   
    const expMonth = Number(document.querySelector('#month').value);
    const currentDate = new Date()

    if (2000 + expYear < currentDate.getFullYear() || (2000 + expYear === currentDate.getFullYear() && expMonth <= (currentDate.getMonth()))
    ) {
        errorMsg += 'Card is expired\n';
    }

    if (errorMsg !== '') {
		displayError(errorMsg)
		return;
    }
    const formContainer = document.getElementById('checkoutForm');
    formContainer.innerHTML = '<h2>Thank you for your purchase.</h2>';
}
  
document.querySelector('#checkoutForm').addEventListener('submit', submitHandler)
          