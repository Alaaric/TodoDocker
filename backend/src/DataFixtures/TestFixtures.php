<?php

namespace App\DataFixtures;

use App\Entity\Test;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class TestFixtures extends Fixture
{
    public function load(ObjectManager $manager):void
    {
        $test = new Test();
        $test->setPlaceHolder("PLACEHODLER CONTENT TO TEST YOUR APPLICATION (en gros si t'arrive a afficher ça c'est que ton backend et ton frontend communique bien)");
        $manager->persist($test);

        $manager->flush();
    }
}
