<?php

namespace App\Repository;

use App\Entity\Todo;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class TodoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Todo::class);
    }

    public function save(Todo $todo, bool $flush = false): void
    {
        $this->getEntityManager()->persist($todo);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Todo $todo, bool $flush = false): void
    {
        $this->getEntityManager()->remove($todo);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
