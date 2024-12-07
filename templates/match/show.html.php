<?php

/** @var \App\Model\MatchModel $match */
/** @var \App\Service\Router $router */

$title = "{$match->getSubject()} ({$match->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $match->getSubject() ?></h1>
    <article>
        <?= $match->getContent(); ?>
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('match-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('match-edit', ['id' => $match->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
