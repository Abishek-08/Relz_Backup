import pygame
import random
import threading
import cv2
import mediapipe as mp

# Init pygame
pygame.init()
width, height = 600, 700
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("Gesture Shooting Game")
clock = pygame.time.Clock()
fps = 60

# Load sound
shoot_sound = pygame.mixer.Sound('sounds/gun_fire.mp3')
explosion_sound = pygame.mixer.Sound('sounds/background_music.mp3')

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)

# Player class
class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface((50, 30))
        self.image.fill(GREEN)
        self.rect = self.image.get_rect()
        self.rect.centerx = width // 2
        self.rect.bottom = height - 10
        self.speedx = 0

    def update(self):
        self.rect.x += self.speedx
        if self.rect.left < 0:
            self.rect.left = 0
        if self.rect.right > width:
            self.rect.right = width

# Bullet class
class Bullet(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((5, 10))
        self.image.fill(WHITE)
        self.rect = self.image.get_rect()
        self.rect.centerx = x
        self.rect.bottom = y

    def update(self):
        self.rect.y -= 10
        if self.rect.bottom < 0:
            self.kill()

# Enemy class
class Enemy(pygame.sprite.Sprite):
    def __init__(self, speed):
        super().__init__()
        self.image = pygame.Surface((40, 30))
        self.image.fill(RED)
        self.rect = self.image.get_rect()
        self.rect.x = random.randint(0, width - 40)
        self.rect.y = random.randint(-100, -40)
        self.speed = speed

    def update(self):
        self.rect.y += self.speed
        if self.rect.top > height:
            self.kill()

# Groups
player = Player()
player_group = pygame.sprite.Group(player)
bullets = pygame.sprite.Group()
enemies = pygame.sprite.Group()
all_sprites = pygame.sprite.Group(player)

# Game state
hand_x = 0.5
shoot_gesture = False
health = 3
score = 0
level = 1
shoot_cooldown = 0
gameover = False

# Spawn enemies
def spawn_enemies(n, speed):
    for _ in range(n):
        enemy = Enemy(speed)
        enemies.add(enemy)
        all_sprites.add(enemy)

spawn_enemies(6, level + 2)

# Gesture Detection Thread
def gesture_control():
    global hand_x, shoot_gesture
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.5)
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = hands.process(rgb)
        shoot_gesture = False

        if result.multi_hand_landmarks:
            for hand_landmarks in result.multi_hand_landmarks:
                wrist = hand_landmarks.landmark[0]
                middle_base = hand_landmarks.landmark[9]
                index_tip = hand_landmarks.landmark[8]
                hand_x = index_tip.x

                # Raise palm (wrist below middle base = palm facing camera)
                if wrist.y > middle_base.y:
                    shoot_gesture = True

        cv2.imshow("Webcam", frame)
        if cv2.waitKey(1) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

# Start gesture thread
threading.Thread(target=gesture_control, daemon=True).start()

# Game loop
running = True
font = pygame.font.SysFont(None, 36)

while running:
    clock.tick(fps)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    if not gameover:
        # Update player position
        player.rect.centerx = int(hand_x * width)

        # Shoot bullets
        if shoot_gesture and shoot_cooldown == 0:
            bullet = Bullet(player.rect.centerx, player.rect.top)
            bullets.add(bullet)
            all_sprites.add(bullet)
            shoot_sound.play()
            shoot_cooldown = 10

        if shoot_cooldown > 0:
            shoot_cooldown -= 1

        # Update
        all_sprites.update()

        # Bullet collisions
        hits = pygame.sprite.groupcollide(enemies, bullets, True, True)
        for hit in hits:
            explosion_sound.play()
            score += 1
            if score % 10 == 0:
                level += 1
                spawn_enemies(6, level + 2)
            new_enemy = Enemy(level + 2)
            enemies.add(new_enemy)
            all_sprites.add(new_enemy)

        # Enemy hits player
        for enemy in enemies:
            if enemy.rect.colliderect(player.rect):
                explosion_sound.play()
                health -= 1
                enemy.kill()
                if health <= 0:
                    gameover = True

    # Draw
    screen.fill(BLACK)
    all_sprites.draw(screen)
    screen.blit(font.render(f"Score: {score}", True, WHITE), (10, 10))
    screen.blit(font.render(f"Health: {health}", True, WHITE), (10, 40))
    screen.blit(font.render(f"Level: {level}", True, WHITE), (10, 70))

    if gameover:
        over_text = font.render("GAME OVER - Press R to Restart", True, RED)
        screen.blit(over_text, (width//2 - over_text.get_width()//2, height//2))

    pygame.display.flip()

    if gameover:
        keys = pygame.key.get_pressed()
        if keys[pygame.K_r]:
            gameover = False
            health = 3
            score = 0
            level = 1
            all_sprites.empty()
            enemies.empty()
            bullets.empty()
            player = Player()
            player_group = pygame.sprite.Group(player)
            all_sprites.add(player)
            spawn_enemies(6, level + 2)

pygame.quit()
