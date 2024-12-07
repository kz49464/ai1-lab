<?php

/** @var \App\Model\MatchModel $match */
/** @var \App\Service\Router $router */

$title = 'Create MatchModel';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Match</h1>
    <form action="<?= $router->generatePath('match-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="match-create">
    </form>

    <a href="<?= $router->generatePath('match-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
