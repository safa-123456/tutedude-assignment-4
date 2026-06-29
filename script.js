$(document).ready(function(){


    // Show / Hide Password

    $("#togglePassword").click(function(){


        let passwordField = $("#password");


        if(passwordField.attr("type") === "password"){


            passwordField.attr("type","text");

            $(this).text("Hide");


        }

        else{


            passwordField.attr("type","password");

            $(this).text("Show");


        }


    });






    // Form Validation

    $("#registrationForm").submit(function(event){


        event.preventDefault();



        let name = $("#name").val().trim();

        let email = $("#email").val().trim();

        let phone = $("#phone").val().trim();

        let password = $("#password").val();



        let messageBox = $("#message");



        messageBox.removeClass("error success");




        // Required Field Validation

        if(name === "" || email === "" || phone === "" || password === ""){


            showError("All fields are required");

            return;

        }






        // Email Validation

        let emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



        if(!emailPattern.test(email)){


            showError("Enter a valid email address");

            return;


        }






        // Phone Validation


        let phonePattern = /^[0-9]{10}$/;



        if(!phonePattern.test(phone)){


            showError("Phone number must contain exactly 10 digits");

            return;


        }






        // Password Validation

        let passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;



        if(!passwordPattern.test(password)){


            showError(
            "Password must have minimum 8 characters, uppercase, lowercase and number"
            );


            return;


        }







        // Success Message


        messageBox
        .addClass("success")
        .text("Form submitted successfully!");



        this.reset();



    });






    // Error Function

    function showError(message){


        $("#message")
        .addClass("error")
        .text(message);



    }



});