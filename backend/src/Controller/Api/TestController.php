<?php

namespace App\Controller\Api;

use App\Entity\Test;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class TestController extends AbstractController
{
    #[Route('/api/tests', name: 'api_tests', methods: ['GET'])]
    public function index(EntityManagerInterface $entityManager): JsonResponse
    {
        $tests = $entityManager->getRepository(Test::class)->findAll();
        $data = array_map(static function (Test $test) {
            return [
                'id' => $test->getId(),
                'place_holder' => $test->getPlaceHolder(),
            ];
        }, $tests);

        return $this->json($data);
    }
}
