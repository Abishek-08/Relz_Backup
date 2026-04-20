import pygame
from pygame.locals import *
import random
import cv2
import mediapipe as mp
import threading

pygame.init()

# Window setup
width, height = 500, 500
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption('Car Game')

# Colors
gray = (100, 100, 100)
green = (76, 208, 56)
red = (200, 0, 0)
white = (255, 255, 255)
yellow = (255, 232, 0)

# Lane setup
road_width = 300
marker_width = 10
marker_height = 50
left_lane, center_lane, right_lane = 150, 250, 350
lanes = [left_lane, center_lane, right_lane]

road = (100, 0, road_width, height)
left_edge_marker = (95, 0, marker_width, height)
right_edge_marker = (395, 0, marker_width, height)

player_y = 400
lane_marker_move_y = 0

clock = pygame.time.Clock()
fps = 60
gameover = False
speed = 2
score = 0

# Lane tracking
current_lane_index = 1  # Start in center lane

# Gesture variables
gesture_direction = None
gesture_cooldown = 0
last_x_positions = []
max_positions = 5  # Track last 5 index finger x positions
swipe_threshold = 0.2  # Minimum distance to count as swipe

# Vehicle Classes
class Vehicle(pygame.sprite.Sprite):
    def __init__(self, image, x, y):
        super().__init__()
        scale = 45 / image.get_rect().width
        self.image = pygame.transform.scale(image, (int(image.get_width() * scale), int(image.get_height() * scale)))
        self.rect = self.image.get_rect()
        self.rect.center = [x, y]

class PlayerVehicle(Vehicle):
    def __init__(self, x, y):
        image = pygame.image.load('images/car.png')
        super().__init__(image, x, y)

player_group = pygame.sprite.Group()
vehicle_group = pygame.sprite.Group()
player = PlayerVehicle(lanes[current_lane_index], player_y)
player_group.add(player)

image_filenames = ['pickup_truck.png', 'semi_trailer.png', 'taxi.png', 'van.png']
vehicle_images = [pygame.image.load('images/' + img) for img in image_filenames]
crash = pygame.image.load('images/crash.png')
crash_rect = crash.get_rect()

# Gesture Detection Thread
def gesture_detection():
    global gesture_direction, last_x_positions

    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(min_detection_confidence=0.6, min_tracking_confidence=0.5)
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        results = hands.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                x = hand_landmarks.landmark[8].x  # Index finger tip

                # Track last few x positions
                last_x_positions.append(x)
                if len(last_x_positions) > max_positions:
                    last_x_positions.pop(0)

                if len(last_x_positions) == max_positions:
                    dx = last_x_positions[-1] - last_x_positions[0]

                    if dx > swipe_threshold:
                        gesture_direction = 'right'
                        last_x_positions.clear()
                    elif dx < -swipe_threshold:
                        gesture_direction = 'left'
                        last_x_positions.clear()
        else:
            last_x_positions.clear()

        # Comment out for better performance
        # cv2.imshow("Gesture Control", frame)
        if cv2.waitKey(1) == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

# Start gesture thread
gesture_thread = threading.Thread(target=gesture_detection)
gesture_thread.daemon = True
gesture_thread.start()

# Game Loop
running = True
while running:
    clock.tick(fps)

    for event in pygame.event.get():
        if event.type == QUIT:
            running = False

    # Handle swipe gesture
    if gesture_direction and gesture_cooldown == 0:
        if gesture_direction == 'left' and current_lane_index > 0:
            current_lane_index -= 1
            player.rect.centerx = lanes[current_lane_index]
            print("Swipe LEFT → lane", current_lane_index + 1)
            gesture_cooldown = 15

        elif gesture_direction == 'right' and current_lane_index < len(lanes) - 1:
            current_lane_index += 1
            player.rect.centerx = lanes[current_lane_index]
            print("Swipe RIGHT → lane", current_lane_index + 1)
            gesture_cooldown = 15

        gesture_direction = None

    if gesture_cooldown > 0:
        gesture_cooldown -= 1

    # Drawing background
    screen.fill(green)
    pygame.draw.rect(screen, gray, road)
    pygame.draw.rect(screen, yellow, left_edge_marker)
    pygame.draw.rect(screen, yellow, right_edge_marker)

    # Lane markers
    lane_marker_move_y += speed * 2
    if lane_marker_move_y >= marker_height * 2:
        lane_marker_move_y = 0
    for y in range(-marker_height * 2, height, marker_height * 2):
        pygame.draw.rect(screen, white, (left_lane + 45, y + lane_marker_move_y, marker_width, marker_height))
        pygame.draw.rect(screen, white, (center_lane + 45, y + lane_marker_move_y, marker_width, marker_height))

    player_group.draw(screen)

    # Add new vehicles
    if len(vehicle_group) < 2:
        if all(v.rect.top > v.rect.height * 1.5 for v in vehicle_group):
            lane = random.choice(lanes)
            image = random.choice(vehicle_images)
            vehicle_group.add(Vehicle(image, lane, height / -2))

    # Move vehicles
    for vehicle in vehicle_group:
        vehicle.rect.y += speed
        if vehicle.rect.top >= height:
            vehicle.kill()
            score += 1
            if score % 5 == 0:
                speed += 1

    vehicle_group.draw(screen)

    # Score and lane display
    font = pygame.font.Font(pygame.font.get_default_font(), 16)
    screen.blit(font.render(f'Score: {score}', True, white), (50, 400))
    screen.blit(font.render(f'Lane: {current_lane_index + 1}', True, white), (50, 420))

    # Collision check
    if pygame.sprite.spritecollide(player, vehicle_group, True):
        gameover = True
        crash_rect.center = [player.rect.centerx, player.rect.top]

    # Game over screen
    if gameover:
        screen.blit(crash, crash_rect)
        pygame.draw.rect(screen, red, (0, 50, width, 100))
        text = font.render('Game over. Play again? (Y/N)', True, white)
        screen.blit(text, (width / 2 - 100, 100))

    pygame.display.update()

    while gameover:
        clock.tick(fps)
        for event in pygame.event.get():
            if event.type == QUIT:
                gameover = False
                running = False
            if event.type == KEYDOWN:
                if event.key == K_y:
                    # Reset game state
                    gameover = False
                    speed = 2
                    score = 0
                    vehicle_group.empty()
                    current_lane_index = 1
                    player.rect.center = [lanes[current_lane_index], player_y]
                elif event.key == K_n:
                    gameover = False
                    running = False

pygame.quit()
