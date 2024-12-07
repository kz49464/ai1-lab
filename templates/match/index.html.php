<?php
/** @var \App\Model\MatchModel[] $matches */
/** @var \App\Service\Router $router */

$title = 'MatchModel List';
$bodyClass = 'index';

ob_start();
?>
<h1>Match List</h1>

<a href="<?= $router->generatePath('match-create') ?>">Create new</a>

<ul class="index-list">
    <?php foreach ($matches as $match): ?>
        <li>
            <h3><?= $match->getSubject() ?></h3>
            <ul class="action-list">
                <li><a href="<?= $router->generatePath('match-show', ['id' => $match->getId()]) ?>">Details</a></li>
                <li><a href="<?= $router->generatePath('match-edit', ['id' => $match->getId()]) ?>">Edit</a></li>
            </ul>
        </li>
    <?php endforeach; ?>
</ul>

<?php
$main = ob_get_clean();
include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
?>
