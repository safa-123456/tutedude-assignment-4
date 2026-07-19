

$(function () {

  const $form = $('#registrationForm');

  const $fullName = $('#fullName');
  const $email = $('#email');
  const $phone = $('#phone');
  const $password = $('#password');
  const $confirmPassword = $('#confirmPassword');

  const $togglePasswordBtn = $('#togglePassword');
  const $strengthMeter = $('#strengthMeter');

  const $errorBanner = $('#errorBanner');
  const $successBanner = $('#successBanner');

  const $statusReadout = $('#statusReadout');
  const $statusText = $('#statusText');

  
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_PATTERN = /^\d{10}$/;


  function showFieldError($input, $errorEl, message) {
    $input.addClass('is-invalid').removeClass('is-valid');
    $errorEl.text(message).addClass('is-shown');
  }

  function clearFieldError($input, $errorEl) {
    $input.addClass('is-valid').removeClass('is-invalid');
    $errorEl.text('').removeClass('is-shown');
  }

  

  function validateFullName() {
    const value = $fullName.val().trim();

    if (value === '') {
      showFieldError($fullName, $('#fullNameError'), "Don't forget to tell us your name.");
      return false;
    }

    clearFieldError($fullName, $('#fullNameError'));
    return true;
  }

  function validateEmail() {
    const value = $email.val().trim();

    if (value === '') {
      showFieldError($email, $('#emailError'), "We'll need your email address.");
      return false;
    }

    if (!EMAIL_PATTERN.test(value)) {
      showFieldError($email, $('#emailError'), "That email doesn't look quite right — try something like name@example.com.");
      return false;
    }

    clearFieldError($email, $('#emailError'));
    return true;
  }

  function validatePhone() {
    const value = $phone.val().trim();

    if (value === '') {
      showFieldError($phone, $('#phoneError'), "We'll need a phone number too.");
      return false;
    }

    if (!PHONE_PATTERN.test(value)) {
      showFieldError($phone, $('#phoneError'), "That's not quite 10 digits — mind double-checking it?");
      return false;
    }

    clearFieldError($phone, $('#phoneError'));
    return true;
  }

  
  function calculatePasswordStrength(value) {
    let score = 0;

    if (value.length >= 8) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;

    
    if (score === 4 && /[^A-Za-z0-9]/.test(value)) score = 4;

    return score;
  }
   
  function updateStrengthMeter(value) {
    const score = calculatePasswordStrength(value);

    $strengthMeter.attr('class', 'strength-meter'); // reset classes
    if (value.length > 0) {
      $strengthMeter.addClass('strength-' + score);
    }
  }

  function validatePassword() {
    const value = $password.val();

    if (value === '') {
      showFieldError($password, $('#passwordError'), "You'll need to set a password.");
      return false;
    }

    const hasMinLength = value.length >= 8;
    const hasLower = /[a-z]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasDigit = /\d/.test(value);

    if (!hasMinLength || !hasLower || !hasUpper || !hasDigit) {
      showFieldError(
        $password,
        $('#passwordError'),
        'Give it at least 8 characters, with a mix of uppercase, lowercase, and a number.'
      );
      return false;
    }

    clearFieldError($password, $('#passwordError'));
    return true;
  }

  function validateConfirmPassword() {
    const value = $confirmPassword.val();

    if (value === '') {
      showFieldError($confirmPassword, $('#confirmPasswordError'), 'Go ahead and confirm your password.');
      return false;
    }

    if (value !== $password.val()) {
      showFieldError($confirmPassword, $('#confirmPasswordError'), "Hmm, those passwords don't match.");
      return false;
    }

    clearFieldError($confirmPassword, $('#confirmPasswordError'));
    return true;
  }


  function isFormCurrentlyValid() {
    return (
      $fullName.val().trim() !== '' &&
      EMAIL_PATTERN.test($email.val().trim()) &&
      PHONE_PATTERN.test($phone.val().trim()) &&
      calculatePasswordStrength($password.val()) >= 3 &&
      $confirmPassword.val() !== '' &&
      $confirmPassword.val() === $password.val()
    );
  }

  function refreshStatusReadout() {
    const anyInteracted = [$fullName, $email, $phone, $password, $confirmPassword]
      .some($el => $el.val().trim() !== '');

    if (!anyInteracted) {
      $statusReadout.removeClass('is-valid is-invalid');
      $statusText.text("Let's get started");
      return;
    }

    if (isFormCurrentlyValid()) {
      $statusReadout.addClass('is-valid').removeClass('is-invalid');
      $statusText.text("Looks good — ready to go");
    } else {
      $statusReadout.addClass('is-invalid').removeClass('is-valid');
      $statusText.text('A few things still need fixing');
    }
  }


  $togglePasswordBtn.on('click', function () {
    const isCurrentlyPassword = $password.attr('type') === 'password';

    $password.attr('type', isCurrentlyPassword ? 'text' : 'password');
    $togglePasswordBtn.attr('aria-pressed', isCurrentlyPassword);
    $togglePasswordBtn.attr('aria-label', isCurrentlyPassword ? 'Hide password' : 'Show password');

    $togglePasswordBtn.find('.icon-eye').attr('hidden', isCurrentlyPassword);
    $togglePasswordBtn.find('.icon-eye-off').attr('hidden', !isCurrentlyPassword);
  });


  $phone.on('input', function () {
    // Restrict phone input to digits only, capped at 10 characters.
    const digitsOnly = $phone.val().replace(/\D/g, '').slice(0, 10);
    $phone.val(digitsOnly);
  });

  $fullName.on('blur input', validateFullName);
  $email.on('blur input', validateEmail);
  $phone.on('blur input', validatePhone);

  $password.on('input', function () {
    updateStrengthMeter($password.val());
  });
  $password.on('blur', validatePassword);

  $confirmPassword.on('blur input', validateConfirmPassword);

  // Keep the live status readout current on every keystroke.
  $form.on('input', refreshStatusReadout);


  $form.on('submit', function (event) {
    event.preventDefault();

    // Run every validator; using separate variables (not short-circuiting)
    // ensures every field gets its own error message shown at once.
    const isFullNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    const isEntireFormValid =
      isFullNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmPasswordValid;

    if (!isEntireFormValid) {
      $successBanner.attr('hidden', true).text('');
      $errorBanner
        .text("A couple of things still need a second look before we can continue.")
        .removeAttr('hidden');
      refreshStatusReadout();
      return;
    }

    $form[0].reset();
    $('.field input').removeClass('is-valid is-invalid');
    $('.field-error').removeClass('is-shown').text('');
    updateStrengthMeter('');
    refreshStatusReadout();
  });

});
