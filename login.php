<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f1f5f9;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: 'Segoe UI', sans-serif;
        }

        .login-container {
            background: #ffffff;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
            width: 100%;
            max-width: 400px;
        }

        .login-container h2 {
            font-size: 1.8rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            text-align: center;
            color: #2d3748;
        }

        .form-control {
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
        }

        .btn-primary {
            background-color: #4f46e5;
            border: none;
            border-radius: 0.5rem;
            padding: 0.75rem;
            font-weight: 500;
        }

        .btn-primary:hover {
            background-color: #4338ca;
        }

        .text-muted {
            font-size: 0.875rem;
            text-align: center;
        }

        .form-footer a {
            display: block;
            text-align: center;
            margin-top: 1rem;
            color: #6b7280;
            font-size: 0.875rem;
            text-decoration: none;
        }

        .form-footer a:hover {
            color: #4f46e5;
        }
    </style>
</head>

<body>
    <div class="login-container">
        <h2>Bienvenido</h2>
        <form action="login_process.php" method="POST">
            <div class="mb-3">
                <input type="text" name="username" class="form-control" placeholder="Usuario o correo" required>
            </div>
            <div class="mb-3">
                <input type="password" name="password" class="form-control" placeholder="Contraseña" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Iniciar Sesión</button>
        </form>
        <div class="form-footer">
            <a href="#" data-bs-toggle="modal" data-bs-target="#modalRecuperar">¿Olvidaste tu contraseña?</a>
        </div>
    </div>

    <!-- Modal: Olvidaste tu contraseña -->
    <div class="modal fade" id="modalRecuperar" tabindex="-1" aria-labelledby="modalRecuperarLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow-sm rounded">
                <div class="modal-header bg-warning text-dark">
                    <h5 class="modal-title" id="modalRecuperarLabel">Recuperación</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body text-center fs-5">
                    😢 <strong>¡Uy!</strong><br>
                    <span class="text-muted">Qué pena... no se puede recuperar la contraseña.</span><br>
                    <small class="text-secondary">Intenta recordar o crea una nueva cuenta 🧠</small>
                </div>

                <div class="modal-footer justify-content-center">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Entendido</button>
                </div>
            </div>
        </div>
    </div>

    <audio id="soundFail" src="https://assets.mixkit.co/sfx/preview/mixkit-sad-trombone-471.mp3"></audio>


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>


</body>

</html>