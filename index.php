<?php
session_start();

// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['username'])) {
    header('Location: login.php'); // Redirigir al login si no hay sesión activa
    exit();
}

?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kanban Board</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="kanban.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</head>

<body>
    <div class="d-flex toggled" id="wrapper">
        <!-- Sidebar -->
        <div class="bg-light border-right" id="sidebar-wrapper">
            <div class="sidebar-heading">Proyectos</div>
            <div class="list-group list-group-flush" id="project-list">
                <!-- Projects will be loaded here dynamically -->
            </div>
        </div>
        <!-- /#sidebar-wrapper -->

        <!-- Page Content -->
        <div id="page-content-wrapper">
            <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                <button class="btn btn-primary" id="menu-toggle">☰</button>
                <span class="navbar-brand"></span>
                <button class="btn btn-primary ml-auto" onclick="addCard('todo')">Añadir Pedido</button>
                <a href="logout.php" class="btn btn-danger ml-2">
                    <i class="fas fa-sign-out-alt"></i>
                </a>
            </nav>

            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-4">
                        <h4>PENDIENTE</h4>
                        <div class="kanban-cards" id="todo"></div>
                    </div>
                    <div class="col-md-4">
                        <h4>EN PROCESO</h4>
                        <div class="kanban-cards" id="inprogress"></div>
                    </div>
                    <div class="col-md-4">
                        <h4>TERMINADO</h4>
                        <div class="kanban-cards" id="done"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- /#page-content-wrapper -->
    </div>
    <!-- /#wrapper -->

    <!-- Modal Nuevo Pedido -->
    <!-- Modal Nuevo Pedido -->
    <div class="modal fade" id="modalNuevaTarea" tabindex="-1" aria-labelledby="modalNuevaTareaLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <form id="formNuevaTarea">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Crear nuevo pedido</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label>Nombre del cliente</label>
                                <input type="text" class="form-control" name="cliente" required>
                            </div>
                            <div class="form-group col-md-6">
                                <label>Celular</label>
                                <input type="text" class="form-control" name="celular" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label>Fecha y hora de entrega</label>
                                <input type="datetime-local" class="form-control" name="entrega">
                            </div>
                            <div class="form-group col-md-6">
                                <label>Fecha de pago</label>
                                <input type="date" class="form-control" name="fecha_pago">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label>Precio</label>
                                <input type="text" class="form-control" name="precio">
                            </div>
                            <div class="form-group col-md-6">
                                <label>Adelanto</label>
                                <input type="text" class="form-control" name="adelanto">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Medio de pago</label>
                            <input type="text" class="form-control" name="medio_pago">
                        </div>

                        <!-- NUEVO CAMPO: MENSAJE -->
                        <div class="form-group">
                            <label>Mensaje</label>
                            <textarea class="form-control" name="mensaje" rows="2"
                                placeholder="Ej: Quiero ser más joven"></textarea>
                        </div>

                    </div>

                    <div class="modal-footer">
                        <button type="submit" class="btn btn-success">Crear Pedido</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <!-- Modal de Confirmación para Eliminar -->
    <div class="modal fade" id="modalConfirmarEliminar" tabindex="-1" role="dialog"
        aria-labelledby="confirmarEliminarLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content border-danger">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title" id="confirmarEliminarLabel">¿Eliminar pedido?</h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    Esta acción no se puede deshacer. ¿Deseas continuar?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button id="btnEliminarConfirmado" type="button" class="btn btn-danger">Eliminar</button>
                </div>
            </div>
        </div>
    </div>




    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="kanban.js"></script>
    <script>
        $(document).ready(function () {
            $("#menu-toggle").click(function (e) {
                e.preventDefault();
                $("#wrapper").toggleClass("toggled");
            });
        });
    </script>
</body>

</html>