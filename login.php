<?php
include 'connection.php'; // Include the database connection file
session_start(); 

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['submit'])) {
    
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    
    $errors = [];

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Please enter a valid email address.";
    }

    // Validate password
    if (empty($password)) {
        $errors[] = "Password cannot be empty.";
    }

 
    if (empty($errors)) {
  
        $stmt = $conn->prepare("SELECT id, firstname, lastname, password FROM userdetail WHERE email_address = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
         
            $stmt->bind_result($id, $firstname, $lastname, $hashedPassword);
            $stmt->fetch();

           
            if (password_verify($password, $hashedPassword)) {
                // Set session variables
                $_SESSION['user_id'] = $id;
                $_SESSION['username'] = $firstname . " " . $lastname;

                // Redirect to localhost:4000
                header("Location: http://localhost:4000");
                exit();
            } else {
                $errors[] = "Incorrect password. Please try again.";
            }
        } else {
            $errors[] = "No account found with this email. Please sign up first.";
        }
        $stmt->close();
    }

   
    if (!empty($errors)) {
        foreach ($errors as $error) {
            echo "<p style='color: red;'>$error</p>";
        }
    }
}
?>
