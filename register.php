<?php
include 'connection.php'; 

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['submit'])) {
    // Collect form data
    $firstname = trim($_POST['firstname']);
    $lastname = trim($_POST['lastname']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    
    $errors = [];

    // Validate first name
    if (empty($firstname) || !preg_match("/^[a-zA-Z]+$/", $firstname)) {
        $errors[] = "First name must only contain alphabets and cannot be empty.";
    }

    // Validate last name
    if (empty($lastname) || !preg_match("/^[a-zA-Z]+$/", $lastname)) {
        $errors[] = "Last name must only contain alphabets and cannot be empty.";
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format.";
    } else {
        
        $stmt = $conn->prepare("SELECT id FROM userdetail WHERE email_address = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $errors[] = "This email is already registered.";
        }
        $stmt->close();
    }

 
    if (strlen($password) < 8 || !preg_match("/[A-Z]/", $password) || !preg_match("/[0-9]/", $password)) {
        $errors[] = "Password must be at least 8 characters long, include at least one uppercase letter, and one number.";
    }

 
    if (!empty($errors)) {
        foreach ($errors as $error) {
            echo "<p style='color: red;'>$error</p>";
        }
    } else {
     
        $passwordHashed = password_hash($password, PASSWORD_DEFAULT); // Hash the password

        $stmt = $conn->prepare("INSERT INTO userdetail (firstname, lastname, email_address, password) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $firstname, $lastname, $email, $passwordHashed);

        if ($stmt->execute()) {
        
            echo "User registered successfully!";

            $userId = $conn->insert_id;
            $authToken = bin2hex(random_bytes(16)); 

            
            setcookie("auth_token", $authToken, time() + 3600, "/", "localhost", false, true);
            setcookie("username", $firstname . " " . $lastname, time() + 3600, "/", "localhost", false, true);

            header("Location: http://localhost:4000");
            exit();
        } else {
       
            echo "Error: " . $stmt->error;
        }
        $stmt->close();
    }
}
?>
