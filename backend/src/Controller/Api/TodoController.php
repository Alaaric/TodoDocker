<?php

namespace App\Controller\Api;

use App\Entity\Todo;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class TodoController extends AbstractController
{
    #[Route('/api/todos', name: 'api_todos_index', methods: ['GET'])]
    public function index(EntityManagerInterface $entityManager): JsonResponse
    {
        $todos = $entityManager->getRepository(Todo::class)->findAll();
        $data = array_map(static function (Todo $todo) {
            return [
                'id' => $todo->getId(),
                'title' => $todo->getTitle(),
                'completed' => $todo->isCompleted(),
                'createdAt' => $todo->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }, $todos);

        return $this->json($data);
    }

    #[Route('/api/todos/{id}', name: 'api_todos_show', methods: ['GET'])]
    public function show(Todo $todo): JsonResponse
    {
        $data = [
            'id' => $todo->getId(),
            'title' => $todo->getTitle(),
            'completed' => $todo->isCompleted(),
            'createdAt' => $todo->getCreatedAt()->format('Y-m-d H:i:s'),
        ];

        return $this->json($data);
    }

    #[Route('/api/todos', name: 'api_todos_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $todo = new Todo();
        $todo->setTitle($data['title'] ?? 'Nouvelle tâche');
        $todo->setCompleted($data['completed'] ?? false);

        $entityManager->persist($todo);
        $entityManager->flush();

        return $this->json([
            'id' => $todo->getId(),
            'title' => $todo->getTitle(),
            'completed' => $todo->isCompleted(),
            'createdAt' => $todo->getCreatedAt()->format('Y-m-d H:i:s'),
        ], 201);
    }

    #[Route('/api/todos/{id}', name: 'api_todos_update', methods: ['PUT', 'PATCH'])]
    public function update(Request $request, Todo $todo, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['title'])) {
            $todo->setTitle($data['title']);
        }

        if (isset($data['completed'])) {
            $todo->setCompleted($data['completed']);
        }

        $entityManager->flush();

        return $this->json([
            'id' => $todo->getId(),
            'title' => $todo->getTitle(),
            'completed' => $todo->isCompleted(),
            'createdAt' => $todo->getCreatedAt()->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('/api/todos/{id}', name: 'api_todos_delete', methods: ['DELETE'])]
    public function delete(Todo $todo, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($todo);
        $entityManager->flush();

        return $this->json(null, 204);
    }
}
