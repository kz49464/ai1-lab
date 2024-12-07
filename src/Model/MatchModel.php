<?php
namespace App\Model;

use App\Service\Config;

class MatchModel
{
    private ?int $id = null;
    private ?string $subject = null;
    private ?string $content = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): MatchModel
    {
        $this->id = $id;
        return $this;
    }

    public function getSubject(): ?string
    {
        return $this->subject;
    }

    public function setSubject(?string $subject): MatchModel
    {
        $this->subject = $subject;
        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): MatchModel
    {
        $this->content = $content;
        return $this;
    }

    public static function fromArray($array): MatchModel
    {
        $match = new self();
        $match->fill($array);
        return $match;
    }

    public function fill($array): MatchModel
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['subject'])) {
            $this->setSubject($array['subject']);
        }
        if (isset($array['content'])) {
            $this->setContent($array['content']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM match';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $matches = [];
        $matchesArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($matchesArray as $matchArray) {
            $matches[] = self::fromArray($matchArray);
        }
        return $matches;
    }

    public static function find($id): ?MatchModel
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM match WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $matchArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$matchArray) {
            return null;
        }
        $match = MatchModel::fromArray($matchArray);

        return $match;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $sql = "INSERT INTO match (subject, content) VALUES (:subject, :content)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'subject' => $this->getSubject(),
                'content' => $this->getContent(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE match SET subject = :subject, content = :content WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':subject' => $this->getSubject(),
                ':content' => $this->getContent(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM match WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setSubject(null);
        $this->setContent(null);
    }
}
