<?php

namespace App\DataFixtures;

use App\Entity\Todo;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class TodoFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $todos = [
            ['title' => 'Faire le front', 'completed' => true],
            ['title' => 'remplacer les placeholders du front par des appels Api des fixtures back', 'completed' => true],
            ['title' => 'CRUD complet et fonctionnel des todos', 'completed' => true],
            ['title' => "Dokerizer l'app", 'completed' => false],
            ['title' => "Faire en sorte que l'app soit entièrement fonctionnelle avec un simple docker-compose up", 'completed' => false],
            ['title' => 'TU front', 'completed' => false],
            ['title' => "Test d'intégration", 'completed' => false],
            ['title' => 'Retravailler un peu le CSS', 'completed' => true],
            ['title' => "Retravailler l'archi si j'ai le temps", 'completed' => false],
            ['title' => "S'amuser à faire des TU back si j'ai le temps", 'completed' => false],
        ];

        foreach ($todos as $todoData) {
            $todo = new Todo();
            $todo->setTitle($todoData['title']);
            $todo->setCompleted($todoData['completed']);
            $manager->persist($todo);
        }

        $manager->flush();
    }
}
