<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

$config = new \App\Service\Config();

$templating = new \App\Service\Templating();
$router = new \App\Service\Router();

$action = $_REQUEST['action'] ?? null;
switch ($action) {
    // Post actions
    case 'post-index':
    case null:
        $controller = new \App\Controller\PostController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'post-create':
        $controller = new \App\Controller\PostController();
        $view = $controller->createAction($_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-edit':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-show':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'post-delete':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;

    case 'match-index':
    case null:
        $controller = new \App\Controller\MatchController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'match-create':
        $controller = new \App\Controller\MatchController();
        $view = $controller->createAction($_REQUEST['match'] ?? null, $templating, $router);
        break;
    case 'match-edit':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\MatchController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['match'] ?? null, $templating, $router);
        break;
    case 'match-show':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\MatchController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'match-delete':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\MatchController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;

    // Info actions
    case 'info':
        $controller = new \App\Controller\InfoController();
        $view = $controller->infoAction();
        break;

    default:
        $view = 'Not found';
        break;
}

if ($view) {
    echo $view;
}
