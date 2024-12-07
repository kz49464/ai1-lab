<?php
namespace App\Controller;

use App\Model\MatchModel;
use App\Service\Templating;
use App\Service\Router;
use App\Exception\NotFoundException;

class MatchController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $matches = MatchModel::findAll();
        $html = $templating->render('match/index.html.php', [
            'matches' => $matches,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestPost, Templating $templating, Router $router): ?string
    {
        if ($requestPost) {
            $match = MatchModel::fromArray($requestPost);
            // @todo missing validation
            $match->save();

            $path = $router->generatePath('match-index');
            $router->redirect($path);
            return null;
        } else {
            $match = new MatchModel();
        }

        $html = $templating->render('match/create.html.php', [
            'match' => $match,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $matchId, ?array $requestPost, Templating $templating, Router $router): ?string
    {
        $match = MatchModel::find($matchId);
        if (!$match) {
            throw new NotFoundException("Missing match with id $matchId");
        }

        if ($requestPost) {
            $match->fill($requestPost);
            // @todo missing validation
            $match->save();

            $path = $router->generatePath('match-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('match/edit.html.php', [
            'match' => $match,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $matchId, Templating $templating, Router $router): ?string
    {
        $match = MatchModel::find($matchId);
        if (!$match) {
            throw new NotFoundException("Missing match with id $matchId");
        }

        $html = $templating->render('match/show.html.php', [
            'match' => $match,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $matchId, Router $router): ?string
    {
        $match = MatchModel::find($matchId);
        if (!$match) {
            throw new NotFoundException("Missing match with id $matchId");
        }

        $match->delete();
        $path = $router->generatePath('match-index');
        $router->redirect($path);
        return null;
    }
}
