<?php
include 'connection.php'; // Include the database connection file
session_start(); // Start the session

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['submit'])) {
    // Collect form data
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    // Initialize an array for errors
    $errors = [];

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Please enter a valid email address.";
    }

    // Validate password
    if (empty($password)) {
        $errors[] = "Password cannot be empty.";
    }

    // If no validation errors, proceed
    if (empty($errors)) {
        // Check if the email exists in the database
        $stmt = $conn->prepare("SELECT id, firstname, lastname, password FROM userdetail WHERE email_address = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            // Bind the result variables
            $stmt->bind_result($id, $firstname, $lastname, $hashedPassword);
            $stmt->fetch();

            // Verify the entered password with the hashed password
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

    // If there are errors, display them
    if (!empty($errors)) {
        foreach ($errors as $error) {
            echo "<p style='color: red;'>$error</p>";
        }
    }
}
?>
